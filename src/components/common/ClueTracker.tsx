import React from 'react';
import { Check, ShieldAlert, Key, Terminal, Search, Lock } from 'lucide-react';
import { useMission } from '../../hooks/useMission';

export const ClueTracker: React.FC = () => {
  const { state } = useMission();

  const isCipherIntercepted = true;
  const isKeyDiscovered = Boolean(state.keyDiscovered || state.discoveredClues?.key || state.completedStages?.key);
  const isAnomalyConfirmed = Boolean(state.anomalyConfirmed || state.discoveredClues?.anomaly || state.completedStages?.anomaly);
  const isDecodedMessage = Boolean(state.cipherDecoded || state.discoveredClues?.transmission || state.completedStages?.transmission);

  const clues = [
    {
      id: 'clue_cipher_text',
      title: 'CIPHERTEXT',
      subtitle: 'VJG NCUV UKIPCN',
      icon: Terminal,
      isDone: isCipherIntercepted,
      color: 'cyan',
    },
    {
      id: 'clue_key_shift',
      title: 'SHIFT KEY',
      subtitle: isKeyDiscovered ? 'SHIFT -2 (ROT-2)' : 'DISCOVER IN TAB 2',
      icon: Key,
      isDone: isKeyDiscovered,
      color: 'violet',
    },
    {
      id: 'clue_anomaly_metadata',
      title: 'DOM ANOMALY',
      subtitle: isAnomalyConfirmed ? 'CONFIRMED // OMEGA' : 'INSPECT IN TAB 3',
      icon: Search,
      isDone: isAnomalyConfirmed,
      color: 'amber',
    },
    {
      id: 'clue_decoded_message',
      title: 'DECODED MESSAGE',
      subtitle: isDecodedMessage ? 'THE LAST SIGNAL' : 'PENDING DECRYPTION',
      icon: Lock,
      isDone: isDecodedMessage,
      color: 'emerald',
    },
  ];

  const completedCount = clues.filter((c) => c.isDone).length;

  return (
    <div className="bg-space-900 border border-slate-800 rounded-lg p-4 font-mono">
      <div className="flex items-center justify-between mb-3.5">
        <span className="text-xs uppercase tracking-wider font-extrabold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-cyan" />
          CLUE SYNCHRONIZATION MATRIX
        </span>
        <span className="text-xs font-mono text-cyan bg-cyan/15 border border-cyan/40 px-3 py-0.5 rounded font-black text-glow-cyan shadow-sm shadow-cyan/10">
          {completedCount} / 4 CLUES DISCOVERED
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {clues.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.id}
              className={`p-3 rounded-lg border transition-all duration-300 flex items-start gap-3 ${
                c.isDone
                  ? 'bg-space-950 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/10'
                  : 'bg-space-950/80 border-slate-800 text-slate-400'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 text-xs font-black ${
                  c.isDone
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-glow-emerald'
                    : 'bg-space-850 text-slate-400 border border-slate-700'
                }`}
              >
                {c.isDone ? <Check className="w-4 h-4 text-emerald-400" /> : <Icon className="w-4 h-4" />}
              </div>
              <div className="overflow-hidden">
                <div
                  className={`text-xs font-black tracking-wider uppercase truncate ${
                    c.isDone ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {c.title}
                </div>
                <div
                  className={`text-[11px] font-mono truncate font-bold ${
                    c.isDone ? 'text-emerald-300 text-glow-emerald' : 'text-slate-400'
                  }`}
                >
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
