import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Flame, RotateCcw } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface CandleBlowSectionProps {
  onNextSurprise?: () => void;
}

const CANDLE_COLORS = [
  'from-pink-400 via-pink-500 to-rose-600',
  'from-amber-300 via-amber-400 to-orange-500',
  'from-violet-400 via-violet-500 to-purple-700',
  'from-emerald-300 via-emerald-500 to-teal-600',
  'from-fuchsia-400 via-pink-500 to-rose-600',
];

export const CandleBlowSection: React.FC<CandleBlowSectionProps> = ({ onNextSurprise }) => {
  const [litCandles, setLitCandles] = useState<boolean[]>([true, true, true, true, true]);
  const [smokedIndex, setSmokedIndex] = useState<number | null>(null);
  const celebratedRef = useRef(false);

  const blownCount = litCandles.filter((lit) => !lit).length;
  const allOut = blownCount === 5;

  useEffect(() => {
    if (allOut && !celebratedRef.current) {
      celebratedRef.current = true;
      soundFX.playCelebrateWin();
      triggerConfetti('big');
    }
  }, [allOut]);

  const blowCandle = (index: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!litCandles[index]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    soundFX.playBlowCandle();
    triggerConfetti('small', rect.left + rect.width / 2, rect.top);

    setSmokedIndex(index);
    setLitCandles((prev) => prev.map((v, i) => (i === index ? false : v)));
  };

  const relightAll = () => {
    soundFX.playClick();
    celebratedRef.current = false;
    setSmokedIndex(null);
    setLitCandles([true, true, true, true, true]);
  };

  return (
    <section
      id="candles"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-pink-400 via-rose-400 to-amber-400 shadow-2xl shadow-pink-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-pink-100/95 via-rose-50 to-amber-50 dark:from-[#2A0E24] dark:via-[#230E29] dark:to-[#29171E] p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-pink-600 dark:text-pink-300 tracking-wide uppercase">
              Surprise 1 of 6 · Make A Wish
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Mombattiyaan Bujhao! 🕯️
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
              Har jalti flame par tap karke phoonk maaro. Sab bujhte hi wish pakki hogi!
            </p>
          </div>

          <div className="rounded-2xl bg-pink-500 text-white px-4 py-2 font-display text-lg font-extrabold tabular-nums shadow-md shadow-pink-500/25">
            {blownCount} / 5 Out
          </div>
        </div>

        {/* Cake & 5 Candles Stage */}
        <div className="mt-10 flex flex-col items-center">
          <div className="flex items-end justify-center gap-3 sm:gap-6 px-2">
            {litCandles.map((isLit, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => blowCandle(idx, e)}
                aria-label={isLit ? `Candle ${idx + 1} bujhao` : `Candle ${idx + 1} bujh chuki hai`}
                className="group relative flex flex-col items-center min-w-[48px] min-h-[132px] justify-end pt-10 pb-1 cursor-pointer focus-visible:outline-2 focus-visible:outline-pink-500 rounded-2xl transition-transform active:scale-95"
              >
                <div className="relative h-10 w-8 flex items-end justify-center mb-1">
                  {isLit ? (
                    <div className="relative w-6 h-9">
                      <div
                        className="absolute left-1/2 bottom-0 w-5 h-8 rounded-full bg-gradient-to-t from-orange-500 via-amber-400 to-yellow-200 animate-flicker shadow-[0_0_20px_rgba(251,191,36,0.95)]"
                        style={{ clipPath: 'ellipse(46% 50% at 50% 58%)' }}
                      />
                      <div className="absolute left-1/2 bottom-1 -translate-x-1/2 w-2.5 h-4 rounded-full bg-white/90" />
                    </div>
                  ) : (
                    <>
                      {smokedIndex === idx && (
                        <span
                          aria-hidden="true"
                          className="absolute left-1/2 bottom-1 text-xl animate-smoke pointer-events-none"
                        >
                          💨
                        </span>
                      )}
                      <span className="text-xs font-bold text-pink-600/70 dark:text-pink-300/70 mb-1">
                        Off
                      </span>
                    </>
                  )}
                </div>

                <div className="w-1 h-2.5 bg-slate-800 dark:bg-amber-200 rounded-full" />

                <div
                  className={`w-7 sm:w-8 h-22 rounded-t-xl rounded-b-md bg-gradient-to-b ${CANDLE_COLORS[idx]} shadow-lg border border-white/50 relative overflow-hidden`}
                >
                  <div className="absolute inset-x-0 top-3 h-2 bg-white/35 -rotate-6" />
                  <div className="absolute inset-x-0 top-9 h-2 bg-white/35 -rotate-6" />
                  <div className="absolute inset-x-0 top-15 h-2 bg-white/35 -rotate-6" />
                </div>
              </button>
            ))}
          </div>

          <div className="w-full max-w-sm h-11 rounded-t-3xl bg-gradient-to-r from-pink-400 via-amber-300 to-pink-400 dark:from-pink-600 dark:via-amber-500 dark:to-pink-600 border-b-4 border-pink-500/60 shadow-md flex items-center justify-center">
            <span className="font-display text-xs sm:text-sm font-extrabold text-slate-950 tracking-wider">
              HAPPY BIRTHDAY CAKE
            </span>
          </div>
          <div className="w-full max-w-md h-9 rounded-b-3xl bg-gradient-to-r from-violet-500 via-pink-500 to-amber-500 shadow-lg flex items-center justify-around px-6">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-200" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-200" />
          </div>
        </div>

        {allOut ? (
          <div className="mt-7 rounded-2xl bg-white/95 dark:bg-[#190B26] border-2 border-pink-400 dark:border-pink-500 p-5 text-center shadow-lg animate-bounce-pop">
            <p className="font-display text-2xl font-extrabold text-pink-600 dark:text-pink-400">
              Wah! Saari mombattiyaan bujh gayi! 🎉
            </p>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
              Aankhein band karke jaldi se apni sabse badi birthday wish maang lo!
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={relightAll}
                className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-sm font-bold inline-flex items-center gap-2 cursor-pointer hover:bg-pink-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4" aria-hidden="true" />
                <span>Dobara Jalao</span>
              </button>
              {onNextSurprise && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onNextSurprise();
                  }}
                  className="min-h-[46px] px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:brightness-110 text-white text-sm font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Agla Surprise: Gubbare</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-pink-700 dark:text-pink-300">
            <Flame className="w-4 h-4" aria-hidden="true" />
            <span>Tip: Har jalti flame par tap karo!</span>
          </div>
        )}
      </div>
    </section>
  );
};
