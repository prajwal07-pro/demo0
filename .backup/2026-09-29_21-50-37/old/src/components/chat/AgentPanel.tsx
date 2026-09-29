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

export function AgentPanel({ agentStatuses = [], sources = [], className }: AgentPanelProps) {
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

  const processingCount = merged.filter((a) => a.status === 'processing').length;

  return (
    <div className={cn('flex flex-col h-full gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="font-mono text-[9px] tracking-widest text-ocean/70">
            INTELLIGENCE STACK
          </div>
          <div className="font-display text-sm font-semibold text-ink">
            Active Agents
          </div>
        </div>
        <Badge variant="light-success" dot size="sm">
          {processingCount || 'READY'}
        </Badge>
      </div>

      {/* Agent list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {merged.map((agent) => (
          <AgentRow key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Evidence */}
      <div className="mt-2 pt-4 border-t border-ink/[0.06] flex flex-col gap-3 flex-1 min-h-0">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-mono text-[9px] tracking-widest text-ocean/70">
              EVIDENCE
            </div>
            <div className="font-display text-sm font-semibold text-ink">
              Data Sources
            </div>
          </div>
          <Badge variant={sources.length > 0 ? 'light-success' : 'light-neutral'} size="sm">
            {sources.length > 0 ? `${sources.length} SOURCES` : 'NONE'}
          </Badge>
        </div>

        {sources.length === 0 ? (
          <div className="rounded-xl border border-dashed border-ink/15 bg-pearl-soft/50 p-4 text-center">
            <p className="font-mono text-[10px] tracking-widest text-mist-deep">
              NO EVIDENCE ATTACHED
            </p>
            <p className="mt-1.5 text-[11px] text-ink-soft">
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
      ? 'bg-ocean animate-pulse'
      : agent.status === 'error'
        ? 'bg-danger'
        : agent.status === 'offline'
          ? 'bg-ink/20'
          : 'bg-success';

  const isProcessing = agent.status === 'processing';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'group flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors',
        isProcessing
          ? 'border-ocean/30 bg-ocean/[0.06]'
          : 'border-ink/[0.06] bg-white hover:border-ink/15'
      )}
    >
      <div className="relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-ink/10 bg-pearl-soft">
        <Icon className="h-3.5 w-3.5 text-ocean" />
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-white',
            statusColor
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[9px] tracking-widest text-ocean/60">
          {String(agent.id).toUpperCase().replace('-', '·')}
        </div>
        <div className="text-[11px] text-ink truncate">{meta?.name ?? agent.name}</div>
      </div>
      {agent.confidence !== undefined && (
        <span className="font-mono text-[9px] text-ocean">
          {Math.round(agent.confidence * 100)}%
        </span>
      )}
    </motion.div>
  );
}

function SourceCard({ source }: { source: DataSource }) {
  const typeVariantMap: Record<DataSource['type'], 'light-info' | 'light-teal' | 'light-violet' | 'light-warning' | 'light-error' | 'light-neutral'> = {
    satellite: 'light-info',
    ais: 'light-teal',
    buoy: 'light-violet',
    model: 'light-warning',
    api: 'light-error',
    user: 'light-neutral',
  };

  return (
    <div className="rounded-xl border border-ink/[0.06] bg-white p-2.5 shadow-soft">
      <div className="flex items-center gap-2 mb-1.5">
        <Badge variant={typeVariantMap[source.type]} size="sm">
          {source.type.toUpperCase()}
        </Badge>
        <span className="font-mono text-[9px] text-mist-deep">
          {Math.round(source.reliability * 100)}% REL
        </span>
      </div>
      <div className="text-[11px] text-ink truncate">{source.name}</div>
      <div className="font-mono text-[9px] text-mist-deep mt-0.5">
        {new Date(source.timestamp).toLocaleString()}
      </div>
    </div>
  );
}