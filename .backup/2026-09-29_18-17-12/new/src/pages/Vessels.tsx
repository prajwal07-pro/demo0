import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Search,
  Ship,
  Filter,
  ArrowUpRight,
  Anchor,
  Gauge,
  MapPin,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { VESSEL_TYPES, type VesselTypeId } from '@/lib/constants';
import { aisService } from '@/services/aisService';
import { isDev } from '@/services/apiClient';
import { MOCK_VESSELS, isMockRecord } from '@/services/mockData';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAppStore } from '@/store/useAppStore';

export default function Vessels() {
  const [query, setQuery] = React.useState('');
  const [filter, setFilter] = React.useState<VesselTypeId | 'all'>('all');
  const setSelectedVessel = useAppStore((s) => s.setSelectedVessel);

  const { data, isLoading } = useQuery({
    queryKey: ['vessels', filter],
    queryFn: () =>
      aisService.getVesselsInBounds(
        { north: 25, south: 5, east: 95, west: 75 },
        { vesselType: filter === 'all' ? undefined : filter, limit: 200 }
      ),
    refetchInterval: 30_000,
    staleTime: 15_000,
  });

  const vessels = React.useMemo(() => {
    if (data?.unavailable && isDev) return MOCK_VESSELS;
    return data?.data ?? [];
  }, [data]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    return vessels.filter((v) => {
      if (filter !== 'all' && v.type !== filter) return false;
      if (!q) return true;
      return (
        v.name.toLowerCase().includes(q) ||
        v.mmsi.includes(q) ||
        (v.destination ?? '').toLowerCase().includes(q)
      );
    });
  }, [vessels, query, filter]);

  const stats = React.useMemo(() => {
    const byType: Record<string, number> = {};
    vessels.forEach((v) => {
      byType[v.type] = (byType[v.type] ?? 0) + 1;
    });
    return {
      total: vessels.length,
      byType,
      avgSpeed:
        vessels.length > 0
          ? vessels.reduce((s, v) => s + v.speed, 0) / vessels.length
          : 0,
      dataUnavailable: data?.unavailable ?? false,
    };
  }, [vessels, data]);

  return (
    <div className="relative bg-pearl text-ink">
      {/* Header */}
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-ocean/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-ocean">
                VESSEL INTELLIGENCE · AIS
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Every vessel,
              <br />
              <span className="text-gradient-navy">tracked in motion.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Real-time AIS tracking of commercial, fishing, research, and
              government vessels. Filter, search, and inspect any tracked
              vessel.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="relative py-8 border-b border-ink/[0.06]">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBlock icon={Ship} label="TRACKED" value={stats.total.toString()} tone="ocean" />
            <StatBlock
              icon={Gauge}
              label="AVG SPEED"
              value={`${stats.avgSpeed.toFixed(1)} kn`}
              tone="teal"
            />
            <StatBlock
              icon={TrendingUp}
              label="CARGO"
              value={(stats.byType.cargo ?? 0).toString()}
              tone="violet"
            />
            <StatBlock
              icon={Anchor}
              label="FISHING"
              value={(stats.byType.fishing ?? 0).toString()}
              tone="accent"
            />
          </div>
        </div>
      </section>

      {/* Controls */}
      <section className="relative py-6">
        <div className="relative mx-auto max-w-7xl px-6">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            <div className="flex-1">
              <Input
                variant="default"
                leftIcon={<Search className="h-4 w-4" />}
                placeholder="Search by name, MMSI, destination…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="!bg-white !text-ink !border-ink/10 focus:!border-ocean/50 focus:!ring-ocean/20 placeholder:!text-ink-muted"
              />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
              <Filter className="h-3.5 w-3.5 text-ocean shrink-0" />
              <FilterChip
                label="All"
                active={filter === 'all'}
                onClick={() => setFilter('all')}
              />
              {VESSEL_TYPES.slice(0, 6).map((vt) => (
                <FilterChip
                  key={vt.id}
                  label={vt.label}
                  active={filter === vt.id}
                  color={vt.color}
                  onClick={() => setFilter(vt.id)}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Data-integrity notice */}
      {stats.dataUnavailable && isDev && (
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-4 rounded-xl border border-warning/30 bg-warning/[0.08] px-4 py-3 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-deep animate-pulse" />
              <p className="font-mono text-[10px] tracking-widest text-warning-deep">
                DEV MODE · SHOWING MOCK DATA — NOT FOR OPERATIONAL USE
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Vessel list */}
      <section className="relative pb-20">
        <div className="mx-auto max-w-7xl px-6">
          {isLoading ? (
            <VesselListSkeleton />
          ) : filtered.length === 0 ? (
            <EmptyState
              title={stats.dataUnavailable ? 'DATA UNAVAILABLE' : 'No vessels found'}
              description={
                stats.dataUnavailable
                  ? 'Live AIS feed is not connected. Connect a backend to stream vessel positions.'
                  : 'Adjust your filters or search query.'
              }
            />
          ) : (
            <div className="rounded-2xl border border-ink/[0.08] bg-white shadow-soft overflow-hidden">
              {/* Header row */}
              <div className="hidden md:grid grid-cols-[1.5fr_120px_140px_100px_140px_60px] gap-4 px-6 py-3.5 border-b border-ink/[0.06] bg-pearl-soft">
                <span className="font-mono text-[9px] tracking-widest text-mist-deep">
                  VESSEL
                </span>
                <span className="font-mono text-[9px] tracking-widest text-mist-deep">
                  TYPE
                </span>
                <span className="font-mono text-[9px] tracking-widest text-mist-deep">
                  POSITION
                </span>
                <span className="font-mono text-[9px] tracking-widest text-mist-deep">
                  SPEED
                </span>
                <span className="font-mono text-[9px] tracking-widest text-mist-deep">
                  DESTINATION
                </span>
                <span className="font-mono text-[9px] tracking-widest text-mist-deep text-right">
                  —
                </span>
              </div>

              <ul className="divide-y divide-ink/[0.06]">
                {filtered.slice(0, 100).map((v, i) => (
                  <motion.li
                    key={v.mmsi}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(i * 0.008, 0.25) }}
                    className="group grid grid-cols-1 md:grid-cols-[1.5fr_120px_140px_100px_140px_60px] gap-4 items-center px-6 py-4 hover:bg-pearl-soft transition-colors cursor-pointer"
                    onClick={() => setSelectedVessel(v)}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="h-9 w-9 shrink-0 rounded-lg border flex items-center justify-center"
                        style={{
                          borderColor: `${vesselColor(v.type)}40`,
                          backgroundColor: `${vesselColor(v.type)}15`,
                        }}
                      >
                        <Ship
                          className="h-4 w-4"
                          style={{ color: vesselColor(v.type) }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-ink truncate">
                            {v.name}
                          </span>
                          {isMockRecord(v) && (
                            <span className="font-mono text-[8px] tracking-widest text-warning-deep">
                              MOCK
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-ocean/70 truncate">
                          MMSI {v.mmsi}
                        </div>
                      </div>
                    </div>

                    <Badge variant="light-neutral" size="sm">
                      {v.type.toUpperCase()}
                    </Badge>

                    <div className="flex items-center gap-1.5 font-mono text-[10px] text-ink-soft">
                      <MapPin className="h-3 w-3 text-ocean/60" />
                      {v.position.lat.toFixed(2)}, {v.position.lng.toFixed(2)}
                    </div>

                    <div className="font-mono text-xs text-ink tabular-nums">
                      {v.speed.toFixed(1)}{' '}
                      <span className="text-ink-soft">kn</span>
                    </div>

                    <div className="text-xs text-ink-soft truncate">
                      {v.destination ?? '—'}
                    </div>

                    <div className="flex justify-end">
                      <ArrowUpRight className="h-3.5 w-3.5 text-mist group-hover:text-ocean transition-colors" />
                    </div>
                  </motion.li>
                ))}
              </ul>

              {filtered.length > 100 && (
                <div className="px-6 py-3 border-t border-ink/[0.06] text-center">
                  <span className="font-mono text-[10px] tracking-widest text-mist-deep">
                    SHOWING 100 OF {filtered.length}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatBlock({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone: 'ocean' | 'teal' | 'violet' | 'accent';
}) {
  const toneStyles = {
    ocean: 'text-ocean',
    teal: 'text-teal-dark',
    violet: 'text-violet-dark',
    accent: 'text-accent-deep',
  }[tone];

  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-widest text-mist-deep">
          {label}
        </span>
        <Icon className={cn('h-3.5 w-3.5', toneStyles)} />
      </div>
      <div className={cn('font-display text-2xl font-bold tabular-nums', toneStyles)}>
        {value}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color?: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors',
        active
          ? 'border-ocean/40 bg-ocean/10 text-ocean'
          : 'border-ink/10 bg-white text-ink-soft hover:border-ocean/30 hover:text-ink'
      )}
    >
      {color && (
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {label}
    </button>
  );
}

function VesselListSkeleton() {
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white shadow-soft overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-1 md:grid-cols-[1.5fr_120px_140px_100px_140px_60px] gap-4 items-center px-6 py-4 border-b border-ink/[0.04] last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-ink/[0.05] animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-32 rounded bg-ink/[0.05] animate-pulse" />
              <div className="h-2 w-20 rounded bg-ink/[0.05] animate-pulse" />
            </div>
          </div>
          <div className="h-5 w-16 rounded-full bg-ink/[0.05] animate-pulse" />
          <div className="h-3 w-24 rounded bg-ink/[0.05] animate-pulse" />
          <div className="h-3 w-12 rounded bg-ink/[0.05] animate-pulse" />
          <div className="h-3 w-20 rounded bg-ink/[0.05] animate-pulse" />
          <div className="h-3 w-4 ml-auto rounded bg-ink/[0.05] animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border border-ink/10 flex items-center justify-center mb-4">
        <Ship className="h-5 w-5 text-mist-deep" />
      </div>
      <p className="font-mono text-[10px] tracking-widest text-ocean">
        {title}
      </p>
      <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}

function vesselColor(type: VesselTypeId): string {
  return VESSEL_TYPES.find((v) => v.id === type)?.color ?? '#94a3b8';
}