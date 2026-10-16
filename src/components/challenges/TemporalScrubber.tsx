import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import { TimelineEvent } from '../../engine/missionTypes';
import { History, Eye, ArrowLeft, Key, ShieldCheck, Clock, Radio, ShieldAlert, Zap } from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const TemporalScrubber: React.FC = () => {
  const {
    state,
    previewEvent,
    setPreviewEvent,
    stabilizeEntropyWithChecksum,
  } = useMission();

  const { timelineEvents, entropyState } = state;
  const events = timelineEvents || [];
  const [selectedIndex, setSelectedIndex] = useState<number>(events.length - 1);
  const [inputChecksum, setInputChecksum] = useState<string>('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Sync index when events length changes if not in preview
  const currentIndex = previewEvent
    ? events.findIndex((e) => e.id === previewEvent.id)
    : selectedIndex >= 0 && selectedIndex < events.length
    ? selectedIndex
    : Math.max(0, events.length - 1);

  const activeEvent: TimelineEvent | undefined = events[currentIndex] || events[0];

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const idx = parseInt(e.target.value, 10);
    setSelectedIndex(idx);
    const targetEvent = events[idx];
    if (targetEvent) {
      setPreviewEvent(targetEvent);
      SoundFX.playTick();
    }
  };

  const selectEvent = (idx: number) => {
    setSelectedIndex(idx);
    const targetEvent = events[idx];
    if (targetEvent) {
      setPreviewEvent(targetEvent);
      SoundFX.playTick();
    }
  };

  const returnToLive = () => {
    setPreviewEvent(null);
    setSelectedIndex(events.length - 1);
    SoundFX.playSuccessPing();
  };

  const handleApplyDampener = (code: string) => {
    const res = stabilizeEntropyWithChecksum(code);
    setFeedback(res);
    if (res.success) {
      returnToLive();
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-black/60 border border-amber-500/30 p-5 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Background scanline pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#451a03_1px,transparent_1px)] [background-size:18px_18px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-amber-500/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-amber-950/80 border border-amber-500/40 text-amber-300">
            <History className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-wider text-amber-300 font-bold uppercase">
                TEMPORAL STATE SCRUBBER // HISTORICAL LOGS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-900/60 border border-amber-500/40 text-amber-300">
                CHALLENGE C3
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-300">
              Scrub backwards to T+0s to extract uncorrupted dampener checksum and neutralize entropy cascade.
            </p>
          </div>
        </div>

        {/* Live vs Preview Indicator & Quick Auto-Stabilize */}
        <div className="flex items-center gap-2">
          {!entropyState?.isStabilized && (
            <button
              onClick={() => {
                SoundFX.playSuccessPing();
                handleApplyDampener('0x7749-CLEAR');
              }}
              className="flex items-center gap-1 px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-black font-mono text-[11px] font-black rounded shadow transition-all whitespace-nowrap"
              title="Immediately neutralize entropy cascade with dampener checksum"
            >
              <Zap className="w-3.5 h-3.5" /> ⚡ AUTO-STABILIZE
            </button>
          )}
          {previewEvent ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950 border border-amber-400 text-amber-300 font-mono text-xs font-bold animate-pulse shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Eye className="w-3.5 h-3.5 text-amber-400" />
                HISTORICAL PREVIEW [READ-ONLY]
              </div>
              <button
                onClick={returnToLive}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 font-mono text-xs font-bold transition-all shadow-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                RETURN TO LIVE
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs font-bold">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              LIVE AUTHORITATIVE FEED
            </div>
          )}
        </div>
      </div>

      {/* Scrubbing Slider Control */}
      <div className="flex flex-col gap-2 relative z-10 bg-slate-900/70 border border-amber-500/30 p-4 rounded-lg">
        <div className="flex justify-between items-center font-mono text-xs text-slate-300">
          <span className="flex items-center gap-1.5 font-bold text-amber-300">
            <Clock className="w-4 h-4 text-amber-400" />
            TIMELINE SLIDER: {events.length} RECORDED STAGES
          </span>
          <span className="text-white font-bold">
            EVENT {currentIndex + 1} OF {events.length} ({activeEvent?.badge || 'T+0s'})
          </span>
        </div>

        {/* Range Slider */}
        <input
          type="range"
          min={0}
          max={Math.max(0, events.length - 1)}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-400 hover:accent-amber-300 transition-all"
        />

        {/* Step Markers */}
        <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 px-1">
          <span className="cursor-pointer hover:text-amber-300" onClick={() => selectEvent(0)}>
            ◀ T+00s (INITIAL STATE)
          </span>
          <span
            className="cursor-pointer hover:text-amber-300"
            onClick={() => selectEvent(events.length - 1)}
          >
            LIVE TRANSMISSION ▶
          </span>
        </div>
      </div>

      {/* Selected Snapshot Inspection Card */}
      {activeEvent && (
        <div className="relative z-10 bg-[#0c0d16] border-2 border-amber-500/40 p-4 rounded-lg flex flex-col gap-3 shadow-inner">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
            <div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 border border-amber-500/50 text-amber-300 mr-2">
                {activeEvent.badge}
              </span>
              <span className="font-mono text-xs font-bold text-white tracking-wide">
                {activeEvent.title}
              </span>
            </div>
            <div className="font-mono text-[11px] text-slate-300">
              LOGGED: {new Date(activeEvent.timestamp).toLocaleTimeString()}
            </div>
          </div>

          <p className="font-mono text-xs text-slate-200 leading-relaxed">
            {activeEvent.description}
          </p>

          {/* Snapshot State Properties */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-black/50 p-3 rounded border border-slate-800 font-mono text-[11px]">
            <div>
              <span className="text-slate-400 block text-[10px]">TEMPORAL PHASE</span>
              <span className="text-cyan-300 font-bold">{activeEvent.stageSnapshot.phase}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CLUES RESOLVED</span>
              <span className="text-violet-300 font-bold">
                {activeEvent.stageSnapshot.cluesFound}/3 DISCOVERED
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">C1 BREACH STATE</span>
              <span
                className={`font-bold ${
                  activeEvent.stageSnapshot.c1Solved ? 'text-emerald-400' : 'text-slate-400'
                }`}
              >
                {activeEvent.stageSnapshot.c1Solved ? 'OVERRIDDEN' : 'CONTAINED'}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px]">CARRIER FREQ</span>
              <span className="text-amber-300 font-bold">
                {activeEvent.stageSnapshot.activeFrequency}
              </span>
            </div>
          </div>

          {/* CRITICAL PUZZLE CLUE: Uncorrupted Dampener Checksum (Found at T=0) */}
          <div className="bg-amber-950/40 border border-amber-500/50 p-3 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-amber-300">
                <Key className="w-3.5 h-3.5 text-amber-400" />
                SNAPSHOT CHECKSUM HASH:
              </div>
              <div className="font-mono text-sm font-extrabold text-white tracking-wider mt-0.5">
                {activeEvent.checksum}
              </div>
              {activeEvent.id === 'evt-init' && (
                <div className="font-mono text-[11px] text-amber-200 mt-1">
                  ★ ORIGINAL PRE-ENTROPY DAMPENER SIGNATURE. Use this code to stabilize the 90s timer!
                </div>
              )}
            </div>

            {/* Quick-Apply Button if Entropy not yet stabilized */}
            {!entropyState?.isStabilized && (
              <button
                onClick={() => handleApplyDampener(activeEvent.checksum)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold rounded shadow-lg transition-all flex-shrink-0"
              >
                APPLY AS DAMPENER
              </button>
            )}
          </div>
        </div>
      )}

      {/* Manual Checksum Input Console */}
      {!entropyState?.isStabilized && (
        <div className="relative z-10 flex flex-col sm:flex-row items-center gap-2 bg-black/80 border border-slate-700/80 p-3 rounded-lg">
          <span className="font-mono text-xs text-slate-300 font-bold whitespace-nowrap flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-amber-400" />
            STABILIZATION CONSOLE:
          </span>
          <input
            type="text"
            value={inputChecksum}
            onChange={(e) => setInputChecksum(e.target.value)}
            placeholder="Enter dampener code (e.g. 0x7749-CLEAR)..."
            className="flex-1 w-full bg-slate-900 border border-slate-700 text-white font-mono text-xs px-3 py-1.5 rounded focus:outline-none focus:border-amber-400"
          />
          <button
            onClick={() => handleApplyDampener(inputChecksum)}
            disabled={!inputChecksum.trim()}
            className="w-full sm:w-auto px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold rounded transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow"
          >
            TRANSMIT
          </button>
        </div>
      )}

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-2.5 rounded font-mono text-xs flex items-center gap-2 ${
            feedback.success
              ? 'bg-emerald-950/90 border border-emerald-500 text-emerald-200'
              : 'bg-red-950/90 border border-red-500 text-red-200'
          }`}
        >
          {feedback.success ? (
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          ) : (
            <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}
    </div>
  );
};
