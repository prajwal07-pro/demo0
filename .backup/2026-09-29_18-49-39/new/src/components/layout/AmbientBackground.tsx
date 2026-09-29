import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface AmbientBackgroundProps {
  /** Tone of the ambient field. */
  tone?: 'dark' | 'light';
  /** Show subtle animated particles. Defaults to true (auto-disabled under reduced motion). */
  particles?: boolean;
  /** Show a soft radial grid pattern. Defaults to true. */
  grid?: boolean;
  className?: string;
}

/**
 * AmbientBackground — a fixed atmospheric layer that sits behind the
 * routed page content. It provides the subtle depth the platform relies
 * on without competing with the content.
 *
 * All effects are:
 *  - GPU-friendly (a handful of large blurs, no per-pixel shaders)
 *  - Auto-disabled under prefers-reduced-motion
 *  - Non-interactive (pointer-events: none)
 *  - Tone-aware: dark on workbench routes, light on editorial routes.
 */
export function AmbientBackground({
  tone = 'dark',
  particles = true,
  grid = true,
  className,
}: AmbientBackgroundProps) {
  const reducedMotion = usePrefersReducedMotion();
  const isDark = tone === 'dark';

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-0 overflow-hidden',
        isDark ? 'bg-abyss' : 'bg-pearl',
        className
      )}
      aria-hidden="true"
    >
      {/* Radial glow fields */}
      <div
        className={cn(
          'absolute top-0 left-1/4 h-[500px] w-[500px] rounded-full blur-[120px]',
          isDark ? 'bg-cyan/[0.06]' : 'bg-ocean/[0.06]'
        )}
      />
      <div
        className={cn(
          'absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-[120px]',
          isDark ? 'bg-violet/[0.05]' : 'bg-teal/[0.06]'
        )}
      />

      {/* Grid */}
      {grid && (
        <div
          className={cn(
            'absolute inset-0',
            isDark
              ? 'data-grid opacity-[0.15]'
              : 'data-grid-light opacity-[0.35]'
          )}
        />
      )}

      {/* Slow-moving particles */}
      {particles && !reducedMotion && (
        <>
          {[
            { delay: 0, duration: 22, x: '12%', y: '18%' },
            { delay: 4, duration: 28, x: '78%', y: '24%' },
            { delay: 8, duration: 26, x: '30%', y: '72%' },
            { delay: 12, duration: 24, x: '68%', y: '80%' },
            { delay: 16, duration: 30, x: '45%', y: '42%' },
          ].map((p, i) => (
            <motion.span
              key={i}
              className={cn(
                'absolute h-1 w-1 rounded-full',
                isDark
                  ? 'bg-cyan/40 shadow-[0_0_6px_rgba(6,182,212,0.6)]'
                  : 'bg-ocean/25 shadow-[0_0_6px_rgba(12,74,110,0.35)]'
              )}
              style={{ left: p.x, top: p.y }}
              animate={{
                y: [0, -20, 0],
                x: [0, 12, 0],
                opacity: [0.3, 0.9, 0.3],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: p.delay,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
}