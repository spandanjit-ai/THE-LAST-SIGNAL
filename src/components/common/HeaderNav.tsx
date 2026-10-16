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

  const roles: Array<{ id: MissionRole; label: string; number: string; completed: boolean }> = [
    {
      id: 'transmission',
      label: 'TRANSMISSION',
      number: '01',
      completed: state.completedStages.transmission || state.cipherDecoded,
    },
    {
      id: 'key',
      label: 'KEY RECOVERY',
      number: '02',
      completed: state.completedStages.key || state.keyDiscovered,
    },
    {
      id: 'anomaly',
      label: 'DOM ANOMALY',
      number: '03',
      completed: state.completedStages.anomaly || state.anomalyConfirmed,
    },
  ];

  return (
    <header className="relative z-30 border-b border-slate-800 bg-space-950/95 backdrop-blur-md px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand identity & Mission ID */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
            title="Return to Mission Overview"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <div>
              <div className="font-display font-bold tracking-widest text-base text-white group-hover:text-cyan-300 transition-colors">
                THE LAST SIGNAL
              </div>
              <div className="text-[10px] font-mono text-slate-500">
                SESSION: {state.missionId} // REV {state.revision}
              </div>
            </div>
          </button>
        </div>

        {/* Tab Role Switcher Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 font-mono text-xs">
          {roles.map((r) => {
            const isActive = currentRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`px-3 py-1.5 rounded transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'border-cyan-500/50 bg-cyan-950/40 text-cyan-300 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-space-900'
                }`}
              >
                <span className="text-[10px] text-slate-500">{r.number}</span>
                <span>{r.label}</span>
                {r.completed && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right utility cluster */}
        <div className="flex items-center gap-3 font-mono text-xs">
          {/* Real connected tabs counter */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded border border-slate-800 bg-space-900 text-slate-300 text-[11px]"
            title="Connected browser tabs via BroadcastChannel"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong className="text-cyan-300">{connectedTabs}</strong> {connectedTabs === 1 ? 'TAB' : 'TABS'}
            </span>
          </div>

          {/* Vault trigger button */}
          <button
            onClick={onOpenVaultModal}
            className={`px-3 py-1 rounded border flex items-center gap-1.5 font-display font-bold text-xs tracking-wider uppercase transition-all ${
              state.unlockStatus === 'UNLOCKED'
                ? 'border-emerald-500/50 bg-emerald-950/40 text-emerald-300'
                : 'border-slate-700 bg-space-900 text-slate-200 hover:border-cyan-500/40 hover:text-cyan-300'
            }`}
          >
            {state.unlockStatus === 'UNLOCKED' ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>ARCHIVE OPEN</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>VAULT GATE</span>
              </>
            )}
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
            className="p-1.5 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-cyan-300 transition-colors"
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Reset button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Mission"
            className="p-1.5 rounded border border-slate-800 hover:border-amber-500/40 text-slate-500 hover:text-amber-400 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-slate-700 p-6 rounded-lg max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-display text-lg font-bold">REINITIALIZE MISSION?</h3>
            </div>
            <p className="text-slate-300 text-xs font-mono leading-relaxed mb-6">
              This will reset all recovered clues, cipher translations, and security locks across all connected browser tabs.
            </p>
            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded border border-slate-700 text-slate-300 hover:bg-space-950 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  resetMission();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded bg-amber-500 text-space-950 font-bold hover:bg-amber-400 transition-colors"
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
