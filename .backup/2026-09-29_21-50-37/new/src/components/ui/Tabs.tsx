import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TabItem<T extends string = string> {
  id: T;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

export interface TabsProps<T extends string = string> {
  items: TabItem<T>[];
  value: T;
  onValueChange: (value: T) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'pill' | 'underline' | 'light';
  className?: string;
}

/**
 * Tabs — accessible, animated tab switcher.
 *
 * Variants:
 *   - `pill`    : dark surface, rounded active pill.
 *   - `underline`: dark surface, animated underline.
 *   - `light`   : light surface, ocean-colored active state.
 */
export function Tabs<T extends string = string>({
  items,
  value,
  onValueChange,
  orientation = 'horizontal',
  variant = 'light',
  className,
}: TabsProps<T>) {
  const isVertical = orientation === 'vertical';

  return (
    <div
      role="tablist"
      aria-orientation={orientation}
      className={cn(
        'flex',
        isVertical ? 'flex-col gap-1' : 'flex-row items-center gap-1',
        className
      )}
    >
      {items.map((item) => {
        const isActive = item.id === value;
        const Icon = item.icon;

        const baseStyles =
          'relative flex items-center gap-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap';
        const sizeStyles = isVertical
          ? 'px-3 py-2.5 justify-start w-full'
          : 'px-3.5 py-2';

        const variantStyles = {
          pill: isActive
            ? 'bg-white/[0.06] text-white border border-white/10'
            : 'text-white/60 hover:text-white hover:bg-white/[0.04] border border-transparent',
          underline: isActive ? 'text-white' : 'text-white/60 hover:text-white',
          light: isActive
            ? 'bg-ocean/[0.08] text-ocean border border-ocean/25'
            : 'text-ink-soft hover:text-ink hover:bg-ink/[0.04] border border-transparent',
        }[variant];

        const underlineColor = variant === 'light' ? 'via-ocean' : 'via-cyan';

        return (
          <button
            key={item.id}
            role="tab"
            aria-selected={isActive}
            aria-disabled={item.disabled}
            disabled={item.disabled}
            onClick={() => onValueChange(item.id)}
            className={cn(
              baseStyles,
              sizeStyles,
              variantStyles,
              item.disabled && 'opacity-40 cursor-not-allowed'
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            <span className="flex-1 truncate">{item.label}</span>

            {variant === 'underline' && isActive && (
              <motion.span
                layoutId="tab-underline"
                className={cn(
                  'absolute',
                  isVertical
                    ? cn(
                        'left-0 top-2 bottom-2 w-0.5 rounded-full',
                        variant === 'light' ? 'bg-ocean' : 'bg-cyan'
                      )
                    : cn(
                        'inset-x-2 -bottom-px h-px bg-gradient-to-r from-transparent to-transparent',
                        underlineColor
                      )
                )}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}