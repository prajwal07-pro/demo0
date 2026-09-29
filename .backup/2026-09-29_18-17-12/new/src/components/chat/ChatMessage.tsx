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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={cn('flex w-full gap-3', isUser ? 'flex-row-reverse' : 'flex-row')}
    >
      {/* Avatar */}
      <div
        className={cn(
          'shrink-0 flex h-9 w-9 items-center justify-center rounded-lg border',
          isUser && 'border-ink/10 bg-white',
          !isUser && !isSystem && 'border-ocean/25 bg-ice',
          isSystem && 'border-warning/30 bg-warning/[0.12]'
        )}
      >
        {isUser ? (
          <UserIcon className="h-4 w-4 text-ink-soft" />
        ) : isSystem ? (
          <Database className="h-4 w-4 text-warning-deep" />
        ) : (
          <Bot className="h-4 w-4 text-ocean" />
        )}
      </div>

      {/* Body */}
      <div className={cn('flex-1 min-w-0 flex flex-col gap-2', isUser && 'items-end')}>
        <div
          className={cn(
            'relative max-w-[min(90%,720px)] rounded-2xl border px-4 py-3 text-sm leading-relaxed',
            isUser
              ? 'border-ink/10 bg-white text-ink shadow-soft'
              : isSystem
                ? 'border-warning/25 bg-warning/[0.06] text-ink'
                : 'border-ink/10 bg-white text-ink shadow-soft'
          )}
        >
          <div className="max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i} className={cn('min-h-[1em]', i > 0 && 'mt-2')}>
                {renderInline(line)}
              </p>
            ))}
          </div>

          {!isUser && (
            <div className="mt-3 pt-2.5 border-t border-ink/[0.06] flex flex-wrap items-center gap-2">
              {message.confidence !== undefined && (
                <ConfidenceChip value={message.confidence} />
              )}
              {message.agents && message.agents.length > 0 && (
                <Badge variant="light-violet" size="sm">
                  <Sparkles className="h-2.5 w-2.5" />
                  {message.agents.length} AGENT{message.agents.length > 1 ? 'S' : ''}
                </Badge>
              )}
              {onExplain && (
                <button
                  onClick={() => onExplain(message.id)}
                  className="ml-auto font-mono text-[10px] tracking-widest text-ocean hover:text-ocean-dark transition-colors"
                >
                  WHY THIS?
                </button>
              )}
            </div>
          )}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5 max-w-[min(90%,720px)]">
            {message.sources.map((s) => (
              <SourceChip key={s.id} source={s} />
            ))}
          </div>
        )}

        {!isUser && message.reasoning && message.reasoning.length > 0 && (
          <div className="w-full max-w-[min(90%,720px)]">
            <button
              onClick={() => setShowReasoning((v) => !v)}
              className="flex items-center gap-1.5 font-mono text-[10px] tracking-widest text-ocean hover:text-ocean-dark transition-colors"
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
                className="mt-2 rounded-xl border border-ink/[0.08] bg-white p-3 flex flex-col gap-1.5 list-decimal list-inside text-xs text-ink-soft shadow-soft"
              >
                {message.reasoning.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </motion.ol>
            )}
          </div>
        )}

        {!isUser && (
          <div className="flex items-center gap-1 mt-0.5">
            <IconButton
              onClick={handleCopy}
              label={copied ? 'Copied' : 'Copy'}
              icon={
                copied ? (
                  <Check className="h-3 w-3 text-success-deep" />
                ) : (
                  <Copy className="h-3 w-3" />
                )
              }
            />
            <IconButton onClick={() => {}} label="Helpful" icon={<ThumbsUp className="h-3 w-3" />} />
            <IconButton onClick={() => {}} label="Not helpful" icon={<ThumbsDown className="h-3 w-3" />} />
            <span className="ml-2 font-mono text-[9px] tracking-wider text-mist-deep">
              {new Date(message.timestamp).toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

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
          className="rounded bg-ice px-1.5 py-0.5 font-mono text-[0.85em] text-ocean"
        >
          {token.slice(1, -1)}
        </code>
      );
    } else if (token.startsWith('**')) {
      parts.push(
        <strong key={k++} className="font-semibold text-ink">
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
      <div className="relative h-1 w-16 overflow-hidden rounded-full bg-ink/[0.08]">
        <div
          className={cn(
            'h-full rounded-full',
            level === 'high' && 'bg-success',
            level === 'medium' && 'bg-ocean',
            level === 'low' && 'bg-warning'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="font-mono text-[10px] tracking-wider text-mist-deep">
        {pct}% CONF
      </span>
    </div>
  );
}

function SourceChip({ source }: { source: DataSource }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-md border border-ink/10 bg-white px-2 py-1 font-mono text-[9px] tracking-wider text-ink-soft shadow-soft">
      <span className="h-1 w-1 rounded-full bg-ocean" />
      {source.name.toUpperCase()}
      <span className="text-ocean/40">·</span>
      <span className="text-ocean">{Math.round(source.reliability * 100)}%</span>
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
      className="h-6 w-6 rounded-md flex items-center justify-center text-mist-deep hover:text-ocean hover:bg-ocean/10 transition-colors"
    >
      {icon}
    </button>
  );
}