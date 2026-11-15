import React, { useState } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface FortuneTellerSectionProps {
  onNextSurprise?: () => void;
}

interface FortuneResult {
  prediction: string;
  luckyNumber: number;
  cakeSlices: string;
}

const PREDICTIONS = [
  'Agle 365 dinon mein tumhe bina maange extra fries aur har photo mein perfect lighting milegi!',
  'Sitaare keh rahe hain ki aaj raat 12 baje ke baad bhi tumhari party mode off nahi hogi!',
  'Is saal tumhare "Kal se gym pakka" wale plan kam se kam 2 hafte zaroor chalenge!',
  'Aane wale mahinon mein tumhara phone 100% charged aur mood 200% mast rehne wala hai!',
  'Bhavishyawani: Aaj koi tumhe surprise treat dega (ya tumhe sabko deni padegi, dekh lo)!',
  'Tumhari hasi dekh kar is saal bhi padosi jalenge aur dost party maangenge!',
];

const CAKE_COUNTS = [
  '3 Bade Slices (Diet kal se!)',
  '5 Slices (Birthday rule: calories zero hoti hain!)',
  '2 Double-Cream Slices + Ek Extra Bite!',
  '4 Slices (Chhupa ke ek aur le lena!)',
  '7 Slices (Poora haq banta hai bhai!)',
];

export const FortuneTellerSection: React.FC<FortuneTellerSectionProps> = ({
  onNextSurprise,
}) => {
  const [fortune, setFortune] = useState<FortuneResult | null>(null);
  const [spinCount, setSpinCount] = useState(0);

  const revealFortune = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    soundFX.playFortuneMagic();
    triggerConfetti('small', rect.left + rect.width / 2, rect.top);

    const nextPrediction =
      PREDICTIONS[(spinCount + Math.floor(Math.random() * 2)) % PREDICTIONS.length];
    const luckyNumber = Math.floor(Math.random() * 90) + 10;
    const cakeSlices = CAKE_COUNTS[Math.floor(Math.random() * CAKE_COUNTS.length)];

    setSpinCount((c) => c + 1);
    setFortune({
      prediction: nextPrediction,
      luckyNumber,
      cakeSlices,
    });
  };

  return (
    <section
      id="fortune"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 shadow-2xl shadow-violet-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-violet-100/95 via-fuchsia-50 to-pink-50 dark:from-[#1B0D33] dark:via-[#230E36] dark:to-[#290F2D] p-6 sm:p-10">
        <div className="text-center max-w-xl mx-auto">
          <p className="text-xs font-extrabold text-violet-700 dark:text-violet-300 tracking-wide uppercase">
            Surprise 4 of 6 · Crystal Ball Predictions
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
            Birthday Fortune Teller 🔮
          </h2>
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
            Aane wale saal ka haal, apna lucky number aur aaj kitna cake khana hai — sab jaano!
          </p>

          <div className="mt-7 flex justify-center">
            <button
              type="button"
              onClick={revealFortune}
              className="min-h-[56px] px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 hover:brightness-110 active:scale-[0.96] text-white font-display text-xl font-extrabold shadow-xl shadow-violet-600/30 inline-flex items-center justify-center gap-2.5 cursor-pointer transition-all"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>{fortune ? 'Ek Aur Prediction Dekho' : 'Mera Bhavishya Btao 🔮'}</span>
            </button>
          </div>
        </div>

        {fortune && (
          <div
            key={spinCount}
            className="mt-8 rounded-3xl bg-white/95 dark:bg-[#150A26] border-2 border-violet-300 dark:border-violet-600 p-6 sm:p-7 shadow-xl animate-bounce-pop"
          >
            <div className="text-xs font-extrabold uppercase tracking-wide text-violet-600 dark:text-amber-300">
              16 Nov Cosmic Report ✨
            </div>
            <p className="mt-2 text-lg sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
              "{fortune.prediction}"
            </p>

            <div className="mt-6 pt-5 border-t border-violet-100 dark:border-violet-800/60 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 text-white px-5 py-4 shadow-md">
                <div className="text-xs font-bold uppercase opacity-90">
                  Aaj Ka Lucky Number
                </div>
                <div className="font-display text-4xl font-extrabold tabular-nums mt-0.5">
                  {fortune.luckyNumber}
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-br from-pink-500 to-amber-500 text-white px-5 py-4 shadow-md">
                <div className="text-xs font-bold uppercase opacity-90">
                  Approved Cake Slices
                </div>
                <div className="font-display text-xl sm:text-2xl font-extrabold mt-1">
                  {fortune.cakeSlices}
                </div>
              </div>
            </div>

            {onNextSurprise && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onNextSurprise();
                  }}
                  className="min-h-[48px] px-7 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 hover:brightness-110 text-white font-display text-lg font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Agla Surprise: Memories Gallery</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
