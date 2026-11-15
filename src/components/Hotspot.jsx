import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { soundManager } from '../utils/audio';

export default function Hotspot({ spot, isSelected, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e) => {
    e.stopPropagation();
    soundManager.playTargetLock();
    onSelect(spot);
  };

  const accentColor = spot.color || '#38bdf8';

  return (
    <group position={spot.position}>
      <Html
        center
        distanceFactor={6}
        zIndexRange={[100, 0]}
        style={{
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
          pointerEvents: 'auto',
          userSelect: 'none'
        }}
      >
        <button
          onClick={handleClick}
          onMouseEnter={() => {
            setIsHovered(true);
            soundManager.playBlip(1300, 0.04);
          }}
          onMouseLeave={() => setIsHovered(false)}
          className={`group flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-xl focus:outline-none ${
            isSelected
              ? 'bg-[#0f111a]/95 border-2 shadow-2xl scale-110'
              : 'bg-[#0a0c14]/80 hover:bg-[#121522]/90 border border-white/20 hover:border-white/40 shadow-xl hover:scale-105'
          }`}
          style={{
            borderColor: isSelected ? accentColor : undefined,
            boxShadow: isSelected
              ? `0 0 20px ${accentColor}55, 0 8px 25px rgba(0,0,0,0.8)`
              : isHovered
              ? `0 0 14px ${accentColor}33, 0 6px 20px rgba(0,0,0,0.6)`
              : '0 4px 16px rgba(0,0,0,0.5)'
          }}
          aria-label={`Select ${spot.title}`}
        >
          {/* Glowing Colored Radar Dot (matching the screenshot) */}
          <span className="relative flex h-2.5 w-2.5 items-center justify-center">
            <span
              className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping"
              style={{ backgroundColor: accentColor }}
            />
            <span
              className="relative inline-flex rounded-full h-2 w-2"
              style={{
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`
              }}
            />
          </span>

          {/* Pill Label */}
          <span
            className={`font-mono text-[11px] tracking-wider transition-colors ${
              isSelected ? 'font-bold text-white' : 'text-zinc-200 group-hover:text-white'
            }`}
          >
            {spot.shortLabel || spot.title}
          </span>
        </button>
      </Html>
    </group>
  );
}
