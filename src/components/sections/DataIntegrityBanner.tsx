import * as React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export type DataIntegrityVariant = 'verified' | 'info' | 'warning';

export interface DataIntegrityBannerProps {
  variant?: DataIntegrityVariant;
  title: string;
  description?: string;
  /** Optional right-hand action slot. */
  action?: React.ReactNode;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  className?: string;
}

const VARIANT_STYLES: Record<
  DataIntegrityVariant,
  {
    icon: typeof ShieldCheck;
    containerLight: string;
    containerDark: string;
    iconLight: string;
    iconDark: string;
    label: string;
    labelColorLight: string;
    labelColorDark: string;
  }
> = {
  verified: {
    icon: ShieldCheck,
    containerLight: 'border-success/25 bg-success/[0.06]',
    containerDark: 'border-teal/25 bg-teal/[0.06]',
    iconLight: 'border-success/40 bg-success/[0.12] text-success-deep',
    iconDark: 'border-teal/40 bg-teal/[0.12] text-teal',
    label: 'VERIFIED',
    labelColorLight: 'text-success-deep',
    labelColorDark: 'text-teal',
  },
  info: {
    icon: Info,
    containerLight: 'border-ocean/20 bg-ocean/[0.05]',
    containerDark: 'border-cyan/20 bg-cyan/[0.05]',
    iconLight: 'border-ocean/40 bg-ocean/[0.10] text-ocean',
    iconDark: 'border-cyan/40 bg-cyan/[0.10] text-cyan',
    label: 'INFO',
    labelColorLight: 'text-ocean',
    labelColorDark: 'text-cyan',
  },
  warning: {
    icon: AlertTriangle,
    containerLight: 'border-warning/30 bg-warning/[0.06]',
    containerDark: 'border-amber-400/30 bg-amber-400/[0.05]',
    iconLight: 'border-warning/40 bg-warning/[0.12] text-warning-deep',
    iconDark: 'border-amber-400/40 bg-amber-400/[0.12] text-amber-400',
    label: 'WARNING',
    labelColorLight: 'text-warning-deep',
    labelColorDark: 'text-amber-400',
  },
};

/**
 * DataIntegrityBanner — a compact banner conveying the trust level of
 * data displayed on a page.
 *
 * Examples:
 *  - "Verified" — every layer on this page has a source and timestamp.
 *  - "Info"     — mock data in dev or a message from the platform.
 *  - "Warning"  — some sources are unreachable; the UI is failing safe.
 */
export function DataIntegrityBanner({
  variant = 'verified',
  title,
  description,
  action,
  tone = 'light',
  className,
}: DataIntegrityBannerProps) {
  const config = VARIANT_STYLES[variant];
  const Icon = config.icon;
  const isLight = tone === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'rounded-2xl border px-5 py-4 flex items-start gap-4',
        isLight ? config.containerLight : config.containerDark,
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div
        className={cn(
          'shrink-0 h-9 w-9 rounded-lg border flex items-center justify-center',
          isLight ? config.iconLight : config.iconDark
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'font-mono text-[10px] tracking-widest uppercase mb-1',
            isLight ? config.labelColorLight : config.labelColorDark
          )}
        >
          {config.label}
        </div>
        <div
          className={cn(
            'text-sm font-medium leading-snug',
            isLight ? 'text-ink' : 'text-white'
          )}
        >
          {title}
        </div>
        {description && (
          <p
            className={cn(
              'mt-1 text-xs leading-relaxed',
              isLight ? 'text-ink-soft' : 'text-white/70'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}