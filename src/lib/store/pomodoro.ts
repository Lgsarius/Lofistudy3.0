/* eslint-disable */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  startTime: number | null;
  settings: PomodoroSettings;
  setIsRunning: (isRunning: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTimeLeft: (timeLeft: number) => void;
  setSessionsCompleted: (sessions: number) => void;
  setStartTime: (time: number | null) => void;
  updateSettings: (settings: Partial<PomodoroSettings>) => void;
  resetTimer: () => void;
  syncTimerState: () => void;
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
      startTime: null,
      settings: defaultSettings,
      setIsRunning: (isRunning) => {
        if (isRunning) {
          set({ isRunning, startTime: Date.now() });
        } else {
          set({ isRunning, startTime: null });
        }
      },
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
        set({ mode, timeLeft: newTimeLeft, startTime: null, isRunning: false });
      },
      setTimeLeft: (timeLeft) => set({ timeLeft }),
      setSessionsCompleted: (sessionsCompleted) => set({ sessionsCompleted }),
      setStartTime: (startTime) => set({ startTime }),
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
        set({ timeLeft: newTimeLeft, isRunning: false, startTime: null });
      },
      syncTimerState: () => {
        const { startTime, timeLeft, isRunning } = get();
        if (isRunning && startTime) {
          const now = Date.now();
          const elapsedSeconds = Math.floor((now - startTime) / 1000);
          const newTimeLeft = Math.max(0, timeLeft - elapsedSeconds);
          set({ timeLeft: newTimeLeft, startTime: now });
        }
      },
    }),
    {
      name: 'lofistudy-pomodoro',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Convert lastTickTime to startTime if it exists
          const state = persistedState as PomodoroState;
          return {
            ...state,
            startTime: state.isRunning ? Date.now() : null,
            settings: {
              ...defaultSettings,
              ...state.settings,
            },
          };
        }
        return persistedState as PomodoroState;
      },
    }
  )
); 