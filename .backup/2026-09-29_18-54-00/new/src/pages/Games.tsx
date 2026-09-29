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
import { Dialog } from '@/components/ui/Dialog';
import { GAME_MODES } from '@/lib/constants';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAppStore } from '@/store/useAppStore';

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

// Games that have a working frontend demo. Others show a "coming soon" state.
const PLAYABLE_GAME_IDS = new Set<string>(['catch-the-front']);

export default function Games() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const showToast = useAppStore((s) => s.showToast);

  const selected = GAME_MODES.find((g) => g.id === selectedId) ?? null;
  const isPlayable = selected ? PLAYABLE_GAME_IDS.has(selected.id) : false;

  const handlePlay = () => {
    if (!selected) return;
    if (isPlayable) {
      showToast(`Starting "${selected.label}" (demo).`, 'success');
      setSelectedId(null);
    } else {
      showToast(`"${selected.label}" is in development and not yet playable.`, 'info');
    }
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
                MARINE GAMES
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Learn by playing,
              <br />
              <span className="text-gradient-navy">not by memorising.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Short interactive challenges that build real marine intuition.
              Score XP, unlock achievements, and climb the operator leaderboard.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="relative py-10 pb-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
            {/* Game modes */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-5"
            >
              {GAME_MODES.map((g, i) => {
                const Icon = GAME_ICONS[g.id] ?? Gamepad2;
                const isPlayable = PLAYABLE_GAME_IDS.has(g.id);
                return (
                  <motion.div key={g.id} variants={fadeInUp}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(g.id)}
                      className="group relative w-full text-left rounded-2xl border overflow-hidden transition-all shadow-soft hover:shadow-soft-md border-ink/[0.08] bg-white hover:-translate-y-0.5"
                    >
                      <div className="relative h-36 bg-gradient-to-br from-cyan/[0.12] via-transparent to-violet/[0.10] p-5 flex flex-col justify-between">
                        <div className="absolute inset-0 data-grid-light opacity-40" />
                        <div className="relative flex items-start justify-between">
                          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-ocean/25 bg-white shadow-soft">
                            <Icon className="h-5 w-5 text-ocean" />
                          </div>
                          <span className="font-mono text-[9px] tracking-widest text-ocean/60">
                            GAME · {String(i + 1).padStart(2, '0')}
                          </span>
                        </div>
                        <div className="relative">
                          <div className="font-display text-lg font-semibold text-ink">
                            {g.label}
                          </div>
                          <p className="mt-1 text-xs text-ink-soft leading-snug line-clamp-2">
                            {g.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between px-5 py-3 border-t border-ink/[0.06]">
                        <div className="flex items-center gap-3 font-mono text-[10px] tracking-wider text-ink-soft">
                          <span className="flex items-center gap-1">
                            <Trophy className="h-3 w-3 text-warning-deep" />
                            +150 XP
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            1.2K PLAYERS
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-ocean text-xs font-medium">
                          {isPlayable ? (
                            <>
                              <Play className="h-3 w-3" />
                              PLAY
                            </>
                          ) : (
                            <>
                              <Lock className="h-3 w-3" />
                              PREVIEW
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Leaderboard */}
            <aside className="rounded-2xl border border-ink/[0.08] bg-white p-5 shadow-soft h-fit">
              <div className="flex items-center gap-2 mb-5">
                <Trophy className="h-4 w-4 text-warning-deep" />
                <div>
                  <div className="font-mono text-[9px] tracking-widest text-ocean/70">
                    LEADERBOARD
                  </div>
                  <div className="font-display text-sm font-semibold text-ink">
                    Top Operators
                  </div>
                </div>
              </div>

              <ul className="flex flex-col gap-2">
                {LEADERBOARD.map((entry) => (
                  <li
                    key={entry.rank}
                    className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-pearl-soft px-3 py-2.5"
                  >
                    <div
                      className={cn(
                        'h-7 w-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold',
                        entry.rank === 1 &&
                          'bg-warning/20 text-warning-deep border border-warning/40',
                        entry.rank === 2 &&
                          'bg-mist/30 text-ink border border-mist/50',
                        entry.rank === 3 &&
                          'bg-accent/15 text-accent-deep border border-accent/30',
                        entry.rank > 3 && 'bg-white text-mist-deep border border-ink/10'
                      )}
                    >
                      {entry.rank}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-medium text-ink truncate">
                        {entry.name}
                      </div>
                      <div className="font-mono text-[9px] text-mist-deep truncate">
                        {entry.region}
                      </div>
                    </div>
                    <div className="font-mono text-[11px] font-semibold text-ocean tabular-nums">
                      {entry.xp.toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-5 border-t border-ink/[0.06]">
                <div className="rounded-xl border border-dashed border-ink/15 bg-pearl-soft p-3 text-center">
                  <Lock className="h-3.5 w-3.5 text-mist-deep mx-auto mb-2" />
                  <p className="font-mono text-[9px] tracking-widest text-mist-deep">
                    GLOBAL RANKINGS
                  </p>
                  <p className="mt-1 text-[10px] text-ink-soft">
                    Unlock at Level 5
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <Button variant="secondary-light" size="sm" fullWidth>
                  View My Stats
                </Button>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Game detail dialog */}
      <Dialog
        open={selected !== null}
        onClose={() => setSelectedId(null)}
        title={selected?.label}
        description={selected?.description}
        size="md"
        footer={
          <>
            <Button variant="ghost-light" size="md" onClick={() => setSelectedId(null)}>
              Close
            </Button>
            <Button
              size="md"
              leftIcon={isPlayable ? <Play className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
              onClick={handlePlay}
            >
              {isPlayable ? 'Start Game' : 'Notify Me'}
            </Button>
          </>
        }
      >
        {selected && (
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-ocean/25 bg-ocean/[0.06] px-2.5 py-1 font-mono text-[9px] tracking-widest text-ocean">
                {isPlayable ? 'DEMO AVAILABLE' : 'IN DEVELOPMENT'}
              </span>
              <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                REWARD · +150 XP
              </span>
            </div>

            <p className="text-sm text-ink-soft leading-relaxed">
              {isPlayable
                ? 'This challenge is available as a short frontend demo. Your score and XP will be tracked locally during this session.'
                : 'This challenge is still being built. Detailed scoring, real data and leaderboard integration will arrive in a future phase.'}
            </p>

            <div className="rounded-xl border border-ink/[0.06] bg-pearl-soft p-4">
              <div className="font-mono text-[10px] tracking-widest text-ocean mb-2">
                HOW IT WORKS
              </div>
              <ul className="text-xs text-ink-soft leading-relaxed flex flex-col gap-1.5">
                <li>· Short interactive round with real marine concepts</li>
                <li>· Instant feedback on every answer</li>
                <li>· Earn XP and unlock achievements</li>
              </ul>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}