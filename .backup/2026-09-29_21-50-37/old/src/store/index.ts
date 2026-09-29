/**
 * ORCA global store barrel.
 *
 * Prefer the selector hooks (`useUI`, `useMap`, `useData`, `useChat`,
 * `useUser`) over accessing the full store directly. They return
 * memoised slices so components only re-render when their slice changes.
 */

export { useAppStore } from './useAppStore';
export { useUI } from './useAppStore';
export { useMap } from './useAppStore';
export { useData } from './useAppStore';
export { useChat } from './useAppStore';
export { useUser } from './useAppStore';
export type { AppStore } from './useAppStore';