'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaGithub, FaClock, FaMusic, FaStickyNote, FaCog } from 'react-icons/fa';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Animated Background */}
      <div className="fixed inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }} />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LofiStudy
              </h1>
            </div>
            <div className="flex space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </Link>
              <Link href="/register" className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 sm:pt-24 sm:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
              Stay Focused with{' '}
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                LofiStudy
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Enhance your productivity with a perfect blend of Lo-Fi music, Pomodoro timer, and note-taking tools.
            </p>
            <Link href="/register" className="inline-flex items-center bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors">
              Start Your Journey
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">Features</h3>
            <p className="text-gray-300">Everything you need to stay focused and productive</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
            >
              <div className="text-purple-400 mb-4">
                <FaClock className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Pomodoro Timer</h4>
              <p className="text-gray-300">Stay focused with customizable work and break intervals</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
            >
              <div className="text-purple-400 mb-4">
                <FaMusic className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Lo-Fi Music</h4>
              <p className="text-gray-300">Curated Lo-Fi tracks to enhance your concentration</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
            >
              <div className="text-purple-400 mb-4">
                <FaStickyNote className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Notes</h4>
              <p className="text-gray-300">Quick and easy note-taking with markdown support</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border border-gray-700"
            >
              <div className="text-purple-400 mb-4">
                <FaCog className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold text-white mb-2">Customization</h4>
              <p className="text-gray-300">Personalize your workspace with themes and settings</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-800/50 backdrop-blur-sm border-t border-gray-700 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between space-y-4 sm:flex-row sm:space-y-0">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LofiStudy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://github.com/yourusername/lofistudy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
