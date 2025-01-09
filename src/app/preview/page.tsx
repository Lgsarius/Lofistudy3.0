'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward, FaRandom, FaVolumeUp, FaClock, FaBook, FaCog, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { AudioPlayerPreview } from '@/components/previews/AudioPlayerPreview';
import { PomodoroPreview } from '@/components/previews/PomodoroPreview';
import { NotesPreview } from '@/components/previews/NotesPreview';
import { SettingsPreview } from '@/components/previews/SettingsPreview';

export default function PreviewPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'music' | 'pomodoro' | 'notes' | 'settings'>('music');

  const handleClose = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="px-6 py-4 backdrop-blur-sm bg-black/20 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <h1 className="text-xl font-bold">LofiStudy Preview</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <FaTimes className="w-5 h-5" />
            </motion.button>
          </div>
        </header>

        {/* Navigation */}
        <nav className="px-6 py-4 backdrop-blur-sm bg-black/10">
          <div className="max-w-7xl mx-auto flex space-x-4">
            <TabButton icon={FaPlay} label="Music" isActive={activeTab === 'music'} onClick={() => setActiveTab('music')} />
            <TabButton icon={FaClock} label="Pomodoro" isActive={activeTab === 'pomodoro'} onClick={() => setActiveTab('pomodoro')} />
            <TabButton icon={FaBook} label="Notes" isActive={activeTab === 'notes'} onClick={() => setActiveTab('notes')} />
            <TabButton icon={FaCog} label="Settings" isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
          </div>
        </nav>

        {/* Main Content */}
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="h-[600px] bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl"
            >
              {activeTab === 'music' && <AudioPlayerPreview />}
              {activeTab === 'pomodoro' && <PomodoroPreview />}
              {activeTab === 'notes' && <NotesPreview />}
              {activeTab === 'settings' && <SettingsPreview />}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TabButton({ icon: Icon, label, isActive, onClick }: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
          : 'text-white/60 hover:bg-white/10'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </motion.button>
  );
} 