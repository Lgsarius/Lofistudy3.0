'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog, FaCoffee, FaBrain, FaCheck } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';
import { motion, AnimatePresence } from 'framer-motion';

type TimerMode = 'work' | 'break' | 'long-break';

interface TimerSettings {
  workDuration: number;
  breakDuration: number;
  longBreakDuration: number;
  sessionsUntilLongBreak: number;
}

export function PomodoroTimer() {
  const { theme, accentColor } = useSettingsStore();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<TimerMode>('work');
  const [sessions, setSessions] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TimerSettings>({
    workDuration: 25,
    breakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
  });
  const [progress, setProgress] = useState(0);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getInitialTime = useCallback((mode: TimerMode) => {
    switch (mode) {
      case 'work':
        return settings.workDuration * 60;
      case 'break':
        return settings.breakDuration * 60;
      case 'long-break':
        return settings.longBreakDuration * 60;
    }
  }, [settings]);

  const reset = useCallback(() => {
    setTimeLeft(getInitialTime(mode));
    setIsRunning(false);
    setProgress(0);
  }, [mode, getInitialTime]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const switchMode = (newMode: TimerMode) => {
    setMode(newMode);
    setTimeLeft(getInitialTime(newMode));
    setIsRunning(false);
    setProgress(0);
  };

  const completeSession = () => {
    const newSessions = sessions + 1;
    setSessions(newSessions);

    if (mode === 'work') {
      if (newSessions % settings.sessionsUntilLongBreak === 0) {
        switchMode('long-break');
      } else {
        switchMode('break');
      }
    } else {
      switchMode('work');
    }

    // Play notification sound
    const audio = new Audio('/notification.mp3');
    audio.play().catch(() => {});
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const totalTime = getInitialTime(mode);
          setProgress((totalTime - newTime) / totalTime * 100);
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      completeSession();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft, mode, getInitialTime]);

  return (
    <div className={`h-full flex flex-col ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative">
        {/* Progress Ring */}
        <div className="relative">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className={`${theme === 'dark' ? 'stroke-white/10' : 'stroke-black/10'} fill-none`}
              strokeWidth="4"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="fill-none transition-all duration-200"
              strokeWidth="4"
              stroke={accentColor}
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress / 100)}
              style={{ transition: 'stroke-dashoffset 0.5s' }}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className={`text-lg mt-2 ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
              {mode === 'work' ? 'Work Time' : mode === 'break' ? 'Break Time' : 'Long Break'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTimer}
            className={`p-4 rounded-full transition-colors`}
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {isRunning ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={reset}
            className={`p-4 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80'} hover:${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} transition-colors`}
          >
            <FaRedo className="w-6 h-6" />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSettings(!showSettings)}
            className={`p-4 rounded-full ${theme === 'dark' ? 'bg-white/10 text-white/80' : 'bg-black/10 text-black/80'} hover:${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'} transition-colors`}
          >
            <FaCog className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              mode === 'work'
                ? `bg-${accentColor}/20 text-${accentColor}`
                : theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-white/60'
                : 'bg-black/5 hover:bg-black/10 text-black/60'
            }`}
          >
            <FaBrain className="w-4 h-4" />
            <span>Work</span>
          </button>

          <button
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              mode === 'break'
                ? `bg-${accentColor}/20 text-${accentColor}`
                : theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-white/60'
                : 'bg-black/5 hover:bg-black/10 text-black/60'
            }`}
          >
            <FaCoffee className="w-4 h-4" />
            <span>Break</span>
          </button>

          <button
            onClick={() => switchMode('long-break')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
              mode === 'long-break'
                ? `bg-${accentColor}/20 text-${accentColor}`
                : theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10 text-white/60'
                : 'bg-black/5 hover:bg-black/10 text-black/60'
            }`}
          >
            <FaCoffee className="w-4 h-4" />
            <span>Long Break</span>
          </button>
        </div>

        {/* Session Counter */}
        <div className={`text-sm ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
          Sessions completed: {sessions}
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`${
                theme === 'dark' ? 'bg-gray-800' : 'bg-white'
              } rounded-xl p-6 w-full max-w-md mx-4 shadow-2xl`}
            >
              <h2 className="text-xl font-semibold mb-4">Timer Settings</h2>
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} mb-2`}>
                    Work Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.workDuration}
                    onChange={(e) => setSettings({ ...settings, workDuration: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-white/5 focus:bg-white/10'
                        : 'bg-black/5 focus:bg-black/10'
                    } outline-none transition-colors`}
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} mb-2`}>
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.breakDuration}
                    onChange={(e) => setSettings({ ...settings, breakDuration: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-white/5 focus:bg-white/10'
                        : 'bg-black/5 focus:bg-black/10'
                    } outline-none transition-colors`}
                    min="1"
                    max="30"
                  />
                </div>

                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} mb-2`}>
                    Long Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings.longBreakDuration}
                    onChange={(e) => setSettings({ ...settings, longBreakDuration: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-white/5 focus:bg-white/10'
                        : 'bg-black/5 focus:bg-black/10'
                    } outline-none transition-colors`}
                    min="1"
                    max="60"
                  />
                </div>

                <div>
                  <label className={`block text-sm ${theme === 'dark' ? 'text-white/60' : 'text-black/60'} mb-2`}>
                    Sessions Until Long Break
                  </label>
                  <input
                    type="number"
                    value={settings.sessionsUntilLongBreak}
                    onChange={(e) => setSettings({ ...settings, sessionsUntilLongBreak: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-lg ${
                      theme === 'dark'
                        ? 'bg-white/5 focus:bg-white/10'
                        : 'bg-black/5 focus:bg-black/10'
                    } outline-none transition-colors`}
                    min="1"
                    max="10"
                  />
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    onClick={() => setShowSettings(false)}
                    className={`px-4 py-2 rounded-lg ${
                      theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'
                    } transition-colors`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      reset();
                      setShowSettings(false);
                    }}
                    className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors"
                  >
                    <FaCheck className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 