'use client';

import React, { useState, useRef, useEffect } from 'react';
import UploadBox from './UploadBox';
import CropModal from './CropModal';
import ThemeSelector from './ThemeSelector';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import { THEMES, Theme } from '@/utils/constants';
import { Edit2, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { audio } from '@/utils/audio';

interface FrameGeneratorProps {
  activeThemeId: Theme['id'];
  setActiveThemeId: (themeId: Theme['id']) => void;
}

export default function FrameGenerator({ activeThemeId, setActiveThemeId }: FrameGeneratorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [frameId, setFrameId] = useState('');

  // Interactive Pan / Zoom / Rotation Controls
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setFrameId(`FRAME-GOA-${Date.now()}`);
  }, []);

  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    background: 'transparent',
  });

  const highResRef = useRef<HTMLDivElement | null>(null);
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const rotateX = -(y - rect.height / 2) / (rect.height / 20);
    const rotateY = (x - rect.width / 2) / (rect.width / 20);
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    });

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setGlareStyle({
      background: `radial-gradient(circle 150px at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.15), transparent)`,
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
    setGlareStyle({
      background: 'transparent',
    });
  };

  // Confetti on success
  useEffect(() => {
    if (croppedImage) {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#FFE600', '#FF007A', '#0A6B48', '#00FF66'],
      });
    }
  }, [croppedImage]);

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
    setShowCropModal(true);
  };

  const saveProfileFrame = async (imageToSave?: string | null) => {
    const img = imageToSave || croppedImage;
    if (!img) return;
    try {
      const finalId = `FRAME-GOA-${Date.now()}`;
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'frame',
          id: finalId,
          theme: activeThemeId,
          image: img,
        }),
      });
    } catch (err) {
      console.error('Failed to auto-save builder profile frame details:', err);
    }
  };

  const handleCropComplete = (croppedSrc: string) => {
    setCroppedImage(croppedSrc);
    setShowCropModal(false);
    saveProfileFrame(croppedSrc);
  };

  const handleReset = () => {
    audio.playClick();
    setImageSrc(null);
    setCroppedImage(null);
    setZoom(1);
    setPanX(0);
    setPanY(0);
    setRotation(0);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl mx-auto px-4">
      {/* Left panel: Controls */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">
        <div className="glass-panel rounded-2xl p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.glow}`} />
            Profile Frame Customizer
          </h2>

          <div className="flex flex-col gap-6">
            {/* Upload Area */}
            {!croppedImage ? (
              <UploadBox onImageSelected={handleImageSelected} />
            ) : (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Profile Photo
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/50 dark:bg-slate-950/50 p-4 transition-colors duration-300">
                  <div className="flex items-center gap-3">
                    <img
                      src={croppedImage}
                      alt="Cropped Preview"
                      className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Photo loaded</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Successfully cropped & optimized</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        audio.playClick();
                        setShowCropModal(true);
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                      title="Recrop photo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm cursor-pointer"
                      title="Upload new photo"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Theme Selector */}
            <ThemeSelector activeThemeId={activeThemeId} onChange={setActiveThemeId} />

            {/* Interactive Image Positioning Sliders */}
            {croppedImage && (
              <div className="flex flex-col gap-4 p-4 rounded-xl border border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-slate-950/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
                  Adjust Photo Layout
                </span>
                
                {/* Zoom Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Zoom</span>
                    <span>{zoom.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2.5"
                    step="0.1"
                    value={zoom}
                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                    className="w-full accent-[#FFE600] h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Pan X Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Position X</span>
                    <span>{panX}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={panX}
                    onChange={(e) => setPanX(parseInt(e.target.value))}
                    className="w-full accent-[#FFE600] h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Pan Y Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Position Y</span>
                    <span>{panY}px</span>
                  </div>
                  <input
                    type="range"
                    min="-100"
                    max="100"
                    step="1"
                    value={panY}
                    onChange={(e) => setPanY(parseInt(e.target.value))}
                    className="w-full accent-[#FFE600] h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rotation Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>Rotation</span>
                    <span>{rotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    step="5"
                    value={rotation}
                    onChange={(e) => setRotation(parseInt(e.target.value))}
                    className="w-full accent-[#FFE600] h-1 bg-slate-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            {croppedImage && (
              <div className="flex flex-col gap-4 mt-2">
                <DownloadButton
                  elementRef={highResRef}
                  fileName={`hh-goa-profile-frame-${activeThemeId}.png`}
                  label="Download Completed Frame"
                  onDownloadCompleted={async (dataUrl) => {
                    if (dataUrl) {
                      await saveProfileFrame(dataUrl);
                    } else {
                      await saveProfileFrame();
                    }
                  }}
                />
                <ShareButton mode="frame" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right panel: Preview */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center order-1 lg:order-2">
        <div className="w-full max-w-[400px] flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center block">
            Live Preview
          </span>

          {/* Visible Interactive Preview (Perfect Square aspect-ratio) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ ...tiltStyle, backgroundColor: '#070d10' }}
            className="relative aspect-square w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-black/40 flex flex-col justify-center items-center transition-transform duration-200 ease-out will-change-transform cursor-crosshair"
          >
            {/* 3D Glare */}
            <div
              style={glareStyle}
              className="absolute inset-0 z-40 pointer-events-none opacity-60 transition-opacity duration-300"
            />

            <div className="absolute inset-0 w-full h-full">
              {/* Layer 0: Base card background */}
              <div className="absolute inset-0 bg-[#0f172a]" />

              {/* Layer 1: User avatar */}
              <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                {croppedImage ? (
                  <img
                    src={croppedImage}
                    alt="User Profile"
                    className="w-full h-full object-cover"
                    style={{
                      transform: `scale(${zoom}) translate(${panX}px, ${panY}px) rotate(${rotation}deg)`
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-30 select-none">
                    <svg className="h-28 w-28 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-[8px] font-mono font-bold tracking-widest text-slate-400 uppercase mt-2">NO AVATAR LOADED</span>
                  </div>
                )}
              </div>

              {/* Layer 2: Frame Overlay */}
              <div 
                className="absolute inset-0 z-20 transition-all duration-300 pointer-events-none"
                style={{
                  backgroundImage: "url('/palm-frame-bg.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 48%, black 49%)',
                  maskImage: 'radial-gradient(circle, transparent 48%, black 49%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'cover',
                  maskSize: 'cover',
                  // Apply theme styling filters/presets dynamically
                  ...(activeThemeId === 'sunset' ? { filter: 'saturate(1.2) contrast(1.1) drop-shadow(0 0 10px rgba(255, 0, 122, 0.4))' } : {}),
                  ...(activeThemeId === 'matrix' ? { filter: 'hue-rotate(60deg) brightness(0.6) saturate(1.8)' } : {}),
                  ...(activeThemeId === 'synthwave' ? { filter: 'hue-rotate(-40deg) saturate(1.3)' } : {}),
                  ...(activeThemeId === 'tropic' ? { filter: 'saturate(1.4) contrast(1.1)' } : {}),
                  ...(activeThemeId === 'midnight' ? { filter: 'brightness(0.5) contrast(1.2) saturate(0.8)' } : {}),
                  ...(activeThemeId === 'holo' ? { filter: 'grayscale(1) brightness(1.2) contrast(1.1)' } : {})
                }}
              />

              {/* Layer 3: Top Header branding */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-36 pointer-events-none drop-shadow-[0_0_12px_rgba(255,0,122,0.35)]">
                <img
                  src="/hacker-house-goa-logo.png"
                  alt="Hacker House Goa"
                  className="w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.src = '/hacker-house-logo.png';
                  }}
                />
              </div>

              {/* Layer 4: Footer event tag */}
              <div className="absolute bottom-4 inset-x-4 z-30 p-2.5 rounded-xl border border-[#FFE600]/30 bg-slate-950/90 backdrop-blur-md text-center shadow-lg pointer-events-none">
                <div className="text-[10px] font-black tracking-widest text-[#FFE600] font-display">HH GOA 2026 • BUILDER</div>
                <div className="text-[7px] font-mono tracking-widest text-slate-400 mt-0.5 flex justify-center gap-1.5 uppercase">
                  <span>15.4967° N, 73.8278° E</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[#FF007A] font-bold">#FrameInGoa</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================================
          HIDDEN OFF-SCREEN 1080x1080 CANVAS FOR PNG EXPORT
          ==================================================== */}
      <div className="badge-canvas-container">
        <div
          ref={highResRef}
          className="w-[1080px] h-[1080px] text-white relative overflow-hidden"
          style={{ backgroundColor: '#070d10' }}
        >
          {croppedImage && (
            <>
              {/* Layer 1: User avatar (high-res scale calculations) */}
              <div className="absolute inset-0 z-10 overflow-hidden flex items-center justify-center">
                <img
                  src={croppedImage}
                  alt="User Profile"
                  className="w-full h-full object-cover"
                  style={{
                    transform: `scale(${zoom}) translate(${panX * 3.375}px, ${panY * 3.375}px) rotate(${rotation}deg)`
                  }}
                />
              </div>

              {/* Layer 2: Frame Overlay */}
              <div 
                className="absolute inset-0 z-20 pointer-events-none"
                style={{
                  backgroundImage: "url('/palm-frame-bg.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  WebkitMaskImage: 'radial-gradient(circle, transparent 48%, black 49%)',
                  maskImage: 'radial-gradient(circle, transparent 48%, black 49%)',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'cover',
                  maskSize: 'cover',
                  // Apply theme styling filters/presets dynamically
                  ...(activeThemeId === 'sunset' ? { filter: 'saturate(1.2) contrast(1.1) drop-shadow(0 0 30px rgba(255, 0, 122, 0.4))' } : {}),
                  ...(activeThemeId === 'matrix' ? { filter: 'hue-rotate(60deg) brightness(0.6) saturate(1.8)' } : {}),
                  ...(activeThemeId === 'synthwave' ? { filter: 'hue-rotate(-40deg) saturate(1.3)' } : {}),
                  ...(activeThemeId === 'tropic' ? { filter: 'saturate(1.4) contrast(1.1)' } : {}),
                  ...(activeThemeId === 'midnight' ? { filter: 'brightness(0.5) contrast(1.2) saturate(0.8)' } : {}),
                  ...(activeThemeId === 'holo' ? { filter: 'grayscale(1) brightness(1.2) contrast(1.1)' } : {})
                }}
              />

              {/* Layer 3: Top Header branding */}
              <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 w-96 pointer-events-none drop-shadow-[0_0_40px_rgba(255,0,122,0.45)]">
                <img
                  src="/hacker-house-goa-logo.png"
                  alt="Hacker House Goa"
                  className="w-full object-contain"
                />
              </div>

              {/* Layer 4: Footer event tag */}
              <div className="absolute bottom-12 inset-x-12 z-30 p-8 rounded-3xl border-2 border-[#FFE600]/30 bg-slate-950/95 text-center shadow-2xl">
                <div className="text-3xl font-black tracking-widest text-[#FFE600] font-display">HH GOA 2026 • BUILDER</div>
                <div className="text-lg font-mono tracking-widest text-slate-400 mt-2 flex justify-center gap-4 uppercase">
                  <span>15.4967° N, 73.8278° E</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[#FF007A] font-bold">#FrameInGoa</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
