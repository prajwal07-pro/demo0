import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from '@/store/useAppStore';
import * as THREE from 'three';

export interface DataParticlesProps {
  /** Number of particles */
  count?: number;
  /** Bounds of the particle field */
  bounds?: { x: number; y: number; z: number };
  /** Particle size */
  size?: number;
  /** Base color (used when useGradient is false) */
  color?: string;
  /** Enable multi-color gradient */
  useGradient?: boolean;
  /** Enable streaming motion toward camera */
  streaming?: boolean;
  /** Speed of motion (multiplier) */
  speed?: number;
  /** Enable reactive motion when vessels are moving */
  reactive?: boolean;
  /** World position */
  position?: [number, number, number];
}

const GRADIENT_COLORS = ['#06b6d4', '#14b8a6', '#40e0d0', '#8b5cf6', '#22d3ee'];

/**
 * DataParticles — floating particles representing marine telemetry,
 * satellite data, or AIS signals moving through the environment.
 *
 * Uses a single instanced Points object for performance. Particle
 * velocity is bumped slightly when the live vessel count rises, so the
 * scene subtly responds to platform activity.
 */
export function DataParticles({
  count = 1500,
  bounds = { x: 40, y: 20, z: 40 },
  size = 0.12,
  color = '#22d3ee',
  useGradient = true,
  streaming = false,
  speed = 1,
  reactive = true,
  position = [0, 0, 0],
}: DataParticlesProps) {
  const pointsRef = React.useRef<THREE.Points>(null);
  const vessels = useAppStore((s) => s.vessels);

  const { positions, velocities, colorArray } = React.useMemo(() => {
    const posArr = new Float32Array(count * 3);
    const velArr = new Float32Array(count * 3);
    const colArr = new Float32Array(count * 3);

    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      posArr[i3] = (Math.random() - 0.5) * bounds.x;
      posArr[i3 + 1] = (Math.random() - 0.5) * bounds.y;
      posArr[i3 + 2] = (Math.random() - 0.5) * bounds.z;

      velArr[i3] = (Math.random() - 0.5) * 0.02;
      velArr[i3 + 1] = (Math.random() - 0.5) * 0.02;
      velArr[i3 + 2] = streaming
        ? Math.random() * 0.03 + 0.01
        : (Math.random() - 0.5) * 0.02;

      if (useGradient) {
        const idx = Math.floor(Math.random() * GRADIENT_COLORS.length);
        c.set(GRADIENT_COLORS[idx] ?? '#22d3ee');
        colArr[i3] = c.r;
        colArr[i3 + 1] = c.g;
        colArr[i3 + 2] = c.b;
      } else {
        c.set(color);
        colArr[i3] = c.r;
        colArr[i3 + 1] = c.g;
        colArr[i3 + 2] = c.b;
      }
    }
    return { positions: posArr, velocities: velArr, colorArray: colArr };
  }, [count, bounds.x, bounds.y, bounds.z, streaming, useGradient, color]);

  // Soft circular sprite texture.
  const spriteTexture = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.3, 'rgba(255,255,255,0.6)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Dispose the texture when the component unmounts.
  React.useEffect(() => {
    return () => {
      if (spriteTexture) spriteTexture.dispose();
    };
  }, [spriteTexture]);

  // Reactive factor: bumps speed when many vessels are active.
  const reactiveFactor = React.useMemo(() => {
    if (!reactive) return 1;
    return 1 + Math.min(vessels.length / 200, 1) * 0.5;
  }, [reactive, vessels.length]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as
      | THREE.BufferAttribute
      | undefined;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    const d = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const vx = velocities[i3] ?? 0;
      const vy = velocities[i3 + 1] ?? 0;
      const vz = velocities[i3 + 2] ?? 0;

      arr[i3] = (arr[i3] ?? 0) + vx * d * speed * reactiveFactor;
      arr[i3 + 1] = (arr[i3 + 1] ?? 0) + vy * d * speed * reactiveFactor;
      arr[i3 + 2] = (arr[i3 + 2] ?? 0) + vz * d * speed * reactiveFactor;

      const px = arr[i3] ?? 0;
      const py = arr[i3 + 1] ?? 0;
      const pz = arr[i3 + 2] ?? 0;
      if (px > bounds.x / 2) arr[i3] = -bounds.x / 2;
      if (px < -bounds.x / 2) arr[i3] = bounds.x / 2;
      if (py > bounds.y / 2) arr[i3 + 1] = -bounds.y / 2;
      if (py < -bounds.y / 2) arr[i3 + 1] = bounds.y / 2;
      if (pz > bounds.z / 2) arr[i3 + 2] = -bounds.z / 2;
      if (pz < -bounds.z / 2) arr[i3 + 2] = bounds.z / 2;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={position}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
          usage={THREE.DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colorArray}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={spriteTexture ?? undefined}
        alphaTest={0.01}
      />
    </points>
  );
}