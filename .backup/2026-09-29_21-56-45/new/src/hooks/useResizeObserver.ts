import { useEffect, useRef, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Track the size of an element via ResizeObserver.
 *
 * Used by canvases, maps, and WebGL viewports that need to react to
 * container size changes. Falls back to a one-time measurement when
 * ResizeObserver is not available.
 */
export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(
  onResize?: (size: Size) => void
) {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const callbackRef = useRef(onResize);
  callbackRef.current = onResize;

  useEffect(() => {
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    const measure = () => {
      const rect = element.getBoundingClientRect();
      const next: Size = {
        width: Math.round(rect.width),
        height: Math.round(rect.height),
      };
      setSize(next);
      callbackRef.current?.(next);
    };

    measure();

    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', measure);
      return () => window.removeEventListener('resize', measure);
    }

    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}