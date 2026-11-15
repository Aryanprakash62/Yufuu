import React, { useEffect, useRef } from 'react';
import { createParticles, subscribeConfetti } from '../utils/confetti';

export const ConfettiCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles = [] as ReturnType<typeof createParticles>;
    let rafId: number | null = null;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      particles = particles.filter((p) => {
        p.vx *= p.drag;
        p.vy = p.vy * p.drag + p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.rotation += p.rotationSpeed;
        p.opacity -= 0.0085;

        if (p.opacity <= 0 || p.y > window.innerHeight + 40) {
          return false;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.65);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.42, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return true;
      });

      if (particles.length > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    };

    const unsubscribe = subscribeConfetti((size, ox, oy) => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const spawned = createParticles(
        window.innerWidth,
        window.innerHeight,
        reducedMotion ? 'small' : size,
        ox,
        oy
      );
      particles.push(...spawned);
      if (rafId === null) {
        rafId = window.requestAnimationFrame(tick);
      }
    });

    return () => {
      unsubscribe();
      window.removeEventListener('resize', resize);
      if (rafId !== null) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};
