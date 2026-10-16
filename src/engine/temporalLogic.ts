import { SignalPhase } from './missionTypes';

export const CYCLE_DURATION_MS = 30000; // 30 seconds total loop
export const SEARCHING_DURATION_MS = 12000; // 0 to 12s: Searching
export const ALIGNING_DURATION_MS = 8000;   // 12 to 20s: Aligning
export const STABLE_DURATION_MS = 10000;   // 20 to 30s: Stable (resonance window)

export interface PhaseTimingInfo {
  phase: SignalPhase;
  elapsedInPhaseMs: number;
  durationOfPhaseMs: number;
  remainingInPhaseMs: number;
  progressPct: number; // 0 to 100
  secondsToStable: number;
  isStable: boolean;
}

/**
 * Deterministically calculates the signal phase from a base timestamp.
 * This guarantees all tabs share the exact same phase without timer drift.
 */
export function calculateSignalPhase(nowMs: number, baseTimestampMs: number): PhaseTimingInfo {
  // Guard against future base timestamp or negative elapsed
  const totalElapsed = Math.max(0, nowMs - baseTimestampMs);
  const cycleOffset = totalElapsed % CYCLE_DURATION_MS;

  if (cycleOffset < SEARCHING_DURATION_MS) {
    const elapsed = cycleOffset;
    const remaining = SEARCHING_DURATION_MS - elapsed;
    const secondsToStable = Math.ceil((SEARCHING_DURATION_MS + ALIGNING_DURATION_MS - elapsed) / 1000);
    return {
      phase: 'SEARCHING',
      elapsedInPhaseMs: elapsed,
      durationOfPhaseMs: SEARCHING_DURATION_MS,
      remainingInPhaseMs: remaining,
      progressPct: Math.min(100, (elapsed / SEARCHING_DURATION_MS) * 100),
      secondsToStable,
      isStable: false,
    };
  } else if (cycleOffset < SEARCHING_DURATION_MS + ALIGNING_DURATION_MS) {
    const elapsed = cycleOffset - SEARCHING_DURATION_MS;
    const remaining = ALIGNING_DURATION_MS - elapsed;
    const secondsToStable = Math.ceil(remaining / 1000);
    return {
      phase: 'ALIGNING',
      elapsedInPhaseMs: elapsed,
      durationOfPhaseMs: ALIGNING_DURATION_MS,
      remainingInPhaseMs: remaining,
      progressPct: Math.min(100, (elapsed / ALIGNING_DURATION_MS) * 100),
      secondsToStable,
      isStable: false,
    };
  } else {
    const elapsed = cycleOffset - (SEARCHING_DURATION_MS + ALIGNING_DURATION_MS);
    const remaining = STABLE_DURATION_MS - elapsed;
    return {
      phase: 'STABLE',
      elapsedInPhaseMs: elapsed,
      durationOfPhaseMs: STABLE_DURATION_MS,
      remainingInPhaseMs: remaining,
      progressPct: Math.min(100, (elapsed / STABLE_DURATION_MS) * 100),
      secondsToStable: 0,
      isStable: true,
    };
  }
}
