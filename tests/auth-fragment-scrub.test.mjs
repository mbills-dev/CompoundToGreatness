// The early URL bootstrap (src/authFragmentScrub.ts, called from src/main.tsx): auth-token fragments are dropped
// on every path, while password-reset recovery, plain section anchors and other queries keep working.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const ORIGIN = 'https://www.compoundtogreatness.com';
let fresh = 0;

// A minimal window: location reflects the current URL; history.replaceState records its args and updates the URL.
// Storage, cookies, network and console are traps, so any use of them fails the test.
function installWindow(path) {
  let url = new URL(path, ORIGIN);
  const calls = [];
  const touched = [];
  const trap = (name) => new Proxy({}, { get: (_, k) => { touched.push(`${name}.${String(k)}`); return () => {}; } });
  globalThis.window = {
    location: {
      get href() { return url.href; },
      get pathname() { return url.pathname; },
      get search() { return url.search; },
      get hash() { return url.hash; },
    },
    history: {
      state: { key: 'k1' },
      replaceState(state, unused, next) { calls.push([state, unused, next]); url = new URL(next, url); },
    },
    localStorage: trap('localStorage'),
    sessionStorage: trap('sessionStorage'),
    fetch: () => { touched.push('fetch'); },
  };
  globalThis.document = { get cookie() { touched.push('cookie'); return ''; }, set cookie(_) { touched.push('cookie='); } };
  return { calls, touched, href: () => url.href };
}

// Fresh module instances per test (recoveryToken caches in module scope).
async function modules() {
  fresh += 1;
  const scrub = await import(`../src/authFragmentScrub.ts?t=${fresh}`);
  const recovery = await import(`../src/recoveryToken.ts?t=${fresh}`);
  return { scrub, recovery };
}

// The same order as src/main.tsx: recovery consume on /reset-password, then the scrub on every path.
function bootstrap({ scrub, recovery }) {
  if (window.location.pathname === '/reset-password') recovery.consumeRecoveryParamsFromURL();
  scrub.scrubAuthFragmentFromURL();
}

const leaks = (env, ...secrets) => secrets.filter((s) => env.href().includes(s) || JSON.stringify(env.calls).includes(s));

test('(a) implicit-flow tokens on / are dropped with one replaceState, and the tokens appear nowhere', async () => {
  const env = installWindow('/#access_token=AAA111&refresh_token=RRR222&expires_in=3600&token_type=bearer&type=signup');
  bootstrap(await modules());
  assert.equal(env.href(), `${ORIGIN}/`);
  assert.equal(env.calls.length, 1);
  assert.deepEqual(env.calls[0], [{ key: 'k1' }, '', '/']);
  assert.deepEqual(leaks(env, 'AAA111', 'RRR222', 'bearer'), []);
  assert.deepEqual(env.touched, []);
});

test('(b) the path is kept: /privacy with a token fragment becomes /privacy', async () => {
  const env = installWindow('/privacy#access_token=AAA111&refresh_token=RRR222&expires_at=1&provider_token=PPP333&provider_refresh_token=QQQ444');
  bootstrap(await modules());
  assert.equal(env.href(), `${ORIGIN}/privacy`);
  assert.equal(env.calls.length, 1);
  assert.deepEqual(leaks(env, 'AAA111', 'RRR222', 'PPP333', 'QQQ444'), []);
});

test('(c) an auth error fragment is cleared', async () => {
  const env = installWindow('/#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired');
  bootstrap(await modules());
  assert.equal(env.href(), `${ORIGIN}/`);
  assert.equal(env.calls.length, 1);
});

test('(c2) each single auth key is enough; an id_token alone is cleared', async () => {
  for (const key of ['access_token', 'refresh_token', 'provider_token', 'provider_refresh_token', 'id_token', 'expires_at', 'expires_in', 'type', 'error', 'error_code', 'error_description']) {
    const env = installWindow(`/support?x=1#${key}=SECRET9`);
    bootstrap(await modules());
    assert.equal(env.href(), `${ORIGIN}/support?x=1`, key);
    assert.deepEqual(leaks(env, 'SECRET9'), [], key);
  }
});

