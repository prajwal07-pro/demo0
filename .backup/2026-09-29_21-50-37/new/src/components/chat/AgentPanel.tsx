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
  /** Surface tone. Defaults to `light` (editorial pages). */
  tone?: 'light' | 'dark';
}

export function AgentPanel({
  agentStatuses = [],
  sources = [],
  className,
  tone = 'light',
}: AgentPanelProps) {
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
  const isLight = tone === 'light';

  return (
    <div className={cn('flex flex-col h-full gap-4', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div
            className={cn(
              'font-mono text-[9px] tracking-widest',
              isLight ? 'text-ocean/70' : 'text-cyan/70'
            )}
          >
            INTELLIGENCE STACK
          </div>
          <div
            className={cn(
              'font-display text-sm font-semibold',
              isLight ? 'text-ink' : 'text-white'
            )}
          >
            Active Agents
          </div>
        </div>
        <Badge
          variant={isLight ? 'light-success' : 'success'}
          dot
          size="sm"
        >
          {processingCount || 'READY'}
        </Badge>
      </div>

      {/* Agent list */}
      <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar">
        {merged.map((agent) => (
          <AgentRow key={agent.id} agent={agent} light={isLight} />
        ))}
      </div>

      {/* Evidence */}
      <div
        className={cn(
          'mt-2 pt-4 border-t flex flex-col gap-3 flex-1 min-h-0',
          isLight ? 'border-ink/[0.06]' : 'border-white/5'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <div
              className={cn(
                'font-mono text-[9px] tracking-widest',
                isLight ? 'text-ocean/70' : 'text-cyan/70'
              )}
            >
              EVIDENCE
            </div>
            <div
              className={cn(
                'font-display text-sm font-semibold',
                isLight ? 'text-ink' : 'text-white'
              )}
            >
              Data Sources
            </div>
          </div>
          <Badge
            variant={
              sources.length > 0
                ? isLight
                  ? 'light-success'
                  : 'success'
                : isLight
                  ? 'light-neutral'
                  : 'neutral'
            }
            size="sm"
          >
            {sources.length > 0 ? `${sources.length} SOURCES` : 'NONE'}
          </Badge>
        </div>

        {sources.length === 0 ? (
          <div
            className={cn(
              'rounded-xl border border-dashed p-4 text-center',
              isLight
                ? 'border-ink/15 bg-pearl-soft/50'
                : 'border-white/10 bg-white/[0.01]'
            )}
          >
            <p
              className={cn(
                'font-mono text-[10px] tracking-widest',
                isLight ? 'text-mist-deep' : 'text-white/50'
              )}
            >
              NO EVIDENCE ATTACHED
            </p>
            <p
              className={cn(
                'mt-1.5 text-[11px]',
                isLight ? 'text-ink-soft' : 'text-white/60'
              )}
            >
              Ask ORCA a question to see sources
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 overflow-y-auto no-scrollbar">
            {sources.map((s) => (
              <SourceCard key={s.id} source={s} light={isLight} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AgentRow({ agent, light }: { agent: AgentStatus; light: boolean }) {
  const Icon = AGENT_ICONS[agent.id as AgentId] ?? Circle;
  const meta = AI_AGENTS.find((a) => a.id === agent.id);

  const statusColor =
    agent.status === 'processing'
      ? light
        ? 'bg-ocean animate-pulse'
        : 'bg-cyan animate-pulse'
      : agent.status === 'error'
        ? light
          ? 'bg-danger'
          : 'bg-magenta'
        : agent.status === 'offline'
          ? light
            ? 'bg-ink/20'
            : 'bg-white/20'
          : light
            ? 'bg-success'
            : 'bg-teal';

  const isProcessing = agent.status === 'processing';

  return (
    <motion.div
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'group flex items-center gap-2.5 rounded-xl border px-2.5 py-2 transition-colors',
        isProcessing
          ? light
            ? 'border-ocean/30 bg-ocean/[0.06]'
            : 'border-cyan/40 bg-cyan/5'
          : light
            ? 'border-ink/[0.06] bg-white hover:border-ink/15'
            : 'border-white/5 bg-white/[0.015] hover:border-white/10'
      )}
    >
      <div
        className={cn(
          'relative flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border',
          light
            ? 'border-ink/10 bg-pearl-soft'
            : 'border-white/10 bg-abyss/70'
        )}
      >
        <Icon
          className={cn(
            'h-3.5 w-3.5',
            light ? 'text-ocean' : 'text-cyan/80'
          )}
        />
        <span
          className={cn(
            'absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border',
            light ? 'border-white' : 'border-abyss',
            statusColor
          )}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            'font-mono text-[9px] tracking-widest',
            light ? 'text-ocean/60' : 'text-cyan/60'
          )}
        >
          {String(agent.id).toUpperCase().replace('-', '·')}
        </div>
        <div
          className={cn(
            'text-[11px] truncate',
            light ? 'text-ink' : 'text-white'
          )}
        >
          {meta?.name ?? agent.name}
        </div>
      </div>
      {agent.confidence !== undefined && (
        <span
          className={cn(
            'font-mono text-[9px]',
            light ? 'text-ocean' : 'text-cyan/70'
          )}
        >
          {Math.round(agent.confidence * 100)}%
        </span>
      )}
    </motion.div>
  );
}

function SourceCard({
  source,
  light,
}: {
  source: DataSource;
  light: boolean;
}) {
  const typeVariantMap: Record<
    DataSource['type'],
    | 'light-info'
    | 'light-teal'
    | 'light-violet'
    | 'light-warning'
    | 'light-error'
    | 'light-neutral'
  > = {
    satellite: 'light-info',
    ais: 'light-teal',
    buoy: 'light-violet',
    model: 'light-warning',
    api: 'light-error',
    user: 'light-neutral',
  };

  return (
    <div
      className={cn(
        'rounded-xl border p-2.5',
        light
          ? 'border-ink/[0.06] bg-white shadow-soft'
          : 'border-white/5 bg-white/[0.015]'
      )}
    >
      <div className="flex items-center gap-2 mb-1.5">
        <Badge
          variant={
            light
              ? typeVariantMap[source.type]
              : source.type === 'satellite'
                ? 'info'
                : source.type === 'ais'
                  ? 'teal'
                  : source.type === 'buoy'
                    ? 'violet'
                    : source.type === 'model'
                      ? 'warning'
                      : source.type === 'api'
                        ? 'error'
                        : 'neutral'
          }
          size="sm"
        >
          {source.type.toUpperCase()}
        </Badge>
        <span
          className={cn(
            'font-mono text-[9px]',
            light ? 'text-mist-deep' : 'text-white/50'
          )}
        >
          {Math.round(source.reliability * 100)}% REL
        </span>
      </div>
      <div
        className={cn(
          'text-[11px] truncate',
          light ? 'text-ink' : 'text-white'
        )}
      >
        {source.name}
      </div>
      <div
        className={cn(
          'font-mono text-[9px] mt-0.5',
          light ? 'text-mist-deep' : 'text-white/40'
        )}
      >
        {new Date(source.timestamp).toLocaleString()}
      </div>
    </div>
  );
}