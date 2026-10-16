import { MissionState, MissionAction } from './missionTypes';
import { createInitialMissionState } from './storage';
import { verifyAnomalyCode } from './verification';
import { isCipherCorrect } from './cipher';

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  const now = Date.now();

  switch (action.type) {
    case 'START_MISSION': {
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        discoveredClues: {
          ...state.discoveredClues,
          transmission: true,
        },
      };
    }

    case 'DISCOVER_KEY': {
      if (state.keyDiscovered) return state; // Idempotent
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        keyDiscovered: true,
        discoveredClues: {
          ...state.discoveredClues,
          key: true,
        },
        completedStages: {
          ...state.completedStages,
          key: true,
        },
        error: null,
      };
    }

    case 'CONFIRM_ANOMALY': {
      if (state.anomalyConfirmed) return state; // Idempotent
      const isValid = verifyAnomalyCode(action.code);
      if (!isValid) {
        return {
          ...state,
          error: 'INVALID_ANOMALY_CODE: Code does not match the inspected DOM metadata node.',
        };
      }
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        anomalyConfirmed: true,
        discoveredClues: {
          ...state.discoveredClues,
          anomaly: true,
        },
        completedStages: {
          ...state.completedStages,
          anomaly: true,
        },
        error: null,
      };
    }

    case 'DECODE_CIPHER': {
      const isCorrect = isCipherCorrect(action.plaintext);
      if (!isCorrect) {
        return {
          ...state,
          error: 'INCORRECT_DECODING: Cipher output mismatch. Re-verify the Caesar shift.',
        };
      }
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        cipherDecoded: true,
        completedStages: {
          ...state.completedStages,
          transmission: true,
        },
        error: null,
      };
    }

    case 'START_VERIFICATION': {
      return {
        ...state,
        unlockStatus: 'VERIFYING',
        error: null,
      };
    }

    case 'UNLOCK_VAULT': {
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        unlockStatus: 'UNLOCKED',
        unlockedAt: now,
        error: null,
      };
    }

    case 'FAIL_VERIFICATION': {
      return {
        ...state,
        unlockStatus: 'LOCKED',
        error: action.error,
      };
    }

    case 'RETRY_SEQUENCE': {
      return {
        ...state,
        unlockStatus: 'LOCKED',
        error: null,
      };
    }

    case 'RESET_MISSION': {
      return createInitialMissionState(action.newMissionId, action.startedAt || now);
    }

    case 'JUDGE_SOLVE_ALL': {
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        keyDiscovered: true,
        anomalyConfirmed: true,
        cipherDecoded: true,
        discoveredClues: {
          transmission: true,
          key: true,
          anomaly: true,
        },
        completedStages: {
          transmission: true,
          key: true,
          anomaly: true,
        },
        currentPhase: 'STABLE',
        phaseSecondsRemaining: 10,
        phaseProgress: 100,
        error: null,
      };
    }

    case 'UPDATE_TEMPORAL_PHASE': {
      if (
        state.currentPhase === action.phase &&
        state.phaseSecondsRemaining === action.secondsRemaining &&
        state.phaseProgress === action.progress
      ) {
        return state;
      }
      return {
        ...state,
        currentPhase: action.phase,
        phaseSecondsRemaining: action.secondsRemaining,
        phaseProgress: action.progress,
      };
    }

    case 'SYNC_STATE': {
      const incoming = action.state;
      // If mission ID differs (e.g. remote reset), adopt incoming
      if (incoming.missionId !== state.missionId) {
        return incoming;
      }
      // If revision is older and we already have more clues, preserve local union
      if (incoming.revision < state.revision) {
        return state;
      }
      // Deterministic union of completed state
      return {
        ...incoming,
        revision: Math.max(state.revision, incoming.revision),
        keyDiscovered: state.keyDiscovered || incoming.keyDiscovered,
        anomalyConfirmed: state.anomalyConfirmed || incoming.anomalyConfirmed,
        cipherDecoded: state.cipherDecoded || incoming.cipherDecoded,
        discoveredClues: {
          transmission: state.discoveredClues.transmission || incoming.discoveredClues.transmission,
          key: state.discoveredClues.key || incoming.discoveredClues.key,
          anomaly: state.discoveredClues.anomaly || incoming.discoveredClues.anomaly,
        },
        completedStages: {
          transmission: state.completedStages.transmission || incoming.completedStages.transmission,
          key: state.completedStages.key || incoming.completedStages.key,
          anomaly: state.completedStages.anomaly || incoming.completedStages.anomaly,
        },
        unlockStatus:
          state.unlockStatus === 'UNLOCKED' || incoming.unlockStatus === 'UNLOCKED'
            ? 'UNLOCKED'
            : incoming.unlockStatus,
        unlockedAt: state.unlockedAt || incoming.unlockedAt,
      };
    }

    default:
      return state;
  }
}
