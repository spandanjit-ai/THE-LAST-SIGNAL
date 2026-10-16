import React, { useEffect, useRef } from 'react';

export const BackgroundFX: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Very sparse, quiet ambient digital dust (only 25 subtle nodes)
    const DUST_COUNT = 24;
    const particles = Array.from({ length: DUST_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.15,
      vy: -Math.random() * 0.15 - 0.05,
      alpha: Math.random() * 0.25 + 0.05,
      size: Math.random() * 1.2 + 0.6,
    }));

    let scanlineY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Subtle slow scan sweep
      scanlineY = (scanlineY + 0.35) % height;
      const scanGrad = ctx.createLinearGradient(0, scanlineY - 30, 0, scanlineY + 30);
      scanGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
      scanGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.018)');
      scanGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
      ctx.fillStyle = scanGrad;
      ctx.fillRect(0, scanlineY - 30, width, 60);

      // Render sparse quiet dust
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = '#22D3EE';
        ctx.globalAlpha = p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Fine hairline grid */}
      <div className="absolute inset-0 bg-hairline-grid opacity-75" />
      {/* Noir Vignette */}
      <div className="absolute inset-0 bg-noir-vignette opacity-90" />
      {/* Subtle Scanlines */}
      <div className="absolute inset-0 scanlines-subtle opacity-30" />
    </div>
  );
};
