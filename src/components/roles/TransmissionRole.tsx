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
      setFeedback('TRANSMISSION_CONFIRMED: Carrier decoded to "THE LAST SIGNAL". Synced to dossier.');
    } else {
      setFeedback('DECRYPTION_MISMATCH: Harmonic resonance rejected. Adjust shift offset.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Intercepted Ciphertext Card */}
      <div className="border border-slate-800 bg-space-950/80 rounded-lg p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
                INTERCEPTED TELEMETRY STREAM
              </div>
              <h2 className="font-display font-bold text-xl text-white tracking-wide">
                CARRIER CIPHERTEXT
              </h2>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400">
            CHANNEL: <span className="text-white font-bold">ALPHA-7</span> // FREQ: <span className="text-cyan-300">1420.405 MHz</span>
          </div>
        </div>

        {/* Big Crisp Ciphertext Display */}
        <div className="p-5 rounded bg-space-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-1">
              RAW INTERCEPTED PAYLOAD
            </div>
            <div className="text-3xl sm:text-4xl font-mono font-bold tracking-[0.25em] text-cyan-300 select-all">
              {CIPHERTEXT}
            </div>
          </div>

          <div className="text-xs font-mono text-slate-400 sm:text-right">
            <div>ENCODING: CAESAR CIPHER</div>
            <div className="text-slate-500 text-[11px] mt-0.5">ALPHABETICAL DISPLACEMENT</div>
          </div>
        </div>
      </div>

      {/* Interactive Caesar Decoder Console */}
      <div className="border border-slate-800 bg-space-950/80 rounded-lg p-5 sm:p-6 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white tracking-wider">
              DECRYPTION DISPLACEMENT CONSOLE
            </h3>
          </div>
          <div className="text-xs font-mono text-slate-400">
            SHIFT OFFSET: <span className="text-cyan-300 font-bold text-sm">{shift > 0 ? `+${shift}` : shift}</span>
          </div>
        </div>

        {/* Stepper and Slider Controls */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShiftChange(shift - 1)}
              className="px-3.5 py-2 rounded bg-space-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-mono text-xs active:scale-95 transition-all"
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
              className="flex-1 accent-cyan-400 h-2 bg-space-900 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => handleShiftChange(shift + 1)}
              className="px-3.5 py-2 rounded bg-space-900 border border-slate-700 hover:border-slate-500 text-slate-200 font-mono text-xs active:scale-95 transition-all"
            >
              +1
            </button>

            <button
              onClick={() => handleShiftChange(0)}
              title="Reset offset to 0"
              className="p-2 rounded bg-space-900 border border-slate-700 hover:border-slate-500 text-slate-400 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick tuning shortcuts */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px] uppercase mr-1">PRESETS:</span>
            {[-3, -1, 0, 1, 3, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleShiftChange(val)}
                className={`px-2.5 py-1 rounded border transition-all ${
                  shift === val
                    ? 'border-cyan-400 bg-cyan-950/60 text-cyan-300 font-bold'
                    : 'border-slate-800 bg-space-900 text-slate-400 hover:text-slate-200 hover:border-slate-700'
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
              ? 'border-emerald-500/50 bg-emerald-950/20'
              : 'border-slate-800 bg-space-900/80'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-400">TRANSLATION RESULT:</span>
            {decodedPreview === 'THE LAST SIGNAL' ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1.5 animate-pulse">
                <CheckCircle2 className="w-3.5 h-3.5" /> HARMONIC MATCH IDENTIFIED
              </span>
            ) : (
              <span className="text-slate-500 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" /> SIGNAL UNRESOLVED
              </span>
            )}
          </div>

          <div
            className={`text-2xl sm:text-3xl font-mono font-bold tracking-[0.2em] transition-colors ${
              decodedPreview === 'THE LAST SIGNAL' ? 'text-emerald-300' : 'text-slate-300'
            }`}
          >
            {decodedPreview}
          </div>

          {/* Letter Mapping Matrix */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex flex-wrap gap-2 text-xs font-mono">
            <span className="text-slate-500 text-[11px] self-center mr-1">MAPPING:</span>
            {['V', 'J', 'G', 'N', 'C', 'U', 'K', 'I', 'P'].map((char) => {
              const mapped = caesarShift(char, shift);
              return (
                <div
                  key={char}
                  className="px-2 py-0.5 rounded bg-space-950 border border-slate-800 text-[11px]"
                >
                  <span className="text-slate-400">{char}</span>
                  <span className="text-cyan-400 mx-1">→</span>
                  <span className="text-white font-bold">{mapped}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="text-xs font-mono text-slate-400">
            {state.completedStages.key ? (
              <span className="text-violet-300">
                KEY TERMINAL HINT: Caesar displacement offset is -3.
              </span>
            ) : (
              <span className="text-slate-500">
                Cross-reference with Key Terminal to confirm the authoritative shift value.
              </span>
            )}
          </div>

          <button
            onClick={handleCommitDecode}
            disabled={state.cipherDecoded}
            className={`px-5 py-2.5 rounded font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
              state.cipherDecoded
                ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 cursor-default'
                : isDecodedCorrectly
                ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-lg shadow-cyan-500/30'
                : 'bg-space-900 hover:bg-space-800 text-slate-300 border border-slate-700'
            }`}
          >
            {state.cipherDecoded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SIGNAL VERIFIED & COMMITTED
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                COMMIT DECRYPTED CARRIER
              </>
            )}
          </button>
        </div>

        {feedback && (
          <div className="p-3 rounded bg-space-900 border border-cyan-500/30 text-xs font-mono text-cyan-300 flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>{feedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
