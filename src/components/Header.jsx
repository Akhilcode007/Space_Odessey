import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, BookOpen, Rocket } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function Header({
  activePlanet,
  onNavigate,
  onOpenDirectory,
  totalHotspots = 13,
  isGameUnlocked = false,
  onOpenQuiz = () => {},
  onLaunchGame = () => {}
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
    { id: 'models', label: '04. 3D MODELS' },
    { id: 'gallery', label: '05. GALLERY' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-40 p-2.5 sm:p-6 pointer-events-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Nothing OS Identity & NASA Challenge Tag */}
        <div className="pointer-events-auto flex items-center gap-2 sm:gap-3.5 glass-panel px-3 sm:px-4 py-1.5 sm:py-2.5 rounded-full border border-white/15">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full bg-red-600 shadow-red-beacon animate-pulse" />
            <span className="font-mono text-[11px] sm:text-xs font-bold tracking-widest text-white whitespace-nowrap">
              SPACE ODYSSEY
            </span>
          </div>
          <span className="text-zinc-600 hidden xs:inline">/</span>
          <span className="hidden md:inline-block font-mono text-[11px] text-zinc-400 tracking-wider">
            ABANDONED BUT NOT FORGOTTEN
          </span>
          <span className="hidden lg:inline-block px-2 py-0.5 rounded-full text-[9px] font-mono bg-white/5 border border-white/10 text-zinc-300">
            {utcTime}
          </span>
        </div>

        {/* Center: Monochromatic Planet Switcher Nav for Desktop (>= lg) */}
        <nav className="pointer-events-auto hidden lg:flex items-center gap-1.5 glass-panel px-2.5 py-1.5 rounded-full border border-white/15">
          {navItems.map((item) => {
            const isActive =
              activePlanet === item.id ||
              (item.id === 'models' && activePlanet === 'archive');
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

          <div className="h-4 w-px bg-white/20 mx-1" />

          {/* Action Item: Quiz Gate / Flight Game Launch */}
          {!isGameUnlocked ? (
            <button
              onClick={() => {
                soundManager.playBlip(1000, 0.04);
                onOpenQuiz();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono tracking-wider transition-all duration-300 bg-black/60 hover:bg-white/10 text-zinc-300 hover:text-white border border-red-500/30 hover:border-red-500/60 shadow-[0_0_12px_rgba(239,68,68,0.15)] group"
              title="Pass Flight Permit Examination to Unlock Space Flight Game"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>06. UNLOCK GAME</span>
            </button>
          ) : (
            <button
              onClick={() => {
                soundManager.playTargetLock();
                onLaunchGame();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 bg-gradient-to-r from-emerald-400 to-cyan-400 text-black hover:scale-105 active:scale-95 shadow-[0_0_18px_rgba(16,185,129,0.4)]"
              title="Launch Retro-Futuristic 2D Space Flight Simulator"
            >
              <Rocket className="w-3.5 h-3.5 animate-bounce" />
              <span>06. PLAY GAME</span>
            </button>
          )}
        </nav>

        {/* Right: Audio Synthesizer Toggle & Directory Button */}
        <div className="pointer-events-auto flex items-center gap-1.5 sm:gap-2">
          {/* Mobile/Tablet Game Action Trigger */}
          <button
            onClick={() => {
              if (isGameUnlocked) {
                soundManager.playTargetLock();
                onLaunchGame();
              } else {
                soundManager.playBlip(1000, 0.04);
                onOpenQuiz();
              }
            }}
            className={`lg:hidden flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono border transition-all ${
              isGameUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.25)]'
                : 'glass-panel text-zinc-300 border-white/15'
            }`}
            title={isGameUnlocked ? 'Play Space Flight Game' : 'Unlock Space Flight Game'}
          >
            {isGameUnlocked ? (
              <>
                <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                <span>PLAY</span>
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>QUIZ</span>
              </>
            )}
          </button>

          {/* Artifact Directory Drawer Button */}
          <button
            onClick={() => {
              soundManager.playBlip(1100, 0.04);
              onOpenDirectory();
            }}
            className="liquid-metal-btn flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-full text-[11px] sm:text-xs font-mono text-zinc-200"
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
            className={`p-1.5 sm:p-2 rounded-full border transition-all duration-300 ${
              isAudioActive
                ? 'bg-white text-black border-white shadow-liquid-glow'
                : 'glass-panel text-zinc-400 hover:text-white border-white/15'
            }`}
            title={isAudioActive ? 'Mute Deep Space Audio' : 'Enable Deep Space Audio (Synthesizer)'}
            aria-label="Toggle Audio"
          >
            {isAudioActive ? (
              <Volume2 className="w-3.5 sm:w-4 h-3.5 sm:h-4 animate-pulse" />
            ) : (
              <VolumeX className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Center: Monochromatic Planet Switcher Nav for Mobile & Tablet (< lg) */}
      <div className="lg:hidden flex items-center justify-center w-full mt-2 sm:mt-2.5 pointer-events-auto">
        <nav className="flex items-center gap-1 glass-panel p-1 rounded-full border border-white/15 shadow-xl max-w-full overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const isActive =
              activePlanet === item.id ||
              (item.id === 'models' && activePlanet === 'archive');
            return (
              <button
                key={item.id}
                onClick={() => {
                  soundManager.playBlip(900, 0.04);
                  onNavigate(item.id);
                }}
                className={`px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-mono tracking-wider whitespace-nowrap transition-all duration-300 ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-sm'
                    : 'text-zinc-400 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="sm:hidden">{item.label.replace(/^\d+\.\s*/, '')}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
