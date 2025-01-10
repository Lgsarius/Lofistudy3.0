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
    <div className="h-full flex flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          ASMR Sound Mixer
        </h2>
        <button
          onClick={stopAllSounds}
          className={`px-4 py-2 rounded-lg ${
            theme === 'dark'
              ? 'bg-white/10 hover:bg-white/20'
              : 'bg-black/10 hover:bg-black/20'
          } transition-colors`}
        >
          Stop All
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {soundConfigs.map(config => {
          const sound = sounds.find(s => s.id === config.id)!;
          const Icon = config.icon;
          return (
            <div
              key={config.id}
              className={`p-4 rounded-xl ${
                theme === 'dark'
                  ? 'bg-white/5 hover:bg-white/10'
                  : 'bg-black/5 hover:bg-black/10'
              } transition-colors ${sound.isPlaying ? 'ring-2 ring-orange-500/50' : ''}`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${sound.isPlaying ? 'text-orange-500' : theme === 'dark' ? 'text-white/60' : 'text-black/60'}`} />
                  <span className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                    {config.name}
                  </span>
                </div>
                <button
                  onClick={() => toggleSound(config.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    sound.isPlaying
                      ? 'text-orange-500 bg-orange-500/20'
                      : theme === 'dark'
                      ? 'text-white/60 hover:bg-white/10'
                      : 'text-black/60 hover:bg-black/10'
                  }`}
                >
                  {sound.isPlaying ? <FaVolumeUp className="w-5 h-5" /> : <FaVolumeMute className="w-5 h-5" />}
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sound.volume}
                  onChange={(e) => handleVolumeChange(config.id, Number(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500 hover:[&::-webkit-slider-thumb]:bg-orange-400"
                  style={{
                    background: `linear-gradient(to right, #f97316 ${sound.volume}%, ${
                      theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
                    } ${sound.volume}%)`,
                  }}
                />
                <span className={`w-12 text-right ${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>
                  {sound.volume}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 