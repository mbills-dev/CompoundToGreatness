/**
 * POST /api/early-access — the early-access signup (Vercel Function, Web handler signature).
 *
 * One job: put an email address on the CTG early-access list in Kit, server-side, without ever exposing the Kit key.
 *
 *   1. Same-origin JSON only, small bodies, a honeypot field and a minimum time on page (bots get a quiet "ok").
 *   2. Best-effort per-IP and per-email limits (per function instance; pair with a Vercel Firewall rate-limit rule).
 *   3. Kit v4: first a READ-ONLY lookup of the address (all states). Nothing is changed until it answers clearly:
 *        new           create as `inactive` → add to the double opt-in "CTG Early Access" form (Kit sends the
 *                      confirmation email; verified with a real inbox 2026-11-13) → apply the "CTG - Early Access" tag
 *        active        keep their status; no form add (no confirmation email); apply the tag
 *        inactive      nothing (their confirmation is pending; no repeat email)
 *        cancelled, complained, bounced, blocked   nothing at all: an unsubscribe is respected (no form, tag or email)
 *        lookup failed, unknown state or unclear result   nothing; 503 (fail closed)
 *      Adding an unsubscribed address to a double opt-in form makes Kit send it a confirmation email (seen in the
 *      2026-11-13 Preview test), which is why the lookup comes first.
 *   4. The response never says whether or how the address is already in Kit: every accepted path returns { ok: true }.
 *
 * Nothing logs an email address or the key: log lines carry a short SHA-256 prefix of the address and an outcome code.
 *
 * Environment (Vercel project settings, never committed):
 *   KIT_API_KEY                   v4 API key (a dedicated key for the website, so it can be revoked on its own)
 *   KIT_EARLY_ACCESS_FORM_ID      numeric id of the "CTG Early Access" form (double opt-in on)
 *   KIT_EARLY_ACCESS_TAG_ID       numeric id of the "CTG - Early Access" tag
 *   KIT_EARLY_ACCESS_FIELDS       optional "on" to also write the custom fields below (they must exist in Kit first)
 *   KIT_SOURCE_FIELD_KEY          optional, default early_access_source
 *   KIT_UTM_FIELD_KEY             optional, default early_access_utm
 *   EARLY_ACCESS_ALLOWED_ORIGINS  optional extra origins; the request's own origin and the two production origins
 *                                 are always allowed (so Preview deployments work without configuration)
 */

export type Env = Record<string, string | undefined>;

export interface Deps {
  env: Env;
  fetch: typeof fetch;
  now: () => number;
  sleep: (ms: number) => Promise<void>;
  log: (line: Record<string, unknown>) => void;
  limiter: Limiter;
}

const KIT = 'https://api.kit.com/v4';
const DEFAULT_ORIGINS = ['https://www.compoundtogreatness.com', 'https://compoundtogreatness.com'];
const MAX_BODY_BYTES = 4096;
const MIN_MS_ON_PAGE = 800;
const KIT_TIMEOUT_MS = 6000;
const KIT_RETRY_DELAYS_MS = [300, 900];

export const MESSAGES = {
  invalidEmail: 'Enter a valid email address, like you@example.com.',
  tooMany: 'Too many attempts. Wait a few minutes, then try again.',
  unavailable: "We couldn't save your email just now. Try again in a minute.",
  badRequest: 'Something went wrong with that request. Refresh the page and try again.',
} as const;

// ---------------------------------------------------------------- limits (best effort, per instance)

export interface Limiter {
  hit(key: string, limit: number, windowMs: number, now: number): boolean; // true = allowed
}

export function memoryLimiter(maxKeys = 5000): Limiter {
  const hits = new Map<string, number[]>();
  return {
    hit(key, limit, windowMs, now) {
      const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      if (recent.length >= limit) { hits.set(key, recent); return false; }
      recent.push(now);
      hits.delete(key); hits.set(key, recent); // keep insertion order = recency
      if (hits.size > maxKeys) hits.delete(hits.keys().next().value as string);
      return true;
    },
  };
}

// ---------------------------------------------------------------- input

const EMAIL_RE = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[A-Za-z]{2,}$/;

export function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const email = raw.trim().toLowerCase();
  if (email.length < 6 || email.length > 254 || !EMAIL_RE.test(email)) return null;
  return email;
}

const clean = (v: unknown, max: number): string =>
  typeof v === 'string' ? v.normalize('NFKC').replace(/[^\w.:/@+ -]/g, '').trim().slice(0, max) : '';

