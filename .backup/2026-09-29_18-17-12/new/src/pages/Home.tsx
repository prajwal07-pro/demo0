import { Hero } from '@/components/sections/Hero';
import { TelemetryBar } from '@/components/sections/TelemetryBar';
import { WhyOrca } from '@/components/sections/WhyOrca';
import { IntelligenceArchitecture } from '@/components/sections/IntelligenceArchitecture';
import { LiveMapPreview } from '@/components/sections/LiveMapPreview';
import { OceanData } from '@/components/sections/OceanData';
import { AIAssistantPreview } from '@/components/sections/AIAssistantPreview';
import { ExplorerPreview } from '@/components/sections/ExplorerPreview';
import { SimulationsPreview } from '@/components/sections/SimulationsPreview';
import { GamesPreview } from '@/components/sections/GamesPreview';
import { LearningPreview } from '@/components/sections/LearningPreview';
import { CommunityPreview } from '@/components/sections/CommunityPreview';
import { FinalCTA } from '@/components/sections/FinalCTA';

/**
 * Home — cinematic landing page narrative.
 *
 * Visual rhythm (dark → light → dark) is intentional. Each section owns
 * its own composition so the page does not read as a stack of dark panels.
 */
export default function Home() {
  return (
    <div className="relative">
      {/* Cinematic dark */}
      <Hero />
      <TelemetryBar />

      {/* Editorial light — first rhythm shift */}
      <WhyOrca />

      {/* Cinematic dark */}
      <IntelligenceArchitecture />
      <LiveMapPreview />

      {/* Editorial light */}
      <OceanData />

      {/* Cinematic dark with light content */}
      <AIAssistantPreview />

      {/* Cinematic dark */}
      <ExplorerPreview />
      <SimulationsPreview />
      <GamesPreview />

      {/* Editorial light */}
      <LearningPreview />
      <CommunityPreview />

      {/* Cinematic dark — closing */}
      <FinalCTA />
    </div>
  );
}