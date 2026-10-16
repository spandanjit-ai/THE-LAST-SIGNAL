// Web Audio API procedural sound synthesizer (100% self-contained, no external asset dependencies)

let audioCtx: AudioContext | null = null;
let isMuted: boolean = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const SoundFX = {
  setMuted(muted: boolean) {
    isMuted = muted;
  },

  isMuted() {
    return isMuted;
  },

  /** Subtle terminal key / dial tick */
  playTick() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.04, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  },

  /** Positive interactive action / clue discovery ping */
  playSuccessPing() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.06);

      gain.gain.setValueAtTime(0.06, now + i * 0.06);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + i * 0.06);
      osc.stop(now + i * 0.06 + 0.35);
    });
  },

  /** Anomaly scan harmonic radar pulse */
  playRadarPulse() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.4);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  },

  /** Error or desync warning */
  playWarning() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.07, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.26);
  },

  /** Vault unlocking sequence build up */
  playVaultUnlock() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    // Deep sub bass surge
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(55, now);
    subOsc.frequency.exponentialRampToValueAtTime(110, now + 1.2);
    subGain.gain.setValueAtTime(0.2, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.5);

    // Ethereal chord cascade
    [261.63, 329.63, 392.0, 523.25, 659.25, 1046.5].forEach((freq, idx) => {
      const chordOsc = ctx.createOscillator();
      const chordGain = ctx.createGain();
      chordOsc.type = 'sine';
      chordOsc.frequency.setValueAtTime(freq, now + 0.2 + idx * 0.08);

      chordGain.gain.setValueAtTime(0.05, now + 0.2 + idx * 0.08);
      chordGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

      chordOsc.connect(chordGain);
      chordGain.connect(ctx.destination);

      chordOsc.start(now + 0.2 + idx * 0.08);
      chordOsc.stop(now + 2.0);
    });
  },

  /** Cosmic Supernova Singularity Detonation SFX */
  playSupernova() {
    if (isMuted) return;
    const ctx = getAudioContext();
    if (!ctx) return;

    const now = ctx.currentTime;

    // 1. Inward gravitational pull (sub bass whoosh descending)
    const pullOsc = ctx.createOscillator();
    const pullGain = ctx.createGain();
    pullOsc.type = 'sine';
    pullOsc.frequency.setValueAtTime(120, now);
    pullOsc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
    pullGain.gain.setValueAtTime(0.01, now);
    pullGain.gain.linearRampToValueAtTime(0.2, now + 0.35);
    pullGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    pullOsc.connect(pullGain);
    pullGain.connect(ctx.destination);
    pullOsc.start(now);
    pullOsc.stop(now + 0.42);

    // 2. High-energy plasma blast
    const blastOsc = ctx.createOscillator();
    const blastGain = ctx.createGain();
    blastOsc.type = 'triangle';
    blastOsc.frequency.setValueAtTime(40, now + 0.36);
    blastOsc.frequency.exponentialRampToValueAtTime(1400, now + 0.5);
    blastOsc.frequency.exponentialRampToValueAtTime(80, now + 1.8);
    blastGain.gain.setValueAtTime(0.25, now + 0.36);
    blastGain.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
    blastOsc.connect(blastGain);
    blastGain.connect(ctx.destination);
    blastOsc.start(now + 0.36);
    blastOsc.stop(now + 2.3);

    // 3. Ethereal celestial resonance chords
    [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
      const harmOsc = ctx.createOscillator();
      const harmGain = ctx.createGain();
      harmOsc.type = 'sine';
      harmOsc.frequency.setValueAtTime(freq, now + 0.4 + idx * 0.05);
      harmGain.gain.setValueAtTime(0.08, now + 0.4 + idx * 0.05);
      harmGain.gain.exponentialRampToValueAtTime(0.001, now + 2.8);
      harmOsc.connect(harmGain);
      harmGain.connect(ctx.destination);
      harmOsc.start(now + 0.4 + idx * 0.05);
      harmOsc.stop(now + 3.0);
    });
  },
};

