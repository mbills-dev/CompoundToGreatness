import { useEffect, useRef, useState } from "react";
import "./StartJourneySection.css";

export default function StartJourneySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [day01Pulse, setDay01Pulse] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) {
      setVisible(true);
      return;
    }

    let raf = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          for (const entry of entries) {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.25) {
              setVisible(true);
              observer.disconnect();
              break;
            }
          }
        });
      },
      { threshold: [0.25] }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (media.matches) return;

    const t = setTimeout(() => {
      setDay01Pulse(true);
      const t2 = setTimeout(() => setDay01Pulse(false), 800);
      return () => clearTimeout(t2);
    }, 2200);

    return () => clearTimeout(t);
  }, [visible]);

  return (
    <section
      id="download"
      className={"start-journey" + (visible ? " is-visible" : "")}
      aria-labelledby="start-journey-heading"
      ref={sectionRef}
    >
      <div className={"start-journey__ambient" + (day01Pulse ? " is-pulsing" : "")} aria-hidden="true" />

      <div className="start-journey__bg-day" aria-hidden="true">
        <span>DAY</span>
        <span>01</span>
      </div>

      <div className="start-journey__inner">
        <div className="start-journey__left">
          <div
            className={
              "start-journey__eyebrow" +
              (visible ? " is-revealed" : "")
            }
          >
            YOUR NEXT 1% STARTS TODAY
          </div>

          <h2
            id="start-journey-heading"
            className={
              "start-journey__headline" +
              (visible ? " is-revealed" : "")
            }
          >
            STOP WAITING
            <br />
            TO BECOME
            <br />
            WHO YOU KNOW
            <br />
            YOU CAN BE.
          </h2>

          <div
            className={
              "start-journey__annotation" +
              (visible ? " is-revealed" : "")
            }
          >
            Your Day 1 starts here.
          </div>

          <div
            className={
              "start-journey__copy" +
              (visible ? " is-revealed" : "")
            }
          >
            <p>
              You don&apos;t need another year. You don&apos;t need the perfect plan.
            </p>
            <p>
              Choose who you&apos;re becoming. Define the daily inputs that will get you
              there. Then start stacking proof.
            </p>
          </div>

          <a
            className={
              "start-journey__app-store-link" +
              (visible ? " is-revealed" : "")
            }
            href="#download"
            aria-label="Download Compound to Greatness on the App Store"
          >
            <img
              className="start-journey__app-store-badge"
              src="/assets/images/Download_on_the_App_Store_Badge.svg.webp"
              alt="Download Compound to Greatness on the App Store"
            />
          </a>

          <div
            className={
              "start-journey__fine-print" +
              (visible ? " is-revealed" : "")
            }
          >
            77 days. One promise to yourself.
          </div>
        </div>

        <div
          className={
            "start-journey__right" +
            (visible ? " is-revealed" : "")
          }
        >
          <div className="start-journey__device">
            <img
              src="/assets/app-screenshots/IMG_3641.png"
              alt="Compound to Greatness Today view showing the daily Success Stack and daily commitments"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
