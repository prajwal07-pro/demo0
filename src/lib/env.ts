import { z } from 'zod';

/**
 * ORCA environment schema.
 *
 * All Vite env vars are validated once at boot. Invalid values fail loudly
 * in development so misconfiguration never silently degrades production.
 *
 * Only variables prefixed with `VITE_` are present client-side. Never put
 * private credentials here — those belong behind the backend proxy.
 */
const EnvSchema = z.object({
  VITE_API_BASE_URL: z.string().optional(),

  // Feature flags (all optional strings — parsed into booleans below)
  VITE_ENABLE_3D: z.string().optional(),
  VITE_ENABLE_MAP: z.string().optional(),
  VITE_ENABLE_AI: z.string().optional(),
  VITE_ENABLE_SIMULATIONS: z.string().optional(),
  VITE_ENABLE_GAMES: z.string().optional(),

  // Map
  VITE_MAP_STYLE_URL: z.string().optional(),
  VITE_MAP_DEFAULT_CENTER: z.string().optional(),
  VITE_MAP_DEFAULT_ZOOM: z.string().optional(),

  // Optional client-side keys (only if provider policy permits)
  VITE_MAPBOX_TOKEN: z.string().optional(),
  VITE_MAPTILER_KEY: z.string().optional(),

  // Standard Vite vars
  MODE: z.string().default('development'),
  DEV: z.boolean().default(true),
  PROD: z.boolean().default(false),
  SSR: z.boolean().default(false),
  BASE_URL: z.string().default('/'),
});

export type ParsedEnv = z.infer<typeof EnvSchema>;

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value === 'true' || value === '1' || value === 'yes';
}

function loadEnv(): ParsedEnv {
  const raw = import.meta.env as unknown as Record<string, unknown>;
  const parsed = EnvSchema.safeParse(raw);

  if (!parsed.success) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ORCA env] Invalid environment configuration', parsed.error.issues);
    }
    return EnvSchema.parse({});
  }

  return parsed.data;
}

export const env = loadEnv();

/**
 * Typed feature flags. These default to enabled and can be turned off in
 * a `.env.local` during development or by the build pipeline.
 */
export const featureFlags = {
  enable3D: parseBoolean(env.VITE_ENABLE_3D, true),
  enableMap: parseBoolean(env.VITE_ENABLE_MAP, true),
  enableAI: parseBoolean(env.VITE_ENABLE_AI, true),
  enableSimulations: parseBoolean(env.VITE_ENABLE_SIMULATIONS, true),
  enableGames: parseBoolean(env.VITE_ENABLE_GAMES, true),
} as const;

export type FeatureFlagKey = keyof typeof featureFlags;

/**
 * True when the ORCA backend proxy is configured. When false, services
 * fall back to their "unavailable" contract rather than attempting to hit
 * a non-existent API.
 */
export const hasBackend = Boolean(env.VITE_API_BASE_URL);