// npm test — the early-access function against a fake Kit (no network).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleEarlyAccess, handleConfigCheck, memoryLimiter, normalizeEmail, attribution, MESSAGES } from '../api/early-access.ts';

const ORIGIN = 'https://www.compoundtogreatness.com';
const ENV = { KIT_API_KEY: 'test-key', KIT_EARLY_ACCESS_FORM_ID: '111', KIT_EARLY_ACCESS_TAG_ID: '222' };
const T0 = 1_800_000_000_000;
const EMAIL = 'person@example.com';
const LOOKUP = 'LOOKUP'; // script key for the read-only status lookup (GET /subscribers?email_address=…&status=all)

/**
 * Fake Kit. `existing` = the address's current Kit record ({ state }) or null when it is not in Kit; `lookupBody`
 * overrides the lookup's JSON. `script[path]` = queue of statuses for that path ('throw' = network error).
 */
function fakeKit(script = {}, { existing = null, lookupBody } = {}) {
  const calls = [];
  const fetch = async (url, init) => {
    const raw = url.replace('https://api.kit.com/v4', '');
    const isLookup = init.method === 'GET' && raw.startsWith('/subscribers?');
    const path = isLookup ? LOOKUP : raw;
    calls.push({ path, url: raw, method: init.method, body: init.body ? JSON.parse(init.body) : undefined, key: init.headers['X-Kit-Api-Key'] });
    const queue = script[path];
    const status = Array.isArray(queue) && queue.length ? queue.shift() : isLookup ? 200 : 201;
    if (status === 'throw') throw new Error('network');
    if (isLookup) {
      const body = lookupBody ?? { subscribers: existing ? [{ id: 9, email_address: EMAIL, state: existing.state }] : [] };
      return new Response(JSON.stringify(body), { status });
    }
    return new Response(JSON.stringify({ subscriber: { id: 1 } }), { status });
  };
  const mutations = () => calls.filter((c) => c.method !== 'GET');
  return { fetch, calls, mutations };
}

function deps(over = {}) {
  const logs = [];
  const kit = over.kit ?? fakeKit();
  return {
    kit, logs,
    d: { env: { ...ENV, ...(over.env ?? {}) }, fetch: kit.fetch, now: () => T0, sleep: async () => {}, log: (l) => logs.push(l), limiter: over.limiter ?? memoryLimiter() },
  };
}

function req(body, { origin = ORIGIN, ip = '203.0.113.7', method = 'POST', type = 'application/json', raw } = {}) {
  const headers = { 'x-forwarded-for': ip };
  if (origin) headers.origin = origin;
  if (type) headers['content-type'] = type;
  return new Request('https://www.compoundtogreatness.com/api/early-access', { method, headers, body: method === 'POST' ? (raw ?? JSON.stringify(body)) : undefined });
}

const human = (over = {}) => ({ email: 'Person@Example.com ', startedAt: T0 - 9000, company: '', source: 'instagram', utm: { source: 'ig', medium: 'social', campaign: 'launch' }, page: 'https://www.compoundtogreatness.com/early-access?x=1', ...over });
const noLeak = (logs) => { const t = JSON.stringify(logs); assert.ok(!t.includes(EMAIL) && !t.includes('test-key'), 'no email or key in logs'); };

// ------------------------------------------------------------- status-aware decisions

test('new address: read-only lookup first, then create inactive → add to form → tag; key only in the header', async () => {
  const { d, kit, logs } = deps();
  const res = await handleEarlyAccess(req(human()), d);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });
  assert.deepEqual(kit.calls.map((c) => c.path), [LOOKUP, '/subscribers', '/forms/111/subscribers', '/tags/222/subscribers']);
  assert.equal(kit.calls[0].method, 'GET');
  assert.equal(kit.calls[0].url, '/subscribers?email_address=person%40example.com&status=all');
  assert.deepEqual(kit.calls[1].body, { email_address: EMAIL, state: 'inactive' });
  assert.equal(kit.calls[2].body.referrer, 'https://www.compoundtogreatness.com/early-access?utm_source=ig&utm_medium=social&utm_campaign=launch');
  assert.ok(kit.calls.every((c) => c.key === 'test-key'));
  assert.equal(logs.at(-1).outcome, 'ok_new');
  noLeak(logs);
});

