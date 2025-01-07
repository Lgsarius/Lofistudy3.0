'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaClock, FaMusic, FaStickyNote, FaCog, FaDiscord, FaTwitter, FaGraduationCap, FaBrain, FaChartLine, FaHeadphones, FaMoon, FaStar } from 'react-icons/fa';
import { LofiLogo } from '@/components/icons/LofiLogo';
import { CoffeeCup } from '@/components/icons/CoffeeCup';
import { StudyCat } from '@/components/icons/StudyCat';
import { Laptop } from '@/components/icons/Laptop';

// Animation variants
const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-10, 10],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

const catTailAnimation = {
  initial: { rotate: -5 },
  animate: {
    rotate: 5,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

const noteAnimation = {
  initial: { y: 0, rotate: 0, opacity: 0 },
  animate: {
    y: [-20, 20],
    rotate: [-5, 5],
    opacity: [0.5, 1],
    transition: {
      duration: 4,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

const steamAnimation = {
  initial: { y: 0, opacity: 0 },
  animate: {
    y: -20,
    opacity: [0, 1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeOut"
    }
  }
};

const starAnimation = {
  initial: { scale: 0.8, opacity: 0.3 },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 2,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut"
    }
  }
};

const rainAnimation = {
  initial: { y: "-100%", opacity: 0 },
  animate: {
    y: "100%",
    opacity: [0, 0.1, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const vinylAnimation = {
  initial: { rotate: 0 },
  animate: {
    rotate: 360,
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

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
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0 flex items-center space-x-2">
                <LofiLogo className="w-8 h-8 text-orange-500" />
                <h1 className="text-xl font-bold bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  LofiStudy
                </h1>
              </div>
              <div className="hidden md:flex space-x-8 text-sm font-medium">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
                <a href="#how-it-works" className="text-gray-300 hover:text-white transition-colors">How It Works</a>
                <a href="#benefits" className="text-gray-300 hover:text-white transition-colors">Benefits</a>
                <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/login" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Sign In
              </Link>
              <Link href="/register" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Get Started - It's Free!
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16 sm:pt-24 sm:pb-20 overflow-hidden">
        {/* Animated Rain */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-px h-20 bg-gradient-to-b from-transparent via-orange-500/10 to-transparent"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-${Math.random() * 20}%`,
              }}
              variants={rainAnimation}
              initial="initial"
              animate="animate"
              transition={{
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-left relative"
            >
              {/* Vinyl Record */}
              <motion.div
                variants={vinylAnimation}
                initial="initial"
                animate="animate"
                className="absolute -top-10 -right-10 w-32 h-32"
              >
                <div className="relative w-full h-full">
                  <div className="absolute inset-0 rounded-full bg-gray-800/50 backdrop-blur-sm border border-orange-500/20" />
                  <div className="absolute inset-3 rounded-full bg-gray-700/50 border border-orange-500/10" />
                  <div className="absolute inset-[35%] rounded-full bg-orange-500/20 border border-orange-500/40" />
                </div>
              </motion.div>

              {/* Floating Notes */}
              <motion.div
                variants={noteAnimation}
                initial="initial"
                animate="animate"
                className="absolute -top-10 right-10"
              >
                <FaStickyNote className="w-8 h-8 text-orange-500/30" />
              </motion.div>
              <motion.div
                variants={noteAnimation}
                initial="initial"
                animate="animate"
                transition={{ delay: 1 }}
                className="absolute top-20 -left-10"
              >
                <FaHeadphones className="w-10 h-10 text-pink-500/30" />
              </motion.div>

              {/* Content */}
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Study Smarter with{' '}
                <span className="bg-gradient-to-r from-orange-400 to-pink-400 bg-clip-text text-transparent">
                  LofiStudy
                </span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Your free study companion featuring Lo-Fi music, Pomodoro timer, and note-taking tools.
                Join thousands of students enhancing their study sessions.
              </p>
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/register" className="w-full sm:w-auto inline-flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors">
                  Start Studying Now
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto inline-flex items-center justify-center bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors">
                  See How It Works
                </a>
              </div>
            </motion.div>

            {/* Right Content - Lo-Fi Scene */}
            <div className="hidden lg:block relative">
              <div className="relative w-full h-[500px]">
                {/* Stars */}
                <motion.div
                  variants={starAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute top-10 right-20"
                >
                  <FaStar className="w-4 h-4 text-yellow-400/50" />
                </motion.div>
                <motion.div
                  variants={starAnimation}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 0.5 }}
                  className="absolute top-20 left-40"
                >
                  <FaStar className="w-3 h-3 text-yellow-400/50" />
                </motion.div>
                <motion.div
                  variants={starAnimation}
                  initial="initial"
                  animate="animate"
                  transition={{ delay: 1 }}
                  className="absolute top-40 right-40"
                >
                  <FaStar className="w-5 h-5 text-yellow-400/50" />
                </motion.div>

                {/* Moon */}
                <motion.div
                  variants={floatingAnimation}
                  initial="initial"
                  animate="animate"
                  className="absolute top-10 right-10"
                >
                  <div className="relative">
                    <FaMoon className="w-16 h-16 text-yellow-200/20" />
                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-200/5 to-transparent rounded-full blur-lg" />
                  </div>
                </motion.div>

                {/* Desk Scene */}
                <div className="absolute bottom-0 left-0 right-0">
                  {/* Coffee Cup with Steam */}
                  <div className="absolute bottom-32 right-32">
                    <CoffeeCup
                      className="w-12 h-12 text-orange-500"
                    />
                    <motion.div
                      variants={steamAnimation}
                      initial="initial"
                      animate="animate"
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2"
                    >
                      <div className="w-0.5 h-6 bg-gradient-to-t from-orange-500/10 to-transparent rounded-full" />
                    </motion.div>
                  </div>

                  {/* Study Cat */}
                  <motion.div
                    variants={floatingAnimation}
                    initial="initial"
                    animate="animate"
                    className="absolute bottom-28 left-32"
                  >
                    <StudyCat
                      className="w-32 h-32 text-orange-500"
                    />
                    <motion.div
                      variants={catTailAnimation}
                      initial="initial"
                      animate="animate"
                      className="absolute bottom-0 -left-8 origin-bottom"
                    >
                      <div className="w-16 h-1.5 bg-orange-500/20 rounded-full" />
                    </motion.div>
                  </motion.div>

                  {/* Laptop */}
                  <Laptop
                    className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-64 h-48 text-orange-500"
                  />

                  {/* Desk */}
                  <div className="w-full h-24 bg-gray-800/50 backdrop-blur-sm rounded-t-3xl border-t border-orange-500/20">
                    {/* Desk Pattern */}
                    <div className="absolute inset-x-0 bottom-0 h-24 overflow-hidden rounded-t-3xl">
                      <div className="absolute inset-0 opacity-5">
                        <div className="absolute inset-0" style={{
                          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%23FF9500" fill-opacity="0.4"%3E%3Cpath d="M0 0h1v1H0zM4 4h1v1H4z"/%3E%3C/g%3E%3C/svg%3E")',
                          backgroundSize: '20px 20px'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Music Notes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: "100%", x: Math.random() * 100 + "%", opacity: 0 }}
              animate={{
                y: "-100%",
                opacity: [0, 1, 0],
                transition: {
                  duration: 10 + Math.random() * 5,
                  repeat: Infinity,
                  delay: i * 2,
                }
              }}
              className="absolute"
            >
              <FaMusic className="w-4 h-4 text-orange-500/20" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-12 bg-gray-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">10,000+</div>
              <div className="text-gray-300">Active Students</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">1M+</div>
              <div className="text-gray-300">Study Sessions</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-4xl font-bold text-orange-500 mb-2">100+</div>
              <div className="text-gray-300">Lo-Fi Tracks</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-4">Everything You Need to Excel</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                A complete suite of study tools designed to help you focus and achieve more.
                100% free, because great tools shouldn't cost a thing.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={FaMusic}
              title="Lo-Fi Music Player"
              description="Immerse yourself in curated Lo-Fi beats while you study. Choose from our collection of focus-enhancing tracks."
              delay={0.1}
            />
            <FeatureCard
              icon={FaClock}
              title="Pomodoro Timer"
              description="Stay focused with customizable study sessions. Track your productivity and take structured breaks."
              delay={0.2}
            />
            <FeatureCard
              icon={FaStickyNote}
              title="Smart Notes"
              description="Capture your thoughts with our markdown editor. Organize your study materials effortlessly."
              delay={0.3}
            />
            <FeatureCard
              icon={FaBrain}
              title="Focus Mode"
              description="Eliminate distractions with our focus mode. Keep your study sessions productive and efficient."
              delay={0.4}
            />
            <FeatureCard
              icon={FaChartLine}
              title="Progress Tracking"
              description="Monitor your study habits and improve your productivity with detailed insights."
              delay={0.5}
            />
            <FeatureCard
              icon={FaGraduationCap}
              title="Study Groups"
              description="Connect with fellow students, share notes, and motivate each other to succeed."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="relative z-10 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-4">Get Started in Minutes</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Three simple steps to transform your study sessions forever.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="01"
              title="Create Account"
              description="Sign up with your email or Google account. No credit card needed - it's completely free!"
              delay={0.1}
            />
            <StepCard
              number="02"
              title="Set Up Your Space"
              description="Choose your study environment, arrange your tools, and pick your favorite Lo-Fi tracks."
              delay={0.2}
            />
            <StepCard
              number="03"
              title="Start Learning"
              description="Jump into your first focused study session with all the tools you need to succeed."
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="relative z-10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3 className="text-3xl font-bold text-white mb-4">Why Students Love LofiStudy</h3>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Join thousands of students who have transformed their study habits.
              </p>
            </motion.div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard
              quote="The Pomodoro timer and Lo-Fi music combination helps me stay focused during long study sessions. My productivity has improved significantly!"
              author="Sarah K."
              role="Medical Student"
              delay={0.1}
            />
            <TestimonialCard
              quote="I love how everything I need is in one place. The notes feature helps me organize my thoughts, and the music keeps me in the zone."
              author="Michael R."
              role="Computer Science Major"
              delay={0.2}
            />
            <TestimonialCard
              quote="Being able to track my study sessions and see my progress has really motivated me to maintain consistent study habits."
              author="Emily L."
              role="High School Senior"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="relative z-10 py-20 bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Join Our Study Community
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Connect with fellow students, share study tips, and stay motivated together.
                All completely free, forever.
              </p>
              <Link href="/register" className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-lg text-lg transition-colors">
                Join Free Today
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 border-t border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <LofiLogo className="w-8 h-8 text-orange-500" />
                <span className="text-xl font-bold text-white">LofiStudy</span>
              </div>
              <p className="text-gray-400">
                Your free study companion with Lo-Fi music and productivity tools.
              </p>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Features</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Study Tools</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</a></li>
                <li><a href="#community" className="text-gray-400 hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Community</h4>
              <ul className="space-y-2">
                <li><a href="/discord" className="text-gray-400 hover:text-white transition-colors">Discord Server</a></li>
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">Study Blog</a></li>
                <li><a href="/guides" className="text-gray-400 hover:text-white transition-colors">Study Guides</a></li>
                <li><a href="/support" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-medium mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms</a></li>
                <li><a href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookies</a></li>
                <li><a href="/licenses" className="text-gray-400 hover:text-white transition-colors">Licenses</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} LofiStudy. Free and open source.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="https://github.com/yourusername/lofistudy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="w-6 h-6" />
              </a>
              <a
                href="https://discord.gg/lofistudy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaDiscord className="w-6 h-6" />
              </a>
              <a
                href="https://twitter.com/lofistudy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, delay }: {
  icon: any;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-colors"
    >
      <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center mb-4">
        <Icon className="w-6 h-6 text-orange-500" />
      </div>
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function StepCard({ number, title, description, delay }: {
  number: string;
  title: string;
  description: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-700/50 transition-colors"
    >
      <div className="text-4xl font-bold text-orange-500/20 absolute top-4 right-4">{number}</div>
      <h4 className="text-xl font-semibold text-white mb-2">{title}</h4>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function TestimonialCard({ quote, author, role, delay }: {
  quote: string;
  author: string;
  role: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6"
    >
      <p className="text-gray-300 mb-4">"{quote}"</p>
      <div>
        <p className="font-medium text-white">{author}</p>
        <p className="text-gray-400 text-sm">{role}</p>
      </div>
    </motion.div>
  );
}
