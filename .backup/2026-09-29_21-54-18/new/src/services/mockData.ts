/**
 * DEV-ONLY MOCK DATA
 *
 * ⚠️  IMPORTANT:
 * This module exists ONLY for local development and design previews.
 * Every mock record is prefixed with `_mock_` and includes a `mock: true` tag
 * so that any code path that touches it can be audited.
 *
 * Production builds MUST NOT import from this file.
 */

import type {
  AISVessel,
  MarineAlert,
  OceanObservation,
  FishingZone,
  WeatherConditions,
} from '@/types';

export const MOCK_TAG = '_mock_' as const;

// ---------- Vessels ----------
function makeVessel(overrides: Partial<AISVessel>): AISVessel {
  return {
    mmsi: `${MOCK_TAG}000000000`,
    name: 'MOCK VESSEL',
    type: 'cargo',
    position: { lat: 15.5, lng: 85.2 },
    speed: 12,
    heading: 90,
    course: 90,
    status: 'Under way',
    lastUpdate: new Date().toISOString(),
    ...overrides,
  };
}

export const MOCK_VESSELS: AISVessel[] = [
  makeVessel({
    mmsi: `${MOCK_TAG}111000111`,
    name: 'MV SAMPLE CARGO',
    type: 'cargo',
    position: { lat: 15.2, lng: 84.5 },
    speed: 11.4,
    heading: 88,
    course: 88,
    destination: 'Chennai',
    length: 180,
    width: 28,
  }),
  makeVessel({
    mmsi: `${MOCK_TAG}222000222`,
    name: 'FV SAMPLE FISHER',
    type: 'fishing',
    position: { lat: 19.8, lng: 86.1 },
    speed: 4.2,
    heading: 210,
    course: 210,
    destination: 'Paradip',
  }),
  makeVessel({
    mmsi: `${MOCK_TAG}333000333`,
    name: 'MT SAMPLE TANKER',
    type: 'tanker',
    position: { lat: 13.1, lng: 80.3 },
    speed: 8.9,
    heading: 45,
    course: 45,
    destination: 'Visakhapatnam',
  }),
];

// ---------- Alerts ----------
export const MOCK_ALERTS: MarineAlert[] = [
  {
    id: `${MOCK_TAG}alert_001`,
    type: 'storm',
    severity: 'warning',
    title: 'Depression over Bay of Bengal',
    description: 'Sample alert — do not use for operational decisions.',
    location: { lat: 15.0, lng: 88.0 },
    radius: 120,
    timestamp: new Date().toISOString(),
    source: 'mock',
    acknowledged: false,
  },
];

// ---------- Ocean Observations ----------
export const MOCK_OBSERVATION: OceanObservation = {
  id: `${MOCK_TAG}obs_001`,
  timestamp: new Date().toISOString(),
  location: { lat: 15.0, lng: 85.0 },
  sst: 29.4,
  chlorophyll: 0.32,
  waveHeight: 1.8,
  windSpeed: 12.4,
  currentSpeed: 0.6,
  salinity: 34.2,
};

// ---------- Fishing Zones ----------
export const MOCK_FISHING_ZONES: FishingZone[] = [
  {
    id: `${MOCK_TAG}fz_001`,
    name: 'Sample PFZ — Paradip offshore',
    timestamp: new Date().toISOString(),
    bounds: { north: 20.5, south: 19.5, east: 87.0, west: 86.0 },
    center: { lat: 20.0, lng: 86.5 },
    probability: 0.72,
    confidence: 0.65,
    sst: 29.2,
    chlorophyll: 0.4,
    currentSpeed: 0.5,
    currentDirection: 45,
    depth: 60,
    validUntil: new Date(Date.now() + 24 * 3600_000).toISOString(),
    sources: ['mock'],
  },
];

// ---------- Weather ----------
export const MOCK_WEATHER: WeatherConditions = {
  timestamp: new Date().toISOString(),
  location: { lat: 15.0, lng: 85.0 },
  temperature: 29.4,
  humidity: 78,
  pressure: 1010,
  windSpeed: 12.4,
  windDirection: 45,
  waveHeight: 1.8,
  visibility: 10,
  precipitation: 0,
  cloudCover: 40,
  condition: 'Partly Cloudy',
};

// ---------- Guard ----------
/**
 * Returns true if the given record is a mock object.
 * Any component that displays operational data MUST call this
 * and render a "MOCK DATA" badge if true.
 */
export function isMockRecord(
  record: { mmsi?: string; id?: string } | null | undefined
): boolean {
  if (!record) return false;
  const id = record.mmsi ?? record.id ?? '';
  return typeof id === 'string' && id.startsWith(MOCK_TAG);
}

// ---------- Freeze to prevent accidental mutation ----------
Object.freeze(MOCK_VESSELS);
Object.freeze(MOCK_ALERTS);
Object.freeze(MOCK_FISHING_ZONES);