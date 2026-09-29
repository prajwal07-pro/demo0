import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  BookOpen,
  Trophy,
  Flame,
  Zap,
  Lock,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Progress } from '@/components/ui/Progress';
import { ACHIEVEMENTS } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAppStore } from '@/store/useAppStore';

interface CourseModule {
  id: string;
  title: string;
  duration: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: number;
  moduleList: CourseModule[];
  accent: 'cyan' | 'teal' | 'violet' | 'accent' | 'warning';
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
    moduleList: [
      { id: 'c1m1', title: 'Orbits and revisit time', duration: '8 min' },
      { id: 'c1m2', title: 'Radiometry fundamentals', duration: '7 min' },
      { id: 'c1m3', title: 'Ocean color theory', duration: '9 min' },
      { id: 'c1m4', title: 'SAR for sea state', duration: '8 min' },
      { id: 'c1m5', title: 'Clouds and gaps', duration: '6 min' },
      { id: 'c1m6', title: 'Review and quiz', duration: '7 min' },
    ],
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
    moduleList: [
      { id: 'c2m1', title: 'VHF and message types', duration: '8 min' },
      { id: 'c2m2', title: 'Position reporting', duration: '7 min' },
      { id: 'c2m3', title: 'AIS gaps and spoofing', duration: '8 min' },
      { id: 'c2m4', title: 'Practical interpretation', duration: '7 min' },
    ],
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
    moduleList: [
      { id: 'c3m1', title: 'What is SST?', duration: '6 min' },
      { id: 'c3m2', title: 'Thermal fronts', duration: '8 min' },
      { id: 'c3m3', title: 'Upwelling zones', duration: '7 min' },
      { id: 'c3m4', title: 'Anomaly detection', duration: '7 min' },
      { id: 'c3m5', title: 'SST and fisheries', duration: '8 min' },
      { id: 'c3m6', title: 'SST and weather', duration: '7 min' },
      { id: 'c3m7', title: 'Review and quiz', duration: '7 min' },
    ],
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
    moduleList: [
      { id: 'c4m1', title: 'Introduction to PFZ', duration: '7 min' },
      { id: 'c4m2', title: 'Inputs and models', duration: '9 min' },
      { id: 'c4m3', title: 'Reading a forecast', duration: '8 min' },
      { id: 'c4m4', title: 'Verification', duration: '8 min' },
      { id: 'c4m5', title: 'Operational use', duration: '8 min' },
    ],
    accent: 'accent',
  },
  {
    id: 'c5',
    title: 'Inside ORCA',
    description:
      'Architecture walkthrough: how ten agents turn raw data into actionable intelligence.',
    duration: '25 min',
    level: 'Advanced',
    modules: 3,
    moduleList: [
      { id: 'c5m1', title: 'The data contract', duration: '8 min' },
      { id: 'c5m2', title: 'Agent coordination', duration: '9 min' },
      { id: 'c5m3', title: 'Audit and explanation', duration: '8 min' },
    ],
    accent: 'warning',
  },
];

