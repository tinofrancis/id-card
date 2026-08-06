'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface BuilderTitleProps {
  title: string;
  onRegenerate: () => void;
  accentClass: string;
}

export default function BuilderTitle({ title, onRegenerate, accentClass }: BuilderTitleProps) {
  // Split title into words to animate them
  const words = title.split(' ');

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Generated Builder Title
        </label>
        <button
          onClick={onRegenerate}
          type="button"
          className="flex items-center gap-1 text-[11px] font-semibold text-[#ff5e62] hover:text-[#ff5e62]/80 transition-colors duration-200"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Regenerate Title</span>
        </button>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/50 px-4 py-3 min-h-[50px] overflow-hidden">
        {/* Animated text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={title}
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className={`font-display text-sm font-bold uppercase tracking-widest ${accentClass}`}
          >
            {words.map((word, wordIndex) => (
              <span key={wordIndex} className="inline-block mr-1.5 whitespace-nowrap">
                {word.split('').map((char, charIndex) => (
                  <motion.span
                    key={charIndex}
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            ))}
          </motion.div>
        </AnimatePresence>

        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
      </div>
    </div>
  );
}
