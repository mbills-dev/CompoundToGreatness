import { useEffect, useRef, useState } from "react";
import GlobalNav from "./components/GlobalNav";
import FooterClose from "./components/FooterClose";
import "./Support.css";

const SUPPORT_EMAIL = "info@compoundtogreatness.com";
const SUPPORT_PHONE = "314-626-4807";

export default function Support() {
  const heroRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

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

  return (
    <div className="site-shell">
      <GlobalNav />
      <main id="top">
        <section className="support-hero" ref={heroRef}>
          <div className="support-hero__inner">
            <div className={`support-hero__eyebrow ${visible ? "is-visible" : ""}`}>
              COMPOUND TO GREATNESS SUPPORT
            </div>
            <h1 className={`support-hero__headline ${visible ? "is-visible" : ""}`}>
              NEED A
              <br />
              HAND?
            </h1>
            <div className={`support-hero__annotation ${visible ? "is-visible" : ""}`}>
              We're here to help.
            </div>
            <p className={`support-hero__body ${visible ? "is-visible" : ""}`}>
              Questions about Compound to Greatness, your account, billing, feedback, or a feature?
              Get in touch and we'll help you out.
            </p>
          </div>
        </section>

        <section className="support-contact" aria-label="Contact information">
          <div className="support-contact__inner">
            <div className="support-contact__row">
              <div className="support-contact__meta">
                <span className="support-contact__num">01</span>
                <span className="support-contact__label">EMAIL</span>
              </div>
              <a
                className="support-contact__value"
                href={`mailto:${SUPPORT_EMAIL}`}
              >
                {SUPPORT_EMAIL}
              </a>
            </div>
            <div className="support-contact__divider" />

            <div className="support-contact__row">
              <div className="support-contact__meta">
                <span className="support-contact__num">02</span>
                <span className="support-contact__label">PHONE</span>
              </div>
              <a
                className="support-contact__value"
                href={`tel:${SUPPORT_PHONE.replace(/[^0-9]/g, "")}`}
              >
                {SUPPORT_PHONE}
              </a>
            </div>
            <div className="support-contact__divider" />

            <div className="support-contact__row">
              <div className="support-contact__meta">
                <span className="support-contact__num">03</span>
                <span className="support-contact__label">BUSINESS</span>
              </div>
              <div className="support-contact__value support-contact__value--static">
                Lumiere Holdings LLC
              </div>
            </div>
          </div>
        </section>

        <section className="support-cta">
          <div className="support-cta__inner">
            <p className="support-cta__response">
              We typically respond within 1–2 business days.
            </p>
            <a
              className="support-cta__button"
              href={`mailto:${SUPPORT_EMAIL}`}
            >
              EMAIL SUPPORT
            </a>
          </div>
        </section>

        <section className="support-brand-close" aria-label="Compound to Greatness">
          <div className="support-brand-close__inner">
            <div className="support-brand-close__accent" aria-hidden="true" />
            <h2 className="support-brand-close__headline">KEEP GOING.</h2>
            <div className="support-brand-close__annotation">Your next 1% starts today.</div>
          </div>
        </section>
      </main>

      <FooterClose />
    </div>
  );
}
