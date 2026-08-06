'use client';

import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/5 bg-slate-950 py-8 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          
          {/* Left copyright */}
          <div className="text-center sm:text-left">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} HH Goa 2026. Built with 🌴 for hackers worldwide.
            </p>
            <p className="mt-1 text-[10px] text-slate-600">
              All processing is done client-side. Your photos never touch our servers.
            </p>
          </div>

          {/* Right Links */}
          <div className="flex items-center gap-6">
            <a
              href="https://x.com/247pmstudio"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>Follow @HHGoa2026</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </a>
            <a
              href="https://mail.google.com/mail/u/0/?fs=1&to=satapathyprayasu@gmail.com&tf=cm"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200"
            >
              
              <span>📧satapathyprayasu@gmail.com</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </a>
            <a
              href="https://hhgoa.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors duration-200"
            >
              <span>Official Event Site</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </a>
          </div>

        </div>
      </div>
    </footer>
  );
}
