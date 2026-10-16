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
  const isUnlocked = state.unlockStatus === 'UNLOCKED';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 800);
      const height = (canvas.height = compact ? 70 : 120);

      ctx.clearRect(0, 0, width, height);

      const centerY = height / 2;

      // Subtle horizontal hairline reference grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Slow breathing waveform amplitude modulation
      const breath = 1 + Math.sin(t * 0.8) * 0.15;

      ctx.lineWidth = isUnlocked || phase === 'STABLE' ? 2.5 : 1.5;

      if (isUnlocked) {
        // Stabilized, synchronized harmonic carrier wave with emerald/cyan glow
        ctx.strokeStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.02 + t * 2) * (height * 0.28 * breath);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (phase === 'SEARCHING') {
        // SEARCHING: Erratic radio interference & searching spikes in amber
        ctx.strokeStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const noise = (Math.random() - 0.5) * (height * 0.32);
          const carrier = Math.sin(x * 0.04 + t * 3.5) * (height * 0.14);
          const y = centerY + carrier + noise;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Slow scanning sweep line
        const sweepX = (t * 120) % width;
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, height);
        ctx.stroke();
      } else if (phase === 'ALIGNING') {
        // ALIGNING: Dual harmonics converging into lock in violet
        ctx.strokeStyle = '#8b5cf6';
        ctx.shadowColor = '#8b5cf6';
        ctx.shadowBlur = 10;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const wave1 = Math.sin(x * 0.016 + t * 1.8) * (height * 0.22);
          const wave2 = Math.cos(x * 0.042 - t * 2.2) * (height * 0.1);
          const y = centerY + (wave1 + wave2) * breath;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else {
        // STABLE: Pure, coherent resonant sinusoidal wave in electric cyan
        ctx.strokeStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.022 + t * 2.4) * (height * 0.3 * breath);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      t += 0.024;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, compact, isUnlocked]);

  const phaseConfig = {
    SEARCHING: {
      badge: 'bg-amber/15 text-amber border-amber/40 text-glow-amber',
      bar: 'bg-amber',
      icon: <Radio className="w-3.5 h-3.5 text-amber animate-pulse" />,
      desc: 'Searching carrier harmonics. Submissions locked.',
    },
    ALIGNING: {
      badge: 'bg-violet/15 text-violet border-violet/40 text-glow-violet',
      bar: 'bg-violet',
      icon: <Zap className="w-3.5 h-3.5 text-violet animate-pulse" />,
      desc: 'Phase lock acquiring. Converging frequency...',
    },
    STABLE: {
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 text-glow-emerald',
      bar: 'bg-emerald-400',
      icon: <Lock className="w-3.5 h-3.5 text-emerald-400" />,
      desc: 'RESONANCE STABILIZED // SUBMISSIONS AUTHORIZED',
    },
  }[phase];

  return (
    <div className="border border-slate-800 bg-space-900/90 rounded-xl overflow-hidden backdrop-blur-md shadow-lg font-mono">
      {/* Telemetry Header */}
      <div className="px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            CARRIER TELEMETRY:
          </span>
          <span
            className={`px-2.5 py-0.5 rounded border text-xs font-black tracking-wider uppercase flex items-center gap-1.5 ${phaseConfig.badge}`}
          >
            {phaseConfig.icon}
            <span>{isUnlocked ? 'HARMONIC STABLE' : phase}</span>
          </span>
          <span className="text-slate-200 hidden sm:inline text-xs font-medium">
            {isUnlocked ? 'DECRYPTED ARCHIVE COMMITTED' : phaseConfig.desc}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-300 text-xs font-bold">PHASE WINDOW:</span>
          <span
            className={`font-mono text-xs px-2.5 py-0.5 rounded border font-black ${
              phase === 'STABLE'
                ? 'text-emerald-300 bg-space-950 border-emerald-500/50 text-glow-emerald'
                : 'text-cyan-300 bg-space-950 border-cyan/40 text-glow-cyan'
            }`}
          >
            {secondsRemaining}s
          </span>
        </div>
      </div>

      {/* Hero Waveform Canvas */}
      <div className="relative bg-space-950/80">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute bottom-1.5 right-3 text-[11px] font-mono text-cyan-400 font-bold tracking-wider">
          1420.405 MHz // HYDROGEN LINE OSCILLOSCOPE
        </div>
      </div>

      {/* Progress timeline strip */}
      <div className="h-1 w-full bg-space-950 overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-linear ${phaseConfig.bar}`}
          style={{ width: `${state.phaseProgress}%` }}
        />
      </div>
    </div>
  );
};
