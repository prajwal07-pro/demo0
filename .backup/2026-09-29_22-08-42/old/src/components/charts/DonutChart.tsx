import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DonutChartDatum {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartProps {
  data: DonutChartDatum[];
  size?: number;
  thickness?: number;
  /** Center label (e.g. total). */
  centerLabel?: string;
  centerValue?: string;
  className?: string;
  tone?: 'light' | 'dark';
}

/**
 * DonutChart — SVG donut for category breakdowns.
 *
 * Used for things like vessel type distribution, alert severity mix, and
 * resource allocation panels. Each segment animates in sequence.
 */
export function DonutChart({
  data,
  size = 160,
  thickness = 18,
  centerLabel,
  centerValue,
  className,
  tone = 'light',
}: DonutChartProps) {
  const total = useMemo(
    () => data.reduce((sum, d) => sum + d.value, 0),
    [data]
  );

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = useMemo(() => {
    if (total === 0) return [];
    let offset = 0;
    return data.map((d) => {
      const fraction = d.value / total;
      const length = fraction * circumference;
      const seg = {
        ...d,
        length,
        offset,
        percentage: fraction * 100,
      };
      offset += length;
      return seg;
    });
  }, [data, total, circumference]);

  const trackColor = tone === 'light' ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.06)';
  const valueColor = tone === 'light' ? 'text-ink' : 'text-white';
  const labelColor = tone === 'light' ? 'text-mist-deep' : 'text-white/50';

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={thickness}
          fill="none"
        />
        {segments.map((seg, i) => (
          <motion.circle
            key={seg.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={seg.color}
            strokeWidth={thickness}
            fill="none"
            strokeLinecap="butt"
            strokeDasharray={`${seg.length} ${circumference}`}
            strokeDashoffset={-seg.offset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          />
        ))}
      </svg>

      {(centerLabel || centerValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {centerValue && (
            <span className={cn('font-display text-2xl font-bold tabular-nums', valueColor)}>
              {centerValue}
            </span>
          )}
          {centerLabel && (
            <span className={cn('mt-0.5 font-mono text-[9px] tracking-widest uppercase', labelColor)}>
              {centerLabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export interface DonutLegendProps {
  data: DonutChartDatum[];
  total?: number;
  tone?: 'light' | 'dark';
  className?: string;
}

export function DonutLegend({
  data,
  total,
  tone = 'light',
  className,
}: DonutLegendProps) {
  const computedTotal = total ?? data.reduce((sum, d) => sum + d.value, 0);
  const isLight = tone === 'light';

  return (
    <ul className={cn('flex flex-col gap-2', className)}>
      {data.map((d) => {
        const pct = computedTotal > 0 ? Math.round((d.value / computedTotal) * 100) : 0;
        return (
          <li key={d.label} className="flex items-center gap-2.5">
            <span
              className="h-2.5 w-2.5 rounded-sm shrink-0"
              style={{ backgroundColor: d.color }}
            />
            <span
              className={cn(
                'flex-1 text-xs truncate',
                isLight ? 'text-ink-soft' : 'text-white/70'
              )}
            >
              {d.label}
            </span>
            <span
              className={cn(
                'font-mono text-[10px] tabular-nums',
                isLight ? 'text-ink' : 'text-white'
              )}
            >
              {d.value}
            </span>
            <span
              className={cn(
                'font-mono text-[10px] tabular-nums w-9 text-right',
                isLight ? 'text-mist-deep' : 'text-white/50'
              )}
            >
              {pct}%
            </span>
          </li>
        );
      })}
    </ul>
  );
}