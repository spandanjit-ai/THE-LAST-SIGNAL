import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  Key,
  Radio,
  Cpu,
  CheckCircle2,
  Sparkles,
  Share2,
  ShieldCheck,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { SoundFX } from '../../utils/audio';

export const KeyRole: React.FC<{ onNavigateToRole?: (role: any) => void }> = ({ onNavigateToRole }) => {
  const { state, discoverKey } = useMission();
  const isKeyUnlocked = Boolean(state.keyDiscovered || state.completedStages?.key);

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Manual frequency slider option
  const [frequency, setFrequency] = useState<number>(1416.0);
  const targetFrequency = 1420.4;
  const isTuned = Math.abs(frequency - targetFrequency) < 0.6;

  const startFrequencyAnalysis = () => {
    SoundFX.playTick();
    setIsScanning(true);
    setScanProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);
      SoundFX.playTick();

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        SoundFX.playSuccessPing();
        discoverKey();
      }
    }, 250);
  };

  const handleTune = (val: number) => {
    setFrequency(val);
    SoundFX.playTick();
  };

  const handleManualUnlock = () => {
    if (isTuned) {
      SoundFX.playSuccessPing();
      discoverKey();
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* 1. Header Banner */}
      <div className="bg-space-900 border border-violet/30 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-violet/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-2">
          <div>
            <div className="flex items-center gap-2 text-violet text-xs font-bold tracking-widest uppercase mb-1">
              <Key className="w-4 h-4" /> CRYPTOGRAPHIC TELEMETRY
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 tracking-wider">
              ORBITAL KEY ANALYZER
            </h2>
          </div>

          <div
            className={`px-3 py-1 rounded text-xs font-mono border ${
              isKeyUnlocked
                ? 'bg-violet/20 border-violet/50 text-violet font-bold'
                : 'bg-space-950 border-slate-700 text-slate-400'
            }`}
          >
            KEY STATUS: {isKeyUnlocked ? 'SYNCHRONIZED' : 'LOCKED / PENDING SCAN'}
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed max-w-3xl font-sans">
          Terminal 2 intercepts deep orbital telemetry to extract the rotation index required to unscramble the raw transmission in Terminal 1.
        </p>
      </div>

      {/* 2. Interactive Frequency Interceptor */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-4 h-4 text-violet" />
          <h3 className="font-display font-bold text-base text-slate-200">
            TRANSMISSION FREQUENCY DECONVOLUTION
          </h3>
        </div>

        {!isKeyUnlocked ? (
          <div className="bg-space-950 p-6 rounded-lg border border-slate-800 text-center space-y-6">
            <Radio className="w-12 h-12 text-violet/60 mx-auto animate-pulse" />
            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-1">
                ENCRYPTED CARRIER FREQUENCY DETECTED
              </h4>
              <p className="text-slate-400 text-xs max-w-md mx-auto font-sans leading-relaxed">
                Scan the incoming carrier spectrum (or align the hydrogen resonance slider to 1420.4 MHz) to isolate the Caesar rotation key.
              </p>
            </div>

            {/* Scanning Progress */}
            {isScanning ? (
              <div className="max-w-xs mx-auto space-y-2">
                <div className="w-full bg-space-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-violet h-full transition-all duration-200"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <div className="text-[11px] font-mono text-violet animate-pulse">
                  DECONVOLVING CARRIER SPECTRUM: {scanProgress}%
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={startFrequencyAnalysis}
                  className="px-6 py-2.5 rounded font-bold text-xs bg-violet hover:bg-violet/90 text-white transition-all flex items-center gap-2 shadow-lg shadow-violet/20"
                >
                  <Sparkles className="w-4 h-4" /> INITIATE TELEMETRY SCAN
                </button>
              </div>
            )}

            {/* Manual Slider Alternative */}
            <div className="pt-4 border-t border-slate-800/80 max-w-md mx-auto text-left space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-violet" /> MANUAL TUNER:
                </span>
                <span className={isTuned ? 'text-cyan font-bold animate-pulse' : 'text-slate-300'}>
                  {frequency.toFixed(1)} MHz {isTuned && '(TARGET)'}
                </span>
              </div>
              <input
                type="range"
                min="1410.0"
                max="1430.0"
                step="0.2"
                value={frequency}
                onChange={(e) => handleTune(parseFloat(e.target.value))}
                className="w-full accent-violet h-2 bg-space-900 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>1410.0 MHz</span>
                <span className="text-violet font-semibold">1420.4 MHz</span>
                <span>1430.0 MHz</span>
              </div>
              {isTuned && !isScanning && (
                <div className="pt-2 flex justify-center">
                  <button
                    onClick={handleManualUnlock}
                    className="px-4 py-1.5 rounded text-xs font-bold uppercase bg-violet/20 border border-violet/40 text-violet hover:bg-violet/30 transition-all flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> LOCK IN 1420.4 MHz
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Discovered Key Card */}
            <div className="bg-space-950 p-5 rounded-lg border border-violet/40 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold text-violet flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" /> RECOVERED ROTATION KEY
                </span>
                <span className="text-[10px] font-mono bg-violet/10 text-violet px-2 py-0.5 rounded border border-violet/20">
                  CONFIDENCE: 99.9%
                </span>
              </div>

              <div className="p-4 rounded bg-space-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase tracking-widest mb-1">
                    OPTIMAL CAESAR OFFSET
                  </div>
                  <div className="text-2xl sm:text-3xl font-display font-black text-violet tracking-wider">
                    SHIFT: 2 (BACKWARD)
                  </div>
                </div>

                <div className="text-right text-xs text-slate-400 font-mono">
                  <div>ROTATION: <span className="text-slate-200 font-bold">-2 / +24</span></div>
                  <div>FORMULA: <span className="text-slate-200 font-bold">(C - 2) mod 26</span></div>
                </div>
              </div>

              {/* Clue Fragment Narrative */}
              <div className="p-3.5 rounded bg-violet/5 border border-violet/20 text-xs text-slate-300 leading-relaxed font-mono">
                <strong className="text-violet block mb-1">TELEMETRY FRAGMENT #01:</strong>
                &quot;Carrier waveform reveals a classical 2-letter leftward displacement. When applied to{' '}
                <span className="text-cyan font-bold mx-1">VJG NCUV UKIPCN</span>, the carrier resolves directly into the primary mission codename. Synchronized across all terminal channels.&quot;
              </div>
            </div>

            {/* Cross-Tab Sync Status Banner */}
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>
                  Shift key is actively synchronized with <strong>Terminal 1 (Transmission)</strong> and <strong>Terminal 3 (Anomaly)</strong>.
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    SoundFX.playSuccessPing();
                    discoverKey();
                  }}
                  className="text-[11px] underline flex items-center gap-1 hover:text-emerald-200 shrink-0"
                >
                  <Share2 className="w-3.5 h-3.5" /> Re-broadcast
                </button>
                {onNavigateToRole && (
                  <button
                    onClick={() => onNavigateToRole('transmission')}
                    className="px-3 py-1 rounded bg-violet text-slate-950 font-bold text-xs uppercase hover:bg-violet/90 transition-all flex items-center gap-1 shrink-0"
                  >
                    GO TO TAB 1 <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
