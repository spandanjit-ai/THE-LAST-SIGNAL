import React, { useState } from 'react';
import { useMission } from '../../hooks/useMission';
import {
  ANOMALY_CODE,
  ANOMALY_ATTRIBUTE_NAME,
  ANOMALY_ELEMENT_ID,
} from '../../engine/verification';
import {
  Binary,
  Code2,
  CheckCircle2,
  AlertCircle,
  Search,
  Terminal,
  Cpu,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const AnomalyRole: React.FC = () => {
  const { state, confirmAnomaly } = useMission();
  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const isConfirmed = state.anomalyConfirmed || state.completedStages.anomaly;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;

    const result = confirmAnomaly(inputCode);
    setFeedback(result);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-space-900/80 border border-amber-500/30 rounded-lg p-5 backdrop-blur-md relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Binary className="w-36 h-36 text-amber-400" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-amber-950/80 border border-amber-500/40 text-amber-300">
              <Binary className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-amber-400 tracking-wider uppercase">
                DOM METADATA INSPECTOR
              </span>
              <h2 className="font-display text-xl lg:text-2xl font-bold tracking-wide text-white">
                SHADOW PACKET ANOMALY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isConfirmed ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-300">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                METADATA CONFIRMED & SYNCED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-950/60 border border-amber-500/40 text-amber-300 animate-pulse">
                <Search className="w-3.5 h-3.5" />
                DEVTOOLS INSPECTION REQUIRED
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-slate-300 leading-relaxed max-w-3xl">
          Deep telemetry diagnostics indicate that corrupted transmission metadata has been concealed directly inside the browser DOM hierarchy.
          You must use browser Developer Tools to inspect this webpage&apos;s elements and retrieve the hidden anomaly payload.
        </p>
      </div>

      {/* Real Target DOM Element where the anomaly is placed */}
      <div
        id={ANOMALY_ELEMENT_ID}
        {...{ [ANOMALY_ATTRIBUTE_NAME]: ANOMALY_CODE }}
        className="relative p-5 rounded-lg border border-dashed border-amber-500/40 bg-space-950/70 overflow-hidden group"
      >
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-amber-400 font-bold flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            TARGET METADATA CARRIER NODE [DOM ID: #{ANOMALY_ELEMENT_ID}]
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            TAG: &lt;div id=&quot;{ANOMALY_ELEMENT_ID}&quot; {ANOMALY_ATTRIBUTE_NAME}=&quot;...&quot;&gt;
          </span>
        </div>

        <p className="text-xs font-mono text-slate-400 leading-relaxed mb-3">
          This element contains the classified anomaly data attribute. Right-click anywhere in this box and choose
          <span className="text-amber-300 font-bold"> &quot;Inspect&quot;</span> or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">F12</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">Cmd+Option+I</kbd>.
          Look for the attribute <code className="text-cyan-300 font-bold">{ANOMALY_ATTRIBUTE_NAME}</code> in the HTML markup.
        </p>

        {/* Diagnostic Visualizer inside the anomaly box */}
        <div className="p-3 rounded bg-space-900 border border-slate-800/80 font-mono text-[11px] text-slate-500 flex flex-wrap justify-between gap-2">
          <span>PACKET: 0x88F9_NODE</span>
          <span>CHECKSUM: 0x7749</span>
          <span className="text-amber-400/80">INSPECT DOM FOR HIDDEN VALUE</span>
        </div>
      </div>

      {/* Hex Dump Visualizer Panel */}
      <div className="bg-space-900/80 border border-amber-500/30 rounded-lg p-5 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-amber-400" />
          <h3 className="font-display text-sm font-bold tracking-wider text-slate-200 uppercase">
            CORRUPTED TELEMETRY STREAM
          </h3>
        </div>

        <div className="bg-space-950 p-4 rounded border border-slate-800 font-mono text-xs text-slate-400 space-y-1 overflow-x-auto">
          <div className="text-slate-500">// Intercepted Packet Payload Dump (Fragment 07)</div>
          <div>00000000: 53 49 47 2d 37 37 34 39  2d 4f 4d 45 47 41 20 20  SIG-7749-OMEGA..</div>
          <div>00000010: 54 48 45 20 4c 41 53 54  20 53 49 47 4e 41 4c 21  THE LAST SIGNAL!</div>
          <div>00000020: 00 20 7f 99 12 ac 45 00  00 00 00 00 00 00 00 00  . ....E.........</div>
        </div>
      </div>

      {/* Confirmation Input Form */}
      <div className="bg-space-900/80 border border-amber-500/30 rounded-lg p-6 backdrop-blur-md">
        <div className="flex items-center gap-2 mb-4">
          <Cpu className="w-5 h-5 text-amber-400" />
          <h3 className="font-display text-lg font-bold text-white tracking-wide">
            CONFIRM ANOMALY AUTHORIZATION
          </h3>
        </div>

        {isConfirmed ? (
          <div className="p-4 rounded-lg bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0" />
            <div>
              <div className="font-display font-bold text-sm">
                ANOMALY CODE VERIFIED & LOCKED
              </div>
              <div className="text-xs font-mono text-emerald-400/80">
                Authoritative token: <span className="font-bold">{ANOMALY_CODE}</span> is registered in the mission state.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="anomaly-code-input" className="block text-xs font-mono text-slate-300 mb-2">
                ENTER DOM ANOMALY CODE RECOVERED FROM DEVTOOLS:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="anomaly-code-input"
                  type="text"
                  placeholder="e.g. SIG-XXXX-XXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded bg-space-950 border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 text-white font-mono text-sm tracking-wider uppercase placeholder:text-slate-600 outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-amber-500 hover:bg-amber-400 text-space-950 font-display font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  AUTHENTICATE CLUE
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
                  feedback.success
                    ? 'bg-emerald-950/60 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-950/60 border border-rose-500/40 text-rose-300'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                )}
                <span>{feedback.message}</span>
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
};
