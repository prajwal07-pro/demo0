import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Play,
  Zap,
  Flame,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const FEATURED_COURSES = [
  {
    id: 'c1',
    title: 'How Satellites Read the Ocean',
    description: 'Radiometry, ocean color, and SAR — how orbital platforms measure the sea surface.',
    duration: '45 min',
    level: 'Beginner',
    accent: 'cyan' as const,
  },
  {
    id: 'c2',
    title: 'Understanding PFZ',
    description: 'How SST and chlorophyll combine into operational fishing forecasts.',
    duration: '40 min',
    level: 'Intermediate',
    accent: 'teal' as const,
  },
  {
    id: 'c3',
    title: 'Inside ORCA',
    description: 'Architecture walkthrough — from raw data to actionable intelligence.',
    duration: '25 min',
    level: 'Advanced',
    accent: 'violet' as const,
  },
];

/**
 * LearningPreview — light editorial section.
 *
 * Visual role: uses a bright, friendly treatment. Cards have soft borders
 * and clear typography so the page does not feel like another dark dashboard.
 */
export function LearningPreview() {
  return (
    <section className="relative section-y bg-pearl text-ink overflow-hidden">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-14 lg:gap-20 items-start">
          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:sticky lg:top-24"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                LEARNING LAB
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance"
            >
              Fluency in
              <br />
              <span className="text-gradient-navy">the language of the sea.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-lg text-ink-soft leading-relaxed"
            >
              Short, interactive lessons — no fluff. Build real understanding
              of how satellites read the ocean, how AIS reveals vessel intent,
              and how PFZ forecasts shape decisions at sea.
            </motion.p>

            {/* Progress stats */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 grid grid-cols-3 gap-3 max-w-sm"
            >
              <StatChip icon={Zap} label="XP" value="1,250" tone="violet" />
              <StatChip icon={Flame} label="STREAK" value="7d" tone="accent" />
              <StatChip icon={Trophy} label="LEVEL" value="03" tone="warning" />
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-9">
              <Link to="/learning">
                <Button
                  size="lg"
                  leftIcon={<GraduationCap className="h-4 w-4" />}
                  rightIcon={<ArrowRight className="h-4 w-4" />}
                >
                  Open Learning Lab
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Courses list */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="flex flex-col gap-4"
          >
            {FEATURED_COURSES.map((c) => (
              <motion.div key={c.id} variants={fadeInUp}>
                <CourseRow {...c} />
              </motion.div>
            ))}

            <motion.div
              variants={fadeInUp}
              className="rounded-2xl border border-dashed border-ink/15 bg-white/50 px-5 py-5 flex items-center gap-3"
            >
              <BookOpen className="h-4 w-4 text-ocean" />
              <span className="text-sm text-ink-soft">
                More courses coming — including ARGO, SAR, and seasonal
                forecasting.
              </span>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function CourseRow({
  title,
  description,
  duration,
  level,
  accent,
}: {
  title: string;
  description: string;
  duration: string;
  level: string;
  accent: 'cyan' | 'teal' | 'violet';
}) {
  const accentStyles = {
    cyan: { icon: 'border-cyan/30 bg-cyan/10 text-cyan-dark', bar: 'from-cyan-dark' },
    teal: { icon: 'border-teal/30 bg-teal/10 text-teal-dark', bar: 'from-teal-dark' },
    violet: { icon: 'border-violet/30 bg-violet/10 text-violet-dark', bar: 'from-violet-dark' },
  }[accent];

  return (
    <Link
      to="/learning"
      className="group relative flex items-center gap-5 rounded-2xl border border-ink/10 bg-white p-5 shadow-soft transition-all hover:shadow-soft-md hover:-translate-y-0.5 overflow-hidden"
    >
      <span
        className={cn(
          'absolute top-0 left-0 right-0 h-px bg-gradient-to-r to-transparent opacity-70',
          accentStyles.bar
        )}
      />

      <div
        className={cn(
          'h-14 w-14 shrink-0 rounded-xl border flex items-center justify-center',
          accentStyles.icon
        )}
      >
        <Play className="h-5 w-5 ml-0.5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] tracking-widest text-ocean">
            {level.toUpperCase()}
          </span>
          <span className="text-ink/30">·</span>
          <span className="font-mono text-[9px] tracking-widest text-mist-deep">
            {duration}
          </span>
        </div>
        <div className="font-display text-base font-semibold text-ink truncate">
          {title}
        </div>
        <div className="mt-1 text-sm text-ink-soft truncate">
          {description}
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-ocean shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: 'violet' | 'accent' | 'warning';
}) {
  const toneStyles = {
    violet: 'text-violet-dark',
    accent: 'text-accent-deep',
    warning: 'text-warning-deep',
  }[tone];

  return (
    <div className="rounded-xl border border-ink/10 bg-white p-3 shadow-soft">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {label}
        </span>
        <Icon className={cn('h-3 w-3', toneStyles)} />
      </div>
      <div className={cn('font-display text-lg font-bold tabular-nums', toneStyles)}>
        {value}
      </div>
    </div>
  );
}

// reserved — Badge imported for future use
void Badge;