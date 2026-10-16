import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  KeyRound,
  ShieldCheck,
  Cpu,
  Radio,
  CheckCircle2,
  Lock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const KeyRole: React.FC<{ onNavigateToRole?: (role: any) => void }> = ({ onNavigateToRole }) => {
  const { state, discoverKey } = useMission();

  // Interactive tuner state
  const [frequency, setFrequency] = useState<number>(1415.0);
  const targetFrequency = 1420.4;
  const isTuned = Math.abs(frequency - targetFrequency) < 0.6;
  const isKeyUnlocked = state.keyDiscovered || state.completedStages.key;

  const handleTune = (val: number) => {
    setFrequency(val);
    SoundFX.playTick();
  };

  const handleUnlockKey = () => {
    discoverKey();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-space-900/80 border border-violet-500/30 rounded-lg p-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <KeyRound className="w-36 h-36 text-violet-400" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-violet-950/80 border border-violet-500/40 text-violet-300">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-violet-400 tracking-wider uppercase">
                SECURITY ARCHIVE NODE
              </span>
              <h2 className="font-display text-xl lg:text-2xl font-bold tracking-wide text-white">
                CRYPTOGRAPHIC KEY RECOVERY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isKeyUnlocked ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                KEY RECOVERED & BROADCASTING
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-violet-950/60 border border-violet-500/40 text-violet-300">
                <Lock className="w-3.5 h-3.5" />
                RESONANCE LOCK ACTIVE
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-2xl">
          The transmission cipher offset is stored within a resonant harmonic subcarrier.
          Tune the resonance slider into the hydrogen carrier line [1420.4 MHz] to extract the decryption parameters.
        </p>
      </div>

      {/* Resonance Frequency Tuner */}
      {!isKeyUnlocked && (
        <div className="bg-space-900/80 border border-violet-500/30 rounded-lg p-5 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-violet-400" />
              <h3 className="font-display text-lg font-bold text-white tracking-wide">
                HARMONIC RESONANCE TUNER
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              TARGET: <span className="text-violet-300 font-bold">1420.4 MHz</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>CARRIER FREQUENCY:</span>
              <span
                className={`text-lg font-bold ${
                  isTuned ? 'text-emerald-400 animate-pulse' : 'text-violet-300'
                }`}
              >
                {frequency.toFixed(1)} MHz
              </span>
            </div>

            <input
              type="range"
              min="1410.0"
              max="1430.0"
              step="0.2"
              value={frequency}
              onChange={(e) => handleTune(parseFloat(e.target.value))}
              className="w-full accent-violet-400 h-2 bg-space-950 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>1410.0 MHz</span>
              <span>1420.4 MHz (TARGET)</span>
              <span>1430.0 MHz</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={handleUnlockKey}
                disabled={!isTuned}
                className={`px-5 py-2.5 rounded font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center gap-2 ${
                  isTuned
                    ? 'bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/30 active:scale-95'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                {isTuned ? 'DECRYPT KEY RECORD' : 'ALIGN CARRIER TO UNLOCK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discovered Key Information Display */}
      {isKeyUnlocked && (
        <div className="bg-space-900/80 border border-violet-500/40 rounded-lg p-6 backdrop-blur-md space-y-6">
          {/* Key status confirmation */}
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
            <CheckCircle2 className="w-4 h-4" />
            <span>AUTHENTICATED CIPHER PARAMETERS DECRYPTED</span>
          </div>

          {/* Cipher Shift Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-md bg-space-950/80 border border-violet-500/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                CIPHER MECHANISM
              </div>
              <div className="text-xl font-display font-bold text-white mb-2">
                CAESAR CIPHER / ROT-3
              </div>
              <div className="text-xs font-mono text-slate-300 leading-relaxed">
                Offset factor: <span className="text-violet-300 font-bold">-3 (THREE STEPS BACKWARD)</span>
                <br />
                Reverse displacement: <span className="text-cyan-300 font-bold">+23 forward</span>
              </div>
            </div>

            <div className="p-4 rounded-md bg-space-950/80 border border-violet-500/30">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">
                SUBSTITUTION SAMPLE
              </div>
              <div className="text-xs font-mono space-y-1 pt-1">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">`V` in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ `T` (22 - 3 = 19)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">`J` in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ `G` (9 - 3 = 6)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">`G` in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ `D` (6 - 3 = 3)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fragment of the Final Clue */}
          <div className="p-5 rounded-md bg-violet-950/30 border border-violet-500/50">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono mb-2">
              <Cpu className="w-4 h-4" />
              <span>CLASSIFIED OPERATIONAL DIRECTIVE // FRAGMENT B</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              "The planetary transmission vault is equipped with temporal resonance dampeners. Even with the plaintext decoded, submission will be rejected during SEARCHING and ALIGNING intervals. Transmit the final unlock sequence strictly when the carrier frequency attains <span className="text-cyan-300 font-bold not-italic">STABLE</span> resonance."
            </p>
          </div>

          {/* Navigation Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              <span>Shift data has been automatically synced to your Transmission tab.</span>
            </div>

            {onNavigateToRole && (
              <button
                onClick={() => onNavigateToRole('transmission')}
                className="px-4 py-2 rounded bg-violet-600 hover:bg-violet-500 text-white font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                APPLY TO TRANSMISSION DECODER
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
