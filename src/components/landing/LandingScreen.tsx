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
      {/* Radiant Glow Backdrop */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Utility Header */}
      <header className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/80 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <Radio className="w-4 h-4 text-cyan animate-pulse" />
            <div className="absolute -inset-1 bg-cyan/30 rounded-full blur-sm -z-10" />
          </div>
          <span className="text-cyan-400 font-extrabold tracking-widest uppercase">
            SEC-SYS // CLASSIFIED
          </span>
          <span className="text-slate-600">//</span>
          <span className="text-cyan-300 font-bold text-glow-cyan">{state.missionId}</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-space-900 border border-slate-800 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-slate-300">
              TERMINALS: <strong className="text-cyan font-bold text-glow-cyan">{connectedTabs}</strong>
            </span>
          </div>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded bg-space-900 border border-slate-800 text-slate-300 hover:text-cyan hover:border-cyan/40 transition-colors"
            title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-cyan" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-slate-400" />
            )}
          </button>

          {state.revision > 1 && (
            <button
              onClick={() => resetMission()}
              className="text-xs text-slate-300 hover:text-amber transition-colors flex items-center gap-1 font-bold"
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
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-space-900/95 border border-cyan/50 text-cyan text-xs font-bold tracking-widest uppercase shadow-lg shadow-cyan/20">
          <span className="w-2 h-2 rounded-full bg-cyan animate-ping inline-block" />
          <Radio className="w-3.5 h-3.5" /> LIVE CLASSIFIED TRANSMISSION DETECTED
        </div>

        {/* Title */}
        <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl tracking-wider leading-none select-none bg-gradient-to-r from-cyan-300 via-white to-violet-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(0,240,255,0.4)]">
          THE LAST SIGNAL
        </h1>

        {/* High-contrast, rich narrative typography */}
        <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto font-mono leading-relaxed">
          <span className="text-cyan-300 font-bold">Three tabs.</span>{' '}
          <span className="text-violet-300 font-bold">Three clues.</span>{' '}
          <span className="text-amber-300 font-bold">One last transmission.</span>
          <br />
          <span className="text-slate-300">
            An encrypted deep-space telemetry signal has fragmented across orbital frequencies. 
            Collaborate across browser windows to decode the signal and breach the{' '}
            <span className="text-emerald-400 font-bold text-glow-emerald">digital vault</span>.
          </span>
        </p>

        {/* Real-time Oscilloscope Carrier Wave */}
        <div className="max-w-3xl mx-auto py-2">
          <SignalHero compact={true} />
        </div>

        {/* 3 Mission Roles Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl mx-auto text-left">
          <div className="p-4 rounded-lg bg-space-900/90 border border-cyan/40 hover:border-cyan transition-all group shadow-sm shadow-cyan/5">
            <div className="flex items-center gap-2 text-cyan text-xs font-bold uppercase tracking-wider mb-2 text-glow-cyan">
              <Terminal className="w-4 h-4 text-cyan" /> TAB 1 // TRANSMISSION
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Interception of the raw encrypted message buffer and final temporal vault access terminal.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-space-900/90 border border-violet/40 hover:border-violet transition-all group shadow-sm shadow-violet/5">
            <div className="flex items-center gap-2 text-violet text-xs font-bold uppercase tracking-wider mb-2 text-glow-violet">
              <Key className="w-4 h-4 text-violet" /> TAB 2 // CIPHER KEY
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Deconvolving carrier telemetry to isolate the Caesar rotation offset and broadcast to peers.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-space-900/90 border border-amber/40 hover:border-amber transition-all group shadow-sm shadow-amber/5">
            <div className="flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider mb-2 text-glow-amber">
              <Search className="w-4 h-4 text-amber" /> TAB 3 // DOM ANOMALY
            </div>
            <p className="text-slate-300 text-xs leading-relaxed font-sans">
              Investigate page Document Object Model attributes using browser DevTools (F12) to extract anomaly metadata.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={handleLaunchAllTabs}
            className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-display font-black text-xs tracking-wider uppercase bg-cyan hover:bg-cyan/90 text-slate-950 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan/30 group active:scale-98"
          >
            <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
            START INVESTIGATION (OPEN 3 TABS)
          </button>

          <button
            onClick={handleInitiateSingleTab}
            className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-mono font-bold text-xs tracking-wider uppercase bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-100 hover:text-cyan hover:border-cyan/40 transition-all flex items-center justify-center gap-2"
          >
            ENTER SINGLE TAB MODE <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {onDemoSolve && (
            <button
              onClick={onDemoSolve}
              className="w-full sm:w-auto px-5 py-3.5 rounded-lg font-display font-bold text-xs tracking-wider uppercase bg-space-900 hover:bg-space-850 border border-cyan/50 text-cyan transition-all flex items-center justify-center gap-2 shadow-lg shadow-cyan/15 text-glow-cyan"
              title="Instant demo unlock with Supernova singularity burst (Shortcut: Ctrl+Shift+D)"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan animate-pulse" />
              DEMO VAULT
            </button>
          )}
        </div>
      </div>

      {/* Footer Classification */}
      <footer className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
        <div>PROTOCOL: BROADCASTCHANNEL API // LOCALSTORAGE SYNC FALLBACK // SHA-256 VAULT</div>
        <div className="flex items-center gap-3">
          {onDemoSolve && (
            <button
              onClick={onDemoSolve}
              className="text-cyan-300 hover:text-cyan font-bold transition-colors flex items-center gap-1.5"
            >
              <span>⚡</span>
              <span>JUDGE DEMO (Ctrl+Shift+D)</span>
            </button>
          )}
          <span className="text-slate-600">//</span>
          <span className="text-amber-400 font-bold">TRACK OMEGA</span>
        </div>
      </footer>
    </div>
  );
};
