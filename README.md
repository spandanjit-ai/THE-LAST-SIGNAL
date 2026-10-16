# THE LAST SIGNAL — Multi-Tab Cryptographic Browser Mystery

> **Track B: Mystery Box** | Frontend Vibe Codeathon  
> *"Three tabs. Three clues. One last transmission."*

---

## 🛰️ Overview

**THE LAST SIGNAL** is a cinematic, science-fiction multi-tab browser mystery built for the Frontend Vibe Codeathon.
The player investigates an encrypted classified transmission whose fragments and keys are distributed across three distinct browser tabs:
1. **Terminal 1 (`/mission?role=transmission`)**: Displays the raw Caesar ciphertext (`VJG NCUV UKIPCN`), provides an interactive frequency rotation decoder, and houses the final temporal vault terminal.
2. **Terminal 2 (`/mission?role=key`)**: Intercepts deep-space orbital carrier telemetry to extract the shift key (`SHIFT -2` backward) and automatically synchronizes it across all peer terminals.
3. **Terminal 3 (`/mission?role=anomaly`)**: Emits a DOM anomaly packet. Players inspect the Document Object Model using browser DevTools (`F12`), locate the designated `#anomaly-node` element, extract the `data-transmission-anomaly` token (`SIG-7749-OMEGA`), and verify it in the UI.

The mission concludes when all clues are gathered, the transmission is decrypted to **`THE LAST SIGNAL`**, and the confirmation code is transmitted during the authoritative **STABLE** signal resonance window. This triggers a synchronized vault unlock across all open browser windows accompanied by a particle reveal and recovered classified transmission log.

---

## 🛠️ Tech Stack & Mechanics

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS with custom sci-fi dark palette (`space-950`, electric `cyan`, ultraviolet `violet`, amber) and CRT scanlines
- **Cross-Tab Synchronization**: Primary `BroadcastChannel` with `localStorage` storage-event fallback
- **Deterministic Temporal Phase Engine**: Authoritative 30s cyclic timeline (`SEARCHING` -> `ALIGNING` -> `STABLE`) shared deterministically across all tabs
- **Cryptographic Verification**: Web Crypto API SHA-256 validation
- **Procedural Audio**: Native Web Audio API synthesizer for tactile terminal feedback with zero external asset dependencies

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Run

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run engine test suite (Vitest)
npm test

# Build for production
npm run build
```

---

## 🧪 Testing Multi-Tab Gameplay

1. Start the dev server with `npm run dev` (opens `http://localhost:3000`).
2. On the landing screen, click **START INVESTIGATION (OPEN 3 TABS)**.
   - This automatically launches Tab 1 (`?role=transmission`), Tab 2 (`?role=key`), and Tab 3 (`?role=anomaly`).
3. In **Tab 2 (Key)**, click **INITIATE TELEMETRY SCAN** to discover the shift offset. Notice the key instantly synchronizes with Tab 1 and Tab 3.
4. In **Tab 3 (Anomaly)**, open DevTools (`F12`), inspect `#anomaly-node`, copy the token `SIG-7749-OMEGA`, and click **CONFIRM**. Notice the anomaly status updates across all tabs.
5. In **Tab 1 (Transmission)**, adjust the Caesar shift slider to 2 (or backward rotation) until `THE LAST SIGNAL` appears, then click **LOCK IN DECRYPTED SIGNAL**.
6. Observe the **Signal Phase Monitor**. Wait until it enters the **STABLE RESONANCE** window (pulsing green/cyan), then click **TRANSMIT**.
7. The vault unlocks simultaneously across all 3 browser tabs with the cinematic reveal animation!

---

## 👥 Teammate Integration Contract

For the frontend teammate working on PRD A:
The puzzle engine is encapsulated in `src/hooks/useMission.ts`. It provides:

```typescript
const {
  state,              // Current MissionState (clues, stages, revision, unlockStatus)
  role,               // Current tab role ('transmission' | 'key' | 'anomaly')
  phaseInfo,          // Live temporal phase { phase, progressPct, remainingInPhaseMs, isStable }
  tabId,              // Unique identifier for current tab
  isVerifying,        // Boolean indicating verification in progress
  startMission,       // Trigger mission start
  discoverClue,       // (clueId: ClueId) => void
  decodeCipher,       // (decodedText: string, shiftUsed: number) => void
  confirmAnomalyClue, // (token: string) => boolean
  submitFinalAnswer,  // (answer: string) => Promise<boolean>
  retryTimedSequence, // Clear failed attempt and retry
  resetMission,       // Purge progress and broadcast fresh run
} = useMission(role);
```
