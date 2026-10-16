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

  // Trigger celebratory confetti on unlock
  useEffect(() => {
    if (state.unlockStatus === 'UNLOCKED') {
      try {
        confetti({
          particleCount: 120,
          spread: 90,
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6">
      <div
        className={`relative w-full max-w-4xl bg-space-950 border rounded-xl shadow-2xl overflow-hidden my-auto transition-all duration-700 ${
          state.unlockStatus === 'UNLOCKED'
            ? 'border-emerald-500/50 shadow-emerald-500/20'
            : 'border-slate-800 shadow-cyan-500/10'
        }`}
      >
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 scanlines opacity-20 pointer-events-none" />

        {/* Modal Top Telemetry Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-space-900/90">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded border transition-colors ${
                state.unlockStatus === 'UNLOCKED'
                  ? 'border-emerald-500/50 bg-emerald-950/60 text-emerald-300'
                  : 'border-slate-700 bg-space-950 text-slate-400'
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
                      : 'border-slate-700 text-slate-400 bg-space-900'
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
              className="p-1.5 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-cyan-300 transition-colors"
              title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-white transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Animated Concentric Mechanical Rings Graphic */}
          <div className="relative flex items-center justify-center py-4">
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              {/* Outer Gear Ring */}
              <svg
                className={`absolute inset-0 w-full h-full text-cyan-500/20 transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-spin text-cyan-400/60'
                    : state.unlockStatus === 'UNLOCKED'
                    ? 'rotate-45 text-emerald-400/40 scale-105'
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

              {/* Middle Rotating Iris Ring */}
              <svg
                className={`absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] text-violet-500/30 transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-reverse-spin text-violet-400/60'
                    : state.unlockStatus === 'UNLOCKED'
                    ? '-rotate-90 text-emerald-400/40 scale-110'
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
                className={`absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] transition-all duration-500 ${
                  state.unlockStatus === 'UNLOCKED' ? 'text-emerald-400/60' : 'text-cyan-400/40'
                }`}
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
                <line x1="100" y1="36" x2="100" y2="48" stroke="currentColor" strokeWidth="2" />
                <line x1="100" y1="152" x2="100" y2="164" stroke="currentColor" strokeWidth="2" />
                <line x1="36" y1="100" x2="48" y2="100" stroke="currentColor" strokeWidth="2" />
                <line x1="152" y1="100" x2="164" y2="100" stroke="currentColor" strokeWidth="2" />
              </svg>

              {/* Central Core Status Reactor */}
              <div
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all duration-700 ${
                  state.unlockStatus === 'UNLOCKED'
                    ? 'bg-emerald-950 border-emerald-400 shadow-2xl shadow-emerald-500/40 scale-110'
                    : state.unlockStatus === 'VERIFYING'
                    ? 'bg-cyan-950 border-cyan-400 shadow-2xl shadow-cyan-400/50 animate-pulse'
                    : 'bg-space-900 border-slate-700'
                }`}
              >
                {state.unlockStatus === 'UNLOCKED' ? (
                  <>
                    <Unlock className="w-8 h-8 text-emerald-400 animate-bounce" />
                    <span className="text-[10px] font-mono font-bold text-emerald-300 mt-1">OPEN</span>
                  </>
                ) : state.unlockStatus === 'VERIFYING' ? (
                  <>
                    <Sparkles className="w-8 h-8 text-cyan-300 animate-spin" />
                    <span className="text-[9px] font-mono font-bold text-cyan-300 mt-1">AUTH</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-slate-400" />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">LOCKED</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Verification Prerequisites Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            <div
              className={`p-3 rounded border flex items-center justify-between ${
                state.keyDiscovered
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900 text-slate-500'
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
              className={`p-3 rounded border flex items-center justify-between ${
                state.anomalyConfirmed
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900 text-slate-500'
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
              className={`p-3 rounded border flex items-center justify-between ${
                state.cipherDecoded
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-slate-800 bg-space-900 text-slate-500'
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
              className={`p-3 rounded border flex items-center justify-between ${
                isStable
                  ? 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300'
                  : 'border-amber-500/40 bg-amber-950/20 text-amber-300'
              }`}
            >
              <span>SIGNAL: {state.currentPhase}</span>
              {isStable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Clock className="w-4 h-4 text-amber-400" />
              )}
            </div>
          </div>

          {/* Culmination: Unlocked Transmission Reveal vs Submission Form */}
          {state.unlockStatus === 'UNLOCKED' ? (
            <div className="p-6 sm:p-8 rounded-lg bg-space-900/90 border border-emerald-500/50 space-y-6">
              <div className="flex items-center gap-3 text-emerald-300 border-b border-emerald-500/20 pb-4">
                <ShieldCheck className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-xl text-white tracking-wider">
                    DECRYPTED TRANSMISSION ARCHIVE RECOVERED
                  </h3>
                  <div className="text-xs font-mono text-emerald-400/80">
                    CLEARED FOR PLAYBACK // ORIGIN: DEEP SPACE EXPEDITION
                  </div>
                </div>
              </div>

              {/* The Decrypted Message Card */}
              <div className="p-6 rounded bg-space-950 border border-slate-800 font-mono space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-800/80 pb-2">
                  <span>PAYLOAD STREAM: 0x88F9_FINAL</span>
                  <span className="text-emerald-400">STATUS: DECRYPTED</span>
                </div>

                <div className="text-2xl sm:text-3xl font-display font-extrabold tracking-widest text-emerald-300">
                  &quot;THE LAST SIGNAL&quot;
                </div>

                <div className="text-sm leading-relaxed text-slate-300 italic pt-2">
                  <TerminalText
                    text="To all listening exploratory vessels across the quadrant: The anomaly has stabilized. The carrier network has held. The archive is secured for all future transmissions. Transmission sequence complete."
                    speed={18}
                  />
                </div>
              </div>

              {/* Mission Summary Debrief */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-slate-400 pt-3 border-t border-slate-800">
                <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">MISSION SESSION</div>
                  <div className="text-white font-bold">{state.missionId}</div>
                </div>
                <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">SECURITY STATUS</div>
                  <div className="text-emerald-400 font-bold">UNLOCKED</div>
                </div>
                <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">CROSS-TAB SYNC</div>
                  <div className="text-cyan-300 font-bold">BROADCAST ACTIVE</div>
                </div>
                <div className="p-2.5 rounded bg-space-950 border border-slate-800">
                  <div className="text-slate-500 text-[10px] uppercase">DIGEST VERIFICATION</div>
                  <div className="text-violet-300 font-bold">SHA-256 MATCH</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => resetMission()}
                  className="px-4 py-2 rounded border border-slate-800 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  RESTART MISSION PROTOCOL
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="vault-input"
                  className="block text-xs font-mono text-slate-300 mb-2 flex items-center justify-between"
                >
                  <span>SUBMIT DECRYPTED TRANSMISSION PASSPHRASE:</span>
                  <span className="text-slate-500">FORMAT: &quot;THE LAST SIGNAL&quot;</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="vault-input"
                    type="text"
                    placeholder="Enter decrypted message..."
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded bg-space-950 border border-slate-800 focus:border-cyan-400 text-white font-mono text-sm tracking-widest uppercase outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      isStable && hasAllPrerequisites
                        ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-lg shadow-cyan-500/30'
                        : 'bg-space-900 border border-slate-700 text-slate-400'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        AUTHENTICATING DIGEST...
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

              {/* Error Alert */}
              {(errorMessage || state.error) && (
                <div className="p-3.5 rounded bg-rose-950/40 border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start justify-between gap-3">
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

              {/* Real-time Guidance Banner */}
              <div className="p-3 rounded bg-space-900 border border-slate-800 text-xs font-mono text-slate-400 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>
                    Temporal Lock:{' '}
                    {isStable ? (
                      <span className="text-emerald-400 font-bold">
                        STABLE RESONANCE ACTIVE [{state.phaseSecondsRemaining}s window]
                      </span>
                    ) : (
                      <span className="text-amber-400">
                        {state.currentPhase} phase. Wait for STABLE window ({state.phaseSecondsRemaining}s).
                      </span>
                    )}
                  </span>
                </div>

                {state.cipherDecoded && (
                  <button
                    type="button"
                    onClick={() => setInputAnswer('THE LAST SIGNAL')}
                    className="text-[11px] text-cyan-400 hover:underline"
                  >
                    Autofill &quot;THE LAST SIGNAL&quot;
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
