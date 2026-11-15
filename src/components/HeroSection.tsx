import React from 'react';
import { ArrowRight, Music, PartyPopper } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

export interface SurprisePageMeta {
  index: number;
  slug: string;
  emoji: string;
  title: string;
  subtitle: string;
  accentGradient: string;
  cardBg: string;
}

export const SURPRISE_CARDS: SurprisePageMeta[] = [
  {
    index: 1,
    slug: 'candles',
    emoji: '🕯️',
    title: '1. Candle Blow',
    subtitle: '5 candles bujhao aur apni sabse badi birthday wish maango.',
    accentGradient: 'from-pink-500 to-rose-500',
    cardBg: 'bg-pink-50/95 dark:bg-[#260D22]/90 border-pink-200 dark:border-pink-800/60',
  },
  {
    index: 2,
    slug: 'balloons',
    emoji: '🎈',
    title: '2. Balloon Pop',
    subtitle: 'Udte hue 10 colourful gubbare phod ke trophy jeeto.',
    accentGradient: 'from-emerald-500 to-teal-500',
    cardBg: 'bg-emerald-50/95 dark:bg-[#0D2421]/90 border-emerald-200 dark:border-emerald-800/60',
  },
  {
    index: 3,
    slug: 'gifts',
    emoji: '🎁',
    title: '3. Surprise Gifts',
    subtitle: '3 mystery gift boxes kholo — funny dares aur pyari wishes!',
    accentGradient: 'from-amber-400 to-orange-500',
    cardBg: 'bg-amber-50/95 dark:bg-[#27180C]/90 border-amber-200 dark:border-amber-800/60',
  },
  {
    index: 4,
    slug: 'fortune',
    emoji: '🔮',
    title: '4. Fortune Teller',
    subtitle: 'Aaj ka lucky number, cake slices count aur cosmic report dekho.',
    accentGradient: 'from-violet-500 to-fuchsia-600',
    cardBg: 'bg-violet-50/95 dark:bg-[#1D0D33]/90 border-violet-200 dark:border-violet-800/60',
  },
  {
    index: 5,
    slug: 'memories',
    emoji: '📸',
    title: '5. Memories Gallery',
    subtitle: '5 blurred gift photos aur 2 special birthday videos dekho.',
    accentGradient: 'from-rose-500 to-amber-500',
    cardBg: 'bg-rose-50/95 dark:bg-[#240D26]/90 border-rose-200 dark:border-rose-800/60',
  },
  {
    index: 6,
    slug: 'wish',
    emoji: '💌',
    title: '6. Special Khat',
    subtitle: 'Dil se likha hua heartfelt birthday letter typewriter ke saath.',
    accentGradient: 'from-fuchsia-500 to-pink-600',
    cardBg: 'bg-fuchsia-50/95 dark:bg-[#260C2A]/90 border-fuchsia-200 dark:border-fuchsia-800/60',
  },
];

interface HeroSectionProps {
  name: string;
  onStartJourney: () => void;
  onNavigatePage: (pageIndex: number) => void;
}

