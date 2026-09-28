/// <reference types="vite/client" />

/**
 * Typed environment variables exposed to the client.
 * Only variables prefixed with VITE_ will be present.
 *
 * Never commit real secrets to this file or to `.env.local`.
 * Private credentials belong on the backend.
 */
interface ImportMetaEnv {
  // ---------- Backend ----------
  readonly VITE_API_BASE_URL?: string;

  // ---------- Feature Flags ----------
  readonly VITE_ENABLE_3D?: string;
  readonly VITE_ENABLE_MAP?: string;
  readonly VITE_ENABLE_AI?: string;
  readonly VITE_ENABLE_SIMULATIONS?: string;
  readonly VITE_ENABLE_GAMES?: string;

  // ---------- Public Map Configuration ----------
  readonly VITE_MAP_STYLE_URL?: string;
  readonly VITE_MAP_DEFAULT_CENTER?: string;
  readonly VITE_MAP_DEFAULT_ZOOM?: string;

  // ---------- Optional Client-Side Keys (only if policy permits) ----------
  readonly VITE_MAPBOX_TOKEN?: string;
  readonly VITE_MAPTILER_KEY?: string;

  // Standard Vite vars
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  readonly SSR: boolean;
  readonly BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// ---------- Asset module declarations ----------
declare module '*.glb' {
  const src: string;
  export default src;
}
declare module '*.gltf' {
  const src: string;
  export default src;
}
declare module '*.hdr' {
  const src: string;
  export default src;
}
declare module '*.mp4' {
  const src: string;
  export default src;
}
declare module '*.webm' {
  const src: string;
  export default src;
}
declare module '*.vtt' {
  const src: string;
  export default src;
}