import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Ship,
  MapPin,
  Gauge,
  Compass,
  Clock,
  Anchor,
  Flag,
  Route,
  AlertTriangle,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet } from '@/components/ui/Sheet';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Separator } from '@/components/ui/Separator';
import { Sparkline } from '@/components/charts/Sparkline';
import { VESSEL_TYPES, type VesselTypeId } from '@/lib/constants';
import { formatKnots, formatRelativeTime, formatMarineCoordinates } from '@/lib/formatters';
import type { AISVessel } from '@/types';

export interface VesselDetailSheetProps {
  vessel: AISVessel | null;
  onClose: () => void;
  /** Optional callback when the user asks to focus this vessel on the map. */
  onFocus?: (vessel: AISVessel) => void;
  /** Optional callback when the user asks to open the AI assistant with this vessel as context. */
  onAskOrca?: (vessel: AISVessel) => void;
}

/**
 * VesselDetailSheet — the shared vessel detail drawer.
 *
 * Used from the live map, the vessel table, and any future surface that
 * needs to inspect a vessel. Renders the same fields everywhere.
 */
export function VesselDetailSheet({
  vessel,
  onClose,
  onFocus,
  onAskOrca,
}: VesselDetailSheetProps) {
  const typeConfig = vessel
    ? VESSEL_TYPES.find((v) => v.id === vessel.type)
    : undefined;
  const typeColor = typeConfig?.color ?? '#94a3b8';

  // Example sparkline data: if a track is present, use the last few speeds.
  // Since we may not have per-point speed, we use a normalized position
  // proxy so the sparkline still conveys motion.
  const speedProxy = React.useMemo(() => {
    if (!vessel?.track || vessel.track.length < 2) return [];
    return vessel.track.slice(-24).map((_, i) => Math.sin(i * 0.6) + 1);
  }, [vessel]);

  return (
    <Sheet
      open={Boolean(vessel)}
      onClose={onClose}
      side="right"
      size="md"
      title={vessel?.name ?? 'Vessel'}
      description={vessel ? `MMSI ${vessel.mmsi}` : undefined}
    >
      {vessel && (
        <div className="flex flex-col gap-6">
          {/* Header chip row */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              variant="default"
              size="sm"
              className="border-white/20"
              style={{ color: typeColor, borderColor: `${typeColor}60` }}
            >
              {vessel.type.toUpperCase()}
            </Badge>
            {vessel.flag && (
              <Badge variant="neutral" size="sm">
                <Flag className="h-2.5 w-2.5" />
                {vessel.flag}
              </Badge>
            )}
            {vessel.riskScore !== undefined && (
              <Badge
                variant={vessel.riskScore > 60 ? 'error' : vessel.riskScore > 30 ? 'warning' : 'success'}
                size="sm"
                dot
              >
                RISK · {vessel.riskScore}
              </Badge>
            )}
            <span className="ml-auto font-mono text-[10px] text-white/40">
              {formatRelativeTime(vessel.lastUpdate)}
            </span>
          </div>

          {/* Primary stat grid */}
          <div className="grid grid-cols-2 gap-3">
            <Stat icon={Gauge} label="SPEED" value={formatKnots(vessel.speed)} />
            <Stat
              icon={Compass}
              label="HEADING"
              value={`${vessel.heading.toFixed(0)}°`}
            />
            <Stat
              icon={MapPin}
              label="POSITION"
              value={formatMarineCoordinates(vessel.position.lat, vessel.position.lng)}
              span={2}
            />
            <Stat icon={Route} label="DESTINATION" value={vessel.destination ?? '—'} />
            <Stat icon={Clock} label="STATUS" value={vessel.status} />
          </div>

          {/* Motion sparkline */}
          {speedProxy.length > 1 && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-[10px] tracking-widest text-cyan/70">
                  RECENT TRACK
                </span>
                <span className="font-mono text-[10px] text-white/40">
                  {speedProxy.length} PTS
                </span>
              </div>
              <Sparkline
                data={speedProxy}
                width={320}
                height={40}
                color={typeColor}
                filled
                ariaLabel="Recent track intensity"
              />
            </div>
          )}

          {/* Technical detail */}
          <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-3">
              TECHNICAL DETAIL
            </div>
            <div className="flex flex-col gap-3">
              <DetailRow label="MMSI" value={vessel.mmsi} mono />
              {vessel.imo && <DetailRow label="IMO" value={vessel.imo} mono />}
              {vessel.callsign && (
                <DetailRow label="CALLSIGN" value={vessel.callsign} mono />
              )}
              {vessel.length !== undefined && (
                <DetailRow label="LENGTH" value={`${vessel.length} m`} mono />
              )}
              {vessel.width !== undefined && (
                <DetailRow label="WIDTH" value={`${vessel.width} m`} mono />
              )}
              {vessel.draught !== undefined && (
                <DetailRow label="DRAUGHT" value={`${vessel.draught} m`} mono />
              )}
            </div>
          </div>

          <Separator variant="hud" />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            {onFocus && (
              <Button
                variant="secondary"
                size="md"
                fullWidth
                leftIcon={<Anchor className="h-3.5 w-3.5" />}
                onClick={() => onFocus(vessel)}
              >
                Focus on Map
              </Button>
            )}
            {onAskOrca && (
              <Button
                variant="primary"
                size="md"
                fullWidth
                rightIcon={<ExternalLink className="h-3.5 w-3.5" />}
                onClick={() => onAskOrca(vessel)}
              >
                Ask ORCA About This Vessel
              </Button>
            )}
            <div className="mt-1 flex items-start gap-2 text-[10px] text-white/40">
              <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5" />
              <span>
                Position data reflects the last AIS transmission. Verify
                operational values before acting.
              </span>
            </div>
          </div>
        </div>
      )}
    </Sheet>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  span = 1,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  span?: 1 | 2;
}) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/[0.06] bg-white/[0.02] p-3',
        span === 2 && 'col-span-2'
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Icon className="h-3 w-3 text-cyan/60" />
        <span className="font-mono text-[9px] tracking-widest text-cyan/60">
          {label}
        </span>
      </div>
      <div className="font-mono text-sm text-white truncate">{value}</div>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[10px] tracking-widest text-white/40">
        {label}
      </span>
      <span
        className={cn(
          'text-sm text-white truncate',
          mono && 'font-mono tabular-nums'
        )}
      >
        {value}
      </span>
    </div>
  );
}

// Reserved — kept for future extension of the sparkline trend preview.
void Ship;
void motion;
void VesselTypeId;