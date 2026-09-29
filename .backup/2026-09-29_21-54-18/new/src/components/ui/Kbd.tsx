import * as React from 'react';
import { cn } from '@/lib/utils';

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
  /** Key label — accepts symbols like ⌘, ⇧, ⌥, ↵, ↑, ↓, etc. */
  children: React.ReactNode;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  /** Size variant. */
  size?: 'sm' | 'md';
}

/**
 * Kbd — inline keyboard key chip.
 *
 * Use for shortcut hints anywhere in the UI. This should be the single
 * source of truth for how keys look (rounded chip, mono font, subtle
 * border) so hints read the same across palette, tooltips, and pages.
 */
export function Kbd({
  children,
  tone = 'light',
  size = 'sm',
  className,
  ...props
}: KbdProps) {
  const isLight = tone === 'light';
  const sizeClass = {
    sm: 'h-4 min-w-4 px-1 text-[9px]',
    md: 'h-5 min-w-5 px-1.5 text-[10px]',
  }[size];

  return (
    <kbd
      className={cn(
        'inline-flex items-center justify-center rounded border font-mono',
        sizeClass,
        isLight
          ? 'border-ink/15 bg-white text-ink-soft'
          : 'border-white/10 bg-white/[0.04] text-white/60',
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export interface ShortcutProps {
  /** Modifier + key combo, e.g. ['⌘', 'K']. */
  keys: string[];
  tone?: 'light' | 'dark';
  className?: string;
}

/**
 * Shortcut — a group of Kbd chips with subtle separators.
 */
export function Shortcut({ keys, tone = 'light', className }: ShortcutProps) {
  const isLight = tone === 'light';
  return (
    <span className={cn('inline-flex items-center gap-1', className)}>
      {keys.map((k, i) => (
        <React.Fragment key={`${k}-${i}`}>
          {i > 0 && (
            <span className={cn('text-[9px]', isLight ? 'text-mist' : 'text-white/30')}>
              +
            </span>
          )}
          <Kbd tone={tone}>{k}</Kbd>
        </React.Fragment>
      ))}
    </span>
  );
}