import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { oceanService, type OceanResult } from '@/services/oceanService';
import { queryKeys } from '@/lib/queryKeys';
import type { BoundingBox, Coordinates, OceanObservation } from '@/types';

export interface UseOceanLayerParams {
  bounds: BoundingBox;
  timestamp?: string;
  resolution?: number;
  refetchInterval?: number;
  enabled?: boolean;
}

/**
 * Fetch sea surface temperature for a bounding box.
 */
export function useSST(params: UseOceanLayerParams) {
  const { bounds, timestamp, resolution, refetchInterval = 60_000, enabled = true } = params;
  return useQuery({
    queryKey: queryKeys.ocean.sst(bounds, timestamp),
    queryFn: () => oceanService.getSST({ bounds, timestamp, resolution }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: 45_000,
    enabled,
  });
}

/**
 * Fetch chlorophyll-a for a bounding box.
 */
export function useChlorophyll(params: UseOceanLayerParams) {
  const { bounds, timestamp, resolution, refetchInterval = 60_000, enabled = true } = params;
  return useQuery({
    queryKey: queryKeys.ocean.chlorophyll(bounds, timestamp),
    queryFn: () => oceanService.getChlorophyll({ bounds, timestamp, resolution }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: 45_000,
    enabled,
  });
}

/**
 * Fetch wave data for a bounding box.
 */
export function useWaves(params: UseOceanLayerParams) {
  const { bounds, timestamp, resolution, refetchInterval = 60_000, enabled = true } = params;
  return useQuery({
    queryKey: queryKeys.ocean.waves(bounds, timestamp),
    queryFn: () => oceanService.getWaves({ bounds, timestamp, resolution }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: 45_000,
    enabled,
  });
}

/**
 * Fetch wind data for a bounding box.
 */
export function useWindField(params: UseOceanLayerParams) {
  const { bounds, timestamp, resolution, refetchInterval = 60_000, enabled = true } = params;
  return useQuery({
    queryKey: queryKeys.ocean.wind(bounds, timestamp),
    queryFn: () => oceanService.getWind({ bounds, timestamp, resolution }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: 45_000,
    enabled,
  });
}

/**
 * Fetch ocean currents for a bounding box.
 */
export function useCurrents(params: UseOceanLayerParams) {
  const { bounds, timestamp, resolution, refetchInterval = 60_000, enabled = true } = params;
  return useQuery({
    queryKey: queryKeys.ocean.currents(bounds, timestamp),
    queryFn: () => oceanService.getCurrents({ bounds, timestamp, resolution }),
    refetchInterval: refetchInterval > 0 ? refetchInterval : false,
    staleTime: 45_000,
    enabled,
  });
}

/**
 * Fetch a single-point ocean observation (SST, chlorophyll, waves, wind,
 * current, salinity, dissolved oxygen).
 */
export function useOceanObservation(
  location: Coordinates,
  timestamp?: string
): UseQueryResult<OceanResult<OceanObservation>> {
  return useQuery({
    queryKey: queryKeys.ocean.observation(location, timestamp),
    queryFn: () => oceanService.getObservation(location, timestamp),
    staleTime: 30_000,
    refetchInterval: 60_000,
  });
}