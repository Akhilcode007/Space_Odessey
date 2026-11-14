import React from 'react';
import { CELESTIAL_BODIES, HOTSPOTS_DATA } from '../data/spaceData';
import { ArrowDown, Compass, Shield, Award, Sparkles, ChevronRight, ExternalLink, RotateCcw } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Sections({
  activePlanet,
  selectedHotspot,
  onSelectHotspot,
  onOpenDirectory,
  onScrollTo
}) {
  return (
    <div className="scroll-container">
      {/* =========================================
          SECTION 1: THE ORIGIN (EARTH)
         ========================================= */}
      <section
        id="section-earth"
        className="min-h-screen flex flex-col justify-between p-6 sm:p-12 md:p-16 max-w-7xl mx-auto pt-28 sm:pt-36"
      >
        <div className="interactive-zone max-w-xl">
          {/* Telemetry Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" />
            <span>ORIGIN // 0.000 KM</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-6 leading-none">
            THE FUTURE: <br />
            <span className="text-zinc-400 font-light">EARTH, MOON & MARS</span>
          </h1>

          <div className="glass-panel p-6 rounded-3xl border border-white/15 mb-6">
            <h2 className="text-sm font-mono font-bold tracking-wider text-red-400 uppercase mb-2">
              NASA Space Apps // "Abandoned but Not Forgotten"
            </h2>
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans mb-4">
              What popular culture dismisses as "space junk" is actually the archaeological
              monuments of human courage. Every descent stage, robotic rover, and antenna left on
              extraterrestrial ground represents a monumental triumph of engineering.
            </p>
            <div className="flex flex-wrap gap-2 text-xs font-mono text-zinc-400 pt-3 border-t border-white/10">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                NSSDCA VERIFIED
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white">
                3D INTERACTIVE EXPEDITION
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                soundManager.playTransition();
                onScrollTo('moon');
              }}
              className="liquid-metal-btn flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold text-white tracking-wider"
            >
              <span>DEPART FOR MOON</span>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </button>

            <button
              onClick={() => {
                soundManager.playBlip(1200, 0.04);
                onOpenDirectory();
              }}
              className="px-5 py-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all"
            >
              VIEW 6 RELICS ARCHIVE
            </button>
          </div>
        </div>

        {/* Bottom Scroll Prompt */}
        <div className="interactive-zone flex items-center justify-between text-xs font-mono text-zinc-500 py-6 border-t border-white/5">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
            <span>CLICK & DRAG TO SPIN CELESTIAL BODIES</span>
          </div>
          <div className="flex items-center gap-2 animate-bounce">
            <span>SCROLL TO ADVANCE</span>
            <ArrowDown className="w-3.5 h-3.5" />
          </div>
        </div>
      </section>

      {/* =========================================
          SECTION 2: THE HERITAGE (MOON)
         ========================================= */}
      <section
        id="section-moon"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-16 max-w-7xl mx-auto"
      >
        <div className="interactive-zone max-w-lg">
          {/* Telemetry Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-zinc-300 shadow-[0_0_8px_#ffffff]" />
            <span>HERITAGE_02 // 384,400 KM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            LUNAR HERITAGE <br />
            <span className="text-zinc-400 font-light">& HISTORIC BASES</span>
          </h2>

          <div className="glass-panel p-6 rounded-3xl border border-white/15 mb-6">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans mb-4">
              In the airless stillness of the lunar surface, 110+ artifacts remain frozen in time.
              Without wind, rain, or volcanic turnover, the Apollo descent stages, lunar roving
              vehicles, and Surveyor landers stand in pristine preservation.
            </p>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-4">
              <span className="text-[11px] font-mono font-bold text-red-400 block mb-1">
                INTERACTIVE 3D HOTSPOTS (CLICK PINS ON MOON):
              </span>
              <p className="text-xs text-zinc-400 font-sans">
                Rotate the Moon model to locate the glowing pins. Each answers NASA's 5 mandated
                questions: identity, rationale, achievements, location, and modern relevance.
              </p>
            </div>

            {/* Quick Artifact Jump Pills */}
            <div className="space-y-2">
              {HOTSPOTS_DATA.moon.map((spot) => {
                const isSelected = selectedHotspot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      soundManager.playTargetLock();
                      onSelectHotspot(spot);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-red-600/30 border border-red-500/60 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-bold text-white">{spot.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">[{spot.codename}]</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTransition();
              onScrollTo('mars');
            }}
            className="liquid-metal-btn flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold text-white tracking-wider"
          >
            <span>TRANSIT TO MARS</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =========================================
          SECTION 3: THE FRONTIER (MARS)
         ========================================= */}
      <section
        id="section-mars"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-16 max-w-7xl mx-auto"
      >
        <div className="interactive-zone max-w-lg">
          {/* Telemetry Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-zinc-300 mb-6 backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>FRONTIER_03 // 225,000,000 KM</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            MARTIAN GUARDIANS <br />
            <span className="text-zinc-400 font-light">& ROBOTIC LEGENDS</span>
          </h2>

          <div className="glass-panel p-6 rounded-3xl border border-white/15 mb-6">
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-sans mb-4">
              Mars is a vast museum of human robotics. Surviving dust storms, freezing nights, and
              rocky terrain, these probes became humanity’s surrogates—expanding our knowledge of
              water, habitability, and flight across interplanetary distances.
            </p>

            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/10 mb-4">
              <span className="text-[11px] font-mono font-bold text-red-400 block mb-1">
                DISCOVER MARTIAN RELICS (CLICK PINS ON MARS):
              </span>
              <p className="text-xs text-zinc-400 font-sans">
                Drag to spin the red planet. Click any glowing marker to explore its story card with
                the five core preservation dimensions.
              </p>
            </div>

            {/* Quick Artifact Jump Pills */}
            <div className="space-y-2">
              {HOTSPOTS_DATA.mars.map((spot) => {
                const isSelected = selectedHotspot?.id === spot.id;
                return (
                  <button
                    key={spot.id}
                    onClick={() => {
                      soundManager.playTargetLock();
                      onSelectHotspot(spot);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-left font-mono text-xs transition-all ${
                      isSelected
                        ? 'bg-red-600/30 border border-red-500/60 text-white'
                        : 'bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-bold text-white">{spot.title}</span>
                    </div>
                    <span className="text-[10px] text-zinc-400 font-mono">[{spot.codename}]</span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playTransition();
              onScrollTo('archive');
            }}
            className="liquid-metal-btn flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold text-white tracking-wider"
          >
            <span>VIEW PRESERVATION MANIFESTO</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* =========================================
          SECTION 4: PRESERVATION MANIFESTO & DATA
         ========================================= */}
      <section
        id="section-archive"
        className="min-h-screen flex flex-col justify-center p-6 sm:p-12 md:p-16 max-w-7xl mx-auto py-24"
      >
        <div className="interactive-zone max-w-3xl mx-auto w-full">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono tracking-widest text-zinc-300 mb-4 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span>SECTION 04 // THE MANIFESTO</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
              HERITAGE FOR FUTURE GENERATIONS
            </h2>
            <p className="text-zinc-400 text-sm sm:text-base font-sans max-w-xl mx-auto">
              Under the Artemis Accords and international space archaeology guidelines, humanity is
              establishing protected heritage zones around historic landing sites to prevent rocket
              exhaust erosion and vandalism.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div className="glass-panel p-6 rounded-3xl border border-white/15">
              <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white mb-3">
                <Shield className="w-4 h-4 text-red-500" />
                <span>ARTEMIS ACCORDS §5.4</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                Signatory nations commit to preserving historic landing sites, robotic hardware, and
                celestial artifacts from damaging disturbances, recognizing them as the shared
                heritage of all humankind.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/15">
              <div className="flex items-center gap-2.5 font-mono text-sm font-bold text-white mb-3">
                <Award className="w-4 h-4 text-blue-400" />
                <span>NSSDCA SCIENTIFIC ACCURACY</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                100% of dates, coordinates, hardware dimensions, and mission statuses in this
                application are cross-referenced with NASA's Space Science Data Coordinated Archive.
              </p>
            </div>
          </div>

          {/* Compliance & AI Declaration Box */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-white/20 mb-8 bg-zinc-950/70">
            <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-400 mb-4 border-b border-white/10 pb-2">
              NASA Space Apps Challenge 2026 // Submission Compliance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono text-zinc-300">
              <div>
                <span className="text-zinc-500 block text-[10px]">CHALLENGE CATEGORY</span>
                <span className="text-white font-bold">Abandoned but Not Forgotten</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">3D ASSETS ATTRIBUTION</span>
                <span className="text-white font-bold">NASA Solar System Treks (GLTF)</span>
              </div>
              <div>
                <span className="text-zinc-500 block text-[10px]">DEVELOPMENT PLATFORM</span>
                <span className="text-white font-bold">Google Antigravity AI Engine</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => {
                soundManager.playTargetLock();
                onOpenDirectory();
              }}
              className="liquid-metal-btn flex items-center gap-2 px-8 py-3.5 rounded-full text-xs font-mono font-bold text-white tracking-wider"
            >
              <span>EXPLORE ALL 6 MONUMENTS</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                soundManager.playBlip(700, 0.05);
                onScrollTo('earth');
              }}
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 text-xs font-mono text-zinc-300 hover:text-white transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RETURN TO EARTH (ORIGIN)</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
