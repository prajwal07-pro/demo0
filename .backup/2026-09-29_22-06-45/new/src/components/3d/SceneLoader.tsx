import { Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SceneLoaderProps {
  /** Optional label override. */
  label?: string;
  /** Show a percentage indicator. Defaults to true. */
  showProgress?: boolean;
  /** Surface tone. Defaults to `dark` since most scenes are immersive. */
  tone?: 'light' | 'dark';
}

/**
 * SceneLoader — Suspense fallback for React Three Fiber scenes.
 *
 * Rendered via drei's <Html> inside the R3F canvas so the loading message
 * is positioned at the center of the viewport. Uses drei's `useProgress`
 * hook, which tracks GLTF loading state across the entire scene.
 */
export function SceneLoader({
  label = 'LOADING ENVIRONMENT',
  showProgress = true,
  tone = 'dark',
}: SceneLoaderProps) {
  const { progress, active } = useProgress();
  const isLight = tone === 'light';

  // drei's progress is a 0-100 number. When no assets are loading it can
  // briefly sit at 0; we treat that as a complete state.
  const displayProgress = active ? Math.round(progress) : 100;

  return (
    <Html center>
      <div className="pointer-events-none flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div
            className={cn(
              'absolute inset-0 animate-ping rounded-full border',
              isLight ? 'border-ocean/30' : 'border-cyan/30'
            )}
          />
          <div
            className={cn(
              'absolute inset-2 rounded-full border',
              isLight ? 'border-teal/40' : 'border-teal/40'
            )}
          />
          <div
            className={cn(
              'h-6 w-6 rounded-full blur-md',
              isLight ? 'bg-ocean/30' : 'bg-cyan/30'
            )}
          />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span
            className={cn(
              'font-mono text-[10px] tracking-[0.3em]',
              isLight ? 'text-ocean' : 'text-cyan/80'
            )}
          >
            {label}
          </span>
          {showProgress && (
            <>
              <div
                className={cn(
                  'h-0.5 w-40 overflow-hidden rounded-full',
                  isLight ? 'bg-ink/[0.06]' : 'bg-white/[0.06]'
                )}
              >
                <motion.div
                  className={cn(
                    'h-full bg-gradient-to-r',
                    isLight ? 'from-ocean to-cyan-dark' : 'from-cyan to-teal'
                  )}
                  initial={{ width: '0%' }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span
                className={cn(
                  'font-mono text-[9px] tabular-nums',
                  isLight ? 'text-mist-deep' : 'text-white/40'
                )}
              >
                {displayProgress}%
              </span>
            </>
          )}
        </div>
      </div>
    </Html>
  );
}

/**
 * Fallback used outside of a Canvas context — safe to render anywhere.
 */
export function SceneLoaderDOM({
  label = 'LOADING ENVIRONMENT',
  tone = 'dark',
}: SceneLoaderProps) {
  const isLight = tone === 'light';
  return (
    <div
      className={cn(
        'flex h-full w-full items-center justify-center',
        isLight ? 'bg-pearl' : 'bg-abyss'
      )}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div
            className={cn(
              'absolute inset-0 animate-ping rounded-full border',
              isLight ? 'border-ocean/30' : 'border-cyan/30'
            )}
          />
          <div
            className={cn(
              'absolute inset-2 rounded-full border',
              isLight ? 'border-teal/40' : 'border-teal/40'
            )}
          />
          <div
            className={cn(
              'h-6 w-6 rounded-full blur-md',
              isLight ? 'bg-ocean/30' : 'bg-cyan/30'
            )}
          />
        </div>
        <span
          className={cn(
            'font-mono text-[10px] tracking-[0.3em]',
            isLight ? 'text-ocean' : 'text-cyan/80'
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}