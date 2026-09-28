import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

export interface OrcaModelProps {
  /** Path to GLB model. If not provided, uses a procedural stand-in. */
  url?: string;
  /** World position */
  position?: [number, number, number];
  /** Rotation in radians */
  rotation?: [number, number, number];
  /** Scale */
  scale?: number;
  /** Autonomous swim animation */
  animated?: boolean;
  /** Follow the camera slightly */
  followCamera?: boolean;
  /** Show holographic outline for sci-fi accent */
  holographic?: boolean;
  /** Enable shadow casting */
  castShadow?: boolean;
}

/**
 * OrcaModel renders the flagship creature of ORCA.
 *
 * Priority:
 * 1. If a GLB model path is provided, load it.
 * 2. Otherwise, use a procedural cinematic placeholder that's still visually
 *    impressive (smooth, glossy, glow accents) — not a crude primitive.
 */
export function OrcaModel({
  url,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  animated = true,
  followCamera = true,
  holographic = true,
  castShadow = true,
}: OrcaModelProps) {
  if (url) {
    return (
      <GLBOrca
        url={url}
        position={position}
        rotation={rotation}
        scale={scale}
        animated={animated}
        castShadow={castShadow}
      />
    );
  }
  return (
    <ProceduralOrca
      position={position}
      rotation={rotation}
      scale={scale}
      animated={animated}
      followCamera={followCamera}
      holographic={holographic}
      castShadow={castShadow}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                             GLB-based Orca                                 */
/* -------------------------------------------------------------------------- */

function GLBOrca({
  url,
  position,
  rotation,
  scale,
  animated,
  castShadow,
}: {
  url: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  animated: boolean;
  castShadow: boolean;
}) {
  const { scene } = useGLTF(url);
  const ref = React.useRef<THREE.Group>(null);

  const cloned = React.useMemo(() => scene.clone(true), [scene]);

  React.useEffect(() => {
    cloned.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh;
        mesh.castShadow = castShadow;
        mesh.receiveShadow = true;
        if (mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((m) => {
            if ('envMapIntensity' in m) {
              (m as THREE.MeshStandardMaterial).envMapIntensity = 1.2;
            }
          });
        }
      }
    });
  }, [cloned, castShadow]);

  useFrame((state) => {
    if (!animated || !ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.position.y = Math.sin(t * 0.6) * 0.15;
    ref.current.rotation.z = Math.sin(t * 0.4) * 0.05;
    ref.current.rotation.y = Math.sin(t * 0.25) * 0.1;
  });

  return (
    <group ref={ref} position={position} rotation={rotation} scale={scale}>
      <primitive object={cloned} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Procedural Cinematic Orca                         */
/* -------------------------------------------------------------------------- */

function ProceduralOrca({
  position,
  rotation,
  scale,
  animated,
  followCamera,
  holographic,
  castShadow,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  animated: boolean;
  followCamera: boolean;
  holographic: boolean;
  castShadow: boolean;
}) {
  const groupRef = React.useRef<THREE.Group>(null);
  const bodyRef = React.useRef<THREE.Group>(null);
  const tailRef = React.useRef<THREE.Group>(null);
  const { camera } = useThree();

  const bodyMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0a0a0f',
        roughness: 0.25,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.15,
        sheen: 1,
        sheenColor: new THREE.Color('#06b6d4'),
        sheenRoughness: 0.4,
        envMapIntensity: 1.4,
      }),
    []
  );

  const patchMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#f1f5f9',
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        sheen: 0.6,
        sheenColor: new THREE.Color('#40e0d0'),
        envMapIntensity: 1.2,
      }),
    []
  );

  const eyeMaterial = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#000000',
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1,
      }),
    []
  );

  const holoMaterial = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#22d3ee',
        transparent: true,
        opacity: 0.15,
        side: THREE.BackSide,
      }),
    []
  );

  useFrame((state) => {
    if (!animated || !groupRef.current || !bodyRef.current || !tailRef.current) return;
    const t = state.clock.elapsedTime;

    bodyRef.current.position.y = Math.sin(t * 0.8) * 0.08;
    tailRef.current.rotation.y = Math.sin(t * 2.2) * 0.35;
    bodyRef.current.rotation.z = Math.sin(t * 0.5) * 0.04;
    bodyRef.current.rotation.x = Math.sin(t * 0.3) * 0.02;

    if (followCamera) {
      const camDir = camera.position.clone().normalize();
      const targetRot = Math.atan2(camDir.x, camDir.z);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRot * 0.15,
        0.02
      );
    }
  });

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <group ref={bodyRef}>
        <mesh castShadow={castShadow} receiveShadow material={bodyMaterial}>
          <sphereGeometry args={[1, 48, 32]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
        <mesh
          position={[0, 0, 0]}
          scale={[1.2, 0.75, 1.7]}
          castShadow={castShadow}
          receiveShadow
        >
          <sphereGeometry args={[1, 48, 32]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        <mesh position={[0, -0.35, 0.2]} scale={[0.9, 0.35, 1.4]} castShadow={castShadow}>
          <sphereGeometry args={[1, 32, 24]} />
          <primitive object={patchMaterial} attach="material" />
        </mesh>

        <mesh
          position={[0.62, 0.28, 0.7]}
          rotation={[0, 0.4, 0]}
          scale={[0.18, 0.28, 0.5]}
          castShadow={castShadow}
        >
          <sphereGeometry args={[1, 24, 16]} />
          <primitive object={patchMaterial} attach="material" />
        </mesh>
        <mesh
          position={[-0.62, 0.28, 0.7]}
          rotation={[0, -0.4, 0]}
          scale={[0.18, 0.28, 0.5]}
          castShadow={castShadow}
        >
          <sphereGeometry args={[1, 24, 16]} />
          <primitive object={patchMaterial} attach="material" />
        </mesh>

        <mesh position={[0.72, 0.22, 1.05]} castShadow={castShadow}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>
        <mesh position={[-0.72, 0.22, 1.05]} castShadow={castShadow}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <primitive object={eyeMaterial} attach="material" />
        </mesh>

        <mesh
          position={[0, 0.85, -0.3]}
          rotation={[0.2, 0, 0]}
          castShadow={castShadow}
        >
          <coneGeometry args={[0.18, 1.1, 4]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        <mesh
          position={[0.75, -0.15, 0.4]}
          rotation={[0, 0.3, -0.9]}
          scale={[0.15, 0.6, 0.3]}
          castShadow={castShadow}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>
        <mesh
          position={[-0.75, -0.15, 0.4]}
          rotation={[0, -0.3, 0.9]}
          scale={[0.15, 0.6, 0.3]}
          castShadow={castShadow}
        >
          <sphereGeometry args={[1, 16, 12]} />
          <primitive object={bodyMaterial} attach="material" />
        </mesh>

        <group ref={tailRef} position={[0, 0, -1.6]}>
          <mesh rotation={[Math.PI / 2, 0, 0]} castShadow={castShadow}>
            <coneGeometry args={[0.35, 0.9, 16]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>

          <mesh
            position={[0, 0, -0.55]}
            rotation={[0, 0, Math.PI / 2]}
            scale={[0.5, 0.9, 0.12]}
            castShadow={castShadow}
          >
            <coneGeometry args={[0.4, 1, 16]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
          <mesh
            position={[0, 0, -0.55]}
            rotation={[0, 0, -Math.PI / 2]}
            scale={[0.5, 0.9, 0.12]}
            castShadow={castShadow}
          >
            <coneGeometry args={[0.4, 1, 16]} />
            <primitive object={bodyMaterial} attach="material" />
          </mesh>
        </group>

        {holographic && (
          <mesh scale={1.15}>
            <sphereGeometry args={[1.6, 32, 24]} />
            <primitive object={holoMaterial} attach="material" />
          </mesh>
        )}
      </group>

      <pointLight color="#22d3ee" intensity={0.8} distance={6} decay={2} />
    </group>
  );
}

/**
 * Call this early in the app to warm up the GLB cache.
 * Safe to call if no GLB is used (no-op).
 */
export function preloadOrca(url?: string) {
  if (url) useGLTF.preload(url);
}