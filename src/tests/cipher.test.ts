import { describe, it, expect } from 'vitest';
import { 
  CIPHERTEXT, 
  TARGET_DECODED, 
  caesarShift, 
  decodeCaesar, 
  isTargetMessage 
} from '../engine/cipher';

describe('Cipher Module', () => {
  it('correctly shifts letters forward and backward', () => {
    expect(caesarShift('ABC', 1)).toBe('BCD');
    expect(caesarShift('XYZ', 3)).toBe('ABC');
    expect(caesarShift('BCD', -1)).toBe('ABC');
  });

  it('preserves spaces and casing', () => {
    expect(caesarShift('HELLO WORLD', 0)).toBe('HELLO WORLD');
    expect(caesarShift('hello world', 1)).toBe('IFMMP XPSME');
  });

  it('decodes the transmission ciphertext VJG NCUV UKIPCN to THE LAST SIGNAL with shift 2', () => {
    // VJG NCUV UKIPCN with shift 2 backward gives THE LAST SIGNAL
    const decoded = decodeCaesar(CIPHERTEXT, 2);
    expect(decoded).toBe(TARGET_DECODED);
    expect(isTargetMessage(decoded)).toBe(true);
  });

  it('rejects wrong candidate text', () => {
    expect(isTargetMessage('RANDOM WRONG')).toBe(false);
    expect(isTargetMessage('THE FIRST SIGNAL')).toBe(false);
  });
});
