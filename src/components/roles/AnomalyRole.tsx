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
      {/* Top Telemetry Header */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3 border-b border-noir-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-noir-base border border-signal-amber/30 text-signal-amber">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-signal-amber uppercase tracking-widest">
                SHADOW DOM METADATA
              </div>
              <h2 className="font-display font-bold text-xl text-signal-text tracking-tight">
                ANOMALY TELEMETRY NODE
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {isConfirmed ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFB454]/15 border border-[#FFB454]/40 text-signal-amber">
                <ShieldCheck className="w-3.5 h-3.5 text-signal-amber" />
                METADATA CONFIRMED & SYNCED
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-noir-base border border-noir-border text-signal-dim">
                <Search className="w-3.5 h-3.5" />
                DEVTOOLS INSPECTION REQUIRED
              </span>
            )}
          </div>
        </div>

        <p className="text-xs font-mono text-signal-muted leading-relaxed max-w-3xl">
          Deep diagnostic logs indicate that corrupted carrier metadata has been concealed inside the DOM tree.
          Open your browser Developer Tools to inspect the elements on this page and retrieve the hidden anomaly payload.
        </p>
      </div>

      {/* Real Target DOM Element where the anomaly is embedded */}
      <div
        id={ANOMALY_ELEMENT_ID}
        {...{ [ANOMALY_ATTRIBUTE_NAME]: ANOMALY_CODE }}
        className="relative p-5 sm:p-6 rounded border border-dashed border-signal-amber/40 bg-noir-surface/90 overflow-hidden"
      >
        <div className="flex flex-wrap items-center justify-between text-xs font-mono mb-2 gap-2">
          <span className="text-signal-amber font-bold flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            TARGET METADATA NODE [DOM ID: #{ANOMALY_ELEMENT_ID}]
          </span>
          <span className="text-[10px] text-signal-dim font-mono">
            TAG: &lt;div id=&quot;{ANOMALY_ELEMENT_ID}&quot; {ANOMALY_ATTRIBUTE_NAME}=&quot;...&quot;&gt;
          </span>
        </div>

        <p className="text-xs font-mono text-signal-text leading-relaxed mb-4">
          This container carries the classified anomaly attribute in the HTML markup. Right-click inside this container and select
          <span className="text-signal-amber font-bold"> &quot;Inspect&quot;</span> (or press <kbd className="px-1.5 py-0.5 rounded bg-noir-base border border-noir-border text-signal-text">F12</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-noir-base border border-noir-border text-signal-text">Cmd+Option+I</kbd>).
          Locate the attribute <code className="text-signal-cyan font-bold">{ANOMALY_ATTRIBUTE_NAME}</code> to find the authorization token.
        </p>

        <div className="p-3 rounded bg-noir-base border border-noir-border text-[11px] font-mono text-signal-dim flex flex-wrap justify-between gap-2">
          <span>PACKET NODE: 0x88F9_TELEMETRY</span>
          <span className="text-signal-amber/90">INSPECT DOM FOR HIDDEN ATTRIBUTE VALUE</span>
        </div>
      </div>

      {/* Confirmation Input Form */}
      <div className="border border-noir-border bg-noir-surface/90 rounded p-5 sm:p-6 backdrop-blur-md space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-noir-border">
          <Cpu className="w-4 h-4 text-signal-amber" />
          <h3 className="font-display font-bold text-lg text-signal-text tracking-wide">
            CONFIRM ANOMALY AUTHORIZATION
          </h3>
        </div>

        {isConfirmed ? (
          <div className="p-4 rounded bg-[#FFB454]/10 border border-[#FFB454]/40 text-signal-amber flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-signal-amber flex-shrink-0" />
            <div>
              <div className="font-display font-bold text-sm">
                ANOMALY TOKEN AUTHENTICATED
              </div>
              <div className="text-xs font-mono text-signal-amber/80 mt-0.5">
                Verified token <span className="font-bold">{ANOMALY_CODE}</span> is locked into the mission state.
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="anomaly-input" className="block text-xs font-mono text-signal-muted mb-2">
                ENTER DOM ANOMALY CODE EXTRACTED VIA DEVTOOLS:
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="anomaly-input"
                  type="text"
                  placeholder="e.g. SIG-XXXX-XXXX"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded bg-noir-base border border-noir-border focus:border-signal-amber text-signal-text font-mono text-sm tracking-wider uppercase placeholder:text-signal-dim outline-none transition-all"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded bg-signal-amber hover:bg-[#FBBF24] text-[#070A12] font-display font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  AUTHENTICATE TOKEN
                </button>
              </div>
            </div>

            {feedback && (
              <div
                className={`p-3 rounded text-xs font-mono flex items-center gap-2 ${
                  feedback.success
                    ? 'bg-noir-base border border-[#22D3EE]/40 text-signal-cyan'
                    : 'bg-noir-base border border-rose-500/40 text-rose-300'
                }`}
              >
                {feedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-signal-cyan flex-shrink-0" />
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
