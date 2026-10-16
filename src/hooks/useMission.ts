import { useState, useEffect, useReducer, useRef, useCallback } from 'react';
import { 
  MissionState, 
  MissionRole, 
  ClueId, 
  StageId 
} from '../engine/missionTypes';
import { missionReducer } from '../engine/missionReducer';
import { 
  loadSavedMissionState, 
  saveMissionState, 
  clearMissionState, 
  getInitialMissionState 
} from '../engine/storage';
import { calculateSignalPhase, PhaseTimingInfo } from '../engine/temporalLogic';
import { MissionSyncManager } from '../engine/sync';

export interface UseMissionReturn {
  // State
  state: MissionState;
  role: MissionRole;
  phaseInfo: PhaseTimingInfo;
  tabId: string;
  isVerifying: boolean;
  
  // Actions
  startMission: () => void;
  discoverClue: (clueId: ClueId) => void;
  completeStage: (stageId: StageId) => void;
  decodeCipher: (decodedText: string, shiftUsed: number) => void;
  confirmAnomalyClue: (token: string) => boolean;
  submitFinalAnswer: (answer: string) => Promise<boolean>;
  retryTimedSequence: () => void;
  resetMission: () => void;
}

export function useMission(role: MissionRole): UseMissionReturn {
  // 1. Initialize mission state from localStorage or fresh template
  const [state, dispatch] = useReducer(missionReducer, null, () => {
    const saved = loadSavedMissionState();
    return saved || getInitialMissionState();
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const stateRef = useRef<MissionState>(state);
  stateRef.current = state;

  // 2. Synchronize phase timing in real-time
  const [phaseInfo, setPhaseInfo] = useState<PhaseTimingInfo>(() =>
    calculateSignalPhase(Date.now(), state.startedAt)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      const timing = calculateSignalPhase(Date.now(), stateRef.current.startedAt);
      setPhaseInfo(timing);
    }, 200);

    return () => clearInterval(timer);
  }, []);

  // 3. Persist local state changes
  useEffect(() => {
    saveMissionState(state);
  }, [state]);

  // 4. Initialize cross-tab sync manager
  const syncManagerRef = useRef<MissionSyncManager | null>(null);

  const handleRemoteState = useCallback((remoteState: MissionState) => {
    dispatch({ type: 'SYNC_STATE', state: remoteState });
  }, []);

  const handleRemoteReset = useCallback((newMissionId: string) => {
    clearMissionState();
    dispatch({ type: 'RESET_MISSION', newMissionId });
  }, []);

  useEffect(() => {
    const manager = new MissionSyncManager(
      role,
      handleRemoteState,
      handleRemoteReset,
      () => stateRef.current
    );
    syncManagerRef.current = manager;

    return () => {
      manager.destroy();
      syncManagerRef.current = null;
    };
  }, [role, handleRemoteState, handleRemoteReset]);

  // Broadcast state changes whenever revision updates
  const prevRevisionRef = useRef(state.revision);
  useEffect(() => {
    if (state.revision !== prevRevisionRef.current) {
      prevRevisionRef.current = state.revision;
      syncManagerRef.current?.broadcastState(state);
    }
  }, [state]);

  // 5. Action Handlers
  const startMission = useCallback(() => {
    dispatch({ type: 'START_MISSION' });
  }, []);

  const discoverClue = useCallback((clueId: ClueId) => {
    dispatch({ type: 'DISCOVER_CLUE', clueId });
  }, []);

  const completeStage = useCallback((stageId: StageId) => {
    dispatch({ type: 'COMPLETE_STAGE', stageId });
  }, []);

  const decodeCipher = useCallback((decodedText: string, shiftUsed: number) => {
    dispatch({ type: 'DECODE_CIPHER', decodedText, shiftUsed });
  }, []);

  const confirmAnomalyClue = useCallback((token: string) => {
    dispatch({ type: 'CONFIRM_ANOMALY_CLUE', token });
    return stateRef.current.anomalyConfirmed;
  }, []);

  const submitFinalAnswer = useCallback(async (answer: string) => {
    setIsVerifying(true);
    // Add small cinematic delay for verification tension
    await new Promise((resolve) => setTimeout(resolve, 800));

    const currentPhase = calculateSignalPhase(Date.now(), stateRef.current.startedAt).phase;
    dispatch({ 
      type: 'SUBMIT_FINAL_ANSWER', 
      answer, 
      currentPhaseAtSubmit: currentPhase 
    });

    setIsVerifying(false);
    return stateRef.current.unlockStatus === 'UNLOCKED';
  }, []);

  const retryTimedSequence = useCallback(() => {
    dispatch({ type: 'RETRY_TIMED_SEQUENCE' });
  }, []);

  const resetMission = useCallback(() => {
    const freshId = `MISSION-${Date.now().toString(36).toUpperCase()}`;
    clearMissionState(state.missionId);
    dispatch({ type: 'RESET_MISSION', newMissionId: freshId });
    syncManagerRef.current?.broadcastReset(freshId);
  }, [state.missionId]);

  return {
    state,
    role,
    phaseInfo,
    tabId: syncManagerRef.current?.getTabId() || 'tab_local',
    isVerifying,
    startMission,
    discoverClue,
    completeStage,
    decodeCipher,
    confirmAnomalyClue,
    submitFinalAnswer,
    retryTimedSequence,
    resetMission,
  };
}
