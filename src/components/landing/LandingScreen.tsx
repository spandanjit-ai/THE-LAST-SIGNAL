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
  Sparkles,
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

  const handleInitiateRecovery = () => {
    startMission();
    onStartMission('transmission');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-16 max-w-5xl mx-auto z-10">
      {/* Top Classified Header & Custom Insignia */}
      <header className="flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-signal-muted border-b border-noir-border pb-5">
        <div className="flex items-center gap-3">
          {/* Custom Mission Insignia SVG */}
          <div className="w-8 h-8 rounded border border-signal-cyan/40 bg-noir-surface flex items-center justify-center text-signal-cyan">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M12 2v3m0 14v3M2 12h3m14 0h3" />
              <circle cx="12" cy="12" r="8" strokeDasharray="3 3" />
            </svg>
          </div>
          <div>
            <div className="text-signal-text font-bold tracking-widest uppercase text-xs">
              SEC-SYS // CLASSIFIED TRANSMISSION RELAY
            </div>
            <div className="text-[10px] text-signal-dim">
              CASE: {state.missionId} // CLEARANCE: LEVEL 5
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-signal-amber/10 border border-signal-amber/30 text-signal-amber text-[10px] tracking-widest font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-signal-amber animate-pulse" />
            TRACK OMEGA // PHASE 01
          </div>

          <div className="text-signal-muted">
            TERMINALS: <span className="text-signal-cyan font-bold">{connectedTabs}</span>
          </div>

          <button
            onClick={toggleAudio}
            className="p-1.5 rounded border border-noir-border hover:border-signal-cyan/40 text-signal-muted hover:text-signal-cyan transition-colors"
            title={isAudioEnabled ? 'Mute' : 'Enable Audio'}
          >
            {isAudioEnabled ? (
              <Volume2 className="w-4 h-4 text-signal-cyan" />
            ) : (
              <VolumeX className="w-4 h-4 text-signal-dim" />
            )}
          </button>

          {state.revision > 1 && (
            <button
              onClick={() => resetMission()}
              className="text-xs text-signal-dim hover:text-signal-amber flex items-center gap-1.5 transition-colors"
              title="Reset progress"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>RESET</span>
            </button>
          )}
        </div>
      </header>

      {/* Main Narrative & Hero Signal Composition */}
      <div className="my-auto py-12 lg:py-16 space-y-8">
        <div className="space-y-4 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-mono tracking-widest text-signal-cyan uppercase">
            <span className="w-2 h-2 rounded-full bg-signal-cyan animate-pulse shadow-[0_0_8px_#22d3ee]" />
            <span>// INTERCEPT CAPTURED</span>
            <span className="text-noir-border">//</span>
            <span className="text-signal-amber font-semibold">CARRIER: 1420.405 MHz</span>
          </div>

          <h1 className="font-display font-extrabold text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none bg-gradient-to-r from-signal-cyan via-white to-signal-violet bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(34,211,238,0.22)] select-none">
            THE LAST SIGNAL
          </h1>

          <p className="font-display text-xl sm:text-2xl text-slate-200 font-normal leading-relaxed">
            A transmission was received. <span className="text-signal-cyan font-semibold drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]">Its origin is unknown.</span>
          </p>

          <p className="font-mono text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
            Its contents are incomplete, <span className="text-signal-violet font-semibold">encrypted</span>, and decentralized across <span className="text-signal-cyan font-semibold">three browser tabs</span>.
            Investigate the carrier frequency, recover the <span className="text-signal-violet font-semibold">cipher shift</span>, inspect hidden <span className="text-signal-amber font-semibold">DOM metadata</span>,
            and satisfy the temporal alignment window to unlock the digital vault.
          </p>
        </div>

        {/* Primary Visual: Beautiful Animated Oscilloscope Waveform */}
        <div className="max-w-4xl">
          <SignalHero />
        </div>

        {/* Case Metadata & Primary Prominent Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-6 pt-4 border-t border-noir-border">
          <div className="font-mono text-xs text-signal-dim space-y-1">
            <div>CARRIER FREQUENCY : <span className="text-signal-cyan font-bold tracking-wider">1420.405 MHz</span></div>
            <div>TRANSMISSION ROLE : <span className="text-signal-violet font-bold tracking-wider">3 TABS SYNCHRONIZED</span></div>
          </div>


          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleInitiateRecovery}
              className="px-8 py-4 rounded bg-signal-cyan hover:bg-[#38BDF8] text-[#070A12] font-display font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 active:scale-98 shadow-sm"
            >
              <span>INITIATE RECOVERY</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleLaunchAllTabs}
              className="px-5 py-4 rounded border border-noir-border bg-noir-surface hover:bg-noir-elevated text-signal-text font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors"
              title="Opens Transmission, Key, and Anomaly in 3 separate windows"
            >
              <ExternalLink className="w-3.5 h-3.5 text-signal-cyan" />
              <span>LAUNCH 3 WINDOWS</span>
            </button>

            {onDemoSolve && (
              <button
                onClick={onDemoSolve}
                className="px-4 py-4 rounded border border-signal-cyan/40 bg-signal-cyan/10 hover:bg-signal-cyan/20 text-signal-cyan font-display font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] active:scale-95"
                title="Instant demo unlock with Supernova burst (Shortcut: Ctrl+Shift+D)"
              >
                <Sparkles className="w-3.5 h-3.5 text-signal-cyan animate-pulse" />
                <span>DEMO VAULT</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer System Classification */}
      <footer className="border-t border-noir-border pt-4 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] text-signal-dim">
        <div>TRACK OMEGA // MYSTERY BOX // CINEMATIC SIGNAL NOIR</div>
        <div className="flex items-center gap-4">
          {onDemoSolve && (
            <button
              onClick={onDemoSolve}
              className="text-signal-dim hover:text-signal-cyan transition-colors flex items-center gap-1 font-mono"
            >
              <span>⚡</span>
              <span>JUDGE DEMO (Ctrl+Shift+D)</span>
            </button>
          )}
          <span className="text-noir-border">//</span>
          <span>BROADCASTCHANNEL SYNC</span>
          <span className="text-noir-border">//</span>
          <span>SHA-256 ENCRYPTION</span>
        </div>
      </footer>
    </div>
  );
};

