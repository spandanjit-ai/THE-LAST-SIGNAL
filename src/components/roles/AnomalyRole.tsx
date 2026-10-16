import React, { useEffect, useRef } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  CONTAINMENT_ELEMENT_ID,
  CONTAINMENT_ATTRIBUTE,
  CONTAINMENT_INITIAL_VALUE,
  CONTAINMENT_TARGET_VALUE,
  attachContainmentObserver,
} from '../../engine/challengeObserver';
import { ANOMALY_CODE } from '../../engine/verification';
import { SupernovaCanvas } from '../effects/SupernovaCanvas';
import { SoundFX } from '../../utils/audio';
import {
  ShieldAlert,
  ShieldCheck,
  Terminal,
  Radio,
  Zap,
} from 'lucide-react';


export const AnomalyRole: React.FC = () => {
  const { state, completeChallenge, confirmAnomaly } = useMission();
  const containmentNodeRef = useRef<HTMLDivElement>(null);

  const c1Status = state.challenges?.items?.C1?.status;
  const isC1Completed = c1Status === 'COMPLETED';

  // Real DOM Mutation Observer
  useEffect(() => {
    const el = containmentNodeRef.current;
    if (!el) return;

    if (!el.hasAttribute(CONTAINMENT_ATTRIBUTE)) {
      el.setAttribute(
        CONTAINMENT_ATTRIBUTE,
        isC1Completed ? CONTAINMENT_TARGET_VALUE : CONTAINMENT_INITIAL_VALUE
      );
    }

    const cleanup = attachContainmentObserver({
      targetElement: el,
      onValidMutation: (attribute, value) => {
        SoundFX.playSupernova();
        completeChallenge('C1', attribute, value);
        confirmAnomaly(ANOMALY_CODE);
      },
    });


    return () => cleanup();
  }, [isC1Completed, completeChallenge, confirmAnomaly]);


  return (
    <div className="space-y-6 font-mono">
      {/* Telemetry Header */}
      <div className="border border-noir-border/80 bg-noir-surface/90 rounded p-4 sm:p-5 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded border transition-colors ${
                isC1Completed
                  ? 'bg-signal-cyan/15 border-signal-cyan/40 text-signal-cyan'
                  : 'bg-signal-amber/15 border-signal-amber/40 text-signal-amber'
              }`}
            >
              {isC1Completed ? <Zap className="w-5 h-5" /> : <Radio className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                SECTOR 0x7749 // ANOMALY TELEMETRY
              </div>
              <h2 className="font-display font-bold text-xl text-amber-300 tracking-tight drop-shadow-[0_0_10px_rgba(255,180,84,0.25)]">
                CONTAINMENT ISOLATOR
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {isC1Completed ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-signal-cyan/15 border border-signal-cyan/40 text-signal-cyan font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                OVERRIDE VERIFIED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded bg-signal-amber/10 border border-signal-amber/30 text-signal-amber animate-pulse font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                QUARANTINE ACTIVE
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Primary Visual: Containment Isolator Chamber */}
      <div
        id={CONTAINMENT_ELEMENT_ID}
        ref={containmentNodeRef}
        data-signal-anomaly={ANOMALY_CODE}
        className={`relative rounded border p-8 sm:p-12 overflow-hidden transition-all duration-700 flex flex-col items-center justify-center text-center min-h-[380px] ${
          isC1Completed
            ? 'border-signal-cyan/50 bg-gradient-to-b from-signal-cyan/10 via-noir-surface to-noir-base shadow-[0_0_50px_rgba(34,211,238,0.12)]'
            : 'border-signal-amber/30 bg-noir-surface/90 hover:border-signal-amber/50 shadow-[0_0_30px_rgba(255,180,84,0.05)]'
        }`}
      >
        {/* Real-time Supernova Cosmic Burst on Breach */}
        {isC1Completed && (
          <SupernovaCanvas active={true} className="z-0 opacity-80" />
        )}

        {/* Radar & Forcefield Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Pulsing Concentric Forcefield Rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className={`w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-dashed transition-all duration-1000 ${
              isC1Completed
                ? 'border-signal-cyan/30 animate-[spin_40s_linear_infinite]'
                : 'border-signal-amber/20 animate-[spin_60s_linear_infinite]'
            }`}
          />
          <div
            className={`absolute w-48 h-48 sm:w-64 sm:h-64 rounded-full border transition-all duration-700 ${
              isC1Completed
                ? 'border-signal-cyan/40 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                : 'border-signal-amber/30 animate-pulse'
            }`}
          />
        </div>

        {/* Center Node Core */}
        <div className="relative z-10 max-w-xl mx-auto space-y-6">
          {!isC1Completed ? (
            <>
              {/* Core Icon */}
              <div className="w-16 h-16 mx-auto rounded-full bg-noir-base border border-signal-amber/40 flex items-center justify-center text-signal-amber shadow-[0_0_20px_rgba(255,180,84,0.2)]">
                <ShieldAlert className="w-8 h-8 animate-pulse" />
              </div>

              {/* Status Header */}
              <div className="space-y-1">
                <div className="text-[10px] text-amber-400 font-bold tracking-widest uppercase">
                  CONTAINMENT PROTOCOL RESTRICTED
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-amber-300 tracking-wide drop-shadow-[0_0_12px_rgba(255,180,84,0.3)]">
                  ISOLATOR NODE #0x7749
                </div>
              </div>

              {/* Minimal Tactical Metadata */}
              <div className="p-3.5 rounded bg-noir-base/80 border border-noir-border/80 inline-flex flex-wrap items-center justify-center gap-4 text-xs text-signal-dim">
                <div>
                  NODE: <span className="text-cyan-300 font-bold">#{CONTAINMENT_ELEMENT_ID}</span>
                </div>
                <div className="text-noir-border">//</div>
                <div>
                  PROTOCOL: <span className="text-amber-400 font-bold">&quot;RESTRICTED&quot;</span>
                </div>
              </div>

              {/* Single Atmospheric Hacker Directive */}
              <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                Quarantine locks isolate this carrier packet. Inspect this DOM node in DevTools and mutate{' '}
                <code className="text-signal-cyan px-1.5 py-0.5 rounded bg-noir-base border border-signal-cyan/30 font-bold">
                  {CONTAINMENT_ATTRIBUTE}
                </code>{' '}
                to <span className="text-amber-300 font-bold">&quot;OVERRIDE&quot;</span> to disengage containment.
              </p>
            </>
          ) : (
            /* CINEMATIC PLOT TWIST REVELATION */
            <div className={`space-y-5 animate-in fade-in zoom-in-95 duration-500`}>
              <div className="w-16 h-16 mx-auto rounded-full bg-signal-cyan/15 border border-signal-cyan flex items-center justify-center text-signal-cyan shadow-[0_0_30px_rgba(34,211,238,0.4)]">
                <Zap className="w-8 h-8" />
              </div>

              <div className="space-y-1">
                <div className="text-xs text-signal-cyan font-bold tracking-widest uppercase flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-signal-cyan animate-ping" />
                  CONTAINMENT OVERRIDDEN // PLOT TWIST UNLOCKED
                </div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-signal-text tracking-tight">
                  THE TRANSMISSION IS INTERNAL
                </div>
              </div>

              <div className="p-4 rounded bg-noir-base/90 border border-signal-cyan/40 text-xs sm:text-sm text-signal-text leading-relaxed text-left max-w-lg mx-auto shadow-xl">
                <div className="text-[10px] text-signal-cyan font-bold tracking-widest mb-1.5">
                  // DECRYPTED FLIGHT RECORDER LOG:
                </div>
                The anomaly is not an alien carrier. It is an automated evacuation beacon transmitted by this very machine prior to system shutdown.
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-signal-dim pt-1">
                <div>
                  CARRIER TOKEN: <span className="text-signal-amber font-bold tracking-wider">{ANOMALY_CODE}</span>
                </div>
                <div className="text-noir-border">//</div>
                <div className="text-signal-cyan">
                  SYNCHRONIZED ACROSS ALL 3 TERMINALS
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Compact Terminal Readout */}
      <div className="border border-noir-border/80 bg-noir-surface/70 rounded px-4 py-3 flex items-center justify-between text-xs text-signal-dim">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-signal-cyan" />
          <span>SCOPED DOM OBSERVER ACTIVE</span>
        </div>
        <div className="text-[11px] text-signal-muted">
          TARGET: #{CONTAINMENT_ELEMENT_ID}
        </div>
      </div>
    </div>
  );
};
