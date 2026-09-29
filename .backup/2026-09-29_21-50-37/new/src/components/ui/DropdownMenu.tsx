import * as React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DropdownMenuItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  danger?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
}

export interface DropdownMenuProps {
  trigger: React.ReactNode;
  items: DropdownMenuItem[];
  align?: 'left' | 'right';
  className?: string;
  /** Light surface (default) or dark surface. */
  tone?: 'light' | 'dark';
}

/**
 * DropdownMenu — accessible dropdown menu primitive.
 *
 * Behaviour:
 *  - Closes on ESC, click outside, and option select.
 *  - Keyboard navigation with ArrowUp / ArrowDown / Enter / Home / End.
 *  - Renders adjacent to the trigger with correct alignment.
 *  - Supports light (default) and dark surface tones.
 */
export function DropdownMenu({
  trigger,
  items,
  align = 'right',
  className,
  tone = 'light',
}: DropdownMenuProps) {
  const [open, setOpen] = React.useState(false);
  const [activeIndex, setActiveIndex] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  React.useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  React.useEffect(() => {
    if (open) {
      setActiveIndex(0);
      const timer = window.setTimeout(() => {
        itemRefs.current[0]?.focus();
      }, 30);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  const selectItem = (item: DropdownMenuItem) => {
    if (item.disabled) return;
    item.onSelect?.();
    setOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveIndex((i) => {
        const next = (i + 1) % items.length;
        itemRefs.current[next]?.focus();
        return next;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((i) => {
        const prev = (i - 1 + items.length) % items.length;
        itemRefs.current[prev]?.focus();
        return prev;
      });
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActiveIndex(0);
      itemRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      const last = items.length - 1;
      setActiveIndex(last);
      itemRefs.current[last]?.focus();
    }
  };

  const isLight = tone === 'light';

  return (
    <div ref={containerRef} className={cn('relative inline-flex', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="inline-flex"
      >
        {trigger}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onKeyDown={handleKeyDown}
            className={cn(
              'absolute top-full mt-2 z-50 w-60 rounded-xl overflow-hidden',
              align === 'right' ? 'right-0' : 'left-0',
              isLight
                ? 'border border-ink/10 bg-white shadow-soft-lg'
                : 'border border-white/10 bg-abyss/95 backdrop-blur-xl shadow-glass'
            )}
          >
            <ul className="p-1 flex flex-col gap-0.5">
              {items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="menuitem"
                      ref={(el) => {
                        itemRefs.current[i] = el;
                      }}
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => selectItem(item)}
                      disabled={item.disabled}
                      className={cn(
                        'w-full flex items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                        item.disabled && 'opacity-40 cursor-not-allowed',
                        !item.disabled &&
                          (isLight
                            ? item.danger
                              ? 'text-danger-deep hover:bg-danger/[0.06]'
                              : 'text-ink hover:bg-ink/[0.04]'
                            : item.danger
                              ? 'text-magenta hover:bg-magenta/[0.06]'
                              : 'text-white/80 hover:text-white hover:bg-white/[0.04]')
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4 shrink-0" />}
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.shortcut && (
                        <kbd
                          className={cn(
                            'font-mono text-[10px]',
                            isLight ? 'text-mist-deep' : 'text-white/40'
                          )}
                        >
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}