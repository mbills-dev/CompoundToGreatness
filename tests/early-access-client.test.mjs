// The browser side of the signup (src/early-access/signup.ts): request shape, attribution, and how answers map to UI.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attributionFrom, isPlausibleEmail, submitSignup, FALLBACK_ERROR, PAGE_LOADED_AT } from '../src/early-access/signup.ts';

const reply = (status, body) => async () => new Response(typeof body === 'string' ? body : JSON.stringify(body), { status });

test('attribution: ?src names the placement, UTMs pass through, utm_source is the fallback source', () => {
  assert.deepEqual(attributionFrom('?src=instagram-bio&utm_source=ig&utm_campaign=launch'), { source: 'instagram-bio', utm: { source: 'ig', campaign: 'launch' } });
  assert.deepEqual(attributionFrom('?utm_source=newsletter'), { source: 'newsletter', utm: { source: 'newsletter' } });
  assert.deepEqual(attributionFrom(''), { source: undefined, utm: {} });
  assert.equal(attributionFrom('?src=' + 'x'.repeat(200)).source.length, 64);
});

test('client email check is a light pre-check', () => {
  assert.ok(isPlausibleEmail(' a@b.co '));
  for (const v of ['', 'a', 'a@b', 'a b@c.com', 'a@b.c']) assert.ok(!isPlausibleEmail(v), v);
});

test('request: same-origin POST with the honeypot, the page-load time and attribution — and nothing else', async () => {
  let seen;
  const fetchImpl = async (url, init) => { seen = { url, init }; return new Response('{"ok":true}', { status: 200 }); };
  const r = await submitSignup({ email: ' a@example.com ', company: '', attribution: { source: 'ig', utm: { medium: 'social' } }, page: 'https://www.compoundtogreatness.com/early-access' }, fetchImpl);
  assert.deepEqual(r, { kind: 'ok' });
  assert.equal(seen.url, '/api/early-access');
  assert.equal(seen.init.method, 'POST');
  assert.deepEqual(JSON.parse(seen.init.body), { email: 'a@example.com', company: '', startedAt: PAGE_LOADED_AT, source: 'ig', utm: { medium: 'social' }, page: 'https://www.compoundtogreatness.com/early-access' });
});

test('answers map to UI states', async () => {
  const input = { email: 'a@example.com', company: '', attribution: { utm: {} }, page: 'x' };
  assert.deepEqual(await submitSignup(input, reply(400, { ok: false, field: 'email', message: 'Bad email' })), { kind: 'invalid', message: 'Bad email' });
  assert.deepEqual(await submitSignup(input, reply(429, { ok: false, message: 'Too many' })), { kind: 'error', message: 'Too many' });
  assert.deepEqual(await submitSignup(input, reply(503, '<html>gateway</html>')), { kind: 'error', message: FALLBACK_ERROR });
  assert.deepEqual(await submitSignup(input, async () => { throw new TypeError('offline'); }), { kind: 'error', message: FALLBACK_ERROR });
  assert.deepEqual(await submitSignup(input, reply(200, { ok: false })), { kind: 'error', message: FALLBACK_ERROR });
});
