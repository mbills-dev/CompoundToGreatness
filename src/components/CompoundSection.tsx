import { useEffect, useRef, useState } from "react";
import "./CompoundSection.css";

type ZonePos = "above" | "below" | "left" | "right";

interface Zone {
  name: string;
  desc: string;
  x: number;
  y: number;
  pos: ZonePos;
  delay: number;
  rotate?: number;
}

const ZONES: Zone[] = [
  { name: "THE COMMITMENT",     desc: "The decision.",                           x: 50,   y: 410, pos: "above", delay: 200 },
  { name: "ZERO EVIDENCE ZONE", desc: "Inputs going in. Nothing visible yet.",   x: 255,  y: 408, pos: "above", delay: 500 },
  { name: "THE VOID",           desc: "Effort invested. Results silent.",        x: 470,  y: 404, pos: "above", delay: 800 },
  { name: "THE SHIFT",          desc: "Evidence begins.",                        x: 665,  y: 374, pos: "below", delay: 1100 },
  { name: "MOMENTUM ZONE",      desc: "Compounding becomes undeniable.",          x: 885,  y: 198, pos: "left",  delay: 1400, rotate: -38 },
  { name: "THE EMERGENCE",      desc: "The line goes vertical.",                 x: 1090, y: 44,  pos: "right", delay: 1700 },
];

interface Node {
  x: number;
  y: number;
  delay: number;
}

const NODES: Node[] = [
  { x: 50,   y: 410, delay: 200 },
  { x: 470,  y: 404, delay: 800 },
  { x: 665,  y: 374, delay: 1100 },
  { x: 1090, y: 44,  delay: 1700 },
];

const CURVE_D = "M 30 410 C 260 409, 470 406, 665 374 S 880 195, 1090 44";

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
            LOOKS LIKE<br />
            FAILURE.<br />
            UNTIL IT <span className="cg-headline-mark">DOESN&rsquo;T.</span>
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
            viewBox="0 0 1200 440"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
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

            {NODES.map((n, i) => (
              <g
                key={i}
                className={`cg-node ${i === NODES.length - 1 && pulse ? "is-pulse" : ""}`}
                style={{ ["--node-delay" as string]: `${n.delay}ms` } as React.CSSProperties}
              >
                <circle cx={n.x} cy={n.y} r="8" fill="#050505" stroke="#CCFF00" strokeWidth="2.5" />
                <circle cx={n.x} cy={n.y} r="2.5" fill="#CCFF00" />
              </g>
            ))}
          </svg>

          {ZONES.map((z) => (
            <div
              key={z.name}
              className={`cg-zone cg-zone--${z.pos} ${visible ? "is-visible" : ""}`}
              style={{
                left: `${(z.x / 1200) * 100}%`,
                top: `${(z.y / 440) * 100}%`,
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
