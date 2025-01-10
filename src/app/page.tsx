'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useInView, useSpring } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { FaGithub, FaPlay, FaPause, FaHeadphones, FaBook, FaClock, FaDiscord, FaBrain, FaLaptop, FaMoon, FaChevronDown, 
  FaForward, FaBackward, FaRandom, FaVolumeUp, FaTrash, FaCog, FaCheck, FaPen, FaPlus, FaSearch, FaFolder, FaEdit, FaMarkdown, FaCalendar, FaRedo, FaCoffee, FaPalette, FaImage, FaSun } from 'react-icons/fa';

export default function LandingPage() {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [typedText, setTypedText] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const headlines = [
    "Maximize Productivity",
    "Optimize Performance",
    "Enhance Focus",
    "Streamline Workflow"
  ];

  const subtitle = "Elevate your productivity with immersive lo-fi workspaces";

  // Parallax effects
  const y = useTransform(smoothProgress, [0, 1], [0, -300]);
  const opacity = useTransform(smoothProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(smoothProgress, [0, 0.2], [1, 0.8]);

  const handlePreview = () => {
    setIsPlaying(true);
    router.push('/preview');
  };

  useEffect(() => {
    const currentHeadline = headlines[currentText];
    let currentIndex = 0;
    let typingInterval: NodeJS.Timeout;

    const typeText = () => {
      if (currentIndex <= currentHeadline.length) {
        setTypedText(currentHeadline.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          currentIndex = 0;
          setCurrentText((prev) => (prev + 1) % headlines.length);
        }, 2000);
      }
    };

    typingInterval = setInterval(typeText, 100);

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, [currentText]);

  const scrollToFeatures = () => {
    const firstFeature = document.getElementById('features');
    if (firstFeature) {
      firstFeature.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative bg-gray-900 text-white" ref={containerRef}>
      {/* Hero Section */}
      <section className="relative min-h-screen overflow-hidden">
        {/* Background with Canvas Animation */}
        <BackgroundAnimation />

        {/* Content */}
        <motion.div 
          className="relative z-10 min-h-screen flex flex-col"
          style={{ y, opacity, scale }}
        >
          {/* Navigation */}
          <nav className="px-6 py-8 backdrop-blur-sm bg-black/20">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
        <Image
                    src="/logo.png"
                    alt="LofiStudy"
                    width={40}
                    height={40}
                    className="rounded-xl"
                  />
                </motion.div>
                <span className="text-xl font-bold">LofiStudy</span>
              </motion.div>

              <motion.div 
                className="flex items-center space-x-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                <motion.a
                  href="https://github.com/yourusername/lofistudy"
            target="_blank"
            rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaGithub className="w-6 h-6" />
                </motion.a>
                <motion.a
                  href="https://discord.gg/lofistudy"
            target="_blank"
            rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <FaDiscord className="w-6 h-6" />
                </motion.a>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePreview}
                  className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-all duration-300"
                >
                  <FaPlay className="w-4 h-4" />
                  <span className="text-sm font-medium">Try Demo</span>
                </motion.button>
                <Link href="/login">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 transition-all duration-300"
                  >
                    Get Started
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </nav>

          {/* Hero Content */}
          <main className="flex-1 flex items-center justify-center px-6 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto w-full">
              <div className="max-w-3xl">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <h1 className="text-6xl md:text-7xl font-bold whitespace-nowrap">
                      <span className="bg-gradient-to-r from-amber-200 via-orange-300 to-amber-200 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient inline-flex whitespace-nowrap">
                        {typedText}
                        <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity text-amber-300`}>|</span>
                      </span>
                    </h1>
                    <p className="text-2xl text-amber-100/60 leading-relaxed">
                      {subtitle}
                    </p>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="flex flex-col sm:flex-row items-center gap-6 pt-8"
                  >
                    <Link href="/register" className="w-full sm:w-auto">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full group relative px-8 py-4 rounded-xl bg-gradient-to-r from-orange-500 to-purple-500 hover:from-orange-600 hover:to-purple-600 transition-all duration-300 shadow-xl hover:shadow-2xl overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-white/20 translate-y-full"
                          whileHover={{ translateY: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                        <span className="relative z-10 text-lg font-medium">Start Your Journey</span>
                      </motion.button>
                    </Link>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handlePreview}
                      className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur transition-all duration-300"
                    >
                      <FaPlay className="w-5 h-5 text-orange-500" />
                      <span className="text-lg font-medium">Watch Demo</span>
                    </motion.button>
                  </motion.div>

                  {/* Stats */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex flex-wrap gap-8 pt-8"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-orange-500">24/7</div>
                      <div className="text-white/60">Lofi Radio</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-purple-500">100%</div>
                      <div className="text-white/60">Free Forever</div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl font-bold text-amber-500">∞</div>
                      <div className="text-white/60">Possibilities</div>
                    </div>
                  </motion.div>

                  {/* Feature Pills */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="flex flex-wrap gap-4 pt-8"
                  >
                    <FeaturePill icon={FaHeadphones} text="Lo-Fi Music" delay={0.2} />
                    <FeaturePill icon={FaClock} text="Pomodoro Timer" delay={0.4} />
                    <FeaturePill icon={FaBook} text="Smart Notes" delay={0.6} />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </main>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            onClick={scrollToFeatures}
          >
            <FaChevronDown className="w-6 h-6 text-white/60" />
          </motion.div>
        </motion.div>
      </section>

      {/* Feature Sections */}
      <div id="features">
        <FeatureSection
          title="Focus with Lo-Fi"
          description="Immerse yourself in carefully curated lo-fi playlists designed to enhance your focus and productivity. Choose from a variety of moods and styles."
          icon={FaHeadphones}
          align="right"
          color="orange"
          PreviewComponent={AudioPlayerPreview}
        />

        <FeatureSection
          title="Track Your Time"
          description="Stay productive with our customizable Pomodoro timer. Set work sessions, take structured breaks, and maintain a healthy study rhythm."
          icon={FaClock}
          align="left"
          color="purple"
          PreviewComponent={PomodoroPreview}
        />

        <FeatureSection
          title="Capture Ideas"
          description="Take notes effortlessly with our minimalist markdown editor. Organize your thoughts, create study guides, and never lose track of important information."
          icon={FaBook}
          align="right"
          color="blue"
          PreviewComponent={NotesPreview}
        />

        <FeatureSection
          title="Stay Focused"
          description="Customize your study environment with personalized settings. Adjust themes, notifications, and preferences to create your perfect workspace."
          icon={FaCog}
          align="left"
          color="green"
          PreviewComponent={SettingsPreview}
        />
      </div>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-white/10 backdrop-blur-sm bg-gray-900/30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between text-white/60">
          <div className="text-sm">
            © 2024 LofiStudy. All rights reserved.
          </div>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function BackgroundAnimation() {
  return (
    <>
      <div className="fixed inset-0 z-0 bg-[#151515]" />
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-gray-900 via-purple-900/20 to-orange-900/20 opacity-40" />
      <div className="fixed inset-0 z-0 backdrop-blur-[100px]" />
    </>
  );
}

function FeatureSection({ title, description, icon: Icon, align, color, PreviewComponent }: {
  title: string;
  description: string;
  icon: any;
  align: 'left' | 'right';
  color: string;
  PreviewComponent: React.ComponentType;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section
      ref={ref}
      className="min-h-[80vh] relative flex items-center py-12 overflow-hidden backdrop-blur-sm bg-black/20"
    >
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${align === 'right' ? '75%' : '25%'} 50%, ${color}50 0%, transparent 50%)`,
          opacity
        }}
      />

      <div className="max-w-6xl mx-auto px-6 w-full">
        <div className={`flex flex-col ${align === 'right' ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8`}>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: align === 'right' ? -50 : 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="flex items-center space-x-4 mb-6">
              <motion.div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
              >
                <Icon className="w-6 h-6 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold text-white">{title}</h2>
            </div>
            <p className="text-xl text-white/60 leading-relaxed">
              {description}
            </p>
          </motion.div>

          <motion.div
            className="flex-1 relative"
            style={{ y }}
          >
            <motion.div
              className="relative h-[600px] rounded-xl overflow-hidden shadow-2xl bg-gray-900/90 backdrop-blur-xl border border-white/10"
              initial={{ opacity: 0, x: align === 'right' ? 50 : -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.02 }}
            >
              <PreviewComponent />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function FeaturePill({ icon: Icon, text, delay }: {
  icon: any;
  text: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ scale: 1.05 }}
      className="group flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl hover:bg-white/10 transition-all duration-300"
    >
      <motion.div
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.5 }}
      >
        <Icon className="w-4 h-4 text-orange-400 group-hover:text-orange-300 transition-colors" />
      </motion.div>
      <span className="text-sm text-white/80 group-hover:text-white transition-colors">{text}</span>
    </motion.div>
  );
}

