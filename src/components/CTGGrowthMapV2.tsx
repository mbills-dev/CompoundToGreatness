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
                viewBox="0 0 420 50"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M8 28 C78 18 130 32 205 23 C276 14 336 30 412 17"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="15"
                  strokeLinecap="round"
                />
                <path
                  d="M18 34 C90 28 160 37 236 30 C302 23 353 31 401 27"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity=".5"
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
            aria-labelledby="ctg-growth-title ctg-growth-desc"
          >
            <title id="ctg-growth-title">Compound to Greatness Growth Map</title>
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
                 C785 390 824 326 850 252
                 C875 182 895 112 910 58"
              fill="none"
            />

            <path
              className="ctgGrowth__zoneGuide ctgGrowth__zoneGuide--zero"
              pathLength="1"
              d="M118 462 C215 458 318 458 430 450"
              fill="none"
            />

            <path
              className="ctgGrowth__zoneGuide ctgGrowth__zoneGuide--momentum"
              pathLength="1"
              d="M758 396 C801 346 830 287 852 223 C868 177 882 132 894 90"
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
            <g transform="translate(910 58)">
              <circle className="ctgGrowth__nodeRing ctgGrowth__nodeRing--4" r="10" />
              <circle className="ctgGrowth__nodeDot ctgGrowth__nodeDot--4" r="3.2" />
              <circle className="ctgGrowth__pulse" r="10" />
            </g>

            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--commitment" x="25" y="535">
              THE COMMITMENT
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--void" x="447" y="525">
              THE VOID
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--shift" x="690" y="467">
              THE SHIFT
            </text>
            <text className="ctgGrowth__pointLabel ctgGrowth__pointLabel--emergence" x="760" y="51">
              THE EMERGENCE
            </text>

            <text className="ctgGrowth__zoneLabel ctgGrowth__zoneLabel--zero" x="185" y="446">
              ZERO EVIDENCE ZONE
            </text>
            <text
              className="ctgGrowth__zoneLabel ctgGrowth__zoneLabel--momentum"
              x="810"
              y="310"
              transform="rotate(-58 810 310)"
            >
              MOMENTUM ZONE
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
