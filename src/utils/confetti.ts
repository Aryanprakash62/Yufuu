export type ConfettiSize = 'big' | 'small';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle';
  gravity: number;
  drag: number;
}

const PALETTE = [
  '#EC4899', // pink
  '#F472B6', // light pink
  '#F59E0B', // gold
  '#FBBF24', // bright gold
  '#8B5CF6', // violet
  '#A78BFA', // soft violet
  '#10B981', // mint
  '#34D399', // bright mint
];

type Listener = (size: ConfettiSize, originX?: number, originY?: number) => void;
const listeners = new Set<Listener>();

export function triggerConfetti(
  size: ConfettiSize = 'big',
  originX?: number,
  originY?: number
) {
  listeners.forEach((fn) => fn(size, originX, originY));
}

export function subscribeConfetti(fn: Listener) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function createParticles(
  width: number,
  height: number,
  size: ConfettiSize,
  originX?: number,
  originY?: number
): Particle[] {
  const count = size === 'big' ? 110 : 38;
  const cx = originX !== undefined ? originX : width * 0.5;
  const cy = originY !== undefined ? originY : size === 'big' ? height * 0.35 : height * 0.5;

  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle =
      size === 'big'
        ? -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.45
        : Math.random() * Math.PI * 2;
    const speed =
      size === 'big'
        ? 6 + Math.random() * 11
        : 3.5 + Math.random() * 6.5;

    particles.push({
      x: cx + (Math.random() - 0.5) * 30,
      y: cy + (Math.random() - 0.5) * 20,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - (size === 'big' ? 2.5 : 1.5),
      size: size === 'big' ? 6 + Math.random() * 6 : 5 + Math.random() * 4,
      color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      opacity: 1,
      shape: Math.random() > 0.35 ? 'rect' : 'circle',
      gravity: size === 'big' ? 0.24 : 0.28,
      drag: 0.985,
    });
  }
  return particles;
}
