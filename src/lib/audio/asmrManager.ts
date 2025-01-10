class ASMRAudioManager {
  private audioElements: { [key: string]: HTMLAudioElement } = {};

  initialize(id: string, file: string) {
    if (!this.audioElements[id]) {
      const audio = new Audio(file);
      audio.loop = true;
      this.audioElements[id] = audio;
    }
    return this.audioElements[id];
  }

  play(id: string, volume: number) {
    const audio = this.audioElements[id];
    if (audio) {
      audio.volume = volume / 100;
      audio.play().catch(console.error);
    }
  }

  pause(id: string) {
    const audio = this.audioElements[id];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(id: string, volume: number) {
    const audio = this.audioElements[id];
    if (audio) {
      audio.volume = volume / 100;
    }
  }

  stopAll() {
    Object.values(this.audioElements).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  getAudio(id: string) {
    return this.audioElements[id];
  }
}

// Create a singleton instance
export const asmrManager = new ASMRAudioManager(); 