/**
 * Map Service
 *
 * Provides tile URLs, style URLs, and static asset references for the
 * marine map. Third-party map providers often require API keys — those
 * MUST be proxied through the ORCA backend, never exposed client-side.
 *
 * If a backend proxy is not configured, methods return null and the map
 * falls back to the public MapLibre demo style.
 */

import { hasBackend } from './apiClient';
import { MAP_DEFAULTS } from '@/lib/constants';

export interface TileSource {
  id: string;
  url: string;
  attribution: string;
  minzoom: number;
  maxzoom: number;
  type: 'raster' | 'vector';
}

export interface RegionBounds {
  north: number;
  south: number;
  east: number;
  west: number;
  center: [number, number];
  zoom: number;
}

export const mapService = {
  /**
   * Base style URL for the map. Prefers the backend-proxied style,
   * falls back to the public MapLibre demo tiles.
   */
  getBaseStyleUrl(): string {
    return (
      import.meta.env.VITE_MAP_STYLE_URL ??
      'https://demotiles.maplibre.org/style.json'
    );
  },

  /**
   * Default center [lng, lat] and zoom for the map.
   */
  getDefaultView(): { center: [number, number]; zoom: number } {
    const envCenter = import.meta.env.VITE_MAP_DEFAULT_CENTER;
    const envZoom = Number(import.meta.env.VITE_MAP_DEFAULT_ZOOM);

    if (envCenter) {
      const parts = envCenter.split(',').map(Number);
      const lat = parts[0];
      const lng = parts[1];
      if (
        typeof lat === 'number' &&
        typeof lng === 'number' &&
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      ) {
        return {
          center: [lng, lat],
          zoom: Number.isFinite(envZoom) ? envZoom : MAP_DEFAULTS.zoom,
        };
      }
    }

    return {
      center: MAP_DEFAULTS.center,
      zoom: MAP_DEFAULTS.zoom,
    };
  },

  /**
   * Get a raster tile source URL template for an ocean layer.
   * Requires a backend proxy. Returns null when unavailable.
   */
  getLayerTileUrl(layerId: string, timestamp?: string): string | null {
    if (!hasBackend) return null;
    const base = import.meta.env.VITE_API_BASE_URL;
    const t = timestamp ? `?t=${encodeURIComponent(timestamp)}` : '';
    return `${base}/api/map/tiles/${layerId}/{z}/{x}/{y}${t}`;
  },

  /**
   * Get satellite imagery tile URL. Requires a backend proxy.
   */
  getSatelliteTileUrl(timestamp?: string): string | null {
    if (!hasBackend) return null;
    const base = import.meta.env.VITE_API_BASE_URL;
    const t = timestamp ? `?t=${encodeURIComponent(timestamp)}` : '';
    return `${base}/api/map/tiles/satellite/{z}/{x}/{y}${t}`;
  },

  /**
   * Bounds of a named region (small curated list for quick navigation).
   */
  getRegionBounds(regionId: string): RegionBounds | null {
    const REGIONS: Record<
      string,
      { north: number; south: number; east: number; west: number; zoom: number }
    > = {
      'bay-of-bengal': { north: 22, south: 5, east: 95, west: 78, zoom: 5 },
      'arabian-sea': { north: 25, south: 5, east: 78, west: 55, zoom: 5 },
      'indian-ocean': { north: 25, south: -40, east: 100, west: 20, zoom: 4 },
      paradip: { north: 21.5, south: 19.5, east: 87.5, west: 85.5, zoom: 8 },
      kochi: { north: 10.5, south: 8.5, east: 77, west: 75, zoom: 8 },
      chennai: { north: 13.5, south: 12.5, east: 81, west: 79.5, zoom: 8 },
    };
    const r = REGIONS[regionId];
    if (!r) return null;
    return {
      ...r,
      center: [(r.east + r.west) / 2, (r.north + r.south) / 2] as [number, number],
    };
  },

  /**
   * Public attribution string to display on the map.
   */
  getAttribution(): string {
    return '© ORCA · Data attributed to original providers';
  },
};