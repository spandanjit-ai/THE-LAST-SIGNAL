import React, { useState } from 'react';
import { 
  Key, 
  Radio, 
  Cpu, 
  CheckCircle2, 
  Sparkles, 
  Share2, 
  ShieldCheck 
} from 'lucide-react';
import { UseMissionReturn } from '../hooks/useMission';
import { soundEffects } from '../utils/audioFx';

interface KeyRoleViewProps {
  mission: UseMissionReturn;
}

export const KeyRoleView: React.FC<KeyRoleViewProps> = ({ mission }) => {
  const { state, discoverClue } = mission;
  const isKeyDiscovered = state.discoveredClues.clue_key_shift;

  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  const startFrequencyAnalysis = () => {
    soundEffects.playClick();
    setIsScanning(true);
    setScanProgress(0);

    let current = 0;
    const interval = setInterval(() => {
      current += 20;
      setScanProgress(current);
      soundEffects.playBeep(400 + current * 6, 0.04, 'triangle');

      if (current >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        soundEffects.playKeyFound();
        discoverClue('clue_key_shift');
      }
    }, 250);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-space-900 border border-violet/30 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-violet/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 text-violet text-xs font-bold tracking-widest uppercase mb-1">
              <Key className="w-4 h-4" /> CRYPTOGRAPHIC TELEMETRY
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 tracking-wider">
              ORBITAL KEY ANALYZER
            </h2>
          </div>

          <div className={`px-3 py-1 rounded text-xs font-mono border ${
            isKeyDiscovered
              ? 'bg-violet/20 border-violet/50 text-violet'
              : 'bg-space-950 border-slate-700 text-slate-400'
          }`}>
            KEY STATUS: {isKeyDiscovered ? 'SYNCHRONIZED' : 'LOCKED / PENDING SCAN'}
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
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

        {!isKeyDiscovered ? (
          <div className="bg-space-950 p-6 rounded-lg border border-slate-800 text-center space-y-4">
            <Radio className="w-12 h-12 text-violet/60 mx-auto animate-pulse" />
            <div>
              <h4 className="text-slate-200 font-bold text-sm mb-1">
                ENCRYPTED CARRIER FREQUENCY DETECTED
              </h4>
              <p className="text-slate-400 text-xs max-w-md mx-auto">
                Scan the incoming carrier spectrum to isolate the Caesar rotation key. Once extracted, the key will automatically synchronize to all open browser terminals.
              </p>
            </div>

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
              <button
                onClick={startFrequencyAnalysis}
                className="px-6 py-2.5 rounded font-bold text-xs bg-violet hover:bg-violet/90 text-white transition-all flex items-center gap-2 mx-auto shadow-lg shadow-violet/20"
              >
                <Sparkles className="w-4 h-4" /> INITIATE TELEMETRY SCAN
              </button>
            )}
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
                  <div className="text-[11px] text-slate-500 uppercase tracking-widest mb-1">
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
                "Carrier waveform reveals a classical 2-letter leftward displacement. When applied to 
                <span className="text-cyan font-bold mx-1">VJG NCUV UKIPCN</span>, the carrier resolves directly into the primary mission codename. Synchronized across all terminal channels."
              </div>
            </div>

            {/* Cross-Tab Sync Status Banner */}
            <div className="p-3 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Shift key is actively synchronized with <strong>Terminal 1 (Transmission)</strong> and <strong>Terminal 3 (Anomaly)</strong>.</span>
              </div>
              <button
                onClick={() => {
                  soundEffects.playKeyFound();
                  discoverClue('clue_key_shift');
                }}
                className="text-[11px] underline flex items-center gap-1 hover:text-emerald-200 shrink-0 ml-2"
              >
                <Share2 className="w-3.5 h-3.5" /> Re-broadcast
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
