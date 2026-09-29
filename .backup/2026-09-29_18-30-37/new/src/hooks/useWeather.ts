import { useQuery } from '@tanstack/react-query';
import { weatherService } from '@/services/weatherService';
import { queryKeys } from '@/lib/queryKeys';
import type { BoundingBox, Coordinates } from '@/types';

/**
 * Fetch current weather at a single point.
 */
export function useCurrentWeather(location: Coordinates) {
  return useQuery({
    queryKey: queryKeys.weather.current(location),
    queryFn: () => weatherService.getCurrent(location),
    staleTime: 60_000,
    refetchInterval: 120_000,
  });
}

/**
 * Fetch a multi-hour marine forecast.
 */
export function useMarineForecast(location: Coordinates, hours = 72) {
  return useQuery({
    queryKey: queryKeys.weather.forecast(location, hours),
    queryFn: () => weatherService.getForecast({ location, hours }),
    staleTime: 5 * 60_000,
  });
}

/**
 * Fetch active storm systems within a bounding box.
 */
export function useStormSystems(bounds: BoundingBox) {
  return useQuery({
    queryKey: queryKeys.weather.storms(bounds),
    queryFn: () => weatherService.getStormSystems(bounds),
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
  });
}