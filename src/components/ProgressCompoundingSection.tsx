import "./ProgressCompoundingSection.css";

const principles = [
  { number: "01", title: "SHOW UP", copy: "Complete today's Success Stack." },
  { number: "02", title: "BUILD PROOF", copy: "Every completed day becomes evidence of who you're becoming." },
  { number: "03", title: "COMPOUND", copy: "Stack winning days until the results catch up." },
];

export default function ProgressCompoundingSection() {
  return (
    <section className="progress-compounding-section" aria-labelledby="progress-compounding-heading">
      <div className="progress-compounding-section__main">
        <div className="progress-compounding-section__copy">
          <div className="progress-compounding-section__kicker">THE PROOF OF CONSISTENCY</div>
          <h2 id="progress-compounding-heading" className="progress-compounding-section__headline">
            DON&apos;T BREAK
            <br />
            THE CHAIN.
          </h2>
          <div className="progress-compounding-section__annotation">Watch the wins stack up.</div>
          <p className="progress-compounding-section__body">
            One winning day doesn&apos;t change your life. Stack enough of them together and everything
            starts to change.
          </p>
        </div>

        <div className="progress-compounding-section__visual">
          <div className="progress-compounding-section__visual-label">PROGRESS / DAY 43</div>
          <div className="progress-compounding-section__screen-crop">
            <img
              src="/assets/app-screenshots/IMG_3644.png"
              alt="Compound to Greatness 77-day progress screen showing Day 43, 55 percent progress, completed days, and the progress grid"
              loading="lazy"
            />
          </div>
          <svg className="progress-compounding-section__curve" viewBox="0 0 900 280" aria-hidden="true">
            <path className="progress-compounding-section__curve-base" d="M0 236 C170 236 275 232 380 218 C520 200 570 160 660 112 C740 70 810 34 900 18" />
            <path className="progress-compounding-section__curve-lime" d="M530 186 C585 167 615 136 660 112 C740 70 810 34 900 18" />
          </svg>
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
