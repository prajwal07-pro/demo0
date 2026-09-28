import * as React from 'react';
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
    description: 'Radiometry, ocean color, and SAR.',
    duration: '45 min',
    level: 'Beginner',
    accent: 'cyan' as const,
  },
  {
    id: 'c2',
    title: 'Understanding PFZ',
    description: 'How SST and chlorophyll form fishing forecasts.',
    duration: '40 min',
    level: 'Intermediate',
    accent: 'teal' as const,
  },
  {
    id: 'c3',
    title: 'Inside ORCA',
    description: 'Architecture walkthrough — data to action.',
    duration: '25 min',
    level: 'Advanced',
    accent: 'violet' as const,
  },
];

/**
 * LearningPreview — home page feature for the Learning Lab.
 */
export function LearningPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      <div className="absolute inset-0 data-grid opacity-[0.1]" aria-hidden="true" />
      <div
        className="absolute bottom-0 left-1/4 h-[400px] w-[600px] rounded-full bg-amber-400/[0.03] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-16 items-start">
          {/* Copy */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            className="lg:sticky lg:top-24"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <span className="h-px w-12 bg-cyan/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
                LEARNING LAB
              </span>
            </motion.div>

            <motion.h2
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
            >
              Fluency in
              <br />
              <span className="text-gradient-cyan">the language of the sea.</span>
            </motion.h2>

            <motion.p
              variants={fadeInUp}
              className="mt-6 text-muted-foreground leading-relaxed"
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
              <StatChip icon={Zap} label="XP" value="1,250" accent="violet" />
              <StatChip icon={Flame} label="STREAK" value="7d" accent="magenta" />
              <StatChip icon={Trophy} label="LEVEL" value="03" accent="amber" />
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

          {/* Course cards */}
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
              className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] px-5 py-4 flex items-center gap-3"
            >
              <BookOpen className="h-4 w-4 text-cyan/70" />
              <span className="text-xs text-muted-foreground">
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
    cyan: { icon: 'border-cyan/30 bg-cyan/10 text-cyan', bar: 'from-cyan/60' },
    teal: { icon: 'border-teal/30 bg-teal/10 text-teal', bar: 'from-teal/60' },
    violet: { icon: 'border-violet/30 bg-violet/10 text-violet', bar: 'from-violet/60' },
  }[accent];

  return (
    <Link
      to="/learning"
      className="group relative flex items-center gap-5 rounded-xl border border-white/10 bg-white/[0.015] p-5 transition-all hover:border-cyan/30 hover:bg-white/[0.03] overflow-hidden"
    >
      <span
        className={cn(
          'absolute top-0 left-0 right-0 h-px bg-gradient-to-r to-transparent opacity-60',
          accentStyles.bar
        )}
      />

      {/* Play button */}
      <div
        className={cn(
          'h-14 w-14 shrink-0 rounded-lg border flex items-center justify-center',
          accentStyles.icon
        )}
      >
        <Play className="h-5 w-5 ml-0.5" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-mono text-[9px] tracking-widest text-cyan/60">
            {level.toUpperCase()}
          </span>
          <span className="text-cyan/40">·</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            {duration}
          </span>
        </div>
        <div className="font-display text-base font-semibold text-white truncate">
          {title}
        </div>
        <div className="mt-1 text-xs text-muted-foreground truncate">
          {description}
        </div>
      </div>

      <ArrowRight className="h-4 w-4 text-cyan/60 shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function StatChip({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent: 'violet' | 'magenta' | 'amber';
}) {
  const accentStyles = {
    violet: 'text-violet border-violet/30 bg-violet/5',
    magenta: 'text-magenta border-magenta/30 bg-magenta/5',
    amber: 'text-amber-400 border-amber-400/30 bg-amber-400/5',
  }[accent];

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.015] p-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
          {label}
        </span>
        <Icon className={cn('h-3 w-3', accentStyles.split(' ')[0])} />
      </div>
      <div className={cn('font-display text-lg font-bold tabular-nums', accentStyles.split(' ')[0])}>
        {value}
      </div>
    </div>
  );
}

// reserved
void Badge;