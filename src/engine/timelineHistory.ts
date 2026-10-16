import { TimelineEvent, MissionState } from './missionTypes';
import { ENTROPY_DAMPENER_CODE } from './entropyTimer';

/**
 * Creates the initial recorded event at T=0.
 * Crucially contains the uncorrupted pre-entropy checksum `0x7749-CLEAR`.
 */
export function createInitialTimelineEvent(startedAt: number): TimelineEvent {
  return {
    id: 'evt-init',
    timestamp: startedAt,
    relativeSec: 0,
    title: 'MISSION INITIALIZATION // CARRIER INTERCEPTED',
    badge: 'T+00s [INITIAL]',
    description:
      'Raw encrypted carrier intercepted on 1420.405 MHz. Containment restricted. Dampener reference checksum: 0x7749-CLEAR.',
    checksum: ENTROPY_DAMPENER_CODE,
    stageSnapshot: {
      phase: 'SEARCHING',
      cluesFound: 0,
      cipherDecoded: false,
      keyDiscovered: false,
      anomalyConfirmed: false,
      c1Solved: false,
      c2Solved: false,
      activeFrequency: '1420.405 MHz (Hydrogen Line)',
    },
  };
}

/**
 * Creates an event snapshot from current state.
 */
export function createTimelineEventFromState(
  state: MissionState,
  title: string,
  description: string,
  customBadge?: string
): TimelineEvent {
  const now = Date.now();
  const relativeSec = Math.max(0, Math.floor((now - state.startedAt) / 1000));
  const cluesCount = [state.cipherDecoded, state.keyDiscovered, state.anomalyConfirmed].filter(Boolean).length;

  return {
    id: `evt-${now}-${Math.random().toString(36).substring(2, 6)}`,
    timestamp: now,
    relativeSec,
    title,
    badge: customBadge || `T+${relativeSec}s`,
    description,
    checksum: `CHK-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    stageSnapshot: {
      phase: state.currentPhase,
      cluesFound: cluesCount,
      cipherDecoded: state.cipherDecoded,
      keyDiscovered: state.keyDiscovered,
      anomalyConfirmed: state.anomalyConfirmed,
      c1Solved: state.challenges?.items?.C1?.status === 'COMPLETED',
      c2Solved: state.challenges?.items?.C2?.status === 'COMPLETED',
      activeFrequency: '1420.405 MHz',
    },
  };
}

/**
 * Validates the player's entropy stabilization checksum.
 */
export function verifyEntropyChecksum(code: string): boolean {
  if (!code) return false;
  return code.trim().toUpperCase() === ENTROPY_DAMPENER_CODE.toUpperCase();
}
