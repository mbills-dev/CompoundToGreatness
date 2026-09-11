import { Check } from 'lucide-react';
import CTGHero from './components/CTGHero';
import CTGGrowthMapV4_1 from './components/CTGGrowthMapV4_1';
import InputEngineSection from './components/InputEngineSection';
import SuccessStackSection from './components/SuccessStackSection';
import ProgressCompoundingSection from './components/ProgressCompoundingSection';
import PublicJourneySection from './components/PublicJourneySection';
import PurposeSection from './components/PurposeSection';
import TransformationSection from './components/TransformationSection';
import StartJourneySection from './components/StartJourneySection';

const appScreens = [
  { src: '/assets/app-screenshots/IMG_3641.png', alt: 'Today view showing the daily Success Stack' },
  { src: '/assets/app-screenshots/IMG_3642.png', alt: 'Identity and daily progress view' },
  { src: '/assets/app-screenshots/IMG_3643.png', alt: 'Daily activity checklist and evidence log' },
  { src: '/assets/app-screenshots/IMG_3644.png', alt: '77-day progress calendar' },
];

function App() {
  return (
    <div className="site-shell">
      <main id="top">
        <CTGHero />
        <CTGGrowthMapV4_1 />
        <InputEngineSection />
        <SuccessStackSection />
        <ProgressCompoundingSection />
        <PublicJourneySection />
        <PurposeSection />
        <TransformationSection />
        <StartJourneySection />

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
