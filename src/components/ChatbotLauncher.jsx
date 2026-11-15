import React, { useState, useEffect, useRef } from 'react';
import { ExternalLink, X, Sparkles } from 'lucide-react';
import { soundManager } from '../utils/audio';

const BOTPRESS_SHAREABLE_URL =
  'https://cdn.botpress.cloud/webchat/v5.0/shareable.html?configUrl=https://files.bpcontent.cloud/2026/11/15/05/20261115053319-236K7S7W.json';

export default function ChatbotLauncher() {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Keyboard Handler: Press Escape on the keyboard automatically closes the chat window
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        soundManager.playBlip(500, 0.05);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const toggleOpen = () => {
    soundManager.playBlip(isOpen ? 650 : 900, 0.04);
    setIsOpen((prev) => !prev);
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-3.5 right-3.5 sm:bottom-6 sm:right-6 z-50 select-none"
    >
      {/* ========================================================
          Floating Glassmorphic Chat Window
         ======================================================== */}
      {isOpen && (
        <div
          className="fixed bottom-18 sm:bottom-24 right-2 sm:right-6 w-[calc(100vw-1rem)] sm:w-[420px] max-w-[420px] h-[560px] max-h-[76vh] flex flex-col rounded-3xl border border-cyan-400/35 backdrop-blur-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300 z-50"
          style={{ background: 'rgba(10, 14, 22, 0.96)' }}
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40 backdrop-blur-md">
            {/* Left: Mini Avatar Thumbnail + Glowing Cyan Dot + Title */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-8 h-8 rounded-full overflow-hidden border border-cyan-400/50 shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                <img
                  src="/chatbot-avatar.png"
                  alt="AstroGuide AI Avatar"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 border border-black shadow-[0_0_6px_#10b981]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-xs font-bold tracking-wider text-white">
                    ASTROGUIDE AI
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_#22d3ee] animate-pulse" />
                </div>
                <span className="text-[10px] font-mono text-zinc-400 tracking-wide">
                  Space Exploration Guide
                </span>
              </div>
            </div>

            {/* Right: External Link & Close Icon */}
            <div className="flex items-center gap-1">
              <a
                href={BOTPRESS_SHAREABLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => soundManager.playBlip(750, 0.03)}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Open in new window"
                aria-label="Open chat in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              <button
                onClick={() => {
                  soundManager.playBlip(600, 0.04);
                  setIsOpen(false);
                }}
                className="p-1.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Close chat"
                aria-label="Close chat window"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body (Embedded Iframe) */}
          <div className="flex-1 w-full h-full relative bg-[#0c1017]">
            <iframe
              src={BOTPRESS_SHAREABLE_URL}
              allow="microphone; clipboard-write; autoplay"
              className="w-full h-full border-0 rounded-b-3xl"
              title="AstroGuide AI Chatbot"
            />
          </div>
        </div>
      )}

      {/* ========================================================
          Floating Avatar Button & Tooltip
         ======================================================== */}
      <div className="relative flex items-center justify-end">
        {/* On Hover: Dark Glassmorphic Tooltip Badge */}
        {!isOpen && isHovered && (
          <div className="absolute right-full mr-3 px-3 py-1.5 rounded-xl bg-[#0c121c]/95 border border-cyan-400/30 text-xs font-mono text-zinc-200 tracking-wider shadow-xl backdrop-blur-xl whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-none flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
            <span>Chat with AstroGuide AI</span>
          </div>
        )}

        {/* Circular Avatar Button */}
        <button
          onClick={toggleOpen}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative group p-0.5 rounded-full transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none"
          aria-label={isOpen ? 'Close AstroGuide AI Chat' : 'Open AstroGuide AI Chat'}
          title={isOpen ? 'Close Chat' : 'Chat with AstroGuide AI'}
        >
          {/* Animated Outer Radar Ping Circle when closed */}
          {!isOpen && (
            <span className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping pointer-events-none" />
          )}

          {/* Glowing Circular Ring with Neon Electric Cyan / Blue Gradient */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-cyan-600 via-sky-400 to-blue-600 opacity-80 blur-[6px] group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />

          {/* Inner Button Container */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-cyan-300/60 bg-[#0a0e16] shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center">
            {isOpen ? (
              <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-cyan-950 via-slate-900 to-black text-cyan-300">
                <X className="w-6 h-6 transition-transform duration-200 group-hover:rotate-90" />
              </div>
            ) : (
              <img
                src="/chatbot-avatar.png"
                alt="AstroGuide AI Chatbot"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            )}

            {/* Small Glowing Online Status Dot (emerald green #10b981) */}
            {!isOpen && (
              <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-[#10b981] border-2 border-[#0a0e16] shadow-[0_0_8px_#10b981] flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              </span>
            )}
          </div>
        </button>
      </div>
    </div>
  );
}
