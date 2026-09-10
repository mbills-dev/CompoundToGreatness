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
            They pull you beyond what&apos;s comfortable. They demand more of you. Repeat the right actions long
            enough and eventually you stop chasing the result.
            <br /><br />
            <span className="purpose-section__copy-thesis">You become the person who creates it by default.</span>
          </p>
        </div>

        <div className="purpose-section__secondary">
          <div className="purpose-section__secondary-rule" />
          <h3>
            THE WORLD
            <br />
            NEEDS WHAT
            <br />
            ONLY YOU
            <br />
            CAN GIVE.
          </h3>
          <p>A calling. A contribution. A life only you can live.</p>
          <p>
            Compound to Greatness is about becoming the person capable of living it.
          </p>
          <div className="purpose-section__secondary-note">Become who you were created to be.</div>
        </div>
      </div>
    </section>
  );
}
