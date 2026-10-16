export type MissionRole = 'transmission' | 'key' | 'anomaly';

export type SignalPhase = 'SEARCHING' | 'ALIGNING' | 'STABLE';

export type UnlockStatus = 'LOCKED' | 'VERIFYING' | 'UNLOCKED' | 'FAILED';

export type ClueId = 
  | 'clue_cipher_text' 
  | 'clue_key_shift' 
  | 'clue_anomaly_metadata' 
  | 'clue_decoded_message';

export type StageId = 
  | 'stage_1_transmission'
  | 'stage_2_key'
  | 'stage_3_anomaly'
  | 'stage_4_temporal'
  | 'stage_5_vault';

export interface MissionState {
  schemaVersion: number;
  missionId: string;
  revision: number;
  startedAt: number;
  discoveredClues: Record<ClueId, boolean>;
  completedStages: StageId[];
  currentPhase: SignalPhase;
  phaseStartedAt: number;
  unlockStatus: UnlockStatus;
  decodedMessage: string | null;
  shiftUsed: number | null;
  anomalyConfirmed: boolean;
  anomalyToken: string | null;
  finalAnswer: string | null;
  unlockedAt: number | null;
  lastUpdatedAt: number;
  lastAction: string | null;
  lastError: string | null;
}

export type MissionAction =
  | { type: 'START_MISSION'; missionId?: string }
  | { type: 'DISCOVER_CLUE'; clueId: ClueId }
  | { type: 'COMPLETE_STAGE'; stageId: StageId }
  | { type: 'DECODE_CIPHER'; decodedText: string; shiftUsed: number }
  | { type: 'CONFIRM_ANOMALY_CLUE'; token: string }
  | { type: 'SUBMIT_FINAL_ANSWER'; answer: string; currentPhaseAtSubmit: SignalPhase }
  | { type: 'RETRY_TIMED_SEQUENCE' }
  | { type: 'RESET_MISSION'; newMissionId?: string }
  | { type: 'SYNC_STATE'; state: MissionState };

export interface SyncMessage {
  protocol: 'THE_LAST_SIGNAL_V1';
  type: 'SYNC_STATE' | 'HEARTBEAT' | 'REQUEST_STATE' | 'RESET';
  senderTabId: string;
  role: MissionRole;
  state?: MissionState;
  timestamp: number;
}
