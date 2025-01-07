import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const wallpapers = [
  '/wallpapers/lofi-1.jpg',
  '/wallpapers/lofi-2.jpg',
  '/wallpapers/lofi-3.jpg',
  '/wallpapers/lofi-4.jpg',
];

interface SettingsState {
  theme: 'dark' | 'light';
  accentColor: string;
  wallpaper: string;
  musicVolume: number;
  notificationVolume: number;
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  setWallpaper: (wallpaper: string) => void;
  setMusicVolume: (volume: number) => void;
  setNotificationVolume: (volume: number) => void;
  setPomodoroWorkDuration: (duration: number) => void;
  setPomodoroBreakDuration: (duration: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'dark',
      accentColor: '#FF9900',
      wallpaper: wallpapers[0],
      musicVolume: 50,
      notificationVolume: 70,
      pomodoroWorkDuration: 25,
      pomodoroBreakDuration: 5,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setWallpaper: (wallpaper) => set({ wallpaper }),
      setMusicVolume: (musicVolume) => set({ musicVolume }),
      setNotificationVolume: (notificationVolume) => set({ notificationVolume }),
      setPomodoroWorkDuration: (pomodoroWorkDuration) => set({ pomodoroWorkDuration }),
      setPomodoroBreakDuration: (pomodoroBreakDuration) => set({ pomodoroBreakDuration }),
    }),
    {
      name: 'lofistudy-settings',
    }
  )
); 