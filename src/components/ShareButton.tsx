'use client';

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface ShareButtonProps {
  mode: 'frame' | 'card';
}

export default function ShareButton({ mode }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const getShareText = () => {
    const item = mode === 'frame' ? 'Profile Frame' : 'Builder Card';
    return `Ready for HH Goa 2026 🌴🚀\n\nJust generated my official ${item}.\n\nCan't wait to build with everyone!\n\n#FrameInGoa`;
  };

  const handleShareToX = () => {
    const text = getShareText();
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyCaption = async () => {
    const text = getShareText();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {/* Share to X Button */}
      <button
        onClick={handleShareToX}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-900 px-5 py-3 text-xs font-semibold text-white hover:bg-slate-800 transition-colors duration-200"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        <span>Share to X (Twitter)</span>
      </button>

      {/* Copy Caption Button */}
      <button
        onClick={handleCopyCaption}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-950 px-5 py-3 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-colors duration-200"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-400" />
            <span>Caption Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-400" />
            <span>Copy Post Caption</span>
          </>
        )}
      </button>
    </div>
  );
}
