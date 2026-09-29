import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

// ---------- Card Root ----------
export interface CardProps extends HTMLMotionProps<'div'> {
  variant?: 'default' | 'glass' | 'solid' | 'outline' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'glass',
      padding = 'md',
      hoverable = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    const variantStyles: Record<NonNullable<CardProps['variant']>, string> = {
      default: 'bg-midnight border border-white/10',
      glass: 'bg-glass backdrop-blur-md border border-white/10 shadow-glass',
      solid: 'bg-midnight-light border border-white/5',
      outline: 'bg-transparent border border-cyan/20',
      ghost: 'bg-transparent border border-transparent',
    };

    const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    };

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-xl overflow-hidden transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable &&
            'cursor-pointer hover:border-cyan/40 hover:bg-white/[0.03] hover:shadow-glow-cyan',
          glow && 'shadow-glow-cyan',
          className
        )}
        whileHover={hoverable ? { y: -2 } : undefined}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ---------- Card Header ----------
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, icon, action, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 mb-4', className)}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan/10 text-cyan border border-cyan/20">
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="font-display text-base font-semibold text-white truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ---------- Card Content ----------
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm text-foreground/90', className)} {...props} />
));

CardContent.displayName = 'CardContent';

// ---------- Card Footer ----------
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center gap-3 mt-4 pt-4 border-t border-white/5', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

// ---------- Card Divider (HUD-style) ----------
export const CardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'h-px w-full my-4 bg-gradient-to-r from-transparent via-cyan/30 to-transparent',
      className
    )}
    {...props}
  />
));

CardDivider.displayName = 'CardDivider';

// ---------- Telemetry Card (specialized) ----------
export interface TelemetryCardProps extends CardProps {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  status?: 'ok' | 'warning' | 'critical';
  timestamp?: string;
}

export const TelemetryCard = React.forwardRef<HTMLDivElement, TelemetryCardProps>(
  ({ label, value, unit, trend, status = 'ok', timestamp, className, ...props }, ref) => {
    const statusColors = {
      ok: 'text-cyan border-cyan/20 bg-cyan/5',
      warning: 'text-amber-400 border-amber-400/20 bg-amber-400/5',
      critical: 'text-magenta border-magenta/30 bg-magenta/5',
    };

    return (
      <Card
        ref={ref}
        variant="glass"
        padding="sm"
        className={cn('group', className)}
        {...props}
      >
        <div className="flex items-center justify-between mb-2">
          <span className="telemetry-text text-[10px]">{label}</span>
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              status === 'ok' && 'bg-cyan animate-pulse',
              status === 'warning' && 'bg-amber-400 animate-pulse',
              status === 'critical' && 'bg-magenta animate-pulse'
            )}
          />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-2xl font-semibold text-white tabular-nums">
            {value}
          </span>
          {unit && (
            <span className="font-mono text-xs text-muted-foreground">{unit}</span>
          )}
          {trend && (
            <span
              className={cn(
                'ml-auto text-[10px] font-mono',
                trend === 'up' && 'text-teal',
                trend === 'down' && 'text-magenta',
                trend === 'stable' && 'text-muted-foreground'
              )}
            >
              {trend === 'up' ? '▲' : trend === 'down' ? '▼' : '●'}
            </span>
          )}
        </div>
        {timestamp && (
          <div className="mt-2 font-mono text-[9px] text-muted-foreground">
            {timestamp}
          </div>
        )}
        <div
          className={cn(
            'absolute inset-x-0 bottom-0 h-px opacity-0 group-hover:opacity-100 transition-opacity',
            statusColors[status]
          )}
        />
      </Card>
    );
  }
);

TelemetryCard.displayName = 'TelemetryCard';