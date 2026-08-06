'use client';

import React from 'react';
import { THEMES, Theme } from '@/utils/constants';
import { Check } from 'lucide-react';

interface ThemeSelectorProps {
  activeThemeId: string;
  onChange: (themeId: Theme['id']) => void;
}

export default function ThemeSelector({ activeThemeId, onChange }: ThemeSelectorProps) {
  return (
    <div className="w-full">
      <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Select Tropical Theme
      </label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {THEMES.map((theme) => {
          const isActive = theme.id === activeThemeId;
          return (
            <button
              key={theme.id}
              onClick={() => onChange(theme.id)}
              className={`relative flex flex-col items-center justify-center rounded-xl p-3 border text-center cursor-pointer transition-all duration-300 ${
                isActive
                  ? `border-transparent bg-slate-900 shadow-md ${theme.glow}`
                  : 'border-white/5 bg-slate-950/40 hover:border-white/10 hover:bg-slate-950/60'
              }`}
            >
              {/* Highlight bar for active state */}
              {isActive && (
                <div
                  className={`absolute inset-x-0 -top-[1px] h-[2px] rounded-t-xl bg-gradient-to-r ${theme.gradient}`}
                />
              )}

              {/* Color Swatch */}
              <div
                className={`relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br ${theme.gradient} mb-2 shadow-inner`}
              >
                {isActive && <Check className="h-3.5 w-3.5 text-white" />}
              </div>

              {/* Theme Name */}
              <span className={`text-xs font-semibold tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'}`}>
                {theme.name.split(' ')[0]} {/* display just 'Sunset', 'Ocean', etc. for compactness */}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
