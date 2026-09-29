/**
 * AI Service
 *
 * Conversational and analytical layer. Talks to a backend proxy that
 * orchestrates the ORCA agents. Never exposes model keys client-side.
 *
 * Provides:
 *  - ask()               : single-shot query
 *  - stream()            : SSE / streaming response
 *  - getAgentStatuses()  : live multi-agent status
 *  - explain()           : auditable evidence for a recommendation
 */

import { api, isDev, hasBackend } from './apiClient';
import type { AgentStatus, ChatMessage, DataSource } from '@/types';
import { API_ENDPOINTS, AI_AGENTS } from '@/lib/constants';

export interface AIQuery {
  conversationId?: string;
  message: string;
  context?: {
    location?: { lat: number; lng: number };
    boundingBox?: { north: number; south: number; east: number; west: number };
    layer?: string;
    timeRange?: { start: string; end: string };
  };
}

export interface AIResponse {
  message: ChatMessage;
  agents: AgentStatus[];
  sources: DataSource[];
}

export interface StreamChunk {
  type: 'text' | 'agent' | 'source' | 'attachment' | 'done';
  content?: string;
  agent?: AgentStatus;
  source?: DataSource;
  attachment?: unknown;
}

const FALLBACK_AGENTS: AgentStatus[] = AI_AGENTS.map((a) => ({
  id: a.id,
  name: a.name,
  status: 'idle',
}));

export const aiService = {
  async ask(query: AIQuery): Promise<AIResponse> {
    if (!hasBackend && !isDev) {
      return unavailableResponse();
    }
    try {
      const res = await api.post<AIResponse>(`${API_ENDPOINTS.AI}/ask`, query);
      return res;
    } catch {
      return unavailableResponse();
    }
  },

  async stream(
    query: AIQuery,
    onChunk: (chunk: StreamChunk) => void,
    signal?: AbortSignal
  ): Promise<void> {
    if (!hasBackend && !isDev) {
      onChunk({
        type: 'text',
        content:
          'ORCA AI is currently unavailable. Live backend connection required.',
      });
      onChunk({ type: 'done' });
      return;
    }

    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    const url = `${base}${API_ENDPOINTS.AI}/stream`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'text/event-stream',
        },
        body: JSON.stringify(query),
        signal,
      });

      if (!response.body) {
        onChunk({ type: 'text', content: 'Stream unavailable.' });
        onChunk({ type: 'done' });
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const evt of events) {
          const line = evt.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          const payload = line.slice(5).trim();
          if (payload === '[DONE]') {
            onChunk({ type: 'done' });
            return;
          }
          try {
            const parsed = JSON.parse(payload) as StreamChunk;
            onChunk(parsed);
          } catch {
            onChunk({ type: 'text', content: payload });
          }
        }
      }
      onChunk({ type: 'done' });
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        onChunk({ type: 'text', content: 'Connection error.' });
      }
      onChunk({ type: 'done' });
    }
  },

  async getAgentStatuses(): Promise<AgentStatus[]> {
    if (!hasBackend && !isDev) return FALLBACK_AGENTS;
    try {
      const data = await api.get<AgentStatus[]>(`${API_ENDPOINTS.AI}/agents`);
      return data;
    } catch {
      return FALLBACK_AGENTS;
    }
  },

  async explain(messageId: string): Promise<DataSource[]> {
    if (!hasBackend && !isDev) return [];
    try {
      return await api.get<DataSource[]>(
        `${API_ENDPOINTS.AI}/explain/${messageId}`
      );
    } catch {
      return [];
    }
  },
};

function unavailableResponse(): AIResponse {
  return {
    message: {
      id: `msg_${Date.now()}`,
      role: 'assistant',
      content:
        'ORCA AI is running in offline mode. Connect a backend to enable live analysis.',
      timestamp: new Date().toISOString(),
    },
    agents: FALLBACK_AGENTS,
    sources: [],
  };
}