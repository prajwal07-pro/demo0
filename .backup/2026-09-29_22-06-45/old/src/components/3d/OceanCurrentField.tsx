import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface OceanCurrentFieldProps {
  /** Grid extent in X and Z (world units) */
  extent?: number;
  /** Number of vectors along each axis */
  resolution?: number;
  /** Height at which the field sits */
  y?: number;
  /** Animation speed of particles along vectors */
  flowSpeed?: number;
  /** Base color */
  color?: string;
  /** Accent color for stronger currents */
  accent?: string;
  /** Fixed procedural seed (deterministic) */
  seed?: number;
}

/**
 * OceanCurrentField — animated vector field representing ocean surface
 * currents. Renders as GL Points (fast) with additive blending so the
 * overall look is a flowing directional current rather than a rigid grid.
 *
 * Data note: this component renders a PROCEDURAL field for visual purposes.
 * It must never be presented as a real current dataset. When live current
 * data is available, replace `generateCurrents()` with the fetched vectors.
 */
export function OceanCurrentField({
  extent = 40,
  resolution = 40,
  y = 0,
  flowSpeed = 1,
  color = '#06b6d4',
  accent = '#40e0d0',
  seed = 42,
}: OceanCurrentFieldProps) {
  const pointsRef = React.useRef<THREE.Points>(null);

  // Deterministic pseudo-random
  const rand = React.useMemo(() => {
    let s = seed;
    return () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
  }, [seed]);

  // Build flow field
  const { positions, colors, velocities, count } = React.useMemo(() => {
    const total = resolution * resolution;
    const posArr = new Float32Array(total * 3);
    const colArr = new Float32Array(total * 3);
    const velArr = new Float32Array(total * 3);

    const c1 = new THREE.Color(color);
    const c2 = new THREE.Color(accent);

    let i = 0;
    for (let x = 0; x < resolution; x++) {
      for (let z = 0; z < resolution; z++) {
        const fx = (x / (resolution - 1) - 0.5) * extent;
        const fz = (z / (resolution - 1) - 0.5) * extent;

        // Procedural current: combined sinusoidal swirl
        const a = Math.sin(fx * 0.15) * Math.cos(fz * 0.12);
        const b = Math.cos(fx * 0.08) * Math.sin(fz * 0.18);
        const vx = a * 0.6;
        const vz = b * 0.6;
        const strength = Math.min(Math.sqrt(vx * vx + vz * vz), 1);

        const i3 = i * 3;
        posArr[i3] = fx;
        posArr[i3 + 1] = y + rand() * 0.1;
        posArr[i3 + 2] = fz;

        velArr[i3] = vx * flowSpeed;
        velArr[i3 + 1] = 0;
        velArr[i3 + 2] = vz * flowSpeed;

        const mixed = c1.clone().lerp(c2, strength);
        colArr[i3] = mixed.r;
        colArr[i3 + 1] = mixed.g;
        colArr[i3 + 2] = mixed.b;

        i++;
      }
    }
    return { positions: posArr, colors: colArr, velocities: velArr, count: total };
  }, [resolution, extent, y, flowSpeed, color, accent, rand]);

  // Circular sprite
  const sprite = React.useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.5)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 32, 32);
    const tex = new THREE.CanvasTexture(canvas);
    tex.needsUpdate = true;
    return tex;
  }, []);

  // Animate
  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute | undefined;
    if (!posAttr) return;
    const arr = posAttr.array as Float32Array;
    const d = Math.min(delta, 0.05);

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const vx = velocities[i3] ?? 0;
      const vz = velocities[i3 + 2] ?? 0;

      arr[i3] = (arr[i3] ?? 0) + vx * d;
      arr[i3 + 2] = (arr[i3 + 2] ?? 0) + vz * d;

      // Wrap within extent
      const px = arr[i3] ?? 0;
      const pz = arr[i3 + 2] ?? 0;
      if (px > extent / 2) arr[i3] = -extent / 2;
      if (px < -extent / 2) arr[i3] = extent / 2;
      if (pz > extent / 2) arr[i3 + 2] = -extent / 2;
      if (pz < -extent / 2) arr[i3 + 2] = extent / 2;
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} position={[0, 0, 0]}>
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
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.25}
        vertexColors
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        map={sprite ?? undefined}
        alphaTest={0.01}
      />
    </points>
  );
}