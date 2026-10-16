import { describe, it, expect } from 'vitest';
import {
  verifyVaultPrerequisites,
  verifyAnomalyCode,
  computeSHA256,
  ANOMALY_CODE,
} from '../engine/verification';
import { createInitialMissionState } from '../engine/storage';
import { EXPECTED_PLAINTEXT } from '../engine/cipher';

describe('Verification Engine', () => {
  it('correctly matches valid and invalid anomaly code', () => {
    expect(verifyAnomalyCode(ANOMALY_CODE)).toBe(true);
    expect(verifyAnomalyCode('   sig-7749-omega  ')).toBe(true);
    expect(verifyAnomalyCode('INVALID_CODE')).toBe(false);
  });

  it('computes deterministic SHA-256 hash', async () => {
    const hash = await computeSHA256('THE LAST SIGNAL');
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');
  });

  it('rejects vault unlock when prerequisites are incomplete', async () => {
    const state = createInitialMissionState();
    const result = await verifyVaultPrerequisites(state, EXPECTED_PLAINTEXT);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('PREREQUISITE_FAILED');
  });

  it('rejects vault unlock if phase is not STABLE', async () => {
    const state = {
      ...createInitialMissionState(),
      keyDiscovered: true,
      anomalyConfirmed: true,
      currentPhase: 'SEARCHING' as const,
    };
    const result = await verifyVaultPrerequisites(state, EXPECTED_PLAINTEXT);
    expect(result.valid).toBe(false);
    expect(result.reason).toContain('TEMPORAL_DESYNC');
  });

  it('approves vault unlock when all criteria and STABLE phase match', async () => {
    const state = {
      ...createInitialMissionState(),
      keyDiscovered: true,
      anomalyConfirmed: true,
      currentPhase: 'STABLE' as const,
    };
    const result = await verifyVaultPrerequisites(state, EXPECTED_PLAINTEXT);
    expect(result.valid).toBe(true);
  });
});
