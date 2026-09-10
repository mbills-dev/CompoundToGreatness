import "./PublicJourneySection.css";

const accountabilityPoints = [
  { number: "01", title: "SHARE", copy: "Make your 77-day journey public." },
  { number: "02", title: "WATCH", copy: "Follow friends and see who’s still showing up." },
  { number: "03", title: "ENCOURAGE", copy: "Send a push when someone needs it." },
];

export default function PublicJourneySection() {
  return (
    <section className="public-journey-section" aria-labelledby="public-journey-heading">
      <div className="public-journey-section__main">
        <div className="public-journey-section__copy">
          <div className="public-journey-section__kicker">BUILT-IN ACCOUNTABILITY</div>
          <h2 id="public-journey-heading" className="public-journey-section__headline">
            MAKE IT
            <br />
            PUBLIC.
            <br />
            MAKE IT
            <br />
            REAL.
          </h2>
          <div className="public-journey-section__annotation">Someone&apos;s watching.</div>
          <p className="public-journey-section__body">
            Share your live 77-day journey with the people who matter. They can see your streak, what you&apos;re
            becoming, your daily commitments, and your progress — and send encouragement when you need it.
          </p>
        </div>

        <div className="public-journey-section__fragments" aria-label="Public journey product previews">
          <div className="public-journey-section__fragment public-journey-section__fragment--profile">
            <img
              src="/assets/images/public-journey-profile.png"
              alt="Live public journey profile showing a 45 day streak"
              loading="lazy"
            />
          </div>
          <div className="public-journey-section__fragment public-journey-section__fragment--becoming">
            <img
              src="/assets/images/public-journey-success-stack.png"
              alt="Public journey daily commitments and becoming statements"
              loading="lazy"
            />
          </div>
          <div className="public-journey-section__fragment public-journey-section__fragment--calendar">
            <img
              src="/assets/images/public-journey-calendar.png"
              alt="Public journey calendar with current day and Send Encouragement button"
              loading="lazy"
            />
          </div>
          <div className="public-journey-section__caption">A JOURNEY PEOPLE CAN SEE</div>
        </div>
      </div>

      <div className="public-journey-section__principles" aria-label="The accountability principles">
        {accountabilityPoints.map((point) => (
          <div className="public-journey-section__principle" key={point.number}>
            <div className="public-journey-section__principle-top">
              <span className="public-journey-section__principle-number">{point.number}</span>
              <span className="public-journey-section__principle-rule" />
            </div>
            <h3>{point.title}</h3>
            <p>{point.copy}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
