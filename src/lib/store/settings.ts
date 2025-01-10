import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const wallpapers = [
  '/wallpapers/lofi-1.jpg',
  '/wallpapers/lofi-2.jpg',
  '/wallpapers/lofi-3.jpg',
  '/wallpapers/lofi-4.jpg',
];

export const videoWallpapers = [
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Rain.mp4',
    title: 'Rain',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train.mp4',
    title: 'Train',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Classroom.mp4',
    title: 'Classroom',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Autumn.mp4',
    title: 'Autumn',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Night.mp4',
    title: 'Night',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Skyrim.mp4',
    title: 'Skyrim',
    author: 'Skyrim'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Train2.mp4',
    title: 'Train 2',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Chillroom.mp4',
    title: 'Chill Room',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/cables.mp4',
    title: 'Cables',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/winter.mp4',
    title: 'Winter',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/study_girl.mp4',
    title: 'Study Girl',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/coffee.mp4',
    title: 'Coffee',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Minecraft.mp4',
    title: 'Minecraft',
    author: 'Mojang'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Darkroom.mp4',
    title: 'Dark Room',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Snowtrain.mp4',
    title: 'Snow Train',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/Garden.mp4',
    title: 'Garden',
    author: 'Lo-Fi.study'
  },
  {
    url: 'https://lofistudy.fra1.cdn.digitaloceanspaces.com/backgrounds/japannight.mp4',
    title: 'Japan Night',
    author: 'Lo-Fi.study'
  }
];

export const onlineWallpapers = [
  {
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1920&auto=format&fit=crop',
    title: 'Coding in the Night',
    author: 'Florian Olivo',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1483000805330-4eaf0a0d82da?q=80&w=1920&auto=format&fit=crop',
    title: 'Cozy Room',
    author: 'Toa Heftiba',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1920&auto=format&fit=crop',
    title: 'Workspace',
    author: 'Lauren Mancke',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1501139083538-0139583c060f?q=80&w=1920&auto=format&fit=crop',
    title: 'Night City',
    author: 'Orfeas Green',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1493246507139-91e8fad9978e?q=80&w=1920&auto=format&fit=crop',
    title: 'Peaceful Mountains',
    author: 'Dino Reichmuth',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1494500764479-0c8f5abbcb8a?q=80&w=1920&auto=format&fit=crop',
    title: 'Starry Night',
    author: 'Nathan Anderson',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1434725039720-aaad6dd32dfe?q=80&w=1920&auto=format&fit=crop',
    title: 'Foggy Forest',
    author: 'Tim Swaan',
    source: 'Unsplash'
  },
  {
    url: 'https://images.unsplash.com/photo-1507090960745-b32f65d3113a?q=80&w=1920&auto=format&fit=crop',
    title: 'Study Room',
    author: 'Patrick Tomasso',
    source: 'Unsplash'
  }
];

interface SettingsState {
  theme: 'dark' | 'light';
  accentColor: string;
  wallpaper: string;
  isVideoWallpaper: boolean;
  musicVolume: number;
  notificationVolume: number;
  pomodoroWorkDuration: number;
  pomodoroBreakDuration: number;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  setWallpaper: (wallpaper: string, isVideo?: boolean) => void;
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
      isVideoWallpaper: false,
      musicVolume: 50,
      notificationVolume: 70,
      pomodoroWorkDuration: 25,
      pomodoroBreakDuration: 5,
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      setWallpaper: (wallpaper, isVideo = false) => set({ wallpaper, isVideoWallpaper: isVideo }),
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