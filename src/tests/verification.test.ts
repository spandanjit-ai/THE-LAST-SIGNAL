import { describe, it, expect } from 'vitest';
import { 
  validatePrerequisites, 
  verifyAnomalyToken, 
  verifyVaultUnlock,
  computeSHA256 
} from '../engine/verification';
import { getInitialMissionState } from '../engine/storage';
import { ANOMALY_TOKEN, TARGET_DECODED } from '../engine/cipher';

describe('Verification Module', () => {
  it('validates anomaly token matching', () => {
    expect(verifyAnomalyToken(ANOMALY_TOKEN)).toBe(true);
    expect(verifyAnomalyToken('invalid-token')).toBe(false);
  });

  it('detects missing prerequisites for vault unlock', () => {
    const state = getInitialMissionState('TEST');
    const check = validatePrerequisites(state);
    expect(check.valid).toBe(false);
    expect(check.reasons.length).toBeGreaterThan(0);
  });

  it('computes deterministic SHA-256 hash', async () => {
    const hash = await computeSHA256('THE LAST SIGNAL');
    expect(hash).toBeTruthy();
    expect(typeof hash).toBe('string');
  });

  it('verifies vault unlock requires STABLE phase and correct answer', async () => {
    const state = {
      ...getInitialMissionState('TEST'),
      discoveredClues: {
        clue_cipher_text: true,
        clue_key_shift: true,
        clue_anomaly_metadata: true,
        clue_decoded_message: true,
      },
      decodedMessage: TARGET_DECODED,
      anomalyConfirmed: true,
    };

    // Phase is SEARCHING -> Should fail
    const resSearching = await verifyVaultUnlock(state, TARGET_DECODED, 'SEARCHING');
    expect(resSearching.success).toBe(false);
    expect(resSearching.error).toContain('Temporal condition failed');

    // Wrong answer in STABLE phase -> Should fail
    const resWrong = await verifyVaultUnlock(state, 'WRONG ANSWER', 'STABLE');
    expect(resWrong.success).toBe(false);
    expect(resWrong.error).toContain('Invalid transmission code');

    // Correct answer in STABLE phase -> Success!
    const resSuccess = await verifyVaultUnlock(state, TARGET_DECODED, 'STABLE');
    expect(resSuccess.success).toBe(true);
  });
});
