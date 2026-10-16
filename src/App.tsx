import { useState, useEffect } from 'react';
import { useMission } from './hooks/useMission';
import { parseRoleQuery } from './engine/storage';
import { MissionRole } from './engine/missionTypes';
import { Header } from './components/Header';
import { PhaseIndicator } from './components/PhaseIndicator';
import { ClueTracker } from './components/ClueTracker';
import { TransmissionRoleView } from './components/TransmissionRoleView';
import { KeyRoleView } from './components/KeyRoleView';
import { AnomalyRoleView } from './components/AnomalyRoleView';
import { VaultModal } from './components/VaultModal';
import { LandingScreen } from './components/LandingScreen';

export function App() {
  const [currentRole, setCurrentRole] = useState<MissionRole | null>(() => {
    if (typeof window === 'undefined') return 'transmission';
    const params = new URLSearchParams(window.location.search);
    if (!params.has('role')) return null; // Show landing screen if no ?role= is specified
    return parseRoleQuery(window.location.search);
  });

  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);

  // Synchronize role with browser URL history
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      if (!params.has('role')) {
        setCurrentRole(null);
      } else {
        setCurrentRole(parseRoleQuery(window.location.search));
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToRole = (role: MissionRole) => {
    setCurrentRole(role);
    const params = new URLSearchParams(window.location.search);
    params.set('role', role);
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  // Initialize the mission engine hook
  const mission = useMission(currentRole || 'transmission');
  const { state, phaseInfo, tabId, resetMission } = mission;

  // Automatically pop open vault modal upon successful unlock
  useEffect(() => {
    if (state.unlockStatus === 'UNLOCKED') {
      setIsVaultModalOpen(true);
    }
  }, [state.unlockStatus]);

  // If user is at root with no role, render the cinematic landing screen
  if (!currentRole) {
    return (
      <div className="relative min-h-screen bg-space-950 text-slate-100 flex flex-col justify-center">
        <div className="fixed inset-0 crt-overlay pointer-events-none z-30" />
        <LandingScreen onStartMission={(role) => navigateToRole(role)} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-space-950 text-slate-100 flex flex-col pb-12">
      {/* CRT Scanline & Grain Overlay */}
      <div className="fixed inset-0 crt-overlay pointer-events-none z-30" />

      {/* Main Header */}
      <Header
        role={currentRole}
        state={state}
        tabId={tabId}
        onReset={resetMission}
        onNavigateRole={navigateToRole}
      />

      {/* Main Mission Content Container */}
      <main className="max-w-5xl mx-auto w-full px-4 pt-6 space-y-6 flex-1">
        {/* Real-time Signal Phase Monitor */}
        <PhaseIndicator phaseInfo={phaseInfo} />

        {/* Cross-Tab Clue Synchronization Matrix */}
        <ClueTracker state={state} />

        {/* Role-Specific Interactive View */}
        {currentRole === 'transmission' && (
          <TransmissionRoleView mission={mission} />
        )}
        {currentRole === 'key' && (
          <KeyRoleView mission={mission} />
        )}
        {currentRole === 'anomaly' && (
          <AnomalyRoleView mission={mission} />
        )}
      </main>

      {/* Vault Reveal Modal */}
      <VaultModal
        state={state}
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onReset={() => {
          setIsVaultModalOpen(false);
          resetMission();
        }}
      />
    </div>
  );
}

export default App;
