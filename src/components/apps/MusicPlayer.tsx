'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaYoutube, FaVideo, FaImage, FaHeadphones, FaChevronDown, FaBackward, FaForward, FaMusic } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settings';
import ReactPlayer from 'react-player/youtube';
import Image from 'next/image';

interface VideoInfo {
  title: string;
  channelName: string;
  thumbnail: string;
}

const defaultStreams = [
  {
    url: 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    title: 'lofi hip hop radio - beats to relax/study to',
    channelName: 'Lofi Girl'
  },
  {
    url: 'https://www.youtube.com/watch?v=HuFYqnbVbzY',
    title: 'Anime Lofi Hip Hop Radio',
    channelName: 'Lofi Girl'
  },
  {
    url: 'https://www.youtube.com/watch?v=4xDzrJKXOOY',
    title: 'Lofi Space Station 🚀 Ambient Music - 24/7',
    channelName: 'Space Lofi'
  }
];

export function MusicPlayer() {
  const { theme } = useSettingsStore();
  const [url, setUrl] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showVideo, setShowVideo] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [playlist, setPlaylist] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [newTrackUrl, setNewTrackUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsInputFocused(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(0.5);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement && containerRef.current) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleProgress = (state: { played: number }) => {
    setProgress(state.played);
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      setIsPlaying(true);
      const videoId = url.includes('v=') ? url.split('v=')[1].split('&')[0] : url.split('/').pop();
      setVideoInfo({
        title: 'Loading...',
        channelName: 'Loading...',
        thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
      });
      setIsInputFocused(false);
    }
  };

  const handleStreamSelect = (stream: typeof defaultStreams[0]) => {
    setUrl(stream.url);
    setVideoInfo({
      title: stream.title,
      channelName: stream.channelName,
      thumbnail: `https://img.youtube.com/vi/${stream.url.split('v=')[1]}/maxresdefault.jpg`
    });
    setIsPlaying(true);
    setIsInputFocused(false);
  };

  const toggleVideoView = () => {
    setShowVideo(!showVideo);
  };

  const handleAddTrack = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/add-track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: newTrackUrl }),
      });

      const data = await response.json();
      setPlaylist([...playlist, data]);
      setCurrentTrack(data);
      setNewTrackUrl('');
    } catch (error) {
      console.error('Error adding track:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto h-full flex flex-col">
        {/* Title */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white/90 mb-6">
          Music Player
        </h2>

        {/* Player Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Now Playing */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-4">
              Now Playing
            </h3>
            <div className="aspect-square relative rounded-lg overflow-hidden mb-4">
              {currentTrack ? (
                <Image
                  src={currentTrack.artwork}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black/20 flex items-center justify-center">
                  <FaMusic className="w-12 h-12 text-white/20" />
                </div>
              )}
            </div>

            {/* Track Info */}
            <div className="space-y-1 mb-4">
              <h4 className="text-lg font-medium text-white/90">
                {currentTrack?.title || 'No track selected'}
              </h4>
              <p className="text-sm text-white/60">
                {currentTrack?.artist || 'Select a track to play'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-orange-500 transition-all duration-100"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/60">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handlePrevious}
                className="p-2 text-white/60 hover:text-white/90 transition-colors"
                disabled={!currentTrack}
              >
                <FaBackward className="w-5 h-5" />
              </button>
              <button
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors"
                disabled={!currentTrack}
              >
                {isPlaying ? (
                  <FaPause className="w-5 h-5" />
                ) : (
                  <FaPlay className="w-5 h-5 ml-1" />
                )}
              </button>
              <button
                onClick={handleNext}
                className="p-2 text-white/60 hover:text-white/90 transition-colors"
                disabled={!currentTrack}
              >
                <FaForward className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Playlist */}
          <div className="bg-white/5 backdrop-blur-lg rounded-xl p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-white/90 mb-4">
              Playlist
            </h3>
            <div className="space-y-2 max-h-[calc(100vh-24rem)] overflow-y-auto">
              {playlist.map((track) => (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                    currentTrack?.id === track.id
                      ? 'bg-orange-500 text-white'
                      : 'hover:bg-white/10 text-white/60'
                  }`}
                >
                  <div className="w-10 h-10 relative rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={track.artwork}
                      alt={track.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="truncate font-medium">{track.title}</div>
                    <div className="text-sm truncate opacity-60">
                      {track.artist}
                    </div>
                  </div>
                  <div className="text-sm opacity-60">{track.duration}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 