export interface Attribution { source: string; utm: string; page: string }

export function attribution(body: Record<string, unknown>): Attribution {
  const source = clean(body.source, 64).toLowerCase() || 'early-access-page';
  const u = (body.utm && typeof body.utm === 'object' ? body.utm : {}) as Record<string, unknown>;
  const utm = ['source', 'medium', 'campaign', 'content', 'term']
    .map((k) => [k, clean(u[k], 80)] as const)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  let page = 'https://www.compoundtogreatness.com/early-access';
  if (typeof body.page === 'string') {
    try { const p = new URL(body.page); if (p.protocol === 'https:') page = `${p.origin}${p.pathname}`.slice(0, 200); } catch { /* keep default */ }
  }
  return { source, utm, page };
}

export async function emailRef(email: string): Promise<string> {
  const d = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(email));
  return Array.from(new Uint8Array(d).slice(0, 6), (b) => b.toString(16).padStart(2, '0')).join('');
}

function clientIp(req: Request): string {
  const fwd = req.headers.get('x-forwarded-for');
  return (fwd ? fwd.split(',')[0] : req.headers.get('x-real-ip') ?? 'unknown').trim();
}

// ---------------------------------------------------------------- Kit

class KitError extends Error {
  readonly step: string;
  readonly status: number;
  constructor(step: string, status: number) { super(`kit ${step} ${status}`); this.step = step; this.status = status; }
}

/** One Kit v4 call with retries on 429/5xx/network. `body === undefined` makes it a read-only GET. */
async function kit(deps: Deps, step: string, path: string, body?: unknown): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    let status = 0;
    try {
      const res = await deps.fetch(`${KIT}${path}`, {
        method: body === undefined ? 'GET' : 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-Kit-Api-Key': deps.env.KIT_API_KEY as string },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
        signal: AbortSignal.timeout(KIT_TIMEOUT_MS),
      });
      status = res.status;
      if (res.ok) return res.status === 204 ? null : await res.json().catch(() => null);
    } catch {
      status = 0; // network error or timeout
    }
    const retryable = status === 0 || status === 429 || status >= 500;
    if (!retryable || attempt >= KIT_RETRY_DELAYS_MS.length) throw new KitError(step, status);
    await deps.sleep(KIT_RETRY_DELAYS_MS[attempt]);
  }
}

/**
 * What to do for an address, decided from its CURRENT Kit status before any change is made.
 *   new          not in Kit → create inactive, add to the double opt-in form (Kit sends the one confirmation), tag
 *   tag_only     active (confirmed) → keep their status, no form add (no confirmation email), apply the tag
 *   noop         inactive (unconfirmed) → nothing: their confirmation is already pending; no repeat email
 *   suppressed   cancelled (unsubscribed), complained, bounced, blocked → nothing at all: no form, tag or email
 */
export type Decision = 'new' | 'tag_only' | 'noop' | 'suppressed';
const SUPPRESSED_STATES = new Set(['cancelled', 'complained', 'bounced', 'blocked']);

export class LookupAmbiguous extends Error {
  readonly reason: string;
  constructor(reason: string) { super(`lookup ambiguous: ${reason}`); this.reason = reason; }
}

/** Read-only lookup of the address in Kit (all states). Anything unclear throws: the caller then changes nothing. */
export async function lookupDecision(deps: Deps, email: string): Promise<{ decision: Decision; state: string | null }> {
  const body = await kit(deps, 'lookup', `/subscribers?email_address=${encodeURIComponent(email)}&status=all`);
  const list = (body as { subscribers?: unknown } | null)?.subscribers;
  if (!Array.isArray(list)) throw new LookupAmbiguous('no_subscriber_list');
  const matches = list.filter((s) => typeof (s as { email_address?: unknown })?.email_address === 'string'
    && (s as { email_address: string }).email_address.trim().toLowerCase() === email);
  if (list.length > 0 && matches.length === 0) throw new LookupAmbiguous('results_without_exact_match');
  if (matches.length > 1) throw new LookupAmbiguous('multiple_matches');
  if (matches.length === 0) return { decision: 'new', state: null };
  const state = (matches[0] as { state?: unknown }).state;
  if (typeof state !== 'string') throw new LookupAmbiguous('missing_state');
  if (state === 'active') return { decision: 'tag_only', state };
  if (state === 'inactive') return { decision: 'noop', state };
  if (SUPPRESSED_STATES.has(state)) return { decision: 'suppressed', state };
  throw new LookupAmbiguous('unknown_state');
}

