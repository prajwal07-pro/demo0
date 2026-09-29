import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  Brain,
  ShieldCheck,
  Waves,
  ArrowRight,
  Network,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const REASONS = [
  {
    icon: Satellite,
    title: 'Fusion, not fragmentation',
    description:
      'Satellite radiometry, AIS, buoy telemetry, and numerical models in one coherent operating picture — instead of ten disconnected dashboards.',
    accent: 'cyan' as const,
  },
  {
    icon: Brain,
    title: 'Ten-agent reasoning layer',
    description:
      'Every answer is assembled by specialized agents, each contributing its domain signal with an auditable confidence score.',
    accent: 'violet' as const,
  },
  {
    icon: ShieldCheck,
    title: 'Safety-first intelligence',
    description:
      'Risk and safety agents operate continuously so anomalies surface before they become incidents — never after.',
    accent: 'teal' as const,
  },
  {
    icon: Network,
    title: 'Built for collaboration',
    description:
      'Researchers, fishery analysts, and coast guards share a common language: one map, one dataset, one truth.',
    accent: 'magenta' as const,
  },
];

/**
 * WhyOrca — value proposition section.
 * Continues the cinematic scroll after the hero.
 */
export function WhyOrca() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 data-grid opacity-[0.15]" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[900px] rounded-full bg-cyan/[0.03] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mb-16"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-cyan/40" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
              WHY ORCA
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
          >
            The ocean is a system.
            <br />
            <span className="text-gradient-cyan">So is ORCA.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-5 text-lg text-muted-foreground leading-relaxed"
          >
            Fragmented tools hide risk and waste signal. ORCA was built from
            the ground up as a single fused intelligence layer — because the
            ocean does not respect organisational boundaries.
          </motion.p>
        </motion.div>

        {/* Grid of reasons */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {REASONS.map((r) => (
            <motion.div key={r.title} variants={fadeInUp}>
              <ReasonCard {...r} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom callout */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 rounded-2xl border border-cyan/20 bg-cyan/[0.03] p-8 lg:p-10 relative overflow-hidden"
        >
          <span className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan/60" />
          <span className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan/60" />
          <span className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan/60" />
          <span className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan/60" />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-center gap-6">
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-lg border border-cyan/30 bg-cyan/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-5 w-5 text-cyan" />
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold text-white">
                  Data you can question. Answers you can audit.
                </h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-2xl leading-relaxed">
                  Every numeric output in ORCA carries a source, a timestamp,
                  and a confidence score. When a source is not connected, we
                  say so — we never fabricate values.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] tracking-widest text-cyan/70">
                <span className="h-1.5 w-1.5 rounded-full bg-teal animate-pulse" />
                VERIFIED
              </div>
              <a
                href="/intelligence"
                className="inline-flex items-center gap-2 text-sm font-medium text-cyan hover:gap-3 transition-all"
              >
                Explore architecture
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- Reason Card ----------
function ReasonCard({
  icon: Icon,
  title,
  description,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  accent: 'cyan' | 'violet' | 'teal' | 'magenta';
}) {
  const accentStyles = {
    cyan: {
      border: 'hover:border-cyan/40',
      icon: 'border-cyan/30 bg-cyan/10 text-cyan',
      bar: 'from-cyan/60 via-cyan/20 to-transparent',
    },
    violet: {
      border: 'hover:border-violet/40',
      icon: 'border-violet/30 bg-violet/10 text-violet',
      bar: 'from-violet/60 via-violet/20 to-transparent',
    },
    teal: {
      border: 'hover:border-teal/40',
      icon: 'border-teal/30 bg-teal/10 text-teal',
      bar: 'from-teal/60 via-teal/20 to-transparent',
    },
    magenta: {
      border: 'hover:border-magenta/40',
      icon: 'border-magenta/30 bg-magenta/10 text-magenta',
      bar: 'from-magenta/60 via-magenta/20 to-transparent',
    },
  }[accent];

  return (
    <div
      className={cn(
        'group relative rounded-xl border border-white/10 bg-white/[0.015] p-6 transition-colors overflow-hidden',
        accentStyles.border
      )}
    >
      {/* Top accent bar */}
      <span
        className={cn(
          'absolute top-0 left-0 right-0 h-px bg-gradient-to-r',
          accentStyles.bar
        )}
      />

      <div
        className={cn(
          'h-11 w-11 rounded-lg border flex items-center justify-center mb-5',
          accentStyles.icon
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="font-display text-base font-semibold text-white leading-snug">
        {title}
      </h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>

      {/* Hover shimmer */}
      <span className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-cyan/0 to-transparent group-hover:via-cyan/40 transition-all" />
    </div>
  );
}

// reserved
void Waves;