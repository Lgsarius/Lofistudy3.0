'use client';

import { useWindowsStore } from '@/lib/store/windows';
import { Window } from '@/components/windows/Window';
import { PomodoroTimer } from '@/components/apps/PomodoroTimer';
import { MusicPlayer } from '@/components/apps/MusicPlayer';
import { Notes } from '@/components/apps/Notes';
import { Settings } from '@/components/apps/Settings';
import { ASMRPlayer } from '@/components/apps/ASMRPlayer';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeadphones, FaClock, FaBook, FaCog } from 'react-icons/fa';
import { useSettingsStore } from '@/lib/store/settings';
import Image from 'next/image';
import TodoList from '@/components/apps/TodoList';

export default function AppPage() {
  const { windows } = useWindowsStore();
  const { wallpaper, isVideoWallpaper } = useSettingsStore();

  const renderWindowContent = (type: string) => {
    switch (type) {
      case 'pomodoro':
        return <PomodoroTimer />;
      case 'music':
        return <MusicPlayer />;
      case 'notes':
        return <Notes />;
      case 'settings':
        return <Settings />;
      case 'chat':
        return <Chat />;
      case 'asmr':
        return <ASMRPlayer />;
      case 'todo':
        return <TodoList />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] w-full relative">
      {/* Wallpaper */}
      <div className="fixed inset-0">
        {wallpaper ? (
          isVideoWallpaper ? (
            <video
              key={wallpaper}
              src={wallpaper}
              autoPlay
              loop
              muted
              playsInline
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={wallpaper}
              alt="Wallpaper"
              fill
              className="object-cover"
              priority
            />
          )
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20" />
        )}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8">
        {/* Welcome Message */}
        <AnimatePresence>
          {windows.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="h-full flex flex-col items-center justify-center text-center px-4 py-12"
            >
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent mb-6"
              >
                Welcome to LofiStudy
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-amber-100/60 max-w-2xl mb-16 text-lg md:text-xl"
              >
                Your personal workspace for focused study and productivity.
                Click on any icon in the dock below to get started.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full max-w-4xl px-4"
              >
                <Feature
                  icon={FaHeadphones}
                  title="Music Player"
                  description="Immerse yourself in Lo-Fi beats while you work. Choose from curated playlists or add your own tracks."
                  delay={0.5}
                  color="orange"
                />
                <Feature
                  icon={FaClock}
                  title="Pomodoro Timer"
                  description="Stay focused with customizable work sessions. Track your productivity and take structured breaks."
                  delay={0.6}
                  color="purple"
                />
                <Feature
                  icon={FaBook}
                  title="Notes"
                  description="Capture your thoughts with our markdown editor. Organize your notes and ideas effortlessly."
                  delay={0.7}
                  color="blue"
                />
                <Feature
                  icon={FaCog}
                  title="Settings"
                  description="Personalize your workspace with custom themes, backgrounds, and preferences."
                  delay={0.8}
                  color="green"
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Windows */}
        <AnimatePresence>
          {windows.map((window) => (
            <Window key={window.id} window={window}>
              {renderWindowContent(window.type)}
            </Window>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Feature({ 
  icon: Icon, 
  title, 
  description, 
  delay,
  color
}: { 
  icon: React.ComponentType<any>; 
  title: string; 
  description: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-800/30 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center transform transition-all duration-200 hover:shadow-2xl hover:border-white/20 group"
    >
      <motion.div
        className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-${color}-500/20 to-${color}-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className={`w-8 h-8 text-${color}-500`} />
      </motion.div>
      <h3 className="text-white/90 text-xl font-medium mb-3">{title}</h3>
      <p className="text-white/60 text-base leading-relaxed">{description}</p>
    </motion.div>
  );
} 