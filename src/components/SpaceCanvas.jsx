import React, { useRef, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Planet from './Planet';
import { HOTSPOTS_DATA } from '../data/spaceData';

gsap.registerPlugin(ScrollTrigger);

// 3D Scene container containing planets and GSAP scroll binding
function SpaceScene({
  selectedHotspot,
  onSelectHotspot,
  onCloseHotspot,
  activePlanet,
  setActivePlanet,
  scrollContainerRef
}) {
  const earthGroup = useRef();
  const moonGroup = useRef();
  const marsGroup = useRef();
  const controlsRef = useRef();

  useEffect(() => {
    // Ensure container exists
    const container = scrollContainerRef.current;
    if (!container || !earthGroup.current || !moonGroup.current || !marsGroup.current) return;

    // Initial positions
    // Earth starts centered
    earthGroup.current.position.set(0, 0, 0);
    earthGroup.current.scale.set(1, 1, 1);

    // Moon starts off-screen right & back
    moonGroup.current.position.set(10, -2, -6);
    moonGroup.current.scale.set(0.2, 0.2, 0.2);

    // Mars starts off-screen right & farther back
    marsGroup.current.position.set(12, 3, -10);
    marsGroup.current.scale.set(0.1, 0.1, 0.1);

    // Create GSAP ScrollTrigger Master Timeline
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.4, // Smooth lerping as requested
          onUpdate: (self) => {
            const p = self.progress;
            if (p < 0.35) {
              setActivePlanet('earth');
            } else if (p < 0.72) {
              setActivePlanet('moon');
            } else {
              setActivePlanet('mars');
            }
          }
        }
      });

      // === PHASE 1: Earth moves off-screen, Moon glides into center ===
      tl.to(
        earthGroup.current.position,
        {
          x: -9,
          y: 2,
          z: -6,
          ease: 'power1.inOut'
        },
        0
      )
        .to(
          earthGroup.current.scale,
          {
            x: 0.25,
            y: 0.25,
            z: 0.25,
            ease: 'power1.inOut'
          },
          0
        )
        .to(
          moonGroup.current.position,
          {
            x: 0,
            y: 0,
            z: 0,
            ease: 'power1.inOut'
          },
          0.1
        )
        .to(
          moonGroup.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'power1.inOut'
          },
          0.1
        );

      // === PHASE 2: Moon holds in center, then scales out as Mars glides in ===
      tl.to(
        moonGroup.current.position,
        {
          x: -9,
          y: -2,
          z: -6,
          ease: 'power1.inOut'
        },
        0.55
      )
        .to(
          moonGroup.current.scale,
          {
            x: 0.25,
            y: 0.25,
            z: 0.25,
            ease: 'power1.inOut'
          },
          0.55
        )
        .to(
          marsGroup.current.position,
          {
            x: 0,
            y: 0,
            z: 0,
            ease: 'power1.inOut'
          },
          0.6
        )
        .to(
          marsGroup.current.scale,
          {
            x: 1,
            y: 1,
            z: 1,
            ease: 'power1.inOut'
          },
          0.6
        );
    });

    return () => ctx.revert();
  }, [scrollContainerRef, setActivePlanet]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.8]} fov={45} />

      {/* OrbitControls with enableZoom={false} as specified */}
      <OrbitControls
        ref={controlsRef}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.65}
        dampingFactor={0.06}
        enableDamping
      />

      {/* Dynamic Dramatic Cinematic Space Lighting */}
      <ambientLight intensity={0.25} />
      {/* Sunlight */}
      <directionalLight position={[6, 3, 5]} intensity={2.2} />
      {/* Rim / Backlight for realistic planetary crescent atmosphere */}
      <directionalLight position={[-6, -2, -4]} intensity={0.4} color="#60a5fa" />

      {/* Starfield */}
      <Stars
        radius={120}
        depth={60}
        count={2800}
        factor={3.5}
        saturation={0}
        fade
        speed={0.8}
      />

      {/* Section 1: Earth */}
      <group ref={earthGroup}>
        <Planet
          modelPath="/earth.glb"
          scale={0.004}
          rotationSpeed={0.0012}
          isPaused={false}
          atmosphereColor="#3b82f6"
        />
      </group>

      {/* Section 2: Moon (with 3 interactive hotspots) */}
      <group ref={moonGroup}>
        <Planet
          modelPath="/moon.glb"
          scale={0.004}
          rotationSpeed={0.001}
          isPaused={Boolean(selectedHotspot)}
          hotspots={HOTSPOTS_DATA.moon}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={onSelectHotspot}
          onCloseHotspot={onCloseHotspot}
          atmosphereColor="#e2e8f0"
        />
      </group>

      {/* Section 3: Mars (with 3 interactive hotspots) */}
      <group ref={marsGroup}>
        <Planet
          modelPath="/mars.glb"
          scale={0.004}
          rotationSpeed={0.001}
          isPaused={Boolean(selectedHotspot)}
          hotspots={HOTSPOTS_DATA.mars}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={onSelectHotspot}
          onCloseHotspot={onCloseHotspot}
          atmosphereColor="#f97316"
        />
      </group>
    </>
  );
}

// Fixed Full-Viewport 3D Background Canvas
export default function SpaceCanvas({
  selectedHotspot,
  onSelectHotspot,
  onCloseHotspot,
  activePlanet,
  setActivePlanet,
  scrollContainerRef
}) {
  return (
    <div className="webgl-container">
      <Canvas
        shadows
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false
        }}
        onCreated={({ gl }) => {
          gl.setClearColor('#08080a');
        }}
      >
        <Suspense fallback={null}>
          <SpaceScene
            selectedHotspot={selectedHotspot}
            onSelectHotspot={onSelectHotspot}
            onCloseHotspot={onCloseHotspot}
            activePlanet={activePlanet}
            setActivePlanet={setActivePlanet}
            scrollContainerRef={scrollContainerRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
