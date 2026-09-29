import { useCallback, useMemo, useState } from 'react';

export type SortDirection = 'asc' | 'desc';

export interface SortState<T> {
  key: keyof T | null;
  direction: SortDirection;
}

export interface UseSortableDataOptions<T> {
  /** Initial sort key. */
  initialKey?: keyof T;
  /** Initial direction. Defaults to 'asc'. */
  initialDirection?: SortDirection;
  /**
   * Comparator overrides for specific keys. Use this when the default
   * `<` / `>` comparison does not apply (dates, MMSI strings, custom
   * natural-language sorting, etc).
   */
  comparators?: Partial<Record<keyof T, (a: T, b: T) => number>>;
}

/**
 * useSortableData — client-side sorting for tabular data.
 *
 * Returns the sorted rows, current sort state, and a toggler that cycles
 * asc → desc → asc for a given key. Null values always sort to the end
 * regardless of direction.
 */
export function useSortableData<T extends Record<string, unknown>>(
  data: T[],
  options: UseSortableDataOptions<T> = {}
) {
  const { initialKey, initialDirection = 'asc', comparators } = options;

  const [sort, setSort] = useState<SortState<T>>({
    key: initialKey ?? null,
    direction: initialDirection,
  });

  const sorted = useMemo(() => {
    if (!sort.key) return data;

    const key = sort.key;
    const custom = comparators?.[key];

    const getValue = (row: T): unknown =>
      (row as Record<string, unknown>)[key as string];

    const compare = (a: T, b: T): number => {
      if (custom) return custom(a, b);

      const av = getValue(a);
      const bv = getValue(b);

      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;

      if (typeof av === 'number' && typeof bv === 'number') {
        return av - bv;
      }

      return String(av).localeCompare(String(bv));
    };

    const result = [...data].sort(compare);
    return sort.direction === 'asc' ? result : result.reverse();
  }, [data, sort, comparators]);

  const toggleSort = useCallback((key: keyof T) => {
    setSort((prev) => {
      if (prev.key !== key) return { key, direction: 'asc' };
      if (prev.direction === 'asc') return { key, direction: 'desc' };
      return { key: null, direction: 'asc' };
    });
  }, []);

  const setSortKey = useCallback((key: keyof T | null) => {
    setSort({ key, direction: 'asc' });
  }, []);

  return { sorted, sort, toggleSort, setSortKey };
}