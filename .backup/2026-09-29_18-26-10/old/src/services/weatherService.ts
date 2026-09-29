/**
 * Weather Service
 *
 * Marine weather forecasts (wind, waves, pressure, storms) and route
 * optimization inputs. Uses the same unavailable-flag pattern as the
 * ocean service to guarantee no fabricated values reach the UI.
 */

import { api, isDev, hasBackend } from './apiClient';
import { WeatherConditionsSchema } from './schemas';
import type { Coordinates, WeatherConditions, BoundingBox } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface WeatherResult<T> {
  data: T | null;
  unavailable: boolean;
  source: string;
  observedAt: string | null;
  reason?: string;
}

export interface ForecastQuery {
  location: Coordinates;
  /** Hours ahead (default 72) */
  hours?: number;
  /** Model resolution in km */
  resolution?: number;
}

export interface MarineForecast {
  location: Coordinates;
  generatedAt: string;
  hours: number;
  timeline: Array<{
    timestamp: string;
    windSpeed: number;
    windDirection: number;
    waveHeight: number;
    waveDirection: number;
    pressure: number;
    temperature: number;
  }>;
}

export interface StormSystem {
  id: string;
  name: string;
  category: string;
  center: Coordinates;
  radius: number;
  timestamp: string;
}

export const weatherService = {
  /**
   * Current weather at a single point.
   */
  async getCurrent(location: Coordinates): Promise<WeatherResult<WeatherConditions>> {
    if (!hasBackend && !isDev) return unavailable<WeatherConditions>('weather');
    try {
      const data = await api.get<WeatherConditions>(
        `${API_ENDPOINTS.WEATHER}/current`,
        {
          params: { lat: location.lat, lng: location.lng },
          schema: WeatherConditionsSchema,
        }
      );
      return {
        data,
        unavailable: false,
        source: 'weather',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable<WeatherConditions>('weather');
    }
  },

  /**
   * Multi-hour marine forecast.
   */
  async getForecast(query: ForecastQuery): Promise<WeatherResult<MarineForecast>> {
    if (!hasBackend && !isDev) return unavailable<MarineForecast>('weather');
    try {
      const data = await api.get<MarineForecast>(
        `${API_ENDPOINTS.WEATHER}/forecast`,
        {
          params: {
            lat: query.location.lat,
            lng: query.location.lng,
            hours: query.hours ?? 72,
            res: query.resolution,
          },
        }
      );
      return {
        data,
        unavailable: false,
        source: 'weather',
        observedAt: data.generatedAt,
      };
    } catch {
      return unavailable<MarineForecast>('weather');
    }
  },

  /**
   * Active storm systems within a bounding box.
   */
  async getStormSystems(
    bounds: BoundingBox
  ): Promise<WeatherResult<StormSystem[]>> {
    if (!hasBackend && !isDev) return unavailable<StormSystem[]>('weather');
    try {
      const data = await api.get<StormSystem[]>(
        `${API_ENDPOINTS.WEATHER}/storms`,
        {
          params: {
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west,
          },
        }
      );
      return {
        data,
        unavailable: false,
        source: 'weather',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable<StormSystem[]>('weather');
    }
  },
};

function unavailable<T>(source: string): WeatherResult<T> {
  return {
    data: null,
    unavailable: true,
    source,
    observedAt: null,
    reason: 'Live weather source unreachable',
  };
}