import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { cn } from '@/lib/utils';
import { VESSEL_TYPES, type VesselTypeId } from '@/lib/constants';

export interface VesselModelProps {
  /** Vessel type for shape and color */
  type?: VesselTypeId;
  /** Vessel name to render in label */
  name?: string;
  /** MMSI to render in label */
  mmsi?: string;
  /** World position */
  position?: [number, number, number];
  /** Rotation (yaw) in radians */
  heading?: number;
  /** Speed in knots (affects bobbing) */
  speed?: number;
  /** Scale */
  scale?: number;
  /** Highlighted / selected state */
  selected?: boolean;
  /** Show a floating label */
  showLabel?: boolean;
  /** Color override */
  color?: string;
  /** Enable motion bobbing */
  animated?: boolean;
  /** On click callback */
  onClick?: () => void;
}

/**
 * VesselModel — procedural, stylized vessel representative per AIS type.
 * Replaces crude primitives with a properly-shaded, recognizable silhouette.
 * Color-coded by vessel type. Optional hover label.
 */
export function VesselModel({
  type = 'cargo',
  name,
  mmsi,
  position = [0, 0, 0],
  heading = 0,
  speed = 10,
  scale = 1,
  selected = false,
  showLabel = false,
  color,
  animated = true,
  onClick,
}: VesselModelProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const bodyRef = React.useRef<THREE.Group>(null);

  const vesselConfig = VESSEL_TYPES.find((v) => v.id === type) ?? VESSEL_TYPES[0];
  const vesselColor = color ?? vesselConfig.color;

  useFrame((state) => {
    if (!animated || !bodyRef.current) return;
    const t = state.clock.elapsedTime;
    const bobbing = Math.min(speed / 30, 0.5) * 0.08;
    bodyRef.current.position.y = Math.sin(t * 1.2 + position[0]) * bobbing;
    bodyRef.current.rotation.z = Math.sin(t * 0.8 + position[2]) * 0.02;
  });

  return (
    <group
      ref={groupRef}
      position={position}
      rotation={[0, -heading, 0]}
      scale={scale}
      onClick={(e) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    >
      {selected && (
        <>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[1.4, 1.55, 48]} />
            <meshBasicMaterial
              color={vesselColor}
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
            <ringGeometry args={[1.7, 1.72, 48]} />
            <meshBasicMaterial
              color={vesselColor}
              transparent
              opacity={0.25}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        </>
      )}

      <group ref={bodyRef}>
        <VesselSilhouette type={type} color={vesselColor} />
        <pointLight
          color={vesselColor}
          intensity={selected ? 1.2 : 0.5}
          distance={3}
          decay={2}
        />
      </group>

      {showLabel && (name || mmsi) && (
        <Html
          position={[0, 1.4, 0]}
          center
          distanceFactor={12}
          occlude
          style={{ pointerEvents: 'none' }}
        >
          <div className="whitespace-nowrap">
            <div
              className={cn(
                'rounded border bg-abyss/85 backdrop-blur-md px-2 py-1 shadow-lg',
                selected ? 'border-cyan/60' : 'border-white/15'
              )}
            >
              {name && (
                <div className="font-display text-[11px] font-semibold text-white">
                  {name}
                </div>
              )}
              {mmsi && (
                <div className="font-mono text-[9px] text-cyan/80">
                  MMSI {mmsi}
                </div>
              )}
            </div>
            <div className="mx-auto h-3 w-px bg-cyan/50" />
          </div>
        </Html>
      )}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                          Silhouettes per Vessel Type                       */
/* -------------------------------------------------------------------------- */

function VesselSilhouette({
  type,
  color,
}: {
  type: VesselTypeId;
  color: string;
}) {
  const hullMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#1e293b',
        roughness: 0.55,
        metalness: 0.3,
        clearcoat: 0.6,
        clearcoatRoughness: 0.25,
        envMapIntensity: 1,
      }),
    []
  );

  const accentMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color,
        roughness: 0.5,
        metalness: 0.5,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.15,
      }),
    [color]
  );

  const whiteMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        roughness: 0.6,
        metalness: 0.15,
      }),
    []
  );

  // Dispose materials on unmount or type change.
  React.useEffect(() => {
    return () => {
      hullMat.dispose();
      accentMat.dispose();
      whiteMat.dispose();
    };
  }, [hullMat, accentMat, whiteMat]);

  switch (type) {
    case 'cargo':
      return (
        <CargoShip hullMat={hullMat} accentMat={accentMat} whiteMat={whiteMat} />
      );
    case 'tanker':
      return (
        <TankerShip hullMat={hullMat} accentMat={accentMat} whiteMat={whiteMat} />
      );
    case 'fishing':
      return (
        <FishingBoat
          hullMat={hullMat}
          accentMat={accentMat}
          whiteMat={whiteMat}
        />
      );
    case 'passenger':
      return (
        <PassengerShip
          hullMat={hullMat}
          accentMat={accentMat}
          whiteMat={whiteMat}
        />
      );
    case 'research':
      return (
        <ResearchVessel
          hullMat={hullMat}
          accentMat={accentMat}
          whiteMat={whiteMat}
        />
      );
    case 'military':
      return (
        <MilitaryShip
          hullMat={hullMat}
          accentMat={accentMat}
          whiteMat={whiteMat}
        />
      );
    case 'tug':
      return (
        <TugBoat hullMat={hullMat} accentMat={accentMat} whiteMat={whiteMat} />
      );
    case 'pleasure':
      return (
        <PleasureCraft
          hullMat={hullMat}
          accentMat={accentMat}
          whiteMat={whiteMat}
        />
      );
    default:
      return (
        <CargoShip hullMat={hullMat} accentMat={accentMat} whiteMat={whiteMat} />
      );
  }
}

