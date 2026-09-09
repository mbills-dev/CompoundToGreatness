import { useEffect, useRef, useState } from "react";
import "./CompoundSection.css";

type ZonePos = "above" | "below" | "left" | "right";

interface Zone {
  name: string;
  desc: string;
  /** position in viewBox coordinates (0-1200 x, 0-520 y) */
  x: number;
  y: number;
  pos: ZonePos;
  /** ms after curve animation start */
  delay: number;
  rotate?: number;
}

const ZONES: Zone[] = [
  { name: "THE COMMITMENT",     desc: "The decision.",                              x: 60,   y: 470, pos: "above", delay: 200 },
  { name: "ZERO EVIDENCE ZONE", desc: "Inputs going in. Nothing visible yet.",      x: 230,  y: 458, pos: "above", delay: 500 },
  { name: "THE VOID",           desc: "Effort invested. Results silent.",           x: 440,  y: 435, pos: "above", delay: 800 },
  { name: "THE SHIFT",          desc: "Evidence begins.",                           x: 650,  y: 370, pos: "below", delay: 1100 },
  { name: "MOMENTUM ZONE",      desc: "Compounding becomes undeniable.",             x: 870,  y: 235, pos: "left",  delay: 1400, rotate: -42 },
  { name: "THE EMERGENCE",      desc: "The line goes vertical.",                    x: 1080, y: 80,  pos: "left",  delay: 1700 },
];

// Curve path in the same 1200×520 viewBox used by zones
const CURVE_D = "M 40 480 C 320 475, 520 470, 680 400 S 920 210, 1100 60";

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
          // trigger endpoint pulse after curve + zone reveals complete
          const t = setTimeout(() => setPulse(true), 2100);
          return () => clearTimeout(t);
        }
      },
      { threshold: 0.2 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="method" className="cg-section">
      <div className="cg-container">
        <div className="cg-header">
          <h2 className="cg-headline">
            COMPOUNDING<br />
            LOOKS LIKE FAILURE.<br />
            <span className="cg-headline-mark">UNTIL IT DOESN&rsquo;T.</span>
          </h2>
          <p className="cg-secondary">The result is delayed. The input isn&rsquo;t.</p>
          <p className="cg-copy">
            Your goal gets reverse-engineered into the daily inputs that create it.
            Your job is to keep doing the reps&mdash;even when there&rsquo;s zero evidence
            they&rsquo;re working&mdash;long enough for the curve to turn.
          </p>
        </div>

        <div className="cg-map">
          <svg
            className={`cg-map-svg ${visible ? "is-visible" : ""}`}
            viewBox="0 0 1200 520"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            {/* guide lines (subtle horizontal references) */}
            <line className="cg-guide" x1="0" y1="480" x2="1200" y2="480" />
            <line className="cg-guide" x1="0" y1="260" x2="1200" y2="260" />
            <line className="cg-guide" x1="0" y1="80"  x2="1200" y2="80"  />

            {/* main exponential curve */}
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

            {/* zone nodes on the curve */}
            {ZONES.map((z) => (
              <circle
                key={z.name}
                className={`cg-node ${z.name === "THE EMERGENCE" && pulse ? "is-pulse" : ""}`}
                cx={z.x}
                cy={z.y}
                r="7"
                fill="#CCFF00"
                stroke="#050505"
                strokeWidth="3"
              />
            ))}
          </svg>

          {/* zone labels as real accessible text positioned over the SVG */}
          {ZONES.map((z) => (
            <div
              key={z.name}
              className={`cg-zone cg-zone--${z.pos} ${visible ? "is-visible" : ""}`}
              style={{
                left: `${(z.x / 1200) * 100}%`,
                top: `${(z.y / 520) * 100}%`,
                ["--z-delay" as string]: `${z.delay}ms`,
                ...(z.rotate ? { ["--z-rotate" as string]: `${z.rotate}deg` } : {}),
              } as React.CSSProperties}
            >
              <span className="cg-zone-name">{z.name}</span>
              <span className="cg-zone-desc">{z.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
