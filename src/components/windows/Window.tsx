/* eslint-disable */
'use client';

import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaExpand, FaMinus } from 'react-icons/fa';
import { useWindowsStore } from '@/lib/store/windows';

interface WindowProps {
  window: {
    id: string;
    type: string;
    title: string;
    x: number;
    y: number;
    width: number;
    height: number;
    isMaximized?: boolean;
  };
  children: React.ReactNode;
}

export function Window({ window, children }: WindowProps) {
  const dragRef = useRef<HTMLDivElement>(null);
  const { updateWindow, closeWindow, maximizeWindow, minimizeWindow } = useWindowsStore();
  const [isDragging, setIsDragging] = React.useState(false);

  // Get viewport dimensions
  const getViewportDimensions = () => {
    return {
      width: Math.min(window.innerWidth - 40, 1200), // Max width of 1200px
      height: Math.min(window.innerHeight - 100, 800), // Max height of 800px
    };
  };

  // Calculate initial size based on screen size
  const getInitialSize = () => {
    const viewport = getViewportDimensions();
    const aspectRatio = window.width / window.height;
    
    let width = Math.min(viewport.width * 0.8, window.width);
    let height = width / aspectRatio;

    if (height > viewport.height * 0.8) {
      height = viewport.height * 0.8;
      width = height * aspectRatio;
    }

    return { width, height };
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.isMaximized) {
        const { width, height } = getViewportDimensions();
        updateWindow(window.id, {
          width,
          height,
          x: 20,
          y: 40,
        });
      } else {
        const { width, height } = getInitialSize();
        const x = Math.max(20, Math.min(window.x, window.innerWidth - width - 20));
        const y = Math.max(40, Math.min(window.y, window.innerHeight - height - 20));
        updateWindow(window.id, { width, height, x, y });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [window.id, window.isMaximized, updateWindow]);

  // Handle maximize/restore
  const handleMaximize = () => {
    if (window.isMaximized) {
      const { width, height } = getInitialSize();
      updateWindow(window.id, {
        isMaximized: false,
        width,
        height,
        x: Math.max(20, Math.min(window.x, window.innerWidth - width - 20)),
        y: Math.max(40, Math.min(window.y, window.innerHeight - height - 20)),
      });
    } else {
      const { width, height } = getViewportDimensions();
      updateWindow(window.id, {
        isMaximized: true,
        width,
        height,
        x: 20,
        y: 40,
      });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      style={{
        width: window.width,
        height: window.height,
        x: window.x,
        y: window.y,
      }}
      className={`fixed bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl ${
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      }`}
      drag={!window.isMaximized}
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={{
        left: 0,
        right: window.innerWidth - window.width,
        top: 0,
        bottom: window.innerHeight - window.height,
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={(e, info) => {
        setIsDragging(false);
        updateWindow(window.id, {
          x: window.x + info.offset.x,
          y: window.y + info.offset.y,
        });
      }}
    >
      {/* Title Bar */}
      <div
        ref={dragRef}
        className="h-10 flex items-center justify-between px-4 bg-white/5"
      >
        <span className="text-white/80">{window.title}</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => minimizeWindow(window.id)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <FaMinus className="w-3 h-3" />
          </button>
          <button
            onClick={handleMaximize}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <FaExpand className="w-3 h-3" />
          </button>
          <button
            onClick={() => closeWindow(window.id)}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <FaTimes className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="absolute inset-0 top-10 overflow-auto">
        {children}
      </div>
    </motion.div>
  );
} 