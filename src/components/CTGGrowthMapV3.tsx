import { useEffect, useRef, useState } from "react";
import "./CTGGrowthMapV3.css";

export default function CTGGrowthMapV3() {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.24 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`ctgGrowthV3 ${active ? "is-active" : ""}`}
      aria-labelledby="ctg-growth-v3-heading"
    >
      <div className="ctgGrowthV3__inner">
        <div className="ctgGrowthV3__copy">
          <h2 id="ctg-growth-v3-heading" className="ctgGrowthV3__headline">
            <span>COMPOUNDING</span>
            <span>LOOKS LIKE</span>
            <span>FAILURE.</span>
            <span>UNTIL IT</span>
            <span className="ctgGrowthV3__brushWord">
              DOESN’T.
              <svg className="ctgGrowthV3__brush" viewBox="0 0 430 54" preserveAspectRatio="none" aria-hidden="true">
                <path d="M8 30 C70 17 143 34 207 24 C286 12 352 34 422 18" fill="none" stroke="currentColor" strokeWidth="16" strokeLinecap="round" />
                <path d="M16 37 C92 27 171 41 251 29 C316 20 366 32 411 27" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" opacity=".52" />
              </svg>
            </span>
          </h2>

          <p className="ctgGrowthV3__subhead">The result is delayed. The input isn’t.</p>

          <p className="ctgGrowthV3__body">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps—even when there’s zero evidence
            they’re working—long enough for the curve to turn.
          </p>
        </div>

        <div className="ctgGrowthV3__map">
          <svg className="ctgGrowthV3__svg" viewBox="0 0 980 600" role="img" aria-label="Compound to Greatness Growth Map">
            <desc>
              The journey moves from The Commitment through the Zero Evidence Zone,
              The Void, The Shift, the Momentum Zone, and The Emergence.
            </desc>

            <path
              className="ctgGrowthV3__curve"
              pathLength="1"
              d="M70 505 C210 505 350 503 485 495 C590 488 668 470 725 430 C780 390 818 328 846 255 C872 185 892 118 908 66"
              fill="none"
            />

            <path className="ctgGrowthV3__bracket" pathLength="1" d="M112 462 C222 462 326 460 430 454" fill="none" />
            <path className="ctgGrowthV3__bracketCap" d="M112 452 L112 472 M430 444 L430 464" fill="none" />

            <path className="ctgGrowthV3__bracket" pathLength="1" d="M758 392 C792 350 817 298 837 239 C855 185 870 134 882 95" fill="none" />
            <path className="ctgGrowthV3__bracketCap" d="M748 384 L768 400 M872 88 L892 101" fill="none" />

            <g transform="translate(70 505)">
              <circle className="ctgGrowthV3__nodeRing ctgGrowthV3__nodeRing--1" r="10" />
              <circle className="ctgGrowthV3__nodeDot ctgGrowthV3__nodeDot--1" r="3.2" />
            </g>
            <g transform="translate(485 495)">
              <circle className="ctgGrowthV3__nodeRing ctgGrowthV3__nodeRing--2" r="10" />
              <circle className="ctgGrowthV3__nodeDot ctgGrowthV3__nodeDot--2" r="3.2" />
            </g>
            <g transform="translate(725 430)">
              <circle className="ctgGrowthV3__nodeRing ctgGrowthV3__nodeRing--3" r="10" />
              <circle className="ctgGrowthV3__nodeDot ctgGrowthV3__nodeDot--3" r="3.2" />
            </g>
            <g transform="translate(908 66)">
              <circle className="ctgGrowthV3__nodeRing ctgGrowthV3__nodeRing--4" r="10" />
              <circle className="ctgGrowthV3__nodeDot ctgGrowthV3__nodeDot--4" r="3.2" />
              <circle className="ctgGrowthV3__pulse" r="10" />
            </g>

            <text className="ctgGrowthV3__pointLabel ctgGrowthV3__label--commitment" x="22" y="545">THE COMMITMENT</text>
            <text className="ctgGrowthV3__pointLabel ctgGrowthV3__label--void" x="446" y="535">THE VOID</text>
            <text className="ctgGrowthV3__pointLabel ctgGrowthV3__label--shift" x="684" y="472">THE SHIFT</text>
            <text className="ctgGrowthV3__pointLabel ctgGrowthV3__label--emergence" x="742" y="56">THE EMERGENCE</text>

            <text className="ctgGrowthV3__zoneLabel ctgGrowthV3__zoneLabel--zero" x="175" y="442">ZERO EVIDENCE ZONE</text>
            <text className="ctgGrowthV3__zoneLabel ctgGrowthV3__zoneLabel--momentum" x="803" y="312" transform="rotate(-61 803 312)">MOMENTUM ZONE</text>
          </svg>
        </div>
      </div>
    </section>
  );
}
