import React, { useState } from 'react';
import { CELESTIAL_BODIES, HOTSPOTS_DATA, CELESTIAL_MODELS_DATA } from '../data/spaceData';
import {
  MapPin,
  ChevronRight,
  Rocket,
  Compass,
  ArrowRight,
  BookOpen,
  Crosshair,
  Shield,
  Award,
  RotateCcw,
  Box,
  Layers,
  Sparkles
} from 'lucide-react';
import { soundManager } from '../utils/audio';
import GallerySection from './GallerySection';

export default function Sections({
  activePlanet,
  selectedHotspot,
  onSelectHotspot,
  onOpenDirectory,
  onNavigate,
  selectedModelId = 'apollo',
  onSelectModelId
}) {
  // Mobile View Modes for small screens (< lg)
  const [mobileViewMode, setMobileViewMode] = useState('details'); // 'details' | 'catalog' | '3d'
  const [mobileModelMode, setMobileModelMode] = useState('specs'); // 'specs' | 'catalog' | '3d'

  // Available artifacts for current planet strictly from NASA prompt document
  const currentArtifacts =
    activePlanet === 'moon'
      ? HOTSPOTS_DATA.moon
      : activePlanet === 'mars'
      ? HOTSPOTS_DATA.mars
      : [];

  // Default to first artifact if none currently selected
  const activeArtifact =
    selectedHotspot || (currentArtifacts.length > 0 ? currentArtifacts[0] : null);

  const currentBody = CELESTIAL_BODIES[activePlanet] || CELESTIAL_BODIES.earth;

  // The active target label for the floating pill badge
  const targetLabel =
    activeArtifact?.targetName ||
    activeArtifact?.shortLabel ||
    activeArtifact?.title ||
    (activePlanet === 'mars' ? 'Sojourner' : 'Apollo Lunar Modules');

  // Official catalog items strictly from the NASA prompt document
  const catalogList = currentArtifacts;

  const allModelsMeta = {
    id: 'all',
    name: 'SOLAR SYSTEM TRIO',
    tag: 'TRIPLE 3D SHOWCASE // 04',
    format: '3x GLTF 2.0 Binary',
    filesize: '20.2 MB TOTAL',
    polygons: '85,800 Triangles',
    textures: 'Combined 4K PBR Shaders',
    diameter: 'Earth, Moon & Mars',
    orbitSpeed: 'Interplanetary',
    sitesTarget: 'earth'
  };

  const currentModelMeta =
    selectedModelId === 'all'
      ? allModelsMeta
      : (CELESTIAL_MODELS_DATA &&
          CELESTIAL_MODELS_DATA.find((m) => m.id === selectedModelId)) ||
        (CELESTIAL_MODELS_DATA && CELESTIAL_MODELS_DATA[0]) ||
        allModelsMeta;

  return (
    <div className="relative z-10 w-full h-full pointer-events-none select-none">
      {/* ========================================================
          1. EARTH HERO SECTION (Clean Left Alignment)
         ======================================================== */}
      {activePlanet === 'earth' && (
        <div className="fixed top-20 sm:top-28 left-4 sm:left-12 lg:left-16 bottom-6 sm:bottom-8 z-30 pointer-events-none flex flex-col justify-between max-w-[calc(100vw-2rem)] sm:max-w-[500px] lg:max-w-[520px] max-h-[calc(100vh-6rem)] overflow-y-auto no-scrollbar animate-in fade-in duration-300">
          <div className="pointer-events-auto">
            {/* Origin Telemetry Tag */}
            <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] sm:text-[11px] font-mono tracking-widest text-zinc-300 mb-3 sm:mb-5 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
              <span>ORIGIN // 0.000 KM</span>
            </div>

            {/* Main Title - Cleanly formatted on two unbroken lines */}
            <h1 className="text-2xl sm:text-5xl lg:text-[3.25rem] font-bold tracking-tight text-white mb-3 sm:mb-5 leading-[1.08]">
              THE FUTURE: <br />
              <span className="text-zinc-400 font-light block mt-1">
                EARTH, MOON & MARS
              </span>
            </h1>

            {/* Glass Narrative Box */}
            <div
              className="glass-panel p-4 sm:p-6 lg:p-7 rounded-2xl sm:rounded-3xl border border-white/15 mb-4 sm:mb-6 backdrop-blur-xl shadow-2xl"
              style={{ background: 'rgba(10, 12, 18, 0.85)' }}
            >
              <h2 className="text-[11px] sm:text-xs font-mono font-bold tracking-wider text-red-400 uppercase mb-2 sm:mb-2.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>NASA SPACE APPS // "ABANDONED BUT NOT FORGOTTEN"</span>
              </h2>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed font-sans mb-3 sm:mb-4">
                What popular culture dismisses as "space junk" is actually the archaeological
                monuments of human courage. Every descent stage, robotic rover, and antenna left on
                extraterrestrial ground represents a monumental triumph of engineering.
              </p>
              <div className="flex flex-wrap gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-mono text-zinc-400 pt-2.5 sm:pt-3 border-t border-white/10">
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                  NSSDCA VERIFIED
                </span>
                <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-white/5 border border-white/10 text-white font-medium">
                  3D INTERACTIVE EXPEDITION
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={() => {
                  soundManager.playTransition();
                  onNavigate('moon');
                }}
                className="liquid-metal-btn flex items-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-full text-xs font-mono font-bold text-white tracking-wider shadow-lg"
              >
                <span>DEPART FOR MOON</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  soundManager.playTransition();
                  onNavigate('models');
                }}
                className="px-4 sm:px-5 py-3 sm:py-3.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all backdrop-blur-md"
              >
                EXPLORE 3D MODELS
              </button>
            </div>
          </div>

          {/* Bottom Interaction Prompt */}
          <div className="pointer-events-auto flex items-center justify-between text-[11px] sm:text-xs font-mono text-zinc-500 pt-3 border-t border-white/5 mt-3 sm:mt-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
              <span className="hidden sm:inline">CLICK & DRAG TO SPIN CELESTIAL BODIES</span>
              <span className="sm:hidden">DRAG TO SPIN 3D GLOBE</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-400">
              <span className="hidden sm:inline">PRESS [→] TO ADVANCE</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          MOBILE/TABLET VIEW MODE SWITCHER FOR MOON & MARS (< lg)
         ======================================================== */}
      {(activePlanet === 'moon' || activePlanet === 'mars') && (
        <div className="lg:hidden fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-35 pointer-events-auto flex items-center gap-1 glass-panel p-1 rounded-full border border-white/20 shadow-2xl bg-black/85 backdrop-blur-xl">
          <button
            onClick={() => {
              soundManager.playBlip(800, 0.03);
              setMobileViewMode('details');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileViewMode === 'details'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>DETAILS</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBlip(800, 0.03);
              setMobileViewMode('catalog');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileViewMode === 'catalog'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>CATALOG ({catalogList.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBlip(600, 0.03);
              setMobileViewMode(mobileViewMode === '3d' ? 'details' : '3d');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileViewMode === '3d'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>3D VIEW</span>
          </button>
        </div>
      )}

      {/* ========================================================
          2. MOON & MARS: LEFT-BOTTOM DETAIL CARD
         ======================================================== */}
      {(activePlanet === 'moon' || activePlanet === 'mars') && activeArtifact && (
        <div className={`fixed bottom-4 left-4 sm:bottom-8 sm:left-8 z-30 max-w-[420px] sm:max-w-[450px] w-[calc(100vw-2rem)] pointer-events-auto animate-in fade-in slide-in-from-bottom-6 duration-300 ${
          mobileViewMode === 'details' ? 'block' : 'hidden'
        } lg:block`}>
          <div
            className="glass-panel-interactive rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-2xl max-h-[calc(100vh-10rem)] sm:max-h-none overflow-y-auto no-scrollbar"
            style={{ background: 'rgba(10, 12, 18, 0.88)' }}
          >
            {/* Subtle Corner Glow Accent */}
            <div
              className="absolute -top-16 -right-16 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25"
              style={{
                backgroundColor: activeArtifact?.color || '#38bdf8'
              }}
            />

            <div>
              {/* Top Row: Category Pill Badge & Date Tag */}
              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                <span
                  className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-wider uppercase border"
                  style={{
                    backgroundColor: `${activeArtifact.color || '#38bdf8'}15`,
                    borderColor: `${activeArtifact.color || '#38bdf8'}50`,
                    color: activeArtifact.color || '#38bdf8'
                  }}
                >
                  {activeArtifact.badgeTag || 'CATALOGED SITE'}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400">
                  {activeArtifact.date}
                </span>
              </div>

              {/* Title & Landing Site */}
              <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                {activeArtifact.title}
              </h2>

              <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-300 mb-2.5 sm:mb-3">
                <MapPin
                  className="w-3.5 h-3.5 shrink-0"
                  style={{ color: activeArtifact.color || '#38bdf8' }}
                />
                <span className="truncate">{activeArtifact.site}</span>
              </div>

              {/* Summary Paragraph */}
              <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-3 sm:mb-4 line-clamp-3">
                {activeArtifact.summary || activeArtifact.answers.what}
              </p>

              {/* 2-Column Telemetry Box */}
              <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-2xl bg-black/60 border border-white/10 mb-3 sm:mb-4 font-mono">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    COORDINATES
                  </span>
                  <span className="text-white text-xs font-semibold block truncate">
                    {activeArtifact.coords}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    SPACE AGENCY
                  </span>
                  <span
                    className="text-xs font-semibold block truncate"
                    style={{ color: activeArtifact.color || '#38bdf8' }}
                  >
                    {activeArtifact.agency || activeArtifact.mission}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              {activeArtifact?.modelId && (
                <button
                  onClick={() => {
                    soundManager.playTargetLock();
                    onSelectModelId?.(activeArtifact.modelId);
                    onNavigate('models');
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-mono font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-2 border border-cyan-400/40"
                  style={{
                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                    boxShadow: '0 0 25px rgba(14, 165, 233, 0.4)'
                  }}
                >
                  <Box className="w-4 h-4 text-cyan-300" />
                  <span>INSPECT 3D MODEL ({activeArtifact.modelId.toUpperCase()})</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>
              )}

              <button
                onClick={() => {
                  soundManager.playTargetLock();
                  onOpenDirectory();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-xl sm:rounded-2xl text-xs font-mono font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] mb-2"
                style={{
                  background: 'linear-gradient(135deg, #0ea5e9 0%, #1e40af 100%)',
                  boxShadow: '0 0 25px rgba(14, 165, 233, 0.35)'
                }}
              >
                <Rocket className="w-4 h-4" />
                <span>COMMENCE EXPEDITION & VIEW REPORT</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Secondary Direct Access Button */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-zinc-400 pt-1">
                {activeArtifact?.modelId ? (
                  <button
                    onClick={() => {
                      soundManager.playTargetLock();
                      onSelectModelId?.(activeArtifact.modelId);
                      onNavigate('models');
                    }}
                    className="flex items-center gap-1.5 text-cyan-400 hover:text-white transition-colors"
                  >
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DIRECT 3D MODEL ACCESS</span>
                  </button>
                ) : (
                  <span className="flex items-center gap-1.5 text-zinc-400">
                    <Compass className="w-3.5 h-3.5 text-cyan-400" />
                    <span>DIRECT 3D SURFACE ACCESS</span>
                  </span>
                )}
                <span className="text-zinc-500 hidden sm:inline">PRESS [ESC] TO DESELECT</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          3. MOON & MARS: RIGHT SIDEBAR (Official NASA Prompt Sites)
         ======================================================== */}
      {(activePlanet === 'moon' || activePlanet === 'mars') && (
        <aside className={`fixed top-32 sm:top-36 lg:top-20 right-4 sm:right-8 z-30 w-[calc(100vw-2rem)] sm:w-84 max-w-[380px] pointer-events-auto flex flex-col gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-right-6 duration-300 ${
          mobileViewMode === 'catalog' ? 'flex' : 'hidden'
        } lg:flex`}>
          {/* Floating Target Pill Badge */}
          <div className="flex justify-end mb-1">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#0c121c]/90 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {/* Cyan Target Reticle Icon */}
              <div className="relative flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 sm:w-4 h-3.5 sm:h-4"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2v3" />
                  <path d="M12 19v3" />
                  <path d="M2 12h3" />
                  <path d="M19 12h3" />
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-mono text-[11px] sm:text-xs tracking-wider text-cyan-200 uppercase">
                TARGET:{' '}
                <span className="font-bold text-white tracking-wider">
                  {targetLabel}
                </span>
              </span>
            </div>
          </div>

          {/* Catalogue Header Row */}
          <div className="flex items-center justify-between text-xs font-mono tracking-wider px-1 text-cyan-400 font-semibold mt-1">
            <span className="tracking-widest uppercase text-[11px] sm:text-xs">
              {activePlanet === 'mars' ? 'MARS CATALOGED SITES' : 'LUNAR CATALOGED SITES'}
            </span>
            <span className="tracking-widest text-[11px] sm:text-xs">
              {catalogList.length} CATALOGED
            </span>
          </div>

          {/* Vertical Stack of Catalogue Site Cards */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-14rem)] pr-1 select-none">
            {catalogList.map((spot) => {
              const isSelected = activeArtifact?.id === spot.id;
              return (
                <button
                  key={spot.id}
                  onClick={() => {
                    soundManager.playTargetLock();
                    onSelectHotspot(spot);
                    if (window.innerWidth < 1024) {
                      setMobileViewMode('details');
                    }
                  }}
                  className={`w-full text-left p-3 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#121824]/95 border-white/25 shadow-xl'
                      : 'bg-[#0b0f17]/80 hover:bg-[#121824]/90 border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? '0 0 25px rgba(6, 182, 212, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.03)'
                      : undefined
                  }}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold font-sans tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-snug">
                        {spot.title}
                      </h4>
                      {spot.modelId && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider shrink-0">
                          3D MODEL
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-mono text-zinc-400 truncate mt-1">
                      {spot.site}
                    </p>
                  </div>

                  {/* Red Chevron when active, dim when inactive */}
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${
                      isSelected ? 'text-[#eb2e2e]' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Link to 3D Models Lab */}
          <button
            onClick={() => {
              soundManager.playTransition();
              onNavigate('models');
            }}
            className="liquid-metal-btn flex items-center justify-center gap-2 p-3 rounded-2xl text-xs font-mono text-zinc-300 hover:text-white border border-white/15 mt-1"
          >
            <Box className="w-3.5 h-3.5 text-zinc-400" />
            <span>EXPLORE 3D MODELS LAB</span>
          </button>
        </aside>
      )}

      {/* ========================================================
          MOBILE/TABLET VIEW MODE SWITCHER FOR 3D MODELS (< lg)
         ======================================================== */}
      {(activePlanet === 'models' || activePlanet === 'archive') && (
        <div className="lg:hidden fixed top-24 sm:top-28 left-1/2 -translate-x-1/2 z-35 pointer-events-auto flex items-center gap-1 glass-panel p-1 rounded-full border border-white/20 shadow-2xl bg-black/85 backdrop-blur-xl">
          <button
            onClick={() => {
              soundManager.playBlip(800, 0.03);
              setMobileModelMode('specs');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileModelMode === 'specs'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>3D SPECS</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBlip(800, 0.03);
              setMobileModelMode('catalog');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileModelMode === 'catalog'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>MODELS ({CELESTIAL_MODELS_DATA.length})</span>
          </button>

          <button
            onClick={() => {
              soundManager.playBlip(600, 0.03);
              setMobileModelMode(mobileModelMode === '3d' ? 'specs' : '3d');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-[11px] font-mono tracking-wider transition-all ${
              mobileModelMode === '3d'
                ? 'bg-white text-black font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Crosshair className="w-3 h-3" />
            <span>FULL 3D</span>
          </button>
        </div>
      )}

      {/* ========================================================
          3B. 3D MODELS CATALOGUE (Like Catalog Sites)
         ======================================================== */}
      {(activePlanet === 'models' || activePlanet === 'archive') && (
        <aside className={`fixed top-32 sm:top-36 lg:top-20 right-4 sm:right-8 z-30 w-[calc(100vw-2rem)] sm:w-84 max-w-[380px] pointer-events-auto flex flex-col gap-2.5 sm:gap-3 animate-in fade-in slide-in-from-right-6 duration-300 ${
          mobileModelMode === 'catalog' ? 'flex' : 'hidden'
        } lg:flex`}>
          {/* Floating Target Pill Badge */}
          <div className="flex justify-end mb-1">
            <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-2xl bg-[#0c121c]/90 border border-white/20 backdrop-blur-xl shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              {/* Cyan Target Reticle Icon */}
              <div className="relative flex items-center justify-center w-4 sm:w-5 h-4 sm:h-5 text-cyan-400 shrink-0">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-3.5 sm:w-4 h-3.5 sm:h-4"
                >
                  <circle cx="12" cy="12" r="8" />
                  <path d="M12 2v3" />
                  <path d="M12 19v3" />
                  <path d="M2 12h3" />
                  <path d="M19 12h3" />
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" />
                </svg>
              </div>
              <span className="font-mono text-[11px] sm:text-xs tracking-wider text-cyan-200 uppercase">
                TARGET:{' '}
                <span className="font-bold text-white tracking-wider">
                  {currentModelMeta?.name || 'CELESTIAL ASSET'}
                </span>
              </span>
            </div>
          </div>

          {/* Catalogue Header Row */}
          <div className="flex items-center justify-between text-xs font-mono tracking-wider px-1 text-cyan-400 font-semibold mt-1">
            <span className="tracking-widest uppercase text-[11px] sm:text-xs">
              3D MODELS CATALOG
            </span>
            <span className="tracking-widest text-[11px] sm:text-xs">
              {CELESTIAL_MODELS_DATA.length} MODELS
            </span>
          </div>

          {/* Vertical Stack of Catalogue Model Cards */}
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-16rem)] sm:max-h-[calc(100vh-14rem)] pr-1 select-none">
            {CELESTIAL_MODELS_DATA.map((model, idx) => {
              const isSelected = selectedModelId === model.id;
              const numberPrefix = `0${idx + 1}.`;
              return (
                <button
                  key={model.id}
                  onClick={() => {
                    soundManager.playTargetLock();
                    onSelectModelId?.(model.id);
                    if (window.innerWidth < 1024) {
                      setMobileModelMode('specs');
                    }
                  }}
                  className={`w-full text-left p-3 sm:p-4 rounded-2xl transition-all duration-300 flex items-center justify-between group border backdrop-blur-xl ${
                    isSelected
                      ? 'bg-[#121824]/95 border-white/25 shadow-xl scale-[1.01]'
                      : 'bg-[#0b0f17]/80 hover:bg-[#121824]/90 border-white/10 hover:border-white/20'
                  }`}
                  style={{
                    boxShadow: isSelected
                      ? '0 0 25px rgba(6, 182, 212, 0.2), inset 0 0 15px rgba(255, 255, 255, 0.03)'
                      : undefined
                  }}
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="text-[11px] sm:text-xs font-mono font-bold text-zinc-500 group-hover:text-cyan-400 transition-colors shrink-0">
                        {numberPrefix}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold font-sans tracking-tight text-white group-hover:text-cyan-200 transition-colors leading-snug truncate">
                        {model.name}
                      </h4>
                      <span className="px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase tracking-wider shrink-0">
                        GLTF 2.0
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-xs font-mono text-zinc-400 truncate mt-1">
                      {model.tag || `${model.polygons} • ${model.filesize}`}
                    </p>
                  </div>

                  {/* Red Chevron when active, dim when inactive */}
                  <ChevronRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 ${
                      isSelected ? 'text-[#eb2e2e]' : 'text-zinc-600 group-hover:text-zinc-400'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Bottom Action: View 13 Relics Archive */}
          <button
            onClick={() => {
              soundManager.playTargetLock();
              onOpenDirectory();
            }}
            className="liquid-metal-btn flex items-center justify-center gap-2 p-2.5 sm:p-3 rounded-2xl text-xs font-mono text-zinc-300 hover:text-white border border-white/15 mt-1"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
            <span>VIEW 13 RELICS ARCHIVE</span>
          </button>
        </aside>
      )}

      {/* ========================================================
          4. 3D MODELS SECTION: INTERACTIVE CELESTIAL REPOSITORY
         ======================================================== */}
      {(activePlanet === 'models' || activePlanet === 'archive') && (
        <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 sm:p-8 lg:p-12 pt-28 sm:pt-28 pb-12 sm:pb-14 animate-in fade-in duration-300">
          {/* Top Bar: Section Badge (Clean layout for desktop) */}
          <div className="pointer-events-auto max-w-7xl mx-auto w-full hidden lg:flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 text-[11px] font-mono tracking-widest text-zinc-300 backdrop-blur-xl shadow-lg">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee] animate-pulse" />
                <span>SECTION 04 // 3D MODELS LAB</span>
              </div>
              <span className="hidden md:inline-block font-mono text-xs text-zinc-400 tracking-wider">
                GLTF 2.0 DIGITAL TWINS
              </span>
            </div>
          </div>

          {/* Left Floating Interactive Inspector Box */}
          <div className={`pointer-events-auto max-w-[calc(100vw-2rem)] sm:max-w-md lg:max-w-lg w-full flex flex-col gap-2.5 sm:gap-3 my-auto ${
            mobileModelMode === 'specs' ? 'flex' : 'hidden'
          } lg:flex`}>
            <div
              className="glass-panel p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-white/20 backdrop-blur-2xl shadow-2xl relative overflow-hidden max-h-[calc(100vh-14rem)] overflow-y-auto pr-1 no-scrollbar"
              style={{ background: 'rgba(10, 12, 18, 0.88)' }}
            >
              {/* Corner Glow */}
              <div
                className="absolute -top-12 -right-12 w-36 h-36 rounded-full blur-3xl pointer-events-none opacity-25"
                style={{
                  backgroundColor:
                    selectedModelId === 'apollo'
                      ? '#f59e0b'
                      : selectedModelId === 'pioneer'
                      ? '#6366f1'
                      : selectedModelId === 'mars'
                      ? '#f97316'
                      : selectedModelId === 'moon'
                      ? '#e2e8f0'
                      : '#3b82f6'
                }}
              />

              {/* Model Tag & File Size Badge */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-mono font-bold tracking-widest text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 uppercase">
                  {currentModelMeta?.tag || 'CELESTIAL REPOSITORY'}
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] text-zinc-400">
                  {currentModelMeta?.filesize || '12.9 MB'} // {currentModelMeta?.format || 'GLTF 2.0'}
                </span>
              </div>

              {/* Model Name */}
              <h2 className="text-xl sm:text-3xl font-bold tracking-tight text-white mb-1.5 sm:mb-2">
                {currentModelMeta?.name || 'CELESTIAL DIGITAL TWIN'}
              </h2>

              {/* Description */}
              <p className="text-zinc-300 text-xs sm:text-sm font-sans leading-relaxed mb-3 sm:mb-4">
                Interactive real-time 3D model rendered from NASA orbital telemetry. Click and drag
                anywhere on the screen or on the celestial body to rotate 360° with dynamic inertia and
                subtle cursor parallax.
              </p>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 gap-2 p-2.5 sm:p-3 rounded-2xl bg-black/60 border border-white/10 mb-3 sm:mb-4 font-mono text-xs">
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    POLYGONS & MESH
                  </span>
                  <span className="text-white font-semibold block truncate">
                    {currentModelMeta?.polygons || '32,400 Triangles'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    TEXTURE RESOLUTION
                  </span>
                  <span className="text-white font-semibold block truncate">
                    {currentModelMeta?.textures || '4K PBR Materials'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    DIAMETER
                  </span>
                  <span className="text-white font-semibold block truncate">
                    {currentModelMeta?.diameter || '12,742 KM'}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[9px] uppercase tracking-wider">
                    ORBITAL SPEED
                  </span>
                  <span className="text-cyan-400 font-semibold block truncate">
                    {currentModelMeta?.orbitSpeed || '107,200 KM/H'}
                  </span>
                </div>
              </div>

              {/* 3D Capabilities Pill Row */}
              <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-mono text-zinc-400">
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  ✦ 360° ORBIT DRAG
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  ✦ PARALLAX TILT
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  ✦ ATMOSPHERIC RIM
                </span>
                <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  ✦ 13 RELIC SITES
                </span>
              </div>

              {/* Official NASA Attribution & Credit Line */}
              {(currentModelMeta?.creditLine || currentModelMeta?.nasaSource) && (
                <div className="p-2.5 sm:p-3 rounded-2xl bg-black/60 border border-white/10 mb-3 sm:mb-4 font-mono text-[10px] sm:text-[11px]">
                  <div className="flex items-center justify-between text-zinc-400 mb-1">
                    <span className="uppercase text-[9px] tracking-wider text-zinc-500 font-bold">
                      NASA 3D RESOURCES ATTRIBUTION
                    </span>
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      PUBLIC DOMAIN
                    </span>
                  </div>
                  <div className="text-white font-semibold text-xs truncate">
                    {currentModelMeta?.creditLine || currentModelMeta?.nasaSource}
                  </div>
                  {currentModelMeta?.license && (
                    <div className="text-[9px] sm:text-[10px] text-zinc-400 mt-1 leading-relaxed">
                      {currentModelMeta.license}
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
                {selectedModelId !== 'all' && (
                  <button
                    onClick={() => {
                      soundManager.playTransition();
                      onNavigate(currentModelMeta?.sitesTarget || 'moon');
                    }}
                    className="w-full sm:flex-1 liquid-metal-btn flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl text-xs font-mono font-bold text-white tracking-wider shadow-lg"
                  >
                    <span>EXPLORE {currentModelMeta?.sitesTarget?.toUpperCase() || 'MOON'} SITES</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => {
                    soundManager.playTargetLock();
                    onOpenDirectory();
                  }}
                  className="w-full sm:flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-4 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-mono text-zinc-200 hover:text-white transition-all backdrop-blur-md"
                >
                  <BookOpen className="w-3.5 h-3.5 text-zinc-400" />
                  <span>VIEW 13 RELICS</span>
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Prompts */}
          <div className="pointer-events-auto max-w-7xl mx-auto w-full flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-500 pt-2 border-t border-white/10 pr-20 sm:pr-64">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">CLICK & DRAG TO SPIN 3D MESH 360° // CURSOR PARALLAX ACTIVE</span>
              <span className="sm:hidden">DRAG TO SPIN 3D MODEL 360°</span>
            </div>
            <button
              onClick={() => {
                soundManager.playBlip(700, 0.05);
                onNavigate('earth');
              }}
              className="hidden lg:flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETURN TO ORIGIN (EARTH)</span>
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          5. GALLERY SECTION: PRISM COVERFLOW CAROUSEL
         ======================================================== */}
      {activePlanet === 'gallery' && (
        <GallerySection
          onNavigate={onNavigate}
          onSelectModelId={onSelectModelId}
          onOpenDirectory={onOpenDirectory}
        />
      )}
    </div>
  );
}
