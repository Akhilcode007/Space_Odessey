import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import gsap from 'gsap';
import Planet from './Planet';
import SiteModel from './SiteModel';
import { HOTSPOTS_DATA } from '../data/spaceData';

// Dynamic Camera Controller that handles planet focus and orbital view
function CameraManager({
  selectedHotspot,
  activePlanet,
  selectedModelId,
  controlsRef
}) {
  const { camera } = useThree();

  useEffect(() => {
    const duration = 1.35;
    const ease = 'power2.inOut';

    if (selectedHotspot) {
      // Focus slightly closer on the active artifact
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 5.6,
        duration,
        ease
      });

      if (controlsRef.current) {
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: 0,
          z: 0,
          duration,
          ease
        });
      }
    } else {
      // Global viewing distance
      gsap.to(camera.position, {
        x: 0,
        y: 0,
        z: 6.6,
        duration: 1.5,
        ease
      });

      if (controlsRef.current) {
        const isModelsOrArchive = activePlanet === 'archive' || activePlanet === 'models';
        const targetY = isModelsOrArchive && selectedModelId === 'all' ? 0.3 : 0;
        gsap.to(controlsRef.current.target, {
          x: 0,
          y: targetY,
          z: 0,
          duration: 1.5,
          ease
        });
      }
    }
  }, [selectedHotspot, activePlanet, selectedModelId, camera, controlsRef]);

  return null;
}

