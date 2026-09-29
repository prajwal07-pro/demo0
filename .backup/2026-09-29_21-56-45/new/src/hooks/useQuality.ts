import { useEffect, useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { QUALITY_PRESETS, type QualityLevel } from '@/lib/constants';

/**
 * Detect a reasonable default quality level based on device capabilities.
 * Considers hardware concurrency, device memory, and reduced motion preference.
 */
function detectDefaultQuality(): QualityLevel {
  if (typeof window === 'undefined') return 'MEDIUM';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return 'LOW';
  }

  const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  const cores = navigator.hardwareConcurrency ?? 4;
  // @ts-expect-error deviceMemory is non-standard
  const memory = (navigator.deviceMemory as number | undefined) ?? 4;

  if (isTouch) {
    return cores >= 8 && memory >= 6 ? 'MEDIUM' : 'LOW';
  }

  if (cores >= 8 && memory >= 8) return 'HIGH';
  if (cores >= 4 && memory >= 4) return 'MEDIUM';
  return 'LOW';
}

/**
 * Global quality store hook.
 * Reads the user preference, falls back to auto-detected value.
 */
export function useQuality() {
  const userQuality = useAppStore((s) => s.user?.preferences.quality);
  const [autoQuality] = useState<QualityLevel>(() => detectDefaultQuality());
  const [level, setLevel] = useState<QualityLevel>(
    userQuality ?? autoQuality
  );

  useEffect(() => {
    if (userQuality) setLevel(userQuality);
  }, [userQuality]);

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const handler = () =>
      setIsVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, []);

  const preset = QUALITY_PRESETS[level];

  return {
    level,
    setLevel,
    preset,
    isVisible,
    isLow: level === 'LOW',
    isMedium: level === 'MEDIUM',
    isHigh: level === 'HIGH',
  };
}

/**
 * Detect whether WebGL2 is available. Used to fall back gracefully.
 */
export function useWebGLSupport() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      setSupported(!!gl);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}