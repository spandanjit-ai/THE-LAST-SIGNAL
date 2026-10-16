import React from 'react';
import { useMission } from '../../hooks/useMission';
import { CIPHER_LOCK_NODES, LockNodeDefinition } from '../../engine/cipherLockLogic';
import { Cpu, Zap, RotateCcw, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const NodeWireCipherLock: React.FC = () => {
  const { state, connectNodeWire, resetNodeWires } = useMission();
  const { nodeWireState, challenges } = state;

  const connectedIds = nodeWireState?.connectedNodes || [];
  const isSolved = nodeWireState?.isSolved || challenges?.items?.C2?.status === 'COMPLETED';
  const hasError = !!nodeWireState?.error;

  const handleNodeClick = (node: LockNodeDefinition) => {
    if (isSolved) return;
    const result = connectNodeWire(node.id);
    if (!result.success) {
      SoundFX.playWarning();
    }
  };

  const getNodeByNodeId = (id: string): LockNodeDefinition | undefined => {
    return CIPHER_LOCK_NODES.find((n) => n.id === id);
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-black/60 border border-violet-500/30 p-5 rounded-xl shadow-2xl relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:20px_20px] opacity-40 pointer-events-none" />

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10 border-b border-violet-500/30 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded bg-violet-950/80 border border-violet-500/40 text-violet-300">
            <Cpu className="w-5 h-5 text-violet-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs tracking-wider text-violet-300 font-bold uppercase">
                NODE-WIRE CIPHER LOCK // HARMONIC BUS
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-violet-900/60 border border-violet-500/40 text-violet-300">
                CHALLENGE C2
              </span>
            </div>
            <p className="font-mono text-[11px] text-slate-300">
              Wire the 5 harmonic nodes in resonant order. Cross-reference X-Ray lens on Key Node.
            </p>
          </div>
        </div>

        {/* Status / Reset */}
        <div className="flex items-center gap-3">
          {isSolved ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-mono text-xs font-bold shadow-[0_0_15px_rgba(16,185,129,0.4)]">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              CIRCUIT LOCKED (5/5)
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-300 font-bold">
                STAGE: <strong className="text-violet-300">{connectedIds.length}/5 WIRED</strong>
              </span>
              <button
                onClick={resetNodeWires}
                disabled={connectedIds.length === 0}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono rounded bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                title="Reset wire connections"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                PURGE WIRES
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Circuit Interactive Board */}
      <div className="relative w-full h-[360px] bg-[#080718] border border-violet-500/30 rounded-lg overflow-hidden select-none">
        {/* SVG Wiring Canvas */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <defs>
            <linearGradient id="wireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f0ff" />
              <stop offset="30%" stopColor="#8b5cf6" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>
            <filter id="wireGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Render Active Animated Wire Segments */}
          {connectedIds.map((fromId, index) => {
            if (index >= connectedIds.length - 1) return null;
            const toId = connectedIds[index + 1];
            const fromNode = getNodeByNodeId(fromId);
            const toNode = getNodeByNodeId(toId);
            if (!fromNode || !toNode) return null;

            return (
              <g key={`wire-${fromId}-${toId}`}>
                {/* Outer Glow Line */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={fromNode.color}
                  strokeWidth="6"
                  strokeOpacity="0.4"
                  filter="url(#wireGlow)"
                />
                {/* Core Animated Wire */}
                <line
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke={fromNode.color}
                  strokeWidth="2.5"
                  strokeDasharray="6 4"
                  className="animate-pulse"
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes layer */}
        {CIPHER_LOCK_NODES.map((node) => {
          const isConnected = connectedIds.includes(node.id);
          const connectOrder = connectedIds.indexOf(node.id);
          const isNextExpected =
            !isSolved &&
            !hasError &&
            ((connectedIds.length === 0 && node.id === 'alpha') ||
              (connectedIds.length === 1 && node.id === 'beta') ||
              (connectedIds.length === 2 && node.id === 'gamma') ||
              (connectedIds.length === 3 && node.id === 'delta') ||
              (connectedIds.length === 4 && node.id === 'omega'));

          return (
            <div
              key={node.id}
              style={{
                left: `${node.x}%`,
                top: `${node.y}%`,
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <button
                type="button"
                onClick={() => handleNodeClick(node)}
                disabled={isSolved || isConnected}
                className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all duration-200 min-w-[130px] text-center group ${
                  isConnected
                    ? 'bg-violet-950/90 border-violet-400 shadow-[0_0_20px_rgba(139,92,246,0.7)]'
                    : isNextExpected
                    ? 'bg-black/90 border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.5)] hover:scale-105'
                    : 'bg-black/70 border-slate-700/80 hover:border-slate-500 hover:scale-102'
                } disabled:cursor-default`}
              >
                {/* Connection Badge Indicator */}
                {isConnected && (
                  <div className="absolute -top-3 -right-2 px-1.5 py-0.5 rounded-full bg-violet-600 text-white font-mono text-[10px] font-bold border border-white/40 shadow-md">
                    #{connectOrder + 1}
                  </div>
                )}

                {/* Node Code */}
                <span
                  className="font-mono text-[11px] font-extrabold tracking-wider"
                  style={{ color: node.color }}
                >
                  {node.code}
                </span>

                {/* Frequency / Main Label */}
                <span className="font-mono text-xs font-bold text-white mt-0.5">
                  {node.label}
                </span>

                {/* Role / Sublabel */}
                <span className="font-mono text-[9px] text-slate-300 mt-0.5">
                  {node.sublabel}
                </span>

                {/* Glowing terminal dot */}
                <div
                  className={`w-2.5 h-2.5 rounded-full mt-1.5 transition-all ${
                    isConnected
                      ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]'
                      : 'bg-slate-600 group-hover:bg-cyan-400'
                  }`}
                />
              </button>
            </div>
          );
        })}

        {/* Circuit Short Warning Overlay */}
        {hasError && !isSolved && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-amber-950/95 border border-amber-500 p-3 rounded-lg shadow-xl flex items-center justify-between animate-shake">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400 animate-pulse flex-shrink-0" />
              <div>
                <div className="font-mono text-xs font-bold text-amber-300">
                  CIRCUIT SHORT DETECTED
                </div>
                <div className="font-mono text-[11px] text-amber-200">
                  {nodeWireState?.error || 'Node sequence disruptive. Circuit flow broken.'}
                </div>
              </div>
            </div>
            <button
              onClick={resetNodeWires}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-mono text-xs font-extrabold rounded shadow transition-colors flex-shrink-0"
            >
              PURGE & RETRY
            </button>
          </div>
        )}

        {/* Success Banner */}
        {isSolved && (
          <div className="absolute bottom-4 left-4 right-4 z-20 bg-emerald-950/95 border border-emerald-400 p-3 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.5)] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <div>
                <div className="font-mono text-xs font-bold text-emerald-300">
                  HARMONIC CONVERGENCE ACHIEVED // C2 COMPLETE
                </div>
                <div className="font-mono text-[11px] text-emerald-200">
                  All 5 nodes synchronized across BroadcastChannel mesh. Carrier lock bypassed.
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-300 font-mono text-xs font-bold">
              <Zap className="w-4 h-4 text-emerald-400" />
              SYNCHRONIZED
            </div>
          </div>
        )}
      </div>

      {/* Helpful Operational Hints */}
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-300 px-1">
        <span className="flex items-center gap-1.5">
          <Link2 className="w-3.5 h-3.5 text-violet-400" />
          Sequence requirement: 5 nodes. Cross-tab synchronized via BroadcastChannel.
        </span>
        <span className="text-violet-300 font-bold">
          {connectedIds.length === 5 ? 'RESONANCE VERIFIED' : 'AWAITING NODE WIRING'}
        </span>
      </div>
    </div>
  );
};
