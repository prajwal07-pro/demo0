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
  ArrowRight,
  Database,
  Cpu,
  Network,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
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
 * Intelligence — full-page documentation of the ORCA multi-agent pipeline.
 * Explains the data → agent → recommendation flow with an honest contract
 * about what is currently wired vs. planned.
 */
export default function Intelligence() {
  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-12"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · ARCHITECTURE
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Intelligence Architecture
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-3xl text-muted-foreground">
          Ten specialized AI agents, one unified intelligence layer. Every ORCA
          answer is traceable to the agents that produced it and the sources
          they consulted.
        </motion.p>
      </motion.div>

      {/* Pipeline stages */}
      <section className="mb-14">
        <div className="font-mono text-[10px] tracking-widest text-cyan/60 mb-4">
          PIPELINE
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          <PipelineStage
            icon={Database}
            label="INGEST"
            description="Satellites, AIS, buoys, models"
            index={1}
          />
          <PipelineStage
            icon={Cpu}
            label="PROCESS"
            description="Agent-specific analysis"
            index={2}
          />
          <PipelineStage
            icon={Network}
            label="SYNTHESIZE"
            description="Cross-agent correlation"
            index={3}
          />
          <PipelineStage
            icon={FileText}
            label="EXPLAIN"
            description="Evidence + confidence"
            index={4}
          />
          <PipelineStage
            icon={ArrowRight}
            label="ACT"
            description="Recommendations, routes"
            index={5}
          />
        </div>
      </section>

      {/* Agent grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="font-mono text-[10px] tracking-widest text-cyan/60">
            AGENTS · {AI_AGENTS.length} REGISTERED
          </div>
          <Badge variant="success" dot size="sm">
            ALL OPERATIONAL
          </Badge>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {AI_AGENTS.map((agent) => {
            const Icon = AGENT_ICONS[agent.id];
            return (
              <motion.div
                key={agent.id}
                variants={fadeInUp}
                className="group relative rounded-xl border border-white/10 bg-white/[0.015] p-5 hover:border-cyan/30 hover:bg-white/[0.03] transition-colors"
              >
                {/* HUD corners on hover */}
                <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan/0 group-hover:border-cyan/60 transition-colors" />
                <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-cyan/0 group-hover:border-cyan/60 transition-colors" />

                <div className="flex items-start gap-3 mb-3">
                  <div className="h-10 w-10 rounded-lg border border-cyan/30 bg-cyan/10 flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 text-cyan" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] tracking-widest text-cyan/60">
                      {String(agent.id).toUpperCase().replace('-', '·')}
                    </div>
                    <div className="font-display text-base font-semibold text-white">
                      {agent.name}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  {agent.description}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                  <span className="font-mono text-[9px] tracking-widest text-teal/80">
                    ONLINE
                  </span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* Data integrity contract */}
      <section className="mt-14 rounded-xl border border-cyan/20 bg-cyan/[0.03] p-6">
        <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-3">
          DATA CONTRACT
        </div>
        <h3 className="font-display text-xl font-semibold text-white mb-3">
          Every value is traceable
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          ORCA never presents fabricated operational data. Each numeric output
          carries a source, a timestamp, and a confidence score. When a source
          is not connected, the UI shows
          <span className="font-mono text-cyan mx-1">DATA UNAVAILABLE</span>
          rather than placeholders. Recommendations expose an auditable
          reasoning summary — never chain-of-thought.
        </p>
      </section>
    </div>
  );
}

// ---------- Subcomponents ----------

function PipelineStage({
  icon: Icon,
  label,
  description,
  index,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  index: number;
}) {
  return (
    <div className="relative rounded-lg border border-white/10 bg-white/[0.015] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="h-8 w-8 rounded-md border border-cyan/30 bg-cyan/10 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5 text-cyan" />
        </div>
        <span className="font-mono text-[9px] tracking-widest text-cyan/40">
          0{index}
        </span>
      </div>
      <div className="font-mono text-[10px] tracking-widest text-cyan/70">
        {label}
      </div>
      <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
        {description}
      </div>
    </div>
  );
}

// reserved
void cn;