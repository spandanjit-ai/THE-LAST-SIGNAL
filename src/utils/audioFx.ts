class SoundEffects {
  private ctx: AudioContext | null = null;
  public isMuted = false;

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (typeof window === 'undefined') return null;

    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public playBeep(freq = 600, duration = 0.06, type: OscillatorType = 'sine'): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio not permitted or interrupted
    }
  }

  public playClick(): void {
    this.playBeep(1200, 0.03, 'triangle');
  }

  public playKeyFound(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, index) => {
        setTimeout(() => {
          this.playBeep(freq, 0.15, 'sine');
        }, index * 80);
      });
    } catch {
      // ignore
    }
  }

  public playError(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      this.playBeep(180, 0.2, 'sawtooth');
      setTimeout(() => this.playBeep(140, 0.25, 'sawtooth'), 120);
    } catch {
      // ignore
    }
  }

  public playVaultUnlock(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, i) => {
        setTimeout(() => {
          this.playBeep(freq, 0.5, 'sine');
        }, i * 140);
      });
    } catch {
      // ignore
    }
  }
}

export const soundEffects = new SoundEffects();
