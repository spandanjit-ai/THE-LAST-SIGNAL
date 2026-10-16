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
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-noir-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-noir-base border border-signal-violet/30 text-signal-violet">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-signal-violet uppercase tracking-widest">
                CRYPTOGRAPHIC ARCHIVE NODE
              </div>
              <h2 className="font-display font-bold text-xl text-signal-text tracking-tight">
                CIPHER PARAMETER RECOVERY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isKeyUnlocked ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#8B7CFF]/15 border border-[#8B7CFF]/40 text-signal-violet">
                <ShieldCheck className="w-3.5 h-3.5 text-signal-violet" />
                KEY RECOVERED & SYNCED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-base border border-noir-border text-signal-dim">
                <Lock className="w-3.5 h-3.5" />
                RESONANCE LOCK ACTIVE
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-signal-muted leading-relaxed max-w-2xl">
          The transmission cipher offset is stored within a harmonic carrier subchannel.
          Tune the resonance frequency slider into the hydrogen carrier line [1420.4 MHz] to extract the decryption parameters.
        </p>
      </div>

      {/* Resonance Frequency Tuner */}
      {!isKeyUnlocked && (
        <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-noir-border">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-signal-violet" />
              <h3 className="font-display font-bold text-lg text-signal-text tracking-wide">
                HARMONIC RESONANCE TUNER
              </h3>
            </div>
            <div className="text-xs font-mono text-signal-muted">
              TARGET FREQUENCY: <span className="text-signal-violet font-bold">1420.4 MHz</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-signal-muted">
              <span>TUNED FREQUENCY:</span>
              <span
                className={`text-xl font-bold font-mono ${
                  isTuned ? 'text-signal-cyan animate-pulse' : 'text-signal-violet'
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
              className="w-full accent-[#8B7CFF] h-2 bg-noir-base rounded cursor-pointer"
            />

            <div className="flex justify-between text-[10px] font-mono text-signal-dim">
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
                    ? 'bg-signal-violet hover:bg-[#A397FF] text-[#070A12] shadow-sm active:scale-95'
                    : 'bg-noir-base text-signal-dim cursor-not-allowed border border-noir-border'
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
        <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md space-y-6">
          <div className="flex items-center gap-2 text-signal-violet text-xs font-mono pb-3 border-b border-noir-border">
            <CheckCircle2 className="w-4 h-4 text-signal-violet" />
            <span>AUTHENTICATED CIPHER PARAMETERS DECRYPTED</span>
          </div>

          {/* Cipher Shift Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded bg-noir-base border border-noir-border">
              <div className="text-[10px] font-mono text-signal-dim uppercase mb-1">
                CIPHER ALGORITHM
              </div>
              <div className="text-xl font-display font-bold text-signal-text mb-2">
                CAESAR CIPHER / ROT-3
              </div>
              <div className="text-xs font-mono text-signal-muted leading-relaxed">
                Backward displacement: <span className="text-signal-violet font-bold">-2 (or 3-step classic)</span>
                <br />
                Forward modular offset: <span className="text-signal-dim">+24</span>
              </div>
            </div>

            <div className="p-4 rounded bg-noir-base border border-noir-border">
              <div className="text-[10px] font-mono text-signal-dim uppercase mb-1">
                CHARACTER SHIFT SAMPLE
              </div>
              <div className="text-xs font-mono space-y-1.5 pt-1">
                <div className="flex justify-between border-b border-noir-border pb-1">
                  <span className="text-signal-dim">&apos;V&apos; in ciphertext</span>
                  <span className="text-signal-violet font-bold">→ &apos;T&apos; (-2)</span>
                </div>
                <div className="flex justify-between border-b border-noir-border pb-1">
                  <span className="text-signal-dim">&apos;J&apos; in ciphertext</span>
                  <span className="text-signal-violet font-bold">→ &apos;H&apos; (-2)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-signal-dim">&apos;G&apos; in ciphertext</span>
                  <span className="text-signal-violet font-bold">→ &apos;E&apos; (-2)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Fragment of the Final Directive */}
          <div className="p-5 rounded bg-noir-base border border-signal-violet/30">
            <div className="flex items-center gap-2 text-signal-violet text-xs font-mono mb-2">
              <Cpu className="w-4 h-4" />
              <span>CLASSIFIED OPERATIONAL DIRECTIVE // FRAGMENT B</span>
            </div>
            <p className="font-mono text-xs sm:text-sm text-signal-text leading-relaxed italic">
              &quot;The planetary transmission vault is guarded by temporal resonance dampeners. Submissions will be rejected during SEARCHING and ALIGNING intervals. Transmit the final unlock sequence strictly when the carrier frequency attains <span className="text-signal-cyan font-bold not-italic">STABLE</span> resonance.&quot;
            </p>
          </div>

          {/* Navigation Action */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="text-xs font-mono text-signal-dim">
              Shift parameters have been automatically broadcast to all active tabs.
            </div>

            {onNavigateToRole && (
              <button
                onClick={() => onNavigateToRole('transmission')}
                className="px-4 py-2 rounded bg-noir-base hover:bg-noir-elevated border border-noir-border text-signal-text font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-colors"
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
