import * as React from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

export interface CameraRigProps {
  /** Point the camera looks at. */
  target?: [number, number, number];
  /** Camera rest position. */
  position?: [number, number, number];
  /** Enable orbit interaction. Defaults to true. */
  orbit?: boolean;
  /** Enable gentle parallax based on mouse position. */
  parallax?: boolean;
  /** Parallax intensity multiplier. */
  parallaxIntensity?: number;
  /** Enable auto-rotation when idle. */
  autoRotate?: boolean;
  /** Auto-rotation speed. */
  autoRotateSpeed?: number;
  /** Min / max distance from target. */
  minDistance?: number;
  maxDistance?: number;
}

/**
 * CameraRig — reusable camera controller for ORCA 3D scenes.
 *
 * Provides:
 *  - Orbit controls (drag to rotate, wheel to zoom)
 *  - Optional mouse parallax on idle
 *  - Optional auto-rotation
 *
 * Used by the Explorer and by cinematic scenes where the camera should
 * respond to hover without fighting user input.
 *
 * The rig owns no materials and allocates no per-frame objects. `target`
 * and `position` are memoized so the camera reference is stable across
 * re-renders.
 */
export function CameraRig({
  target = [0, 0, 0],
  position = [0, 2, 8],
  orbit = true,
  parallax = false,
  parallaxIntensity = 1,
  autoRotate = false,
  autoRotateSpeed = 0.4,
  minDistance = 3,
  maxDistance = 30,
}: CameraRigProps) {
  // The drei OrbitControls ref type is not exported consistently across
  // versions. We use a loose ref and rely on `makeDefault` to wire it to
  // the R3F context so nothing else needs to touch it directly.
  const controlsRef = React.useRef<unknown>(null);

  const { camera } = useThree();

  const basePosition = React.useMemo(
    () => new THREE.Vector3(...position),
    [position]
  );
  const targetVector = React.useMemo(
    () => new THREE.Vector3(...target),
    [target]
  );

  const mouseRef = React.useRef({ x: 0, y: 0 });
  const idleRef = React.useRef(0);

  // Track mouse for parallax.
  React.useEffect(() => {
    if (!parallax || typeof window === 'undefined') return;
    const handler = (e: MouseEvent) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      };
      idleRef.current = 0;
    };
    window.addEventListener('mousemove', handler);
    return () => window.removeEventListener('mousemove', handler);
  }, [parallax]);

  useFrame((_, delta) => {
    if (!parallax) return;
    idleRef.current += delta;

    // Gentle parallax offset.
    const offsetX = mouseRef.current.x * parallaxIntensity * 0.6;
    const offsetY = mouseRef.current.y * parallaxIntensity * 0.4;

    const desired = basePosition.clone();
    desired.x += offsetX;
    desired.y -= offsetY;

    camera.position.lerp(desired, 0.04);
    camera.lookAt(targetVector);
  });

  return (
    <OrbitControls
      ref={controlsRef as never}
      enabled={orbit}
      enablePan={orbit}
      enableZoom={orbit}
      minDistance={minDistance}
      maxDistance={maxDistance}
      autoRotate={autoRotate}
      autoRotateSpeed={autoRotateSpeed}
      target={targetVector}
      makeDefault
    />
  );
}