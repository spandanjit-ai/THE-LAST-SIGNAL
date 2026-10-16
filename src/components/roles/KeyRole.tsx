import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  KeyRound,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Compass,
  ArrowRight,
  Cpu,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const KeyRole: React.FC<{ onNavigateToRole?: (role: any) => void }> = ({ onNavigateToRole }) => {
  const { state, discoverKey } = useMission();

  // Interactive frequency tuner
  const [frequency, setFrequency] = useState<number>(1416.0);
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
      {/* Top Telemetry Header */}
      <div className="border border-slate-800 bg-space-950/80 rounded-lg p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-violet-950/60 border border-violet-500/30 text-violet-400">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-violet-400 uppercase tracking-widest">
                CRYPTOGRAPHIC ARCHIVE NODE
              </div>
              <h2 className="font-display font-bold text-xl text-white tracking-wide">
                CIPHER PARAMETER RECOVERY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isKeyUnlocked ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                KEY RECOVERED & SYNCED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-900 border border-slate-700 text-slate-400">
                <Lock className="w-3.5 h-3.5" />
                RESONANCE LOCK ACTIVE
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-2xl">
          The transmission cipher offset is stored within a harmonic carrier subchannel.
          Tune the resonance frequency slider into the hydrogen carrier line [1420.4 MHz] to extract the decryption parameters.
        </p>
      </div>

      {/* Resonance Frequency Tuner */}
      {!isKeyUnlocked && (
        <div className="border border-slate-800 bg-space-950/80 rounded-lg p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-violet-400" />
              <h3 className="font-display font-bold text-lg text-white tracking-wide">
                HARMONIC RESONANCE TUNER
              </h3>
            </div>
            <div className="text-xs font-mono text-slate-400">
              TARGET FREQUENCY: <span className="text-violet-300 font-bold">1420.4 MHz</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>TUNED FREQUENCY:</span>
              <span
                className={`text-xl font-bold font-mono ${
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
              className="w-full accent-violet-400 h-2 bg-space-900 rounded-lg cursor-pointer"
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
                className={`px-5 py-2.5 rounded font-display font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
                  isTuned
                    ? 'bg-violet-500 hover:bg-violet-400 text-white shadow-lg shadow-violet-500/30 active:scale-95'
                    : 'bg-space-900 text-slate-500 cursor-not-allowed border border-slate-800'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                {isTuned ? 'DECRYPT KEY PARAMETERS' : 'ALIGN CARRIER TO UNLOCK'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Discovered Key Information Display */}
      {isKeyUnlocked && (
        <div className="border border-slate-800 bg-space-950/80 rounded-lg p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono pb-3 border-b border-slate-800/80">
            <CheckCircle2 className="w-4 h-4" />
            <span>AUTHENTICATED CIPHER PARAMETERS DECRYPTED</span>
          </div>

          {/* Cipher Shift Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-space-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                CIPHER ALGORITHM
              </div>
              <div className="text-xl font-display font-bold text-white mb-2">
                CAESAR CIPHER / ROT-3
              </div>
              <div className="text-xs font-mono text-slate-300 leading-relaxed">
                Backward displacement: <span className="text-violet-300 font-bold">-3 (THREE POSITIONS)</span>
                <br />
                Forward modular offset: <span className="text-slate-400">+23</span>
              </div>
            </div>

            <div className="p-4 rounded bg-space-900/90 border border-slate-800">
              <div className="text-[10px] font-mono text-slate-500 uppercase mb-1">
                CHARACTER SHIFT SAMPLE
              </div>
              <div className="text-xs font-mono space-y-1.5 pt-1">
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">&apos;V&apos; in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ &apos;T&apos; (-3)</span>
                </div>
                <div className="flex justify-between border-b border-slate-800/80 pb-1">
                  <span className="text-slate-400">&apos;J&apos; in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ &apos;G&apos; (-3)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">&apos;G&apos; in ciphertext</span>
                  <span className="text-violet-300 font-bold">→ &apos;D&apos; (-3)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fragment of the Final Directive */}
          <div className="p-5 rounded bg-space-900/90 border border-violet-500/30">
            <div className="flex items-center gap-2 text-violet-400 text-xs font-mono mb-2">
              <Cpu className="w-4 h-4" />
              <span>CLASSIFIED OPERATIONAL DIRECTIVE // FRAGMENT B</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed italic">
              &quot;The planetary transmission vault is guarded by temporal resonance dampeners. Submissions will be rejected during SEARCHING and ALIGNING intervals. Transmit the final unlock sequence strictly when the carrier frequency attains <span className="text-cyan-300 font-bold not-italic">STABLE</span> resonance.&quot;
            </p>
          </div>

          {/* Navigation Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-slate-400">
              Shift parameters have been automatically broadcast to all active tabs.
            </div>

            {onNavigateToRole && (
              <button
                onClick={() => onNavigateToRole('transmission')}
                className="px-4 py-2 rounded bg-space-900 hover:bg-space-800 border border-slate-700 text-slate-200 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
              >
                APPLY TO TRANSMISSION DECODER
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
