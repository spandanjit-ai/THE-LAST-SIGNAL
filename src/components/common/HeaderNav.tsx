import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import {
  Radio,
  Wifi,
  Volume2,
  VolumeX,
  RotateCcw,
  Layers,
  Lock,
  Unlock,
  ExternalLink,
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

  const openRoleInNewTab = (targetRole: MissionRole) => {
    const url = `${window.location.origin}${window.location.pathname}?role=${targetRole}`;
    window.open(url, '_blank');
  };

  const roleLabels: Record<MissionRole, { label: string; color: string }> = {
    transmission: {
      label: 'TERMINAL 1 // TRANSMISSION',
      color: 'border-cyan text-cyan bg-cyan/10',
    },
    key: {
      label: 'TERMINAL 2 // CIPHER KEY',
      color: 'border-violet text-violet bg-violet/10',
    },
    anomaly: {
      label: 'TERMINAL 3 // DOM ANOMALY',
      color: 'border-amber text-amber bg-amber/10',
    },
  };

  const activeRoleBadge = currentRole
    ? roleLabels[currentRole]
    : { label: 'MISSION OVERVIEW', color: 'border-cyan/40 text-cyan bg-cyan/10' };

  return (
    <header className="border-b border-slate-800 bg-space-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3 font-mono">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Mission ID & Active Role Badge */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <button
            onClick={() => setRole(null)}
            className="flex items-center gap-2 text-left group focus:outline-none"
            title="Return to Overview"
          >
            <div className="relative">
              <Radio className="w-5 h-5 text-cyan animate-pulse" />
              <div className="absolute -inset-1 bg-cyan/20 rounded-full blur-sm -z-10" />
            </div>
            <div>
              <span className="font-display font-black tracking-wider text-sm sm:text-base text-slate-100 group-hover:text-cyan transition-colors">
                THE LAST SIGNAL
              </span>
              <div className="text-[10px] text-slate-400 tracking-tight flex items-center gap-2 font-mono">
                <span>SEC-SYS // CLASSIFIED</span>
                <span className="text-cyan font-bold">{state.missionId}</span>
              </div>
            </div>
          </button>

          {/* Current Role Badge */}
          <div className={`px-2.5 py-1 text-[11px] font-bold rounded border tracking-wider uppercase ${activeRoleBadge.color}`}>
            {activeRoleBadge.label}
          </div>
        </div>

        {/* Center: Tab Navigation / Multi-tab Launchers */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-md border border-slate-800 text-xs w-full md:w-auto justify-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest px-2 hidden lg:inline flex items-center gap-1">
            <Layers className="w-3 h-3" /> Tabs:
          </span>
          {(['transmission', 'key', 'anomaly'] as MissionRole[]).map((r) => {
            const isCurrent = r === currentRole;
            return (
              <div key={r} className="flex items-center">
                <button
                  onClick={() => setRole(r)}
                  className={`px-2.5 py-1 rounded text-[11px] uppercase tracking-wider font-semibold transition-all ${
                    isCurrent
                      ? 'bg-slate-800 text-cyan border border-cyan/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-space-900'
                  }`}
                >
                  {r}
                </button>
                <button
                  title={`Open ${r} in separate tab`}
                  onClick={() => openRoleInNewTab(r)}
                  className="p-1 text-slate-500 hover:text-cyan transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Right: Sync Status & Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end text-xs">
          {/* Connected Tabs & Sync Pill */}
          <div className="flex items-center gap-2 text-slate-400 text-[11px]">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-950 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] tracking-wider uppercase text-emerald-300 font-bold">
                REV-{state.revision} ({connectedTabs} {connectedTabs === 1 ? 'TAB' : 'TABS'})
              </span>
            </div>
          </div>

          {/* Vault Modal Trigger Button */}
          <button
            onClick={onOpenVaultModal}
            className={`px-3 py-1.5 rounded border flex items-center gap-1.5 font-display font-bold text-xs tracking-wider uppercase transition-all ${
              state.unlockStatus === 'UNLOCKED'
                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                : 'border-slate-800 bg-space-950 text-slate-300 hover:border-cyan/40 hover:text-cyan'
            }`}
          >
            {state.unlockStatus === 'UNLOCKED' ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>VAULT OPEN</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-500" />
                <span>VAULT GATE</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            {/* Audio Mute */}
            <button
              onClick={toggleAudio}
              title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
              className="p-2 rounded bg-space-950 border border-slate-800 text-slate-400 hover:text-cyan hover:border-cyan/40 transition-all"
            >
              {isAudioEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-cyan" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              )}
            </button>

            {/* Reset Mission */}
            <button
              onClick={() => setShowResetConfirm(true)}
              title="Reset Mission Run"
              className="px-2.5 py-1.5 rounded bg-space-950 border border-rose-900/40 text-rose-400 hover:bg-rose-950/40 hover:border-rose-700 transition-all flex items-center gap-1.5 text-[11px] font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">RESET</span>
            </button>
          </div>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-space-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-space-900 border border-rose-600/40 rounded-lg p-6 max-w-md w-full shadow-2xl font-mono">
            <h3 className="font-display font-bold text-base text-rose-400 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> RESET ACTIVE MISSION
            </h3>
            <p className="text-slate-300 text-xs mb-5 leading-relaxed font-sans">
              Are you sure you want to purge all mission progress? This will reset all discovered clues, cipher stages, and vault states across all active browser tabs.
            </p>
            <div className="flex justify-end gap-3 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 rounded bg-space-800 border border-slate-700 text-slate-300 hover:bg-space-700 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  resetMission();
                }}
                className="px-4 py-1.5 font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors"
              >
                PURGE & RESET
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
