import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Sound {
  id: string;
  isPlaying: boolean;
  volume: number;
}

interface ASMRState {
  sounds: Sound[];
  updateSound: (id: string, updates: Partial<Sound>) => void;
  resetAllSounds: () => void;
}

const defaultSounds: Sound[] = [
  { id: 'blizzard', isPlaying: false, volume: 50 },
  { id: 'coffee', isPlaying: false, volume: 50 },
  { id: 'fire', isPlaying: false, volume: 50 },
  { id: 'keyboard', isPlaying: false, volume: 50 },
  { id: 'ocean', isPlaying: false, volume: 50 },
  { id: 'rain', isPlaying: false, volume: 50 },
  { id: 'static_audio_tick', isPlaying: false, volume: 50 },
  { id: 'waterstream', isPlaying: false, volume: 50 },
];

export const useASMRStore = create<ASMRState>()(
  persist(
    (set) => ({
      sounds: defaultSounds,
      updateSound: (id, updates) =>
        set((state) => ({
          sounds: state.sounds.map((sound) =>
            sound.id === id ? { ...sound, ...updates } : sound
          ),
        })),
      resetAllSounds: () =>
        set((state) => ({
          sounds: state.sounds.map((sound) => ({
            ...sound,
            isPlaying: false,
          })),
        })),
    }),
    {
      name: 'lofistudy-asmr',
    }
  )
); 