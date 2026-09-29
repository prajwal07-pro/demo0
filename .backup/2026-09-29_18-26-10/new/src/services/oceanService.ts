/**
 * Ocean Service
 *
 * Provides sea surface temperature, chlorophyll, wave, wind, current, and
 * bathymetry data from oceanographic providers. All methods return an
 * explicit `unavailable` flag when the source cannot be reached. The UI
 * MUST display a clear unavailable state instead of inventing values.
 */

import { api, isDev, hasBackend } from './apiClient';
import {
  ChlorophyllDataSchema,
  OceanCurrentSchema,
  OceanObservationSchema,
  SSTDataSchema,
  WaveDataSchema,
  WindDataSchema,
} from './schemas';
import type {
  BoundingBox,
  ChlorophyllData,
  Coordinates,
  OceanCurrent,
  OceanObservation,
  SSTData,
  WaveData,
  WindData,
} from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface OceanResult<T> {
  data: T | null;
  unavailable: boolean;
  source: string;
  observedAt: string | null;
  reason?: string;
}

export interface OceanQuery {
  bounds: BoundingBox;
  timestamp?: string;
  resolution?: number;
}

export const oceanService = {
  async getSST(query: OceanQuery): Promise<OceanResult<SSTData>> {
    return fetchLayer<SSTData>(
      `${API_ENDPOINTS.OCEAN}/sst`,
      query,
      SSTDataSchema,
      'sst'
    );
  },

  async getChlorophyll(query: OceanQuery): Promise<OceanResult<ChlorophyllData>> {
    return fetchLayer<ChlorophyllData>(
      `${API_ENDPOINTS.OCEAN}/chlorophyll`,
      query,
      ChlorophyllDataSchema,
      'chlorophyll'
    );
  },

  async getWaves(query: OceanQuery): Promise<OceanResult<WaveData>> {
    return fetchLayer<WaveData>(
      `${API_ENDPOINTS.OCEAN}/waves`,
      query,
      WaveDataSchema,
      'wave'
    );
  },

  async getWind(query: OceanQuery): Promise<OceanResult<WindData>> {
    return fetchLayer<WindData>(
      `${API_ENDPOINTS.OCEAN}/wind`,
      query,
      WindDataSchema,
      'wind'
    );
  },

  async getCurrents(query: OceanQuery): Promise<OceanResult<OceanCurrent>> {
    return fetchLayer<OceanCurrent>(
      `${API_ENDPOINTS.OCEAN}/currents`,
      query,
      OceanCurrentSchema,
      'currents'
    );
  },

  async getObservation(
    location: Coordinates,
    timestamp?: string
  ): Promise<OceanResult<OceanObservation>> {
    if (!hasBackend && !isDev) {
      return oceanUnavailable<OceanObservation>('observation');
    }
    try {
      const data = await api.get<OceanObservation>(
        `${API_ENDPOINTS.OCEAN}/observation`,
        {
          params: { lat: location.lat, lng: location.lng, t: timestamp },
          schema: OceanObservationSchema,
        }
      );
      return {
        data,
        unavailable: false,
        source: 'ocean',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return oceanUnavailable<OceanObservation>('observation');
    }
  },
};

async function fetchLayer<T>(
  path: string,
  query: OceanQuery,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: unknown } },
  source: string
): Promise<OceanResult<T>> {
  if (!hasBackend && !isDev) {
    return oceanUnavailable<T>(source);
  }
  try {
    const data = (await api.get<unknown>(path, {
      params: {
        north: query.bounds.north,
        south: query.bounds.south,
        east: query.bounds.east,
        west: query.bounds.west,
        t: query.timestamp,
        res: query.resolution,
      },
      schema: schema as never,
    })) as T;
    return {
      data,
      unavailable: false,
      source,
      observedAt: query.timestamp ?? new Date().toISOString(),
    };
  } catch {
    return oceanUnavailable<T>(source);
  }
}

function oceanUnavailable<T>(source: string): OceanResult<T> {
  return {
    data: null,
    unavailable: true,
    source,
    observedAt: null,
    reason: 'Live ocean data source unreachable',
  };
}