test('(d) plain section anchors are untouched, with no replaceState call', async () => {
  for (const anchor of ['#how-it-works', '#method', '#challenge', '#accountability', '#download', '#top', '#token_type=bearer', '#']) {
    const env = installWindow(`/${anchor}`);
    bootstrap(await modules());
    assert.equal(env.calls.length, 0, anchor);
    assert.equal(env.href(), new URL(`/${anchor}`, ORIGIN).href, anchor);
  }
});

test('(e) /reset-password?token_hash recovery: params still cached, query still stripped', async () => {
  const env = installWindow('/reset-password?token_hash=THASH77&type=recovery');
  const mods = await modules();
  bootstrap(mods);
  assert.deepEqual(mods.recovery.getCachedRecoveryParams(), { tokenHash: 'THASH77', type: 'recovery' });
  assert.equal(env.href(), `${ORIGIN}/reset-password`);
  assert.equal(env.calls.length, 1, 'only the existing recovery replaceState; the scrub has nothing to do');
  assert.deepEqual(env.touched, []);
});

test('(f) /reset-password?token_hash=T&type=recovery#access_token=A ends with neither T nor A in the URL', async () => {
  const env = installWindow('/reset-password?token_hash=THASH77&type=recovery#access_token=AAA111&refresh_token=RRR222');
  const mods = await modules();
  bootstrap(mods);
  assert.deepEqual(mods.recovery.getCachedRecoveryParams(), { tokenHash: 'THASH77', type: 'recovery' });
  assert.equal(env.href(), `${ORIGIN}/reset-password`);
  assert.ok(!env.href().includes('THASH77') && !env.href().includes('AAA111') && !env.href().includes('RRR222'));
  // The final replaceState (the scrub) carries neither secret.
  assert.ok(!JSON.stringify(env.calls.at(-1)).match(/THASH77|AAA111|RRR222/));
  assert.deepEqual(env.touched, []);
});

test('(g) a query with no token keys and no fragment is unchanged', async () => {
  for (const path of ['/success?session_id=cs_x', '/privacy', '/terms', '/support', '/success?session_id=cs_x#top']) {
    const env = installWindow(path);
    bootstrap(await modules());
    assert.equal(env.calls.length, 0, path);
    assert.equal(env.href(), new URL(path, ORIGIN).href, path);
  }
});

test('(g2) a query with no token keys keeps its query when a token fragment is dropped', async () => {
  const env = installWindow('/success?session_id=cs_x#access_token=AAA111');
  bootstrap(await modules());
  assert.equal(env.href(), `${ORIGIN}/success?session_id=cs_x`);
});

test('(h) idempotent: running the scrub twice makes at most one replaceState', async () => {
  const env = installWindow('/#access_token=AAA111&type=recovery');
  const { scrub } = await modules();
  assert.equal(scrub.scrubAuthFragmentFromURL(), true);
  assert.equal(scrub.scrubAuthFragmentFromURL(), false);
  assert.equal(env.calls.length, 1);
  assert.equal(env.href(), `${ORIGIN}/`);
});

test('no window (SSR / build): the scrub is a no-op', async () => {
  delete globalThis.window;
  const { scrub } = await modules();
  assert.equal(scrub.scrubAuthFragmentFromURL(), false);
});

test('main.tsx: recovery consume, then the scrub on every path, both before createRoot', () => {
  const src = readFileSync(new URL('../src/main.tsx', import.meta.url), 'utf8');
  const recovery = src.indexOf('consumeRecoveryParamsFromURL();');
  const scrubCall = src.indexOf('\nscrubAuthFragmentFromURL();');
  const root = src.indexOf('createRoot(document');
  assert.ok(recovery > 0 && scrubCall > recovery && root > scrubCall);
});

test('the module keeps nothing: no storage, logging, network or Supabase', () => {
  const src = readFileSync(new URL('../src/authFragmentScrub.ts', import.meta.url), 'utf8').replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, '');
  for (const banned of ['localStorage', 'sessionStorage', 'cookie', 'console', 'fetch', 'supabase', 'import ', 'export let', 'let ']) {
    assert.ok(!src.includes(banned), banned);
  }
});
