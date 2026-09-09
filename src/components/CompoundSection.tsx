import { useEffect, useRef, useState } from "react";
import "./CompoundSection.css";

type MilestonePos = "above" | "below";

interface Milestone {
  day: string;
  label: string;
  x: number;
  y: number;
  pos: MilestonePos;
  delay: number;
}

const MILESTONES: Milestone[] = [
  { day: "DAY 1",   label: "The Start",    x: 8.2,  y: 87.3, pos: "above", delay: 300 },
  { day: "DAY 21",  label: "Momentum",     x: 35,   y: 81.5, pos: "above", delay: 550 },
  { day: "DAY 45",  label: "Breakthrough", x: 62.3, y: 64.8, pos: "below", delay: 800 },
  { day: "DAY 77",  label: "A New You",    x: 86.8, y: 32.3, pos: "below", delay: 1050 },
];

export default function CompoundSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

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
        }
      },
      { threshold: 0.25 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="method" className="compound-section">
      <div className="compound-container">
        <div className="compound-header">
          <h2 className="compound-headline">
            SMALL ACTIONS.<br />
            MASSIVE CHANGE.
          </h2>
          <p className="compound-copy">
            You don&rsquo;t transform overnight. You compound.
            <br />
            Take consistent action and watch the results accelerate over time.
          </p>
        </div>

        <div className="compound-curve-wrap">
          <svg
            className="compound-curve"
            viewBox="0 0 1200 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              className={`compound-curve-path ${visible ? "is-drawn" : ""}`}
              d="M 40 350 C 700 340, 950 200, 1160 50"
              fill="none"
              stroke="#CCFF00"
              strokeWidth="5"
              strokeLinecap="round"
              pathLength={1}
              vectorEffect="non-scaling-stroke"
            />
          </svg>

          {MILESTONES.map((m) => (
            <div
              key={m.day}
              className={`compound-milestone compound-milestone--${m.pos} ${visible ? "is-visible" : ""}`}
              style={{
                left: `${m.x}%`,
                top: `${m.y}%`,
                ["--ms-delay" as string]: `${m.delay}ms`,
              } as React.CSSProperties}
            >
              <span className="compound-milestone-dot" />
              <div className="compound-milestone-labels">
                <span className="compound-milestone-day">{m.day}</span>
                <span className="compound-milestone-label">{m.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
