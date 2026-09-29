import { Html, useProgress } from '@react-three/drei';
import { motion } from 'framer-motion';

export interface SceneLoaderProps {
  /** Optional label override. */
  label?: string;
  /** Show a percentage indicator. Defaults to true. */
  showProgress?: boolean;
}

/**
 * SceneLoader — Suspense fallback for React Three Fiber scenes.
 *
 * Rendered via drei's <Html> inside the R3F canvas so the loading message
 * is positioned at the center of the viewport. Uses drei's `useProgress`
 * hook, which tracks GLTF loading state across the entire scene.
 */
export function SceneLoader({ label = 'LOADING ENVIRONMENT', showProgress = true }: SceneLoaderProps) {
  const { progress, active } = useProgress();

  // drei's progress is a 0-100 number. When no assets are loading it can
  // briefly sit at 0; we treat that as a complete state.
  const displayProgress = active ? Math.round(progress) : 100;

  return (
    <Html center>
      <div className="pointer-events-none flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-cyan/30" />
          <div className="absolute inset-2 rounded-full border border-teal/40" />
          <div className="h-6 w-6 rounded-full bg-cyan/30 blur-md" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/80">
            {label}
          </span>
          {showProgress && (
            <>
              <div className="h-0.5 w-40 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan to-teal"
                  initial={{ width: '0%' }}
                  animate={{ width: `${displayProgress}%` }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                />
              </div>
              <span className="font-mono text-[9px] text-white/40 tabular-nums">
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
export function SceneLoaderDOM({ label = 'LOADING ENVIRONMENT' }: SceneLoaderProps) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-abyss">
      <div className="flex flex-col items-center gap-4">
        <div className="relative flex h-16 w-16 items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full border border-cyan/30" />
          <div className="absolute inset-2 rounded-full border border-teal/40" />
          <div className="h-6 w-6 rounded-full bg-cyan/30 blur-md" />
        </div>
        <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/80">
          {label}
        </span>
      </div>
    </div>
  );
}