// 3D Scene containing planets and site models with smooth GSAP transitions and layout framing
function SpaceScene({
  selectedHotspot,
  onSelectHotspot,
  onCloseHotspot,
  activePlanet,
  selectedModelId = 'earth',
  onSelectModelId
}) {
  const earthGroup = useRef();
  const moonGroup = useRef();
  const marsGroup = useRef();
  const apolloGroup = useRef();
  const pioneerGroup = useRef();
  const controlsRef = useRef();

  const getPlanetX = (planet = activePlanet) => {
    if (typeof window === 'undefined') return 0;
    if (window.innerWidth < 1024) return 0;
    // On Earth: shift Earth to the right to leave space for left text
    if (planet === 'earth') return 1.15;
    if (planet === 'archive' || planet === 'models') return 0.95;
    // On Moon & Mars: slight right-of-center framing between Left-Bottom card & Right Sidebar
    return -0.1;
  };

  const [planetX, setPlanetX] = useState(getPlanetX(activePlanet));

  // Listen to active planet transitions - uniform animation across all models
  useEffect(() => {
    if (
      !earthGroup.current ||
      !moonGroup.current ||
      !marsGroup.current ||
      !apolloGroup.current ||
      !pioneerGroup.current
    )
      return;

    const duration = 1.25;
    const ease = 'power2.inOut';
    const px = getPlanetX(activePlanet);
    setPlanetX(px);

    if (activePlanet === 'earth') {
      // Earth enters front & center-right
      gsap.to(earthGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
      gsap.to(earthGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

      // Moon & Mars move far off-screen to the right
      gsap.to(moonGroup.current.position, { x: 24, y: -2, z: -12, duration, ease });
      gsap.to(moonGroup.current.scale, { x: 0.15, y: 0.15, z: 0.15, duration, ease });

      gsap.to(marsGroup.current.position, { x: 32, y: 4, z: -16, duration, ease });
      gsap.to(marsGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

      // Site models off-screen
      gsap.to(apolloGroup.current.position, { x: 30, y: -5, z: -20, duration, ease });
      gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

      gsap.to(pioneerGroup.current.position, { x: 35, y: -5, z: -20, duration, ease });
      gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
    } else if (activePlanet === 'moon') {
      // Earth slides far off-screen to the left
      gsap.to(earthGroup.current.position, { x: -24, y: 2, z: -12, duration, ease });
      gsap.to(earthGroup.current.scale, { x: 0.15, y: 0.15, z: 0.15, duration, ease });

      // Moon enters front & center
      gsap.to(moonGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
      gsap.to(moonGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

      // Mars stays off-screen to the right
      gsap.to(marsGroup.current.position, { x: 24, y: 3, z: -12, duration, ease });
      gsap.to(marsGroup.current.scale, { x: 0.15, y: 0.15, z: 0.15, duration, ease });

      // Site models off-screen
      gsap.to(apolloGroup.current.position, { x: 20, y: -5, z: -20, duration, ease });
      gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

      gsap.to(pioneerGroup.current.position, { x: 25, y: -5, z: -20, duration, ease });
      gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
    } else if (activePlanet === 'mars') {
      // Earth & Moon stay far off-screen to the left
      gsap.to(earthGroup.current.position, { x: -32, y: 4, z: -16, duration, ease });
      gsap.to(earthGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

      gsap.to(moonGroup.current.position, { x: -24, y: -2, z: -12, duration, ease });
      gsap.to(moonGroup.current.scale, { x: 0.15, y: 0.15, z: 0.15, duration, ease });

      // Mars enters front & center
      gsap.to(marsGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
      gsap.to(marsGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

      // Site models off-screen
      gsap.to(apolloGroup.current.position, { x: -25, y: -5, z: -20, duration, ease });
      gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

      gsap.to(pioneerGroup.current.position, { x: -30, y: -5, z: -20, duration, ease });
      gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
    } else if (activePlanet === 'models' || activePlanet === 'archive') {
      if (selectedModelId === 'earth') {
        // Earth featured front and center
        gsap.to(earthGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

        gsap.to(moonGroup.current.position, { x: -4.2, y: -0.6, z: -4.5, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 0.32, y: 0.32, z: 0.32, duration, ease });

        gsap.to(marsGroup.current.position, { x: 4.8, y: 1.2, z: -5.0, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 0.28, y: 0.28, z: 0.28, duration, ease });

        gsap.to(apolloGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

        gsap.to(pioneerGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      } else if (selectedModelId === 'moon') {
        // Moon featured front and center
        gsap.to(moonGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

        gsap.to(earthGroup.current.position, { x: -4.2, y: -0.6, z: -4.5, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 0.32, y: 0.32, z: 0.32, duration, ease });

        gsap.to(marsGroup.current.position, { x: 4.8, y: 1.2, z: -5.0, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 0.28, y: 0.28, z: 0.28, duration, ease });

        gsap.to(apolloGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

        gsap.to(pioneerGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      } else if (selectedModelId === 'mars') {
        // Mars featured front and center
        gsap.to(marsGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

        gsap.to(earthGroup.current.position, { x: -4.2, y: -0.6, z: -4.5, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 0.32, y: 0.32, z: 0.32, duration, ease });

        gsap.to(moonGroup.current.position, { x: 4.8, y: 1.2, z: -5.0, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 0.28, y: 0.28, z: 0.28, duration, ease });

        gsap.to(apolloGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

        gsap.to(pioneerGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      } else if (selectedModelId === 'apollo') {
        // Apollo Lunar Module featured front and center with Lunar Terrain
        gsap.to(apolloGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

        // Moon in background for celestial context
        gsap.to(moonGroup.current.position, { x: -4.2, y: 1.2, z: -4.5, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 0.32, y: 0.32, z: 0.32, duration, ease });

        gsap.to(earthGroup.current.position, { x: -28, y: 0, z: -16, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

        gsap.to(marsGroup.current.position, { x: 28, y: 0, z: -16, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

        gsap.to(pioneerGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      } else if (selectedModelId === 'pioneer') {
        // Pioneer 10 featured front and center with Planetary Encounter Terrain
        gsap.to(pioneerGroup.current.position, { x: px, y: 0, z: 0, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 1, y: 1, z: 1, duration, ease });

        // Mars in background for planetary scale context
        gsap.to(marsGroup.current.position, { x: -4.2, y: 1.2, z: -4.5, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 0.28, y: 0.28, z: 0.28, duration, ease });

        gsap.to(earthGroup.current.position, { x: -28, y: 0, z: -16, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

        gsap.to(moonGroup.current.position, { x: 28, y: 0, z: -16, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 0.1, y: 0.1, z: 0.1, duration, ease });

        gsap.to(apolloGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      } else {
        // Lineup showcase
        gsap.to(earthGroup.current.position, { x: -3.8, y: 0.2, z: -2.0, duration, ease });
        gsap.to(earthGroup.current.scale, { x: 0.55, y: 0.55, z: 0.55, duration, ease });

        gsap.to(moonGroup.current.position, { x: 0, y: 0.4, z: -1.2, duration, ease });
        gsap.to(moonGroup.current.scale, { x: 0.65, y: 0.65, z: 0.65, duration, ease });

        gsap.to(marsGroup.current.position, { x: 3.8, y: 0.2, z: -2.0, duration, ease });
        gsap.to(marsGroup.current.scale, { x: 0.55, y: 0.55, z: 0.55, duration, ease });

        gsap.to(apolloGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(apolloGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });

        gsap.to(pioneerGroup.current.position, { x: 0, y: -20, z: -20, duration, ease });
        gsap.to(pioneerGroup.current.scale, { x: 0.01, y: 0.01, z: 0.01, duration, ease });
      }
    }

    const handleResize = () => {
      const newPx = getPlanetX(activePlanet);
      setPlanetX(newPx);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activePlanet, selectedModelId]);

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 6.6]} fov={45} />

      <CameraManager
        selectedHotspot={selectedHotspot}
        activePlanet={activePlanet}
        selectedModelId={selectedModelId}
        controlsRef={controlsRef}
      />

      {/* OrbitControls: Interactive Drag-to-Rotate */}
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.85}
        dampingFactor={0.06}
        enableDamping
        makeDefault
      />

      {/* Cinematic Space Lighting */}
      <ambientLight intensity={0.35} />
      <directionalLight position={[6, 4, 5]} intensity={2.4} castShadow />
      <directionalLight position={[-6, -2, -4]} intensity={0.5} color="#93c5fd" />
      <directionalLight position={[0, -4, 2]} intensity={0.3} color="#fde047" />

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
      <group ref={earthGroup} position={[planetX, 0, 0]}>
        <Planet
          modelPath="/earth.glb"
          scale={0.004}
          rotationSpeed={0.001}
          isPaused={false}
          atmosphereColor="#3b82f6"
          isActive={
            activePlanet === 'earth' ||
            ((activePlanet === 'models' || activePlanet === 'archive') &&
              (selectedModelId === 'earth' || selectedModelId === 'all'))
          }
        />
      </group>

      {/* Section 2: Moon */}
      <group ref={moonGroup} position={[24, -2, -12]} scale={[0.15, 0.15, 0.15]}>
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
          isActive={
            activePlanet === 'moon' ||
            ((activePlanet === 'models' || activePlanet === 'archive') &&
              (selectedModelId === 'moon' || selectedModelId === 'all'))
          }
        />
      </group>

      {/* Section 3: Mars */}
      <group ref={marsGroup} position={[32, 4, -16]} scale={[0.1, 0.1, 0.1]}>
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
          isActive={
            activePlanet === 'mars' ||
            ((activePlanet === 'models' || activePlanet === 'archive') &&
              (selectedModelId === 'mars' || selectedModelId === 'all'))
          }
        />
      </group>

      {/* Section 4: Apollo Lunar Module with Lunar Surface Terrain */}
      <group
        ref={apolloGroup}
        position={[30, -5, -20]}
        scale={[0.01, 0.01, 0.01]}
      >
        <SiteModel
          modelPath="/apollo-lunar-module.glb"
          scale={0.36}
          modelPosition={[0, -0.63, 0]}
          modelRotation={[0, 0.45, 0]}
          terrainType="lunar"
          rotationSpeed={0.0012}
          isActive={
            (activePlanet === 'models' || activePlanet === 'archive') &&
            selectedModelId === 'apollo'
          }
        />
      </group>

      {/* Section 5: Pioneer 10 Spacecraft with Planetary Encounter Terrain */}
      <group
        ref={pioneerGroup}
        position={[35, -5, -20]}
        scale={[0.01, 0.01, 0.01]}
      >
        <SiteModel
          modelPath="/pioneer-10.glb"
          scale={0.0032}
          modelPosition={[0.28, -0.12, 0]}
          modelRotation={[0.2, 0.55, 0]}
          terrainType="planetary"
          rotationSpeed={0.0012}
          isActive={
            (activePlanet === 'models' || activePlanet === 'archive') &&
            selectedModelId === 'pioneer'
          }
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
  selectedModelId = 'earth',
  onSelectModelId
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
            selectedModelId={selectedModelId}
            onSelectModelId={onSelectModelId}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
