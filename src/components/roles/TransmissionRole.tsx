import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { CIPHERTEXT, caesarShift } from '../../engine/cipher';
import {
  Radio,
  Sliders,
  CheckCircle2,
  Lock,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const TransmissionRole: React.FC<{ onOpenVault?: () => void }> = () => {
  const { state, decodeCipher } = useMission();

  // Shift value for the interactive Caesar decoder tool (-13 to +13)
  const [shift, setShift] = useState<number>(0);
  const [feedback, setFeedback] = useState<string | null>(null);

  const decodedPreview = caesarShift(CIPHERTEXT, shift);
  const isDecodedCorrectly = state.cipherDecoded || decodedPreview === 'THE LAST SIGNAL';

  const handleShiftChange = (newShift: number) => {
    setShift(newShift);
    SoundFX.playTick();
  };

  const handleCommitDecode = () => {
    const success = decodeCipher(decodedPreview);
    if (success) {
      setFeedback('CARRIER_MATCH: Decrypted plaintext verified and locked.');
    } else {
      setFeedback('RESONANCE_MISMATCH: Decryption rejected. Adjust Caesar shift offset.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Intercepted Ciphertext Card */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-noir-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-noir-base border border-signal-cyan/30 text-signal-cyan">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-signal-cyan uppercase tracking-widest">
                INCOMING CARRIER INTERCEPT
              </div>
              <h2 className="font-display font-bold text-xl text-signal-text tracking-tight">
                RAW CIPHERTEXT STREAM
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-signal-muted">
            CHANNEL: <span className="text-signal-text font-bold">ALPHA-7</span> // FREQ: <span className="text-signal-cyan font-bold">1420.405 MHz</span>
          </div>
        </div>

        {/* Crisp Ciphertext Display */}
        <div className="p-5 rounded bg-noir-base border border-noir-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-signal-dim uppercase tracking-wider mb-1">
              PAYLOAD BUFFER (ENCODED)
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.25em] text-signal-cyan select-all">
              {CIPHERTEXT}
            </div>
          </div>

          <div className="text-xs font-mono text-signal-dim sm:text-right">
            <div>ALGORITHM: CAESAR SHIFT</div>
            <div className="text-[11px] mt-0.5">MODULAR DISPLACEMENT</div>
          </div>
        </div>
      </div>

      {/* Interactive Caesar Decoder Console */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-noir-border">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-signal-cyan" />
            <h3 className="font-display font-bold text-lg text-signal-text tracking-wide">
              DECRYPTION OFFSET CONSOLE
            </h3>
          </div>
          <div className="text-xs font-mono text-signal-muted">
            OFFSET: <span className="text-signal-cyan font-bold text-sm">{shift > 0 ? `+${shift}` : shift}</span>
          </div>
        </div>

        {/* Stepper and Slider Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShiftChange(shift - 1)}
              className="px-3.5 py-2 rounded bg-noir-base border border-noir-border hover:border-signal-cyan/40 text-signal-text font-mono text-xs active:scale-95 transition-all"
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
              className="flex-1 accent-[#22D3EE] h-2 bg-noir-base rounded cursor-pointer"
            />

            <button
              onClick={() => handleShiftChange(shift + 1)}
              className="px-3.5 py-2 rounded bg-noir-base border border-noir-border hover:border-signal-cyan/40 text-signal-text font-mono text-xs active:scale-95 transition-all"
            >
              +1
            </button>

            <button
              onClick={() => handleShiftChange(0)}
              title="Reset offset to 0"
              className="p-2 rounded bg-noir-base border border-noir-border hover:border-signal-dim text-signal-dim transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick tuning shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-signal-dim text-[11px] uppercase mr-1">PRESETS:</span>
            {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => handleShiftChange(val)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  shift === val
                    ? 'border-signal-cyan bg-signal-cyan/15 text-signal-cyan font-bold'
                    : 'border-noir-border bg-noir-base text-signal-muted hover:text-signal-text hover:border-noir-border/80'
                }`}
              >
                SHIFT {val > 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Live Decoded Output Preview */}
        <div
          className={`p-5 rounded border transition-all duration-300 ${
            decodedPreview === 'THE LAST SIGNAL'
              ? 'border-signal-cyan/60 bg-signal-cyan/10'
              : 'border-noir-border bg-noir-base'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-signal-dim">TRANSLATION STREAM:</span>
            {decodedPreview === 'THE LAST SIGNAL' ? (
              <span className="text-signal-cyan font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> HARMONIC MATCH IDENTIFIED
              </span>
            ) : (
              <span className="text-signal-dim flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> SIGNAL UNRESOLVED
              </span>
            )}
          </div>

          <div
            className={`text-2xl sm:text-3xl font-mono font-bold tracking-[0.2em] transition-colors ${
              decodedPreview === 'THE LAST SIGNAL' ? 'text-signal-cyan' : 'text-signal-text'
            }`}
          >
            {decodedPreview}
          </div>

          {/* Letter Mapping Matrix */}
          <div className="mt-4 pt-3 border-t border-noir-border flex flex-wrap gap-2 text-xs font-mono">
            <span className="text-signal-dim text-[11px] self-center mr-1">MAPPING:</span>
            {['V', 'J', 'G', 'N', 'C', 'U', 'K', 'I', 'P'].map((char) => {
              const mapped = caesarShift(char, shift);
              return (
                <div
                  key={char}
                  className="px-2 py-0.5 rounded bg-noir-surface border border-noir-border text-[11px]"
                >
                  <span className="text-signal-dim">{char}</span>
                  <span className="text-signal-cyan mx-1">→</span>
                  <span className="text-signal-text font-bold">{mapped}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs font-mono text-signal-muted">
            {state.completedStages.key ? (
              <span className="text-signal-violet">
                KEY ADVISORY: Offset parameter confirmed at -3 backward.
              </span>
            ) : (
              <span className="text-signal-dim">
                Tune the Decryption Key terminal to verify the required displacement.
              </span>
            )}
          </div>

          <button
            onClick={handleCommitDecode}
            disabled={state.cipherDecoded}
            className={`px-5 py-2.5 rounded font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
              state.cipherDecoded
                ? 'bg-noir-base border border-signal-cyan/40 text-signal-cyan cursor-default'
                : isDecodedCorrectly
                ? 'bg-signal-cyan hover:bg-[#38BDF8] text-[#070A12] shadow-sm'
                : 'bg-noir-base hover:bg-noir-elevated text-signal-text border border-noir-border'
            }`}
          >
            {state.cipherDecoded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-signal-cyan" />
                SIGNAL VERIFIED & COMMITTED
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
          <div className="p-3 rounded bg-noir-base border border-signal-cyan/30 text-xs font-mono text-signal-cyan flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-signal-cyan flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
