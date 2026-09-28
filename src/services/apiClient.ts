/**
 * Base API client with typing, error handling, and response validation.
 * All service calls should flow through this client so that:
 *  - auth headers, retries, timeouts are centralized
 *  - mock adapters can be toggled in dev
 *  - responses can be validated with Zod at the boundary
 *
 * IMPORTANT: no raw API keys or secrets are exposed here. Any private
 * tokens must live behind a server proxy.
 */

import { z } from 'zod';
import type { ApiResponse } from '@/types';

// ---------- Config ----------
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';
const DEFAULT_TIMEOUT = 15_000;
const IS_DEV = import.meta.env.DEV;

// ---------- Errors ----------
export class ApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;
  constructor(message: string, status: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}

// ---------- Request Options ----------
export interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  timeout?: number;
  /** Skip JSON parsing (e.g. for blobs) */
  raw?: boolean;
  /** Zod schema to validate response payload */
  schema?: z.ZodType<unknown>;
  /** Query parameters */
  params?: Record<string, string | number | boolean | undefined | null>;
}

// ---------- Core Request ----------
export async function apiRequest<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    body,
    timeout = DEFAULT_TIMEOUT,
    raw = false,
    schema,
    params,
    headers,
    ...rest
  } = options;

  const url = buildUrl(path, params);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);

  const finalHeaders: HeadersInit = {
    Accept: 'application/json',
    ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    ...(headers ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: finalHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if ((err as Error).name === 'AbortError') {
      throw new NetworkError(`Request timed out after ${timeout}ms: ${path}`);
    }
    throw new NetworkError((err as Error).message);
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    const errBody = await safeReadError(response);
    throw new ApiError(
      errBody.message ?? `Request failed with status ${response.status}`,
      response.status,
      errBody.code,
      errBody.details
    );
  }

  if (raw) {
    return response as unknown as T;
  }

  let payload: unknown;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError('Invalid JSON response', response.status, 'INVALID_JSON');
  }

  if (schema) {
    const parsed = schema.safeParse(payload);
    if (!parsed.success) {
      throw new ApiError(
        'Response schema validation failed',
        response.status,
        'SCHEMA_MISMATCH',
        parsed.error.issues
      );
    }
    return parsed.data as T;
  }

  return payload as T;
}

// ---------- Helpers ----------
function buildUrl(
  path: string,
  params?: RequestOptions['params']
): string {
  const base = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  if (!params) return base;

  const search = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    search.append(k, String(v));
  }
  const qs = search.toString();
  return qs ? `${base}${base.includes('?') ? '&' : '?'}${qs}` : base;
}

async function safeReadError(
  response: Response
): Promise<{ message?: string; code?: string; details?: unknown }> {
  try {
    const data = await response.json();
    if (typeof data === 'object' && data !== null) {
      return data as { message?: string; code?: string; details?: unknown };
    }
  } catch {
    /* swallow */
  }
  return {};
}

// ---------- Convenience wrappers ----------
export const api = {
  get: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
};

// ---------- Environment flags ----------
export const isDev = IS_DEV;
export const hasBackend = Boolean(BASE_URL);

// ---------- Standard response wrapper ----------
export function wrapResponse<T>(
  data: T,
  source = 'client'
): ApiResponse<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
    source,
  };
}