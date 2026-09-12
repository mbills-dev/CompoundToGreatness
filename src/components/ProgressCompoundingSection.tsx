import "./ProgressCompoundingSection.css";

const principles = [
  { number: "01", title: "COMMIT", copy: "Choose the daily inputs that move your life forward." },
  { number: "02", title: "DON'T MISS", copy: "Complete them every day for 77 days. Miss one, start over." },
  { number: "03", title: "BUILD PROOF", copy: "Watch your calendar fill as consistency becomes identity." },
];

export default function ProgressCompoundingSection() {
  return (
    <section id="challenge" className="progress-compounding-section" aria-labelledby="progress-compounding-heading">
      <div className="progress-compounding-section__main">
        <div className="progress-compounding-section__copy">
          <div className="progress-compounding-section__kicker">THE 77-DAY CHALLENGE</div>
          <h2 id="progress-compounding-heading" className="progress-compounding-section__headline">
            DON&apos;T
            <br />
            BREAK
            <br />
            THE
            <br />
            CHAIN.
          </h2>
          <div className="progress-compounding-section__stakes">MISS A DAY. START OVER.</div>
          <p className="progress-compounding-section__body">
            For 77 days, complete the inputs you committed to. Miss a day and the challenge resets. Every
            completed day becomes proof that you&apos;re becoming the person who follows through.
          </p>
        </div>

        <div className="progress-compounding-section__annotation-wrap" aria-hidden="true">
          <div className="progress-compounding-section__annotation">Watch the wins stack up.</div>
          <svg className="progress-compounding-section__annotation-arrow" viewBox="0 0 240 70" fill="none">
            <path d="M8 52 C64 54 104 42 150 25 C177 15 198 9 226 10" />
            <path d="M211 4 L227 10 L216 22" />
          </svg>
          <svg className="progress-compounding-section__annotation-arrow--mobile" viewBox="0 0 80 60" fill="none">
            <path d="M40 6 C40 20 38 34 40 50" />
            <path d="M32 42 L40 52 L48 42" />
          </svg>
        </div>

        <div className="progress-compounding-section__visual">
          <div className="progress-compounding-section__visual-label">THE 77-DAY CHALLENGE / PROGRESS</div>
          <div className="progress-compounding-section__screen-crop">
            <img
              src="/assets/images/ctg-77-day-progress-wall.PNG"
              alt="Compound to Greatness 77-day challenge calendar showing completed days, today's progress, milestone Day 60, and final Day 77"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="progress-compounding-section__principles" aria-label="The progress principles">
        {principles.map((principle) => (
          <div className="progress-compounding-section__principle" key={principle.number}>
            <div className="progress-compounding-section__principle-top">
              <span className="progress-compounding-section__principle-number">{principle.number}</span>
              <span className="progress-compounding-section__principle-rule" />
            </div>
            <h3>{principle.title}</h3>
            <p>{principle.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
