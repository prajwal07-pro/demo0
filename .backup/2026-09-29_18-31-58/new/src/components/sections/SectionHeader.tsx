import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { fadeInUp } from '@/lib/animations';

export interface SectionHeaderProps {
  /** Small mono eyebrow label, e.g. "OCEAN DATA". */
  eyebrow?: string;
  /** Main heading text. */
  title: ReactNode;
  /** Optional supporting description. */
  description?: ReactNode;
  /** Optional right-hand action slot (buttons, badges). */
  action?: ReactNode;
  /** Alignment. Defaults to left. */
  align?: 'left' | 'center' | 'between';
  /** Surface tone. */
  tone?: 'light' | 'dark';
  /** Compact variant reduces vertical spacing. */
  compact?: boolean;
  /** Optional className on the root. */
  className?: string;
}

/**
 * SectionHeader — the platform-standard section intro block.
 *
 * Every section on the home page and every content page uses this so the
 * eyebrow → title → description → action rhythm is consistent. Animation
 * is a single fade-up per section, not staggered per element.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  tone = 'light',
  compact = false,
  className,
}: SectionHeaderProps) {
  const isLight = tone === 'light';

  const containerClass = {
    left: 'max-w-3xl',
    center: 'max-w-3xl mx-auto text-center',
    between: 'flex flex-col md:flex-row md:items-end md:justify-between gap-6',
  }[align];

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn(
        containerClass,
        compact ? 'mb-8' : 'mb-14',
        className
      )}
    >
      <div className={cn(align === 'between' && 'max-w-2xl')}>
        {eyebrow && (
          <div
            className={cn(
              'flex items-center gap-3 mb-5',
              align === 'center' && 'justify-center'
            )}
          >
            <span
              className={cn(
                'h-px w-10',
                isLight ? 'bg-ocean/40' : 'bg-cyan/40'
              )}
            />
            <span
              className={cn(
                'font-mono text-[10px] tracking-[0.3em] uppercase',
                isLight ? 'text-ocean' : 'text-cyan/70'
              )}
            >
              {eyebrow}
            </span>
          </div>
        )}

        <h2
          className={cn(
            'font-display font-bold tracking-tight leading-[1.08] text-balance',
            compact
              ? 'text-2xl md:text-3xl'
              : 'text-3xl md:text-4xl lg:text-5xl',
            isLight ? 'text-ink' : 'text-white'
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              'mt-5 leading-relaxed text-balance',
              compact ? 'text-sm max-w-xl' : 'text-base md:text-lg max-w-2xl',
              align === 'center' && 'mx-auto',
              isLight ? 'text-ink-soft' : 'text-white/70'
            )}
          >
            {description}
          </p>
        )}
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </motion.div>
  );
}