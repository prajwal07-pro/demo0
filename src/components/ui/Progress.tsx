import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'xs' | 'sm' | 'md';
  tone?: 'ocean' | 'cyan' | 'teal' | 'violet' | 'warning' | 'danger';
  surface?: 'light' | 'dark';
  /** Show the value as a label above the bar. */
  showLabel?: boolean;
  label?: string;
  /** Indeterminate progress (loops forever). */
  indeterminate?: boolean;
}

const TONE_STYLES: Record<NonNullable<ProgressProps['tone']>, string> = {
  ocean: 'bg-gradient-to-r from-ocean to-cyan-dark',
  cyan: 'bg-gradient-to-r from-cyan to-teal',
  teal: 'bg-gradient-to-r from-teal to-turquoise',
  violet: 'bg-gradient-to-r from-violet to-violet-light',
  warning: 'bg-gradient-to-r from-warning to-amber-300',
  danger: 'bg-gradient-to-r from-danger to-magenta',
};

const SIZE_STYLES: Record<NonNullable<ProgressProps['size']>, string> = {
  xs: 'h-0.5',
  sm: 'h-1',
  md: 'h-1.5',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      size = 'sm',
      tone = 'ocean',
      surface = 'light',
      showLabel = false,
      label,
      indeterminate = false,
      ...props
    },
    ref
  ) => {
    const pct = Math.min(Math.max((value / max) * 100, 0), 100);
    const trackColor = surface === 'light' ? 'bg-ink/[0.06]' : 'bg-white/[0.06]';
    const labelColor = surface === 'light' ? 'text-mist-deep' : 'text-white/60';
    const valueColor = surface === 'light' ? 'text-ocean' : 'text-cyan';

    return (
      <div ref={ref} className={cn('w-full', className)} {...props}>
        {(showLabel || label) && (
          <div className="flex items-center justify-between mb-2">
            {label && (
              <span
                className={cn(
                  'font-mono text-[10px] tracking-widest uppercase',
                  labelColor
                )}
              >
                {label}
              </span>
            )}
            {showLabel && !indeterminate && (
              <span
                className={cn(
                  'font-mono text-[10px] tracking-widest',
                  valueColor
                )}
              >
                {Math.round(pct)}%
              </span>
            )}
          </div>
        )}

        <div
          className={cn(
            'w-full rounded-full overflow-hidden',
            SIZE_STYLES[size],
            trackColor
          )}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={max}
          aria-valuenow={indeterminate ? undefined : value}
          aria-label={label}
        >
          {indeterminate ? (
            <motion.div
              className={cn('h-full rounded-full', TONE_STYLES[tone])}
              style={{ width: '40%' }}
              initial={{ x: '-100%' }}
              animate={{ x: '250%' }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : (
            <motion.div
              className={cn('h-full rounded-full', TONE_STYLES[tone])}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          )}
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: 'ocean' | 'cyan' | 'teal' | 'violet' | 'warning';
  /** Center label override. Defaults to the percentage. */
  label?: React.ReactNode;
  className?: string;
}

const CIRCLE_TONES: Record<NonNullable<CircularProgressProps['tone']>, string> = {
  ocean: '#0E7490',
  cyan: '#06b6d4',
  teal: '#14b8a6',
  violet: '#8b5cf6',
  warning: '#F4B942',
};

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  thickness = 5,
  tone = 'ocean',
  label,
  className,
}: CircularProgressProps) {
  const pct = Math.min(Math.max(value / max, 0), 1);
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);
  const color = CIRCLE_TONES[tone];

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={thickness}
          fill="none"
          className="text-ink/[0.06]"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={thickness}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-display text-xs font-semibold text-ink tabular-nums">
          {label ?? `${Math.round(pct * 100)}%`}
        </span>
      </div>
    </div>
  );
}