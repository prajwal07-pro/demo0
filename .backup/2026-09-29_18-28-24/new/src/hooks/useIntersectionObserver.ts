import { useEffect, useRef, useState } from 'react';

export interface UseIntersectionObserverOptions extends IntersectionObserverInit {
  /** Once visible, stop observing. Defaults to true. */
  once?: boolean;
  /** Skip observing (e.g. when element is not rendered). Defaults to false. */
  skip?: boolean;
}

/**
 * Track whether an element is visible in the viewport.
 *
 * Primary use case: scroll-reveal sections that should only run their
 * entrance animation once, when they are first brought into view. The
 * `once` flag avoids re-triggering on every scroll pass.
 *
 * Returns a ref to attach to the element and a boolean visibility flag.
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: UseIntersectionObserverOptions = {}
) {
  const {
    once = true,
    skip = false,
    root = null,
    rootMargin = '0px 0px -10% 0px',
    threshold = 0.1,
  } = options;

  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (skip) return;
    const element = ref.current;
    if (!element || typeof window === 'undefined') return;

    // If IntersectionObserver is not available, mark as visible so content
    // is never hidden behind a missing API.
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, skip, root, rootMargin, threshold]);

  return { ref, isVisible };
}