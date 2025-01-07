import { create } from 'zustand';

interface Window {
  id: string;
  title: string;
  type: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex: number;
}

interface WindowsStore {
  windows: Window[];
  nextZIndex: number;
  addWindow: (window: Omit<Window, 'zIndex'>) => void;
  removeWindow: (id: string) => void;
  updateWindow: (id: string, updates: Partial<Window>) => void;
  minimizeWindow: (id: string) => void;
  unminimizeWindow: (id: string) => void;
  bringToFront: (id: string) => number;
}

export const useWindowsStore = create<WindowsStore>((set, get) => ({
  windows: [],
  nextZIndex: 10,

  addWindow: (window) => {
    set((state) => ({
      windows: [...state.windows, { ...window, zIndex: state.nextZIndex }],
      nextZIndex: state.nextZIndex + 1,
    }));
  },

  removeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
    }));
  },

  updateWindow: (id, updates) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, ...updates } : w
      ),
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
    }));
  },

  unminimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: false } : w
      ),
    }));
  },

  bringToFront: (id) => {
    const state = get();
    const window = state.windows.find((w) => w.id === id);
    if (!window) return state.nextZIndex;

    const newZIndex = state.nextZIndex;
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: newZIndex } : w
      ),
      nextZIndex: state.nextZIndex + 1,
    }));
    return newZIndex;
  },
})); 