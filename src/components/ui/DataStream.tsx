import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---------- Data Stream Line ----------
export interface DataStreamProps {
  /** Direction of the flow */
  direction?: 'horizontal' | 'vertical';
  /** Speed multiplier (1 = normal) */
  speed?: number;
  /** Line color accent */
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet';
  /** Line thickness */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Show animated dots on the line */
  particles?: boolean;
  className?: string;
}

export function DataStream({
  direction = 'horizontal',
  speed = 1,
  accent = 'cyan',
  thickness = 'thin',
  particles = true,
  className,
}: DataStreamProps) {
  const accentColor = {
    cyan: 'from-transparent via-cyan to-transparent',
    teal: 'from-transparent via-teal to-transparent',
    magenta: 'from-transparent via-magenta to-transparent',
    violet: 'from-transparent via-violet to-transparent',
  }[accent];

  const thicknessStyles = {
    thin: 'h-px w-full',
    medium: 'h-0.5 w-full',
    thick: 'h-1 w-full',
  };

  const isVertical = direction === 'vertical';

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        isVertical ? 'w-px h-full' : thicknessStyles[thickness],
        className
      )}
      aria-hidden="true"
    >
      {/* Static base line */}
      <div
        className={cn(
          'absolute inset-0',
          isVertical ? 'bg-gradient-to-b' : 'bg-gradient-to-r',
          'from-white/5 via-white/10 to-white/5'
        )}
      />

      {/* Moving pulse */}
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
        transition={{
          duration: 2.5 / speed,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Particles */}
      {particles &&
        [0, 0.5, 1].map((delay, i) => (
          <motion.div
            key={i}
            className={cn(
              'absolute h-1 w-1 rounded-full',
              accent === 'cyan' && 'bg-cyan shadow-[0_0_6px_rgba(6,182,212,0.8)]',
              accent === 'teal' && 'bg-teal shadow-[0_0_6px_rgba(20,184,166,0.8)]',
              accent === 'magenta' && 'bg-magenta shadow-[0_0_6px_rgba(236,72,153,0.8)]',
              accent === 'violet' && 'bg-violet shadow-[0_0_6px_rgba(139,92,246,0.8)]',
              isVertical
                ? 'left-1/2 -translate-x-1/2'
                : 'top-1/2 -translate-y-1/2'
            )}
            initial={isVertical ? { y: '-10%', opacity: 0 } : { x: '-10%', opacity: 0 }}
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

// ---------- Telemetry Readout ----------
export interface TelemetryReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  status?: 'ok' | 'warning' | 'critical';
  timestamp?: string;
  className?: string;
}

export function TelemetryReadout({
  label,
  value,
  unit,
  status = 'ok',
  timestamp,
  className,
}: TelemetryReadoutProps) {
  const statusColor = {
    ok: 'text-cyan',
    warning: 'text-amber-400',
    critical: 'text-magenta',
  }[status];

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <div className="flex items-center justify-between">
        <span className="telemetry-text text-[9px] text-muted-foreground">
          {label}
        </span>
        <span
          className={cn(
            'h-1 w-1 rounded-full animate-pulse',
            status === 'ok' && 'bg-cyan',
            status === 'warning' && 'bg-amber-400',
            status === 'critical' && 'bg-magenta'
          )}
        />
      </div>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            'font-mono text-sm font-semibold tabular-nums',
            statusColor
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="font-mono text-[10px] text-muted-foreground">
            {unit}
          </span>
        )}
      </div>
      {timestamp && (
        <span className="font-mono text-[9px] text-muted-foreground/60">
          {timestamp}
        </span>
      )}
    </div>
  );
}

// ---------- Signal Bars (for connectivity indicators) ----------
export function SignalBars({
  strength,
  className,
}: {
  strength: number; // 0-4
  className?: string;
}) {
  return (
    <div className={cn('flex items-end gap-0.5 h-3', className)} aria-label={`Signal ${strength} of 4`}>
      {[1, 2, 3, 4].map((bar) => (
        <div
          key={bar}
          className={cn(
            'w-0.5 rounded-sm transition-colors',
            bar <= strength ? 'bg-cyan' : 'bg-white/10'
          )}
          style={{ height: `${bar * 25}%` }}
        />
      ))}
    </div>
  );
}

// ---------- Live Indicator ----------
export function LiveIndicator({
  label = 'LIVE',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
      </span>
      <span className="font-mono text-[10px] font-semibold tracking-widest text-teal">
        {label}
      </span>
    </div>
  );
}