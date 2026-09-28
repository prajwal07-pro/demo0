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
  Clock,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { VESSEL_TYPES, type VesselTypeId } from '@/lib/constants';
import { aisService } from '@/services/aisService';
import { isDev } from '@/services/apiClient';
import { MOCK_VESSELS, isMockRecord } from '@/services/mockData';
import { fadeInUp, staggerContainer } from '@/lib/animations';
import { useAppStore } from '@/store/useAppStore';

/**
 * Vessels — vessel intelligence workspace.
 * Searchable, filterable table of tracked vessels with type legend,
 * stats strip, and a detail drawer.
 *
 * DATA INTEGRITY:
 *  - Real data only from aisService.
 *  - In dev, falls back to clearly-tagged MOCK data with the MOCK badge.
 *  - Never shows fabricated vessel positions in production.
 */
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
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div
          variants={fadeInUp}
          className="flex items-center gap-3 mb-2"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-cyan/70">
            MODULE · AIS
          </span>
          <span className="h-px w-12 bg-cyan/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Vessel Intelligence
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mt-3 max-w-2xl text-muted-foreground"
        >
          Real-time AIS tracking of commercial, fishing, research, and
          government vessels. Filter, search, and inspect any tracked vessel.
        </motion.p>
      </motion.div>

      {/* Stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard
          icon={Ship}
          label="TRACKED"
          value={stats.total.toString()}
          accent="cyan"
        />
        <StatCard
          icon={Gauge}
          label="AVG SPEED"
          value={`${stats.avgSpeed.toFixed(1)} kn`}
          accent="teal"
        />
        <StatCard
          icon={TrendingUp}
          label="CARGO"
          value={(stats.byType.cargo ?? 0).toString()}
          accent="violet"
        />
        <StatCard
          icon={Anchor}
          label="FISHING"
          value={(stats.byType.fishing ?? 0).toString()}
          accent="magenta"
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3 mb-4">
        <div className="flex-1">
          <Input
            variant="glass"
            leftIcon={<Search className="h-4 w-4" />}
            placeholder="Search by name, MMSI, destination…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <Filter className="h-3.5 w-3.5 text-cyan/70 shrink-0" />
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

      {/* Data-integrity notice */}
      {stats.dataUnavailable && isDev && (
        <div className="mb-4 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="font-mono text-[10px] tracking-widest text-amber-400">
            DEV MODE · SHOWING MOCK DATA — NOT FOR OPERATIONAL USE
          </p>
        </div>
      )}

      {/* Vessel list */}
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
        <div className="rounded-xl border border-white/5 bg-white/[0.015] overflow-hidden">
          {/* Header row */}
          <div className="hidden md:grid grid-cols-[1.5fr_100px_120px_100px_120px_60px] gap-3 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
            <span className="telemetry-text text-[9px]">VESSEL</span>
            <span className="telemetry-text text-[9px]">TYPE</span>
            <span className="telemetry-text text-[9px]">POSITION</span>
            <span className="telemetry-text text-[9px]">SPEED</span>
            <span className="telemetry-text text-[9px]">DESTINATION</span>
            <span className="telemetry-text text-[9px] text-right">DETAILS</span>
          </div>

          <ul className="divide-y divide-white/5">
            {filtered.slice(0, 100).map((v, i) => (
              <motion.li
                key={v.mmsi}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.01, 0.3) }}
                className="group grid grid-cols-1 md:grid-cols-[1.5fr_100px_120px_100px_120px_60px] gap-3 items-center px-5 py-3.5 hover:bg-white/[0.03] transition-colors cursor-pointer"
                onClick={() => setSelectedVessel(v)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-8 w-8 shrink-0 rounded-md border flex items-center justify-center"
                    style={{
                      borderColor: `${vesselColor(v.type)}40`,
                      backgroundColor: `${vesselColor(v.type)}10`,
                    }}
                  >
                    <Ship
                      className="h-3.5 w-3.5"
                      style={{ color: vesselColor(v.type) }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-white truncate">
                        {v.name}
                      </span>
                      {isMockRecord(v) && (
                        <span className="font-mono text-[8px] tracking-widest text-amber-400/80">
                          MOCK
                        </span>
                      )}
                    </div>
                    <div className="font-mono text-[10px] text-cyan/70 truncate">
                      MMSI {v.mmsi}
                    </div>
                  </div>
                </div>

                <Badge variant="neutral" size="sm">
                  {v.type.toUpperCase()}
                </Badge>

                <div className="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3 text-cyan/50" />
                  {v.position.lat.toFixed(2)}, {v.position.lng.toFixed(2)}
                </div>

                <div className="font-mono text-xs text-white tabular-nums">
                  {v.speed.toFixed(1)} <span className="text-muted-foreground">kn</span>
                </div>

                <div className="text-xs text-muted-foreground truncate">
                  {v.destination ?? '—'}
                </div>

                <div className="flex justify-end">
                  <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-cyan transition-colors" />
                </div>
              </motion.li>
            ))}
          </ul>

          {filtered.length > 100 && (
            <div className="px-5 py-3 border-t border-white/5 text-center">
              <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
                SHOWING 100 OF {filtered.length}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------- Subcomponents ----------

function StatCard({
  icon: Icon,
  label,
  value,
  accent = 'cyan',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  accent?: 'cyan' | 'teal' | 'violet' | 'magenta';
}) {
  const accentClass = {
    cyan: 'text-cyan border-cyan/20 bg-cyan/5',
    teal: 'text-teal border-teal/20 bg-teal/5',
    violet: 'text-violet border-violet/20 bg-violet/5',
    magenta: 'text-magenta border-magenta/20 bg-magenta/5',
  }[accent];

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.015] p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="telemetry-text text-[9px] text-muted-foreground">{label}</span>
        <div className={cn('h-6 w-6 rounded-md border flex items-center justify-center', accentClass)}>
          <Icon className="h-3 w-3" />
        </div>
      </div>
      <div className="font-display text-2xl font-semibold text-white tabular-nums">
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
        'shrink-0 inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors',
        active
          ? 'border-cyan/50 bg-cyan/10 text-cyan'
          : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-cyan/30 hover:text-white'
      )}
    >
      {color && (
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      )}
      {label}
    </button>
  );
}

function VesselListSkeleton() {
  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.015] overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="grid grid-cols-[1.5fr_100px_120px_100px_120px_60px] gap-3 items-center px-5 py-4 border-b border-white/5 last:border-b-0"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-white/5 animate-pulse" />
            <div className="flex flex-col gap-1.5">
              <div className="h-3 w-32 rounded bg-white/5 animate-pulse" />
              <div className="h-2 w-20 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
          <div className="h-5 w-16 rounded-full bg-white/5 animate-pulse" />
          <div className="h-3 w-24 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-12 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-20 rounded bg-white/5 animate-pulse" />
          <div className="h-3 w-4 ml-auto rounded bg-white/5 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-16 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
        <Ship className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <p className="font-mono text-[10px] tracking-widest text-cyan/70">
        {title}
      </p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        {description}
      </p>
    </div>
  );
}

function vesselColor(type: VesselTypeId): string {
  return VESSEL_TYPES.find((v) => v.id === type)?.color ?? '#94a3b8';
}

// reserved for future use
void Clock;