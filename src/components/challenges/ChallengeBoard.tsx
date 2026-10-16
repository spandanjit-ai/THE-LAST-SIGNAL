import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  Activity,
  Cpu,
  History,
  Radio,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const ChallengeBoard: React.FC<{ defaultExpanded?: boolean }> = ({ defaultExpanded = false }) => {
  const { state, triggerJudgeSolve, completeChallenge, connectNodeWire, stabilizeEntropyWithChecksum } = useMission();
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);
  const [activeTab, setActiveTab] = useState<'C1' | 'C2' | 'C3'>('C1');

  const challenges = state.challenges;
  const c1 = challenges?.items?.C1;
  const c2 = challenges?.items?.C2;
  const c3 = challenges?.items?.C3;

  const isC1Done = c1?.status === 'COMPLETED';
  const isC2Done = c2?.status === 'COMPLETED';
  const isC3Done = c3?.status === 'COMPLETED';

  const solvedCount = [isC1Done, isC2Done, isC3Done].filter(Boolean).length;

  return (
    <div className="border border-cyan-500/30 bg-black/80 rounded-xl backdrop-blur-md transition-all font-mono shadow-2xl overflow-hidden">
      {/* Sleek Tactical HUD Bar */}
      <div className="px-4 py-3 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800">
        {/* Left: Track & Phase Indicator */}
        <div className="flex items-center gap-2.5">
          <div
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              solvedCount === 3
                ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
                : 'bg-cyan-400 animate-pulse shadow-[0_0_10px_#00f0ff]'
            }`}
          />
          <span className="font-mono font-black text-xs tracking-wider text-white uppercase">
            TRACK OMEGA // 3 CHALLENGES UNVEILED
          </span>
          <span className="text-[11px] text-amber-400 font-bold border-l border-slate-700 pl-2">
            HACKATHON ACTIVE
          </span>
        </div>

        {/* Center: 3 Interactive Challenge Badges */}
        <div className="flex items-center gap-2">
          {/* C1 Badge */}
          <button
            onClick={() => {
              setActiveTab('C1');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              isC1Done
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : activeTab === 'C1' && isExpanded
                ? 'bg-cyan-950 border border-cyan-400 text-cyan-300 ring-1 ring-cyan-400'
                : 'bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400'
            }`}
          >
            {isC1Done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            )}
            <span>C1: PLOT TWIST</span>
            <span className="text-[9px] opacity-80">[{isC1Done ? 'SOLVED' : 'ACTIVE'}]</span>
          </button>

          {/* C2 Badge */}
          <button
            onClick={() => {
              setActiveTab('C2');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              isC2Done
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : activeTab === 'C2' && isExpanded
                ? 'bg-violet-950 border border-violet-400 text-violet-300 ring-1 ring-violet-400'
                : 'bg-violet-950/40 border border-violet-500/40 text-violet-300 hover:border-violet-400'
            }`}
          >
            {isC2Done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Cpu className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            )}
            <span>C2: WIRE CIPHER</span>
            <span className="text-[9px] opacity-80">[{isC2Done ? 'SOLVED' : 'ACTIVE'}]</span>
          </button>

          {/* C3 Badge */}
          <button
            onClick={() => {
              setActiveTab('C3');
              setIsExpanded(true);
            }}
            className={`px-3 py-1 rounded text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 transition-all ${
              isC3Done
                ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 shadow-sm shadow-emerald-500/20'
                : activeTab === 'C3' && isExpanded
                ? 'bg-amber-950 border border-amber-400 text-amber-300 ring-1 ring-amber-400'
                : 'bg-amber-950/40 border border-amber-500/40 text-amber-300 hover:border-amber-400'
            }`}
          >
            {isC3Done ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <History className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            )}
            <span>C3: ENTROPY & TIMELINE</span>
            <span className="text-[9px] opacity-80">[{isC3Done ? 'SOLVED' : 'ACTIVE'}]</span>
          </button>
        </div>

        {/* Right: Solved Count & Toggle */}
        <div className="flex items-center gap-2.5 text-xs text-slate-300">
          <span>
            COMPLETED:{' '}
            <strong
              className={`font-bold ${
                solvedCount === 3 ? 'text-emerald-400' : 'text-cyan-400'
              }`}
            >
              {solvedCount}/3
            </strong>
          </span>

          {solvedCount < 3 && (
            <button
              onClick={() => {
                SoundFX.playSuccessPing();
                triggerJudgeSolve();
              }}
              className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400 text-emerald-300 hover:bg-emerald-500/40 font-mono text-[10px] font-black uppercase transition-all shadow-sm"
              title="Automatically complete all 3 challenges"
            >
              ⚡ AUTO-SOLVE ALL
            </button>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 text-[11px] font-bold tracking-wider text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <span>{isExpanded ? 'MINIMIZE' : 'DETAILS'}</span>
            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Challenge Inspection Dossier */}
      {isExpanded && (
        <div className="p-4 bg-[#070914] flex flex-col gap-3 text-xs">
          {/* Tab Selector */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('C1')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'C1'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              [C1] PLOT TWIST // DOM MUTATION
            </button>
            <button
              onClick={() => setActiveTab('C2')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'C2'
                  ? 'bg-violet-500/20 text-violet-300 border border-violet-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              [C2] MAKE IT COME ALIVE // X-RAY & WIRES
            </button>
            <button
              onClick={() => setActiveTab('C3')}
              className={`px-3 py-1 rounded text-xs font-mono font-bold transition-all ${
                activeTab === 'C3'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              [C3] CHAOS CARD // 90S ENTROPY & TIMELINE
            </button>
          </div>

          {/* Active Tab Content */}
          {activeTab === 'C1' && (
            <div className="p-4 rounded-lg bg-black/60 border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-300 font-black text-sm">
                    CHALLENGE 01 // PLOT TWIST
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    TARGET: <code className="text-cyan-400">#containment-anomaly-node</code>
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {c1?.description}
                </p>
                <div className="text-[11px] font-mono text-cyan-400 pt-1">
                  Required mutation: <code className="bg-slate-900 px-1.5 py-0.5 rounded border border-cyan-500/40 text-amber-300">data-containment-protocol=&quot;OVERRIDE&quot;</code>
                </div>
                {!isC1Done && (
                  <button
                    onClick={() => {
                      SoundFX.playSuccessPing();
                      completeChallenge('C1', 'data-containment-protocol', 'OVERRIDE');
                    }}
                    className="mt-2 px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-black rounded shadow transition-all flex items-center gap-1 w-fit"
                  >
                    <Zap className="w-3.5 h-3.5" /> ⚡ BYPASS &amp; SOLVE C1
                  </button>
                )}
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <div className="text-[10px] text-slate-400">STATUS</div>
                <div className={`text-sm font-bold ${isC1Done ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {c1?.status}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'C2' && (
            <div className="p-4 rounded-lg bg-black/60 border border-violet-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-violet-300 font-black text-sm">
                    CHALLENGE 02 // MAKE IT COME ALIVE
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    MECH: X-RAY LENS + NODE-WIRE CIPHER LOCK
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {c2?.description}
                </p>
                <div className="text-[11px] font-mono text-violet-300 pt-1 flex items-center gap-2">
                  <Radio className="w-3.5 h-3.5 text-violet-400" />
                  Key Tab: X-Ray spectral fluoroscopy ➔ Transmission Tab: 5-Node wiring lock
                </div>
                {!isC2Done && (
                  <button
                    onClick={() => {
                      SoundFX.playSuccessPing();
                      for (const node of ['alpha', 'beta', 'gamma', 'delta', 'omega']) {
                        connectNodeWire(node);
                      }
                    }}
                    className="mt-2 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white font-mono text-xs font-black rounded shadow transition-all flex items-center gap-1 w-fit"
                  >
                    <Zap className="w-3.5 h-3.5" /> ⚡ BYPASS &amp; AUTO-WIRE C2
                  </button>
                )}
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <div className="text-[10px] text-slate-400">STATUS</div>
                <div className={`text-sm font-bold ${isC2Done ? 'text-emerald-400' : 'text-violet-400'}`}>
                  {c2?.status}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'C3' && (
            <div className="p-4 rounded-lg bg-black/60 border border-amber-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-amber-300 font-black text-sm">
                    CHALLENGE 03 // CHAOS CARD
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    MECH: 90S ENTROPY GLITCH + TEMPORAL SCRUBBER
                  </span>
                </div>
                <p className="text-slate-200 text-xs leading-relaxed">
                  {c3?.description}
                </p>
                <div className="text-[11px] font-mono text-amber-300 pt-1 flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-amber-400" />
                  Scrub timeline slider to T+0s to extract pre-entropy dampener checksum (0x7749-CLEAR).
                </div>
                {!isC3Done && (
                  <button
                    onClick={() => {
                      SoundFX.playSuccessPing();
                      stabilizeEntropyWithChecksum('0x7749-CLEAR');
                    }}
                    className="mt-2 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-black rounded shadow transition-all flex items-center gap-1 w-fit"
                  >
                    <Zap className="w-3.5 h-3.5" /> ⚡ BYPASS &amp; STABILIZE C3
                  </button>
                )}
              </div>
              <div className="text-right font-mono flex-shrink-0">
                <div className="text-[10px] text-slate-400">STATUS</div>
                <div className={`text-sm font-bold ${isC3Done ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {c3?.status}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
