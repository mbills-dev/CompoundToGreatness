import { useEffect, useRef, useState } from "react";
import "./InputEngineSection.css";

export default function InputEngineSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(false);
  const [dealValue, setDealValue] = useState(10000);
  const [offersPerDeal, setOffersPerDeal] = useState(10);
  const [locked, setLocked] = useState(false);

  const monthlyTarget = 100000;
  const dealsPerMonth = Math.ceil(monthlyTarget / dealValue);
  const monthlyOffers = dealsPerMonth * offersPerDeal;
  const dailyOffers = Math.ceil(Math.ceil(monthlyOffers / 30) * 1.3);

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
      { threshold: 0.14 }
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
            backward to identify the daily inputs that create it.
          </p>
        </div>

        <div className="ctg-input-engine__mobileStory" aria-label="How Compound to Greatness turns an outcome into a daily input">
          <article className="ctg-input-engine__mobileStep">
            <div className="ctg-input-engine__mobileMeta"><span>01</span><span>OUTCOME</span></div>
            <div className="ctg-input-engine__mobileOutcome">“MAKE MORE<br />MONEY.”</div>
            <div className="ctg-input-engine__mobileMuted">Vague. Not actionable.</div>
            <div className="ctg-input-engine__mobileWish">That’s a wish, not a plan.</div>
          </article>

          <div className="ctg-input-engine__mobileArrow" aria-hidden="true">↓</div>

          <article className="ctg-input-engine__mobileStep">
            <div className="ctg-input-engine__mobileMeta"><span>02</span><span>DEFINE IT</span></div>
            <div className="ctg-input-engine__mobileIntro">MAKE MORE MONEY</div>
            <div className="ctg-input-engine__mobileArrow" aria-hidden="true">↓</div>
            <div className="ctg-input-engine__mobileTarget">$100K</div>
            <div className="ctg-input-engine__mobileUnit">/ MONTH</div>
            <p className="ctg-input-engine__mobileNote">Turn the ambition into a measurable target.</p>
          </article>

          <div className="ctg-input-engine__mobileArrow" aria-hidden="true">↓</div>

          <article className="ctg-input-engine__mobileStep ctg-input-engine__mobileStep--decode">
            <div className="ctg-input-engine__mobileMeta"><span>03</span><span>DECODE IT</span></div>
            <div className="ctg-input-engine__mobileWork">WORK BACKWARD.</div>
            <div className="ctg-input-engine__mobileControl">
              <div className="ctg-input-engine__mobileQuestion">WHAT'S ONE DEAL WORTH?</div>
              <div className="ctg-input-engine__mobileOptions">
                {[500, 1000, 2500, 5000, 10000].map((value: number) => (
                  <button
                    key={value}
                    type="button"
                    className={dealValue === value ? "is-selected" : ""}
                    onClick={() => { setDealValue(value); setLocked(false); }}
                  >
                    ${value.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
            <div className="ctg-input-engine__mobileControl">
              <div className="ctg-input-engine__mobileQuestion">ABOUT HOW MANY OFFERS PER DEAL?</div>
              <div className="ctg-input-engine__mobileOptions">
                {[5, 10, 20, 50].map((value: number) => (
                  <button
                    key={value}
                    type="button"
                    className={offersPerDeal === value ? "is-selected" : ""}
                    onClick={() => { setOffersPerDeal(value); setLocked(false); }}
                  >
                    1-in-{value}
                  </button>
                ))}
              </div>
            </div>
            <div className="ctg-input-engine__mobileEquation" aria-live="polite">
              <span>$100K / MONTH</span><i>↓</i>
              <span>${dealValue.toLocaleString()} / DEAL</span><i>↓</i>
              <span>1-IN-{offersPerDeal} OFFERS</span><i>↓</i>
              <span> {dailyOffers} OFFERS / DAY</span>
            </div>
          </article>

          <div className="ctg-input-engine__mobileArrow" aria-hidden="true">↓</div>

          <article className="ctg-input-engine__mobileStep">
            <div className="ctg-input-engine__mobileMeta"><span>04</span><span className="is-lime">CONTROL IT</span></div>
            <div className={`ctg-input-engine__mobileCard ${locked ? "is-locked" : ""}`}>
              <div className="ctg-input-engine__mobileCardLabel">YOUR DAILY NUMBER</div>
              <div className="ctg-input-engine__mobileDailyNumber">{dailyOffers}</div>
              <div className="ctg-input-engine__mobileDailyUnit">offers per day</div>
              <div className="ctg-input-engine__mobileCalculation">
                {dealsPerMonth} deals needed × {offersPerDeal} offers each = {monthlyOffers} offers<br />
                {Math.ceil(monthlyOffers / 30)} / offer × 30% buffer → {dailyOffers}
              </div>
              <button type="button" className="ctg-input-engine__mobileLock" onClick={() => setLocked(!locked)}>
                {locked ? "Locked In" : "Lock This In"}
              </button>
            </div>
            <p className="ctg-input-engine__mobileNote">An outcome becomes an input. Now you know exactly what winning today looks like.</p>
          </article>
        </div>

        <div className="ctg-input-engine__story" aria-label="How Compound to Greatness turns an outcome into a daily input">
          <div className="ctg-input-engine__guide" aria-hidden="true">
            <span className="ctg-input-engine__guideLime" />
          </div>

          <article className="ctg-input-engine__step ctg-input-engine__step--1">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">01</span>
              <span className="ctg-input-engine__stepTag">OUTCOME</span>
            </div>
            <div className="ctg-input-engine__outcomeGoal">“MAKE MORE<br />MONEY.”</div>
            <div className="ctg-input-engine__outcomeNote">Vague. Not actionable.</div>
            <div className="ctg-input-engine__outcomeWish">That’s a wish, not a plan.</div>
          </article>

          <article className="ctg-input-engine__step ctg-input-engine__step--2">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">02</span>
              <span className="ctg-input-engine__stepTag">DEFINE IT</span>
            </div>
            <div className="ctg-input-engine__defineIntro">MAKE MORE MONEY</div>
            <div className="ctg-input-engine__defineArrow" aria-hidden="true">↓</div>
            <div className="ctg-input-engine__defineValue">$100K</div>
            <div className="ctg-input-engine__defineUnit">/ MONTH</div>
            <div className="ctg-input-engine__stepNote">Turn the ambition into a measurable target.</div>
          </article>

          <article className="ctg-input-engine__step ctg-input-engine__step--3">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">03</span>
              <span className="ctg-input-engine__stepTag">DECODE IT</span>
            </div>
            <div className="ctg-input-engine__decodeHeadline">WORK BACKWARD.</div>
            <div className="ctg-input-engine__fragment ctg-input-engine__fragment--decode">
              <img
                src="/assets/images/IMG_3673.PNG"
                alt="Compound to Greatness reverse engineering the deal value and offer inputs"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__fragment ctg-input-engine__fragment--ratio">
              <img
                src="/assets/images/IMG_3673.PNG"
                alt="Compound to Greatness selected one in ten offer conversion input"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__decodeFlow" aria-label="Reverse engineered numbers">
              <span>$100K / MONTH</span>
              <i>↓</i>
              <span>$10K / DEAL</span>
              <i>↓</i>
              <span>1-IN-10 OFFERS</span>
              <i>↓</i>
              <span className="ctg-input-engine__decodeFlowFinal">6 OFFERS / DAY</span>
            </div>
          </article>

          <article className="ctg-input-engine__step ctg-input-engine__step--4">
            <div className="ctg-input-engine__stepMeta">
              <span className="ctg-input-engine__stepNum">04</span>
              <span className="ctg-input-engine__stepTag ctg-input-engine__stepTag--lime">CONTROL IT</span>
            </div>
            <div className="ctg-input-engine__fragment ctg-input-engine__fragment--daily">
              <img
                src="/assets/images/decode-daily-number.PNG"
                alt="Your daily number is 6 offers per day"
                loading="lazy"
              />
            </div>
            <div className="ctg-input-engine__stepNote">
              An outcome becomes an input. Now you know exactly what winning today looks like.
            </div>
          </article>
        </div>

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
