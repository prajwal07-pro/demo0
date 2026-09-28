import * as React from 'react';
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
 * Home — the cinematic landing page narrative.
 *
 * Sequence:
 *  1. Hero (cinematic 3D ocean)
 *  2. TelemetryBar (live ocean metrics)
 *  3. WhyOrca (value proposition)
 *  4. IntelligenceArchitecture (multi-agent system)
 *  5. LiveMapPreview
 *  6. OceanData
 *  7. AIAssistantPreview
 *  8. ExplorerPreview
 *  9. SimulationsPreview
 * 10. GamesPreview
 * 11. LearningPreview
 * 12. CommunityPreview
 * 13. FinalCTA
 *
 * The Footer is rendered by AppLayout on non-workbench routes.
 */
export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <TelemetryBar />
      <WhyOrca />
      <IntelligenceArchitecture />
      <LiveMapPreview />
      <OceanData />
      <AIAssistantPreview />
      <ExplorerPreview />
      <SimulationsPreview />
      <GamesPreview />
      <LearningPreview />
      <CommunityPreview />
      <FinalCTA />
    </div>
  );
}