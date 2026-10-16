import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { CIPHERTEXT, caesarShift } from '../../engine/cipher';
import {
  Radio,
  Sliders,
  CheckCircle2,
  Lock,
  Unlock,
  Sparkles,
  Send,
  RotateCw,
  AlertCircle,
  Copy,
  Check,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

interface TransmissionRoleProps {
  onOpenVault?: () => void;
}

export const TransmissionRole: React.FC<TransmissionRoleProps> = ({ onOpenVault }) => {
  const {
    state,
    decodeCipher,
    submitFinalVault,
    retrySequence,
  } = useMission();

  const [shift, setShift] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [candidateInput, setCandidateInput] = useState<string>(
    state.cipherDecoded ? 'THE LAST SIGNAL' : ''
  );
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const decodedPreview = caesarShift(CIPHERTEXT, shift);
  const isMatch = decodedPreview === 'THE LAST SIGNAL';
  const isCipherDecoded = Boolean(state.cipherDecoded || state.completedStages?.transmission);
  const isStable = state.currentPhase === 'STABLE';

  const handleShiftChange = (newShift: number) => {
    setShift(newShift);
    SoundFX.playTick();
  };

  const handleCopyCipher = () => {
    navigator.clipboard.writeText(CIPHERTEXT);
    setCopied(true);
    SoundFX.playTick();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCommitDecode = () => {
    const success = decodeCipher(decodedPreview);
    if (success) {
      SoundFX.playSuccessPing();
      setCandidateInput('THE LAST SIGNAL');
    } else {
      SoundFX.playWarning();
    }
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateInput.trim()) {
      setSubmitError('Please enter the confirmation code.');
      return;
    }

    setSubmitError(null);
    setIsVerifying(true);
    SoundFX.playTick();

    const res = await submitFinalVault(candidateInput.trim());
    setIsVerifying(false);

    if (res.success) {
      if (onOpenVault) {
        onOpenVault();
      }
    } else {
      setSubmitError(res.message);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header Banner */}
      <div className="bg-space-900 border border-cyan/30 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-cyan/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 text-cyan text-xs font-bold tracking-widest uppercase mb-1">
              <Radio className="w-4 h-4" /> TRANSMISSION INTERCEPT TERMINAL
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 tracking-wider">
              RAW CARRIER & VAULT RELAY
            </h2>
          </div>

          <div
            className={`px-3 py-1 rounded text-xs font-mono border ${
              isCipherDecoded
                ? 'bg-cyan/20 border-cyan/50 text-cyan font-bold'
                : 'bg-space-950 border-slate-700 text-slate-400'
            }`}
          >
            CIPHER: {isCipherDecoded ? 'DECODED & SYNCHRONIZED' : 'PENDING DECRYPTION'}
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed max-w-3xl font-sans">
          Terminal 1 holds the raw encrypted telemetry buffer intercepted at 1420.405 MHz. Apply the shift discovered in Terminal 2 to decode the message, then transmit it during the STABLE resonance window.
        </p>
      </div>

      {/* 2. Intercepted Ciphertext Card */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <span>INCOMING CARRIER INTERCEPT (VJG NCUV UKIPCN)</span>
          </div>

          <button
            onClick={handleCopyCipher}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-950 border border-slate-700 hover:border-cyan text-slate-400 hover:text-cyan text-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>

        <div className="p-4 rounded-lg bg-space-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
              PAYLOAD BUFFER (ENCODED)
            </div>
            <div className="text-2xl sm:text-3xl font-mono font-black tracking-[0.2em] text-cyan select-all">
              {CIPHERTEXT}
            </div>
          </div>

          <div className="text-xs text-slate-400 text-right">
            <div>ALGORITHM: <span className="text-slate-200 font-bold">CAESAR SHIFT</span></div>
            <div>CARRIER: <span className="text-cyan font-bold">1420.405 MHz</span></div>
          </div>
        </div>
      </div>

      {/* 3. Interactive Caesar Shift Decoder */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan" />
            <h3 className="font-display font-bold text-base text-slate-200">
              DECRYPTION OFFSET TUNER
            </h3>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            OFFSET: <span className="text-cyan font-bold text-sm">{shift > 0 ? `+${shift}` : shift}</span>
          </div>
        </div>

        {/* Stepper buttons & Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleShiftChange(shift - 1)}
              className="px-3 py-1.5 rounded bg-space-950 border border-slate-700 text-xs text-slate-300 hover:text-cyan hover:border-cyan transition-colors"
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
              className="flex-1 accent-cyan h-2 bg-space-950 rounded-lg cursor-pointer"
            />

            <button
              onClick={() => handleShiftChange(shift + 1)}
              className="px-3 py-1.5 rounded bg-space-950 border border-slate-700 text-xs text-slate-300 hover:text-cyan hover:border-cyan transition-colors"
            >
              +1
            </button>

            <button
              onClick={() => handleShiftChange(0)}
              className="px-2.5 py-1.5 rounded bg-space-950 border border-slate-700 text-xs text-slate-400 hover:text-white transition-colors"
            >
              RESET
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-slate-500 text-[10px] uppercase">PRESETS:</span>
            {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => handleShiftChange(val)}
                className={`px-2 py-0.5 rounded border text-[11px] transition-all ${
                  shift === val
                    ? 'border-cyan bg-cyan/15 text-cyan font-bold'
                    : 'border-slate-800 bg-space-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                SHIFT {val > 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
        </div>

        {/* Live Decoded Output Preview */}
        <div
          className={`p-4 rounded-lg border transition-all duration-300 ${
            isMatch || isCipherDecoded
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-slate-800 bg-space-950'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider">
              DECRYPTED OUTPUT PREVIEW:
            </span>
            {isMatch || isCipherDecoded ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" /> RESONANCE MATCH
              </span>
            ) : (
              <span className="text-slate-500 text-[11px]">AWAITING CORRECT ROTATION</span>
            )}
          </div>

          <div
            className={`text-xl sm:text-2xl font-mono font-black tracking-wider ${
              isMatch || isCipherDecoded ? 'text-emerald-400 animate-pulse' : 'text-slate-300'
            }`}
          >
            {decodedPreview}
          </div>
        </div>

        {/* Lock-In Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="text-xs text-slate-400">
            {state.completedStages?.key ? (
              <span className="text-violet font-semibold">
                KEY ADVISORY: Carrier telemetry indicates -2 (backward) rotation.
              </span>
            ) : (
              <span className="text-slate-500">
                Scan frequency in Terminal 2 to isolate the displacement offset.
              </span>
            )}
          </div>

          <button
            onClick={handleCommitDecode}
            disabled={isCipherDecoded}
            className={`px-5 py-2.5 rounded font-bold text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
              isCipherDecoded
                ? 'bg-space-950 border border-emerald-500/40 text-emerald-400 cursor-default'
                : isMatch
                ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                : 'bg-space-950 hover:bg-space-850 text-slate-300 border border-slate-700'
            }`}
          >
            {isCipherDecoded ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                SIGNAL CONFIRMED & COMMITTED
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                LOCK IN DECRYPTED SIGNAL
              </>
            )}
          </button>
        </div>
      </div>

      {/* 4. Vault Access Terminal Station */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan" />
            <h3 className="font-display font-bold text-base text-slate-200">
              VAULT ACCESS TERMINAL
            </h3>
          </div>

          <div
            className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
              state.unlockStatus === 'UNLOCKED'
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                : state.error
                ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                : 'bg-space-950 border-slate-700 text-slate-400'
            }`}
          >
            VAULT: {state.error ? 'VERIFICATION REJECTED' : state.unlockStatus}
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed font-sans">
          To unlock the classified digital vault, submit the decrypted transmission code while the temporal phase is{' '}
          <strong className="text-emerald-400 uppercase font-mono">STABLE</strong> and all clues are synchronized.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmitFinal} className="space-y-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
              CONFIRMATION CODE TRANSMISSION
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. THE LAST SIGNAL"
                value={candidateInput}
                onChange={(e) => {
                  setCandidateInput(e.target.value.toUpperCase());
                  setSubmitError(null);
                }}
                disabled={state.unlockStatus === 'UNLOCKED' || isVerifying}
                className="flex-1 bg-space-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono tracking-wider text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-cyan"
              />
              <button
                type="submit"
                disabled={state.unlockStatus === 'UNLOCKED' || isVerifying}
                className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                  isStable
                    ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                    : 'bg-cyan hover:bg-cyan/90 text-slate-950 shadow-lg shadow-cyan/20'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isVerifying ? (
                  <>
                    <RotateCw className="w-4 h-4 animate-spin" /> VERIFYING...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> TRANSMIT
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Submission Error or State Error */}
          {(submitError || state.error) && (
            <div className="p-3 rounded bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{submitError || state.error}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  SoundFX.playTick();
                  setSubmitError(null);
                  retrySequence();
                }}
                className="px-3 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-[11px] font-bold tracking-wider uppercase shrink-0"
              >
                RETRY TRANSMISSION
              </button>
            </div>
          )}

          {/* Unlocked Announcement */}
          {state.unlockStatus === 'UNLOCKED' && (
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
                <div>
                  <strong className="block text-sm font-bold text-emerald-200">
                    CLASSIFIED VAULT UNLOCKED
                  </strong>
                  <span className="font-sans">All security protocols satisfied across all active terminals.</span>
                </div>
              </div>
              {onOpenVault && (
                <button
                  type="button"
                  onClick={onOpenVault}
                  className="px-4 py-2 rounded bg-emerald-500 text-slate-950 font-bold text-xs uppercase hover:bg-emerald-400 transition-colors shrink-0 flex items-center gap-1.5"
                >
                  <Unlock className="w-3.5 h-3.5" /> VIEW VAULT
                </button>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
