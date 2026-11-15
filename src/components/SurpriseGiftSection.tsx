import React, { useState } from 'react';
import { ArrowRight, Gift, Shuffle } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface SurpriseGiftSectionProps {
  onNextSurprise?: () => void;
}

const DARES_AND_WISHES = [
  {
    type: 'Funny Dare',
    text: 'Apni sabse ajeeb selfie lo aur family group mein "Good Morning" likh ke bhejo!',
  },
  {
    type: 'Birthday Wish',
    text: 'Dua hai ki is saal tumhara bank balance tumhare phone ke screen-time se zyada badhe!',
  },
  {
    type: 'Funny Dare',
    text: '10 second tak bina hase ek dramatic Bollywood dialogue bol ke sunao!',
  },
  {
    type: 'Birthday Wish',
    text: 'Bhagwan kare tumhe hamesha garam chai, thandi hawa, aur bina traffic wali road mile!',
  },
  {
    type: 'Funny Dare',
    text: 'Agli 5 minute sabko sirf "Ji Huzoor" bol ke baat karni hogi!',
  },
  {
    type: 'Birthday Wish',
    text: 'Is saal tumhare saare plans cancel na hon aur Goa trip sach mein ho jaaye!',
  },
  {
    type: 'Funny Dare',
    text: 'Bina haath lagaye ek biscuit/snack khaane ki acting karo — sab video banayenge!',
  },
  {
    type: 'Birthday Wish',
    text: 'Happy Birthday! Dua hai har weekend tumhara favourite khana free mein mile!',
  },
  {
    type: 'Funny Dare',
    text: 'Apne sabse close dost ko call karke bolo "Mujhe abhi 500 rupaye chahiye, treat ke liye!"',
  },
];

const BOX_GRADIENTS = [
  'from-amber-400 via-orange-400 to-pink-500 text-white shadow-amber-500/25',
  'from-pink-500 via-fuchsia-500 to-violet-600 text-white shadow-pink-500/25',
  'from-violet-500 via-purple-500 to-emerald-500 text-white shadow-violet-500/25',
];

function pickThree(): typeof DARES_AND_WISHES {
  const pool = [...DARES_AND_WISHES];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 3);
}

export const SurpriseGiftSection: React.FC<SurpriseGiftSectionProps> = ({
  onNextSurprise,
}) => {
  const [gifts, setGifts] = useState(() => pickThree());
  const [opened, setOpened] = useState<boolean[]>([false, false, false]);

  const allOpened = opened.every(Boolean);

  const openBox = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (opened[idx]) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nextOpened = opened.map((v, i) => (i === idx ? true : v));
    setOpened(nextOpened);

    if (nextOpened.every(Boolean)) {
      soundFX.playCelebrateWin();
      triggerConfetti('big');
    } else {
      soundFX.playGiftOpen();
      triggerConfetti('small', rect.left + rect.width / 2, rect.top + rect.height / 2);
    }
  };

  const reshuffle = () => {
    soundFX.playClick();
    setGifts(pickThree());
    setOpened([false, false, false]);
  };

  return (
    <section
      id="gifts"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-amber-400 via-orange-400 to-pink-500 shadow-2xl shadow-amber-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-amber-100/95 via-yellow-50 to-pink-50 dark:from-[#2B1B0D] dark:via-[#261614] dark:to-[#240F22] p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-amber-700 dark:text-amber-300 tracking-wide uppercase">
              Surprise 3 of 6 · Mystery Boxes
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Surprise Gift Kholo! 🎁
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
              Teeno colourful gift boxes par tap karo — har box mein ek funny dare ya zabardast wish chhupi hai!
            </p>
          </div>

          <button
            type="button"
            onClick={reshuffle}
            className="min-h-[46px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-sm font-extrabold inline-flex items-center gap-2 hover:brightness-105 cursor-pointer transition-all shadow-md"
          >
            <Shuffle className="w-4 h-4" aria-hidden="true" />
            <span>Naye Gifts Lao</span>
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5">
          {gifts.map((gift, idx) => {
            const isOpen = opened[idx];
            return (
              <button
                key={idx}
                type="button"
                onClick={(e) => openBox(idx, e)}
                className={`min-h-[200px] rounded-3xl p-6 text-left transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-500 flex flex-col justify-between ${
                  isOpen
                    ? 'bg-white dark:bg-[#191026] border-2 border-amber-400 dark:border-amber-500 shadow-lg animate-bounce-pop'
                    : `bg-gradient-to-br ${BOX_GRADIENTS[idx]} shadow-xl hover:scale-[1.03] active:scale-[0.97] items-center justify-center text-center`
                }`}
              >
                {!isOpen ? (
                  <div className="flex flex-col items-center">
                    <span className="text-6xl mb-3 animate-float-gentle drop-shadow" role="img" aria-label="Gift box">
                      🎁
                    </span>
                    <span className="font-display text-2xl font-extrabold">
                      Box #{idx + 1} Kholo
                    </span>
                    <span className="text-xs font-semibold opacity-90 mt-1">
                      Tap karke dekho kya nikla
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wide text-amber-600 dark:text-amber-300">
                      <Gift className="w-4 h-4" aria-hidden="true" />
                      <span>{gift.type}</span>
                    </div>
                    <p className="mt-3 text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {gift.text}
                    </p>
                    <span className="mt-4 text-xs font-bold text-pink-600 dark:text-pink-400">
                      Khul gaya! ✨
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {allOpened && onNextSurprise && (
          <div className="mt-7 flex justify-center animate-bounce-pop">
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                onNextSurprise();
              }}
              className="min-h-[50px] px-7 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-pink-500 hover:brightness-110 text-white font-display text-lg font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-lg transition-all"
            >
              <span>Agla Surprise: Fortune Teller</span>
              <ArrowRight className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