const BUNTING_COLORS = [
  '#EC4899',
  '#F59E0B',
  '#8B5CF6',
  '#10B981',
  '#F43F5E',
  '#FBBF24',
  '#A855F7',
  '#34D399',
  '#EC4899',
  '#F59E0B',
  '#8B5CF6',
  '#10B981',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  name,
  onStartJourney,
  onNavigatePage,
}) => {
  return (
    <div className="space-y-10">
      {/* Website Hero Banner */}
      <section className="relative overflow-hidden rounded-[32px] p-[3px] bg-gradient-to-br from-pink-500 via-amber-400 to-violet-600 shadow-2xl shadow-pink-500/25 dark:shadow-violet-950/70">
        <div className="relative rounded-[29px] overflow-hidden bg-gradient-to-br from-pink-500 via-fuchsia-600 to-violet-700 dark:from-[#3A0F5C] dark:via-[#64125B] dark:to-[#24124D] px-5 pt-4 pb-10 sm:px-10 sm:pb-14 text-center text-white">
          <svg
            aria-hidden="true"
            viewBox="0 0 600 44"
            className="w-full max-w-2xl mx-auto mb-5 h-8 sm:h-10 drop-shadow-sm"
            preserveAspectRatio="none"
          >
            <path
              d="M0 4 Q 300 22 600 4"
              fill="none"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="2.5"
            />
            {BUNTING_COLORS.map((color, i) => {
              const x = i * 50 + 5;
              const yOffset = Math.sin((i / 11) * Math.PI) * 9 + 5;
              return (
                <polygon
                  key={i}
                  points={`${x},${yOffset} ${x + 40},${yOffset + 1} ${x + 20},${yOffset + 28}`}
                  fill={color}
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1"
                />
              );
            })}
          </svg>

          <div className="relative max-w-2xl mx-auto">
            <div className="text-5xl sm:text-6xl mb-3 animate-float-gentle" role="img" aria-label="Birthday Celebration">
              🥳🎂✨
            </div>

            <p className="text-xs sm:text-sm font-bold tracking-wider uppercase text-amber-200 mb-2">
              16 November · Official Birthday Website
            </p>

            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-extrabold text-amber-200 drop-shadow-[0_4px_14px_rgba(0,0,0,0.28)] leading-[1.14] text-balance">
              जन्मदिन मुबारक!
            </h1>

            <h2 className="font-display mt-2 text-3xl sm:text-5xl font-extrabold text-white drop-shadow-sm leading-tight text-balance">
              Happy Birthday {name}!
            </h2>

            <p className="mt-4 text-base sm:text-lg text-pink-50/95 max-w-xl mx-auto leading-relaxed font-medium">
              Welcome to {name} ki special Birthday Website! Neeche diye gaye 6 separate surprise pages explore karo — games khelo, memories dekho, aur music enjoy karo!
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
              <button
                type="button"
                onClick={() => {
                  soundFX.playUnlockFanfare();
                  triggerConfetti('big');
                  onStartJourney();
                }}
                className="w-full sm:w-auto min-h-[56px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-300 via-yellow-300 to-amber-400 hover:brightness-105 active:scale-[0.96] text-slate-950 font-display text-xl font-extrabold shadow-xl shadow-amber-400/35 inline-flex items-center justify-center gap-2.5 transition-all cursor-pointer animate-pulse-glow"
              >
                <span>Surprise Tour Shuru Karein</span>
                <ArrowRight className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  soundFX.playCelebrateWin();
                  triggerConfetti('big', rect.left + rect.width / 2, rect.top);
                }}
                className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <PartyPopper className="w-4 h-4" aria-hidden="true" />
                <span>Confetti Udao!</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.playBirthdaySong();
                  triggerConfetti('small');
                }}
                className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white font-bold text-sm inline-flex items-center gap-2 cursor-pointer transition-all"
              >
                <Music className="w-4 h-4" aria-hidden="true" />
                <span>Birthday Tune Bajao 🎵</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Website Multi-Page Directory Grid */}
      <section aria-labelledby="directory-heading">
        <div className="flex flex-wrap items-end justify-between gap-3 mb-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-wider text-pink-600 dark:text-amber-300">
              All 6 Birthday Pages
            </p>
            <h2
              id="directory-heading"
              className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white"
            >
              Apna Pasandida Surprise Page Chuno
            </h2>
          </div>
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Har card ek alag page kholta hai
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SURPRISE_CARDS.map((card) => (
            <button
              key={card.slug}
              type="button"
              onClick={() => onNavigatePage(card.index)}
              className={`group rounded-3xl border-2 p-6 text-left flex flex-col justify-between transition-all hover:-translate-y-1 hover:shadow-xl active:scale-[0.98] cursor-pointer ${card.cardBg}`}
            >
              <div>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.accentGradient} text-white text-3xl flex items-center justify-center shadow-md mb-4 group-hover:scale-105 transition-transform`}
                  aria-hidden="true"
                >
                  {card.emoji}
                </div>
                <h3 className="font-display text-xl font-extrabold text-slate-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-1.5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  {card.subtitle}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-sm font-extrabold text-pink-600 dark:text-amber-300">
                <span>Page Kholo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
