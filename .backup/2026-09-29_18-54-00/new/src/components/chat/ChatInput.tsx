import * as React from 'react';
import { Send, Paperclip, Square, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileDropZone, type UploadedFile } from './FileDropZone';
import { VoiceInputButton } from './VoiceInputButton';

interface ChatInputProps {
  onSend: (value: string, attachments?: UploadedFile[]) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  suggestions?: string[];
  onSuggestion?: (value: string) => void;
}

export function ChatInput({
  onSend,
  onStop,
  isStreaming = false,
  disabled = false,
  placeholder = 'Ask ORCA anything about the ocean...',
  suggestions = [
    'Show fishing zones near Paradip',
    'Analyze cyclone risk next 3 days',
    'Explain chlorophyll maps',
    'Compare SST data',
    'Create route suggestion',
    'Run a simulation',
  ],
  onSuggestion,
}: ChatInputProps) {
  const [value, setValue] = React.useState('');
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [attachOpen, setAttachOpen] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed, files.length > 0 ? files : undefined);
    setValue('');
    setFiles([]);
    setAttachOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  const handleVoiceTranscription = (text: string) => {
    setValue((v) => (v ? `${v} ${text}` : text));
    textareaRef.current?.focus();
  };

  const handleVoiceError = (message: string) => {
    // Currently silent by design — voice input gracefully degrades
    // when unsupported. Downstream can wire a toast if desired.
    if (import.meta.env.DEV) console.warn('[voice]', message);
  };

  return (
    <div className="flex flex-col gap-3">
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => {
                setValue(s);
                onSuggestion?.(s);
                textareaRef.current?.focus();
              }}
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-ink/10 bg-white px-3 py-1.5 text-[11px] text-ink-soft hover:text-ocean hover:border-ocean/30 transition-colors shadow-soft"
            >
              <Sparkles className="h-3 w-3 text-ocean/70" />
              {s}
            </button>
          ))}
        </div>
      )}

      {attachOpen && (
        <FileDropZone
          files={files}
          onFilesChange={setFiles}
          maxFiles={5}
          accept={['image/', 'application/pdf', 'text/']}
        />
      )}

      <div
        className={cn(
          'relative rounded-2xl border bg-white transition-all shadow-soft',
          isStreaming
            ? 'border-ocean/40 shadow-soft-md'
            : 'border-ink/10 focus-within:border-ocean/50 focus-within:shadow-soft-md'
        )}
      >
        <div className="flex items-end gap-2 p-3">
          <button
            type="button"
            onClick={() => setAttachOpen((v) => !v)}
            aria-label={attachOpen ? 'Close attachments' : 'Attach files'}
            aria-pressed={attachOpen}
            className={cn(
              'h-9 w-9 rounded-lg border flex items-center justify-center transition-colors shrink-0',
              attachOpen
                ? 'border-ocean/40 bg-ocean/[0.06] text-ocean'
                : 'border-ink/10 hover:border-ocean/40 text-mist-deep hover:text-ocean'
            )}
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className="flex-1 resize-none bg-transparent outline-none text-sm text-ink placeholder:text-ink-muted py-2 min-h-[36px] max-h-[200px] no-scrollbar"
          />

          <VoiceInputButton
            onTranscription={handleVoiceTranscription}
            onError={handleVoiceError}
            size="md"
          />

          {isStreaming ? (
            <button
              onClick={onStop}
              className="h-9 px-3 rounded-lg bg-danger text-white flex items-center gap-2 hover:brightness-110 transition-all shrink-0 font-medium text-xs"
              aria-label="Stop generation"
            >
              <Square className="h-3 w-3 fill-current" />
              STOP
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!value.trim() || disabled}
              className={cn(
                'h-9 px-4 rounded-lg flex items-center gap-2 transition-all shrink-0 font-medium text-xs',
                value.trim() && !disabled
                  ? 'bg-gradient-to-r from-ocean to-cyan-dark text-white shadow-soft hover:brightness-110'
                  : 'bg-ink/[0.06] text-mist-deep cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
              SEND
            </button>
          )}
        </div>

        {files.length > 0 && (
          <div className="px-3 pb-2 font-mono text-[10px] tracking-widest text-ocean">
            {files.length} ATTACHMENT{files.length > 1 ? 'S' : ''} READY
          </div>
        )}
      </div>

      <div className="flex items-center justify-between px-2 text-[10px] font-mono tracking-wider text-mist-deep">
        <span>ORCA may produce inaccuracies. Always verify operational data.</span>
        <span className="hidden sm:inline">ENTER to send · SHIFT+ENTER for new line</span>
      </div>
    </div>
  );
}