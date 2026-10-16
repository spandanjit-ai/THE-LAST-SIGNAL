export const CIPHERTEXT = 'VJG NCUV UKIPCN';
export const EXPECTED_PLAINTEXT = 'THE LAST SIGNAL';
export const SHIFT_VALUE = 2;

/**
 * Shifts alphabetic characters by the specified amount (wrapping A-Z).
 * Negative shift moves backwards (e.g. -3 translates V->T, J->G, G->D etc.)
 */
export function caesarShift(text: string, shift: number): string {
  const normalizedShift = ((shift % 26) + 26) % 26;
  return text
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      // Uppercase A-Z (65 - 90)
      if (code >= 65 && code <= 90) {
        return String.fromCharCode(((code - 65 + normalizedShift) % 26) + 65);
      }
      // Lowercase a-z (97 - 122)
      if (code >= 97 && code <= 122) {
        return String.fromCharCode(((code - 97 + normalizedShift) % 26) + 97);
      }
      return char;
    })
    .join('');
}

/**
 * Decodes ciphertext with a given backward shift (default 3)
 */
export function decodeCaesar(text: string, shift: number = SHIFT_VALUE): string {
  return caesarShift(text, -shift);
}

/**
 * Checks if normalized input matches the expected solution
 */
export function isCipherCorrect(attempt: string): boolean {
  return attempt.trim().toUpperCase() === EXPECTED_PLAINTEXT;
}
