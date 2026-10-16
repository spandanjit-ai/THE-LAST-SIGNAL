import React, { useState, useEffect } from 'react';
import { useMission } from '../../hooks/useMission';
import { calculateEntropy, EntropyCalculationResult } from '../../engine/entropyTimer';
import { AlertOctagon, RotateCcw, ShieldCheck, Flame, Activity, X } from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const EntropyGlitchOverlay: React.FC = () => {
  const { state, recalibrateEntropy, stabilizeEntropyWithChecksum } = useMission();
  const { entropyState } = state;
  const [isModalDismissed, setIsModalDismissed] = useState(false);

  const [metrics, setMetrics] = useState<EntropyCalculationResult>(() =>
    calculateEntropy(
      entropyState?.timerStartedAt || state.startedAt,
      !!entropyState?.isStabilized
    )
  );

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  // Real-time deterministic clock tick (respecting document.hidden to save CPU/GPU)
  useEffect(() => {
    const updateMetrics = () => {
      if (document.hidden) return; // Inactive tab optimization
      const current = calculateEntropy(
        entropyState?.timerStartedAt || state.startedAt,
        !!entropyState?.isStabilized
      );
      setMetrics(current);
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 250);

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        updateMetrics();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [entropyState?.timerStartedAt, entropyState?.isStabilized, state.startedAt]);

  const { secondsRemaining, glitchIntensity, severity, isExpired, statusText } = metrics;
  const isStabilized = !!entropyState?.isStabilized;

  const handleRecalibrate = () => {
    SoundFX.playSuccessPing();
    recalibrateEntropy();
  };

  return (
    <>
      {/* 1. Fullscreen Subtle Controlled Glitch Shader Overlay (Non-blocking, pointer-events-none) */}
      {!isStabilized && glitchIntensity > 0.05 && !prefersReducedMotion && (
        <div
          className="fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
          style={{ opacity: Math.min(0.35, glitchIntensity * 0.4) }}
        >
          {/* Scanline sweep */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />

          {/* Glitch noise and chromatic drift */}
          <div
            className="absolute inset-0 bg-red-500/10 mix-blend-color-dodge animate-pulse"
            style={{
              transform: `translate(${Math.sin(Date.now() / 100) * glitchIntensity * 2}px, ${
                Math.cos(Date.now() / 150) * glitchIntensity * 1.5
              }px)`,
            }}
          />
        </div>
      )}

      {/* 2. Top-Level Entropy Challenge Status HUD Bar */}
      <div className="w-full bg-[#0a0c16]/95 border-b border-cyan-500/30 px-4 py-2.5 backdrop-blur-md shadow-lg sticky top-0 z-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-xs">
          {/* Left: Challenge Title & Timer */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded bg-amber-950/80 border border-amber-500/50 text-amber-400">
                <Flame className="w-4 h-4 animate-pulse" />
              </span>
              <div>
                <span className="text-[10px] text-amber-300 font-bold block">
                  CHALLENGE C3 // 90S ENTROPY CASCADE
                </span>
                <span className="text-white font-extrabold text-xs">
                  {statusText}
                </span>
              </div>
            </div>

            {/* Countdown Badge */}
            <div
              className={`px-3 py-1 rounded-md border font-mono font-bold text-sm tracking-wider flex items-center gap-1.5 ${
                isStabilized
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                  : isExpired
                  ? 'bg-red-950/90 border-red-500 text-red-300 animate-pulse'
                  : severity === 'CRITICAL'
                  ? 'bg-amber-950/90 border-amber-500 text-amber-300 animate-pulse'
                  : 'bg-cyan-950/90 border-cyan-500 text-cyan-300'
              }`}
            >
              {isStabilized ? (
                <>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  STABILIZED
                </>
              ) : (
                <>
                  <Activity className="w-4 h-4" />
                  {secondsRemaining}s REMAINING
                </>
              )}
            </div>
          </div>

          {/* Center: Progress / Depletion Bar */}
          <div className="w-full md:flex-1 max-w-md flex flex-col gap-1">
            <div className="flex justify-between text-[10px] text-slate-300 font-bold">
              <span>ENTROPY INSTABILITY</span>
              <span
                className={
                  isStabilized
                    ? 'text-emerald-400'
                    : isExpired
                    ? 'text-red-400'
                    : 'text-amber-400'
                }
              >
                {(glitchIntensity * 100).toFixed(0)}% JITTER INTENSITY
              </span>
            </div>
            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className={`h-full transition-all duration-300 ${
                  isStabilized
                    ? 'bg-emerald-400 w-full'
                    : isExpired
                    ? 'bg-red-500 w-full'
                    : severity === 'CRITICAL'
                    ? 'bg-gradient-to-r from-amber-500 to-red-500'
                    : 'bg-gradient-to-r from-cyan-400 to-amber-400'
                }`}
                style={{
                  width: isStabilized ? '100%' : `${Math.max(5, (secondsRemaining / 90) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Right: Actions / Dampener info */}
          <div className="flex items-center gap-2 w-full md:w-auto justify-end">
            {isStabilized ? (
              <span className="text-[11px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                DAMPENER: {entropyState?.entropyDampenerCode || '0x7749-CLEAR'}
              </span>
            ) : isExpired ? (
              <button
                onClick={handleRecalibrate}
                className="flex items-center gap-1.5 px-3 py-1 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-bold rounded shadow transition-all animate-bounce"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                RE-CALIBRATE OSCILLATOR
              </button>
            ) : (
              <span className="text-[11px] font-mono text-slate-300">
                Scrub timeline to T+0s to extract dampener
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Expiry Warning Modal if 90s Elapsed without stabilization */}
      {isExpired && !isStabilized && !isModalDismissed && (
        <div className="fixed inset-0 z-40 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#12080a] border-2 border-red-500 rounded-xl p-6 shadow-[0_0_40px_rgba(239,68,68,0.5)] flex flex-col gap-4 text-center relative">
            {/* Dismiss Button */}
            <button
              onClick={() => setIsModalDismissed(true)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white transition-colors"
              title="Dismiss warning"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-red-950 border border-red-500 text-red-400 flex items-center justify-center mx-auto animate-pulse">
              <AlertOctagon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-mono text-base font-extrabold text-red-300 uppercase tracking-wider">
                CARRIER ENTROPY EXPIRED // SIGNAL COLLAPSE
              </h3>
              <p className="font-mono text-xs text-slate-300 mt-2 leading-relaxed">
                The 90-second entropy cascade elapsed before harmonic dampener stabilization.
                Scrub the Temporal Scrubber to T+0s to recover pre-entropy code{' '}
                <strong className="text-amber-300 font-mono">0x7749-CLEAR</strong>, or
                re-calibrate / stabilize the oscillator below.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2.5 mt-2">
              <button
                onClick={handleRecalibrate}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-500 text-white font-mono text-xs font-extrabold rounded-lg shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" />
                RESET 90s TIMER
              </button>
              <button
                onClick={() => {
                  SoundFX.playSuccessPing();
                  stabilizeEntropyWithChecksum('0x7749-CLEAR');
                }}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-extrabold rounded-lg shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                STABILIZE DAMPENER
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
