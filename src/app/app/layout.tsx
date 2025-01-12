/* eslint-disable */
'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useSettingsStore } from '@/lib/store/settings';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { FaSignOutAlt, FaWifi, FaBatteryFull, FaVolumeUp, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Dock } from '@/components/dock/Dock';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LofiLogo } from '@/components/icons/LofiLogo';
import { ASMRPlayer } from '@/components/apps/ASMRPlayer';
import { MusicPlayer } from '@/components/apps/MusicPlayer';
import { PomodoroTimer } from '@/components/apps/PomodoroTimer';
import { Settings } from '@/components/apps/Settings';
import { Notes } from '@/components/apps/Notes';

interface MenuItem {
  label?: string;
  shortcut?: string;
  onClick?: () => void;
  divider?: boolean;
  disabled?: boolean;
}

interface MenuDropdownProps {
  label: string;
  items: MenuItem[];
  theme: 'dark' | 'light';
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

const apps: { [key: string]: React.ComponentType } = {
  pomodoro: PomodoroTimer,
  music: MusicPlayer,
  notes: Notes,

  settings: Settings,
  asmr: ASMRPlayer,
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const { theme, accentColor, wallpaper } = useSettingsStore();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  // Add click outside handler for calendar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return { daysInMonth, firstDayOfMonth };
  };

  const { daysInMonth, firstDayOfMonth } = getDaysInMonth(selectedMonth);

  const handlePrevMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleReload = () => {
    window.location.reload();
  };

  const fileMenuItems: MenuItem[] = [
    { label: 'New Note', shortcut: '⌘N' },
    { label: 'New Window', shortcut: '⌘⇧N', onClick: () => window.open(window.location.href, '_blank') },
    { divider: true },
    { label: 'Save', shortcut: '⌘S' },
    { label: 'Save As...', shortcut: '⌘⇧S' },
    { divider: true },
    { label: 'Close Window', shortcut: '⌘W', onClick: () => window.close() },
  ];

  const editMenuItems: MenuItem[] = [
    { label: 'Undo', shortcut: '⌘Z', onClick: () => document.execCommand('undo') },
    { label: 'Redo', shortcut: '⌘⇧Z', onClick: () => document.execCommand('redo') },
    { divider: true },
    { label: 'Cut', shortcut: '⌘X', onClick: () => document.execCommand('cut') },
    { label: 'Copy', shortcut: '⌘C', onClick: () => document.execCommand('copy') },
    { label: 'Paste', shortcut: '⌘V', onClick: () => document.execCommand('paste') },
    { divider: true },
    { label: 'Select All', shortcut: '⌘A', onClick: () => document.execCommand('selectAll') },
  ];

  const viewMenuItems: MenuItem[] = [
    { label: 'Toggle Dark Mode', onClick: () => useSettingsStore.setState({ theme: theme === 'dark' ? 'light' : 'dark' }) },
    { divider: true },
    { label: 'Zoom In', shortcut: '⌘+' },
    { label: 'Zoom Out', shortcut: '⌘-' },
    { label: 'Reset Zoom', shortcut: '⌘0' },
    { divider: true },
    { label: 'Enter Full Screen', shortcut: 'F11', onClick: handleFullscreen },
  ];

  const windowMenuItems: MenuItem[] = [
    { label: 'Minimize', shortcut: '⌘M' },
    { label: 'Zoom' },
    { divider: true },
    { label: 'Bring All to Front' },
  ];

  const helpMenuItems: MenuItem[] = [
    { label: 'Welcome Guide' },
    { label: 'Documentation' },
    { divider: true },
    { label: 'Keyboard Shortcuts', shortcut: '⌘K' },
    { divider: true },
    { label: 'Check for Updates...' },
    { divider: true },
    { label: 'About LofiStudy' },
  ];

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
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="relative z-50">
        <div className="absolute inset-0 bg-gray-900/30 backdrop-blur-xl" />
        <div className="relative flex items-center justify-between px-4 h-10 border-b border-white/10">
          {/* Left Menu */}
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-full bg-orange-500/20 blur-lg" />
              <LofiLogo className="w-6 h-6 text-orange-500 relative" />
            </motion.div>
            <div className="flex items-center space-x-1">
              <MenuDropdown label="File" items={fileMenuItems} theme={theme} />
              <MenuDropdown label="Edit" items={editMenuItems} theme={theme} />
              <MenuDropdown label="View" items={viewMenuItems} theme={theme} />
              <MenuDropdown label="Window" items={windowMenuItems} theme={theme} />
              <MenuDropdown label="Help" items={helpMenuItems} theme={theme} />
            </div>
          </div>

          {/* Right Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-sm">
              <div className="flex items-center space-x-1 text-white/60">
                <FaWifi className="w-4 h-4" />
                <span>Connected</span>
              </div>
              <div className="flex items-center space-x-1 text-white/60">
                <FaBatteryFull className="w-4 h-4" />
                <span>100%</span>
              </div>
              <div className="flex items-center space-x-1 text-white/60">
                <FaVolumeUp className="w-4 h-4" />
              </div>
            </div>
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              className="px-3 py-1 rounded-lg hover:bg-white/10 transition-colors text-white/80"
            >
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/60 hover:text-white"
            >
              <FaSignOutAlt className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative">
        {children}
      </main>

      {/* Dock */}
      <div className="relative z-50 p-4">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        <div className="relative flex justify-center">
          <div className="bg-gray-900/30 backdrop-blur-xl border border-white/10 rounded-2xl p-2">
            <Dock />
          </div>
        </div>
      </div>
    </div>
  );
} 