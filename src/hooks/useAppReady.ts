import { useEffect, useState } from 'react';

export interface AppReadyState {
  /** All critical subsystems have reported ready. */
  ready: boolean;
  /** Human-readable current stage. */
  stage: string;
  /** Elapsed time since init started, in ms. */
  elapsed: number;
}

const STAGES = [
  { at: 0, label: 'INITIALIZING ORCA CORE' },
  { at: 300, label: 'CONNECTING OCEAN DATA' },
  { at: 700, label: 'CONNECTING AIS STREAM' },
  { at: 1050, label: 'CONNECTING EARTH OBSERVATION' },
  { at: 1400, label: 'INITIALIZING AI AGENTS' },
];

/**
 * Simulates the ORCA boot sequence and exposes a ready flag plus current
 * stage label. The visual loader uses this, and the app shell mounts the
 * routed content only when `ready` is true.
 *
 * The total duration is deliberately short (≈1.6s). The loader is a
 * cinematic flourish, not a place to hide slow code.
 */
export function useAppReady(): AppReadyState {
  const [state, setState] = useState<AppReadyState>({
    ready: false,
    stage: STAGES[0]?.label ?? '',
    elapsed: 0,
  });

  useEffect(() => {
    const start = performance.now();
    const tick = () => {
      const elapsed = performance.now() - start;

      let current = STAGES[0];
      for (const s of STAGES) {
        if (elapsed >= s.at) current = s;
      }

      const ready = elapsed >= 1600;
      setState({
        ready,
        stage: ready ? 'READY' : (current?.label ?? ''),
        elapsed,
      });

      if (!ready) {
        requestAnimationFrame(tick);
      }
    };

    const rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return state;
}

export { STAGES as APP_BOOT_STAGES };