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
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, centerY);
      ctx.lineTo(width, centerY);
      ctx.stroke();

      // Slow breathing waveform amplitude modulation
      const breath = 1 + Math.sin(t * 0.8) * 0.12;

      ctx.lineWidth = isUnlocked || phase === 'STABLE' ? 2 : 1.2;

      if (isUnlocked) {
        // Stabilized, synchronized harmonic carrier wave
        ctx.strokeStyle = '#22D3EE';
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.02 + t * 2) * (height * 0.28 * breath);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      } else if (phase === 'SEARCHING') {
        // SEARCHING: Erratic radio interference & searching spikes
        ctx.strokeStyle = '#FFB454';
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
        ctx.strokeStyle = 'rgba(255, 180, 84, 0.35)';
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, height);
        ctx.stroke();
      } else if (phase === 'ALIGNING') {
        // ALIGNING: Dual harmonics converging into lock
        ctx.strokeStyle = '#8B7CFF';
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
        // STABLE: Pure, coherent resonant sinusoidal wave
        ctx.strokeStyle = '#22D3EE';
        ctx.beginPath();
        for (let x = 0; x < width; x++) {
          const y = centerY + Math.sin(x * 0.022 + t * 2.4) * (height * 0.3 * breath);
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      t += 0.024;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [phase, compact, isUnlocked]);

  const phaseConfig = {
    SEARCHING: {
      badge: 'bg-[#FFB454]/10 text-signal-amber border-[#FFB454]/30',
      bar: 'bg-signal-amber',
      icon: <Radio className="w-3.5 h-3.5 text-signal-amber" />,
      desc: 'Searching carrier harmonics. Submissions locked.',
    },
    ALIGNING: {
      badge: 'bg-[#8B7CFF]/10 text-signal-violet border-[#8B7CFF]/30',
      bar: 'bg-signal-violet',
      icon: <Zap className="w-3.5 h-3.5 text-signal-violet" />,
      desc: 'Phase lock acquiring. Converging frequency...',
    },
    STABLE: {
      badge: 'bg-[#22D3EE]/15 text-signal-cyan border-[#22D3EE]/40',
      bar: 'bg-signal-cyan',
      icon: <Lock className="w-3.5 h-3.5 text-signal-cyan" />,
      desc: 'RESONANCE STABILIZED // SUBMISSIONS AUTHORIZED',
    },
  }[phase];

  return (
    <div className="border border-noir-border bg-noir-surface/90 rounded overflow-hidden backdrop-blur-md">
      {/* Telemetry Header */}
      <div className="px-4 py-2.5 border-b border-noir-border flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="text-signal-dim text-[10px] uppercase tracking-wider">
            CARRIER TELEMETRY:
          </span>
          <span
            className={`px-2 py-0.5 rounded border text-[11px] font-semibold tracking-wider uppercase flex items-center gap-1.5 ${phaseConfig.badge}`}
          >
            {phaseConfig.icon}
            <span>{isUnlocked ? 'HARMONIC STABLE' : phase}</span>
          </span>
          <span className="text-signal-muted hidden sm:inline text-[11px]">
            {isUnlocked ? 'DECRYPTED ARCHIVE COMMITTED' : phaseConfig.desc}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-signal-dim text-[11px]">PHASE WINDOW:</span>
          <span
            className={`font-mono text-xs px-2 py-0.5 rounded border ${
              phase === 'STABLE'
                ? 'text-signal-cyan bg-noir-base border-signal-cyan/40 font-bold'
                : 'text-signal-text bg-noir-base border-noir-border'
            }`}
          >
            {secondsRemaining}s
          </span>
        </div>
      </div>

      {/* Hero Waveform Canvas */}
      <div className="relative">
        <canvas ref={canvasRef} className="w-full block" />
        <div className="absolute bottom-1.5 right-3 text-[10px] font-mono text-signal-dim">
          1420.405 MHz // HYDROGEN LINE OSCILLOSCOPE
        </div>
      </div>

      {/* Progress timeline strip */}
      <div className="h-0.5 w-full bg-noir-base overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ease-linear ${phaseConfig.bar}`}
          style={{ width: `${state.phaseProgress}%` }}
        />
      </div>
    </div>
  );
};
