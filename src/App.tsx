import { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import CTGHero from './components/CTGHero';
import CTGGrowthMapV4_1 from './components/CTGGrowthMapV4_1';

const appScreens = [
  { src: '/assets/app-screenshots/IMG_3641.png', alt: 'Today view showing the daily Success Stack' },
  { src: '/assets/app-screenshots/IMG_3642.png', alt: 'Identity and daily progress view' },
  { src: '/assets/app-screenshots/IMG_3643.png', alt: 'Daily activity checklist and evidence log' },
  { src: '/assets/app-screenshots/IMG_3644.png', alt: '77-day progress calendar' },
];

function App() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (!response.ok || typeof data.url !== 'string') throw new Error('Checkout unavailable');
      window.location.href = data.url;
    } catch {
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="site-shell">
      <main id="top">
        <CTGHero />
        <CTGGrowthMapV4_1 />

        <section id="app" className="app-showcase section-dark">
          <div className="showcase-copy">
            <div className="section-kicker">THE APP</div>
            <h2>YOUR GREATNESS.<br /><span>IN ONE PLACE.</span></h2>
            <p>Track your habits, build your mindset, measure your progress, and surround yourself with others — all in the Compound to Greatness app.</p>
            <a href="#features" className="text-link">Explore features <ArrowRight size={17} /></a>
          </div>
          <div className="screen-stack" aria-label="Compound to Greatness app screens">
            {appScreens.slice(1, 4).map((screen, index) => (
              <div className={`screen-card screen-card-${index + 1}`} key={screen.src}>
                <img src={screen.src} alt={screen.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="feature-section section-light">
          <div className="feature-phone"><img src={appScreens[2].src} alt={appScreens[2].alt} loading="lazy" /></div>
          <div className="feature-copy">
            <div className="section-kicker">DAILY DISCIPLINE</div>
            <h2>BUILD THE HABITS.<br /><span>THAT COMPOUND.</span></h2>
            <p>Create your daily success stack, stay consistent, and check the boxes that move your life forward.</p>
            <ul>
              {['Customizable daily habits', 'Simple, focused interface', 'Stay consistent with reminders', 'Track what matters most'].map((item) => <li key={item}><Check size={18} /> {item}</li>)}
            </ul>
          </div>
        </section>

        <section id="start" className="final-section">
          <div className="final-photo" aria-hidden="true" />
          <div className="final-overlay" aria-hidden="true" />
          <div className="final-content">
            <div className="section-kicker">MORE THAN AN APP</div>
            <h2>A STRONGER YOU<br /><span>CHANGES EVERYTHING.</span></h2>
            <p>This isn’t just a habit tracker. It’s a tool to help you become the person you’re meant to be — in every area of life.</p>
            <form onSubmit={handleSubmit} className="waitlist-form">
              <label><span className="sr-only">Full name</span><input type="text" value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="FULL NAME" required /></label>
              <label><span className="sr-only">Email address</span><input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="EMAIL ADDRESS" required /></label>
              <button type="submit" className="button button-primary" disabled={isSubmitting}>{isSubmitting ? 'PROCESSING...' : <>Join Waitlist <ArrowRight size={18} /></>}</button>
              {submitStatus === 'error' && <p className="form-error">Something went wrong. Please try again.</p>}
            </form>
            <p className="fine-print">Founding membership is $3.21/month ($38.50/year, billed annually). Cancel anytime.</p>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a href="#top" className="brand-lockup"><img src="/logo-mark.png" alt="" className="brand-mark" /><span>COMPOUND<br /><strong>TO GREATNESS</strong></span></a>
        <div className="footer-links"><a href="#app">The App</a><a href="#method">Why It Works</a><a href="#features">Features</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div>
        <p>© 2026 Compound to Greatness. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
