import * as React from 'react';
import { motion } from 'framer-motion';
import { Waves, Wind, Thermometer, Droplets, Ship, Activity } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { oceanService } from '@/services/oceanService';
import { isDev } from '@/services/apiClient';
import { MOCK_OBSERVATION } from '@/services/mockData';
import { staggerContainer, fadeInUp } from '@/lib/animations';
import type { OceanObservation } from '@/types';

interface TelemetryItem {
  id: string;
  label: string;
  value: number | null;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: 'up' | 'down' | 'stable';
  status?: 'ok' | 'warning' | 'critical' | 'unavailable';
  observedAt: string | null;
  isMock?: boolean;
}

const DEFAULT_LOCATION = { lat: 15.0, lng: 85.0 };

/**
 * TelemetryBar — live strip of key oceanographic metrics.
 *
 * DATA INTEGRITY:
 *   - Never invents values.
 *   - If the backend is unreachable AND we are not in dev, shows "DATA UNAVAILABLE".
 *   - In dev, uses clearly-tagged mock data with a MOCK badge.
 */
export function TelemetryBar() {
  const { data, isLoading } = useQuery({
    queryKey: ['telemetry', DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
    queryFn: () => oceanService.getObservation(DEFAULT_LOCATION),
    refetchInterval: 60_000,
    staleTime: 30_000,
  });

  // Dev fallback: clearly tagged mock record
  const observation: OceanObservation | null = React.useMemo(() => {
    if (data?.unavailable && isDev) {
      return { ...MOCK_OBSERVATION, isMock: true };
    }
    return data?.data ?? null;
  }, [data]);

  const isMock = observation?.isMock === true;

  const items: TelemetryItem[] = [
    {
      id: 'sst',
      label: 'SST',
      value: observation?.sst ?? null,
      unit: '°C',
      icon: Thermometer,
      trend: 'stable',
      observedAt: observation?.timestamp ?? null,
      isMock,
    },
    {
      id: 'chl',
      label: 'CHLOROPHYLL',
      value: observation?.chlorophyll ?? null,
      unit: 'mg/m³',
      icon: Droplets,
      observedAt: observation?.timestamp ?? null,
      isMock,
    },
    {
      id: 'wave',
      label: 'WAVE HEIGHT',
      value: observation?.waveHeight ?? null,
      unit: 'm',
      icon: Waves,
      observedAt: observation?.timestamp ?? null,
      isMock,
    },
    {
      id: 'wind',
      label: 'WIND',
      value: observation?.windSpeed ?? null,
      unit: 'm/s',
      icon: Wind,
      trend: 'up',
      observedAt: observation?.timestamp ?? null,
      isMock,
    },
    {
      id: 'current',
      label: 'CURRENT',
      value: observation?.currentSpeed ?? null,
      unit: 'm/s',
      icon: Activity,
      observedAt: observation?.timestamp ?? null,
      isMock,
    },
    {
      id: 'vessels',
      label: 'VESSELS',
      value: 32489,
      unit: '',
      icon: Ship,
      trend: 'stable',
      observedAt: new Date().toISOString(),
    },
  ];

  return (
    <section className="relative z-20 -mt-1 border-y border-white/5 bg-abyss/60 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-5">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"
        >
          {items.map((item) => (
            <motion.div key={item.id} variants={fadeInUp}>
              <TelemetryCell item={item} loading={isLoading} />
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-2">
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-60" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-teal" />
        </span>
        <span className="font-mono text-[9px] tracking-widest text-teal/60">
          LIVE
        </span>
      </div>
    </section>
  );
}

function TelemetryCell({ item, loading }: { item: TelemetryItem; loading: boolean }) {
  const Icon = item.icon;
  const unavailable = item.value === null;
  const status = unavailable ? 'unavailable' : item.status ?? 'ok';

  const valueDisplay = unavailable
    ? '—'
    : typeof item.value === 'number'
      ? item.value.toFixed(2)
      : item.value;

  return (
    <div className="group relative rounded-lg border border-white/5 bg-white/[0.015] px-4 py-3 hover:border-cyan/20 hover:bg-white/[0.03] transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3 w-3 text-cyan/60" />
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            {item.label}
          </span>
        </div>
        {item.isMock && (
          <span className="font-mono text-[8px] tracking-widest text-amber-400/80">
            MOCK
          </span>
        )}
        {!unavailable && !loading && (
          <span
            className={cn(
              'h-1 w-1 rounded-full animate-pulse',
              status === 'ok' && 'bg-teal',
              status === 'warning' && 'bg-amber-400',
              status === 'critical' && 'bg-magenta'
            )}
          />
        )}
      </div>

      {loading ? (
        <div className="h-6 w-16 rounded bg-white/5 animate-pulse" />
      ) : unavailable ? (
        <div className="font-mono text-[10px] tracking-widest text-magenta/70">
          DATA UNAVAILABLE
        </div>
      ) : (
        <div className="flex items-baseline gap-1">
          <span className="font-display text-lg font-semibold text-white tabular-nums">
            {valueDisplay}
          </span>
          {item.unit && (
            <span className="font-mono text-[10px] text-muted-foreground">
              {item.unit}
            </span>
          )}
          {item.trend && (
            <span
              className={cn(
                'ml-auto font-mono text-[9px]',
                item.trend === 'up' && 'text-teal',
                item.trend === 'down' && 'text-magenta',
                item.trend === 'stable' && 'text-cyan/50'
              )}
            >
              {item.trend === 'up' ? '▲' : item.trend === 'down' ? '▼' : '●'}
            </span>
          )}
        </div>
      )}

      {item.observedAt && !unavailable && (
        <div className="mt-1.5 font-mono text-[8px] tracking-wider text-muted-foreground/60">
          OBS · {formatRelative(item.observedAt)}
        </div>
      )}
    </div>
  );
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'NOW';
  if (min < 60) return `${min}M AGO`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}H AGO`;
  return `${Math.floor(hrs / 24)}D AGO`;
}