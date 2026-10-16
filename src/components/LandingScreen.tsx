import React from 'react';
import { 
  Radio, 
  Terminal, 
  Key, 
  Search, 
  ExternalLink, 
  ArrowRight 
} from 'lucide-react';
import { MissionRole } from '../engine/missionTypes';
import { soundEffects } from '../utils/audioFx';

interface LandingScreenProps {
  onStartMission: (role: MissionRole) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartMission }) => {
  const launchAllTabs = () => {
    soundEffects.playClick();
    // Open Key tab and Anomaly tab in separate windows, and navigate current window to Transmission
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    window.open(`${baseUrl}?role=key`, '_blank');
    window.open(`${baseUrl}?role=anomaly`, '_blank');
    onStartMission('transmission');
  };

  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center p-4 sm:p-8 text-center max-w-4xl mx-auto">
      {/* Glow Backdrop */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan/15 rounded-full blur-3xl pointer-events-none" />

      {/* Live Transmission Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-space-900 border border-cyan/40 text-cyan text-xs font-mono font-bold tracking-widest uppercase mb-6 shadow-lg shadow-cyan/10">
        <span className="w-2 h-2 rounded-full bg-cyan animate-ping inline-block" />
        <Radio className="w-3.5 h-3.5" /> LIVE CLASSIFIED TRANSMISSION DETECTED
      </div>

      {/* Main Title Wordmark */}
      <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl text-slate-100 tracking-wider mb-4 leading-none">
        THE LAST SIGNAL
      </h1>

      <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto mb-8 font-mono leading-relaxed">
        Three tabs. Three clues. One last transmission.
        An encrypted deep-space telemetry signal has fragmented across orbital frequencies. 
        Collaborate across browser windows to decode the signal and breach the digital vault.
      </p>

      {/* 3 Mission Roles Showcase */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8 text-left">
        <div className="p-4 rounded-lg bg-space-900/80 border border-cyan/30 hover:border-cyan transition-colors group">
          <div className="flex items-center gap-2 text-cyan text-xs font-bold uppercase tracking-wider mb-2">
            <Terminal className="w-4 h-4" /> TAB 1 // TRANSMISSION
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Interception of the raw encrypted message and final temporal vault access terminal.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-space-900/80 border border-violet/30 hover:border-violet transition-colors group">
          <div className="flex items-center gap-2 text-violet text-xs font-bold uppercase tracking-wider mb-2">
            <Key className="w-4 h-4" /> TAB 2 // CIPHER KEY
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Deconvolving carrier telemetry to recover the Caesar shift index and broadcast to peers.
          </p>
        </div>

        <div className="p-4 rounded-lg bg-space-900/80 border border-amber/30 hover:border-amber transition-colors group">
          <div className="flex items-center gap-2 text-amber text-xs font-bold uppercase tracking-wider mb-2">
            <Search className="w-4 h-4" /> TAB 3 // DOM ANOMALY
          </div>
          <p className="text-slate-400 text-xs leading-relaxed">
            Investigate page Document Object Model attributes using browser DevTools (F12).
          </p>
        </div>
      </div>

      {/* Primary Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
        <button
          onClick={launchAllTabs}
          className="w-full sm:w-auto px-8 py-3.5 rounded-lg font-display font-bold text-sm tracking-wider uppercase bg-cyan hover:bg-cyan/90 text-slate-950 transition-all flex items-center justify-center gap-2.5 shadow-xl shadow-cyan/25 group"
        >
          <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
          START INVESTIGATION (OPEN 3 TABS)
        </button>

        <button
          onClick={() => {
            soundEffects.playClick();
            onStartMission('transmission');
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-lg font-mono font-semibold text-xs tracking-wider uppercase bg-space-900 hover:bg-space-850 border border-slate-700 text-slate-300 transition-all flex items-center justify-center gap-2"
        >
          ENTER SINGLE TAB MODE <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="mt-8 text-[11px] font-mono text-slate-500">
        PROTOCOL: BROADCASTCHANNEL API // LOCALSTORAGE SYNC FALLBACK // SHA-256 VAULT
      </div>
    </div>
  );
};
