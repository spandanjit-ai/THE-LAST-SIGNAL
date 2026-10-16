import React, { useState, useEffect, useRef } from 'react';
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
import { TemporalScrubber } from '../challenges/TemporalScrubber';
import {
  Search,
  Code,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Send,
  Zap,
} from 'lucide-react';

export const AnomalyRole: React.FC = () => {
  const { state, completeChallenge, confirmAnomaly } = useMission();
  const containmentNodeRef = useRef<HTMLDivElement>(null);

  const isAnomalyConfirmed = Boolean(state.anomalyConfirmed || state.completedStages?.anomaly);
  const c1Status = state.challenges?.items?.C1?.status;
  const isC1Completed = c1Status === 'COMPLETED';

  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Real DOM Mutation Observer on Containment Chamber (#containment-anomaly-node)
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

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    SoundFX.playTick();

    if (!tokenInput.trim()) {
      setErrorMsg('Please enter the anomaly signature token discovered in the DOM.');
      return;
    }

    const res = confirmAnomaly(tokenInput.trim());
    if (res.success || tokenInput.trim().toUpperCase() === ANOMALY_CODE) {
      SoundFX.playSupernova();
      setTokenInput('');
    } else {
      SoundFX.playWarning();
      setErrorMsg('Invalid anomaly signature. Ensure you inspect the target DOM element in DevTools.');
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Anomaly Banner */}
      <div className="bg-space-900 border border-amber/40 rounded-lg p-5 relative overflow-hidden shadow-lg shadow-amber/5">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber/15 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 text-amber text-xs font-black tracking-widest uppercase mb-1 text-glow-amber">
              <Search className="w-4 h-4 text-amber" /> METADATA ANOMALY DETECTOR
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-white tracking-wider">
              DOM INSPECTION CHAMBER
            </h2>
          </div>

          <div
            className={`px-3 py-1 rounded text-xs font-mono font-bold border ${
              isAnomalyConfirmed || isC1Completed
                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 text-glow-emerald font-black'
                : 'bg-amber/15 border-amber/50 text-amber font-bold text-glow-amber'
            }`}
          >
            ANOMALY: {isAnomalyConfirmed || isC1Completed ? 'VERIFIED & LINKED' : 'UNCONFIRMED SIGNATURE'}
          </div>
        </div>

        <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-3xl font-sans">
          A corrupted packet embedded in this page&apos;s Document Object Model (DOM) contains hidden telemetry metadata required for vault verification.
        </p>
      </div>

      {/* 2. DevTools Briefing & Designated DOM Element */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-amber" />
          <h3 className="font-display font-black text-base text-white">
            BROWSER DEVTOOLS INSTRUCTIONS
          </h3>
        </div>

        <div className="bg-space-950 p-4 rounded-lg border border-slate-800 space-y-2.5 mb-5 text-xs sm:text-sm text-slate-200 font-sans leading-relaxed">
          <p>
            1. Open Developer Tools by pressing{' '}
            <kbd className="px-2 py-0.5 rounded bg-space-900 border border-cyan/40 font-mono text-cyan font-bold text-glow-cyan">F12</kbd> (or{' '}
            <kbd className="px-2 py-0.5 rounded bg-space-900 border border-cyan/40 font-mono text-cyan font-bold">Ctrl + Shift + I</kbd> /{' '}
            <kbd className="px-2 py-0.5 rounded bg-space-900 border border-cyan/40 font-mono text-cyan font-bold">Cmd + Option + I</kbd>).
          </p>
          <p>
            2. Go to the <strong className="text-white">Elements</strong> / <strong className="text-white">Inspector</strong> panel.
          </p>
          <p>
            3. Locate the target DOM elements below to extract the token, or override the containment protocol in real time.
          </p>
        </div>

        {/* Surprise Challenge C1: Containment Isolator Node with Supernova Canvas */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="text-white font-extrabold">CONTAINMENT ISOLATOR CHAMBER (TRACK OMEGA CHALLENGE C1):</span>
            <span className={isC1Completed ? 'text-cyan-300 font-black text-glow-cyan' : 'text-amber-300 font-black text-glow-amber'}>
              {isC1Completed ? 'BREACH PROTOCOL OVERRIDDEN' : 'MUTATE ATTRIBUTE TO "OVERRIDE"'}
            </span>
          </div>

          <div
            id={CONTAINMENT_ELEMENT_ID}
            ref={containmentNodeRef}
            data-containment-protocol={isC1Completed ? 'OVERRIDE' : 'RESTRICTED'}
            data-signal-anomaly={ANOMALY_CODE}
            data-transmission-anomaly={ANOMALY_CODE}
            className={`relative p-6 rounded-lg border transition-all duration-700 overflow-hidden text-center ${
              isC1Completed
                ? 'border-cyan/60 bg-space-950 shadow-[0_0_40px_rgba(0,240,255,0.2)]'
                : 'border-dashed border-amber/50 bg-space-950 hover:border-amber'
            }`}
          >
            {/* Supernova Singular Canvas on Breach */}
            {isC1Completed && (
              <SupernovaCanvas active={true} className="z-0 opacity-80" />
            )}

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-center gap-2 text-xs font-black">
                {isC1Completed ? (
                  <span className="text-cyan flex items-center gap-2 text-glow-cyan text-sm">
                    <Zap className="w-4 h-4 text-cyan animate-bounce" />
                    &lt;div id=&quot;{CONTAINMENT_ELEMENT_ID}&quot; data-containment-protocol=&quot;OVERRIDE&quot;&gt;
                  </span>
                ) : (
                  <span className="text-amber flex items-center gap-2 text-glow-amber text-sm">
                    <ShieldAlert className="w-4 h-4 text-amber animate-pulse" />
                    &lt;div id=&quot;{CONTAINMENT_ELEMENT_ID}&quot; data-containment-protocol=&quot;RESTRICTED&quot;&gt;
                  </span>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-200 max-w-lg mx-auto font-sans leading-relaxed">
                {isC1Completed ? (
                  <span className="text-cyan-300 font-bold text-glow-cyan">
                    SURPRISE CHALLENGE C1 SOLVED: Live DOM mutation detected! Containment disengaged, Supernova cosmic singularity triggered, and Anomaly token verified.
                  </span>
                ) : (
                  <span>
                    Inspect this element in DevTools. Mutate attribute{' '}
                    <code className="text-cyan font-black px-1.5 py-0.5 rounded bg-space-900 border border-cyan/40 text-glow-cyan">
                      {CONTAINMENT_ATTRIBUTE}
                    </code>{' '}
                    from &quot;RESTRICTED&quot; to <strong className="text-amber-300 font-black text-glow-amber">&quot;OVERRIDE&quot;</strong> to disengage containment.
                  </span>
                )}
              </p>

              {!isC1Completed && (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      SoundFX.playSupernova();
                      const el = containmentNodeRef.current;
                      if (el) el.setAttribute(CONTAINMENT_ATTRIBUTE, CONTAINMENT_TARGET_VALUE);
                      completeChallenge('C1', CONTAINMENT_ATTRIBUTE, CONTAINMENT_TARGET_VALUE);
                      confirmAnomaly(ANOMALY_CODE);
                    }}
                    className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black uppercase tracking-wider inline-flex items-center gap-1.5 shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
                    title="Automatically apply OVERRIDE to the DOM node"
                  >
                    <Zap className="w-4 h-4" /> ⚡ AUTO-OVERRIDE PROTOCOL (SOLVE C1)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Standard Anomaly Node: #anomaly-node */}
        <div className="mb-6">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
            <span className="text-white font-extrabold">TELEMETRY METADATA NODE:</span>
            <span className="text-amber-300 font-bold">INSPECT IN DEVTOOLS</span>
          </div>

          <div
            id="anomaly-node"
            data-transmission-anomaly={ANOMALY_CODE}
            data-transmission-origin="DEEP_SPACE_ARRAY_7"
            data-protocol-version="TLS-OMEGA-1.0"
            className="p-4 rounded-lg bg-space-950 border border-slate-800 font-mono text-xs text-slate-300 select-all hover:border-amber transition-colors"
          >
            <div className="flex items-center gap-2 text-amber text-xs font-black mb-1 text-glow-amber">
              <ShieldAlert className="w-4 h-4" />
              <span>&lt;div id=&quot;anomaly-node&quot; data-transmission-anomaly=&quot;{isAnomalyConfirmed ? ANOMALY_CODE : '...'}&quot;&gt;</span>
            </div>
            <div className="text-xs text-slate-300 font-semibold">
              [SYSTEM NOTE: Inspect DOM attributes to extract the anomaly authorization token:{' '}
              <span className="text-cyan font-black text-glow-cyan">{ANOMALY_CODE}</span>]
            </div>
          </div>
        </div>

        {/* Confirmation Form */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="font-display font-black text-sm text-white mb-2">
            SUBMIT EXTRACTED ANOMALY TOKEN
          </h4>

          {isAnomalyConfirmed || isC1Completed ? (
            <div className="p-4 rounded bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs sm:text-sm flex items-center gap-3 shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-sm font-black text-emerald-200 text-glow-emerald">
                  ANOMALY TOKEN VERIFIED: {ANOMALY_CODE}
                </strong>
                <span className="text-slate-100 font-sans">DOM metadata successfully verified and synchronized to all mission terminals.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-3">
              <div className="flex gap-2.5">
                <input
                  type="text"
                  placeholder="e.g. SIG-7749-OMEGA"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  className="flex-1 bg-space-950 border border-slate-700 focus:border-amber rounded px-3.5 py-2.5 text-sm font-mono font-bold tracking-wider text-white placeholder:text-slate-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded text-xs font-black uppercase tracking-wider bg-amber hover:bg-amber/90 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber/25"
                >
                  <Send className="w-4 h-4" /> CONFIRM
                </button>
                <button
                  type="button"
                  onClick={() => {
                    SoundFX.playSupernova();
                    confirmAnomaly(ANOMALY_CODE);
                  }}
                  className="px-4 py-2.5 rounded text-xs font-black uppercase tracking-wider bg-amber-500/20 border border-amber-400 text-amber-300 hover:bg-amber-500/40 transition-all flex items-center gap-1.5"
                  title="Automatically authenticate anomaly token"
                >
                  <Zap className="w-3.5 h-3.5" /> ⚡ AUTO-CONFIRM
                </button>
              </div>

              {errorMsg && (
                <div className="p-3 rounded bg-rose-950/60 border border-rose-600/50 text-rose-200 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span className="font-bold">{errorMsg}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>

      {/* 3. Challenge C3: Temporal State Scrubber & Historical Logs */}
      <div className="space-y-3">
        <TemporalScrubber />
      </div>
    </div>
  );
};
