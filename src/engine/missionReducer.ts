import { MissionState, MissionAction, ChallengeStatus, TimelineEvent } from './missionTypes';
import { createInitialMissionState } from './storage';
import { verifyAnomalyCode } from './verification';
import { isCipherCorrect } from './cipher';
import { validateNodeSequence, EXPECTED_NODE_SEQUENCE } from './cipherLockLogic';
import { verifyEntropyChecksum, createTimelineEventFromState } from './timelineHistory';
import { ENTROPY_DAMPENER_CODE } from './entropyTimer';

export function missionReducer(state: MissionState, action: MissionAction): MissionState {
  const now = Date.now();

  switch (action.type) {
    case 'START_MISSION': {
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        discoveredClues: {
          ...state.discoveredClues,
          transmission: true,
        },
      };
    }

    case 'DISCOVER_KEY': {
      if (state.keyDiscovered) return state; // Idempotent
      const newTimelineEvents = [
        ...state.timelineEvents,
        createTimelineEventFromState(
          state,
          'DECRYPTION KEY EXTRACTED',
          'ROT-2 Caesar shift detected across harmonic sub-carrier.',
          'KEY-ACQ'
        ),
      ];
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        keyDiscovered: true,
        discoveredClues: {
          ...state.discoveredClues,
          key: true,
        },
        completedStages: {
          ...state.completedStages,
          key: true,
        },
        timelineEvents: newTimelineEvents,
        error: null,
      };
    }

    case 'CONFIRM_ANOMALY': {
      if (state.anomalyConfirmed) return state; // Idempotent
      const isValid = verifyAnomalyCode(action.code);
      if (!isValid) {
        return {
          ...state,
          error: 'INVALID_ANOMALY_CODE: Code does not match the inspected DOM metadata node.',
        };
      }
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        anomalyConfirmed: true,
        discoveredClues: {
          ...state.discoveredClues,
          anomaly: true,
        },
        completedStages: {
          ...state.completedStages,
          anomaly: true,
        },
        error: null,
      };
    }

    case 'DECODE_CIPHER': {
      const isCorrect = isCipherCorrect(action.plaintext);
      if (!isCorrect) {
        return {
          ...state,
          error: 'INCORRECT_DECODING: Cipher output mismatch. Re-verify the Caesar shift.',
        };
      }
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        cipherDecoded: true,
        completedStages: {
          ...state.completedStages,
          transmission: true,
        },
        error: null,
      };
    }

    case 'START_VERIFICATION': {
      return {
        ...state,
        unlockStatus: 'VERIFYING',
        error: null,
      };
    }

    case 'UNLOCK_VAULT': {
      const finalTimelineEvents = [
        ...state.timelineEvents,
        createTimelineEventFromState(
          state,
          'OMEGA VAULT REACTOR DISCLOSED',
          'Cryptographic barrier breached. Final classified audio log and research dossier unlocked.',
          'UNLOCKED'
        ),
      ];
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        unlockStatus: 'UNLOCKED',
        unlockedAt: now,
        timelineEvents: finalTimelineEvents,
        error: null,
      };
    }

    case 'FAIL_VERIFICATION': {
      return {
        ...state,
        unlockStatus: 'LOCKED',
        error: action.error,
      };
    }

    case 'RETRY_SEQUENCE': {
      return {
        ...state,
        unlockStatus: 'LOCKED',
        error: null,
      };
    }

    // --- C1: PLOT TWIST (DOM MUTATION OBSERVER) ---
    case 'COMPLETE_CHALLENGE': {
      if (action.challengeId !== 'C1') return state;
      // Idempotent: if C1 is already completed, return unchanged state
      if (state.challenges?.items?.C1?.status === 'COMPLETED') {
        return state;
      }

      // Strict engine validation of target attribute and value
      const cleanAttr = action.attribute.trim().toLowerCase();
      const cleanVal = action.value.trim().toUpperCase();

      if (cleanAttr !== 'data-containment-protocol' || cleanVal !== 'OVERRIDE') {
        return {
          ...state,
          error: `MUTATION_REJECTED: Security observer rejected attribute '${action.attribute}' with value '${action.value}'. Expected 'data-containment-protocol="OVERRIDE"'.`,
        };
      }

      const completionTime = action.timestamp || now;
      const newTimelineEvents = [
        ...state.timelineEvents,
        createTimelineEventFromState(
          state,
          'DOM CONTAINMENT PROTOCOL OVERRIDDEN',
          'Plot Twist Revealed: Transmission source is internal node 0x7749. The signal is an automated station evacuation order.',
          'C1-BREACH'
        ),
      ];

      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        anomalyConfirmed: true,
        discoveredClues: {
          ...state.discoveredClues,
          anomaly: true,
        },
        completedStages: {
          ...state.completedStages,
          anomaly: true,
        },
        challenges: {
          ...state.challenges,
          items: {
            ...state.challenges.items,
            C1: {
              ...state.challenges.items.C1,
              status: 'COMPLETED',
              completedAt: completionTime,
              mutationPayload: `${action.attribute}="${action.value}"`,
              twistRevealed:
                'CONTAINMENT BREACH: TRANSMISSION ORIGIN IS INTERNAL NODE 0x7749. THE SIGNAL IS NOT AN INCOMING DISTRESS BEACON — IT IS AN AUTOMATED EVACUATION ORDER GENERATED BY THIS SYSTEM.',
            },
          },
        },
        timelineEvents: newTimelineEvents,
        error: null,
      };
    }

    // --- C2: MAKE IT COME ALIVE (NODE-WIRE CIPHER LOCK) ---
    case 'CONNECT_NODE_WIRE': {
      if (state.nodeWireState?.isSolved) return state; // Already solved
      const currentNodes = state.nodeWireState?.connectedNodes || [];
      if (currentNodes.includes(action.nodeId)) {
        return state;
      }
      const newSequence = [...currentNodes, action.nodeId];
      const validation = validateNodeSequence(newSequence);

      if (!validation.isValidPrefix) {
        return {
          ...state,
          nodeWireState: {
            ...state.nodeWireState,
            connectedNodes: newSequence,
            error: validation.error || 'CIRCUIT_SHORT: Node mismatch disrupted harmonic carrier flow.',
          },
          error: validation.error || 'CIRCUIT_SHORT: Node mismatch disrupted harmonic carrier flow.',
        };
      }

      const isComplete = validation.isComplete;
      const updatedNodeWire = {
        connectedNodes: newSequence,
        isLocked: isComplete,
        isSolved: isComplete,
        solvedAt: isComplete ? now : undefined,
        error: null,
      };

      const updatedChallenges = isComplete
        ? {
            ...state.challenges,
            items: {
              ...state.challenges.items,
              C2: {
                ...state.challenges.items.C2,
                status: 'COMPLETED' as ChallengeStatus,
                completedAt: now,
              },
            },
          }
        : state.challenges;

      const updatedStages = isComplete
        ? {
            ...state.completedStages,
            transmission: true,
          }
        : state.completedStages;

      const newTimelineEvents = isComplete
        ? [
            ...state.timelineEvents,
            createTimelineEventFromState(
              state,
              'NODE-WIRE LOCK RESONANCE ACHIEVED',
              'All 5 carrier nodes (α -> β -> γ -> δ -> Ω) wired in exact harmonic sequence. C2 circuit engaged.',
              'T-LOCK'
            ),
          ]
        : state.timelineEvents;

      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        nodeWireState: updatedNodeWire,
        challenges: updatedChallenges,
        completedStages: updatedStages,
        timelineEvents: newTimelineEvents,
        error: null,
      };
    }

    case 'RESET_NODE_WIRES': {
      if (state.nodeWireState?.isSolved) return state;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        nodeWireState: {
          connectedNodes: [],
          isLocked: false,
          isSolved: false,
          error: null,
        },
        error: null,
      };
    }

    case 'COMPLETE_CHALLENGE_C2': {
      if (state.challenges?.items?.C2?.status === 'COMPLETED') return state;
      const completionTime = action.timestamp || now;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        nodeWireState: {
          connectedNodes: action.sequence || EXPECTED_NODE_SEQUENCE,
          isLocked: true,
          isSolved: true,
          solvedAt: completionTime,
          error: null,
        },
        challenges: {
          ...state.challenges,
          items: {
            ...state.challenges.items,
            C2: {
              ...state.challenges.items.C2,
              status: 'COMPLETED',
              completedAt: completionTime,
            },
          },
        },
        completedStages: {
          ...state.completedStages,
          transmission: true,
        },
        timelineEvents: [
          ...state.timelineEvents,
          createTimelineEventFromState(
            state,
            'C2 CIPHER LOCK SYNCHRONIZED',
            'Cross-tab BroadcastChannel confirmed 5-stage harmonic sequence synchronization.',
            'C2-SYNC'
          ),
        ],
        error: null,
      };
    }

    // --- C3: CHAOS CARD (TEMPORAL SCRUBBER & 90S ENTROPY GLITCH) ---
    case 'RECORD_TIMELINE_EVENT': {
      const relativeSec = Math.max(0, Math.floor((now - state.startedAt) / 1000));
      const newEvent: TimelineEvent = {
        id: `evt-${now}-${Math.random().toString(36).substring(2, 6)}`,
        timestamp: now,
        relativeSec,
        ...action.event,
      };
      return {
        ...state,
        timelineEvents: [...state.timelineEvents.slice(-49), newEvent],
      };
    }

    case 'RESET_ENTROPY_TIMER': {
      const resetTime = action.timestamp || now;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        entropyState: {
          timerStartedAt: resetTime,
          durationSeconds: 90,
          isStabilized: false,
          isExpired: false,
          stabilizedAt: undefined,
          entropyDampenerCode: undefined,
        },
        timelineEvents: [
          ...state.timelineEvents,
          createTimelineEventFromState(
            state,
            'ENTROPY OSCILLATOR RE-CALIBRATED',
            'Entropy timer reset to 90 seconds. Harmonic stability countdown active.',
            'RE-CAL'
          ),
        ],
        error: null,
      };
    }

    case 'STABILIZE_ENTROPY': {
      if (state.entropyState?.isStabilized) return state;
      const isValid = verifyEntropyChecksum(action.checksum);
      if (!isValid) {
        return {
          ...state,
          error: 'CHECKSUM_REJECTED: Checksum mismatch. Scrub timeline backwards to T+0s to recover the pre-entropy dampener code.',
        };
      }
      const completionTime = action.timestamp || now;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        entropyState: {
          ...state.entropyState,
          isStabilized: true,
          isExpired: false,
          stabilizedAt: completionTime,
          entropyDampenerCode: action.checksum.trim().toUpperCase(),
        },
        challenges: {
          ...state.challenges,
          items: {
            ...state.challenges.items,
            C3: {
              ...state.challenges.items.C3,
              status: 'COMPLETED',
              completedAt: completionTime,
            },
          },
        },
        timelineEvents: [
          ...state.timelineEvents,
          createTimelineEventFromState(
            state,
            'ENTROPY CASCADE STABILIZED',
            `Dampener code ${action.checksum} authenticated. Signal glitch cascade neutralized.`,
            'STABILIZED'
          ),
        ],
        error: null,
      };
    }

    case 'COMPLETE_CHALLENGE_C3': {
      if (state.challenges?.items?.C3?.status === 'COMPLETED') return state;
      const completionTime = action.timestamp || now;
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        entropyState: {
          ...state.entropyState,
          isStabilized: true,
          isExpired: false,
          stabilizedAt: completionTime,
          entropyDampenerCode: ENTROPY_DAMPENER_CODE,
        },
        challenges: {
          ...state.challenges,
          items: {
            ...state.challenges.items,
            C3: {
              ...state.challenges.items.C3,
              status: 'COMPLETED',
              completedAt: completionTime,
            },
          },
        },
        error: null,
      };
    }

    case 'RESET_MISSION': {
      return createInitialMissionState(action.newMissionId, action.startedAt || now);
    }

    case 'JUDGE_SOLVE_ALL': {
      return {
        ...state,
        revision: state.revision + 1,
        lastUpdatedAt: now,
        keyDiscovered: true,
        anomalyConfirmed: true,
        cipherDecoded: true,
        discoveredClues: {
          transmission: true,
          key: true,
          anomaly: true,
        },
        completedStages: {
          transmission: true,
          key: true,
          anomaly: true,
        },
        challenges: {
          ...state.challenges,
          items: {
            C1: {
              ...state.challenges.items.C1,
              status: 'COMPLETED',
              completedAt: now,
              mutationPayload: 'data-containment-protocol="OVERRIDE"',
              twistRevealed:
                'CONTAINMENT BREACH: TRANSMISSION ORIGIN IS INTERNAL NODE 0x7749. THE SIGNAL IS NOT AN INCOMING DISTRESS BEACON — IT IS AN AUTOMATED EVACUATION ORDER GENERATED BY THIS SYSTEM.',
            },
            C2: {
              ...state.challenges.items.C2,
              status: 'COMPLETED',
              completedAt: now,
            },
            C3: {
              ...state.challenges.items.C3,
              status: 'COMPLETED',
              completedAt: now,
            },
          },
        },
        nodeWireState: {
          connectedNodes: EXPECTED_NODE_SEQUENCE,
          isLocked: true,
          isSolved: true,
          solvedAt: now,
          error: null,
        },
        entropyState: {
          timerStartedAt: state.entropyState?.timerStartedAt || state.startedAt,
          durationSeconds: 90,
          isStabilized: true,
          isExpired: false,
          stabilizedAt: now,
          entropyDampenerCode: ENTROPY_DAMPENER_CODE,
        },
        currentPhase: 'STABLE',
        phaseSecondsRemaining: 10,
        phaseProgress: 100,
        unlockStatus: 'UNLOCKED',
        unlockedAt: now,
        error: null,
      };
    }

    case 'UPDATE_TEMPORAL_PHASE': {
      if (
        state.currentPhase === action.phase &&
        state.phaseSecondsRemaining === action.secondsRemaining &&
        state.phaseProgress === action.progress
      ) {
        return state;
      }
      return {
        ...state,
        currentPhase: action.phase,
        phaseSecondsRemaining: action.secondsRemaining,
        phaseProgress: action.progress,
      };
    }

    case 'SYNC_STATE': {
      const incoming = action.state;
      // If mission ID differs (e.g. remote reset), adopt incoming
      if (incoming.missionId !== state.missionId) {
        return incoming;
      }
      // If revision is older and we already have more clues, preserve local union
      if (incoming.revision < state.revision) {
        return state;
      }

      // Merge challenge states cleanly
      const isC1Done =
        state.challenges?.items?.C1?.status === 'COMPLETED' ||
        incoming.challenges?.items?.C1?.status === 'COMPLETED';
      const isC2Done =
        state.challenges?.items?.C2?.status === 'COMPLETED' ||
        incoming.challenges?.items?.C2?.status === 'COMPLETED' ||
        state.nodeWireState?.isSolved ||
        incoming.nodeWireState?.isSolved;
      const isC3Done =
        state.challenges?.items?.C3?.status === 'COMPLETED' ||
        incoming.challenges?.items?.C3?.status === 'COMPLETED' ||
        state.entropyState?.isStabilized ||
        incoming.entropyState?.isStabilized;

      const mergedChallenges = {
        ...(incoming.challenges || state.challenges),
        items: {
          C1: {
            ...(incoming.challenges?.items?.C1 || state.challenges.items.C1),
            status: (isC1Done ? 'COMPLETED' : incoming.challenges?.items?.C1?.status || 'ACTIVE') as ChallengeStatus,
            completedAt:
              state.challenges?.items?.C1?.completedAt ||
              incoming.challenges?.items?.C1?.completedAt,
            mutationPayload:
              state.challenges?.items?.C1?.mutationPayload ||
              incoming.challenges?.items?.C1?.mutationPayload,
            twistRevealed:
              state.challenges?.items?.C1?.twistRevealed ||
              incoming.challenges?.items?.C1?.twistRevealed,
          },
          C2: {
            ...(incoming.challenges?.items?.C2 || state.challenges.items.C2),
            status: (isC2Done ? 'COMPLETED' : incoming.challenges?.items?.C2?.status || 'ACTIVE') as ChallengeStatus,
            completedAt:
              state.challenges?.items?.C2?.completedAt ||
              incoming.challenges?.items?.C2?.completedAt,
          },
          C3: {
            ...(incoming.challenges?.items?.C3 || state.challenges.items.C3),
            status: (isC3Done ? 'COMPLETED' : incoming.challenges?.items?.C3?.status || 'ACTIVE') as ChallengeStatus,
            completedAt:
              state.challenges?.items?.C3?.completedAt ||
              incoming.challenges?.items?.C3?.completedAt,
          },
        },
      };

      // Merge node wire state
      const mergedNodeWire = {
        connectedNodes: isC2Done
          ? EXPECTED_NODE_SEQUENCE
          : incoming.nodeWireState?.connectedNodes?.length > (state.nodeWireState?.connectedNodes?.length || 0)
          ? incoming.nodeWireState.connectedNodes
          : state.nodeWireState?.connectedNodes || [],
        isLocked: isC2Done || !!incoming.nodeWireState?.isLocked || !!state.nodeWireState?.isLocked,
        isSolved: isC2Done,
        solvedAt: state.nodeWireState?.solvedAt || incoming.nodeWireState?.solvedAt,
        error: incoming.nodeWireState?.error || null,
      };

      // Merge entropy state
      const mergedEntropy = {
        timerStartedAt: Math.min(
          state.entropyState?.timerStartedAt || state.startedAt,
          incoming.entropyState?.timerStartedAt || incoming.startedAt
        ),
        durationSeconds: 90,
        isStabilized: isC3Done,
        isExpired: !isC3Done && (incoming.entropyState?.isExpired || state.entropyState?.isExpired),
        stabilizedAt: state.entropyState?.stabilizedAt || incoming.entropyState?.stabilizedAt,
        entropyDampenerCode:
          state.entropyState?.entropyDampenerCode || incoming.entropyState?.entropyDampenerCode || (isC3Done ? ENTROPY_DAMPENER_CODE : undefined),
      };

      // Merge timeline events (deduplicate by id)
      const eventMap = new Map<string, TimelineEvent>();
      for (const evt of state.timelineEvents || []) {
        eventMap.set(evt.id, evt);
      }
      for (const evt of incoming.timelineEvents || []) {
        eventMap.set(evt.id, evt);
      }
      const mergedEvents = Array.from(eventMap.values()).sort((a, b) => a.timestamp - b.timestamp);

      // Deterministic union of completed state
      return {
        ...incoming,
        revision: Math.max(state.revision, incoming.revision),
        keyDiscovered: state.keyDiscovered || incoming.keyDiscovered,
        anomalyConfirmed: state.anomalyConfirmed || incoming.anomalyConfirmed || isC1Done,
        cipherDecoded: state.cipherDecoded || incoming.cipherDecoded,
        discoveredClues: {
          transmission: state.discoveredClues.transmission || incoming.discoveredClues.transmission,
          key: state.discoveredClues.key || incoming.discoveredClues.key,
          anomaly: state.discoveredClues.anomaly || incoming.discoveredClues.anomaly || isC1Done,
        },
        completedStages: {
          transmission: state.completedStages.transmission || incoming.completedStages.transmission || isC2Done,
          key: state.completedStages.key || incoming.completedStages.key,
          anomaly: state.completedStages.anomaly || incoming.completedStages.anomaly || isC1Done,
        },
        challenges: mergedChallenges,
        nodeWireState: mergedNodeWire,
        entropyState: mergedEntropy,
        timelineEvents: mergedEvents,
        unlockStatus:
          state.unlockStatus === 'UNLOCKED' || incoming.unlockStatus === 'UNLOCKED'
            ? 'UNLOCKED'
            : incoming.unlockStatus,
        unlockedAt: state.unlockedAt || incoming.unlockedAt,
      };
    }

    default:
      return state;
  }
}
