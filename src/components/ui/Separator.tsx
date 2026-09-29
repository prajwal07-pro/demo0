import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'hud' | 'hud-light';
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  (
    { className, orientation = 'horizontal', variant = 'default', ...props },
    ref
  ) => {
    const isVertical = orientation === 'vertical';

    const variantStyles = {
      default: isVertical ? 'bg-ink/10' : 'bg-ink/10',
      hud: isVertical
        ? 'bg-gradient-to-b from-transparent via-cyan/30 to-transparent'
        : 'bg-gradient-to-r from-transparent via-cyan/30 to-transparent',
      'hud-light': isVertical
        ? 'bg-gradient-to-b from-transparent via-ocean/25 to-transparent'
        : 'bg-gradient-to-r from-transparent via-ocean/25 to-transparent',
    }[variant];

    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation}
        className={cn(
          'shrink-0',
          isVertical ? 'w-px h-full' : 'h-px w-full',
          variantStyles,
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = 'Separator';