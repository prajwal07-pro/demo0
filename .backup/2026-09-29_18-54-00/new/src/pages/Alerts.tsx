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
import { Sheet } from '@/components/ui/Sheet';
import { useAppStore } from '@/store/useAppStore';
import { isDev } from '@/services/apiClient';
import { MOCK_ALERTS } from '@/services/mockData';
import type { AlertSeverity, MarineAlert } from '@/types';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export default function Alerts() {
  const alerts = useAppStore((s) => s.alerts);
  const setAlerts = useAppStore((s) => s.setAlerts);
  const [filter, setFilter] = React.useState<AlertSeverity | 'all'>('all');
  const [selected, setSelected] = React.useState<MarineAlert | null>(null);

  const source: MarineAlert[] = React.useMemo(() => {
    if (alerts.length === 0 && isDev) return MOCK_ALERTS;
    return alerts;
  }, [alerts]);

  const filtered = React.useMemo(() => {
    if (filter === 'all') return source;
    return source.filter((a) => a.severity === filter);
  }, [source, filter]);

  const counts = React.useMemo(() => {
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

  const handleAcknowledge = (alert: MarineAlert) => {
    // Update both the local list and the store so the state persists
    // across navigation within this session.
    const nextAlerts = source.map((a) =>
      a.id === alert.id ? { ...a, acknowledged: !a.acknowledged } : a
    );
    setAlerts(nextAlerts);
    setSelected((prev) =>
      prev && prev.id === alert.id
        ? { ...prev, acknowledged: !prev.acknowledged }
        : prev
    );
  };

  return (
    <div className="relative bg-pearl text-ink">
      <section className="relative pt-14 pb-10 lg:pt-20 lg:pb-14 border-b border-ink/[0.06]">
        <div className="absolute inset-0 data-grid-light opacity-50" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-5">
              <span className="h-px w-10 bg-danger/40" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-danger-deep">
                SAFETY · RISK & ALERTS
              </span>
            </motion.div>
            <motion.h1
              variants={fadeInUp}
              className="font-display text-4xl md:text-5xl font-bold tracking-tight text-ink leading-[1.05] text-balance"
            >
              Active warnings,
              <br />
              <span className="text-gradient-navy">in real time.</span>
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="mt-5 max-w-2xl text-base text-ink-soft leading-relaxed"
            >
              Marine warnings, storm advisories, and safety alerts from
              authoritative sources — displayed as they arrive.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <section className="relative py-8 border-b border-ink/[0.06]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SeverityCard
              severity="emergency"
              label="EMERGENCY"
              count={counts.emergency}
              icon={Siren}
              active={filter === 'emergency'}
              onClick={() => setFilter(filter === 'emergency' ? 'all' : 'emergency')}
            />
            <SeverityCard
              severity="critical"
              label="CRITICAL"
              count={counts.critical}
              icon={ShieldAlert}
              active={filter === 'critical'}
              onClick={() => setFilter(filter === 'critical' ? 'all' : 'critical')}
            />
            <SeverityCard
              severity="warning"
              label="WARNING"
              count={counts.warning}
              icon={AlertTriangle}
              active={filter === 'warning'}
              onClick={() => setFilter(filter === 'warning' ? 'all' : 'warning')}
            />
            <SeverityCard
              severity="info"
              label="INFO"
              count={counts.info}
              icon={Info}
              active={filter === 'info'}
              onClick={() => setFilter(filter === 'info' ? 'all' : 'info')}
            />
          </div>
        </div>
      </section>

      <section className="relative py-6">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-ocean" />
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
        </div>
      </section>

      {source === MOCK_ALERTS && isDev && (
        <section className="relative">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-4 rounded-xl border border-warning/30 bg-warning/[0.08] px-4 py-3 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-warning-deep animate-pulse" />
              <p className="font-mono text-[10px] tracking-widest text-warning-deep">
                DEV MODE · SHOWING MOCK ALERTS — NOT FOR OPERATIONAL USE
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-6">
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
                  <AlertRow
                    alert={alert}
                    onAcknowledge={() => handleAcknowledge(alert)}
                    onView={() => setSelected(alert)}
                  />
                </motion.li>
              ))}
            </motion.ul>
          )}
        </div>
      </section>

      {/* Alert detail sheet */}
      <Sheet
        open={selected !== null}
        onClose={() => setSelected(null)}
        side="right"
        size="md"
        title={selected?.title ?? 'Alert detail'}
        description={selected ? selected.type.toUpperCase() : undefined}
      >
        {selected && (
          <div className="flex flex-col gap-5 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={severityVariant(selected.severity)} size="sm" dot>
                {selected.severity.toUpperCase()}
              </Badge>
              <span className="font-mono text-[10px] tracking-widest text-cyan/70">
                SRC · {selected.source.toUpperCase()}
              </span>
            </div>

            <p className="text-sm text-white/75 leading-relaxed">
              {selected.description}
            </p>

            <div className="grid grid-cols-1 gap-3">
              <DetailRow
                icon={MapPin}
                label="LOCATION"
                value={`${selected.location.lat.toFixed(4)}, ${selected.location.lng.toFixed(4)}${
                  selected.radius ? ` · r=${selected.radius}km` : ''
                }`}
              />
              <DetailRow
                icon={Clock}
                label="TIMESTAMP"
                value={new Date(selected.timestamp).toLocaleString()}
              />
              {selected.expiresAt && (
                <DetailRow
                  icon={Clock}
                  label="EXPIRES"
                  value={new Date(selected.expiresAt).toLocaleString()}
                />
              )}
            </div>

            <Button
              variant="secondary"
              size="md"
              fullWidth
              leftIcon={
                selected.acknowledged ? (
                  <BellOff className="h-3.5 w-3.5" />
                ) : (
                  <Bell className="h-3.5 w-3.5" />
                )
              }
              onClick={() => handleAcknowledge(selected)}
            >
              {selected.acknowledged ? 'Unacknowledge' : 'Acknowledge'}
            </Button>
          </div>
        )}
      </Sheet>
    </div>
  );
}

