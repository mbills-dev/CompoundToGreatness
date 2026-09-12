import { useEffect, useRef, useState } from "react";
import "./FooterClose.css";

export default function FooterClose() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
              setVisible(true);
              observer.disconnect();
              break;
            }
          }
        });
      },
      { threshold: [0.2] }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      className={"footer-close" + (visible ? " is-visible" : "")}
      aria-label="Compound to Greatness"
      ref={sectionRef}
    >
      <div className="footer-close__divider" aria-hidden="true" />

      <div className="footer-close__statement">
        <div className="footer-close__left">
          <div className="footer-close__eyebrow">COMPOUND TO GREATNESS</div>
          <h2 className="footer-close__headline">
            SMALL INPUTS.
            <br />
            EXPONENTIAL LIFE.
          </h2>
          <div className="footer-close__handwritten">Compound to greatness.</div>
          <div className="footer-close__accent-line" aria-hidden="true" />
        </div>

        <div className="footer-close__right">
          <div className="footer-close__secondary">
            YOUR LIFE MATTERS.
            <br />
            MAKE IT COUNT.
          </div>
          <p className="footer-close__supporting">
            Become more. Give more. Live what you were created for.
          </p>
        </div>
      </div>

      <div className="footer-close__divider" aria-hidden="true" />

      <div className="footer-close__utility">
        <div className="footer-close__brand">
          <img src="/c2g-wordmark.png" alt="Compound to Greatness" />
        </div>

        <nav className="footer-close__nav" aria-label="Footer">
          <a href="/#download">App</a>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/support">Support</a>
        </nav>

        <a
          href="#download"
          className="footer-close__app-store"
          aria-label="Download Compound to Greatness on the App Store"
        >
          <img
            src="/assets/images/Download_on_the_App_Store_Badge.svg.webp"
            alt="Download on the App Store"
          />
        </a>
      </div>

      <div className="footer-close__legal">
        <p>&copy; 2026 Lumiere Holdings LLC. All rights reserved.</p>
        <p className="footer-close__trademark">Compound to Greatness&trade;</p>
      </div>
    </section>
  );
}
