import { describe, it, expect } from 'vitest';
import { missionReducer } from '../engine/missionReducer';
import { createInitialMissionState } from '../engine/storage';

describe('Challenge System - Phase 01 Override (Track Omega)', () => {
  it('initializes Challenge 1 as ACTIVE and Challenges 2 & 3 as LOCKED placeholders', () => {
    const state = createInitialMissionState();
    expect(state.challenges.phaseTitle).toBe('PHASE 01 OVERRIDE');
    expect(state.challenges.track).toBe('TRACK OMEGA // MYSTERY BOX');
    expect(state.challenges.revealedCount).toBe(1);
    expect(state.challenges.totalCount).toBe(3);

    expect(state.challenges.items.C1.status).toBe('ACTIVE');
    expect(state.challenges.items.C1.revealed).toBe(true);

    expect(state.challenges.items.C2.status).toBe('LOCKED');
    expect(state.challenges.items.C2.revealed).toBe(false);

    expect(state.challenges.items.C3.status).toBe('LOCKED');
    expect(state.challenges.items.C3.revealed).toBe(false);
  });

  it('rejects invalid or malformed DOM mutations on Challenge 1', () => {
    const state = createInitialMissionState();

    // 1. Invalid attribute
    const result1 = missionReducer(state, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-unrelated-attribute',
      value: 'OVERRIDE',
    });
    expect(result1.challenges.items.C1.status).toBe('ACTIVE');
    expect(result1.error).toBeTruthy();

    // 2. Invalid value
    const result2 = missionReducer(state, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-containment-protocol',
      value: 'INVALID_OVERRIDE_VALUE',
    });
    expect(result2.challenges.items.C1.status).toBe('ACTIVE');
    expect(result2.error).toBeTruthy();
  });

  it('validates correct DOM mutation, transitions C1 to COMPLETED, and confirms anomaly clue', () => {
    const state = createInitialMissionState();
    const timestamp = 1718000000000;

    const completedState = missionReducer(state, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-containment-protocol',
      value: 'OVERRIDE',
      timestamp,
    });

    expect(completedState.challenges.items.C1.status).toBe('COMPLETED');
    expect(completedState.challenges.items.C1.completedAt).toBe(timestamp);
    expect(completedState.challenges.items.C1.mutationPayload).toBe('data-containment-protocol="OVERRIDE"');
    expect(completedState.challenges.items.C1.twistRevealed).toContain('INTERNAL NODE 0x7749');

    // Automatically confirms anomaly stage and clue
    expect(completedState.anomalyConfirmed).toBe(true);
    expect(completedState.completedStages.anomaly).toBe(true);
    expect(completedState.discoveredClues.anomaly).toBe(true);
  });

  it('guarantees idempotency on repeated completion events', () => {
    const state = createInitialMissionState();
    const completedState = missionReducer(state, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-containment-protocol',
      value: 'OVERRIDE',
    });

    const repeatedState = missionReducer(completedState, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-containment-protocol',
      value: 'OVERRIDE',
    });

    expect(repeatedState).toBe(completedState);
  });

  it('merges challenge state deterministically across tabs via SYNC_STATE', () => {
    const localState = createInitialMissionState('SIG-TEST');
    const remoteState = createInitialMissionState('SIG-TEST');

    const completedRemote = missionReducer(remoteState, {
      type: 'COMPLETE_CHALLENGE',
      challengeId: 'C1',
      attribute: 'data-containment-protocol',
      value: 'OVERRIDE',
    });

    const mergedLocal = missionReducer(localState, {
      type: 'SYNC_STATE',
      state: completedRemote,
    });

    expect(mergedLocal.challenges.items.C1.status).toBe('COMPLETED');
    expect(mergedLocal.anomalyConfirmed).toBe(true);
  });
});
