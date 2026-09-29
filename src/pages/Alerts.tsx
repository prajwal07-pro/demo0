import * as React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ShieldAlert,
  Info,
  Siren,
  MapPin,
  Clock,
  Bell,
  BellOff,
  ExternalLink,
  Filter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge, type BadgeProps } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { isDev } from '@/services/apiClient';
import { MOCK_ALERTS } from '@/services/mockData';
import type { AlertSeverity, MarineAlert } from '@/types';
import { fadeInUp, staggerContainer } from '@/lib/animations';

/**
 * Alerts — marine alerts & risk monitoring workspace.
 */
export default function Alerts() {
  const alerts = useAppStore((s) => s.alerts);
  const [filter, setFilter] = React.useState<AlertSeverity | 'all'>('all');

  // Dev fallback
  const list: MarineAlert[] = React.useMemo(() => {
    if (alerts.length === 0 && isDev) return MOCK_ALERTS;
    return alerts;
  }, [alerts]);

  const filtered = React.useMemo(() => {
    if (filter === 'all') return list;
    return list.filter((a) => a.severity === filter);
  }, [list, filter]);

  const counts = React.useMemo(() => {
    const bySeverity: Record<AlertSeverity, number> = {
      info: 0,
      warning: 0,
      critical: 0,
      emergency: 0,
    };
    list.forEach((a) => {
      bySeverity[a.severity]++;
    });
    return bySeverity;
  }, [list]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="mb-8"
      >
        <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-2">
          <span className="font-mono text-[10px] tracking-[0.3em] text-magenta/70">
            MODULE · SAFETY
          </span>
          <span className="h-px w-12 bg-magenta/40" />
        </motion.div>
        <motion.h1
          variants={fadeInUp}
          className="font-display text-4xl md:text-5xl font-bold text-white tracking-tight"
        >
          Risk & Alerts
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="mt-3 max-w-2xl text-muted-foreground"
        >
          Active marine warnings, storm advisories, and safety alerts from
          authoritative sources — displayed in real time.
        </motion.p>
      </motion.div>

      {/* Severity strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <SeverityCard
          severity="emergency"
          label="EMERGENCY"
          count={counts.emergency}
          icon={Siren}
        />
        <SeverityCard
          severity="critical"
          label="CRITICAL"
          count={counts.critical}
          icon={ShieldAlert}
        />
        <SeverityCard
          severity="warning"
          label="WARNING"
          count={counts.warning}
          icon={AlertTriangle}
        />
        <SeverityCard
          severity="info"
          label="INFO"
          count={counts.info}
          icon={Info}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <Filter className="h-3.5 w-3.5 text-cyan/70" />
        <FilterChip
          label="All"
          active={filter === 'all'}
          onClick={() => setFilter('all')}
        />
        {(['emergency', 'critical', 'warning', 'info'] as AlertSeverity[]).map(
          (s) => (
            <FilterChip
              key={s}
              label={s.toUpperCase()}
              active={filter === s}
              onClick={() => setFilter(s)}
            />
          )
        )}
      </div>

      {/* Dev notice */}
      {list === MOCK_ALERTS && isDev && (
        <div className="mb-5 rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3 flex items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
          <p className="font-mono text-[10px] tracking-widest text-amber-400">
            DEV MODE · SHOWING MOCK ALERTS — NOT FOR OPERATIONAL USE
          </p>
        </div>
      )}

      {/* Alert list */}
      {filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          {filtered.map((alert) => (
            <motion.li key={alert.id} variants={fadeInUp}>
              <AlertRow alert={alert} />
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

// ---------- Subcomponents ----------

function SeverityCard({
  severity,
  label,
  count,
  icon: Icon,
}: {
  severity: AlertSeverity;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const styles = {
    emergency: 'border-magenta/40 bg-magenta/5 text-magenta',
    critical: 'border-magenta/30 bg-magenta/[0.03] text-magenta/90',
    warning: 'border-amber-400/30 bg-amber-400/[0.03] text-amber-400',
    info: 'border-cyan/30 bg-cyan/[0.03] text-cyan',
  }[severity];

  return (
    <div className={cn('rounded-lg border p-4', styles)}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-[9px] tracking-widest opacity-80">
          {label}
        </span>
        <Icon className="h-3.5 w-3.5" />
      </div>
      <div className="font-display text-2xl font-bold tabular-nums">
        {count.toString().padStart(2, '0')}
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-widest transition-colors',
        active
          ? 'border-cyan/50 bg-cyan/10 text-cyan'
          : 'border-white/10 bg-white/[0.02] text-muted-foreground hover:border-cyan/30 hover:text-white'
      )}
    >
      {label}
    </button>
  );
}

function AlertRow({ alert }: { alert: MarineAlert }) {
  const [ack, setAck] = React.useState(alert.acknowledged);

  const severityStyle = {
    emergency: 'border-l-magenta bg-magenta/[0.03]',
    critical: 'border-l-magenta/80 bg-magenta/[0.02]',
    warning: 'border-l-amber-400 bg-amber-400/[0.02]',
    info: 'border-l-cyan bg-cyan/[0.02]',
  }[alert.severity];

  const severityBadge: BadgeProps['variant'] =
    alert.severity === 'emergency' || alert.severity === 'critical'
      ? 'error'
      : alert.severity === 'warning'
        ? 'warning'
        : 'info';

  const Icon =
    alert.severity === 'emergency'
      ? Siren
      : alert.severity === 'critical'
        ? ShieldAlert
        : alert.severity === 'warning'
          ? AlertTriangle
          : Info;

  return (
    <article
      className={cn(
        'rounded-lg border border-white/5 border-l-4 bg-white/[0.015] p-4',
        severityStyle
      )}
    >
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 shrink-0 rounded-md border border-white/10 bg-abyss/60 flex items-center justify-center">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Badge variant={severityBadge} size="sm" dot>
              {alert.severity.toUpperCase()}
            </Badge>
            <span className="font-mono text-[10px] tracking-widest text-cyan/60">
              {alert.type.toUpperCase()}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-white">
            {alert.title}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
            {alert.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <MapPin className="h-3 w-3 text-cyan/50" />
              {alert.location.lat.toFixed(3)}, {alert.location.lng.toFixed(3)}
              {alert.radius ? ` · r=${alert.radius}km` : ''}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Clock className="h-3 w-3 text-cyan/50" />
              {new Date(alert.timestamp).toLocaleString()}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Info className="h-3 w-3 text-cyan/50" />
              SRC · {alert.source.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={() => setAck((v) => !v)}
            className={cn(
              'h-8 w-8 rounded-md border flex items-center justify-center transition-colors',
              ack
                ? 'border-teal/40 bg-teal/10 text-teal'
                : 'border-white/10 text-muted-foreground hover:border-cyan/40 hover:text-cyan'
            )}
            aria-label={ack ? 'Unacknowledge' : 'Acknowledge'}
          >
            {ack ? (
              <BellOff className="h-3.5 w-3.5" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
          </button>
          <Button
            variant="ghost"
            size="sm"
            rightIcon={<ExternalLink className="h-3 w-3" />}
          >
            View
          </Button>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.01] px-6 py-16 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border border-white/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-muted-foreground/60" />
      </div>
      <p className="font-mono text-[10px] tracking-widest text-cyan/70">
        NO ACTIVE ALERTS
      </p>
      <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
        There are currently no marine alerts matching your filters.
      </p>
    </div>
  );
}