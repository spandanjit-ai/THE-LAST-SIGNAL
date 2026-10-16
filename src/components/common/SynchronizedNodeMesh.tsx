import React from 'react';
import { useMission } from '../../hooks/useMission';
import { MissionRole } from '../../engine/missionTypes';
import { Radio, KeyRound, Binary, Check } from 'lucide-react';

export const SynchronizedNodeMesh: React.FC = () => {
  const { state, currentRole, setRole, connectedTabs } = useMission();

  const isTransmissionResolved = state.cipherDecoded || state.completedStages.transmission;
  const isKeyResolved = state.keyDiscovered || state.completedStages.key;
  const isAnomalyResolved = state.anomalyConfirmed || state.completedStages.anomaly;

  const nodes: Array<{
    id: MissionRole;
    number: string;
    label: string;
    resolved: boolean;
    active: boolean;
    color: string;
    resolvedBg: string;
    resolvedBorder: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'transmission',
      number: 'NODE_01',
      label: 'TRANSMISSION',
      resolved: isTransmissionResolved,
      active: currentRole === 'transmission',
      color: '#22D3EE',
      resolvedBg: 'bg-[#22D3EE]/10',
      resolvedBorder: 'border-[#22D3EE]/40 text-[#22D3EE]',
      icon: <Radio className="w-3.5 h-3.5" />,
    },
    {
      id: 'key',
      number: 'NODE_02',
      label: 'DECRYPTION KEY',
      resolved: isKeyResolved,
      active: currentRole === 'key',
      color: '#8B7CFF',
      resolvedBg: 'bg-[#8B7CFF]/10',
      resolvedBorder: 'border-[#8B7CFF]/40 text-[#8B7CFF]',
      icon: <KeyRound className="w-3.5 h-3.5" />,
    },
    {
      id: 'anomaly',
      number: 'NODE_03',
      label: 'DOM ANOMALY',
      resolved: isAnomalyResolved,
      active: currentRole === 'anomaly',
      color: '#FFB454',
      resolvedBg: 'bg-[#FFB454]/10',
      resolvedBorder: 'border-[#FFB454]/40 text-[#FFB454]',
      icon: <Binary className="w-3.5 h-3.5" />,
    },
  ];

  return (
    <div className="border border-noir-border bg-noir-surface/90 rounded p-4 backdrop-blur-md">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3 pb-2.5 border-b border-noir-border text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-signal-cyan animate-pulse" />
          <span className="text-signal-text font-semibold uppercase tracking-wider text-[11px]">
            SYNCHRONIZED MACHINE TOPOLOGY
          </span>
        </div>
        <div className="text-[11px] text-signal-muted flex items-center gap-2">
          <span>BROADCAST LINK:</span>
          <span className="text-signal-cyan font-bold">{connectedTabs} {connectedTabs === 1 ? 'TAB ACTIVE' : 'TABS LINKED'}</span>
        </div>
      </div>

      {/* Synchronized Circuit Nodes */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 relative">
        {nodes.map((node) => {
          return (
            <button
              key={node.id}
              onClick={() => setRole(node.id)}
              className={`p-3 rounded border text-left transition-all relative flex flex-col justify-between ${
                node.active
                  ? 'border-signal-cyan/60 bg-noir-elevated ring-1 ring-signal-cyan/30'
                  : node.resolved
                  ? `${node.resolvedBg} ${node.resolvedBorder}`
                  : 'border-noir-border bg-noir-base/60 text-signal-muted hover:border-noir-border/80 hover:text-signal-text'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span
                    className="p-1 rounded bg-noir-base border border-noir-border"
                    style={{ color: node.resolved || node.active ? node.color : '#8A99AD' }}
                  >
                    {node.icon}
                  </span>
                  <span className="text-[10px] font-mono text-signal-muted tracking-widest uppercase">
                    {node.number}
                  </span>
                </div>

                {node.resolved ? (
                  <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-signal-cyan">
                    <Check className="w-3 h-3" /> LINKED
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-signal-dim uppercase">
                    PENDING
                  </span>
                )}
              </div>

              <div className="font-display font-semibold text-xs tracking-wide text-signal-text">
                {node.label}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
