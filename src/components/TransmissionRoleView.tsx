import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Sliders, 
  Lock, 
  AlertCircle, 
  Sparkles, 
  Send, 
  RotateCw, 
  CheckCircle2 
} from 'lucide-react';
import { UseMissionReturn } from '../hooks/useMission';
import { CIPHERTEXT, decodeCaesar, isTargetMessage } from '../engine/cipher';
import { soundEffects } from '../utils/audioFx';

interface TransmissionRoleViewProps {
  mission: UseMissionReturn;
}

export const TransmissionRoleView: React.FC<TransmissionRoleViewProps> = ({ mission }) => {
  const { state, phaseInfo, isVerifying, discoverClue, decodeCipher, submitFinalAnswer, retryTimedSequence } = mission;

  // Auto-discover the transmission ciphertext clue upon entering this terminal
  useEffect(() => {
    if (!state.discoveredClues.clue_cipher_text) {
      discoverClue('clue_cipher_text');
    }
  }, [state.discoveredClues.clue_cipher_text, discoverClue]);

  // Caesar decoder interactive state
  const [shift, setShift] = useState<number>(0);
  const [candidateInput, setCandidateInput] = useState<string>('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Live decoded preview from slider
  const liveDecoded = decodeCaesar(CIPHERTEXT, shift);
  const isMatch = isTargetMessage(liveDecoded);

  const handleShiftChange = (newShift: number) => {
    soundEffects.playClick();
    setShift(newShift);
  };

  const handleLockInDecrypted = () => {
    soundEffects.playKeyFound();
    decodeCipher(liveDecoded, shift);
    setCandidateInput(liveDecoded);
  };

  const handleSubmitFinal = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    soundEffects.playClick();

    if (!candidateInput.trim()) {
      setSubmitError('Please enter the decrypted transmission signal.');
      return;
    }

    const success = await submitFinalAnswer(candidateInput.trim());
    if (success) {
      soundEffects.playVaultUnlock();
    } else {
      soundEffects.playError();
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Encrypted Signal Banner */}
      <div className="bg-space-900 border border-cyan/30 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-cyan/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 text-cyan text-xs font-bold tracking-widest uppercase mb-1">
              <Terminal className="w-4 h-4" /> INCOMING ENCRYPTED STREAM
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 tracking-wider">
              TRANSMISSION RECEPTOR
            </h2>
          </div>

          <div className="px-3 py-1 rounded bg-space-950 border border-cyan/40 text-cyan text-xs font-mono">
            STATUS: CARRIER LOCKED
          </div>
        </div>

        {/* Big Ciphertext Display */}
        <div className="bg-space-950 p-4 rounded border border-slate-800 font-mono text-center">
          <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">
            RAW CIPHERTEXT STREAM
          </div>
          <div className="text-2xl sm:text-3xl font-bold tracking-[0.25em] text-cyan select-all">
            {CIPHERTEXT}
          </div>
        </div>
      </div>

      {/* 2. Interactive Caesar Cipher Decoder */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan" />
            <h3 className="font-display font-bold text-base text-slate-200">
              CAESAR FREQUENCY SHIFT DECODER
            </h3>
          </div>

          {state.discoveredClues.clue_key_shift && (
            <span className="text-[11px] text-violet font-bold bg-violet/10 border border-violet/30 px-2.5 py-1 rounded flex items-center gap-1.5 animate-pulse">
              <Sparkles className="w-3.5 h-3.5" /> KEY DISCOVERED IN TAB 2
            </span>
          )}
        </div>

        <p className="text-slate-400 text-xs mb-4">
          Adjust the backward shift dial to rotate the alphabet and align the transmission frequencies.
          Check Terminal 2 (Key) for the exact shift offset discovered in orbital telemetry.
        </p>

        {/* Slider & Shift Value */}
        <div className="bg-space-950 p-4 rounded-lg border border-slate-800 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-mono">
              ALPHABET SHIFT: <span className="text-cyan font-bold text-sm">{shift}</span>
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleShiftChange(Math.max(0, shift - 1))}
                className="px-2 py-1 rounded bg-space-900 border border-slate-700 text-xs text-slate-300 hover:text-cyan hover:border-cyan"
              >
                -1
              </button>
              <button
                type="button"
                onClick={() => handleShiftChange(Math.min(25, shift + 1))}
                className="px-2 py-1 rounded bg-space-900 border border-slate-700 text-xs text-slate-300 hover:text-cyan hover:border-cyan"
              >
                +1
              </button>
              <button
                type="button"
                onClick={() => handleShiftChange(0)}
                className="px-2 py-1 rounded bg-space-900 border border-slate-700 text-xs text-slate-400 hover:text-white"
              >
                RESET
              </button>
            </div>
          </div>

          <input
            type="range"
            min="0"
            max="25"
            value={shift}
            onChange={(e) => handleShiftChange(parseInt(e.target.value, 10))}
            className="w-full accent-cyan h-2 bg-space-900 rounded-lg cursor-pointer"
          />

          {/* Live Output */}
          <div className="pt-2 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                DECRYPTED OUTPUT PREVIEW:
              </div>
              <div className={`font-mono text-lg sm:text-xl font-bold tracking-widest ${
                isMatch ? 'text-emerald-400 animate-pulse' : 'text-slate-300'
              }`}>
                {liveDecoded}
              </div>
            </div>

            {isMatch && (
              <button
                onClick={handleLockInDecrypted}
                className="px-4 py-2 rounded font-bold text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <CheckCircle2 className="w-4 h-4" /> LOCK IN DECRYPTED SIGNAL
              </button>
            )}
          </div>
        </div>

        {state.decodedMessage && (
          <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              CONFIRMED DECRYPTION: <strong className="font-mono text-sm tracking-wider">{state.decodedMessage}</strong>
            </span>
            <button
              onClick={() => setCandidateInput(state.decodedMessage || '')}
              className="text-[11px] underline hover:text-emerald-200"
            >
              Fill into Vault
            </button>
          </div>
        )}
      </div>

      {/* 3. Final Vault Verification & Submission Station */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan" />
            <h3 className="font-display font-bold text-base text-slate-200">
              VAULT ACCESS TERMINAL
            </h3>
          </div>

          <div className={`text-xs px-2.5 py-1 rounded font-bold uppercase tracking-wider border ${
            state.unlockStatus === 'UNLOCKED'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : state.unlockStatus === 'FAILED'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-space-950 border-slate-700 text-slate-400'
          }`}>
            VAULT: {state.unlockStatus}
          </div>
        </div>

        <p className="text-slate-400 text-xs mb-4">
          To unlock the classified vault, you must submit the decrypted transmission code while the signal phase is{' '}
          <strong className="text-emerald-400 uppercase">STABLE</strong> and all 3 clues have been synchronized across tabs.
        </p>

        {/* Verification / Submission Form */}
        <form onSubmit={handleSubmitFinal} className="space-y-4">
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
                  phaseInfo.isStable
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
          {(submitError || state.lastError) && (
            <div className="p-3 rounded bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{submitError || state.lastError}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundEffects.playClick();
                  setSubmitError(null);
                  retryTimedSequence();
                }}
                className="px-3 py-1 rounded bg-rose-900/60 hover:bg-rose-800 text-rose-100 text-[11px] font-bold tracking-wider uppercase shrink-0"
              >
                RETRY TRANSMISSION
              </button>
            </div>
          )}

          {/* Unlocked Announcement */}
          {state.unlockStatus === 'UNLOCKED' && (
            <div className="p-4 rounded-lg bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />
              <div>
                <strong className="block text-sm font-bold text-emerald-200">
                  CLASSIFIED VAULT UNLOCKED
                </strong>
                <span>All security protocols satisfied. Access granted across all active terminals.</span>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
