# The Future: Earth, Moon & Mars (Interactive Edition)

### NASA Space Apps Challenge 2026 // Category: "Abandoned but Not Forgotten"

An interactive, scroll-driven and touch-rotatable 3D web experience that reframes NASA's discarded celestial hardware from "space junk" into enduring monuments of human exploration and scientific heritage.

Built with **React**, **Vite**, **Tailwind CSS**, **Three.js**, **@react-three/fiber**, **@react-three/drei**, and **GSAP (with ScrollTrigger)**, under a strict **Nothing OS** / **glassmorphic** dark mode aesthetic.

---

## 🌟 Key Highlights & Architecture

### 1. Visual Aesthetic & Theming (Nothing OS & Neumorphism)
- **Deep Monochromatic Palette**: Pitch blacks (`#08080a`), metallic deep grays, crisp whites, and silver highlights.
- **Nothing OS Red Accent**: Pulsing indicators (`#eb2e2e`) denoting active telemetry feeds and live beacons.
- **Glassmorphism & Translucency**: High backdrop-blur panels (`backdrop-blur-xl`), ultra-thin metallic borders (`border-white/12`), and inner glows.
- **Liquid Metal Hover Effects**: Interactive buttons featuring dynamic radial metallic sheens.
- **Dot-Matrix Grids & Typography**: Monospace telemetry readouts paired with minimal, ultra-clean headings (`Space Grotesk` & `JetBrains Mono`).

### 2. Core Layout Architecture
- **Fixed Full-Viewport 3D Canvas**: Positioned fixed in the background (`z-0`) rendering Earth, Moon, Mars, starfield, and atmospheric rim glows.
- **Layered Transparent Scroll Container**: High `z-index` DOM container allowing fluid mouse-wheel and touch scrolling while the 3D scene responds synchronously.

### 3. Official NASA 3D GLB Models & Interactivity
- **Local Assets Loaded via `useGLTF`**:
  - `public/earth.glb` (NASA Solar System Treks)
  - `public/moon.glb` (NASA Solar System Treks)
  - `public/mars.glb` (NASA Solar System Treks)
- **Drag-to-Rotate Micro-Navigation**: Wrapped with `<OrbitControls enableZoom={false} enablePan={false} />`, enabling visitors to freely spin each planet in 360° without interrupting vertical page scroll.

### 4. GSAP ScrollTrigger Journey
- **Section 1 (Earth // The Origin)**: Earth starts centered. As the user scrolls down, Earth smoothly scales down and glides off-screen.
- **Section 2 (Moon // The Heritage)**: Seamlessly scrubs the Moon into the center of the viewport with smooth lerp physics (`scrub: 1.4`).
- **Section 3 (Mars // The Frontier)**: Scales the Moon out and scrubs Mars into the central viewport.
- **Section 4 (Preservation Manifesto)**: Explores the Artemis Accords preservation framework and complete relic directory.

### 5. Interactive Hotspots (Micro-Interactions)
Glowing circular pins anchored to precise surface coordinates using Drei's `<Html>` component. When clicked:
1. **Pauses Planet Auto-Rotation**: Keeps the target stationary for comfortable inspection.
2. **Audio Chirp**: Synthesizes a tactile telemetry blip via Web Audio API.
3. **Glassmorphic Story Card**: Expands next to the pin, answering the **5 NASA mandated questions**:
   - **1. What is it?** (Identity & Mission details)
   - **2. Why was it left behind?** (Engineering rationale, fuel savings, weight trade-offs)
   - **3. What did it achieve?** (Scientific milestones & historical breakthroughs)
   - **4. Where is it now?** (Exact landing coordinates & current physical state)
   - **5. Why does it matter today?** (Modern relevance, Artemis Accords, preservation)

---

## 🛰️ Catalogued Celestial Monuments

| Celestial Body | Artifact Name | Mission & Date | Landing Site |
| :--- | :--- | :--- | :--- |
| **Moon** | Apollo 11 LM Descent Stage (*Eagle*) | Apollo 11 (July 20, 1969) | Mare Tranquillitatis (`0.67408° N, 23.47297° E`) |
| **Moon** | Lunar Roving Vehicle (*LRV-001*) | Apollo 15 (July 30, 1971) | Hadley-Apennine (`26.1322° N, 3.6339° E`) |
| **Moon** | Surveyor 3 Robotic Lander | Surveyor Program (April 20, 1967) | Oceanus Procellarum (`3.0163° S, 23.4180° W`) |
| **Mars** | Ingenuity Mars Helicopter | Mars 2020 (Feb 18, 2021) | Jezero Crater (`18.4447° N, 77.4508° E`) |
| **Mars** | Viking 1 Lander | Viking Program (July 20, 1976) | Chryse Planitia (`22.48° N, 47.97° W`) |
| **Mars** | Opportunity Rover (*MER-B / Oppy*) | MER (Jan 25, 2004) | Meridiani Planum (`1.95° S, 354.47° E`) |

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🏛️ Hackathon Compliance & Data Citations
- **Data Backbone**: NASA Space Science Data Coordinated Archive (NSSDCA)
- **3D Assets**: NASA Solar System Treks 3D Interactive Library
- **Preservation Policy**: Artemis Accords §5.4 (Protecting Lunar and Martian Historic Sites)
- **AI Tooling**: Antigravity AI Engine
