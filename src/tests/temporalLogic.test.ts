import { describe, it, expect } from 'vitest';
import { 
  calculateSignalPhase, 
  SEARCHING_DURATION_MS, 
  ALIGNING_DURATION_MS, 
  CYCLE_DURATION_MS 
} from '../engine/temporalLogic';

describe('Temporal Logic Module', () => {
  const base = 1000000;

  it('determines SEARCHING phase during the first 12 seconds', () => {
    const timing = calculateSignalPhase(base + 5000, base);
    expect(timing.phase).toBe('SEARCHING');
    expect(timing.isStable).toBe(false);
    expect(timing.remainingInPhaseMs).toBe(7000);
    expect(timing.secondsToStable).toBe(15);
  });

  it('determines ALIGNING phase during 12 to 20 seconds', () => {
    const timing = calculateSignalPhase(base + SEARCHING_DURATION_MS + 2000, base);
    expect(timing.phase).toBe('ALIGNING');
    expect(timing.isStable).toBe(false);
    expect(timing.remainingInPhaseMs).toBe(6000);
    expect(timing.secondsToStable).toBe(6);
  });

  it('determines STABLE phase during 20 to 30 seconds', () => {
    const timing = calculateSignalPhase(base + SEARCHING_DURATION_MS + ALIGNING_DURATION_MS + 4000, base);
    expect(timing.phase).toBe('STABLE');
    expect(timing.isStable).toBe(true);
    expect(timing.remainingInPhaseMs).toBe(6000);
    expect(timing.secondsToStable).toBe(0);
  });

  it('loops cyclically across multiple 30s cycles deterministically', () => {
    // 3 cycles + 25s = 115s into time -> STABLE
    const timing = calculateSignalPhase(base + CYCLE_DURATION_MS * 3 + 25000, base);
    expect(timing.phase).toBe('STABLE');
    expect(timing.isStable).toBe(true);
  });
});
