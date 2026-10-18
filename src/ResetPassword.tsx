import { useEffect, useRef, useState } from "react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { authSupabase } from "./lib/authSupabaseClient";
import { getCachedRecoveryParams } from "./recoveryToken";
import GlobalNav from "./components/GlobalNav";
import FooterClose from "./components/FooterClose";
import "./ResetPassword.css";

type Phase = "verifying" | "ready" | "submitting" | "success" | "error";

const SUPPORT_EMAIL = "info@compoundtogreatness.com";

const MIN_PASSWORD_LENGTH = 8;

function passwordStrength(pw: string): { score: number; label: string } {
  let score = 0;
  if (pw.length >= MIN_PASSWORD_LENGTH) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  return { score, label: labels[score] };
}

export default function ResetPassword() {
  const [phase, setPhase] = useState<Phase>("verifying");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string>("");
  const heroRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);
  const verifiedRef = useRef(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }
    const el = heroRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { tokenHash } = getCachedRecoveryParams();

    if (!tokenHash) {
      setErrorMessage(
        "This password-reset link is missing a valid token. The link may have expired or been used already. Please request a new reset from the app."
      );
      setPhase("error");
      return;
    }

    let cancelled = false;

    // Register the auth-state listener BEFORE calling verifyOtp so the
    // PASSWORD_RECOVERY event can never be missed, even if verifyOtp resolves
    // synchronously or in a microtask.
    const { data: sub } = authSupabase.auth.onAuthStateChange(
      (event: AuthChangeEvent, _session: Session | null) => {
        if (cancelled) return;
        if (event === "PASSWORD_RECOVERY") {
          verifiedRef.current = true;
          setPhase("ready");
        } else if (event === "SIGNED_IN" && !verifiedRef.current) {
          // An ordinary sign-in — not a recovery. Refuse to show the form.
          setErrorMessage(
            "You're signed in, but this page is only for resetting a forgotten password. Please sign out and use a fresh reset link."
          );
          setPhase("error");
        }
      }
    );

    (async () => {
      const { error } = await authSupabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: "recovery",
      });

      if (cancelled) return;

      if (error) {
        setErrorMessage(
          "This password-reset link is invalid, expired, or has already been used. Please request a new reset from the app."
        );
        setPhase("error");
        return;
      }
      // verifyOtp fires onAuthStateChange with PASSWORD_RECOVERY; we gate on
      // that event rather than trusting the verifyOtp return alone, so an
      // ordinary signed-in session can never reach the password form.
    })();

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const strength = passwordStrength(password);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!verifiedRef.current) {
      setFormError("Recovery verification is not complete yet. Please wait a moment.");
      return;
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      setFormError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }
    if (password !== confirm) {
      setFormError("Passwords do not match.");
      return;
    }

    setPhase("submitting");
    const { error } = await authSupabase.auth.updateUser({ password });

    if (error) {
      setFormError(error.message || "We couldn't update your password. Please try again.");
      setPhase("ready");
      return;
    }

    // Destroy the recovery session immediately so it can't be reused or
    // confused with a normal login.
    await authSupabase.auth.signOut();
    setPhase("success");
  }

  const canShowForm = phase === "ready" || phase === "submitting";

  return (
    <div className="site-shell">
      <GlobalNav />
      <main id="top">
        <section className="reset-hero" ref={heroRef}>
          <div className="reset-hero__inner">
            <div className={`reset-hero__eyebrow ${visible ? "is-visible" : ""}`}>
              COMPOUND TO GREATNESS
            </div>
            <h1 className={`reset-hero__headline ${visible ? "is-visible" : ""}`}>
              RESET YOUR
              <br />
              PASSWORD
            </h1>
            <div className={`reset-hero__annotation ${visible ? "is-visible" : ""}`}>
              Your next 1% starts today.
            </div>
          </div>
        </section>

        <section className="reset-body" aria-live="polite">
          <div className="reset-body__inner">
            {phase === "verifying" && (
              <div className="reset-state">
                <div className="reset-spinner" aria-hidden="true" />
                <p className="reset-state__text">Verifying your reset link&hellip;</p>
              </div>
            )}

            {phase === "error" && (
              <div className="reset-state reset-state--error">
                <p className="reset-state__text">{errorMessage}</p>
                <a className="reset-state__link" href={`mailto:${SUPPORT_EMAIL}`}>
                  Contact support
                </a>
              </div>
            )}

            {canShowForm && (
              <form className="reset-form" onSubmit={handleSubmit} noValidate>
                <label className="reset-form__field" htmlFor="new-password">
                  <span className="reset-form__label">New password</span>
                  <div className="reset-form__inputWrap">
                    <input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="reset-form__input"
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                    />
                    <button
                      type="button"
                      className="reset-form__toggle"
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? "HIDE" : "SHOW"}
                    </button>
                  </div>
                  {password.length > 0 && (
                    <div className="reset-form__strength" aria-hidden="true">
                      <div className="reset-form__strengthBar">
                        <div
                          className="reset-form__strengthFill"
                          style={{ width: `${(strength.score / 5) * 100}%` }}
                        />
                      </div>
                      <span className="reset-form__strengthLabel">{strength.label}</span>
                    </div>
                  )}
                </label>

                <label className="reset-form__field" htmlFor="confirm-password">
                  <span className="reset-form__label">Confirm password</span>
                  <div className="reset-form__inputWrap">
                    <input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="reset-form__input"
                      minLength={MIN_PASSWORD_LENGTH}
                      required
                    />
                  </div>
                  {confirm.length > 0 && password !== confirm && (
                    <span className="reset-form__hint">Passwords do not match.</span>
                  )}
                </label>

                {formError && <p className="reset-form__error">{formError}</p>}

                <button
                  type="submit"
                  className="reset-form__submit"
                  disabled={phase === "submitting"}
                >
                  {phase === "submitting" ? "SAVING&hellip;" : "SAVE NEW PASSWORD"}
                </button>
              </form>
            )}

            {phase === "success" && (
              <div className="reset-state reset-state--success">
                <div className="reset-state__check" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="reset-state__title">Password updated.</h2>
                <p className="reset-state__text">
                  Your password has been changed. Open the Compound to Greatness app and sign in with your new password.
                </p>
                <a className="reset-state__link" href="/">
                  Back to home
                </a>
              </div>
            )}
          </div>
        </section>

        <section className="reset-brand-close" aria-label="Compound to Greatness">
          <div className="reset-brand-close__inner">
            <div className="reset-brand-close__accent" aria-hidden="true" />
            <h2 className="reset-brand-close__headline">KEEP GOING.</h2>
            <div className="reset-brand-close__annotation">Your next 1% starts today.</div>
          </div>
        </section>
      </main>

      <FooterClose />
    </div>
  );
}