for (const state of ['cancelled', 'complained', 'bounced', 'blocked']) {
  test(`${state} contact: no form add, no tag, no create — nothing changes, same generic success`, async () => {
    const { d, kit, logs } = deps({ kit: fakeKit({}, { existing: { state } }) });
    const res = await handleEarlyAccess(req(human()), d);
    assert.equal(res.status, 200);
    assert.deepEqual(await res.json(), { ok: true });
    assert.deepEqual(kit.mutations(), [], 'no Kit mutation at all');
    assert.deepEqual(kit.calls.map((c) => c.method), ['GET']);
    assert.deepEqual({ outcome: logs.at(-1).outcome, state: logs.at(-1).state }, { outcome: 'suppressed', state });
    noLeak(logs);
  });
}

test('confirmed (active) contact: status kept, no form add (no confirmation email), tag applied', async () => {
  const { d, kit, logs } = deps({ kit: fakeKit({}, { existing: { state: 'active' } }) });
  const res = await handleEarlyAccess(req(human()), d);
  assert.deepEqual([res.status, await res.json()], [200, { ok: true }]);
  assert.deepEqual(kit.mutations().map((c) => c.path), ['/tags/222/subscribers']);
  assert.deepEqual(kit.mutations()[0].body, { email_address: EMAIL });
  assert.equal(logs.at(-1).outcome, 'ok_existing_tagged');
});

test('unconfirmed (inactive) contact: nothing changes, so no repeat confirmation email', async () => {
  const { d, kit, logs } = deps({ kit: fakeKit({}, { existing: { state: 'inactive' } }) });
  const res = await handleEarlyAccess(req(human()), d);
  assert.deepEqual([res.status, await res.json()], [200, { ok: true }]);
  assert.deepEqual(kit.mutations(), []);
  assert.equal(logs.at(-1).outcome, 'pending_unchanged');
});

test('every accepted status gives the browser byte-identical answers (no "already on the list" leak)', async () => {
  const answers = new Set();
  for (const existing of [null, { state: 'active' }, { state: 'inactive' }, { state: 'cancelled' }, { state: 'bounced' }]) {
    const res = await handleEarlyAccess(req(human()), deps({ kit: fakeKit({}, { existing }) }).d);
    answers.add(`${res.status} ${res.headers.get('content-type')} ${await res.text()}`);
  }
  assert.equal(answers.size, 1);
});

// ------------------------------------------------------------- fail closed on the lookup

test('lookup failure (after retries) or a non-retryable error: 503 and no mutation', async () => {
  for (const script of [{ [LOOKUP]: [500, 500, 500] }, { [LOOKUP]: ['throw', 'throw', 'throw'] }, { [LOOKUP]: [401] }, { [LOOKUP]: [404] }]) {
    const { d, kit, logs } = deps({ kit: fakeKit(script) });
    const res = await handleEarlyAccess(req(human()), d);
    assert.deepEqual([res.status, await res.json()], [503, { ok: false, message: MESSAGES.unavailable }]);
    assert.deepEqual(kit.mutations(), []);
    assert.equal(logs.at(-1).outcome, 'lookup_failed');
    noLeak(logs);
  }
});

test('lookup is retried on 429/5xx/network, then the normal path runs', async () => {
  const kit = fakeKit({ [LOOKUP]: [429, 'throw', 200] });
  const { d } = deps({ kit });
  assert.equal((await handleEarlyAccess(req(human()), d)).status, 200);
  assert.equal(kit.calls.filter((c) => c.path === LOOKUP).length, 3);
  assert.equal(kit.mutations().length, 3);
});

test('ambiguous lookup answers fail closed: unknown or missing state, several matches, non-matching rows, no list', async () => {
  const cases = {
    unknown_state: { subscribers: [{ email_address: EMAIL, state: 'cold' }] },
    missing_state: { subscribers: [{ email_address: EMAIL }] },
    multiple_matches: { subscribers: [{ email_address: EMAIL, state: 'active' }, { email_address: 'Person@Example.com', state: 'cancelled' }] },
    results_without_exact_match: { subscribers: [{ email_address: 'someone.else@example.com', state: 'cancelled' }] },
    no_subscriber_list: { data: [] },
  };
  for (const [reason, lookupBody] of Object.entries(cases)) {
    const { d, kit, logs } = deps({ kit: fakeKit({}, { lookupBody }) });
    const res = await handleEarlyAccess(req(human()), d);
    assert.equal(res.status, 503, reason);
    assert.deepEqual(kit.mutations(), [], reason);
    assert.deepEqual({ outcome: logs.at(-1).outcome, reason: logs.at(-1).reason }, { outcome: 'lookup_ambiguous', reason });
    noLeak(logs);
  }
});

