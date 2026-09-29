import * as React from 'react';
import { Canvas, type CanvasProps } from '@react-three/fiber';
import { Suspense } from 'react';
import { Preload, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { MarineEnvironment } from './MarineEnvironment';
import { DataParticles } from './DataParticles';
import { useQuality } from '@/hooks/useQuality';
import { cn } from '@/lib/utils';

export interface OceanSceneProps extends Omit<CanvasProps, 'children'> {
  /** Optional content to render inside the scene */
  children?: React.ReactNode;
  /** Camera configuration override */
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  /** Environment mood */
  mood?: 'dawn' | 'day' | 'dusk' | 'night';
  /** Show default data particles */
  showParticles?: boolean;
  /** Particle count override */
  particleCount?: number;
  /** Wrapper class name */
  className?: string;
  /** Enable postprocessing */
  postprocessing?: boolean;
  /** Enable fallback when WebGL is unavailable */
  fallback?: React.ReactNode;
}

/**
 * OceanScene — the foundational Canvas wrapper for all 3D scenes.
 *
 * Responsibilities:
 * - Configures renderer, camera, tone mapping, color space
 * - Applies quality-based DPR and adaptive performance
 * - Wraps content in Suspense with a graceful loader
 * - Sets up post-processing (bloom, chromatic aberration, vignette)
 * - Provides a fallback if WebGL is unavailable
 */
export function OceanScene({
  children,
  cameraPosition = [0, 2, 8],
  cameraFov = 55,
  mood = 'night',
  showParticles = true,
  particleCount,
  className,
  postprocessing = true,
  fallback,
  ...canvasProps
}: OceanSceneProps) {
  const { preset, isHigh, isMedium } = useQuality();

  const dpr: [number, number] = [1, preset.dpr];
  const actualParticleCount = particleCount ?? preset.particles;

  // Graceful WebGL detection
  const [webglOk, setWebglOk] = React.useState<boolean | null>(null);
  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
      setWebglOk(!!gl);
    } catch {
      setWebglOk(false);
    }
  }, []);

  // Chromatic aberration offset as THREE.Vector2 (memoized)
  const caOffset = React.useMemo(() => new THREE.Vector2(0.0005, 0.0005), []);

  if (webglOk === false) {
    return (
      <div
        className={cn(
          'relative w-full h-full flex items-center justify-center bg-abyss',
          className
        )}
      >
        {fallback ?? (
          <div className="text-center max-w-md px-6">
            <p className="telemetry-text text-cyan/70">RENDERER UNAVAILABLE</p>
            <p className="mt-3 text-sm text-muted-foreground">
              WebGL is disabled or unsupported in this browser. Please enable
              hardware acceleration or use a WebGL-capable browser.
            </p>
          </div>
        )}
      </div>
    );
  }

  const renderPostprocessing = postprocessing && preset.postprocessing;

  return (
    <div className={cn('relative w-full h-full', className)}>
      <Canvas
        dpr={dpr}
        shadows={preset.shadows}
        gl={{
          antialias: preset.antialias,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
          outputColorSpace: THREE.SRGBColorSpace,
        }}
        camera={{
          position: cameraPosition,
          fov: cameraFov,
          near: 0.1,
          far: 500,
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x020617, 1);
        }}
        {...canvasProps}
      >
        <Suspense fallback={null}>
          <MarineEnvironment mood={mood} depth={200} caustics={isHigh} />

          {showParticles ? (
            <DataParticles
              count={actualParticleCount}
              bounds={{ x: 60, y: 25, z: 60 }}
              size={0.1}
              useGradient
              streaming
              speed={isHigh ? 1 : 0.6}
              position={[0, 0, 0]}
            />
          ) : null}

          {children}

          {/* Adaptive performance */}
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />

          {/* Postprocessing stack */}
          {renderPostprocessing && isHigh ? (
            <EffectComposer multisampling={4}>
              <Bloom
                intensity={0.9}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.75}
              />
              <ChromaticAberration
                offset={caOffset}
                radialModulation={false}
                modulationOffset={0}
                blendFunction={BlendFunction.NORMAL}
              />
              <Vignette eskil={false} offset={0.35} darkness={0.85} />
            </EffectComposer>
          ) : renderPostprocessing ? (
            <EffectComposer multisampling={isMedium ? 2 : 0}>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.4}
                luminanceSmoothing={0.9}
                mipmapBlur
                radius={0.75}
              />
              <Vignette eskil={false} offset={0.35} darkness={0.85} />
            </EffectComposer>
          ) : null}

          <Preload all />
        </Suspense>
      </Canvas>

      {/* HUD overlay — subtle cinematic vignette frame */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(2,6,23,0.9)]" />
        <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest text-cyan/40">
          ORCA · LIVE ENVIRONMENT
        </div>
      </div>
    </div>
  );
}