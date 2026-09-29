import { useMemo } from 'react';
import { cn } from '@/lib/utils';

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  filled?: boolean;
  className?: string;
  /** Accessible label describing the sparkline. */
  ariaLabel?: string;
}

/**
 * Sparkline — a minimal inline trend line.
 *
 * Rendered with plain SVG so it remains performant inside tables, cards,
 * and lists. The line is drawn from left to right in the order the data
 * was provided.
 */
export function Sparkline({
  data,
  width = 100,
  height = 28,
  color = '#06b6d4',
  filled = false,
  className,
  ariaLabel = 'Trend',
}: SparklineProps) {
  const path = useMemo(() => {
    if (data.length === 0) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const stepX = width / Math.max(data.length - 1, 1);
    const paddingY = 2;
    const usableHeight = height - paddingY * 2;

    return data
      .map((value, i) => {
        const x = i * stepX;
        const normalized = (value - min) / range;
        const y = paddingY + usableHeight * (1 - normalized);
        return `${i === 0 ? 'M' : 'L'}${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(' ');
  }, [data, width, height]);

  const fillPath = useMemo(() => {
    if (!filled || data.length === 0) return '';
    return `${path} L${width},${height} L0,${height} Z`;
  }, [filled, path, width, height]);

  if (data.length === 0) {
    return (
      <div
        className={cn('inline-flex items-center justify-center', className)}
        style={{ width, height }}
        aria-hidden="true"
      >
        <span className="h-px w-full bg-current/10" />
      </div>
    );
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('inline-block', className)}
      role="img"
      aria-label={ariaLabel}
    >
      {filled && fillPath && (
        <path d={fillPath} fill={color} fillOpacity={0.12} stroke="none" />
      )}
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}