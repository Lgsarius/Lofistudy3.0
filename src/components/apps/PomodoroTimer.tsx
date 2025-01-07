'use client';

import { useState, useEffect, useCallback } from 'react';
import { FaPlay, FaPause, FaRedo } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';

export function PomodoroTimer() {
  const { pomodoroWorkDuration, pomodoroBreakDuration } = useSettingsStore();
  const [timeLeft, setTimeLeft] = useState(pomodoroWorkDuration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isWorkTime, setIsWorkTime] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const reset = useCallback(() => {
    setTimeLeft(isWorkTime ? pomodoroWorkDuration * 60 : pomodoroBreakDuration * 60);
    setIsRunning(false);
  }, [isWorkTime, pomodoroWorkDuration, pomodoroBreakDuration]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const switchMode = () => {
    setIsWorkTime(!isWorkTime);
    setTimeLeft(isWorkTime ? pomodoroBreakDuration * 60 : pomodoroWorkDuration * 60);
    setIsRunning(false);
  };

  // Reset timer when durations change in settings
  useEffect(() => {
    reset();
  }, [pomodoroWorkDuration, pomodoroBreakDuration, reset]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Play notification sound
      const audio = new Audio('/notification.mp3');
      audio.play().catch(() => {});
      
      // Switch modes automatically
      switchMode();
    }

    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8">
      <div className="text-6xl font-bold text-gray-700 font-mono">
        {formatTime(timeLeft)}
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={toggleTimer}
          className="p-4 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors"
        >
          {isRunning ? <FaPause /> : <FaPlay />}
        </button>
        <button
          onClick={reset}
          className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <FaRedo />
        </button>
      </div>

      <button
        onClick={switchMode}
        className={`px-6 py-2 rounded-full ${
          isWorkTime
            ? 'bg-green-100 text-green-600 hover:bg-green-200'
            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
        } transition-colors`}
      >
        {isWorkTime ? 'Switch to Break' : 'Switch to Work'}
      </button>

      <div className="text-sm text-gray-500">
        {isWorkTime ? 'Work Time' : 'Break Time'}
      </div>
    </div>
  );
} 