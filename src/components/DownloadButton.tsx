'use client';

import React, { useState } from 'react';
import { Download, Loader2, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import confetti from 'canvas-confetti';
import { audio } from '@/utils/audio';

interface DownloadButtonProps {
  elementRef: React.RefObject<HTMLDivElement | null>;
  fileName: string;
  onDownloadStarted?: () => void;
  onDownloadCompleted?: (dataUrl: string) => void;
}

export default function DownloadButton({
  elementRef,
  fileName,
  onDownloadStarted,
  onDownloadCompleted,
}: DownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const triggerConfetti = () => {
    // Beautiful tropical confetti explosion
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ff5e62', '#ff9966', '#00c6ff', '#8b5cf6', '#38ef7d'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ff5e62', '#ff9966', '#00c6ff', '#8b5cf6', '#38ef7d'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleDownload = async () => {
    if (!elementRef.current) return;

    setIsGenerating(true);
    setDownloadSuccess(false);
    onDownloadStarted?.();

    // Give browsers time to finish rendering adjustments
    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      // Generate high-resolution 3x png (3240x4050) for ultra-sharp social sharing
      const dataUrl = await toPng(elementRef.current, {
        cacheBust: true,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        pixelRatio: 3,
      });

      // Create download anchor
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();

      // Confetti & Success Animation
      audio.playSuccess();
      triggerConfetti();
      setDownloadSuccess(true);
      onDownloadCompleted?.(dataUrl);

      // Reset success state after a few seconds
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to generate image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isGenerating}
      className={`relative flex w-full items-center justify-center gap-2 rounded-xl py-3.5 px-6 font-semibold text-white shadow-lg overflow-hidden group transition-all duration-300 active:scale-[0.98] ${
        downloadSuccess
          ? 'bg-emerald-600 shadow-emerald-500/20'
          : 'bg-gradient-to-r from-sunset-start via-[#ff7a50] to-sunset-end hover:shadow-sunset-start/20'
      } disabled:opacity-85 disabled:pointer-events-none`}
    >
      {/* Background reflection shimmer */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-1000 ease-out" />

      {isGenerating ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Generating high-res PNG...</span>
        </>
      ) : downloadSuccess ? (
        <>
          <Check className="h-5 w-5" />
          <span>Downloaded! Ready to share 🎉</span>
        </>
      ) : (
        <>
          <Download className="h-5 w-5 group-hover:translate-y-[1px] transition-transform duration-200" />
          <span>Download Builder Card</span>
        </>
      )}
    </button>
  );
}
