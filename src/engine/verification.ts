import { MissionState } from './missionTypes';
import { isCipherCorrect, EXPECTED_PLAINTEXT } from './cipher';

export const ANOMALY_CODE = 'SIG-7749-OMEGA';
export const ANOMALY_ATTRIBUTE_NAME = 'data-signal-anomaly';
export const ANOMALY_ELEMENT_ID = 'transmission-anomaly-node';

// Expected SHA-256 hash of "THE LAST SIGNAL"
export const EXPECTED_PLAINTEXT_HASH = '1f65bb51a9a20078dc1be04cb7bda1a63c874229b0a1faeec6d96eeb83bb379b';

/**
 * Computes SHA-256 hash of string using Web Crypto API with graceful fallback
 */
export async function computeSHA256(message: string): Promise<string> {
  const normalized = message.trim().toUpperCase();
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // Fallback
    }
  }
  
  // Deterministic lightweight fallback if SubtleCrypto is restricted
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    const char = normalized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}

export interface VerificationResult {
  valid: boolean;
  reason?: string;
}

/**
 * Validates whether all prerequisites and temporal conditions are met for unlocking
 */
export async function verifyVaultPrerequisites(
  state: MissionState,
  submittedAnswer: string
): Promise<VerificationResult> {
  if (!state.keyDiscovered) {
    return {
      valid: false,
      reason: 'PREREQUISITE_FAILED: Cipher decryption key has not been recovered yet (Check Key tab).',
    };
  }

  if (!state.anomalyConfirmed) {
    return {
      valid: false,
      reason: 'PREREQUISITE_FAILED: DOM anomaly metadata has not been verified (Check Anomaly tab).',
    };
  }

  if (!isCipherCorrect(submittedAnswer)) {
    return {
      valid: false,
      reason: 'DECRYPTION_ERROR: Decoded signal does not match the classified transmission frequency.',
    };
  }

  if (state.currentPhase !== 'STABLE') {
    return {
      valid: false,
      reason: `TEMPORAL_DESYNC: Carrier frequency is currently in ${state.currentPhase} phase. Submissions are only accepted during STABLE resonance.`,
    };
  }

  // Cryptographic hash validation
  const calculatedHash = await computeSHA256(submittedAnswer);
  const expectedHash = await computeSHA256(EXPECTED_PLAINTEXT);

  if (calculatedHash !== expectedHash) {
    return {
      valid: false,
      reason: 'CRYPTO_DIGEST_MISMATCH: SHA-256 checksum verification failed.',
    };
  }

  return { valid: true };
}

/**
 * Validates anomaly code input
 */
export function verifyAnomalyCode(inputCode: string): boolean {
  if (!inputCode) return false;
  const cleanInput = inputCode.trim().toUpperCase().replace(/\s+/g, '');
  const cleanTarget = ANOMALY_CODE.toUpperCase().replace(/\s+/g, '');
  return cleanInput === cleanTarget;
}
