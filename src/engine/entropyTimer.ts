export const ENTROPY_DURATION_SECONDS = 90;
export const ENTROPY_DURATION_MS = ENTROPY_DURATION_SECONDS * 1000;
export const ENTROPY_DAMPENER_CODE = '0x7749-CLEAR';

export type EntropySeverity = 'NOMINAL' | 'ELEVATED' | 'CRITICAL' | 'EXPIRED';

export interface EntropyCalculationResult {
  elapsedSeconds: number;
  secondsRemaining: number;
  progressPercent: number; // 0 to 100
  glitchIntensity: number; // 0 to 1
  severity: EntropySeverity;
  isExpired: boolean;
  statusText: string;
}

/**
 * Deterministically computes entropy timer countdown and visual glitch intensity
 * based on actual elapsed time since `timerStartedAt`.
 * Refreshes preserve exact remaining time.
 */
export function calculateEntropy(
  timerStartedAt: number,
  isStabilized: boolean,
  now: number = Date.now()
): EntropyCalculationResult {
  if (isStabilized) {
    return {
      elapsedSeconds: 0,
      secondsRemaining: ENTROPY_DURATION_SECONDS,
      progressPercent: 0,
      glitchIntensity: 0,
      severity: 'NOMINAL',
      isExpired: false,
      statusText: 'ENTROPY STABILIZED // HARMONIC DAMPENERS SECURE',
    };
  }

  const elapsedMs = Math.max(0, now - timerStartedAt);
  const elapsedSeconds = Math.min(ENTROPY_DURATION_SECONDS, Math.floor(elapsedMs / 1000));
  const rawRemainingSec = Math.max(0, (ENTROPY_DURATION_MS - elapsedMs) / 1000);
  const secondsRemaining = Math.max(0, Math.ceil(rawRemainingSec));
  const progressPercent = Math.min(100, Math.max(0, (elapsedMs / ENTROPY_DURATION_MS) * 100));

  const isExpired = elapsedMs >= ENTROPY_DURATION_MS;

  // Glitch intensity curve: quadratic ramp as time expires
  const normalizedElapsed = Math.min(1, Math.max(0, elapsedMs / ENTROPY_DURATION_MS));
  const glitchIntensity = isExpired ? 1.0 : Math.pow(normalizedElapsed, 1.5);

  let severity: EntropySeverity = 'NOMINAL';
  let statusText = 'SIGNAL INTEGRITY: NOMINAL';

  if (isExpired) {
    severity = 'EXPIRED';
    statusText = 'DAMPENER EXPIRED // RE-CALIBRATION REQUIRED';
  } else if (elapsedSeconds >= 60) {
    severity = 'CRITICAL';
    statusText = 'HIGH ENTROPY // WAVEFORM FLUTTER CRITICAL';
  } else if (elapsedSeconds >= 30) {
    severity = 'ELEVATED';
    statusText = 'ELEVATED JITTER // CARRIER DRIFT DETECTED';
  }

  return {
    elapsedSeconds,
    secondsRemaining,
    progressPercent,
    glitchIntensity,
    severity,
    isExpired,
    statusText,
  };
}
