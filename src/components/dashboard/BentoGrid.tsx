import * as React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export interface BentoGridProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  children: React.ReactNode;
  /** Number of columns on desktop. Defaults to 6. */
  columns?: 3 | 4 | 6;
  /** Row height hint in pixels. Defaults to 120. */
  rowHeight?: number;
}

/**
 * BentoGrid — CSS grid for modular dashboard layouts.
 *
 * Items use the `span` prop (via BentoItem) to control how many columns
 * and rows they occupy. Designed for the Intelligence, Community, and
 * Learning dashboards where cards vary in size.
 */
export function BentoGrid({
  children,
  columns = 6,
  rowHeight = 120,
  className,
  ...props
}: BentoGridProps) {
  const columnClass = {
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-6',
  }[columns];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={cn('grid gap-4 auto-rows-[minmax(0,1fr)]', columnClass, className)}
      style={{ gridAutoRows: `${rowHeight}px` }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export interface BentoItemProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  /** Column span on desktop, out of the grid's column count. */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Row span. */
  rowSpan?: 1 | 2 | 3;
  children: React.ReactNode;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  /** Whether to allow hover lift. */
  hoverable?: boolean;
  /** Optional className. */
  className?: string;
}

export function BentoItem({
  colSpan = 1,
  rowSpan = 1,
  tone = 'light',
  hoverable = false,
  className,
  children,
  ...props
}: BentoItemProps) {
  const colSpanClass = {
    1: 'lg:col-span-1',
    2: 'lg:col-span-2',
    3: 'lg:col-span-3',
    4: 'lg:col-span-4',
    5: 'lg:col-span-5',
    6: 'lg:col-span-6',
  }[colSpan];

  const rowSpanClass = {
    1: 'row-span-1',
    2: 'row-span-2',
    3: 'row-span-3',
  }[rowSpan];

  const isLight = tone === 'light';

  return (
    <motion.div
      variants={fadeInUp}
      whileHover={hoverable ? { y: -2 } : undefined}
      transition={{ duration: 0.2 }}
      className={cn(
        'rounded-2xl border overflow-hidden',
        colSpanClass,
        rowSpanClass,
        isLight
          ? 'border-ink/[0.08] bg-white shadow-soft'
          : 'border-white/[0.06] bg-white/[0.02]',
        hoverable &&
          (isLight
            ? 'transition-shadow hover:shadow-soft-md'
            : 'transition-colors hover:border-cyan/30 hover:bg-white/[0.04]'),
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}