// ---------------------------------------------------------------- handler

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

export async function handleEarlyAccess(req: Request, deps: Deps): Promise<Response> {
  const { env } = deps;
  if (req.method !== 'POST') return new Response(null, { status: 405, headers: { Allow: 'POST' } });

  // Same-origin only: the page's own origin (production, or whichever Preview URL served it), plus an optional list.
  const origins = (env.EARLY_ACCESS_ALLOWED_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = req.headers.get('origin');
  let self = '';
  try { self = new URL(req.url).origin; } catch { /* relative URL: no self origin */ }
  if (!origin || !(origin === self || DEFAULT_ORIGINS.includes(origin) || origins.includes(origin))) {
    deps.log({ evt: 'early_access', outcome: 'origin_rejected' });
    return json(403, { ok: false, message: MESSAGES.badRequest });
  }
  if (!(req.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json')) {
    return json(415, { ok: false, message: MESSAGES.badRequest });
  }

  const text = await req.text();
  if (new TextEncoder().encode(text).length > MAX_BODY_BYTES) return json(413, { ok: false, message: MESSAGES.badRequest });
  let body: Record<string, unknown>;
  try {
    const parsed: unknown = JSON.parse(text);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('not an object');
    body = parsed as Record<string, unknown>;
  } catch {
    return json(400, { ok: false, message: MESSAGES.badRequest });
  }

  const now = deps.now();
  // Bots: a filled honeypot or an impossible submit time get the same answer as a person, and nothing happens.
  const startedAt = typeof body.startedAt === 'number' ? body.startedAt : NaN;
  if ((typeof body.company === 'string' && body.company.trim() !== '') || !(now - startedAt >= MIN_MS_ON_PAGE)) {
    deps.log({ evt: 'early_access', outcome: 'bot_dropped' });
    return json(200, { ok: true });
  }

  const email = normalizeEmail(body.email);
  if (!email) return json(400, { ok: false, field: 'email', message: MESSAGES.invalidEmail });
  const ref = await emailRef(email);

  if (!deps.limiter.hit(`ip:${clientIp(req)}`, 6, 10 * 60_000, now) || !deps.limiter.hit(`em:${ref}`, 3, 60 * 60_000, now)) {
    deps.log({ evt: 'early_access', outcome: 'rate_limited', ref });
    return json(429, { ok: false, message: MESSAGES.tooMany });
  }

  const formId = env.KIT_EARLY_ACCESS_FORM_ID ?? '', tagId = env.KIT_EARLY_ACCESS_TAG_ID ?? '';
  if (!env.KIT_API_KEY || !/^\d+$/.test(formId) || !/^\d+$/.test(tagId)) {
    deps.log({ evt: 'early_access', outcome: 'not_configured', ref });
    return json(503, { ok: false, message: MESSAGES.unavailable });
  }

  const a = attribution(body);
  const subscriber: Record<string, unknown> = { email_address: email, state: 'inactive' };
  if (env.KIT_EARLY_ACCESS_FIELDS === 'on') {
    subscriber.fields = {
      [env.KIT_SOURCE_FIELD_KEY || 'early_access_source']: a.source,
      ...(a.utm ? { [env.KIT_UTM_FIELD_KEY || 'early_access_utm']: a.utm } : {}),
    };
  }
  const referrer = a.utm ? `${a.page}?${a.utm.split('&').map((p) => `utm_${p}`).join('&')}` : a.page;

  // 1. Read-only status lookup BEFORE any change. If it fails or is unclear: change nothing (fail closed).
  let decision: Decision;
  let state: string | null;
  try {
    ({ decision, state } = await lookupDecision(deps, email));
  } catch (e) {
    if (e instanceof LookupAmbiguous) deps.log({ evt: 'early_access', outcome: 'lookup_ambiguous', reason: e.reason, ref });
    else deps.log({ evt: 'early_access', outcome: 'lookup_failed', status: e instanceof KitError ? e.status : 0, ref });
    return json(503, { ok: false, message: MESSAGES.unavailable });
  }

  // 2. Decide by status. Every accepted path answers the browser the same way, so it never learns whether or how an
  //    address is already in Kit.
  if (decision === 'suppressed' || decision === 'noop') {
    deps.log({ evt: 'early_access', outcome: decision === 'suppressed' ? 'suppressed' : 'pending_unchanged', state, ref });
    return json(200, { ok: true });
  }

  try {
    if (decision === 'new') {
      await kit(deps, 'create_subscriber', '/subscribers', subscriber);
      await kit(deps, 'add_to_form', `/forms/${formId}/subscribers`, { email_address: email, referrer });
    }
    await kit(deps, 'tag', `/tags/${tagId}/subscribers`, { email_address: email });
  } catch (e) {
    const err = e instanceof KitError ? e : new KitError('unknown', 0);
    if (err.status === 422 && err.step === 'create_subscriber') {
      deps.log({ evt: 'early_access', outcome: 'kit_rejected_email', ref });
      return json(400, { ok: false, field: 'email', message: MESSAGES.invalidEmail });
    }
    deps.log({ evt: 'early_access', outcome: 'kit_failed', step: err.step, status: err.status, ref });
    return json(503, { ok: false, message: MESSAGES.unavailable });
  }

  deps.log({ evt: 'early_access', outcome: decision === 'new' ? 'ok_new' : 'ok_existing_tagged', source: a.source, ref });
  return json(200, { ok: true });
}

// ---------------------------------------------------------------- Preview-only configuration check

/**
 * GET /api/early-access?check=config — Preview deployments only (VERCEL_ENV !== 'production'). Read-only: says whether
 * each variable is set and asks Kit (GET requests only) whether the key works and the form and tag ids exist. It never
 * returns a value, creates nothing in Kit, and answers 405 in production.
 */
export async function handleConfigCheck(req: Request, deps: Deps): Promise<Response> {
  const { env } = deps;
  if (env.VERCEL_ENV === 'production' || new URL(req.url).searchParams.get('check') !== 'config') {
    return new Response(null, { status: 405, headers: { Allow: 'POST' } });
  }
  if (!deps.limiter.hit(`check:${clientIp(req)}`, 10, 10 * 60_000, deps.now())) return json(429, { ok: false });

  const formId = env.KIT_EARLY_ACCESS_FORM_ID ?? '', tagId = env.KIT_EARLY_ACCESS_TAG_ID ?? '';
  const out: Record<string, unknown> = {
    environment: env.VERCEL_ENV ?? 'unknown',
    KIT_API_KEY: env.KIT_API_KEY ? 'set' : 'missing',
    KIT_EARLY_ACCESS_FORM_ID: /^\d+$/.test(formId) ? 'set' : formId ? 'invalid' : 'missing',
    KIT_EARLY_ACCESS_TAG_ID: /^\d+$/.test(tagId) ? 'set' : tagId ? 'invalid' : 'missing',
  };
  if (env.KIT_API_KEY) {
    const get = async (path: string) => {
      try {
        const r = await deps.fetch(`${KIT}${path}`, { headers: { Accept: 'application/json', 'X-Kit-Api-Key': env.KIT_API_KEY as string }, signal: AbortSignal.timeout(KIT_TIMEOUT_MS) });
        return { status: r.status, body: r.ok ? ((await r.json().catch(() => null)) as Record<string, unknown> | null) : null };
      } catch { return { status: 0, body: null }; }
    };
    const find = (body: Record<string, unknown> | null, key: string, id: string) => {
      const list = (body?.[key] ?? []) as Array<{ id?: number; name?: string }>;
      const hit = list.find((x) => String(x.id) === id);
      return hit ? { found: true, name: hit.name ?? '' } : { found: false };
    };
    const account = await get('/account');
    const forms = await get('/forms?per_page=1000');
    const tags = await get('/tags?per_page=1000');
    out.kit = {
      key_accepted: account.status === 200,
      account_status: account.status,
      form: forms.status === 200 ? find(forms.body, 'forms', formId) : { status: forms.status },
      tag: tags.status === 200 ? find(tags.body, 'tags', tagId) : { status: tags.status },
    };
  }
  deps.log({ evt: 'early_access_config_check', key: out.KIT_API_KEY, form: out.KIT_EARLY_ACCESS_FORM_ID, tag: out.KIT_EARLY_ACCESS_TAG_ID });
  return json(200, out);
}

// ---------------------------------------------------------------- Vercel entry

declare const process: { env: Env };
const limiter = memoryLimiter();

const vercelDeps = (): Deps => ({
  env: process.env,
  fetch: globalThis.fetch.bind(globalThis),
  now: Date.now,
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  log: (line) => console.log(JSON.stringify(line)),
  limiter,
});

export function POST(req: Request): Promise<Response> {
  return handleEarlyAccess(req, vercelDeps());
}

export function GET(req: Request): Promise<Response> {
  return handleConfigCheck(req, vercelDeps());
}
