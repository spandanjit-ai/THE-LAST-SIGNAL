import { MissionState } from './missionTypes';

export const STORAGE_KEY = 'THE_LAST_SIGNAL_MISSION_STATE_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export function createInitialMissionState(missionId?: string, startedAt?: number): MissionState {
  const now = Date.now();
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    missionId: missionId || `SIG-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    revision: 1,
    startedAt: startedAt || now,
    discoveredClues: {
      transmission: false,
      key: false,
      anomaly: false,
    },
    completedStages: {
      transmission: false,
      key: false,
      anomaly: false,
    },
    currentPhase: 'SEARCHING',
    phaseSecondsRemaining: 12,
    phaseProgress: 0,
    cipherDecoded: false,
    keyDiscovered: false,
    anomalyConfirmed: false,
    unlockStatus: 'LOCKED',
    lastUpdatedAt: now,
    error: null,
  };
}

export function loadSavedMissionState(): MissionState | null {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.schemaVersion === CURRENT_SCHEMA_VERSION && parsed.missionId) {
      return parsed as MissionState;
    }
  } catch (err) {
    console.warn('[STORAGE] Failed to parse saved mission state:', err);
  }
  return null;
}

export function saveMissionState(state: MissionState): boolean {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error('[STORAGE] Failed to persist mission state:', err);
    return false;
  }
}

export function clearMissionState(): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('[STORAGE] Failed to clear mission state:', err);
  }
}
