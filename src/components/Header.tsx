'use client';

import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { audio } from '@/utils/audio';
import { motion } from 'framer-motion';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

export default function Header({ darkMode, setDarkMode }: HeaderProps) {
  const [soundOn, setSoundOn] = React.useState(false);

  React.useEffect(() => {
    setSoundOn(audio.isEnabled());
  }, []);

  const handleToggleSound = () => {
    const nextVal = audio.toggle();
    setSoundOn(nextVal);
    if (nextVal) {
      audio.playSuccess();
    } else {
      audio.playClick();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-white/5 bg-white/85 dark:bg-slate-950/85 backdrop-blur-md transition-colors duration-300"
    >
      <div className="relative mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: 2:47PM Studio Logo */}
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-14 items-center justify-center transition-transform duration-300 hover:scale-105">
            <img
              src="/studio-logo.png"
              alt="2:47PM Studio Logo"
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* Center: Hacker House Logo */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-32 sm:h-9 sm:w-36 md:h-10 md:w-44 flex items-center justify-center pointer-events-none">
          <img
            src="/hacker-house-logo.png"
            alt="Hacker House Logo"
            className="h-full w-full object-contain"
          />
        </div>

        {/* Info Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[9px] sm:text-xs font-bold uppercase tracking-wider text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.15)]">
            <span className="h-2 w-2 rounded-full bg-[#00F5A0] shadow-[0_0_8px_#00F5A0] animate-ping" />
            <span>PORT OF GOA • FEB 2026 🌴</span>
          </div>

          {/* Sound FX Toggle Button */}
          <button
            onClick={handleToggleSound}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-[0.92] cursor-pointer"
            aria-label="Toggle sound effects"
          >
            {soundOn ? (
              <Volume2 className="h-4 w-4 text-[#00F5A0]" />
            ) : (
              <VolumeX className="h-4 w-4 text-slate-400" />
            )}
          </button>

          {/* Theme Switcher Button */}
          <button
            onClick={() => {
              audio.playClick();
              setDarkMode(!darkMode);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 active:scale-[0.92] cursor-pointer"
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 9h-1m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m12.728 12.728l.707.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

      </div>
    </motion.header>
  );
}
