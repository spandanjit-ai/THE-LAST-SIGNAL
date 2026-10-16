import { describe, it, expect } from 'vitest';
import {
  CIPHERTEXT,
  EXPECTED_PLAINTEXT,
  caesarShift,
  decodeCaesar,
  isCipherCorrect,
} from '../engine/cipher';

describe('Cipher Engine', () => {
  it('correctly shifts characters with wrapping', () => {
    expect(caesarShift('ABC', 1)).toBe('BCD');
    expect(caesarShift('XYZ', 3)).toBe('ABC');
    expect(caesarShift('BCD', -1)).toBe('ABC');
  });

  it('decodes the transmission ciphertext VJG NCUV UKIPCN to THE LAST SIGNAL', () => {
    const decoded = decodeCaesar(CIPHERTEXT, 2);
    expect(decoded).toBe(EXPECTED_PLAINTEXT);
    expect(isCipherCorrect(decoded)).toBe(true);
  });

  it('rejects incorrect decrypted strings', () => {
    expect(isCipherCorrect('WRONG STRING')).toBe(false);
    expect(isCipherCorrect('THE FIRST SIGNAL')).toBe(false);
  });
});
