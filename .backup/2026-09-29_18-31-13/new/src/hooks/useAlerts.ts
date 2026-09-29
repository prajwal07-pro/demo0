import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useData } from '@/store/useAppStore';
import { isDev } from '@/services/apiClient';
import { MOCK_ALERTS } from '@/services/mockData';
import type { AlertSeverity, MarineAlert } from '@/types';

/**
 * Alerts hook — reads alerts from the store (populated by a future
 * WebSocket push), falls back to mock data only in dev, and derives
 * severity counts. Never fabricates data in production.
 */
export function useAlerts(filter?: AlertSeverity | 'all') {
  const { alerts, setAlerts, isLoading, error } = useData();

  // In dev, seed from mock data when the store is empty so the UI is not
  // blank during development.
  const source = useMemo<MarineAlert[]>(() => {
    if (alerts.length === 0 && isDev) return MOCK_ALERTS;
    return alerts;
  }, [alerts]);

  const filtered = useMemo(() => {
    if (!filter || filter === 'all') return source;
    return source.filter((a) => a.severity === filter);
  }, [source, filter]);

  const counts = useMemo(() => {
    const bySeverity: Record<AlertSeverity, number> = {
      info: 0,
      warning: 0,
      critical: 0,
      emergency: 0,
    };
    source.forEach((a) => {
      bySeverity[a.severity]++;
    });
    return bySeverity;
  }, [source]);

  const acknowledged = useCallback(
    (id: string) => {
      setAlerts(
        alerts.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
      );
    },
    [alerts, setAlerts]
  );

  const unacknowledged = useMemo(
    () => source.filter((a) => !a.acknowledged).length,
    [source]
  );

  return {
    alerts: filtered,
    allAlerts: source,
    counts,
    unacknowledged,
    isLoading,
    error,
    acknowledge: acknowledged,
  };
}

// Local import to avoid top-of-file circular dependency with React.
import { useCallback } from 'react';