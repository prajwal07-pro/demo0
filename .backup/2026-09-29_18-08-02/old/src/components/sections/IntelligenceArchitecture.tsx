import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  Waves,
  Ship,
  Cloud,
  Fish,
  AlertTriangle,
  ShieldCheck,
  Route,
  Sparkles,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_AGENTS, type AgentId } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AGENT_ICONS: Record<AgentId, React.ComponentType<{ className?: string }>> = {
  satellite: Satellite,
  'ocean-state': Waves,
  ais: Ship,
  weather: Cloud,
  'fishing-zone': Fish,
  risk: AlertTriangle,
  safety: ShieldCheck,
  route: Route,
  recommendation: Sparkles,
  conversational: MessageSquare,
};

/**
 * IntelligenceArchitecture
 *
 * A radial multi-agent visualization. Each agent sits around a central
 * "ORCA Core" hub. Clicking an agent highlights its relationships and
 * displays its role in the pipeline.
 */
export function IntelligenceArchitecture() {
  const [selected, setSelected] = React.useState<AgentId>('satellite');
  const selectedAgent = AI_AGENTS.find((a) => a.id === selected)!;

  const innerRing = AI_AGENTS.slice(0, 5);
  const outerRing = AI_AGENTS.slice(5);

  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      <div className="absolute inset-0 data-grid opacity-30" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(2,6,23,0.9)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
        >
          <motion.div
            variants={fadeInUp}
            className="flex items-center justify-center gap-3 mb-4"
          >
            <span className="h-px w-12 bg-cyan/40" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
              INTELLIGENCE ARCHITECTURE
            </span>
            <span className="h-px w-12 bg-cyan/40" />
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Ten agents. One ocean.
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-5 max-w-2xl mx-auto text-muted-foreground"
          >
            Every query flows through a coordinated team of specialized AI
            agents. Each contributes its signal; ORCA synthesizes them into
            one auditable answer.
          </motion.p>
        </motion.div>

        {/* Architecture diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 items-center">
          {/* Radial visualization */}
          <div className="relative aspect-square max-w-2xl mx-auto w-full">
            <div className="absolute inset-0 rounded-full border border-cyan/10" />
            <div className="absolute inset-[15%] rounded-full border border-cyan/15" />
            <div className="absolute inset-[35%] rounded-full border border-cyan/20" />

            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <defs>
                <radialGradient id="coreGlow">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
                </radialGradient>
              </defs>
              <circle cx="50" cy="50" r="8" fill="url(#coreGlow)" />
              {[...innerRing, ...outerRing].map((agent) => {
                const total = AI_AGENTS.length;
                const idx = AI_AGENTS.indexOf(agent);
                const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
                const radius = innerRing.includes(agent) ? 30 : 44;
                const x = 50 + Math.cos(angle) * radius;
                const y = 50 + Math.sin(angle) * radius;
                const isSelected = agent.id === selected;
                return (
                  <line
                    key={agent.id}
                    x1="50"
                    y1="50"
                    x2={x}
                    y2={y}
                    stroke={isSelected ? '#22d3ee' : '#0e7490'}
                    strokeWidth={isSelected ? 0.4 : 0.15}
                    strokeOpacity={isSelected ? 0.9 : 0.4}
                    strokeDasharray={isSelected ? '0' : '1 2'}
                  />
                );
              })}
            </svg>

            {/* Core hub */}
            <motion.div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-cyan/40 bg-abyss/80 backdrop-blur-md">
                <div className="absolute inset-0 rounded-full bg-cyan/10 blur-2xl" />
                <div className="relative text-center">
                  <div className="font-display text-base font-bold text-white tracking-widest">
                    ORCA
                  </div>
                  <div className="font-mono text-[8px] tracking-widest text-cyan/80">
                    CORE
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Agents around the ring */}
            {AI_AGENTS.map((agent, idx) => {
              const total = AI_AGENTS.length;
              const angle = (idx / total) * Math.PI * 2 - Math.PI / 2;
              const inInner = innerRing.includes(agent);
              const radius = inInner ? 30 : 44;
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;
              const Icon = AGENT_ICONS[agent.id];
              const isSelected = agent.id === selected;

              return (
                <button
                  key={agent.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => setSelected(agent.id)}
                  aria-label={agent.name}
                >
                  <div
                    className={cn(
                      'relative flex h-12 w-12 items-center justify-center rounded-xl border transition-all duration-300',
                      isSelected
                        ? 'border-cyan bg-cyan/15 shadow-glow-cyan scale-110'
                        : 'border-white/15 bg-abyss/70 hover:border-cyan/40 hover:bg-cyan/5'
                    )}
                  >
                    <Icon
                      className={cn(
                        'h-5 w-5 transition-colors',
                        isSelected
                          ? 'text-cyan'
                          : 'text-muted-foreground group-hover:text-cyan'
                      )}
                    />
                    {isSelected && (
                      <motion.span
                        layoutId="agent-halo"
                        className="absolute -inset-1 rounded-2xl border border-cyan/40"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected agent detail */}
          <motion.div
            key={selected}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <div className="rounded-2xl border border-cyan/20 bg-abyss/60 backdrop-blur-md p-6 relative overflow-hidden">
              <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan/60" />
              <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan/60" />
              <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan/60" />
              <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan/60" />

              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
                  {React.createElement(AGENT_ICONS[selectedAgent.id], {
                    className: 'h-5 w-5 text-cyan',
                  })}
                </div>
                <div>
                  <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                    AGENT · {String(selectedAgent.id).toUpperCase()}
                  </div>
                  <div className="font-display text-lg font-semibold text-white">
                    {selectedAgent.name}
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed">
                {selectedAgent.description}
              </p>

              <div className="mt-6 pt-5 border-t border-white/5">
                <div className="font-mono text-[9px] tracking-widest text-cyan/60 mb-3">
                  PIPELINE STAGE
                </div>
                <div className="flex flex-wrap gap-2">
                  <StageChip label="INPUT" />
                  <span className="text-cyan/40 self-center">→</span>
                  <StageChip label="PROCESS" active />
                  <span className="text-cyan/40 self-center">→</span>
                  <StageChip label="OUTPUT" />
                </div>
              </div>

              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-teal/80">
                  STATUS · IDLE
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StageChip({
  label,
  active = false,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <span
      className={cn(
        'rounded-full border px-2.5 py-1 font-mono text-[9px] tracking-widest',
        active
          ? 'border-cyan/50 bg-cyan/10 text-cyan'
          : 'border-white/10 bg-white/5 text-muted-foreground'
      )}
    >
      {label}
    </span>
  );
}