import { useCallback, useEffect, useMemo, useState } from 'react';

export interface UsePaginationOptions {
  /** Initial page size. */
  initialPageSize?: number;
  /** Initial page (1-indexed). */
  initialPage?: number;
  /** Optional list of page-size options. */
  pageSizeOptions?: number[];
}

/**
 * usePagination — client-side pagination for lists and tables.
 *
 * Returns the current page slice, page metadata, and navigation actions.
 * When the underlying data shrinks below the current page, the page is
 * clamped automatically so the user never sees an empty page.
 */
export function usePagination<T>(
  items: T[],
  options: UsePaginationOptions = {}
) {
  const {
    initialPageSize = 25,
    initialPage = 1,
    pageSizeOptions = [10, 25, 50, 100],
  } = options;

  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // Clamp page when the underlying data changes.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  const nextPage = useCallback(() => setPage((p) => Math.min(p + 1, totalPages)), [totalPages]);
  const prevPage = useCallback(() => setPage((p) => Math.max(p - 1, 1)), []);
  const goToPage = useCallback(
    (n: number) => setPage(Math.min(Math.max(n, 1), totalPages)),
    [totalPages]
  );

  const changePageSize = useCallback((n: number) => {
    setPageSize(n);
    setPage(1);
  }, []);

  return {
    page,
    pageSize,
    pageSizeOptions,
    pageItems,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
  };
}