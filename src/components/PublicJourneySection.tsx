import { Eye, Zap, Send } from "lucide-react";
import "./PublicJourneySection.css";

const accountabilityPoints = [
  { number: "01", title: "SHARE", copy: "Make your 77-day journey public." },
  { number: "02", title: "WATCH", copy: "Follow friends and see who’s still showing up." },
  { number: "03", title: "ENCOURAGE", copy: "Give them a push when they need it most." },
];

const calendarDays = [
  { day: 43, state: "completed" },
  { day: 44, state: "completed" },
  { day: 45, state: "today" },
  { day: 46, state: "future" },
  { day: 47, state: "future" },
  { day: 48, state: "future" },
  { day: 49, state: "future" },
  { day: 50, state: "future" },
  { day: 51, state: "future" },
  { day: 52, state: "future" },
  { day: 53, state: "future" },
  { day: 54, state: "future" },
  { day: 55, state: "future" },
  { day: 56, state: "future" },
  { day: 57, state: "future" },
  { day: 58, state: "future" },
  { day: 59, state: "future" },
  { day: 60, state: "milestone" },
  { day: 61, state: "future" },
  { day: 62, state: "future" },
  { day: 63, state: "future" },
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

        <div className="public-journey-section__composition" aria-label="Public journey product composition">
          {/* Calendar fragment — behind profile card */}
          <div className="public-journey-section__calendar-card">
            <div className="public-journey-section__calendar-label">77-DAY PROGRESS</div>
            <div className="public-journey-section__calendar-grid">
              {calendarDays.map((d) => (
                <div
                  key={d.day}
                  className={`public-journey-section__cal-day public-journey-section__cal-day--${d.state}`}
                >
                  {d.day}
                </div>
              ))}
            </div>
            <div className="public-journey-section__calendar-legend">
              <span><i className="public-journey-section__legend-dot public-journey-section__legend-dot--completed" />Completed</span>
              <span><i className="public-journey-section__legend-dot public-journey-section__legend-dot--today" />Today</span>
              <span><i className="public-journey-section__legend-dot public-journey-section__legend-dot--milestone" />Milestone</span>
              <span><i className="public-journey-section__legend-dot public-journey-section__legend-dot--future" />Day 77</span>
            </div>
          </div>

          {/* Profile card — dominant, front layer */}
          <div className="public-journey-section__profile-card">
            <div className="public-journey-section__live-tag">
              <Eye size={13} strokeWidth={2.5} /> LIVE JOURNEY
            </div>
            <div className="public-journey-section__profile-row">
              <div className="public-journey-section__avatar">
                <img
                  src="https://images.pexels.com/photos/15014092/pexels-photo-15014092.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"
                  alt="Tom Jones"
                  loading="lazy"
                />
              </div>
              <div className="public-journey-section__profile-info">
                <div className="public-journey-section__profile-name">Tom Jones</div>
                <div className="public-journey-section__profile-status">
                  <span className="public-journey-section__status-dot" /> Active today
                </div>
              </div>
            </div>
            <div className="public-journey-section__streak-panel">
              <div className="public-journey-section__streak-top">
                <Zap size={28} strokeWidth={2.5} fill="currentColor" />
                <span className="public-journey-section__streak-number">45</span>
              </div>
              <div className="public-journey-section__streak-label">DAY STREAK</div>
            </div>
            <div className="public-journey-section__becoming-peek">
              <div className="public-journey-section__becoming-label">BECOMING</div>
              <div className="public-journey-section__becoming-item">A person who follows through</div>
              <div className="public-journey-section__becoming-item">Someone who keeps promises</div>
            </div>
          </div>

          {/* Encouragement moment — floating right */}
          <div className="public-journey-section__encouragement">
            <div className="public-journey-section__encouragement-annotation">They can push<br />you forward.</div>
            <svg className="public-journey-section__encouragement-arrow" viewBox="0 0 120 50" fill="none" aria-hidden="true">
              <path d="M6 42 C30 38 55 26 78 14 C88 9 98 6 108 8" />
              <path d="M96 3 L110 8 L100 16" />
            </svg>
            <button type="button" className="public-journey-section__encourage-btn">
              <Send size={16} strokeWidth={2.5} /> SEND ENCOURAGEMENT
            </button>
          </div>
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
