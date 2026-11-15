import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  Lock,
  Menu,
  Moon,
  PartyPopper,
  Sun,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { BalloonPopSection } from './components/BalloonPopSection';
import { CandleBlowSection } from './components/CandleBlowSection';
import { ConfettiCanvas } from './components/ConfettiCanvas';
import { FortuneTellerSection } from './components/FortuneTellerSection';
import { HeroSection } from './components/HeroSection';
import { MemoriesGallerySection } from './components/MemoriesGallerySection';
import { PasswordGate } from './components/PasswordGate';
import { SpecialWishSection } from './components/SpecialWishSection';
import { SurpriseGiftSection } from './components/SurpriseGiftSection';
import { triggerConfetti } from './utils/confetti';
import { soundFX } from './utils/sounds';

// ============================================================
// CONFIG — Edit NAME, PASSWORD, and WISH_MESSAGE right here!
// ============================================================
export const CONFIG = {
  NAME: 'Cutie',
  PASSWORD: '1619',
  BIRTHDAY_MONTH: 11, // November
  BIRTHDAY_DAY: 16,   // 16th
  WISH_MESSAGE: `Janamdin ki dher saari badhaiyaan! 16 November sirf ek date nahi, balki saal ka sabse best din hai kyunki aaj tum is duniya mein aaye the.

Tumhari pyari si smile, tumhari masti, aur har waqt sabko khush rakhne ki aadat sabse special hai. Bhagwan kare aane wala saal tumhare liye dher saari khushiyan, zabardast success, aur har khwahish poori hone ka tohfa lekar aaye!

Hamesha aise hi chamakte, haste aur mast rehna. Party hard, aaj sab maaf hai!`,
};

const PAGES = [
  { id: 'home', hash: '#/', navLabel: 'Home', title: 'Birthday Home' },
  { id: 'candles', hash: '#/candles', navLabel: 'Candles', title: 'Candle Blow' },
  { id: 'balloons', hash: '#/balloons', navLabel: 'Balloons', title: 'Balloon Pop' },
  { id: 'gifts', hash: '#/gifts', navLabel: 'Gifts', title: 'Surprise Gifts' },
  { id: 'fortune', hash: '#/fortune', navLabel: 'Fortune', title: 'Fortune Teller' },
  { id: 'memories', hash: '#/memories', navLabel: 'Memories', title: 'Memories Gallery' },
  { id: 'wish', hash: '#/wish', navLabel: 'Special Khat', title: 'Special Wish' },
];

function getPageIndexFromHash(): number {
  if (typeof window === 'undefined') return 0;
  const h = window.location.hash;
  const found = PAGES.findIndex((p) => p.hash === h);
  return found >= 0 ? found : 0;
}

