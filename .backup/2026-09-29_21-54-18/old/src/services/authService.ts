/**
 * Auth Service
 *
 * Abstraction over the authentication provider. Client never handles
 * secrets — it just passes credentials to the backend which issues a
 * signed session.
 *
 * All methods return a consistent envelope so that UI can render
 * "not available" states cleanly when the backend is offline.
 */

import { api, isDev, hasBackend } from './apiClient';
import type { User } from '@/types';
import { API_ENDPOINTS } from '@/lib/constants';

export interface AuthResult<T> {
  data: T | null;
  unavailable: boolean;
  error?: string;
}

export interface SignUpPayload {
  email: string;
  password: string;
  name: string;
  organization?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
  remember?: boolean;
}

export interface SessionPayload {
  user: User;
  token: string;
  expiresAt: string;
}

export const authService = {
  /**
   * Sign in with email/password.
   */
  async signIn(payload: SignInPayload): Promise<AuthResult<SessionPayload>> {
    if (!hasBackend && !isDev) return unavailable('Auth backend not configured');
    try {
      const data = await api.post<SessionPayload>(`${API_ENDPOINTS.AUTH}/signin`, payload);
      return { data, unavailable: false };
    } catch (err) {
      return { data: null, unavailable: false, error: (err as Error).message };
    }
  },

  /**
   * Create a new account.
   */
  async signUp(payload: SignUpPayload): Promise<AuthResult<SessionPayload>> {
    if (!hasBackend && !isDev) return unavailable('Auth backend not configured');
    try {
      const data = await api.post<SessionPayload>(`${API_ENDPOINTS.AUTH}/signup`, payload);
      return { data, unavailable: false };
    } catch (err) {
      return { data: null, unavailable: false, error: (err as Error).message };
    }
  },

  /**
   * Sign in via OAuth provider (Google / GitHub). The backend redirects.
   */
  oauthSignIn(provider: 'google' | 'github'): void {
    if (!hasBackend) {
      if (isDev) console.warn(`[auth] OAuth ${provider} requires a backend`);
      return;
    }
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}${API_ENDPOINTS.AUTH}/oauth/${provider}`;
  },

  /**
   * Sign out the current session.
   */
  async signOut(): Promise<void> {
    if (!hasBackend) return;
    try {
      await api.post(`${API_ENDPOINTS.AUTH}/signout`);
    } catch {
      /* swallow — local state clears anyway */
    }
  },

  /**
   * Fetch the currently authenticated user.
   */
  async getCurrentUser(): Promise<AuthResult<User>> {
    if (!hasBackend && !isDev) return unavailable('Auth backend not configured');
    try {
      const data = await api.get<User>(`${API_ENDPOINTS.AUTH}/me`);
      return { data, unavailable: false };
    } catch {
      return { data: null, unavailable: false, error: 'Not authenticated' };
    }
  },

  /**
   * Request a password reset email.
   */
  async requestPasswordReset(email: string): Promise<AuthResult<{ sent: boolean }>> {
    if (!hasBackend && !isDev) return unavailable('Auth backend not configured');
    try {
      const data = await api.post<{ sent: boolean }>(`${API_ENDPOINTS.AUTH}/reset`, { email });
      return { data, unavailable: false };
    } catch (err) {
      return { data: null, unavailable: false, error: (err as Error).message };
    }
  },

  /**
   * Update the current user's profile.
   */
  async updateProfile(updates: Partial<User>): Promise<AuthResult<User>> {
    if (!hasBackend && !isDev) return unavailable('Auth backend not configured');
    try {
      const data = await api.patch<User>(`${API_ENDPOINTS.AUTH}/me`, updates);
      return { data, unavailable: false };
    } catch (err) {
      return { data: null, unavailable: false, error: (err as Error).message };
    }
  },
};

function unavailable<T>(reason: string): AuthResult<T> {
  return { data: null, unavailable: true, error: reason };
}