export default function Learning() {
  const [xp] = React.useState(1250);
  const [streak] = React.useState(7);
  const [level] = React.useState(3);
  const [levelProgress] = React.useState(0.42);
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null);
  const [unlockedAchievements, setUnlockedAchievements] = React.useState<string[]>([
    'ocean-explorer',
    'ais-navigator',
  ]);

  const showToast = useAppStore((s) => s.showToast);

  // Course progress is deterministic per course for this frontend phase.
  const courseProgress: Record<string, number> = {
    c1: 0.35,
    c2: 0.8,
    c3: 0.1,
    c4: 0,
    c5: 0,
  };

  const handleStartCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleResumeModule = (course: Course, moduleId: string) => {
    showToast(`Opening module ${moduleId} in "${course.title}" (demo)`, 'info');
  };

  const handleToggleAchievement = (achievementId: string) => {
    setUnlockedAchievements((prev) =>
      prev.includes(achievementId)
        ? prev.filter((id) => id !== achievementId)
        : [...prev, achievementId]
    );
  };

  return (
    <div className="relative bg-pearl text-ink">
      {/* Header */}
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                LEARNING LAB
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Build real fluency in
              <br />
              <span className="text-gradient-navy">the language of the sea.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Short interactive lessons — no fluff. Earn XP, unlock
              achievements, and progress toward the ORCA Operator title.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Progress strip */}
      <section className="relative py-8 border-b border-ink/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ProgressCard
              label="LEVEL"
              value={level.toString().padStart(2, '0')}
              subtitle="Ocean Explorer"
              icon={Award}
              progress={levelProgress}
              tone="ocean"
            />
            <ProgressCard
              label="EXPERIENCE"
              value={xp.toLocaleString()}
              subtitle="+250 to next level"
              icon={Zap}
              tone="violet"
            />
            <ProgressCard
              label="STREAK"
              value={streak.toString()}
              subtitle="Keep it going"
              icon={Flame}
              tone="accent"
            />
          </div>
        </div>
      </section>

      {/* Courses */}
      <section className="relative py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-ocean" />
              <span className="font-mono text-[10px] tracking-widest text-ocean">
                COURSES · {COURSES.length}
              </span>
            </div>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {COURSES.map((c) => (
              <motion.div key={c.id} variants={fadeInUp}>
                <CourseCard
                  course={c}
                  progress={courseProgress[c.id] ?? 0}
                  onStart={() => handleStartCourse(c)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Achievements */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-warning-deep" />
              <span className="font-mono text-[10px] tracking-widest text-ocean">
                ACHIEVEMENTS · {ACHIEVEMENTS.length}
              </span>
            </div>
            <span className="font-mono text-[10px] tracking-widest text-mist-deep">
              {unlockedAchievements.length} / {ACHIEVEMENTS.length} UNLOCKED
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {ACHIEVEMENTS.map((a) => {
              const unlocked = unlockedAchievements.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => handleToggleAchievement(a.id)}
                  className={cn(
                    'text-left rounded-2xl border p-5 transition-all shadow-soft cursor-pointer',
                    unlocked
                      ? 'border-warning/30 bg-white hover:-translate-y-0.5'
                      : 'border-ink/[0.06] bg-white/50 opacity-70 hover:opacity-100'
                  )}
                  aria-pressed={unlocked}
                >
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg border flex items-center justify-center mb-4',
                      unlocked
                        ? 'border-warning/40 bg-warning/[0.12]'
                        : 'border-ink/10 bg-pearl-soft'
                    )}
                  >
                    {unlocked ? (
                      <Trophy className="h-4 w-4 text-warning-deep" />
                    ) : (
                      <Lock className="h-4 w-4 text-mist-deep" />
                    )}
                  </div>
                  <div className="font-display text-sm font-semibold text-ink">
                    {a.label}
                  </div>
                  <p className="mt-1.5 text-[11px] text-ink-soft leading-snug">
                    {a.description}
                  </p>
                  <div className="mt-3 font-mono text-[9px] tracking-widest text-ocean">
                    +{a.xp} XP
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Course detail dialog */}
      <Dialog
        open={selectedCourse !== null}
        onClose={() => setSelectedCourse(null)}
        title={selectedCourse?.title}
        description={selectedCourse?.description}
        size="lg"
        footer={
          <>
            <Button variant="ghost-light" size="md" onClick={() => setSelectedCourse(null)}>
              Close
            </Button>
            <Button
              size="md"
              leftIcon={<Play className="h-3.5 w-3.5" />}
              onClick={() => {
                if (selectedCourse) {
                  handleResumeModule(selectedCourse, selectedCourse.moduleList[0]?.id ?? '');
                }
              }}
            >
              Start Course
            </Button>
          </>
        }
      >
        {selectedCourse && (
          <div className="flex flex-col gap-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-mono text-[10px] tracking-widest text-ocean">
                {selectedCourse.level.toUpperCase()}
              </span>
              <span className="text-ink/20">·</span>
              <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                {selectedCourse.duration}
              </span>
              <span className="text-ink/20">·</span>
              <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                {selectedCourse.modules} MODULES
              </span>
            </div>

            <div>
              <div className="font-mono text-[10px] tracking-widest text-ocean mb-2">
                MODULES
              </div>
              <ul className="flex flex-col gap-2">
                {selectedCourse.moduleList.map((m, i) => (
                  <li key={m.id}>
                    <button
                      type="button"
                      onClick={() => handleResumeModule(selectedCourse, m.id)}
                      className="w-full flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-pearl-soft px-4 py-3 text-left hover:border-ocean/40 transition-colors"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-ice text-ocean font-mono text-[10px]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm text-ink truncate">
                          {m.title}
                        </span>
                        <span className="block font-mono text-[10px] text-mist-deep">
                          {m.duration}
                        </span>
                      </span>
                      <Play className="h-3.5 w-3.5 text-ocean shrink-0" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

function ProgressCard({
  label,
  value,
  subtitle,
  icon: Icon,
  progress,
  tone,
}: {
  label: string;
  value: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  progress?: number;
  tone: 'ocean' | 'violet' | 'accent';
}) {
  const toneStyles = {
    ocean: 'text-ocean border-ocean/25 bg-ocean/[0.06]',
    violet: 'text-violet-dark border-violet/25 bg-violet/[0.06]',
    accent: 'text-accent-deep border-accent/25 bg-accent/[0.06]',
  }[tone];

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {label}
        </span>
        <div className={cn('h-8 w-8 rounded-lg border flex items-center justify-center', toneStyles)}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="font-display text-3xl font-bold text-ink tabular-nums">
        {value}
      </div>
      <div className="mt-2 text-xs text-ink-soft">{subtitle}</div>
      {progress !== undefined && (
        <div className="mt-4">
          <Progress value={progress * 100} size="sm" tone="ocean" />
        </div>
      )}
    </div>
  );
}

function CourseCard({
  course,
  progress,
  onStart,
}: {
  course: Course;
  progress: number;
  onStart: () => void;
}) {
  const accentColor = {
    cyan: 'from-cyan/15 to-transparent border-cyan/25',
    teal: 'from-teal/15 to-transparent border-teal/25',
    violet: 'from-violet/15 to-transparent border-violet/25',
    accent: 'from-accent/15 to-transparent border-accent/25',
    warning: 'from-warning/20 to-transparent border-warning/30',
  }[course.accent];

  const progressPct = Math.round(progress * 100);

  return (
    <button
      type="button"
      onClick={onStart}
      className="group w-full text-left rounded-2xl border border-ink/[0.08] bg-white shadow-soft overflow-hidden transition-all hover:shadow-soft-md hover:-translate-y-0.5"
    >
      <div
        className={cn(
          'relative h-32 bg-gradient-to-br flex items-center justify-center border-b',
          accentColor
        )}
      >
        <div className="absolute inset-0 data-grid-light opacity-40" />
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white bg-white/80 backdrop-blur-md shadow-soft">
          <Play className="h-5 w-5 text-ocean ml-0.5" />
        </div>
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center rounded-full bg-white/90 border border-ink/10 px-2.5 py-1 font-mono text-[9px] tracking-widest text-ink-soft">
            {course.duration}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-mono text-[9px] tracking-widest text-ocean">
            {course.level.toUpperCase()}
          </span>
          <span className="text-ink/20">·</span>
          <span className="font-mono text-[9px] tracking-widest text-mist-deep">
            {course.modules} MODULES
          </span>
        </div>
        <h3 className="font-display text-base font-semibold text-ink leading-snug">
          {course.title}
        </h3>
        <p className="mt-2 text-xs text-ink-soft leading-relaxed line-clamp-2">
          {course.description}
        </p>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] tracking-widest text-mist-deep">
              PROGRESS
            </span>
            <span className="font-mono text-[9px] text-ocean">
              {progressPct}%
            </span>
          </div>
          <div className="h-1 rounded-full bg-ink/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-ocean to-cyan-dark"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-ocean">
          {progressPct === 0 ? 'START' : progressPct >= 100 ? 'REVIEW' : 'CONTINUE'}
          <CheckCircle2 className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
}