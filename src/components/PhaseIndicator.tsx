import React from 'react';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';
import { PhaseTimingInfo } from '../engine/temporalLogic';

interface PhaseIndicatorProps {
  phaseInfo: PhaseTimingInfo;
}

export const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ phaseInfo }) => {
  const { phase, progressPct, remainingInPhaseMs, secondsToStable, isStable } = phaseInfo;

  const phaseConfig = {
    SEARCHING: {
      color: 'text-cyan border-cyan/40 bg-cyan/5',
      barColor: 'bg-cyan',
      badge: 'bg-cyan/20 text-cyan border-cyan/30',
      icon: Activity,
      label: 'SEARCHING',
      message: `Scanning frequency spectrum. Stable resonance window in ~${secondsToStable}s`,
    },
    ALIGNING: {
      color: 'text-violet border-violet/40 bg-violet/5',
      barColor: 'bg-violet',
      badge: 'bg-violet/20 text-violet border-violet/30',
      icon: Zap,
      label: 'ALIGNING',
      message: `Carrier wave synchronizing! Stand by for stable transmission in ~${secondsToStable}s`,
    },
    STABLE: {
      color: 'text-emerald-400 border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10',
      barColor: 'bg-emerald-400',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 animate-pulse',
      icon: CheckCircle2,
      label: 'STABLE RESONANCE',
      message: `TRANSMISSION WINDOW OPEN! ${(remainingInPhaseMs / 1000).toFixed(1)}s remaining to submit`,
    },
  }[phase];

  const Icon = phaseConfig.icon;

  return (
    <div className={`p-3.5 rounded-lg border backdrop-blur-sm transition-all duration-300 ${phaseConfig.color}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${isStable ? 'animate-bounce text-emerald-400' : ''}`} />
          <span className="text-xs uppercase tracking-wider font-bold text-slate-200">
            SIGNAL PHASE MONITOR:
          </span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-widest border ${phaseConfig.badge}`}>
            {phaseConfig.label}
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-bold text-slate-100">
            {isStable 
              ? `${(remainingInPhaseMs / 1000).toFixed(1)}s` 
              : `IN ${secondsToStable}s`
            }
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-space-950 rounded-full h-1.5 overflow-hidden mb-2 border border-slate-800">
        <div
          className={`h-full transition-all duration-200 ${phaseConfig.barColor}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-400">
        <span>{phaseConfig.message}</span>
        <span className="text-[10px] text-slate-500 uppercase font-mono">
          CYCLE: 30s
        </span>
      </div>
    </div>
  );
};
