/* eslint-disable */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence as FramerPresence } from 'framer-motion';
import { IconType } from 'react-icons';
import { FaPlay, FaPause, FaClock, FaMusic, FaBook, FaCog, FaWaveSquare, FaListUl, FaTimes, FaChevronRight, FaChevronLeft } from 'react-icons/fa';

interface GuideStep {
  title: string;
  description: string;
  icon: IconType;
}

const guideSteps: GuideStep[] = [
  {
    title: 'Pomodoro Timer',
    description: 'Stay focused with customizable work sessions. Use the play/pause button to control your timer, and switch between work and break modes.',
    icon: FaClock,
  },
  {
    title: 'Music Player',
    description: 'Listen to Lo-Fi beats while you work. Add your favorite YouTube music or choose from curated playlists.',
    icon: FaMusic,
  },
  {
    title: 'ASMR Mixer',
    description: 'Create your perfect ambient soundscape by mixing different ASMR sounds. Adjust volumes individually for the perfect blend.',
    icon: FaWaveSquare,
  },
  {
    title: 'Todo List',
    description: 'Keep track of your tasks. Add, complete, and delete todos to stay organized during your study sessions.',
    icon: FaListUl,
  },
  {
    title: 'Notes',
    description: 'Take quick notes with markdown support. Organize your thoughts and study materials in one place.',
    icon: FaBook,
  },
  {
    title: 'Settings',
    description: 'Customize your experience. Change themes, wallpapers, and adjust timer durations to match your preferences.',
    icon: FaCog,
  },
];

interface WelcomeGuideProps {
  onClose: () => void;
}

export default function WelcomeGuide({ onClose }: WelcomeGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const nextStep = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleClose();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for exit animation
  };

  return (
    <FramerPresence mode="wait">
      {isVisible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleClose}
          />

          {/* Guide Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-gray-900/90 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-2xl z-50"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>

            {/* Content */}
            <div className="text-center mb-8">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col items-center"
              >
                {/* Icon */}
                <div className="w-20 h-20 rounded-2xl bg-orange-500/20 flex items-center justify-center mb-6">
                  {(() => {
                    const Icon = guideSteps[currentStep].icon;
                    return <Icon className="w-10 h-10 text-orange-500" />;
                  })()}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-4">
                  {guideSteps[currentStep].title}
                </h3>

                {/* Description */}
                <p className="text-white/70 text-lg leading-relaxed">
                  {guideSteps[currentStep].description}
                </p>
              </motion.div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`p-3 rounded-xl flex items-center space-x-2 ${
                  currentStep === 0
                    ? 'text-white/30 cursor-not-allowed'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                } transition-colors`}
              >
                <FaChevronLeft />
                <span>Previous</span>
              </button>

              <div className="flex space-x-2">
                {guideSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-orange-500' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextStep}
                className="p-3 rounded-xl flex items-center space-x-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              >
                <span>{currentStep === guideSteps.length - 1 ? 'Finish' : 'Next'}</span>
                <FaChevronRight />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </FramerPresence>
  );
} 
