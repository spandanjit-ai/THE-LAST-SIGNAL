import { SignalPhase } from './missionTypes';

export const CYCLE_TOTAL_SECONDS = 30;
export const SEARCHING_DURATION = 12; // 0s - 12s
export const ALIGNING_DURATION = 8;   // 12s - 20s
export const STABLE_DURATION = 10;    // 20s - 30s

export interface TemporalPhaseInfo {
  phase: SignalPhase;
  secondsRemaining: number;
  totalPhaseDuration: number;
  progress: number; // 0 to 100 within current phase
  cycleElapsedSeconds: number;
}

/**
 * Calculates current signal phase deterministically from a base timestamp.
 * Synchronized across all tabs without clock drift.
 */
export function calculateSignalPhase(baseTimestamp: number = 0, currentTimestamp: number = Date.now()): TemporalPhaseInfo {
  // Use timestamp offset or wall clock
  const elapsedMs = Math.max(0, currentTimestamp - baseTimestamp);
  const cycleMs = (elapsedMs % (CYCLE_TOTAL_SECONDS * 1000));
  const cycleSeconds = cycleMs / 1000;

  if (cycleSeconds < SEARCHING_DURATION) {
    const elapsedInPhase = cycleSeconds;
    const remaining = SEARCHING_DURATION - elapsedInPhase;
    return {
      phase: 'SEARCHING',
      secondsRemaining: Math.ceil(remaining),
      totalPhaseDuration: SEARCHING_DURATION,
      progress: Math.min(100, (elapsedInPhase / SEARCHING_DURATION) * 100),
      cycleElapsedSeconds: cycleSeconds,
    };
  } else if (cycleSeconds < SEARCHING_DURATION + ALIGNING_DURATION) {
    const elapsedInPhase = cycleSeconds - SEARCHING_DURATION;
    const remaining = ALIGNING_DURATION - elapsedInPhase;
    return {
      phase: 'ALIGNING',
      secondsRemaining: Math.ceil(remaining),
      totalPhaseDuration: ALIGNING_DURATION,
      progress: Math.min(100, (elapsedInPhase / ALIGNING_DURATION) * 100),
      cycleElapsedSeconds: cycleSeconds,
    };
  } else {
    const elapsedInPhase = cycleSeconds - (SEARCHING_DURATION + ALIGNING_DURATION);
    const remaining = STABLE_DURATION - elapsedInPhase;
    return {
      phase: 'STABLE',
      secondsRemaining: Math.ceil(remaining),
      totalPhaseDuration: STABLE_DURATION,
      progress: Math.min(100, (elapsedInPhase / STABLE_DURATION) * 100),
      cycleElapsedSeconds: cycleSeconds,
    };
  }
}
