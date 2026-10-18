/**
 * Early bootstrap for the password-recovery route.
 *
 * Runs synchronously before React renders, so the recovery token is pulled
 * out of the URL and the query string is cleared from the address bar before
 * any analytics, tracking, or third-party script can read window.location.
 *
 * The token is held in module scope only — never logged, never persisted,
 * never written to storage. It is consumed once by verifyOtp on the reset
 * page, then discarded.
 */

export interface RecoveryParams {
  tokenHash: string | null;
  type: string | null;
}

let cached: RecoveryParams | null = null;

export function consumeRecoveryParamsFromURL(): RecoveryParams {
  if (cached) return cached;

  if (typeof window === "undefined") {
    cached = { tokenHash: null, type: null };
    return cached;
  }

  const params = new URLSearchParams(window.location.search);
  const tokenHash = params.get("token_hash");
  const type = params.get("type");

  // Strip the entire query string from the address bar immediately, before
  // React or any third-party script runs. replaceState keeps the path/origin
  // without leaving a history entry that re-exposes the token.
  if (window.location.search) {
    window.history.replaceState(
      window.history.state,
      "",
      window.location.pathname + window.location.hash
    );
  }

  cached = { tokenHash, type };
  return cached;
}

export function getCachedRecoveryParams(): RecoveryParams {
  if (cached) return cached;
  return consumeRecoveryParamsFromURL();
}
