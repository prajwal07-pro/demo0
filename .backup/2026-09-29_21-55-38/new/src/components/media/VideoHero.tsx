import * as React from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePrefersReducedMotion } from '@/hooks/useMediaQuery';

export interface VideoHeroProps {
  /** Video source URL (mp4 or webm). */
  src: string;
  /** Optional WebVTT captions track. */
  captionsSrc?: string;
  /** Optional poster image shown before the video starts. */
  poster?: string;
  /** Muted autoplay on load (recommended for hero use). */
  autoPlay?: boolean;
  /** Loop the video. Defaults to true. */
  loop?: boolean;
  /** Overlay content rendered on top of the video. */
  children?: React.ReactNode;
  /** Optional gradient overlay tone. */
  overlay?: 'dark' | 'light' | 'none';
  /** Surface tone for the surrounding container. */
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * VideoHero — full-bleed cinematic video with overlay content.
 *
 * Behaviour:
 *  - Respects prefers-reduced-motion: pauses any auto-playing video and
 *    hides the mute/unmute controls.
 *  - Autoplay always starts muted (browser policy). The user can unmute.
 *  - Captions are provided via a WebVTT track when available.
 *  - Controls are minimal: play/pause + mute.
 */
export function VideoHero({
  src,
  captionsSrc,
  poster,
  autoPlay = true,
  loop = true,
  children,
  overlay = 'dark',
  tone = 'dark',
  className,
}: VideoHeroProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = React.useState(false);
  const [muted, setMuted] = React.useState(true);
  const reducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (reducedMotion && autoPlay) {
      video.pause();
      setPlaying(false);
    } else if (autoPlay) {
      // Autoplay must start muted.
      video.muted = true;
      const promise = video.play();
      if (promise && typeof promise.catch === 'function') {
        promise.catch(() => {
          // Browser blocked autoplay — leave paused.
          setPlaying(false);
        });
      }
      setPlaying(true);
    }
  }, [autoPlay, reducedMotion]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play().catch(() => {});
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  };

  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'relative w-full h-full overflow-hidden',
        isLight ? 'bg-pearl' : 'bg-abyss',
        className
      )}
    >
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={src}
        poster={poster}
        muted
        loop={loop}
        playsInline
        preload="metadata"
        aria-label="ORCA cinematic video"
      >
        {captionsSrc && (
          <track
            kind="captions"
            src={captionsSrc}
            srcLang="en"
            label="English"
            default
          />
        )}
      </video>

      {overlay !== 'none' && (
        <div
          className={cn(
            'absolute inset-0 pointer-events-none',
            overlay === 'dark'
              ? 'bg-gradient-to-t from-abyss via-abyss/50 to-transparent'
              : 'bg-gradient-to-t from-pearl via-pearl/40 to-transparent'
          )}
          aria-hidden="true"
        />
      )}

      {children && (
        <div className="relative z-10 flex h-full w-full items-center justify-center">
          {children}
        </div>
      )}

      {!reducedMotion && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
          <ControlButton
            label={playing ? 'Pause video' : 'Play video'}
            onClick={togglePlay}
            icon={
              playing ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )
            }
            light={isLight}
          />
          <ControlButton
            label={muted ? 'Unmute video' : 'Mute video'}
            onClick={toggleMute}
            icon={
              muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )
            }
            light={isLight}
          />
        </div>
      )}
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  icon,
  light,
}: {
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
  light: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        'h-10 w-10 rounded-full border backdrop-blur-md flex items-center justify-center transition-colors',
        light
          ? 'border-ink/15 bg-white/80 text-ink hover:border-ocean/50 hover:bg-white'
          : 'border-white/20 bg-abyss/70 text-white hover:border-cyan/50 hover:bg-abyss/90'
      )}
    >
      {icon}
    </button>
  );
}

/**
 * Wrapper that fades the video into view when it enters the viewport.
 */
export function FadeInVideoHero(props: VideoHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 1.2, ease: [0.65, 0, 0.35, 1] }}
      className="w-full h-full"
    >
      <VideoHero {...props} />
    </motion.div>
  );
}