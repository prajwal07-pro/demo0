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
  /** Surface tone. */
  tone?: 'light' | 'dark';
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
 * actually looking at. Supports both light (editorial) and dark
 * (immersive) surface tones.
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
  tone = 'light',
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
  const isLight = tone === 'light';

  return (
    <section
      ref={containerRef}
      className={cn(
        'relative section-y overflow-hidden',
        isLight ? 'bg-pearl text-ink' : 'bg-abyss text-white',
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className={cn(!isTextLeft && 'lg:order-2')}
          >
            <div className="flex items-center gap-3 mb-5">
              <span
                className={cn(
                  'h-px w-10',
                  isLight ? 'bg-ocean/40' : 'bg-cyan/40'
                )}
              />
              <span
                className={cn(
                  'font-mono text-[10px] tracking-[0.3em] uppercase',
                  isLight ? 'text-ocean' : 'text-cyan/70'
                )}
              >
                CINEMATIC
              </span>
            </div>
            <h2
              className={cn(
                'font-display text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.08] text-balance',
                isLight ? 'text-ink' : 'text-white'
              )}
            >
              {title}
            </h2>
            {subtitle && (
              <p
                className={cn(
                  'mt-4 text-lg leading-relaxed',
                  isLight ? 'text-ink-soft' : 'text-white/70'
                )}
              >
                {subtitle}
              </p>
            )}
            {description && (
              <p
                className={cn(
                  'mt-5 text-base leading-relaxed max-w-xl',
                  isLight ? 'text-ink-soft' : 'text-white/70'
                )}
              >
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
                'relative w-full rounded-2xl overflow-hidden border',
                isLight
                  ? 'border-ink/10 bg-abyss shadow-soft-lg'
                  : 'border-white/10 bg-abyss shadow-glass',
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