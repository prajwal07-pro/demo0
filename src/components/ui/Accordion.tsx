import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItemData {
  id: string;
  title: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItemData[];
  /** Allow multiple items open at once. Defaults to false. */
  allowMultiple?: boolean;
  defaultOpen?: string[];
  className?: string;
  tone?: 'light' | 'dark';
}

/**
 * Accordion — accessible collapsible list.
 *
 * Uses a controlled `<details>`-free pattern for full styling control.
 * Each item is a button toggling an animated content region. Content is
 * removed from the DOM when collapsed so heavy children (maps, 3D) are
 * not kept mounted in the background.
 */
export function Accordion({
  items,
  allowMultiple = false,
  defaultOpen = [],
  className,
  tone = 'light',
}: AccordionProps) {
  const [openIds, setOpenIds] = React.useState<Set<string>>(
    () => new Set(defaultOpen)
  );

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        if (!allowMultiple) next.clear();
        next.add(id);
      }
      return next;
    });
  };

  const isLight = tone === 'light';

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className={cn(
              'rounded-2xl border overflow-hidden transition-colors',
              isLight
                ? 'border-ink/[0.08] bg-white shadow-soft'
                : 'border-white/[0.06] bg-white/[0.02]',
              item.disabled && 'opacity-50'
            )}
          >
            <button
              type="button"
              onClick={() => !item.disabled && toggle(item.id)}
              aria-expanded={isOpen}
              aria-controls={`accordion-${item.id}`}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-start gap-4 p-5 text-left transition-colors',
                !item.disabled &&
                  (isLight ? 'hover:bg-pearl-soft' : 'hover:bg-white/[0.03]')
              )}
            >
              {Icon && (
                <div
                  className={cn(
                    'h-9 w-9 shrink-0 rounded-lg border flex items-center justify-center',
                    isLight
                      ? 'border-ocean/15 bg-ice text-ocean'
                      : 'border-cyan/20 bg-cyan/10 text-cyan'
                  )}
                >
                  <Icon className="h-4 w-4" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div
                  className={cn(
                    'font-display text-base font-semibold leading-snug',
                    isLight ? 'text-ink' : 'text-white'
                  )}
                >
                  {item.title}
                </div>
                {item.description && (
                  <div
                    className={cn(
                      'mt-1 text-sm leading-relaxed',
                      isLight ? 'text-ink-soft' : 'text-white/60'
                    )}
                  >
                    {item.description}
                  </div>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  'shrink-0 mt-0.5',
                  isLight ? 'text-mist-deep' : 'text-white/50'
                )}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`accordion-${item.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div
                    className={cn(
                      'px-5 pb-5 pt-1 border-t',
                      isLight
                        ? 'border-ink/[0.06] text-ink-soft'
                        : 'border-white/[0.06] text-white/70'
                    )}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}