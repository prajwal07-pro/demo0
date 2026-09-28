import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------- Button Variants ----------
const buttonVariants = cva(
  // Base styles
  'relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-abyss disabled:pointer-events-none disabled:opacity-40 select-none',
  {
    variants: {
      variant: {
        primary:
          'bg-gradient-to-r from-cyan to-teal text-abyss font-semibold shadow-glow-cyan hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] hover:brightness-110 active:brightness-95',
        secondary:
          'bg-glass border border-white/10 text-white backdrop-blur-md hover:bg-white/5 hover:border-cyan/40 shadow-glass',
        outline:
          'bg-transparent border border-cyan/40 text-cyan hover:bg-cyan/10 hover:border-cyan hover:shadow-glow-cyan',
        ghost:
          'bg-transparent text-muted-foreground hover:bg-white/5 hover:text-white',
        destructive:
          'bg-gradient-to-r from-magenta to-magenta-dark text-white font-semibold shadow-glow-magenta hover:brightness-110',
        link:
          'bg-transparent text-cyan underline-offset-4 hover:underline hover:text-cyan-light p-0 h-auto',
        subtle:
          'bg-midnight-light/50 border border-white/5 text-white/80 hover:bg-midnight-light hover:text-white',
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

// ---------- Types ----------
export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'children'>,
    VariantProps<typeof buttonVariants> {
  children?: React.ReactNode;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  magnetic?: boolean;
}

// ---------- Magnetic Wrapper ----------
function useMagnetic(ref: React.RefObject<HTMLButtonElement | null>, enabled: boolean) {
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });

  React.useEffect(() => {
    if (!enabled || !ref.current) return;
    const el = ref.current;

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

// ---------- Button Component ----------
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
    ref
  ) => {
    const internalRef = React.useRef<HTMLButtonElement>(null);
    const resolvedRef = (ref as React.RefObject<HTMLButtonElement | null>) || internalRef;
    const offset = useMagnetic(resolvedRef, magnetic);

    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={resolvedRef}
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        disabled={isDisabled}
        animate={magnetic ? { x: offset.x, y: offset.y } : undefined}
        transition={{ type: 'spring', stiffness: 300, damping: 20, mass: 0.5 }}
        whileHover={!isDisabled ? { scale: 1.02 } : undefined}
        whileTap={!isDisabled ? { scale: 0.97 } : undefined}
        {...props}
      >
        {loading && (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        )}
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