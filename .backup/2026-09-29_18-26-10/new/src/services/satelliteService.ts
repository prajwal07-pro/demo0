/**
 * Satellite Service
 *
 * Earth observation imagery and derived products. All methods require a
 * backend proxy since most providers require authenticated, quota-limited
 * access. Never expose private satellite API keys client-side.
 */

import { api, isDev, hasBackend } from './apiClient';
import type { BoundingBox, Coordinates } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface SatelliteResult<T> {
  data: T | null;
  unavailable: boolean;
  source: string;
  observedAt: string | null;
  reason?: string;
}

export interface SatellitePass {
  id: string;
  satellite: string;
  sensor: string;
  startTime: string;
  endTime: string;
  footprint: BoundingBox;
  resolutionMeters: number;
  cloudCover?: number;
}

export interface SatelliteImage {
  id: string;
  passId: string;
  product: 'truecolor' | 'sst' | 'chlorophyll' | 'sar' | 'nightlights';
  capturedAt: string;
  bounds: BoundingBox;
  url: string;
  attribution: string;
}

export const satelliteService = {
  async getPasses(
    bounds: BoundingBox,
    hoursAhead = 24
  ): Promise<SatelliteResult<SatellitePass[]>> {
    if (!hasBackend && !isDev) return unavailable('satellite');
    try {
      const data = await api.get<SatellitePass[]>(
        `${API_ENDPOINTS.SATELLITE}/passes`,
        {
          params: {
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west,
            hours: hoursAhead,
          },
        }
      );
      return {
        data,
        unavailable: false,
        source: 'satellite',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable('satellite');
    }
  },

  async getLatestImagery(
    bounds: BoundingBox,
    products: SatelliteImage['product'][] = ['truecolor']
  ): Promise<SatelliteResult<SatelliteImage[]>> {
    if (!hasBackend && !isDev) return unavailable('satellite');
    try {
      const data = await api.get<SatelliteImage[]>(
        `${API_ENDPOINTS.SATELLITE}/imagery`,
        {
          params: {
            north: bounds.north,
            south: bounds.south,
            east: bounds.east,
            west: bounds.west,
            products: products.join(','),
          },
        }
      );
      return {
        data,
        unavailable: false,
        source: 'satellite',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable('satellite');
    }
  },

  getTileUrl(
    product: SatelliteImage['product'],
    timestamp?: string
  ): string | null {
    if (!hasBackend) return null;
    const base = import.meta.env.VITE_API_BASE_URL;
    const t = timestamp ? `?t=${encodeURIComponent(timestamp)}` : '';
    return `${base}${API_ENDPOINTS.SATELLITE}/tiles/${product}/{z}/{x}/{y}${t}`;
  },

  async getPointObservation(
    location: Coordinates
  ): Promise<
    SatelliteResult<{ timestamp: string; cloudCover: number; usable: boolean }>
  > {
    if (!hasBackend && !isDev) return unavailable('satellite');
    try {
      const data = await api.get<{
        timestamp: string;
        cloudCover: number;
        usable: boolean;
      }>(`${API_ENDPOINTS.SATELLITE}/point`, {
        params: { lat: location.lat, lng: location.lng },
      });
      return {
        data,
        unavailable: false,
        source: 'satellite',
        observedAt: data.timestamp,
      };
    } catch {
      return unavailable('satellite');
    }
  },
};

function unavailable<T>(source: string): SatelliteResult<T> {
  return {
    data: null,
    unavailable: true,
    source,
    observedAt: null,
    reason: 'Live satellite source unreachable',
  };
}