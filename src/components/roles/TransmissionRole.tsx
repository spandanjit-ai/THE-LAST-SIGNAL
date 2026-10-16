import React, { useState, useEffect, useRef } from 'react';
import { useMission } from '../../hooks/useMission';
import { CIPHERTEXT, caesarShift } from '../../engine/cipher';
import {
  Radio,
  Sliders,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const TransmissionRole: React.FC<{ onOpenVault?: () => void }> = ({ onOpenVault }) => {
  const { state, decodeCipher } = useMission();

  // Shift value for the interactive Caesar decoder tool (-13 to +13)
  const [shift, setShift] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const decodedPreview = caesarShift(CIPHERTEXT, shift);
  const isDecodedCorrectly = state.cipherDecoded || decodedPreview === 'THE LAST SIGNAL';

  // Interactive frequency waveform visualizer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
      const height = (canvas.height = 140);

      ctx.clearRect(0, 0, width, height);

      // Draw frequency grid lines
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw modulated signal wave
      ctx.beginPath();
      ctx.lineWidth = 2;

      // Color changes based on whether decoder is aligned
      if (isDecodedCorrectly) {
        ctx.strokeStyle = '#00f0ff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 4;
      }

      const centerY = height / 2;
      for (let x = 0; x < width; x++) {
        // Frequency changes with shift
        const freqMod = 0.02 + Math.abs(shift + 3) * 0.005;
        const noise = isDecodedCorrectly ? 0 : (Math.random() - 0.5) * 6;
        const y = centerY + Math.sin(x * freqMod + phase) * 35 + noise;

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      phase += isDecodedCorrectly ? 0.08 : 0.04;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [shift, isDecodedCorrectly]);

  const handleShiftChange = (newShift: number) => {
    setShift(newShift);
    SoundFX.playTick();
  };

  const handleCommitDecode = () => {
    const success = decodeCipher(decodedPreview);
    if (success) {
      setFeedback('TRANSMISSION_CONFIRMED: Plaintext frequency locked to carrier node.');
    } else {
      setFeedback('DECRYPTION_MISMATCH: Harmonic resonance rejected. Adjust shift offset.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Signal Coordinates */}
      <div className="bg-space-900/80 border border-cyan-500/30 rounded-lg p-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Radio className="w-36 h-36 text-cyan-400" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase">
                INCOMING CARRIER INTERCEPT
              </span>
              <h2 className="font-display text-xl lg:text-2xl font-bold tracking-wide text-white">
                ENCRYPTED TRANSMISSION STREAM
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>FREQ: 1420.405 MHz</span>
            <span className="text-slate-600">//</span>
            <span>CH: ALPHA-7</span>
          </div>
        </div>

        {/* Signal Canvas Spectrum */}
        <div className="relative rounded-md overflow-hidden bg-space-950 border border-cyan-500/20 mb-4">
          <canvas ref={canvasRef} className="w-full block" />
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-400/80 flex items-center gap-2">
            <span>OSCILLOSCOPE // {isDecodedCorrectly ? 'RESONANCE STABILIZED' : 'CARRIER INTERFERENCE DETECTED'}</span>
          </div>
        </div>

        {/* Intercepted Ciphertext Display */}
        <div className="p-4 rounded-md bg-space-950/90 border border-slate-800">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>RAW INTERCEPTED CIPHERTEXT:</span>
            <span className="text-cyan-400">ENCODING: CAESAR SHIFT</span>
          </div>
          <div className="text-2xl lg:text-3xl font-mono font-bold tracking-[0.25em] text-cyan-300 select-all">
            {CIPHERTEXT}
          </div>
        </div>
      </div>

      {/* Interactive Caesar Cipher Decoder Deck */}
      <div className="bg-space-900/80 border border-cyan-500/30 rounded-lg p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display text-lg font-bold text-white tracking-wide">
              CAESAR DECRYPTION CONSOLE
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-400">
            OFFSET: <span className="text-cyan-300 font-bold text-sm">{shift > 0 ? `+${shift}` : shift}</span>
          </div>
        </div>

        {/* Stepper and Slider Controls */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShiftChange(shift - 1)}
              className="px-3 py-2 rounded bg-space-950 border border-slate-700 hover:border-cyan-500/60 text-slate-200 font-mono text-sm active:scale-95 transition-all"
            >
              -1
            </button>

            <input
              type="range"
              min="-13"
              max="13"
              step="1"
              value={shift}
              onChange={(e) => handleShiftChange(parseInt(e.target.value, 10))}
              className="flex-1 accent-cyan-400 h-2 bg-space-950 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => handleShiftChange(shift + 1)}
              className="px-3 py-2 rounded bg-space-950 border border-slate-700 hover:border-cyan-500/60 text-slate-200 font-mono text-sm active:scale-95 transition-all"
            >
              +1
            </button>

            <button
              onClick={() => handleShiftChange(0)}
              title="Reset offset to 0"
              className="p-2 rounded bg-space-950 border border-slate-800 hover:border-slate-600 text-slate-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500">QUICK TUNING:</span>
            {[-3, -1, 0, 1, 3, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleShiftChange(val)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  shift === val
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold'
                    : 'border-slate-800 bg-space-950/60 text-slate-400 hover:text-slate-200'
                }`}
              >
                SHIFT {val > 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Live Decoded Output Preview */}
        <div
          className={`p-5 rounded-lg border transition-all duration-300 ${
            decodedPreview === 'THE LAST SIGNAL'
              ? 'border-emerald-500/60 bg-emerald-950/20 shadow-lg shadow-emerald-950/30'
              : 'border-slate-800 bg-space-950/70'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">CURRENT TRANSLATION OUTPUT:</span>
            {decodedPreview === 'THE LAST SIGNAL' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> HARMONIC MATCH IDENTIFIED
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> CARRIER UNRESOLVED
              </span>
            )}
          </div>

          <div
            className={`text-2xl lg:text-3xl font-mono font-bold tracking-[0.2em] transition-colors ${
              decodedPreview === 'THE LAST SIGNAL'
                ? 'text-emerald-300 glow-cyan'
                : 'text-slate-300'
            }`}
          >
            {decodedPreview}
          </div>

          {/* Letter Mapping Visualizer */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px] self-center">MAP:</span>
            {['V', 'J', 'G', 'N', 'C', 'U', 'K', 'I', 'P'].map((char) => {
              const mapped = caesarShift(char, shift);
              return (
                <div
                  key={char}
                  className="px-2 py-0.5 rounded bg-space-900 border border-slate-800 text-[11px]"
                >
                  <span className="text-slate-400">{char}</span>
                  <span className="text-cyan-400 mx-1">→</span>
                  <span className="text-cyan-200 font-bold">{mapped}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-400">
            {state.completedStages.key ? (
              <span className="text-violet-300">
                KEY TAB ADVISORY: Offset shift is -3 (3 backward).
              </span>
            ) : (
              <span className="text-slate-500">
                HINT: Consult Key Terminal to extract the required shift offset.
              </span>
            )}
          </div>

          <button
            onClick={handleCommitDecode}
            disabled={state.cipherDecoded}
            className={`px-5 py-2.5 rounded font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 ${
              state.cipherDecoded
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                : decodedPreview === 'THE LAST SIGNAL'
                ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-lg shadow-cyan-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {state.cipherDecoded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SIGNAL DECODED & VERIFIED
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                LOCK IN DECRYPTED SIGNAL
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className="mt-3 p-3 rounded bg-space-950 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Vault Submission Shortcut if all stages completed */}
      {state.completedStages.transmission && state.completedStages.key && state.completedStages.anomaly && (
        <div className="p-4 rounded-lg bg-cyan-950/30 border border-cyan-500/50 flex flex-wrap items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center gap-2 text-cyan-300">
            <ShieldAlert className="w-5 h-5" />
            <span className="font-display font-bold text-sm">
              ALL 3 CLUES SECURED. TEMPORAL VAULT READY FOR UNLOCK.
            </span>
          </div>
          <button
            onClick={onOpenVault}
            className="px-4 py-2 rounded bg-cyan-500 hover:bg-cyan-400 text-space-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
          >
            PROCEED TO VAULT TERMINAL
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
