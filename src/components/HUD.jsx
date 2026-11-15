import React from 'react';
import { Move } from 'lucide-react';

export default function HUD({ activePlanet, scrollProgress = 0, isInteractingHotspot = false }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 p-3 sm:p-6 pointer-events-none select-none">
      <div className="max-w-7xl mx-auto flex items-end justify-end pr-20 sm:pr-24">
        {/* Right Interaction Indicator & Progress Line */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5 sm:gap-2">
          {/* Status Badge */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] sm:text-[11px] font-mono text-zinc-300 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="flex items-center gap-1 text-zinc-300">
              <Move className="w-3 h-3 text-zinc-400" />
              <span className="sm:hidden">DRAG 360°</span>
              <span className="hidden sm:inline">DRAG TO ROTATE 360°</span>
            </span>
            <span className="text-zinc-600 hidden sm:inline">|</span>
            <span className="text-zinc-400 hidden sm:inline">
              {isInteractingHotspot ? 'SITE INSPECTION ACTIVE' : 'SELECT PINS OR MISSIONS'}
            </span>
          </div>

          {/* Minimalist Progress Line */}
          <div className="w-28 sm:w-56 h-1 bg-white/10 rounded-full overflow-hidden relative border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-zinc-500 via-white to-red-500 transition-all duration-150 rounded-full"
              style={{ width: `${Math.min(100, Math.max(5, scrollProgress * 100))}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
