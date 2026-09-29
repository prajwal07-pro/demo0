import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface BarChartDatum {
  label: string;
  value: number;
  /** Optional color override. Defaults to the primary accent. */
  color?: string;
}

export interface BarChartProps {
  data: BarChartDatum[];
  height?: number;
  orientation?: 'vertical' | 'horizontal';
  showValues?: boolean;
  maxValue?: number;
  className?: string;
  /** Light or dark surface tone for labels. */
  tone?: 'light' | 'dark';
  primaryColor?: string;
}

/**
 * BarChart — lightweight CSS/SVG-free bar chart for metric breakdowns.
 * Suitable for compact dashboards, stat panels, and list-scale metrics.
 */
export function BarChart({
  data,
  height = 140,
  orientation = 'vertical',
  showValues = false,
  maxValue,
  className,
  tone = 'light',
  primaryColor = '#0E7490',
}: BarChartProps) {
  const computedMax = useMemo(() => {
    if (maxValue !== undefined) return maxValue;
    const values = data.map((d) => d.value);
    return Math.max(...values, 1);
  }, [data, maxValue]);

  const isLight = tone === 'light';
  const labelColor = isLight ? 'text-mist-deep' : 'text-white/50';
  const valueColor = isLight ? 'text-ink' : 'text-white';

  if (orientation === 'horizontal') {
    return (
      <div className={cn('flex flex-col gap-2', className)}>
        {data.map((d) => {
          const pct = (d.value / computedMax) * 100;
          return (
            <div key={d.label} className="flex items-center gap-3">
              <div className={cn('w-24 shrink-0 text-[11px] font-mono truncate', labelColor)}>
                {d.label}
              </div>
              <div className="flex-1 h-2 rounded-full bg-current/5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: d.color ?? primaryColor,
                  }}
                />
              </div>
              {showValues && (
                <div className={cn('w-12 shrink-0 text-right text-[11px] tabular-nums', valueColor)}>
                  {d.value}
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className={cn('flex items-end gap-2', className)} style={{ height }}>
      {data.map((d) => {
        const pct = (d.value / computedMax) * 100;
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
            {showValues && (
              <div className={cn('text-[10px] font-mono tabular-nums', valueColor)}>
                {d.value}
              </div>
            )}
            <div
              className="w-full rounded-t-md transition-all duration-500"
              style={{
                height: `${pct}%`,
                backgroundColor: d.color ?? primaryColor,
                minHeight: 2,
              }}
            />
            <div className={cn('w-full text-center text-[9px] font-mono truncate', labelColor)}>
              {d.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}