import React, { useState, useRef, useCallback } from 'react';
import { Eye, Search, Crosshair, Sparkles, Sliders, ShieldAlert } from 'lucide-react';
import { SoundFX } from '../../utils/audio';

interface XRayLensProps {
  onClueRevealed?: (clueId: string) => void;
}

export const XRayLens: React.FC<XRayLensProps> = ({ onClueRevealed }) => {
  const [lensPos, setLensPos] = useState({ x: 50, y: 50 });
  const [accessibleMode, setAccessibleMode] = useState(false);
  const [revealedSectors, setRevealedSectors] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(
    (clientX: number, clientY: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const rawX = ((clientX - rect.left) / rect.width) * 100;
      const rawY = ((clientY - rect.top) / rect.height) * 100;
      const clampedX = Math.max(5, Math.min(95, rawX));
      const clampedY = Math.max(5, Math.min(95, rawY));
      setLensPos({ x: clampedX, y: clampedY });

      // Check sectors for discovery audio feedback
      let sectorFound = '';
      if (clampedX > 10 && clampedX < 35 && clampedY > 20 && clampedY < 45) {
        sectorFound = 'sector-alpha';
      } else if (clampedX > 40 && clampedX < 65 && clampedY > 10 && clampedY < 35) {
        sectorFound = 'sector-beta';
      } else if (clampedX > 70 && clampedX < 95 && clampedY > 20 && clampedY < 45) {
        sectorFound = 'sector-gamma';
      } else if (clampedX > 60 && clampedX < 85 && clampedY > 65 && clampedY < 90) {
        sectorFound = 'sector-delta';
      } else if (clampedX > 20 && clampedX < 45 && clampedY > 65 && clampedY < 90) {
        sectorFound = 'sector-omega';
      }

      if (sectorFound && !revealedSectors[sectorFound]) {
        setRevealedSectors((prev) => ({ ...prev, [sectorFound]: true }));
        SoundFX.playSuccessPing();
        onClueRevealed?.(sectorFound);
      }
    },
    [revealedSectors, onClueRevealed]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    updatePosition(e.clientX, e.clientY);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = 6;
    let nextX = lensPos.x;
    let nextY = lensPos.y;

    if (e.key === 'ArrowLeft') nextX -= step;
    else if (e.key === 'ArrowRight') nextX += step;
    else if (e.key === 'ArrowUp') nextY -= step;
    else if (e.key === 'ArrowDown') nextY += step;
    else return;

    e.preventDefault();
    const clampedX = Math.max(5, Math.min(95, nextX));
    const clampedY = Math.max(5, Math.min(95, nextY));
    setLensPos({ x: clampedX, y: clampedY });
    SoundFX.playTick();
  };

  const jumpToSector = (x: number, y: number, name: string) => {
    setLensPos({ x, y });
    setRevealedSectors((prev) => ({ ...prev, [name]: true }));
    SoundFX.playSuccessPing();
  };

  const revealedCount = Object.keys(revealedSectors).length;

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Header Bar */}
      <div className="flex items-center justify-between bg-black/60 border border-cyan-500/30 px-4 py-2.5 rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.15)]">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="font-mono text-xs tracking-wider text-cyan-300 font-bold uppercase">
            SPECTRAL X-RAY LENS // REVEAL SUB-SURFACE CIPHER
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs text-slate-300 font-medium">
            REVEALED: <strong className="text-cyan-400">{revealedCount}/5 SECTORS</strong>
          </span>
          <button
            onClick={() => setAccessibleMode(!accessibleMode)}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50 transition-colors"
            title="Toggle accessible high-visibility view"
          >
            <Sliders className="w-3 h-3 text-cyan-400" />
            {accessibleMode ? 'LENS MODE' : 'ACCESSIBLE VIEW'}
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div
        ref={containerRef}
        tabIndex={0}
        onPointerMove={handlePointerMove}
        onKeyDown={handleKeyDown}
        aria-label="X-Ray Lens Inspection Area. Use arrow keys to scan for concealed harmonic frequencies."
        className="relative w-full h-[380px] bg-[#070b14] border border-cyan-500/30 rounded-xl overflow-hidden cursor-crosshair select-none focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-2xl"
      >
        {/* Layer 0: Deep Space Grid & Noise Background */}
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Layer 1: Obscured / Encrypted Carrier Static Surface (Default view) */}
        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
          <div className="flex justify-between items-start font-mono text-[11px] text-slate-400">
            <div>
              <span className="text-cyan-400">BAND:</span> 1.420 GHz [HYDROGEN LINE]
              <br />
              <span className="text-slate-400">STATUS:</span> ENCRYPTED CARRIER MATRIX
            </div>
            <div className="text-right">
              <span className="text-amber-400">UV SPECTRUM:</span> MASKED
              <br />
              <span className="text-slate-400">RETICLE:</span> [X: {lensPos.x.toFixed(1)}%, Y:{' '}
              {lensPos.y.toFixed(1)}%]
            </div>
          </div>

          {/* Obscured Carrier Noise Visuals */}
          <div className="grid grid-cols-3 gap-6 opacity-30 my-auto text-center font-mono">
            <div className="border border-slate-700/60 p-4 rounded bg-slate-900/40">
              <p className="text-xs text-slate-400">•••• •••• ••••</p>
              <p className="text-[10px] text-slate-400 mt-1">CARRIER SIGNAL OBSCURED</p>
            </div>
            <div className="border border-slate-700/60 p-4 rounded bg-slate-900/40">
              <p className="text-xs text-slate-400">•••• •••• ••••</p>
              <p className="text-[10px] text-slate-400 mt-1">FREQUENCY FILTER ACTIVE</p>
            </div>
            <div className="border border-slate-700/60 p-4 rounded bg-slate-900/40">
              <p className="text-xs text-slate-400">•••• •••• ••••</p>
              <p className="text-[10px] text-slate-400 mt-1">CIRCUIT ORDER UNVERIFIED</p>
            </div>
          </div>

          <div className="text-center font-mono text-xs text-slate-400 flex items-center justify-center gap-2">
            <Search className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
            Drag pointer or use Arrow Keys to reveal hidden sub-surface circuit nodes
          </div>
        </div>

        {/* Layer 2: Concealed High-Contrast Evidence (Revealed under Lens or in Accessible Mode) */}
        <div
          className="absolute inset-0 p-6 flex flex-col justify-between bg-[#040812] pointer-events-none transition-all duration-75"
          style={{
            clipPath: accessibleMode
              ? 'polygon(0 0, 100% 0, 100% 100%, 0 100%)'
              : `circle(90px at ${lensPos.x}% ${lensPos.y}%)`,
          }}
        >
          {/* Glowing ultraviolet background tint under lens */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/60 via-violet-950/40 to-cyan-900/30" />

          {/* Sub-Surface Header */}
          <div className="relative z-10 flex justify-between font-mono text-[11px] text-cyan-300 font-bold border-b border-cyan-500/40 pb-2">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              ULTRAVIOLET SPECTRAL SCAN ACTIVE // 253.7nm ILLUMINATION
            </span>
            <span className="text-violet-300 font-bold">CARRIER ROUTING MAP EXPOSED</span>
          </div>

          {/* Concealed Evidence Nodes in Absolute Positioning matching CIPHER_LOCK_NODES */}
          <div className="relative z-10 w-full h-[240px]">
            {/* Sector Alpha */}
            <div
              className="absolute left-[18%] top-[30%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border-2 border-cyan-400 bg-cyan-950/90 shadow-[0_0_20px_rgba(0,240,255,0.8)] text-center min-w-[140px]"
            >
              <div className="text-[10px] font-mono font-black text-cyan-300 tracking-wider">
                [STAGE 1]
              </div>
              <div className="text-xs font-mono font-bold text-white">α-CARRIER</div>
              <div className="text-[11px] font-mono text-cyan-200">1420.405 MHz</div>
              <div className="text-[9px] font-mono text-cyan-400/80">Hydrogen Line Base</div>
            </div>

            {/* Sector Beta */}
            <div
              className="absolute left-[50%] top-[14%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border-2 border-violet-400 bg-violet-950/90 shadow-[0_0_20px_rgba(139,92,246,0.8)] text-center min-w-[140px]"
            >
              <div className="text-[10px] font-mono font-black text-violet-300 tracking-wider">
                [STAGE 2]
              </div>
              <div className="text-xs font-mono font-bold text-white">β-MODULATOR</div>
              <div className="text-[11px] font-mono text-violet-200">ROT-2 SHIFT</div>
              <div className="text-[9px] font-mono text-violet-400/80">Caesar Modulo Gate</div>
            </div>

            {/* Sector Gamma */}
            <div
              className="absolute left-[82%] top-[30%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border-2 border-amber-400 bg-amber-950/90 shadow-[0_0_20px_rgba(245,158,11,0.8)] text-center min-w-[140px]"
            >
              <div className="text-[10px] font-mono font-black text-amber-300 tracking-wider">
                [STAGE 3]
              </div>
              <div className="text-xs font-mono font-bold text-white">γ-SIGNATURE</div>
              <div className="text-[11px] font-mono text-amber-200">SIG-7749-OMEGA</div>
              <div className="text-[9px] font-mono text-amber-400/80">DOM Authorization</div>
            </div>

            {/* Sector Delta */}
            <div
              className="absolute left-[70%] top-[78%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border-2 border-emerald-400 bg-emerald-950/90 shadow-[0_0_20px_rgba(16,185,129,0.8)] text-center min-w-[140px]"
            >
              <div className="text-[10px] font-mono font-black text-emerald-300 tracking-wider">
                [STAGE 4]
              </div>
              <div className="text-xs font-mono font-bold text-white">δ-TEMPORAL</div>
              <div className="text-[11px] font-mono text-emerald-200">STABLE WINDOW</div>
              <div className="text-[9px] font-mono text-emerald-400/80">Harmonic Alignment</div>
            </div>

            {/* Sector Omega */}
            <div
              className="absolute left-[30%] top-[78%] -translate-x-1/2 -translate-y-1/2 p-2.5 rounded-lg border-2 border-white bg-slate-900/95 shadow-[0_0_20px_rgba(255,255,255,0.9)] text-center min-w-[140px]"
            >
              <div className="text-[10px] font-mono font-black text-slate-300 tracking-wider">
                [STAGE 5]
              </div>
              <div className="text-xs font-mono font-bold text-white">Ω-ARCHIVE</div>
              <div className="text-[11px] font-mono text-slate-200">OMEGA VAULT</div>
              <div className="text-[9px] font-mono text-slate-400">Terminal SHA-256</div>
            </div>

            {/* Central Guidance Directive */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 border border-cyan-400/60 px-4 py-2 rounded-md text-center max-w-[280px]">
              <span className="font-mono text-[10px] text-cyan-300 font-bold block">
                ROUTING CIPHER DIRECTIVE:
              </span>
              <span className="font-mono text-xs text-white font-extrabold tracking-wide">
                α ➔ β ➔ γ ➔ δ ➔ Ω
              </span>
              <span className="font-mono text-[9px] text-slate-300 block mt-0.5">
                Pass sequence to Transmission console
              </span>
            </div>
          </div>

          {/* Sub-Surface Footer Note */}
          <div className="relative z-10 flex justify-between items-center font-mono text-[10px] text-cyan-300 border-t border-cyan-500/30 pt-2">
            <span className="flex items-center gap-1">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              CONFIDENTIAL: Circuit sequence revealed by X-Ray fluoroscopy.
            </span>
            <span className="text-white font-mono font-bold">TRANSMIT TO TAB 1</span>
          </div>
        </div>

        {/* Reticle / Lens Overlay Glass (Follows Cursor) */}
        {!accessibleMode && (
          <div
            className="absolute pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan-400 shadow-[0_0_25px_rgba(0,240,255,0.7),inset_0_0_15px_rgba(0,240,255,0.4)] flex items-center justify-center transition-transform duration-75"
            style={{
              left: `${lensPos.x}%`,
              top: `${lensPos.y}%`,
              width: '180px',
              height: '180px',
            }}
          >
            {/* Center crosshair */}
            <Crosshair className="w-6 h-6 text-cyan-300/80 animate-spin [animation-duration:12s]" />

            {/* Reticle markings */}
            <div className="absolute -top-6 bg-cyan-950/90 border border-cyan-400/80 px-2 py-0.5 rounded text-[9px] font-mono text-cyan-300 font-bold whitespace-nowrap shadow-lg">
              X-RAY: {lensPos.x.toFixed(0)}% / {lensPos.y.toFixed(0)}%
            </div>
          </div>
        )}
      </div>

      {/* Accessible Hotspot Shortcuts */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 border border-slate-700/60 p-2.5 rounded-lg">
        <span className="font-mono text-[11px] text-slate-300 font-bold flex items-center gap-1.5 mr-2">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          AUTOFOCUS RETICLE:
        </span>
        <button
          onClick={() => jumpToSector(18, 30, 'sector-alpha')}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-cyan-950/60 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 transition-colors"
        >
          [1] α-CARRIER
        </button>
        <button
          onClick={() => jumpToSector(50, 14, 'sector-beta')}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-violet-950/60 border border-violet-500/50 text-violet-300 hover:bg-violet-900/60 transition-colors"
        >
          [2] β-MODULATOR
        </button>
        <button
          onClick={() => jumpToSector(82, 30, 'sector-gamma')}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 hover:bg-amber-900/60 transition-colors"
        >
          [3] γ-SIGNATURE
        </button>
        <button
          onClick={() => jumpToSector(70, 78, 'sector-delta')}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-emerald-950/60 border border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60 transition-colors"
        >
          [4] δ-TEMPORAL
        </button>
        <button
          onClick={() => jumpToSector(30, 78, 'sector-omega')}
          className="px-2.5 py-1 text-xs font-mono font-bold rounded bg-slate-800 border border-slate-400 text-white hover:bg-slate-700 transition-colors"
        >
          [5] Ω-ARCHIVE
        </button>
      </div>
    </div>
  );
};
