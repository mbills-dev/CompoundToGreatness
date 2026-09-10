import "./PurposeSection.css";

export default function PurposeSection() {
  return (
    <section className="purpose-section" aria-labelledby="purpose-heading">
      <div className="purpose-section__photo" aria-hidden="true" />
      <div className="purpose-section__veil" aria-hidden="true" />

      <div className="purpose-section__inner">
        <div className="purpose-section__primary">
          <div className="purpose-section__kicker">THE REAL GOAL IS WHO YOU BECOME</div>
          <h2 id="purpose-heading" className="purpose-section__headline">
            YOUR LIFE
            <br />
            MATTERS.
            <br />
            MAKE IT COUNT.
          </h2>
          <div className="purpose-section__annotation">The goal is just the vehicle.</div>
          <p className="purpose-section__copy">
            Goals aren&apos;t just about getting something you want. They&apos;re a mechanism for becoming someone you
            aren&apos;t yet.
            <br /><br />
            They pull you beyond what&apos;s comfortable. They demand more of you. And when you repeatedly do the
            things that person would do, eventually you stop chasing the result.
            <br /><br />
            You become the person who creates it by default.
          </p>
        </div>

        <div className="purpose-section__secondary">
          <div className="purpose-section__secondary-rule" />
          <h3>
            YOU HAVE SOMETHING
            <br />
            THE WORLD NEEDS.
          </h3>
          <p>A calling. A contribution. A life only you can live.</p>
          <p>
            Compound to Greatness is about becoming the person capable of stepping fully into it.
          </p>
          <div className="purpose-section__secondary-note">Become who you were created to be.</div>
        </div>
      </div>
    </section>
  );
}
