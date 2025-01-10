'use client';

import { useEffect } from 'react';
import { FaPlay, FaPause, FaRedo, FaBrain, FaCoffee } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';
import { usePomodoroStore } from '@/lib/store/pomodoro';

export function PomodoroTimer() {
  const { pomodoroWorkDuration, pomodoroBreakDuration } = useSettingsStore();
  const {
    isRunning,
    mode,
    timeLeft,
    sessionsCompleted,
    lastTickTime,
    setIsRunning,
    setMode,
    setTimeLeft,
    setSessionsCompleted,
    setLastTickTime,
  } = usePomodoroStore();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isRunning) {
      // Update lastTickTime if it's null (first start)
      if (!lastTickTime) {
        setLastTickTime(Date.now());
      }

      intervalId = setInterval(() => {
        const now = Date.now();
        const elapsed = lastTickTime ? Math.floor((now - lastTickTime) / 1000) : 0;
        setLastTickTime(now);

        if (elapsed > 0) {
          setTimeLeft((prev) => {
            const newTime = prev - elapsed;
            if (newTime <= 0) {
              completeSession();
              return 0;
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRunning, lastTickTime]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    if (!isRunning) {
      setLastTickTime(Date.now());
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setLastTickTime(null);
    setTimeLeft(mode === 'work' ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);
  };

  const switchMode = (newMode: 'work' | 'break' | 'long-break') => {
    setMode(newMode);
    setIsRunning(false);
    setLastTickTime(null);
    setTimeLeft(newMode === 'work' ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);
  };

  const completeSession = () => {
    setIsRunning(false);
    setLastTickTime(null);
    
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
    <div className="h-full flex flex-col text-white">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative">
        {/* Progress Ring */}
        <div className="relative">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-white/10 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="fill-none transition-all duration-200"
              strokeWidth="4"
              stroke="#f97316"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * (1 - progress)}
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold tracking-tight">
              {formatTime(timeLeft)}
            </span>
            <span className="text-lg mt-2 text-white/60">
              {mode === 'work' ? 'Work Time' : mode === 'break' ? 'Break Time' : 'Long Break'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button 
            className="p-4 rounded-full bg-orange-500/20 text-orange-500"
            onClick={toggleTimer}
          >
            {isRunning ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          
          <button 
            className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors"
            onClick={resetTimer}
          >
            <FaRedo className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => switchMode('work')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'work' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
          >
            <FaBrain className="w-4 h-4" />
            <span>Work</span>
          </button>

          <button 
            onClick={() => switchMode('break')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'break' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
          >
            <FaCoffee className="w-4 h-4" />
            <span>Break</span>
          </button>

          <button 
            onClick={() => switchMode('long-break')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'long-break' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
          >
            <FaCoffee className="w-4 h-4" />
            <span>Long Break</span>
          </button>
        </div>

        {/* Session Counter */}
        <div className="text-sm text-white/40">
          Sessions completed: {sessionsCompleted}
        </div>
      </div>
    </div>
  );
} 