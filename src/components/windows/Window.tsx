/* eslint-disable */
'use client';

import { useRef, useState, useEffect } from 'react';
import { useWindowsStore } from '@/lib/store/windows';
import { useSettingsStore } from '@/lib/store/settings';
import { motion, AnimatePresence } from 'framer-motion';
import Draggable, { DraggableEventHandler, DraggableData } from 'react-draggable';
import { Resizable } from 're-resizable';
import { FaWindowMaximize, FaWindowRestore } from 'react-icons/fa';

const MENU_BAR_HEIGHT = 20; // Height of the top menu bar
const DOCK_HEIGHT = 130; // Increased dock height for better spacing
const DOCK_SPACING = 20; // Additional spacing above dock

interface WindowData {
  id: string;
  title: string;
  type: string;
  isMinimized: boolean;
  isMaximized: boolean;
  position: { x: number; y: number };
  size: { width: number; height: number };
  zIndex?: number;
}

interface WindowProps {
  window: WindowData;
  children: React.ReactNode;
}

export function Window({ window: windowData, children }: WindowProps) {
  const { updateWindow, removeWindow, bringToFront } = useWindowsStore();
  const { theme } = useSettingsStore();
  const [isDragging, setIsDragging] = useState(false);
  const [bounds, setBounds] = useState({ width: 1920, height: 1080 });
  const [mounted, setMounted] = useState(false);
  const dragRef = useRef<any>(null);
  const resizeRef = useRef<Resizable>(null);
  const lastPosition = useRef(windowData.position);
  const lastSize = useRef(windowData.size);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (typeof globalThis.window !== 'undefined' && mounted) {
      const updateBounds = () => {
        setBounds({
          width: globalThis.window.innerWidth,
          height: globalThis.window.innerHeight - MENU_BAR_HEIGHT - DOCK_HEIGHT - DOCK_SPACING,
        });
      };

      updateBounds();
      globalThis.window.addEventListener('resize', updateBounds);
      return () => globalThis.window.removeEventListener('resize', updateBounds);
    }
  }, [mounted]);

  useEffect(() => {
    if (!windowData.isMaximized) {
      lastPosition.current = windowData.position;
      lastSize.current = windowData.size;
    }
  }, [windowData.isMaximized, windowData.position, windowData.size]);

  const handleClose = () => {
    removeWindow(windowData.id);
  };

  const handleMinimize = () => {
    updateWindow(windowData.id, { isMinimized: true });
  };

  const handleMaximize = () => {
    if (windowData.isMaximized) {
      updateWindow(windowData.id, {
        isMaximized: false,
        position: lastPosition.current,
        size: lastSize.current,
      });
    } else {
      updateWindow(windowData.id, {
        isMaximized: true,
        position: { x: 0, y: MENU_BAR_HEIGHT },
        size: { width: bounds.width, height: bounds.height },
      });
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains('window-handle')) {
      handleMaximize();
    }
  };

  const handleDragStart: DraggableEventHandler = (e) => {
    if (!dragRef.current) return;
    setIsDragging(true);
  };

  const handleDragStop: DraggableEventHandler = (e, data: DraggableData) => {
    setIsDragging(false);
    if (!windowData.isMaximized) {
      updateWindow(windowData.id, {
        position: { x: data.x, y: data.y },
      });
    }
  };

  if (!mounted) return null;

  // Return null but don't cleanup when minimized
  if (windowData.isMinimized) {
    return (
      <div style={{ display: 'none' }}>
        {children}
      </div>
    );
  }

  const maximizedStyle = windowData.isMaximized ? {
    position: 'fixed',
    top: MENU_BAR_HEIGHT,
    left: 0,
    width: bounds.width,
    height: bounds.height,
  } as const : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="fixed top-0 left-0"
      style={{ 
        zIndex: windowData.zIndex || 10,
        ...(windowData.isMaximized ? { top: `${MENU_BAR_HEIGHT}px` } : {})
      }}
      onClick={() => {
        const newZIndex = bringToFront(windowData.id);
        if (newZIndex) {
          updateWindow(windowData.id, { zIndex: newZIndex });
        }
      }}
    >
      {mounted && (
        <Draggable
          nodeRef={dragRef}
          handle=".window-handle"
          position={windowData.isMaximized ? { x: 0, y: 0 } : windowData.position}
          onStart={handleDragStart}
          onStop={handleDragStop}
          bounds={{
            left: 0,
            top: MENU_BAR_HEIGHT,
            right: bounds.width - windowData.size.width,
            bottom: bounds.height - windowData.size.height + MENU_BAR_HEIGHT
          }}
          disabled={windowData.isMaximized}
          cancel=".window-control"
        >
          <div ref={dragRef}>
            <Resizable
              ref={resizeRef}
              size={windowData.isMaximized ? { width: bounds.width, height: bounds.height } : windowData.size}
              onResizeStop={(e, direction, ref, d) => {
                if (!windowData.isMaximized) {
                  const newWidth = Math.min(windowData.size.width + d.width, bounds.width);
                  const newHeight = Math.min(windowData.size.height + d.height, bounds.height);
                  updateWindow(windowData.id, {
                    size: { width: newWidth, height: newHeight },
                  });
                }
              }}
              minWidth={400}
              minHeight={300}
              maxWidth={bounds.width}
              maxHeight={bounds.height}
              enable={{
                top: !windowData.isMaximized,
                right: !windowData.isMaximized,
                bottom: !windowData.isMaximized,
                left: !windowData.isMaximized,
                topRight: !windowData.isMaximized,
                bottomRight: !windowData.isMaximized,
                bottomLeft: !windowData.isMaximized,
                topLeft: !windowData.isMaximized,
              }}
              className={`${theme === 'dark' ? 'bg-gray-900/90' : 'bg-white/90'} backdrop-blur-2xl rounded-xl border ${theme === 'dark' ? 'border-white/20' : 'border-black/20'} shadow-2xl overflow-hidden
                ${isDragging ? 'cursor-grabbing' : ''}
                transition-all duration-200
                ${windowData.isMaximized ? 'rounded-none' : ''}
              `}
              style={maximizedStyle}
            >
              {/* Window Title Bar */}
              <div
                className={`window-handle h-10 ${theme === 'dark' ? 'bg-gray-800/80' : 'bg-gray-100/80'} backdrop-blur-xl flex items-center px-4 cursor-grab active:cursor-grabbing`}
                onDoubleClick={handleDoubleClick}
              >
                {/* Window Controls */}
                <div className="flex items-center space-x-2 -ml-1">
                  <button
                    onClick={handleClose}
                    className="window-control w-3.5 h-3.5 rounded-full bg-red-500 hover:bg-red-600 transition-colors flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-red-900 font-bold text-xs">×</span>
                  </button>
                  <button
                    onClick={handleMinimize}
                    className="window-control w-3.5 h-3.5 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors flex items-center justify-center group"
                  >
                    <span className="opacity-0 group-hover:opacity-100 text-yellow-900 font-bold text-xs">−</span>
                  </button>
                  <button
                    onClick={handleMaximize}
                    className="window-control w-3.5 h-3.5 rounded-full bg-green-500 hover:bg-green-600 transition-colors flex items-center justify-center group"
                  >
                    {windowData.isMaximized ? (
                      <FaWindowRestore className="opacity-0 group-hover:opacity-100 text-green-900 w-2 h-2" />
                    ) : (
                      <FaWindowMaximize className="opacity-0 group-hover:opacity-100 text-green-900 w-2 h-2" />
                    )}
                  </button>
                </div>
                
                {/* Window Title */}
                <div className={`absolute left-1/2 transform -translate-x-1/2 text-sm ${theme === 'dark' ? 'text-white/90' : 'text-black/90'} font-medium select-none`}>
                  {windowData.title}
                </div>
              </div>

              {/* Window Content */}
              <div className={`h-[calc(100%-2.5rem)] overflow-auto ${theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50/50'}`}>
                {children}
              </div>
            </Resizable>
          </div>
        </Draggable>
      )}
    </motion.div>
  );
} 