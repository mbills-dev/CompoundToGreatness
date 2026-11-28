import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { FEATURED, FeaturedVisual } from './visuals';
import { attributionFrom, isPlausibleEmail, submitSignup } from './signup';
import { track } from './analytics';

const INVALID_EMAIL = 'Enter a valid email address, like you@example.com.';

type Status = 'idle' | 'submitting' | 'success';

export default function EarlyAccess() {
  // ?confirmed=1 is where Kit sends people after they click Confirm. It is a landing experience only: Kit, not this
  // URL, is the record of who confirmed.
  const confirmedLanding = useMemo(() => new URLSearchParams(window.location.search).get('confirmed') === '1', []);
  const attribution = useMemo(() => attributionFrom(window.location.search), []);

  useEffect(() => {
    track(confirmedLanding ? 'early_access_confirmed' : 'early_access_view', { source: attribution.source });
  }, [confirmedLanding, attribution.source]);

  return (
    <div className="ea">
      {/* Atmosphere only (decorative): owner-supplied, AI-generated image (2026-11-24); provenance and notes in
          docs/early-access-kit.md. The app visual on the right stays a real capture. */}
      <div className="ea__bg" aria-hidden="true">
        <img
          src="/early-access/someday-run-1672.jpg"
          srcSet="/early-access/someday-run-1000.jpg 1000w, /early-access/someday-run-1672.jpg 1672w"
          sizes="100vw"
          width={1672}
          height={941}
          alt=""
          fetchPriority="high"
          decoding="async"
        />
      </div>
      <header className="ea__top">
        <a href="/" className="ea__brand" aria-label="Compound to Greatness home">
          <img src="/c2g-wordmark.png" alt="Compound to Greatness" width={400} height={100} />
        </a>
      </header>

      <main className="ea__main">
        <section className="ea__copy">
          {confirmedLanding ? <Confirmed /> : <Signup attribution={attribution} />}
        </section>
        <Visual visual={FEATURED} />
      </main>

      <footer className="ea__foot">
        <span>© 2026 Lumiere Holdings LLC</span>
        <nav aria-label="Legal">
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/support">Support</a>
        </nav>
      </footer>
    </div>
  );
}

function Signup({ attribution }: { attribution: ReturnType<typeof attributionFrom> }) {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(''); // honeypot: people never see or fill it
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<{ message: string; field: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => { if (status === 'success') doneRef.current?.focus(); }, [status]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === 'submitting') return;
    if (!isPlausibleEmail(email)) {
      setError({ message: INVALID_EMAIL, field: true });
      inputRef.current?.focus();
      return;
    }
    setError(null);
    setStatus('submitting');
    const result = await submitSignup({ email, company, attribution, page: `${window.location.origin}${window.location.pathname}` });
    if (result.kind === 'ok') {
      setStatus('success');
      track('early_access_signup', { source: attribution.source });
      return;
    }
    setStatus('idle');
    setError({ message: result.message, field: result.kind === 'invalid' });
    track('early_access_error', { kind: result.kind, source: attribution.source });
    if (result.kind === 'invalid') inputRef.current?.focus();
  }

  if (status === 'success') {
    return (
      <>
        <p className="ea__eyebrow">Early access · iPhone</p>
        {/* The same message for everyone: the page never knows (or says) whether an address was already on the list. */}
        <h1 className="ea__headline ea__headline--done" ref={doneRef} tabIndex={-1}>
          You're <span>one step closer.</span>
        </h1>
        <p className="ea__sub">
          If you're new here, check your inbox for a confirmation email from Compound to Greatness.
        </p>
        <p className="ea__fine">
          No email in a few minutes? Check Promotions or Spam.{' '}
          <button type="button" className="ea__textbtn" onClick={() => { setStatus('idle'); setEmail(''); setTimeout(() => inputRef.current?.focus(), 0); }}>
            Use a different email
          </button>
        </p>
      </>
    );
  }

  const busy = status === 'submitting';
  return (
    <>
      <p className="ea__eyebrow">Early access · iPhone</p>
      {/* One line per span so the break points are designed, not left to the wrap; the spaces keep it one sentence
          for screen readers and copy-paste. */}
      <h1 className="ea__headline ea__headline--hero">
        <span>Someday</span> <span>is not</span> <span className="ea__accent">a day.</span>
      </h1>
      <p className="ea__sub ea__sub--hero">Your Day One starts now.</p>

      <form className="ea__form" onSubmit={onSubmit} noValidate aria-busy={busy}>
        <div className="ea__hp" aria-hidden="true">
          <label htmlFor="ea-company">Company</label>
          <input id="ea-company" name="company" tabIndex={-1} autoComplete="off" value={company} onChange={(e) => setCompany(e.target.value)} />
        </div>
        <div className="ea__row">
          <label htmlFor="ea-email" className="ea__sr">Email address</label>
          <input
            ref={inputRef}
            id="ea-email"
            className="ea__input"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            placeholder="Your email address"
            value={email}
            onChange={(e) => { setEmail(e.target.value); if (error?.field) setError(null); }}
            aria-invalid={error?.field ? true : undefined}
            aria-describedby="ea-error ea-consent"
            disabled={busy}
            required
          />
          <button className="ea__cta" type="submit" disabled={busy}>
            {busy ? 'Saving…' : 'Notify me at launch'}
          </button>
        </div>
        <p className="ea__error" id="ea-error" role="alert">{error?.message ?? ''}</p>
        <p className="ea__consent" id="ea-consent">
          We'll email you when Compound to Greatness launches on the App Store, plus occasional updates. You'll confirm
          by email first. Unsubscribe anytime. <a href="/privacy">Privacy Policy</a>
        </p>
      </form>
    </>
  );
}

function Confirmed() {
  return (
    <>
      <p className="ea__eyebrow">Early access · iPhone</p>
      <h1 className="ea__headline">You're on the list.</h1>
      <p className="ea__sub">We'll let you know when Compound to Greatness launches.</p>
      <p className="ea__tagline">Small actions, extraordinary results.</p>
    </>
  );
}

function prefersReducedMotion(): boolean {
  try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch { return false; }
}

/** The real app recording plays once when it scrolls into view and rests on its last frame (75%). Reduce Motion, a
 *  blocked autoplay (e.g. Low Power Mode) or a load error shows the authentic still instead. */
function Visual({ visual }: { visual: FeaturedVisual }) {
  const [useStill, setUseStill] = useState(() => !visual.video || prefersReducedMotion());
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (useStill || !v) return;
    v.muted = true;
    v.defaultMuted = true;
    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => setUseStill(true));
    };
    if (!('IntersectionObserver' in window)) { play(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((en) => en.isIntersecting)) { play(); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(v);
    return () => io.disconnect();
  }, [useStill]);

  return (
    <figure className={`ea__visual ea__visual--${visual.frame}`}>
      {useStill || !visual.video ? (
        <img src={visual.still} width={visual.width} height={visual.height} alt={visual.alt} decoding="async" />
      ) : (
        <video
          ref={videoRef}
          width={visual.width}
          height={visual.height}
          poster={visual.video.poster}
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-label={visual.alt}
          onError={() => setUseStill(true)}
        >
          <source src={visual.video.src} type="video/mp4" onError={() => setUseStill(true)} />
        </video>
      )}
      <figcaption>{visual.caption}</figcaption>
    </figure>
  );
}
