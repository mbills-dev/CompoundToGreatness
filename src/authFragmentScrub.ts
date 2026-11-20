/**
 * Early bootstrap: remove auth tokens from the URL fragment.
 *
 * Supabase Auth can redirect here with an implicit-flow result in the
 * fragment (for example a web Google sign-in started on the app falls back to
 * this Site URL): #access_token=…&refresh_token=…&provider_token=… or
 * #error=…&error_description=…. This site never uses that session
 * (detectSessionInUrl and persistSession are off), so the fragment is only
 * exposure: address bar, history, screenshots, copied links.
 *
 * Runs synchronously before React renders, on every path. If the fragment
 * holds any auth key, the whole fragment is dropped with one replaceState
 * (path and query kept). Plain section anchors (#faq, #how-it-works) are left
 * alone. Nothing from the fragment is kept, logged, stored or sent, and no
 * Supabase call is made.
 */

// `token_type` alone is not a trigger; it only travels with a token key.
const AUTH_FRAGMENT_KEYS = [
  "access_token",
  "refresh_token",
  "provider_token",
  "provider_refresh_token",
  "id_token",
  "expires_at",
  "expires_in",
  "type",
  "error",
  "error_code",
  "error_description",
];

export function scrubAuthFragmentFromURL(): boolean {
  if (typeof window === "undefined") return false;

  const { hash, pathname, search } = window.location;
  if (!hash || hash.length < 2) return false;

  const keys = new URLSearchParams(hash.slice(1));
  if (!AUTH_FRAGMENT_KEYS.some((key) => keys.has(key))) return false;

  window.history.replaceState(window.history.state, "", pathname + search);
  return true;
}
