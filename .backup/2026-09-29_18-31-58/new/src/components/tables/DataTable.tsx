import * as React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronUp, ChevronsUpDown, Download, Inbox } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { useSortableData, type SortDirection } from '@/hooks/useSortableData';
import { usePagination } from '@/hooks/usePagination';
import { exportCsv, type CsvColumn } from '@/lib/csv';

export interface DataTableColumn<T> {
  key: keyof T | string;
  header: string;
  /** Optional cell renderer. Defaults to stringification. */
  render?: (row: T) => React.ReactNode;
  /** Enable client-side sorting for this column. */
  sortable?: boolean;
  /** Optional comparator — used when sorting this column. */
  comparator?: (a: T, b: T) => number;
  /** Fixed width class, e.g. 'w-32'. */
  width?: string;
  /** Text alignment. */
  align?: 'left' | 'right' | 'center';
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Row key extractor. */
  rowKey: (row: T) => string;
  /** Called when a row is clicked. */
  onRowClick?: (row: T) => void;
  /** Message shown when the data set is empty. */
  emptyTitle?: string;
  emptyDescription?: string;
  /** Optional CSV export config. When present, an export button is shown. */
  csvExport?: {
    filename: string;
    columns: CsvColumn<T>[];
  };
  /** Enable pagination. Defaults to true when data length > 50. */
  pagination?: boolean;
  /** Surface tone. */
  tone?: 'light' | 'dark';
  className?: string;
  /** Optional label above the table. */
  label?: string;
}

/**
 * DataTable — the standard ORCA table primitive.
 *
 * Features:
 *  - Client-side sorting (single key, asc → desc → unsorted).
 *  - Client-side pagination with page-size selection.
 *  - Optional CSV export.
 *  - Empty state integration.
 *  - Light and dark surface tones.
 */
export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  rowKey,
  onRowClick,
  emptyTitle = 'No data',
  emptyDescription = 'Nothing to display for the current filters.',
  csvExport,
  pagination,
  tone = 'light',
  className,
  label,
}: DataTableProps<T>) {
  const comparators = React.useMemo(() => {
    const map: Record<string, (a: T, b: T) => number> = {};
    columns.forEach((col) => {
      if (col.comparator) {
        map[col.key as string] = col.comparator;
      }
    });
    return map;
  }, [columns]);

  const { sorted, sort, toggleSort } = useSortableData(data, {
    comparators,
  });

  const shouldPaginate = pagination ?? data.length > 50;
  const {
    pageItems,
    page,
    pageSize,
    pageSizeOptions,
    totalPages,
    total,
    nextPage,
    prevPage,
    goToPage,
    changePageSize,
    hasNext,
    hasPrev,
  } = usePagination(sorted);

  const visibleRows = shouldPaginate ? pageItems : sorted;

  const isLight = tone === 'light';

  if (data.length === 0) {
    return (
      <EmptyState
        icon={Inbox}
        title={emptyTitle}
        description={emptyDescription}
        light={isLight}
        className={className}
      />
    );
  }

  const handleExport = () => {
    if (!csvExport) return;
    exportCsv(csvExport.filename, data, csvExport.columns);
  };

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {/* Top bar */}
      {(label || csvExport) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <span
              className={cn(
                'font-mono text-[10px] tracking-widest uppercase',
                isLight ? 'text-ocean' : 'text-cyan/70'
              )}
            >
              {label}
            </span>
          )}
          {csvExport && (
            <Button
              variant={isLight ? 'secondary-light' : 'secondary'}
              size="sm"
              leftIcon={<Download className="h-3.5 w-3.5" />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div
        className={cn(
          'rounded-2xl border overflow-hidden',
          isLight
            ? 'border-ink/[0.08] bg-white shadow-soft'
            : 'border-white/[0.06] bg-white/[0.02]'
        )}
      >
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr
                className={cn(
                  'border-b',
                  isLight
                    ? 'border-ink/[0.06] bg-pearl-soft'
                    : 'border-white/[0.06] bg-white/[0.02]'
                )}
              >
                {columns.map((col) => {
                  const isSorted = sort.key === col.key;
                  return (
                    <th
                      key={col.key as string}
                      className={cn(
                        'px-5 py-3 text-left',
                        col.width,
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center'
                      )}
                    >
                      {col.sortable ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(col.key as keyof T)}
                          className={cn(
                            'inline-flex items-center gap-1.5 font-mono text-[10px] tracking-widest uppercase transition-colors',
                            isLight
                              ? 'text-mist-deep hover:text-ocean'
                              : 'text-white/50 hover:text-cyan'
                          )}
                        >
                          {col.header}
                          {isSorted ? (
                            sort.direction === 'asc' ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        <span
                          className={cn(
                            'font-mono text-[10px] tracking-widest uppercase',
                            isLight ? 'text-mist-deep' : 'text-white/50'
                          )}
                        >
                          {col.header}
                        </span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row, i) => (
                <motion.tr
                  key={rowKey(row)}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(i * 0.008, 0.2) }}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'border-b last:border-b-0 transition-colors',
                    isLight
                      ? 'border-ink/[0.04]'
                      : 'border-white/[0.04]',
                    onRowClick &&
                      (isLight ? 'cursor-pointer hover:bg-pearl-soft' : 'cursor-pointer hover:bg-white/[0.03]')
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key as string}
                      className={cn(
                        'px-5 py-3 text-sm',
                        col.align === 'right' && 'text-right',
                        col.align === 'center' && 'text-center',
                        isLight ? 'text-ink' : 'text-white/90'
                      )}
                    >
                      {col.render
                        ? col.render(row)
                        : String((row as Record<string, unknown>)[col.key as string] ?? '—')}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {shouldPaginate && totalPages > 1 && (
          <div
            className={cn(
              'flex flex-wrap items-center justify-between gap-3 px-5 py-3 border-t',
              isLight ? 'border-ink/[0.06] bg-pearl-soft' : 'border-white/[0.06] bg-white/[0.01]'
            )}
          >
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'font-mono text-[10px] tracking-wider',
                  isLight ? 'text-mist-deep' : 'text-white/50'
                )}
              >
                {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
              </span>
              <select
                value={pageSize}
                onChange={(e) => changePageSize(Number(e.target.value))}
                className={cn(
                  'h-7 rounded-md border text-[11px] px-2 outline-none',
                  isLight
                    ? 'bg-white border-ink/10 text-ink'
                    : 'bg-abyss/60 border-white/10 text-white'
                )}
                aria-label="Rows per page"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} / page
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={isLight ? 'secondary-light' : 'secondary'}
                size="sm"
                disabled={!hasPrev}
                onClick={prevPage}
              >
                Prev
              </Button>
              <span
                className={cn(
                  'font-mono text-[10px] tracking-wider tabular-nums',
                  isLight ? 'text-ink-soft' : 'text-white/60'
                )}
              >
                {page} / {totalPages}
              </span>
              <Button
                variant={isLight ? 'secondary-light' : 'secondary'}
                size="sm"
                disabled={!hasNext}
                onClick={nextPage}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Reserved: exported for advanced consumers that want to jump to a page directly.
void (null as unknown as (n: number) => void);
void (null as unknown as SortDirection);
void goToPage;