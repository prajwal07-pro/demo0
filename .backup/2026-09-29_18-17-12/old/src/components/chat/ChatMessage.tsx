import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  Sparkles,
  Database,
  Bot,
  User as UserIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import type { ChatMessage as ChatMessageType, DataSource } from '@/types';

interface ChatMessageProps {
  message: ChatMessageType;
  onExplain?: (id: string) => void;
}

/**
 * ChatMessage — single message bubble.
 * Renders markdown-lite content (paragraphs + inline code + lists),
 * plus sources, confidence, and reasoning chips.
 */
export function ChatMessage({ message, onExplain }: ChatMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const [showReasoning, setShowReasoning] = React.useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex w-full gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border',
          isUser && 'border-white/10 bg-white/5',
          !isUser && !isSystem && 'border-cyan/30 bg-cyan/10',
          isSystem && 'border-amber-400/30 bg-amber-400/10'
        )}
      >
        {isUser ? (
          <UserIcon className="h-4 w-4 text-muted-foreground" />
        ) : isSystem ? (
          <Database className="h-4 w-4 text-amber-400" />
        ) : (
          <Bot className="h-4 w-4 text-cyan" />
        )}
      </div>

      {/* Body */}
      <div className={cn('flex-1 min-w-0 flex flex-col gap-2', isUser && 'items-end')}>
        <div
          className={cn(
            'relative max-w-[min(90%,720px)] rounded-2xl border px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'border-white/10 bg-white/[0.04] text-white'
              : isSystem
                ? 'border-amber-400/20 bg-amber-400/5 text-amber-100'
                : 'border-cyan/15 bg-abyss/60 backdrop-blur-md text-white'
          )}
        >
          {/* HUD corner accent on assistant messages */}
          {!isUser && !isSystem && (
            <>
              <span className="absolute -top-px -left-px w-2 h-2 border-t border-l border-cyan/50" />
              <span className="absolute -top-px -right-px w-2 h-2 border-t border-r border-cyan/50" />
            </>
          )}

          <div className="prose-invert prose-sm max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={cn('min-h-[1em]', i > 0 && 'mt-2')}>
                {renderInline(line)}
              </p>
            ))}
          </div>

          {/* Meta row */}
          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-white/5 flex flex-wrap items-center gap-2">
              {message.confidence !== undefined && (
                <ConfidenceChip value={message.confidence} />
              )}
              {message.agents && message.agents.length > 0 && (
                <Badge variant="violet" size="sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  {message.agents.length} AGENT{message.agents.length > 1 ? 'S' : ''}
                </Badge>
              )}
              {onExplain && (
                <button
                  onClick={() => onExplain(message.id)}
                  className="ml-auto font-mono text-[10px] tracking-widest text-cyan/70 hover:text-cyan transition-colors"
                >
                  WHY THIS?
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sources */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-w-[min(90%,720px)]">
            {message.sources.map((s) => (
              <SourceChip key={s.id} source={s} />
            ))}
          </div>
        )}

        {/* Reasoning summary (auditable, not chain-of-thought) */}
        {!isUser && message.reasoning && message.reasoning.length > 0 && (
          <div className="w-full max-w-[min(90%,720px)]">
            <button
              onClick={() => setShowReasoning((v) => !v)}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-cyan/70 hover:text-cyan transition-colors"
            >
              <ChevronDown
                className={cn('h-3 w-3 transition-transform', showReasoning && 'rotate-180')}
              />
              {showReasoning ? 'HIDE' : 'SHOW'} REASONING SUMMARY
            </button>
            {showReasoning && (
              <motion.ol
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-2 rounded-lg border border-white/5 bg-white/[0.02] p-3 flex flex-col gap-1.5 list-decimal list-inside text-xs text-muted-foreground"
              >
                {message.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </motion.ol>
            )}
          </div>
        )}

        {/* Action row */}
        {!isUser && (
          <div className="flex items-center gap-1 mt-0.5">
            <IconButton
              onClick={handleCopy}
              label={copied ? 'Copied' : 'Copy'}
              icon={copied ? <Check className="h-3 w-3 text-teal" /> : <Copy className="h-3 w-3" />}
            />
            <IconButton
              onClick={() => {}}
              label="Helpful"
              icon={<ThumbsUp className="h-3 w-3" />}
            />
            <IconButton
              onClick={() => {}}
              label="Not helpful"
              icon={<ThumbsDown className="h-3 w-3" />}
            />
            <span className="ml-2 font-mono text-[9px] tracking-wider text-muted-foreground/60">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ---------- Inline renderer (very light markdown) ----------
function renderInline(text: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(`[^`]+`|\*\*[^*]+\*\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let k = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('`')) {
      parts.push(
        <code
          key={k++}
          className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-[0.85em] text-cyan"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={k++} className="font-semibold text-white">
          {token.slice(2, -2)}
        </strong>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

function ConfidenceChip({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const level = pct >= 75 ? 'high' : pct >= 50 ? 'medium' : 'low';
  return (
    <div className="flex items-center gap-1.5">
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-white/10">
        <div
          className={cn(
            'h-full rounded-full',
            level === 'high' && 'bg-teal',
            level === 'medium' && 'bg-cyan',
            level === 'low' && 'bg-amber-400'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-wider text-muted-foreground">
        {pct}% CONF
      </span>
    </div>
  );
}

function SourceChip({ source }: { source: DataSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.02] px-2 py-1 font-mono text-[9px] tracking-wider text-muted-foreground">
      <span className="h-1 w-1 rounded-full bg-cyan" />
      {source.name.toUpperCase()}
      <span className="text-cyan/40">·</span>
      <span className="text-cyan/60">{Math.round(source.reliability * 100)}%</span>
    </span>
  );
}

function IconButton({
  onClick,
  label,
  icon,
}: {
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="h-6 w-6 rounded-md flex items-center justify-center text-muted-foreground hover:text-cyan hover:bg-cyan/10 transition-colors"
    >
      {icon}
    </button>
  );
}