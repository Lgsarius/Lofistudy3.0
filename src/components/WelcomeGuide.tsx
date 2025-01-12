/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaMusic, FaClock, FaStickyNote, FaCog, FaWaveSquare, FaListUl, FaComments, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface WelcomeGuideProps {
  onClose: () => void;
}

interface GuideStep {
  title: string;
  description: string;
  icon: IconType;
}

const guideSteps: GuideStep[] = [
  {
    title: 'Welcome to LofiStudy',
    description: 'Your personal workspace for focused study and productivity. Click on any icon in the dock below to get started.',
    icon: FaMusic
  },
  {
    title: 'Music Player',
    description: 'Immerse yourself in Lo-Fi beats while you work. Choose from curated playlists or add your own tracks.',
    icon: FaMusic
  },
  {
    title: 'Pomodoro Timer',
    description: 'Stay focused with customizable work sessions. Track your productivity and take structured breaks.',
    icon: FaClock
  },
  {
    title: 'Notes',
    description: 'Capture your thoughts with our markdown editor. Organize your notes and ideas effortlessly.',
    icon: FaStickyNote
  },
  {
    title: 'ASMR Mixer',
    description: 'Create your perfect ambient soundscape by mixing different ASMR sounds.',
    icon: FaWaveSquare
  },
  {
    title: 'Todo List',
    description: 'Keep track of your tasks and stay organized with our simple todo list.',
    icon: FaListUl
  },
  {
    title: 'Chat',
    description: 'Connect with other students and share your study progress.',
    icon: FaComments
  },
  {
    title: 'Settings',
    description: 'Personalize your workspace with custom themes, backgrounds, and preferences.',
    icon: FaCog
  }
];

export default function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-gray-900/90 backdrop-blur-xl text-white rounded-2xl p-10 max-w-xl w-full mx-4 shadow-2xl border border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors hover:bg-white/10 rounded-lg"
        >
          <FaTimes className="w-5 h-5" />
        </button>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-orange-500/20 flex items-center justify-center">
              {(() => {
                const Icon = guideSteps[currentStep].icon;
                return <Icon className="w-10 h-10 text-orange-500" />;
              })()}
            </div>
            <motion.h2 
              className="text-3xl font-bold mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {guideSteps[currentStep].title}
            </motion.h2>
            <motion.p 
              className="text-white/80 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {guideSteps[currentStep].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              currentStep === 0
                ? 'text-white/30 cursor-not-allowed'
                : 'text-white hover:bg-white/10'
            }`}
          >
            <FaChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Progress indicators */}
          <div className="flex items-center space-x-2">
            {guideSteps.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-orange-500 scale-125' : 'bg-white/20'
                }`}
                initial={false}
                animate={{
                  scale: index === currentStep ? 1.25 : 1,
                  opacity: index === currentStep ? 1 : 0.5
                }}
              />
            ))}
          </div>

          <button
            onClick={currentStep === guideSteps.length - 1 ? onClose : handleNext}
            className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white hover:bg-white/10 transition-colors"
          >
            <span>{currentStep === guideSteps.length - 1 ? 'Get Started' : 'Next'}</span>
            {currentStep < guideSteps.length - 1 && <FaChevronRight className="w-4 h-4" />}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
} 