// Preview Components
function AudioPlayerPreview() {
  return (
    <div className="h-full flex flex-col text-white">
      {/* Stream Selector */}
      <div className="p-4 border-b border-white/10 backdrop-blur-xl">
        <div className="relative">
          <button className="w-full px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-purple-500 flex items-center justify-center">
                <FaHeadphones className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">lofi hip hop radio</p>
                <p className="text-xs text-white/60">Lofi Girl</p>
              </div>
            </div>
            <FaChevronDown className="w-4 h-4 text-white/60" />
          </button>
        </div>
      </div>

      {/* Player Controls */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 space-y-8">
        {/* Album Art */}
        <div className="relative w-48 h-48">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500 to-purple-500 animate-pulse" />
          <div className="absolute inset-2 rounded-xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
            <FaHeadphones className="w-16 h-16 text-white/20" />
          </div>
        </div>

        {/* Title and Artist */}
        <div className="text-center">
          <h3 className="text-lg font-medium">lofi hip hop radio</h3>
          <p className="text-sm text-white/60">beats to relax/study to</p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white">
            <FaBackward className="w-5 h-5" />
          </button>
          <button className="w-14 h-14 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center hover:bg-orange-500/30 transition-colors">
            <FaPlay className="w-6 h-6" />
          </button>
          <button className="p-3 rounded-lg hover:bg-white/5 transition-colors text-white/60 hover:text-white">
            <FaForward className="w-5 h-5" />
          </button>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-4 text-white/60">
          <FaVolumeUp className="w-4 h-4" />
          <div className="w-32 h-1 bg-white/10 rounded-full">
            <div className="w-1/2 h-full bg-orange-500 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PomodoroPreview() {
  return (
    <div className="h-full flex flex-col text-white">
      {/* Timer Display */}
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 relative">
        {/* Progress Ring */}
        <div className="relative">
          <svg className="w-64 h-64 transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="120"
              className="stroke-white/10 fill-none"
              strokeWidth="4"
            />
            <circle
              cx="128"
              cy="128"
              r="120"
              className="fill-none transition-all duration-200"
              strokeWidth="4"
              stroke="#f97316"
              strokeDasharray={2 * Math.PI * 120}
              strokeDashoffset={2 * Math.PI * 120 * 0.4} // Static 40% progress for preview
            />
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-mono font-bold tracking-tight">
              25:00
            </span>
            <span className="text-lg mt-2 text-white/60">
              Work Time
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-4">
          <button className="p-4 rounded-full bg-orange-500/20 text-orange-500">
            <FaPlay className="w-6 h-6" />
          </button>
          
          <button className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <FaRedo className="w-6 h-6" />
          </button>

          <button className="p-4 rounded-full bg-white/10 text-white/80 hover:bg-white/20 transition-colors">
            <FaCog className="w-6 h-6" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center space-x-2">
          <button className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-orange-500/20 text-orange-500">
            <FaBrain className="w-4 h-4" />
            <span>Work</span>
          </button>

          <button className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white/60">
            <FaCoffee className="w-4 h-4" />
            <span>Break</span>
          </button>

          <button className="px-4 py-2 rounded-lg flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-white/60">
            <FaCoffee className="w-4 h-4" />
            <span>Long Break</span>
          </button>
        </div>

        {/* Session Counter */}
        <div className="text-sm text-white/40">
          Sessions completed: 0
        </div>
      </div>
    </div>
  );
}

function NotesPreview() {
  return (
    <div className="h-full flex text-white">
      {/* Sidebar */}
      <div className="w-72 flex flex-col border-r border-white/10 bg-gray-900/50 backdrop-blur-xl">
        {/* Search and New Note */}
        <div className="p-4 space-y-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-2.5 text-white/40" />
            <input
              type="text"
              placeholder="Search notes... (⌘F)"
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-white/40 focus:outline-none"
              readOnly
            />
          </div>
          <button
            className="w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors bg-orange-500/20 text-orange-500"
          >
            <FaPlus />
            <span>New Note (⌘N)</span>
          </button>
        </div>

        {/* Folders */}
        <div className="px-2 py-3 border-t border-white/10">
          <button className="w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 bg-white/20">
            <FaFolder className="text-white/60" />
            <span>All Notes</span>
          </button>
          <button className="w-full px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-white/10">
            <FaFolder className="text-white/60" />
            <span>Study</span>
          </button>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
          <div className="p-3 rounded-lg bg-orange-500/20">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">Welcome to Notes! 📝</h3>
                <p className="text-sm truncate text-white/60">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
          <div className="p-3 rounded-lg hover:bg-white/5 group">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">Mathematics Notes</h3>
                <p className="text-sm truncate text-white/60">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
              <button className="p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/10">
                <FaTrash className="w-4 h-4 text-red-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 border-b border-white/10 backdrop-blur-xl flex items-center justify-between space-x-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button className="p-2 rounded-lg hover:bg-white/10 text-orange-500">
                <FaEdit />
              </button>
            </div>
            <div className="text-sm text-white/60">
              <FaMarkdown className="inline-block mr-2" />
              Markdown supported
            </div>
          </div>
          
          <div>
            <button className="px-3 py-1.5 rounded-lg flex items-center space-x-2 hover:bg-white/10">
              <FaCalendar className="text-white/60" />
              <span>{new Date().toLocaleDateString()}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="prose prose-sm max-w-none">
            <h1>Welcome to Notes! 📝</h1>
            <p>This is your new markdown editor. Here's what you can do:</p>
            <h2>Rich Text Features</h2>
            <ul>
              <li>Write in <strong>bold</strong> or <em>italics</em></li>
              <li>Create organized lists</li>
              <li>Add <code>inline code</code> or code blocks</li>
              <li>And much more!</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsPreview() {
  return (
    <div className="h-full flex text-white">
      {/* Sidebar */}
      <div className="w-48 border-r border-white/10 p-4 space-y-2">
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-white/20 text-white">
          <FaPalette className="w-4 h-4" />
          <span>Appearance</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
          <FaImage className="w-4 h-4" />
          <span>Wallpaper</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
          <FaVolumeUp className="w-4 h-4" />
          <span>Sound</span>
        </button>
        <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
          <FaClock className="w-4 h-4" />
          <span>Pomodoro</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <div className="space-y-8">
          {/* Theme Toggle */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white/90">Theme</h3>
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg text-white/60 hover:bg-white/10 transition-colors">
                <FaSun className="w-4 h-4" />
                <span>Light</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-white/20 text-white">
                <FaMoon className="w-4 h-4" />
                <span>Dark</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-4">
            <h3 className="text-base font-medium text-white/90">Accent Color</h3>
            <div className="flex items-center space-x-3">
              <button className="relative w-8 h-8 rounded-full bg-orange-500 transition-transform hover:scale-110">
                <FaCheck className="absolute inset-0 m-auto text-white w-4 h-4" />
              </button>
              <button className="w-8 h-8 rounded-full bg-purple-500 transition-transform hover:scale-110" />
              <button className="w-8 h-8 rounded-full bg-blue-500 transition-transform hover:scale-110" />
              <button className="w-8 h-8 rounded-full bg-green-500 transition-transform hover:scale-110" />
              <button className="w-8 h-8 rounded-full bg-red-500 transition-transform hover:scale-110" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
