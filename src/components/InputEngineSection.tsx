import { useEffect, useRef, useState } from "react";
import "./InputEngineSection.css";

const INPUT_EXAMPLES = ["MAKE 3 OFFERS", "CREATE 1 VIDEO", "READ 10 PAGES", "45 MIN WORKOUT"];

export default function InputEngineSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
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
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="method"
      className={`ctg-input-engine ${active ? "is-active" : ""}`}
      aria-labelledby="ctg-input-engine-heading"
    >
      <div className="ctg-input-engine__inner">
        {/* === INTRO === */}
        <div className="ctg-input-engine__intro">
          <h2 id="ctg-input-engine-heading" className="ctg-input-engine__headline">
            <span className="ctg-input-engine__headline-line">STOP CHASING</span>
            <span className="ctg-input-engine__headline-line">THE GOAL.</span>
            <span className="ctg-input-engine__headline-line ctg-input-engine__headline-lime">BUILD THE INPUTS.</span>
          </h2>

          <p className="ctg-input-engine__handwritten">The outcome follows the inputs.</p>

          <p className="ctg-input-engine__support">
            Most people start with the outcome. Compound to Greatness starts there — then works
            backward to identify the actions you can actually control today.
          </p>
        </div>

        {/* === REVERSE-ENGINEERING VISUAL === */}
        <div className="ctg-input-engine__process" aria-label="Reverse engineering process">
          {/* Desktop: horizontal path */}
          <svg
            className="ctg-input-engine__path"
            viewBox="0 0 1400 4"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <line
              className="ctg-input-engine__pathLine"
              x1="0"
              y1="2"
              x2="1400"
              y2="2"
              pathLength="1"
            />
          </svg>

          {/* Stage 01 */}
          <div className="ctg-input-engine__stage ctg-input-engine__stage--1">
            <div className="ctg-input-engine__stageNum">01</div>
            <div className="ctg-input-engine__stageLabel">YOUR GOAL</div>
            <div className="ctg-input-engine__stageQuote">“Make more money.”</div>
            <div className="ctg-input-engine__stageTag">OUTCOME</div>
          </div>

          <div className="ctg-input-engine__arrow ctg-input-engine__arrow--1" aria-hidden="true" />

          {/* Stage 02 */}
          <div className="ctg-input-engine__stage ctg-input-engine__stage--2">
            <div className="ctg-input-engine__stageNum">02</div>
            <div className="ctg-input-engine__stageLabel">GET SPECIFIC</div>
            <div className="ctg-input-engine__stageDesc">
              Turn a vague ambition into a clear target.
            </div>
            <div className="ctg-input-engine__stageTag">CLARITY</div>
          </div>

          <div className="ctg-input-engine__arrow ctg-input-engine__arrow--2" aria-hidden="true" />

          {/* Stage 03 */}
          <div className="ctg-input-engine__stage ctg-input-engine__stage--3">
            <div className="ctg-input-engine__stageNum">03</div>
            <div className="ctg-input-engine__stageLabel">REVERSE ENGINEER</div>
            <div className="ctg-input-engine__stageDesc">
              AI identifies the repeatable actions that can create the result.
            </div>
            <div className="ctg-input-engine__inputs">
              {INPUT_EXAMPLES.map((label) => (
                <div className="ctg-input-engine__inputItem" key={label}>
                  <span className="ctg-input-engine__inputDash" />
                  {label}
                </div>
              ))}
            </div>
            <div className="ctg-input-engine__stageTag">INPUTS</div>
          </div>

          <div className="ctg-input-engine__arrow ctg-input-engine__arrow--3" aria-hidden="true" />

          {/* Stage 04 — the payoff */}
          <div className="ctg-input-engine__stage ctg-input-engine__stage--4">
            <div className="ctg-input-engine__stageNum">04</div>
            <div className="ctg-input-engine__stageLabel">YOUR SUCCESS STACK</div>
            <div className="ctg-input-engine__phoneWrap">
              <div className="ctg-input-engine__phone">
                <img
                  src="/assets/app-screenshots/IMG_3641.png"
                  alt="Compound to Greatness Today view showing the daily Success Stack"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="ctg-input-engine__stageTag ctg-input-engine__stageTag--lime">DAILY EXECUTION</div>
          </div>
        </div>

        {/* === FINAL STATEMENT === */}
        <div className="ctg-input-engine__statement">
          <div className="ctg-input-engine__statementAnnotation">Win today.</div>
          <h2 className="ctg-input-engine__statementHead">
            <span className="ctg-input-engine__statementLine">YOU CAN’T CONTROL</span>
            <span className="ctg-input-engine__statementLine">THE OUTCOME.</span>
            <span className="ctg-input-engine__statementLine ctg-input-engine__statementGap">YOU CAN CONTROL</span>
            <span className="ctg-input-engine__statementLine ctg-input-engine__statementLime">TODAY’S INPUTS.</span>
          </h2>
          <p className="ctg-input-engine__statementBody">
            Complete your inputs and you win the day. Stack enough winning days together, and the
            outcome starts taking care of itself.
          </p>
        </div>
      </div>
    </section>
  );
}
