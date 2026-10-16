import { MissionState, ChallengeState } from './missionTypes';

export const STORAGE_KEY = 'THE_LAST_SIGNAL_MISSION_STATE_v1';
export const CURRENT_SCHEMA_VERSION = 1;

export function createDefaultChallenges(): ChallengeState {
  return {
    phaseTitle: 'PHASE 01 OVERRIDE',
    revealedCount: 1,
    totalCount: 3,
    track: 'TRACK OMEGA // MYSTERY BOX',
    items: {
      C1: {
        id: 'C1',
        title: 'Plot Twist',
        subtitle: 'DOM MUTATION PROTOCOL BREACH',
        track: 'TRACK OMEGA // MYSTERY BOX',
        status: 'ACTIVE',
        revealed: true,
        description:
          'Carrier containment protocol is locked inside the DOM tree. Use browser DevTools inspection to mutate the designated security attribute to override containment.',
        targetSelector: '#containment-anomaly-node',
        targetAttribute: 'data-containment-protocol',
        requiredValue: 'OVERRIDE',
      },
      C2: {
        id: 'C2',
        title: 'Make It Come Alive',
        subtitle: 'AWAITING HACKATHON BROADCAST',
        track: 'TRACK OMEGA // MYSTERY BOX',
        status: 'LOCKED',
        revealed: false,
        description:
          'Challenge specifications currently encrypted by hackathon organizers. Stand by for Phase 02 activation.',
      },
      C3: {
        id: 'C3',
        title: 'Chaos Card',
        subtitle: 'AWAITING HACKATHON BROADCAST',
        track: 'TRACK OMEGA // MYSTERY BOX',
        status: 'LOCKED',
        revealed: false,
        description:
          'Wildcard challenge tier currently locked. Awaiting system trigger signal.',
      },
    },
  };
}

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
    challenges: createDefaultChallenges(),
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
      // Ensure backwards-compatibility for challenge state
      if (!parsed.challenges || !parsed.challenges.items || !parsed.challenges.items.C1) {
        parsed.challenges = createDefaultChallenges();
      }
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
