'use client';

import { useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute, FaSnowflake, FaCoffee, FaFire, FaKeyboard, FaWater, FaCloudRain, FaRandom, FaStream } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';
import { useASMRStore } from '@/lib/store/asmr';
import { asmrManager } from '@/lib/audio/asmrManager';

interface SoundConfig {
  id: string;
  name: string;
  file: string;
  icon: React.ComponentType<{ className?: string }>;
}

const soundConfigs: SoundConfig[] = [
  { id: 'blizzard', name: 'Blizzard', file: '/sounds/blizzard.mp3', icon: FaSnowflake },
  { id: 'coffee', name: 'Coffee Shop', file: '/sounds/coffee.mp3', icon: FaCoffee },
  { id: 'fire', name: 'Fireplace', file: '/sounds/fire.mp3', icon: FaFire },
  { id: 'keyboard', name: 'Keyboard', file: '/sounds/keyboard.mp3', icon: FaKeyboard },
  { id: 'ocean', name: 'Ocean', file: '/sounds/ocean.mp3', icon: FaWater },
  { id: 'rain', name: 'Rain', file: '/sounds/rain.mp3', icon: FaCloudRain },
  { id: 'static_audio_tick', name: 'Static', file: '/sounds/static_audio_tick.mp3', icon: FaRandom },
  { id: 'waterstream', name: 'Water Stream', file: '/sounds/waterstream.mp3', icon: FaStream },
];

export function ASMRPlayer() {
  const { theme } = useSettingsStore();
  const { sounds, updateSound, resetAllSounds } = useASMRStore();

  // Initialize audio elements
  useEffect(() => {
    soundConfigs.forEach(config => {
      asmrManager.initialize(config.id, config.file);
    });

    // Sync audio states with store
    sounds.forEach(sound => {
      if (sound.isPlaying) {
        asmrManager.play(sound.id, sound.volume);
      }
    });
  }, [sounds]);

  const handleVolumeChange = (id: string, volume: number) => {
    asmrManager.setVolume(id, volume);
    updateSound(id, { volume });
  };

  const toggleSound = (id: string) => {
    const currentSound = sounds.find(s => s.id === id);
    if (!currentSound) return;

    const newIsPlaying = !currentSound.isPlaying;
    
    if (newIsPlaying) {
      asmrManager.play(id, currentSound.volume);
    } else {
      asmrManager.pause(id);
    }
    
    updateSound(id, { isPlaying: newIsPlaying });
  };

  const stopAllSounds = () => {
    asmrManager.stopAll();
    resetAllSounds();
  };

  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mb-6">
          ASMR Mixer
        </h2>

        {/* Sound Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 flex-1 overflow-y-auto">
          {sounds.map((sound) => (
            <div
              key={sound.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl p-4 flex flex-col items-center space-y-4 hover:bg-white/10 transition-colors"
            >
              {/* Sound Icon */}
              <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                {sound.icon}
              </div>

              {/* Sound Name */}
              <span className="text-sm md:text-base text-white/80 text-center">
                {sound.name}
              </span>

              {/* Volume Control */}
              <input
                type="range"
                min="0"
                max="100"
                value={sound.volume}
                onChange={(e) => handleVolumeChange(sound.id, Number(e.target.value))}
                className="w-full"
              />

              {/* Play/Pause Button */}
              <button
                onClick={() => toggleSound(sound.id)}
                className={`w-full py-2 px-4 rounded-lg text-sm md:text-base transition-colors ${
                  sound.isPlaying
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {sound.isPlaying ? 'Pause' : 'Play'}
              </button>
            </div>
          ))}
        </div>

        {/* Master Controls */}
        <div className="mt-6 bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex items-center space-x-4 w-full md:w-auto">
              <button
                onClick={stopAllSounds}
                className={`py-2 px-6 rounded-lg transition-colors ${
                  sounds.some(s => s.isPlaying)
                    ? 'bg-orange-500 text-white'
                    : 'bg-white/10 text-white/60 hover:bg-white/20'
                }`}
              >
                {sounds.some(s => s.isPlaying) ? 'Pause All' : 'Play All'}
              </button>
              <button
                onClick={resetAllSounds}
                className="py-2 px-6 rounded-lg bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
              >
                Reset
              </button>
            </div>

            <div className="flex items-center space-x-4 w-full md:w-1/2">
              <span className="text-white/60 text-sm md:text-base">Master Volume</span>
              <input
                type="range"
                min="0"
                max="100"
                value={soundConfigs.find(s => s.id === 'master')?.volume || 0}
                onChange={(e) => handleVolumeChange('master', Number(e.target.value))}
                className="flex-1"
              />
              <span className="text-white/60 text-sm md:text-base w-12 text-right">
                {soundConfigs.find(s => s.id === 'master')?.volume || 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 