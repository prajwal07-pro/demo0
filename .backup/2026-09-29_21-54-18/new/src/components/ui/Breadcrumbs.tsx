import * as React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  /** Optional icon shown before the label. */
  icon?: React.ComponentType<{ className?: string }>;
}

export interface BreadcrumbsProps extends React.HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  tone?: 'light' | 'dark';
  /** Optional separator override. Defaults to a chevron icon. */
  separator?: React.ReactNode;
}

/**
 * Breadcrumbs — standard navigation trail.
 *
 * Only the last item is rendered as the current page. All previous items
 * with an href are rendered as links; the rest are static text.
 */
export function Breadcrumbs({
  items,
  tone = 'light',
  separator,
  className,
  ...props
}: BreadcrumbsProps) {
  const isLight = tone === 'light';
  const current = items[items.length - 1];

  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('flex items-center gap-1.5 text-xs', className)}
      {...props}
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const Icon = item.icon;
        const content = (
          <span className="inline-flex items-center gap-1.5">
            {Icon && <Icon className="h-3 w-3" />}
            <span className={cn('truncate max-w-[20ch]', isLast && 'font-medium')}>
              {item.label}
            </span>
          </span>
        );

        return (
          <React.Fragment key={`${item.label}-${i}`}>
            {i > 0 && (
              <span className={isLight ? 'text-mist' : 'text-white/30'}>
                {separator ?? <ChevronRight className="h-3 w-3" />}
              </span>
            )}
            {isLast || !item.href ? (
              <span
                className={cn(
                  isLight
                    ? isLast
                      ? 'text-ink'
                      : 'text-mist-deep'
                    : isLast
                      ? 'text-white'
                      : 'text-white/50'
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {content}
              </span>
            ) : (
              <Link
                to={item.href}
                className={cn(
                  'transition-colors',
                  isLight
                    ? 'text-mist-deep hover:text-ocean'
                    : 'text-white/50 hover:text-cyan'
                )}
              >
                {content}
              </Link>
            )}
          </React.Fragment>
        );
      })}
      {void current}
    </nav>
  );
}