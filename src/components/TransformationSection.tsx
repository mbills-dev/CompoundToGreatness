import { useEffect, useRef, useState } from "react";
import "./TransformationSection.css";

const principles = [
  { number: "01", title: "CHOOSE", copy: "Define the inputs that create the life you want." },
  { number: "02", title: "PROVE", copy: "Show up for them every day — especially when you don't feel like it." },
  { number: "03", title: "BECOME", copy: "Repeat them until discipline stops being something you do and becomes who you are." },
];

const TOTAL_DAYS = 77;

export default function TransformationSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [finalPulse, setFinalPulse] = useState(false);
  const prevFilledRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setProgress(1);
      return;
    }

    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!sectionRef.current || !visualRef.current) return;
        const barEl = visualRef.current;
        const barRect = barEl.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const start = viewportH * 0.85;
        const end = viewportH * 0.2;
        const raw = (start - barRect.top) / (start - end);
        const clamped = Math.max(0, Math.min(1, raw));
        setProgress(clamped);
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const filledDays = Math.round(progress * TOTAL_DAYS);

  useEffect(() => {
    if (prevFilledRef.current < TOTAL_DAYS && filledDays >= TOTAL_DAYS) {
      setFinalPulse(true);
      const t = setTimeout(() => setFinalPulse(false), 600);
      return () => clearTimeout(t);
    }
    prevFilledRef.current = filledDays;
  }, [filledDays]);

  return (
    <section
      className="transformation-section"
      aria-labelledby="transformation-heading"
      ref={sectionRef}
    >
      <div className="transformation-section__inner">
        <div className="transformation-section__top">
          <div className="transformation-section__heading-block">
            <div className="transformation-section__kicker">THE 77-DAY TRANSFORMATION</div>
            <h2 id="transformation-heading" className="transformation-section__headline">
              START WITH
              <br />
              77 DAYS.
              <br />
              KEEP THE
              <br />
              PERSON
              <br />
              YOU BECOME.
            </h2>
            <div className="transformation-section__annotation">The challenge ends. You don&apos;t.</div>
          </div>

          <div className="transformation-section__copy-wrap">
            <p className="transformation-section__body">
              77 days isn&apos;t about being perfect. It&apos;s about proving to yourself, day after day, that
              you do what you said you would do.
            </p>
            <p className="transformation-section__body">
              Choose the inputs. Commit to them. Don&apos;t miss.
            </p>
            <p className="transformation-section__body-final">
              By Day 77, the biggest result isn&apos;t just what you&apos;ve accomplished. It&apos;s who
              you&apos;ve become.
            </p>
          </div>
        </div>

        <div className="transformation-section__visual" ref={visualRef}>
          <div className="transformation-section__visual-header">
            <div className="transformation-section__day-label">
              <span className="transformation-section__day-num">DAY 01</span>
              <span className="transformation-section__day-word">COMMIT</span>
            </div>
            <div className="transformation-section__day-label transformation-section__day-label--end">
              <span className="transformation-section__day-num">DAY 77</span>
              <span className="transformation-section__day-word">BECOME</span>
            </div>
          </div>

          <div
            className="transformation-section__timeline"
            role="img"
            aria-label="77 individual day markers progressing from Day 1 to Day 77"
          >
            <div className="transformation-section__days">
              {Array.from({ length: TOTAL_DAYS }, (_, i) => {
                const day = i + 1;
                const isFilled = day <= filledDays;
                const isLast = day === TOTAL_DAYS;
                return (
                  <span
                    key={day}
                    className={
                      "transformation-section__day" +
                      (isFilled ? " is-filled" : "") +
                      (isLast ? " is-final" : "") +
                      (isLast && finalPulse ? " is-pulsing" : "")
                    }
                  >
                    {isLast && <span className="transformation-section__day-final-num">77</span>}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="transformation-section__visual-annotation" aria-hidden="true">
            <span className="transformation-section__visual-annotation-text">77 promises to yourself.</span>
            <svg
              className="transformation-section__visual-annotation-arrow"
              viewBox="0 0 200 80"
              fill="none"
            >
              <path d="M12 62 C48 68 86 52 128 36 C150 27 168 22 186 24" />
              <path d="M172 16 L189 24 L178 36" />
            </svg>
          </div>
        </div>

        <div
          className="transformation-section__principles"
          aria-label="The three principles of transformation"
        >
          {principles.map((principle) => (
            <div className="transformation-section__principle" key={principle.number}>
              <div className="transformation-section__principle-top">
                <span className="transformation-section__principle-number">{principle.number}</span>
                <span className="transformation-section__principle-rule" />
              </div>
              <h3>{principle.title}</h3>
              <p>{principle.copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
