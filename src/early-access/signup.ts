/**
 * Browser side of the early-access signup. The server (api/early-access.ts) is the authority on validation, limits
 * and Kit; this only shapes the request and turns the answer into a UI state. Nothing here logs or reports the
 * email address.
 */

export const PAGE_LOADED_AT = Date.now();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
export const isPlausibleEmail = (v: string) => v.trim().length <= 254 && EMAIL_RE.test(v.trim());

export interface Attribution {
  source?: string;
  utm: Partial<Record<'source' | 'medium' | 'campaign' | 'content' | 'term', string>>;
}

/** `?src=` names the placement (e.g. instagram-bio); UTM parameters are passed through. */
export function attributionFrom(search: string): Attribution {
  const q = new URLSearchParams(search);
  const utm: Attribution['utm'] = {};
  for (const k of ['source', 'medium', 'campaign', 'content', 'term'] as const) {
    const v = q.get(`utm_${k}`);
    if (v) utm[k] = v.slice(0, 80);
  }
  const src = q.get('src') ?? q.get('ref') ?? undefined;
  return { source: src ? src.slice(0, 64) : utm.source, utm };
}

export type SubmitResult =
  | { kind: 'ok' }
  | { kind: 'invalid'; message: string }
  | { kind: 'error'; message: string };

export const FALLBACK_ERROR = "We couldn't save your email just now. Check your connection and try again.";

export async function submitSignup(
  input: { email: string; company: string; attribution: Attribution; page: string },
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult> {
  let res: Response;
  try {
    res = await fetchImpl('/api/early-access', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: input.email.trim(),
        company: input.company,
        startedAt: PAGE_LOADED_AT,
        source: input.attribution.source,
        utm: input.attribution.utm,
        page: input.page,
      }),
    });
  } catch {
    return { kind: 'error', message: FALLBACK_ERROR };
  }
  let body: { ok?: boolean; field?: string; message?: string } = {};
  try { body = await res.json(); } catch { /* non-JSON (e.g. an HTML error page) */ }
  if (res.ok && body.ok) return { kind: 'ok' };
  const message = typeof body.message === 'string' && body.message ? body.message : FALLBACK_ERROR;
  return body.field === 'email' ? { kind: 'invalid', message } : { kind: 'error', message };
}
