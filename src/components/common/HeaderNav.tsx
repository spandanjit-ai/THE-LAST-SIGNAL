import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import {
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  Lock,
  Unlock,
  AlertTriangle,
} from 'lucide-react';

interface HeaderNavProps {
  onOpenVaultModal?: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onOpenVaultModal }) => {
  const {
    state,
    currentRole,
    connectedTabs,
    isAudioEnabled,
    toggleAudio,
    setRole,
    resetMission,
  } = useMission();

  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const roles: Array<{
    id: MissionRole;
    label: string;
    number: string;
    completed: boolean;
    color: 'cyan' | 'violet' | 'amber';
  }> = [
    {
      id: 'transmission',
      label: 'TRANSMISSION',
      number: '01',
      completed: state.completedStages.transmission || state.cipherDecoded,
      color: 'cyan',
    },
    {
      id: 'key',
      label: 'DECRYPTION KEY',
      number: '02',
      completed: state.completedStages.key || state.keyDiscovered,
      color: 'violet',
    },
    {
      id: 'anomaly',
      label: 'DOM ANOMALY',
      number: '03',
      completed: state.completedStages.anomaly || state.anomalyConfirmed,
      color: 'amber',
    },
  ];

  return (
    <header className="relative z-30 border-b border-noir-border bg-noir-base/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity & Mission ID */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Overview"
          >
            <div className="w-6 h-6 rounded border border-signal-cyan/40 bg-noir-surface flex items-center justify-center text-signal-cyan shadow-[0_0_10px_rgba(34,211,238,0.2)]">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              </svg>
            </div>
            <div>
              <div className="font-display font-bold tracking-tight text-sm sm:text-base text-slate-100 group-hover:text-signal-cyan transition-colors">
                THE LAST SIGNAL
              </div>
              <div className="text-[10px] font-mono text-signal-dim">
                RELAY: <span className="text-signal-cyan font-bold">{state.missionId}</span> // REV {state.revision}
              </div>
            </div>
          </button>
        </div>

        {/* Tab Role Switcher */}
        <nav className="flex items-center gap-1 sm:gap-2 font-mono text-xs">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            const activeColorClass =
              r.color === 'cyan'
                ? 'border-signal-cyan/50 bg-signal-cyan/15 text-signal-cyan shadow-[0_0_12px_rgba(34,211,238,0.15)] font-bold'
                : r.color === 'violet'
                ? 'border-signal-violet/50 bg-signal-violet/15 text-signal-violet shadow-[0_0_12px_rgba(139,124,255,0.15)] font-bold'
                : 'border-signal-amber/50 bg-signal-amber/15 text-signal-amber shadow-[0_0_12px_rgba(255,180,84,0.15)] font-bold';

            const dotColor =
              r.color === 'cyan'
                ? 'bg-signal-cyan'
                : r.color === 'violet'
                ? 'bg-signal-violet'
                : 'bg-signal-amber';

            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 border ${
                  isActive
                    ? activeColorClass
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-noir-surface/60'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'font-bold' : 'text-signal-dim'}`}>{r.number}</span>
                <span>{r.label}</span>
                {r.completed ? (
                  <span className={`w-1.5 h-1.5 rounded-full ${dotColor} shadow-[0_0_6px_currentColor]`} />
                ) : (
                  <span className="w-1 h-1 rounded-full bg-slate-700" />
                )}
              </button>
            );
          })}
        </nav>


        {/* Right utility cluster */}
        <div className="flex items-center gap-2.5 font-mono text-xs">
          {/* Connected tabs count */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-noir-border bg-noir-surface text-signal-muted text-[11px]"
            title="Connected browser tabs via BroadcastChannel"
          >
            <Layers className="w-3.5 h-3.5 text-signal-cyan" />
            <span>
              <strong className="text-signal-cyan">{connectedTabs}</strong> {connectedTabs === 1 ? 'TAB' : 'TABS'}
            </span>
          </div>

          {/* Vault trigger button */}
          <button
            onClick={onOpenVaultModal}
            className={`px-3 py-1 rounded border flex items-center gap-1.5 font-display font-bold text-xs tracking-wider uppercase transition-all ${
              state.unlockStatus === 'UNLOCKED'
                ? 'border-signal-cyan/60 bg-noir-surface text-signal-cyan'
                : 'border-noir-border bg-noir-surface text-signal-text hover:border-signal-cyan/40 hover:text-signal-cyan'
            }`}
          >
            {state.unlockStatus === 'UNLOCKED' ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-signal-cyan" />
                <span>ARCHIVE OPEN</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-signal-dim" />
                <span>VAULT GATE</span>
              </>
            )}
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            className="p-1.5 rounded border border-noir-border hover:border-signal-cyan/40 text-signal-muted hover:text-signal-cyan transition-colors"
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-signal-cyan" />
            ) : (
              <VolumeX className="w-4 h-4 text-signal-dim" />
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Mission"
            className="p-1.5 rounded border border-noir-border hover:border-signal-amber/40 text-signal-dim hover:text-signal-amber transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-noir-surface border border-noir-border p-6 rounded max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-signal-amber mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold">REINITIALIZE MISSION?</h3>
            </div>
            <p className="text-signal-muted text-xs font-mono leading-relaxed mb-6">
              This will reset all recovered clues, cipher translations, and security locks across all connected browser tabs.
            </p>
            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded border border-noir-border text-signal-muted hover:bg-noir-base transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  resetMission();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded bg-signal-amber text-[#070A12] font-bold hover:bg-[#FBBF24] transition-colors"
              >
                CONFIRM RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
