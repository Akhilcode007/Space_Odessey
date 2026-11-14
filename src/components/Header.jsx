import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Compass, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Header({
  activePlanet,
  onNavigate,
  onOpenDirectory,
  totalHotspots = 6
}) {
  const [isAudioActive, setIsAudioActive] = useState(false);
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toISOString().replace('T', ' ').substring(0, 19) + ' UTC'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const active = soundManager.toggleSound();
    setIsAudioActive(active);
  };

  const navItems = [
    { id: 'earth', label: '01. EARTH' },
    { id: 'moon', label: '02. MOON' },
    { id: 'mars', label: '03. MARS' },
    { id: 'archive', label: '04. ARCHIVE' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-4 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: Nothing OS Identity & NASA Challenge Tag */}
        <div className="pointer-events-auto flex items-center gap-3.5 glass-panel px-4 py-2.5 rounded-full border border-white/15">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-red-beacon animate-pulse" />
            <span className="font-mono text-xs font-bold tracking-widest text-white">
              NASA // SPACE APPS
            </span>
          </div>
          <span className="text-zinc-600">/</span>
          <span className="hidden sm:inline-block font-mono text-[11px] text-zinc-400 tracking-wider">
            ABANDONED BUT NOT FORGOTTEN
          </span>
          <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 border border-white/10 text-zinc-300">
            {utcTime}
          </span>
        </div>

        {/* Center: Monochromatic Planet Switcher Nav */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1.5 glass-panel px-2 py-1.5 rounded-full border border-white/15">
          {navItems.map((item) => {
            const isActive = activePlanet === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playBlip(900, 0.04);
                  onNavigate(item.id);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right: Audio Synthesizer Toggle & Directory Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Artifact Directory Drawer Button */}
          <button
            onClick={() => {
              soundManager.playBlip(1100, 0.04);
              onOpenDirectory();
            }}
            className="liquid-metal-btn flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono text-zinc-200"
            title="Open Complete Artifact Directory"
          >
            <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
            <span className="hidden sm:inline">RELICS</span>
            <span className="px-1.5 py-0.2 rounded-full bg-red-600/30 text-red-400 text-[10px] font-bold border border-red-500/30">
              {totalHotspots}
            </span>
          </button>

          {/* Sound Synthesizer Toggle */}
          <button
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-all duration-300 ${
              isAudioActive
                ? 'bg-white text-black border-white shadow-liquid-glow'
                : 'glass-panel text-zinc-400 hover:text-white border-white/15'
            }`}
            title={isAudioActive ? 'Mute Deep Space Audio' : 'Enable Deep Space Audio (Synthesizer)'}
            aria-label="Toggle Audio"
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
