import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  ShieldAlert,
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Terminal,
  Cpu,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface ChallengeBoardProps {
  defaultExpanded?: boolean;
}

export const ChallengeBoard: React.FC<ChallengeBoardProps> = ({ defaultExpanded = true }) => {
  const { state } = useMission();
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const challenges = state.challenges;
  const c1 = challenges?.items?.C1;
  const c2 = challenges?.items?.C2;
  const c3 = challenges?.items?.C3;

  const isC1Completed = c1?.status === 'COMPLETED';

  return (
    <div className="border border-noir-border bg-noir-surface/90 rounded overflow-hidden backdrop-blur-md shadow-2xl transition-all">
      {/* Dossier Header Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-3.5 bg-noir-elevated/70 border-b border-noir-border flex flex-wrap items-center justify-between gap-3 cursor-pointer select-none hover:bg-noir-elevated transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-1.5 rounded border transition-colors ${
              isC1Completed
                ? 'bg-signal-cyan/15 border-signal-cyan/40 text-signal-cyan'
                : 'bg-signal-amber/15 border-signal-amber/40 text-signal-amber animate-pulse'
            }`}
          >
            {isC1Completed ? (
              <Zap className="w-4 h-4" />
            ) : (
              <ShieldAlert className="w-4 h-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm tracking-wider text-signal-text uppercase">
                {challenges?.phaseTitle || 'PHASE 01 OVERRIDE'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-noir-base border border-noir-border text-signal-cyan">
                {challenges?.track || 'TRACK OMEGA // MYSTERY BOX'}
              </span>
            </div>
            <div className="text-[11px] font-mono text-signal-dim mt-0.5">
              HACKATHON SURPRISE CHALLENGE BOARD — LIVE EVALUATION MATRIX
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-signal-dim">UNVEILED:</span>
            <span className="font-bold text-signal-amber">
              {challenges?.revealedCount || 1} / {challenges?.totalCount || 3}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-signal-dim">SOLVED:</span>
            <span
              className={`font-bold ${
                isC1Completed ? 'text-signal-cyan' : 'text-signal-muted'
              }`}
            >
              {isC1Completed ? '1 / 3' : '0 / 3'}
            </span>
          </div>

          <button
            type="button"
            className="p-1 rounded text-signal-dim hover:text-signal-text transition-colors"
            aria-label={isExpanded ? 'Collapse challenge board' : 'Expand challenge board'}
          >
            {isExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Challenge Cards Grid */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* CHALLENGE 1: PLOT TWIST (ACTIVE or COMPLETED) */}
            <div
              className={`relative rounded border p-4 sm:p-5 flex flex-col justify-between transition-all ${
                isC1Completed
                  ? 'bg-signal-cyan/5 border-signal-cyan/40 shadow-[0_0_20px_rgba(34,211,238,0.08)]'
                  : 'bg-noir-base/80 border-signal-amber/40 hover:border-signal-amber'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-signal-cyan font-bold tracking-wider">
                    CHALLENGE 01
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 ${
                      isC1Completed
                        ? 'bg-signal-cyan/20 border border-signal-cyan/50 text-signal-cyan'
                        : 'bg-signal-amber/20 border border-signal-amber/50 text-signal-amber animate-pulse'
                    }`}
                  >
                    {isC1Completed ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        COMPLETED
                      </>
                    ) : (
                      <>
                        <Terminal className="w-3 h-3" />
                        ACTIVE
                      </>
                    )}
                  </span>
                </div>

                <h3 className="font-display font-bold text-lg text-signal-text tracking-wide mb-1">
                  {c1?.title || 'Plot Twist'}
                </h3>
                <div className="text-[10px] font-mono text-signal-amber tracking-wider uppercase mb-3">
                  {c1?.subtitle || 'LIVE DOM-MUTATION PROTOCOL BREACH'}
                </div>

                <p className="text-xs font-mono text-signal-muted leading-relaxed mb-4">
                  {c1?.description ||
                    'A live DOM-mutation puzzle solved by editing HTML attributes inside browser DevTools.'}
                </p>

                {/* Technical Mutation Target Specification */}
                <div className="p-3 rounded bg-noir-surface border border-noir-border space-y-1.5 font-mono text-[11px] text-signal-dim mb-4">
                  <div className="flex justify-between items-center">
                    <span>TARGET:</span>
                    <span className="text-signal-text font-bold">
                      {c1?.targetSelector || '#containment-anomaly-node'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ATTRIBUTE:</span>
                    <span className="text-signal-cyan">
                      {c1?.targetAttribute || 'data-containment-protocol'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>TARGET VAL:</span>
                    <span className="text-signal-amber font-bold">
                      &quot;{c1?.requiredValue || 'OVERRIDE'}&quot;
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Outcome Footer */}
              <div>
                {isC1Completed ? (
                  <div className="pt-3 border-t border-signal-cyan/20 space-y-2">
                    <div className="text-[10px] font-mono text-signal-cyan flex items-center justify-between">
                      <span>MUTATION VERIFIED</span>
                      <span>
                        {c1?.completedAt
                          ? new Date(c1.completedAt).toLocaleTimeString()
                          : 'LOCKED'}
                      </span>
                    </div>
                    {c1?.twistRevealed && (
                      <div className="p-2.5 rounded bg-noir-base border border-signal-cyan/30 text-[11px] font-mono text-signal-text leading-relaxed">
                        <span className="text-signal-cyan font-bold block mb-1">
                          [REVEALED INTEL]:
                        </span>
                        {c1.twistRevealed}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-3 border-t border-noir-border text-[11px] font-mono text-signal-dim flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-signal-amber flex-shrink-0" />
                    <span>Navigate to Anomaly tab &amp; inspect DOM.</span>
                  </div>
                )}
              </div>
            </div>

            {/* CHALLENGE 2: MAKE IT COME ALIVE (LOCKED) */}
            <div className="relative rounded border border-noir-border bg-noir-base/40 p-4 sm:p-5 flex flex-col justify-between opacity-75">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-signal-dim font-bold tracking-wider">
                    CHALLENGE 02
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-noir-surface border border-noir-border text-signal-dim flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    LOCKED
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-signal-muted tracking-wide mb-1">
                  {c2?.title || 'Make It Come Alive'}
                </h3>
                <div className="text-[10px] font-mono text-signal-dim tracking-wider uppercase mb-3">
                  {c2?.subtitle || 'AWAITING HACKATHON BROADCAST'}
                </div>

                <p className="text-xs font-mono text-signal-dim leading-relaxed mb-4">
                  {c2?.description ||
                    'Challenge specifications currently encrypted by hackathon organizers. Stand by for Phase 02 activation.'}
                </p>
              </div>

              <div className="pt-3 border-t border-noir-border/60 text-[11px] font-mono text-signal-dim flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-signal-dim" />
                <span>STANDBY // LOCKED BY PROTOCOL</span>
              </div>
            </div>

            {/* CHALLENGE 3: CHAOS CARD (LOCKED) */}
            <div className="relative rounded border border-noir-border bg-noir-base/40 p-4 sm:p-5 flex flex-col justify-between opacity-75">
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-signal-dim font-bold tracking-wider">
                    CHALLENGE 03
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase bg-noir-surface border border-noir-border text-signal-dim flex items-center gap-1.5">
                    <Lock className="w-3 h-3" />
                    LOCKED
                  </span>
                </div>

                <h3 className="font-display font-semibold text-lg text-signal-muted tracking-wide mb-1">
                  {c3?.title || 'Chaos Card'}
                </h3>
                <div className="text-[10px] font-mono text-signal-dim tracking-wider uppercase mb-3">
                  {c3?.subtitle || 'AWAITING HACKATHON BROADCAST'}
                </div>

                <p className="text-xs font-mono text-signal-dim leading-relaxed mb-4">
                  {c3?.description ||
                    'Wildcard challenge tier currently locked. Awaiting system trigger signal.'}
                </p>
              </div>

              <div className="pt-3 border-t border-noir-border/60 text-[11px] font-mono text-signal-dim flex items-center gap-2">
                <Cpu className="w-3.5 h-3.5 text-signal-dim" />
                <span>STANDBY // LOCKED BY PROTOCOL</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
