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

      <FooterClose />
    </div>
  );
}

export default App;
