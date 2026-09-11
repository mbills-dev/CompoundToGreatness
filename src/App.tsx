import CTGHero from './components/CTGHero';
import CTGGrowthMapV4_1 from './components/CTGGrowthMapV4_1';
import InputEngineSection from './components/InputEngineSection';
import SuccessStackSection from './components/SuccessStackSection';
import ProgressCompoundingSection from './components/ProgressCompoundingSection';
import PublicJourneySection from './components/PublicJourneySection';
import PurposeSection from './components/PurposeSection';
import TransformationSection from './components/TransformationSection';
import StartJourneySection from './components/StartJourneySection';

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
