import React, { useState } from 'react';
import { 
  Search, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Send 
} from 'lucide-react';
import { UseMissionReturn } from '../hooks/useMission';
import { ANOMALY_TOKEN, ANOMALY_ATTRIBUTE_NAME } from '../engine/cipher';
import { soundEffects } from '../utils/audioFx';

interface AnomalyRoleViewProps {
  mission: UseMissionReturn;
}

export const AnomalyRoleView: React.FC<AnomalyRoleViewProps> = ({ mission }) => {
  const { state, confirmAnomalyClue } = mission;
  const isAnomalyConfirmed = state.anomalyConfirmed;

  const [tokenInput, setTokenInput] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    soundEffects.playClick();

    if (!tokenInput.trim()) {
      setErrorMsg('Please enter the anomaly signature token discovered in the DOM.');
      return;
    }

    const success = confirmAnomalyClue(tokenInput.trim());
    if (success || tokenInput.trim().toUpperCase() === ANOMALY_TOKEN) {
      soundEffects.playKeyFound();
      setTokenInput('');
    } else {
      soundEffects.playError();
      setErrorMsg('Invalid anomaly signature. Ensure you inspect the #anomaly-node element in DevTools.');
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Anomaly Banner */}
      <div className="bg-space-900 border border-amber/30 rounded-lg p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-amber/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-3">
          <div>
            <div className="flex items-center gap-2 text-amber text-xs font-bold tracking-widest uppercase mb-1">
              <Search className="w-4 h-4" /> METADATA ANOMALY DETECTOR
            </div>
            <h2 className="font-display font-black text-xl md:text-2xl text-slate-100 tracking-wider">
              DOM INSPECTION CHAMBER
            </h2>
          </div>

          <div className={`px-3 py-1 rounded text-xs font-mono border ${
            isAnomalyConfirmed
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-amber/10 border-amber/40 text-amber'
          }`}>
            ANOMALY: {isAnomalyConfirmed ? 'VERIFIED & LINKED' : 'UNCONFIRMED SIGNATURE'}
          </div>
        </div>

        <p className="text-slate-400 text-xs leading-relaxed max-w-3xl">
          A corrupted packet embedded in this page’s Document Object Model (DOM) contains hidden metadata required for vault verification.
        </p>
      </div>

      {/* 2. DevTools Briefing & Designated DOM Element */}
      <div className="bg-space-900 border border-slate-800 rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <Code className="w-4 h-4 text-amber" />
          <h3 className="font-display font-bold text-base text-slate-200">
            BROWSER DEVTOOLS INSTRUCTIONS
          </h3>
        </div>

        <div className="bg-space-950 p-4 rounded-lg border border-slate-800 space-y-3 mb-5 text-xs text-slate-300">
          <p>
            1. Open your browser Developer Tools by pressing <kbd className="px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 font-mono text-cyan">F12</kbd> (or <kbd className="px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 font-mono text-cyan">Ctrl + Shift + I</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-space-900 border border-slate-700 font-mono text-cyan">Cmd + Option + I</kbd>).
          </p>
          <p>
            2. Go to the <strong>Elements</strong> / <strong>Inspector</strong> panel.
          </p>
          <p>
            3. Locate the target DOM element with ID <code className="text-amber font-mono font-bold">#anomaly-node</code> below, and copy the value of its custom HTML attribute: <code className="text-cyan font-mono">{ANOMALY_ATTRIBUTE_NAME}</code>.
          </p>
        </div>

        {/* The Designated DOM Element with the data-* attribute */}
        <div className="mb-6">
          <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center justify-between">
            <span>TARGET DOM TRANSMISSION NODE:</span>
            <span className="text-amber">INSPECT THIS ELEMENT IN DEVTOOLS</span>
          </div>

          <div
            id="anomaly-node"
            data-transmission-anomaly={ANOMALY_TOKEN}
            data-transmission-origin="DEEP_SPACE_ARRAY_7"
            data-protocol-version="TLS-OMEGA-1.0"
            className="p-4 rounded-lg bg-space-950 border border-dashed border-amber/40 font-mono text-xs text-slate-400 select-all hover:border-amber transition-colors"
          >
            <div className="flex items-center gap-2 text-amber text-[11px] font-bold mb-1">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>&lt;div id="anomaly-node" data-transmission-anomaly="..."&gt;</span>
            </div>
            <div className="text-[11px] text-slate-400">
              [SYSTEM NOTE: Corrupted carrier wave detected. Inspect DOM attributes to extract the anomaly authorization token.]
            </div>
          </div>
        </div>

        {/* Confirmation Form */}
        <div className="border-t border-slate-800 pt-5">
          <h4 className="font-display font-bold text-sm text-slate-200 mb-2">
            SUBMIT EXTRACTED ANOMALY TOKEN
          </h4>

          {isAnomalyConfirmed ? (
            <div className="p-4 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="block text-sm text-emerald-200">
                  ANOMALY TOKEN VERIFIED: {state.anomalyToken || ANOMALY_TOKEN}
                </strong>
                <span>DOM metadata successfully verified and synchronized to all mission terminals.</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. SIG-7749-OMEGA"
                  value={tokenInput}
                  onChange={(e) => {
                    setTokenInput(e.target.value.toUpperCase());
                    setErrorMsg(null);
                  }}
                  className="flex-1 bg-space-950 border border-slate-700 rounded px-3 py-2 text-sm font-mono tracking-wider text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber"
                />
                <button
                  type="submit"
                  className="px-5 py-2 rounded text-xs font-bold uppercase tracking-wider bg-amber hover:bg-amber/90 text-slate-950 transition-all flex items-center gap-2 shadow-lg shadow-amber/20"
                >
                  <Send className="w-4 h-4" /> CONFIRM
                </button>
              </div>

              {errorMsg && (
                <div className="p-2.5 rounded bg-rose-950/40 border border-rose-600/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
