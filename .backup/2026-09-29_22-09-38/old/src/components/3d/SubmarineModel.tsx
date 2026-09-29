import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface SubmarineModelProps {
  position?: [number, number, number];
  scale?: number;
  /** Compass heading in radians */
  heading?: number;
  /** Enable propeller spin and bobbing */
  animated?: boolean;
  /** Enable searchlight cone */
  searchlight?: boolean;
  /** Searchlight color */
  lightColor?: string;
}

/**
 * SubmarineModel — autonomous underwater vehicle (AUV) with rotating
 * propeller and optional downward searchlight.
 */
export function SubmarineModel({
  position = [0, 0, 0],
  scale = 1,
  heading = 0,
  animated = true,
  searchlight = true,
  lightColor = '#22d3ee',
}: SubmarineModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const propRef = React.useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && animated) {
      groupRef.current.position.y = position[1] + Math.sin(t * 0.9) * 0.08;
      groupRef.current.rotation.z = Math.sin(t * 0.6) * 0.03;
    }
    if (propRef.current && animated) {
      propRef.current.rotation.z += delta * 12;
    }
  });

  const hullMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0f172a',
        roughness: 0.35,
        metalness: 0.75,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.3,
      }),
    []
  );

  const accentMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#eab308',
        roughness: 0.4,
        metalness: 0.6,
        emissive: new THREE.Color('#eab308'),
        emissiveIntensity: 0.15,
      }),
    []
  );

  const glowMat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: lightColor,
        transparent: true,
        opacity: 0.9,
      }),
    [lightColor]
  );

  return (
    <group ref={groupRef} position={position} rotation={[0, -heading, 0]} scale={scale}>
      {/* Main hull — elongated capsule */}
      <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
        <capsuleGeometry args={[0.32, 1.6, 12, 24]} />
        <primitive object={hullMat} attach="material" />
      </mesh>

      {/* Conning tower (sail) */}
      <mesh position={[0, 0.35, -0.1]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.5]} />
        <primitive object={hullMat} attach="material" />
      </mesh>

      {/* Sail fins */}
      <mesh position={[0, 0.55, -0.1]} castShadow>
        <boxGeometry args={[0.02, 0.15, 0.4]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Dive planes (fins) at front */}
      <mesh position={[0, 0, 0.55]} castShadow>
        <boxGeometry args={[1, 0.02, 0.15]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Stern fins (X config) */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[-Math.cos(angle) * 0.25, -0.7, Math.sin(angle) * 0.25]}
          rotation={[0, -angle, 0]}
          castShadow
        >
          <boxGeometry args={[0.6, 0.015, 0.12]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
      ))}

      {/* Propeller */}
      <group position={[0, 0, -1]}>
        <mesh ref={propRef}>
          <cylinderGeometry args={[0.02, 0.02, 0.06, 12]} />
          <primitive object={accentMat} attach="material" />
        </mesh>
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh
            key={i}
            ref={i === 0 ? propRef : undefined}
            position={[0, 0, -0.03]}
            rotation={[0, 0, angle]}
          >
            <boxGeometry args={[0.28, 0.02, 0.06]} />
            <primitive object={accentMat} attach="material" />
          </mesh>
        ))}
      </group>

      {/* Forward sensor eye */}
      <mesh position={[0, 0, 1.05]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <primitive object={glowMat} attach="material" />
      </mesh>

      {/* Searchlight cone */}
      {searchlight && (
        <spotLight
          color={lightColor}
          intensity={2}
          distance={6}
          angle={Math.PI / 8}
          penumbra={0.6}
          position={[0, -0.2, 0.8]}
          target-position={[0, -2, 2]}
        />
      )}

      {/* Ambient cyan glow */}
      <pointLight color={lightColor} intensity={0.6} distance={2.5} decay={2} />
    </group>
  );
}