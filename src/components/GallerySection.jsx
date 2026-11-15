import React from 'react';
import PrismCarousel from './ui/prism-carousel';
import { Box, BookOpen, Compass, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

export const GALLERY_ITEMS = [
  {
    src: '/gallery/lunar-roving-vehicle.png',
    alt: 'Apollo Lunar Roving Vehicle',
    title: 'Apollo Lunar Roving Vehicle (LRV)',
    subtitle: 'Apollo 15, 16 & 17 // Hadley-Apennine & Taurus-Littrow Valley',
    modelId: 'lrv',
    targetSection: 'models'
  },
  {
    src: '/gallery/sojourner-mars-rover.png',
    alt: 'Sojourner Mars Rover',
    title: 'Sojourner Mars Rover',
    subtitle: 'Mars Pathfinder Expedition // Ares Vallis (July 1997)',
    targetSection: 'mars'
  },
  {
    src: '/gallery/alsep-lunar-station.png',
    alt: 'Apollo ALSEP Experiment Station',
    title: 'Apollo ALSEP Surface Science Station',
    subtitle: 'Apollo Lunar Surface Experiments Package // Ocean of Storms (1969)',
    targetSection: 'moon'
  },
  {
    src: '/gallery/dawn-spacecraft.png',
    alt: 'Dawn Spacecraft',
    title: 'Dawn Deep Space Explorer',
    subtitle: 'Ion Propulsion Orbit of Dwarf Planet Ceres & Asteroid Vesta',
    targetSection: 'models'
  },
  {
    src: '/gallery/kepler-space-telescope.png',
    alt: 'Kepler Space Telescope',
    title: 'Kepler Exoplanet Observatory',
    subtitle: 'Earth-trailing Orbit // 2,600+ Confirmed Exoplanet Discoveries',
    targetSection: 'models'
  },
  {
    src: '/gallery/messenger-spacecraft.png',
    alt: 'MESSENGER Mercury Orbiter',
    title: 'MESSENGER Mercury Explorer',
    subtitle: 'First Mercury Orbiter // Deep Polar Water Ice Discovery (2015)',
    targetSection: 'models'
  },
  {
    src: '/gallery/ingenuity-mars-helicopter.png',
    alt: 'Ingenuity Mars Helicopter',
    title: 'Ingenuity Autonomous Helicopter',
    subtitle: 'First Powered Aerial Flight on Extraterrestrial Ground // Jezero Crater',
    targetSection: 'mars'
  },
  {
    src: '/gallery/insight-mars-lander.png',
    alt: 'InSight Mars Lander',
    title: 'InSight Geophysical Lander',
    subtitle: 'Martian Seismology & Core Detection // Elysium Planitia (2018–2022)',
    targetSection: 'mars'
  },
  {
    src: '/gallery/viking-mars-lander.png',
    alt: 'Viking 1 & 2 Mars Landers',
    title: 'Viking Mars Landers',
    subtitle: 'First Successful Extended Surface Operations on Mars // Chryse Planitia (1976)',
    targetSection: 'mars'
  },
  {
    src: '/gallery/opportunity-mars-rover.png',
    alt: 'Opportunity Mars Exploration Rover',
    title: 'Opportunity Exploration Rover',
    subtitle: '14+ Years & 45.16 KM Traversed // Meridiani Planum Ancient Water Evidence',
    targetSection: 'mars'
  }
];

export default function GallerySection({ onNavigate, onSelectModelId, onOpenDirectory }) {
  const handleSelectArtifact = (item) => {
    soundManager.playTargetLock();
    if (item.modelId) {
      onSelectModelId?.(item.modelId);
      onNavigate?.('models');
    } else if (item.targetSection) {
      onNavigate?.(item.targetSection);
    }
  };

  return (
    <div className="fixed inset-0 z-30 pointer-events-none flex flex-col justify-between pt-24 sm:pt-28 pb-12 sm:pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full animate-in fade-in duration-300">
      {/* Top Header Label */}
      <div className="pointer-events-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 border border-white/15 text-[11px] font-mono tracking-widest text-zinc-300 backdrop-blur-xl shadow-lg">
            <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_#ffffff] animate-pulse" />
            <span>SECTION 05 // CELESTIAL RELICS GALLERY</span>
          </div>
          <span className="hidden md:inline-block font-mono text-xs text-zinc-400 tracking-wider">
            PRISM CAROUSEL // 10 MONUMENT CUTOUTS
          </span>
        </div>

        <button
          onClick={() => {
            soundManager.playBlip(1100, 0.04);
            onOpenDirectory();
          }}
          className="liquid-metal-btn hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono text-zinc-200"
        >
          <BookOpen className="w-3.5 h-3.5 text-zinc-300" />
          <span>FULL RELICS ARCHIVE</span>
        </button>
      </div>

      {/* Main Prism Carousel Container */}
      <div className="pointer-events-auto flex-1 w-full max-h-[calc(100vh-14rem)] my-auto relative">
        <PrismCarousel
          items={GALLERY_ITEMS}
          startIndex={0}
          aspect={1.5}
          size={0.65}
          neighborScale={0.68}
          gap={16}
          radius={22}
          saturation={0}
          dim={0.25}
          sweep={1}
          sweepDuration={1.1}
          dispersion={0}
          autoplay={true}
          interval={4.5}
          loop={true}
          captions={true}
          controls={true}
          draggable={true}
          wheel={true}
          pauseOnHover={true}
          backgroundColor="transparent"
          onSelect={handleSelectArtifact}
          onIndexChange={() => soundManager.playBlip(750, 0.03)}
          className="w-full h-full"
        />
      </div>

      {/* Bottom Telemetry Prompts */}
      <div className="pointer-events-auto flex items-center justify-between text-[10px] sm:text-xs font-mono text-zinc-500 pt-2 border-t border-white/10 pr-20 sm:pr-48">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <span className="hidden sm:inline">
            DRAG, SCROLL OR CLICK TO NAVIGATE // WHITE LIGHT SWEEP ACTIVE
          </span>
          <span className="sm:hidden">SWIPE OR USE ARROWS TO BROWSE</span>
        </div>

        <button
          onClick={() => {
            soundManager.playBlip(700, 0.05);
            onNavigate('earth');
          }}
          className="hidden lg:flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors"
        >
          <span>RETURN TO ORIGIN (EARTH)</span>
        </button>
      </div>
    </div>
  );
}
