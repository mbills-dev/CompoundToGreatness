import "./SuccessStackSection.css";

const principles = [
  { number: "01", title: "FOCUS", copy: "Know exactly what matters today." },
  { number: "02", title: "EXECUTE", copy: "Complete the inputs you can control." },
  { number: "03", title: "COMPOUND", copy: "Stack winning days until the results catch up." },
];

export default function SuccessStackSection() {
  return (
    <section id="how-it-works" className="success-stack-section" aria-labelledby="success-stack-heading">
      <div className="success-stack-section__main">
        <div className="success-stack-section__copy">
          <div className="success-stack-section__kicker">THE DAILY EXECUTION LAYER</div>
          <h2 id="success-stack-heading" className="success-stack-section__headline">
            KNOW WHAT TO DO.
            <br />
            THEN DO IT.
          </h2>
          <div className="success-stack-section__annotation">Win the day.</div>
          <p className="success-stack-section__body">
            Your Success Stack turns the actions that matter most into a simple daily plan. Complete
            your inputs. Build the streak. Let consistency do the rest.
          </p>
        </div>

        <div className="success-stack-section__visual">
          <div className="success-stack-section__visual-label">TODAY / SUCCESS STACK</div>
          <div className="success-stack-section__screen-crop">
            <img
              src="/assets/images/ctg-today-screen.png"
              alt="Compound to Greatness Today screen showing the Compass, 70 percent progress, and Success Stack inputs"
              loading="lazy"
            />
          </div>
        </div>
      </div>

      <div className="success-stack-section__principles" aria-label="The daily success principles">
        {principles.map((principle) => (
          <div className="success-stack-section__principle" key={principle.number}>
            <div className="success-stack-section__principle-top">
              <span className="success-stack-section__principle-number">{principle.number}</span>
              <span className="success-stack-section__principle-rule" />
            </div>
            <h3>{principle.title}</h3>
            <p>{principle.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
