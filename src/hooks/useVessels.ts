import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { aisService, type AISResult } from '@/services/aisService';
import { queryKeys } from '@/lib/queryKeys';
import type {
  BoundingBox,
  Coordinates,
  AISVessel,
  PaginatedResponse,
} from '@/types';

export interface UseVesselsParams {
  bounds: BoundingBox;
  vesselType?: string;
  limit?: number;
  since?: string;
  /** Poll interval in ms. Set to 0 to disable polling. */
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * Fetch AIS vessels within a bounding box.
 *
 * The underlying `aisService` already returns an explicit `unavailable`
 * flag; consumers must check `data.unavailable` before rendering live
 * values. Never assume vessel positions are live.
 */
export function useVessels(
  params: UseVesselsParams
): UseQueryResult<AISResult<AISVessel[]>> {
  const {
    bounds,
    vesselType,
    limit = 500,
    since,
    refetchInterval = 30_000,
    enabled = true,
  } = params;

  return useQuery({
    queryKey: queryKeys.vessels.bounds(bounds, vesselType),
    queryFn: () =>
      aisService.getVesselsInBounds(bounds, {
        vesselType,
        limit,
        since,
      }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: Math.min(refetchInterval, 15_000),
    enabled,
  });
}

/**
 * Fetch a single vessel by MMSI.
 */
export function useVessel(mmsi: string | null) {
  return useQuery({
    queryKey: queryKeys.vessels.detail(mmsi ?? 'unknown'),
    queryFn: () => aisService.getVesselByMMSI(mmsi!),
    enabled: Boolean(mmsi),
    staleTime: 15_000,
  });
}

/**
 * Fetch a vessel's historical track.
 */
export function useVesselTrack(mmsi: string | null, since?: string) {
  return useQuery({
    queryKey: queryKeys.vessels.track(mmsi ?? 'unknown', since),
    queryFn: () => aisService.getVesselTrack(mmsi!, since),
    enabled: Boolean(mmsi),
    staleTime: 60_000,
  });
}

/**
 * Search vessels by name, MMSI, or IMO.
 */
export function useVesselSearch(q: string, limit = 20) {
  return useQuery({
    queryKey: queryKeys.vessels.search(q, limit),
    queryFn: () => aisService.searchVessels(q, limit),
    enabled: q.trim().length >= 2,
    staleTime: 30_000,
  });
}

export type { AISResult, AISVessel, PaginatedResponse, Coordinates };