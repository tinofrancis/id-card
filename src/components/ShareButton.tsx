'use client';

import React, { useState } from 'react';
import { Copy, Check, Loader2 } from 'lucide-react';

interface ShareButtonProps {
  mode: 'frame' | 'card';
  shareUrl?: string;
  onShareClick?: () => Promise<void>;
}

export default function ShareButton({ mode, shareUrl, onShareClick }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getShareText = () => {
    const item = mode === 'frame' ? 'Profile Frame' : 'Builder Card';
    const linkSection = shareUrl ? `\n\nVerify my pass here: ${shareUrl}${shareUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : '';
    return `Ready for HH Goa 2026!\n\nJust generated my official ${item}.${linkSection}\n\n#FrameInGoa`;
  };

  const handleShareToX = async () => {
    setIsSharing(true);
    // Open window synchronously immediately on click to prevent browser popup blockers
    const shareWindow = typeof window !== 'undefined' ? window.open('', '_blank') : null;
    
    try {
      if (onShareClick) {
        await onShareClick();
      }
      const text = getShareText();
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      
      if (shareWindow) {
        shareWindow.location.href = url;
      } else {
        // Fallback in case window.open was blocked or not supported
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Failed to share to X:', err);
      if (shareWindow) {
        shareWindow.close();
      }
    } finally {
      setIsSharing(false);
    }
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
        disabled={isSharing}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-transparent bg-slate-900 text-white hover:bg-black hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/40 px-5 py-3 text-xs font-semibold transition-all duration-200 active:scale-[0.96] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSharing ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin text-white" />
            <span>Generating Preview...</span>
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5 text-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span>Share to X (Twitter)</span>
          </>
        )}
      </button>

      {/* Copy Caption Button */}
      <button
        onClick={handleCopyCaption}
        className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-100 dark:bg-slate-950 px-5 py-3 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-white/5 hover:shadow-md transition-all duration-200 active:scale-[0.96] cursor-pointer"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-500 dark:text-emerald-400" />
            <span>Caption Copied!</span>
          </>
        ) : (
          <>
            <Copy className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            <span>Copy Post Caption</span>
          </>
        )}
      </button>
    </div>
  );
}
