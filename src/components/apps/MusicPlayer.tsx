'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp, FaMusic } from 'react-icons/fa';

// Sample tracks - in a real app, these would come from an API or database
const tracks = [
  {
    id: 1,
    title: 'Chill Lo-Fi Beat',
    artist: 'Lo-Fi Artist',
    url: 'https://example.com/track1.mp3', // Replace with actual track URL
  },
  {
    id: 2,
    title: 'Study Session',
    artist: 'Lo-Fi Producer',
    url: 'https://example.com/track2.mp3', // Replace with actual track URL
  },
  // Add more tracks
];

export function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const playNext = () => {
    setCurrentTrack((prev) => (prev + 1) % tracks.length);
  };

  const playPrevious = () => {
    setCurrentTrack((prev) => (prev - 1 + tracks.length) % tracks.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="flex flex-col h-full">
      {/* Currently Playing */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-48 h-48 bg-purple-100 rounded-lg mb-6 flex items-center justify-center">
          <FaMusic className="w-24 h-24 text-purple-300" />
        </div>
        <h3 className="text-lg font-medium text-gray-800">{tracks[currentTrack].title}</h3>
        <p className="text-sm text-gray-500">{tracks[currentTrack].artist}</p>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-100">
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-gray-200 rounded">
            <div className="h-1 bg-purple-500 rounded" style={{ width: '45%' }} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={playPrevious}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaStepBackward />
            </button>
            <button
              onClick={togglePlay}
              className="p-3 bg-purple-100 rounded-full text-purple-600 hover:bg-purple-200 transition-colors"
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={playNext}
              className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <FaStepForward />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2">
            <FaVolumeUp className="text-gray-600" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20"
            />
          </div>
        </div>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={tracks[currentTrack].url}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
    </div>
  );
} 