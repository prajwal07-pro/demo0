/**
 * ORCA formatters.
 *
 * Thin formatting helpers for marine-domain values. The base utilities in
 * `utils.ts` handle generic number/date/coordinate formatting; this file
 * handles domain-specific rendering such as compass headings, knots,
 * nautical distances, and relative timestamps used across the platform.
 */

const COMPASS_POINTS = [
  'N',
  'NNE',
  'NE',
  'ENE',
  'E',
  'ESE',
  'SE',
  'SSE',
  'S',
  'SSW',
  'SW',
  'WSW',
  'W',
  'WNW',
  'NW',
  'NNW',
] as const;

/**
 * Convert a heading in degrees to a compass point (N, NNE, NE, ...).
 */
export function headingToCompass(degrees: number): string {
  const normalized = ((degrees % 360) + 360) % 360;
  const index = Math.round(normalized / 22.5) % 16;
  return COMPASS_POINTS[index] ?? 'N';
}

/**
 * Format a speed in knots with one decimal place.
 */
export function formatKnots(knots: number): string {
  return `${knots.toFixed(1)} kn`;
}

/**
 * Format a nautical distance in nautical miles.
 */
export function formatNauticalMiles(nm: number): string {
  if (nm < 1) return `${(nm * 1000).toFixed(0)} m`;
  return `${nm.toFixed(1)} nm`;
}

/**
 * Format a depth in meters, using km above 1000 m.
 */
export function formatDepth(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

/**
 * Format a marine coordinate pair in the standard degree-direction form.
 */
export function formatMarineCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}° ${latDir}, ${Math.abs(lng).toFixed(4)}° ${lngDir}`;
}

/**
 * Format a temperature in °C.
 */
export function formatTemperature(celsius: number): string {
  return `${celsius.toFixed(1)} °C`;
}

/**
 * Relative time from an ISO string (e.g. "3m ago", "2h ago", "now").
 */
export function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 5) return 'now';
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

/**
 * Compact relative time (used in HUDs where space is tight).
 */
export function formatRelativeTimeCompact(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'NOW';
  if (min < 60) return `${min}M`;
  const hrs = Math.floor(min / 60);
  if (hrs < 24) return `${hrs}H`;
  return `${Math.floor(hrs / 24)}D`;
}

/**
 * Percent formatter for a 0-1 ratio.
 */
export function formatPercent(value: number, decimals = 0): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Confidence score formatter for AI answers (0-1 → "72%").
 */
export function formatConfidence(value: number): string {
  return `${Math.round(value * 100)}%`;
}

/**
 * Data-availability label used across the platform.
 * Returns a consistent string so all pages display the same wording.
 */
export function availabilityLabel(status: 'live' | 'stale' | 'unavailable' | 'loading'): string {
  switch (status) {
    case 'live':
      return 'LIVE';
    case 'stale':
      return 'LAST VALID OBSERVATION';
    case 'unavailable':
      return 'DATA UNAVAILABLE';
    case 'loading':
      return 'WAITING FOR LIVE DATA';
  }
}

/**
 * Format an ISO timestamp as a compact UTC stamp for HUDs.
 */
export function formatUtcStamp(iso: string): string {
  const d = new Date(iso);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  const h = String(d.getUTCHours()).padStart(2, '0');
  const min = String(d.getUTCMinutes()).padStart(2, '0');
  return `${y}-${m}-${day} ${h}:${min}Z`;
}