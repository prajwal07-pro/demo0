import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-cyan to-teal text-abyss font-semibold shadow-glow-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:brightness-110 active:brightness-95 focus-visible:ring-cyan focus-visible:ring-offset-abyss',
        secondary:
          'bg-glass border border-white/10 text-white backdrop-blur-md hover:bg-white/5 hover:border-cyan/40 focus-visible:ring-cyan focus-visible:ring-offset-abyss',
        outline:
          'bg-transparent border border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan hover:shadow-glow-cyan focus-visible:ring-cyan focus-visible:ring-offset-abyss',
        ghost:
          'bg-transparent text-white/60 hover:bg-white/5 hover:text-white focus-visible:ring-cyan focus-visible:ring-offset-abyss',
        destructive:
          'bg-gradient-to-r from-magenta to-magenta-dark text-white font-semibold shadow-glow-magenta hover:brightness-110 focus-visible:ring-magenta focus-visible:ring-offset-abyss',
        link:
          'bg-transparent text-cyan underline-offset-4 hover:underline hover:text-cyan-light p-0 h-auto focus-visible:ring-cyan',
        subtle:
          'bg-white/[0.04] border border-white/[0.06] text-white/80 hover:bg-white/[0.08] hover:text-white focus-visible:ring-cyan focus-visible:ring-offset-abyss',

        // ---------- Light-surface variants (for content sections on pearl/white) ----------
        'primary-light':
          'bg-gradient-to-r from-ocean to-cyan-dark text-white font-semibold shadow-soft-md hover:shadow-soft-lg hover:brightness-110 focus-visible:ring-ocean focus-visible:ring-offset-pearl',
        'secondary-light':
          'bg-white border border-ink/10 text-ink shadow-soft hover:border-ocean/40 hover:bg-white hover:shadow-soft-md focus-visible:ring-ocean focus-visible:ring-offset-pearl',
        'outline-light':
          'bg-transparent border border-ocean/30 text-ocean hover:bg-ocean/[0.06] hover:border-ocean focus-visible:ring-ocean focus-visible:ring-offset-pearl',
        'ghost-light':
          'bg-transparent text-ink-soft hover:bg-ink/[0.04] hover:text-ink focus-visible:ring-ocean focus-visible:ring-offset-pearl',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-5 text-sm',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-9 text-lg font-semibold',
        icon: 'h-10 w-10 p-0',
        'icon-sm': 'h-8 w-8 p-0',
        'icon-lg': 'h-12 w-12 p-0',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
    },
  }
);

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children' | 'ref'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magnetic?: boolean;
}

function useMagnetic(
  ref: React.RefObject<HTMLButtonElement | null>,
  enabled: boolean
) {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      setOffset({ x: x * 0.15, y: y * 0.15 });
    };

    const handleMouseLeave = () => setOffset({ x: 0, y: 0 });

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [enabled, ref]);

  return offset;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      children,
      loading = false,
      leftIcon,
      rightIcon,
      disabled,
      magnetic = false,
      ...props
    },
    forwardedRef
  ) => {
    const internalRef = React.useRef<HTMLButtonElement | null>(null);

    const setRef = React.useCallback(
      (node: HTMLButtonElement | null) => {
        internalRef.current = node;
        if (typeof forwardedRef === 'function') {
          forwardedRef(node);
        } else if (forwardedRef) {
          (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
        }
      },
      [forwardedRef]
    );

    const offset = useMagnetic(internalRef, magnetic);
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={setRef}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isDisabled}
        animate={magnetic ? { x: offset.x, y: offset.y } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
        {!loading && leftIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        {children && <span className="inline-flex items-center">{children}</span>}
        {!loading && rightIcon && (
          <span className="inline-flex shrink-0" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };