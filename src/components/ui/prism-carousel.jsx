import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, ExternalLink } from 'lucide-react';

// Custom Vertex Shader
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Custom Fragment Shader for Prism Chromatic Dispersion & Color Sweep
const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uProgress;       // Transition progress [0, 1]
  uniform float uDispersion;     // Chromatic dispersion strength [0, 1]
  uniform float uSaturation;     // Active saturation [0, 1]
  uniform float uDim;            // Dimming factor [0, 1]
  uniform float uSweep;          // Spectral sweep strength [0, 1]
  uniform float uSweepTime;      // Sweep animation phase [0, 1]
  uniform vec2 uResolution;      // Card aspect ratio
  uniform float uRadius;         // Corner radius in UV space
  uniform float uHover;          // Hover color peek [0, 1]

  varying vec2 vUv;

  // Signed distance function for rounded rectangle
  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  // Prismatic spectral rainbow color generator
  vec3 spectrum(float t) {
    vec3 c = vec3(
      sin(t * 6.28318 + 0.0) * 0.5 + 0.5,
      sin(t * 6.28318 + 2.094) * 0.5 + 0.5,
      sin(t * 6.28318 + 4.188) * 0.5 + 0.5
    );
    return c;
  }

  // Pure White Light Sweep Shader for sleek Nothing OS aesthetic
  void main() {
    // 1. Rounded Corner Clipping
    vec2 halfSize = vec2(0.5, 0.5);
    vec2 p = vUv - halfSize;
    float dist = roundedBoxSDF(p, halfSize, uRadius);
    float alpha = 1.0 - smoothstep(0.0, 0.015, dist);
    if (alpha <= 0.001) discard;

    // 2. Texture Sampling (Clean sampling without rainbow distortion)
    vec4 tex = texture2D(uTexture, vUv);
    vec3 baseColor = tex.rgb;
    float baseAlpha = tex.a;

    // 3. Monochrome / Desaturation calculation
    float gray = dot(baseColor, vec3(0.299, 0.587, 0.114));
    vec3 monoColor = vec3(gray);

    // 4. Diagonal White Light Sweep Wavefront
    // Sweep line travels diagonally across the UV coordinates (x + y)
    float diag = (vUv.x * 0.7 + (1.0 - vUv.y) * 0.7); // range [0, 1.4]
    float sweepWave = smoothstep(diag - 0.25, diag + 0.05, uSweepTime * 1.5);

    // Brilliant Pure White Light gleam right at the sweep wavefront edge
    float waveDist = abs(diag - uSweepTime * 1.35);
    float whiteGlow = exp(-waveDist * waveDist * 55.0) * uSweep;
    vec3 whiteLight = vec3(1.0, 1.0, 1.0); // Pure White Switch Color

    // Effective saturation combining base saturation, hover peek, and sweep wavefront
    float effectiveSat = clamp(mix(uSaturation, 1.0, sweepWave) + uHover * 0.5, 0.0, 1.0);
    vec3 finalColor = mix(monoColor, baseColor, effectiveSat);

    // Add pure white sweep illumination beam
    finalColor += whiteLight * whiteGlow * 1.1;

    // Apply distance dimming
    finalColor *= (1.0 - uDim);

    gl_FragColor = vec4(finalColor, baseAlpha * alpha);
  }
