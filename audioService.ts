
/**
 * Audio Service for Ludo Pro
 * Handles pre-loading and playing sound effects for immersive gameplay.
 */

const SOUND_URLS = {
  DICE_ROLL: 'https://assets.mixkit.co/active_storage/sfx/2004/2004-preview.mp3',
  TOKEN_MOVE: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  TOKEN_KILL: 'https://assets.mixkit.co/active_storage/sfx/253/253-preview.mp3',
  WINNER: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  EXTRA_TURN: 'https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3',
};

class AudioService {
  private sounds: Record<string, HTMLAudioElement> = {};
  private enabled: boolean = true;

  constructor() {
    // Only initialize in browser environment
    if (typeof window !== 'undefined') {
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[key] = audio;
      });
    }
  }

  play(soundKey: keyof typeof SOUND_URLS) {
    if (!this.enabled) return;
    const sound = this.sounds[soundKey];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.debug('Audio playback blocked until user interaction', e));
    }
  }

  toggle(state?: boolean) {
    this.enabled = state !== undefined ? state : !this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const audioService = new AudioService();
