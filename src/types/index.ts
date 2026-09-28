/**
 * ORCA Core Domain Types
 * All operational data types used across the platform.
 */

import type {
  OceanLayerId,
  VesselTypeId,
  AgentId,
  SimulationScenarioId,
  QualityLevel,
} from '@/lib/constants';

// ---------- Geographic ----------
export interface Coordinates {
  lat: number;
  lng: number;
}

export interface BoundingBox {
  north: number;
  south: number;
  east: number;
  west: number;
}

// ---------- AIS Vessel ----------
export interface AISVessel {
  mmsi: string;
  imo?: string;
  name: string;
  callsign?: string;
  type: VesselTypeId;
  flag?: string;
  length?: number;
  width?: number;
  draught?: number;
  position: Coordinates;
  speed: number; // knots
  heading: number; // degrees
  course: number; // degrees
  destination?: string;
  eta?: string; // ISO date
  status: string;
  lastUpdate: string; // ISO date
  riskScore?: number; // 0-100
  track?: Coordinates[];
}

// ---------- Ocean Observations ----------
export interface OceanObservation {
  id: string;
  timestamp: string;
  location: Coordinates;
  depth?: number;
  sst?: number; // °C
  chlorophyll?: number; // mg/m³
  waveHeight?: number; // m
  wavePeriod?: number; // s
  windSpeed?: number; // m/s
  windDirection?: number; // degrees
  currentSpeed?: number; // m/s
  currentDirection?: number; // degrees
  salinity?: number; // PSU
  dissolvedOxygen?: number; // mg/L
  /** Dev-only flag indicating a mock record */
  isMock?: boolean;
}

export interface SSTData {
  timestamp: string;
  bounds: BoundingBox;
  resolution: number; // degrees
  values: number[][];
  min: number;
  max: number;
  mean: number;
}

export interface ChlorophyllData {
  timestamp: string;
  bounds: BoundingBox;
  resolution: number;
  values: number[][];
  min: number;
  max: number;
  mean: number;
}

export interface WaveData {
  timestamp: string;
  bounds: BoundingBox;
  height: number[][];
  period: number[][];
  direction: number[][];
}

export interface WindData {
  timestamp: string;
  bounds: BoundingBox;
  speed: number[][];
  direction: number[][];
}

export interface OceanCurrent {
  timestamp: string;
  bounds: BoundingBox;
  u: number[][]; // eastward velocity
  v: number[][]; // northward velocity
  speed: number[][];
  direction: number[][];
}

// ---------- Fishing Zones ----------
export interface FishingZone {
  id: string;
  name: string;
  timestamp: string;
  bounds: BoundingBox;
  center: Coordinates;
  probability: number; // 0-1
  confidence: number; // 0-1
  sst: number;
  chlorophyll: number;
  currentSpeed: number;
  currentDirection: number;
  depth: number;
  validUntil: string;
  sources: string[];
}

// ---------- Marine Alerts ----------
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'emergency';

export interface MarineAlert {
  id: string;
  type: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  location: Coordinates;
  radius?: number; // km
  timestamp: string;
  expiresAt?: string;
  source: string;
  vesselMmsi?: string;
  acknowledged: boolean;
}

// ---------- Simulation ----------
export interface SimulationScenario {
  id: SimulationScenarioId | string;
  name: string;
  description: string;
  parameters: SimulationParameters;
  status: 'idle' | 'running' | 'completed' | 'failed';
  progress?: number; // 0-100
  result?: SimulationResult;
  createdAt: string;
  completedAt?: string;
}

export interface SimulationParameters {
  location: Coordinates;
  boundingBox?: BoundingBox;
  startTime: string;
  endTime: string;
  timeStep: number; // hours
  weather?: WeatherConditions;
  vessel?: AISVessel;
  speed?: number;
  heading?: number;
  [key: string]: unknown;
}

export interface SimulationResult {
  id: string;
  scenarioId: string;
  timestamp: string;
  outputs: SimulationOutput[];
  summary: string;
  confidence: number;
}

export interface SimulationOutput {
  type: 'map' | 'chart' | 'table' | 'text';
  title: string;
  data: unknown;
  timestamp: string;
}

// ---------- Weather ----------
export interface WeatherConditions {
  timestamp: string;
  location: Coordinates;
  temperature: number; // °C
  humidity: number; // %
  pressure: number; // hPa
  windSpeed: number; // m/s
  windDirection: number; // degrees
  waveHeight: number; // m
  visibility: number; // km
  precipitation: number; // mm
  cloudCover: number; // %
  condition: string;
}

// ---------- AI Agent ----------
export interface AgentStatus {
  id: AgentId;
  name: string;
  status: 'idle' | 'processing' | 'error' | 'offline';
  lastRun?: string;
  confidence?: number;
  processingTime?: number; // ms
  inputs?: string[];
  outputs?: string[];
  sources?: DataSource[];
  error?: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: 'satellite' | 'ais' | 'buoy' | 'model' | 'api' | 'user';
  url?: string;
  timestamp: string;
  reliability: number; // 0-1
}

// ---------- Chat / AI ----------
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: ChatAttachment[];
  sources?: DataSource[];
  agents?: AgentId[];
  confidence?: number;
  reasoning?: string[]; // Auditable summary, not chain-of-thought
}

export interface ChatAttachment {
  id: string;
  type: 'map' | 'chart' | 'table' | 'image' | 'video';
  title: string;
  data: unknown;
  timestamp: string;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// ---------- Map ----------
export interface MapLayer {
  id: OceanLayerId | string;
  name: string;
  type: 'raster' | 'vector' | 'heatmap' | 'point' | 'line';
  visible: boolean;
  opacity: number;
  source?: string;
  timestamp?: string;
  bounds?: BoundingBox;
}

export interface MapViewState {
  center: Coordinates;
  zoom: number;
  pitch: number;
  bearing: number;
  bounds?: BoundingBox;
}

// ---------- User / Auth ----------
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'user' | 'researcher' | 'admin';
  organization?: string;
  level: number;
  xp: number;
  achievements: string[];
  createdAt: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'dark' | 'light' | 'system';
  quality: QualityLevel;
  language: string;
  voice: string;
  notifications: boolean;
  reducedMotion: boolean;
  dataSources: string[];
  aiPreferences: {
    temperature: number;
    maxTokens: number;
    showSources: boolean;
    showConfidence: boolean;
  };
}

// ---------- API Responses ----------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  source?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ---------- Utility ----------
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type AsyncStatus = 'idle' | 'loading' | 'success' | 'error';