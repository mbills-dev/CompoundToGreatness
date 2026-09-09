import { useEffect, useRef, useState } from "react";
import "./CompoundSection.css";

type LabelPos = "above" | "below" | "left" | "right";

interface MapLabel {
  name: string;
  x: number;
  y: number;
  pos: LabelPos;
  delay: number;
  rotate?: number;
}

const CURVE_D = "M 20 560 C 200 559, 380 557, 520 548 S 700 500, 760 430 S 820 240, 840 60";

const NODES = [
  { x: 20,  y: 560, delay: 200 },
  { x: 480, y: 553, delay: 800 },
  { x: 660, y: 515, delay: 1100 },
  { x: 840, y: 60,  delay: 1700 },
];

const LABELS: MapLabel[] = [
  { name: "THE COMMITMENT",     x: 20,  y: 560, pos: "above", delay: 200 },
  { name: "ZERO EVIDENCE ZONE", x: 250, y: 548, pos: "above", delay: 500 },
  { name: "THE VOID",           x: 480, y: 553, pos: "above", delay: 800 },
  { name: "THE SHIFT",          x: 660, y: 515, pos: "below", delay: 1100 },
  { name: "MOMENTUM ZONE",      x: 770, y: 360, pos: "left",  delay: 1400, rotate: -32 },
  { name: "THE EMERGENCE",      x: 840, y: 60,  pos: "right", delay: 1700 },
];

const ZONE_BRACKET = { x1: 60, x2: 460, y: 525 };

export default function CompoundSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible(true);
          observer.disconnect();
          const t = setTimeout(() => setPulse(true), 2100);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="method" className="cg-section">
      <div className="cg-container">
        <div className="cg-left">
          <h2 className="cg-headline">
            COMPOUNDING<br />
            LOOKS LIKE<br />
            FAILURE.<br />
            UNTIL IT<br />
            <span className="cg-headline-mark">DOESN&rsquo;T.</span>
          </h2>
          <p className="cg-secondary">The result is delayed. The input isn&rsquo;t.</p>
          <p className="cg-copy">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps&mdash;even when there&rsquo;s zero evidence
            they&rsquo;re working&mdash;long enough for the curve to turn.
          </p>
        </div>

        <div className="cg-right">
          <div className="cg-map">
            <svg
              className={`cg-map-svg ${visible ? "is-visible" : ""}`}
              viewBox="0 0 900 650"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              {/* Zero Evidence Zone bracket */}
              <path
                className={`cg-bracket ${visible ? "is-drawn" : ""}`}
                d={`M ${ZONE_BRACKET.x1} ${ZONE_BRACKET.y} L ${ZONE_BRACKET.x2} ${ZONE_BRACKET.y}`}
                fill="none"
                stroke="#CCFF00"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.35"
              />

              {/* Main exponential curve */}
              <path
                className={`cg-curve ${visible ? "is-drawn" : ""}`}
                d={CURVE_D}
                fill="none"
                stroke="#CCFF00"
                strokeWidth="5"
                strokeLinecap="round"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
              />

              {/* Milestone nodes */}
              {NODES.map((n, i) => (
                <g
                  key={i}
                  className={`cg-node ${i === NODES.length - 1 && pulse ? "is-pulse" : ""}`}
                  style={{ ["--node-delay" as string]: `${n.delay}ms` } as React.CSSProperties}
                >
                  <circle cx={n.x} cy={n.y} r="9" fill="#050505" stroke="#CCFF00" strokeWidth="2.5" />
                  <circle cx={n.x} cy={n.y} r="2.5" fill="#CCFF00" />
                </g>
              ))}
            </svg>

            {/* Map labels as accessible text */}
            {LABELS.map((l) => (
              <div
                key={l.name}
                className={`cg-label cg-label--${l.pos} ${visible ? "is-visible" : ""}`}
                style={{
                  left: `${(l.x / 900) * 100}%`,
                  top: `${(l.y / 650) * 100}%`,
                  ["--l-delay" as string]: `${l.delay}ms`,
                  ...(l.rotate ? { ["--l-rotate" as string]: `${l.rotate}deg` } : {}),
                } as React.CSSProperties}
              >
                {l.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
