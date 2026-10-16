import { describe, it, expect } from 'vitest';
import { missionReducer } from '../engine/missionReducer';
import { createInitialMissionState } from '../engine/storage';
import { validateNodeSequence, EXPECTED_NODE_SEQUENCE } from '../engine/cipherLockLogic';
import { calculateEntropy, ENTROPY_DAMPENER_CODE } from '../engine/entropyTimer';

describe('Track Omega - Full 3-Challenge Engine Verification', () => {
  describe('C1: Plot Twist (DOM Mutation)', () => {
    it('accepts correct data-containment-protocol="OVERRIDE" mutation', () => {
      const state = createInitialMissionState();
      const next = missionReducer(state, {
        type: 'COMPLETE_CHALLENGE',
        challengeId: 'C1',
        attribute: 'data-containment-protocol',
        value: 'OVERRIDE',
      });

      expect(next.challenges.items.C1.status).toBe('COMPLETED');
      expect(next.challenges.items.C1.twistRevealed).toContain('INTERNAL NODE 0x7749');
      expect(next.anomalyConfirmed).toBe(true);
      expect(next.timelineEvents.some((e) => e.badge === 'C1-BREACH')).toBe(true);
    });

    it('rejects wrong attribute or value and logs an error', () => {
      const state = createInitialMissionState();
      const wrongAttr = missionReducer(state, {
        type: 'COMPLETE_CHALLENGE',
        challengeId: 'C1',
        attribute: 'data-fake-attr',
        value: 'OVERRIDE',
      });
      expect(wrongAttr.challenges.items.C1.status).toBe('ACTIVE');
      expect(wrongAttr.error).toContain('MUTATION_REJECTED');

      const wrongVal = missionReducer(state, {
        type: 'COMPLETE_CHALLENGE',
        challengeId: 'C1',
        attribute: 'data-containment-protocol',
        value: 'FALSE',
      });
      expect(wrongVal.challenges.items.C1.status).toBe('ACTIVE');
      expect(wrongVal.error).toContain('MUTATION_REJECTED');
    });
  });

  describe('C2: Make It Come Alive (Node-Wire Cipher Lock & Multi-Tab)', () => {
    it('validates node sequence step-by-step', () => {
      // Step 1: alpha is valid prefix
      const step1 = validateNodeSequence(['alpha']);
      expect(step1.isValidPrefix).toBe(true);
      expect(step1.isComplete).toBe(false);
      expect(step1.expectedNextNode).toBe('beta');

      // Wrong step: gamma instead of beta
      const wrongStep = validateNodeSequence(['alpha', 'gamma']);
      expect(wrongStep.isValidPrefix).toBe(false);
      expect(wrongStep.error).toContain('CIRCUIT_SHORT');

      // Complete sequence
      const complete = validateNodeSequence(['alpha', 'beta', 'gamma', 'delta', 'omega']);
      expect(complete.isValidPrefix).toBe(true);
      expect(complete.isComplete).toBe(true);
    });

    it('processes node connections in missionReducer and marks C2 COMPLETED on 5th node', () => {
      let state = createInitialMissionState();
      for (const node of EXPECTED_NODE_SEQUENCE) {
        state = missionReducer(state, { type: 'CONNECT_NODE_WIRE', nodeId: node });
      }

      expect(state.nodeWireState.isSolved).toBe(true);
      expect(state.nodeWireState.isLocked).toBe(true);
      expect(state.challenges.items.C2.status).toBe('COMPLETED');
      expect(state.completedStages.transmission).toBe(true);
      expect(state.timelineEvents.some((e) => e.badge === 'T-LOCK')).toBe(true);
    });

    it('propagates C2 completion across tabs via SYNC_STATE', () => {
      const tab1 = createInitialMissionState('MISSION-1');
      const tab2 = createInitialMissionState('MISSION-1');

      let tab1Solved = tab1;
      for (const node of EXPECTED_NODE_SEQUENCE) {
        tab1Solved = missionReducer(tab1Solved, { type: 'CONNECT_NODE_WIRE', nodeId: node });
      }

      const tab2Synced = missionReducer(tab2, { type: 'SYNC_STATE', state: tab1Solved });
      expect(tab2Synced.challenges.items.C2.status).toBe('COMPLETED');
      expect(tab2Synced.nodeWireState.isSolved).toBe(true);
    });
  });

  describe('C3: Chaos Card (Temporal Scrubber & 90s Entropy Glitch)', () => {
    it('stores uncorrupted 0x7749-CLEAR dampener checksum in event T=0', () => {
      const state = createInitialMissionState();
      const initialEvent = state.timelineEvents[0];
      expect(initialEvent).toBeDefined();
      expect(initialEvent.id).toBe('evt-init');
      expect(initialEvent.checksum).toBe(ENTROPY_DAMPENER_CODE);
      expect(initialEvent.checksum).toBe('0x7749-CLEAR');
    });

    it('calculates deterministic 90-second countdown based on elapsed time', () => {
      const start = 1000000;
      // At T=0
      const calc0 = calculateEntropy(start, false, start);
      expect(calc0.secondsRemaining).toBe(90);
      expect(calc0.glitchIntensity).toBe(0);
      expect(calc0.severity).toBe('NOMINAL');

      // At T=45s
      const calc45 = calculateEntropy(start, false, start + 45000);
      expect(calc45.secondsRemaining).toBe(45);
      expect(calc45.severity).toBe('ELEVATED');
      expect(calc45.glitchIntensity).toBeGreaterThan(0.2);

      // At T=75s
      const calc75 = calculateEntropy(start, false, start + 75000);
      expect(calc75.secondsRemaining).toBe(15);
      expect(calc75.severity).toBe('CRITICAL');

      // At T=90s (expired)
      const calc90 = calculateEntropy(start, false, start + 90000);
      expect(calc90.secondsRemaining).toBe(0);
      expect(calc90.isExpired).toBe(true);
      expect(calc90.severity).toBe('EXPIRED');
      expect(calc90.glitchIntensity).toBe(1.0);
    });

    it('stabilizes entropy when correct 0x7749-CLEAR checksum is transmitted and marks C3 COMPLETED', () => {
      const state = createInitialMissionState();

      // Wrong checksum
      const wrong = missionReducer(state, { type: 'STABILIZE_ENTROPY', checksum: 'WRONG-CODE' });
      expect(wrong.entropyState.isStabilized).toBe(false);
      expect(wrong.challenges.items.C3.status).toBe('ACTIVE');
      expect(wrong.error).toContain('CHECKSUM_REJECTED');

      // Correct checksum recovered from T=0
      const stabilized = missionReducer(state, {
        type: 'STABILIZE_ENTROPY',
        checksum: ENTROPY_DAMPENER_CODE,
      });
      expect(stabilized.entropyState.isStabilized).toBe(true);
      expect(stabilized.challenges.items.C3.status).toBe('COMPLETED');
      expect(stabilized.error).toBeNull();
      expect(stabilized.timelineEvents.some((e) => e.badge === 'STABILIZED')).toBe(true);

      // Glitch intensity drops to 0 once stabilized
      const calcStabilized = calculateEntropy(state.entropyState.timerStartedAt, true);
      expect(calcStabilized.glitchIntensity).toBe(0);
      expect(calcStabilized.severity).toBe('NOMINAL');
    });

    it('allows re-calibrating expired oscillator to reset 90-second countdown', () => {
      let state = createInitialMissionState();
      const pastTime = Date.now() - 95000;
      state = {
        ...state,
        entropyState: {
          ...state.entropyState,
          timerStartedAt: pastTime,
        },
      };

      const now = Date.now();
      const resetState = missionReducer(state, { type: 'RESET_ENTROPY_TIMER', timestamp: now });
      expect(resetState.entropyState.timerStartedAt).toBe(now);
      expect(resetState.entropyState.isExpired).toBe(false);
    });

    it('ensures temporal scrubber snapshots never mutate authoritative mission state', () => {
      const state = createInitialMissionState();
      const snapshot = state.timelineEvents[0];

      // Inspecting snapshot
      expect(snapshot.stageSnapshot.phase).toBe('SEARCHING');
      // Live state remains active and unchanged
      expect(state.currentPhase).toBe('SEARCHING');
    });
  });

  describe('Full Experience: Judge Demo Hotkey', () => {
    it('solves all 3 challenges (C1, C2, C3) and unlocks vault in JUDGE_SOLVE_ALL', () => {
      const state = createInitialMissionState();
      const solved = missionReducer(state, { type: 'JUDGE_SOLVE_ALL' });

      expect(solved.challenges.items.C1.status).toBe('COMPLETED');
      expect(solved.challenges.items.C2.status).toBe('COMPLETED');
      expect(solved.challenges.items.C3.status).toBe('COMPLETED');
      expect(solved.nodeWireState.isSolved).toBe(true);
      expect(solved.entropyState.isStabilized).toBe(true);
      expect(solved.unlockStatus).toBe('UNLOCKED');
      expect(solved.currentPhase).toBe('STABLE');
    });
  });
});
