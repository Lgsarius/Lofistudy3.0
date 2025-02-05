/* eslint-disable */
'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuthStore } from '@/lib/store/auth';
import { useSettingsStore } from '@/lib/store/settings';
import { Dock } from '@/components/dock/Dock';
import { motion, AnimatePresence } from 'framer-motion';
import { LofiLogo } from '@/components/icons/LofiLogo';
import Image from 'next/image';
import WelcomeGuide from '@/components/WelcomeGuide';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { FaSignOutAlt, FaQuestionCircle, FaChevronLeft, FaChevronRight, FaWifi, FaBatteryFull, FaVolumeUp, FaVolumeMute, FaVolumeDown, FaVolumeOff } from 'react-icons/fa';

interface MenuItem {
  label: string;
  items: {
    label?: string;
    shortcut?: string;
    onClick?: () => void;
    divider?: boolean;
    disabled?: boolean;
  }[];
  theme: 'dark' | 'light';
}

interface MenuDropdownProps {
  label: string;
  items: {
    label?: string;
    shortcut?: string;
    onClick?: () => void;
    divider?: boolean;
    disabled?: boolean;
  }[];
  theme: 'dark' | 'light';
}

interface SystemControlProps {
  icon: React.ReactNode;
  label: string;
  value?: number;
  onClick?: () => void;
  onValueChange?: (value: number) => void;
  theme: 'dark' | 'light';
}

