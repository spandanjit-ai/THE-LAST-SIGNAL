import { SoundFX } from './audio';

let currentUtterance: SpeechSynthesisUtterance | null = null;

export const RadioVoice = {
  speak(text: string, onEnd?: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Procedural intercom beep
    SoundFX.playSuccessPing();

    const utterance = new SpeechSynthesisUtterance(text);
    currentUtterance = utterance;

    // Pitch and rate for robotic / intercom deep space telemetry transmission
    utterance.rate = 0.88;
    utterance.pitch = 0.65;
    utterance.volume = 1.0;

    // Try finding an English voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(
      (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Daniel') || v.name.includes('Alex'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      SoundFX.playTick();
      if (onEnd) onEnd();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
  },

  stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      currentUtterance = null;
    }
  },

  isSpeaking() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return false;
    return window.speechSynthesis.speaking || currentUtterance !== null;
  },
};
