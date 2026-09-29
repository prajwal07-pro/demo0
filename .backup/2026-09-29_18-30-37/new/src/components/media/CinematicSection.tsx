import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface CinematicSectionProps {
  src: string;
  captionsSrc?: string;
  poster?: string;
  /** Section heading. */
  title: string;
  /** Optional one-line subtitle under the heading. */
  subtitle?: string;
  /** Optional long description. */
  description?: string;
  /** Text side (desktop only). */
  textSide?: 'left' | 'right';
  /** Aspect ratio for the video panel. */
  aspect?: 'video' | 'square' | 'wide' | 'cinema';
  /** Optional call-to-action slot. */
  action?: React.ReactNode;
  className?: string;
}

const ASPECT_CLASSES: Record<NonNullable<CinematicSectionProps['aspect']>, string> = {
  video: 'aspect-video',
  square: 'aspect-square',
  wide: 'aspect-[4/3]',
  cinema: 'aspect-[21/9]',
};

/**
 * CinematicSection — a video paired with editorial copy.
 *
 * The video is muted and autoplays only when in the viewport (via
 * IntersectionObserver). This keeps GPU work focused on what the user is
 * actually looking at.
 */
export function CinematicSection({
  src,
  captionsSrc,
  poster,
  title,
  subtitle,
  description,
  textSide = 'left',
  aspect = 'video',
  action,
  className,
}: CinematicSectionProps) {
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [inView, setInView] = React.useState(false);
  const reducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setInView(entry.isIntersecting));
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (inView && !reducedMotion) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }, [inView, reducedMotion]);

  const isTextLeft = textSide === 'left';

  return (
    <section
      ref={containerRef}
      className={cn('relative section-y bg-pearl text-ink overflow-hidden', className)}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={cn(
            'grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center',
            !isTextLeft && 'lg:direction-rtl'
          )}
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(!isTextLeft && 'lg:order-2')}
          >
            <div className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                CINEMATIC
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-ink leading-[1.08] text-balance">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-4 text-lg text-ink-soft leading-relaxed">{subtitle}</p>
            )}
            {description && (
              <p className="mt-5 text-base text-ink-soft leading-relaxed max-w-xl">
                {description}
              </p>
            )}
            {action && <div className="mt-8">{action}</div>}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={cn(!isTextLeft && 'lg:order-1')}
          >
            <div
              className={cn(
                'relative w-full rounded-2xl overflow-hidden border border-ink/10 bg-abyss shadow-soft-lg',
                ASPECT_CLASSES[aspect]
              )}
            >
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src={src}
                poster={poster}
                muted
                loop
                playsInline
                preload="metadata"
              >
                {captionsSrc && (
                  <track
                    kind="captions"
                    src={captionsSrc}
                    srcLang="en"
                    label="English"
                  />
                )}
              </video>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-abyss/40 via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}