function severityVariant(severity: AlertSeverity): BadgeProps['variant'] {
  return severity === 'emergency' || severity === 'critical'
    ? 'light-error'
    : severity === 'warning'
      ? 'light-warning'
      : 'light-info';
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-cyan/60" />
        <span className="font-mono text-[9px] tracking-widest text-cyan/70">
          {label}
        </span>
      </div>
      <div className="font-mono text-sm text-white/90 truncate">{value}</div>
    </div>
  );
}

function SeverityCard({
  severity,
  label,
  count,
  icon: Icon,
  active,
  onClick,
}: {
  severity: AlertSeverity;
  label: string;
  count: number;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  onClick: () => void;
}) {
  const styles = {
    emergency: 'border-danger/30 bg-danger/[0.06] text-danger-deep',
    critical: 'border-danger/25 bg-danger/[0.04] text-danger-deep',
    warning: 'border-warning/30 bg-warning/[0.08] text-warning-deep',
    info: 'border-ocean/25 bg-ocean/[0.06] text-ocean',
  }[severity];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-left rounded-2xl border p-5 shadow-soft bg-white transition-all hover:-translate-y-0.5',
        styles,
        active && 'ring-2 ring-current/30'
      )}
      aria-pressed={active}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[10px] tracking-widest opacity-80">
          {label}
        </span>
        <Icon className="h-4 w-4" />
      </div>
      <div className="font-display text-3xl font-bold tabular-nums">
        {count.toString().padStart(2, '0')}
      </div>
    </button>
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
          ? 'border-ocean/40 bg-ocean/10 text-ocean'
          : 'border-ink/10 bg-white text-ink-soft hover:border-ocean/30 hover:text-ink'
      )}
    >
      {label}
    </button>
  );
}

function AlertRow({
  alert,
  onAcknowledge,
  onView,
}: {
  alert: MarineAlert;
  onAcknowledge: () => void;
  onView: () => void;
}) {
  const severityAccent = {
    emergency: 'border-l-danger',
    critical: 'border-l-danger/80',
    warning: 'border-l-warning',
    info: 'border-l-ocean',
  }[alert.severity];

  const Icon =
    alert.severity === 'emergency'
      ? Siren
      : alert.severity === 'critical'
        ? ShieldAlert
        : alert.severity === 'warning'
          ? AlertTriangle
          : Info;

  const iconColor = {
    emergency: 'text-danger-deep',
    critical: 'text-danger-deep',
    warning: 'text-warning-deep',
    info: 'text-ocean',
  }[alert.severity];

  return (
    <article
      className={cn(
        'rounded-2xl border border-ink/[0.06] border-l-4 bg-white p-5 shadow-soft',
        severityAccent
      )}
    >
      <div className="flex items-start gap-4">
        <div className="h-10 w-10 shrink-0 rounded-xl border border-ink/10 bg-pearl-soft flex items-center justify-center">
          <Icon className={cn('h-4 w-4', iconColor)} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <Badge variant={severityVariant(alert.severity)} size="sm" dot>
              {alert.severity.toUpperCase()}
            </Badge>
            <span className="font-mono text-[10px] tracking-widest text-ocean/70">
              {alert.type.toUpperCase()}
            </span>
          </div>
          <h3 className="font-display text-base font-semibold text-ink">
            {alert.title}
          </h3>
          <p className="mt-1 text-sm text-ink-soft leading-relaxed">
            {alert.description}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-[11px] text-ink-soft">
            <span className="inline-flex items-center gap-1.5 font-mono">
              <MapPin className="h-3 w-3 text-ocean/60" />
              {alert.location.lat.toFixed(3)}, {alert.location.lng.toFixed(3)}
              {alert.radius ? ` · r=${alert.radius}km` : ''}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono">
              <Clock className="h-3 w-3 text-ocean/60" />
              {new Date(alert.timestamp).toLocaleString()}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={onAcknowledge}
            className={cn(
              'h-8 w-8 rounded-md border flex items-center justify-center transition-colors',
              alert.acknowledged
                ? 'border-success/40 bg-success/10 text-success-deep'
                : 'border-ink/10 text-mist-deep hover:border-ocean/40 hover:text-ocean'
            )}
            aria-label={alert.acknowledged ? 'Unacknowledge' : 'Acknowledge'}
          >
            {alert.acknowledged ? (
              <BellOff className="h-3.5 w-3.5" />
            ) : (
              <Bell className="h-3.5 w-3.5" />
            )}
          </button>
          <Button
            variant="ghost-light"
            size="sm"
            rightIcon={<ExternalLink className="h-3 w-3" />}
            onClick={onView}
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
    <div className="rounded-2xl border border-dashed border-ink/15 bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto h-12 w-12 rounded-full border border-ink/10 flex items-center justify-center mb-4">
        <AlertTriangle className="h-5 w-5 text-mist-deep" />
      </div>
      <p className="font-mono text-[10px] tracking-widest text-ocean">
        NO ACTIVE ALERTS
      </p>
      <p className="mt-2 text-sm text-ink-soft max-w-md mx-auto">
        There are currently no marine alerts matching your filters.
      </p>
    </div>
  );
}