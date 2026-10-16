import React, { useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  RotateCcw, 
  X 
} from 'lucide-react';
import { MissionState } from '../engine/missionTypes';
import { soundEffects } from '../utils/audioFx';

interface VaultModalProps {
  state: MissionState;
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  state,
  isOpen,
  onClose,
  onReset,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Play particle beam effect on canvas when unlocked
  useEffect(() => {
    if (!isOpen) return;

    soundEffects.playVaultUnlock();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];

    const colors = ['#00f0ff', '#8b5cf6', '#10b981', '#ffffff'];

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 5,
        vy: (Math.random() - 0.5) * 5,
        size: Math.random() * 3 + 1,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.008;

        if (p.alpha <= 0) {
          p.x = canvas.width / 2;
          p.y = canvas.height / 2;
          p.alpha = 1;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const durationSec = state.unlockedAt 
    ? Math.max(1, Math.round((state.unlockedAt - state.startedAt) / 1000))
    : 0;

  return (
    <div className="fixed inset-0 z-50 bg-space-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-space-900 border-2 border-emerald-500/60 rounded-2xl max-w-2xl w-full p-6 sm:p-8 relative shadow-2xl shadow-emerald-500/20 text-center overflow-hidden">
        {/* Canvas for particle burst */}
        <canvas
          ref={canvasRef}
          width={600}
          height={300}
          className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
        />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-space-950/80 border border-slate-700 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Concentric Rotating Rings Vault Graphic */}
        <div className="relative w-32 h-32 mx-auto mb-6 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-emerald-400/40 animate-[spin_12s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border border-cyan/40 animate-[spin_8s_linear_infinite_reverse]" />
          <div className="absolute inset-4 rounded-full border-2 border-emerald-500/60 animate-pulse" />
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Header Title */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5" /> SECURE VAULT DECRYPTED
        </div>

        <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-100 tracking-wider mb-2">
          TRANSMISSION RECOVERED
        </h2>

        <p className="text-slate-300 text-xs sm:text-sm max-w-lg mx-auto mb-6 leading-relaxed">
          The fragmented signal across all three orbital terminals has successfully reached resonance. The final classified message has been decrypted:
        </p>

        {/* Unlocked Message Showcase Card */}
        <div className="p-6 rounded-xl bg-space-950 border border-emerald-500/40 shadow-inner mb-6 space-y-3">
          <div className="text-[11px] font-mono uppercase tracking-widest text-emerald-400">
            FINAL DECODED MESSAGE:
          </div>
          <div className="text-2xl sm:text-3xl font-display font-black tracking-widest text-emerald-300 select-all">
            "{state.finalAnswer || 'THE LAST SIGNAL'}"
          </div>
          <div className="text-xs text-slate-400 italic">
            "Transmission origin: Deep Sector Omega. Humanity is not alone."
          </div>
        </div>

        {/* Mission Telemetry Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-left mb-6 font-mono text-xs">
          <div className="p-2.5 rounded bg-space-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">SESSION ID</span>
            <span className="text-slate-200 font-bold truncate block">{state.missionId}</span>
          </div>
          <div className="p-2.5 rounded bg-space-950 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">SOLVE DURATION</span>
            <span className="text-cyan font-bold block">{durationSec}s</span>
          </div>
          <div className="p-2.5 rounded bg-space-950 border border-slate-800 col-span-2 sm:col-span-1">
            <span className="text-[10px] text-slate-500 block uppercase">STATE REVISION</span>
            <span className="text-emerald-400 font-bold block">REV-{state.revision} (SYNCED)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded font-bold text-xs bg-space-800 border border-slate-700 text-slate-200 hover:bg-space-700 transition-colors"
          >
            RETURN TO TERMINAL
          </button>
          <button
            onClick={() => {
              onClose();
              onReset();
            }}
            className="w-full sm:w-auto px-6 py-2.5 rounded font-bold text-xs bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> RESET & PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};
