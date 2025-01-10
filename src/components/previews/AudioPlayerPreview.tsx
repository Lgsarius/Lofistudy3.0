'use client';

import { useState } from 'react';
import { FaPlay, FaPause, FaForward, FaBackward, FaVolumeUp, FaHeadphones, FaChevronDown } from 'react-icons/fa';

export function AudioPlayerPreview() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);

  return (
    <div className="h-full flex flex-col text-white">
      {/* Stream Selector */}
      <div className="p-4 border-b border-white/10 backdrop-blur-xl">
        <div className="relative">
          <button className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <FaHeadphones className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">lofi hip hop radio</p>
                <p className="text-xs text-white/60">Lofi Girl</p>
              </div>
            </div>
            <FaChevronDown className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-8">
        {/* Album Art */}
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-500 animate-pulse" />
          <div className="absolute inset-2 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <FaHeadphones className="w-16 h-16 text-white/20" />
          </div>
        </div>

        {/* Title and Artist */}
        <div className="text-center">
          <h3 className="text-lg font-medium">lofi hip hop radio</h3>
          <p className="text-sm text-white/60">beats to relax/study to</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white">
            <FaBackward className="w-5 h-5" />
          </button>
          <button 
            className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center hover:bg-orange-500/30 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
          </button>
          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white">
            <FaForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-4 text-white/60">
          <FaVolumeUp className="w-4 h-4" />
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-32 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
            style={{
              background: `linear-gradient(to right, #f97316 ${volume}%, rgba(255, 255, 255, 0.1) ${volume}%)`,
            }}
          />
        </div>
      </div>
    </div>
  );
} 