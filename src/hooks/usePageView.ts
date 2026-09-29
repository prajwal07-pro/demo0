import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { telemetry } from '@/lib/telemetry';

/**
 * usePageView — emits a telemetry page_view event on every route change.
 *
 * Mount once inside AppLayout or App. Uses the current pathname as the
 * identifier; the document title is included when available.
 */
export function usePageView(): void {
  const location = useLocation();

  useEffect(() => {
    telemetry.pageView(location.pathname, document.title);
  }, [location.pathname]);
}