test('the lookup matches the address case-insensitively', async () => {
  const lookupBody = { subscribers: [{ email_address: 'PERSON@example.com', state: 'cancelled' }] };
  const { d, kit } = deps({ kit: fakeKit({}, { lookupBody }) });
  assert.equal((await handleEarlyAccess(req(human()), d)).status, 200);
  assert.deepEqual(kit.mutations(), []);
});

// ------------------------------------------------------------- request handling (unchanged)

test('custom fields are sent only when switched on', async () => {
  const { d, kit } = deps({ env: { KIT_EARLY_ACCESS_FIELDS: 'on' } });
  await handleEarlyAccess(req(human()), d);
  assert.deepEqual(kit.mutations()[0].body.fields, { early_access_source: 'instagram', early_access_utm: 'source=ig&medium=social&campaign=launch' });
});

test('honeypot and too-fast submissions look successful but never reach Kit', async () => {
  for (const body of [human({ company: 'Acme' }), human({ startedAt: T0 - 100 }), human({ startedAt: undefined })]) {
    const { d, kit, logs } = deps();
    const res = await handleEarlyAccess(req(body), d);
    assert.equal(res.status, 200);
    assert.equal(kit.calls.length, 0);
    assert.equal(logs[0].outcome, 'bot_dropped');
  }
});

test('invalid email → 400 with a field message, no Kit call', async () => {
  for (const email of ['', 'nope', 'a@b', 'x y@example.com', 42, 'a'.repeat(250) + '@example.com']) {
    const { d, kit } = deps();
    const res = await handleEarlyAccess(req(human({ email })), d);
    assert.equal(res.status, 400);
    assert.deepEqual(await res.json(), { ok: false, field: 'email', message: MESSAGES.invalidEmail });
    assert.equal(kit.calls.length, 0);
  }
});

test('cross-origin, missing origin, wrong method, wrong type, oversize and malformed bodies are refused', async () => {
  const { d, kit } = deps();
  assert.equal((await handleEarlyAccess(req(human(), { origin: 'https://evil.example' }), d)).status, 403);
  assert.equal((await handleEarlyAccess(req(human(), { origin: null }), d)).status, 403);
  assert.equal((await handleEarlyAccess(req(null, { method: 'GET' }), d)).status, 405);
  assert.equal((await handleEarlyAccess(req(human(), { type: 'text/plain' }), d)).status, 415);
  assert.equal((await handleEarlyAccess(req(null, { raw: JSON.stringify({ email: 'a@example.com', pad: 'x'.repeat(5000) }) }), d)).status, 413);
  assert.equal((await handleEarlyAccess(req(null, { raw: '{not json' }), d)).status, 400);
  assert.equal((await handleEarlyAccess(req(null, { raw: '[1,2]' }), d)).status, 400);
  assert.equal(kit.calls.length, 0);
});

