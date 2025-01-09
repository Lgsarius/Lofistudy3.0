'use client';

import { useState } from 'react';
import { FaPlay, FaPause, FaRedo, FaCog, FaBrain, FaCoffee } from 'react-icons/fa';

export function PomodoroPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [mode, setMode] = useState<'work' | 'break' | 'long-break'>('work');

  return (
    <div className="h-full flex flex-col text-white">
      {/* Timer Display */}
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
              strokeDashoffset={2 * Math.PI * 120 * 0.4} // Static 40% progress for preview
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold tracking-tight">
              25:00
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
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          
          <button className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <FaRedo className="w-6 h-6" />
          </button>

          <button className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <FaCog className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setMode('work')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'work' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
          >
            <FaBrain className="w-4 h-4" />
            <span>Work</span>
          </button>

          <button 
            onClick={() => setMode('break')}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              mode === 'break' ? 'bg-orange-500/20 text-orange-500' : 'bg-white/5 hover:bg-white/10 text-white/60'
            }`}
          >
            <FaCoffee className="w-4 h-4" />
            <span>Break</span>
          </button>

          <button 
            onClick={() => setMode('long-break')}
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
          Sessions completed: 0
        </div>
      </div>
    </div>
  );
} 