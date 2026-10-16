import React, { useState } from 'react';
import { 
  Radio, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ExternalLink, 
  Layers, 
  Wifi 
} from 'lucide-react';
import { MissionRole, MissionState } from '../engine/missionTypes';
import { soundEffects } from '../utils/audioFx';

interface HeaderProps {
  role: MissionRole;
  state: MissionState;
  tabId: string;
  onReset: () => void;
  onNavigateRole?: (role: MissionRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  role,
  state,
  tabId,
  onReset,
  onNavigateRole,
}) => {
  const [isMuted, setIsMuted] = useState(soundEffects.isMuted);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const toggleMute = () => {
    soundEffects.isMuted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) {
      soundEffects.playClick();
    }
  };

  const openRoleInNewTab = (targetRole: MissionRole) => {
    soundEffects.playClick();
    const url = `${window.location.origin}${window.location.pathname}?role=${targetRole}`;
    window.open(url, '_blank');
  };

  const roleLabels: Record<MissionRole, { label: string; color: string; desc: string }> = {
    transmission: {
      label: 'TERMINAL 1 // TRANSMISSION',
      color: 'border-cyan text-cyan bg-cyan/10',
      desc: 'Cipher & Vault',
    },
    key: {
      label: 'TERMINAL 2 // CIPHER KEY',
      color: 'border-violet text-violet bg-violet/10',
      desc: 'Shift & Decryption',
    },
    anomaly: {
      label: 'TERMINAL 3 // DOM ANOMALY',
      color: 'border-amber text-amber bg-amber/10',
      desc: 'Metadata Inspection',
    },
  };

  return (
    <header className="border-b border-slate-800 bg-space-900/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Brand & Mission ID */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Radio className="w-5 h-5 text-cyan animate-pulse" />
              <div className="absolute -inset-1 bg-cyan/20 rounded-full blur-sm -z-10" />
            </div>
            <div>
              <span className="font-display font-black tracking-wider text-sm sm:text-base text-slate-100">
                THE LAST SIGNAL
              </span>
              <div className="text-[10px] text-slate-400 tracking-tight flex items-center gap-2">
                <span>SEC-SYS // CLASSIFIED</span>
                <span className="text-cyan font-bold">{state.missionId}</span>
              </div>
            </div>
          </div>

          {/* Current Role Badge */}
          <div className={`px-2.5 py-1 text-[11px] font-bold rounded border tracking-wider uppercase ${roleLabels[role].color}`}>
            {roleLabels[role].label}
          </div>
        </div>

        {/* Center: Tab Navigation / Multi-tab Launchers */}
        <div className="flex items-center gap-1.5 bg-space-950 p-1 rounded-md border border-slate-800 text-xs w-full md:w-auto justify-center">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest px-2 hidden lg:inline flex items-center gap-1">
            <Layers className="w-3 h-3" /> Tabs:
          </span>
          {(['transmission', 'key', 'anomaly'] as MissionRole[]).map((r) => {
            const isCurrent = r === role;
            return (
              <div key={r} className="flex items-center">
                <button
                  onClick={() => {
                    soundEffects.playClick();
                    if (onNavigateRole) onNavigateRole(r);
                    else {
                      const params = new URLSearchParams(window.location.search);
                      params.set('role', r);
                      window.history.pushState({}, '', `?${params.toString()}`);
                      window.location.reload();
                    }
                  }}
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
          <div className="flex items-center gap-2 text-slate-400 text-[11px]" title={`Connected Tab ID: ${tabId}`}>
            <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-space-950 border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              <Wifi className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] tracking-wider uppercase text-emerald-300">
                REV-{state.revision}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Mute */}
            <button
              onClick={toggleMute}
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
              className="p-2 rounded bg-space-950 border border-slate-800 text-slate-400 hover:text-cyan hover:border-cyan/40 transition-all"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-500" /> : <Volume2 className="w-4 h-4 text-cyan" />}
            </button>

            {/* Reset Mission */}
            <button
              onClick={() => {
                soundEffects.playClick();
                setShowResetConfirm(true);
              }}
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
          <div className="bg-space-900 border border-rose-600/40 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-display font-bold text-base text-rose-400 mb-2 flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> RESET ACTIVE MISSION
            </h3>
            <p className="text-slate-300 text-xs mb-5 leading-relaxed">
              Are you sure you want to purge all mission progress? This will reset all discovered clues, cipher stages, and vault states across all active browser tabs.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-1.5 text-xs rounded bg-space-800 border border-slate-700 text-slate-300 hover:bg-space-700 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={() => {
                  soundEffects.playError();
                  setShowResetConfirm(false);
                  onReset();
                }}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors"
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
