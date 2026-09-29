import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export interface MarineDroneProps {
  position?: [number, number, number];
  scale?: number;
  /** Speed of rotor spin multiplier */
  rotorSpeed?: number;
  /** Enable hovering bob */
  hovering?: boolean;
  /** Show a downward scan beam */
  scanning?: boolean;
  /** Accent color */
  color?: string;
}

/**
 * MarineDrone — aerial/surface hybrid drone for coastal surveillance.
 * Quad-rotor silhouette with downward scanning beam.
 */
export function MarineDrone({
  position = [0, 3, 0],
  scale = 1,
  rotorSpeed = 1,
  hovering = true,
  scanning = true,
  color = '#22d3ee',
}: MarineDroneProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const rotorsRef = React.useRef<THREE.Group[]>([]);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && hovering) {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.2) * 0.15;
      groupRef.current.rotation.z = Math.sin(t * 0.8) * 0.05;
      groupRef.current.rotation.x = Math.cos(t * 0.9) * 0.05;
    }
    rotorsRef.current.forEach((r) => {
      if (r) r.rotation.y += delta * 30 * rotorSpeed;
    });
  });

  const bodyMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.4,
        metalness: 0.6,
        clearcoat: 0.7,
        clearcoatRoughness: 0.25,
      }),
    []
  );

  const accentMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.3,
        roughness: 0.3,
        metalness: 0.6,
      }),
    [color]
  );

  const rotorMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0f172a',
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.85,
      }),
    []
  );

  const rotorPositions: [number, number, number][] = [
    [0.5, 0.1, 0.5],
    [-0.5, 0.1, 0.5],
    [0.5, 0.1, -0.5],
    [-0.5, 0.1, -0.5],
  ];

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central body */}
      <mesh castShadow>
        <boxGeometry args={[0.5, 0.15, 0.5]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Rounded top */}
      <mesh position={[0, 0.1, 0]} castShadow>
        <sphereGeometry args={[0.22, 20, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>

      {/* Camera gimbal underneath */}
      <mesh position={[0, -0.15, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <primitive object={bodyMat} attach="material" />
      </mesh>
      <mesh position={[0, -0.2, 0.06]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Arms + rotors */}
      {rotorPositions.map((pos, i) => (
        <group key={i}>
          <mesh
            position={[pos[0] * 0.55, pos[1], pos[2] * 0.55]}
            rotation={[0, Math.atan2(pos[2], pos[0]), 0]}
            castShadow
          >
            <boxGeometry args={[0.55, 0.03, 0.08]} />
            <primitive object={bodyMat} attach="material" />
          </mesh>
          <mesh position={pos} castShadow>
            <cylinderGeometry args={[0.06, 0.06, 0.1, 12]} />
            <primitive object={bodyMat} attach="material" />
          </mesh>
          <group
            position={[pos[0], pos[1] + 0.08, pos[2]]}
            ref={(el) => {
              if (el) rotorsRef.current[i] = el;
            }}
          >
            {[0, Math.PI / 2].map((angle, j) => (
              <mesh key={j} rotation={[0, angle, 0]} castShadow>
                <boxGeometry args={[0.5, 0.008, 0.02]} />
                <primitive object={rotorMat} attach="material" />
              </mesh>
            ))}
          </group>
        </group>
      ))}

      {/* Status light */}
      <mesh position={[0, 0.2, 0]}>
        <sphereGeometry args={[0.03, 8, 8]} />
        <primitive object={accentMat} attach="material" />
      </mesh>

      {/* Scanning beam */}
      {scanning && (
        <mesh position={[0, -3, 0]}>
          <coneGeometry args={[2.5, 5.5, 32, 1, true]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            side={THREE.DoubleSide}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}

      {/* Downward light */}
      {scanning && (
        <spotLight
          color={color}
          intensity={1.5}
          distance={8}
          angle={Math.PI / 6}
          penumbra={0.9}
          position={[0, -0.2, 0]}
          target-position={[0, -8, 0]}
        />
      )}

      <pointLight color={color} intensity={0.4} distance={2} decay={2} />
    </group>
  );
}