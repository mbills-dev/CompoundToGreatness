import { useEffect, useRef, useState } from "react";
import "./CTGGrowthMapV2.css";

export default function CTGGrowthMapV2() {
  const ref = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className={`ctgGrowth ${active ? "is-active" : ""}`}
      aria-labelledby="ctg-growth-heading"
    >
      <div className="ctgGrowth__inner">
        <div className="ctgGrowth__copy">
          <h2 id="ctg-growth-heading" className="ctgGrowth__headline">
            <span>COMPOUNDING</span>
            <span>LOOKS LIKE</span>
            <span>FAILURE.</span>
            <span>UNTIL IT</span>
            <span className="ctgGrowth__brushWord">
              DOESN’T.
              <svg
                className="ctgGrowth__brush"
                viewBox="0 0 460 52"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M4 31 C50 24 100 35 160 26 C225 17 290 32 350 21 C400 14 440 26 456 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="13"
                  strokeLinecap="round"
                />
                <path
                  d="M6 35 C55 30 110 38 170 31 C235 25 300 35 360 28 C410 23 445 30 454 26"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity=".45"
                />
                <path
                  d="M10 26 C60 20 120 30 180 22 C245 14 310 28 370 19 C415 13 445 22 452 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity=".6"
                />
              </svg>
            </span>
          </h2>

          <p className="ctgGrowth__subhead">The result is delayed. The input isn’t.</p>

          <p className="ctgGrowth__body">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps—even when there’s zero evidence
            they’re working—long enough for the curve to turn.
          </p>
        </div>

        <div className="ctgGrowth__map">
          <svg
            className="ctgGrowth__svg"
            viewBox="0 0 980 600"
            role="img"
            aria-label="Compound to Greatness Growth Map"
          >
            <desc id="ctg-growth-desc">
              The journey moves from The Commitment through the Zero Evidence Zone,
              The Void, The Shift, the Momentum Zone, and The Emergence.
            </desc>

            <path
              className="ctgGrowth__curve"
              pathLength="1"
              d="M65 500
                 C210 500 350 498 485 490
                 C590 484 670 468 726 430
                 C780 396 820 340 850 275
                 C880 205 902 130 910 95"
              fill="none"
            />

            <path
              className="ctgGrowth__zoneBracket ctgGrowth__zoneBracket--zero"
              d="M55 471 L55 478 L475 478 L475 471"
              fill="none"
            />

            <path
              className="ctgGrowth__zoneBracket ctgGrowth__zoneBracket--momentum"
              d="M742 452 L749 452 L924 87 L917 87"
              fill="none"
            />

            {/* exactly four milestone nodes; no transform animation on these groups */}
            <g transform="translate(65 500)">
              <circle className="ctgGrowth__nodeRing ctgGrowth__nodeRing--1" r="10" />
              <circle className="ctgGrowth__nodeDot ctgGrowth__nodeDot--1" r="3.2" />
            </g>
            <g transform="translate(485 490)">
              <circle className="ctgGrowth__nodeRing ctgGrowth__nodeRing--2" r="10" />
              <circle className="ctgGrowth__nodeDot ctgGrowth__nodeDot--2" r="3.2" />
            </g>
            <g transform="translate(726 430)">
              <circle className="ctgGrowth__nodeRing ctgGrowth__nodeRing--3" r="10" />
              <circle className="ctgGrowth__nodeDot ctgGrowth__nodeDot--3" r="3.2" />
            </g>
            <g transform="translate(910 95)">
              <circle className="ctgGrowth__nodeRing ctgGrowth__nodeRing--4" r="10" />
              <circle className="ctgGrowth__nodeDot ctgGrowth__nodeDot--4" r="3.2" />
              <circle className="ctgGrowth__pulse" r="10" />
            </g>

            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--commitment" x="22" y="542">
              THE COMMITMENT
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--void" x="440" y="532">
              THE VOID
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--shift" x="675" y="478">
              THE SHIFT
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--emergence" x="752" y="85">
              THE EMERGENCE
            </text>

            <text className="ctgGrowth__zoneLabel ctgGrowth__zoneLabel--zero" x="180" y="466">
              ZERO EVIDENCE ZONE
            </text>
            <text
              className="ctgGrowth__zoneLabel ctgGrowth__zoneLabel--momentum"
              x="843"
              y="275"
              transform="rotate(-48 843 275)"
            >
              MOMENTUM ZONE
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
