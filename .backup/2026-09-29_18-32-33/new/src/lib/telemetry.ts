/**
 * Telemetry facade.
 *
 * ORCA intentionally does not ship a third-party analytics SDK by default.
 * This facade exposes a single `track()` entry point so call sites remain
 * consistent, and the default implementation is a no-op in production and
 * a console logger in development.
 *
 * To wire real analytics, replace the `send` function below.
 *
 * Privacy:
 *  - No personally-identifying information is included by default.
 *  - Event payloads should be primitives, IDs, or counts — never free-form
 *    user text unless the call site is explicitly configured to include it.
 */

type TelemetryPayload = Record<string, string | number | boolean | null | undefined>;

interface TelemetryEvent {
  name: string;
  payload?: TelemetryPayload;
  timestamp: string;
}

function send(event: TelemetryEvent): void {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.debug('[telemetry]', event.name, event.payload ?? {});
  }
  // Production: no-op until a provider is wired.
}

export const telemetry = {
  /**
   * Track an event. Silently ignores errors so telemetry never breaks UI.
   */
  track(name: string, payload?: TelemetryPayload): void {
    try {
      send({
        name,
        payload,
        timestamp: new Date().toISOString(),
      });
    } catch {
      /* swallow */
    }
  },

  /**
   * Track a page view. Called automatically from usePageView.
   */
  pageView(path: string, title?: string): void {
    telemetry.track('page_view', {
      path,
      title: title ?? null,
    });
  },
};

export type { TelemetryEvent, TelemetryPayload };