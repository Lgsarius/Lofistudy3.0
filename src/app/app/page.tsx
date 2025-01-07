'use client';

import { useWindowsStore } from '@/lib/store/windows';
import { Window } from '@/components/windows/Window';
import { PomodoroTimer } from '@/components/apps/PomodoroTimer';
import { MusicPlayer } from '@/components/apps/MusicPlayer';
import { Notes } from '@/components/apps/Notes';
import { Settings } from '@/components/apps/Settings';
import { motion, AnimatePresence } from 'framer-motion';

export default function AppPage() {
  const { windows } = useWindowsStore();

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
      default:
        return null;
    }
  };

  return (
    <div className="min-h-[calc(100vh-12rem)] w-full p-8">
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white/90 mb-6"
            >
              Welcome to LofiStudy
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/70 max-w-2xl mb-16 text-lg md:text-xl"
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
                icon="🎵"
                title="Music Player"
                description="Immerse yourself in Lo-Fi beats while you work. Choose from curated playlists or add your own tracks."
                delay={0.5}
              />
              <Feature
                icon="⏱️"
                title="Pomodoro Timer"
                description="Stay focused with customizable work sessions. Track your productivity and take structured breaks."
                delay={0.6}
              />
              <Feature
                icon="📝"
                title="Notes"
                description="Capture your thoughts with our markdown editor. Organize your notes and ideas effortlessly."
                delay={0.7}
              />
              <Feature
                icon="⚙️"
                title="Settings"
                description="Personalize your workspace with custom themes, backgrounds, and preferences."
                delay={0.8}
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
  );
}

function Feature({ icon, title, description, delay }: { 
  icon: string; 
  title: string; 
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-gray-900/80 backdrop-blur-2xl border border-white/20 rounded-2xl p-8 text-center transform transition-all duration-200 hover:shadow-2xl hover:border-white/30"
    >
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-white/90 text-xl font-medium mb-3">{title}</h3>
      <p className="text-white/70 text-base leading-relaxed">{description}</p>
    </motion.div>
  );
} 