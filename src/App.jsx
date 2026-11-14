import React, { useState, useEffect, useRef } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import Header from './components/Header';
import HUD from './components/HUD';
import Sections from './components/Sections';
import ArtifactModal from './components/ArtifactModal';
import { soundManager } from './utils/audio';

export default function App() {
  const [activePlanet, setActivePlanet] = useState('earth');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef(null);

  // Track global scroll percentage for HUD & Telemetry
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(1, Math.max(0, window.scrollY / totalHeight));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Listen for Escape key to close open cards
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedHotspot) {
          setSelectedHotspot(null);
          soundManager.playBlip(500, 0.05);
        }
        if (isModalOpen) {
          setIsModalOpen(false);
          soundManager.playBlip(500, 0.05);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedHotspot, isModalOpen]);

  // Smooth scroll to a target section
  const handleScrollTo = (sectionId) => {
    const elem = document.getElementById(`section-${sectionId}`);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Hotspot selection handler
  const handleSelectHotspot = (spot) => {
    setSelectedHotspot(spot);
  };

  const handleCloseHotspot = () => {
    setSelectedHotspot(null);
  };

  return (
    <div className="relative min-h-screen bg-[#08080a] text-zinc-100 selection:bg-white/20 selection:text-white">
      {/* Nothing OS Subtle Dot Grid Background */}
      <div className="fixed inset-0 pointer-events-none nothing-dot-grid z-0 opacity-40" />

      {/* 1. Fixed Background 3D Canvas */}
      <SpaceCanvas
        selectedHotspot={selectedHotspot}
        onSelectHotspot={handleSelectHotspot}
        onCloseHotspot={handleCloseHotspot}
        activePlanet={activePlanet}
        setActivePlanet={setActivePlanet}
        scrollContainerRef={scrollContainerRef}
      />

      {/* 2. Top Header Overlay (Nothing OS inspired) */}
      <Header
        activePlanet={activePlanet}
        onNavigate={handleScrollTo}
        onOpenDirectory={() => setIsModalOpen(true)}
        totalHotspots={6}
      />

      {/* 3. Main Transparent Scroll Container */}
      <main ref={scrollContainerRef} className="relative z-10">
        <Sections
          activePlanet={activePlanet}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={handleSelectHotspot}
          onOpenDirectory={() => setIsModalOpen(true)}
          onScrollTo={handleScrollTo}
        />
      </main>

      {/* 4. Bottom HUD Overlay */}
      <HUD
        activePlanet={activePlanet}
        scrollProgress={scrollProgress}
        isInteractingHotspot={Boolean(selectedHotspot)}
      />

      {/* 5. Complete Artifact Directory Modal */}
      <ArtifactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectArtifact={(item) => {
          setSelectedHotspot(item);
          handleScrollTo(item.body.toLowerCase());
        }}
      />
    </div>
  );
}
