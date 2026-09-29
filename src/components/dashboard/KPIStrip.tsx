import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sparkline } from '@/components/charts/Sparkline';
import { fadeInUp, staggerContainer } from '@/lib/animations';

export interface KPIDatum {
  id: string;
  label: string;
  value: string | number;
  unit?: string;
  /** Percentage change vs the previous period, e.g. 4.2 or -1.8. */
  delta?: number;
  /** Optional description under the value. */
  hint?: string;
  /** Optional sparkline data. */
  spark?: number[];
  /** Optional accent color for the value. */
  accent?: 'ocean' | 'cyan' | 'teal' | 'violet' | 'warning' | 'danger';
}

export interface KPIStripProps {
  data: KPIDatum[];
  tone?: 'light' | 'dark';
  columns?: 2 | 3 | 4 | 5;
  className?: string;
  /** Optional slot rendered to the right of the strip (e.g. an export button). */
  action?: ReactNode;
}

const ACCENT_VALUE_COLOR: Record<NonNullable<KPIDatum['accent']>, string> = {
  ocean: 'text-ocean',
  cyan: 'text-cyan',
  teal: 'text-teal-dark',
  violet: 'text-violet-dark',
  warning: 'text-warning-deep',
  danger: 'text-danger-deep',
};

/**
 * KPIStrip — the standard strip of headline numbers.
 *
 * Used at the top of Vessels, Ocean, Simulations, and any dashboard page
 * that needs a compact set of key metrics. Includes an optional delta
 * indicator and an optional inline sparkline.
 */
export function KPIStrip({
  data,
  tone = 'light',
  columns = 4,
  className,
  action,
}: KPIStripProps) {
  const isLight = tone === 'light';

  const columnClass = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4',
    5: 'grid-cols-2 md:grid-cols-5',
  }[columns];

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {action && <div className="flex items-center justify-end">{action}</div>}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className={cn('grid gap-3', columnClass)}
      >
        {data.map((d) => {
          const accentColor = d.accent
            ? ACCENT_VALUE_COLOR[d.accent]
            : isLight
              ? 'text-ink'
              : 'text-white';
          return (
            <motion.div
              key={d.id}
              variants={fadeInUp}
              className={cn(
                'rounded-2xl border p-4',
                isLight
                  ? 'border-ink/[0.08] bg-white shadow-soft'
                  : 'border-white/[0.06] bg-white/[0.02]'
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    'font-mono text-[9px] tracking-widest uppercase',
                    isLight ? 'text-mist-deep' : 'text-white/50'
                  )}
                >
                  {d.label}
                </span>
                {d.delta !== undefined && (
                  <DeltaIndicator delta={d.delta} tone={tone} />
                )}
              </div>

              <div className="flex items-baseline gap-1.5">
                <span
                  className={cn(
                    'font-display text-2xl font-semibold tabular-nums',
                    accentColor
                  )}
                >
                  {d.value}
                </span>
                {d.unit && (
                  <span
                    className={cn(
                      'font-mono text-xs',
                      isLight ? 'text-mist-deep' : 'text-white/50'
                    )}
                  >
                    {d.unit}
                  </span>
                )}
              </div>

              {d.hint && (
                <div
                  className={cn(
                    'mt-1 text-[11px]',
                    isLight ? 'text-ink-soft' : 'text-white/60'
                  )}
                >
                  {d.hint}
                </div>
              )}

              {d.spark && d.spark.length > 1 && (
                <div className="mt-3">
                  <Sparkline
                    data={d.spark}
                    width={140}
                    height={24}
                    color={
                      d.accent === 'warning'
                        ? '#F4B942'
                        : d.accent === 'danger'
                          ? '#EF4444'
                          : isLight
                            ? '#0E7490'
                            : '#06b6d4'
                    }
                    filled
                    ariaLabel={`${d.label} trend`}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}

function DeltaIndicator({
  delta,
  tone,
}: {
  delta: number;
  tone: 'light' | 'dark';
}) {
  const isLight = tone === 'light';
  if (Math.abs(delta) < 0.05) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1 font-mono text-[9px]',
          isLight ? 'text-mist-deep' : 'text-white/50'
        )}
      >
        <Minus className="h-2.5 w-2.5" />
        0%
      </span>
    );
  }
  const isUp = delta > 0;
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-mono text-[9px]',
        isUp ? 'text-success-deep' : 'text-danger-deep'
      )}
    >
      {isUp ? (
        <ArrowUpRight className="h-2.5 w-2.5" />
      ) : (
        <ArrowDownRight className="h-2.5 w-2.5" />
      )}
      {Math.abs(delta).toFixed(1)}%
    </span>
  );
}