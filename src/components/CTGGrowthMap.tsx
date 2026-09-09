import { useEffect, useRef, useState } from "react";
import "./CTGGrowthMap.css";

export default function CTGGrowthMap() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
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
      { threshold: 0.28 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`ctgMap ${active ? "is-active" : ""}`}
      aria-labelledby="ctg-map-heading"
    >
      <div className="ctgMap__inner">
        <div className="ctgMap__copy">
          <h2 id="ctg-map-heading" className="ctgMap__headline">
            <span>COMPOUNDING</span>
            <span>LOOKS LIKE</span>
            <span>FAILURE.</span>
            <span>UNTIL IT</span>
            <span className="ctgMap__doesnt">
              DOESN’T.
              <svg
                className="ctgMap__brush"
                viewBox="0 0 420 44"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M8 25 C74 16 138 30 202 20 C274 10 334 28 412 14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeLinecap="round"
                  opacity=".96"
                />
                <path
                  d="M14 31 C94 23 172 37 244 26 C305 17 352 27 405 22"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="7"
                  strokeLinecap="round"
                  opacity=".55"
                />
              </svg>
            </span>
          </h2>

          <p className="ctgMap__subhead">The result is delayed. The input isn’t.</p>

          <p className="ctgMap__body">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps—even when there’s zero evidence
            they’re working—long enough for the curve to turn.
          </p>
        </div>

        <div className="ctgMap__visual">
          <svg
            className="ctgMap__svg"
            viewBox="0 0 900 650"
            role="img"
            aria-labelledby="ctg-map-title ctg-map-desc"
          >
            <title id="ctg-map-title">Compound to Greatness Growth Map</title>
            <desc id="ctg-map-desc">
              A curve moving from The Commitment through the Zero Evidence Zone,
              The Void, The Shift, the Momentum Zone, and The Emergence.
            </desc>

            <path
              className="ctgMap__curve"
              pathLength="1"
              d="M70 560 C210 560 330 560 445 552 C550 545 625 520 675 465 C725 410 755 335 780 245 C802 165 820 95 835 55"
              fill="none"
            />

            <path
              className="ctgMap__zoneGuide ctgMap__zoneGuide--zero"
              pathLength="1"
              d="M112 528 C210 524 300 523 390 517"
              fill="none"
            />

            <path
              className="ctgMap__zoneGuide ctgMap__zoneGuide--momentum"
              pathLength="1"
              d="M700 445 C735 394 760 330 780 258 C794 205 806 156 816 112"
              fill="none"
            />

            <g className="ctgMap__node ctgMap__node--1" transform="translate(70 560)">
              <circle r="10" />
              <circle r="3.2" className="ctgMap__nodeDot" />
            </g>
            <g className="ctgMap__node ctgMap__node--2" transform="translate(445 552)">
              <circle r="10" />
              <circle r="3.2" className="ctgMap__nodeDot" />
            </g>
            <g className="ctgMap__node ctgMap__node--3" transform="translate(675 465)">
              <circle r="10" />
              <circle r="3.2" className="ctgMap__nodeDot" />
            </g>
            <g className="ctgMap__node ctgMap__node--4" transform="translate(835 55)">
              <circle r="10" />
              <circle r="3.2" className="ctgMap__nodeDot" />
            </g>

            <text className="ctgMap__label ctgMap__label--commitment" x="32" y="595">
              THE COMMITMENT
            </text>
            <text className="ctgMap__label ctgMap__label--void" x="407" y="587">
              THE VOID
            </text>
            <text className="ctgMap__label ctgMap__label--shift" x="637" y="500">
              THE SHIFT
            </text>
            <text className="ctgMap__label ctgMap__label--emergence" x="710" y="49">
              THE EMERGENCE
            </text>

            <text className="ctgMap__zoneLabel ctgMap__zoneLabel--zero" x="180" y="515">
              ZERO EVIDENCE ZONE
            </text>

            <text
              className="ctgMap__zoneLabel ctgMap__zoneLabel--momentum"
              x="735"
              y="360"
              transform="rotate(-56 735 360)"
            >
              MOMENTUM ZONE
            </text>
          </svg>
        </div>
      </div>
    </section>
  );
}
