import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface UnderwaterSensorProps {
  position?: [number, number, number];
  scale?: number;
  /** Emit sonar pings */
  sonar?: boolean;
  /** Anchor line color */
  anchorColor?: string;
}

/**
 * UnderwaterSensor — moored sensor array suspended between an anchor
 * and a surface buoy, emitting periodic sonar pings.
 */
export function UnderwaterSensor({
  position = [0, -2, 0],
  scale = 1,
  sonar = true,
  anchorColor = '#06b6d4',
}: UnderwaterSensorProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const sonarRef = React.useRef<THREE.Mesh>(null);
  const sonarMatRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.15;
    }
    if (sonarRef.current && sonarMatRef.current) {
      const cycle = (t % 3) / 3;
      const s = 1 + cycle * 4;
      sonarRef.current.scale.setScalar(s);
      sonarMatRef.current.opacity = Math.max(0, 0.5 - cycle * 0.5);
    }
  });

  const bodyMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.5,
        metalness: 0.7,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
      }),
    []
  );

  const accentMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: anchorColor,
        emissive: new THREE.Color(anchorColor),
        emissiveIntensity: 0.4,
        roughness: 0.4,
        metalness: 0.6,
      }),
    [anchorColor]
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main sensor capsule */}
      <mesh castShadow>
        <capsuleGeometry args={[0.15, 0.5, 8, 16]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Ring fins */}
      {[-0.25, 0.25].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.22, 0.02, 8, 24]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
      ))}

      {/* Sensor eye */}
      <mesh position={[0, -0.42, 0]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshBasicMaterial color={anchorColor} />
      </mesh>

      {/* Tether line up to surface */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 1.6, 6]} />
        <meshStandardMaterial color="#334155" roughness={0.8} />
      </mesh>

      {/* Anchor mass below */}
      <mesh position={[0, -0.9, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.15, 12]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Sonar ping rings */}
      {sonar && (
        <mesh ref={sonarRef} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 32]} />
          <meshBasicMaterial
            ref={sonarMatRef}
            color={anchorColor}
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Underwater glow */}
      <pointLight color={anchorColor} intensity={0.6} distance={3} decay={2} />
    </group>
  );
}

/**
 * Preload hook for the underwater sensor.
 *
 * This component is procedural (no GLB/GLTF) so preload is a no-op today.
 * The hook is exported so future asset-backed variants can warm the cache
 * without changing the call site.
 */
export function preloadUnderwaterSensor(): void {
  /* No external assets to preload — procedural model. */
}