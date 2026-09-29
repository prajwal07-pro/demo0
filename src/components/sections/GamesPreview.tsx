import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  ArrowRight,
  Trophy,
  Waves,
  Navigation,
  Fish,
  Shield,
  Target,
  Zap,
} from 'lucide-react';
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

/**
 * GamesPreview — home page feature for Marine Games.
 * Positions the game modes as a serious learning exercise, not a toy.
 */
export function GamesPreview() {
  return (
    <section className="relative py-24 lg:py-32 bg-abyss overflow-hidden">
      <div
        className="absolute top-1/3 right-0 h-[500px] w-[600px] rounded-full bg-magenta/[0.03] blur-[140px]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl px-6">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="max-w-3xl mb-14"
        >
          <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
            <span className="h-px w-12 bg-cyan/40" />
            <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
              MARINE GAMES
            </span>
          </motion.div>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight leading-[1.05]"
          >
            Learn by playing.
            <br />
            <span className="text-gradient-cyan">Play by doing.</span>
          </motion.h2>
          <motion.p
            variants={fadeInUp}
            className="mt-5 text-lg text-muted-foreground leading-relaxed"
          >
            Short interactive challenges that build real marine intuition.
            Score XP, unlock achievements, and climb the operator leaderboard.
          </motion.p>
        </motion.div>

        {/* Game tiles */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {GAME_MODES.map((g, i) => {
            const Icon = GAME_ICONS[g.id] ?? Gamepad2;
            return (
              <motion.div key={g.id} variants={fadeInUp}>
                <GameTile
                  icon={Icon}
                  label={g.label}
                  description={g.description}
                  index={i}
                />
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-cyan/20 bg-cyan/[0.03] p-6 lg:p-8"
        >
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg border border-amber-400/30 bg-amber-400/10 flex items-center justify-center">
              <Trophy className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-widest text-cyan/70">
                LEADERBOARD
              </div>
              <div className="font-display text-lg font-semibold text-white">
                Top operators this week
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <Zap className="h-3.5 w-3.5 text-violet" />
              <span className="font-mono text-[11px] text-muted-foreground">
                18,420 XP · #1
              </span>
            </div>
            <Link to="/games">
              <Button size="md" rightIcon={<ArrowRight className="h-4 w-4" />}>
                Play Now
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function GameTile({
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
    <Link
      to="/games"
      className="group relative block rounded-xl border border-white/10 bg-white/[0.015] overflow-hidden transition-all hover:border-cyan/40 hover:bg-white/[0.03]"
    >
      {/* Cover */}
      <div className="relative h-32 bg-gradient-to-br from-cyan/[0.08] via-transparent to-violet/[0.08] flex items-center justify-center">
        <div className="absolute inset-0 data-grid opacity-20" />
        <div className="relative h-14 w-14 rounded-full border border-cyan/30 bg-abyss/70 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
          <Icon className="h-5 w-5 text-cyan" />
        </div>
        <span className="absolute top-2 right-2 font-mono text-[9px] tracking-widest text-cyan/50">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="font-display text-sm font-semibold text-white leading-tight">
          {label}
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground leading-snug line-clamp-2">
          {description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-[9px] tracking-widest text-cyan/60 group-hover:text-cyan">
            PLAY
          </span>
          <ArrowRight className="h-3 w-3 text-cyan/60 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
}