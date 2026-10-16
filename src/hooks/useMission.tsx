import React, { createContext, useContext, useEffect, useReducer, useRef, useState, useCallback } from 'react';
import {
  MissionRole,
  MissionContextValue,
} from '../engine/missionTypes';
import { missionReducer } from '../engine/missionReducer';
import {
  createInitialMissionState,
  loadSavedMissionState,
  saveMissionState,
  clearMissionState,
} from '../engine/storage';
import { createSyncManager, SyncManager } from '../engine/sync';
import { calculateSignalPhase } from '../engine/temporalLogic';
import { verifyVaultPrerequisites, verifyAnomalyCode } from '../engine/verification';
import { isCipherCorrect } from '../engine/cipher';
import { SoundFX } from '../utils/audio';
import { initConsoleEasterEgg } from '../utils/consoleBanner';

const MissionContext = createContext<MissionContextValue | null>(null);

function getRoleFromLocation(): MissionRole | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const role = params.get('role');
  if (role === 'transmission' || role === 'key' || role === 'anomaly') {
    return role;
  }
  return null;
}

export const MissionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const tabId = useRef(`tab-${Math.random().toString(36).substring(2, 8)}`).current;
  const syncManagerRef = useRef<SyncManager | null>(null);

  const [currentRole, setCurrentRole] = useState<MissionRole | null>(() => getRoleFromLocation());
  const [connectedTabs, setConnectedTabs] = useState<number>(1);
  const [isAudioEnabled, setIsAudioEnabled] = useState<boolean>(false);

  const [state, dispatch] = useReducer(missionReducer, null, () => {
    const saved = loadSavedMissionState();
    return saved || createInitialMissionState();
  });

  // Keep a ref of state for async callbacks and sync broadcasting
  const stateRef = useRef(state);
  stateRef.current = state;

  // Persist and broadcast state changes
  useEffect(() => {
    saveMissionState(state);
    if (syncManagerRef.current) {
      syncManagerRef.current.broadcastState(state);
    }
  }, [state]);

  // Audio mute sync
  useEffect(() => {
    SoundFX.setMuted(!isAudioEnabled);
  }, [isAudioEnabled]);

  const toggleAudio = useCallback(() => {
    setIsAudioEnabled((prev) => {
      const next = !prev;
      SoundFX.setMuted(!next);
      if (next) {
        SoundFX.playTick();
      }
      return next;
    });
  }, []);

  // Sync manager lifecycle
  useEffect(() => {
    const manager = createSyncManager(
      tabId,
      (incomingState) => {
        dispatch({ type: 'SYNC_STATE', state: incomingState });
      },
      (newMissionId, startedAt) => {
        clearMissionState();
        dispatch({ type: 'RESET_MISSION', newMissionId, startedAt });
      },
      (count) => {
        setConnectedTabs(count);
      }
    );

    syncManagerRef.current = manager;

    return () => {
      manager.destroy();
      syncManagerRef.current = null;
    };
  }, [tabId]);

  // Listen to popstate / url changes for ?role
  useEffect(() => {
    const handleLocationChange = () => {
      const role = getRoleFromLocation();
      setCurrentRole(role);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Authoritative temporal clock update
  useEffect(() => {
    const interval = setInterval(() => {
      const phaseInfo = calculateSignalPhase(stateRef.current.startedAt);
      dispatch({
        type: 'UPDATE_TEMPORAL_PHASE',
        phase: phaseInfo.phase,
        secondsRemaining: phaseInfo.secondsRemaining,
        progress: phaseInfo.progress,
      });
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Initialize DevTools Console Easter Egg & Judge Hotkey
  useEffect(() => {
    initConsoleEasterEgg(stateRef.current.missionId);

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Shift+D or Cmd+Shift+D triggers Judge Demo Mode
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'D' || e.key === 'd')) {
        e.preventDefault();
        SoundFX.playSuccessPing();
        dispatch({ type: 'JUDGE_SOLVE_ALL' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const setRole = useCallback((role: MissionRole | null) => {
    setCurrentRole(role);
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (role) {
        url.searchParams.set('role', role);
      } else {
        url.searchParams.delete('role');
      }
      window.history.pushState({}, '', url.toString());
    }
  }, []);

  const startMission = useCallback(() => {
    SoundFX.playSuccessPing();
    dispatch({ type: 'START_MISSION' });
  }, []);

  const discoverKey = useCallback(() => {
    SoundFX.playSuccessPing();
    dispatch({ type: 'DISCOVER_KEY' });
  }, []);

  const confirmAnomaly = useCallback((code: string) => {
    const isValid = verifyAnomalyCode(code);
    if (isValid) {
      SoundFX.playSuccessPing();
      dispatch({ type: 'CONFIRM_ANOMALY', code });
      return { success: true, message: 'CARRIER_MATCH: Anomaly signature verified and locked.' };
    } else {
      SoundFX.playWarning();
      dispatch({ type: 'CONFIRM_ANOMALY', code });
      return { success: false, message: 'VERIFICATION_FAILED: Anomaly code mismatch.' };
    }
  }, []);

  const decodeCipher = useCallback((plaintext: string) => {
    const isCorrect = isCipherCorrect(plaintext);
    if (isCorrect) {
      SoundFX.playSuccessPing();
      dispatch({ type: 'DECODE_CIPHER', plaintext });
      return true;
    } else {
      SoundFX.playWarning();
      dispatch({ type: 'DECODE_CIPHER', plaintext });
      return false;
    }
  }, []);

  const submitFinalVault = useCallback(async (answer: string) => {
    const currentState = stateRef.current;
    
    // Check prerequisites & temporal phase
    const check = await verifyVaultPrerequisites(currentState, answer);
    if (!check.valid) {
      SoundFX.playWarning();
      dispatch({
        type: 'FAIL_VERIFICATION',
        error: check.reason || 'Verification criteria not satisfied.',
      });
      return { success: false, message: check.reason || 'Verification rejected.' };
    }

    // Begin verification animation
    dispatch({ type: 'START_VERIFICATION' });
    SoundFX.playVaultUnlock();

    // 1200ms cinematic verification sequence before unlock
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        dispatch({ type: 'UNLOCK_VAULT' });
        resolve({ success: true, message: 'VAULT_OPEN: Classified transmission decrypted.' });
      }, 1400);
    });
  }, []);

  const retrySequence = useCallback(() => {
    SoundFX.playTick();
    dispatch({ type: 'RETRY_SEQUENCE' });
  }, []);

  const resetMission = useCallback(() => {
    SoundFX.playTick();
    const newMissionId = `SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const startedAt = Date.now();
    clearMissionState();
    dispatch({ type: 'RESET_MISSION', newMissionId, startedAt });
    if (syncManagerRef.current) {
      syncManagerRef.current.broadcastReset(newMissionId, startedAt);
    }
  }, []);

  const triggerJudgeSolve = useCallback(() => {
    SoundFX.playSuccessPing();
    dispatch({ type: 'JUDGE_SOLVE_ALL' });
  }, []);

  const contextValue: MissionContextValue = {
    state,
    currentRole,
    connectedTabs,
    isAudioEnabled,
    toggleAudio,
    setRole,
    startMission,
    discoverKey,
    confirmAnomaly,
    decodeCipher,
    submitFinalVault,
    retrySequence,
    resetMission,
    triggerJudgeSolve,
  };

  return <MissionContext.Provider value={contextValue}>{children}</MissionContext.Provider>;
};

export function useMission(): MissionContextValue {
  const context = useContext(MissionContext);
  if (!context) {
    throw new Error('useMission must be used within a MissionProvider');
  }
  return context;
}
