import { describe, it, expect } from 'vitest';
import {
  calculateSignalPhase,
  SEARCHING_DURATION,
  ALIGNING_DURATION,
  CYCLE_TOTAL_SECONDS,
} from '../engine/temporalLogic';

describe('Temporal Logic Module', () => {
  const base = 1000000;

  it('correctly reports SEARCHING phase during 0-12s', () => {
    const info = calculateSignalPhase(base, base + 5000);
    expect(info.phase).toBe('SEARCHING');
    expect(info.secondsRemaining).toBe(7);
  });

  it('correctly reports ALIGNING phase during 12-20s', () => {
    const info = calculateSignalPhase(base, base + (SEARCHING_DURATION + 2) * 1000);
    expect(info.phase).toBe('ALIGNING');
    expect(info.secondsRemaining).toBe(6);
  });

  it('correctly reports STABLE phase during 20-30s', () => {
    const info = calculateSignalPhase(base, base + (SEARCHING_DURATION + ALIGNING_DURATION + 3) * 1000);
    expect(info.phase).toBe('STABLE');
    expect(info.secondsRemaining).toBe(7);
  });

  it('cycles across 30s intervals deterministically', () => {
    const info = calculateSignalPhase(base, base + (CYCLE_TOTAL_SECONDS * 5 + 25) * 1000);
    expect(info.phase).toBe('STABLE');
  });
});
