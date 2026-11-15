import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Procedural Terrain Base matching catalogued landing sites & NASA telemetry reference
function TerrainBase({ type = 'lunar', radius = 2.8 }) {
  const isLunar = type === 'lunar';

  // Procedural rock positions on the landing site terrain
  const rocks = useMemo(() => {
    const arr = [];
    const seed = isLunar ? 42 : 108;
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + (Math.sin(i * seed) * 0.3);
      const dist = 0.9 + Math.abs(Math.sin(i * 3.7)) * 1.5;
      const x = Math.cos(angle) * dist;
      const z = Math.sin(angle) * dist;
      const s = 0.03 + Math.abs(Math.cos(i * 2.1)) * 0.06;
      arr.push({ x, z, s, id: i });
    }
    return arr;
  }, [isLunar]);

  // Primary surface color & tone
  const surfaceColor = isLunar ? '#30343a' : '#69382b';
  const rimColor = isLunar ? '#94a3b8' : '#ea580c';

  return (
    <group position={[0, -0.72, 0]}>
      {/* 1. Main Circular Geological Terrain Disc */}
      <mesh receiveShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[radius, radius + 0.25, 0.18, 64]} />
        <meshStandardMaterial
          color={surfaceColor}
          roughness={0.94}
          metalness={0.06}
          flatShading
        />
      </mesh>

      {/* 2. Soft Perimeter Contact Drop-Shadow Ground Circle */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.095, 0]}>
        <circleGeometry args={[radius + 0.65, 64]} />
        <meshBasicMaterial
          color="#040507"
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      {/* 3. Surface Regolith Boulders & Impact Ejecta */}
      {rocks.map((r) => (
        <mesh
          key={r.id}
          position={[r.x, 0.09, r.z]}
          scale={[r.s, r.s * 0.7, r.s]}
          castShadow
          receiveShadow
        >
          <dodecahedronGeometry args={[1, 0]} />
          <meshStandardMaterial
            color={isLunar ? '#474c56' : '#884433'}
            roughness={0.96}
            metalness={0.04}
          />
        </mesh>
      ))}

      {/* 4. NASA Mission Control Coordinate Telemetry Ring (Ref: Astravex HUD) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.095, 0]}>
        <ringGeometry args={[radius - 0.06, radius - 0.02, 64]} />
        <meshBasicMaterial
          color={rimColor}
          transparent
          opacity={0.35}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 5. Outer Faint Orbital Perimeter Guide */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.095, 0]}>
        <ringGeometry args={[radius + 0.28, radius + 0.31, 64]} />
        <meshBasicMaterial
          color={rimColor}
          transparent
          opacity={0.15}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default function SiteModel({
  modelPath,
  scale = 0.36,
  modelPosition = [0, 0, 0],
  modelRotation = [0, 0, 0],
  terrainType = 'lunar',
  rotationSpeed = 0.0012,
  isPaused = false,
  isActive = true
}) {
  const modelGroupRef = useRef();
  const tiltGroupRef = useRef();
  const { scene } = useGLTF(modelPath);

  // Clone scene so materials/instances are isolated and shadows enabled
  const clonedScene = useMemo(() => {
    const copy = scene.clone(true);
    copy.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.roughness = Math.max(0.25, child.material.roughness || 0.4);
          child.material.metalness = Math.min(0.85, child.material.metalness || 0.2);
        }
      }
    });
    return copy;
  }, [scene]);

  // Frame loop: Continuous rotation + Dynamic Cursor Parallax Tilt (matches Planet.jsx)
  useFrame((state, delta) => {
    if (modelGroupRef.current && !isPaused) {
      modelGroupRef.current.rotation.y += rotationSpeed * (delta * 60);
    }

    if (tiltGroupRef.current && isActive) {
      const targetTiltX = -state.mouse.y * 0.18;
      const targetTiltZ = -state.mouse.x * 0.15;

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
      <group ref={modelGroupRef}>
        {/* Terrain Base Consistent with Catalogued Landing Sites */}
        <TerrainBase type={terrainType} radius={2.6} />

        {/* 3D NASA Asset Model */}
        <group position={modelPosition} rotation={modelRotation}>
          <primitive object={clonedScene} scale={scale} />
        </group>

        {/* Interactive Grab Hit Area */}
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
            <cylinderGeometry args={[2.8, 2.8, 3.2, 32]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        )}
      </group>
    </group>
  );
}

// Preload official NASA models for instantaneous transitions
useGLTF.preload('/apollo-lunar-module.glb');
useGLTF.preload('/pioneer-10.glb');
useGLTF.preload('/lunar-roving-vehicle.glb');
