import { useCallback, useEffect, useState } from 'react';

/**
 * useLocalDraft — persists an in-progress form draft to localStorage so
 * the user does not lose work on refresh or navigation. Cleared
 * explicitly when the form is submitted.
 *
 * The draft is scoped per user and per form key so different users on the
 * same browser do not clobber each other.
 */
export function useLocalDraft<T extends Record<string, unknown>>(
  key: string,
  initial: T,
  options: { userId?: string; debounceMs?: number } = {}
) {
  const { userId = 'guest', debounceMs = 400 } = options;
  const storageKey = `orca.draft.${userId}.${key}`;

  const [draft, setDraft] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(storageKey);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  // Debounced persistence.
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(draft));
      } catch {
        /* swallow quota errors */
      }
    }, debounceMs);
    return () => clearTimeout(timer);
  }, [draft, storageKey, debounceMs]);

  const clear = useCallback(() => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* swallow */
    }
    setDraft(initial);
  }, [storageKey, initial]);

  const update = useCallback((patch: Partial<T>) => {
    setDraft((prev) => ({ ...prev, ...patch }));
  }, []);

  return { draft, setDraft, update, clear };
}