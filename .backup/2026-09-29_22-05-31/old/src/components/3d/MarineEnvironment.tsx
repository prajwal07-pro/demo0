import * as React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment as DreiEnvironment, Sky } from '@react-three/drei';
import * as THREE from 'three';

export interface MarineEnvironmentProps {
  /** Depth of the scene in world units */
  depth?: number;
  /** Fog density */
  fogDensity?: number;
  /** Enable caustic-like lighting */
  caustics?: boolean;
  /** Time of day mood */
  mood?: 'dawn' | 'day' | 'dusk' | 'night';
  /** Camera-relative light following */
  followCamera?: boolean;
}

const MOOD_CONFIG = {
  dawn: {
    ambient: '#ff9b6a',
    ambientIntensity: 0.35,
    key: '#ffb98a',
    keyIntensity: 1.6,
    fill: '#0e7490',
    fillIntensity: 0.6,
    fog: '#0b1d2e',
    skyTop: '#1e3a5f',
    skyBottom: '#f4a261',
  },
  day: {
    ambient: '#a5f3fc',
    ambientIntensity: 0.45,
    key: '#fff7ed',
    keyIntensity: 2.2,
    fill: '#06b6d4',
    fillIntensity: 0.7,
    fog: '#0e7490',
    skyTop: '#0ea5e9',
    skyBottom: '#e0f2fe',
  },
  dusk: {
    ambient: '#c4b5fd',
    ambientIntensity: 0.4,
    key: '#fda4af',
    keyIntensity: 1.4,
    fill: '#8b5cf6',
    fillIntensity: 0.6,
    fog: '#1e1b4b',
    skyTop: '#4338ca',
    skyBottom: '#fb923c',
  },
  night: {
    ambient: '#1e3a8a',
    ambientIntensity: 0.25,
    key: '#93c5fd',
    keyIntensity: 0.9,
    fill: '#06b6d4',
    fillIntensity: 0.5,
    fog: '#020617',
    skyTop: '#020617',
    skyBottom: '#0c4a6e',
  },
} as const;

/**
 * MarineEnvironment sets up lighting, fog, and atmospheric mood
 * for underwater and surface ocean scenes.
 */
export function MarineEnvironment({
  depth = 200,
  fogDensity = 0.008,
  caustics = true,
  mood = 'night',
  followCamera = true,
}: MarineEnvironmentProps) {
  const { scene, camera } = useThree();
  const config = MOOD_CONFIG[mood];

  const keyRef = React.useRef<THREE.DirectionalLight>(null);
  const fillRef = React.useRef<THREE.PointLight>(null);

  // Configure scene fog
  React.useEffect(() => {
    const prevFog = scene.fog;
    scene.fog = new THREE.FogExp2(config.fog, fogDensity);
    return () => {
      scene.fog = prevFog;
    };
  }, [scene, config.fog, fogDensity]);

  // Follow camera with key light for consistent shine
  React.useEffect(() => {
    if (!followCamera || !keyRef.current) return;
    const light = keyRef.current;
    const update = () => {
      light.position.set(
        camera.position.x + 30,
        camera.position.y + 40,
        camera.position.z + 20
      );
      light.target.position.set(
        camera.position.x,
        camera.position.y,
        camera.position.z
      );
      light.target.updateMatrixWorld();
    };
    update();
    const id = window.setInterval(update, 500);
    return () => {
      window.clearInterval(id);
    };
  }, [camera, followCamera]);

  return (
    <>
      {/* Ambient base */}
      <ambientLight color={config.ambient} intensity={config.ambientIntensity} />

      {/* Key light (sun/surface) */}
      <directionalLight
        ref={keyRef}
        color={config.key}
        intensity={config.keyIntensity}
        position={[30, 50, 20]}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-camera-left={-60}
        shadow-camera-right={60}
        shadow-camera-top={60}
        shadow-camera-bottom={-60}
        shadow-bias={-0.0005}
      />

      {/* Fill/underwater caustic light */}
      <pointLight
        ref={fillRef}
        color={config.fill}
        intensity={config.fillIntensity}
        distance={depth}
        decay={1.5}
        position={[0, -20, 0]}
      />

      {/* Hemisphere for atmospheric depth */}
      <hemisphereLight
        color={config.skyTop}
        groundColor={config.fog}
        intensity={0.35}
      />

      {/* Optional caustic light rays (subtle) */}
      {caustics && (
        <>
          <spotLight
            color="#40e0d0"
            intensity={0.6}
            position={[15, 40, -10]}
            angle={Math.PI / 6}
            penumbra={0.8}
            distance={120}
            decay={2}
          />
          <spotLight
            color="#06b6d4"
            intensity={0.4}
            position={[-25, 35, 15]}
            angle={Math.PI / 8}
            penumbra={0.9}
            distance={140}
            decay={2}
          />
        </>
      )}

      {/* Sky for reflections (uses drei's Environment with a preset) */}
      <DreiEnvironment preset="night" background={false} />

      {/* Explicit sky only for surface scenes */}
      {mood !== 'night' && (
        <Sky
          distance={450000}
          sunPosition={[0, 1, 0]}
          inclination={0.6}
          azimuth={0.25}
        />
      )}
    </>
  );
}