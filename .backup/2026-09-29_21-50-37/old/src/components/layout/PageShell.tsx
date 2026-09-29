import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';

export interface PageShellProps {
  /** Page title used for the document <title> and default header. */
  title?: string;
  /** Optional eyebrow label, e.g. "MODULE · OCEAN". */
  eyebrow?: string;
  /** Optional description under the page title. */
  description?: string;
  /** Optional right-hand action in the header. */
  action?: ReactNode;
  /** Light (pearl) surface or dark (abyss) surface. */
  tone?: 'light' | 'dark';
  /** Full-bleed layout with no max-width constraint. */
  fullBleed?: boolean;
  /** Additional classes on the root. */
  className?: string;
  /** Additional classes on the header block. */
  headerClassName?: string;
  /** Page content. */
  children: ReactNode;
}

/**
 * PageShell — the standard wrapper for every routed module page.
 *
 * Responsibilities:
 *  - Sets the document title via useDocumentTitle.
 *  - Provides a consistent hero header (eyebrow + heading + description).
 *  - Manages the light/dark surface tone so pages can mix their own
 *    internal sections without re-declaring typography.
 *
 * Pages that need a truly custom header (e.g. workbench pages such as the
 * Live Map and 3D Explorer) should render their own shell and skip this
 * component.
 */
export function PageShell({
  title,
  eyebrow,
  description,
  action,
  tone = 'light',
  fullBleed = false,
  className,
  headerClassName,
  children,
}: PageShellProps) {
  useDocumentTitle(title);

  const isLight = tone === 'light';

  return (
    <div
      className={cn(
        'relative min-h-full',
        isLight ? 'bg-pearl text-ink' : 'bg-abyss text-white',
        className
      )}
    >
      {(eyebrow || title || description || action) && (
        <header
          className={cn(
            'relative border-b pt-14 pb-10 lg:pt-20 lg:pb-14',
            isLight ? 'border-ink/[0.06]' : 'border-white/[0.06]',
            headerClassName
          )}
        >
          <div
            className={cn(
              'absolute inset-0 opacity-50',
              isLight ? 'data-grid-light' : 'data-grid'
            )}
            aria-hidden="true"
          />

          <div
            className={cn(
              'relative px-6',
              fullBleed ? 'w-full' : 'mx-auto max-w-7xl'
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                action
                  ? 'flex flex-col md:flex-row md:items-end md:justify-between gap-6'
                  : 'max-w-3xl'
              )}
            >
              <div className="min-w-0">
                {eyebrow && (
                  <div className="flex items-center gap-3 mb-5">
                    <span
                      className={cn(
                        'h-px w-10',
                        isLight ? 'bg-ocean/40' : 'bg-cyan/40'
                      )}
                    />
                    <span
                      className={cn(
                        'font-mono text-[10px] tracking-[0.3em]',
                        isLight ? 'text-ocean' : 'text-cyan/70'
                      )}
                    >
                      {eyebrow}
                    </span>
                  </div>
                )}

                {title && (
                  <h1
                    className={cn(
                      'font-display text-4xl md:text-5xl font-bold tracking-tight leading-[1.05] text-balance',
                      isLight ? 'text-ink' : 'text-white'
                    )}
                  >
                    {title}
                  </h1>
                )}

                {description && (
                  <p
                    className={cn(
                      'mt-5 text-base leading-relaxed max-w-2xl',
                      isLight ? 'text-ink-soft' : 'text-white/70'
                    )}
                  >
                    {description}
                  </p>
                )}
              </div>

              {action && <div className="shrink-0">{action}</div>}
            </motion.div>
          </div>
        </header>
      )}

      <div
        className={cn(
          'relative',
          fullBleed ? '' : 'mx-auto max-w-7xl px-6'
        )}
      >
        {children}
      </div>
    </div>
  );
}