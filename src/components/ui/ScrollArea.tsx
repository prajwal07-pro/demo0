import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Direction of scroll. */
  orientation?: 'vertical' | 'horizontal' | 'both';
  /** Max height when vertical. */
  maxHeight?: number | string;
  /** Hide the scrollbar but keep scrolling. */
  hideScrollbar?: boolean;
}

/**
 * ScrollArea — consistent scroll container with optional scrollbar hiding.
 *
 * The platform uses this instead of ad-hoc `overflow-y-auto` so that
 * scrolling feels and looks consistent across the map panels, chat
 * surfaces, and long-form pages.
 */
export const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      orientation = 'vertical',
      maxHeight,
      hideScrollbar = false,
      style,
      ...props
    },
    ref
  ) => {
    const orientationClass = {
      vertical: 'overflow-y-auto overflow-x-hidden',
      horizontal: 'overflow-x-auto overflow-y-hidden',
      both: 'overflow-auto',
    }[orientation];

    return (
      <div
        ref={ref}
        className={cn(
          orientationClass,
          hideScrollbar && 'no-scrollbar',
          className
        )}
        style={{ ...(maxHeight ? { maxHeight } : {}), ...style }}
        {...props}
      />
    );
  }
);

ScrollArea.displayName = 'ScrollArea';