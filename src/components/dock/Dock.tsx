'use client';

import { useRef, useState, useEffect } from 'react';
import { FaClock, FaMusic, FaStickyNote, FaCog, FaComment, FaWaveSquare, FaListUl } from 'react-icons/fa';
import { useWindowsStore } from '@/lib/store/windows';
import { useSettingsStore } from '@/lib/store/settings';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const apps = [
  {
    id: 'pomodoro',
    icon: FaClock,
    title: 'Pomodoro Timer',
    defaultSize: { width: 500, height: 600 },
  },
  {
    id: 'music',
    icon: FaMusic,
    title: 'Music Player',
    defaultSize: { width: 600, height: 800 },
  },
  {
    id: 'asmr',
    icon: FaWaveSquare,
    title: 'ASMR Mixer',
    defaultSize: { width: 800, height: 600 },
  },
  {
    id: 'todo',
    icon: FaListUl,
    title: 'Todo List',
    defaultSize: { width: 400, height: 600 },
  },
  {
    id: 'notes',
    icon: FaStickyNote,
    title: 'Notes',
    defaultSize: { width: 600, height: 700 },
  },
  {
    id: 'chat',
    icon: FaComment,
    title: 'Chat',
    defaultSize: { width: 600, height: 700 },
  },
  {
    id: 'settings',
    icon: FaCog,
    title: 'Settings',
    defaultSize: { width: 800, height: 600 },
  },
];

export function Dock() {
  const { windows, addWindow, minimizeWindow, unminimizeWindow } = useWindowsStore();
  const { theme, accentColor } = useSettingsStore();
  const [bounds, setBounds] = useState({ width: 1920, height: 1080 });
  const dockRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof globalThis.window !== 'undefined') {
      const updateBounds = () => {
        setBounds({
          width: globalThis.window.innerWidth,
          height: globalThis.window.innerHeight,
        });
      };

      updateBounds();
      globalThis.window.addEventListener('resize', updateBounds);
      return () => globalThis.window.removeEventListener('resize', updateBounds);
    }
  }, []);

  const handleAppClick = (app: typeof apps[0]) => {
    // Check if app is already open
    const existingWindow = windows.find((w) => w.type === app.id);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        unminimizeWindow(existingWindow.id);
      } else {
        minimizeWindow(existingWindow.id);
      }
      return;
    }

    // Calculate initial window position
    const dockRect = dockRef.current?.getBoundingClientRect();
    const centerX = bounds.width / 2;
    const centerY = (bounds.height - (dockRect?.height || 0)) / 2;
    
    // Create new window with scaled dimensions
    const scaledWidth = Math.min(app.defaultSize.width, bounds.width * 0.8);
    const scaledHeight = Math.min(app.defaultSize.height, (bounds.height - (dockRect?.height || 0)) * 0.8);
    
    addWindow({
      id: uuidv4(),
      title: app.title,
      type: app.id,
      isMinimized: false,
      isMaximized: false,
      position: {
        x: Math.max(0, Math.min(centerX - scaledWidth / 2, bounds.width - scaledWidth)),
        y: Math.max(0, Math.min(centerY - scaledHeight / 2, bounds.height - scaledHeight - (dockRect?.height || 0))),
      },
      size: {
        width: scaledWidth,
        height: scaledHeight,
      },
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center p-2 z-50" ref={dockRef}>
      <motion.div
        className={`${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-2xl border ${theme === 'dark' ? 'border-white/20' : 'border-black/20'} rounded-2xl p-2 shadow-2xl`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <div className="flex items-center space-x-2 md:space-x-3">
          {apps.map((app) => {
            const Icon = app.icon;
            const isOpen = windows.some((w) => w.type === app.id);
            const isMinimized = windows.some((w) => w.type === app.id && w.isMinimized);

            return (
              <motion.button
                key={app.id}
                onClick={() => handleAppClick(app)}
                whileHover={{ 
                  scale: 1.1,
                  y: -8,
                }}
                whileTap={{ scale: 0.95 }}
                className="relative group"
              >
                {/* App Icon */}
                <div
                  className={`w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center transition-all
                    ${isOpen 
                      ? isMinimized
                        ? `${theme === 'dark' ? 'bg-white/10 text-white/60' : 'bg-black/10 text-black/60'}`
                        : `bg-[${accentColor}]/30 ${theme === 'dark' ? 'text-white' : 'text-black'}` 
                      : `${theme === 'dark' ? 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white' : 'bg-black/10 text-black/80 hover:bg-black/20 hover:text-black'}`
                    }
                  `}
                  style={{
                    backgroundColor: isOpen && !isMinimized ? `${accentColor}30` : undefined,
                  }}
                >
                  <Icon className="w-6 h-6 md:w-7 md:h-7" />
                </div>

                {/* App Indicator */}
                <AnimatePresence>
                  {isOpen && !isMinimized && (
                    <motion.div 
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                    >
                      <div 
                        className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full"
                        style={{ backgroundColor: accentColor }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  <div className={`${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} ${theme === 'dark' ? 'text-white' : 'text-black'} text-xs md:text-sm px-2 py-1 rounded-lg whitespace-nowrap shadow-xl`}>
                    {app.title}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
} 