import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import Hotspot from './Hotspot';

export default function Planet({
  modelPath,
  scale = 0.004,
  rotationSpeed = 0.0015,
  isPaused = false,
  hotspots = [],
  selectedHotspot = null,
  onSelectHotspot,
  onCloseHotspot,
  atmosphereColor = null
}) {
  const planetRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone scene so materials/instances are isolated
  const clonedScene = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        // Boost roughness/metalness subtlety for deep dark aesthetic
        if (child.material) {
          child.material.roughness = Math.max(0.3, child.material.roughness || 0.5);
          child.material.metalness = Math.min(0.2, child.material.metalness || 0.1);
        }
      }
    });
    return copy;
  }, [scene]);

  // Subtle continuous rotation unless paused
  useFrame((state, delta) => {
    if (planetRef.current && !isPaused) {
      planetRef.current.rotation.y += rotationSpeed * (delta * 60);
    }
  });

  return (
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

      {/* Surface Hotspots anchored directly in this planet's local space */}
      {hotspots.map((spot) => (
        <Hotspot
          key={spot.id}
          spot={spot}
          isSelected={selectedHotspot?.id === spot.id}
          onSelect={onSelectHotspot}
          onClose={onCloseHotspot}
        />
      ))}
    </group>
  );
}

// Preload models for instantaneous transitions
useGLTF.preload('/earth.glb');
useGLTF.preload('/moon.glb');
useGLTF.preload('/mars.glb');
