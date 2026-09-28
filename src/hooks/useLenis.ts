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
 * Should be called once in the root App component or AppLayout.
 */
export function useLenisSetup() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Create Lenis instance if it doesn't exist
    if (!lenisInstance) {
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
      lenisRef.current = lenis;

      let rafId = 0;
      function raf(time: number) {
        lenis.raf(time);
        rafId = requestAnimationFrame(raf);
      }
      rafId = requestAnimationFrame(raf);

      return () => {
        cancelAnimationFrame(rafId);
        lenis.destroy();
        lenisInstance = null;
        lenisRef.current = null;
      };
    } else {
      lenisRef.current = lenisInstance;
    }
  }, []);

  return lenisRef.current;
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
    // Fallback to native scroll
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