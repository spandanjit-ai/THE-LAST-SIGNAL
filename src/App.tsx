import React, { useState, useEffect } from 'react';
import { MissionProvider, useMission } from './hooks/useMission';
import { BackgroundFX } from './components/common/BackgroundFX';
import { HeaderNav } from './components/common/HeaderNav';
import { PhaseIndicator } from './components/common/PhaseIndicator';
import { ClueTracker } from './components/common/ClueTracker';
import { ChallengeBoard } from './components/challenges/ChallengeBoard';
import { LandingScreen } from './components/landing/LandingScreen';
import { TransmissionRole } from './components/roles/TransmissionRole';
import { KeyRole } from './components/roles/KeyRole';
import { AnomalyRole } from './components/roles/AnomalyRole';
import { VaultReveal } from './components/vault/VaultReveal';
import { EntropyGlitchOverlay } from './components/challenges/EntropyGlitchOverlay';
import { MissionRole } from './engine/missionTypes';

const MissionApp: React.FC = () => {
  const { currentRole, setRole, triggerJudgeSolve } = useMission();
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);

  // Global hotkeys (Esc to close, Ctrl/Cmd + Shift + D to open Judge Demo Vault)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVaultModal(false);
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        triggerJudgeSolve();
        setShowVaultModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerJudgeSolve]);

  // If no role parameter is set in URL, display the Landing Screen
  if (!currentRole) {
    return (
      <main className="relative min-h-screen text-slate-100 flex flex-col justify-between bg-space-950">
        <BackgroundFX />
        <LandingScreen
          onStartMission={(role: MissionRole = 'transmission') => {
            setRole(role);
          }}
          onDemoSolve={() => {
            triggerJudgeSolve();
            setShowVaultModal(true);
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
    <div className="relative min-h-screen flex flex-col text-slate-100 bg-space-950">
      <BackgroundFX />

      {/* Challenge C3: Real 90-Second Entropy Cascade HUD & Glitch Shader */}
      <EntropyGlitchOverlay />

      {/* Top Tactical Navigation */}
      <HeaderNav onOpenVaultModal={() => setShowVaultModal(true)} />

      {/* Main Focus Area */}
      <main className="relative z-10 flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Real-time Temporal Phase Monitor */}
        <PhaseIndicator />

        {/* Cross-Tab Clue Synchronization Matrix */}
        <ClueTracker />

        {/* Hackathon Evaluation: Surprise Challenge System (Track Omega) */}
        <ChallengeBoard defaultExpanded={false} />

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
      </main>

      {/* Vault Reveal Modal */}
      {showVaultModal && (
        <VaultReveal onClose={() => setShowVaultModal(false)} />
      )}

      {/* Tactical Footer with Judge Demo Trigger */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-space-950/90 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="text-slate-300 font-bold">
          THE LAST SIGNAL <span className="text-cyan">// CLASSIFIED TRANSMISSION RELAY</span> <span className="text-slate-600">//</span> BROADCAST ACTIVE
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              triggerJudgeSolve();
              setShowVaultModal(true);
            }}
            className="text-xs text-cyan hover:text-white border border-cyan/50 hover:border-cyan bg-cyan/10 hover:bg-cyan/20 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 font-black text-glow-cyan shadow-sm shadow-cyan/20"
            title="Fast solve for hackathon judges: Populates all clues & STABLE phase (Shortcut: Ctrl+Shift+D)"
          >
            <span>⚡</span>
            <span>JUDGE DEMO MODE</span>
          </button>
          <span className="hidden sm:inline text-slate-600">//</span>
          <span className="text-xs text-slate-400 hidden sm:inline font-bold">ESC TO CLOSE</span>
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
