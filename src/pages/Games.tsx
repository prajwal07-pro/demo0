import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Gamepad2,
  Waves,
  Navigation,
  Fish,
  Shield,
  Target,
  Trophy,
  Users,
  Play,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { GAME_MODES } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';

const GAME_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  'catch-the-front': Waves,
  'route-the-vessel': Navigation,
  'spot-the-pfz': Fish,
  'save-the-fleet': Shield,
  'mission-ocean': Target,
};

interface LeaderEntry {
  rank: number;
  name: string;
  xp: number;
  region: string;
}

const LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: 'Dr. A. Mehta', xp: 18420, region: 'IN · Mumbai' },
  { rank: 2, name: 'R. Krishnan', xp: 16220, region: 'IN · Chennai' },
  { rank: 3, name: 'S. Iyer', xp: 14890, region: 'IN · Kochi' },
  { rank: 4, name: 'P. Rao', xp: 12750, region: 'IN · Visakhapatnam' },
  { rank: 5, name: 'M. Banerjee', xp: 11200, region: 'IN · Kolkata' },
];

/**
 * Games — interactive marine mini-experiences.
 */
export default function Games() {
  const [active, setActive] = React.useState<string | null>(null);

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
            MODULE · GAMEPLAY
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Marine Games
        </motion.h1>
        <motion.p variants={fadeInUp} className="mt-3 max-w-2xl text-muted-foreground">
          Sharpen your marine intuition with short, real interactive
          challenges. Score XP, climb the leaderboard, and learn through play.
        </motion.p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Game modes */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {GAME_MODES.map((g, i) => {
            const Icon = GAME_ICONS[g.id] ?? Gamepad2;
            const isActive = active === g.id;
            return (
              <motion.div key={g.id} variants={fadeInUp}>
                <button
                  onClick={() => setActive(g.id)}
                  className={cn(
                    'group relative w-full text-left rounded-xl border overflow-hidden transition-all',
                    isActive
                      ? 'border-cyan/50 bg-cyan/[0.05] shadow-glow-cyan'
                      : 'border-white/10 bg-white/[0.015] hover:border-cyan/30 hover:bg-white/[0.03]'
                  )}
                >
                  <span className="absolute top-0 left-0 w-3 h-3 border-t border-l border-cyan/0 group-hover:border-cyan/60 transition-colors" />
                  <span className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-cyan/0 group-hover:border-cyan/60 transition-colors" />

                  <div className="relative h-40 bg-gradient-to-br from-cyan/[0.06] via-transparent to-violet/[0.06] p-5 flex flex-col justify-between">
                    <div className="data-grid absolute inset-0 opacity-20" />
                    <div className="relative flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-cyan/30 bg-cyan/10">
                        <Icon className="h-5 w-5 text-cyan" />
                      </div>
                      <span className="font-mono text-[9px] tracking-widest text-cyan/50">
                        GAME · {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="relative">
                      <div className="font-display text-lg font-semibold text-white">
                        {g.label}
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground leading-snug line-clamp-2">
                        {g.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                    <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-amber-400" />
                        +150 XP
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        1.2K PLAYERS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-cyan text-xs font-medium">
                      <Play className="h-3 w-3" />
                      PLAY
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Leaderboard */}
        <aside className="rounded-xl border border-white/10 bg-white/[0.015] p-5 h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 text-amber-400" />
            <div>
              <div className="font-mono text-[9px] tracking-widest text-cyan/70">
                LEADERBOARD
              </div>
              <div className="font-display text-sm font-semibold text-white">
                Top Operators
              </div>
            </div>
          </div>

          <ul className="flex flex-col gap-2">
            {LEADERBOARD.map((entry) => (
              <li
                key={entry.rank}
                className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.015] px-3 py-2.5"
              >
                <div
                  className={cn(
                    'h-7 w-7 rounded-md flex items-center justify-center font-mono text-xs font-bold',
                    entry.rank === 1 &&
                      'bg-amber-400/20 text-amber-400 border border-amber-400/40',
                    entry.rank === 2 &&
                      'bg-slate-300/20 text-slate-200 border border-slate-300/30',
                    entry.rank === 3 &&
                      'bg-amber-700/20 text-amber-600 border border-amber-700/30',
                    entry.rank > 3 && 'bg-white/5 text-muted-foreground'
                  )}
                >
                  {entry.rank}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-white truncate">
                    {entry.name}
                  </div>
                  <div className="font-mono text-[9px] text-muted-foreground truncate">
                    {entry.region}
                  </div>
                </div>
                <div className="font-mono text-[11px] font-semibold text-cyan tabular-nums">
                  {entry.xp.toLocaleString()}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 pt-5 border-t border-white/5">
            <div className="rounded-lg border border-dashed border-white/10 p-3 text-center">
              <Lock className="h-3.5 w-3.5 text-muted-foreground/60 mx-auto mb-2" />
              <p className="font-mono text-[9px] tracking-widest text-muted-foreground">
                GLOBAL RANKINGS
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground/70">
                Unlock at Level 5
              </p>
            </div>
          </div>

          <div className="mt-4">
            <Button variant="secondary" size="sm" fullWidth>
              View My Stats
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}