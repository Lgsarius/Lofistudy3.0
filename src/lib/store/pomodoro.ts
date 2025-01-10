import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimerMode = 'work' | 'break' | 'long-break';

interface PomodoroSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
  soundEnabled: boolean;
  autoStartBreaks: boolean;
  autoStartPomodoros: boolean;
}

interface PomodoroState {
  isRunning: boolean;
  mode: TimerMode;
  timeLeft: number;
  sessionsCompleted: number;
  lastTickTime: number | null;
  settings: PomodoroSettings;
  setIsRunning: (isRunning: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTimeLeft: (timeLeft: number) => void;
  setSessionsCompleted: (sessions: number) => void;
  setLastTickTime: (time: number | null) => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  resetTimer: () => void;
}

const defaultSettings: PomodoroSettings = {
  workDuration: 25 * 60, // 25 minutes in seconds
  breakDuration: 5 * 60, // 5 minutes in seconds
  longBreakDuration: 15 * 60, // 15 minutes in seconds
  sessionsUntilLongBreak: 4,
  soundEnabled: true,
  autoStartBreaks: false,
  autoStartPomodoros: false,
};

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set, get) => ({
      isRunning: false,
      mode: 'work',
      timeLeft: defaultSettings.workDuration,
      sessionsCompleted: 0,
      lastTickTime: null,
      settings: defaultSettings,
      setIsRunning: (isRunning) => set({ isRunning }),
      setMode: (mode) => {
        const { settings } = get();
        let newTimeLeft;
        switch (mode) {
          case 'work':
            newTimeLeft = settings.workDuration;
            break;
          case 'break':
            newTimeLeft = settings.breakDuration;
            break;
          case 'long-break':
            newTimeLeft = settings.longBreakDuration;
            break;
        }
        set({ mode, timeLeft: newTimeLeft });
      },
      setTimeLeft: (timeLeft) => set({ timeLeft }),
      setSessionsCompleted: (sessionsCompleted) => set({ sessionsCompleted }),
      setLastTickTime: (lastTickTime) => set({ lastTickTime }),
      updateSettings: (newSettings) => 
        set((state) => ({ 
          settings: { ...state.settings, ...newSettings },
          timeLeft: state.mode === 'work' ? 
            (newSettings.workDuration ?? state.settings.workDuration) :
            state.mode === 'break' ?
              (newSettings.breakDuration ?? state.settings.breakDuration) :
              (newSettings.longBreakDuration ?? state.settings.longBreakDuration)
        })),
      resetTimer: () => {
        const { settings, mode } = get();
        const newTimeLeft = mode === 'work' ? 
          settings.workDuration : 
          mode === 'break' ? 
            settings.breakDuration : 
            settings.longBreakDuration;
        set({ timeLeft: newTimeLeft, isRunning: false, lastTickTime: null });
      },
    }),
    {
      name: 'lofistudy-pomodoro',
    }
  )
); 