import { MissionState, MissionRole } from './missionTypes';

export const STORAGE_KEY_PREFIX = 'the_last_signal_state_';
export const CURRENT_MISSION_KEY = 'the_last_signal_active_mission_id';
export const SCHEMA_VERSION = 1;

export function getInitialMissionState(missionId?: string): MissionState {
  const id = missionId || `MISSION-${Date.now().toString(36).toUpperCase()}`;
  const now = Date.now();
  return {
    schemaVersion: SCHEMA_VERSION,
    missionId: id,
    revision: 1,
    startedAt: now,
    discoveredClues: {
      clue_cipher_text: false,
      clue_key_shift: false,
      clue_anomaly_metadata: false,
      clue_decoded_message: false,
    },
    completedStages: [],
    currentPhase: 'SEARCHING',
    phaseStartedAt: now,
    unlockStatus: 'LOCKED',
    decodedMessage: null,
    shiftUsed: null,
    anomalyConfirmed: false,
    anomalyToken: null,
    finalAnswer: null,
    unlockedAt: null,
    lastUpdatedAt: now,
    lastAction: 'INITIALIZED',
    lastError: null,
  };
}

/**
 * Loads mission state safely from localStorage with validation
 */
export function loadSavedMissionState(): MissionState | null {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return null;
    }
    const activeId = localStorage.getItem(CURRENT_MISSION_KEY);
    if (!activeId) return null;

    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${activeId}`);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as MissionState;
    if (!parsed || parsed.schemaVersion !== SCHEMA_VERSION || !parsed.missionId) {
      return null;
    }
    return parsed;
  } catch (e) {
    console.warn('[Storage] Error loading mission state:', e);
    return null;
  }
}

/**
 * Saves mission state safely to localStorage
 */
export function saveMissionState(state: MissionState): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    localStorage.setItem(CURRENT_MISSION_KEY, state.missionId);
    localStorage.setItem(`${STORAGE_KEY_PREFIX}${state.missionId}`, JSON.stringify(state));
    return true;
  } catch (e) {
    console.warn('[Storage] Error saving mission state:', e);
    return false;
  }
}

/**
 * Clears saved mission state from localStorage
 */
export function clearMissionState(missionId?: string): void {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    if (missionId) {
      localStorage.removeItem(`${STORAGE_KEY_PREFIX}${missionId}`);
    }
    localStorage.removeItem(CURRENT_MISSION_KEY);
  } catch (e) {
    console.warn('[Storage] Error clearing mission state:', e);
  }
}

/**
 * Normalizes and validates role query parameter
 */
export function parseRoleQuery(search: string): MissionRole {
  try {
    const params = new URLSearchParams(search);
    const roleParam = params.get('role')?.toLowerCase();
    if (roleParam === 'transmission' || roleParam === 'key' || roleParam === 'anomaly') {
      return roleParam;
    }
  } catch {
    // fallback
  }
  return 'transmission';
}
