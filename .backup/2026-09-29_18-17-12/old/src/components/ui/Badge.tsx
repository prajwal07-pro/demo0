import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full font-mono text-[10px] font-medium tracking-wider uppercase transition-colors whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-cyan/10 text-cyan border border-cyan/30',
        teal: 'bg-teal/10 text-teal border border-teal/30',
        violet: 'bg-violet/10 text-violet-light border border-violet/30',
        magenta: 'bg-magenta/10 text-magenta-light border border-magenta/30',
        amber: 'bg-amber-400/10 text-amber-400 border border-amber-400/30',
        success: 'bg-teal/10 text-teal border border-teal/30',
        warning: 'bg-amber-400/10 text-amber-400 border border-amber-400/30',
        error: 'bg-magenta/10 text-magenta border border-magenta/30',
        info: 'bg-cyan/10 text-cyan border border-cyan/30',
        neutral: 'bg-white/5 text-muted-foreground border border-white/10',
        solid: 'bg-cyan text-abyss border border-cyan font-semibold',
        outline: 'bg-transparent text-cyan border border-cyan/40',
        glass: 'bg-glass backdrop-blur-md text-white border border-white/10',
      },
      size: {
        sm: 'h-5 px-2',
        md: 'h-6 px-2.5',
        lg: 'h-7 px-3 text-xs',
      },
      dot: {
        true: '',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      dot: false,
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  icon?: React.ReactNode;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              variant === 'success' && 'bg-teal animate-pulse',
              variant === 'warning' && 'bg-amber-400 animate-pulse',
              variant === 'error' && 'bg-magenta animate-pulse',
              variant === 'info' && 'bg-cyan animate-pulse',
              (!variant || variant === 'default') && 'bg-cyan animate-pulse'
            )}
            aria-hidden="true"
          />
        )}
        {icon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// ---------- Status Badge (semantic) ----------
export type StatusType = 'online' | 'offline' | 'warning' | 'error' | 'idle' | 'loading';

export interface StatusBadgeProps {
  status: StatusType;
  label?: string;
  className?: string;
}

const STATUS_CONFIG: Record<StatusType, { color: string; label: string; variant: BadgeProps['variant'] }> = {
  online: { color: 'bg-teal', label: 'Online', variant: 'success' },
  offline: { color: 'bg-muted-foreground', label: 'Offline', variant: 'neutral' },
  warning: { color: 'bg-amber-400', label: 'Warning', variant: 'warning' },
  error: { color: 'bg-magenta', label: 'Error', variant: 'error' },
  idle: { color: 'bg-cyan', label: 'Idle', variant: 'info' },
  loading: { color: 'bg-cyan', label: 'Loading', variant: 'info' },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant={config.variant} className={className}>
      <span className={cn('h-1.5 w-1.5 rounded-full', config.color, status === 'loading' && 'animate-pulse')} />
      {label ?? config.label}
    </Badge>
  );
}