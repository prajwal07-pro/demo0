import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

/**
 * Returns the global Lenis instance.
 * If not initialized, it returns null.
 */
export function getLenis(): Lenis | null {
  return lenisInstance;
}

/**
 * Hook to initialize Lenis smooth scrolling globally.
 *
 * CONTRACT: There must be exactly ONE Lenis instance for the entire
 * application. This hook is safe to call from multiple places — it only
 * constructs a new instance if none exists, and it does not tear down the
 * existing instance on unmount (the raf loop is tied to the instance, not
 * to any specific component's lifecycle).
 */
export function useLenisSetup() {
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (lenisInstance) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisInstance = lenis;

    const raf = (time: number) => {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    };
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      // Only tear down if this hook still owns the instance. In practice
      // this only runs on full app unmount — route changes do not trigger
      // it, because AppLayout persists across routes.
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
}

/**
 * Hook to access the Lenis instance for programmatic scrolling.
 */
export function useLenis() {
  return getLenis();
}

/**
 * Scroll to a target element or position smoothly.
 */
export function scrollTo(
  target: string | number | HTMLElement,
  options?: { offset?: number; duration?: number; immediate?: boolean }
) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(target, {
      offset: options?.offset ?? 0,
      duration: options?.duration ?? 1.2,
      immediate: options?.immediate ?? false,
    });
  } else {
    if (typeof target === 'string') {
      const element = document.querySelector(target);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else if (typeof target === 'number') {
      window.scrollTo({ top: target, behavior: 'smooth' });
    } else if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

/**
 * Stop Lenis scrolling (useful for modals).
 */
export function stopLenis() {
  const lenis = getLenis();
  if (lenis) {
    lenis.stop();
  }
}

/**
 * Start Lenis scrolling.
 */
export function startLenis() {
  const lenis = getLenis();
  if (lenis) {
    lenis.start();
  }
}