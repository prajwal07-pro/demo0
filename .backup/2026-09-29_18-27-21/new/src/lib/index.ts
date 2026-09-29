/**
 * ORCA lib barrel.
 *
 * Centralises the shared utilities, constants, animations, and the query
 * client. Importing from '@/lib' keeps downstream imports predictable.
 */

export * from './utils';
export * from './constants';
export * as animations from './animations';
export { queryClient } from './queryClient';
export { queryKeys } from './queryKeys';
export type { Bounds, CoordinatesKey } from './queryKeys';