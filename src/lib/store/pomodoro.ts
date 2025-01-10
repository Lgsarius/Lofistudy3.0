import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TimerMode = 'work' | 'break' | 'long-break';

interface PomodoroState {
  isRunning: boolean;
  mode: TimerMode;
  timeLeft: number;
  sessionsCompleted: number;
  lastTickTime: number | null;
  setIsRunning: (isRunning: boolean) => void;
  setMode: (mode: TimerMode) => void;
  setTimeLeft: (timeLeft: number) => void;
  setSessionsCompleted: (sessions: number) => void;
  setLastTickTime: (time: number | null) => void;
}

export const usePomodoroStore = create<PomodoroState>()(
  persist(
    (set) => ({
      isRunning: false,
      mode: 'work',
      timeLeft: 25 * 60, // 25 minutes in seconds
      sessionsCompleted: 0,
      lastTickTime: null,
      setIsRunning: (isRunning) => set({ isRunning }),
      setMode: (mode) => set({ mode }),
      setTimeLeft: (timeLeft) => set({ timeLeft }),
      setSessionsCompleted: (sessionsCompleted) => set({ sessionsCompleted }),
      setLastTickTime: (lastTickTime) => set({ lastTickTime }),
    }),
    {
      name: 'lofistudy-pomodoro',
    }
  )
); 