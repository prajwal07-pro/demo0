/**
 * ORCA TanStack Query key registry.
 *
 * Centralizing query keys prevents accidental cache fragmentation and makes
 * invalidation predictable across pages. Every query in the app should
 * reference one of these factories rather than inlining its own key.
 *
 * Pattern:
 *   queryKeys.vessels.bounds(bounds)
 *   → ['vessels', 'bounds', { north, south, east, west }]
 */

export interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface CoordinatesKey {
  lat: number;
  lng: number;
}

export const queryKeys = {
  // ---------- Vessels ----------
  vessels: {
    all: ['vessels'] as const,
    bounds: (bounds: Bounds, type?: string) =>
      ['vessels', 'bounds', bounds, type ?? 'all'] as const,
    detail: (mmsi: string) => ['vessels', 'detail', mmsi] as const,
    track: (mmsi: string, since?: string) =>
      ['vessels', 'track', mmsi, since ?? 'latest'] as const,
    search: (q: string, limit: number) =>
      ['vessels', 'search', q, limit] as const,
  },

  // ---------- Ocean ----------
  ocean: {
    all: ['ocean'] as const,
    sst: (bounds: Bounds, timestamp?: string) =>
      ['ocean', 'sst', bounds, timestamp ?? 'latest'] as const,
    chlorophyll: (bounds: Bounds, timestamp?: string) =>
      ['ocean', 'chlorophyll', bounds, timestamp ?? 'latest'] as const,
    waves: (bounds: Bounds, timestamp?: string) =>
      ['ocean', 'waves', bounds, timestamp ?? 'latest'] as const,
    wind: (bounds: Bounds, timestamp?: string) =>
      ['ocean', 'wind', bounds, timestamp ?? 'latest'] as const,
    currents: (bounds: Bounds, timestamp?: string) =>
      ['ocean', 'currents', bounds, timestamp ?? 'latest'] as const,
    observation: (loc: CoordinatesKey, timestamp?: string) =>
      ['ocean', 'observation', loc, timestamp ?? 'latest'] as const,
  },

  // ---------- Weather ----------
  weather: {
    all: ['weather'] as const,
    current: (loc: CoordinatesKey) => ['weather', 'current', loc] as const,
    forecast: (loc: CoordinatesKey, hours: number) =>
      ['weather', 'forecast', loc, hours] as const,
    storms: (bounds: Bounds) => ['weather', 'storms', bounds] as const,
  },

  // ---------- Satellite ----------
  satellite: {
    all: ['satellite'] as const,
    passes: (bounds: Bounds, hours: number) =>
      ['satellite', 'passes', bounds, hours] as const,
    imagery: (bounds: Bounds, products: string[]) =>
      ['satellite', 'imagery', bounds, products.join(',')] as const,
    point: (loc: CoordinatesKey) => ['satellite', 'point', loc] as const,
  },

  // ---------- Simulation ----------
  simulation: {
    all: ['simulation'] as const,
    list: () => ['simulation', 'list'] as const,
    status: (id: string) => ['simulation', 'status', id] as const,
    result: (id: string) => ['simulation', 'result', id] as const,
  },

  // ---------- AI ----------
  ai: {
    all: ['ai'] as const,
    agents: () => ['ai', 'agents'] as const,
    explain: (messageId: string) => ['ai', 'explain', messageId] as const,
  },

  // ---------- Auth ----------
  auth: {
    all: ['auth'] as const,
    me: () => ['auth', 'me'] as const,
  },

  // ---------- Telemetry (hero strip) ----------
  telemetry: (loc: CoordinatesKey) => ['telemetry', loc] as const,
} as const;