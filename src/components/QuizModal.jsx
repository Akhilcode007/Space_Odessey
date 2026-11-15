import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  XCircle,
  Award,
  Rocket,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { soundManager } from '../utils/audio';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    category: 'LUNAR ARCHAEOLOGY',
    question: 'Why were the Apollo Lunar Module descent stages intentionally left behind on the Moon?',
    options: [
      { id: 'A', text: 'To serve as permanent solar-powered radio beacons for Earth' },
      { id: 'B', text: 'They served as launch pads for the ascent stage to shed deadweight', isCorrect: true },
      { id: 'C', text: 'They suffered sudden propellant valve failures during landing' },
      { id: 'D', text: 'To provide emergency radiation shelters for future explorers' }
    ],
    explanation:
      'The descent stage served as a non-recoverable launch pad for the ascent stage, shedding tons of deadweight so Neil Armstrong and Buzz Aldrin could return to lunar orbit.'
  },
  {
    id: 2,
    category: 'EXTRATERRESTRIAL MOBILITY',
    question: 'Which Apollo mission deployed the very first electric Lunar Roving Vehicle (LRV) on the Moon?',
    options: [
      { id: 'A', text: 'Apollo 11 at Tranquility Base' },
      { id: 'B', text: 'Apollo 13 during translunar flight' },
      { id: 'C', text: 'Apollo 15 at Hadley-Apennine Canyon', isCorrect: true },
      { id: 'D', text: 'Apollo 17 at Taurus-Littrow Valley' }
    ],
    explanation:
      'Apollo 15 deployed the first LRV in July 1971, allowing astronauts Dave Scott and Jim Irwin to traverse 27.9 km and retrieve the 4-billion-year-old "Genesis Rock".'
  },
  {
    id: 3,
    category: 'MARTIAN GEOLOGY',
    question: 'What milestone discovery did the Opportunity rover make at Meridiani Planum that proved ancient Mars was wet?',
    options: [
      { id: 'A', text: 'Active geothermal water geysers erupting from the sand' },
      { id: 'B', text: 'Hematite spherules ("blueberries") formed in standing liquid water', isCorrect: true },
      { id: 'C', text: 'Frozen subterranean carbon dioxide rivers' },
      { id: 'D', text: 'Liquid hydrocarbon lakes similar to Saturn\'s moon Titan' }
    ],
    explanation:
      'Opportunity discovered mineral hematite "blueberries" embedded in layered bedrock, providing conclusive evidence that ancient Mars possessed standing liquid, potable water.'
  },
  {
    id: 4,
    category: 'PLANETARY AVIATION',
    question: 'What historic milestone did the 1.8 kg autonomous Ingenuity rotorcraft achieve on Mars?',
    options: [
      { id: 'A', text: 'Discovered fossilized microbial colonies in delta mudstones' },
      { id: 'B', text: 'First powered, controlled aerodynamic flight on an alien planet (72 flights)', isCorrect: true },
      { id: 'C', text: 'First spacecraft to retrieve and return Martian soil back to Earth' },
      { id: 'D', text: 'Drilled 50 meters beneath the Martian permafrost layer' }
    ],
    explanation:
      'Ingenuity completed 72 historic flights across 17.0 km in Mars\'s thin 1% atmosphere, opening the new era of planetary aerial robotics and aerial scouting.'
  },
  {
    id: 5,
    category: 'HERITAGE PRESERVATION',
    question: 'Under the Artemis Accords §5.4, why are historic lunar landing sites protected by international guidelines?',
    options: [
      { id: 'A', text: 'To auction off titanium salvaging rights to commercial companies' },
      { id: 'B', text: 'To preserve archaeological artifacts from rocket exhaust plume erosion and disturbance', isCorrect: true },
      { id: 'C', text: 'To establish sovereign national territory claims on lunar ground' },
      { id: 'D', text: 'To prohibit future astronauts from ever visiting the Moon again' }
    ],
    explanation:
      'The Artemis Accords §5.4 codifies historic landing sites as shared human heritage, requiring exclusion buffer zones to protect delicate foil, footpaths, and hardware from landing rocket exhaust.'
  }
];

