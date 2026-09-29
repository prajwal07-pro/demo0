import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface VideoCardProps {
  src: string;
  poster?: string;
  title: string;
  description?: string;
  /** Duration string, e.g. "12:40". */
  duration?: string;
  /** Optional category chip (e.g. "AIS", "SST"). */
  category?: string;
  /** Preview the video on hover. */
  hoverPreview?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * VideoCard — a compact card for a lesson or reel.
 *
 * On hover (desktop only, disabled under prefers-reduced-motion), a muted
 * preview of the video plays in place of the poster. The full video opens
 * through the caller's `onClick` handler (usually a modal or the Learning
 * page).
 */
export function VideoCard({
  src,
  poster,
  title,
  description,
  duration,
  category,
  hoverPreview = true,
  onClick,
  className,
}: VideoCardProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [hovering, setHovering] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();

  const handleEnter = () => {
    if (!hoverPreview || reducedMotion) return;
    setHovering(true);
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const handleLeave = () => {
    setHovering(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  };

  return (
    <motion.button
      type="button"
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'group relative w-full text-left rounded-2xl border border-ink/[0.08] bg-white overflow-hidden shadow-soft transition-shadow hover:shadow-soft-md',
        className
      )}
    >
      {/* Cover */}
      <div className="relative aspect-video bg-abyss overflow-hidden">
        {poster && (
          <img
            src={poster}
            alt=""
            className={cn(
              'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
              hovering ? 'opacity-0' : 'opacity-100'
            )}
          />
        )}

        <video
          ref={videoRef}
          className={cn(
            'absolute inset-0 w-full h-full object-cover transition-opacity duration-300',
            hovering ? 'opacity-100' : 'opacity-0'
          )}
          src={src}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />

        {/* Play affordance */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-abyss/70 backdrop-blur-md transition-transform group-hover:scale-110">
            <Play className="h-5 w-5 text-white ml-0.5" />
          </div>
        </div>

        {/* Duration chip */}
        {duration && (
          <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-md bg-abyss/80 backdrop-blur-md px-2 py-1 text-[10px] font-mono tracking-wider text-white">
            <Clock className="h-2.5 w-2.5" />
            {duration}
          </div>
        )}

        {/* Category chip */}
        {category && (
          <div className="absolute top-3 left-3 inline-flex items-center rounded-full border border-cyan/30 bg-abyss/80 backdrop-blur-md px-2.5 py-1 font-mono text-[9px] tracking-widest uppercase text-cyan/90">
            {category}
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="p-5">
        <div className="font-display text-base font-semibold text-ink leading-snug line-clamp-2">
          {title}
        </div>
        {description && (
          <p className="mt-2 text-sm text-ink-soft leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
      </div>
    </motion.button>
  );
}