import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'shimmer' | 'pulse' | 'wave';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
}

export function Skeleton({
  className,
  variant = 'shimmer',
  rounded = 'md',
  ...props
}: SkeletonProps) {
  const roundedStyles = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  if (variant === 'pulse') {
    return (
      <div
        className={cn(
          'bg-white/5 animate-pulse',
          roundedStyles[rounded],
          className
        )}
        {...props}
      />
    );
  }

  if (variant === 'shimmer') {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-white/5',
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan/10 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    );
  }

  if (variant === 'wave') {
    return (
      <div
        className={cn(
          'relative overflow-hidden bg-white/5',
          roundedStyles[rounded],
          className
        )}
        {...props}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-teal/15 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={cn('bg-white/5', roundedStyles[rounded], className)}
      {...props}
    />
  );
}

// ---------- Skeleton Text ----------
export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-3', i === lines - 1 && 'w-2/3')}
        />
      ))}
    </div>
  );
}

// ---------- Skeleton Card ----------
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 bg-white/[0.02] p-5',
        className
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <Skeleton className="h-9 w-9" rounded="lg" />
        <div className="flex-1 flex flex-col gap-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-2 w-1/2" />
        </div>
      </div>
      <SkeletonText lines={3} />
    </div>
  );
}

// ---------- Telemetry Skeleton ----------
export function TelemetrySkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl border border-white/5 bg-white/[0.02] p-3',
        className
      )}
    >
      <Skeleton className="h-2 w-20 mb-3" />
      <Skeleton className="h-7 w-24 mb-2" />
      <Skeleton className="h-2 w-16" />
    </div>
  );
}