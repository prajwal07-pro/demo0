/**
 * Zod schemas for runtime validation at the API boundary.
 * Never trust external data — always validate on ingress.
 */

import { z } from 'zod';

// ---------- Coordinates ----------
export const CoordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export const BoundingBoxSchema = z.object({
  north: z.number().min(-90).max(90),
  south: z.number().min(-90).max(90),
  east: z.number().min(-180).max(180),
  west: z.number().min(-180).max(180),
});

// ---------- AIS Vessel ----------
export const VesselTypeSchema = z.enum([
  'cargo',
  'tanker',
  'fishing',
  'passenger',
  'research',
  'tug',
  'pleasure',
  'military',
  'unknown',
]);

export const AISVesselSchema = z.object({
  mmsi: z.string().min(1),
  imo: z.string().optional(),
  name: z.string(),
  callsign: z.string().optional(),
  type: VesselTypeSchema,
  flag: z.string().optional(),
  length: z.number().optional(),
  width: z.number().optional(),
  draught: z.number().optional(),
  position: CoordinatesSchema,
  speed: z.number().min(0),
  heading: z.number().min(0).max(360),
  course: z.number().min(0).max(360),
  destination: z.string().optional(),
  eta: z.string().optional(),
  status: z.string(),
  lastUpdate: z.string(),
  riskScore: z.number().min(0).max(100).optional(),
  track: z.array(CoordinatesSchema).optional(),
});

export const AISVesselListSchema = z.array(AISVesselSchema);

// ---------- Ocean Observations ----------
export const OceanObservationSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  location: CoordinatesSchema,
  depth: z.number().optional(),
  sst: z.number().optional(),
  chlorophyll: z.number().min(0).optional(),
  waveHeight: z.number().min(0).optional(),
  wavePeriod: z.number().min(0).optional(),
  windSpeed: z.number().min(0).optional(),
  windDirection: z.number().min(0).max(360).optional(),
  currentSpeed: z.number().min(0).optional(),
  currentDirection: z.number().min(0).max(360).optional(),
  salinity: z.number().optional(),
  dissolvedOxygen: z.number().min(0).optional(),
});

export const SSTDataSchema = z.object({
  timestamp: z.string(),
  bounds: BoundingBoxSchema,
  resolution: z.number().positive(),
  values: z.array(z.array(z.number())),
  min: z.number(),
  max: z.number(),
  mean: z.number(),
});

export const ChlorophyllDataSchema = SSTDataSchema;

export const WaveDataSchema = z.object({
  timestamp: z.string(),
  bounds: BoundingBoxSchema,
  height: z.array(z.array(z.number())),
  period: z.array(z.array(z.number())),
  direction: z.array(z.array(z.number())),
});

export const WindDataSchema = z.object({
  timestamp: z.string(),
  bounds: BoundingBoxSchema,
  speed: z.array(z.array(z.number())),
  direction: z.array(z.array(z.number())),
});

export const OceanCurrentSchema = z.object({
  timestamp: z.string(),
  bounds: BoundingBoxSchema,
  u: z.array(z.array(z.number())),
  v: z.array(z.array(z.number())),
  speed: z.array(z.array(z.number())),
  direction: z.array(z.array(z.number())),
});

// ---------- Fishing Zone ----------
export const FishingZoneSchema = z.object({
  id: z.string(),
  name: z.string(),
  timestamp: z.string(),
  bounds: BoundingBoxSchema,
  center: CoordinatesSchema,
  probability: z.number().min(0).max(1),
  confidence: z.number().min(0).max(1),
  sst: z.number(),
  chlorophyll: z.number(),
  currentSpeed: z.number(),
  currentDirection: z.number(),
  depth: z.number(),
  validUntil: z.string(),
  sources: z.array(z.string()),
});

// ---------- Marine Alert ----------
export const AlertSeveritySchema = z.enum(['info', 'warning', 'critical', 'emergency']);

export const MarineAlertSchema = z.object({
  id: z.string(),
  type: z.string(),
  severity: AlertSeveritySchema,
  title: z.string(),
  description: z.string(),
  location: CoordinatesSchema,
  radius: z.number().optional(),
  timestamp: z.string(),
  expiresAt: z.string().optional(),
  source: z.string(),
  vesselMmsi: z.string().optional(),
  acknowledged: z.boolean(),
});

// ---------- Weather ----------
export const WeatherConditionsSchema = z.object({
  timestamp: z.string(),
  location: CoordinatesSchema,
  temperature: z.number(),
  humidity: z.number().min(0).max(100),
  pressure: z.number(),
  windSpeed: z.number().min(0),
  windDirection: z.number().min(0).max(360),
  waveHeight: z.number().min(0),
  visibility: z.number().min(0),
  precipitation: z.number().min(0),
  cloudCover: z.number().min(0).max(100),
  condition: z.string(),
});

// ---------- Chat ----------
export const ChatMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
  timestamp: z.string(),
  confidence: z.number().min(0).max(1).optional(),
  reasoning: z.array(z.string()).optional(),
  sources: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        type: z.enum(['satellite', 'ais', 'buoy', 'model', 'api', 'user']),
        url: z.string().optional(),
        timestamp: z.string(),
        reliability: z.number().min(0).max(1),
      })
    )
    .optional(),
  agents: z.array(z.string()).optional(),
});

// ---------- Simulation ----------
export const SimulationScenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  parameters: z.record(z.unknown()),
  status: z.enum(['idle', 'running', 'completed', 'failed']),
  progress: z.number().min(0).max(100).optional(),
  createdAt: z.string(),
  completedAt: z.string().optional(),
});

// ---------- Generic ----------
export const PaginatedSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    hasMore: z.boolean(),
  });

// ---------- Type inference helpers ----------
export type InferredAISVessel = z.infer<typeof AISVesselSchema>;
export type InferredMarineAlert = z.infer<typeof MarineAlertSchema>;
export type InferredOceanObservation = z.infer<typeof OceanObservationSchema>;
export type InferredSSTData = z.infer<typeof SSTDataSchema>;
export type InferredChlorophyllData = z.infer<typeof ChlorophyllDataSchema>;
export type InferredWaveData = z.infer<typeof WaveDataSchema>;
export type InferredWindData = z.infer<typeof WindDataSchema>;
export type InferredOceanCurrent = z.infer<typeof OceanCurrentSchema>;
export type InferredFishingZone = z.infer<typeof FishingZoneSchema>;
export type InferredChatMessage = z.infer<typeof ChatMessageSchema>;
export type InferredWeather = z.infer<typeof WeatherConditionsSchema>;