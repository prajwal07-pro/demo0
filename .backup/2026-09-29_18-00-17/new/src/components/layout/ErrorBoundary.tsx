import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback to override the default panel. */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary — wraps routed page content so that a runtime exception in
 * any page shows a meaningful ORCA-styled panel instead of a blank screen.
 *
 * Behaviour:
 *  - Retry re-mounts the current route subtree.
 *  - Back to workspace navigates to `/` and hard-reloads if needed.
 *  - Details are logged to the console in development only, never shown
 *    to end users as raw stack traces.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.error('[ORCA] Route render error:', error, info);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  private handleHome = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[70vh] items-center justify-center px-6">
          <div className="w-full max-w-lg rounded-2xl border border-amber-400/30 bg-amber-400/[0.03] p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-amber-400/40 bg-amber-400/10">
              <AlertTriangle className="h-6 w-6 text-amber-400" />
            </div>
            <div className="font-mono text-[10px] tracking-[0.3em] text-amber-400/80 mb-2">
              ORCA · MODULE ERROR
            </div>
            <h1 className="font-display text-2xl font-bold text-white">
              This module is temporarily unavailable
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Something went wrong while rendering this page. You can retry,
              or return to the workspace.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={this.handleRetry}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan/40 bg-cyan/10 px-4 py-2 text-xs font-medium text-cyan transition-colors hover:bg-cyan/20"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Retry
              </button>
              <button
                type="button"
                onClick={this.handleHome}
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-white/80 transition-colors hover:border-cyan/30 hover:text-white"
              >
                <Home className="h-3.5 w-3.5" />
                Back to workspace
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}