import { motion } from 'framer-motion';
import {
  Satellite,
  Brain,
  ShieldCheck,
  Network,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const REASONS = [
  {
    icon: Satellite,
    title: 'Fusion, not fragmentation',
    description:
      'Satellite radiometry, AIS, buoy telemetry, and numerical models unified into one operating picture.',
  },
  {
    icon: Brain,
    title: 'Ten-agent reasoning layer',
    description:
      'Every answer is assembled by specialized agents, each contributing its domain signal with an auditable confidence score.',
  },
  {
    icon: ShieldCheck,
    title: 'Safety-first intelligence',
    description:
      'Risk and safety agents run continuously so anomalies surface before they become incidents.',
  },
  {
    icon: Network,
    title: 'Built for collaboration',
    description:
      'One map, one dataset, one truth — shared by researchers, fishery analysts, and coast guards.',
  },
];

/**
 * WhyOrca — light editorial section.
 *
 * Visual role: the homepage begins with the dark cinematic hero. This
 * section is the first bright editorial block, giving the page breathing
 * room and a clear change of rhythm. It uses light surfaces with dark text.
 */
export function WhyOrca() {
  return (
    <section className="relative section-y-lg bg-pearl text-ink overflow-hidden">
      {/* Subtle light grid */}
      <div className="absolute inset-0 data-grid-light opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mb-16"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-ocean/40" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
              WHY ORCA
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
          >
            The ocean is a system.
            <br />
            <span className="text-gradient-navy">So is ORCA.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-6 text-lg text-ink-soft leading-relaxed max-w-2xl"
          >
            Fragmented tools hide risk and waste signal. ORCA is built as a
            single fused intelligence layer — because the ocean does not
            respect organisational boundaries.
          </motion.p>
        </motion.div>

        {/* Reasons grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
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
          className="mt-20 flex flex-col lg:flex-row lg:items-center justify-between gap-8 pt-10 border-t border-ink/10"
        >
          <div className="max-w-2xl">
            <h3 className="font-display text-2xl font-semibold text-ink leading-snug">
              Data you can question. Answers you can audit.
            </h3>
            <p className="mt-3 text-sm text-ink-soft leading-relaxed">
              Every numeric output in ORCA carries a source, a timestamp, and
              a confidence score. When a source is not connected, we say so —
              we never fabricate values.
            </p>
          </div>
          <Link to="/intelligence" className="shrink-0">
            <Button
              variant="outline-light"
              size="lg"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Explore architecture
            </Button>
          </Link>
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
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}) {
  return (
    <div
      className={cn(
        'group relative rounded-2xl border border-ink/10 bg-white p-6 shadow-soft',
        'transition-all duration-300 hover:shadow-soft-md hover:-translate-y-0.5'
      )}
    >
      <div className="h-11 w-11 rounded-xl border border-ocean/15 bg-ice flex items-center justify-center mb-5">
        <Icon className="h-5 w-5 text-ocean" />
      </div>
      <h3 className="font-display text-base font-semibold text-ink leading-snug">
        {title}
      </h3>
      <p className="mt-3 text-sm text-ink-soft leading-relaxed">
        {description}
      </p>
    </div>
  );
}