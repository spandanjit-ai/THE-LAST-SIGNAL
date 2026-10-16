import React from 'react';
import { Check, ShieldAlert, Key, Terminal, Search, Lock } from 'lucide-react';
import { MissionState, ClueId } from '../engine/missionTypes';

interface ClueTrackerProps {
  state: MissionState;
}

export const ClueTracker: React.FC<ClueTrackerProps> = ({ state }) => {
  const clues: { id: ClueId; title: string; subtitle: string; icon: React.ComponentType<{ className?: string }> }[] = [
    {
      id: 'clue_cipher_text',
      title: 'CIPHERTEXT',
      subtitle: 'VJG NCUV UKIPCN',
      icon: Terminal,
    },
    {
      id: 'clue_key_shift',
      title: 'SHIFT KEY',
      subtitle: state.shiftUsed ? `SHIFT ${state.shiftUsed}` : 'DISCOVER IN TAB 2',
      icon: Key,
    },
    {
      id: 'clue_anomaly_metadata',
      title: 'DOM ANOMALY',
      subtitle: state.anomalyConfirmed ? 'CONFIRMED' : 'INSPECT IN TAB 3',
      icon: Search,
    },
    {
      id: 'clue_decoded_message',
      title: 'DECODED MESSAGE',
      subtitle: state.decodedMessage || 'PENDING DECRYPTION',
      icon: Lock,
    },
  ];

  const completedCount = Object.values(state.discoveredClues).filter(Boolean).length;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-lg p-3.5 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider font-bold text-slate-300 flex items-center gap-2">
          <ShieldAlert className="w-3.5 h-3.5 text-cyan" />
          CLUE SYNCHRONIZATION MATRIX
        </span>
        <span className="text-[11px] font-mono text-cyan bg-cyan/10 border border-cyan/20 px-2 py-0.5 rounded">
          {completedCount} / 4 CLUES DISCOVERED
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {clues.map((c) => {
          const isDone = state.discoveredClues[c.id];
          const Icon = c.icon;

          return (
            <div
              key={c.id}
              className={`p-2.5 rounded border transition-all duration-300 flex items-start gap-2.5 ${
                isDone
                  ? 'bg-space-950 border-emerald-500/40 text-emerald-300 shadow-sm shadow-emerald-500/10'
                  : 'bg-space-950/60 border-slate-800/80 text-slate-500'
              }`}
            >
              <div
                className={`w-6 h-6 rounded flex items-center justify-center shrink-0 text-xs font-bold ${
                  isDone ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-850 text-slate-600'
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
              </div>
              <div className="overflow-hidden">
                <div className={`text-[11px] font-bold tracking-wider uppercase truncate ${isDone ? 'text-slate-200' : 'text-slate-400'}`}>
                  {c.title}
                </div>
                <div className="text-[10px] font-mono truncate text-slate-400">
                  {c.subtitle}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
