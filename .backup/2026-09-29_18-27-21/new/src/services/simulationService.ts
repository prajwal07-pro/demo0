/**
 * Simulation Service
 *
 * Manages marine simulation scenarios (storm, route, current, fishing,
 * collision, fuel, pollution, search & rescue, weather routing).
 *
 * Simulations are heavy — a real backend runs them asynchronously. This
 * service models that contract: submit → poll status → receive result.
 */

import { api, isDev, hasBackend } from './apiClient';
import { SimulationScenarioSchema } from './schemas';
import type { SimulationResult, SimulationScenario } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface SimulationResultEnvelope<T> {
  data: T | null;
  unavailable: boolean;
  source: string;
  observedAt: string | null;
  reason?: string;
}

export const simulationService = {
  async list(): Promise<SimulationResultEnvelope<SimulationScenario[]>> {
    if (!hasBackend && !isDev) return unavailable('simulation');
    try {
      const data = await api.get<SimulationScenario[]>(
        `${API_ENDPOINTS.SIMULATION}/scenarios`
      );
      return {
        data,
        unavailable: false,
        source: 'simulation',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable('simulation');
    }
  },

  async submit(
    scenarioId: string,
    parameters: Record<string, unknown>
  ): Promise<SimulationResultEnvelope<SimulationScenario>> {
    if (!hasBackend && !isDev) return unavailable('simulation');
    try {
      const data = await api.post<unknown>(
        `${API_ENDPOINTS.SIMULATION}/submit`,
        { scenarioId, parameters }
      );
      const parsed = SimulationScenarioSchema.safeParse(data);
      if (!parsed.success) {
        return {
          data: null,
          unavailable: true,
          source: 'simulation',
          observedAt: null,
          reason: 'Invalid simulation response shape',
        };
      }
      return {
        data: parsed.data as SimulationScenario,
        unavailable: false,
        source: 'simulation',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable('simulation');
    }
  },

  async getStatus(
    id: string
  ): Promise<SimulationResultEnvelope<SimulationScenario>> {
    if (!hasBackend && !isDev) return unavailable('simulation');
    try {
      const data = await api.get<unknown>(
        `${API_ENDPOINTS.SIMULATION}/status/${id}`
      );
      const parsed = SimulationScenarioSchema.safeParse(data);
      if (!parsed.success) return unavailable('simulation');
      return {
        data: parsed.data as SimulationScenario,
        unavailable: false,
        source: 'simulation',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable('simulation');
    }
  },

  async getResult(
    id: string
  ): Promise<SimulationResultEnvelope<SimulationResult>> {
    if (!hasBackend && !isDev) return unavailable('simulation');
    try {
      const data = await api.get<SimulationResult>(
        `${API_ENDPOINTS.SIMULATION}/result/${id}`
      );
      return {
        data,
        unavailable: false,
        source: 'simulation',
        observedAt: data.timestamp,
      };
    } catch {
      return unavailable('simulation');
    }
  },

  async cancel(id: string): Promise<boolean> {
    if (!hasBackend && !isDev) return false;
    try {
      await api.post(`${API_ENDPOINTS.SIMULATION}/cancel/${id}`);
      return true;
    } catch {
      return false;
    }
  },
};

function unavailable<T>(source: string): SimulationResultEnvelope<T> {
  return {
    data: null,
    unavailable: true,
    source,
    observedAt: null,
    reason: 'Simulation engine unreachable',
  };
}