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
    <div className="border border-noir-border bg-noir-surface/90 rounded p-4 sm:p-5 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-noir-border">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm tracking-wide text-signal-text">
            EVIDENCE DOSSIER
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-base border border-noir-border text-signal-muted">
            {[isTransmissionResolved, isKeyResolved, isAnomalyResolved].filter(Boolean).length} / 3 ASSEMBLED
          </span>
        </div>

        {allResolved ? (
          <div className="flex items-center gap-1.5 text-xs font-mono text-signal-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan animate-pulse" />
            <span>ALL FRAGMENTS AUTHENTICATED</span>
          </div>
        ) : (
          <div className="text-xs font-mono text-signal-dim">
            AWAITING INTER-TAB CONVERGENCE...
          </div>
        )}
      </div>

      {/* 3 Evidence Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Fragment 1: Decoded Signal */}
        <div
          onClick={() => setRole('transmission')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-left ${
            isTransmissionResolved
              ? 'border-signal-cyan/40 bg-signal-cyan/10 text-signal-cyan'
              : currentRole === 'transmission'
              ? 'border-signal-cyan/30 bg-noir-elevated text-signal-text ring-1 ring-signal-cyan/20'
              : 'border-noir-border bg-noir-base text-signal-dim hover:border-noir-border/80 hover:text-signal-muted'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-signal-cyan" />
              <span>FRAGMENT A // SIGNAL</span>
            </span>
            {isTransmissionResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-signal-cyan" />
            ) : (
              <Lock className="w-3 h-3 text-signal-dim" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isTransmissionResolved ? (
              <span className="text-signal-cyan font-bold">&quot;THE LAST SIGNAL&quot;</span>
            ) : (
              <span className="text-signal-dim">CIPHER: VJG NCUV UKIPCN</span>
            )}
          </div>
        </div>

        {/* Fragment 2: Key Shift Parameter */}
        <div
          onClick={() => setRole('key')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-left ${
            isKeyResolved
              ? 'border-signal-violet/40 bg-signal-violet/10 text-signal-violet'
              : currentRole === 'key'
              ? 'border-signal-violet/30 bg-noir-elevated text-signal-text ring-1 ring-signal-violet/20'
              : 'border-noir-border bg-noir-base text-signal-dim hover:border-noir-border/80 hover:text-signal-muted'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <KeyRound className="w-3 h-3 text-signal-violet" />
              <span>FRAGMENT B // KEY SHIFT</span>
            </span>
            {isKeyResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-signal-violet" />
            ) : (
              <Lock className="w-3 h-3 text-signal-dim" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isKeyResolved ? (
              <span className="text-signal-violet font-bold">OFFSET: -3 (ROT-3)</span>
            ) : (
              <span className="text-signal-dim">1420.4 MHz UNTUNED</span>
            )}
          </div>
        </div>

        {/* Fragment 3: DOM Anomaly Token */}
        <div
          onClick={() => setRole('anomaly')}
          className={`cursor-pointer p-3.5 rounded border transition-all text-left ${
            isAnomalyResolved
              ? 'border-signal-amber/40 bg-signal-amber/10 text-signal-amber'
              : currentRole === 'anomaly'
              ? 'border-signal-amber/30 bg-noir-elevated text-signal-text ring-1 ring-signal-amber/20'
              : 'border-noir-border bg-noir-base text-signal-dim hover:border-noir-border/80 hover:text-signal-muted'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-mono tracking-wider uppercase flex items-center gap-1.5">
              <Binary className="w-3 h-3 text-signal-amber" />
              <span>FRAGMENT C // DOM TOKEN</span>
            </span>
            {isAnomalyResolved ? (
              <ShieldCheck className="w-3.5 h-3.5 text-signal-amber" />
            ) : (
              <Lock className="w-3 h-3 text-signal-dim" />
            )}
          </div>
          <div className="font-mono text-xs font-semibold tracking-wider">
            {isAnomalyResolved ? (
              <span className="text-signal-amber font-bold">SIG-7749-OMEGA</span>
            ) : (
              <span className="text-signal-dim">DEVTOOLS DOM INSPECTION</span>
            )}
          </div>
        </div>
      </div>

      {/* Vault Readiness Action Strip */}
      <div className="mt-4 pt-3 border-t border-noir-border flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs font-mono">
          {state.unlockStatus === 'UNLOCKED' ? (
            <span className="text-signal-cyan font-bold flex items-center gap-1.5">
              <Unlock className="w-4 h-4" /> ARCHIVE OPEN // TRANSMISSION RESTORED
            </span>
          ) : allResolved ? (
            <span className="text-signal-muted">
              ALL FRAGMENTS RESOLVED.{' '}
              {isStable ? (
                <strong className="text-signal-cyan font-bold">Signal is STABLE. Ready for vault unlock.</strong>
              ) : (
                <span className="text-signal-amber">Awaiting STABLE window ({state.phaseSecondsRemaining}s).</span>
              )}
            </span>
          ) : (
            <span className="text-signal-dim">
              Collect evidence across terminals to prepare the digital vault.
            </span>
          )}
        </div>

        <button
          onClick={onOpenVault}
          className={`px-4 py-2 rounded font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all ${
            state.unlockStatus === 'UNLOCKED'
              ? 'bg-noir-surface border border-signal-cyan/50 text-signal-cyan'
              : allResolved && isStable
              ? 'bg-signal-cyan hover:bg-[#38BDF8] text-[#070A12] shadow-sm'
              : 'bg-noir-surface border border-noir-border text-signal-muted hover:border-noir-border/80 hover:text-signal-text'
          }`}
        >
          <span>{state.unlockStatus === 'UNLOCKED' ? 'VIEW DECRYPTED ARCHIVE' : 'OPEN VAULT TERMINAL'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
