import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DataStreamProps {
  direction?: 'horizontal' | 'vertical';
  speed?: number;
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet' | 'ocean';
  thickness?: 'thin' | 'medium' | 'thick';
  particles?: boolean;
  className?: string;
  light?: boolean;
}

export function DataStream({
  direction = 'horizontal',
  speed = 1,
  accent = 'cyan',
  thickness = 'thin',
  particles = true,
  className,
  light = false,
}: DataStreamProps) {
  const accentColor = {
    cyan: 'from-transparent via-cyan to-transparent',
    teal: 'from-transparent via-teal to-transparent',
    magenta: 'from-transparent via-magenta to-transparent',
    violet: 'from-transparent via-violet to-transparent',
    ocean: 'from-transparent via-ocean to-transparent',
  }[accent];

  const thicknessStyles = {
    thin: 'h-px w-full',
    medium: 'h-0.5 w-full',
    thick: 'h-1 w-full',
  };

  const isVertical = direction === 'vertical';
  const baseGradient = light
    ? 'from-ink/[0.04] via-ink/[0.08] to-ink/[0.04]'
    : 'from-white/5 via-white/10 to-white/5';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isVertical ? 'w-px h-full' : thicknessStyles[thickness],
        className
      )}
      aria-hidden="true"
    >
      <div
        className={cn(
          'absolute inset-0',
          isVertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r',
          baseGradient
        )}
      />

      <motion.div
        className={cn(
          'absolute',
          isVertical
            ? 'inset-x-0 h-24 bg-gradient-to-b'
            : 'inset-y-0 w-24 bg-gradient-to-r',
          accentColor
        )}
        initial={isVertical ? { y: '-100%' } : { x: '-100%' }}
        animate={isVertical ? { y: '100%' } : { x: '100%' }}
        transition={{ duration: 2.5 / speed, repeat: Infinity, ease: 'linear' }}
      />

      {particles &&
        [0, 0.5, 1].map((delay, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute h-1 w-1 rounded-full',
              accent === 'cyan' &&
                (light
                  ? 'bg-ocean shadow-[0_0_6px_rgba(12,74,110,0.5)]'
                  : 'bg-cyan shadow-[0_0_6px_rgba(6,182,212,0.8)]'),
              accent === 'teal' &&
                'bg-teal shadow-[0_0_6px_rgba(20,184,166,0.8)]',
              accent === 'magenta' &&
                'bg-magenta shadow-[0_0_6px_rgba(236,72,153,0.8)]',
              accent === 'violet' &&
                'bg-violet shadow-[0_0_6px_rgba(139,92,246,0.8)]',
              accent === 'ocean' &&
                'bg-ocean shadow-[0_0_6px_rgba(12,74,110,0.6)]',
              isVertical
                ? 'left-1/2 -translate-x-1/2'
                : 'top-1/2 -translate-y-1/2'
            )}
            initial={
              isVertical
                ? { y: '-10%', opacity: 0 }
                : { x: '-10%', opacity: 0 }
            }
            animate={
              isVertical
                ? { y: '110%', opacity: [0, 1, 1, 0] }
                : { x: '110%', opacity: [0, 1, 1, 0] }
            }
            transition={{
              duration: 2 / speed,
              repeat: Infinity,
              ease: 'linear',
              delay: delay * 0.8,
            }}
          />
        ))}
    </div>
  );
}

export interface TelemetryReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'ok' | 'warning' | 'critical';
  timestamp?: string;
  className?: string;
  light?: boolean;
}

export function TelemetryReadout({
  label,
  value,
  unit,
  status = 'ok',
  timestamp,
  className,
  light = false,
}: TelemetryReadoutProps) {
  const statusColor = {
    ok: light ? 'text-ocean' : 'text-cyan',
    warning: 'text-amber-500',
    critical: light ? 'text-danger-deep' : 'text-magenta',
  }[status];

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'font-mono text-[9px] tracking-wider uppercase',
            light ? 'text-mist-deep' : 'text-white/50'
          )}
        >
          {label}
        </span>
        <span
          className={cn(
            'h-1 w-1 rounded-full animate-pulse',
            status === 'ok' && (light ? 'bg-ocean' : 'bg-cyan'),
            status === 'warning' && 'bg-amber-400',
            status === 'critical' && (light ? 'bg-danger' : 'bg-magenta')
          )}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn('font-mono text-sm font-semibold tabular-nums', statusColor)}
        >
          {value}
        </span>
        {unit && (
          <span
            className={cn(
              'font-mono text-[10px]',
              light ? 'text-mist-deep' : 'text-white/50'
            )}
          >
            {unit}
          </span>
        )}
      </div>
      {timestamp && (
        <span
          className={cn(
            'font-mono text-[9px]',
            light ? 'text-mist' : 'text-white/30'
          )}
        >
          {timestamp}
        </span>
      )}
    </div>
  );
}

export function SignalBars({
  strength,
  className,
  light = false,
}: {
  strength: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn('flex items-end gap-0.5 h-3', className)}
      aria-label={`Signal ${strength} of 4`}
    >
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={cn(
            'w-0.5 rounded-sm transition-colors',
            bar <= strength
              ? light
                ? 'bg-ocean'
                : 'bg-cyan'
              : light
                ? 'bg-ink/15'
                : 'bg-white/10'
          )}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
}

export function LiveIndicator({
  label = 'LIVE',
  className,
  light = false,
}: {
  label?: string;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="relative flex h-2 w-2">
        <span
          className={cn(
            'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
            light ? 'bg-success' : 'bg-teal'
          )}
        />
        <span
          className={cn(
            'relative inline-flex h-2 w-2 rounded-full',
            light ? 'bg-success' : 'bg-teal'
          )}
        />
      </span>
      <span
        className={cn(
          'font-mono text-[10px] font-semibold tracking-widest',
          light ? 'text-success-deep' : 'text-teal'
        )}
      >
        {label}
      </span>
    </div>
  );
}