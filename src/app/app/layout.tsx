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
    <div className={`min-h-screen flex flex-col relative overflow-hidden ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Wallpaper */}
      <div className="fixed inset-0 z-0 w-screen h-screen">
        <Image
          src={wallpaper}
          alt="Wallpaper"
          fill
          priority
          className="object-cover object-center w-full h-full"
          sizes="100vw"
          quality={100}
          style={{
            filter: theme === 'dark' ? 'brightness(0.7) saturate(1.2)' : 'brightness(1) saturate(1)',
          }}
        />
      </div>

      {/* Menu Bar */}
      <div className="relative z-20">
        <div className={`h-12 ${theme === 'dark' ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-2xl border-b ${theme === 'dark' ? 'border-white/10' : 'border-black/10'} flex items-center px-4 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`}>
          <div className="flex-1 flex items-center space-x-6">
            <div className="flex items-center space-x-4">
              <LofiLogo className={`w-5 h-5 ${theme === 'dark' ? 'text-white/90' : 'text-black/90'}`} />
              <span className="font-semibold text-lg">LofiStudy</span>
            </div>
            <div className="hidden md:flex space-x-2 text-sm font-medium">
              <MenuDropdown label="File" items={fileMenuItems} theme={theme} />
              <MenuDropdown label="Edit" items={editMenuItems} theme={theme} />
              <MenuDropdown label="View" items={viewMenuItems} theme={theme} />
              <MenuDropdown label="Window" items={windowMenuItems} theme={theme} />
              <MenuDropdown label="Help" items={helpMenuItems} theme={theme} />
            </div>
          </div>
          <div className="flex items-center space-x-6 text-sm">
            <div className="hidden md:flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <FaWifi className="w-4 h-4" />
                <span className="text-xs">Wi-Fi</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaVolumeUp className="w-4 h-4" />
                <span className="text-xs">100%</span>
              </div>
              <div className="flex items-center space-x-1">
                <FaBatteryFull className="w-4 h-4" />
                <span className="text-xs">100%</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className={`font-medium hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} px-2 py-1 rounded transition-colors`}
                >
                  {currentTime.toLocaleTimeString()}
                </button>

                <AnimatePresence>
                  {showCalendar && (
                    <motion.div
                      ref={calendarRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`absolute right-0 top-full mt-2 p-4 rounded-xl shadow-xl ${
                        theme === 'dark' ? 'bg-gray-800/95' : 'bg-white/95'
                      } backdrop-blur-xl border ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}
                      style={{ width: '300px' }}
                    >
                      {/* Calendar Header */}
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={handlePrevMonth}
                          className={`p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                        >
                          <FaChevronLeft className="w-4 h-4" />
                        </button>
                        <h3 className="font-medium">
                          {selectedMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button
                          onClick={handleNextMonth}
                          className={`p-1 rounded-lg ${theme === 'dark' ? 'hover:bg-white/10' : 'hover:bg-black/10'}`}
                        >
                          <FaChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Calendar Grid */}
                      <div className="grid grid-cols-7 gap-1">
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                          <div
                            key={day}
                            className={`text-center text-sm font-medium p-2 ${
                              theme === 'dark' ? 'text-white/60' : 'text-black/60'
                            }`}
                          >
                            {day}
                          </div>
                        ))}
                        {Array.from({ length: 42 }, (_, i) => {
                          const dayNumber = i - firstDayOfMonth + 1;
                          const isCurrentMonth = dayNumber > 0 && dayNumber <= daysInMonth;
                          const isToday = isCurrentMonth &&
                            dayNumber === currentTime.getDate() &&
                            selectedMonth.getMonth() === currentTime.getMonth() &&
                            selectedMonth.getFullYear() === currentTime.getFullYear();

                          return (
                            <div
                              key={i}
                              className={`text-center p-2 rounded-lg ${
                                isCurrentMonth
                                  ? isToday
                                    ? `bg-${accentColor} text-white`
                                    : `cursor-pointer ${
                                        theme === 'dark'
                                          ? 'hover:bg-white/10'
                                          : 'hover:bg-black/5'
                                      }`
                                  : 'text-opacity-30'
                              } ${
                                !isCurrentMonth
                                  ? theme === 'dark'
                                    ? 'text-white/20'
                                    : 'text-black/20'
                                  : ''
                              }`}
                            >
                              {isCurrentMonth ? dayNumber : ''}
                            </div>
                          );
                        })}
                      </div>

                      {/* Current Time */}
                      <div className={`mt-4 text-center text-sm ${
                        theme === 'dark' ? 'text-white/60' : 'text-black/60'
                      }`}>
                        {currentTime.toLocaleTimeString()}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className={`h-4 w-px ${theme === 'dark' ? 'bg-white/20' : 'bg-black/20'}`} />
              <div className="flex items-center space-x-2">
                <span className="text-sm opacity-75 hidden sm:inline max-w-[200px] truncate">
                  {user.email}
                </span>
                <button
                  onClick={handleSignOut}
                  className={`opacity-75 hover:opacity-100 transition-opacity p-1 hover:${theme === 'dark' ? 'bg-white/10' : 'bg-black/10'} rounded`}
                  title="Sign Out"
                >
                  <FaSignOutAlt className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Dock */}
      <div className="relative z-20">
        <Dock />
      </div>
    </div>
  );
} 