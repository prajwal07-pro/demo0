import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Dialog } from './Dialog';
import { Button } from './Button';

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  /** Additional content shown under the description. */
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Visual tone: informational, warning, or destructive. */
  tone?: 'default' | 'warning' | 'danger';
}

/**
 * ConfirmDialog — the platform-standard confirmation modal.
 *
 * Used for destructive operations (delete conversation, clear filters,
 * reset preferences). Handles async confirmation with a loading state so
 * the caller does not need to wire it up on every use.
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Confirm action',
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'default',
}: ConfirmDialogProps) {
  const [submitting, setSubmitting] = React.useState(false);

  const handleConfirm = async () => {
    try {
      setSubmitting(true);
      await onConfirm();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const toneStyles = {
    default: {
      buttonVariant: 'primary-light' as const,
      iconColor: 'text-ocean border-ocean/30 bg-ocean/[0.06]',
    },
    warning: {
      buttonVariant: 'primary-light' as const,
      iconColor: 'text-warning-deep border-warning/30 bg-warning/[0.08]',
    },
    danger: {
      buttonVariant: 'destructive' as const,
      iconColor: 'text-danger-deep border-danger/30 bg-danger/[0.06]',
    },
  }[tone];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="sm"
      persistent={submitting}
      footer={
        <>
          <Button
            variant="ghost-light"
            size="md"
            onClick={onClose}
            disabled={submitting}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={toneStyles.buttonVariant}
            size="md"
            loading={submitting}
            onClick={handleConfirm}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {tone !== 'default' && (
          <div
            className={cn(
              'shrink-0 h-11 w-11 rounded-lg border flex items-center justify-center',
              toneStyles.iconColor
            )}
          >
            <AlertTriangle className="h-5 w-5" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold text-ink">
            {title}
          </h3>
          {description && (
            <p className="mt-2 text-sm text-ink-soft leading-relaxed">
              {description}
            </p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </Dialog>
  );
}