function CargoShip({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.55, 0.35, 2]} />
      </mesh>
      <mesh
        position={[0, 0.15, 1.15]}
        rotation={[0, 0, 0]}
        castShadow
        material={hullMat}
      >
        <coneGeometry args={[0.28, 0.35, 4]} />
      </mesh>
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow material={whiteMat}>
        <boxGeometry args={[0.5, 0.04, 1.9]} />
      </mesh>
      {[
        [0.15, 0.55, 0.4],
        [-0.15, 0.55, 0.4],
        [0.15, 0.55, -0.1],
        [-0.15, 0.55, -0.1],
        [0, 0.55, -0.6],
      ].map((p, i) => (
        <mesh
          key={i}
          position={p as [number, number, number]}
          castShadow
          material={accentMat}
        >
          <boxGeometry args={[0.28, 0.28, 0.42]} />
        </mesh>
      ))}
      <mesh position={[0, 0.65, -0.85]} castShadow material={whiteMat}>
        <boxGeometry args={[0.4, 0.4, 0.3]} />
      </mesh>
      <mesh position={[0, 0.95, -0.85]} castShadow material={accentMat}>
        <boxGeometry args={[0.15, 0.2, 0.1]} />
      </mesh>
    </group>
  );
}

function TankerShip({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.6, 0.4, 2.2]} />
      </mesh>
      <mesh position={[0, 0.18, 1.3]} castShadow material={hullMat}>
        <coneGeometry args={[0.3, 0.4, 4]} />
      </mesh>
      {[-0.6, 0, 0.6].map((z, i) => (
        <mesh
          key={i}
          position={[0, 0.5, z]}
          rotation={[0, 0, Math.PI / 2]}
          castShadow
          material={accentMat}
        >
          <cylinderGeometry args={[0.18, 0.18, 1.9, 16]} />
        </mesh>
      ))}
      <mesh position={[0, 0.7, -0.9]} castShadow material={whiteMat}>
        <boxGeometry args={[0.45, 0.5, 0.35]} />
      </mesh>
    </group>
  );
}

function FishingBoat({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.4, 0.25, 1.1]} />
      </mesh>
      <mesh position={[0, 0.12, 0.65]} castShadow material={hullMat}>
        <coneGeometry args={[0.2, 0.25, 4]} />
      </mesh>
      <mesh position={[0, 0.4, -0.15]} castShadow material={whiteMat}>
        <boxGeometry args={[0.28, 0.3, 0.4]} />
      </mesh>
      <mesh position={[0, 0.75, -0.15]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
      </mesh>
      <mesh position={[0, 0.28, 0.35]} castShadow material={accentMat}>
        <boxGeometry args={[0.4, 0.02, 0.3]} />
      </mesh>
    </group>
  );
}

