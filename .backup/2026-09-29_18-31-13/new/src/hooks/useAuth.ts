import { useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, type SignInPayload, type SignUpPayload } from '@/services/authService';
import { queryKeys } from '@/lib/queryKeys';
import { useAppStore } from '@/store/useAppStore';
import type { User } from '@/types';

/**
 * Auth hook — wraps the auth service with the global store and TanStack
 * Query. The store keeps the user synchronous for the header and route
 * guards; the query cache keeps it consistent across tabs.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const user = useAppStore((s) => s.user);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const setUser = useAppStore((s) => s.setUser);

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const result = await authService.getCurrentUser();
      if (result.data) setUser(result.data);
      return result;
    },
    staleTime: 5 * 60_000,
    retry: false,
  });

  const signInMutation = useMutation({
    mutationFn: (payload: SignInPayload) => authService.signIn(payload),
    onSuccess: (result) => {
      if (result.data?.user) {
        setUser(result.data.user);
        queryClient.setQueryData(queryKeys.auth.me(), result);
      }
    },
  });

  const signUpMutation = useMutation({
    mutationFn: (payload: SignUpPayload) => authService.signUp(payload),
    onSuccess: (result) => {
      if (result.data?.user) {
        setUser(result.data.user);
        queryClient.setQueryData(queryKeys.auth.me(), result);
      }
    },
  });

  const signOut = useCallback(async () => {
    await authService.signOut();
    setUser(null);
    queryClient.removeQueries({ queryKey: queryKeys.auth.all });
  }, [queryClient, setUser]);

  const signInWithOAuth = useCallback(
    (provider: 'google' | 'github') => authService.oauthSignIn(provider),
    []
  );

  const updateProfile = useCallback(
    async (updates: Partial<User>) => {
      const result = await authService.updateProfile(updates);
      if (result.data) {
        setUser(result.data);
        queryClient.setQueryData(queryKeys.auth.me(), result);
      }
      return result;
    },
    [queryClient, setUser]
  );

  return {
    user,
    isAuthenticated,
    isLoading: meQuery.isLoading,
    error: meQuery.error,
    signIn: signInMutation.mutateAsync,
    signInStatus: signInMutation.status,
    signInError: signInMutation.error,
    signUp: signUpMutation.mutateAsync,
    signUpStatus: signUpMutation.status,
    signUpError: signUpMutation.error,
    signOut,
    signInWithOAuth,
    updateProfile,
  };
}