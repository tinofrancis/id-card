'use client';

import React, { useState, useRef, useEffect } from 'react';
import UploadBox from './UploadBox';
import CropModal from './CropModal';
import ThemeSelector from './ThemeSelector';
import BuilderTitle from './BuilderTitle';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import PalmLeafSVG from './PalmLeafSVG';
import { THEMES, ROLES, BUILDER_TITLES, Theme } from '@/utils/constants';
import { Edit2, RefreshCw, Star, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

const QRCodeSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    {/* Outer Corners */}
    <rect x="0" y="0" width="25" height="25" rx="3" />
    <rect x="4" y="4" width="17" height="17" fill="#000000" />
    <rect x="8" y="8" width="9" height="9" fill="currentColor" />

    <rect x="75" y="0" width="25" height="25" rx="3" />
    <rect x="79" y="4" width="17" height="17" fill="#000000" />
    <rect x="83" y="8" width="9" height="9" fill="currentColor" />

    <rect x="0" y="75" width="25" height="25" rx="3" />
    <rect x="4" y="79" width="17" height="17" fill="#000000" />
    <rect x="8" y="83" width="9" height="9" fill="currentColor" />

    {/* Center Pixels */}
    <rect x="35" y="5" width="10" height="5" />
    <rect x="55" y="0" width="10" height="15" />
    <rect x="35" y="25" width="5" height="15" />
    <rect x="50" y="35" width="15" height="5" />
    <rect x="75" y="35" width="10" height="10" />
    <rect x="35" y="55" width="20" height="5" />
    <rect x="65" y="50" width="15" height="15" />
    <rect x="90" y="60" width="10" height="5" />
    <rect x="85" y="85" width="15" height="15" />
    <rect x="75" y="70" width="5" height="15" />
    <rect x="40" y="75" width="10" height="10" />
    <rect x="55" y="65" width="5" height="15" />
    <rect x="60" y="85" width="10" height="5" />
    <rect x="30" y="90" width="10" height="10" />
  </svg>
);

const BarcodeSVG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 200 40" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="6" height="40" />
    <rect x="10" y="0" width="2" height="40" />
    <rect x="18" y="0" width="8" height="40" />
    <rect x="32" y="0" width="4" height="40" />
    <rect x="40" y="0" width="10" height="40" />
    <rect x="56" y="0" width="2" height="40" />
    <rect x="64" y="0" width="6" height="40" />
    <rect x="74" y="0" width="8" height="40" />
    <rect x="88" y="0" width="4" height="40" />
    <rect x="98" y="0" width="12" height="40" />
    <rect x="116" y="0" width="2" height="40" />
    <rect x="124" y="0" width="6" height="40" />
    <rect x="134" y="0" width="4" height="40" />
    <rect x="144" y="0" width="10" height="40" />
    <rect x="160" y="0" width="8" height="40" />
    <rect x="174" y="0" width="2" height="40" />
    <rect x="182" y="0" width="12" height="40" />
    <rect x="198" y="0" width="2" height="40" />
  </svg>
);

interface BuilderCardGeneratorProps {
  activeThemeId: Theme['id'];
  setActiveThemeId: (themeId: Theme['id']) => void;
}

