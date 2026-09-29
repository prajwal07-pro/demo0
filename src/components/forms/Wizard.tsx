import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  /** Optional validation — return an error string to block progress. */
  validate?: () => string | null;
  /** Content to render for this step. */
  content: React.ReactNode;
}

export interface WizardProps {
  steps: WizardStep[];
  /** Called when the user confirms the final step. */
  onComplete?: () => void | Promise<void>;
  /** Called when the user cancels/closes the wizard. */
  onCancel?: () => void;
  /** Optional className applied to the outer container. */
  className?: string;
  /** Label for the final step's confirm button. */
  confirmLabel?: string;
}

/**
 * Wizard — multi-step form container.
 *
 * The wizard does not own the form state; each step's content is expected
 * to manage its own inputs (typically via useLocalDraft at the parent
 * level). The wizard only orchestrates progression and validation.
 */
export function Wizard({
  steps,
  onComplete,
  onCancel,
  className,
  confirmLabel = 'Confirm',
}: WizardProps) {
  const [index, setIndex] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);
  const [submitting, setSubmitting] = React.useState(false);

  const current = steps[index];
  const isFirst = index === 0;
  const isLast = index === steps.length - 1;

  const next = async () => {
    setError(null);
    const validationError = current?.validate?.();
    if (validationError) {
      setError(validationError);
      return;
    }
    if (isLast) {
      try {
        setSubmitting(true);
        await onComplete?.();
      } finally {
        setSubmitting(false);
      }
      return;
    }
    setIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const prev = () => {
    setError(null);
    setIndex((i) => Math.max(i - 1, 0));
  };

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Stepper */}
      <ol className="flex flex-wrap items-center gap-2 mb-6">
        {steps.map((step, i) => {
          const isActive = i === index;
          const isComplete = i < index;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => i <= index && setIndex(i)}
                disabled={i > index}
                className={cn(
                  'flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors',
                  isActive
                    ? 'border-ocean/40 bg-ocean/[0.08] text-ocean'
                    : isComplete
                      ? 'border-success/30 bg-success/[0.06] text-success-deep'
                      : 'border-ink/10 bg-white text-mist-deep',
                  i > index && 'cursor-not-allowed'
                )}
              >
                <span
                  className={cn(
                    'h-4 w-4 rounded-full flex items-center justify-center font-mono text-[9px]',
                    isComplete
                      ? 'bg-success/20'
                      : isActive
                        ? 'bg-ocean/20'
                        : 'bg-ink/[0.06]'
                  )}
                >
                  {isComplete ? <Check className="h-2.5 w-2.5" /> : i + 1}
                </span>
                <span className="font-medium">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <span
                  className="hidden md:block h-px w-6 bg-ink/10"
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Step content */}
      <div className="relative flex-1 min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={current?.id ?? 'step'}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            {current?.description && (
              <p className="mb-4 text-sm text-ink-soft">{current.description}</p>
            )}
            {current?.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-5 border-t border-ink/[0.06] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {onCancel && (
            <Button variant="ghost-light" size="sm" onClick={onCancel}>
              Cancel
            </Button>
          )}
          {error && (
            <span className="font-mono text-[10px] text-danger-deep">
              {error}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary-light"
            size="sm"
            leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
            disabled={isFirst || submitting}
            onClick={prev}
          >
            Back
          </Button>
          <Button
            size="sm"
            loading={submitting}
            rightIcon={
              !isLast ? <ChevronRight className="h-3.5 w-3.5" /> : undefined
            }
            onClick={next}
          >
            {isLast ? confirmLabel : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
}