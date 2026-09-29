import * as React from 'react';
import { useEffect, useState } from 'react';

/**
 * Return a debounced copy of a value.
 *
 * Useful for search inputs, filter changes, and anything that triggers a
 * network request — the debounced value only updates after the caller has
 * stopped changing it for `delay` milliseconds.
 */
export function useDebouncedValue<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

/**
 * Hook to debounce a callback. The returned function is stable across
 * renders and preserves the latest callback reference.
 */
export function useDebouncedCallback<T extends (...args: never[]) => unknown>(
  callback: T,
  delay = 300
): (...args: Parameters<T>) => void {
  const callbackRef = React.useRef(callback);
  callbackRef.current = callback;

  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const trigger = React.useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay]
  );

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return trigger;
}