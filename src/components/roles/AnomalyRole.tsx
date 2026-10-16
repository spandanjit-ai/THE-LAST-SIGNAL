import React, { useEffect, useRef, useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  CONTAINMENT_ELEMENT_ID,
  CONTAINMENT_ATTRIBUTE,
  CONTAINMENT_INITIAL_VALUE,
  CONTAINMENT_TARGET_VALUE,
  attachContainmentObserver,
} from '../../engine/challengeObserver';
import { ANOMALY_CODE } from '../../engine/verification';
import {
  Binary,
  Code2,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  Zap,
  Activity,
  Terminal,
} from 'lucide-react';


export const AnomalyRole: React.FC = () => {
  const { state, completeChallenge, confirmAnomaly } = useMission();
  const containmentNodeRef = useRef<HTMLDivElement>(null);
  const [mutationFeedback, setMutationFeedback] = useState<string | null>(null);

  const c1Status = state.challenges?.items?.C1?.status;
  const isC1Completed = c1Status === 'COMPLETED';
  const isAnomalyConfirmed = state.anomalyConfirmed || isC1Completed;

  // Real, observable DOM-Mutation puzzle
  useEffect(() => {
    const el = containmentNodeRef.current;
    if (!el) return;

    // React rerender safety: Uncontrolled DOM attribute management
    if (!el.hasAttribute(CONTAINMENT_ATTRIBUTE)) {
      el.setAttribute(
        CONTAINMENT_ATTRIBUTE,
        isC1Completed ? CONTAINMENT_TARGET_VALUE : CONTAINMENT_INITIAL_VALUE
      );
    }

    // Attach strict MutationObserver directly to the designated target node
    const cleanup = attachContainmentObserver({
      targetElement: el,
      onValidMutation: (attribute, value) => {
        setMutationFeedback(`VALID MUTATION DETECTED: [${attribute}="${value}"]. Initiating containment override...`);
        completeChallenge('C1', attribute, value);
        confirmAnomaly(ANOMALY_CODE);
      },
      onInvalidMutation: (attribute, value) => {
        setMutationFeedback(
          `MUTATION REJECTED: [${attribute}="${value}"]. Required protocol value is "${CONTAINMENT_TARGET_VALUE}".`
        );
      },
    });

    return () => {
      cleanup();
    };
  }, [isC1Completed, completeChallenge, confirmAnomaly]);

  return (
    <div className="space-y-6">
      {/* Top Telemetry Header */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-noir-border">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded border ${
                isC1Completed
                  ? 'bg-signal-cyan/15 border-signal-cyan/40 text-signal-cyan'
                  : 'bg-noir-base border-signal-amber/30 text-signal-amber'
              }`}
            >
              {isC1Completed ? <Zap className="w-5 h-5" /> : <Binary className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-[10px] font-mono text-signal-amber uppercase tracking-widest">
                TRACK OMEGA // CHALLENGE 01
              </div>
              <h2 className="font-display font-bold text-xl text-signal-text tracking-tight">
                CONTAINMENT TELEMETRY &amp; ANOMALY NODE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isC1Completed ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#22D3EE]/15 border border-[#22D3EE]/40 text-signal-cyan">
                <ShieldCheck className="w-3.5 h-3.5 text-signal-cyan" />
                PROTOCOL OVERRIDDEN &amp; SYNCED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-base border border-noir-border text-signal-amber animate-pulse">
                <ShieldAlert className="w-3.5 h-3.5" />
                CONTAINMENT RESTRICTED
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-signal-muted leading-relaxed max-w-3xl">
          Deep diagnostic telemetry reports an isolated carrier packet locked under strict protocol containment.
          The transmission origin remains classified until security parameters are overridden.
        </p>
      </div>

      {/* Unsettling Containment Warning & Indirect Clue */}
      <div
        className={`p-4 sm:p-5 rounded border transition-all ${
          isC1Completed
            ? 'bg-noir-surface border-signal-cyan/30'
            : 'bg-signal-amber/5 border-signal-amber/30'
        }`}
      >
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-signal-amber mb-2">
          <AlertTriangle className="w-4 h-4 text-signal-amber" />
          <span>SECURITY DIRECTIVE // CONTAINMENT ENFORCEMENT</span>
        </div>
        <p className="text-xs font-mono text-signal-text leading-relaxed">
          {isC1Completed ? (
            <span className="text-signal-cyan">
              Containment locks have been breached. Security protocols disengaged across all linked browser terminals.
            </span>
          ) : (
            <span>
              NOTICE: The carrier anomaly in sector 0x7749 is quarantined. Interface controls cannot alter this state.
              Only manual tampering with the DOM attribute <code className="text-signal-cyan px-1 py-0.5 rounded bg-noir-base border border-noir-border">{CONTAINMENT_ATTRIBUTE}</code> via browser DevTools to the security command <code className="text-signal-amber px-1 py-0.5 rounded bg-noir-base border border-noir-border font-bold">&quot;{CONTAINMENT_TARGET_VALUE}&quot;</code> will bypass the quarantine.
            </span>
          )}
        </p>
      </div>

      {/* DESIGNATED DOM-MUTATION TARGET ELEMENT */}
      <div
        id={CONTAINMENT_ELEMENT_ID}
        ref={containmentNodeRef}
        data-signal-anomaly={ANOMALY_CODE}
        className={`relative p-5 sm:p-6 rounded border transition-all ${
          isC1Completed
            ? 'border-signal-cyan/50 bg-signal-cyan/5 shadow-[0_0_25px_rgba(34,211,238,0.1)]'
            : 'border-dashed border-signal-amber/50 bg-noir-surface/90 hover:border-signal-amber'
        }`}
      >
        <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-3 gap-2">
          <span className="text-signal-amber font-bold flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            DESIGNATED MUTATION NODE [ID: #{CONTAINMENT_ELEMENT_ID}]
          </span>
          <span className="text-[10px] text-signal-dim font-mono">
            TAG: &lt;div id=&quot;{CONTAINMENT_ELEMENT_ID}&quot; {CONTAINMENT_ATTRIBUTE}=&quot;...&quot;&gt;
          </span>
        </div>

        {/* Live DevTools Status Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-xs mb-4">
          <div className="p-3 rounded bg-noir-base border border-noir-border">
            <div className="text-[10px] text-signal-dim uppercase">TARGET ID</div>
            <div className="text-signal-text font-bold mt-1">#{CONTAINMENT_ELEMENT_ID}</div>
          </div>
          <div className="p-3 rounded bg-noir-base border border-noir-border">
            <div className="text-[10px] text-signal-dim uppercase">SECURITY ATTRIBUTE</div>
            <div className="text-signal-cyan font-bold mt-1">{CONTAINMENT_ATTRIBUTE}</div>
          </div>
          <div className="p-3 rounded bg-noir-base border border-noir-border">
            <div className="text-[10px] text-signal-dim uppercase">STATE</div>
            <div
              className={`font-bold mt-1 ${
                isC1Completed ? 'text-signal-cyan' : 'text-signal-amber animate-pulse'
              }`}
            >
              {isC1Completed ? 'OVERRIDE [BREACHED]' : 'RESTRICTED [LOCKED]'}
            </div>
          </div>
        </div>

        {/* DevTools Instruction Clue */}
        {!isC1Completed ? (
          <div className="space-y-3">
            <p className="text-xs font-mono text-signal-text leading-relaxed">
              To trigger the Plot Twist and override containment:
            </p>
            <ol className="list-decimal list-inside text-xs font-mono text-signal-muted space-y-1.5 pl-1">
              <li>
                Open DevTools (<kbd className="px-1.5 py-0.5 rounded bg-noir-base border border-noir-border text-signal-text">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-noir-base border border-noir-border text-signal-text">Cmd+Option+I</kbd>).
              </li>
              <li>
                Inspect this element (<code className="text-signal-amber font-bold">#{CONTAINMENT_ELEMENT_ID}</code>).
              </li>
              <li>
                Change attribute <code className="text-signal-cyan">{CONTAINMENT_ATTRIBUTE}</code> from <code className="text-signal-dim">&quot;{CONTAINMENT_INITIAL_VALUE}&quot;</code> to <code className="text-signal-amber font-bold">&quot;{CONTAINMENT_TARGET_VALUE}&quot;</code>.
              </li>
            </ol>
          </div>
        ) : (
          /* CINEMATIC PLOT TWIST REVEAL */
          <div className="p-4 sm:p-5 rounded bg-noir-base border border-signal-cyan/40 space-y-3">
            <div className="flex items-center gap-2 text-signal-cyan font-display font-bold text-sm tracking-wide">
              <CheckCircle2 className="w-4 h-4 text-signal-cyan" />
              <span>MUTATION VERIFIED // PLOT TWIST UNLOCKED</span>
            </div>
            <div className="text-xs font-mono text-signal-text leading-relaxed bg-signal-cyan/10 p-3 rounded border border-signal-cyan/20">
              <span className="text-signal-cyan font-bold block mb-1">
                // CLASSIFIED TRANSMISSION LOG:
              </span>
              THE ANOMALY IS NOT AN EXTERNAL CARRIER. IT IS COMING FROM WITHIN OUR OWN TERMINAL NETWORK.
              WE WERE NEVER LISTENING TO AN ALIEN SIGNAL — WE WERE RECOVERING AN AUTOMATED EVACUATION ORDER TRANSMITTED BY THIS VERY MACHINE BEFORE COLLAPSE.
            </div>
            <div className="flex flex-wrap items-center justify-between text-[11px] font-mono text-signal-dim pt-1">
              <span>AUTHENTICATED TOKEN: <strong className="text-signal-amber font-bold">{ANOMALY_CODE}</strong></span>
              <span className="text-signal-cyan">ALL 3 TERMINALS SYNCHRONIZED</span>
            </div>
          </div>
        )}

        {/* Live Mutation Observer Log */}
        {mutationFeedback && (
          <div className="mt-4 p-2.5 rounded bg-noir-base border border-noir-border text-[11px] font-mono text-signal-dim flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-signal-cyan flex-shrink-0" />
            <span>OBSERVER: {mutationFeedback}</span>
          </div>
        )}
      </div>

      {/* System Status Summary */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-4 sm:p-5 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
        <div className="flex items-center gap-3">
          <Activity className="w-4 h-4 text-signal-cyan" />
          <span className="text-signal-dim">CROSS-TAB CARRIER STATUS:</span>
          <span className={isAnomalyConfirmed ? 'text-signal-cyan font-bold' : 'text-signal-amber font-bold'}>
            {isAnomalyConfirmed ? 'ANOMALY NODE VERIFIED &amp; LOCKED' : 'AWAITING PROTOCOL OVERRIDE'}
          </span>
        </div>
        <div className="text-[11px] text-signal-dim">
          OBSERVER: ACTIVE (SCOPED ATTRIBUTE OBSERVER)
        </div>
      </div>
    </div>
  );
};
