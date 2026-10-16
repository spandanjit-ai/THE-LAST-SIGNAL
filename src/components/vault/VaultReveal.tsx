import React, { useState, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  X,
  Volume2,
} from 'lucide-react';
import { TerminalText } from '../common/TerminalText';

interface VaultRevealProps {
  onClose?: () => void;
}

export const VaultReveal: React.FC<VaultRevealProps> = ({ onClose }) => {
  const {
    state,
    submitFinalVault,
    retrySequence,
    resetMission,
    toggleAudio,
    isAudioEnabled,
  } = useMission();

  const [inputAnswer, setInputAnswer] = useState(
    state.cipherDecoded ? 'THE LAST SIGNAL' : ''
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Trigger confetti on unlock
  useEffect(() => {
    if (state.unlockStatus === 'UNLOCKED') {
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#00f0ff', '#8b5cf6', '#38bdf8', '#10b981'],
        });
      } catch {
        // Safe fallback
      }
    }
  }, [state.unlockStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAnswer.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const result = await submitFinalVault(inputAnswer);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMessage(result.message);
    }
  };

  const isStable = state.currentPhase === 'STABLE';
  const hasAllPrerequisites =
    state.keyDiscovered && state.anomalyConfirmed && state.cipherDecoded;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-space-950 border border-cyan-500/40 rounded-xl shadow-2xl overflow-hidden my-8">
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-25 pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-500/30 bg-space-900/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg border ${
                state.unlockStatus === 'UNLOCKED'
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                  : 'border-cyan-500/40 bg-cyan-950/60 text-cyan-300'
              }`}
            >
              {state.unlockStatus === 'UNLOCKED' ? (
                <Unlock className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-cyan-400" />
              )}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg lg:text-xl text-white tracking-wider flex items-center gap-2">
                CLASSIFIED ARCHIVE // CORE VAULT
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    state.unlockStatus === 'UNLOCKED'
                      ? 'border-emerald-500/40 text-emerald-300 bg-emerald-950/40'
                      : 'border-amber-500/40 text-amber-300 bg-amber-950/40'
                  }`}
                >
                  {state.unlockStatus}
                </span>
              </h2>
              <div className="text-xs font-mono text-slate-400">
                AUTH_PROTOCOL: SHA-256 // TEMPORAL_SYNC: {state.currentPhase} [{state.phaseSecondsRemaining}s]
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-1.5 rounded border border-slate-700 hover:border-cyan-500/50 text-slate-400 hover:text-cyan-300 transition-colors"
              title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* Animated Concentric Geometric Rings Graphic */}
          <div className="relative flex items-center justify-center py-6">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Gear Ring */}
              <svg
                className={`absolute inset-0 w-full h-full text-cyan-500/30 transition-transform ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-spin'
                    : state.unlockStatus === 'UNLOCKED'
                    ? 'rotate-45'
                    : 'animate-spin-slow'
                }`}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeDasharray="6 8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.8"
                />
              </svg>

              {/* Middle Rotating Segmented Ring */}
              <svg
                className={`absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] text-violet-500/40 transition-transform ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-reverse-spin'
                    : state.unlockStatus === 'UNLOCKED'
                    ? '-rotate-90'
                    : 'animate-reverse-spin'
                }`}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="74"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeDasharray="25 15 5 15"
                />
              </svg>

              {/* Inner Optical Reticle */}
              <svg
                className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] text-cyan-400/50"
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                {/* Crosshairs */}
                <line x1="100" y1="36" x2="100" y2="48" stroke="currentColor" strokeWidth="2" />
                <line x1="100" y1="152" x2="100" y2="164" stroke="currentColor" strokeWidth="2" />
                <line x1="36" y1="100" x2="48" y2="100" stroke="currentColor" strokeWidth="2" />
                <line x1="152" y1="100" x2="164" y2="100" stroke="currentColor" strokeWidth="2" />
              </svg>

              {/* Center Core Reactor / Status Glow */}
              <div
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all duration-700 ${
                  state.unlockStatus === 'UNLOCKED'
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-2xl shadow-emerald-500/50 scale-110'
                    : state.unlockStatus === 'VERIFYING'
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-2xl shadow-cyan-400/60 animate-pulse'
                    : 'bg-space-900 border-cyan-500/40'
                }`}
              >
                {state.unlockStatus === 'UNLOCKED' ? (
                  <>
                    <Unlock className="w-8 h-8 text-emerald-400 animate-bounce" />
                    <span className="text-[9px] font-mono font-bold text-emerald-300 mt-1">OPEN</span>
                  </>
                ) : state.unlockStatus === 'VERIFYING' ? (
                  <>
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
                    <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1">CHECK</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-cyan-400" />
                    <span className="text-[9px] font-mono text-slate-400 mt-1">LOCKED</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Checklist of Prerequisites */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div
              className={`p-2.5 rounded border flex items-center justify-between ${
                state.keyDiscovered
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900/60 text-slate-400'
              }`}
            >
              <span>KEY RECOVERED</span>
              {state.keyDiscovered ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-600" />
              )}
            </div>

            <div
              className={`p-2.5 rounded border flex items-center justify-between ${
                state.anomalyConfirmed
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900/60 text-slate-400'
              }`}
            >
              <span>DOM ANOMALY</span>
              {state.anomalyConfirmed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-600" />
              )}
            </div>

            <div
              className={`p-2.5 rounded border flex items-center justify-between ${
                state.cipherDecoded
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900/60 text-slate-400'
              }`}
            >
              <span>CIPHER DECODED</span>
              {state.cipherDecoded ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <XCircle className="w-4 h-4 text-slate-600" />
              )}
            </div>

            <div
              className={`p-2.5 rounded border flex items-center justify-between ${
                isStable
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-950/20 text-amber-300'
              }`}
            >
              <span>TEMPORAL: {state.currentPhase}</span>
              {isStable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400" />
              )}
            </div>
          </div>

          {/* Unlocked State vs Submission Form */}
          {state.unlockStatus === 'UNLOCKED' ? (
            <div className="p-6 rounded-lg bg-emerald-950/30 border border-emerald-500/50 space-y-4">
              <div className="flex items-center gap-3 text-emerald-300">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <h3 className="font-display font-bold text-lg">
                  CLASSIFIED TRANSMISSION RECOVERED & VERIFIED
                </h3>
              </div>

              <div className="p-4 rounded bg-space-950 border border-emerald-500/30 font-mono text-sm leading-relaxed text-slate-200">
                <div className="text-emerald-400 text-xs mb-2">
                  // DECRYPTED TRANSMISSION STREAM PAYLOAD:
                </div>
                <div className="text-xl sm:text-2xl font-bold tracking-widest text-emerald-300 glow-cyan mb-3">
                  &quot;THE LAST SIGNAL&quot;
                </div>
                <TerminalText
                  text="To all exploratory vessels on standard frequency: Planetary core stabilization sequence has commenced. Temporal harmonics aligned. The archive is secured for future transmissions."
                  speed={20}
                  className="text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-xs text-slate-400 pt-2 border-t border-emerald-500/20">
                <div>MISSION: <span className="text-white">{state.missionId}</span></div>
                <div>STATUS: <span className="text-emerald-400 font-bold">UNLOCKED</span></div>
                <div>REVISION: <span className="text-white">{state.revision}</span></div>
                <div>DIGEST: <span className="text-cyan-300 font-bold">SHA-256 VERIFIED</span></div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => resetMission()}
                  className="px-4 py-2 rounded border border-slate-700 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESTART TRANSMISSION PROTOCOL
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="vault-passphrase-input"
                  className="block text-xs font-mono text-slate-300 mb-2 flex items-center justify-between"
                >
                  <span>SUBMIT DECODED TRANSMISSION PHRASE:</span>
                  <span className="text-slate-500">FORMAT: &quot;THE LAST SIGNAL&quot;</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="vault-passphrase-input"
                    type="text"
                    placeholder="Enter decrypted message..."
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded bg-space-950 border border-slate-700 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white font-mono text-sm tracking-widest uppercase outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      isStable && hasAllPrerequisites
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-lg shadow-cyan-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        VERIFYING HARMONICS...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-4 h-4" />
                        INITIATE VAULT OVERRIDE
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Status or Error Notifications */}
              {(errorMessage || state.error) && (
                <div className="p-3.5 rounded bg-rose-950/60 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">VERIFICATION REJECTED:</span>{' '}
                      {errorMessage || state.error}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      retrySequence();
                    }}
                    className="text-[11px] underline hover:text-white"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* Contextual Hints */}
              <div className="p-3 rounded bg-space-900 border border-slate-800 text-xs font-mono text-slate-400 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Temporal Gate:{' '}
                    {isStable ? (
                      <span className="text-emerald-400 font-bold">
                        STABLE RESONANCE ACTIVE [{state.phaseSecondsRemaining}s remaining]
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        Signal in {state.currentPhase} phase. Wait for STABLE window ({state.phaseSecondsRemaining}s).
                      </span>
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setInputAnswer('THE LAST SIGNAL')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Autofill decoded
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
