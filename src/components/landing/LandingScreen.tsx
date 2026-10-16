import React from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import {
  Radio,
  KeyRound,
  Binary,
  Layers,
  ArrowRight,
  ExternalLink,
  Cpu,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
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

    // Open Transmission in current tab or new tab
    window.open(`${currentOrigin}?role=key`, '_blank');
    window.open(`${currentOrigin}?role=anomaly`, '_blank');
    // Navigate current tab to transmission
    onStartMission('transmission');
  };

  const handleLaunchSingle = (role: MissionRole) => {
    startMission();
    onStartMission(role);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-4 sm:p-6 lg:p-12 max-w-6xl mx-auto z-10">
      {/* Top status bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-xs text-slate-400 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-cyan-300 font-bold uppercase tracking-wider">
            LIVE TRANSMISSION CAPTURED
          </span>
          <span className="text-slate-600">//</span>
          <span className="text-slate-400">CARRIER: 1420.405 MHz</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-slate-400">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong className="text-cyan-300">{connectedTabs}</strong> {connectedTabs === 1 ? 'TAB' : 'TABS'} LINKED
            </span>
          </div>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded border border-slate-700/80 bg-slate-900/60 hover:border-cyan-500/50 text-slate-300 transition-colors"
            title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {state.revision > 1 && (
            <button
              onClick={() => resetMission()}
              className="text-xs text-slate-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
              title="Reset progress"
            >
              <RotateCcw className="w-3 h-3" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </div>

      {/* Main hero section */}
      <div className="my-auto py-10 lg:py-16 space-y-8">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-950/40 border border-cyan-500/30 text-cyan-400 text-xs font-mono uppercase tracking-widest">
            <Cpu className="w-3.5 h-3.5" />
            CLASSIFIED BROWSER MYSTERY // PROTOCOL OMEGA
          </div>

          <h1 className="font-display font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-wider text-white leading-none">
            THE LAST <span className="text-cyan-400 glow-cyan">SIGNAL</span>
          </h1>

          <p className="font-mono text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            A fractured, classified transmission has been intercepted from deep space.
            The payload is encrypted, decentralized, and synchronized across three distinct browser terminals.
            Cross-reference the clues, inspect hidden DOM metadata, and align with temporal resonance to unlock the archive.
          </p>
        </div>

        {/* Multi-Tab Architecture Diagram & Cards */}
        <div className="space-y-3">
          <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-cyan-400" />
            <span>THREE TABS. THREE CLUES. ONE SYNCHRONIZED TRANSMISSION:</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Tab 1: Transmission */}
            <div className="p-4 rounded-lg bg-space-900/70 border border-cyan-500/30 backdrop-blur-sm relative group hover:border-cyan-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400">
                  <Radio className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-cyan-400/80 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/20">
                  ROLE: TRANSMISSION
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-white mb-1">
                1. Encrypted Signal
              </h2>
              <p className="font-mono text-xs text-slate-400 leading-relaxed mb-4">
                Intercepts the encrypted carrier ciphertext (`VJG NCUV UKIPCN`) with an interactive Caesar shift decoder and oscilloscope.
              </p>
              <button
                onClick={() => handleLaunchSingle('transmission')}
                className="w-full py-2 rounded bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-500/40 text-cyan-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>OPEN TRANSMISSION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab 2: Key */}
            <div className="p-4 rounded-lg bg-space-900/70 border border-violet-500/30 backdrop-blur-sm relative group hover:border-violet-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-violet-950 border border-violet-500/40 text-violet-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-violet-400/80 px-2 py-0.5 rounded bg-violet-950/60 border border-violet-500/20">
                  ROLE: KEY
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-white mb-1">
                2. Cryptographic Key
              </h2>
              <p className="font-mono text-xs text-slate-400 leading-relaxed mb-4">
                Tune the harmonic resonance slider to recover the cipher offset (`ROT-3`) and temporal directive fragment.
              </p>
              <button
                onClick={() => handleLaunchSingle('key')}
                className="w-full py-2 rounded bg-violet-950/60 hover:bg-violet-900/60 border border-violet-500/40 text-violet-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>OPEN KEY TERMINAL</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tab 3: Anomaly */}
            <div className="p-4 rounded-lg bg-space-900/70 border border-amber-500/30 backdrop-blur-sm relative group hover:border-amber-400 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded bg-amber-950 border border-amber-500/40 text-amber-400">
                  <Binary className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono text-amber-400/80 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-500/20">
                  ROLE: ANOMALY
                </span>
              </div>
              <h2 className="font-display font-bold text-lg text-white mb-1">
                3. DOM Metadata
              </h2>
              <p className="font-mono text-xs text-slate-400 leading-relaxed mb-4">
                Inspect browser DevTools DOM attributes (`data-signal-anomaly`) to extract and authenticate the shadow telemetry token.
              </p>
              <button
                onClick={() => handleLaunchSingle('anomaly')}
                className="w-full py-2 rounded bg-amber-950/60 hover:bg-amber-900/60 border border-amber-500/40 text-amber-300 font-mono text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>OPEN ANOMALY</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Primary CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
          <button
            onClick={handleLaunchAllTabs}
            className="px-8 py-4 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-space-950 font-display font-bold text-base tracking-wider uppercase shadow-xl shadow-cyan-500/30 flex items-center justify-center gap-3 transition-all transform active:scale-98"
          >
            <ExternalLink className="w-5 h-5" />
            <span>LAUNCH ALL 3 MISSION TABS (RECOMMENDED)</span>
          </button>

          <button
            onClick={() => handleLaunchSingle('transmission')}
            className="px-6 py-4 rounded-lg bg-space-900/80 hover:bg-space-800 border border-slate-700 text-slate-200 font-display font-bold text-base tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4 text-cyan-400" />
            <span>ENTER SINGLE-WINDOW MISSION</span>
          </button>
        </div>
      </div>

      {/* Footer / System Meta */}
      <div className="border-t border-slate-800/80 pt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-slate-500">
        <div>
          THE LAST SIGNAL // TRACK B: MYSTERY BOX // BROADCASTCHANNEL SYNCHRONIZED
        </div>
        <div className="flex items-center gap-4">
          <span>SHA-256 VERIFICATION ACTIVE</span>
          <span className="text-slate-600">//</span>
          <span className="text-cyan-400">ALL TRANSMISSIONS LOCAL CLIENT-SIDE</span>
        </div>
      </div>
    </div>
  );
};
