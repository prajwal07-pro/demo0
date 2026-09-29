import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getLenis } from '@/hooks/useLenis';

interface UseScrollRestorationOptions {
  /**
   * Routes under this prefix preserve their scroll position instead of
   * resetting to top. Useful for long-form workbenches.
   */
  preserveOn?: string[];
}

/**
 * Reset (or preserve) scroll position on route change.
 *
 * The default behaviour is to reset to top on every navigation.
 * Routes listed in `preserveOn` will not be reset — useful for
 * workbench pages where the user may have scrolled a panel.
 *
 * This hook coordinates with Lenis, which owns smooth-scroll state.
 */
export function useScrollRestoration(
  options: UseScrollRestorationOptions = {}
) {
  const { preserveOn = [] } = options;
  const location = useLocation();
  const lastPathRef = useRef(location.pathname);

  useEffect(() => {
    const path = location.pathname;
    const shouldPreserve = preserveOn.some((prefix) => path.startsWith(prefix));

    const wasSamePath = lastPathRef.current === path;
    lastPathRef.current = path;

    if (shouldPreserve || wasSamePath) return;

    window.scrollTo({ top: 0, behavior: 'auto' });

    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [location.pathname, preserveOn]);
}