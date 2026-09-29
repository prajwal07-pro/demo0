import { featureFlags, type FeatureFlagKey } from '@/lib/env';

/**
 * Read a typed feature flag. Flags are loaded once at boot from validated
 * environment variables, so this hook is intentionally synchronous and
 * has no internal state.
 *
 * Usage:
 *   const has3D = useFeatureFlag('enable3D');
 *   if (!has3D) return <FallbackPanel />;
 */
export function useFeatureFlag(flag: FeatureFlagKey): boolean {
  return featureFlags[flag];
}

/**
 * Read multiple flags at once.
 */
export function useFeatureFlags(
  flags: FeatureFlagKey[]
): Record<FeatureFlagKey, boolean> {
  return flags.reduce(
    (acc, key) => {
      acc[key] = featureFlags[key];
      return acc;
    },
    {} as Record<FeatureFlagKey, boolean>
  );
}