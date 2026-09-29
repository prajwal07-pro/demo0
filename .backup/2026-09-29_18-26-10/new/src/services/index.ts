/**
 * ORCA Services — public surface.
 *
 * Importing from this barrel keeps service wiring consistent across pages
 * and hooks. Do not import from individual service files directly outside
 * of this barrel unless you need a service-specific type.
 */

export {
  api,
  apiRequest,
  ApiError,
  NetworkError,
  isDev,
  hasBackend,
} from './apiClient';

export { aisService } from './aisService';
export { oceanService } from './oceanService';
export { aiService } from './aiService';
export { weatherService } from './weatherService';
export { satelliteService } from './satelliteService';
export { simulationService } from './simulationService';
export { authService } from './authService';
export { mapService } from './mapService';

export * as schemas from './schemas';
export * as mockData from './mockData';

export type { AIQuery, AIResponse, StreamChunk } from './aiService';
export type { OceanQuery, OceanResult } from './oceanService';
export type { AISQueryOptions, AISResult } from './aisService';
export type {
  WeatherResult,
  ForecastQuery,
  MarineForecast,
  StormSystem,
} from './weatherService';
export type {
  SatelliteResult,
  SatellitePass,
  SatelliteImage,
} from './satelliteService';
export type { SimulationResultEnvelope } from './simulationService';
export type {
  AuthResult,
  SignInPayload,
  SignUpPayload,
  SessionPayload,
} from './authService';
export type { TileSource, RegionBounds } from './mapService';