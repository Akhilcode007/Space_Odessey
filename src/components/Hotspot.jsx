import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { MapPin, X, Info, Award, Compass, Shield, Clock } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Hotspot({ spot, isSelected, onSelect, onClose }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    soundManager.playTargetLock();
    if (isSelected) {
      onClose();
    } else {
      onSelect(spot);
    }
  };

  return (
    <group position={spot.position}>
      <Html
        center
        distanceFactor={6}
        zIndexRange={[100, 0]}
        style={{
          transition: 'all 0.2s ease',
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <div className="relative group flex items-center justify-center">
          {/* Glowing Circular Hotspot Pin */}
          <button
            onClick={handleClick}
            onMouseEnter={() => {
              setIsHovered(true);
              soundManager.playBlip(1400, 0.04);
            }}
            onMouseLeave={() => setIsHovered(false)}
            aria-label={`View artifact: ${spot.title}`}
            className={`relative flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 focus:outline-none ${
              isSelected
                ? 'scale-125 bg-red-600/90 shadow-red-beacon ring-2 ring-white/80'
                : 'bg-black/80 hover:scale-110 border border-white/40 shadow-glass-hover'
            }`}
          >
            {/* Pulsing Radar Ring */}
            <span
              className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                isSelected ? 'bg-red-500' : 'bg-white/40'
              }`}
            />

            {/* Inner Core Indicator */}
            <div
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                isSelected ? 'bg-white' : 'bg-red-500 group-hover:bg-white'
              }`}
            />
          </button>

          {/* Quick Hover Label (shown when not expanded) */}
          {!isSelected && (
            <div
              className={`absolute left-10 top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`}
            >
              <div className="flex items-center gap-2 px-2.5 py-1 rounded bg-black/90 border border-white/20 backdrop-blur-md text-[11px] font-mono tracking-wider text-zinc-200 shadow-xl">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="font-semibold text-white">{spot.title}</span>
                <span className="text-zinc-400 font-mono text-[9px] uppercase">[{spot.site.split(' ')[0]}]</span>
              </div>
            </div>
          )}

          {/* Detailed Glassmorphic Tailwind Card answering the 5 NASA questions */}
          {isSelected && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute left-10 -top-24 w-[360px] sm:w-[440px] max-w-[90vw] glass-panel-interactive rounded-2xl p-5 text-left border border-white/25 shadow-2xl backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200 z-50 text-zinc-100"
              style={{
                background: 'rgba(12, 12, 16, 0.88)'
              }}
            >
              {/* Header with Nothing OS Styling */}
              <div className="flex items-start justify-between border-b border-white/10 pb-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-red-400 mb-1">
                    <span className="inline-block w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
                    <span>NSSDCA VERIFIED // {spot.mission}</span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                    {spot.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1 text-zinc-300">
                      <Clock className="w-3 h-3 text-red-400" /> {spot.date}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="flex items-center gap-1 text-zinc-300">
                      <MapPin className="w-3 h-3 text-red-400" /> {spot.coords}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playBlip(600, 0.05);
                    onClose();
                  }}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors border border-white/10"
                  aria-label="Close details"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* The 5 Mandated NASA Questions */}
              <div className="space-y-3.5 text-xs text-zinc-300 max-h-[380px] overflow-y-auto pr-1">
                {/* 1. What is it? */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white mb-1">
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>1. What is it?</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-zinc-300 font-sans">
                    {spot.answers.what}
                  </p>
                </div>

                {/* 2. Why was it left behind? */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white mb-1">
                    <Compass className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>2. Why was it left behind?</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-zinc-300 font-sans">
                    {spot.answers.why}
                  </p>
                </div>

                {/* 3. What did it achieve? */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white mb-1">
                    <Award className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>3. What did it achieve?</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-zinc-300 font-sans">
                    {spot.answers.achieved}
                  </p>
                </div>

                {/* 4. Where is it now? */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white mb-1">
                    <MapPin className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>4. Where is it now?</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-zinc-300 font-sans">
                    {spot.answers.where}
                  </p>
                </div>

                {/* 5. Why does it matter today? */}
                <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/15 transition-all">
                  <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold text-white mb-1">
                    <Shield className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>5. Why does it matter today?</span>
                  </div>
                  <p className="leading-relaxed pl-5 text-zinc-300 font-sans">
                    {spot.answers.matters}
                  </p>
                </div>
              </div>

              {/* Bottom Telemetry Bar */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  STATUS: PRESERVED MONUMENT
                </span>
                <span className="text-zinc-500">
                  PRESS [ESC] TO CLOSE
                </span>
              </div>
            </div>
          )}
        </div>
      </Html>
    </group>
  );
}
