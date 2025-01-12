/* eslint-disable */
'use client';

import { useEffect, useState } from 'react';
import { FaPlay, FaPause, FaRedo, FaBrain, FaCoffee, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';
import { usePomodoroStore } from '@/lib/store/pomodoro';

export function PomodoroTimer() {
  const { pomodoroWorkDuration, pomodoroBreakDuration } = useSettingsStore();
  const {
    isRunning,
    mode,
    timeLeft,
    sessionsCompleted,
    startTime,
    setIsRunning,
    setMode,
    setTimeLeft,
    setSessionsCompleted,
    setStartTime,
    syncTimerState,
  } = usePomodoroStore();

  const [mounted, setMounted] = useState(false);

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Sound-related state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  // Initialize audio after mount
  useEffect(() => {
    if (mounted) {
      const audioElement = new Audio('/sounds/bell.mp3');
      audioElement.volume = volume / 100;
      setAudio(audioElement);
    }
  }, [mounted, volume]);

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  // Play sound when timer completes
  useEffect(() => {
    if (mounted && timeLeft === 0 && soundEnabled && audio) {
      audio.play().catch(console.error);
    }
  }, [timeLeft, soundEnabled, audio, mounted]);

  // Sync timer state when component mounts or window gains focus
  useEffect(() => {
    let mounted = true;

    if (mounted) {
      syncTimerState();
      
      const handleVisibilityChange = () => {
        if (document?.visibilityState === 'visible') {
          syncTimerState();
        }
      };

      const handleFocus = () => {
        syncTimerState();
      };

      if (typeof window !== 'undefined' && typeof document !== 'undefined') {
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('focus', handleFocus);
      }

      return () => {
        mounted = false;
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          window.removeEventListener('focus', handleFocus);
        }
      };
    }
  }, [syncTimerState]);

  // Timer tick effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      intervalId = setInterval(() => {
        syncTimerState();
        
        // Check if timer has completed
        if (timeLeft <= 0) {
          completeSession();
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      setStartTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    setTimeLeft(mode === 'work' ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);
  };

  const switchMode = (newMode: 'work' | 'break' | 'long-break') => {
    setMode(newMode);
    setIsRunning(false);
    setStartTime(null);
    setTimeLeft(newMode === 'work' ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);
  };

  const completeSession = () => {
    setIsRunning(false);
    setStartTime(null);
    
    if (mode === 'work') {
      setSessionsCompleted(sessionsCompleted + 1);
      const nextMode = sessionsCompleted % 4 === 3 ? 'long-break' : 'break';
      switchMode(nextMode);
    } else {
      switchMode('work');
    }
  };

  const progress = timeLeft / (mode === 'work' ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);

  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mb-6">
          Pomodoro Timer
        </h2>

        {/* Timer Display */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6 mb-6">
          <div className="flex flex-col items-center">
            {/* Mode Selector */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setMode('work')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'work'
                    ? 'bg-orange-500 text-white'
                    : 'text-white/60 hover:bg-white/10'
                }`}
              >
                Work
              </button>
              <button
                onClick={() => setMode('break')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  mode === 'break'
                    ? 'bg-orange-500 text-white'
                    : 'text-white/60 hover:bg-white/10'
                }`}
              >
                Break
              </button>
            </div>

            {/* Timer */}
            <div className="text-6xl md:text-7xl lg:text-8xl font-bold text-white/90 mb-8">
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleTimer}
                className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
              >
                {isRunning ? (
                  <FaPause className="w-6 h-6" />
                ) : (
                  <FaPlay className="w-6 h-6 ml-1" />
                )}
              </button>
              <button
                onClick={resetTimer}
                className="w-16 h-16 rounded-full bg-white/10 text-white/60 flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <FaRedo className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-4">
            Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Work Duration */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Work Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={pomodoroWorkDuration}
                onChange={(e) => setPomodoroWorkDuration(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Break Duration */}
            <div>
              <label className="block text-sm text-white/60 mb-2">
                Break Duration (minutes)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={pomodoroBreakDuration}
                onChange={(e) => setPomodoroBreakDuration(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-white/10 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Sound Settings */}
            <div className="md:col-span-2">
              <label className="block text-sm text-white/60 mb-2">
                Timer Sound
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSound}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    soundEnabled
                      ? 'bg-orange-500 text-white'
                      : 'text-white/60 hover:bg-white/10'
                  }`}
                >
                  {soundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  className="flex-1 accent-orange-500"
                  disabled={!soundEnabled}
                />
                <span className="text-sm text-white/60">{volume}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 