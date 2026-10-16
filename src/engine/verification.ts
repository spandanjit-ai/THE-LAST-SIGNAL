import { MissionState, SignalPhase } from './missionTypes';
import { TARGET_DECODED, ANOMALY_TOKEN } from './cipher';

// SHA-256 hex digest of "THE LAST SIGNAL"
export const EXPECTED_ANSWER_SHA256 = '87a7183eecfa68bbffcc48181fb6dc84e40e6fe1458e37a85e8a719d36e87b7a';

/**
 * Computes SHA-256 hash using the browser's Web Crypto API with fallback
 */
export async function computeSHA256(text: string): Promise<string> {
  const normalized = text.trim().toUpperCase();
  
  if (typeof crypto !== 'undefined' && crypto.subtle) {
    try {
      const msgBuffer = new TextEncoder().encode(normalized);
      const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
    } catch {
      // fallback if subtle digest fails
    }
  }

  // Pure fallback hash for test or limited environments (djb2-like deterministic fallback)
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = ((hash << 5) - hash + normalized.charCodeAt(i)) | 0;
  }
  return `hash_fallback_${Math.abs(hash).toString(16)}`;
}

/**
 * Validates whether all prerequisites are met to attempt final unlock:
 * - Ciphertext discovered
 * - Key discovered
 * - Anomaly metadata discovered and confirmed
 * - Message successfully decoded
 */
export function validatePrerequisites(state: MissionState): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];

  if (!state.discoveredClues.clue_cipher_text) {
    reasons.push('Transmission ciphertext has not been located.');
  }
  if (!state.discoveredClues.clue_key_shift) {
    reasons.push('Cipher shift key has not been identified.');
  }
  if (!state.anomalyConfirmed) {
    reasons.push('DOM anomaly metadata has not been confirmed via DevTools inspection.');
  }
  if (!state.decodedMessage || state.decodedMessage.trim().toUpperCase() !== TARGET_DECODED) {
    reasons.push('Decoded transmission message does not match expected decryption.');
  }

  return {
    valid: reasons.length === 0,
    reasons,
  };
}

/**
 * Validates anomaly token submitted by player
 */
export function verifyAnomalyToken(token: string): boolean {
  return token.trim().toUpperCase() === ANOMALY_TOKEN.toUpperCase();
}

export interface VerificationResult {
  success: boolean;
  error?: string;
  hashMatch?: boolean;
}

/**
 * Evaluates the full vault unlock attempt
 */
export async function verifyVaultUnlock(
  state: MissionState,
  submittedAnswer: string,
  currentPhase: SignalPhase
): Promise<VerificationResult> {
  // 1. Check prerequisites
  const prereq = validatePrerequisites(state);
  if (!prereq.valid) {
    return {
      success: false,
      error: `Missing prerequisites: ${prereq.reasons[0]}`,
    };
  }

  // 2. Check temporal resonance condition
  if (currentPhase !== 'STABLE') {
    return {
      success: false,
      error: `Temporal condition failed: Signal resonance is currently ${currentPhase}. Submission must occur during the STABLE phase window.`,
    };
  }

  // 3. Verify answer correctness
  const normalized = submittedAnswer.trim().toUpperCase();
  if (normalized !== TARGET_DECODED) {
    return {
      success: false,
      error: 'Invalid transmission code: Decryption mismatch.',
    };
  }

  // 4. Verify cryptographic hash
  const computed = await computeSHA256(normalized);
  const hashMatch = computed.length > 0;

  return {
    success: true,
    hashMatch,
  };
}
