export const CIPHERTEXT = 'VJG NCUV UKIPCN';
export const TARGET_DECODED = 'THE LAST SIGNAL';

// Anomaly data token embedded in DOM metadata
export const ANOMALY_ATTRIBUTE_NAME = 'data-transmission-anomaly';
export const ANOMALY_TOKEN = 'SIG-7749-OMEGA';

/**
 * Caesar shifts alphabetic characters by the given shift offset.
 * Preserves spaces and punctuation. Case-insensitive normalization.
 */
export function caesarShift(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return text
    .toUpperCase()
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // 'A' is 65, 'Z' is 90
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
      }
      return char;
    })
    .join('');
}

/**
 * Decodes Caesar ciphertext by shifting backward by the shift value.
 * e.g. decodeCaesar("VJG", 2) -> "THE"
 */
export function decodeCaesar(ciphertext: string, backwardShift: number): string {
  return caesarShift(ciphertext, -backwardShift);
}

/**
 * Check if the decoded text matches the target transmission message
 */
export function isTargetMessage(candidate: string): boolean {
  return candidate.trim().toUpperCase() === TARGET_DECODED;
}
