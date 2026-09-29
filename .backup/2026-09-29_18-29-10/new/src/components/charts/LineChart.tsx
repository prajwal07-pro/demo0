import { useMemo, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export interface LineChartSeries {
  id: string;
  label: string;
  color: string;
  values: number[];
}

export interface LineChartProps {
  series: LineChartSeries[];
  /** X-axis labels (e.g. hours). Same length as each series' values. */
  xLabels?: string[];
  width?: number;
  height?: number;
  yUnit?: string;
  tone?: 'light' | 'dark';
  className?: string;
  /** Show the legend under the chart. */
  showLegend?: boolean;
}

/**
 * LineChart — multi-series SVG line chart with a hover crosshair.
 *
 * Renders one path per series plus optional axis labels. On hover the
 * chart displays a vertical crosshair with the value at each series for
 * the nearest x-label. Built for compact metric panels, not full BI
 * dashboards.
 */
export function LineChart({
  series,
  xLabels,
  width = 720,
  height = 240,
  yUnit,
  tone = 'light',
  className,
  showLegend = true,
}: LineChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  const padding = { top: 20, right: 20, bottom: 30, left: 40 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { globalMin, globalMax, pointCount } = useMemo(() => {
    const allValues = series.flatMap((s) => s.values);
    if (allValues.length === 0) {
      return { globalMin: 0, globalMax: 1, pointCount: 0 };
    }
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    const range = max - min || 1;
    return {
      globalMin: min - range * 0.05,
      globalMax: max + range * 0.05,
      pointCount: Math.max(...series.map((s) => s.values.length)),
    };
  }, [series]);

  const isLight = tone === 'light';
  const gridColor = isLight ? 'rgba(15, 23, 42, 0.06)' : 'rgba(255, 255, 255, 0.06)';
  const axisLabelColor = isLight ? 'text-mist-deep' : 'text-white/50';

  const getPath = (values: number[]) => {
    if (values.length === 0) return '';
    const stepX = chartWidth / Math.max(values.length - 1, 1);
    return values
      .map((v, i) => {
        const x = padding.left + i * stepX;
        const normalized = (v - globalMin) / (globalMax - globalMin);
        const y = padding.top + chartHeight * (1 - normalized);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || pointCount < 2) return;
    const rect = svgRef.current.getBoundingClientRect();
    const scaleX = rect.width / width;
    const localX = (e.clientX - rect.left) / scaleX;
    const relativeX = localX - padding.left;
    const index = Math.round(
      (relativeX / chartWidth) * (pointCount - 1)
    );
    setHoverIndex(Math.max(0, Math.min(pointCount - 1, index)));
  };

  const handleMouseLeave = () => setHoverIndex(null);

  return (
    <div className={cn('w-full', className)}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="img"
        aria-label="Line chart"
      >
        {/* Y grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = padding.top + chartHeight * p;
          return (
            <line
              key={p}
              x1={padding.left}
              y1={y}
              x2={padding.left + chartWidth}
              y2={y}
              stroke={gridColor}
              strokeWidth="1"
            />
          );
        })}

        {/* Y axis labels */}
        {[0, 0.5, 1].map((p) => {
          const value = globalMax - (globalMax - globalMin) * p;
          const y = padding.top + chartHeight * p;
          return (
            <text
              key={p}
              x={padding.left - 8}
              y={y + 3}
              textAnchor="end"
              className={cn('font-mono text-[9px] fill-current', axisLabelColor)}
            >
              {value.toFixed(1)}
              {yUnit ? ` ${yUnit}` : ''}
            </text>
          );
        })}

        {/* X axis labels */}
        {xLabels &&
          xLabels.map((label, i) => {
            // Only render some labels to avoid crowding.
            const step = Math.max(1, Math.floor(xLabels.length / 6));
            if (i % step !== 0 && i !== xLabels.length - 1) return null;
            const x =
              padding.left +
              (i / Math.max(xLabels.length - 1, 1)) * chartWidth;
            return (
              <text
                key={i}
                x={x}
                y={height - padding.bottom + 16}
                textAnchor="middle"
                className={cn('font-mono text-[9px] fill-current', axisLabelColor)}
              >
                {label}
              </text>
            );
          })}

        {/* Series paths */}
        {series.map((s) => (
          <path
            key={s.id}
            d={getPath(s.values)}
            fill="none"
            stroke={s.color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}

        {/* Hover crosshair */}
        {hoverIndex !== null && pointCount > 1 && (
          <>
            <line
              x1={padding.left + (hoverIndex / (pointCount - 1)) * chartWidth}
              y1={padding.top}
              x2={padding.left + (hoverIndex / (pointCount - 1)) * chartWidth}
              y2={padding.top + chartHeight}
              stroke={isLight ? 'rgba(15, 23, 42, 0.2)' : 'rgba(255, 255, 255, 0.2)'}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {series.map((s) => {
              const v = s.values[hoverIndex];
              if (v === undefined) return null;
              const normalized = (v - globalMin) / (globalMax - globalMin);
              const x =
                padding.left + (hoverIndex / (pointCount - 1)) * chartWidth;
              const y = padding.top + chartHeight * (1 - normalized);
              return (
                <circle
                  key={s.id}
                  cx={x}
                  cy={y}
                  r={4}
                  fill={s.color}
                  stroke={isLight ? '#FFFFFF' : '#020617'}
                  strokeWidth="2"
                />
              );
            })}
          </>
        )}
      </svg>

      {showLegend && (
        <div className="mt-4 flex flex-wrap items-center gap-4">
          {series.map((s) => (
            <div key={s.id} className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span
                className={cn(
                  'text-xs',
                  isLight ? 'text-ink-soft' : 'text-white/70'
                )}
              >
                {s.label}
              </span>
              {hoverIndex !== null && s.values[hoverIndex] !== undefined && (
                <span
                  className={cn(
                    'font-mono text-[10px] tabular-nums',
                    isLight ? 'text-ink' : 'text-white'
                  )}
                >
                  {s.values[hoverIndex]!.toFixed(1)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}