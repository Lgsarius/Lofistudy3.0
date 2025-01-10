'use client';

import { useState } from 'react';
import { FaPalette, FaImage, FaVolumeUp, FaClock, FaMoon, FaSun, FaCheck, FaVideo } from 'react-icons/fa';
import { useSettingsStore, wallpapers, onlineWallpapers, videoWallpapers } from '@/lib/store/settings';
import Image from 'next/image';
import { motion } from 'framer-motion';

const accentColors = [
  { id: 'orange', color: '#FF9900' },
  { id: 'purple', color: '#9B51E0' },
  { id: 'blue', color: '#2F80ED' },
  { id: 'green', color: '#27AE60' },
  { id: 'red', color: '#EB5757' },
];

const sections = [
  { id: 'appearance', icon: FaPalette, label: 'Appearance' },
  { id: 'wallpaper', icon: FaImage, label: 'Wallpaper' },
  { id: 'sound', icon: FaVolumeUp, label: 'Sound' },
  { id: 'pomodoro', icon: FaClock, label: 'Pomodoro' },
];

export function Settings() {
  const [activeSection, setActiveSection] = useState('appearance');
  const {
    theme,
    accentColor,
    wallpaper,
    musicVolume,
    notificationVolume,
    pomodoroWorkDuration,
    pomodoroBreakDuration,
    setTheme,
    setAccentColor,
    setWallpaper,
    setMusicVolume,
    setNotificationVolume,
    setPomodoroWorkDuration,
    setPomodoroBreakDuration,
  } = useSettingsStore();

  const renderSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <div className="space-y-8">
            {/* Theme Toggle */}
            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Theme</h3>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setTheme('light')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'light'
                      ? `bg-black/10 ${theme === 'dark' ? 'text-white' : 'text-black'}`
                      : `${theme === 'dark' ? 'text-white/60 hover:bg-white/10' : 'text-black/60 hover:bg-black/10'}`
                  }`}
                >
                  <FaSun className="w-4 h-4" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => setTheme('dark')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    theme === 'dark'
                      ? `bg-white/20 ${theme === 'dark' ? 'text-white' : 'text-black'}`
                      : `${theme === 'dark' ? 'text-white/60 hover:bg-white/10' : 'text-black/60 hover:bg-black/10'}`
                  }`}
                >
                  <FaMoon className="w-4 h-4" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Accent Color */}
            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Accent Color</h3>
              <div className="flex items-center space-x-3">
                {accentColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setAccentColor(color.color)}
                    className="relative w-8 h-8 rounded-full transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white/20"
                    style={{ backgroundColor: color.color }}
                  >
                    {accentColor === color.color && (
                      <FaCheck className="absolute inset-0 m-auto text-white w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 'wallpaper':
        return (
          <div className="space-y-6">
            <section>
              <h2 className="mb-4 text-xl font-semibold">Static Wallpapers</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {wallpapers.map((wp) => (
                  <button
                    key={wp}
                    onClick={() => setWallpaper(wp)}
                    className={`relative aspect-video overflow-hidden rounded-lg border-2 ${
                      wallpaper === wp ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={wp}
                      alt="Wallpaper"
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                    />
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold flex items-center space-x-2">
                <FaVideo className="text-accent" />
                <span>Video Wallpapers</span>
              </h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {videoWallpapers.map((wp) => (
                  <button
                    key={wp.url}
                    onClick={() => setWallpaper(wp.url, true)}
                    className={`group relative aspect-video overflow-hidden rounded-lg border-2 ${
                      wallpaper === wp.url ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <video
                      src={wp.url}
                      muted
                      loop
                      playsInline
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 flex items-center justify-center">
                      <div className="text-center p-2">
                        <FaVideo className="w-8 h-8 mx-auto mb-2 text-white" />
                        <p className="text-sm font-medium text-white">{wp.title}</p>
                        <p className="text-xs text-gray-300">by {wp.author}</p>
                      </div>
                    </div>
                    {wallpaper === wp.url && (
                      <div className="absolute inset-0 bg-accent/20 flex items-center justify-center">
                        <FaCheck className="w-6 h-6 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-4 text-xl font-semibold">Online Wallpapers</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {onlineWallpapers.map((wp) => (
                  <button
                    key={wp.url}
                    onClick={() => setWallpaper(wp.url)}
                    className={`group relative aspect-video overflow-hidden rounded-lg border-2 ${
                      wallpaper === wp.url ? 'border-accent' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={wp.url}
                      alt={wp.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                      priority={false}
                      loading="lazy"
                      quality={75}
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <div className="p-2">
                        <p className="text-sm font-medium">{wp.title}</p>
                        <p className="text-xs text-gray-300">by {wp.author}</p>
                        <p className="text-xs text-gray-400">{wp.source}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </section>
          </div>
        );

      case 'sound':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Music Volume</h3>
              <div className="flex items-center space-x-4">
                <FaVolumeUp className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'} w-5 h-5`} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => setMusicVolume(Number(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${musicVolume}%, rgba(${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.1) ${musicVolume}%, rgba(${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.1) 100%)`,
                  }}
                />
                <span className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'} w-12 text-right`}>{musicVolume}%</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Notification Volume</h3>
              <div className="flex items-center space-x-4">
                <FaVolumeUp className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'} w-5 h-5`} />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={notificationVolume}
                  onChange={(e) => setNotificationVolume(Number(e.target.value))}
                  className="flex-1 h-2 rounded-lg appearance-none bg-white/10 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                  style={{
                    background: `linear-gradient(to right, ${accentColor} 0%, ${accentColor} ${notificationVolume}%, rgba(${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.1) ${notificationVolume}%, rgba(${theme === 'dark' ? '255, 255, 255' : '0, 0, 0'}, 0.1) 100%)`,
                  }}
                />
                <span className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'} w-12 text-right`}>{notificationVolume}%</span>
              </div>
            </div>
          </div>
        );

      case 'pomodoro':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Work Duration</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={pomodoroWorkDuration}
                  onChange={(e) => setPomodoroWorkDuration(Number(e.target.value))}
                  className={`w-20 px-3 py-2 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black'} border rounded-lg focus:outline-none focus:border-white/40`}
                />
                <span className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>minutes</span>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className={`text-base font-medium ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>Break Duration</h3>
              <div className="flex items-center space-x-4">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={pomodoroBreakDuration}
                  onChange={(e) => setPomodoroBreakDuration(Number(e.target.value))}
                  className={`w-20 px-3 py-2 ${theme === 'dark' ? 'bg-white/10 border-white/20 text-white' : 'bg-black/10 border-black/20 text-black'} border rounded-lg focus:outline-none focus:border-white/40`}
                />
                <span className={`${theme === 'dark' ? 'text-white/60' : 'text-black/60'}`}>minutes</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex">
      {/* Sidebar */}
      <div className={`w-48 border-r ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} p-4 space-y-2`}>
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                activeSection === section.id
                  ? `${theme === 'dark' ? 'bg-white/20 text-white' : 'bg-black/20 text-black'}`
                  : `${theme === 'dark' ? 'text-white/60 hover:bg-white/10' : 'text-black/60 hover:bg-black/10'}`
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.2 }}
        >
          {renderSection()}
        </motion.div>
      </div>
    </div>
  );
} 