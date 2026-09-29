import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLMotionProps<'div'> {
  variant?:
    | 'default'
    | 'glass'
    | 'solid'
    | 'outline'
    | 'ghost'
    | 'light'
    | 'light-soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  glow?: boolean;
}

/**
 * Card — the platform-standard surface primitive.
 *
 * Defaults to the LIGHT editorial surface so that pages on `bg-pearl`
 * render correctly without extra overrides. Dark variants remain available
 * for workbench and immersive contexts.
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'light',
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
      light: 'bg-white border border-ink/10 shadow-soft text-ink',
      'light-soft': 'bg-pearl-soft border border-ink/[0.08] shadow-soft text-ink',
    };

    const paddingStyles: Record<NonNullable<CardProps['padding']>, string> = {
      none: 'p-0',
      sm: 'p-3',
      md: 'p-5',
      lg: 'p-7',
    };

    const isLight = variant === 'light' || variant === 'light-soft';

    return (
      <motion.div
        ref={ref}
        className={cn(
          'relative rounded-2xl overflow-hidden transition-all duration-300',
          variantStyles[variant],
          paddingStyles[padding],
          hoverable &&
            (isLight
              ? 'cursor-pointer hover:shadow-soft-md hover:-translate-y-0.5'
              : 'cursor-pointer hover:border-cyan/40 hover:bg-white/[0.03] hover:shadow-glow-cyan'),
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

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  /** Light variant flag for text colors */
  light?: boolean;
}

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { className, title, subtitle, icon, action, light = true, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4 mb-4', className)}
        {...props}
      >
        <div className="flex items-start gap-3 min-w-0 flex-1">
          {icon && (
            <div
              className={cn(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border',
                light
                  ? 'bg-ice text-ocean border-ocean/15'
                  : 'bg-cyan/10 text-cyan border-cyan/20'
              )}
            >
              {icon}
            </div>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <h3
                className={cn(
                  'font-display text-base font-semibold truncate',
                  light ? 'text-ink' : 'text-white'
                )}
              >
                {title}
              </h3>
            )}
            {subtitle && (
              <p
                className={cn(
                  'text-xs mt-0.5 truncate',
                  light ? 'text-ink-soft' : 'text-white/60'
                )}
              >
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

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm', className)} {...props} />
));

CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center gap-3 mt-4 pt-4 border-t border-current/5',
      className
    )}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export const CardDivider = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'h-px w-full my-4 bg-gradient-to-r from-transparent via-ocean/30 to-transparent',
      className
    )}
    {...props}
  />
));

CardDivider.displayName = 'CardDivider';