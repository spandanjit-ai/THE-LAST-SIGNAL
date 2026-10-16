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
    <div className="border border-slate-800 bg-space-900/90 rounded-lg backdrop-blur-md transition-all font-mono">
      {/* Sleek Tactical HUD Bar */}
      <div className="px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Track & Phase Indicator */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              isC1Completed
                ? 'bg-cyan shadow-[0_0_10px_#00f0ff]'
                : 'bg-amber animate-pulse shadow-[0_0_10px_#f59e0b]'
            }`}
          />
          <span className="font-display font-black text-xs tracking-wider text-white uppercase">
            PHASE 01 OVERRIDE
          </span>
          <span className="text-[11px] text-amber-400 font-bold border-l border-slate-700 pl-2">
            TRACK OMEGA
          </span>
        </div>

        {/* Center: 3 Compact Minimal Badges */}
        <div className="flex items-center gap-2">
          {/* C1 Badge */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`px-3 py-1 rounded text-[11px] font-black tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              isC1Completed
                ? 'bg-cyan/20 border border-cyan/60 text-cyan text-glow-cyan shadow-sm shadow-cyan/20'
                : 'bg-amber/20 border border-amber/50 text-amber text-glow-amber hover:border-amber animate-pulse'
            }`}
            title="Challenge 01: Plot Twist (Click to inspect dossier)"
          >
            {isC1Completed ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-amber animate-pulse" />
            )}
            <span>C1: PLOT TWIST</span>
            <span className="text-[10px] opacity-90">[{isC1Completed ? 'SOLVED' : 'ACTIVE'}]</span>
          </button>

          {/* C2 Badge */}
          <div className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase bg-space-950 border border-slate-800 text-slate-400 flex items-center gap-1.5 opacity-60">
            <Lock className="w-3 h-3" />
            <span>C2: LOCKED</span>
          </div>

          {/* C3 Badge */}
          <div className="px-2.5 py-1 rounded text-[10px] font-mono tracking-wider uppercase bg-space-950 border border-slate-800 text-slate-400 flex items-center gap-1.5 opacity-60">
            <Lock className="w-3 h-3" />
            <span>C3: LOCKED</span>
          </div>
        </div>

        {/* Right: Toggle & Progress */}
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <span>UNVEILED: <strong className="text-amber-400 font-bold text-glow-amber">1/3</strong></span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-cyan-300 hover:text-cyan transition-colors"
          >
            <span>{isExpanded ? 'COLLAPSE' : 'DOSSIER'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Restrained Classified Dossier (Expanded) */}
      {isExpanded && (
        <div className="px-4 pb-3.5 pt-2 border-t border-slate-800 text-xs">
          <div className="p-3.5 rounded-lg bg-space-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-cyan font-black text-xs text-glow-cyan">CHALLENGE 01 // PLOT TWIST</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  TARGET: #{c1?.targetSelector?.replace('#', '') || 'containment-anomaly-node'}
                </span>
              </div>
              <div className="text-xs text-slate-200">
                {isC1Completed ? (
                  <span className="text-emerald-300 font-bold text-glow-emerald">
                    Breach verified: Live DOM mutation resolved. Protocol elevated to OVERRIDE.
                  </span>
                ) : (
                  <span>
                    Inspect DOM node and mutate <code className="text-cyan font-bold">&quot;data-containment-protocol&quot;</code> to <code className="text-amber-300 font-bold">&quot;OVERRIDE&quot;</code>.
                  </span>
                )}
              </div>
            </div>

            <div className="text-right font-mono text-[11px] text-slate-400">
              STATUS: <strong className={isC1Completed ? 'text-emerald-300 font-bold' : 'text-amber-400 font-bold'}>{c1?.status || 'ACTIVE'}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
