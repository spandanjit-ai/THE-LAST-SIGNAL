import React from 'react';
import { useMission } from '../../hooks/useMission';
import {
  Radio,
  KeyRound,
  Binary,
  CheckCircle2,
  Lock,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ClueProgress: React.FC = () => {
  const { state, currentRole, setRole } = useMission();

  const clues = [
    {
      id: 'transmission',
      name: 'TRANSMISSION',
      desc: 'Decipher intercepted carrier signal',
      icon: <Radio className="w-4 h-4" />,
      completed: state.completedStages.transmission || state.cipherDecoded,
      active: currentRole === 'transmission',
      hint: state.completedStages.transmission ? 'DECODED: THE LAST SIGNAL' : 'CIPHERTEXT: VJG NCUV UKIPCN',
      color: 'cyan',
    },
    {
      id: 'key',
      name: 'KEY RECOVERY',
      desc: 'Extract cipher shift offset',
      icon: <KeyRound className="w-4 h-4" />,
      completed: state.completedStages.key || state.keyDiscovered,
      active: currentRole === 'key',
      hint: state.completedStages.key ? 'RECOVERED: SHIFT -3 (ROT-3)' : 'RESONANCE TUNING REQUIRED',
      color: 'violet',
    },
    {
      id: 'anomaly',
      name: 'DOM METADATA',
      desc: 'Inspect shadow DOM attributes',
      icon: <Binary className="w-4 h-4" />,
      completed: state.completedStages.anomaly || state.anomalyConfirmed,
      active: currentRole === 'anomaly',
      hint: state.completedStages.anomaly ? 'CONFIRMED: SIG-7749-OMEGA' : 'DEVTOOLS INSPECTION REQUIRED',
      color: 'amber',
    },
  ];

  const completedCount = [
    state.completedStages.transmission || state.cipherDecoded,
    state.completedStages.key || state.keyDiscovered,
    state.completedStages.anomaly || state.anomalyConfirmed,
  ].filter(Boolean).length;

  return (
    <div className="bg-space-900/60 border border-cyan-500/20 rounded-lg p-4 backdrop-blur-md">
      {/* Progress header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sm tracking-wider text-slate-200">
            CRYPTOGRAPHIC PROGRESSION
          </span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
            {completedCount} / 3 CLUES
          </span>
        </div>

        {/* Temporal Phase status */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">TEMPORAL PHASE:</span>
          <span
            className={`font-bold px-2 py-0.5 rounded text-[11px] ${
              state.currentPhase === 'STABLE'
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/40 animate-pulse'
                : state.currentPhase === 'ALIGNING'
                ? 'bg-violet-950 text-violet-300 border border-violet-500/40'
                : 'bg-amber-950 text-amber-300 border border-amber-500/40'
            }`}
          >
            {state.currentPhase} [{state.phaseSecondsRemaining}s]
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-space-950 rounded-full overflow-hidden mb-4 border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-cyan-500 via-violet-500 to-emerald-400 transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      {/* Clue cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {clues.map((clue) => {
          return (
            <button
              key={clue.id}
              onClick={() => setRole(clue.id as any)}
              className={`text-left p-3 rounded border transition-all duration-200 group relative ${
                clue.active
                  ? 'border-cyan-400/80 bg-cyan-950/30 shadow-lg shadow-cyan-950/40 ring-1 ring-cyan-400/30'
                  : clue.completed
                  ? 'border-emerald-500/30 bg-emerald-950/10 hover:border-emerald-500/60'
                  : 'border-slate-800 bg-space-950/40 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1.5 rounded ${
                      clue.completed
                        ? 'text-emerald-400 bg-emerald-950/50'
                        : clue.active
                        ? 'text-cyan-400 bg-cyan-950/50'
                        : 'text-slate-400 bg-slate-800/50'
                    }`}
                  >
                    {clue.icon}
                  </span>
                  <div>
                    <div className="font-display font-semibold text-xs text-slate-200 group-hover:text-cyan-300 transition-colors">
                      {clue.name}
                    </div>
                    <div className="text-[10px] font-mono text-slate-400">{clue.desc}</div>
                  </div>
                </div>

                {clue.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                )}
              </div>

              <div className="mt-2 text-[10px] font-mono truncate flex items-center justify-between border-t border-slate-800/80 pt-1.5">
                <span
                  className={
                    clue.completed
                      ? 'text-emerald-300/90 font-medium'
                      : clue.active
                      ? 'text-cyan-300/90'
                      : 'text-slate-500'
                  }
                >
                  {clue.hint}
                </span>
                <ArrowRight className="w-3 h-3 text-slate-600 group-hover:text-cyan-400 transition-transform group-hover:translate-x-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
