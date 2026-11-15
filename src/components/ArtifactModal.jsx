import React, { useState } from 'react';
import { HOTSPOTS_DATA } from '../data/spaceData';
import { X, MapPin, Clock, Award, Shield, Compass, Info, ArrowUpRight } from 'lucide-react';
import { soundManager } from '../utils/audio';

export default function ArtifactModal({ isOpen, onClose, onSelectArtifact }) {
  const [activeTab, setActiveTab] = useState('all');

  if (!isOpen) return null;

  const allArtifacts = [
    ...HOTSPOTS_DATA.moon.map((a) => ({ ...a, body: 'MOON' })),
    ...HOTSPOTS_DATA.mars.map((a) => ({ ...a, body: 'MARS' }))
  ];

  const filtered = activeTab === 'all'
    ? allArtifacts
    : allArtifacts.filter((a) => a.body.toLowerCase() === activeTab);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl glass-panel-interactive border border-white/20 p-4 sm:p-8 overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ background: 'rgba(12, 12, 16, 0.95)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 sm:pb-5 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 font-mono text-[10px] sm:text-[11px] text-red-500 tracking-widest uppercase mb-1">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span>NASA Celestial Monuments Index</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Abandoned but Not Forgotten Archive
            </h2>
            <p className="text-[11px] sm:text-xs text-zinc-400 font-mono mt-0.5">
              Reframing space exploration hardware as scientific heritage
            </p>
          </div>

          <button
            onClick={() => {
              soundManager.playBlip(600, 0.04);
              onClose();
            }}
            className="p-1.5 sm:p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors border border-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 sm:gap-2 py-3 sm:py-4 border-b border-white/5 overflow-x-auto no-scrollbar whitespace-nowrap">
          {['all', 'moon', 'mars'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                soundManager.playBlip(1000, 0.03);
                setActiveTab(tab);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === tab
                  ? 'bg-white text-black font-bold shadow-md'
                  : 'bg-white/5 text-zinc-400 hover:text-white border border-white/10'
              }`}
            >
              {tab === 'all'
                ? `All Catalogued (${allArtifacts.length})`
                : tab === 'moon'
                ? `Moon (${HOTSPOTS_DATA.moon.length})`
                : `Mars & Deep Space (${HOTSPOTS_DATA.mars.length})`}
            </button>
          ))}
        </div>

        {/* Artifacts Scrollable List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/25 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-white/10 border border-white/10 text-white">
                    {item.body}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-red-400 transition-colors">
                    {item.title}
                  </h3>
                  <span className="text-xs font-mono text-zinc-500">[{item.codename}]</span>
                </div>

                <button
                  onClick={() => {
                    soundManager.playTargetLock();
                    onSelectArtifact(item);
                    onClose();
                  }}
                  className="liquid-metal-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-mono text-zinc-200 self-start sm:self-auto"
                >
                  <span>LOCATE IN 3D</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-zinc-400 mb-4 pb-3 border-b border-white/5">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" /> {item.date}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" /> {item.site} ({item.coords})
                </span>
              </div>

              {/* Grid of the 5 answers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="font-mono font-bold text-white text-[11px] block mb-1">
                    1. What is it?
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-sans">{item.answers.what}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="font-mono font-bold text-white text-[11px] block mb-1">
                    2. Why was it left behind?
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-sans">{item.answers.why}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="font-mono font-bold text-white text-[11px] block mb-1">
                    3. What did it achieve?
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-sans">{item.answers.achieved}</p>
                </div>

                <div className="p-3 rounded-xl bg-black/40 border border-white/5">
                  <span className="font-mono font-bold text-white text-[11px] block mb-1">
                    4. Where is it now?
                  </span>
                  <p className="text-zinc-300 leading-relaxed font-sans">{item.answers.where}</p>
                </div>

                <div className="md:col-span-2 p-3 rounded-xl bg-red-950/20 border border-red-500/20">
                  <span className="font-mono font-bold text-red-400 text-[11px] block mb-1">
                    5. Why does it matter today? (Modern Relevance)
                  </span>
                  <p className="text-zinc-200 leading-relaxed font-sans">{item.answers.matters}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-500 gap-2">
          <span>SOURCE: NASA SPACE SCIENCE DATA COORDINATED ARCHIVE (NSSDCA)</span>
          <span>ARTEMIS ACCORDS HERITAGE PROTECTION GUIDELINE §5.4</span>
        </div>
      </div>
    </div>
  );
}
