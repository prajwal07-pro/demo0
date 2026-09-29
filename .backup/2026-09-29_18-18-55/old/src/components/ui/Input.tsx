import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// ---------- Input Variants ----------
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'glass' | 'hud' | 'ghost';
  inputSize?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  helperText?: string;
  label?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'glass',
      inputSize = 'md',
      leftIcon,
      rightIcon,
      error,
      helperText,
      label,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const variantStyles: Record<NonNullable<InputProps['variant']>, string> = {
      default:
        'bg-midnight border border-white/10 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20',
      glass:
        'bg-glass backdrop-blur-md border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 shadow-glass',
      hud:
        'bg-abyss/60 border border-cyan/20 font-mono text-cyan placeholder:text-cyan/30 focus:border-cyan focus:ring-2 focus:ring-cyan/30 focus:shadow-glow-cyan',
      ghost:
        'bg-transparent border-b border-white/10 rounded-none focus:border-cyan focus:ring-0',
    };

    const sizeStyles: Record<NonNullable<InputProps['inputSize']>, string> = {
      sm: 'h-8 px-3 text-xs',
      md: 'h-10 px-4 text-sm',
      lg: 'h-12 px-5 text-base',
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="telemetry-text text-[10px] text-cyan/80"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            disabled={disabled}
            className={cn(
              'w-full rounded-lg text-white placeholder:text-muted-foreground/60 transition-all duration-200 outline-none disabled:opacity-40 disabled:cursor-not-allowed',
              variantStyles[variant],
              sizeStyles[inputSize],
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-magenta/60 focus:border-magenta focus:ring-magenta/20',
              className
            )}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined
            }
            {...props}
          />
          {rightIcon && (
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>
        {error && (
          <p
            id={`${inputId}-error`}
            className="text-[11px] text-magenta font-mono"
            role="alert"
          >
            {error}
          </p>
        )}
        {!error && helperText && (
          <p
            id={`${inputId}-help`}
            className="text-[11px] text-muted-foreground"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ---------- Search Input ----------
export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'variant'> {
  onClear?: () => void;
  showClear?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ onClear, showClear, value, className, ...props }, ref) => {
    const hasValue = value !== undefined && value !== '';
    const displayClear = showClear ?? hasValue;

    return (
      <Input
        ref={ref}
        variant="glass"
        value={value}
        leftIcon={<Search className="h-4 w-4" />}
        rightIcon={
          displayClear ? (
            <button
              type="button"
              onClick={onClear}
              className="pointer-events-auto rounded-full p-0.5 text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-colors"
              aria-label="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          ) : undefined
        }
        className={cn('pr-9', className)}
        {...props}
      />
    );
  }
);

SearchInput.displayName = 'SearchInput';

// ---------- Textarea ----------
export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'glass' | 'hud';
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'glass', label, error, helperText, id, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;

    const variantStyles: Record<NonNullable<TextareaProps['variant']>, string> = {
      default:
        'bg-midnight border border-white/10 focus:border-cyan/60 focus:ring-2 focus:ring-cyan/20',
      glass:
        'bg-glass backdrop-blur-md border border-white/10 focus:border-cyan/50 focus:ring-2 focus:ring-cyan/20 shadow-glass',
      hud:
        'bg-abyss/60 border border-cyan/20 font-mono text-cyan placeholder:text-cyan/30 focus:border-cyan focus:ring-2 focus:ring-cyan/30',
    };

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="telemetry-text text-[10px] text-cyan/80"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full rounded-lg px-4 py-3 text-sm text-white placeholder:text-muted-foreground/60 transition-all duration-200 outline-none resize-none disabled:opacity-40 disabled:cursor-not-allowed min-h-[100px]',
            variantStyles[variant],
            error && 'border-magenta/60 focus:border-magenta focus:ring-magenta/20',
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {error && (
          <p className="text-[11px] text-magenta font-mono" role="alert">
            {error}
          </p>
        )}
        {!error && helperText && (
          <p className="text-[11px] text-muted-foreground">{helperText}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';