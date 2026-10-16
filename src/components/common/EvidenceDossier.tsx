import React from 'react';
import { useMission } from '../../hooks/useMission';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Radio,
  KeyRound,
  Binary,
  ArrowRight,
} from 'lucide-react';

interface EvidenceDossierProps {
  onOpenVault: () => void;
}

export const EvidenceDossier: React.FC<EvidenceDossierProps> = ({ onOpenVault }) => {
  const { state, setRole, currentRole } = useMission();

  const isTransmissionResolved = state.cipherDecoded || state.completedStages.transmission;
  const isKeyResolved = state.keyDiscovered || state.completedStages.key;
  const isAnomalyResolved = state.anomalyConfirmed || state.completedStages.anomaly;
  const isStable = state.currentPhase === 'STABLE';
  const allResolved = isTransmissionResolved && isKeyResolved && isAnomalyResolved;

  return (
    <div className="border border-slate-800 bg-space-950/70 rounded-lg p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm tracking-wider text-slate-200">
            EVIDENCE DOSSIER
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-space-900 border border-slate-700 text-slate-400">
            {[isTransmissionResolved, isKeyResolved, isAnomalyResolved].filter(Boolean).length} / 3 ASSEMBLED
          </span>
        </div>

        {allResolved ? (
          <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>ALL FRAGMENTS LINKED</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-slate-500">
            SYNCHRONIZING TELEMETRY...
          </div>
        )}
      </div>

      {/* 3 Connected Evidence Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Fragment 1: Decoded Signal */}
        <div
          onClick={() => setRole('transmission')}
          className={`cursor-pointer p-3 rounded border transition-all text-left ${
            isTransmissionResolved
              ? 'border-cyan-500/40 bg-cyan-950/20 text-cyan-200'
              : currentRole === 'transmission'
              ? 'border-cyan-500/30 bg-space-900/80 text-slate-300 ring-1 ring-cyan-500/20'
              : 'border-slate-800 bg-space-950 text-slate-500 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-cyan-400" />
              <span>FRAGMENT A // DECODED SIGNAL</span>
            </span>
            {isTransmissionResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            ) : (
              <Lock className="w-3 h-3 text-slate-600" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isTransmissionResolved ? (
              <span className="text-cyan-300 font-bold">&quot;THE LAST SIGNAL&quot;</span>
            ) : (
              <span className="text-slate-500">CIPHER: VJG NCUV UKIPCN</span>
            )}
          </div>
        </div>

        {/* Fragment 2: Key Shift Parameter */}
        <div
          onClick={() => setRole('key')}
          className={`cursor-pointer p-3 rounded border transition-all text-left ${
            isKeyResolved
              ? 'border-violet-500/40 bg-violet-950/20 text-violet-200'
              : currentRole === 'key'
              ? 'border-violet-500/30 bg-space-900/80 text-slate-300 ring-1 ring-violet-500/20'
              : 'border-slate-800 bg-space-950 text-slate-500 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-violet-400" />
              <span>FRAGMENT B // CIPHER SHIFT</span>
            </span>
            {isKeyResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />
            ) : (
              <Lock className="w-3 h-3 text-slate-600" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isKeyResolved ? (
              <span className="text-violet-300 font-bold">OFFSET: -3 (ROT-3)</span>
            ) : (
              <span className="text-slate-500">1420.4 MHz HARMONIC UNTUNED</span>
            )}
          </div>
        </div>

        {/* Fragment 3: DOM Anomaly Token */}
        <div
          onClick={() => setRole('anomaly')}
          className={`cursor-pointer p-3 rounded border transition-all text-left ${
            isAnomalyResolved
              ? 'border-amber-500/40 bg-amber-950/20 text-amber-200'
              : currentRole === 'anomaly'
              ? 'border-amber-500/30 bg-space-900/80 text-slate-300 ring-1 ring-amber-500/20'
              : 'border-slate-800 bg-space-950 text-slate-500 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Binary className="w-3 h-3 text-amber-400" />
              <span>FRAGMENT C // DOM METADATA</span>
            </span>
            {isAnomalyResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Lock className="w-3 h-3 text-slate-600" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isAnomalyResolved ? (
              <span className="text-amber-300 font-bold">AUTH: SIG-7749-OMEGA</span>
            ) : (
              <span className="text-slate-500">DEVTOOLS INSPECTION REQUIRED</span>
            )}
          </div>
        </div>
      </div>

      {/* Vault readiness action banner */}
      <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono">
          {state.unlockStatus === 'UNLOCKED' ? (
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Unlock className="w-4 h-4" /> VAULT OPEN // CLASSIFIED ARCHIVE RECOVERED
            </span>
          ) : allResolved ? (
            <span className="text-cyan-300 font-medium">
              READY: All 3 fragments authenticated.{' '}
              {isStable ? (
                <strong className="text-emerald-400">Signal is STABLE. Submit now!</strong>
              ) : (
                <span className="text-amber-400">Awaiting STABLE resonance ({state.phaseSecondsRemaining}s).</span>
              )}
            </span>
          ) : (
            <span className="text-slate-500">
              Locate clues across tabs to complete the evidence dossier.
            </span>
          )}
        </div>

        <button
          onClick={onOpenVault}
          className={`px-4 py-2 rounded font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
            state.unlockStatus === 'UNLOCKED'
              ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
              : allResolved && isStable
              ? 'bg-cyan-500 hover:bg-cyan-400 text-space-950 shadow-lg shadow-cyan-500/30 animate-pulse'
              : 'bg-space-900 border border-slate-700 text-slate-300 hover:border-slate-500'
          }`}
        >
          <span>{state.unlockStatus === 'UNLOCKED' ? 'VIEW DECRYPTED ARCHIVE' : 'OPEN VAULT TERMINAL'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
