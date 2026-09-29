/**
 * AIS Service
 *
 * Abstracts vessel-tracking data from any AIS provider.
 * All methods are documented as to whether they require a live backend.
 * When live data is unavailable, methods return empty results and mark them
 * with an explicit "unavailable" flag — the UI must surface this honestly.
 */

import { api, isDev, hasBackend } from './apiClient';
import { AISVesselListSchema, AISVesselSchema } from './schemas';
import type {
  AISVessel,
  BoundingBox,
  Coordinates,
  PaginatedResponse,
} from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface AISQueryOptions {
  bounds?: BoundingBox;
  vesselType?: string;
  mmsi?: string;
  limit?: number;
  since?: string;
}

export interface AISResult<T> {
  data: T;
  /** True when the underlying source could not be reached. */
  unavailable: boolean;
  /** Which source produced this data. */
  source: string;
  /** ISO timestamp when the data was observed (not when it was fetched). */
  observedAt: string | null;
}

export const aisService = {
  async getVesselsInBounds(
    bounds: BoundingBox,
    options: Omit<AISQueryOptions, 'bounds'> = {}
  ): Promise<AISResult<AISVessel[]>> {
    if (!hasBackend && !isDev) {
      return unavailable<AISVessel[]>([], 'ais');
    }
    try {
      const data = await api.get<AISVessel[]>(API_ENDPOINTS.AIS + '/vessels', {
        params: {
          north: bounds.north,
          south: bounds.south,
          east: bounds.east,
          west: bounds.west,
          type: options.vesselType,
          limit: options.limit ?? 500,
          since: options.since,
        },
        schema: AISVesselListSchema,
      });
      return {
        data,
        unavailable: false,
        source: 'ais',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable<AISVessel[]>([], 'ais');
    }
  },

  async getVesselByMMSI(mmsi: string): Promise<AISResult<AISVessel | null>> {
    if (!hasBackend && !isDev) {
      return unavailable<AISVessel | null>(null, 'ais');
    }
    try {
      const data = await api.get<AISVessel>(
        `${API_ENDPOINTS.AIS}/vessels/${mmsi}`,
        { schema: AISVesselSchema }
      );
      return {
        data,
        unavailable: false,
        source: 'ais',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable<AISVessel | null>(null, 'ais');
    }
  },

  async getVesselTrack(
    mmsi: string,
    since?: string
  ): Promise<AISResult<Coordinates[]>> {
    if (!hasBackend && !isDev) {
      return unavailable<Coordinates[]>([], 'ais');
    }
    try {
      const data = await api.get<Coordinates[]>(
        `${API_ENDPOINTS.AIS}/vessels/${mmsi}/track`,
        { params: { since } }
      );
      return {
        data,
        unavailable: false,
        source: 'ais',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable<Coordinates[]>([], 'ais');
    }
  },

  async searchVessels(
    query: string,
    limit = 20
  ): Promise<AISResult<PaginatedResponse<AISVessel>>> {
    const emptyResult: PaginatedResponse<AISVessel> = {
      items: [],
      total: 0,
      page: 1,
      pageSize: limit,
      hasMore: false,
    };
    if (!hasBackend && !isDev) {
      return unavailable(emptyResult, 'ais');
    }
    try {
      const data = await api.get<PaginatedResponse<AISVessel>>(
        `${API_ENDPOINTS.AIS}/search`,
        { params: { q: query, limit } }
      );
      return {
        data,
        unavailable: false,
        source: 'ais',
        observedAt: new Date().toISOString(),
      };
    } catch {
      return unavailable(emptyResult, 'ais');
    }
  },
};

function unavailable<T>(data: T, source: string): AISResult<T> {
  return { data, unavailable: true, source, observedAt: null };
}