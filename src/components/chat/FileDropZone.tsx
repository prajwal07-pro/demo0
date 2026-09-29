import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, FileText, Image as ImageIcon, File } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  /** Object URL for preview (only set for images). */
  previewUrl?: string;
}

export interface FileDropZoneProps {
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  /** Max number of files. Defaults to 5. */
  maxFiles?: number;
  /** Max size per file in bytes. Defaults to 10 MB. */
  maxSizeBytes?: number;
  /** Accepted MIME types. */
  accept?: string[];
  className?: string;
}

const DEFAULT_MAX_SIZE = 10 * 1024 * 1024;

/**
 * FileDropZone — drag-and-drop or click-to-select file uploader used by
 * the AI assistant. Stores file metadata and, for images, a preview URL
 * via URL.createObjectURL.
 *
 * Upload to the backend is the caller's responsibility. This component
 * only manages selection and preview.
 */
export function FileDropZone({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  accept,
  className,
}: FileDropZoneProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (list: FileList | File[]) => {
    setError(null);
    const incoming = Array.from(list);

    if (files.length + incoming.length > maxFiles) {
      setError(`Maximum ${maxFiles} files.`);
      return;
    }

    const accepted: UploadedFile[] = [];
    for (const file of incoming) {
      if (file.size > maxSizeBytes) {
        setError(
          `${file.name} is larger than ${(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB.`
        );
        continue;
      }
      if (accept && accept.length > 0 && !accept.some((a) => file.type.startsWith(a))) {
        setError(`${file.name} is not an accepted file type.`);
        continue;
      }
      const uploaded: UploadedFile = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      if (file.type.startsWith('image/')) {
        uploaded.previewUrl = URL.createObjectURL(file);
      }
      accepted.push(uploaded);
    }

    if (accepted.length > 0) {
      onFilesChange([...files, ...accepted]);
    }
  };

  const remove = (id: string) => {
    const target = files.find((f) => f.id === id);
    if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
        }}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-ocean/60 bg-ocean/[0.06]'
            : 'border-ink/15 bg-pearl-soft hover:border-ocean/40'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept?.join(',')}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            e.target.value = '';
          }}
        />
        <div className="flex flex-col items-center gap-3">
          <div className="h-11 w-11 rounded-xl border border-ocean/25 bg-white flex items-center justify-center">
            <UploadCloud className="h-5 w-5 text-ocean" />
          </div>
          <div>
            <div className="font-display text-sm font-semibold text-ink">
              {isDragging ? 'Drop files here' : 'Drag & drop files'}
            </div>
            <div className="mt-1 text-xs text-ink-soft">
              Or click to browse · up to {maxFiles} files ·{' '}
              {(maxSizeBytes / (1024 * 1024)).toFixed(0)} MB each
            </div>
          </div>
        </div>
      </div>

      {error && (
        <p className="font-mono text-[10px] tracking-wider text-danger-deep">
          {error}
        </p>
      )}

      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-col gap-2"
          >
            {files.map((file) => (
              <motion.li
                key={file.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                className="flex items-center gap-3 rounded-xl border border-ink/[0.06] bg-white p-2.5 shadow-soft"
              >
                <div className="h-9 w-9 shrink-0 rounded-lg border border-ink/10 bg-pearl-soft flex items-center justify-center overflow-hidden">
                  {file.previewUrl ? (
                    <img src={file.previewUrl} alt="" className="h-full w-full object-cover" />
                  ) : file.type.startsWith('image/') ? (
                    <ImageIcon className="h-4 w-4 text-ocean" />
                  ) : file.type.includes('pdf') ? (
                    <FileText className="h-4 w-4 text-ocean" />
                  ) : (
                    <File className="h-4 w-4 text-mist-deep" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-ink truncate">{file.name}</div>
                  <div className="font-mono text-[9px] text-mist-deep">
                    {(file.size / 1024).toFixed(1)} KB
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => remove(file.id)}
                  aria-label={`Remove ${file.name}`}
                  className="h-7 w-7 rounded-md flex items-center justify-center text-mist-deep hover:text-danger-deep hover:bg-danger/[0.06] transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}