export default function QuizModal({
  isOpen,
  onClose,
  onUnlockGame,
  onLaunchGame,
  isGameUnlocked
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [answeredMap, setAnsweredMap] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);

  if (!isOpen) return null;

  const currentQ = QUIZ_QUESTIONS[currentIdx];
  const totalQuestions = QUIZ_QUESTIONS.length;
  const passThreshold = 3; // 3 out of 5 required to pass
  const isPassed = score >= passThreshold;

  const handleSelectOption = (option) => {
    if (selectedOption !== null) return; // Prevent multiple clicks on same question

    setSelectedOption(option);
    const isCorrect = Boolean(option.isCorrect);

    if (isCorrect) {
      soundManager.playQuizSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundManager.playQuizFail();
    }

    setAnsweredMap((prev) => ({
      ...prev,
      [currentIdx]: { selected: option.id, isCorrect }
    }));
  };

  const handleNextQuestion = () => {
    soundManager.playBlip(1000, 0.04);
    if (currentIdx < totalQuestions - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
    } else {
      // Quiz completed!
      setIsCompleted(true);
      const finalScore = score + (selectedOption?.isCorrect ? 0 : 0);
      if (finalScore >= passThreshold) {
        soundManager.playVictoryFanfare();
        onUnlockGame();
      }
    }
  };

  const handleRestartQuiz = () => {
    soundManager.playBlip(700, 0.05);
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setAnsweredMap({});
    setIsCompleted(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-200 select-none"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl flex flex-col rounded-3xl glass-panel-interactive border border-white/20 p-6 sm:p-8 overflow-hidden shadow-2xl relative"
        style={{ background: 'rgba(10, 12, 18, 0.96)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Red/Cyan Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-red-beacon animate-pulse" />
            <div>
              <span className="font-mono text-[10px] text-zinc-400 tracking-widest uppercase block">
                NOTHING OS // FLIGHT CLEARANCE PROTOCOL
              </span>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                <span>Astronautics Permit Examination</span>
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              soundManager.playBlip(600, 0.04);
              onClose();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-400 hover:text-white transition-colors border border-white/10"
            aria-label="Close Quiz"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENT AREA */}
        {!isCompleted ? (
          <div className="py-6 flex-1 flex flex-col justify-between relative z-10">
            {/* Progress Bar & Telemetry */}
            <div className="mb-6">
              <div className="flex items-center justify-between font-mono text-xs text-zinc-400 mb-2">
                <span className="flex items-center gap-1.5 text-cyan-400 font-semibold tracking-wider">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>QUESTION {String(currentIdx + 1).padStart(2, '0')} // {String(totalQuestions).padStart(2, '0')}</span>
                </span>
                <span className="tracking-widest uppercase text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-zinc-300">
                  {currentQ.category}
                </span>
              </div>

              {/* Progress Line */}
              <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-300"
                  style={{ width: `${((currentIdx + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Title */}
            <h3 className="text-base sm:text-lg font-bold font-sans text-white mb-6 leading-snug">
              {currentQ.question}
            </h3>

            {/* Options Grid */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option) => {
                const isSelected = selectedOption?.id === option.id;
                const showFeedback = selectedOption !== null;
                const isOptionCorrect = option.isCorrect;

                let cardStyle = 'bg-white/[0.03] border-white/10 hover:border-white/25 hover:bg-white/[0.06] text-zinc-200';
                let indicatorStyle = 'border-white/20 text-zinc-400';

                if (showFeedback) {
                  if (isOptionCorrect) {
                    cardStyle = 'bg-emerald-500/15 border-emerald-500/70 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.2)]';
                    indicatorStyle = 'bg-emerald-500 border-emerald-400 text-black font-bold';
                  } else if (isSelected && !isOptionCorrect) {
                    cardStyle = 'bg-red-500/15 border-red-500/70 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.2)]';
                    indicatorStyle = 'bg-red-500 border-red-400 text-white font-bold';
                  }
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option)}
                    disabled={showFeedback}
                    className={`w-full text-left p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between group ${cardStyle}`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0 pr-2">
                      <span className={`w-6 h-6 rounded-lg border flex items-center justify-center font-mono text-xs shrink-0 transition-colors ${indicatorStyle}`}>
                        {option.id}
                      </span>
                      <span className="font-sans text-xs sm:text-sm font-medium leading-relaxed">
                        {option.text}
                      </span>
                    </div>

                    {showFeedback && isOptionCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {showFeedback && isSelected && !isOptionCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Card (Appears immediately after selecting an answer) */}
            {selectedOption !== null && (
              <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 animate-in fade-in duration-200 mb-4">
                <div className="flex items-center gap-2 font-mono text-xs font-bold mb-1">
                  {selectedOption.isCorrect ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> CORRECT ANSWER
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> INCORRECT ENTRY
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed">
                  {currentQ.explanation}
                </p>
              </div>
            )}

            {/* Next Question Action */}
            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                disabled={selectedOption === null}
                className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                  selectedOption !== null
                    ? 'liquid-metal-btn text-white shadow-lg hover:scale-105 active:scale-95'
                    : 'bg-white/5 border border-white/10 text-zinc-500 cursor-not-allowed opacity-50'
                }`}
              >
                <span>{currentIdx < totalQuestions - 1 ? 'PROCEED TO NEXT QUERY' : 'FINALIZE EVALUATION'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             QUIZ RESULT SCREEN
             ======================================================== */
          <div className="py-8 flex-1 flex flex-col items-center justify-center text-center relative z-10 animate-in fade-in zoom-in-95 duration-300">
            {isPassed ? (
              /* PASSED: Flight Permit Granted */
              <div className="max-w-md w-full">
                <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                  <ShieldCheck className="w-9 h-9" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs uppercase tracking-widest mb-3">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>FLIGHT PERMIT APPROVED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  Clearance Granted, Pilot!
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                  You scored <span className="text-emerald-400 font-bold font-mono">{score} / {totalQuestions}</span>. Your deep understanding of celestial archaeology and astronautics has unlocked the Nothing OS 2D Space Flight Simulator.
                </p>

                {/* Big Action Launch Button */}
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      soundManager.playTargetLock();
                      onClose();
                      onLaunchGame();
                    }}
                    className="w-full flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl text-xs sm:text-sm font-mono font-bold text-white shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                    style={{
                      background: 'linear-gradient(135deg, #059669 0%, #0284c7 100%)',
                      boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Rocket className="w-4 h-4 animate-bounce" />
                    <span>LAUNCH SPACE FLIGHT MISSION NOW</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 hover:text-white transition-all"
                  >
                    RETURN TO CELESTIAL ODYSSEY
                  </button>
                </div>
              </div>
            ) : (
              /* FAILED: Retest Required */
              <div className="max-w-md w-full">
                <div className="w-16 h-16 rounded-3xl bg-red-500/20 border border-red-500/40 text-red-400 flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                  <XCircle className="w-9 h-9" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs uppercase tracking-widest mb-3">
                  <span>CLEARANCE DENIED</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
                  Telemetry Check Failed
                </h3>

                <p className="text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed mb-6">
                  You scored <span className="text-red-400 font-bold font-mono">{score} / {totalQuestions}</span>. A minimum score of {passThreshold} is required to obtain flight clearance. Review the NSSDCA archives and try again.
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleRestartQuiz}
                    className="liquid-metal-btn w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-xs font-mono font-bold text-white shadow-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>RETRY PERMIT EXAMINATION</span>
                  </button>

                  <button
                    onClick={onClose}
                    className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-400 hover:text-white transition-all"
                  >
                    CLOSE FOR NOW
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Modal Bottom Tagline */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] font-mono text-zinc-500 relative z-10">
          <span>NASA SPACE APPS CHALLENGE // ARTEMIS ACCORDS §5.4</span>
          <span>PASS REQUIREMENT: 3/5 QUESTIONS</span>
        </div>
      </div>
    </div>
  );
}
