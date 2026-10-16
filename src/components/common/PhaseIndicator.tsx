import React from 'react';
import { Activity, Zap, CheckCircle2 } from 'lucide-react';
import { useMission } from '../../hooks/useMission';

export const PhaseIndicator: React.FC = () => {
  const { state } = useMission();
  const currentPhase = state.currentPhase;
  const secondsRemaining = state.phaseSecondsRemaining;
  const isStable = currentPhase === 'STABLE';

  // 30-second cycle total: ~10s searching, ~10s aligning, ~10s stable
  const progressPct = Math.min(100, Math.max(10, ((30 - secondsRemaining) / 30) * 100));

  const phaseConfig = {
    SEARCHING: {
      color: 'text-cyan border-cyan/50 bg-cyan/10 shadow-lg shadow-cyan/10',
      barColor: 'bg-cyan',
      badge: 'bg-cyan/20 text-cyan border-cyan/50 text-glow-cyan',
      icon: Activity,
      label: 'SEARCHING',
      message: `Scanning frequency spectrum. Stable resonance window opens in ~${secondsRemaining}s`,
    },
    ALIGNING: {
      color: 'text-violet border-violet/50 bg-violet/10 shadow-lg shadow-violet/10',
      barColor: 'bg-violet',
      badge: 'bg-violet/20 text-violet border-violet/50 text-glow-violet',
      icon: Zap,
      label: 'ALIGNING',
      message: `Carrier wave synchronizing! Stand by for stable transmission in ~${secondsRemaining}s`,
    },
    STABLE: {
      color: 'text-emerald-300 border-emerald-500/60 bg-emerald-500/15 shadow-xl shadow-emerald-500/20',
      barColor: 'bg-emerald-400',
      badge: 'bg-emerald-500/30 text-emerald-200 border-emerald-400 animate-pulse text-glow-emerald',
      icon: CheckCircle2,
      label: 'STABLE RESONANCE',
      message: `TRANSMISSION WINDOW OPEN! ${secondsRemaining}s remaining to submit vault code`,
    },
    DRIFTING: {
      color: 'text-amber border-amber/50 bg-amber/10 shadow-lg shadow-amber/10',
      barColor: 'bg-amber',
      badge: 'bg-amber/20 text-amber border-amber/50 text-glow-amber',
      icon: Zap,
      label: 'DRIFTING',
      message: `Carrier wave drifting! Recalibrating in ~${secondsRemaining}s`,
    },
  }[currentPhase] || {
    color: 'text-cyan border-cyan/50 bg-cyan/10',
    barColor: 'bg-cyan',
    badge: 'bg-cyan/20 text-cyan border-cyan/50 text-glow-cyan',
    icon: Activity,
    label: currentPhase,
    message: `Carrier phase ${currentPhase} [${secondsRemaining}s remaining]`,
  };

  const Icon = phaseConfig.icon;

  return (
    <div className={`p-4 rounded-lg border backdrop-blur-md transition-all duration-300 ${phaseConfig.color} font-mono`}>
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-2.5">
          <Icon className={`w-4 h-4 ${isStable ? 'animate-bounce text-emerald-300' : ''}`} />
          <span className="text-xs uppercase tracking-wider font-extrabold text-white">
            SIGNAL PHASE MONITOR:
          </span>
          <span className={`px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-widest border ${phaseConfig.badge}`}>
            {phaseConfig.label}
          </span>
        </div>

        <div className="text-right">
          <span className="font-mono text-xs font-black text-white">
            {isStable ? (
              <span className="text-emerald-300 text-glow-emerald">{secondsRemaining}s REMAINING</span>
            ) : (
              <span className="text-cyan-300 text-glow-cyan">WINDOW IN {secondsRemaining}s</span>
            )}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-space-950 rounded-full h-2 overflow-hidden mb-2.5 border border-slate-800">
        <div
          className={`h-full transition-all duration-200 ${phaseConfig.barColor}`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-slate-200">{phaseConfig.message}</span>
        <span className="text-[11px] text-cyan-300 uppercase font-mono font-bold tracking-wider">
          CYCLE: 30s
        </span>
      </div>
    </div>
  );
};
