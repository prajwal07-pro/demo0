import * as React from 'react';
import { motion } from 'framer-motion';
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
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { AgentPanel } from '@/components/chat/AgentPanel';
import { useChat } from '@/store/useAppStore';
import { aiService } from '@/services/aiService';
import { isDev } from '@/services/apiClient';
import type { ChatMessage as ChatMessageType, DataSource } from '@/types';

export default function AIAssistant() {
  const {
    conversations,
    activeConversationId,
    isStreaming,
    addConversation,
    setActiveConversation,
    updateConversation,
    setIsStreaming,
  } = useChat();

  const [messages, setMessages] = React.useState<ChatMessageType[]>([]);
  const [sources, setSources] = React.useState<DataSource[]>([]);
  const [agentStatuses, setAgentStatuses] = React.useState<
    Awaited<ReturnType<typeof aiService.getAgentStatuses>>
  >([]);
  const [feedback, setFeedback] = React.useState<
    Record<string, 'up' | 'down' | undefined>
  >({});
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const abortRef = React.useRef<AbortController | null>(null);

  React.useEffect(() => {
    aiService.getAgentStatuses().then(setAgentStatuses);
    const t = setInterval(() => {
      aiService.getAgentStatuses().then(setAgentStatuses);
    }, 10_000);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

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

  const handleNewInquiry = () => {
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content:
          "New inquiry started. Ask me about ocean conditions, vessel activity, fishing zones, weather risks, or run a simulation.",
        timestamp: new Date().toISOString(),
        confidence: 1,
      },
    ]);
    setSources([]);
    setActiveConversation(null);
  };

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
        },
        (chunk) => {
          if (chunk.type === 'text' && chunk.content) {
            buffer += chunk.content;
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantId ? { ...m, content: buffer } : m
              )
            );
          } else if (chunk.type === 'source' && chunk.source) {
            const src = chunk.source;
            setSources((prev) => [...prev, src]);
          } else if (chunk.type === 'agent' && chunk.agent) {
            const agent = chunk.agent;
            setAgentStatuses((prev) =>
              prev.map((a) => (a.id === agent.id ? agent : a))
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

  const handleFeedback = (messageId: string, kind: 'up' | 'down') => {
    setFeedback((prev) => ({
      ...prev,
      [messageId]: prev[messageId] === kind ? undefined : kind,
    }));
  };

  return (
    <div className="h-[calc(100vh-64px)] flex overflow-hidden bg-pearl text-ink">
      {/* Left: Conversations */}
      <aside className="hidden xl:flex flex-col w-64 shrink-0 border-r border-ink/[0.06] bg-white">
        <div className="p-3 border-b border-ink/[0.06]">
          <Button
            fullWidth
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={handleNewInquiry}
          >
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
            <SideLink
              icon={<FlaskConical className="h-3.5 w-3.5" />}
              label="Saved Analyses"
            />
            <SideLink
              icon={<GraduationCap className="h-3.5 w-3.5" />}
              label="Learning"
            />
          </Section>

          <Section title="CONVERSATIONS">
            {conversations.length === 0 ? (
              <p className="px-2 py-3 text-[11px] text-mist-deep">
                No conversations yet. Start a new inquiry.
              </p>
            ) : (
              conversations.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveConversation(c.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs transition-colors',
                    c.id === activeConversationId
                      ? 'bg-ocean/[0.08] text-ocean'
                      : 'text-ink-soft hover:bg-ink/[0.04] hover:text-ink'
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

      {/* Center: Chat */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="flex items-center gap-3 px-4 lg:px-6 h-14 border-b border-ink/[0.06] bg-white">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg border border-ocean/25 bg-ice flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold text-ocean">
                AI
              </span>
            </div>
            <div>
              <div className="font-display text-sm font-semibold text-ink">
                ORCA Assistant
              </div>
              <div className="font-mono text-[9px] tracking-widest text-ocean/70">
                {isStreaming
                  ? 'PROCESSING · MULTI-AGENT'
                  : 'ONLINE · 10 AGENTS READY'}
              </div>
            </div>
          </div>
          <div className="flex-1" />
          <button
            className="h-8 w-8 rounded-md border border-ink/10 hover:border-ocean/40 flex items-center justify-center text-mist-deep hover:text-ocean transition-colors"
            aria-label="Search conversations"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 lg:px-8 py-6 no-scrollbar bg-pearl-soft/40"
        >
          <div className="mx-auto max-w-3xl flex flex-col gap-6">
            {messages.map((m) => (
              <div key={m.id} className="relative">
                <ChatMessage message={m} />
                {m.role === 'assistant' && m.id !== 'welcome' && (
                  <div className="mt-1.5 ml-12 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleFeedback(m.id, 'up')}
                      aria-label="Helpful"
                      className={cn(
                        'h-6 w-6 rounded-md flex items-center justify-center transition-colors',
                        feedback[m.id] === 'up'
                          ? 'text-success-deep bg-success/[0.08]'
                          : 'text-mist-deep hover:text-ocean hover:bg-ocean/10'
                      )}
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFeedback(m.id, 'down')}
                      aria-label="Not helpful"
                      className={cn(
                        'h-6 w-6 rounded-md flex items-center justify-center transition-colors',
                        feedback[m.id] === 'down'
                          ? 'text-danger-deep bg-danger/[0.08]'
                          : 'text-mist-deep hover:text-ocean hover:bg-ocean/10'
                      )}
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
            ))}

            {isStreaming && messages[messages.length - 1]?.content === '' && (
              <ThinkingIndicator />
            )}
          </div>
        </div>

        <div className="border-t border-ink/[0.06] bg-white px-4 lg:px-8 py-4">
          <div className="mx-auto max-w-3xl">
            <ChatInput
              onSend={handleSend}
              onStop={handleStop}
              isStreaming={isStreaming}
            />
          </div>
        </div>
      </div>

      <aside className="hidden lg:flex flex-col w-80 shrink-0 border-l border-ink/[0.06] bg-white p-4">
        <AgentPanel agentStatuses={agentStatuses} sources={sources} />
      </aside>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <div className="px-2 py-1.5 font-mono text-[9px] tracking-widest text-ocean/70">
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
    <button className="group flex items-center gap-2 px-2 py-2 rounded-md text-left text-xs text-ink-soft hover:bg-ink/[0.04] hover:text-ink transition-colors">
      <span className="text-ocean/80 group-hover:text-ocean">{icon}</span>
      <span className="flex-1 truncate">{label}</span>
      {badge && (
        <span
          className={cn(
            'rounded-full px-1.5 h-4 min-w-4 flex items-center justify-center font-mono text-[9px] font-bold',
            variant === 'error' && 'bg-danger/15 text-danger-deep',
            variant === 'warning' && 'bg-warning/20 text-warning-deep'
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
            className="h-1.5 w-1.5 rounded-full bg-ocean"
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          />
        ))}
      </div>
      <span className="font-mono text-[10px] tracking-widest text-ocean">
        ORCA AGENTS PROCESSING…
      </span>
    </motion.div>
  );
}