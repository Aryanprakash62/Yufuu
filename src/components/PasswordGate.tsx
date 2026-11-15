import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, Lock, Sparkles } from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface PasswordGateProps {
  name: string;
  password: string;
  birthdayMonth: number;
  birthdayDay: number;
  onUnlock: () => void;
}

const FUNNY_ERRORS = [
  'Arre yaar, galat code! Cake churaane aaye ho kya? Dobara try karo!',
  'Oops! Yeh password match nahi hua — thoda birthday wala dimaag lagao!',
  'Na na na! Itni jaldi entry nahi milegi, sahi number daalo boss!',
  'Galat jawab! Lagta hai treat dene se dar rahe ho! Phir se try karo!',
];

interface TimeLeft {
  isToday: boolean;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getCountdownToBirthday(month: number, day: number): TimeLeft {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentDay = now.getDate();

  if (currentMonth === month && currentDay === day) {
    return { isToday: true, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let targetYear = now.getFullYear();
  let target = new Date(targetYear, month - 1, day, 0, 0, 0, 0);
  if (now.getTime() >= target.getTime()) {
    targetYear += 1;
    target = new Date(targetYear, month - 1, day, 0, 0, 0, 0);
  }

  const diff = Math.max(0, target.getTime() - now.getTime());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { isToday: false, days, hours, minutes, seconds };
}

const COUNTDOWN_TILE_COLORS = [
  'bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-pink-500/25',
  'bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-amber-500/25',
  'bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/25',
  'bg-gradient-to-br from-emerald-400 to-teal-500 text-slate-950 shadow-emerald-500/25',
];

export const PasswordGate: React.FC<PasswordGateProps> = ({
  name,
  password,
  birthdayMonth,
  birthdayDay,
  onUnlock,
}) => {
  const [input, setInput] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [errorIdx, setErrorIdx] = useState(0);
  const [shaking, setShaking] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
    getCountdownToBirthday(birthdayMonth, birthdayDay)
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTimeLeft(getCountdownToBirthday(birthdayMonth, birthdayDay));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [birthdayMonth, birthdayDay]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = input.trim();
    if (cleaned === password) {
      setErrorMsg(null);
      soundFX.playUnlockFanfare();
      triggerConfetti('big');
      onUnlock();
      return;
    }

    soundFX.playWrongShake();
    setErrorMsg(FUNNY_ERRORS[errorIdx % FUNNY_ERRORS.length]);
    setErrorIdx((prev) => prev + 1);
    setShaking(false);
    window.requestAnimationFrame(() => {
      setShaking(true);
    });
  };

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="min-h-dvh relative overflow-hidden flex items-center justify-center px-4 py-10 bg-gradient-to-br from-pink-200 via-fuchsia-100 to-amber-100 dark:from-[#160727] dark:via-[#240B3B] dark:to-[#1E102C] transition-colors">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-20 w-72 h-72 rounded-full bg-pink-400/35 dark:bg-pink-600/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 -right-16 w-80 h-80 rounded-full bg-amber-300/45 dark:bg-violet-600/30 blur-3xl"
      />

      <div
        className={`relative w-full max-w-md rounded-[30px] p-[3px] bg-gradient-to-br from-pink-500 via-amber-400 to-violet-600 shadow-2xl shadow-pink-500/25 dark:shadow-violet-950/70 ${
          shaking ? 'animate-shake' : ''
        }`}
        onAnimationEnd={() => setShaking(false)}
      >
        <div className="rounded-[27px] bg-white/95 dark:bg-[#170C28]/95 backdrop-blur-xl p-6 sm:p-8">
          <div className="text-center">
            <div
              className="inline-flex items-center justify-center w-22 h-22 rounded-3xl bg-gradient-to-br from-pink-500 via-amber-400 to-violet-500 p-[3px] mb-4 animate-float-gentle shadow-lg shadow-pink-500/25"
              role="img"
              aria-label="Birthday Cake"
            >
              <div className="w-full h-full rounded-[21px] bg-white dark:bg-[#1F1035] flex items-center justify-center text-5xl">
                🎂
              </div>
            </div>

            <p className="text-xs font-bold tracking-wide text-pink-600 dark:text-amber-300">
              16 NOVEMBER VIP PARTY PASS
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-violet-600 to-amber-500 dark:from-pink-400 dark:via-amber-300 dark:to-emerald-300 tracking-tight text-balance mt-1">
              Surprise Gate!
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-700 dark:text-slate-200">
              Andar aane ke liye secret code daalo —{' '}
              <span className="font-bold text-pink-600 dark:text-pink-400">{name}</span> ke liye 7 surprises ready hain!
            </p>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-r from-pink-50 via-violet-50 to-amber-50 dark:from-violet-950/70 dark:via-pink-950/50 dark:to-amber-950/40 border border-pink-200 dark:border-violet-700/60 px-4 py-3.5 text-center">
            <p className="text-xs font-bold text-violet-700 dark:text-amber-300 mb-2.5">
              {timeLeft.isToday
                ? 'Aaj 16 November hai — Happy Birthday!'
                : '16 November 00:00 Countdown'}
            </p>
            {!timeLeft.isToday ? (
              <div className="grid grid-cols-4 gap-2 tabular-nums">
                {[
                  { label: 'Din', val: pad(timeLeft.days) },
                  { label: 'Ghante', val: pad(timeLeft.hours) },
                  { label: 'Min', val: pad(timeLeft.minutes) },
                  { label: 'Sec', val: pad(timeLeft.seconds) },
                ].map((unit, idx) => (
                  <div
                    key={unit.label}
                    className={`rounded-2xl py-2 px-1 shadow-md ${COUNTDOWN_TILE_COLORS[idx]}`}
                  >
                    <div className="font-display text-xl sm:text-2xl font-extrabold leading-none">
                      {unit.val}
                    </div>
                    <div className="text-[11px] font-bold opacity-90 mt-1">
                      {unit.label}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-display text-xl font-extrabold text-pink-600 dark:text-pink-300">
                Party Time Shuru! 🥳🎉
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="birthday-password"
                className="block text-sm font-bold text-slate-800 dark:text-slate-100 mb-2"
              >
                Secret Code Daalo
              </label>
              <div className="relative flex items-center">
                <Lock
                  className="w-5 h-5 text-pink-500 dark:text-pink-400 absolute left-3.5 pointer-events-none"
                  aria-hidden="true"
                />
                <input
                  id="birthday-password"
                  type={showCode ? 'text' : 'password'}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  autoComplete="off"
                  value={input}
                  onChange={(e) => {
                    setInput(e.target.value);
                    if (errorMsg) setErrorMsg(null);
                  }}
                  placeholder="4-digit code..."
                  className="w-full min-h-[52px] pl-11 pr-12 rounded-2xl bg-pink-50/70 dark:bg-[#23133D] border-2 border-pink-300 dark:border-violet-600 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-400 text-lg font-bold tracking-widest tabular-nums focus:outline-none focus:border-violet-500 dark:focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowCode((v) => !v)}
                  aria-label={showCode ? 'Code chhupao' : 'Code dikhao'}
                  className="absolute right-1.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-violet-600 hover:text-pink-600 dark:text-violet-300 dark:hover:text-amber-300 transition-colors cursor-pointer"
                >
                  {showCode ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="rounded-2xl bg-rose-500 text-white px-4 py-3 text-sm font-bold shadow-md shadow-rose-500/25 animate-bounce-pop"
              >
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[54px] rounded-2xl bg-gradient-to-r from-pink-500 via-violet-600 to-amber-500 hover:brightness-110 active:scale-[0.97] text-white font-display text-xl font-extrabold shadow-xl shadow-pink-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-500"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
              <span>Andar jao 🎉</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
