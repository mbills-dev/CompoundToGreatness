import { useEffect } from 'react';
import GlobalNav from './components/GlobalNav';
import CTGHero from './components/CTGHero';
import CTGGrowthMapV4_1 from './components/CTGGrowthMapV4_1';
import InputEngineSection from './components/InputEngineSection';
import SuccessStackSection from './components/SuccessStackSection';
import ProgressCompoundingSection from './components/ProgressCompoundingSection';
import PublicJourneySection from './components/PublicJourneySection';
import PurposeSection from './components/PurposeSection';
import TransformationSection from './components/TransformationSection';
import StartJourneySection from './components/StartJourneySection';
import FooterClose from './components/FooterClose';

function App() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const el = document.getElementById(hash);
    if (!el) return;

    const navHeight = window.matchMedia("(max-width: 900px)").matches ? 62 : 70;
    const scrollToEl = () => {
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: "smooth" });
    };

    const timer = setTimeout(scrollToEl, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="site-shell">
      <GlobalNav />
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

      <FooterClose />
    </div>
  );
}

export default App;
