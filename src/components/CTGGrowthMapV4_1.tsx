import { useEffect, useRef, useState } from "react";
import "./CTGGrowthMapV4_1.css";

export default function CTGGrowthMapV4_1() {
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
      className={`ctgGrowthV41 ${active ? "is-active" : ""}`}
      aria-labelledby="ctg-growth-v41-heading"
    >
      <div className="ctgGrowthV41__inner">
        <div className="ctgGrowthV41__copy">
          <h2 id="ctg-growth-v41-heading" className="ctgGrowthV41__headline">
            <span>COMPOUNDING</span>
            <span>LOOKS LIKE</span>
            <span>FAILURE.</span>
            <span>UNTIL IT</span>
            <span className="ctgGrowthV41__brushWord">
              DOESN’T.
              <svg
                className="ctgGrowthV41__brush"
                viewBox="0 0 430 54"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M8 30 C70 17 143 34 207 24 C286 12 352 34 422 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                <path
                  d="M16 37 C92 27 171 41 251 29 C316 20 366 32 411 27"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  strokeLinecap="round"
                  opacity=".52"
                />
              </svg>
            </span>
          </h2>

          <p className="ctgGrowthV41__subhead">The result is delayed. The input isn’t.</p>

          <p className="ctgGrowthV41__body">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps—even when there’s zero evidence
            they’re working—long enough for the curve to turn.
          </p>
        </div>

        <div className="ctgGrowthV41__map">
          <svg
            className="ctgGrowthV41__svg"
            viewBox="0 0 980 600"
            role="img"
            aria-label="Compound to Greatness Growth Map"
          >
            <desc>
              The journey moves from The Commitment through the Zero Evidence Zone,
              The Void, The Shift, the Momentum Zone, and The Emergence.
            </desc>

            {/* Primary curve — unchanged from V4 */}
            <path
              className="ctgGrowthV41__curve"
              pathLength="1"
              d="M70 505
                 C210 505 350 503 485 495
                 C590 488 668 470 725 430
                 C780 390 818 328 846 255
                 C872 185 892 118 908 66"
              fill="none"
            />

            {/* Zero Evidence Zone bracket — unchanged, this is the spacing reference */}
            <path
              id="ctg-zero-zone-path"
              className="ctgGrowthV41__zoneBracket"
              pathLength="1"
              d="M112 463 C220 463 325 461 430 455"
              fill="none"
            />
            <path
              className="ctgGrowthV41__zoneCap"
              d="M112 453 L112 473 M430 445 L430 465"
              fill="none"
            />

            {/* Momentum Zone bracket — corrected to maintain a much more consistent
                offset from the primary curve between Shift and Emergence */}
            <path
              id="ctg-momentum-zone-path"
              className="ctgGrowthV41__zoneBracket"
              pathLength="1"
              d="M696 401
                 C748 367 785 313 815 244
                 C842 181 861 124 875 78"
              fill="none"
            />
            <path
              className="ctgGrowthV41__zoneCap"
              d="M688 393 L704 409 M866 73 L884 83"
              fill="none"
            />

            {/* exactly four milestone nodes */}
            <g transform="translate(70 505)">
              <circle className="ctgGrowthV41__nodeRing ctgGrowthV41__nodeRing--1" r="10" />
              <circle className="ctgGrowthV41__nodeDot ctgGrowthV41__nodeDot--1" r="3.2" />
            </g>

            <g transform="translate(485 495)">
              <circle className="ctgGrowthV41__nodeRing ctgGrowthV41__nodeRing--2" r="10" />
              <circle className="ctgGrowthV41__nodeDot ctgGrowthV41__nodeDot--2" r="3.2" />
            </g>

            <g transform="translate(725 430)">
              <circle className="ctgGrowthV41__nodeRing ctgGrowthV41__nodeRing--3" r="10" />
              <circle className="ctgGrowthV41__nodeDot ctgGrowthV41__nodeDot--3" r="3.2" />
            </g>

            <g transform="translate(908 66)">
              <circle className="ctgGrowthV41__nodeRing ctgGrowthV41__nodeRing--4" r="10" />
              <circle className="ctgGrowthV41__nodeDot ctgGrowthV41__nodeDot--4" r="3.2" />
              <circle className="ctgGrowthV41__pulse" r="10" />
            </g>

            {/* point labels */}
            <text className="ctgGrowthV41__pointLabel ctgGrowthV41__label--commitment" x="22" y="545">
              THE COMMITMENT
            </text>
            <text className="ctgGrowthV41__pointLabel ctgGrowthV41__label--void" x="446" y="535">
              THE VOID
            </text>
            <text className="ctgGrowthV41__pointLabel ctgGrowthV41__label--shift" x="684" y="472">
              THE SHIFT
            </text>
            <text className="ctgGrowthV41__pointLabel ctgGrowthV41__label--emergence" x="742" y="56">
              THE EMERGENCE
            </text>

            {/* range labels ride directly on bracket paths */}
            <text className="ctgGrowthV41__zoneLabel ctgGrowthV41__zoneLabel--zero" dy="-10">
              <textPath href="#ctg-zero-zone-path" startOffset="50%" textAnchor="middle">
                ZERO EVIDENCE ZONE
              </textPath>
            </text>

            <text className="ctgGrowthV41__zoneLabel ctgGrowthV41__zoneLabel--momentum" dy="-10">
              <textPath href="#ctg-momentum-zone-path" startOffset="51%" textAnchor="middle">
                MOMENTUM ZONE
              </textPath>
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
