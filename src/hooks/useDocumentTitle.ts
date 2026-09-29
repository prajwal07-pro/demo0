import { useEffect } from 'react';

const BASE_TITLE = 'ORCA — Marine Intelligence Platform';

/**
 * Set the document title for the current page.
 *
 * Usage:
 *   useDocumentTitle('Live Map');
 *   → "Live Map · ORCA — Marine Intelligence Platform"
 *
 * Passing nothing resets the title to the base product title.
 */
export function useDocumentTitle(title?: string) {
  useEffect(() => {
    const previous = document.title;
    document.title = title ? `${title} · ${BASE_TITLE}` : BASE_TITLE;
    return () => {
      document.title = previous;
    };
  }, [title]);
}