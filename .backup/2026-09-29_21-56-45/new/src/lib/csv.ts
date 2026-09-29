/**
 * CSV utilities.
 *
 * Used to export datasets (vessel lists, alert logs, observation tables)
 * to CSV entirely client-side, so no data leaves the browser.
 */

function escapeCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (
    str.includes('"') ||
    str.includes(',') ||
    str.includes('\n') ||
    str.includes('\r')
  ) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export interface CsvColumn<T> {
  key: keyof T | string;
  header: string;
  /** Optional formatter — return a primitive to be stringified. */
  format?: (row: T) => string | number | boolean | null | undefined;
}

/**
 * Serialize an array of records to a CSV string.
 */
export function toCsv<T extends Record<string, unknown>>(
  rows: T[],
  columns: CsvColumn<T>[]
): string {
  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          const raw = c.format
            ? c.format(row)
            : (row as Record<string, unknown>)[c.key as string];
          return escapeCell(raw);
        })
        .join(',')
    )
    .join('\n');

  return `${header}\n${body}`;
}

/**
 * Trigger a browser download of a CSV file.
 */
export function downloadCsv(filename: string, csv: string): void {
  if (typeof window === 'undefined') return;

  // Prepend BOM so Excel recognises UTF-8.
  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Convenience: serialize and download in one call.
 */
export function exportCsv<T extends Record<string, unknown>>(
  filename: string,
  rows: T[],
  columns: CsvColumn<T>[]
): void {
  const csv = toCsv(rows, columns);
  downloadCsv(filename, csv);
}