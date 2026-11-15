import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Camera,
  Film,
  Maximize2,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { triggerConfetti } from '../utils/confetti';
import { soundFX } from '../utils/sounds';

interface MemoriesGallerySectionProps {
  onNextSurprise?: () => void;
}

interface PhotoConfig {
  src: string;
  caption: string;
  defaultRotation: number;
  frameGradient: string;
}

interface VideoConfig {
  src: string;
  title: string;
  defaultRotation: number;
}

const PHOTOS: PhotoConfig[] = [
  {
    src: '/assets/aistudio/IMG-20261114-WA0002_9b426355.jpg',
    caption: 'Yaad #1 — Gorgeous Smile',
    defaultRotation: 0,
    frameGradient: 'from-pink-500 via-rose-400 to-amber-400',
  },
  {
    src: '/assets/aistudio/IMG-20261114-WA0003_524eceec.jpg',
    caption: 'Yaad #2 — Cute Vibe',
    defaultRotation: -90,
    frameGradient: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
  {
    src: '/assets/aistudio/IMG-20261114-WA0004_65bcaf4e.jpg',
    caption: 'Yaad #3 — Golden Glow',
    defaultRotation: -90,
    frameGradient: 'from-amber-400 via-orange-400 to-pink-500',
  },
  {
    src: '/assets/aistudio/IMG-20261114-WA0005_a206cca1.jpg',
    caption: 'Yaad #4 — Pure Grace',
    defaultRotation: 0,
    frameGradient: 'from-emerald-400 via-teal-400 to-violet-500',
  },
  {
    src: '/assets/aistudio/IMG-20261114-WA0006_584dbcff.jpg',
    caption: 'Yaad #5 — Sunshine Mood',
    defaultRotation: 0,
    frameGradient: 'from-pink-500 via-violet-500 to-amber-400',
  },
];

const VIDEOS: VideoConfig[] = [
  {
    src: '/assets/aistudio/VID-20261115-WA0001_7297ca64.mp4',
    title: 'Birthday Reel #1',
    defaultRotation: 0,
  },
  {
    src: '/assets/aistudio/VID-20261115-WA0000_25f54b71.mp4',
    title: 'Birthday Reel #2',
    defaultRotation: -90,
  },
];

interface UprightPhotoProps {
  src: string;
  alt: string;
  rotationDeg: number;
  blurred: boolean;
}

const UprightPhoto: React.FC<UprightPhotoProps> = ({
  src,
  alt,
  rotationDeg,
  blurred,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const norm = ((rotationDeg % 360) + 360) % 360;
  const needsCanvas = norm !== 0;

  useEffect(() => {
    if (!needsCanvas) return;
    let cancelled = false;
    const img = new Image();
    img.src = src;

    img.onload = () => {
      if (cancelled) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const w = img.naturalWidth || 800;
      const h = img.naturalHeight || 600;

      if (norm === 90) {
        canvas.width = h;
        canvas.height = w;
        ctx.save();
        ctx.translate(h, 0);
        ctx.rotate(Math.PI / 2);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      } else if (norm === 180) {
        canvas.width = w;
        canvas.height = h;
        ctx.save();
        ctx.translate(w, h);
        ctx.rotate(Math.PI);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      } else {
        canvas.width = h;
        canvas.height = w;
        ctx.save();
        ctx.translate(0, w);
        ctx.rotate(-Math.PI / 2);
        ctx.drawImage(img, 0, 0);
        ctx.restore();
      }

      setLoaded(true);
      setFailed(false);
    };

    img.onerror = () => {
      if (!cancelled) setFailed(true);
    };

    return () => {
      cancelled = true;
    };
  }, [src, norm, needsCanvas]);

  if (failed) {
    return (
      <div
        className={`w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-pink-200 via-violet-200 to-amber-200 dark:from-pink-950/70 dark:via-violet-950/70 dark:to-amber-950/60 transition-all duration-500 ${
          blurred ? 'blur-lg scale-105' : 'blur-0 scale-100'
        }`}
      >
        <Camera className="w-8 h-8 text-pink-600 dark:text-pink-300 mb-2" aria-hidden="true" />
        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 break-all">
          {src}
        </span>
      </div>
    );
  }

  if (needsCanvas) {
    return (
      <canvas
        ref={canvasRef}
        aria-label={alt}
        className={`w-full h-full object-cover transition-all duration-500 ${
          blurred ? 'blur-xl scale-110' : 'blur-0 scale-100'
        } ${loaded ? 'opacity-100' : 'opacity-60'}`}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`w-full h-full object-cover transition-all duration-500 ${
        blurred ? 'blur-xl scale-110' : 'blur-0 scale-100'
      }`}
    />
  );
};

interface UprightVideoPlayerProps {
  src: string;
  title: string;
  defaultRotation: number;
}

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

const UprightVideoPlayer: React.FC<UprightVideoPlayerProps> = ({
  src,
  title,
  defaultRotation,
}) => {
  const frameRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [rotationDeg, setRotationDeg] = useState(defaultRotation);
  const [videoDims, setVideoDims] = useState({ w: 9, h: 16 });
  const [frameSize, setFrameSize] = useState({ width: 320, height: 420 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [failed, setFailed] = useState(false);

  const norm = ((rotationDeg % 360) + 360) % 360;
  const isSideways = norm === 90 || norm === 270;
  const aspectRatio = isSideways
    ? videoDims.h / videoDims.w
    : videoDims.w / videoDims.h;

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const updateSize = () => {
      setFrameSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });
    };
    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [aspectRatio]);

  const togglePlay = async () => {
    const v = videoRef.current;
    if (!v || failed) return;
    soundFX.playClick();
    if (v.paused) {
      try {
        await v.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      v.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setIsMuted(v.muted);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    const next = Number(e.target.value);
    v.currentTime = next;
    setCurrentTime(next);
  };

  return (
    <div className="rounded-3xl p-[2px] bg-gradient-to-br from-pink-500 via-violet-500 to-amber-400 shadow-lg">
      <div className="rounded-[22px] bg-white/95 dark:bg-[#170C2B] p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2 px-1">
          <div className="flex items-center gap-2 min-w-0">
            <Film className="w-4 h-4 text-pink-600 dark:text-pink-400 shrink-0" aria-hidden="true" />
            <span className="font-display text-lg font-extrabold text-slate-900 dark:text-white truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-300 tabular-nums">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            <button
              type="button"
              onClick={() => {
                soundFX.playClick();
                setRotationDeg((d) => d - 90);
              }}
              aria-label={`${title} rotate 90 degrees`}
              title="Rotate 90°"
              className="min-w-[36px] min-h-[36px] rounded-xl bg-pink-100 dark:bg-violet-900/60 text-pink-700 dark:text-amber-300 flex items-center justify-center cursor-pointer hover:brightness-95 transition-all"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div
          ref={frameRef}
          style={{ aspectRatio: String(aspectRatio) }}
          className="relative w-full max-h-[460px] mx-auto rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center shadow-inner"
        >
          {failed ? (
            <div className="p-6 text-center text-slate-300">
              <Film className="w-9 h-9 mx-auto mb-2 text-pink-400" aria-hidden="true" />
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-xs text-slate-400 mt-1 break-all">{src}</p>
            </div>
          ) : (
            <>
              <video
                ref={videoRef}
                src={src}
                playsInline
                preload="metadata"
                onClick={togglePlay}
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  setDuration(v.duration || 0);
                  if (v.videoWidth && v.videoHeight) {
                    setVideoDims({ w: v.videoWidth, h: v.videoHeight });
                  }
                }}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onEnded={() => setIsPlaying(false)}
                onError={() => setFailed(true)}
                style={
                  isSideways
                    ? {
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        width: `${frameSize.height}px`,
                        height: `${frameSize.width}px`,
                        transform: `translate(-50%, -50%) rotate(${rotationDeg}deg)`,
                        objectFit: 'cover',
                      }
                    : {
                        width: '100%',
                        height: '100%',
                        transform: `rotate(${rotationDeg}deg)`,
                        objectFit: 'cover',
                      }
                }
                className="cursor-pointer"
              />

              {!isPlaying && (
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={`${title} chalao`}
                  className="absolute inset-0 flex items-center justify-center bg-black/25 hover:bg-black/15 transition-colors cursor-pointer"
                >
                  <span className="w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-amber-400 text-white shadow-xl flex items-center justify-center active:scale-95 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" aria-hidden="true" />
                  </span>
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={togglePlay}
            disabled={failed}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-gradient-to-r from-pink-500 to-violet-600 hover:brightness-110 disabled:opacity-40 text-white flex items-center justify-center cursor-pointer transition-all shrink-0 shadow-sm"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-0.5" aria-hidden="true" />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            disabled={failed || duration === 0}
            aria-label={`${title} seek bar`}
            className="flex-1 h-2 accent-pink-500 cursor-pointer"
          />

          <button
            type="button"
            onClick={toggleMute}
            disabled={failed}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="min-w-[44px] min-h-[44px] rounded-xl bg-violet-100 dark:bg-violet-900/60 hover:bg-violet-200 dark:hover:bg-violet-800 disabled:opacity-40 text-violet-800 dark:text-violet-200 flex items-center justify-center cursor-pointer transition-colors shrink-0"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Volume2 className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export const MemoriesGallerySection: React.FC<MemoriesGallerySectionProps> = ({
  onNextSurprise,
}) => {
  const [revealed, setRevealed] = useState<boolean[]>(() => PHOTOS.map(() => false));
  const [rotations, setRotations] = useState<number[]>(() =>
    PHOTOS.map((p) => p.defaultRotation)
  );
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const celebratedAllRef = useRef(false);

  const openCount = revealed.filter(Boolean).length;
  const allOpen = openCount === PHOTOS.length;

  useEffect(() => {
    if (allOpen && !celebratedAllRef.current) {
      celebratedAllRef.current = true;
      soundFX.playCelebrateWin();
      triggerConfetti('big');
    }
  }, [allOpen]);

  const handlePhotoTap = (idx: number, e: React.MouseEvent<HTMLButtonElement>) => {
    if (!revealed[idx]) {
      const rect = e.currentTarget.getBoundingClientRect();
      soundFX.playGiftOpen();
      triggerConfetti('small', rect.left + rect.width / 2, rect.top + rect.height / 2);
      setRevealed((prev) => prev.map((v, i) => (i === idx ? true : v)));
    } else {
      soundFX.playClick();
      setLightboxIdx(idx);
    }
  };

  const rotatePhoto = (idx: number, e: React.MouseEvent) => {
    e.stopPropagation();
    soundFX.playClick();
    setRotations((prev) => prev.map((deg, i) => (i === idx ? deg - 90 : deg)));
  };

  return (
    <section
      id="memories"
      className="rounded-[30px] p-[2px] bg-gradient-to-br from-pink-500 via-amber-400 to-emerald-400 shadow-2xl shadow-pink-500/20"
    >
      <div className="rounded-[28px] bg-gradient-to-br from-pink-100/90 via-violet-50 to-emerald-50 dark:from-[#220E2D] dark:via-[#1B0E2E] dark:to-[#0F2425] p-6 sm:p-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold text-pink-600 dark:text-amber-300 tracking-wide uppercase">
              Surprise 5 of 6 · Yaadon Ka Khazana
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-0.5">
              Memories Gallery 📸
            </h2>
            <p className="text-sm sm:text-base text-slate-700 dark:text-slate-200 mt-1">
              Har gift-wrapped photo par tap karke apni pyari tasveerein aur neeche videos dekho!
            </p>
          </div>

          <div className="rounded-2xl bg-gradient-to-r from-pink-500 to-violet-600 text-white px-4 py-2 font-display text-lg font-extrabold tabular-nums shadow-md">
            {openCount} / {PHOTOS.length} Open
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {PHOTOS.map((photo, idx) => {
            const isOpen = revealed[idx];
            return (
              <div
                key={photo.src}
                className={`relative rounded-3xl p-[3px] bg-gradient-to-br ${photo.frameGradient} shadow-lg`}
              >
                <div className="relative aspect-[3/4] rounded-[21px] overflow-hidden bg-slate-900">
                  <button
                    type="button"
                    onClick={(e) => handlePhotoTap(idx, e)}
                    aria-label={isOpen ? `${photo.caption} bada dekho` : `Photo ${idx + 1} kholo`}
                    className="w-full h-full block cursor-pointer focus-visible:outline-2 focus-visible:outline-pink-500 text-left"
                  >
                    <UprightPhoto
                      src={photo.src}
                      alt={photo.caption}
                      rotationDeg={rotations[idx]}
                      blurred={!isOpen}
                    />

                    {!isOpen ? (
                      <div className="absolute inset-0 bg-gradient-to-br from-pink-600/50 via-violet-700/45 to-amber-500/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-4 text-center">
                        <span
                          className="text-6xl mb-3 animate-float-gentle drop-shadow-lg"
                          role="img"
                          aria-label="Gift"
                        >
                          🎁
                        </span>
                        <span className="font-display text-xl font-extrabold text-white drop-shadow">
                          Tap to Unblur!
                        </span>
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex items-end justify-between gap-2">
                        <span className="text-sm font-bold text-white">
                          {photo.caption}
                        </span>
                        <Maximize2 className="w-4 h-4 text-amber-300 shrink-0" aria-hidden="true" />
                      </div>
                    )}
                  </button>

                  {isOpen && (
                    <button
                      type="button"
                      onClick={(e) => rotatePhoto(idx, e)}
                      aria-label={`${photo.caption} rotate karo`}
                      title="Rotate 90°"
                      className="absolute top-3 right-3 z-10 min-w-[40px] min-h-[40px] rounded-xl bg-black/55 hover:bg-black/75 text-white backdrop-blur-sm flex items-center justify-center cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" aria-hidden="true" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {allOpen && (
          <div className="mt-6 rounded-2xl bg-gradient-to-r from-pink-500 via-violet-600 to-amber-500 p-[2px] shadow-lg animate-bounce-pop">
            <div className="rounded-[14px] bg-white dark:bg-[#170C28] p-5 text-center">
              <p className="font-display text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 dark:from-pink-400 dark:to-amber-300">
                Saari 5 yaadein khul gayi! ✨
              </p>
              <p className="mt-1 text-sm sm:text-base text-slate-700 dark:text-slate-200 font-medium">
                Har ek photo mein itni pyaari vibe hai — dua hai aane wale saal mein isse bhi zyada awesome memories banein!
              </p>
              {onNextSurprise && (
                <button
                  type="button"
                  onClick={() => {
                    soundFX.playClick();
                    onNextSurprise();
                  }}
                  className="mt-4 min-h-[48px] px-7 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-600 to-amber-500 hover:brightness-110 text-white font-display text-lg font-extrabold inline-flex items-center gap-2 cursor-pointer shadow-md transition-all"
                >
                  <span>Aakhri Surprise: Special Khat</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-pink-300/60 dark:border-violet-800/60">
          <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mb-4">
            Special Birthday Videos 🎬
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 items-start">
            {VIDEOS.map((video) => (
              <UprightVideoPlayer
                key={video.src}
                src={video.src}
                title={video.title}
                defaultRotation={video.defaultRotation}
              />
            ))}
          </div>
        </div>
      </div>

      {lightboxIdx !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={PHOTOS[lightboxIdx].caption}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxIdx(null)}
        >
          <div
            className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border-2 border-pink-400/60"
            onClick={(e) => e.stopPropagation()}
          >
            <UprightPhoto
              src={PHOTOS[lightboxIdx].src}
              alt={PHOTOS[lightboxIdx].caption}
              rotationDeg={rotations[lightboxIdx]}
              blurred={false}
            />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={(e) => rotatePhoto(lightboxIdx, e)}
                aria-label="Rotate photo"
                className="min-w-[44px] min-h-[44px] rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setLightboxIdx(null)}
                aria-label="Band karo"
                className="min-w-[44px] min-h-[44px] rounded-full bg-black/65 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-4">
              <p className="text-sm font-bold text-white">
                {PHOTOS[lightboxIdx].caption}
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
