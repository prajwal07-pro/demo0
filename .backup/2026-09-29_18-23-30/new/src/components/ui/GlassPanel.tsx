import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

function HUDCorners({
  accent = 'cyan',
}: {
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet' | 'ocean';
}) {
  const accentColor = {
    cyan: 'border-cyan',
    teal: 'border-teal',
    magenta: 'border-magenta',
    violet: 'border-violet',
    ocean: 'border-ocean',
  }[accent];

  const size = 'w-3 h-3';
  return (
    <>
      <span
        className={cn(
          'absolute -top-px -left-px border-t-2 border-l-2',
          size,
          accentColor,
          'opacity-60'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'absolute -top-px -right-px border-t-2 border-r-2',
          size,
          accentColor,
          'opacity-60'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'absolute -bottom-px -left-px border-b-2 border-l-2',
          size,
          accentColor,
          'opacity-60'
        )}
        aria-hidden="true"
      />
      <span
        className={cn(
          'absolute -bottom-px -right-px border-b-2 border-r-2',
          size,
          accentColor,
          'opacity-60'
        )}
        aria-hidden="true"
      />
    </>
  );
}

export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  intensity?: 'light' | 'medium' | 'heavy' | 'light-surface';
  hud?: boolean;
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet' | 'ocean';
  scanning?: boolean;
  borderAccent?: boolean;
  children?: React.ReactNode;
}

export const GlassPanel = React.forwardRef<HTMLDivElement, GlassPanelProps>(
  (
    {
      className,
      intensity = 'medium',
      hud = false,
      accent = 'cyan',
      scanning = false,
      borderAccent = false,
      children,
      ...props
    },
    ref
  ) => {
    const intensityStyles = {
      light: 'bg-white/[0.02] backdrop-blur-sm border border-white/[0.06]',
      medium: 'bg-glass backdrop-blur-md border border-white/10 shadow-glass',
      heavy: 'bg-abyss/70 backdrop-blur-xl border border-white/10 shadow-glass',
      'light-surface': 'bg-white border border-ink/10 shadow-soft text-ink',
    };

    const borderStyles = borderAccent
      ? {
          cyan: 'border-cyan/20',
          teal: 'border-teal/20',
          magenta: 'border-magenta/20',
          violet: 'border-violet/20',
          ocean: 'border-ocean/20',
        }[accent]
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden',
          intensityStyles[intensity],
          borderStyles,
          className
        )}
        {...props}
      >
        {hud && <HUDCorners accent={accent} />}
        {scanning && (
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden="true"
          >
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan/60 to-transparent animate-scan" />
          </div>
        )}
        {children}
      </motion.div>
    );
  }
);

GlassPanel.displayName = 'GlassPanel';

export interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet' | 'ocean';
  light?: boolean;
  children?: React.ReactNode;
}

export const HUDFrame = React.forwardRef<HTMLDivElement, HUDFrameProps>(
  (
    { className, label, accent = 'cyan', light = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-2xl p-4',
          light ? 'border border-ocean/20' : 'border border-cyan/20',
          className
        )}
        {...props}
      >
        <HUDCorners accent={light ? 'ocean' : accent} />
        {label && (
          <span
            className={cn(
              'absolute -top-2 left-4 px-2 font-mono text-[10px] tracking-widest uppercase',
              light ? 'bg-pearl text-ocean' : 'bg-abyss text-cyan/80'
            )}
          >
            {label}
          </span>
        )}
        {children}
      </div>
    );
  }
);

HUDFrame.displayName = 'HUDFrame';

export interface CoordinateLabelProps {
  lat: number;
  lng: number;
  className?: string;
  light?: boolean;
}

export function CoordinateLabel({
  lat,
  lng,
  className,
  light = false,
}: CoordinateLabelProps) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[10px] tracking-wider',
        light ? 'text-ocean' : 'text-cyan/70',
        className
      )}
    >
      <span className={light ? 'text-ocean/50' : 'text-cyan/40'}>◆</span>
      {Math.abs(lat).toFixed(3)}°{latDir} {Math.abs(lng).toFixed(3)}°{lngDir}
    </span>
  );
}