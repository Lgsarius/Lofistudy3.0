'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlay, FaPause, FaVolumeUp, FaVolumeMute, FaExpand, FaCompress, FaYoutube, FaVideo, FaImage } from 'react-icons/fa';
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
  const { theme, accentColor } = useSettingsStore();
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
      // Extract video ID and fetch video info if needed
      setIsPlaying(true);
      // You would typically fetch video info here
      setVideoInfo({
        title: 'Video Title',
        channelName: 'Channel Name',
        thumbnail: 'thumbnail_url',
      });
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
  };

  const toggleVideoView = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div 
      ref={containerRef}
      className={`flex flex-col h-full ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
    >
      {/* Default Streams */}
      <div className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'} flex flex-wrap gap-2`}>
        {defaultStreams.map((stream) => (
          <button
            key={stream.url}
            onClick={() => handleStreamSelect(stream)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
              url === stream.url
                ? `bg-${accentColor} text-white`
                : theme === 'dark'
                ? 'bg-white/5 hover:bg-white/10'
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            {stream.title}
          </button>
        ))}
      </div>

      {/* Video Input */}
      <motion.form 
        onSubmit={handleUrlSubmit}
        className={`p-4 border-b ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}
      >
        <div className="relative">
          <FaYoutube className={`absolute left-3 top-1/2 -translate-y-1/2 ${isInputFocused ? 'text-red-500' : theme === 'dark' ? 'text-white/40' : 'text-gray-400'}`} />
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => setIsInputFocused(false)}
            placeholder="Paste YouTube URL here..."
            className={`w-full pl-10 pr-4 py-2 rounded-xl ${
              theme === 'dark' 
                ? 'bg-white/5 focus:bg-white/10' 
                : 'bg-gray-100 focus:bg-gray-50'
            } outline-none transition-colors`}
          />
        </div>
      </motion.form>

      {/* Player Area */}
      <div className="flex-1 relative overflow-hidden bg-black">
        {url && (
          <>
            {showVideo ? (
              <ReactPlayer
                ref={playerRef}
                url={url}
                playing={isPlaying}
                volume={volume}
                muted={isMuted}
                width="100%"
                height="100%"
                style={{ position: 'absolute', top: 0, left: 0 }}
                onProgress={handleProgress}
                onDuration={handleDuration}
                config={{
                  youtube: {
                    playerVars: { 
                      showinfo: 1, 
                      controls: 0,
                      modestbranding: 1
                    }
                  }
                }}
              />
            ) : (
              videoInfo && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-center bg-cover flex flex-col items-center justify-center"
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
              )
            )}
          </>
        )}
      </div>

      {/* Controls */}
      <div className={`p-4 ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'} backdrop-blur-xl`}>
        {/* Progress Bar */}
        <div className="mb-4">
          <div className={`h-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} rounded-full overflow-hidden`}>
            <motion.div
              className="h-full bg-red-500"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-gray-500">
            <span>{formatTime(progress * duration)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePlayPause}
              className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
            >
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button
              onClick={toggleVideoView}
              className={`p-3 rounded-xl ${
                theme === 'dark' ? 'bg-white/5 hover:bg-white/10' : 'bg-gray-100 hover:bg-gray-200'
              } transition-colors`}
              title={showVideo ? 'Show Thumbnail' : 'Show Video'}
            >
              {showVideo ? <FaImage /> : <FaVideo />}
            </button>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
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
                className={`w-24 h-1 ${theme === 'dark' ? 'bg-white/10' : 'bg-gray-200'} rounded-full appearance-none cursor-pointer`}
                style={{
                  backgroundImage: `linear-gradient(to right, ${accentColor} ${volume * 100}%, transparent ${volume * 100}%)`,
                }}
              />
            </div>
            <button
              onClick={toggleFullscreen}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-gray-200'
              } transition-colors`}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 