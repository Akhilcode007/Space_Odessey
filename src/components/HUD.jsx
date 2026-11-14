import React from 'react';
import { CELESTIAL_BODIES } from '../data/spaceData';
import { Eye, Move, Navigation, Globe, Radio } from 'lucide-react';

export default function HUD({ activePlanet, scrollProgress = 0, isInteractingHotspot = false }) {
  const currentBody = CELESTIAL_BODIES[activePlanet] || CELESTIAL_BODIES.earth;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none select-none">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-end md:items-end justify-between gap-4">
        {/* Left Telemetry Card */}
        <div className="pointer-events-auto glass-panel px-4 py-3 rounded-2xl border border-white/15 max-w-sm hidden sm:block">
          <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-2">
            <span className="font-mono text-[10px] tracking-widest text-zinc-400 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-red-500 animate-pulse" />
              TELEMETRY FEED // {currentBody.tag}
            </span>
            <span className="font-mono text-[10px] text-zinc-500">
              {(scrollProgress * 100).toFixed(0)}% EXPEDITION
            </span>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 font-mono text-[11px]">
            <div>
              <span className="text-zinc-500 block text-[9px] uppercase">Target</span>
              <span className="font-bold text-white tracking-wider">{currentBody.name}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] uppercase">Distance from Earth</span>
              <span className="text-zinc-200">{currentBody.distance}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] uppercase">Mean Radius</span>
              <span className="text-zinc-200">{currentBody.radius}</span>
            </div>
            <div>
              <span className="text-zinc-500 block text-[9px] uppercase">Preserved Relics</span>
              <span className="text-red-400 font-bold">{currentBody.monumentsCount}</span>
            </div>
          </div>
        </div>

        {/* Center/Right: Interaction Hint & Micro-Interaction Controls */}
        <div className="pointer-events-auto flex flex-col items-end gap-2.5">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[11px] font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Move className="w-3 h-3 text-zinc-400" />
              <span>DRAG TO ROTATE 360°</span>
            </span>
            <span className="text-zinc-600">|</span>
            <span className="text-zinc-400">
              {isInteractingHotspot ? 'HOTSPOT INSPECTION ACTIVE' : 'CLICK PINS FOR 5 NASA REASONS'}
            </span>
          </div>

          {/* Minimalist Scroll Progress Line with Dot Indicator */}
          <div className="w-48 sm:w-64 h-1 bg-white/10 rounded-full overflow-hidden relative border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-zinc-500 via-white to-red-500 transition-all duration-150 rounded-full"
              style={{ width: `${Math.min(100, Math.max(3, scrollProgress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
