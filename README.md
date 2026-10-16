# THE LAST SIGNAL // Track B: Mystery Box

> **"Three tabs. Three clues. One last transmission."**

A cinematic, science-fiction, multi-tab browser mystery built for the Frontend Vibe Codeathon.

---

## 🛰️ Overview

The player intercepts a mysterious, fractured digital transmission. Its contents are encrypted, decentralized, and distributed across three browser tabs. To uncover the truth, the player must:
1. **Transmission Terminal (`/mission?role=transmission`)**: Analyze an intercepted audio frequency spectrogram and decode the raw Caesar ciphertext (`VJG NCUV UKIPCN`) using an interactive shift console.
2. **Key Terminal (`/mission?role=key`)**: Tune a harmonic resonance slider to recover the secret cipher shift (`ROT-3` / `3 positions backward`) and temporal directive fragment.
3. **Anomaly Terminal (`/mission?role=anomaly`)**: Use browser Developer Tools to inspect a real DOM element (`#transmission-anomaly-node`) for a hidden `data-signal-anomaly` attribute (`SIG-7749-OMEGA`) and authenticate the token.
4. **Temporal Security Gate**: The digital vault operates on a deterministic, synchronized cycle (`SEARCHING` → `ALIGNING` → `STABLE`). Submissions are only authorized during the **`STABLE`** frequency window.
5. **The Final Vault Reveal**: Unlocks a layered concentric SVG geometric vault with SHA-256 verification, celebratory confetti, procedural Web Audio SFX, and playback of the decrypted transmission: **`THE LAST SIGNAL`**.

---

## 🛠️ Tech Stack & Architecture

- **React 18 & TypeScript**: Component-driven architecture with strict typing.
- **Tailwind CSS**: Custom sci-fi palette (near-black `#020408`, electric cyan `#00f0ff`, ultraviolet purple `#8b5cf6`, restrained amber `#f59e0b`).
- **BroadcastChannel API + localStorage fallback**: Real-time bidirectional cross-tab synchronization with monotonic revision ordering.
- **Web Crypto API**: Real SHA-256 digest validation of decrypted plaintext.
- **Procedural Web Audio API**: 100% self-contained audio synthesizer for tactical clicks, radar pings, and vault unlock surges (zero external asset files needed, completely offline, includes mute toggle).
- **Vite 6**: Fast build tooling and instant HMR.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🎮 Multi-Tab Demonstration Walkthrough

1. Open `http://localhost:5173/`.
2. Click **"LAUNCH ALL 3 MISSION TABS"** (or open 3 separate browser windows/tabs):
   - Tab 1: `http://localhost:5173/?role=transmission`
   - Tab 2: `http://localhost:5173/?role=key`
   - Tab 3: `http://localhost:5173/?role=anomaly`
3. Notice the top navigation bar updates automatically in all tabs: **`3 TABS LINKED // BROADCAST ACTIVE`**.
4. In Tab 2 (**Key**), tune the resonance slider to `1420.4 MHz` and click **"Decrypt Key Record"**. Notice Tab 1 and Tab 3 instantly update to show Key status confirmed!
5. In Tab 3 (**Anomaly**), press `F12` / `Cmd+Option+I` to inspect `#transmission-anomaly-node`. Find `data-signal-anomaly="SIG-7749-OMEGA"`. Enter the code in the input and click **"Authenticate Clue"**. All tabs instantly synchronize!
6. In Tab 1 (**Transmission**), slide the Caesar shift offset to `-3`. The ciphertext `VJG NCUV UKIPCN` resolves to `THE LAST SIGNAL`. Click **"Lock In Decrypted Signal"**.
7. In the Vault modal, wait for the temporal clock to reach **`STABLE`** (countdown is synchronized across tabs to the exact second). Submit `THE LAST SIGNAL`.
8. Watch the concentric rings spin and unlock, revealing the classified transmission!
