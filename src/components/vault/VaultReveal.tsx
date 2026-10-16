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
import { SupernovaCanvas } from '../effects/SupernovaCanvas';
import { RadioVoice } from '../../utils/radioVoice';
import { SoundFX } from '../../utils/audio';
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
  const [supernovaKey, setSupernovaKey] = useState<number>(0);

  useEffect(() => {
    return () => {
      RadioVoice.stop();
    };
  }, []);

  // Trigger celebratory Supernova burst and confetti on unlock
  useEffect(() => {
    if (state.unlockStatus === 'UNLOCKED') {
      setSupernovaKey((prev) => prev + 1);
      SoundFX.playSupernova();
      try {
        confetti({
          particleCount: 140,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#00f0ff', '#8b5cf6', '#f59e0b', '#10b981', '#ffffff'],
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-space-950/95 backdrop-blur-xl flex items-center justify-center p-4 sm:p-6 font-mono">
      <div
        className={`relative w-full max-w-4xl bg-space-900 border rounded-2xl overflow-hidden my-auto transition-all duration-700 ${
          state.unlockStatus === 'UNLOCKED'
            ? 'border-emerald-500/70 shadow-[0_0_60px_rgba(16,185,129,0.25)]'
            : 'border-cyan/40 shadow-[0_0_50px_rgba(0,240,255,0.15)]'
        } ${errorMessage ? 'animate-glitch' : ''}`}
      >
        {/* Subtle scanline overlay */}
        <div className="absolute inset-0 scanlines-subtle opacity-20 pointer-events-none" />

        {/* Cinematic Supernova Singularity Detonation Canvas - Boosted Opacity */}
        {state.unlockStatus === 'UNLOCKED' && (
          <SupernovaCanvas
            active={true}
            triggerKey={supernovaKey}
            className="pointer-events-none z-0 opacity-80"
          />
        )}

        {/* Modal Top Telemetry Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-space-950/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-lg border transition-colors ${
                state.unlockStatus === 'UNLOCKED'
                  ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300 shadow-md shadow-emerald-500/20'
                  : 'border-cyan/50 bg-cyan/15 text-cyan'
              }`}
            >
              {state.unlockStatus === 'UNLOCKED' ? (
                <Unlock className="w-5 h-5 text-emerald-400" />
              ) : (
                <Lock className="w-5 h-5 text-cyan" />
              )}
            </div>
            <div>
              <h2 className="font-display font-black text-lg lg:text-xl text-white tracking-wider flex items-center gap-2">
                CLASSIFIED ARCHIVE // CORE VAULT
                <span
                  className={`text-[11px] font-mono px-2.5 py-0.5 rounded border uppercase font-black ${
                    state.unlockStatus === 'UNLOCKED'
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 text-glow-emerald shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                      : 'border-cyan/50 text-cyan bg-cyan/15 text-glow-cyan'
                  }`}
                >
                  {state.unlockStatus}
                </span>
              </h2>
              <div className="text-xs font-mono text-cyan-300 flex items-center gap-2 mt-0.5">
                <span>AUTH: <strong className="text-violet-300 font-bold">SHA-256</strong></span>
                <span className="text-slate-600">//</span>
                <span>
                  TEMPORAL_PHASE:{' '}
                  <strong
                    className={
                      state.currentPhase === 'STABLE'
                        ? 'text-emerald-300 font-bold text-glow-emerald'
                        : 'text-amber-400 font-bold'
                    }
                  >
                    {state.currentPhase} [{state.phaseSecondsRemaining}s]
                  </strong>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleAudio}
              className="p-2 rounded bg-space-900 border border-slate-700 hover:border-cyan text-slate-300 hover:text-cyan transition-colors"
              title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            >
              <Volume2 className="w-4 h-4" />
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded bg-space-900 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-rose-400 transition-colors"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Modal Main Body */}
        <div className="relative z-10 p-6 sm:p-8 space-y-6">
          {/* Animated Concentric Mechanical Rings Graphic - Radiant Colors */}
          <div className="relative flex items-center justify-center py-8 bg-space-950/90 border border-slate-800 rounded-xl my-1 overflow-hidden shadow-inner">
            {/* Ambient Nebula Aura */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.12)_0%,rgba(139,92,246,0.1)_45%,transparent_75%)] pointer-events-none" />

            <div className="relative w-72 h-72 sm:w-80 sm:h-80 flex items-center justify-center">
              {/* Outer Gear Ring - Glowing Electric Cyan */}
              <svg
                className={`absolute inset-0 w-full h-full text-cyan transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-spin'
                    : state.unlockStatus === 'UNLOCKED'
                    ? 'rotate-45'
                    : 'animate-spin-slow'
                }`}
                style={{ filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))' }}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="92"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="85"
                  fill="none"
                  stroke="#00f0ff"
                  strokeWidth="1.2"
                />
              </svg>

              {/* Middle Rotating Iris Ring - Glowing Astral Violet */}
              <svg
                className={`absolute inset-4 w-[calc(100%-32px)] h-[calc(100%-32px)] text-violet transition-all duration-700 ${
                  state.unlockStatus === 'VERIFYING'
                    ? 'animate-reverse-spin'
                    : state.unlockStatus === 'UNLOCKED'
                    ? '-rotate-90'
                    : 'animate-reverse-spin'
                }`}
                style={{ filter: 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' }}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                  strokeDasharray="25 15 5 15"
                />
              </svg>

              {/* Inner Optical Reticle - Glowing Solar Gold / Amber */}
              <svg
                className="absolute inset-8 w-[calc(100%-64px)] h-[calc(100%-64px)] text-amber transition-all duration-500"
                style={{ filter: 'drop-shadow(0 0 6px rgba(245, 158, 11, 0.6))' }}
                viewBox="0 0 200 200"
              >
                <circle
                  cx="100"
                  cy="100"
                  r="54"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                />
                <line x1="100" y1="36" x2="100" y2="48" stroke="#f59e0b" strokeWidth="2" />
                <line x1="100" y1="152" x2="100" y2="164" stroke="#f59e0b" strokeWidth="2" />
                <line x1="36" y1="100" x2="48" y2="100" stroke="#f59e0b" strokeWidth="2" />
                <line x1="152" y1="100" x2="164" y2="100" stroke="#f59e0b" strokeWidth="2" />
              </svg>

              {/* Central Core Status Reactor - Radiant Illuminated Core */}
              <div
                className={`relative z-10 w-28 h-28 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-700 ${
                  state.unlockStatus === 'UNLOCKED'
                    ? 'bg-gradient-to-br from-emerald-950 via-space-950 to-cyan-950 border-emerald-400 text-emerald-300 shadow-[0_0_40px_rgba(16,185,129,0.55)]'
                    : state.unlockStatus === 'VERIFYING'
                    ? 'bg-gradient-to-br from-violet-950 to-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_35px_rgba(0,240,255,0.55)] animate-pulse'
                    : 'bg-gradient-to-br from-space-900 to-space-950 border-cyan-500/60 text-cyan-200 shadow-[0_0_30px_rgba(0,240,255,0.3)]'
                }`}
              >
                {state.unlockStatus === 'UNLOCKED' ? (
                  <>
                    <Unlock className="w-9 h-9 text-emerald-300 animate-bounce" strokeWidth={2} />
                    <span className="text-xs font-mono font-black tracking-widest text-emerald-300 mt-1 text-glow-emerald">
                      OPEN
                    </span>
                  </>
                ) : state.unlockStatus === 'VERIFYING' ? (
                  <>
                    <Sparkles className="w-9 h-9 text-cyan-300 animate-spin" strokeWidth={2} />
                    <span className="text-[11px] font-mono font-black text-cyan-300 tracking-wider mt-1 text-glow-cyan">
                      AUTH
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-9 h-9 text-cyan-300" strokeWidth={2} />
                    <span className="text-[11px] font-mono font-black text-cyan-300 tracking-wider mt-1 text-glow-cyan">
                      SECURE
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Verification Prerequisites Grid - Highly Visible & Vibrant */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            {/* Key */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                state.keyDiscovered
                  ? 'border-violet/60 bg-violet/20 text-violet-200 font-bold shadow-md shadow-violet/15'
                  : 'border-slate-700 bg-space-950 text-slate-200 font-semibold'
              }`}
            >
              <span className="tracking-wide">KEY RECOVERED</span>
              {state.keyDiscovered ? (
                <CheckCircle2 className="w-4 h-4 text-violet text-glow-violet" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            {/* Anomaly */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                state.anomalyConfirmed
                  ? 'border-amber/60 bg-amber/20 text-amber-200 font-bold shadow-md shadow-amber/15'
                  : 'border-slate-700 bg-space-950 text-slate-200 font-semibold'
              }`}
            >
              <span className="tracking-wide">DOM ANOMALY</span>
              {state.anomalyConfirmed ? (
                <CheckCircle2 className="w-4 h-4 text-amber text-glow-amber" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            {/* Cipher */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                state.cipherDecoded
                  ? 'border-cyan/60 bg-cyan/20 text-cyan-200 font-bold shadow-md shadow-cyan/15'
                  : 'border-slate-700 bg-space-950 text-slate-200 font-semibold'
              }`}
            >
              <span className="tracking-wide">CIPHER DECODED</span>
              {state.cipherDecoded ? (
                <CheckCircle2 className="w-4 h-4 text-cyan text-glow-cyan" />
              ) : (
                <XCircle className="w-4 h-4 text-rose-400" />
              )}
            </div>

            {/* Phase */}
            <div
              className={`p-3.5 rounded-lg border flex items-center justify-between transition-all ${
                isStable
                  ? 'border-emerald-500/60 bg-emerald-500/20 text-emerald-200 font-bold shadow-md shadow-emerald-500/15'
                  : 'border-amber/50 bg-amber/15 text-amber-200 font-semibold'
              }`}
            >
              <span className="tracking-wide">SIGNAL: {state.currentPhase}</span>
              {isStable ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 text-glow-emerald" />
              ) : (
                <Clock className="w-4 h-4 text-amber" />
              )}
            </div>
          </div>

          {/* Culmination: Unlocked Transmission Reveal vs Submission Form */}
          {state.unlockStatus === 'UNLOCKED' ? (
            <div className="p-6 sm:p-8 rounded-xl bg-space-950 border-2 border-emerald-500/50 space-y-6 shadow-2xl shadow-emerald-500/20">
              <div className="flex items-center gap-3 text-emerald-300 border-b border-slate-800 pb-4">
                <ShieldCheck className="w-7 h-7 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-wider text-glow-emerald">
                    DECRYPTED TRANSMISSION ARCHIVE RECOVERED
                  </h3>
                  <div className="text-xs font-mono text-cyan-300 font-extrabold mt-0.5">
                    CLEARED FOR PLAYBACK // ORIGIN: DEEP SPACE QUADRANT OMEGA
                  </div>
                </div>
              </div>

              {/* The Decrypted Message Card */}
              <div className="p-6 rounded-xl bg-space-900 border border-emerald-500/40 font-mono space-y-4 shadow-inner">
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2.5">
                  <span className="text-violet-300 font-black tracking-wider uppercase">
                    PAYLOAD STREAM: 0x88F9_FINAL
                  </span>
                  <span className="text-emerald-300 font-black flex items-center gap-1.5 text-glow-emerald">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    STATUS: DECRYPTED &amp; BROADCAST
                  </span>
                </div>

                <div className="text-3xl sm:text-5xl font-display font-black tracking-widest bg-gradient-to-r from-emerald-300 via-cyan-200 to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(0,240,255,0.5)] select-all py-1">
                  &quot;THE LAST SIGNAL&quot;
                </div>

                <div className="text-sm leading-relaxed text-slate-100 italic pt-2 font-mono">
                  <TerminalText
                    text="To all listening exploratory vessels across the quadrant: The anomaly has stabilized. The carrier network has held. The archive is secured for all future transmissions. Transmission sequence complete."
                    speed={18}
                  />
                </div>
              </div>

              {/* Interactive Audio Log & Export Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-space-900 border border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
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
                    className={`px-4 py-2.5 rounded-lg border text-xs font-mono font-black flex items-center gap-2 transition-all ${
                      isPlayingVoice
                        ? 'border-cyan bg-cyan/20 text-cyan animate-pulse text-glow-cyan'
                        : 'border-cyan/40 bg-space-950 text-cyan-200 hover:text-cyan hover:border-cyan hover:bg-space-900'
                    }`}
                  >
                    {isPlayingVoice ? (
                      <Square className="w-3.5 h-3.5 fill-cyan" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isPlayingVoice ? 'HALT AUDIO PLAYBACK' : 'PLAY TRANSMISSION AUDIO LOG'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSupernovaKey((k) => k + 1);
                      SoundFX.playSupernova();
                    }}
                    className="px-4 py-2.5 rounded-lg border border-violet/50 bg-violet/15 hover:bg-violet/25 text-violet font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(139,92,246,0.25)] text-glow-violet active:scale-95"
                    title="Detonate cosmic supernova shockwave burst"
                  >
                    <Sparkles className="w-4 h-4 text-violet animate-spin" />
                    <span>RE-IGNITE SUPERNOVA</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => exportMissionDossier(state)}
                  className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan to-emerald-400 hover:brightness-110 text-slate-950 font-display font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-xl shadow-cyan/30 active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>EXPORT CLASSIFIED DOSSIER (.TXT)</span>
                </button>
              </div>

              {/* Mission Summary Debrief - Bold, High-Contrast & Beautiful */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs pt-3 border-t border-slate-800">
                <div className="p-3.5 rounded-lg bg-space-900 border border-cyan/40 shadow-sm shadow-cyan/10">
                  <div className="text-cyan-400 text-xs font-black uppercase tracking-wider mb-1">
                    MISSION SESSION
                  </div>
                  <div className="text-white font-extrabold text-sm">{state.missionId}</div>
                </div>

                <div className="p-3.5 rounded-lg bg-space-900 border border-emerald-500/40 shadow-sm shadow-emerald-500/10">
                  <div className="text-emerald-400 text-xs font-black uppercase tracking-wider mb-1">
                    SECURITY STATUS
                  </div>
                  <div className="text-emerald-300 font-black text-sm text-glow-emerald">
                    UNLOCKED // VERIFIED
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-space-900 border border-violet/40 shadow-sm shadow-violet/10">
                  <div className="text-violet-400 text-xs font-black uppercase tracking-wider mb-1">
                    CROSS-TAB SYNC
                  </div>
                  <div className="text-violet-200 font-black text-sm text-glow-violet">
                    BROADCAST ACTIVE
                  </div>
                </div>

                <div className="p-3.5 rounded-lg bg-space-900 border border-amber/40 shadow-sm shadow-amber/10">
                  <div className="text-amber-400 text-xs font-black uppercase tracking-wider mb-1">
                    DIGEST VERIFICATION
                  </div>
                  <div className="text-amber-300 font-black text-sm text-glow-amber">
                    SHA-256 MATCH
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2 font-mono text-xs">
                <button
                  onClick={() => resetMission()}
                  className="px-4 py-2 rounded-lg border border-rose-900/50 bg-space-900 text-rose-300 hover:bg-rose-950 hover:border-rose-600 transition-colors flex items-center gap-2 font-bold"
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
                  className="block text-xs font-mono mb-2 flex items-center justify-between"
                >
                  <span className="text-cyan-300 font-extrabold tracking-wide uppercase">
                    SUBMIT DECRYPTED TRANSMISSION PASSPHRASE:
                  </span>
                  <span className="text-violet-300 font-mono font-bold text-glow-violet">
                    FORMAT: &quot;THE LAST SIGNAL&quot;
                  </span>
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    id="vault-input"
                    type="text"
                    placeholder="Enter decrypted message..."
                    value={inputAnswer}
                    onChange={(e) => setInputAnswer(e.target.value)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg bg-space-950 border-2 border-cyan/40 focus:border-cyan text-white font-mono font-black text-base tracking-widest uppercase outline-none transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] focus:shadow-[0_0_20px_rgba(0,240,255,0.3)] placeholder:text-slate-500"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`px-7 py-3 rounded-lg font-display font-black text-sm tracking-wider uppercase transition-all flex items-center justify-center gap-2 shadow-xl ${
                      isStable && hasAllPrerequisites
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/30'
                        : 'bg-cyan hover:bg-cyan/90 text-slate-950 shadow-cyan/25'
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
                <div className="p-4 rounded-lg bg-rose-950/70 border border-rose-600/50 text-xs font-mono text-rose-200 flex items-start justify-between gap-3 shadow-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-black text-rose-300">VERIFICATION REJECTED:</span>{' '}
                      {errorMessage || state.error}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage(null);
                      retrySequence();
                    }}
                    className="text-xs font-bold underline hover:text-white"
                  >
                    DISMISS
                  </button>
                </div>
              )}

              {/* Real-time Guidance Banner */}
              <div className="p-3.5 rounded-lg bg-space-950 border border-slate-800 text-xs font-mono flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan" />
                  <span className="text-slate-200">
                    Temporal Gate:{' '}
                    {isStable ? (
                      <span className="text-emerald-300 font-extrabold text-glow-emerald">
                        STABLE RESONANCE ACTIVE [{state.phaseSecondsRemaining}s window]
                      </span>
                    ) : (
                      <span className="text-amber-300 font-bold">
                        {state.currentPhase} phase. Wait for STABLE window ({state.phaseSecondsRemaining}s).
                      </span>
                    )}
                  </span>
                </div>

                {state.cipherDecoded && (
                  <button
                    type="button"
                    onClick={() => setInputAnswer('THE LAST SIGNAL')}
                    className="text-xs text-cyan font-bold hover:underline"
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
