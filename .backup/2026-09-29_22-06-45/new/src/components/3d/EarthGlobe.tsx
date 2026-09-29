import * as React from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface EarthGlobeProps {
  /** World radius */
  radius?: number;
  /** Path to earth texture map */
  textureUrl?: string;
  /** Path to bump/displacement map */
  bumpUrl?: string;
  /** Path to specular map (oceans shine) */
  specularUrl?: string;
  /** Path to cloud map */
  cloudUrl?: string;
  /** Slow rotation speed */
  rotationSpeed?: number;
  /** Enable atmospheric glow */
  atmosphere?: boolean;
  /** Show data arcs across globe */
  showArcs?: boolean;
  /** Position */
  position?: [number, number, number];
  /** Tilt in radians */
  tilt?: number;
}

/**
 * EarthGlobe — cinematic Earth rendered at high fidelity.
 * If textures are unavailable, falls back to a procedurally shaded sphere
 * with ocean/land approximation so the globe is never blank.
 */
export function EarthGlobe({
  radius = 2,
  textureUrl,
  bumpUrl,
  specularUrl,
  cloudUrl,
  rotationSpeed = 0.05,
  atmosphere = true,
  showArcs = true,
  position = [0, 0, 0],
  tilt = 0.41,
}: EarthGlobeProps) {
  const groupRef = React.useRef<THREE.Group>(null);
  const cloudsRef = React.useRef<THREE.Mesh>(null);
  const arcsRef = React.useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * (rotationSpeed * 1.3);
    }
    if (arcsRef.current) {
      arcsRef.current.rotation.y += delta * rotationSpeed;
    }
  });

  return (
    <group position={position} rotation={[0, 0, tilt]}>
      <group ref={groupRef}>
        {textureUrl ? (
          <TexturedEarth
            radius={radius}
            textureUrl={textureUrl}
            bumpUrl={bumpUrl}
            specularUrl={specularUrl}
          />
        ) : (
          <ProceduralEarth radius={radius} />
        )}

        {cloudUrl && (
          <CloudLayer radius={radius} cloudUrl={cloudUrl} ref={cloudsRef} />
        )}

        {showArcs && (
          <group ref={arcsRef}>
            <DataArcs radius={radius} />
          </group>
        )}

        {atmosphere && <AtmosphereLayer radius={radius} />}
      </group>

      <directionalLight
        position={[5, 2, 4]}
        intensity={2.2}
        color="#fff7ed"
        castShadow
      />
      <directionalLight position={[-4, -1, -3]} intensity={0.35} color="#06b6d4" />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Textured Earth                                */
/* -------------------------------------------------------------------------- */

function TexturedEarth({
  radius,
  textureUrl,
  bumpUrl,
  specularUrl,
}: {
  radius: number;
  textureUrl: string;
  bumpUrl?: string;
  specularUrl?: string;
}) {
  const [map, bump, specular] = useTexture([
    textureUrl,
    bumpUrl ?? textureUrl,
    specularUrl ?? textureUrl,
  ]);

  React.useEffect(() => {
    if (map) {
      map.colorSpace = THREE.SRGBColorSpace;
      map.anisotropy = 8;
    }
  }, [map]);

  return (
    <mesh castShadow receiveShadow>
      <sphereGeometry args={[radius, 96, 64]} />
      <meshPhysicalMaterial
        map={map}
        bumpMap={bump}
        bumpScale={0.02}
        roughnessMap={specular}
        roughness={0.75}
        metalness={0.05}
        clearcoat={0.15}
        clearcoatRoughness={0.5}
        sheen={0.4}
        sheenColor={new THREE.Color('#06b6d4')}
        envMapIntensity={0.6}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/*                            Procedural Earth                                */
/* -------------------------------------------------------------------------- */

function ProceduralEarth({ radius }: { radius: number }) {
  const oceanMat = React.useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#0c4a6e',
        roughness: 0.4,
        metalness: 0.1,
        clearcoat: 0.8,
        clearcoatRoughness: 0.2,
        envMapIntensity: 1.2,
      }),
    []
  );

  const landMat = React.useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0f766e',
        roughness: 0.9,
        metalness: 0.05,
      }),
    []
  );

  // Dispose materials on unmount to release GPU memory.
  React.useEffect(() => {
    return () => {
      oceanMat.dispose();
      landMat.dispose();
    };
  }, [oceanMat, landMat]);

  const continents = React.useMemo(() => {
    const shapes: {
      position: [number, number, number];
      scale: [number, number, number];
    }[] = [];
    let seed = 12345;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    for (let i = 0; i < 14; i++) {
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(2 * rand() - 1);
      const r = radius * 1.002;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      const s = 0.15 + rand() * 0.25;
      shapes.push({
        position: [x, y, z],
        scale: [s, s * (0.6 + rand() * 0.5), s * 0.9],
      });
    }
    return shapes;
  }, [radius]);

  return (
    <group>
      <mesh castShadow receiveShadow material={oceanMat}>
        <sphereGeometry args={[radius, 96, 64]} />
      </mesh>

      {continents.map((c, i) => (
        <mesh
          key={i}
          position={c.position}
          scale={c.scale}
          material={landMat}
        >
          <sphereGeometry args={[1, 24, 16]} />
        </mesh>
      ))}
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Cloud Layer                                  */
/* -------------------------------------------------------------------------- */

const CloudLayer = React.forwardRef<
  THREE.Mesh,
  { radius: number; cloudUrl: string }
>(({ radius, cloudUrl }, ref) => {
  const cloudMap = useTexture(cloudUrl);

  React.useEffect(() => {
    if (cloudMap) {
      cloudMap.colorSpace = THREE.SRGBColorSpace;
      cloudMap.anisotropy = 4;
    }
  }, [cloudMap]);

  return (
    <mesh ref={ref} scale={radius * 1.01}>
      <sphereGeometry args={[1, 64, 48]} />
      <meshStandardMaterial
        map={cloudMap}
        transparent
        opacity={0.35}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
});
CloudLayer.displayName = 'CloudLayer';

/* -------------------------------------------------------------------------- */
/*                            Data Arcs (AIS/ISL)                             */
/* -------------------------------------------------------------------------- */

function DataArcs({ radius }: { radius: number }) {
  const arcs = React.useMemo(() => {
    const arr: {
      start: THREE.Vector3;
      end: THREE.Vector3;
      color: string;
    }[] = [];
    const colors = ['#06b6d4', '#14b8a6', '#40e0d0', '#8b5cf6'];
    for (let i = 0; i < 8; i++) {
      const theta1 = Math.random() * Math.PI * 2;
      const phi1 = Math.acos(2 * Math.random() - 1);
      const theta2 = Math.random() * Math.PI * 2;
      const phi2 = Math.acos(2 * Math.random() - 1);
      const r = radius * 1.01;
      arr.push({
        start: new THREE.Vector3(
          r * Math.sin(phi1) * Math.cos(theta1),
          r * Math.cos(phi1),
          r * Math.sin(phi1) * Math.sin(theta1)
        ),
        end: new THREE.Vector3(
          r * Math.sin(phi2) * Math.cos(theta2),
          r * Math.cos(phi2),
          r * Math.sin(phi2) * Math.sin(theta2)
        ),
        color: colors[i % colors.length] ?? '#06b6d4',
      });
    }
    return arr;
  }, [radius]);

  return (
    <>
      {arcs.map((arc, i) => (
        <ArcLine
          key={i}
          start={arc.start}
          end={arc.end}
          color={arc.color}
          radius={radius}
        />
      ))}
    </>
  );
}

function ArcLine({
  start,
  end,
  color,
  radius,
}: {
  start: THREE.Vector3;
  end: THREE.Vector3;
  color: string;
  radius: number;
}) {
  const { geometry, material } = React.useMemo(() => {
    const mid = start.clone().add(end).multiplyScalar(0.5);
    mid.normalize().multiplyScalar(radius * 1.35);
    const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
    const points = curve.getPoints(40);
    const geo = new THREE.BufferGeometry().setFromPoints(points);
    const mat = new THREE.LineBasicMaterial({
      color,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    return { geometry: geo, material: mat };
  }, [start, end, radius, color]);

  // Dispose geometry and material on unmount.
  React.useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  const lineRef = React.useRef<THREE.Line>(null);
  useFrame((state) => {
    if (lineRef.current) {
      const mat = lineRef.current.material as THREE.LineBasicMaterial;
      mat.opacity =
        0.3 + Math.sin(state.clock.elapsedTime * 2 + start.x) * 0.4;
    }
  });

  const line = React.useMemo(
    () => new THREE.Line(geometry, material),
    [geometry, material]
  );

  return <primitive object={line} ref={lineRef} />;
}

/* -------------------------------------------------------------------------- */
/*                              Atmosphere Rim                                */
/* -------------------------------------------------------------------------- */

function AtmosphereLayer({ radius }: { radius: number }) {
  const material = React.useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          uColor: { value: new THREE.Color('#06b6d4') },
          uIntensity: { value: 1.2 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPos = modelViewMatrix * vec4(position, 1.0);
            vPosition = worldPos.xyz;
            gl_Position = projectionMatrix * worldPos;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uIntensity;
          varying vec3 vNormal;
          varying vec3 vPosition;
          void main() {
            vec3 viewDir = normalize(-vPosition);
            float rim = 1.0 - max(dot(viewDir, vNormal), 0.0);
            rim = pow(rim, 2.5);
            float alpha = rim * uIntensity;
            gl_FragColor = vec4(uColor, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        depthWrite: false,
      }),
    []
  );

  // Dispose the shader material on unmount.
  React.useEffect(() => {
    return () => material.dispose();
  }, [material]);

  return (
    <mesh scale={radius * 1.15} material={material}>
      <sphereGeometry args={[1, 64, 48]} />
    </mesh>
  );
}