'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FrameGenerator from '@/components/FrameGenerator';
import BuilderCardGenerator from '@/components/BuilderCardGenerator';
import PalmLeafSVG from '@/components/PalmLeafSVG';
import { Sparkles, User, Badge } from 'lucide-react';
import { THEMES, Theme } from '@/utils/constants';

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState<'frame' | 'card'>('frame');
  const [activeThemeId, setActiveThemeId] = useState<Theme['id']>('sunset');
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  // Sync dark mode class on document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50 transition-colors duration-300">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Beautiful Branded Tropical Hackathon Illustration Background */}
        <div 
          className="absolute inset-0 z-0 opacity-15 dark:opacity-[0.22] pointer-events-none transition-all duration-500"
          style={{
            backgroundImage: "url('/hero-bg.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Orbiting Neon Mesh Blobs - dynamically updating with active theme using inline gradient styled structures */}
        <div 
          className="absolute top-[-10%] left-[-15%] w-[60vw] h-[60vw] rounded-full opacity-10 dark:opacity-[0.24] blur-[100px] sm:blur-[140px] animate-orbit-1 transition-all duration-1000" 
          style={{ background: `radial-gradient(circle, ${activeTheme.from} 0%, ${activeTheme.to} 100%)` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-15%] w-[55vw] h-[55vw] rounded-full opacity-10 dark:opacity-[0.2] blur-[100px] sm:blur-[140px] animate-orbit-2 transition-all duration-1000 [animation-delay:2.5s]" 
          style={{ background: `radial-gradient(circle, ${activeTheme.to} 0%, ${activeTheme.from} 100%)` }}
        />
        <div 
          className="absolute top-[35%] left-[25%] w-[40vw] h-[40vw] rounded-full opacity-5 dark:opacity-[0.14] blur-[90px] sm:blur-[120px] animate-orbit-3 transition-all duration-1000 [animation-delay:5s]" 
          style={{ background: `radial-gradient(circle, ${activeTheme.from} 0%, ${activeTheme.to} 100%)` }}
        />
        
        {/* Subtle geometric dot grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{
            backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Floating animated palm leaves */}
        <div className="absolute top-48 -left-12 w-36 h-36 text-emerald-500/5 dark:text-emerald-500/10 rotate-[25deg] animate-float-slow pointer-events-none">
          <PalmLeafSVG className="w-full h-full" />
        </div>
        <div className="absolute top-80 -right-12 w-44 h-44 text-[#ff5e62]/5 dark:text-[#ff5e62]/10 -rotate-[35deg] animate-float-medium pointer-events-none">
          <PalmLeafSVG className="w-full h-full" />
        </div>
        <div className="absolute bottom-40 left-12 w-40 h-40 text-sky-500/5 dark:text-sky-500/10 rotate-[55deg] animate-float-reverse pointer-events-none">
          <PalmLeafSVG className="w-full h-full" />
        </div>
      </div>

      {/* Header Navigation */}
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Content Area */}
      <main className="relative z-10 flex-grow flex flex-col items-center py-10 sm:py-16">
        
        {/* Hero Section */}
        <section className="text-center max-w-3xl px-4 mb-10 sm:mb-12">
          {/* Sparkle badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5e62]/20 bg-[#ff5e62]/5 px-3.5 py-1 text-xs font-semibold text-[#ff5e62] mb-5 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>HH Goa 2026 Exclusive</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1] mb-6"
          >
            Become an HH Goa <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sunset-start via-[#ff7a50] to-sunset-end">
              2026 Builder
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base md:text-lg text-slate-700 dark:text-slate-300 max-w-xl mx-auto leading-relaxed"
          >
            Generate your official event Profile Frame and digital Builder Card in under 10 seconds. Show the world you are building in Goa!
          </motion.p>
        </section>

        {/* Tab Selector */}
        <section className="w-full max-w-md px-4 mb-10">
          <div className="relative flex p-1.5 rounded-2xl border border-slate-200 dark:border-white/5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md">
            
            {/* Tab 1: Profile Frame */}
            <button
              onClick={() => setActiveTab('frame')}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold tracking-wide transition-colors duration-300 ${
                activeTab === 'frame' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {activeTab === 'frame' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-800/80 shadow"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <User className="h-4 w-4" />
              <span>Profile Frame</span>
            </button>

            {/* Tab 2: Builder ID Card */}
            <button
              onClick={() => setActiveTab('card')}
              className={`relative z-10 flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-xs font-semibold tracking-wide transition-colors duration-300 ${
                activeTab === 'card' ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
              }`}
            >
              {activeTab === 'card' && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-800/80 shadow"
                  transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                />
              )}
              <Badge className="h-4 w-4" />
              <span>Builder ID Card</span>
            </button>

          </div>
        </section>

        {/* Active Customizer Section */}
        <section className="w-full relative z-20">
          <AnimatePresence mode="wait">
            {activeTab === 'frame' ? (
              <motion.div
                key="frame"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <FrameGenerator activeThemeId={activeThemeId} setActiveThemeId={setActiveThemeId} />
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
              >
                <BuilderCardGenerator activeThemeId={activeThemeId} setActiveThemeId={setActiveThemeId} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

      </main>

      {/* Footer Branding */}
      <Footer />

    </div>
  );
}
