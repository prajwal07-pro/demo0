import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export interface RouteGuardProps {
  children: ReactNode;
  /** Show a friendly "sign in" screen instead of redirecting. Defaults to true. */
  showFallback?: boolean;
  /** Redirect to this path when unauthenticated (used when showFallback is false). */
  redirectTo?: string;
  /** Optional title override for the fallback screen. */
  title?: string;
  /** Optional description override for the fallback screen. */
  description?: string;
}

/**
 * RouteGuard — gates a route behind authentication.
 *
 * Default behaviour is to render a friendly "sign in to continue" panel
 * rather than redirecting, because redirecting on first load can lose the
 * user's original destination. The fallback preserves the current path
 * via the `from` query parameter so Auth can bounce back after sign in.
 */
export function RouteGuard({
  children,
  showFallback = true,
  redirectTo,
  title = 'Sign in to continue',
  description = 'This workspace is available to authenticated researchers and operators.',
}: RouteGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-abyss">
        <div className="flex flex-col items-center gap-3">
          <div className="h-1.5 w-32 rounded-full bg-white/[0.06] overflow-hidden">
            <div className="h-full w-1/3 animate-pulse rounded-full bg-gradient-to-r from-cyan to-teal" />
          </div>
          <p className="font-mono text-[10px] tracking-widest text-cyan/60">
            CHECKING SESSION
          </p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) return <>{children}</>;

  if (!showFallback && redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  const signInHref = `/auth?from=${encodeURIComponent(location.pathname)}`;

  return (
    <div className="relative min-h-[70vh] flex items-center justify-center px-6 bg-abyss">
      <div className="absolute inset-0 data-grid opacity-[0.08]" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-3xl border border-cyan/20 bg-abyss/60 backdrop-blur-xl p-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-cyan/30 bg-cyan/10">
          <Lock className="h-6 w-6 text-cyan" />
        </div>
        <div className="font-mono text-[10px] tracking-widest text-cyan/70 mb-2">
          AUTHENTICATION REQUIRED
        </div>
        <h1 className="font-display text-2xl font-bold text-white">
          {title}
        </h1>
        <p className="mt-3 text-sm text-white/60 leading-relaxed">
          {description}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to={signInHref}>
            <Button
              size="md"
              rightIcon={<ArrowRight className="h-3.5 w-3.5" />}
            >
              Sign In
            </Button>
          </Link>
          <Link to="/">
            <Button size="md" variant="ghost">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}