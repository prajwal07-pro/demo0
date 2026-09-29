import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  light?: boolean;
}

export function Skeleton({
  className,
  variant = 'shimmer',
  rounded = 'md',
  light = true,
  ...props
}: SkeletonProps) {
  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  const base = light ? 'bg-ink/[0.06]' : 'bg-white/5';
  const shimmerGradient = light
    ? 'from-transparent via-ocean/[0.08] to-transparent'
    : 'from-transparent via-cyan/10 to-transparent';
  const waveGradient = light
    ? 'from-transparent via-teal/[0.10] to-transparent'
    : 'from-transparent via-teal/15 to-transparent';

  if (variant === 'pulse') {
    return (
      <div
        className={cn(base, 'animate-pulse', roundedStyles[rounded], className)}
        {...props}
      />
    );
  }

  if (variant === 'shimmer') {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          base,
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn('absolute inset-0 bg-gradient-to-r', shimmerGradient)}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div
        className={cn(
          'relative overflow-hidden',
          base,
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        <motion.div
          className={cn('absolute inset-0 bg-gradient-to-r', waveGradient)}
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className={cn(base, roundedStyles[rounded], className)} {...props} />
  );
}

export function SkeletonText({
  lines = 3,
  className,
  light = true,
}: {
  lines?: number;
  className?: string;
  light?: boolean;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          light={light}
          className={cn('h-3', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({
  className,
  light = true,
}: {
  className?: string;
  light?: boolean;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl p-5',
        light
          ? 'border border-ink/[0.06] bg-white shadow-soft'
          : 'border border-white/5 bg-white/[0.02]',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton light={light} className="h-9 w-9" rounded="lg" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton light={light} className="h-3 w-1/3" />
          <Skeleton light={light} className="h-2 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} light={light} />
    </div>
  );
}