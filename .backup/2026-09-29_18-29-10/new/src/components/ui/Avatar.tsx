import * as React from 'react';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Show a status dot in the bottom-right. */
  status?: 'online' | 'offline' | 'busy' | 'away';
  /** Ring accent (used on workbench / dark surfaces). */
  ring?: 'none' | 'cyan' | 'ocean' | 'teal';
  tone?: 'light' | 'dark';
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps['size']>, string> = {
  xs: 'h-6 w-6 text-[9px]',
  sm: 'h-8 w-8 text-[10px]',
  md: 'h-10 w-10 text-xs',
  lg: 'h-14 w-14 text-base',
  xl: 'h-20 w-20 text-xl',
};

const STATUS_DOT_CLASSES: Record<NonNullable<AvatarProps['status']>, string> = {
  online: 'bg-success',
  offline: 'bg-mist',
  busy: 'bg-danger',
  away: 'bg-warning',
};

const RING_CLASSES: Record<NonNullable<AvatarProps['ring']>, string> = {
  none: '',
  cyan: 'ring-2 ring-cyan/40 ring-offset-2 ring-offset-abyss',
  ocean: 'ring-2 ring-ocean/40 ring-offset-2 ring-offset-pearl',
  teal: 'ring-2 ring-teal/40 ring-offset-2 ring-offset-abyss',
};

/**
 * Avatar — user or entity representation.
 *
 * Falls back to initials derived from `name` when `src` is not provided.
 * The gradient background is deterministic per name so the same user
 * always gets the same accent color across the app.
 */
export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  (
    { className, name, src, size = 'md', status, ring = 'none', tone = 'dark', ...props },
    ref
  ) => {
    const initials = React.useMemo(() => deriveInitials(name), [name]);
    const gradient = React.useMemo(() => deriveGradient(name), [name]);

    const isLight = tone === 'light';
    const statusBorder = isLight ? 'border-white' : 'border-abyss';

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex shrink-0', RING_CLASSES[ring], className)}
        {...props}
      >
        <div
          className={cn(
            'flex items-center justify-center rounded-full font-display font-semibold overflow-hidden',
            SIZE_CLASSES[size],
            !src && gradient,
            src && 'bg-pearl-soft'
          )}
        >
          {src ? (
            <img
              src={src}
              alt={name ?? 'Avatar'}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className={isLight ? 'text-white' : 'text-white'}>
              {initials}
            </span>
          )}
        </div>

        {status && (
          <span
            className={cn(
              'absolute -bottom-0.5 -right-0.5 rounded-full border-2',
              statusBorder,
              STATUS_DOT_CLASSES[status]
            )}
            style={{
              width: size === 'xs' ? 8 : size === 'sm' ? 10 : size === 'md' ? 12 : 14,
              height: size === 'xs' ? 8 : size === 'sm' ? 10 : size === 'md' ? 12 : 14,
            }}
            aria-label={`Status: ${status}`}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

function deriveInitials(name?: string): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() ?? '').join('') || '?';
}

function deriveGradient(name?: string): string {
  if (!name) return 'bg-gradient-to-br from-cyan to-teal';
  const gradients = [
    'bg-gradient-to-br from-cyan to-teal',
    'bg-gradient-to-br from-ocean to-cyan-dark',
    'bg-gradient-to-br from-violet to-cyan',
    'bg-gradient-to-br from-teal to-success',
    'bg-gradient-to-br from-ocean to-teal',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return gradients[hash % gradients.length] ?? gradients[0]!;
}