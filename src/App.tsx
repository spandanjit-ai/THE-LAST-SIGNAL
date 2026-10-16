import React, { useState } from 'react';
import { MissionProvider, useMission } from './hooks/useMission';
import { BackgroundFX } from './components/common/BackgroundFX';
import { HeaderNav } from './components/common/HeaderNav';
import { ClueProgress } from './components/common/ClueProgress';
import { LandingScreen } from './components/landing/LandingScreen';
import { TransmissionRole } from './components/roles/TransmissionRole';
import { KeyRole } from './components/roles/KeyRole';
import { AnomalyRole } from './components/roles/AnomalyRole';
import { VaultReveal } from './components/vault/VaultReveal';
import { MissionRole } from './engine/missionTypes';

const MissionApp: React.FC = () => {
  const { currentRole, setRole } = useMission();
  const [showVaultModal, setShowVaultModal] = useState<boolean>(false);

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

      {/* Top Navigation */}
      <HeaderNav onOpenVaultModal={() => setShowVaultModal(true)} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Clue Progress and Temporal Status */}
        <ClueProgress />

        {/* Role-Specific View */}
        <section aria-label="Role Mission Content">
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

      {/* Footer Status Bar */}
      <footer className="relative z-10 border-t border-slate-800/80 bg-space-950/80 px-4 py-3 text-center text-xs font-mono text-slate-500">
        THE LAST SIGNAL // CLASSIFIED TRANSMISSION NETWORK // BROADCAST PROTOCOL v1.0
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
