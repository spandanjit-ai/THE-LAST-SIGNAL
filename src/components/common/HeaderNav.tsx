import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import {
  Radio,
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  KeyRound,
  Binary,
  Cpu,
  ShieldCheck,
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

  const getRoleBadge = (role: MissionRole | null) => {
    switch (role) {
      case 'transmission':
        return {
          label: 'TRANSMISSION TERMINAL',
          icon: <Radio className="w-3.5 h-3.5 text-cyan-400" />,
          color: 'border-cyan-500/40 text-cyan-300 bg-cyan-950/30',
        };
      case 'key':
        return {
          label: 'CRYPTOGRAPHIC KEY',
          icon: <KeyRound className="w-3.5 h-3.5 text-violet-400" />,
          color: 'border-violet-500/40 text-violet-300 bg-violet-950/30',
        };
      case 'anomaly':
        return {
          label: 'DOM METADATA ANOMALY',
          icon: <Binary className="w-3.5 h-3.5 text-amber-400" />,
          color: 'border-amber-500/40 text-amber-300 bg-amber-950/30',
        };
      default:
        return {
          label: 'COMMAND OVERVIEW',
          icon: <Cpu className="w-3.5 h-3.5 text-slate-400" />,
          color: 'border-slate-700 text-slate-400 bg-slate-900/40',
        };
    }
  };

  const badge = getRoleBadge(currentRole);

  const phaseColors = {
    SEARCHING: 'text-amber-400 border-amber-500/30 bg-amber-950/20',
    ALIGNING: 'text-violet-400 border-violet-500/30 bg-violet-950/20',
    STABLE: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/30 animate-pulse',
  };

  return (
    <header className="relative z-30 border-b border-cyan-500/20 bg-space-950/90 backdrop-blur-md px-4 lg:px-8 py-3 transition-colors duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Brand identity & Mission ID */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-2 group text-left focus:outline-none focus:ring-1 focus:ring-cyan-400 rounded"
          >
            <div className="w-7 h-7 rounded border border-cyan-500/40 flex items-center justify-center bg-cyan-950/40 group-hover:border-cyan-400 transition-colors">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="font-display font-bold tracking-widest text-base lg:text-lg text-white group-hover:text-cyan-300 transition-colors flex items-center gap-2">
                THE LAST SIGNAL
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  SEC-CLR 4
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                <span>MISSION: {state.missionId}</span>
                <span className="text-slate-600">//</span>
                <span className="text-cyan-400/80">REV {state.revision}</span>
              </div>
            </div>
          </button>

          {/* Current Role Indicator */}
          <div
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border ${badge.color}`}
          >
            {badge.icon}
            <span>{badge.label}</span>
          </div>
        </div>

        {/* Temporal Phase & Sync Status */}
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Signal Phase Pill */}
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded text-xs font-mono border ${phaseColors[state.currentPhase]}`}
            title="Authoritative signal alignment window"
          >
            <span className="text-[10px] text-slate-400 uppercase">SIGNAL:</span>
            <span className="font-bold tracking-wider">{state.currentPhase}</span>
            <span className="text-slate-400 font-normal">
              [{state.phaseSecondsRemaining}s]
            </span>
          </div>

          {/* Cross-tab sync status */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border border-slate-700/60 bg-slate-900/50 text-slate-300"
            title="Connected browser tabs via BroadcastChannel / localStorage"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <span className="text-cyan-300 font-bold">{connectedTabs}</span> {connectedTabs === 1 ? 'TAB' : 'TABS'} LINKED
            </span>
          </div>

          {/* Vault status button if unlocked or ready */}
          {state.unlockStatus === 'UNLOCKED' ? (
            <button
              onClick={onOpenVaultModal}
              className="flex items-center gap-1.5 px-3 py-1 rounded text-xs font-mono border border-emerald-500/50 bg-emerald-950/40 text-emerald-300 animate-pulse hover:bg-emerald-900/40 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>VAULT DECRYPTED</span>
            </button>
          ) : (
            <button
              onClick={onOpenVaultModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono border border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:border-cyan-400 hover:bg-cyan-950/50 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">VIEW VAULT</span>
            </button>
          )}

          {/* Audio toggle button */}
          <button
            onClick={toggleAudio}
            title={isAudioEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
            className="p-1.5 rounded border border-slate-700/60 bg-slate-900/50 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/40 transition-colors"
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Reset Mission button */}
          <button
            onClick={() => setShowResetConfirm(true)}
            title="Reset Mission Progress Across All Tabs"
            className="p-1.5 rounded border border-slate-700/60 bg-slate-900/50 text-slate-400 hover:text-amber-400 hover:border-amber-500/40 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Role Navigation Bar for fast multi-tab switching or inspection */}
      <div className="max-w-7xl mx-auto mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-slate-500 text-[11px] uppercase mr-1 hidden sm:inline">TERMINALS:</span>
          
          <button
            onClick={() => setRole('transmission')}
            className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1.5 ${
              currentRole === 'transmission'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Radio className="w-3 h-3" />
            <span>1. TRANSMISSION</span>
            {state.completedStages.transmission && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            )}
          </button>

          <button
            onClick={() => setRole('key')}
            className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1.5 ${
              currentRole === 'key'
                ? 'bg-violet-500/20 text-violet-300 border border-violet-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <KeyRound className="w-3 h-3" />
            <span>2. KEY</span>
            {state.completedStages.key && (
              <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
            )}
          </button>

          <button
            onClick={() => setRole('anomaly')}
            className={`px-2.5 py-0.5 rounded transition-all flex items-center gap-1.5 ${
              currentRole === 'anomaly'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-medium'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Binary className="w-3 h-3" />
            <span>3. ANOMALY</span>
            {state.completedStages.anomaly && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </button>
        </div>

        <div className="text-[11px] text-slate-500">
          STATUS: <span className="text-slate-300 font-bold">{state.unlockStatus}</span>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-space-900 border border-amber-500/50 p-6 rounded-lg max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 text-amber-400 mb-3">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-display text-lg font-bold">REINITIALIZE CLASSIFIED MISSION?</h3>
            </div>
            <p className="text-slate-300 text-xs font-mono leading-relaxed mb-6">
              This will erase all recovered clues, cipher decodings, and cryptographic locks across all linked browser tabs.
            </p>
            <div className="flex justify-end gap-3 font-mono text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2 rounded border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  resetMission();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-2 rounded bg-amber-500/20 border border-amber-500 text-amber-300 hover:bg-amber-500/30 transition-colors font-bold"
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
