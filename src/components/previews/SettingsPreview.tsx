'use client';

import { useState } from 'react';
import { FaPalette, FaImage, FaVolumeUp, FaClock, FaMoon, FaSun, FaCheck } from 'react-icons/fa';

export function SettingsPreview() {
  const [activeSection, setActiveSection] = useState('appearance');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [selectedColor, setSelectedColor] = useState('#f97316');

  const accentColors = [
    { id: 'orange', color: '#f97316' },
    { id: 'purple', color: '#9333ea' },
    { id: 'blue', color: '#2563eb' },
    { id: 'green', color: '#16a34a' },
    { id: 'red', color: '#dc2626' },
  ];

  return (
    <div className="h-full flex text-white">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 p-4 space-y-2">
        <button 
          onClick={() => setActiveSection('appearance')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
            activeSection === 'appearance' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
          } transition-colors`}
        >
          <FaPalette className="w-4 h-4" />
          <span>Appearance</span>
        </button>
        <button 
          onClick={() => setActiveSection('wallpaper')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
            activeSection === 'wallpaper' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
          } transition-colors`}
        >
          <FaImage className="w-4 h-4" />
          <span>Wallpaper</span>
        </button>
        <button 
          onClick={() => setActiveSection('sound')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
            activeSection === 'sound' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
          } transition-colors`}
        >
          <FaVolumeUp className="w-4 h-4" />
          <span>Sound</span>
        </button>
        <button 
          onClick={() => setActiveSection('pomodoro')}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${
            activeSection === 'pomodoro' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
          } transition-colors`}
        >
          <FaClock className="w-4 h-4" />
          <span>Pomodoro</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="space-y-8">
          {/* Theme Toggle */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white/90">Theme</h3>
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setTheme('light')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  theme === 'light' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
                } transition-colors`}
              >
                <FaSun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button 
                onClick={() => setTheme('dark')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                  theme === 'dark' ? 'bg-white/20 text-white' : 'text-white/60 hover:bg-white/10'
                } transition-colors`}
              >
                <FaMoon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white/90">Accent Color</h3>
            <div className="flex items-center space-x-3">
              {accentColors.map((color) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color.color)}
                  className="relative w-8 h-8 rounded-full transition-transform hover:scale-110"
                  style={{ backgroundColor: color.color }}
                >
                  {selectedColor === color.color && (
                    <FaCheck className="absolute inset-0 m-auto text-white w-4 h-4" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 