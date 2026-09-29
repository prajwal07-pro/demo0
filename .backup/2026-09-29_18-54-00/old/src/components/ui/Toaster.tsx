import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';

type ToastType = 'info' | 'success' | 'warning' | 'error';

const TOAST_STYLES: Record<
  ToastType,
  { icon: typeof Info; accent: string; iconColor: string; label: string }
> = {
  info: {
    icon: Info,
    accent: 'border-ocean/30 bg-white',
    iconColor: 'text-ocean',
    label: 'INFO',
  },
  success: {
    icon: CheckCircle2,
    accent: 'border-success/30 bg-white',
    iconColor: 'text-success-deep',
    label: 'SUCCESS',
  },
  warning: {
    icon: AlertTriangle,
    accent: 'border-warning/30 bg-white',
    iconColor: 'text-warning-deep',
    label: 'WARNING',
  },
  error: {
    icon: XCircle,
    accent: 'border-danger/30 bg-white',
    iconColor: 'text-danger-deep',
    label: 'ERROR',
  },
};

/**
 * Toaster — the global surface for transient messages.
 *
 * Consumes the toast state from the app store. Renders at bottom-right
 * on desktop and bottom-center on mobile. This is a light-surface toast
 * so it reads on both dark hero pages and light editorial sections.
 */
export function Toaster() {
  const toast = useAppStore((s) => s.toast);
  const clearToast = useAppStore((s) => s.clearToast);

  // Auto-dismiss after 4 seconds.
  const timerRef = useIdSafeTimeout();

  return (
    <div
      className="pointer-events-none fixed bottom-24 right-4 z-[200] flex flex-col items-end gap-2 lg:bottom-6"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.message + timerRef}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className={cn(
              'pointer-events-auto relative w-full max-w-sm rounded-2xl border shadow-soft-lg overflow-hidden',
              TOAST_STYLES[toast.type].accent
            )}
          >
            <div className="flex items-start gap-3 p-4">
              <div
                className={cn(
                  'h-9 w-9 shrink-0 rounded-lg bg-pearl-soft flex items-center justify-center',
                  TOAST_STYLES[toast.type].iconColor
                )}
              >
                {(() => {
                  const Icon = TOAST_STYLES[toast.type].icon;
                  return <Icon className="h-4 w-4" />;
                })()}
              </div>

              <div className="min-w-0 flex-1">
                <div
                  className={cn(
                    'font-mono text-[9px] tracking-widest uppercase',
                    TOAST_STYLES[toast.type].iconColor
                  )}
                >
                  {TOAST_STYLES[toast.type].label}
                </div>
                <div className="mt-1 text-sm text-ink leading-snug">
                  {toast.message}
                </div>
              </div>

              <button
                type="button"
                onClick={clearToast}
                className="h-6 w-6 rounded-md flex items-center justify-center text-mist-deep hover:text-ink hover:bg-ink/[0.04] transition-colors shrink-0"
                aria-label="Dismiss notification"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Small helper that returns a stable key segment per toast invocation
 * so framer-motion can transition between different toast messages.
 */
function useIdSafeTimeout(): string {
  // A monotonic counter is enough for keying.
  // Using a simple random string avoids reintroducing useId edge cases.
  return `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}