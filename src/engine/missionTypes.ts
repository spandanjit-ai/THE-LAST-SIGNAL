export type MissionRole = 'transmission' | 'key' | 'anomaly';

export type SignalPhase = 'SEARCHING' | 'ALIGNING' | 'STABLE';

export type VaultState = 'LOCKED' | 'VERIFYING' | 'UNLOCKING' | 'UNLOCKED';

export type ChallengeStatus = 'LOCKED' | 'ACTIVE' | 'COMPLETED';

export interface ChallengeItem {
  id: 'C1' | 'C2' | 'C3';
  title: string;
  subtitle: string;
  track: string;
  status: ChallengeStatus;
  revealed: boolean;
  description: string;
  targetAttribute?: string;
  targetSelector?: string;
  requiredValue?: string;
  completedAt?: number;
  mutationPayload?: string;
  twistRevealed?: string;
}

export interface ChallengeState {
  phaseTitle: string;
  revealedCount: number;
  totalCount: number;
  track: string;
  items: {
    C1: ChallengeItem;
    C2: ChallengeItem;
    C3: ChallengeItem;
  };
}

export interface DiscoveredClues {
  transmission: boolean;
  key: boolean;
  anomaly: boolean;
}

export interface CompletedStages {
  transmission: boolean;
  key: boolean;
  anomaly: boolean;
}

export interface MissionState {
  schemaVersion: number;
  missionId: string;
  revision: number;
  startedAt: number;
  discoveredClues: DiscoveredClues;
  completedStages: CompletedStages;
  currentPhase: SignalPhase;
  phaseSecondsRemaining: number;
  phaseProgress: number; // 0 to 100%
  cipherDecoded: boolean;
  keyDiscovered: boolean;
  anomalyConfirmed: boolean;
  challenges: ChallengeState;
  unlockStatus: VaultState;
  lastUpdatedAt: number;
  unlockedAt?: number;
  error?: string | null;
}

export type MissionAction =
  | { type: 'START_MISSION' }
  | { type: 'DISCOVER_KEY' }
  | { type: 'CONFIRM_ANOMALY'; code: string }
  | { type: 'COMPLETE_CHALLENGE'; challengeId: 'C1'; attribute: string; value: string; timestamp?: number }
  | { type: 'DECODE_CIPHER'; plaintext: string }
  | { type: 'START_VERIFICATION' }
  | { type: 'UNLOCK_VAULT' }
  | { type: 'FAIL_VERIFICATION'; error: string }
  | { type: 'RETRY_SEQUENCE' }
  | { type: 'RESET_MISSION'; newMissionId?: string; startedAt?: number }
  | { type: 'SYNC_STATE'; state: MissionState }
  | { type: 'UPDATE_TEMPORAL_PHASE'; phase: SignalPhase; secondsRemaining: number; progress: number }
  | { type: 'JUDGE_SOLVE_ALL' };

export interface MissionContextValue {
  state: MissionState;
  currentRole: MissionRole | null;
  connectedTabs: number;
  isAudioEnabled: boolean;
  toggleAudio: () => void;
  setRole: (role: MissionRole | null) => void;
  startMission: () => void;
  discoverKey: () => void;
  confirmAnomaly: (code: string) => { success: boolean; message: string };
  completeChallenge: (challengeId: 'C1', attribute: string, value: string) => boolean;
  decodeCipher: (plaintext: string) => boolean;
  submitFinalVault: (answer: string) => Promise<{ success: boolean; message: string }>;
  retrySequence: () => void;
  resetMission: () => void;
  triggerJudgeSolve: () => void;
}