export default function BuilderCardGenerator({ activeThemeId, setActiveThemeId }: BuilderCardGeneratorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [name, setName] = useState('HACKER');
  const [role, setRole] = useState('AI Engineer');
  const [builderTitle, setBuilderTitle] = useState('Late Night Hacker');
  const [showCropModal, setShowCropModal] = useState(false);
  const [cardId, setCardId] = useState('');
  const [domain, setDomain] = useState('');

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
    
    // Subtle premium 3D feel
    const rotateX = -(y - rect.height / 2) / (rect.height / 16);
    const rotateY = (x - rect.width / 2) / (rect.width / 16);
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`,
    });

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setGlareStyle({
      background: `radial-gradient(circle 120px at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.12), transparent)`,
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

  // Celebration Confetti on Successful Image Generation
  useEffect(() => {
    if (croppedImage) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.75 },
        colors: ['#ff5e62', '#ff9966', '#00c6ff', '#8b5cf6', '#38ef7d'],
      });
    }
  }, [croppedImage]);

  // Initialize random builder title and unique card serial ID
  useEffect(() => {
    handleRegenerateTitle();
    setCardId(Math.random().toString(36).substring(2, 10).toUpperCase());
    if (typeof window !== 'undefined') {
      setDomain(window.location.origin);
    }
  }, []);

  const handleRegenerateTitle = () => {
    let currentIdx = BUILDER_TITLES.indexOf(builderTitle);
    let randomIdx = Math.floor(Math.random() * BUILDER_TITLES.length);
    while (randomIdx === currentIdx) {
      randomIdx = Math.floor(Math.random() * BUILDER_TITLES.length);
    }
    setBuilderTitle(BUILDER_TITLES[randomIdx]);
  };

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
    setShowCropModal(true);
  };

  const saveProfileCard = async (imageToSave?: string | null) => {
    const img = imageToSave !== undefined ? imageToSave : croppedImage;
    if (!img) return;
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: cardId,
          name,
          role,
          title: builderTitle,
          theme: activeThemeId,
          image: img,
        }),
      });
    } catch (err) {
      console.error('Failed to auto-save builder card details:', err);
    }
  };

  const handleCropComplete = (croppedSrc: string) => {
    setCroppedImage(croppedSrc);
    setShowCropModal(false);
    saveProfileCard(croppedSrc);
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
  };

  const verifyUrl = `${domain}/verify?id=${cardId}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(builderTitle)}&theme=${activeThemeId}`;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=ffffff&bgcolor=020617&data=${encodeURIComponent(verifyUrl)}`;

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl mx-auto px-4">
      {/* Left panel: Controls */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">
        <div className="glass-panel rounded-2xl p-6 transition-colors duration-300">
          <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white mb-5 flex items-center gap-2">
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.glow}`} />
            Builder Card Customizer
          </h2>

          <div className="flex flex-col gap-5">
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
                      className="h-12 w-12 rounded-lg object-cover border border-slate-200 dark:border-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Photo loaded</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Successfully cropped & optimized</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCropModal(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                      title="Recrop photo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-black/5 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-black/10 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-all duration-200 shadow-sm"
                      title="Upload new photo"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value.slice(0, 24))}
                placeholder="Enter your name"
                className="glass-input w-full rounded-xl px-4 py-3 text-sm placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/20"
              />
            </div>

            {/* Role Picker */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Stack / Role
              </label>
              <div className="relative">
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input w-full appearance-none rounded-xl px-4 py-3 text-sm focus:outline-none cursor-pointer focus:ring-1 focus:ring-slate-400 dark:focus:ring-white/20"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r} className="bg-white text-slate-900 dark:bg-slate-950 dark:text-white">
                      {r}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 dark:text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Builder Title Generator */}
            <BuilderTitle
              title={builderTitle}
              onRegenerate={handleRegenerateTitle}
              accentClass={activeTheme.accentText}
            />

            {/* Theme Selector */}
            <ThemeSelector activeThemeId={activeThemeId} onChange={setActiveThemeId} />

            {/* Actions */}
            {croppedImage && (
              <div className="flex flex-col gap-4 mt-2">
                <DownloadButton
                  elementRef={highResRef}
                  fileName={`hh-goa-builder-card-${activeThemeId}.png`}
                  onDownloadCompleted={async () => {
                    await saveProfileCard();
                  }}
                />
                <ShareButton mode="card" />
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

          {/* Visible badge card (scaled equivalent to 1080x1350) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020617] shadow-2xl flex flex-col justify-between p-6 sm:p-8 transition-transform duration-200 ease-out will-change-transform cursor-crosshair"
          >
            {/* 3D Reflection Glare Overlay */}
            <div
              style={glareStyle}
              className="absolute inset-0 z-20 pointer-events-none opacity-60 transition-opacity duration-300"
            />
            
            {/* Grid background */}
            <div className="absolute inset-0 opacity-20 digital-grid pointer-events-none" />

            {/* Background glowing blob */}
            <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-20 blur-[60px]`} />
            <div className={`absolute bottom-0 right-0 w-36 h-36 rounded-full bg-[#1e293b] opacity-10 blur-[40px]`} />

            {/* Tropical accents */}
            <div className="absolute -left-12 -bottom-4 w-32 h-32 text-white/5 rotate-90 pointer-events-none">
              <PalmLeafSVG className="w-full h-full" />
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 text-white/5 -rotate-45 pointer-events-none">
              <PalmLeafSVG className="w-full h-full animate-float-medium" />
            </div>

            {/* Header info */}
            <div className="relative z-10 flex justify-between items-center border-b border-white/5 pb-2.5">
              {/* Left Logo */}
              <div className="flex items-center">
                <img
                  src="/studio-logo.png"
                  alt="2:47PM Studio"
                  className="h-5 w-8 object-contain"
                />
              </div>

              {/* Center Logo */}
              <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <img
                  src="/hacker-house-logo.png"
                  alt="Hacker House"
                  className="h-5 w-20 object-contain"
                />
              </div>
              <div className="flex items-center">
                <span className={`px-2 py-0.5 rounded border border-white/10 bg-white/5 text-[8px] font-mono tracking-widest text-slate-300 flex items-center gap-1`}>
                  <Star className={`h-2.5 w-2.5 fill-current ${activeTheme.accentText} animate-pulse`} />
                  PASS
                </span>
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 flex flex-col items-center gap-4 my-auto">
              
              {/* Photo Area with holographic frame */}
              <div className={`relative p-[3px] rounded-xl bg-gradient-to-tr ${activeTheme.gradient} ${activeTheme.glow}`}>
                <div className="relative h-[150px] w-[150px] overflow-hidden rounded-lg bg-slate-900 border border-slate-950 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    {croppedImage ? (
                      <motion.img
                        key="cropped"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        src={croppedImage}
                        alt="Cropped profile avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="flex flex-col items-center justify-center p-3 text-center"
                      >
                        <svg className="h-6 w-6 text-slate-500 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-wide">
                          Upload Image
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Text Fields */}
              <div className="text-center w-full max-w-[280px]">
                {/* Name */}
                <h3 className="font-display font-black text-lg uppercase tracking-wider text-white truncate">
                  {name || 'HACKER'}
                </h3>
                
                {/* Role Capsule */}
                <div className="mt-1 flex justify-center">
                  <span className={`inline-block text-[9px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border ${activeTheme.borderClass} bg-slate-950/60 text-slate-300 shadow-sm`}>
                    {role}
                  </span>
                </div>

                {/* Animated Builder Title banner */}
                <div className="mt-4 py-1.5 border-y border-white/5 flex flex-col items-center justify-center min-h-[40px]">
                  <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest mb-0.5">Title Claimed</span>
                  <span className={`font-display text-[10px] font-black uppercase tracking-widest ${activeTheme.accentText} animate-pulse`}>
                    {builderTitle}
                  </span>
                </div>
              </div>

            </div>

            {/* Bottom Bar: QR, Barcode, Details */}
            <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-3.5">
              {/* QR representation */}
              <div className="flex items-center gap-2">
                {cardId ? (
                  <img
                    src={qrImageUrl}
                    alt="QR Verification Link"
                    crossOrigin="anonymous"
                    className="h-8 w-8 object-contain rounded border border-white/10"
                  />
                ) : (
                  <QRCodeSVG className="h-8 w-8 text-white" />
                )}
                <div className="flex flex-col text-left">
                  <span className="text-[6px] font-mono text-slate-500 uppercase flex items-center gap-0.5">
                    <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_4px_#10b981]" />
                    SYS ID
                  </span>
                  <span className="text-[8px] font-mono text-slate-300 leading-none mt-0.5">#GOA-${cardId || '2026-BND'}</span>
                </div>
              </div>

              {/* Barcode representation */}
              <div className="hidden sm:flex flex-col items-center">
                <BarcodeSVG className="h-4 w-24 text-slate-600" />
                <span className="text-[6px] font-mono text-slate-500 mt-0.5">VERIFIED REGISTRATION</span>
              </div>

              {/* Hashtag */}
              <div className="flex flex-col items-end">
                <span className="text-[6px] font-bold text-slate-500 uppercase tracking-widest font-mono">EVENT POST</span>
                <span className={`text-[11px] font-black uppercase bg-gradient-to-r ${activeTheme.gradient} bg-clip-text text-transparent`}>
                  #FrameInGoa
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ====================================================
          HIDDEN OFF-SCREEN 1080x1350 CANVAS FOR PNG EXPORT
          ==================================================== */}
      <div className="badge-canvas-container">
        <div
          ref={highResRef}
          className="w-[1080px] h-[1350px] bg-[#020617] text-white flex flex-col justify-between p-20 font-sans relative overflow-hidden"
        >
          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* Glow blobs */}
          <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-25 blur-[120px]`} />
          <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-slate-900 opacity-20 blur-[80px]`} />

          {/* Tropical leaves */}
          <div className="absolute -left-28 -bottom-10 w-96 h-96 text-white/5 rotate-90 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 text-white/5 -rotate-45 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center border-b-2 border-white/5 pb-8">
            {/* Left Logo */}
            <div className="flex items-center">
              <img
                src="/studio-logo.png"
                alt="2:47PM Studio"
                className="h-14 w-24 object-contain"
              />
            </div>

            {/* Center Logo */}
            <div className="absolute left-1/2 top-[40%] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <img
                src="/hacker-house-logo.png"
                alt="Hacker House"
                className="h-14 w-52 object-contain"
              />
            </div>
            <div className="flex items-center">
              <span className={`px-5 py-1.5 rounded-md border-2 border-white/10 bg-white/5 text-base font-mono tracking-widest text-slate-300 flex items-center gap-2`}>
                <Star className={`h-4.5 w-4.5 fill-current ${activeTheme.accentText} animate-pulse`} />
                PASS
              </span>
            </div>
          </div>

          {/* Central Body Content */}
          <div className="relative z-10 flex flex-col items-center gap-12 my-auto">
            {/* Developer photo frame */}
            <div className={`relative p-[10px] rounded-3xl bg-gradient-to-tr ${activeTheme.gradient} ${activeTheme.glow}`}>
              <div className="relative h-[480px] w-[480px] overflow-hidden rounded-2xl bg-slate-900 border-[3px] border-slate-950">
                {croppedImage ? (
                  <img
                    src={croppedImage}
                    alt="Cropped face high-res"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
              </div>
            </div>

            {/* Profile fields */}
            <div className="text-center w-full max-w-[700px]">
              {/* Name */}
              <h3 className="font-display font-black text-6xl uppercase tracking-[0.05em] text-white truncate px-4">
                {name || 'HACKER'}
              </h3>
              
              {/* Role Badge */}
              <div className="mt-4 flex justify-center">
                <span className={`inline-block text-lg font-bold uppercase tracking-[0.2em] px-10 py-2.5 rounded-full border-2 ${activeTheme.borderClass} bg-slate-950/80 text-slate-300 shadow-md`}>
                  {role}
                </span>
              </div>

              {/* Title claimed */}
              <div className="mt-14 py-6 border-y-2 border-white/5 flex flex-col items-center justify-center">
                <span className="text-[11px] text-slate-500 font-bold uppercase tracking-[0.3em] mb-2 font-mono">Title Claimed</span>
                <span className={`font-display text-2xl font-black uppercase tracking-[0.25em] ${activeTheme.accentText}`}>
                  {builderTitle}
                </span>
              </div>
            </div>
          </div>

          {/* Footer of card */}
          <div className="relative z-10 flex justify-between items-end border-t-2 border-white/5 pt-10">
            {/* QR block */}
            <div className="flex items-center gap-6">
              {cardId ? (
                <img
                  src={qrImageUrl}
                  alt="QR Verification Link"
                  crossOrigin="anonymous"
                  className="h-24 w-24 object-contain rounded-md border-2 border-white/10"
                />
              ) : (
                <QRCodeSVG className={`h-24 w-24 text-white`} />
              )}
              <div className="flex flex-col text-left gap-1">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                  SYS ID
                </span>
                <span className="text-sm font-mono text-white leading-none tracking-widest">#GOA-${cardId || '2026-BUILD'}</span>
                <span className="text-[10px] font-mono text-slate-400 mt-1 uppercase tracking-widest">VERIFIED SYSTEM REG</span>
              </div>
            </div>

            {/* Barcode */}
            <div className="flex flex-col items-center gap-1">
              <BarcodeSVG className="h-10 w-72 text-slate-500" />
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-[0.15em]">Official Dev Pass • Feb 2026</span>
            </div>

            {/* Hashtag */}
            <div className="flex flex-col items-end gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] font-mono">GOA EXPERIENCE</span>
              <span className={`text-[32px] font-black uppercase tracking-[0.05em] bg-gradient-to-r ${activeTheme.gradient} bg-clip-text text-transparent`}>
                #FrameInGoa
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Crop Modal */}
      {showCropModal && imageSrc && (
        <CropModal
          imageSrc={imageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setShowCropModal(false)}
        />
      )}
    </div>
  );
}
