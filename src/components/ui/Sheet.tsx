import * as React from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEscapeKey } from '@/hooks/useKeyboard';

export type SheetTone = 'dark' | 'light';

export interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  side?: 'right' | 'left' | 'bottom';
  size?: 'sm' | 'md' | 'lg';
  /** Surface tone. Defaults to `dark` for workbench contexts. */
  tone?: SheetTone;
  className?: string;
}

const SIDE_CLASSES: Record<
  NonNullable<SheetProps['side']>,
  {
    base: string;
    initial: { x?: number; y?: number };
    size: Record<NonNullable<SheetProps['size']>, string>;
  }
> = {
  right: {
    base: 'top-0 right-0 bottom-0',
    initial: { x: '100%' },
    size: { sm: 'w-80', md: 'w-96', lg: 'w-[32rem]' },
  },
  left: {
    base: 'top-0 left-0 bottom-0',
    initial: { x: '-100%' },
    size: { sm: 'w-80', md: 'w-96', lg: 'w-[32rem]' },
  },
  bottom: {
    base: 'left-0 right-0 bottom-0 rounded-t-2xl',
    initial: { y: '100%' },
    size: { sm: 'h-64', md: 'h-[28rem]', lg: 'h-[40rem]' },
  },
};

/**
 * Sheet — a sliding panel from the right, left, or bottom edge.
 *
 * Supports both dark (workbench) and light (editorial) tones so the
 * same primitive can be used across the platform without visual clashes.
 * Drag-to-dismiss is enabled for the `bottom` variant.
 */
export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  side = 'right',
  size = 'md',
  tone = 'dark',
  className,
}: SheetProps) {
  useEscapeKey(onClose, open);

  React.useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const config = SIDE_CLASSES[side];
  const isLight = tone === 'light';

  const handleDragEnd = React.useCallback(
    (_: unknown, info: PanInfo) => {
      if (info.offset.y > 120 || info.velocity.y > 500) onClose();
    },
    [onClose]
  );

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-[160] bg-abyss/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.aside
            key="sheet-panel"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={config.initial}
            animate={{ x: 0, y: 0 }}
            exit={config.initial}
            transition={{ type: 'spring', stiffness: 320, damping: 34 }}
            drag={side === 'bottom' ? 'y' : undefined}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className={cn(
              'fixed z-[161] flex flex-col shadow-glass',
              isLight
                ? 'bg-white border-ink/10 text-ink'
                : 'bg-abyss border-white/[0.08] text-white',
              config.base,
              config.size[size],
              side === 'right' && (isLight ? 'border-l' : 'border-l'),
              side === 'left' && (isLight ? 'border-r' : 'border-r'),
              side === 'bottom' && (isLight ? 'border-t' : 'border-t'),
              className
            )}
          >
            {side === 'bottom' && (
              <div className="flex justify-center py-3 shrink-0">
                <span
                  className={cn(
                    'h-1 w-10 rounded-full',
                    isLight ? 'bg-ink/20' : 'bg-white/20'
                  )}
                />
              </div>
            )}

            <header
              className={cn(
                'flex items-start gap-4 p-5 border-b shrink-0',
                isLight ? 'border-ink/[0.06]' : 'border-white/[0.06]'
              )}
            >
              <div className="min-w-0 flex-1">
                {title && (
                  <h2
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
                aria-label="Close sheet"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto p-5 no-scrollbar">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>,
    document.body
  );
}