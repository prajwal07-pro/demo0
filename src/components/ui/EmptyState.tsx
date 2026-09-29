import * as React from 'react';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  /** Light surface (default) or dark surface. */
  light?: boolean;
}

/**
 * EmptyState — the standard ORCA pattern for "no data", "loading done with
 * nothing to show", or "source unavailable" states.
 *
 * Every valid route must render one of: real content, a loading state, or
 * one of these empty states. Never a blank screen.
 */
export function EmptyState({
  icon: Icon,
  eyebrow,
  title,
  description,
  action,
  className,
  light = true,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dashed px-6 py-16 text-center',
        light
          ? 'border-ink/15 bg-white/50 text-ink'
          : 'border-white/10 bg-white/[0.01] text-white',
        className
      )}
    >
      {Icon && (
        <div
          className={cn(
            'mx-auto h-12 w-12 rounded-full border flex items-center justify-center mb-4',
            light ? 'border-ink/10 bg-pearl-soft' : 'border-white/10 bg-white/[0.03]'
          )}
        >
          <Icon
            className={cn('h-5 w-5', light ? 'text-mist-deep' : 'text-white/50')}
          />
        </div>
      )}
      {eyebrow && (
        <p
          className={cn(
            'font-mono text-[10px] tracking-widest uppercase mb-2',
            light ? 'text-ocean' : 'text-cyan/70'
          )}
        >
          {eyebrow}
        </p>
      )}
      <h3
        className={cn(
          'font-display text-lg font-semibold',
          light ? 'text-ink' : 'text-white'
        )}
      >
        {title}
      </h3>
      {description && (
        <p
          className={cn(
            'mt-2 text-sm max-w-md mx-auto',
            light ? 'text-ink-soft' : 'text-white/60'
          )}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-6 flex justify-center">{action}</div>}
    </div>
  );
}