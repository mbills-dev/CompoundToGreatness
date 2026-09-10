import { useEffect, useRef, useState } from "react";
import "./InputEngineSection.css";

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
      { threshold: 0.12 }
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
            <span className="ctg-input-engine__headline-line ctg-input-engine__headline-lime">BUILD THE</span>
            <span className="ctg-input-engine__headline-line ctg-input-engine__headline-lime">INPUTS.</span>
          </h2>

          <p className="ctg-input-engine__handwritten">The outcome follows the inputs.</p>

          <p className="ctg-input-engine__support">
            Most people start with the outcome. Compound to Greatness starts there — then works
            backward to identify the actions you can actually control today.
          </p>
        </div>

        {/* === DECODE PRODUCT STORY === */}
        <div className="ctg-input-engine__story" aria-label="Decode product story">

          {/* Stage 01 — OUTCOME */}
          <div className="ctg-input-engine__step ctg-input-engine__step--1">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">01</span>
              <span className="ctg-input-engine__stepTag">OUTCOME</span>
            </div>
            <div className="ctg-input-engine__phone ctg-input-engine__phone--sm">
              <img
                src="/assets/images/IMG_3669.PNG"
                alt="Compound to Greatness goal screen showing 'Make more money'"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__stepCopy">
              <div className="ctg-input-engine__stepQuote">“Make more money.”</div>
              <div className="ctg-input-engine__stepNote">Vague. Not actionable.</div>
            </div>
          </div>

          {/* Stage 02 — DEFINE IT */}
          <div className="ctg-input-engine__step ctg-input-engine__step--2">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">02</span>
              <span className="ctg-input-engine__stepTag">DEFINE IT</span>
            </div>
            <div className="ctg-input-engine__stepDefine">
              <div className="ctg-input-engine__defineValue">$100K</div>
              <div className="ctg-input-engine__defineUnit">/ MONTH</div>
            </div>
            <div className="ctg-input-engine__stepCopy">
              <div className="ctg-input-engine__stepNote">
                Turn the ambition into a measurable target.
              </div>
            </div>
          </div>

          {/* Stage 03 — DECODE IT */}
          <div className="ctg-input-engine__step ctg-input-engine__step--3">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">03</span>
              <span className="ctg-input-engine__stepTag">DECODE IT</span>
            </div>
            <div className="ctg-input-engine__stepHeadline">WORK BACKWARD.</div>
            <div className="ctg-input-engine__phone ctg-input-engine__phone--md">
              <img
                src="/assets/images/IMG_3673.PNG"
                alt="Compound to Greatness Decode screen reverse-engineering the goal into daily actions"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__callouts">
              <div className="ctg-input-engine__callout">
                <span className="ctg-input-engine__calloutNum">$100K</span>
                <span className="ctg-input-engine__calloutLabel">/ month</span>
              </div>
              <div className="ctg-input-engine__callout">
                <span className="ctg-input-engine__calloutNum">$10K</span>
                <span className="ctg-input-engine__calloutLabel">/ deal</span>
              </div>
              <div className="ctg-input-engine__callout">
                <span className="ctg-input-engine__calloutNum">1-in-10</span>
                <span className="ctg-input-engine__calloutLabel">offers convert</span>
              </div>
            </div>
            <div className="ctg-input-engine__stepCopy">
              <div className="ctg-input-engine__stepNote">
                Compound to Greatness works backward through your numbers to find the action that drives the result.
              </div>
            </div>
          </div>

          {/* Stage 04 — CONTROL IT */}
          <div className="ctg-input-engine__step ctg-input-engine__step--4">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">04</span>
              <span className="ctg-input-engine__stepTag ctg-input-engine__stepTag--lime">CONTROL IT</span>
            </div>
            <div className="ctg-input-engine__phone ctg-input-engine__phone--lg">
              <img
                src="/assets/images/decode-daily-number.PNG"
                alt="Compound to Greatness daily number screen showing 6 offers per day"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__dailyNumber">
              <div className="ctg-input-engine__dailyLabel">YOUR DAILY NUMBER</div>
              <div className="ctg-input-engine__dailyFigure">
                <span className="ctg-input-engine__dailySix">6</span>
                <span className="ctg-input-engine__dailyUnit">OFFERS / DAY</span>
              </div>
              <div className="ctg-input-engine__stepNote">
                An outcome becomes an input. Now you know exactly what winning today looks like.
              </div>
            </div>
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
