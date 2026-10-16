import React, { useEffect, useRef } from 'react';
import { useMission } from '../../hooks/useMission';
import { Radio, Lock, Zap } from 'lucide-react';

interface SignalHeroProps {
  compact?: boolean;
}

export const SignalHero: React.FC<SignalHeroProps> = ({ compact = false }) => {
  const { state } = useMission();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const phase = state.currentPhase;
  const secondsRemaining = state.phaseSecondsRemaining;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = compact ? 64 : 110);

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      // Draw horizontal reference lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Phase-specific wave rendering
      ctx.lineWidth = phase === 'STABLE' ? 2.5 : 1.5;

      if (phase === 'SEARCHING') {
        // Erratic multi-frequency noise & searching spikes
        ctx.strokeStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 6;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const noise = (Math.random() - 0.5) * (height * 0.35);
          const carrier = Math.sin(x * 0.05 + t * 4) * (height * 0.15);
          const y = centerY + carrier + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Moving scan cursor
        const scanX = (t * 180) % width;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.beginPath();
        ctx.moveTo(scanX, 0);
        ctx.lineTo(scanX, height);
        ctx.stroke();
      } else if (phase === 'ALIGNING') {
        // Harmonic convergence (dual waves locking phase)
        ctx.strokeStyle = '#a855f7';
        ctx.shadowColor = '#a855f7';
        ctx.shadowBlur = 8;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const mod = Math.sin(x * 0.015 + t * 2) * (height * 0.25);
          const sub = Math.cos(x * 0.045 - t * 3) * (height * 0.12);
          const y = centerY + mod + sub;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // STABLE: Pure coherent resonant sine wave
        ctx.strokeStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 14;
        ctx.beginPath();

        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.025 + t * 3) * (height * 0.32);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      t += 0.03;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, compact]);

  const phaseConfig = {
    SEARCHING: {
      color: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
      badge: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      bar: 'bg-amber-400',
      icon: <Radio className="w-3.5 h-3.5 text-amber-400" />,
      desc: 'Carrier frequency unstable. Searching harmonics...',
    },
    ALIGNING: {
      color: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
      badge: 'bg-violet-500/10 text-violet-300 border-violet-500/30',
      bar: 'bg-violet-400',
      icon: <Zap className="w-3.5 h-3.5 text-violet-400" />,
      desc: 'Phase lock acquiring. Converging resonance...',
    },
    STABLE: {
      color: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30',
      badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 animate-pulse',
      bar: 'bg-cyan-400',
      icon: <Lock className="w-3.5 h-3.5 text-cyan-300" />,
      desc: 'RESONANCE LOCKED // SUBMISSIONS AUTHORIZED',
    },
  }[phase];

  return (
    <div className="relative border border-slate-800 bg-space-950/80 rounded-lg overflow-hidden backdrop-blur-md">
      {/* Top telemetry bar */}
      <div className="px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-slate-500 text-[10px] uppercase tracking-wider">
            SIGNAL TELEMETRY:
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 ${phaseConfig.badge}`}
          >
            {phaseConfig.icon}
            <span>{phase}</span>
          </span>
          <span className="text-slate-400 hidden sm:inline text-[11px]">
            {phaseConfig.desc}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-slate-500 text-[11px]">PHASE WINDOW:</span>
          <span
            className={`font-bold font-mono text-xs px-2 py-0.5 rounded ${
              phase === 'STABLE'
                ? 'text-cyan-300 bg-cyan-950/60 border border-cyan-500/40'
                : 'text-slate-300 bg-space-900 border border-slate-800'
            }`}
          >
            {secondsRemaining}s
          </span>
        </div>
      </div>

      {/* Signal Oscilloscope */}
      <div className="relative">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute bottom-1 right-3 text-[10px] font-mono text-slate-600">
          1420.405 MHz // HARMONIC OSCILLOSCOPE
        </div>
      </div>

      {/* Progress timeline strip */}
      <div className="h-1 w-full bg-space-900 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-linear ${phaseConfig.bar}`}
          style={{ width: `${state.phaseProgress}%` }}
        />
      </div>
    </div>
  );
};
