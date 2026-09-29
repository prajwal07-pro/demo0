import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface BuoyModelProps {
  position?: [number, number, number];
  scale?: number;
  /** Show a pulsing beacon light */
  beacon?: boolean;
  /** Beacon color */
  beaconColor?: string;
  /** Show a floating antenna */
  antenna?: boolean;
  /** Buoy bobs on water */
  floating?: boolean;
  /** Label displayed above buoy */
  label?: string;
}

/**
 * BuoyModel — oceanographic sensor buoy with beacon and antenna.
 */
export function BuoyModel({
  position = [0, 0, 0],
  scale = 1,
  beacon = true,
  beaconColor = '#22d3ee',
  antenna = true,
  floating = true,
}: BuoyModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!floating || !groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.position.y = position[1] + Math.sin(t * 1.1) * 0.06;
    groupRef.current.rotation.z = Math.sin(t * 0.7) * 0.05;
    groupRef.current.rotation.x = Math.sin(t * 0.5 + 1) * 0.04;
  });

  const bodyMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#facc15',
        roughness: 0.5,
        metalness: 0.3,
        clearcoat: 0.7,
        clearcoatRoughness: 0.3,
      }),
    []
  );

  const darkMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#1e293b',
        roughness: 0.7,
        metalness: 0.4,
      }),
    []
  );

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Main float — flattened sphere */}
      <mesh castShadow receiveShadow material={bodyMat}>
        <sphereGeometry args={[0.5, 24, 16]} />
      </mesh>
      <mesh castShadow position={[0, -0.15, 0]} scale={[1, 0.6, 1]} material={bodyMat}>
        <sphereGeometry args={[0.5, 24, 16]} />
      </mesh>

      {/* Lower skirt — tapered cylinder */}
      <mesh position={[0, -0.45, 0]} castShadow material={darkMat}>
        <cylinderGeometry args={[0.35, 0.5, 0.4, 16]} />
      </mesh>

      {/* Water line ring */}
      <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.5, 0.58, 32]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} side={THREE.DoubleSide} />
      </mesh>

      {/* Top platform */}
      <mesh position={[0, 0.45, 0]} castShadow material={darkMat}>
        <cylinderGeometry args={[0.2, 0.28, 0.15, 16]} />
      </mesh>

      {/* Antenna mast */}
      {antenna && (
        <>
          <mesh position={[0, 0.9, 0]} castShadow material={darkMat}>
            <cylinderGeometry args={[0.015, 0.02, 0.7, 8]} />
          </mesh>
          {/* Small dish */}
          <mesh position={[0, 1.28, 0]} rotation={[0.4, 0, 0]} castShadow material={darkMat}>
            <sphereGeometry args={[0.08, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          </mesh>
        </>
      )}

      {/* Beacon */}
      {beacon && <Beacon color={beaconColor} position={[0, 0.6, 0]} />}

      {/* Sensor arms */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[Math.cos(angle) * 0.55, 0.1, Math.sin(angle) * 0.55]}
          rotation={[0, -angle, 0]}
          castShadow
          material={darkMat}
        >
          <boxGeometry args={[0.2, 0.03, 0.03]} />
        </mesh>
      ))}
    </group>
  );
}

function Beacon({ color, position }: { color: string; position: [number, number, number] }) {
  const ref = React.useRef<THREE.Mesh>(null);
  const lightRef = React.useRef<THREE.PointLight>(null);
  const matRef = React.useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const pulse = (Math.sin(t * 3) + 1) / 2;
    if (matRef.current) matRef.current.opacity = 0.4 + pulse * 0.6;
    if (lightRef.current) lightRef.current.intensity = 0.5 + pulse * 1.5;
    if (ref.current) {
      const s = 1 + pulse * 0.15;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <>
      <mesh ref={ref} position={position}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshBasicMaterial ref={matRef} color={color} transparent opacity={0.9} />
      </mesh>
      <pointLight
        ref={lightRef}
        position={position}
        color={color}
        intensity={1.5}
        distance={4}
        decay={2}
      />
    </>
  );
}