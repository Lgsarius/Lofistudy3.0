'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaYoutube, FaVideo, FaImage, FaHeadphones, FaChevronDown } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettingsStore } from '@/lib/store/settings';
import ReactPlayer from 'react-player/youtube';

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

  return (
    <div 
      ref={containerRef}
      className={`h-full flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Stream Selector */}
      <div className="p-4 border-b border-white/10 backdrop-blur-xl">
        <div className="relative" ref={dropdownRef}>
          <button 
            className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between"
            onClick={() => setIsInputFocused(!isInputFocused)}
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <FaHeadphones className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{videoInfo?.title || 'Select a stream'}</p>
                <p className="text-xs text-white/60">{videoInfo?.channelName || 'Choose from below'}</p>
              </div>
            </div>
            <FaChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isInputFocused ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute inset-x-0 top-full mt-2 bg-gray-800/90 backdrop-blur-xl rounded-lg border border-white/10 overflow-hidden z-50 shadow-xl"
              >
                <div className="p-4 space-y-4">
                  <div className="relative">
                    <FaYoutube className="absolute left-3 top-2.5 text-red-500" />
                    <form onSubmit={handleUrlSubmit}>
                      <input
                        type="text"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="Paste YouTube URL here..."
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </form>
                  </div>
                  <div className="space-y-2">
                    {defaultStreams.map((stream) => (
                      <button
                        key={stream.url}
                        onClick={() => handleStreamSelect(stream)}
                        className="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center space-x-3 active:bg-white/20"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                          <FaHeadphones className="w-4 h-4 text-white" />
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-medium truncate">{stream.title}</p>
                          <p className="text-xs text-white/60">{stream.channelName}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Player Area */}
      <div className="flex-1 relative overflow-hidden">
        {url && (
          <>
            {showVideo ? (
              <ReactPlayer
                ref={playerRef}
                url={url}
                playing={isPlaying}
                volume={isMuted ? 0 : volume}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                onProgress={handleProgress}
                onDuration={handleDuration}
                controls={false}
              />
            ) : videoInfo && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 bg-center bg-cover flex items-center justify-center"
                style={{
                  backgroundImage: `url(${videoInfo.thumbnail})`,
                }}
              >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                <div className="relative z-10 text-center p-6">
                  <h2 className="text-2xl font-bold mb-2">{videoInfo.title}</h2>
                  <p className="text-white/60">{videoInfo.channelName}</p>
                </div>
              </motion.div>
            )}
          </>
        )}

        {!url && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white/60">
              <FaHeadphones className="w-16 h-16 mx-auto mb-4" />
              <p>Select a stream to start listening</p>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-xl`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-white/60">
            <span>{formatTime(progress * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center hover:bg-orange-500/30 transition-colors"
            >
              {isPlaying ? <FaPause className="w-6 h-6" /> : <FaPlay className="w-6 h-6" />}
            </button>
            <button
              onClick={toggleVideoView}
              className="p-3 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              {showVideo ? <FaImage /> : <FaVideo />}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-white/60">
              <button onClick={toggleMute}>
                {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-orange-500"
                style={{
                  background: `linear-gradient(to right, #f97316 ${volume * 100}%, rgba(255, 255, 255, 0.1) ${volume * 100}%)`,
                }}
              />
            </div>
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 