function SystemControl({ icon, label, value, onClick, onValueChange, theme }: SystemControlProps) {
  const [isOpen, setIsOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (controlRef.current && !controlRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={controlRef} className="relative">
      <button
        onClick={() => {
          if (onClick) onClick();
          else setIsOpen(!isOpen);
        }}
        className={`p-1.5 rounded-lg transition-colors ${
          isOpen
            ? theme === 'dark'
              ? 'bg-white/10'
              : 'bg-black/10'
            : `hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`
        }`}
      >
        {icon}
      </button>

      {onValueChange && isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`absolute right-0 top-full mt-1 p-4 rounded-xl shadow-xl z-50 min-w-[200px] ${
            theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'
          } backdrop-blur-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}
        >
          <div className="flex flex-col space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{label}</span>
              <span className="text-sm text-white/60">{value}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={value}
              onChange={(e) => onValueChange(Number(e.target.value))}
              className="w-full"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MenuDropdown({ label, items, theme }: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`px-3 py-1 rounded-lg transition-colors ${
          isOpen
            ? theme === 'dark'
              ? 'bg-white/10'
              : 'bg-black/10'
            : `hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`
        }`}
      >
        {label}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute left-0 top-full mt-1 py-1 rounded-xl shadow-xl z-50 min-w-[200px] ${
              theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'
            } backdrop-blur-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}
          >
            {items.map((item, index) => (
              <div key={index}>
                {item.divider ? (
                  <div className={`my-1 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`} />
                ) : (
                  <button
                    onClick={() => {
                      item.onClick?.();
                      setIsOpen(false);
                    }}
                    disabled={item.disabled}
                    className={`w-full px-4 py-1.5 text-left flex items-center justify-between ${
                      item.disabled
                        ? theme === 'dark'
                          ? 'text-white/30'
                          : 'text-black/30'
                        : theme === 'dark'
                        ? 'hover:bg-white/10'
                        : 'hover:bg-black/5'
                    } transition-colors`}
                  >
                    <span>{item.label}</span>
                    {item.shortcut && (
                      <span className={`ml-4 text-xs ${theme === 'dark' ? 'text-white/40' : 'text-black/40'}`}>
                        {item.shortcut}
                      </span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuthStore();
  const { theme, accentColor, wallpaper, isVideoWallpaper } = useSettingsStore();
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [showWelcomeGuide, setShowWelcomeGuide] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isWifiEnabled, setIsWifiEnabled] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [isCharging, setIsCharging] = useState(true);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const [menuItems, setMenuItems] = useState([
    {
      label: 'File',
      items: [
        { label: 'New Window', shortcut: '⌘N', onClick: () => window.open(window.location.href, '_blank') },
        { label: 'Close Window', shortcut: '⌘W', onClick: () => window.close() },
        { divider: true },
        { label: 'Exit', shortcut: '⌘Q', onClick: handleSignOut },
      ],
      theme
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', shortcut: '⌘Z', onClick: () => document.execCommand('undo') },
        { label: 'Redo', shortcut: '⌘⇧Z', onClick: () => document.execCommand('redo') },
        { divider: true },
        { label: 'Cut', shortcut: '⌘X', onClick: () => document.execCommand('cut') },
        { label: 'Copy', shortcut: '⌘C', onClick: () => document.execCommand('copy') },
        { label: 'Paste', shortcut: '⌘V', onClick: () => document.execCommand('paste') },
      ],
      theme
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle Fullscreen', shortcut: 'F11', onClick: handleFullscreen },
        { divider: true },
        { label: 'Zoom In', shortcut: '⌘+' },
        { label: 'Zoom Out', shortcut: '⌘-' },
        { label: 'Reset Zoom', shortcut: '⌘0' },
      ],
      theme
    },
  ]);

  // Update time and date
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setCurrentDate(now.toLocaleDateString([], { month: 'short', day: 'numeric' }));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Update menu items theme
  useEffect(() => {
    setMenuItems(prev => prev.map(item => ({ ...item, theme })));
  }, [theme]);

  // Handle calendar click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar navigation
  const handlePrevMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const getVolumeIcon = () => {
    if (isMuted || volume === 0) return <FaVolumeMute />;
    if (volume < 30) return <FaVolumeOff />;
    if (volume < 70) return <FaVolumeDown />;
    return <FaVolumeUp />;
  };

  // Battery monitoring
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      });
    }
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ 
              scale: [0.5, 1.2, 1],
              opacity: 1,
              rotate: 360
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="mb-6 relative"
          >
            <div className="absolute inset-0 animate-ping">
              <LofiLogo className={`w-24 h-24 text-[${accentColor}]/30`} />
            </div>
            <LofiLogo className={`w-24 h-24 text-[${accentColor}]`} />
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`text-xl text-[${accentColor}]/90`}
          >
            Loading your workspace...
          </motion.p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        {isVideoWallpaper ? (
          <video
            src={wallpaper}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <Image
            src={wallpaper}
            alt="Wallpaper"
            fill
            className="object-cover"
            priority
          />
        )}
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {/* Menu Bar */}
      <div className={`fixed top-0 left-0 right-0 h-8 z-40 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm flex items-center px-4 text-sm select-none`}>
        <div className="flex-1 flex items-center space-x-4">
          {menuItems.map((item) => (
            <MenuDropdown key={item.label} {...item} />
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowWelcomeGuide(true)}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}
          >
            <FaQuestionCircle className="w-4 h-4" />
            <span>Guide</span>
          </button>

          {/* System Icons */}
          <div className="flex items-center space-x-3 px-3 border-l border-r border-white/10">
            <SystemControl
              icon={<FaWifi className={`w-4 h-4 ${isWifiEnabled ? 'text-white/60' : 'text-white/30'}`} />}
              label="Wi-Fi"
              theme={theme}
              onClick={() => setIsWifiEnabled(!isWifiEnabled)}
            />
            <SystemControl
              icon={getVolumeIcon()}
              label="Volume"
              value={volume}
              theme={theme}
              onClick={() => setIsMuted(!isMuted)}
              onValueChange={setVolume}
            />
            <SystemControl
              icon={
                <div className="flex items-center space-x-1">
                  <FaBatteryFull className={`w-4 h-4 ${isCharging ? 'text-green-500/60' : 'text-white/60'}`} />
                  <span className="text-xs text-white/60">{batteryLevel}%</span>
                </div>
              }
              label={`Battery ${isCharging ? '(Charging)' : ''}`}
              value={batteryLevel}
              theme={theme}
            />
          </div>

          {/* Date and Time */}
          <div className="relative">
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}
            >
              <span>{currentTime}</span>
              <span>•</span>
              <span>{currentDate}</span>
            </button>

            {/* Calendar Dropdown */}
            <AnimatePresence>
              {showCalendar && (
                <motion.div
                  ref={calendarRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`absolute right-0 top-full mt-1 p-4 rounded-xl shadow-xl z-50 w-[300px] ${
                    theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'
                  } backdrop-blur-xl border border-white/10`}
                >
                  {/* Calendar Header */}
                  <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrevMonth} className="p-1 hover:bg-white/10 rounded">
                      <FaChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="font-medium">
                      {selectedMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button onClick={handleNextMonth} className="p-1 hover:bg-white/10 rounded">
                      <FaChevronRight className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Calendar Grid */}
                  <div className="grid grid-cols-7 gap-1 text-center">
                    {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                      <div key={day} className="text-white/40 text-xs py-1">{day}</div>
                    ))}
                    {Array.from({ length: getDaysInMonth(selectedMonth).firstDayOfMonth }).map((_, i) => (
                      <div key={`empty-${i}`} className="p-2" />
                    ))}
                    {Array.from({ length: getDaysInMonth(selectedMonth).daysInMonth }).map((_, i) => (
                      <button
                        key={i + 1}
                        className={`p-2 rounded hover:bg-white/10 transition-colors ${
                          new Date().getDate() === i + 1 &&
                          new Date().getMonth() === selectedMonth.getMonth() &&
                          new Date().getFullYear() === selectedMonth.getFullYear()
                            ? 'bg-orange-500 text-white'
                            : ''
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleSignOut}
            className={`flex items-center space-x-2 px-3 py-1 rounded-lg transition-colors hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} ml-2`}
          >
            <FaSignOutAlt className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="relative z-10 h-[calc(100vh-8px)] pt-8 overflow-hidden">
        {children}
      </main>

      {/* Dock */}
      <Dock />

      {/* Welcome Guide */}
      {showWelcomeGuide && (
        <WelcomeGuide onClose={() => setShowWelcomeGuide(false)} />
      )}
    </div>
  );
} 