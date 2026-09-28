import * as React from 'react';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  Play,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  CheckCircle2,
  Lock,
  Award,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ACHIEVEMENTS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: number;
  progress: number;
  accent: 'cyan' | 'teal' | 'violet' | 'magenta' | 'amber';
}

const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'How Satellites Read the Ocean',
    description:
      'Radiometry, ocean color, and SAR — how orbital platforms measure the sea surface.',
    duration: '45 min',
    level: 'Beginner',
    modules: 6,
    progress: 0.35,
    accent: 'cyan',
  },
  {
    id: 'c2',
    title: 'How AIS Works',
    description:
      'The physics and protocol behind vessel tracking, and how to interpret AIS anomalies.',
    duration: '30 min',
    level: 'Beginner',
    modules: 4,
    progress: 0.8,
    accent: 'teal',
  },
  {
    id: 'c3',
    title: 'Understanding SST',
    description:
      'Sea surface temperature fields, fronts, and their role in fisheries and weather.',
    duration: '50 min',
    level: 'Intermediate',
    modules: 7,
    progress: 0.1,
    accent: 'violet',
  },
  {
    id: 'c4',
    title: 'Understanding PFZ',
    description:
      'Potential Fishing Zones: how ocean color, SST, and currents combine into forecasts.',
    duration: '40 min',
    level: 'Intermediate',
    modules: 5,
    progress: 0,
    accent: 'magenta',
  },
  {
    id: 'c5',
    title: 'Inside ORCA',
    description:
      'Architecture walkthrough: how ten agents turn raw data into actionable intelligence.',
    duration: '25 min',
    level: 'Advanced',
    modules: 3,
    progress: 0,
    accent: 'amber',
  },
];

/**
 * Learning — Gen-Z friendly but scientifically grounded.
 * Tracks XP, streaks, achievements, and courses with real progression state.
 */
export default function Learning() {
  // XP state will come from the store in a later phase; using local state for now
  const [xp] = React.useState(1250);
  const [streak] = React.useState(7);
  const [level] = React.useState(3);
  const [levelProgress] = React.useState(0.42);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · LEARNING
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Learning Lab
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-2xl text-muted-foreground">
          Short, interactive lessons that build real marine-data fluency.
          Earn XP, unlock achievements, and progress toward the ORCA Operator title.
        </motion.p>
      </motion.div>

      {/* Progress strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        <div className="rounded-xl border border-cyan/20 bg-cyan/[0.03] p-5 relative overflow-hidden">
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan/60" />
          <div className="flex items-center justify-between mb-3">
            <span className="telemetry-text text-[10px]">LEVEL</span>
            <Award className="h-4 w-4 text-cyan" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white">
              {level.toString().padStart(2, '0')}
            </span>
            <span className="font-mono text-[10px] text-cyan/70">
              OCEAN EXPLORER
            </span>
          </div>
          <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-teal"
              style={{ width: `${levelProgress * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="telemetry-text text-[10px]">EXPERIENCE</span>
            <Zap className="h-4 w-4 text-violet" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {xp.toLocaleString()}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">XP</span>
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-wider text-violet/70">
            +250 TO NEXT LEVEL
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.015] p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="telemetry-text text-[10px]">STREAK</span>
            <Flame className="h-4 w-4 text-magenta" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-display text-3xl font-bold text-white tabular-nums">
              {streak}
            </span>
            <span className="font-mono text-[10px] text-muted-foreground">DAYS</span>
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-wider text-magenta/70">
            KEEP IT GOING
          </p>
        </div>
      </div>

      {/* Courses */}
      <section className="mb-14">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-cyan" />
            <div className="font-mono text-[10px] tracking-widest text-cyan/70">
              COURSES · {COURSES.length}
            </div>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {COURSES.map((c) => (
            <motion.div key={c.id} variants={fadeInUp}>
              <CourseCard course={c} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Achievements */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div className="font-mono text-[10px] tracking-widest text-cyan/70">
              ACHIEVEMENTS · {ACHIEVEMENTS.length}
            </div>
          </div>
          <Badge variant="neutral" size="sm">
            2 / {ACHIEVEMENTS.length} UNLOCKED
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {ACHIEVEMENTS.map((a, i) => {
            const unlocked = i < 2; // placeholder
            return (
              <div
                key={a.id}
                className={cn(
                  'rounded-xl border p-4 transition-colors',
                  unlocked
                    ? 'border-amber-400/30 bg-amber-400/[0.03]'
                    : 'border-white/5 bg-white/[0.01]'
                )}
              >
                <div
                  className={cn(
                    'h-10 w-10 rounded-lg border flex items-center justify-center mb-3',
                    unlocked
                      ? 'border-amber-400/40 bg-amber-400/10'
                      : 'border-white/10 bg-white/5'
                  )}
                >
                  {unlocked ? (
                    <Trophy className="h-4 w-4 text-amber-400" />
                  ) : (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <div className="font-display text-sm font-semibold text-white">
                  {a.label}
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  {a.description}
                </p>
                <div className="mt-3 font-mono text-[9px] tracking-widest text-cyan/60">
                  +{a.xp} XP
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const accentColor = {
    cyan: 'from-cyan/20 to-transparent border-cyan/30',
    teal: 'from-teal/20 to-transparent border-teal/30',
    violet: 'from-violet/20 to-transparent border-violet/30',
    magenta: 'from-magenta/20 to-transparent border-magenta/30',
    amber: 'from-amber-400/20 to-transparent border-amber-400/30',
  }[course.accent];

  const progressPct = Math.round(course.progress * 100);

  return (
    <div className="group rounded-xl border border-white/10 bg-white/[0.015] overflow-hidden hover:border-cyan/30 transition-colors">
      {/* Cover */}
      <div
        className={cn(
          'relative h-32 bg-gradient-to-br flex items-center justify-center border-b',
          accentColor
        )}
      >
        <div className="absolute inset-0 data-grid opacity-30" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-abyss/60 backdrop-blur-md">
          <Play className="h-5 w-5 text-cyan ml-0.5" />
        </div>
        <div className="absolute top-3 right-3">
          <Badge variant="glass" size="sm">
            {course.duration}
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[9px] tracking-widest text-cyan/60">
            {course.level.toUpperCase()}
          </span>
          <span className="text-cyan/40">·</span>
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            {course.modules} MODULES
          </span>
        </div>
        <h3 className="font-display text-base font-semibold text-white leading-snug">
          {course.title}
        </h3>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {course.description}
        </p>

        {/* Progress */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              PROGRESS
            </span>
            <span className="font-mono text-[9px] text-cyan/70">
              {progressPct}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan to-teal"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <Button size="sm" variant={progressPct > 0 ? 'primary' : 'secondary'} fullWidth>
            {progressPct === 0 ? 'Start Course' : progressPct >= 100 ? 'Review' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// reserved for future use
void CheckCircle2;
void Target;
void GraduationCap;