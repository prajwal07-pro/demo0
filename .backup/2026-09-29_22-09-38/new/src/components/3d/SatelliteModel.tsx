import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';

export interface SatelliteModelProps {
  /** World position */
  position?: [number, number, number];
  /** Scale */
  scale?: number;
  /** Autonomous orbit animation around origin */
  orbiting?: boolean;
  /** Orbit radius (when orbiting) */
  orbitRadius?: number;
  /** Orbit speed */
  orbitSpeed?: number;
  /** Show a sensor beam downward */
  sensorBeam?: boolean;
  /** Sensor beam target */
  beamTarget?: [number, number, number];
  /** Enable solar panel animation */
  animatedPanels?: boolean;
  /** Show label */
  showLabel?: boolean;
}

/**
 * SatelliteModel — cinematic Earth observation satellite with solar panels,
 * sensor array, and optional downlink beam.
 *
 * Fully procedural. All materials are memoized and disposed on unmount to
 * avoid leaking GPU resources when the scene is torn down (e.g. on route
 * change away from the Explorer or Hero).
 */
export function SatelliteModel({
  position = [5, 4, 0],
  scale = 0.5,
  orbiting = false,
  orbitRadius = 6,
  orbitSpeed = 0.15,
  sensorBeam = true,
  beamTarget = [0, -3, 0],
  animatedPanels = true,
  showLabel = false,
}: SatelliteModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const panelLeftRef = React.useRef<THREE.Group>(null);
  const panelRightRef = React.useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current && orbiting) {
      groupRef.current.position.x = Math.cos(t * orbitSpeed) * orbitRadius;
      groupRef.current.position.z = Math.sin(t * orbitSpeed) * orbitRadius;
      groupRef.current.rotation.y = -t * orbitSpeed + Math.PI / 2;
    }
    if (animatedPanels && panelLeftRef.current && panelRightRef.current) {
      const tilt = Math.sin(t * 0.4) * 0.08;
      panelLeftRef.current.rotation.x = tilt;
      panelRightRef.current.rotation.x = -tilt;
    }
  });

  const bodyMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#334155',
        roughness: 0.35,
        metalness: 0.85,
        clearcoat: 0.5,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.4,
      }),
    []
  );

  const panelMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0f172a',
        roughness: 0.15,
        metalness: 0.6,
        clearcoat: 1,
        emissive: new THREE.Color('#06b6d4'),
        emissiveIntensity: 0.15,
      }),
    []
  );

  const goldMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#fbbf24',
        roughness: 0.4,
        metalness: 1,
        envMapIntensity: 1.6,
      }),
    []
  );

  const lensMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#06b6d4',
        emissive: new THREE.Color('#06b6d4'),
        emissiveIntensity: 0.8,
        roughness: 0.1,
        metalness: 0.9,
      }),
    []
  );

  // Dispose materials on unmount.
  React.useEffect(() => {
    return () => {
      bodyMat.dispose();
      panelMat.dispose();
      goldMat.dispose();
      lensMat.dispose();
    };
  }, [bodyMat, panelMat, goldMat, lensMat]);

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Central body — hexagonal prism */}
      <mesh castShadow material={bodyMat}>
        <cylinderGeometry args={[0.35, 0.35, 0.6, 6]} />
      </mesh>

      {/* Sensor lens */}
      <mesh position={[0, -0.4, 0]} castShadow material={bodyMat}>
        <cylinderGeometry args={[0.2, 0.15, 0.15, 16]} />
      </mesh>
      <mesh position={[0, -0.5, 0]} material={lensMat}>
        <sphereGeometry args={[0.12, 16, 16]} />
      </mesh>

      {/* Gold foil top */}
      <mesh position={[0, 0.35, 0]} material={goldMat}>
        <cylinderGeometry args={[0.36, 0.3, 0.15, 6]} />
      </mesh>

      {/* Solar panel arms and panels */}
      <group ref={panelLeftRef} position={[0, 0.1, 0]}>
        <mesh position={[-0.55, 0, 0]} castShadow material={bodyMat}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
        </mesh>
        <mesh position={[-1.1, 0, 0]} castShadow material={panelMat}>
          <boxGeometry args={[0.9, 0.02, 0.5]} />
        </mesh>
        <mesh position={[-1.1, 0.012, 0]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
        <mesh position={[-1.1, 0.012, 0.15]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
        <mesh position={[-1.1, 0.012, -0.15]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
      </group>

      <group ref={panelRightRef} position={[0, 0.1, 0]}>
        <mesh position={[0.55, 0, 0]} castShadow material={bodyMat}>
          <boxGeometry args={[0.6, 0.02, 0.02]} />
        </mesh>
        <mesh position={[1.1, 0, 0]} castShadow material={panelMat}>
          <boxGeometry args={[0.9, 0.02, 0.5]} />
        </mesh>
        <mesh position={[1.1, 0.012, 0]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
        <mesh position={[1.1, 0.012, 0.15]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
        <mesh position={[1.1, 0.012, -0.15]} material={bodyMat}>
          <boxGeometry args={[0.9, 0.001, 0.02]} />
        </mesh>
      </group>

      {/* Antenna dish on top */}
      <mesh
        position={[0, 0.55, 0]}
        rotation={[Math.PI, 0, 0]}
        castShadow
        material={goldMat}
      >
        <sphereGeometry
          args={[0.18, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
      </mesh>
      <mesh position={[0, 0.7, 0]} material={bodyMat}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 6]} />
      </mesh>

      {/* Sensor beam — a downward glow */}
      {sensorBeam && <SensorBeam from={[0, -0.5, 0]} to={beamTarget} />}

      {/* Cyan glow light */}
      <pointLight color="#06b6d4" intensity={0.8} distance={3} decay={2} />

      {showLabel && (
        <Html
          position={[0, 1.2, 0]}
          center
          distanceFactor={15}
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div className="rounded border border-cyan/40 bg-abyss/85 backdrop-blur-md px-2 py-1 whitespace-nowrap">
            <div className="font-mono text-[9px] tracking-widest text-cyan/70">
              SAT-01
            </div>
            <div className="font-display text-[10px] text-white">
              Earth Observation
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Sensor Beam                                   */
/* -------------------------------------------------------------------------- */

function SensorBeam({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  const geometry = React.useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const mid = start.clone().add(end).multiplyScalar(0.5);
    const dir = end.clone().sub(start);
    const len = dir.length();

    const cone = new THREE.ConeGeometry(0.8, len, 24, 1, true);
    cone.translate(0, -len / 2, 0);
    cone.rotateX(Math.PI);

    const quat = new THREE.Quaternion();
    const up = new THREE.Vector3(0, 1, 0);
    const normalizedDir = dir.clone().normalize();
    quat.setFromUnitVectors(up, normalizedDir);

    const mat = new THREE.Matrix4().makeRotationFromQuaternion(quat);
    mat.setPosition(mid.x, mid.y, mid.z);

    cone.applyMatrix4(mat);
    return cone;
  }, [from, to]);

  const mat = React.useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#06b6d4',
        transparent: true,
        opacity: 0.12,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  );

  // Dispose geometry + material on unmount.
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      mat.dispose();
    };
  }, [geometry, mat]);

  return <mesh geometry={geometry} material={mat} />;
}