test('origins: the page\'s own origin (e.g. a Vercel Preview URL) and configured extras are allowed; others are not', async () => {
  const preview = 'https://ctg-git-feature-early-access.vercel.app';
  const onPreview = (origin) => new Request(`${preview}/api/early-access`, { method: 'POST', headers: { origin, 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.1' }, body: JSON.stringify(human()) });
  assert.equal((await handleEarlyAccess(onPreview(preview), deps().d)).status, 200);
  assert.equal((await handleEarlyAccess(onPreview('https://other.vercel.app'), deps().d)).status, 403);
  const { d } = deps({ env: { EARLY_ACCESS_ALLOWED_ORIGINS: 'https://partner.example' } });
  assert.equal((await handleEarlyAccess(req(human(), { origin: 'https://partner.example' }), d)).status, 200);
  assert.equal((await handleEarlyAccess(req(human(), { origin: ORIGIN }), deps().d)).status, 200);
});

test('rate limits: 6 per IP per 10 min, 3 per address per hour', async () => {
  const limiter = memoryLimiter();
  let last;
  for (let i = 0; i < 7; i++) last = await handleEarlyAccess(req(human({ email: `p${i}@example.com` })), deps({ limiter }).d);
  assert.equal(last.status, 429);
  const limiter2 = memoryLimiter();
  for (let i = 0; i < 4; i++) last = await handleEarlyAccess(req(human(), { ip: `198.51.100.${i}` }), deps({ limiter: limiter2 }).d);
  assert.equal(last.status, 429);
  assert.deepEqual(await last.json(), { ok: false, message: MESSAGES.tooMany });
});

test('Kit 429 / 5xx / network errors on a change are retried, then succeed', async () => {
  const kit = fakeKit({ '/subscribers': [429, 'throw', 201] });
  const { d } = deps({ kit });
  assert.equal((await handleEarlyAccess(req(human()), d)).status, 200);
  assert.equal(kit.calls.filter((c) => c.path === '/subscribers').length, 3);
});

test('Kit failures become a calm 503; bad key is not retried; nothing after the failed step runs', async () => {
  const kit = fakeKit({ '/forms/111/subscribers': [401] });
  const { d, logs } = deps({ kit });
  const res = await handleEarlyAccess(req(human()), d);
  assert.equal(res.status, 503);
  assert.deepEqual(await res.json(), { ok: false, message: MESSAGES.unavailable });
  assert.deepEqual(kit.calls.map((c) => c.path), [LOOKUP, '/subscribers', '/forms/111/subscribers']);
  assert.deepEqual({ outcome: logs.at(-1).outcome, step: logs.at(-1).step, status: logs.at(-1).status }, { outcome: 'kit_failed', step: 'add_to_form', status: 401 });

  const kit2 = fakeKit({ '/subscribers': [500, 500, 500] });
  assert.equal((await handleEarlyAccess(req(human()), deps({ kit: kit2 }).d)).status, 503);
  assert.equal(kit2.mutations().length, 3);
});

test('Kit rejecting the address itself is shown as an email error', async () => {
  const { d } = deps({ kit: fakeKit({ '/subscribers': [422] }) });
  const res = await handleEarlyAccess(req(human()), d);
  assert.equal(res.status, 400);
  assert.equal((await res.json()).field, 'email');
});

test('missing configuration fails closed without calling Kit', async () => {
  for (const env of [{ KIT_API_KEY: '' }, { KIT_EARLY_ACCESS_FORM_ID: 'abc' }, { KIT_EARLY_ACCESS_TAG_ID: undefined }]) {
    const { d, kit } = deps({ env });
    assert.equal((await handleEarlyAccess(req(human()), d)).status, 503);
    assert.equal(kit.calls.length, 0);
  }
});

test('config check: Preview only, GET-only Kit calls, reports presence and ids found, never values', async () => {
  const calls = [];
  const fetch = async (url, init) => {
    calls.push({ url, method: init?.method ?? 'GET' });
    if (url.endsWith('/account')) return new Response('{"account":{"name":"x","primary_email_address":"owner@example.com"}}', { status: 200 });
    if (url.includes('/forms')) return new Response('{"forms":[{"id":111,"name":"CTG Early Access"}]}', { status: 200 });
    return new Response('{"tags":[{"id":999,"name":"Other"}]}', { status: 200 });
  };
  const check = (env) => handleConfigCheck(new Request('https://preview.vercel.app/api/early-access?check=config'), { ...deps({ env }).d, fetch });
  const res = await check({ VERCEL_ENV: 'preview' });
  const body = await res.json();
  assert.deepEqual(body, {
    environment: 'preview', KIT_API_KEY: 'set', KIT_EARLY_ACCESS_FORM_ID: 'set', KIT_EARLY_ACCESS_TAG_ID: 'set',
    kit: { key_accepted: true, account_status: 200, form: { found: true, name: 'CTG Early Access' }, tag: { found: false } },
  });
  const text = JSON.stringify(body);
  assert.ok(!text.includes('test-key') && !text.includes('owner@example.com') && !text.includes('111') && !text.includes('222'));
  assert.ok(calls.every((c) => c.method === 'GET'));
  assert.equal((await check({ VERCEL_ENV: 'production' })).status, 405);
  assert.equal((await handleConfigCheck(new Request('https://preview.vercel.app/api/early-access'), deps().d)).status, 405);
  const missing = await (await check({ VERCEL_ENV: 'preview', KIT_API_KEY: '', KIT_EARLY_ACCESS_TAG_ID: 'abc' })).json();
  assert.deepEqual([missing.KIT_API_KEY, missing.KIT_EARLY_ACCESS_TAG_ID, missing.kit], ['missing', 'invalid', undefined]);
});

test('helpers: email normalisation and attribution sanitising', () => {
  assert.equal(normalizeEmail('  Alex@Example.COM '), 'alex@example.com');
  assert.equal(normalizeEmail('<script>@x.com'), null);
  const a = attribution({ source: 'IG<script>', utm: { source: 'ig"; drop', campaign: 'x'.repeat(200) }, page: 'javascript:alert(1)' });
  assert.equal(a.source, 'igscript');
  assert.ok(!a.utm.includes('"') && !a.utm.includes(';'));
  assert.ok(a.utm.length < 200);
  assert.equal(a.page, 'https://www.compoundtogreatness.com/early-access');
  assert.equal(attribution({}).source, 'early-access-page');
});
