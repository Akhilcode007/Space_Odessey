import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  X,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Trophy,
  AlertTriangle,
  Rocket,
  CheckCircle2,
  Zap,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Target
} from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function SpaceGame({ isOpen, onClose, destination = 'moon' }) {
  const canvasRef = useRef(null);

  // High-level React State for Game Over / Victory Overlays
  const [gameState, setGameState] = useState('playing'); // 'playing' | 'gameover' | 'victory'
  const [score, setScore] = useState(0);
  const [shields, setShields] = useState(3);
  const [progressPercent, setProgressPercent] = useState(0);
  const [speedKmh, setSpeedKmh] = useState(28000);
  const [isHazardBelt, setIsHazardBelt] = useState(false);
  const [touchdownStep, setTouchdownStep] = useState(0); // 0 = in flight, 1 = locked, 2 = landed

  // Touch controls state for mobile
  const [touchControls, setTouchControls] = useState({
    up: false,
    down: false,
    left: false,
    right: false,
    fire: false
  });

  const destinationLabel = destination === 'mars' ? 'MARS' : 'MOON';
  const destinationColor = destination === 'mars' ? '#f97316' : '#e2e8f0';

  // Game Engine Reference Object (keeps loop running smoothly at 60fps without React re-renders)
  const engineRef = useRef({
    isRunning: false,
    width: 800,
    height: 600,
    dpr: 1,
    lastTime: 0,
    keys: {},
    player: {
      x: 400,
      y: 500,
      vx: 0,
      vy: 0,
      speed: 380,
      tilt: 0,
      width: 44,
      height: 52,
      shields: 3,
      invulnerableTimer: 0,
      lastFireTime: 0,
      fireRate: 0.16
    },
    stars: [],
    lasers: [],
    obstacles: [],
    particles: [],
    floatingTexts: [],
    screenShake: 0,
    progress: 0, // 0 to 1
    missionTime: 0,
    missionDuration: 55, // 55 seconds to reach destination
    score: 0,
    asteroidsDestroyed: 0,
    destinationRadius: 0,
    touchdownSequence: false,
    touchdownProgress: 0
  });

  // Start / Restart Engine
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const width = canvas.clientWidth || 800;
    const height = canvas.clientHeight || 600;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // Generate parallax starfield
    const stars = [];
    const starCount = Math.floor((width * height) / 3800);
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.8 + 0.6,
        speed: Math.random() * 90 + 40,
        alpha: Math.random() * 0.7 + 0.3,
        layer: Math.floor(Math.random() * 3) + 1
      });
    }

    engineRef.current = {
      isRunning: true,
      width,
      height,
      dpr,
      lastTime: performance.now(),
      keys: {},
      player: {
        x: width / 2,
        y: height - 100,
        vx: 0,
        vy: 0,
        speed: 400,
        tilt: 0,
        width: 44,
        height: 52,
        shields: 3,
        invulnerableTimer: 0,
        lastFireTime: 0,
        fireRate: 0.16
      },
      stars,
      lasers: [],
      obstacles: [],
      particles: [],
      floatingTexts: [],
      screenShake: 0,
      progress: 0,
      missionTime: 0,
      missionDuration: 55,
      score: 0,
      asteroidsDestroyed: 0,
      destinationRadius: 20,
      touchdownSequence: false,
      touchdownProgress: 0
    };

    setGameState('playing');
    setScore(0);
    setShields(3);
    setProgressPercent(0);
    setSpeedKmh(28000);
    setIsHazardBelt(false);
    setTouchdownStep(0);
  }, []);

  // Keyboard Event Handlers
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      engineRef.current.keys[e.code] = true;
      if (e.key === 'w' || e.key === 'W') engineRef.current.keys['KeyW'] = true;
      if (e.key === 's' || e.key === 'S') engineRef.current.keys['KeyS'] = true;
      if (e.key === 'a' || e.key === 'A') engineRef.current.keys['KeyA'] = true;
      if (e.key === 'd' || e.key === 'D') engineRef.current.keys['KeyD'] = true;
      if (e.key === 'Escape') onClose();
    };

    const handleKeyUp = (e) => {
      engineRef.current.keys[e.code] = false;
      if (e.key === 'w' || e.key === 'W') engineRef.current.keys['KeyW'] = false;
      if (e.key === 's' || e.key === 'S') engineRef.current.keys['KeyS'] = false;
      if (e.key === 'a' || e.key === 'A') engineRef.current.keys['KeyA'] = false;
      if (e.key === 'd' || e.key === 'D') engineRef.current.keys['KeyD'] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, onClose]);

  // Main High-Performance Game Animation Loop
  useEffect(() => {
    if (!isOpen) return;
    initGame();

    let animationFrameId;

    const spawnObstacle = (engine, dt) => {
      if (engine.touchdownSequence) return;

      const progress = engine.progress;
      // Spawn rate intensifies during asteroid density belt (45% - 88%)
      const inHazardBelt = progress >= 0.45 && progress <= 0.88;
      const baseSpawnChance = inHazardBelt ? 0.045 : 0.024;

      if (Math.random() < baseSpawnChance) {
        const types = ['standard', 'fast', 'debris'];
        if (inHazardBelt) {
          types.push('mega', 'comet', 'mega');
        } else if (progress > 0.25) {
          types.push('comet');
        }

        const type = types[Math.floor(Math.random() * types.length)];
        const spawnX = Math.random() * (engine.width - 80) + 40;

        // Base falling speed scales with journey progress
        const speedMultiplier = 1 + progress * 0.9;

        if (type === 'standard') {
          // 1. Standard Asteroid: Jagged rotating polygon
          const vertexCount = Math.floor(Math.random() * 4) + 8;
          const radius = Math.random() * 14 + 18;
          const offsets = [];
          for (let i = 0; i < vertexCount; i++) {
            offsets.push(Math.random() * 0.4 + 0.8);
          }
          engine.obstacles.push({
            type: 'standard',
            x: spawnX,
            y: -radius * 2,
            vx: (Math.random() - 0.5) * 40,
            vy: (Math.random() * 60 + 220) * speedMultiplier,
            radius,
            hp: 1,
            maxHp: 1,
            rotation: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 2.5,
            vertexCount,
            offsets,
            color: '#a1a1aa'
          });
        } else if (type === 'fast') {
          // 2. Fast Rock: Small, high velocity tumbling debris
          const radius = Math.random() * 7 + 10;
          engine.obstacles.push({
            type: 'fast',
            x: spawnX,
            y: -radius * 2,
            vx: (Math.random() - 0.5) * 70,
            vy: (Math.random() * 100 + 360) * speedMultiplier,
            radius,
            hp: 1,
            maxHp: 1,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 5,
            color: '#fb923c'
          });
        } else if (type === 'comet') {
          // 3. High-Speed Comet: Diagonal streak across lanes
          const fromLeft = Math.random() > 0.5;
          const startX = fromLeft ? -40 : engine.width + 40;
          const vx = (fromLeft ? 1 : -1) * (Math.random() * 120 + 160);
          engine.obstacles.push({
            type: 'comet',
            x: startX,
            y: Math.random() * (engine.height * 0.35) - 30,
            vx,
            vy: (Math.random() * 120 + 380) * speedMultiplier,
            radius: 14,
            hp: 1,
            maxHp: 1,
            tailParticles: [],
            color: '#38bdf8'
          });
        } else if (type === 'mega') {
          // 4. Armored Mega-Asteroid (2-Hit HP)
          const radius = Math.random() * 14 + 38;
          engine.obstacles.push({
            type: 'mega',
            x: spawnX,
            y: -radius * 2,
            vx: (Math.random() - 0.5) * 30,
            vy: (Math.random() * 40 + 160) * speedMultiplier,
            radius,
            hp: 2,
            maxHp: 2,
            rotation: 0,
            rotSpeed: (Math.random() - 0.5) * 1.2,
            cracked: false,
            color: '#71717a'
          });
        } else if (type === 'debris') {
          // 5. Space Debris: Abandoned metallic solar panel / satellite piece
          const width = 36;
          const height = 18;
          engine.obstacles.push({
            type: 'debris',
            x: spawnX,
            y: -height * 2,
            vx: (Math.random() - 0.5) * 50,
            vy: (Math.random() * 60 + 200) * speedMultiplier,
            radius: 20,
            hp: 1,
            maxHp: 1,
            width,
            height,
            rotation: Math.random() * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 2,
            blinkTimer: 0,
            color: '#0284c7'
          });
        }
      }
    };

    const loop = (timestamp) => {
      const engine = engineRef.current;
      if (!engine.isRunning) return;

      const dt = Math.min((timestamp - engine.lastTime) / 1000, 0.05); // Cap dt to avoid huge jumps
      engine.lastTime = timestamp;

      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { width, height, dpr } = engine;
      ctx.save();
      ctx.scale(dpr, dpr);

      // Apply screen shake
      if (engine.screenShake > 0) {
        const shakeX = (Math.random() - 0.5) * engine.screenShake;
        const shakeY = (Math.random() - 0.5) * engine.screenShake;
        ctx.translate(shakeX, shakeY);
        engine.screenShake = Math.max(0, engine.screenShake - dt * 25);
      }

      // ========================================================
      // 1. MISSION PROGRESS & JOURNEY TELEMETRY
      // ========================================================
      if (!engine.touchdownSequence) {
        engine.missionTime += dt;
        engine.progress = Math.min(1, engine.missionTime / engine.missionDuration);

        // Update React HUD state periodically
        const currentProgress = Math.floor(engine.progress * 100);
        setProgressPercent(currentProgress);

        const currentSpeed = Math.floor(28000 + engine.progress * 18000);
        setSpeedKmh(currentSpeed);

        const inBelt = engine.progress >= 0.45 && engine.progress <= 0.88;
        setIsHazardBelt(inBelt);

        // Trigger Touchdown sequence at 95%
        if (engine.progress >= 0.95) {
          engine.touchdownSequence = true;
          setTouchdownStep(1); // Locked on landing target
        }
      } else {
        // In touchdown sequence
        engine.touchdownProgress += dt * 0.4;
        if (engine.touchdownProgress >= 1 && gameState === 'playing') {
          engine.isRunning = false;
          setTouchdownStep(2);
          setGameState('victory');
          soundManager.playVictoryFanfare();
        }
      }

      // ========================================================
      // 2. CLEAR & PARALLAX STARFIELD
      // ========================================================
      ctx.fillStyle = '#08080a';
      ctx.fillRect(0, 0, width, height);

      // Draw faint dot grid (Nothing OS style)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
      for (let x = 16; x < width; x += 32) {
        for (let y = 16; y < height; y += 32) {
          ctx.fillRect(x, y, 1.5, 1.5);
        }
      }

      // Render Parallax Stars
      engine.stars.forEach((star) => {
        star.y += star.speed * (1 + engine.progress * 0.6) * dt;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }

        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // ========================================================
      // 3. DESTINATION HORIZON APPROACH (Moon or Mars)
      // ========================================================
      if (engine.progress > 0.45) {
        const approachFactor = Math.min(1, (engine.progress - 0.45) / 0.55);
        const planetRadius = 40 + approachFactor * (width * 0.45);
        const planetCenterY = -planetRadius * 0.45 + approachFactor * 120;
        const planetCenterX = width / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(planetCenterX, planetCenterY, planetRadius, 0, Math.PI * 2);

        // Planet Atmosphere / Glow
        const grad = ctx.createRadialGradient(
          planetCenterX,
          planetCenterY,
          planetRadius * 0.6,
          planetCenterX,
          planetCenterY,
          planetRadius
        );
        if (destination === 'mars') {
          grad.addColorStop(0, '#c2410c');
          grad.addColorStop(0.7, '#9a3412');
          grad.addColorStop(1, '#431407');
        } else {
          grad.addColorStop(0, '#f4f4f5');
          grad.addColorStop(0.7, '#a1a1aa');
          grad.addColorStop(1, '#27272a');
        }
        ctx.fillStyle = grad;
        ctx.fill();

        // Atmospheric rim glow
        ctx.strokeStyle = destination === 'mars' ? 'rgba(249, 115, 22, 0.35)' : 'rgba(226, 232, 240, 0.25)';
        ctx.lineWidth = 4;
        ctx.stroke();

        // Destination landing target reticle during touchdown
        if (engine.touchdownSequence) {
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(planetCenterX, planetCenterY + planetRadius * 0.4, 30, 0, Math.PI * 2);
          ctx.stroke();

          ctx.beginPath();
          ctx.moveTo(planetCenterX - 45, planetCenterY + planetRadius * 0.4);
          ctx.lineTo(planetCenterX + 45, planetCenterY + planetRadius * 0.4);
          ctx.moveTo(planetCenterX, planetCenterY + planetRadius * 0.4 - 45);
          ctx.lineTo(planetCenterX, planetCenterY + planetRadius * 0.4 + 45);
          ctx.stroke();

          ctx.fillStyle = '#38bdf8';
          ctx.font = '10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('TARGET LOCK // FINAL DESCENT', planetCenterX, planetCenterY + planetRadius * 0.4 + 48);
        }
        ctx.restore();
      }

      // ========================================================
      // 4. PLAYER MOVEMENT & CONTROLS (Smooth Velocity & Bank)
      // ========================================================
      const p = engine.player;
      const keys = engine.keys;

      // Handle Inputs (Desktop Keyboard + Mobile Touchpad)
      let moveX = 0;
      let moveY = 0;

      if (keys['KeyA'] || keys['ArrowLeft'] || touchControls.left) moveX -= 1;
      if (keys['KeyD'] || keys['ArrowRight'] || touchControls.right) moveX += 1;
      if (keys['KeyW'] || keys['ArrowUp'] || touchControls.up) moveY -= 1;
      if (keys['KeyS'] || keys['ArrowDown'] || touchControls.down) moveY += 1;

      // If touchdown sequence, player auto-centers and glides upward
      if (engine.touchdownSequence) {
        moveX = (width / 2 - p.x) * 0.05;
        moveY = -0.5;
      }

      // Normalize diagonal speed
      if (moveX !== 0 && moveY !== 0 && !engine.touchdownSequence) {
        moveX *= 0.7071;
        moveY *= 0.7071;
      }

      // Smooth velocity interpolation
      const targetVx = moveX * p.speed;
      const targetVy = moveY * p.speed;
      p.vx += (targetVx - p.vx) * 0.18;
      p.vy += (targetVy - p.vy) * 0.18;

      p.x += p.vx * dt;
      p.y += p.vy * dt;

      // Restrict player inside screen bounds
      p.x = Math.max(p.width / 2 + 10, Math.min(width - p.width / 2 - 10, p.x));
      p.y = Math.max(p.height / 2 + 60, Math.min(height - p.height / 2 - 20, p.y));

      // Banking tilt angle based on horizontal velocity
      const targetTilt = (p.vx / p.speed) * 0.35;
      p.tilt += (targetTilt - p.tilt) * 0.15;

      // Invulnerability blink timer
      if (p.invulnerableTimer > 0) {
        p.invulnerableTimer -= dt;
      }

      // ========================================================
      // 5. TWIN PLASMA LASER FIRING
      // ========================================================
      const wantsFire = keys['Space'] || touchControls.fire;
      if (wantsFire && !engine.touchdownSequence) {
        if (timestamp / 1000 - p.lastFireTime > p.fireRate) {
          p.lastFireTime = timestamp / 1000;

          // Twin lasers from left and right wings
          engine.lasers.push({
            x: p.x - 14,
            y: p.y - 12,
            vy: -960,
            length: 16
          });
          engine.lasers.push({
            x: p.x + 14,
            y: p.y - 12,
            vy: -960,
            length: 16
          });

          soundManager.playLaserShot();
        }
      }

      // Update & Render Lasers
      ctx.save();
      for (let i = engine.lasers.length - 1; i >= 0; i--) {
        const laser = engine.lasers[i];
        laser.y += laser.vy * dt;

        if (laser.y < -30) {
          engine.lasers.splice(i, 1);
          continue;
        }

        // Draw neon glowing twin plasma laser
        const laserGrad = ctx.createLinearGradient(laser.x, laser.y, laser.x, laser.y + laser.length);
        laserGrad.addColorStop(0, '#ffffff');
        laserGrad.addColorStop(0.3, '#38bdf8');
        laserGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.strokeStyle = laserGrad;
        ctx.lineWidth = 3.5;
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.moveTo(laser.x, laser.y);
        ctx.lineTo(laser.x, laser.y + laser.length);
        ctx.stroke();
      }
      ctx.restore();

      // ========================================================
      // 6. SPAWN & UPDATE OBSTACLES (5 Hazard Types)
      // ========================================================
      spawnObstacle(engine, dt);

      for (let i = engine.obstacles.length - 1; i >= 0; i--) {
        const obs = engine.obstacles[i];
        obs.x += obs.vx * dt;
        obs.y += obs.vy * dt;
        obs.rotation += (obs.rotSpeed || 0) * dt;

        // Comets create glowing blue tail particles
        if (obs.type === 'comet' && Math.random() < 0.6) {
          engine.particles.push({
            x: obs.x + (Math.random() - 0.5) * 8,
            y: obs.y - 12,
            vx: -obs.vx * 0.2 + (Math.random() - 0.5) * 30,
            vy: -obs.vy * 0.3 + (Math.random() - 0.5) * 30,
            size: Math.random() * 4 + 2,
            alpha: 0.8,
            decay: 2.2,
            color: '#38bdf8'
          });
        }

        // Remove if off screen bottom or sides
        if (obs.y > height + 60 || obs.x < -80 || obs.x > width + 80) {
          engine.obstacles.splice(i, 1);
          continue;
        }

        // Render Obstacle
        ctx.save();
        ctx.translate(obs.x, obs.y);
        ctx.rotate(obs.rotation || 0);

        if (obs.type === 'standard') {
          // 1. Jagged Asteroid with craters
          ctx.beginPath();
          const step = (Math.PI * 2) / obs.vertexCount;
          for (let v = 0; v < obs.vertexCount; v++) {
            const angle = v * step;
            const r = obs.radius * obs.offsets[v];
            const px = Math.cos(angle) * r;
            const py = Math.sin(angle) * r;
            if (v === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.fillStyle = '#52525b';
          ctx.fill();
          ctx.strokeStyle = '#71717a';
          ctx.lineWidth = 2;
          ctx.stroke();

          // Small interior craters
          ctx.fillStyle = '#3f3f46';
          ctx.beginPath();
          ctx.arc(obs.radius * 0.25, -obs.radius * 0.2, obs.radius * 0.22, 0, Math.PI * 2);
          ctx.fill();
        } else if (obs.type === 'fast') {
          // 2. Fast Rock with glowing aerodynamic trail
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#ea580c';
          ctx.shadowColor = '#ea580c';
          ctx.shadowBlur = 12;
          ctx.fill();
          ctx.strokeStyle = '#fed7aa';
          ctx.lineWidth = 1.5;
          ctx.stroke();
        } else if (obs.type === 'comet') {
          // 3. Comet Nucleus
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fillStyle = '#e0f2fe';
          ctx.shadowColor = '#38bdf8';
          ctx.shadowBlur = 18;
          ctx.fill();
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 2;
          ctx.stroke();
        } else if (obs.type === 'mega') {
          // 4. Armored Mega-Asteroid (2-Hit)
          ctx.beginPath();
          ctx.arc(0, 0, obs.radius, 0, Math.PI * 2);
          ctx.fillStyle = obs.cracked ? '#450a0a' : '#27272a';
          ctx.fill();
          ctx.strokeStyle = obs.cracked ? '#ef4444' : '#52525b';
          ctx.lineWidth = obs.cracked ? 3.5 : 2.5;
          ctx.stroke();

          // If cracked, draw jagged glowing red fissure lines
          if (obs.cracked) {
            ctx.strokeStyle = '#ef4444';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.lineWidth = 2.5;
            ctx.beginPath();
            ctx.moveTo(-obs.radius * 0.7, -obs.radius * 0.3);
            ctx.lineTo(0, 0);
            ctx.lineTo(obs.radius * 0.6, obs.radius * 0.5);
            ctx.moveTo(0, 0);
            ctx.lineTo(-obs.radius * 0.3, obs.radius * 0.6);
            ctx.stroke();
          }
        } else if (obs.type === 'debris') {
          // 5. Space Debris: Satellite solar array fragment
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(-obs.width / 2, -obs.height / 2, obs.width, obs.height);

          // Solar panel grid lines
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.beginPath();
          ctx.moveTo(-obs.width / 6, -obs.height / 2);
          ctx.lineTo(-obs.width / 6, obs.height / 2);
          ctx.moveTo(obs.width / 6, -obs.height / 2);
          ctx.lineTo(obs.width / 6, obs.height / 2);
          ctx.stroke();

          // Blinking red beacon
          if (Math.floor(timestamp / 300) % 2 === 0) {
            ctx.fillStyle = '#ef4444';
            ctx.beginPath();
            ctx.arc(obs.width / 2 - 4, -obs.height / 2 + 4, 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();

        // ----------------------------------------------------
        // Laser vs Obstacle Collision Detection
        // ----------------------------------------------------
        for (let l = engine.lasers.length - 1; l >= 0; l--) {
          const laser = engine.lasers[l];
          const dist = Math.hypot(laser.x - obs.x, laser.y - obs.y);

          if (dist < obs.radius + 6) {
            // Laser Hit!
            engine.lasers.splice(l, 1);
            obs.hp -= 1;

            if (obs.type === 'mega' && obs.hp === 1) {
              // Mega asteroid cracked
              obs.cracked = true;
              engine.screenShake = 6;
              soundManager.playShieldHit();
              engine.floatingTexts.push({
                x: obs.x,
                y: obs.y - 20,
                text: 'CRACKED!',
                color: '#ef4444',
                alpha: 1,
                vy: -50
              });
            } else if (obs.hp <= 0) {
              // Destroyed!
              const isMega = obs.type === 'mega';
              const pts = isMega ? 300 : obs.type === 'comet' ? 200 : 150;
              engine.score += pts;
              setScore(engine.score);
              engine.asteroidsDestroyed += 1;
              engine.screenShake = isMega ? 12 : 5;

              soundManager.playExplosion(isMega);

              // Spawn 18+ particles
              const particleCount = isMega ? 28 : 16;
              for (let pIdx = 0; pIdx < particleCount; pIdx++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 160 + 50;
                engine.particles.push({
                  x: obs.x,
                  y: obs.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  size: Math.random() * 4 + 1.5,
                  alpha: 1,
                  decay: Math.random() * 1.5 + 1.2,
                  color: isMega ? '#ef4444' : obs.type === 'comet' ? '#38bdf8' : '#e4e4e7'
                });
              }

              // Floating Score Popup
              engine.floatingTexts.push({
                x: obs.x,
                y: obs.y,
                text: `+${pts} PTS`,
                color: isMega ? '#f59e0b' : '#38bdf8',
                alpha: 1,
                vy: -45
              });

              engine.obstacles.splice(i, 1);
              break;
            }
          }
        }

        // ----------------------------------------------------
        // Player vs Obstacle Collision Detection
        // ----------------------------------------------------
        if (p.invulnerableTimer <= 0 && !engine.touchdownSequence) {
          const playerDist = Math.hypot(p.x - obs.x, p.y - obs.y);
          if (playerDist < obs.radius + p.width * 0.4) {
            // Collision!
            p.shields -= 1;
            setShields(p.shields);
            p.invulnerableTimer = 0.9; // 0.9s invulnerability blinking
            engine.screenShake = 14;

            soundManager.playShieldHit();

            // Destroy the obstacle on impact
            engine.obstacles.splice(i, 1);

            // Red hull impact sparks
            for (let sIdx = 0; sIdx < 16; sIdx++) {
              const angle = Math.random() * Math.PI * 2;
              const spd = Math.random() * 140 + 40;
              engine.particles.push({
                x: p.x,
                y: p.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd,
                size: Math.random() * 3 + 1,
                alpha: 1,
                decay: 2.0,
                color: '#ef4444'
              });
            }

            if (p.shields <= 0) {
              // Game Over
              engine.isRunning = false;
              setGameState('gameover');
              soundManager.playQuizFail();
              return;
            }
          }
        }
      }

      // ========================================================
      // 7. PARTICLES & FLOATING SCORE POPUPS
      // ========================================================
      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const pt = engine.particles[i];
        pt.x += pt.vx * dt;
        pt.y += pt.vy * dt;
        pt.alpha -= pt.decay * dt;

        if (pt.alpha <= 0) {
          engine.particles.splice(i, 1);
          continue;
        }

        ctx.fillStyle = pt.color;
        ctx.globalAlpha = Math.max(0, pt.alpha);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      for (let i = engine.floatingTexts.length - 1; i >= 0; i--) {
        const ft = engine.floatingTexts[i];
        ft.y += ft.vy * dt;
        ft.alpha -= dt * 1.4;

        if (ft.alpha <= 0) {
          engine.floatingTexts.splice(i, 1);
          continue;
        }

        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.font = 'bold 12px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.globalAlpha = 1;
      }

      // ========================================================
      // 8. RENDER PLAYER SPACECRAFT (Nothing OS Retro-Aesthetic)
      // ========================================================
      const isBlinking = p.invulnerableTimer > 0 && Math.floor(timestamp / 80) % 2 === 0;

      if (!isBlinking) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.tilt);

        // Twin Plasma Thruster Flames
        const flameLength = Math.random() * 12 + 16;
        const flameGrad = ctx.createLinearGradient(0, 20, 0, 20 + flameLength);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.3, '#38bdf8');
        flameGrad.addColorStop(1, 'rgba(56, 189, 248, 0)');

        ctx.fillStyle = flameGrad;
        // Left thruster flame
        ctx.beginPath();
        ctx.moveTo(-12, 18);
        ctx.lineTo(-8, 20 + flameLength);
        ctx.lineTo(-4, 18);
        ctx.fill();
        // Right thruster flame
        ctx.beginPath();
        ctx.moveTo(4, 18);
        ctx.lineTo(8, 20 + flameLength);
        ctx.lineTo(12, 18);
        ctx.fill();

        // Rocket Main Fuselage (Sleek Nothing OS metallic chassis)
        ctx.fillStyle = '#f4f4f5';
        ctx.beginPath();
        ctx.moveTo(0, -26); // Nosecone tip
        ctx.lineTo(14, 16);  // Right wing root
        ctx.lineTo(20, 18);  // Right wing tip
        ctx.lineTo(8, 20);   // Right engine mount
        ctx.lineTo(-8, 20);  // Left engine mount
        ctx.lineTo(-20, 18); // Left wing tip
        ctx.lineTo(-14, 16); // Left wing root
        ctx.closePath();
        ctx.fill();

        // Dark cockpit visor with cyan glass glow
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(5, 2);
        ctx.lineTo(-5, 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Red Nothing OS Signature Wingtip LEDs
        ctx.fillStyle = '#eb2e2e';
        ctx.beginPath();
        ctx.arc(-19, 18, 2, 0, Math.PI * 2);
        ctx.arc(19, 18, 2, 0, Math.PI * 2);
        ctx.fill();

        // Shield Energy Bubble (if shields remain)
        if (p.shields > 0) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(0, 0, 32, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.restore();
      }

      ctx.restore();
      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen, destination, gameState, touchControls, initGame]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 select-none overflow-hidden animate-in fade-in duration-200">
      {/* FULLSCREEN GAME CANVAS */}
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair"
      />

      {/* ========================================================
          TOP FLIGHT TELEMETRY HUD BAR
         ======================================================== */}
      <div className="fixed top-4 left-4 right-4 z-40 pointer-events-none flex items-center justify-between">
        {/* Left: Origin to Destination Progress Tracker */}
        <div className="glass-panel px-4 py-2.5 rounded-2xl border border-white/15 flex items-center gap-3 backdrop-blur-xl pointer-events-auto">
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-zinc-400">🌍 EARTH</span>
            <div className="w-24 sm:w-36 h-2 rounded-full bg-white/10 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-white flex items-center gap-1">
              <span>{destination === 'mars' ? '🔴' : '🌕'}</span>
              <span>{destinationLabel}</span>
            </span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/15" />

          {/* Speedometer */}
          <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-zinc-300">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>{speedKmh.toLocaleString()} KM/H</span>
          </div>
        </div>

        {/* Center: Hazard Belt Alert Banner */}
        {isHazardBelt && (
          <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/20 border border-red-500/50 text-red-400 font-mono text-xs font-bold tracking-widest uppercase animate-pulse backdrop-blur-xl">
            <AlertTriangle className="w-4 h-4" />
            <span>DANGER // MAXIMUM ASTEROID DENSITY BELT</span>
          </div>
        )}

        {/* Right: Shields, Score & Exit */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Shields Display */}
          <div className="glass-panel px-3.5 py-2 rounded-2xl border border-white/15 flex items-center gap-2 backdrop-blur-xl font-mono text-xs">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-zinc-400 hidden sm:inline">SHIELDS:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((cell) => (
                <span
                  key={cell}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    shields >= cell
                      ? 'bg-cyan-400 shadow-[0_0_8px_#38bdf8]'
                      : 'bg-zinc-700/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Score Counter */}
          <div className="glass-panel px-3.5 py-2 rounded-2xl border border-white/15 font-mono text-xs text-white font-bold backdrop-blur-xl">
            <span className="text-zinc-500 mr-1.5">SCORE:</span>
            <span className="text-cyan-300">{score.toLocaleString()}</span>
          </div>

          {/* Exit Game Button */}
          <button
            onClick={() => {
              soundManager.playBlip(600, 0.04);
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/15 text-zinc-400 hover:text-white transition-all backdrop-blur-xl"
            title="Exit Simulator [ESC]"
            aria-label="Exit Game"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ========================================================
          BOTTOM HUD CONTROLS HINT (Desktop)
         ======================================================== */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 pointer-events-none hidden md:flex items-center gap-4 px-4 py-2 rounded-full glass-panel border border-white/10 text-[11px] font-mono text-zinc-400 backdrop-blur-md">
        <span>[W,A,S,D / ARROWS] MANEUVER SHIP</span>
        <span className="text-zinc-600">•</span>
        <span>[SPACEBAR] PLASMA CANNONS</span>
        <span className="text-zinc-600">•</span>
        <span>[ESC] ABORT MISSION</span>
      </div>

      {/* ========================================================
          MOBILE ON-SCREEN TOUCH CONTROLS
         ======================================================== */}
      <div className="fixed inset-x-4 bottom-6 z-40 md:hidden flex items-end justify-between pointer-events-none">
        {/* Left: Virtual D-Pad */}
        <div className="relative w-36 h-36 rounded-full glass-panel border border-white/15 p-2 pointer-events-auto backdrop-blur-xl">
          {/* Up */}
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, up: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, up: false })); }}
            className={`absolute top-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              touchControls.up ? 'bg-cyan-500/40 text-cyan-300' : 'bg-white/5 text-zinc-300'
            }`}
          >
            <ArrowUp className="w-5 h-5" />
          </button>
          {/* Down */}
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, down: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, down: false })); }}
            className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              touchControls.down ? 'bg-cyan-500/40 text-cyan-300' : 'bg-white/5 text-zinc-300'
            }`}
          >
            <ArrowDown className="w-5 h-5" />
          </button>
          {/* Left */}
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, left: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, left: false })); }}
            className={`absolute left-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              touchControls.left ? 'bg-cyan-500/40 text-cyan-300' : 'bg-white/5 text-zinc-300'
            }`}
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          {/* Right */}
          <button
            onTouchStart={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, right: true })); }}
            onTouchEnd={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, right: false })); }}
            className={`absolute right-1 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              touchControls.right ? 'bg-cyan-500/40 text-cyan-300' : 'bg-white/5 text-zinc-300'
            }`}
          >
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        {/* Right: Circular FIRE Button */}
        <button
          onTouchStart={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, fire: true })); }}
          onTouchEnd={(e) => { e.preventDefault(); setTouchControls((p) => ({ ...p, fire: false })); }}
          className={`w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center font-mono font-bold text-xs pointer-events-auto transition-all shadow-2xl ${
            touchControls.fire
              ? 'bg-cyan-500 border-white text-black scale-95 shadow-[0_0_25px_#38bdf8]'
              : 'bg-cyan-500/20 border-cyan-400 text-cyan-300 backdrop-blur-xl'
          }`}
        >
          <Zap className="w-6 h-6 mb-0.5" />
          <span>FIRE</span>
        </button>
      </div>

      {/* ========================================================
          GAME OVER MODAL OVERLAY
         ======================================================== */}
      {gameState === 'gameover' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="max-w-md w-full glass-panel-interactive border border-red-500/30 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="font-mono text-xs text-red-500 uppercase tracking-widest mb-1 font-bold">
              MISSION TERMINATED // HULL BREACH
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Ship Shields Depleted
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
              Catastrophic asteroid collision during interplanetary transit. Flight telemetry logged at{' '}
              <span className="text-white font-mono font-bold">{progressPercent}%</span> of journey.
            </p>

            {/* Stats Telemetry Box */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 mb-6 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">FINAL SCORE</span>
                <span className="text-white font-bold text-sm">{score.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">DISTANCE REACHED</span>
                <span className="text-cyan-400 font-bold text-sm">{progressPercent}%</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={initGame}
                className="liquid-metal-btn w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-mono font-bold text-white shadow-lg"
              >
                <RotateCcw className="w-4 h-4" />
                <span>RETRY EXPEDITION</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-all"
              >
                RETURN TO SPACE ODYSSEY
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          VICTORY TOUCHDOWN MODAL OVERLAY
         ======================================================== */}
      {gameState === 'victory' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-300">
          <div className="max-w-md w-full glass-panel-interactive border border-emerald-500/40 rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-2 font-bold">
              <span>TOUCHDOWN CONFIRMED</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Welcome to {destinationLabel}!
            </h2>

            <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
              You navigated through high-velocity asteroid belts and safely touched down at the celestial surface.
            </p>

            {/* Victory Scorecard */}
            <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/60 border border-white/10 mb-6 font-mono text-xs">
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">EXPEDITION SCORE</span>
                <span className="text-emerald-400 font-bold text-sm">{score.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase">SHIELDS INTACT</span>
                <span className="text-white font-bold text-sm">{shields} / 3</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={initGame}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-xs font-mono font-bold text-white shadow-xl transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                  boxShadow: '0 0 25px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Rocket className="w-4 h-4" />
                <span>FLY ANOTHER EXPEDITION</span>
              </button>

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
              >
                EXPLORE CELESTIAL MONUMENTS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
