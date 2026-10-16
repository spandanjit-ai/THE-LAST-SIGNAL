import React from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import { SignalHero } from '../common/SignalHero';
import {
  ArrowRight,
  ExternalLink,
  Volume2,
  VolumeX,
  RotateCcw,
  Radio,
  KeyRound,
  Binary,
} from 'lucide-react';

interface LandingScreenProps {
  onStartMission: (role?: MissionRole) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStartMission }) => {
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

  const handleLaunchSingle = (role: MissionRole = 'transmission') => {
    startMission();
    onStartMission(role);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-6xl mx-auto z-10">
      {/* Top Telemetry Header */}
      <header className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-400 border-b border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-white font-bold tracking-widest uppercase">
            SEC-SYS // FREQUENCY 1420.405 MHz
          </span>
          <span className="text-slate-600">//</span>
          <span className="text-cyan-400/80">INTERCEPT ACTIVE</span>
        </div>

        <div className="flex items-center gap-5">
          <div className="text-slate-400 text-xs">
            LINKED TERMINALS: <span className="text-cyan-300 font-bold">{connectedTabs}</span>
          </div>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded border border-slate-800 hover:border-slate-600 text-slate-400 hover:text-cyan-300 transition-colors"
            title={isAudioEnabled ? 'Mute Interface Sound' : 'Enable Interface Sound'}
          >
            {isAudioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4 text-slate-600" />}
          </button>

          {state.revision > 1 && (
            <button
              onClick={() => resetMission()}
              className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1.5 transition-colors"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </header>

      {/* Hero Visual Composition */}
      <div className="my-auto py-10 space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            // CLASSIFIED BROWSER TRANSMISSION SYSTEM
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-wider text-white leading-none">
            THE LAST <span className="text-cyan-400">SIGNAL</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A fractured, classified transmission has been intercepted across three browser tabs.
            Investigate the carrier frequency, recover the cipher shift, inspect hidden DOM metadata,
            and satisfy the temporal alignment window to unlock the digital vault.
          </p>
        </div>

        {/* Real-time Hero Signal Visualizer */}
        <div className="max-w-4xl">
          <SignalHero />
        </div>

        {/* 3-Node Architecture Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl text-xs font-mono">
          <div className="p-4 rounded border border-slate-800 bg-space-950/60">
            <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
              <Radio className="w-4 h-4" />
              <span>TERMINAL 1: TRANSMISSION</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Decipher intercepted carrier ciphertext (`VJG NCUV UKIPCN`) using an interactive Caesar console.
            </p>
          </div>

          <div className="p-4 rounded border border-slate-800 bg-space-950/60">
            <div className="flex items-center gap-2 text-violet-300 font-bold mb-1">
              <KeyRound className="w-4 h-4" />
              <span>TERMINAL 2: KEY</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Tune into 1420.4 MHz to recover the cipher offset (`ROT-3`) and temporal directives.
            </p>
          </div>

          <div className="p-4 rounded border border-slate-800 bg-space-950/60">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1">
              <Binary className="w-4 h-4" />
              <span>TERMINAL 3: ANOMALY</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Inspect browser DevTools DOM attributes (`data-signal-anomaly`) to verify shadow metadata.
            </p>
          </div>
        </div>

        {/* Primary Call to Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
          <button
            onClick={() => handleLaunchSingle('transmission')}
            className="px-8 py-4 rounded bg-cyan-500 hover:bg-cyan-400 text-space-950 font-display font-bold text-base tracking-widest uppercase transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-3 active:scale-98"
          >
            <span>START INVESTIGATION</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleLaunchAllTabs}
            className="px-6 py-4 rounded border border-slate-700 bg-space-900/60 hover:bg-space-800 text-slate-200 font-display font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>OPEN ALL 3 TABS IN SEPARATE WINDOWS</span>
          </button>
        </div>
      </div>

      {/* Footer System Status */}
      <footer className="border-t border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
        <div>TRACK B: MYSTERY BOX // PROTOCOL OMEGA</div>
        <div className="flex items-center gap-4">
          <span>BROADCASTCHANNEL SYNC</span>
          <span className="text-slate-700">//</span>
          <span>SHA-256 ENCRYPTION</span>
          <span className="text-slate-700">//</span>
          <span className="text-slate-400">ZERO SERVER DEPENDENCIES</span>
        </div>
      </footer>
    </div>
  );
};
