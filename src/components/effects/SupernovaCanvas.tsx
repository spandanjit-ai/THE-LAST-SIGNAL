import React, { useEffect, useRef } from 'react';

interface SupernovaCanvasProps {
  active?: boolean;
  onComplete?: () => void;
  className?: string;
  triggerKey?: number | string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  maxLife: number;
  life: number;
  drag: number;
  trail: Array<{ x: number; y: number; alpha: number }>;
}

interface Shockwave {
  radius: number;
  maxRadius: number;
  speed: number;
  lineWidth: number;
  alpha: number;
  color: string;
}

export const SupernovaCanvas: React.FC<SupernovaCanvasProps> = ({
  active = true,
  onComplete,
  className = '',
  triggerKey = 0,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let startTime: number | null = null;

    // High DPI sizing
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);


    const cx = rect.width / 2;
    const cy = rect.height / 2;

    // Palette of the supernova: Blinding white, signal cyan, deep violet, anomaly amber
    const colors = [
      '#FFFFFF',
      '#22D3EE',
      '#38BDF8',
      '#8B7CFF',
      '#A78BFA',
      '#FFB454',
    ];

    // Build particle burst
    const particles: Particle[] = [];
    const particleCount = 220;

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.pow(Math.random(), 1.5) * 14 + 1.5;
      const maxLife = Math.random() * 90 + 70;

      particles.push({
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3.5 + 1.2,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        maxLife,
        life: 0,
        drag: 0.965 + Math.random() * 0.02,
        trail: [],
      });
    }

    // Expanding shockwave rings
    const shockwaves: Shockwave[] = [
      {
        radius: 4,
        maxRadius: Math.max(cx, cy) * 1.5,
        speed: 12,
        lineWidth: 4,
        alpha: 1,
        color: 'rgba(34, 211, 238,',
      },
      {
        radius: 2,
        maxRadius: Math.max(cx, cy) * 1.2,
        speed: 8,
        lineWidth: 6,
        alpha: 0.9,
        color: 'rgba(139, 124, 255,',
      },
      {
        radius: 1,
        maxRadius: Math.max(cx, cy) * 0.9,
        speed: 16,
        lineWidth: 2,
        alpha: 0.8,
        color: 'rgba(255, 255, 255,',
      },
    ];

    const render = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;

      ctx.clearRect(0, 0, rect.width, rect.height);

      // Phase 1: Core Flash (First 600ms)
      if (elapsed < 800) {
        const flashAlpha = Math.max(0, 1 - elapsed / 800);
        const flashRadius = Math.min(220, elapsed * 0.45);

        const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, flashRadius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${flashAlpha * 0.95})`);
        gradient.addColorStop(0.25, `rgba(34, 211, 238, ${flashAlpha * 0.75})`);
        gradient.addColorStop(0.6, `rgba(139, 124, 255, ${flashAlpha * 0.4})`);
        gradient.addColorStop(1, 'rgba(7, 10, 18, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(cx, cy, flashRadius, 0, Math.PI * 2);
        ctx.fill();

        // 4 Diffraction Spikes (James Webb / Hubble starburst)
        ctx.save();
        ctx.strokeStyle = `rgba(255, 255, 255, ${flashAlpha * 0.85})`;
        ctx.lineWidth = 1.5;

        // Horizontal ray
        ctx.beginPath();
        ctx.moveTo(cx - flashRadius * 1.8, cy);
        ctx.lineTo(cx + flashRadius * 1.8, cy);
        ctx.stroke();

        // Vertical ray
        ctx.beginPath();
        ctx.moveTo(cx, cy - flashRadius * 1.8);
        ctx.lineTo(cx, cy + flashRadius * 1.8);
        ctx.stroke();

        // 45 deg diagonals
        ctx.strokeStyle = `rgba(34, 211, 238, ${flashAlpha * 0.5})`;
        ctx.lineWidth = 0.75;
        ctx.beginPath();
        ctx.moveTo(cx - flashRadius * 1.2, cy - flashRadius * 1.2);
        ctx.lineTo(cx + flashRadius * 1.2, cy + flashRadius * 1.2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + flashRadius * 1.2, cy - flashRadius * 1.2);
        ctx.lineTo(cx - flashRadius * 1.2, cy + flashRadius * 1.2);
        ctx.stroke();
        ctx.restore();
      }

      // Phase 2: Shockwaves
      shockwaves.forEach((sw) => {
        if (sw.radius < sw.maxRadius) {
          sw.radius += sw.speed;
          sw.alpha = Math.max(0, 1 - sw.radius / sw.maxRadius);

          ctx.save();
          ctx.strokeStyle = `${sw.color} ${sw.alpha})`;
          ctx.lineWidth = sw.lineWidth * (1 - sw.radius / sw.maxRadius);
          ctx.shadowColor = '#22D3EE';
          ctx.shadowBlur = 15;
          ctx.beginPath();
          ctx.arc(cx, cy, sw.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Phase 3: Particle Physics Simulation & Trails
      let aliveCount = 0;
      particles.forEach((p) => {
        p.life++;
        if (p.life < p.maxLife) {
          aliveCount++;

          // Motion with drag
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= p.drag;
          p.vy *= p.drag;

          // Push trail history
          p.trail.unshift({ x: p.x, y: p.y, alpha: p.alpha });
          if (p.trail.length > 5) p.trail.pop();

          p.alpha = Math.max(0, 1 - p.life / p.maxLife);

          // Draw trail
          ctx.save();
          for (let t = 0; t < p.trail.length; t++) {
            const tr = p.trail[t];
            ctx.fillStyle = p.color;
            ctx.globalAlpha = tr.alpha * (1 - t / p.trail.length) * 0.5;
            ctx.beginPath();
            ctx.arc(tr.x, tr.y, p.size * (1 - t / p.trail.length), 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw particle head with glow
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 10;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }
      });

      // Keep rendering until particles settle or timeout
      if (aliveCount > 0 || elapsed < 3500) {
        animId = requestAnimationFrame(render);
      } else {
        if (onComplete) onComplete();
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [active, onComplete, triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none absolute inset-0 z-40 w-full h-full ${className}`}
    />
  );
};
