import { describe, it, expect } from 'vitest';
import { missionReducer } from '../engine/missionReducer';
import { getInitialMissionState } from '../engine/storage';
import { ANOMALY_TOKEN, TARGET_DECODED } from '../engine/cipher';

describe('Mission Reducer & Game Engine Transitions', () => {
  it('initializes with locked status and zero progress', () => {
    const state = getInitialMissionState('TEST-001');
    expect(state.missionId).toBe('TEST-001');
    expect(state.unlockStatus).toBe('LOCKED');
    expect(state.revision).toBe(1);
    expect(state.discoveredClues.clue_cipher_text).toBe(false);
  });

  it('handles idempotent clue discovery without duplicating progress', () => {
    let state = getInitialMissionState('TEST-001');
    state = missionReducer(state, { type: 'DISCOVER_CLUE', clueId: 'clue_cipher_text' });
    expect(state.discoveredClues.clue_cipher_text).toBe(true);
    expect(state.revision).toBe(2);

    // Duplicate discovery
    const state2 = missionReducer(state, { type: 'DISCOVER_CLUE', clueId: 'clue_cipher_text' });
    expect(state2.revision).toBe(2); // Revision did not unnecessarily increment
  });

  it('rejects invalid anomaly tokens and accepts valid DOM anomaly token', () => {
    let state = getInitialMissionState('TEST-001');
    
    // Invalid token
    state = missionReducer(state, { type: 'CONFIRM_ANOMALY_CLUE', token: 'WRONG-TOKEN' });
    expect(state.anomalyConfirmed).toBe(false);
    expect(state.lastError).toBeTruthy();

    // Valid token
    state = missionReducer(state, { type: 'CONFIRM_ANOMALY_CLUE', token: ANOMALY_TOKEN });
    expect(state.anomalyConfirmed).toBe(true);
    expect(state.discoveredClues.clue_anomaly_metadata).toBe(true);
    expect(state.completedStages).toContain('stage_3_anomaly');
    expect(state.lastError).toBeNull();
  });

  it('enforces temporal condition and prerequisite check on final answer submission', () => {
    let state = getInitialMissionState('TEST-001');

    // Attempting final answer without clues
    state = missionReducer(state, { 
      type: 'SUBMIT_FINAL_ANSWER', 
      answer: TARGET_DECODED, 
      currentPhaseAtSubmit: 'STABLE' 
    });
    expect(state.unlockStatus).toBe('FAILED');
    expect(state.lastError).toContain('Prerequisite missing');

    // Supply clues
    state = missionReducer(state, { type: 'DISCOVER_CLUE', clueId: 'clue_cipher_text' });
    state = missionReducer(state, { type: 'DISCOVER_CLUE', clueId: 'clue_key_shift' });
    state = missionReducer(state, { type: 'CONFIRM_ANOMALY_CLUE', token: ANOMALY_TOKEN });

    // Attempting final answer during SEARCHING phase (timing failure)
    state = missionReducer(state, { 
      type: 'SUBMIT_FINAL_ANSWER', 
      answer: TARGET_DECODED, 
      currentPhaseAtSubmit: 'SEARCHING' 
    });
    expect(state.unlockStatus).toBe('FAILED');
    expect(state.lastError).toContain('Temporal alignment failure');

    // Retry resets status to LOCKED
    state = missionReducer(state, { type: 'RETRY_TIMED_SEQUENCE' });
    expect(state.unlockStatus).toBe('LOCKED');
    expect(state.lastError).toBeNull();

    // Wrong answer during STABLE phase
    state = missionReducer(state, { 
      type: 'SUBMIT_FINAL_ANSWER', 
      answer: 'WRONG CODE', 
      currentPhaseAtSubmit: 'STABLE' 
    });
    expect(state.unlockStatus).toBe('FAILED');

    // Retry and submit correct answer during STABLE phase
    state = missionReducer(state, { type: 'RETRY_TIMED_SEQUENCE' });
    state = missionReducer(state, { 
      type: 'SUBMIT_FINAL_ANSWER', 
      answer: TARGET_DECODED, 
      currentPhaseAtSubmit: 'STABLE' 
    });
    expect(state.unlockStatus).toBe('UNLOCKED');
    expect(state.completedStages).toContain('stage_5_vault');
    expect(state.unlockedAt).toBeGreaterThan(0);
  });

  it('resets mission cleanly with fresh missionId', () => {
    let state = getInitialMissionState('TEST-001');
    state = missionReducer(state, { type: 'DISCOVER_CLUE', clueId: 'clue_cipher_text' });
    expect(state.discoveredClues.clue_cipher_text).toBe(true);

    state = missionReducer(state, { type: 'RESET_MISSION', newMissionId: 'NEW-MISSION-99' });
    expect(state.missionId).toBe('NEW-MISSION-99');
    expect(state.discoveredClues.clue_cipher_text).toBe(false);
    expect(state.unlockStatus).toBe('LOCKED');
    expect(state.revision).toBe(1);
  });

  it('merges cross-tab states deterministically on sync', () => {
    const local = getInitialMissionState('MISSION-SYNC');
    const remote = {
      ...getInitialMissionState('MISSION-SYNC'),
      revision: 4,
      discoveredClues: {
        clue_cipher_text: true,
        clue_key_shift: true,
        clue_anomaly_metadata: false,
        clue_decoded_message: true,
      },
      completedStages: ['stage_1_transmission', 'stage_2_key'] as any,
    };

    const synced = missionReducer(local, { type: 'SYNC_STATE', state: remote });
    expect(synced.revision).toBe(4);
    expect(synced.discoveredClues.clue_cipher_text).toBe(true);
    expect(synced.completedStages).toContain('stage_1_transmission');
  });
});
