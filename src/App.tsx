import React, { useState, useEffect } from 'react';
import { MissionProvider, useMission } from './hooks/useMission';
import { BackgroundFX } from './components/common/BackgroundFX';
import { HeaderNav } from './components/common/HeaderNav';
import { SignalHero } from './components/common/SignalHero';
import { SynchronizedNodeMesh } from './components/common/SynchronizedNodeMesh';
import { EvidenceDossier } from './components/common/EvidenceDossier';
import { LandingScreen } from './components/landing/LandingScreen';
import { TransmissionRole } from './components/roles/TransmissionRole';
import { KeyRole } from './components/roles/KeyRole';
import { AnomalyRole } from './components/roles/AnomalyRole';
import { VaultReveal } from './components/vault/VaultReveal';
import { MissionRole } from './engine/missionTypes';

const MissionApp: React.FC = () => {
  const { currentRole, setRole, triggerJudgeSolve } = useMission();
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);

  // Esc key listener to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVaultModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If no role parameter is set in URL, display the Landing Screen
  if (!currentRole) {
    return (
      <main className="relative min-h-screen text-slate-100 flex flex-col justify-between">
        <BackgroundFX />
        <LandingScreen
          onStartMission={(role: MissionRole = 'transmission') => {
            setRole(role);
          }}
        />
        {showVaultModal && (
          <VaultReveal onClose={() => setShowVaultModal(false)} />
        )}
      </main>
    );
  }

  // Active Mission View
  return (
    <div className="relative min-h-screen flex flex-col text-slate-100">
      <BackgroundFX />

      {/* Top Tactical Navigation */}
      <HeaderNav onOpenVaultModal={() => setShowVaultModal(true)} />

      {/* Main Focus Area */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* The Signal Hero: Real-time carrier oscilloscope responding to temporal phase */}
        <SignalHero compact={true} />

        {/* Interconnected Machine Topology Nodes */}
        <SynchronizedNodeMesh />

        {/* Primary Puzzle Workspace */}
        <section aria-label="Active Mission Terminal">
          {currentRole === 'transmission' && (
            <TransmissionRole onOpenVault={() => setShowVaultModal(true)} />
          )}

          {currentRole === 'key' && (
            <KeyRole onNavigateToRole={(r) => setRole(r)} />
          )}

          {currentRole === 'anomaly' && (
            <AnomalyRole />
          )}
        </section>

        {/* Evidence Dossier & Vault Gate Readiness */}
        <EvidenceDossier onOpenVault={() => setShowVaultModal(true)} />
      </main>

      {/* Vault Reveal Modal */}
      {showVaultModal && (
        <VaultReveal onClose={() => setShowVaultModal(false)} />
      )}

      {/* Tactical Footer with Judge Demo Trigger */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-space-950/80 px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-500">
        <div>THE LAST SIGNAL // CLASSIFIED TRANSMISSION SYSTEM // BROADCAST CHANNEL ACTIVE</div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerJudgeSolve();
              setShowVaultModal(true);
            }}
            className="text-[11px] text-slate-400 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 bg-space-900 px-2.5 py-1 rounded transition-colors flex items-center gap-1.5"
            title="Fast solve for hackathon judges: Populates all clues & STABLE phase (Shortcut: Ctrl+Shift+D)"
          >
            <span>⚡</span>
            <span>JUDGE DEMO MODE</span>
          </button>
          <span className="hidden sm:inline text-slate-600">//</span>
          <span className="text-[11px] text-slate-600 hidden sm:inline">ESC TO CLOSE</span>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <MissionProvider>
      <MissionApp />
    </MissionProvider>
  );
};

export default App;
