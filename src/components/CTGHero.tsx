import { useEffect, useState } from "react";
import "./CTGHero.css";

export default function CTGHero() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="ctgHero" aria-labelledby="ctgHeroTitle">
      <div className="ctgHero__background ctgHero-enter ctgHero-enter--background" aria-hidden="true" />

      <div className={`ctgHero__navBar ctgHero-enter ctgHero-enter--nav ${scrolled ? "ctgHero__navBar--scrolled" : ""}`}>
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

          <a className="ctgHero__topCta" href="#download" aria-label="Get the Compound to Greatness app">
            GET THE APP <span aria-hidden="true">→</span>
          </a>
        </header>
      </div>

      <div className="ctgHero__content">
        <div className="ctgHero__copy">
          <p className="ctgHero__eyebrow ctgHero-enter ctgHero-enter--eyebrow">DISCIPLINE TODAY. A GREATER TOMORROW.</p>

          <h1 id="ctgHeroTitle" className="ctgHero__title">
            <span className="ctgHero-enter ctgHero-enter--line1">BECOME</span>
            <span className="ctgHero__lime ctgHero-enter ctgHero-enter--line2">1% BETTER.</span>
            <span className="ctgHero-enter ctgHero-enter--line3">EVERY DAY.</span>
          </h1>

          <p className="ctgHero__script ctgHero-enter ctgHero-enter--script">Small inputs. Exponential life.</p>

          <p className="ctgHero__body ctgHero-enter ctgHero-enter--body">
            The all-in-one app to help you build better habits, make consistent
            progress, and become the person your goals require.
          </p>

          <a id="download" className="ctgHero__appStoreLink ctgHero-enter ctgHero-enter--badge" href="#download">
            <img
              className="ctgHero__appStoreBadge"
              src="/assets/images/Download_on_the_App_Store_Badge.svg.webp"
              alt="Download Compound to Greatness on the App Store"
            />
          </a>
        </div>

        <div className="ctgHero__visual ctgHero-enter ctgHero-enter--visual" aria-label="Compound to Greatness app preview">
          <img
            className="ctgHero__handPhone"
            src="/assets/images/ChatGPT_Image_Sep_9,_2026,_01_51_35_PM.png"
            alt="Compound to Greatness app in hand"
          />
        </div>
      </div>

      <div className="ctgHero__categories ctgHero-enter ctgHero-enter--categories" aria-label="Goal categories">
        {["Fitness","Mindset","Career","Wealth","Relationships","Health","Learning","More"].map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </section>
  );
}
