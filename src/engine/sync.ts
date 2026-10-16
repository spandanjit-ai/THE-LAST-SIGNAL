import { MissionState, SyncMessage, MissionRole } from './missionTypes';

export const SYNC_CHANNEL_NAME = 'THE_LAST_SIGNAL_SYNC_V1';
export const STORAGE_SYNC_KEY = 'the_last_signal_storage_event_v1';

export class MissionSyncManager {
  private channel: BroadcastChannel | null = null;
  private tabId: string;
  private role: MissionRole;
  private onStateReceived: (remoteState: MissionState) => void;
  private onResetReceived: (newMissionId: string) => void;
  private getLatestState: () => MissionState;
  private isDestroyed = false;
  private lastBroadcastRevision = -1;

  constructor(
    role: MissionRole,
    onStateReceived: (remoteState: MissionState) => void,
    onResetReceived: (newMissionId: string) => void,
    getLatestState: () => MissionState
  ) {
    this.role = role;
    this.tabId = `tab_${role}_${Math.random().toString(36).slice(2, 9)}_${Date.now()}`;
    this.onStateReceived = onStateReceived;
    this.onResetReceived = onResetReceived;
    this.getLatestState = getLatestState;

    this.initBroadcastChannel();
    this.initLocalStorageFallback();
    this.requestLatestStateFromPeers();
  }

  public getTabId(): string {
    return this.tabId;
  }

  private initBroadcastChannel(): void {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') {
      return;
    }

    try {
      this.channel = new BroadcastChannel(SYNC_CHANNEL_NAME);
      this.channel.onmessage = (event: MessageEvent<SyncMessage>) => {
        this.handleIncomingMessage(event.data);
      };
      this.channel.onmessageerror = (err) => {
        console.warn('[Sync] BroadcastChannel error:', err);
      };
    } catch (e) {
      console.warn('[Sync] BroadcastChannel failed to initialize, using storage fallback:', e);
    }
  }

  private initLocalStorageFallback(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('storage', this.handleStorageEvent);
  }

  private handleStorageEvent = (event: StorageEvent): void => {
    if (this.isDestroyed) return;

    if (event.key === STORAGE_SYNC_KEY && event.newValue) {
      try {
        const msg = JSON.parse(event.newValue) as SyncMessage;
        this.handleIncomingMessage(msg);
      } catch (e) {
        console.warn('[Sync] Failed to parse storage sync event:', e);
      }
    }
  };

  private handleIncomingMessage(msg: SyncMessage): void {
    if (!msg || msg.protocol !== 'THE_LAST_SIGNAL_V1') return;
    // Ignore self-broadcasts
    if (msg.senderTabId === this.tabId) return;

    switch (msg.type) {
      case 'REQUEST_STATE': {
        const currentState = this.getLatestState();
        if (currentState && currentState.revision > 1) {
          this.broadcastState(currentState, true);
        }
        break;
      }

      case 'SYNC_STATE': {
        if (msg.state) {
          this.onStateReceived(msg.state);
        }
        break;
      }

      case 'RESET': {
        if (msg.state?.missionId) {
          this.onResetReceived(msg.state.missionId);
        }
        break;
      }

      default:
        break;
    }
  }

  /**
   * Broadcast state update to all peer tabs.
   * Prevents duplicate broadcasts of the exact same revision.
   */
  public broadcastState(state: MissionState, force = false): void {
    if (this.isDestroyed) return;
    if (!force && state.revision === this.lastBroadcastRevision) return;

    this.lastBroadcastRevision = state.revision;

    const message: SyncMessage = {
      protocol: 'THE_LAST_SIGNAL_V1',
      type: 'SYNC_STATE',
      senderTabId: this.tabId,
      role: this.role,
      state,
      timestamp: Date.now(),
    };

    // 1. Send via BroadcastChannel
    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('[Sync] BroadcastChannel postMessage failed:', e);
      }
    }

    // 2. Storage event fallback for older browsers or cross-context syncing
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(message));
      } catch {
        // ignore quota errors
      }
    }
  }

  /**
   * Broadcast a reset signal across all tabs
   */
  public broadcastReset(newMissionId: string): void {
    if (this.isDestroyed) return;

    const message: SyncMessage = {
      protocol: 'THE_LAST_SIGNAL_V1',
      type: 'RESET',
      senderTabId: this.tabId,
      role: this.role,
      state: {
        missionId: newMissionId,
      } as MissionState,
      timestamp: Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch (e) {
        console.warn('[Sync] Reset broadcast failed:', e);
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(message));
      } catch {
        // ignore
      }
    }
  }

  /**
   * Ask active peer tabs for their current mission state
   */
  public requestLatestStateFromPeers(): void {
    const message: SyncMessage = {
      protocol: 'THE_LAST_SIGNAL_V1',
      type: 'REQUEST_STATE',
      senderTabId: this.tabId,
      role: this.role,
      timestamp: Date.now(),
    };

    if (this.channel) {
      try {
        this.channel.postMessage(message);
      } catch {
        // ignore
      }
    }

    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        localStorage.setItem(STORAGE_SYNC_KEY, JSON.stringify(message));
      } catch {
        // ignore
      }
    }
  }

  public destroy(): void {
    this.isDestroyed = true;
    if (this.channel) {
      try {
        this.channel.close();
      } catch {
        // ignore
      }
      this.channel = null;
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', this.handleStorageEvent);
    }
  }
}