function PassengerShip({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.6, 0.35, 2]} />
      </mesh>
      <mesh position={[0, 0.15, 1.15]} castShadow material={hullMat}>
        <coneGeometry args={[0.3, 0.35, 4]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow material={whiteMat}>
        <boxGeometry args={[0.5, 0.5, 1.6]} />
      </mesh>
      <mesh position={[0.26, 0.55, 0]} castShadow material={accentMat}>
        <boxGeometry args={[0.02, 0.08, 1.5]} />
      </mesh>
      <mesh position={[-0.26, 0.55, 0]} castShadow material={accentMat}>
        <boxGeometry args={[0.02, 0.08, 1.5]} />
      </mesh>
      <mesh position={[0, 0.9, -0.2]} castShadow material={whiteMat}>
        <boxGeometry args={[0.35, 0.2, 0.8]} />
      </mesh>
    </group>
  );
}

function ResearchVessel({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.5, 0.3, 1.6]} />
      </mesh>
      <mesh position={[0, 0.15, 0.9]} castShadow material={hullMat}>
        <coneGeometry args={[0.25, 0.3, 4]} />
      </mesh>
      <mesh position={[0, 0.5, 0.1]} castShadow material={whiteMat}>
        <boxGeometry args={[0.4, 0.4, 0.5]} />
      </mesh>
      <mesh position={[0, 1, -0.5]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.7, 6]} />
      </mesh>
      <mesh position={[0, 1.35, -0.5]} castShadow material={accentMat}>
        <sphereGeometry args={[0.06, 12, 12]} />
      </mesh>
      <mesh
        position={[0, 0.45, -0.7]}
        rotation={[0, 0, Math.PI / 4]}
        castShadow
        material={accentMat}
      >
        <boxGeometry args={[0.04, 0.5, 0.04]} />
      </mesh>
      <mesh
        position={[0, 0.45, -0.7]}
        rotation={[0, 0, -Math.PI / 4]}
        castShadow
        material={accentMat}
      >
        <boxGeometry args={[0.04, 0.5, 0.04]} />
      </mesh>
    </group>
  );
}

function MilitaryShip({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.45, 0.3, 1.8]} />
      </mesh>
      <mesh position={[0, 0.15, 1]} castShadow material={hullMat}>
        <coneGeometry args={[0.22, 0.4, 4]} />
      </mesh>
      <mesh
        position={[0, 0.5, -0.1]}
        rotation={[0, 0, Math.PI / 6]}
        castShadow
        material={whiteMat}
      >
        <boxGeometry args={[0.3, 0.45, 0.7]} />
      </mesh>
      <mesh position={[0, 0.85, -0.2]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
      </mesh>
      <mesh
        position={[0, 0.42, 0.7]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
        material={accentMat}
      >
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
      </mesh>
    </group>
  );
}

function TugBoat({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.4, 0.28, 0.9]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow material={whiteMat}>
        <boxGeometry args={[0.32, 0.5, 0.5]} />
      </mesh>
      <mesh position={[0, 0.9, -0.15]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.05, 0.06, 0.2, 10]} />
      </mesh>
    </group>
  );
}

function PleasureCraft({
  hullMat,
  accentMat,
  whiteMat,
}: {
  hullMat: THREE.Material;
  accentMat: THREE.Material;
  whiteMat: THREE.Material;
}) {
  return (
    <group>
      <mesh position={[0, 0.1, 0]} castShadow receiveShadow material={hullMat}>
        <boxGeometry args={[0.3, 0.18, 0.8]} />
      </mesh>
      <mesh position={[0, 0.1, 0.5]} castShadow material={hullMat}>
        <coneGeometry args={[0.15, 0.18, 4]} />
      </mesh>
      <mesh position={[0, 0.28, 0.05]} castShadow material={whiteMat}>
        <boxGeometry args={[0.24, 0.16, 0.35]} />
      </mesh>
      <mesh position={[0, 0.5, -0.1]} castShadow material={accentMat}>
        <cylinderGeometry args={[0.015, 0.015, 0.4, 6]} />
      </mesh>
    </group>
  );
}