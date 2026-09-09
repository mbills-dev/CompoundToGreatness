import "./CTGHero.css";

export default function CTGHero() {
  return (
    <section className="ctgHero" aria-labelledby="ctgHeroTitle">
      <div className="ctgHero__background" aria-hidden="true" />

      <header className="ctgHero__nav">
        <a href="/" className="ctgHero__brand" aria-label="Compound to Greatness home">
          <img src="/logo-mark.png" alt="" className="ctgHero__brandMarkImg" />
          <span>
            <strong>COMPOUND TO</strong>
            <strong>GREATNESS</strong>
          </span>
        </a>

        <nav className="ctgHero__navLinks" aria-label="Primary navigation">
          <a href="#app">The App</a>
          <a href="#method">Why It Works</a>
          <a href="#features">Features</a>
          <a href="#start">About</a>
        </nav>

        <a className="ctgHero__topCta" href="#start">
          JOIN WAITLIST <span aria-hidden="true">→</span>
        </a>
      </header>

      <div className="ctgHero__content">
        <div className="ctgHero__copy">
          <p className="ctgHero__eyebrow">DISCIPLINE TODAY. A GREATER TOMORROW.</p>

          <h1 id="ctgHeroTitle" className="ctgHero__title">
            <span>BECOME</span>
            <span className="ctgHero__lime">1% BETTER.</span>
            <span>EVERY DAY.</span>
          </h1>

          <p className="ctgHero__script">Small inputs. Exponential life.</p>

          <p className="ctgHero__body">
            The all-in-one app to help you build better habits, make consistent
            progress, and become the person your goals require.
          </p>

          <a id="download" className="ctgHero__appStore" href="#start">
            <span className="ctgHero__apple" aria-hidden="true">●</span>
            <span>
              <small>COMING SOON ON THE</small>
              <strong>App Store</strong>
            </span>
          </a>
        </div>

        <div className="ctgHero__visual" aria-label="Compound to Greatness app preview">
          <img
            className="ctgHero__handPhone"
            src="/assets/images/ctg-hero-background.png"
            alt=""
            aria-hidden="true"
          />

          <div className="ctgHero__realScreen">
            <img
              src="/assets/images/ctg-today-screen.png"
              alt="Compound to Greatness Today screen showing My Compass, progress, and the Success Stack."
            />
          </div>
        </div>
      </div>

      <div className="ctgHero__categories" aria-label="Goal categories">
        {["Fitness","Mindset","Career","Wealth","Relationships","Health","Learning","More"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}