export default function App() {
  const [unlocked, setUnlocked] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.sessionStorage.getItem('bday_unlocked') === '1';
  });
  const [currentPage, setCurrentPage] = useState<number>(() => getPageIndexFromHash());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [muted, setMuted] = useState(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    soundFX.setMuted(muted);
  }, [muted]);

  // Sync browser URL hash & Back/Forward buttons like a multi-page website
  useEffect(() => {
    const onHashChange = () => {
      setCurrentPage(getPageIndexFromHash());
      setMobileMenuOpen(false);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Update document title per page
  useEffect(() => {
    const page = PAGES[currentPage];
    document.title = unlocked
      ? `${page.title} — Happy Birthday ${CONFIG.NAME}!`
      : `VIP Gate — Happy Birthday ${CONFIG.NAME}!`;
  }, [currentPage, unlocked]);

  const navigateTo = useCallback(
    (pageIndex: number) => {
      const clamped = Math.max(0, Math.min(PAGES.length - 1, pageIndex));
      const targetHash = PAGES[clamped].hash;
      if (window.location.hash !== targetHash) {
        window.location.hash = targetHash;
      }
      if (clamped !== currentPage) {
        soundFX.playClick();
        setCurrentPage(clamped);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      setMobileMenuOpen(false);
    },
    [currentPage]
  );

  const handleUnlock = () => {
    window.sessionStorage.setItem('bday_unlocked', '1');
    setUnlocked(true);
    window.location.hash = '#/';
    setCurrentPage(0);
  };

  const handleLock = () => {
    soundFX.playClick();
    window.sessionStorage.removeItem('bday_unlocked');
    setUnlocked(false);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <ConfettiCanvas />

      {!unlocked ? (
        <div className="relative">
          <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMuted((m) => !m)}
              aria-label={muted ? 'Sound chalu karo' : 'Sound band karo'}
              className="min-w-[44px] min-h-[44px] rounded-2xl bg-white/95 dark:bg-[#1E1035]/95 backdrop-blur-md border-2 border-pink-300 dark:border-violet-600 text-pink-600 dark:text-amber-300 shadow-md flex items-center justify-center cursor-pointer transition-colors"
            >
              {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? 'Light mode lagao' : 'Dark mode lagao'}
              className="min-w-[44px] min-h-[44px] rounded-2xl bg-white/95 dark:bg-[#1E1035]/95 backdrop-blur-md border-2 border-pink-300 dark:border-violet-600 text-pink-600 dark:text-amber-300 shadow-md flex items-center justify-center cursor-pointer transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <PasswordGate
            name={CONFIG.NAME}
            password={CONFIG.PASSWORD}
            birthdayMonth={CONFIG.BIRTHDAY_MONTH}
            birthdayDay={CONFIG.BIRTHDAY_DAY}
            onUnlock={handleUnlock}
          />
        </div>
      ) : (
        <div className="min-h-dvh flex flex-col bg-gradient-to-br from-pink-100 via-fuchsia-50 to-amber-100 dark:from-[#0F061C] dark:via-[#1B0A2E] dark:to-[#11192E] text-slate-900 dark:text-slate-100 transition-colors">
          {/* Website Header Navigation */}
          <header className="sticky top-0 z-30 h-16 bg-white/90 dark:bg-[#150826]/90 backdrop-blur-md border-b border-pink-200 dark:border-violet-800/70 shadow-xs">
            <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
              {/* Brand */}
              <a
                href="#/"
                onClick={(e) => {
                  e.preventDefault();
                  navigateTo(0);
                }}
                className="font-display text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-violet-600 to-amber-500 dark:from-pink-400 dark:via-amber-300 dark:to-emerald-300 whitespace-nowrap shrink-0"
              >
                {CONFIG.NAME} · 16 Nov
              </a>

              {/* Desktop Website Nav Links */}
              <nav aria-label="Primary website navigation" className="hidden lg:flex items-center gap-1">
                {PAGES.map((p, idx) => {
                  const isActive = idx === currentPage;
                  return (
                    <a
                      key={p.id}
                      href={p.hash}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(idx);
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap shrink-0 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white shadow-sm'
                          : 'text-slate-700 dark:text-slate-200 hover:text-pink-600 dark:hover:text-amber-300 hover:bg-pink-50 dark:hover:bg-violet-900/40'
                      }`}
                    >
                      {p.navLabel}
                    </a>
                  );
                })}
              </nav>

              {/* Right Controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playCelebrateWin();
                    triggerConfetti('big');
                  }}
                  aria-label="Confetti udao"
                  className="min-h-[40px] px-3.5 rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 text-white text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all shadow-sm whitespace-nowrap"
                >
                  <PartyPopper className="w-4 h-4" aria-hidden="true" />
                  <span className="hidden sm:inline">Confetti!</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  aria-label={muted ? 'Sound chalu karo' : 'Sound band karo'}
                  title={muted ? 'Sound Off' : 'Sound On'}
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-pink-100 dark:bg-violet-900/70 text-pink-700 dark:text-amber-300 flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setDarkMode((d) => !d)}
                  aria-label={darkMode ? 'Light mode lagao' : 'Dark mode lagao'}
                  className="min-w-[40px] min-h-[40px] rounded-xl bg-amber-100 dark:bg-violet-900/70 text-amber-700 dark:text-amber-300 flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => setMobileMenuOpen((v) => !v)}
                  aria-label={mobileMenuOpen ? 'Menu band karo' : 'Menu kholo'}
                  aria-expanded={mobileMenuOpen}
                  className="lg:hidden min-w-[40px] min-h-[40px] rounded-xl bg-slate-100 dark:bg-violet-900/70 text-slate-800 dark:text-white flex items-center justify-center cursor-pointer"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Mobile Website Dropdown Menu */}
            {mobileMenuOpen && (
              <nav
                aria-label="Mobile website navigation"
                className="lg:hidden bg-white/95 dark:bg-[#170A2B]/98 backdrop-blur-lg border-b border-pink-200 dark:border-violet-800 px-4 py-3 grid grid-cols-2 gap-2 shadow-xl"
              >
                {PAGES.map((p, idx) => {
                  const isActive = idx === currentPage;
                  return (
                    <a
                      key={p.id}
                      href={p.hash}
                      onClick={(e) => {
                        e.preventDefault();
                        navigateTo(idx);
                      }}
                      className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-bold flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-gradient-to-r from-pink-500 to-violet-600 text-white'
                          : 'bg-pink-50 dark:bg-violet-950/60 text-slate-800 dark:text-slate-100'
                      }`}
                    >
                      {p.navLabel}
                    </a>
                  );
                })}
              </nav>
            )}
          </header>

          {/* Active Website Page Content */}
          <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={PAGES[currentPage].id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="w-full"
              >
                {currentPage === 0 && (
                  <HeroSection
                    name={CONFIG.NAME}
                    onStartJourney={() => navigateTo(1)}
                    onNavigatePage={navigateTo}
                  />
                )}
                {currentPage === 1 && (
                  <CandleBlowSection onNextSurprise={() => navigateTo(2)} />
                )}
                {currentPage === 2 && (
                  <BalloonPopSection onNextSurprise={() => navigateTo(3)} />
                )}
                {currentPage === 3 && (
                  <SurpriseGiftSection onNextSurprise={() => navigateTo(4)} />
                )}
                {currentPage === 4 && (
                  <FortuneTellerSection onNextSurprise={() => navigateTo(5)} />
                )}
                {currentPage === 5 && (
                  <MemoriesGallerySection onNextSurprise={() => navigateTo(6)} />
                )}
                {currentPage === 6 && (
                  <SpecialWishSection
                    name={CONFIG.NAME}
                    wishMessage={CONFIG.WISH_MESSAGE}
                    onRestartJourney={() => navigateTo(0)}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Subpage Pagination Bar (shown on event pages 1-6) */}
            {currentPage > 0 && (
              <div className="mt-8 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => navigateTo(currentPage - 1)}
                  className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-white/95 dark:bg-[#1C0F30] border-2 border-pink-200 dark:border-violet-700 text-slate-800 dark:text-slate-100 font-bold text-sm inline-flex items-center gap-2 cursor-pointer hover:bg-white dark:hover:bg-[#261642] transition-all shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                  <span>{PAGES[currentPage - 1].navLabel}</span>
                </button>

                {currentPage < PAGES.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => navigateTo(currentPage + 1)}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer hover:brightness-110 transition-all shadow-md"
                  >
                    <span>Next: {PAGES[currentPage + 1].navLabel}</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => navigateTo(0)}
                    className="min-h-[48px] px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-pink-500 text-slate-950 font-extrabold text-sm inline-flex items-center gap-2 cursor-pointer hover:brightness-105 transition-all shadow-md"
                  >
                    <span>Back to Home</span>
                  </button>
                )}
              </div>
            )}
          </main>

          {/* Website Footer */}
          <footer className="border-t border-pink-200/80 dark:border-violet-900/70 bg-white/60 dark:bg-[#130722]/70 backdrop-blur-sm">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="font-display text-base font-extrabold text-pink-600 dark:text-amber-300">
                  Happy Birthday {CONFIG.NAME} · 16 November
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Multi-page Birthday Surprise Website
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-bold">
                {PAGES.map((p, idx) => (
                  <a
                    key={p.id}
                    href={p.hash}
                    onClick={(e) => {
                      e.preventDefault();
                      navigateTo(idx);
                    }}
                    className="text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-amber-300 transition-colors"
                  >
                    {p.navLabel}
                  </a>
                ))}
                <button
                  type="button"
                  onClick={handleLock}
                  className="inline-flex items-center gap-1 text-pink-600 dark:text-pink-400 hover:underline cursor-pointer ml-2"
                >
                  <Lock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Lock Gate</span>
                </button>
              </div>
            </div>
          </footer>
        </div>
      )}
    </>
  );
}
