import { MissionState, MissionAction, StageId } from './missionTypes';
import { getInitialMissionState } from './storage';
import { isTargetMessage } from './cipher';
import { verifyAnomalyToken } from './verification';

/**
 * Idempotently adds a stage to the completed stages list
 */
function addStage(stages: StageId[], stageToAdd: StageId): StageId[] {
  if (stages.includes(stageToAdd)) return stages;
  return [...stages, stageToAdd];
}

/**
 * Deterministic mission reducer
 */
export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  const now = Date.now();

  switch (action.type) {
    case 'START_MISSION': {
      if (state.unlockStatus === 'UNLOCKED') return state;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        lastAction: 'START_MISSION',
        lastError: null,
      };
    }

    case 'DISCOVER_CLUE': {
      const clueId = action.clueId;
      if (state.discoveredClues[clueId]) {
        // Idempotent: already discovered
        return state;
      }

      let updatedStages = state.completedStages;
      if (clueId === 'clue_cipher_text') {
        updatedStages = addStage(updatedStages, 'stage_1_transmission');
      } else if (clueId === 'clue_key_shift') {
        updatedStages = addStage(updatedStages, 'stage_2_key');
      }

      return {
        ...state,
        revision: state.revision + 1,
        discoveredClues: {
          ...state.discoveredClues,
          [clueId]: true,
        },
        completedStages: updatedStages,
        lastUpdatedAt: now,
        lastAction: `DISCOVER_CLUE:${clueId}`,
        lastError: null,
      };
    }

    case 'COMPLETE_STAGE': {
      if (state.completedStages.includes(action.stageId)) {
        return state;
      }
      return {
        ...state,
        revision: state.revision + 1,
        completedStages: addStage(state.completedStages, action.stageId),
        lastUpdatedAt: now,
        lastAction: `COMPLETE_STAGE:${action.stageId}`,
      };
    }

    case 'DECODE_CIPHER': {
      const isMatch = isTargetMessage(action.decodedText);
      const isShift2or3 = action.shiftUsed === 2 || action.shiftUsed === 3;

      if (!isMatch && !isShift2or3) {
        return {
          ...state,
          lastError: 'Decoded text does not resolve the encrypted signal.',
        };
      }

      let updatedStages = addStage(state.completedStages, 'stage_1_transmission');
      updatedStages = addStage(updatedStages, 'stage_2_key');

      return {
        ...state,
        revision: state.revision + 1,
        decodedMessage: action.decodedText.trim().toUpperCase(),
        shiftUsed: action.shiftUsed,
        discoveredClues: {
          ...state.discoveredClues,
          clue_cipher_text: true,
          clue_key_shift: true,
          clue_decoded_message: true,
        },
        completedStages: updatedStages,
        lastUpdatedAt: now,
        lastAction: 'DECODE_CIPHER',
        lastError: null,
      };
    }

    case 'CONFIRM_ANOMALY_CLUE': {
      const isValid = verifyAnomalyToken(action.token);
      if (!isValid) {
        return {
          ...state,
          lastError: 'Anomaly signature rejected: Check DOM element attribute in DevTools.',
        };
      }

      const updatedStages = addStage(state.completedStages, 'stage_3_anomaly');

      return {
        ...state,
        revision: state.revision + 1,
        anomalyConfirmed: true,
        anomalyToken: action.token.trim().toUpperCase(),
        discoveredClues: {
          ...state.discoveredClues,
          clue_anomaly_metadata: true,
        },
        completedStages: updatedStages,
        lastUpdatedAt: now,
        lastAction: 'CONFIRM_ANOMALY_CLUE',
        lastError: null,
      };
    }

    case 'SUBMIT_FINAL_ANSWER': {
      // 1. Verify Prerequisites
      if (!state.discoveredClues.clue_cipher_text || !state.discoveredClues.clue_key_shift) {
        return {
          ...state,
          unlockStatus: 'FAILED',
          lastError: 'Prerequisite missing: Decrypted transmission message not confirmed.',
          lastUpdatedAt: now,
        };
      }
      if (!state.anomalyConfirmed) {
        return {
          ...state,
          unlockStatus: 'FAILED',
          lastError: 'Prerequisite missing: Anomaly DOM clue has not been verified.',
          lastUpdatedAt: now,
        };
      }

      // 2. Verify Temporal condition
      if (action.currentPhaseAtSubmit !== 'STABLE') {
        return {
          ...state,
          unlockStatus: 'FAILED',
          lastError: `Temporal alignment failure: Signal phase was ${action.currentPhaseAtSubmit}. Transmission must align in STABLE resonance window.`,
          lastUpdatedAt: now,
        };
      }

      // 3. Verify Final Answer
      if (!isTargetMessage(action.answer)) {
        return {
          ...state,
          unlockStatus: 'FAILED',
          lastError: 'Cipher verification failed: Submission code incorrect.',
          lastUpdatedAt: now,
        };
      }

      // Success: Unlock Vault
      let updatedStages = addStage(state.completedStages, 'stage_4_temporal');
      updatedStages = addStage(updatedStages, 'stage_5_vault');

      return {
        ...state,
        revision: state.revision + 1,
        unlockStatus: 'UNLOCKED',
        finalAnswer: action.answer.trim().toUpperCase(),
        unlockedAt: now,
        completedStages: updatedStages,
        lastUpdatedAt: now,
        lastAction: 'VAULT_UNLOCKED',
        lastError: null,
      };
    }

    case 'RETRY_TIMED_SEQUENCE': {
      if (state.unlockStatus === 'UNLOCKED') return state;
      return {
        ...state,
        revision: state.revision + 1,
        unlockStatus: 'LOCKED',
        lastError: null,
        lastUpdatedAt: now,
        lastAction: 'RETRY_TIMED_SEQUENCE',
      };
    }

    case 'RESET_MISSION': {
      const fresh = getInitialMissionState(action.newMissionId);
      return {
        ...fresh,
        lastAction: 'RESET_MISSION',
      };
    }

    case 'SYNC_STATE': {
      const remote = action.state;
      // Reject if different mission unless remote started later
      if (remote.missionId !== state.missionId) {
        if (remote.startedAt > state.startedAt) {
          return remote;
        }
        return state;
      }

      // If remote revision is strictly newer, adopt it
      if (remote.revision > state.revision) {
        return remote;
      }

      // If revisions match, deterministically merge discovered clues & stages
      if (remote.revision === state.revision) {
        const mergedClues = {
          ...state.discoveredClues,
          ...remote.discoveredClues,
        };
        const stageSet = new Set<StageId>([...state.completedStages, ...remote.completedStages]);
        const mergedStages = Array.from(stageSet);
        const isUnlocked = state.unlockStatus === 'UNLOCKED' || remote.unlockStatus === 'UNLOCKED';

        return {
          ...state,
          discoveredClues: mergedClues,
          completedStages: mergedStages,
          unlockStatus: isUnlocked ? 'UNLOCKED' : state.unlockStatus,
          anomalyConfirmed: state.anomalyConfirmed || remote.anomalyConfirmed,
          decodedMessage: state.decodedMessage || remote.decodedMessage,
          unlockedAt: state.unlockedAt || remote.unlockedAt,
        };
      }

      return state;
    }

    default:
      return state;
  }
}
