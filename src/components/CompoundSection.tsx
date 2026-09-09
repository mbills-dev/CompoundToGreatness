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

const CURVE_D = "M 30 560 C 180 559, 360 557, 480 552 S 620 525, 660 500 S 740 380, 770 250 S 820 100, 840 60";

const NODES = [
  { x: 30,  y: 560, delay: 200 },
  { x: 480, y: 552, delay: 800 },
  { x: 660, y: 500, delay: 1100 },
  { x: 840, y: 60,  delay: 1700 },
];

const ZERO_EVIDENCE_GUIDE_D = "M 70 535 C 200 533, 350 530, 460 527";

const MOMENTUM_GUIDE_D = "M 680 470 C 710 400, 740 300, 760 210";

const LABELS: MapLabel[] = [
  { name: "THE COMMITMENT",     x: 30,  y: 560, pos: "above", delay: 200 },
  { name: "ZERO EVIDENCE ZONE", x: 265, y: 527, pos: "above", delay: 500 },
  { name: "THE VOID",           x: 480, y: 552, pos: "above", delay: 800 },
  { name: "THE SHIFT",          x: 660, y: 500, pos: "below", delay: 1100 },
  { name: "MOMENTUM ZONE",      x: 725, y: 350, pos: "left",  delay: 1400, rotate: -38 },
  { name: "THE EMERGENCE",      x: 840, y: 60,  pos: "right", delay: 1700 },
];

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
              {/* Zero Evidence Zone — thin guide along the flat section */}
              <path
                className={`cg-guide cg-guide--zero ${visible ? "is-drawn" : ""}`}
                d={ZERO_EVIDENCE_GUIDE_D}
                fill="none"
                stroke="#CCFF00"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
              />

              {/* Momentum Zone — thin guide along the steep section */}
              <path
                className={`cg-guide cg-guide--momentum ${visible ? "is-drawn" : ""}`}
                d={MOMENTUM_GUIDE_D}
                fill="none"
                stroke="#CCFF00"
                strokeWidth="1.5"
                strokeLinecap="round"
                pathLength={1}
                vectorEffect="non-scaling-stroke"
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

              {/* Four milestone nodes only */}
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
