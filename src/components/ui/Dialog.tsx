import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEscapeKey } from '@/hooks/useKeyboard';

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Prevent ESC and backdrop click from closing. */
  persistent?: boolean;
  /** Surface tone. Defaults to `light` for editorial contexts. */
  tone?: 'light' | 'dark';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<DialogProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

/**
 * Dialog — accessible modal primitive.
 *
 * Behaviour:
 *  - Renders into a portal attached to document.body.
 *  - Restores focus to the triggering element on close.
 *  - Traps focus within the dialog while open.
 *  - Closes on ESC unless `persistent` is set.
 *  - Supports light (default) and dark surface tones.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  persistent = false,
  tone = 'light',
  className,
}: DialogProps) {
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLElement | null>(null);

  useEscapeKey(() => {
    if (!persistent) onClose();
  }, open);

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement as HTMLElement | null;

    const timer = window.setTimeout(() => {
      const firstFocusable = contentRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusable?.focus() ?? contentRef.current?.focus();
    }, 50);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = contentRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  if (typeof document === 'undefined') return null;

  const isLight = tone === 'light';

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="dialog-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[150] bg-abyss/70 backdrop-blur-sm"
            onClick={() => {
              if (!persistent) onClose();
            }}
            aria-hidden="true"
          />

          <div className="fixed inset-0 z-[151] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              key="dialog-content"
              ref={contentRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'dialog-title' : undefined}
              aria-describedby={description ? 'dialog-description' : undefined}
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className={cn(
                'pointer-events-auto w-full rounded-2xl overflow-hidden',
                isLight
                  ? 'border border-ink/10 bg-white shadow-soft-lg'
                  : 'border border-white/10 bg-abyss shadow-glass',
                SIZE_CLASSES[size],
                className
              )}
            >
              {(title || description) && (
                <header
                  className={cn(
                    'flex items-start gap-4 p-6 border-b',
                    isLight ? 'border-ink/[0.06]' : 'border-white/[0.06]'
                  )}
                >
                  <div className="min-w-0 flex-1">
                    {title && (
                      <h2
                        id="dialog-title"
                        className={cn(
                          'font-display text-lg font-semibold',
                          isLight ? 'text-ink' : 'text-white'
                        )}
                      >
                        {title}
                      </h2>
                    )}
                    {description && (
                      <p
                        id="dialog-description"
                        className={cn(
                          'mt-1 text-sm',
                          isLight ? 'text-ink-soft' : 'text-white/60'
                        )}
                      >
                        {description}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className={cn(
                      'h-8 w-8 rounded-lg border flex items-center justify-center transition-colors',
                      isLight
                        ? 'border-ink/10 text-mist-deep hover:text-ink hover:border-ocean/40'
                        : 'border-white/10 text-white/60 hover:text-white hover:border-cyan/40'
                    )}
                    aria-label="Close dialog"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </header>
              )}

              <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>

              {footer && (
                <footer
                  className={cn(
                    'flex items-center justify-end gap-3 p-4 border-t',
                    isLight
                      ? 'border-ink/[0.06] bg-pearl-soft'
                      : 'border-white/[0.06] bg-white/[0.02]'
                  )}
                >
                  {footer}
                </footer>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}