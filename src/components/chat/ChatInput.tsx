import * as React from 'react';
import { motion } from 'framer-motion';
import { Send, Paperclip, Mic, Square, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSend: (value: string) => void;
  onStop?: () => void;
  isStreaming?: boolean;
  disabled?: boolean;
  placeholder?: string;
  /** Quick suggestion chips */
  suggestions?: string[];
  onSuggestion?: (value: string) => void;
}

/**
 * ChatInput — the ORCA assistant's prompt bar.
 * Features: expandable textarea, voice, file upload, streaming stop button.
 */
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
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, [value]);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled || isStreaming) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Suggestion chips */}
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
              className="shrink-0 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1.5 text-[11px] text-muted-foreground hover:text-cyan hover:border-cyan/40 hover:bg-cyan/5 transition-colors"
            >
              <Sparkles className="h-3 w-3 text-cyan/60" />
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input container */}
      <div
        className={cn(
          'relative rounded-2xl border bg-abyss/70 backdrop-blur-xl transition-all',
          isStreaming
            ? 'border-cyan/50 shadow-[0_0_30px_rgba(6,182,212,0.2)]'
            : 'border-white/10 focus-within:border-cyan/50 focus-within:shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        )}
      >
        {/* HUD corners */}
        <span className="absolute top-0 left-0 w-2.5 h-2.5 border-t border-l border-cyan/40" />
        <span className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-cyan/40" />
        <span className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-cyan/40" />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 border-b border-r border-cyan/40" />

        <div className="flex items-end gap-2 p-3">
          <button
            className="h-9 w-9 rounded-lg border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 flex items-center justify-center text-muted-foreground hover:text-cyan transition-colors shrink-0"
            aria-label="Attach file"
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
            className="flex-1 resize-none bg-transparent outline-none text-sm text-white placeholder:text-muted-foreground py-2 min-h-[36px] max-h-[200px] no-scrollbar"
          />

          <button
            className="h-9 w-9 rounded-lg border border-white/10 hover:border-cyan/40 hover:bg-cyan/5 flex items-center justify-center text-muted-foreground hover:text-cyan transition-colors shrink-0"
            aria-label="Voice input"
          >
            <Mic className="h-4 w-4" />
          </button>

          {isStreaming ? (
            <button
              onClick={onStop}
              className="h-9 px-3 rounded-lg bg-magenta text-white flex items-center gap-2 hover:brightness-110 transition-all shrink-0 font-medium text-xs"
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
                  ? 'bg-gradient-to-r from-cyan to-teal text-abyss shadow-glow-cyan hover:brightness-110'
                  : 'bg-white/5 text-muted-foreground cursor-not-allowed'
              )}
              aria-label="Send message"
            >
              <Send className="h-3.5 w-3.5" />
              SEND
            </button>
          )}
        </div>
      </div>

      {/* Footer hint */}
      <div className="flex items-center justify-between px-2 text-[10px] font-mono tracking-wider text-muted-foreground/60">
        <span>
          ORCA may produce inaccuracies. Always verify operational data.
        </span>
        <span className="hidden sm:inline">
          ENTER to send · SHIFT+ENTER for new line
        </span>
      </div>
    </div>
  );
}