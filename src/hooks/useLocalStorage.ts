import { useCallback, useEffect, useState } from 'react';

/**
 * Persist a value to localStorage and keep React state in sync with it.
 *
 * - SSR-safe: falls back to the initial value when `window` is unavailable.
 * - Cross-tab sync: listens to `storage` events so multiple tabs stay
 *   consistent.
 * - Safe parse: JSON errors fall back to the initial value rather than
 *   crashing the app.
 *
 * Prefer the Zustand store for app-wide persisted state. Use this hook
 * for small, component-local preferences.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function
            ? (value as (prev: T) => T)(storedValue)
            : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        // Swallow quota errors — the app should keep working.
      }
    },
    [key, storedValue]
  );

  const remove = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
      setStoredValue(initialValue);
    } catch {
      /* swallow */
    }
  }, [key, initialValue]);

  // Cross-tab sync.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handler = (event: StorageEvent) => {
      if (event.key !== key || event.storageArea !== window.localStorage) return;
      try {
        setStoredValue(
          event.newValue ? (JSON.parse(event.newValue) as T) : initialValue
        );
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, [key, initialValue]);

  return [storedValue, setValue, remove];
}