`;

export const PrismCarousel = forwardRef(function PrismCarousel(
  {
    items = [],
    startIndex = 0,
    aspect = 1.5,
    size = 0.62,
    neighborScale = 0.66,
    gap = 14,
    radius = 18,
    saturation = 0,
    dim = 0.2,
    sweep = 1,
    sweepDuration = 1.1,
    dispersion = 1,
    autoplay = true,
    interval = 4.5,
    loop = true,
    captions = true,
    controls = true,
    draggable = true,
    wheel = true,
    pauseOnHover = true,
    backgroundColor = 'transparent',
    paused = false,
    dpr = 2,
    ariaLabel = 'Prism carousel: Coverflow with chromatic dispersion and spectral sweep',
    onIndexChange,
    onSelect,
    className = '',
    style = {}
  },
  ref
) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isPaused, setIsPaused] = useState(paused);
  const [isHovered, setIsHovered] = useState(false);

  // Internal animation state ref (bypasses React render loop for 60fps WebGL)
  const animRef = useRef({
    currentIndex: startIndex,
    targetIndex: startIndex,
    progress: startIndex,
    velocity: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartProgress: 0,
    lastSweepTime: 0,
    sweepPhase: 1.0,
    hoveredIndex: -1
  });

  // Texture Cache
  const texturesRef = useRef([]);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const meshesRef = useRef([]);

  // Imperative Handle
  useImperativeHandle(ref, () => ({
    next: () => goToNext(),
    previous: () => goToPrevious(),
    goTo: (idx) => goToIndex(idx)
  }));

  const totalItems = items.length;

  const goToIndex = useCallback(
    (index) => {
      let target = index;
      if (loop) {
        target = (target % totalItems + totalItems) % totalItems;
      } else {
        target = Math.max(0, Math.min(totalItems - 1, target));
      }
      animRef.current.targetIndex = target;
      animRef.current.sweepPhase = 0.0;
      setCurrentIndex(target);
      onIndexChange?.(target);
    },
    [totalItems, loop, onIndexChange]
  );

  const goToNext = useCallback(() => {
    goToIndex(animRef.current.targetIndex + 1);
  }, [goToIndex]);

  const goToPrevious = useCallback(() => {
    goToIndex(animRef.current.targetIndex - 1);
  }, [goToIndex]);

  // Autoplay timer
  useEffect(() => {
    if (!autoplay || isPaused || isHovered || totalItems <= 1) return;

    const timer = setInterval(() => {
      goToNext();
    }, interval * 1000);

    return () => clearInterval(timer);
  }, [autoplay, isPaused, isHovered, interval, totalItems, goToNext]);

  // Three.js Scene Setup & Loop
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || totalItems === 0) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 4.6);
    cameraRef.current = camera;

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dpr));
    renderer.setClearColor(0x000000, 0);
    rendererRef.current = renderer;

    // 3. Texture Loader
    const loader = new THREE.TextureLoader();
    const textures = items.map((item) => {
      const tex = loader.load(item.src);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      return tex;
    });
    texturesRef.current = textures;

    // 4. Geometry and Meshes
    // Calculate card width/height from aspect and size
    const cardHeight = 2.4 * size;
    const cardWidth = cardHeight * aspect;
    const geometry = new THREE.PlaneGeometry(cardWidth, cardHeight, 16, 16);

    const meshes = items.map((_, i) => {
      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        uniforms: {
          uTexture: { value: textures[i] },
          uProgress: { value: 0.0 },
          uDispersion: { value: 0.0 },
          uSaturation: { value: i === startIndex ? 1.0 : saturation },
          uDim: { value: i === startIndex ? 0.0 : dim },
          uSweep: { value: sweep },
          uSweepTime: { value: 1.0 },
          uResolution: { value: new THREE.Vector2(cardWidth, cardHeight) },
          uRadius: { value: radius / (cardHeight * 150) },
          uHover: { value: 0.0 }
        }
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.userData = { index: i };
      scene.add(mesh);
      return mesh;
    });
    meshesRef.current = meshes;

    // 5. Animation Loop
    let animationFrameId;
    let lastTime = performance.now();

    const animate = (currentTime) => {
      const delta = Math.min((currentTime - lastTime) / 1000, 0.1);
      lastTime = currentTime;

      const state = animRef.current;

      // Smooth interpolation towards targetIndex
      if (!state.isDragging) {
        const diff = state.targetIndex - state.progress;
        state.progress += diff * Math.min(1.0, delta * 7.5);
      }

      // Sweep animation progression
      if (state.sweepPhase < 1.0) {
        state.sweepPhase = Math.min(1.0, state.sweepPhase + delta / Math.max(0.1, sweepDuration));
      }

      // Velocity for chromatic dispersion
      const velocity = Math.abs(state.targetIndex - state.progress);
      const currentDispersion = dispersion * Math.min(1.0, velocity * 2.2);

      // Card positioning spacing
      const spacing = cardWidth * 0.72 + (gap / 100);

      meshes.forEach((mesh, i) => {
        // Calculate offset relative to current progress
        let offset = i - state.progress;
        if (loop) {
          // Wrap around shortest distance
          while (offset > totalItems / 2) offset -= totalItems;
          while (offset < -totalItems / 2) offset += totalItems;
        }

        // Active proximity factor [0, 1]
        const proximity = Math.max(0, 1 - Math.abs(offset));

        // 3D positioning: Coverflow arc
        const posX = offset * spacing;
        const posZ = -Math.abs(offset) * 0.75 + (proximity * 0.35);
        const rotY = -Math.sign(offset) * Math.min(Math.abs(offset) * 0.28, 0.42);

        mesh.position.set(posX, 0, posZ);
        mesh.rotation.set(0, rotY, 0);

        // Scale: Neighbor scaling
        const currentScale = THREE.MathUtils.lerp(neighborScale, 1.0, proximity);
        mesh.scale.set(currentScale, currentScale, currentScale);

        // Uniforms update
        const mat = mesh.material;
        mat.uniforms.uDispersion.value = currentDispersion;
        mat.uniforms.uSaturation.value = THREE.MathUtils.lerp(saturation, 1.0, proximity);
        mat.uniforms.uDim.value = THREE.MathUtils.lerp(dim, 0.0, proximity);

        // Active card gets sweep effect
        if (Math.abs(offset) < 0.35) {
          mat.uniforms.uSweepTime.value = state.sweepPhase;
          mat.uniforms.uSweep.value = sweep;
        } else {
          mat.uniforms.uSweepTime.value = 0.0;
          mat.uniforms.uSweep.value = 0.0;
        }

        // Hover peek
        const isHoveredCard = state.hoveredIndex === i;
        mat.uniforms.uHover.value = THREE.MathUtils.lerp(
          mat.uniforms.uHover.value,
          isHoveredCard ? 1.0 : 0.0,
          delta * 10
        );

        // Render order so center card is in front
        mesh.renderOrder = Math.round(100 - Math.abs(offset) * 10);
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    // 6. Handle Resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newW = containerRef.current.clientWidth;
      const newH = containerRef.current.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      geometry.dispose();
      textures.forEach((t) => t.dispose());
      meshes.forEach((m) => m.material.dispose());
      renderer.dispose();
    };
  }, [
    items,
    totalItems,
    aspect,
    size,
    neighborScale,
    gap,
    radius,
    saturation,
    dim,
    sweep,
    sweepDuration,
    dispersion,
    loop,
    dpr,
    startIndex
  ]);

  // Touch and Drag Handlers
  const handlePointerDown = (e) => {
    if (!draggable) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    animRef.current.isDragging = true;
    animRef.current.dragStartX = clientX;
    animRef.current.dragStartProgress = animRef.current.progress;
  };

  const handlePointerMove = (e) => {
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;

    // Raycast for hover color peek
    if (containerRef.current && cameraRef.current && meshesRef.current.length > 0) {
      const rect = containerRef.current.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY || (e.touches && e.touches[0].clientY) || 0) - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(meshesRef.current);
      if (intersects.length > 0) {
        animRef.current.hoveredIndex = intersects[0].object.userData.index;
      } else {
        animRef.current.hoveredIndex = -1;
      }
    }

    if (!animRef.current.isDragging) return;

    const deltaX = clientX - animRef.current.dragStartX;
    const containerW = containerRef.current?.clientWidth || 800;
    const sensitivity = 2.4;
    const progressDelta = (-deltaX / containerW) * sensitivity;

    animRef.current.progress = animRef.current.dragStartProgress + progressDelta;
    animRef.current.targetIndex = animRef.current.progress;
  };

  const handlePointerUp = () => {
    if (!animRef.current.isDragging) return;
    animRef.current.isDragging = false;
    const nearestIndex = Math.round(animRef.current.progress);
    goToIndex(nearestIndex);
  };

  // Mouse Wheel Navigation
  const handleWheel = (e) => {
    if (!wheel) return;
    if (Math.abs(e.deltaX) > 20 || Math.abs(e.deltaY) > 30) {
      if (e.deltaX > 0 || e.deltaY > 0) {
        goToNext();
      } else {
        goToPrevious();
      }
    }
  };

  // Card Click Handler
  const handleCanvasClick = (e) => {
    if (!containerRef.current || !cameraRef.current || meshesRef.current.length === 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const mouse = new THREE.Vector2(
      ((e.clientX - rect.left) / rect.width) * 2 - 1,
      -((e.clientY - rect.top) / rect.height) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, cameraRef.current);
    const intersects = raycaster.intersectObjects(meshesRef.current);

    if (intersects.length > 0) {
      const clickedIdx = intersects[0].object.userData.index;
      if (clickedIdx === animRef.current.targetIndex) {
        onSelect?.(items[clickedIdx], clickedIdx);
        if (items[clickedIdx]?.href) {
          window.open(items[clickedIdx].href, '_blank');
        }
      } else {
        goToIndex(clickedIdx);
      }
    }
  };

  const currentItem = items[currentIndex] || items[0];

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label={ariaLabel}
      onMouseEnter={() => pauseOnHover && setIsHovered(true)}
      onMouseLeave={() => {
        pauseOnHover && setIsHovered(false);
        animRef.current.hoveredIndex = -1;
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onWheel={handleWheel}
      className={`relative w-full h-full min-h-[460px] sm:min-h-[520px] select-none flex flex-col justify-between overflow-hidden ${className}`}
      style={{ backgroundColor, ...style }}
    >
      {/* Three.js WebGL Coverflow Canvas */}
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-0"
      />

      {/* Top Telemetry / Status Row */}
      <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[10px] sm:text-xs font-mono text-zinc-300">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#ffffff]" />
          <span>PRISM COVERFLOW // WHITE LIGHT SWEEP</span>
        </div>

        {/* Counter Badge */}
        <div className="px-3 py-1.5 rounded-full bg-black/60 border border-white/15 backdrop-blur-md text-[11px] font-mono font-bold text-white tracking-widest">
          {String(currentIndex + 1).padStart(2, '0')}{' '}
          <span className="text-zinc-500 font-normal">/</span>{' '}
          {String(totalItems).padStart(2, '0')}
        </div>
      </div>

      {/* Bottom Floating Bar: Captions + Controls */}
      <div className="relative z-10 p-4 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 pointer-events-none">
        {/* Caption */}
        {captions && currentItem && (
          <div className="pointer-events-auto max-w-lg text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-white/10 border border-white/15 text-[10px] font-mono text-white/90 uppercase tracking-widest mb-1.5">
              <span>EXPLORATION ARTIFACT #{String(currentIndex + 1).padStart(2, '0')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mb-1 drop-shadow-md">
              {currentItem.title}
            </h3>
            {currentItem.subtitle && (
              <p className="text-xs sm:text-sm font-mono text-zinc-400 tracking-wide">
                {currentItem.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Navigation Controls / Switcher */}
        {controls && (
          <div className="pointer-events-auto flex items-center gap-2 glass-panel p-1.5 rounded-full border border-white/25 shadow-2xl backdrop-blur-xl bg-black/80">
            <button
              onClick={goToPrevious}
              className="p-2.5 rounded-full text-white bg-white/5 hover:bg-white hover:text-black active:scale-95 transition-all"
              title="Previous Artifact (Left Arrow)"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {autoplay && (
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="p-2.5 rounded-full text-white bg-white/5 hover:bg-white hover:text-black active:scale-95 transition-all"
                title={isPaused ? 'Resume Autoplay' : 'Pause Autoplay'}
                aria-label="Toggle Autoplay"
              >
                {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
            )}

            <button
              onClick={goToNext}
              className="p-2.5 rounded-full text-white bg-white/5 hover:bg-white hover:text-black active:scale-95 transition-all"
              title="Next Artifact (Right Arrow)"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
});

export default PrismCarousel;
