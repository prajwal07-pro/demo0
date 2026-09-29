import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
  hint?: string;
  error?: string;
  required?: boolean;
  /** Render inline — label to the left of the control. */
  inline?: boolean;
  /** Additional classes for the control wrapper. */
  controlClassName?: string;
  children: React.ReactNode;
}

/**
 * Field — a labelled form row used across all ORCA forms.
 *
 * Keeps labels, hints, and error text consistent. Works with both custom
 * controls and the base Input/Textarea primitives.
 */
export function Field({
  label,
  hint,
  error,
  required = false,
  inline = false,
  className,
  controlClassName,
  children,
  ...props
}: FieldProps) {
  return (
    <div
      className={cn(
        'flex gap-2',
        inline ? 'flex-row items-center' : 'flex-col',
        className
      )}
      {...props}
    >
      {label && (
        <label
          className={cn(
            'font-mono text-[10px] tracking-wider uppercase text-ocean',
            inline && 'w-40 shrink-0'
          )}
        >
          {label}
          {required && (
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}

      <div className={cn('min-w-0 flex-1', controlClassName)}>
        {children}

        {error && (
          <p className="mt-1.5 font-mono text-[10px] text-danger-deep" role="alert">
            {error}
          </p>
        )}

        {!error && hint && (
          <p className="mt-1.5 text-[11px] text-ink-soft">{hint}</p>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                         Field Group (for layout)                           */
/* -------------------------------------------------------------------------- */

export interface FieldGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: 1 | 2 | 3;
  children: React.ReactNode;
}

export function FieldGroup({
  columns = 2,
  className,
  children,
  ...props
}: FieldGroupProps) {
  const columnClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={cn('grid gap-4', columnClass, className)} {...props}>
      {children}
    </div>
  );
}