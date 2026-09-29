import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface FilterOption {
  id: string;
  label: string;
  /** Optional color accent for the option chip. */
  color?: string;
  count?: number;
}

export interface FilterGroup {
  id: string;
  label: string;
  options: FilterOption[];
  /** Multi-select vs single-select. Defaults to multi. */
  multiple?: boolean;
}

export interface FilterPanelProps {
  groups: FilterGroup[];
  /** Selected option ids keyed by group id. */
  value: Record<string, string[]>;
  onChange: (next: Record<string, string[]>) => void;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  /** Optional label shown in the header. */
  title?: string;
  /** Collapse to a compact header by default on mobile. */
  defaultOpen?: boolean;
  className?: string;
}

/**
 * FilterPanel — reusable multi-group filter.
 *
 * Used on the Live Map, Vessels, Ocean, and Community pages so filter
 * behaviour and appearance is identical everywhere.
 */
export function FilterPanel({
  groups,
  value,
  onChange,
  tone = 'light',
  title = 'Filters',
  defaultOpen = true,
  className,
}: FilterPanelProps) {
  const [open, setOpen] = React.useState(defaultOpen);
  const isLight = tone === 'light';

  const toggleOption = (groupId: string, optionId: string, multiple: boolean) => {
    const current = value[groupId] ?? [];
    const has = current.includes(optionId);

    let next: string[];
    if (multiple) {
      next = has ? current.filter((x) => x !== optionId) : [...current, optionId];
    } else {
      next = has ? [] : [optionId];
    }

    onChange({ ...value, [groupId]: next });
  };

  const resetGroup = (groupId: string) => {
    const next = { ...value };
    delete next[groupId];
    onChange(next);
  };

  const resetAll = () => onChange({});

  const activeCount = Object.values(value).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <div
      className={cn(
        'rounded-2xl border overflow-hidden',
        isLight
          ? 'border-ink/[0.08] bg-white shadow-soft'
          : 'border-white/[0.06] bg-white/[0.02]',
        className
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center justify-between px-4 py-3 border-b cursor-pointer select-none',
          isLight ? 'border-ink/[0.06]' : 'border-white/[0.06]'
        )}
        onClick={() => setOpen((v) => !v)}
        role="button"
        aria-expanded={open}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal
            className={cn('h-3.5 w-3.5', isLight ? 'text-ocean' : 'text-cyan')}
          />
          <span
            className={cn(
              'font-mono text-[10px] tracking-widest uppercase',
              isLight ? 'text-ocean' : 'text-cyan/70'
            )}
          >
            {title}
          </span>
          {activeCount > 0 && (
            <span
              className={cn(
                'rounded-full px-1.5 h-4 min-w-4 flex items-center justify-center font-mono text-[9px] font-bold',
                isLight ? 'bg-ocean/15 text-ocean' : 'bg-cyan/20 text-cyan'
              )}
            >
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                resetAll();
              }}
              className={cn(
                'inline-flex items-center gap-1 text-[10px] font-mono tracking-widest transition-colors',
                isLight
                  ? 'text-mist-deep hover:text-ocean'
                  : 'text-white/50 hover:text-cyan'
              )}
            >
              <RotateCcw className="h-3 w-3" />
              CLEAR
            </button>
          )}
          <X
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              open ? 'rotate-0' : 'rotate-45',
              isLight ? 'text-mist-deep' : 'text-white/50'
            )}
          />
        </div>
      </div>

      {/* Body */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="p-4 flex flex-col gap-5">
              {groups.map((group) => {
                const selected = value[group.id] ?? [];
                const multiple = group.multiple ?? true;
                return (
                  <div key={group.id}>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={cn(
                          'font-mono text-[10px] tracking-widest uppercase',
                          isLight ? 'text-mist-deep' : 'text-white/50'
                        )}
                      >
                        {group.label}
                      </span>
                      {selected.length > 0 && (
                        <button
                          type="button"
                          onClick={() => resetGroup(group.id)}
                          className={cn(
                            'text-[9px] font-mono tracking-widest transition-colors',
                            isLight
                              ? 'text-mist-deep hover:text-ocean'
                              : 'text-white/40 hover:text-cyan'
                          )}
                        >
                          RESET
                        </button>
                      )}
                    </div>

                    <ul className="flex flex-wrap gap-2">
                      {group.options.map((option) => {
                        const isActive = selected.includes(option.id);
                        return (
                          <li key={option.id}>
                            <button
                              type="button"
                              onClick={() => toggleOption(group.id, option.id, multiple)}
                              className={cn(
                                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] transition-colors',
                                isActive
                                  ? isLight
                                    ? 'border-ocean/40 bg-ocean/[0.08] text-ocean'
                                    : 'border-cyan/40 bg-cyan/[0.08] text-cyan'
                                  : isLight
                                    ? 'border-ink/10 bg-pearl-soft text-ink-soft hover:border-ocean/30 hover:text-ink'
                                    : 'border-white/10 bg-white/[0.02] text-white/60 hover:border-cyan/30 hover:text-white'
                              )}
                            >
                              {option.color && (
                                <span
                                  className="h-1.5 w-1.5 rounded-full"
                                  style={{ backgroundColor: option.color }}
                                />
                              )}
                              <span>{option.label}</span>
                              {option.count !== undefined && (
                                <span
                                  className={cn(
                                    'font-mono text-[9px]',
                                    isActive
                                      ? isLight
                                        ? 'text-ocean/70'
                                        : 'text-cyan/70'
                                      : isLight
                                        ? 'text-mist-deep'
                                        : 'text-white/40'
                                  )}
                                >
                                  {option.count}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}

              {activeCount > 0 && (
                <Button
                  variant={isLight ? 'secondary-light' : 'secondary'}
                  size="sm"
                  fullWidth
                  onClick={resetAll}
                >
                  Clear all filters
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}