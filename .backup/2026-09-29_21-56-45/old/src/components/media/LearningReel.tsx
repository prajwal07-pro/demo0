import * as React from 'react';
import { motion, type PanInfo } from 'framer-motion';
import { Heart, Bookmark, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface ReelItem {
  id: string;
  src: string;
  poster?: string;
  title: string;
  description?: string;
  category?: string;
  captionsSrc?: string;
}

export interface LearningReelProps {
  items: ReelItem[];
  /** Index of the initially visible reel. */
  initialIndex?: number;
  className?: string;
  onComplete?: (id: string) => void;
}

/**
 * LearningReel — vertical short-form video experience for the Learning Lab.
 *
 * Interaction:
 *  - Swipe / drag vertically to move between reels.
 *  - Chevron buttons for keyboard / mouse users.
 *  - Mute toggle persists across reels.
 *  - Only the currently visible reel plays; others are paused.
 *
 * This is intentionally a client-side experience — no infinite scroll, no
 * autoplay chaining that would surprise the user.
 */
export function LearningReel({
  items,
  initialIndex = 0,
  className,
  onComplete,
}: LearningReelProps) {
  const [index, setIndex] = React.useState(
    Math.min(Math.max(initialIndex, 0), Math.max(items.length - 1, 0))
  );
  const [muted, setMuted] = React.useState(true);
  const [saved, setSaved] = React.useState<Record<string, boolean>>({});
  const [liked, setLiked] = React.useState<Record<string, boolean>>({});
  const reducedMotion = usePrefersReducedMotion();

  const current = items[index];

  const goTo = (next: number) => {
    const clamped = Math.min(Math.max(next, 0), items.length - 1);
    if (clamped === index) return;
    setIndex(clamped);
    if (current) onComplete?.(current.id);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y < -80 || info.velocity.y < -500) {
      goTo(index + 1);
    } else if (info.offset.y > 80 || info.velocity.y > 500) {
      goTo(index - 1);
    }
  };

  if (!current) {
    return (
      <div className={cn('rounded-2xl border border-ink/10 bg-white p-8 text-center', className)}>
        <p className="text-sm text-ink-soft">No reels available.</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center gap-4', className)}>
      {/* Reel container */}
      <div className="relative w-full max-w-sm aspect-[9/16] rounded-3xl overflow-hidden bg-abyss shadow-soft-lg">
        <motion.div
          key={current.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          dragElastic={0.25}
          onDragEnd={handleDragEnd}
          className="absolute inset-0"
        >
          <video
            key={`${current.id}-video`}
            className="w-full h-full object-cover"
            src={current.src}
            poster={current.poster}
            muted={muted}
            autoPlay={!reducedMotion}
            loop
            playsInline
            preload="metadata"
          >
            {current.captionsSrc && (
              <track
                kind="captions"
                src={current.captionsSrc}
                srcLang="en"
                label="English"
                default
              />
            )}
          </video>

          {/* Gradient overlay */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/90 via-abyss/10 to-transparent" />

          {/* Category chip */}
          {current.category && (
            <div className="absolute top-4 left-4 inline-flex items-center rounded-full border border-cyan/30 bg-abyss/70 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] tracking-widest uppercase text-cyan/90">
              {current.category}
            </div>
          )}

          {/* Mute toggle */}
          <button
            type="button"
            onClick={() => setMuted((v) => !v)}
            className="absolute top-4 right-4 h-9 w-9 rounded-full border border-white/20 bg-abyss/70 backdrop-blur-md flex items-center justify-center text-white hover:border-cyan/50 transition-colors"
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>

          {/* Meta + actions */}
          <div className="absolute bottom-4 left-4 right-16">
            <div className="font-display text-lg font-semibold text-white leading-tight">
              {current.title}
            </div>
            {current.description && (
              <p className="mt-2 text-xs text-white/80 leading-snug line-clamp-2">
                {current.description}
              </p>
            )}
          </div>

          <div className="absolute bottom-4 right-4 flex flex-col items-center gap-3">
            <ActionButton
              active={Boolean(liked[current.id])}
              label={liked[current.id] ? 'Unlike' : 'Like'}
              onClick={() =>
                setLiked((prev) => ({ ...prev, [current.id]: !prev[current.id] }))
              }
              icon={<Heart className={cn('h-5 w-5', liked[current.id] && 'fill-current')} />}
            />
            <ActionButton
              active={Boolean(saved[current.id])}
              label={saved[current.id] ? 'Unsave' : 'Save'}
              onClick={() =>
                setSaved((prev) => ({ ...prev, [current.id]: !prev[current.id] }))
              }
              icon={<Bookmark className={cn('h-5 w-5', saved[current.id] && 'fill-current')} />}
            />
          </div>
        </motion.div>

        {/* Up / down navigation */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-10">
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            aria-label="Previous reel"
            className={cn(
              'h-8 w-8 rounded-full border border-white/20 bg-abyss/60 backdrop-blur-md flex items-center justify-center text-white transition-opacity',
              index === 0 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index >= items.length - 1}
            aria-label="Next reel"
            className={cn(
              'h-8 w-8 rounded-full border border-white/20 bg-abyss/60 backdrop-blur-md flex items-center justify-center text-white transition-opacity',
              index >= items.length - 1 && 'opacity-30 cursor-not-allowed'
            )}
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center gap-1.5">
        {items.map((it, i) => (
          <button
            key={it.id}
            type="button"
            onClick={() => goTo(i)}
            aria-label={`Go to reel ${i + 1}`}
            className={cn(
              'h-1.5 rounded-full transition-all',
              i === index ? 'w-6 bg-ocean' : 'w-1.5 bg-ink/20 hover:bg-ink/40'
            )}
          />
        ))}
      </div>
    </div>
  );
}

function ActionButton({
  active,
  label,
  onClick,
  icon,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        'h-10 w-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-colors',
        active
          ? 'border-cyan/50 bg-cyan/20 text-cyan'
          : 'border-white/20 bg-abyss/60 text-white hover:border-cyan/40'
      )}
    >
      {icon}
    </button>
  );
}