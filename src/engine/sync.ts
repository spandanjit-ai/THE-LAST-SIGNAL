import { MissionState } from './missionTypes';
import { STORAGE_KEY } from './storage';

export const CHANNEL_NAME = 'THE_LAST_SIGNAL_BROADCAST_v1';

export type SyncMessage =
  | { type: 'STATE_UPDATE'; senderId: string; state: MissionState }
  | { type: 'PING'; senderId: string; timestamp: number }
  | { type: 'PONG'; senderId: string; timestamp: number }
  | { type: 'MISSION_RESET'; senderId: string; newMissionId: string; startedAt: number };

export interface SyncManager {
  broadcastState: (state: MissionState) => void;
  broadcastReset: (newMissionId: string, startedAt: number) => void;
  sendPing: () => void;
  destroy: () => void;
}

export function createSyncManager(
  localTabId: string,
  onStateReceived: (state: MissionState) => void,
  onResetReceived: (newMissionId: string, startedAt: number) => void,
  onTabCountUpdated: (count: number) => void
): SyncManager {
  let broadcastChannel: BroadcastChannel | null = null;
  const activeTabs = new Map<string, number>();

  // Heartbeat cleanup interval
  const heartbeatInterval = setInterval(() => {
    const now = Date.now();
    let changed = false;
    for (const [id, lastSeen] of activeTabs.entries()) {
      if (now - lastSeen > 6000) {
        activeTabs.delete(id);
        changed = true;
      }
    }
    if (changed) {
      onTabCountUpdated(Math.max(1, activeTabs.size + 1));
    }
  }, 3000);

  function handleMessage(msg: SyncMessage) {
    if (!msg || msg.senderId === localTabId) return;

    // Track active tabs
    activeTabs.set(msg.senderId, Date.now());
    onTabCountUpdated(activeTabs.size + 1);

    switch (msg.type) {
      case 'STATE_UPDATE':
        if (msg.state && msg.state.schemaVersion) {
          onStateReceived(msg.state);
        }
        break;
      case 'PING':
        // Reply with pong
        postMessage({
          type: 'PONG',
          senderId: localTabId,
          timestamp: Date.now(),
        });
        break;
      case 'PONG':
        // Already recorded above
        break;
      case 'MISSION_RESET':
        onResetReceived(msg.newMissionId, msg.startedAt);
        break;
    }
  }

  function postMessage(msg: SyncMessage) {
    if (broadcastChannel) {
      try {
        broadcastChannel.postMessage(msg);
      } catch (err) {
        console.warn('[SYNC] BroadcastChannel failed, falling back to storage:', err);
      }
    }
  }

  // Initialize BroadcastChannel if supported
  if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    try {
      broadcastChannel = new BroadcastChannel(CHANNEL_NAME);
      broadcastChannel.onmessage = (event) => {
        handleMessage(event.data);
      };
    } catch (err) {
      console.warn('[SYNC] BroadcastChannel not supported:', err);
    }
  }

  // Storage event fallback for cross-tab communication
  function handleStorageEvent(event: StorageEvent) {
    if (event.key === STORAGE_KEY && event.newValue) {
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed && parsed.schemaVersion) {
          onStateReceived(parsed);
        }
      } catch {
        // Ignore JSON error
      }
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }

  // Send initial ping to discover other tabs
  postMessage({
    type: 'PING',
    senderId: localTabId,
    timestamp: Date.now(),
  });

  return {
    broadcastState: (state: MissionState) => {
      postMessage({
        type: 'STATE_UPDATE',
        senderId: localTabId,
        state,
      });
    },
    broadcastReset: (newMissionId: string, startedAt: number) => {
      postMessage({
        type: 'MISSION_RESET',
        senderId: localTabId,
        newMissionId,
        startedAt,
      });
    },
    sendPing: () => {
      postMessage({
        type: 'PING',
        senderId: localTabId,
        timestamp: Date.now(),
      });
    },
    destroy: () => {
      clearInterval(heartbeatInterval);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageEvent);
      }
    },
  };
}
