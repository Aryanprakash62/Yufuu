import React, { useEffect, useState } from 'react';
import { Heart, MailOpen, Music, RotateCcw, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface SpecialWishSectionProps {
  name: string;
  wishMessage: string;
  onRestartJourney?: () => void;
}

export const SpecialWishSection: React.FC<SpecialWishSectionProps> = ({
  name,
  wishMessage,
  onRestartJourney,
}) => {
  const [opened, setOpened] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const isTypingDone = charCount >= wishMessage.length;

  useEffect(() => {
    if (!opened || isTypingDone) return;

    const timer = window.setTimeout(() => {
      setCharCount((c) => {
        const next = Math.min(c + 2, wishMessage.length);
        if (next % 8 === 0) {
          soundFX.playTypeTick();
        }
        return next;
      });
    }, 28);

    return () => window.clearTimeout(timer);
  }, [opened, charCount, isTypingDone, wishMessage.length]);

  const handleOpen = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    soundFX.playGiftOpen();
    triggerConfetti('big', rect.left + rect.width / 2, rect.top);
    setOpened(true);
    setCharCount(0);
  };

  return (
    <section
      id="wish"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-amber-400 shadow-2xl shadow-pink-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-fuchsia-100/95 via-pink-50 to-amber-50 dark:from-[#290D2E] dark:via-[#2B0F26] dark:to-[#241612] p-6 sm:p-10">
        <div className="max-w-2xl">
          <p className="text-xs font-extrabold text-fuchsia-700 dark:text-amber-300 tracking-wide uppercase">
            Surprise 6 of 6 · Grand Finale Letter
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Special Birthday Wish 💌
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
            Aakhri aur sabse pyaara surprise — {name} ke liye ek heartfelt birthday letter!
          </p>
        </div>

        {!opened ? (
          <div className="mt-8 flex flex-col items-center justify-center py-8 text-center">
            <div className="text-6xl mb-4 animate-float-gentle" role="img" aria-label="Love letter">
              💌
            </div>
            <button
              type="button"
              onClick={handleOpen}
              className="min-h-[56px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-amber-500 hover:brightness-110 active:scale-[0.96] text-white font-display text-xl font-extrabold shadow-xl shadow-pink-500/30 inline-flex items-center gap-2.5 cursor-pointer transition-all animate-pulse-glow"
            >
              <MailOpen className="w-6 h-6" aria-hidden="true" />
              <span>Special Khat Kholo</span>
            </button>
          </div>
        ) : (
          <div className="mt-6 rounded-3xl bg-white/95 dark:bg-[#170B26] border-2 border-pink-300 dark:border-pink-600 p-6 sm:p-8 shadow-xl animate-bounce-pop">
            <div className="flex items-center justify-between gap-4 pb-4 border-b border-pink-200 dark:border-pink-800/60">
              <div className="flex items-center gap-2 text-pink-600 dark:text-pink-400 font-display text-2xl font-extrabold">
                <Heart className="w-6 h-6 fill-current" aria-hidden="true" />
                <span>Pyare {name} ke naam,</span>
              </div>
              <span className="text-xs font-extrabold text-amber-600 dark:text-amber-300 uppercase">
                16 November
              </span>
            </div>

            <p className="mt-5 text-base sm:text-lg text-slate-800 dark:text-slate-100 leading-relaxed whitespace-pre-line min-h-[140px] font-medium">
              {wishMessage.slice(0, charCount)}
              {!isTypingDone && (
                <span
                  aria-hidden="true"
                  className="inline-block w-0.5 h-5 bg-pink-500 ml-0.5 align-middle animate-pulse"
                />
              )}
            </p>

            <div className="mt-6 pt-4 border-t border-pink-200 dark:border-pink-800/60 flex flex-wrap items-center justify-between gap-3">
              {!isTypingDone ? (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCharCount(wishMessage.length);
                  }}
                  className="min-h-[44px] px-5 py-2 rounded-2xl bg-gradient-to-r from-violet-500 to-fuchsia-600 text-white text-sm font-bold cursor-pointer hover:brightness-110 transition-all shadow-sm"
                >
                  Poora Ek Saath Padho
                </button>
              ) : (
                <span className="font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-amber-300">
                  Hamesha khush raho! 💖
                </span>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playBirthdaySong();
                    triggerConfetti('big');
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-200 text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer hover:brightness-95 transition-all"
                >
                  <Music className="w-4 h-4" aria-hidden="true" />
                  <span>Birthday Tune 🎵</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    setCharCount(0);
                  }}
                  className="min-h-[44px] px-4 py-2 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer hover:bg-pink-200 dark:hover:bg-pink-900/70 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" aria-hidden="true" />
                  <span>Phir Se Chalao</span>
                </button>

                {onRestartJourney && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.playUnlockFanfare();
                      triggerConfetti('big');
                      onRestartJourney();
                    }}
                    className="min-h-[44px] px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white text-sm font-bold inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all shadow-sm"
                  >
                    <Sparkles className="w-4 h-4" aria-hidden="true" />
                    <span>Home Par Jao</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
