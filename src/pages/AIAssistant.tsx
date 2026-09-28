import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  MessageSquare,
  Radar,
  Ship,
  AlertTriangle,
  FlaskConical,
  GraduationCap,
  Search,
  MoreHorizontal,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { AgentPanel } from '@/components/chat/AgentPanel';
import { useAppStore, useChat } from '@/store/useAppStore';
import { aiService } from '@/services/aiService';
import { isDev } from '@/services/apiClient';
import type { ChatMessage as ChatMessageType, DataSource } from '@/types';

/**
 * AIAssistant — full-page ORCA conversational interface.
 *
 * Layout: three columns on desktop
 *   Left: conversations & context
 *   Center: chat stream + input
 *   Right: agents & evidence
 *
 * Mobile: single-column chat with bottom sheet for agents/sources.
 */
export default function AIAssistant() {
  const { conversations, activeConversationId, isStreaming, addConversation, updateConversation, setIsStreaming } =
    useChat();
  const user = useAppStore((s) => s.user);

  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [sources, setSources] = React.useState<DataSource[]>([]);
  const [agentStatuses, setAgentStatuses] = React.useState<Awaited<
    ReturnType<typeof aiService.getAgentStatuses>
  >>([]);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  // Load agent statuses
  React.useEffect(() => {
    aiService.getAgentStatuses().then(setAgentStatuses);
    const t = setInterval(() => {
      aiService.getAgentStatuses().then(setAgentStatuses);
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  // Seed initial greeting
  React.useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content:
            "Hello, I'm ORCA. Ask me about ocean conditions, vessel activity, fishing zones, weather risks, or run a simulation.",
          timestamp: new Date().toISOString(),
          confidence: 1,
          reasoning: [
            'Welcome message — no external data required',
            'Assistant ready to query live ocean and AIS sources',
          ],
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (text: string) => {
    const userMsg: ChatMessageType = {
      id: `u_${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    const assistantId = `a_${Date.now()}`;
    const placeholder: ChatMessageType = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, placeholder]);
    setIsStreaming(true);

    // Create conversation record if none exists
    if (!activeConversationId) {
      const conv = {
        id: `conv_${Date.now()}`,
        title: text.slice(0, 40),
        messages: [userMsg],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      addConversation(conv);
    }

    const controller = new AbortController();
    abortRef.current = controller;

    let buffer = '';
    try {
      await aiService.stream(
        {
          message: text,
          conversationId: activeConversationId ?? undefined,
          context: user
            ? {
                // could attach current map context here
              }
            : undefined,
        },
        (chunk) => {
          if (chunk.type === 'text' && chunk.content) {
            buffer += chunk.content;
            setMessages((prev) =>
              prev.map((m) => (m.id === assistantId ? { ...m, content: buffer } : m))
            );
          } else if (chunk.type === 'source' && chunk.source) {
            setSources((prev) => [...prev, chunk.source!]);
          } else if (chunk.type === 'agent' && chunk.agent) {
            setAgentStatuses((prev) =>
              prev.map((a) => (a.id === chunk.agent!.id ? chunk.agent! : a))
            );
          }
        },
        controller.signal
      );
    } catch (err) {
      if (isDev) console.warn('[AI stream error]', err);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  m.content ||
                  'I could not reach the ORCA backend. Please check your connection or try again shortly.',
              }
            : m
        )
      );
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
      if (activeConversationId) {
        updateConversation(activeConversationId, {
          updatedAt: new Date().toISOString(),
        });
      }
    }
  };

  const handleStop = () => {
    abortRef.current?.abort();
    setIsStreaming(false);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden">
      {/* ---------- Left: Conversations ---------- */}
      <aside className="hidden xl:flex flex-col w-64 shrink-0 border-r border-white/5 bg-abyss/40 backdrop-blur-md">
        <div className="p-3 border-b border-white/5">
          <Button fullWidth size="sm" leftIcon={<Plus className="h-3.5 w-3.5" />}>
            New Inquiry
          </Button>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 no-scrollbar">
          <Section title="WORKSPACE">
            <SideLink icon={<Radar className="h-3.5 w-3.5" />} label="Live Map" />
            <SideLink icon={<Ship className="h-3.5 w-3.5" />} label="Vessels" />
            <SideLink
              icon={<AlertTriangle className="h-3.5 w-3.5" />}
              label="Alerts"
              badge="3"
              variant="error"
            />
            <SideLink icon={<FlaskConical className="h-3.5 w-3.5" />} label="Saved Analyses" />
            <SideLink icon={<GraduationCap className="h-3.5 w-3.5" />} label="Learning" />
          </Section>

          <Section title="CONVERSATIONS">
            {conversations.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-muted-foreground">
                No conversations yet. Start a new inquiry.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs transition-colors',
                    c.id === activeConversationId
                      ? 'bg-cyan/10 text-cyan border border-cyan/20'
                      : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent'
                  )}
                >
                  <MessageSquare className="h-3 w-3 shrink-0" />
                  <span className="flex-1 truncate">{c.title}</span>
                  <MoreHorizontal className="h-3 w-3 opacity-0 group-hover:opacity-100" />
                </button>
              ))
            )}
          </Section>
        </nav>
      </aside>

      {/* ---------- Center: Chat ---------- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 lg:px-6 h-14 border-b border-white/5 bg-abyss/40 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md border border-cyan/30 bg-cyan/10 flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-cyan">AI</span>
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-white">
                ORCA Assistant
              </div>
              <div className="font-mono text-[9px] tracking-widest text-cyan/60">
                {isStreaming ? 'PROCESSING · MULTI-AGENT' : 'ONLINE · 10 AGENTS READY'}
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <button
            className="h-8 w-8 rounded-md border border-white/10 hover:border-cyan/40 flex items-center justify-center text-muted-foreground hover:text-cyan transition-colors"
            aria-label="Search conversations"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Chat stream */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 no-scrollbar"
        >
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            <AnimatePresence initial={false}>
              {messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
            </AnimatePresence>

            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <ThinkingIndicator />
            )}
          </div>
        </div>

        {/* Input */}
        <div className="border-t border-white/5 bg-abyss/40 backdrop-blur-md px-4 lg:px-8 py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSend}
              onStop={handleStop}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </div>

      {/* ---------- Right: Agents & Evidence ---------- */}
      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l border-white/5 bg-abyss/40 backdrop-blur-md p-4">
        <AgentPanel agentStatuses={agentStatuses} sources={sources} />
      </aside>
    </div>
  );
}

// ---------- Subcomponents ----------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="px-2 py-1.5 font-mono text-[9px] tracking-widest text-cyan/50">
        {title}
      </div>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function SideLink({
  icon,
  label,
  badge,
  variant,
}: {
  icon: React.ReactNode;
  label: string;
  badge?: string;
  variant?: 'error' | 'warning';
}) {
  return (
    <button className="group flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs text-muted-foreground hover:bg-white/5 hover:text-white transition-colors">
      <span className="text-cyan/70 group-hover:text-cyan">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span
          className={cn(
            'rounded-full px-1.5 h-4 min-w-4 flex items-center justify-center font-mono text-[9px] font-bold',
            variant === 'error' && 'bg-magenta/20 text-magenta',
            variant === 'warning' && 'bg-amber-400/20 text-amber-400'
          )}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function ThinkingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center gap-3"
    >
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="h-1.5 w-1.5 rounded-full bg-cyan"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-widest text-cyan/60">
        ORCA AGENTS PROCESSING…
      </span>
    </motion.div>
  );
}