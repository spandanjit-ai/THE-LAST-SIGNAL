import { describe, it, expect } from 'vitest';
import { missionReducer } from '../engine/missionReducer';
import { createInitialMissionState } from '../engine/storage';
import { ANOMALY_CODE } from '../engine/verification';
import { EXPECTED_PLAINTEXT } from '../engine/cipher';

describe('Mission Reducer Module', () => {
  it('initializes with default locked state and revision 1', () => {
    const state = createInitialMissionState('TEST-001');
    expect(state.missionId).toBe('TEST-001');
    expect(state.revision).toBe(1);
    expect(state.unlockStatus).toBe('LOCKED');
    expect(state.keyDiscovered).toBe(false);
  });

  it('idempotently discovers key without duplicating state', () => {
    let state = createInitialMissionState();
    state = missionReducer(state, { type: 'DISCOVER_KEY' });
    expect(state.keyDiscovered).toBe(true);
    expect(state.completedStages.key).toBe(true);
    expect(state.revision).toBe(2);

    // Duplicate action should be a no-op
    const nextState = missionReducer(state, { type: 'DISCOVER_KEY' });
    expect(nextState.revision).toBe(2);
  });

  it('handles anomaly confirmation validation', () => {
    let state = createInitialMissionState();
    state = missionReducer(state, { type: 'CONFIRM_ANOMALY', code: 'WRONG_CODE' });
    expect(state.anomalyConfirmed).toBe(false);
    expect(state.error).toBeTruthy();

    state = missionReducer(state, { type: 'CONFIRM_ANOMALY', code: ANOMALY_CODE });
    expect(state.anomalyConfirmed).toBe(true);
    expect(state.completedStages.anomaly).toBe(true);
    expect(state.error).toBeNull();
  });

  it('handles cipher decoding validation', () => {
    let state = createInitialMissionState();
    state = missionReducer(state, { type: 'DECODE_CIPHER', plaintext: 'WRONG' });
    expect(state.cipherDecoded).toBe(false);
    expect(state.error).toBeTruthy();

    state = missionReducer(state, { type: 'DECODE_CIPHER', plaintext: EXPECTED_PLAINTEXT });
    expect(state.cipherDecoded).toBe(true);
    expect(state.completedStages.transmission).toBe(true);
    expect(state.error).toBeNull();
  });

  it('merges cross-tab states deterministically on sync', () => {
    const local = createInitialMissionState('SYNC-TEST');
    const remote = {
      ...createInitialMissionState('SYNC-TEST'),
      revision: 4,
      keyDiscovered: true,
      anomalyConfirmed: true,
      completedStages: {
        transmission: false,
        key: true,
        anomaly: true,
      },
      discoveredClues: {
        transmission: false,
        key: true,
        anomaly: true,
      },
    };

    const synced = missionReducer(local, { type: 'SYNC_STATE', state: remote });
    expect(synced.revision).toBe(4);
    expect(synced.keyDiscovered).toBe(true);
    expect(synced.anomalyConfirmed).toBe(true);
  });

  it('resets mission cleanly upon reset action', () => {
    let state = createInitialMissionState();
    state = missionReducer(state, { type: 'DISCOVER_KEY' });
    expect(state.keyDiscovered).toBe(true);

    state = missionReducer(state, { type: 'RESET_MISSION', newMissionId: 'NEW-001', startedAt: 12345 });
    expect(state.missionId).toBe('NEW-001');
    expect(state.keyDiscovered).toBe(false);
    expect(state.revision).toBe(1);
  });
});
