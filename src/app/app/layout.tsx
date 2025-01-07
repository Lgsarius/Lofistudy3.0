'use client';

import { useAuthStore } from '@/lib/store/auth';
import { useSettingsStore } from '@/lib/store/settings';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase/config';
import { FaSignOutAlt, FaWifi, FaBatteryFull, FaVolumeUp } from 'react-icons/fa';
import { Dock } from '@/components/dock/Dock';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { LofiLogo } from '@/components/icons/LofiLogo';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthStore();
  const { theme, accentColor, wallpaper } = useSettingsStore();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

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
            <div className="hidden md:flex space-x-4 text-sm font-medium">
              <button className={`hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors`}>File</button>
              <button className={`hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors`}>Edit</button>
              <button className={`hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors`}>View</button>
              <button className={`hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors`}>Window</button>
              <button className={`hover:${theme === 'dark' ? 'text-white' : 'text-black'} transition-colors`}>Help</button>
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
              <span className="font-medium">{currentTime.toLocaleTimeString()}</span>
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