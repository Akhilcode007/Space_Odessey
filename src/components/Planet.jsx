import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './Hotspot';

export default function Planet({
  modelPath,
  scale = 0.004,
  rotationSpeed = 0.001,
  isPaused = false,
  hotspots = [],
  selectedHotspot = null,
  onSelectHotspot,
  onCloseHotspot,
  atmosphereColor = null,
  isActive = true
}) {
  const planetRef = useRef();
  const tiltGroupRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone scene so materials/instances are isolated
  const clonedScene = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = Math.max(0.3, child.material.roughness || 0.5);
          child.material.metalness = Math.min(0.2, child.material.metalness || 0.1);
        }
      }
    });
    return copy;
  }, [scene]);

  // Frame loop: Continuous rotation + Dynamic Cursor Parallax Tilt
  useFrame((state, delta) => {
    // 1. Idle Planetary Spin (stops when examining a hotspot)
    if (planetRef.current && !isPaused) {
      planetRef.current.rotation.y += rotationSpeed * (delta * 60);
    }

    // 2. Cursor Parallax: Planet gently tilts towards mouse position (active model only)
    if (tiltGroupRef.current && isActive) {
      const targetTiltX = -state.mouse.y * 0.22;
      const targetTiltZ = -state.mouse.x * 0.18;

      tiltGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.x,
        targetTiltX,
        0.05
      );
      tiltGroupRef.current.rotation.z = THREE.MathUtils.lerp(
        tiltGroupRef.current.rotation.z,
        targetTiltZ,
        0.05
      );
    }
  });

  return (
    <group ref={tiltGroupRef}>
      <group ref={planetRef}>
        {/* 3D GLTF Celestial Body */}
        <primitive object={clonedScene} scale={scale} />

        {/* Atmospheric Glow Rim (if specified) */}
        {atmosphereColor && (
          <mesh scale={2.08}>
            <sphereGeometry args={[1, 64, 64]} />
            <meshBasicMaterial
              color={atmosphereColor}
              transparent
              opacity={0.08}
              side={THREE.BackSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        )}

        {/* Invisible Cursor Hit-Target & Hover Grab Feedback (only on active planet) */}
        {isActive && (
          <mesh
            onPointerOver={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'grab';
            }}
            onPointerOut={() => {
              document.body.style.cursor = 'auto';
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              document.body.style.cursor = 'grabbing';
            }}
            onPointerUp={() => {
              document.body.style.cursor = 'grab';
            }}
          >
            <sphereGeometry args={[2.08, 32, 32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}

        {/* Surface Hotspots anchored directly in this planet's local space - ONLY when active */}
        {isActive &&
          hotspots.map((spot) => (
            <Hotspot
              key={spot.id}
              spot={spot}
              isSelected={selectedHotspot?.id === spot.id}
              onSelect={onSelectHotspot}
              onClose={onCloseHotspot}
            />
          ))}
      </group>
    </group>
  );
}

// Preload models for instantaneous transitions
useGLTF.preload('/earth.glb');
useGLTF.preload('/moon.glb');
useGLTF.preload('/mars.glb');
