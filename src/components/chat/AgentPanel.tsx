import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Satellite,
  Waves,
  Ship,
  Cloud,
  Fish,
  AlertTriangle,
  ShieldCheck,
  Route,
  Sparkles,
  MessageSquare,
  Circle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AI_AGENTS, type AgentId } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { AgentStatus, DataSource } from '@/types';

const AGENT_ICONS: Record<AgentId, React.ComponentType<{ className?: string }>> = {
  satellite: Satellite,
  'ocean-state': Waves,
  ais: Ship,
  weather: Cloud,
  'fishing-zone': Fish,
  risk: AlertTriangle,
  safety: ShieldCheck,
  route: Route,
  recommendation: Sparkles,
  conversational: MessageSquare,
};

interface AgentPanelProps {
  agentStatuses?: AgentStatus[];
  sources?: DataSource[];
  className?: string;
}

/**
 * AgentPanel — right-hand sidebar for the AI Assistant.
 * Shows multi-agent status, live data sources, and evidence chains.
 */
export function AgentPanel({ agentStatuses = [], sources = [], className }: AgentPanelProps) {
  // Merge constants metadata with live statuses
  const merged = React.useMemo<AgentStatus[]>(() => {
    return AI_AGENTS.map((agent) => {
      const live = agentStatuses.find((s) => s.id === agent.id);
      return (
        live ?? {
          id: agent.id,
          name: agent.name,
          status: 'idle' as const,
        }
      );
    });
  }, [agentStatuses]);

  return (
    <div className={cn('flex flex-col h-full gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-widest text-cyan/70">
            INTELLIGENCE STACK
          </div>
          <div className="font-display text-sm font-semibold text-white">
            Active Agents
          </div>
        </div>
        <Badge variant="success" dot size="sm">
          {merged.filter((a) => a.status === 'processing').length || 'READY'}
        </Badge>
      </div>

      {/* Agent list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {merged.map((agent) => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Evidence */}
      <div className="mt-2 pt-4 border-t border-white/5 flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] tracking-widest text-cyan/70">
              EVIDENCE
            </div>
            <div className="font-display text-sm font-semibold text-white">
              Data Sources
            </div>
          </div>
          <Badge variant={sources.length > 0 ? 'success' : 'neutral'} size="sm">
            {sources.length > 0 ? `${sources.length} SOURCES` : 'NONE'}
          </Badge>
        </div>

        {sources.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-4 text-center">
            <p className="font-mono text-[10px] tracking-widest text-muted-foreground">
              NO EVIDENCE ATTACHED
            </p>
            <p className="mt-1.5 text-[11px] text-muted-foreground/70">
              Ask ORCA a question to see sources
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
            {sources.map((s) => (
              <SourceCard key={s.id} source={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentRow({ agent }: { agent: AgentStatus }) {
  const Icon = AGENT_ICONS[agent.id as AgentId] ?? Circle;
  const meta = AI_AGENTS.find((a) => a.id === agent.id);

  const statusColor =
    agent.status === 'processing'
      ? 'bg-cyan animate-pulse'
      : agent.status === 'error'
        ? 'bg-magenta'
        : agent.status === 'offline'
          ? 'bg-muted-foreground/50'
          : 'bg-teal';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'group flex items-center gap-2.5 rounded-lg border px-2.5 py-2 transition-colors',
        agent.status === 'processing'
          ? 'border-cyan/40 bg-cyan/5'
          : 'border-white/5 bg-white/[0.015] hover:border-white/10 hover:bg-white/[0.03]'
      )}
    >
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 bg-abyss/70">
        <Icon className="h-3.5 w-3.5 text-cyan/80" />
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-abyss',
            statusColor
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[9px] tracking-widest text-cyan/60">
          {String(agent.id).toUpperCase().replace('-', '·')}
        </div>
        <div className="text-[11px] text-white truncate">{meta?.name ?? agent.name}</div>
      </div>
      {agent.confidence !== undefined && (
        <span className="font-mono text-[9px] text-cyan/70">
          {Math.round(agent.confidence * 100)}%
        </span>
      )}
    </motion.div>
  );
}

function SourceCard({ source }: { source: DataSource }) {
  const typeColor = {
    satellite: 'text-cyan border-cyan/30',
    ais: 'text-teal border-teal/30',
    buoy: 'text-violet border-violet/30',
    model: 'text-amber-400 border-amber-400/30',
    api: 'text-magenta border-magenta/30',
    user: 'text-white border-white/30',
  }[source.type];

  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.015] p-2.5">
      <div className="flex items-center gap-2 mb-1.5">
        <span className={cn('rounded border px-1.5 py-0.5 font-mono text-[8px] tracking-widest', typeColor)}>
          {source.type.toUpperCase()}
        </span>
        <span className="font-mono text-[9px] text-muted-foreground">
          {Math.round(source.reliability * 100)}% REL
        </span>
      </div>
      <div className="text-[11px] text-white truncate">{source.name}</div>
      <div className="font-mono text-[9px] text-muted-foreground/70 mt-0.5">
        {new Date(source.timestamp).toLocaleString()}
      </div>
    </div>
  );
}