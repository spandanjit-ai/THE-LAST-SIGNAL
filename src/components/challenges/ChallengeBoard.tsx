import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  CheckCircle2,
  Lock,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';


export const ChallengeBoard: React.FC<{ defaultExpanded?: boolean }> = ({ defaultExpanded = false }) => {
  const { state } = useMission();
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const challenges = state.challenges;
  const c1 = challenges?.items?.C1;
  const isC1Completed = c1?.status === 'COMPLETED';

  return (
    <div className="border border-noir-border/80 bg-noir-surface/70 rounded backdrop-blur-md transition-all font-mono">
      {/* Sleek Tactical HUD Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Track & Phase Indicator */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2 h-2 rounded-full transition-all ${
              isC1Completed
                ? 'bg-signal-cyan shadow-[0_0_8px_#22d3ee]'
                : 'bg-signal-amber animate-pulse shadow-[0_0_8px_#ffb454]'
            }`}
          />
          <span className="font-display font-bold text-xs tracking-wider text-signal-text uppercase">
            PHASE 01 OVERRIDE
          </span>
          <span className="text-[10px] text-signal-dim border-l border-noir-border/80 pl-2">
            TRACK OMEGA
          </span>
        </div>

        {/* Center: 3 Compact Minimal Badges */}
        <div className="flex items-center gap-2">
          {/* C1 Badge */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              isC1Completed
                ? 'bg-signal-cyan/15 border border-signal-cyan/50 text-signal-cyan'
                : 'bg-signal-amber/15 border border-signal-amber/40 text-signal-amber hover:border-signal-amber'
            }`}
            title="Challenge 01: Plot Twist (Click to inspect dossier)"
          >
            {isC1Completed ? (
              <CheckCircle2 className="w-3 h-3 text-signal-cyan" />
            ) : (
              <Zap className="w-3 h-3 text-signal-amber animate-pulse" />
            )}
            <span>C1: PLOT TWIST</span>
            <span className="text-[9px] opacity-75">[{isC1Completed ? 'SOLVED' : 'ACTIVE'}]</span>
          </button>

          {/* C2 Badge */}
          <div className="px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase bg-noir-base/60 border border-noir-border text-signal-dim flex items-center gap-1.5 opacity-60">
            <Lock className="w-2.5 h-2.5" />
            <span>C2: LOCKED</span>
          </div>

          {/* C3 Badge */}
          <div className="px-2 py-1 rounded text-[10px] font-mono tracking-wider uppercase bg-noir-base/60 border border-noir-border text-signal-dim flex items-center gap-1.5 opacity-60">
            <Lock className="w-2.5 h-2.5" />
            <span>C3: LOCKED</span>
          </div>
        </div>

        {/* Right: Toggle & Progress */}
        <div className="flex items-center gap-3 text-[11px] text-signal-dim">
          <span>UNVEILED: <strong className="text-signal-amber">1/3</strong></span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[10px] tracking-wider text-signal-muted hover:text-signal-cyan transition-colors"
          >
            <span>{isExpanded ? 'COLLAPSE' : 'DOSSIER'}</span>
            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Restrained Classified Dossier (Expanded) */}
      {isExpanded && (
        <div className="px-4 pb-3.5 pt-2 border-t border-noir-border/60 text-xs">
          <div className="p-3 rounded bg-noir-base/80 border border-noir-border/70 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-signal-cyan font-bold text-xs">CHALLENGE 01 // PLOT TWIST</span>
                <span className="text-[10px] text-signal-dim font-mono">
                  TARGET: #{c1?.targetSelector?.replace('#', '') || 'containment-anomaly-node'}
                </span>
              </div>
              <div className="text-[11px] text-signal-muted">
                {isC1Completed ? (
                  <span className="text-signal-cyan font-mono">
                    PROTOCOL OVERRIDDEN: [data-containment-protocol=&quot;OVERRIDE&quot;] // Carrier origin verified as Internal System Beacon.
                  </span>
                ) : (
                  <span className="text-signal-dim font-mono">
                    DOM Mutation required: Inspect <code className="text-signal-cyan">#containment-anomaly-node</code> on the Anomaly tab and set <code className="text-signal-amber">data-containment-protocol=&quot;OVERRIDE&quot;</code>.
                  </span>
                )}
              </div>
            </div>

            <div className="flex-shrink-0 text-[10px] font-mono">
              {isC1Completed ? (
                <span className="text-signal-cyan font-bold px-2 py-0.5 rounded bg-signal-cyan/10 border border-signal-cyan/30">
                  MUTATION VERIFIED &amp; SYNCED
                </span>
              ) : (
                <span className="text-signal-amber px-2 py-0.5 rounded bg-signal-amber/10 border border-signal-amber/30">
                  AWAITING DOM MUTATION
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
