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
  Play,
  Square,
  Download,
} from 'lucide-react';
import { TerminalText } from '../common/TerminalText';
import { RadioVoice } from '../../utils/radioVoice';
import { exportMissionDossier } from '../../utils/exportDossier';

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
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  useEffect(() => {
    return () => {
      RadioVoice.stop();
    };
  }, []);

  // Trigger celebratory confetti on unlock
  useEffect(() => {
    if (state.unlockStatus === 'UNLOCKED') {
      try {
        confetti({
          particleCount: 110,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#22D3EE', '#8B7CFF', '#FFB454', '#E8EDF5'],
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
        className={`relative w-full max-w-4xl bg-noir-surface border rounded overflow-hidden my-auto transition-all duration-700 ${
          state.unlockStatus === 'UNLOCKED'
            ? 'border-signal-cyan/50 shadow-2xl shadow-signal-cyan/10'
            : 'border-noir-border shadow-2xl'
        } ${errorMessage ? 'animate-glitch' : ''}`}
      >
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 scanlines-subtle opacity-25 pointer-events-none" />

        {/* Modal Top Telemetry Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-noir-border bg-noir-base/80">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded border transition-colors ${
                state.unlockStatus === 'UNLOCKED'
                  ? 'border-signal-cyan/40 bg-noir-surface text-signal-cyan'
                  : 'border-noir-border bg-noir-surface text-signal-dim'
              }`}
            >
              {state.unlockStatus === 'UNLOCKED' ? (
                <Unlock className="w-5 h-5 text-signal-cyan" />
              ) : (
                <Lock className="w-5 h-5 text-signal-dim" />
              )}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg lg:text-xl text-signal-text tracking-tight flex items-center gap-2">
                CLASSIFIED ARCHIVE // CORE VAULT
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                    state.unlockStatus === 'UNLOCKED'
                      ? 'border-signal-cyan/40 text-signal-cyan bg-noir-base'
                      : 'border-noir-border text-signal-dim bg-noir-base'
                  }`}
                >
                  {state.unlockStatus}
                </span>
              </h2>
              <div className="text-xs font-mono text-signal-dim">
                AUTH: SHA-256 // TEMPORAL_PHASE: {state.currentPhase} [{state.phaseSecondsRemaining}s]
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-1.5 rounded border border-noir-border hover:border-signal-cyan/40 text-signal-dim hover:text-signal-cyan transition-colors"
              title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded border border-noir-border hover:border-signal-muted text-signal-dim hover:text-signal-text transition-colors"
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
                className={`absolute inset-0 w-full h-full text-signal-cyan/25 transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-spin text-signal-cyan/60'
                    : state.unlockStatus === 'UNLOCKED'
                    ? 'rotate-45 text-signal-cyan/50 scale-105'
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
                  strokeWidth="1.2"
                  strokeDasharray="6 8"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="86"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="0.6"
                />
              </svg>

              {/* Middle Rotating Iris Ring */}
              <svg
                className={`absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] text-signal-violet/30 transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-reverse-spin text-signal-violet/60'
                    : state.unlockStatus === 'UNLOCKED'
                    ? '-rotate-90 text-signal-cyan/40 scale-110'
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
                  strokeWidth="2"
                  strokeDasharray="25 15 5 15"
                />
              </svg>

              {/* Inner Optical Reticle */}
              <svg
                className={`absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] transition-all duration-500 ${
                  state.unlockStatus === 'UNLOCKED' ? 'text-signal-cyan/60' : 'text-signal-cyan/35'
                }`}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                />
                <line x1="100" y1="36" x2="100" y2="48" stroke="currentColor" strokeWidth="1.5" />
                <line x1="100" y1="152" x2="100" y2="164" stroke="currentColor" strokeWidth="1.5" />
                <line x1="36" y1="100" x2="48" y2="100" stroke="currentColor" strokeWidth="1.5" />
                <line x1="152" y1="100" x2="164" y2="100" stroke="currentColor" strokeWidth="1.5" />
              </svg>

              {/* Central Core Status Reactor */}
              <div
                className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center border transition-all duration-700 ${
                  state.unlockStatus === 'UNLOCKED'
                    ? 'bg-noir-base border-signal-cyan shadow-xl shadow-signal-cyan/30 scale-110'
                    : state.unlockStatus === 'VERIFYING'
                    ? 'bg-noir-base border-signal-cyan shadow-xl shadow-signal-cyan/40 animate-pulse'
                    : 'bg-noir-base border-noir-border'
                }`}
              >
                {state.unlockStatus === 'UNLOCKED' ? (
                  <>
                    <Unlock className="w-8 h-8 text-signal-cyan animate-bounce" />
                    <span className="text-[10px] font-mono font-bold text-signal-cyan mt-1">OPEN</span>
                  </>
                ) : state.unlockStatus === 'VERIFYING' ? (
                  <>
                    <Sparkles className="w-8 h-8 text-signal-cyan animate-spin" />
                    <span className="text-[9px] font-mono font-bold text-signal-cyan mt-1">AUTH</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-8 h-8 text-signal-dim" />
                    <span className="text-[9px] font-mono text-signal-dim mt-1">LOCKED</span>
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
                  ? 'border-signal-violet/40 bg-signal-violet/10 text-signal-violet font-semibold'
                  : 'border-noir-border bg-noir-base text-signal-dim'
              }`}
            >
              <span>KEY RECOVERED</span>
              {state.keyDiscovered ? (
                <CheckCircle2 className="w-4 h-4 text-signal-violet" />
              ) : (
                <XCircle className="w-4 h-4 text-signal-dim" />
              )}
            </div>

            <div
              className={`p-3 rounded border flex items-center justify-between ${
                state.anomalyConfirmed
                  ? 'border-signal-amber/40 bg-signal-amber/10 text-signal-amber font-semibold'
                  : 'border-noir-border bg-noir-base text-signal-dim'
              }`}
            >
              <span>DOM ANOMALY</span>
              {state.anomalyConfirmed ? (
                <CheckCircle2 className="w-4 h-4 text-signal-amber" />
              ) : (
                <XCircle className="w-4 h-4 text-signal-dim" />
              )}
            </div>

            <div
              className={`p-3 rounded border flex items-center justify-between ${
                state.cipherDecoded
                  ? 'border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan font-semibold'
                  : 'border-noir-border bg-noir-base text-signal-dim'
              }`}
            >
              <span>CIPHER DECODED</span>
              {state.cipherDecoded ? (
                <CheckCircle2 className="w-4 h-4 text-signal-cyan" />
              ) : (
                <XCircle className="w-4 h-4 text-signal-dim" />
              )}
            </div>

            <div
              className={`p-3 rounded border flex items-center justify-between ${
                isStable
                  ? 'border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan font-semibold'
                  : 'border-signal-amber/40 bg-signal-amber/10 text-signal-amber'
              }`}
            >
              <span>SIGNAL: {state.currentPhase}</span>
              {isStable ? (
                <CheckCircle2 className="w-4 h-4 text-signal-cyan" />
              ) : (
                <Clock className="w-4 h-4 text-signal-amber" />
              )}
            </div>
          </div>

          {/* Culmination: Unlocked Transmission Reveal vs Submission Form */}
          {state.unlockStatus === 'UNLOCKED' ? (
            <div className="p-6 sm:p-8 rounded bg-noir-base border border-signal-cyan/40 space-y-6">
              <div className="flex items-center gap-3 text-signal-cyan border-b border-noir-border pb-4">
                <ShieldCheck className="w-6 h-6 text-signal-cyan flex-shrink-0" />
                <div>
                  <h3 className="font-display font-bold text-xl text-signal-text tracking-tight">
                    DECRYPTED TRANSMISSION ARCHIVE RECOVERED
                  </h3>
                  <div className="text-xs font-mono text-signal-cyan mt-0.5">
                    CLEARED FOR PLAYBACK // ORIGIN: DEEP SPACE EXPEDITION
                  </div>
                </div>
              </div>

              {/* The Decrypted Message Card */}
              <div className="p-6 rounded bg-noir-surface border border-noir-border font-mono space-y-4">
                <div className="flex items-center justify-between text-xs text-signal-dim border-b border-noir-border pb-2">
                  <span>PAYLOAD STREAM: 0x88F9_FINAL</span>
                  <span className="text-signal-cyan font-bold">STATUS: DECRYPTED</span>
                </div>

                <div className="text-2xl sm:text-3xl font-display font-extrabold tracking-widest text-signal-cyan">
                  &quot;THE LAST SIGNAL&quot;
                </div>

                <div className="text-sm leading-relaxed text-signal-text italic pt-2">
                  <TerminalText
                    text="To all listening exploratory vessels across the quadrant: The anomaly has stabilized. The carrier network has held. The archive is secured for all future transmissions. Transmission sequence complete."
                    speed={18}
                  />
                </div>
              </div>

              {/* Interactive Audio Log & Export Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded bg-noir-surface border border-noir-border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (isPlayingVoice) {
                        RadioVoice.stop();
                        setIsPlayingVoice(false);
                      } else {
                        setIsPlayingVoice(true);
                        RadioVoice.speak(
                          "To all listening exploratory vessels across the quadrant: The anomaly has stabilized. The carrier network has held. The archive is secured for all future transmissions. Transmission sequence complete.",
                          () => setIsPlayingVoice(false)
                        );
                      }
                    }}
                    className={`px-3.5 py-2 rounded border text-xs font-mono flex items-center gap-2 transition-all ${
                      isPlayingVoice
                        ? 'border-signal-cyan bg-signal-cyan/15 text-signal-cyan animate-pulse'
                        : 'border-noir-border bg-noir-base text-signal-text hover:text-signal-cyan hover:border-signal-cyan/40'
                    }`}
                  >
                    {isPlayingVoice ? (
                      <Square className="w-3.5 h-3.5 fill-signal-cyan" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isPlayingVoice ? 'HALT AUDIO PLAYBACK' : 'PLAY TRANSMISSION AUDIO LOG'}</span>
                  </button>

                  {isPlayingVoice && (
                    <div className="flex items-center gap-1">
                      <span className="w-1 h-3 bg-signal-cyan animate-pulse" />
                      <span className="w-1 h-5 bg-signal-cyan animate-pulse delay-75" />
                      <span className="w-1 h-2 bg-signal-cyan animate-pulse delay-150" />
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => exportMissionDossier(state)}
                  className="px-4 py-2 rounded bg-signal-cyan hover:bg-[#38BDF8] text-[#070A12] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-sm active:scale-95"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>EXPORT CLASSIFIED DOSSIER (.TXT)</span>
                </button>
              </div>

              {/* Mission Summary Debrief */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs text-signal-muted pt-3 border-t border-noir-border">
                <div className="p-2.5 rounded bg-noir-surface border border-noir-border">
                  <div className="text-signal-dim text-[10px] uppercase">MISSION SESSION</div>
                  <div className="text-signal-text font-bold">{state.missionId}</div>
                </div>
                <div className="p-2.5 rounded bg-noir-surface border border-noir-border">
                  <div className="text-signal-dim text-[10px] uppercase">SECURITY STATUS</div>
                  <div className="text-signal-cyan font-bold">UNLOCKED</div>
                </div>
                <div className="p-2.5 rounded bg-noir-surface border border-noir-border">
                  <div className="text-signal-dim text-[10px] uppercase">CROSS-TAB SYNC</div>
                  <div className="text-signal-text font-bold">BROADCAST ACTIVE</div>
                </div>
                <div className="p-2.5 rounded bg-noir-surface border border-noir-border">
                  <div className="text-signal-dim text-[10px] uppercase">DIGEST VERIFICATION</div>
                  <div className="text-signal-violet font-bold">SHA-256 MATCH</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => resetMission()}
                  className="px-4 py-2 rounded border border-noir-border text-signal-dim hover:text-signal-amber hover:border-signal-amber/40 transition-colors flex items-center gap-2"
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
                  className="block text-xs font-mono text-signal-muted mb-2 flex items-center justify-between"
                >
                  <span>SUBMIT DECRYPTED TRANSMISSION PASSPHRASE:</span>
                  <span className="text-signal-dim">FORMAT: &quot;THE LAST SIGNAL&quot;</span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="vault-input"
                    type="text"
                    placeholder="Enter decrypted message..."
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded bg-noir-base border border-noir-border focus:border-signal-cyan text-signal-text font-mono text-sm tracking-widest uppercase outline-none transition-all"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-6 py-3 rounded font-display font-bold text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 ${
                      isStable && hasAllPrerequisites
                        ? 'bg-signal-cyan hover:bg-[#38BDF8] text-[#070A12] shadow-sm'
                        : 'bg-noir-base border border-noir-border text-signal-dim'
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
                <div className="p-3.5 rounded bg-noir-base border border-rose-500/40 text-xs font-mono text-rose-300 flex items-start justify-between gap-3">
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
              <div className="p-3 rounded bg-noir-base border border-noir-border text-xs font-mono text-signal-dim flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-signal-cyan" />
                  <span>
                    Temporal Gate:{' '}
                    {isStable ? (
                      <span className="text-signal-cyan font-bold">
                        STABLE RESONANCE ACTIVE [{state.phaseSecondsRemaining}s window]
                      </span>
                    ) : (
                      <span className="text-signal-amber">
                        {state.currentPhase} phase. Wait for STABLE window ({state.phaseSecondsRemaining}s).
                      </span>
                    )}
                  </span>
                </div>

                {state.cipherDecoded && (
                  <button
                    type="button"
                    onClick={() => setInputAnswer('THE LAST SIGNAL')}
                    className="text-[11px] text-signal-cyan hover:underline"
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
