import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Trophy } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface BalloonPopSectionProps {
  onNextSurprise?: () => void;
}

interface BalloonItem {
  id: number;
  xPercent: number;
  yPercent: number;
  speed: number;
  colorClass: string;
  stringColor: string;
}

const BALLOON_STYLES = [
  { colorClass: 'from-pink-400 via-pink-500 to-rose-600 shadow-pink-500/40', stringColor: 'bg-pink-500' },
  { colorClass: 'from-amber-300 via-amber-400 to-orange-500 shadow-amber-500/40', stringColor: 'bg-amber-500' },
  { colorClass: 'from-violet-400 via-violet-500 to-purple-700 shadow-violet-500/40', stringColor: 'bg-violet-500' },
  { colorClass: 'from-emerald-300 via-emerald-500 to-teal-600 shadow-emerald-500/40', stringColor: 'bg-emerald-500' },
];

const WIN_TARGET = 10;

function makeBalloon(id: number, startBottom = false): BalloonItem {
  const style = BALLOON_STYLES[id % BALLOON_STYLES.length];
  return {
    id,
    xPercent: 10 + Math.random() * 78,
    yPercent: startBottom ? 95 + Math.random() * 20 : 15 + Math.random() * 75,
    speed: 0.4 + Math.random() * 0.36,
    colorClass: style.colorClass,
    stringColor: style.stringColor,
  };
}

export const BalloonPopSection: React.FC<BalloonPopSectionProps> = ({ onNextSurprise }) => {
  const nextIdRef = useRef(1);
  const [score, setScore] = useState(0);
  const [popMessage, setPopMessage] = useState<string | null>(null);
  const [balloons, setBalloons] = useState<BalloonItem[]>(() =>
    Array.from({ length: 6 }, () => makeBalloon(nextIdRef.current++, false))
  );

  const won = score >= WIN_TARGET;

  useEffect(() => {
    if (won) return;

    let lastTime = performance.now();
    let rafId = 0;

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 16.67, 3);
      lastTime = now;

      setBalloons((prev) =>
        prev.map((b) => {
          const nextY = b.yPercent - b.speed * dt;
          if (nextY < -18) {
            return makeBalloon(nextIdRef.current++, true);
          }
          return {
            ...b,
            yPercent: nextY,
          };
        })
      );

      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(rafId);
  }, [won]);

  const handlePop = (id: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (won) return;
    const rect = e.currentTarget.getBoundingClientRect();
    soundFX.playPop();
    triggerConfetti('small', rect.left + rect.width / 2, rect.top + rect.height / 2);

    const nextScore = score + 1;
    setScore(nextScore);
    setPopMessage('POP! 💥');
    window.setTimeout(() => setPopMessage(null), 450);

    setBalloons((prev) =>
      prev.map((b) => (b.id === id ? makeBalloon(nextIdRef.current++, true) : b))
    );

    if (nextScore >= WIN_TARGET) {
      soundFX.playCelebrateWin();
      triggerConfetti('big');
    }
  };

  const resetGame = () => {
    soundFX.playClick();
    setScore(0);
    setPopMessage(null);
    setBalloons(Array.from({ length: 6 }, () => makeBalloon(nextIdRef.current++, false)));
  };

  return (
    <section
      id="balloons"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 shadow-2xl shadow-emerald-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-emerald-100/95 via-teal-50 to-cyan-50 dark:from-[#0C2622] dark:via-[#0E2229] dark:to-[#111D2B] p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase">
              Surprise 2 of 6 · Fast Fingers
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Gubbare Phodo! 🎈
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
              Udte hue {WIN_TARGET} colourful gubbare phod ke dikhao aur birthday trophy jeeto!
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 text-center tabular-nums shadow-md shadow-emerald-500/25">
            <span className="text-[11px] font-bold uppercase opacity-90 block">Score</span>
            <span className="font-display text-xl font-extrabold">
              {Math.min(score, WIN_TARGET)} / {WIN_TARGET}
            </span>
          </div>
        </div>

        {/* Play Arena */}
        <div className="mt-6 relative h-80 sm:h-96 rounded-3xl bg-gradient-to-b from-sky-200/80 via-emerald-100/70 to-amber-100/70 dark:from-[#12263A] dark:via-[#112A2E] dark:to-[#1A2036] border-2 border-emerald-300 dark:border-emerald-700/70 overflow-hidden select-none shadow-inner">
          {popMessage && !won && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-3 right-4 font-display text-xl font-extrabold text-pink-600 dark:text-amber-300 animate-bounce-pop z-20"
            >
              {popMessage}
            </div>
          )}

          {!won ? (
            balloons.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={(e) => handlePop(b.id, e)}
                aria-label="Balloon phodo"
                style={{
                  left: `${b.xPercent}%`,
                  top: `${b.yPercent}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className="absolute w-14 h-22 flex flex-col items-center justify-start cursor-pointer active:scale-90 transition-transform focus-visible:outline-2 focus-visible:outline-emerald-500 rounded-full"
              >
                <span
                  className={`w-13 h-15 rounded-full bg-gradient-to-br ${b.colorClass} shadow-lg border border-white/50 relative block`}
                >
                  <span className="absolute top-2.5 left-2.5 w-3 h-4.5 rounded-full bg-white/55 rotate-12" />
                </span>
                <span className={`w-0.5 h-6 ${b.stringColor}`} />
              </button>
            ))
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-white/92 dark:bg-[#140E26]/92 backdrop-blur-sm animate-bounce-pop">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-lg mb-3">
                <Trophy className="w-9 h-9 text-slate-950" aria-hidden="true" />
              </div>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                Shabaash Champion! 🏆
              </h3>
              <p className="mt-2 text-sm sm:text-base text-slate-700 dark:text-slate-200 max-w-md font-medium">
                10/10 gubbare phod diye! Itni tez ungliyan toh sirf free cake dekh kar chalti hain! Ab birthday treat double pakki!
              </p>
              <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={resetGame}
                  className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-200 font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Phir Se Khelo</span>
                </button>
                {onNextSurprise && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playClick();
                      onNextSurprise();
                    }}
                    className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:brightness-110 text-white font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer transition-all shadow-md"
                  >
                    <span>Agla Surprise: Gift Boxes</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
