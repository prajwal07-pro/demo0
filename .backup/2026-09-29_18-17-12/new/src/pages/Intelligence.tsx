import type { ComponentType } from 'react';
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
  CheckCircle2,
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { AI_AGENTS, type AgentId } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const AGENT_ICONS: Record<AgentId, ComponentType<{ className?: string }>> = {
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

const PIPELINE = [
  { icon: Database, label: 'Ingest', description: 'Satellites, AIS, buoys, models' },
  { icon: Cpu, label: 'Process', description: 'Agent-specific analysis' },
  { icon: Network, label: 'Synthesize', description: 'Cross-agent correlation' },
  { icon: FileText, label: 'Explain', description: 'Evidence + confidence' },
  { icon: ArrowRight, label: 'Act', description: 'Recommendations, routes' },
];

export default function Intelligence() {
  return (
    <div className="relative bg-pearl text-ink">
      {/* ---------- Hero ---------- */}
      <section className="relative pt-16 pb-14 lg:pt-24 lg:pb-20 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                INTELLIGENCE ARCHITECTURE
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-6xl font-bold tracking-tight text-ink leading-[1.05] text-balance max-w-3xl"
            >
              Ten specialized agents,
              <br />
              <span className="text-gradient-navy">one unified answer.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-6 max-w-2xl text-lg text-ink-soft leading-relaxed"
            >
              Every ORCA query flows through a coordinated team of AI agents.
              Each contributes its domain signal; the platform synthesizes
              them into one auditable recommendation — with sources,
              timestamps, and confidence attached.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ---------- Pipeline ---------- */}
      <section className="relative py-14 lg:py-16 border-b border-ink/[0.06]">
        <div className="relative mx-auto max-w-6xl px-6">
          <div className="font-mono text-[10px] tracking-[0.3em] text-ocean mb-6">
            PIPELINE
          </div>
          <motion.ol
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            {PIPELINE.map((stage, i) => (
              <motion.li
                key={stage.label}
                variants={fadeInUp}
                className="relative rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-lg bg-ice border border-ocean/15 flex items-center justify-center">
                    <stage.icon className="h-4 w-4 text-ocean" />
                  </div>
                  <span className="font-mono text-[9px] tracking-widest text-mist">
                    0{i + 1}
                  </span>
                </div>
                <div className="font-display text-sm font-semibold text-ink">
                  {stage.label}
                </div>
                <div className="mt-1 text-xs text-ink-soft leading-snug">
                  {stage.description}
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </div>
      </section>

      {/* ---------- Agents grid ---------- */}
      <section className="relative py-16 lg:py-20">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-mono text-[10px] tracking-[0.3em] text-ocean mb-2">
                AGENT REGISTRY
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink">
                {AI_AGENTS.length} active agents
              </h2>
            </div>
            <Badge variant="light-success" dot size="sm">
              All operational
            </Badge>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
          >
            {AI_AGENTS.map((agent) => {
              const Icon = AGENT_ICONS[agent.id];
              return (
                <motion.div
                  key={agent.id}
                  variants={fadeInUp}
                  className="group relative rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft transition-all hover:shadow-soft-md hover:-translate-y-0.5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-10 w-10 rounded-lg bg-ice border border-ocean/15 flex items-center justify-center">
                      <Icon className="h-4 w-4 text-ocean" />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                      <span className="font-mono text-[9px] tracking-widest text-success-deep">
                        ONLINE
                      </span>
                    </div>
                  </div>
                  <div className="font-mono text-[9px] tracking-widest text-ocean/70 mb-1">
                    {String(agent.id).toUpperCase().replace('-', '·')}
                  </div>
                  <div className="font-display text-sm font-semibold text-ink leading-snug">
                    {agent.name}
                  </div>
                  <p className="mt-2 text-xs text-ink-soft leading-relaxed line-clamp-3">
                    {agent.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ---------- Data contract ---------- */}
      <section className="relative pb-20 lg:pb-28">
        <div className="relative mx-auto max-w-6xl px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="rounded-3xl border border-ink/[0.08] bg-white p-8 lg:p-12 shadow-soft"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                DATA CONTRACT
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-2xl md:text-3xl font-bold tracking-tight text-ink leading-snug max-w-2xl"
            >
              Every value is traceable.
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-5 text-base text-ink-soft leading-relaxed max-w-3xl"
            >
              ORCA never presents fabricated operational data. Each numeric
              output carries a source, a timestamp, and a confidence score.
              When a source is not connected, the UI shows a clear unavailable
              state instead of placeholders. Recommendations expose an
              auditable reasoning summary — never chain-of-thought.
            </motion.p>

            <motion.ul
              variants={fadeInUp}
              className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
            >
              {[
                'Named data providers on every layer',
                'Timestamps on every observation',
                'Confidence scores on every recommendation',
                'No synthetic or placeholder values',
                'Auditable reasoning summaries',
                'Fail-safe UI when sources are unreachable',
              ].map((t) => (
                <li
                  key={t}
                  className="flex items-start gap-3 rounded-xl border border-ink/[0.06] bg-pearl-soft px-4 py-3"
                >
                  <CheckCircle2 className="h-4 w-4 text-ocean shrink-0 mt-0.5" />
                  <span className="text-sm text-ink-soft leading-snug">{t}</span>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </div>
      </section>
    </div>
  );
}