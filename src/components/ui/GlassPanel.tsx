import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---------- HUD Corner Decorations ----------
function HUDCorners({ accent = 'cyan' }: { accent?: 'cyan' | 'teal' | 'magenta' | 'violet' }) {
  const accentColor = {
    cyan: 'border-cyan',
    teal: 'border-teal',
    magenta: 'border-magenta',
    violet: 'border-violet',
  }[accent];

  const size = 'w-3 h-3';
  return (
    <>
      <span
        className={cn('absolute -top-px -left-px border-t-2 border-l-2', size, accentColor, 'opacity-60')}
        aria-hidden="true"
      />
      <span
        className={cn('absolute -top-px -right-px border-t-2 border-r-2', size, accentColor, 'opacity-60')}
        aria-hidden="true"
      />
      <span
        className={cn('absolute -bottom-px -left-px border-b-2 border-l-2', size, accentColor, 'opacity-60')}
        aria-hidden="true"
      />
      <span
        className={cn('absolute -bottom-px -right-px border-b-2 border-r-2', size, accentColor, 'opacity-60')}
        aria-hidden="true"
      />
    </>
  );
}

// ---------- Glass Panel ----------
export interface GlassPanelProps extends HTMLMotionProps<'div'> {
  /** Visual density */
  intensity?: 'light' | 'medium' | 'heavy';
  /** Show HUD corners for that sci-fi look */
  hud?: boolean;
  /** HUD accent color */
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet';
  /** Show top scan-line animation */
  scanning?: boolean;
  /** Border tint */
  borderAccent?: boolean;
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
    };

    const borderStyles = borderAccent
      ? {
          cyan: 'border-cyan/20',
          teal: 'border-teal/20',
          magenta: 'border-magenta/20',
          violet: 'border-violet/20',
        }[accent]
      : '';

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-xl overflow-hidden',
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

// ---------- HUD Frame (for the whole dashboard) ----------
export interface HUDFrameProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  accent?: 'cyan' | 'teal' | 'magenta' | 'violet';
}

export const HUDFrame = React.forwardRef<HTMLDivElement, HUDFrameProps>(
  ({ className, label, accent = 'cyan', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative rounded-xl border border-cyan/20 p-4', className)}
        {...props}
      >
        <HUDCorners accent={accent} />
        {label && (
          <span className="absolute -top-2 left-4 bg-abyss px-2 font-mono text-[10px] tracking-widest text-cyan/80 uppercase">
            {label}
          </span>
        )}
        {children}
      </div>
    );
  }
);

HUDFrame.displayName = 'HUDFrame';

// ---------- Coordinate Label ----------
export interface CoordinateLabelProps {
  lat: number;
  lng: number;
  className?: string;
}

export function CoordinateLabel({ lat, lng, className }: CoordinateLabelProps) {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[10px] tracking-wider text-cyan/70',
        className
      )}
    >
      <span className="text-cyan/40">◆</span>
      {Math.abs(lat).toFixed(3)}°{latDir} {Math.abs(lng).toFixed(3)}°{lngDir}
    </span>
  );
}