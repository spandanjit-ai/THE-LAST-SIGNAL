import React from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import { SignalHero } from '../common/SignalHero';
import {
  Radio,
  Terminal,
  Key,
  Search,
  ExternalLink,
  ArrowRight,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';

interface LandingScreenProps {
  onStartMission: (role?: MissionRole) => void;
  onDemoSolve?: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onStartMission,
  onDemoSolve,
}) => {
  const {
    state,
    connectedTabs,
    isAudioEnabled,
    toggleAudio,
    startMission,
    resetMission,
  } = useMission();

  const handleLaunchAllTabs = () => {
    startMission();
    const currentOrigin = window.location.origin + window.location.pathname;
    window.open(`${currentOrigin}?role=key`, '_blank');
    window.open(`${currentOrigin}?role=anomaly`, '_blank');
    onStartMission('transmission');
  };

  const handleInitiateSingleTab = () => {
    startMission();
    onStartMission('transmission');
  };

  return (
    <div className="relative min-h-[92vh] flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto z-10 font-mono">
      {/* Glow Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="w-4 h-4 text-cyan animate-pulse" />
            <div className="absolute -inset-1 bg-cyan/20 rounded-full blur-sm -z-10" />
          </div>
          <span className="text-slate-200 font-bold tracking-wider">SEC-SYS // CLASSIFIED</span>
          <span className="text-slate-600">//</span>
          <span className="text-cyan font-bold">{state.missionId}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-space-900 border border-slate-800 text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              TERMINALS: <strong className="text-cyan font-bold">{connectedTabs}</strong>
            </span>
          </div>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded bg-space-900 border border-slate-800 text-slate-400 hover:text-cyan hover:border-cyan/40 transition-colors"
            title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            )}
          </button>

          {state.revision > 1 && (
            <button
              onClick={() => resetMission()}
              className="text-xs text-slate-500 hover:text-amber transition-colors flex items-center gap-1"
              title="Reset progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Hero & Content Center */}
      <div className="my-auto py-8 sm:py-12 text-center space-y-6">
        {/* Live Transmission Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-space-900 border border-cyan/40 text-cyan text-xs font-bold tracking-widest uppercase shadow-lg shadow-cyan/10">
          <span className="w-2 h-2 rounded-full bg-cyan animate-ping inline-block" />
          <Radio className="w-3.5 h-3.5" /> LIVE CLASSIFIED TRANSMISSION DETECTED
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-slate-100 tracking-wider leading-none select-none">
          THE LAST SIGNAL
        </h1>

        <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-mono leading-relaxed">
          Three tabs. Three clues. One last transmission. An encrypted deep-space telemetry signal has fragmented across orbital frequencies. Collaborate across browser windows to decode the signal and breach the digital vault.
        </p>

        {/* Real-time Oscilloscope Carrier Wave */}
        <div className="max-w-3xl mx-auto py-2">
          <SignalHero compact={true} />
        </div>

        {/* 3 Mission Roles Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-lg bg-space-900/90 border border-cyan/30 hover:border-cyan transition-all group shadow-sm">
            <div className="flex items-center gap-2 text-cyan text-xs font-bold uppercase tracking-wider mb-2">
              <Terminal className="w-4 h-4" /> TAB 1 // TRANSMISSION
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Interception of the raw encrypted message and final temporal vault access terminal.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-space-900/90 border border-violet/30 hover:border-violet transition-all group shadow-sm">
            <div className="flex items-center gap-2 text-violet text-xs font-bold uppercase tracking-wider mb-2">
              <Key className="w-4 h-4" /> TAB 2 // CIPHER KEY
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Deconvolving carrier telemetry to recover the Caesar shift index and broadcast to peers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-space-900/90 border border-amber/30 hover:border-amber transition-all group shadow-sm">
            <div className="flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider mb-2">
              <Search className="w-4 h-4" /> TAB 3 // DOM ANOMALY
            </div>
            <p className="text-slate-400 text-xs leading-relaxed font-sans">
              Investigate page Document Object Model attributes using browser DevTools (F12).
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={handleLaunchAllTabs}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-display font-bold text-xs tracking-wider uppercase bg-cyan hover:bg-cyan/90 text-slate-950 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan/25 group active:scale-98"
          >
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            START INVESTIGATION (OPEN 3 TABS)
          </button>

          <button
            onClick={handleInitiateSingleTab}
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-mono font-semibold text-xs tracking-wider uppercase bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-2"
          >
            ENTER SINGLE TAB MODE <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onDemoSolve && (
            <button
              onClick={onDemoSolve}
              className="w-full sm:w-auto px-5 py-3.5 rounded-lg font-display font-bold text-xs tracking-wider uppercase bg-space-900 hover:bg-space-850 border border-cyan/40 text-cyan transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan/10"
              title="Instant demo unlock with Supernova singularity burst (Shortcut: Ctrl+Shift+D)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan animate-pulse" />
              DEMO VAULT
            </button>
          )}
        </div>
      </div>

      {/* Footer Classification */}
      <footer className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500 font-mono">
        <div>PROTOCOL: BROADCASTCHANNEL API // LOCALSTORAGE SYNC FALLBACK // SHA-256 VAULT</div>
        <div className="flex items-center gap-3">
          {onDemoSolve && (
            <button
              onClick={onDemoSolve}
              className="text-slate-400 hover:text-cyan transition-colors flex items-center gap-1"
            >
              <span>⚡</span>
              <span>JUDGE DEMO (Ctrl+Shift+D)</span>
            </button>
          )}
          <span>//</span>
          <span>TRACK OMEGA</span>
        </div>
      </footer>
    </div>
  );
};
