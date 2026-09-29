import * as React from 'react';
import { motion } from 'framer-motion';
import { CloudOff, RefreshCw, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface ServiceUnavailablePanelProps {
  /** Service name shown in the header, e.g. "AIS STREAM". */
  service: string;
  /** Optional reason string, e.g. "Backend proxy not configured". */
  reason?: string;
  /** Optional retry callback. */
  onRetry?: () => void;
  /** Optional link to data source documentation. */
  docsHref?: string;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  /** Compact layout for inline panels. */
  compact?: boolean;
  className?: string;
}

/**
 * ServiceUnavailablePanel — the platform-standard "DATA UNAVAILABLE"
 * surface.
 *
 * Every ORCA module that depends on live data must render one of:
 *  - real content
 *  - loading state
 *  - this panel
 *
 * Never a blank screen. This panel explains what is missing, what the
 * user can do, and what ORCA is doing to keep the interface honest.
 */
export function ServiceUnavailablePanel({
  service,
  reason = 'Live data source unreachable. Waiting for the next provider response.',
  onRetry,
  docsHref,
  tone = 'light',
  compact = false,
  className,
}: ServiceUnavailablePanelProps) {
  const isLight = tone === 'light';

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'rounded-2xl border flex flex-col',
        isLight
          ? 'border-warning/30 bg-warning/[0.06] text-ink'
          : 'border-amber-400/30 bg-amber-400/[0.05] text-white',
        compact ? 'p-4' : 'p-6',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'shrink-0 rounded-lg flex items-center justify-center border',
            compact ? 'h-9 w-9' : 'h-11 w-11',
            isLight
              ? 'border-warning/40 bg-warning/[0.12] text-warning-deep'
              : 'border-amber-400/40 bg-amber-400/[0.12] text-amber-400'
          )}
        >
          <CloudOff className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
        </div>

        <div className="min-w-0 flex-1">
          <div
            className={cn(
              'font-mono text-[10px] tracking-widest uppercase mb-1',
              isLight ? 'text-warning-deep' : 'text-amber-400'
            )}
          >
            DATA UNAVAILABLE · {service.toUpperCase()}
          </div>

          <h3
            className={cn(
              'font-display font-semibold leading-snug',
              compact ? 'text-sm' : 'text-base',
              isLight ? 'text-ink' : 'text-white'
            )}
          >
            {compact
              ? `${service} is not currently connected.`
              : `We couldn't reach the ${service.toLowerCase()} source.`}
          </h3>

          <p
            className={cn(
              'mt-1.5 leading-relaxed',
              compact ? 'text-xs' : 'text-sm',
              isLight ? 'text-ink-soft' : 'text-white/70'
            )}
          >
            {reason}
          </p>

          {(onRetry || docsHref) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {onRetry && (
                <Button
                  size="sm"
                  variant={isLight ? 'secondary-light' : 'secondary'}
                  leftIcon={<RefreshCw className="h-3.5 w-3.5" />}
                  onClick={onRetry}
                >
                  Retry
                </Button>
              )}
              {docsHref && (
                <a
                  href={docsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className={cn(
                    'inline-flex items-center gap-1.5 text-xs transition-colors',
                    isLight
                      ? 'text-ocean hover:text-ocean-dark'
                      : 'text-cyan hover:text-cyan-light'
                  )}
                >
                  View data source
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          )}

          {!compact && (
            <p
              className={cn(
                'mt-4 pt-4 border-t text-[11px] leading-relaxed',
                isLight
                  ? 'border-warning/20 text-mist-deep'
                  : 'border-amber-400/15 text-white/50'
              )}
            >
              ORCA never fabricates values. Layers and metrics remain disabled
              until the source is connected.
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}