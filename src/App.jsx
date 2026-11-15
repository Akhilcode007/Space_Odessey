import React, { useState, useEffect, useRef } from 'react';
import SpaceCanvas from './components/SpaceCanvas';
import Header from './components/Header';
import HUD from './components/HUD';
import Sections from './components/Sections';
import ArtifactModal from './components/ArtifactModal';
import QuizModal from './components/QuizModal';
import SpaceGame from './components/SpaceGame';
import ChatbotLauncher from './components/ChatbotLauncher';
import { soundManager } from './utils/audio';
import { HOTSPOTS_DATA } from './data/spaceData';

const SECTIONS = ['earth', 'moon', 'mars', 'models', 'gallery'];

export default function App() {
  const [activePlanet, setActivePlanet] = useState('earth');
  const [selectedHotspot, setSelectedHotspot] = useState(null);
  const [selectedModelId, setSelectedModelId] = useState('apollo');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [isGameUnlocked, setIsGameUnlocked] = useState(() => {
    try {
      return localStorage.getItem('space_game_unlocked') === 'true';
    } catch {
      return false;
    }
  });
  const isTransitioning = useRef(false);

  // Calculate HUD progress from active section
  const progressMap = {
    earth: 0.05,
    moon: 0.28,
    mars: 0.52,
    models: 0.76,
    gallery: 1.0,
    archive: 0.76
  };
  const scrollProgress = progressMap[activePlanet] || 0.05;

  // Discrete Step Navigation between separated sections
  const handleNavigate = (targetId) => {
    if (targetId === activePlanet) return;
    soundManager.playTransition();
    setSelectedHotspot(null);
    setActivePlanet(targetId);
    if ((targetId === 'models' || targetId === 'archive') && (!selectedModelId || selectedModelId === 'earth' || selectedModelId === 'moon' || selectedModelId === 'mars')) {
      setSelectedModelId('apollo');
    }
  };

  const handleNextSection = () => {
    const currentIndex = SECTIONS.indexOf(activePlanet);
    if (currentIndex < SECTIONS.length - 1) {
      handleNavigate(SECTIONS[currentIndex + 1]);
    }
  };

  const handlePrevSection = () => {
    const currentIndex = SECTIONS.indexOf(activePlanet);
    if (currentIndex > 0) {
      handleNavigate(SECTIONS[currentIndex - 1]);
    }
  };

  // Keyboard Navigation: Arrow Keys & Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isGameOpen) {
          setIsGameOpen(false);
          soundManager.playBlip(500, 0.05);
          return;
        }
        if (isQuizOpen) {
          setIsQuizOpen(false);
          soundManager.playBlip(500, 0.05);
          return;
        }
        if (selectedHotspot) {
          setSelectedHotspot(null);
          soundManager.playBlip(500, 0.05);
        }
        if (isModalOpen) {
          setIsModalOpen(false);
          soundManager.playBlip(500, 0.05);
        }
        return;
      }

      if (isModalOpen || selectedHotspot || isQuizOpen || isGameOpen) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        handleNextSection();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        handlePrevSection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePlanet, selectedHotspot, isModalOpen, isQuizOpen, isGameOpen]);

  // Mouse Wheel stepped transition (debounced)
  useEffect(() => {
    const handleWheel = (e) => {
      if (isModalOpen || selectedHotspot || isQuizOpen || isGameOpen) return;

      if (isTransitioning.current) return;

      if (Math.abs(e.deltaY) > 40) {
        isTransitioning.current = true;
        if (e.deltaY > 0) {
          handleNextSection();
        } else {
          handlePrevSection();
        }
        setTimeout(() => {
          isTransitioning.current = false;
        }, 750);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activePlanet, selectedHotspot, isModalOpen, isQuizOpen, isGameOpen]);

  // Mobile / Tablet 2-finger swipe navigation (keeps 1-finger reserved for 3D OrbitControls)
  useEffect(() => {
    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        touchStartX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        touchStartY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      }
    };

    const handleTouchEnd = (e) => {
      if (isModalOpen || isQuizOpen || isGameOpen) return;
      if (touchStartX === 0) return;

      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (deltaX < 0) {
          handleNextSection();
        } else {
          handlePrevSection();
        }
      }
      touchStartX = 0;
      touchStartY = 0;
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activePlanet, isModalOpen, isQuizOpen, isGameOpen]);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#08080a] text-zinc-100 selection:bg-white/20 selection:text-white">
      {/* Nothing OS Subtle Dot Grid Background */}
      <div className="fixed inset-0 pointer-events-none nothing-dot-grid z-0 opacity-40" />

      {/* 1. Fixed Background 3D Canvas */}
      <SpaceCanvas
        selectedHotspot={selectedHotspot}
        onSelectHotspot={setSelectedHotspot}
        onCloseHotspot={() => setSelectedHotspot(null)}
        activePlanet={activePlanet}
        selectedModelId={selectedModelId}
        onSelectModelId={setSelectedModelId}
      />

      {/* 2. Top Header Overlay */}
      <Header
        activePlanet={activePlanet}
        onNavigate={handleNavigate}
        onOpenDirectory={() => setIsModalOpen(true)}
        totalHotspots={HOTSPOTS_DATA.moon.length + HOTSPOTS_DATA.mars.length}
        isGameUnlocked={isGameUnlocked}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onLaunchGame={() => setIsGameOpen(true)}
      />

      {/* 3. Main Separated Sections Viewport */}
      <main className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
        <Sections
          activePlanet={activePlanet}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={setSelectedHotspot}
          onOpenDirectory={() => setIsModalOpen(true)}
          onNavigate={handleNavigate}
          selectedModelId={selectedModelId}
          onSelectModelId={setSelectedModelId}
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
          handleNavigate(item.body.toLowerCase());
        }}
      />

      {/* 6. Flight Permit Quiz Gate Modal */}
      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        isGameUnlocked={isGameUnlocked}
        onUnlockGame={() => {
          setIsGameUnlocked(true);
          try {
            localStorage.setItem('space_game_unlocked', 'true');
          } catch (err) {
            console.error(err);
          }
        }}
        onLaunchGame={() => {
          setIsQuizOpen(false);
          setIsGameOpen(true);
        }}
      />

      {/* 7. Retro-Futuristic 2D Space Flight Simulator */}
      <SpaceGame
        isOpen={isGameOpen}
        onClose={() => setIsGameOpen(false)}
        destination={activePlanet === 'mars' ? 'mars' : 'moon'}
      />

      {/* 8. Botpress AI AstroGuide Chatbot Floating Avatar Launcher */}
      <ChatbotLauncher />
    </div>
  );
}
