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
import { audio } from '@/utils/audio';

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
  const [zoom, setZoom] = useState(1.2);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [name, setName] = useState('HACKER');
  const [role, setRole] = useState('AI Engineer');
  const [builderTitle, setBuilderTitle] = useState('Late Night Hacker');
  const [showCropModal, setShowCropModal] = useState(false);
  const [cardId, setCardId] = useState('');
  const [domain, setDomain] = useState('');
  const [cardTexture, setCardTexture] = useState<'glass' | 'brushed' | 'carbon' | 'grid' | 'holo'>('glass');
  const [holoStyle, setHoloStyle] = useState<React.CSSProperties>({});

  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    background: 'transparent',
  });

  const highResRef = useRef<HTMLDivElement | null>(null);
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const getTextureStyle = (texture: 'glass' | 'brushed' | 'carbon' | 'grid' | 'holo', isHighRes: boolean = false) => {
    const scaleFactor = isHighRes ? 3 : 1;
    switch (texture) {
      case 'brushed':
        return {
          backgroundImage: `
            radial-gradient(ellipse at 50% 0%, rgba(255, 255, 255, 0.08) 0%, transparent 70%),
            linear-gradient(rgba(255, 255, 255, 0.015) 50%, rgba(0, 0, 0, 0.15) 50%),
            linear-gradient(to bottom, #242b35, #0f131a)
          `,
          backgroundSize: `100% 100%, ${4 * scaleFactor}px ${4 * scaleFactor}px, 100% 100%`,
        };
      case 'carbon':
        return {
          backgroundImage: `
            linear-gradient(45deg, rgba(0, 0, 0, 0.6) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(0, 0, 0, 0.6) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(0, 0, 0, 0.6) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(0, 0, 0, 0.6) 75%)
          `,
          backgroundColor: '#11161d',
          backgroundSize: `${12 * scaleFactor}px ${12 * scaleFactor}px`,
        };
      case 'grid':
        return {
          backgroundImage: `
            linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 240, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundColor: '#070d19',
          backgroundSize: `${20 * scaleFactor}px ${20 * scaleFactor}px`,
        };
      case 'holo':
        return {
          backgroundColor: '#0d131f',
        };
      case 'glass':
      default:
        return {
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        };
    }
  };

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

    setHoloStyle({
      background: `linear-gradient(${percentX * 2.2 + percentY * 2.2}deg, rgba(255, 0, 122, 0.18) 0%, rgba(0, 240, 255, 0.18) 33%, rgba(0, 245, 160, 0.18) 66%, rgba(255, 217, 125, 0.18) 100%)`,
      mixBlendMode: 'color-dodge',
    });
  };

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
    });
    setGlareStyle({
      background: 'transparent',
    });
    setHoloStyle({});
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
    setZoom(1.2);
    setPanX(0);
    setPanY(0);
    setRotation(0);
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

            {/* Texture Selector */}
            <div className="w-full mt-4">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Card Texture Material
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: 'glass', name: 'Glass' },
                  { id: 'brushed', name: 'Brushed' },
                  { id: 'carbon', name: 'Carbon' },
                  { id: 'grid', name: 'Grid' },
                  { id: 'holo', name: 'Holo' }
                ].map((tex) => {
                  const isActive = cardTexture === tex.id;
                  return (
                    <button
                      key={tex.id}
                      onClick={() => {
                        audio.playClick();
                        setCardTexture(tex.id as any);
                      }}
                      className={`py-2 px-0.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-lg border transition-all duration-200 cursor-pointer text-center ${
                        isActive
                          ? 'border-[#00F5A0] bg-emerald-500/10 text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.1)]'
                          : 'border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-950/60'
                      }`}
                    >
                      {tex.name}
                    </button>
                  );
                })}
              </div>
            </div>

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
                    step="2"
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
                    step="2"
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
                  fileName={`hh-goa-builder-card-${activeThemeId}.png`}
                  label="Download Builder Pass"
                  variant="green"
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
          {/* Visible badge card (Ticket Style aspect-[10/16]) */}
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={tiltStyle}
            className="relative aspect-[10/16] w-full overflow-hidden rounded-2xl border border-white/10 shadow-2xl shadow-emerald-500/5 flex flex-col justify-between p-6 sm:p-7 pt-9 transition-transform duration-200 ease-out will-change-transform cursor-crosshair z-0"
          >
            {/* Layer 0: Goa Beach Scene Backdrop */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FF7E5F] to-[#FEB47B] z-0" />
            {/* Tropical Sun */}
            <div className="absolute top-[10%] left-[55%] w-32 h-32 rounded-full bg-gradient-to-t from-[#FFE600] to-[#FF007A] opacity-80 blur-[2px] shadow-[0_0_50px_rgba(255,230,0,0.4)] z-0" />
            {/* Arabian Sea Ocean */}
            <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#0083B0] to-[#00B4DB] z-0 border-t border-cyan-300/30" />
            {/* Ocean Waves Wavelet overlay */}
            <div className="absolute bottom-0 inset-x-0 h-[42%] opacity-15 bg-[radial-gradient(ellipse_at_50%_0%,_#ffffff_0%,_transparent_70%)] z-0" />

            {/* Glass backdrop overlay */}
            <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[1px] z-0" />

            {/* Texture blend overlay */}
            {cardTexture !== 'glass' && (
              <div
                style={getTextureStyle(cardTexture)}
                className="absolute inset-0 z-10 pointer-events-none opacity-30 mix-blend-overlay"
              />
            )}

            {/* VIP Header Ribbon */}
            <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-[#FF007A] via-[#FFE600] to-[#FF007A] text-[6px] sm:text-[7px] font-mono font-black tracking-widest text-slate-950 text-center py-1 uppercase z-30 shadow-md">
              HH GOA 2026 • VIP BUILDER PASS
            </div>

            {/* Holographic foil overlay sheen */}
            {cardTexture === 'holo' && (
              <div
                style={holoStyle}
                className="absolute inset-0 z-10 pointer-events-none transition-opacity duration-300"
              />
            )}

            {/* 3D Reflection Glare Overlay */}
            <div
              style={glareStyle}
              className="absolute inset-0 z-20 pointer-events-none opacity-40 transition-opacity duration-300"
            />
            
            {/* Grid background */}
            <div className="absolute inset-0 opacity-15 digital-grid pointer-events-none z-0" />

            {/* Tropical accents */}
            <div className="absolute -left-12 -bottom-4 w-32 h-32 text-[#00F5A0]/10 rotate-90 pointer-events-none z-0">
              <PalmLeafSVG className="w-full h-full" />
            </div>
            <div className="absolute -right-8 -top-8 w-24 h-24 text-[#FFE600]/10 -rotate-45 pointer-events-none z-0">
              <PalmLeafSVG className="w-full h-full animate-float-medium" />
            </div>

            {/* Header info */}
            <div className="relative z-10 flex justify-between items-center pb-2 border-b border-white/5">
              <div className="text-[6px] font-mono font-black tracking-widest text-slate-300">
                OFFICIAL BUILDER PASS • FEB 2026
              </div>
              <div className="h-7 w-24 pointer-events-none drop-shadow-[0_0_8px_rgba(255,230,0,0.45)]">
                <img
                  src="/hacker-house-goa-logo.png"
                  alt="Hacker House"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            {/* Body */}
            <div className="relative z-10 flex flex-col items-center gap-3 my-auto">
              
              {/* Photo Area with circular pop-art neon border */}
              <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-[#FFE600] via-[#FF007A] to-[#FFE600] shadow-[0_0_25px_rgba(255,0,122,0.45)]">
                <div className="relative h-[120px] w-[120px] overflow-hidden rounded-full bg-slate-900 border border-slate-950 flex items-center justify-center">
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
                        style={{
                          transform: `scale(${zoom}) translate(${panX}px, ${panY}px) rotate(${rotation}deg)`
                        }}
                      />
                    ) : (
                      <motion.div
                        key="placeholder"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="flex flex-col items-center justify-center p-3 text-center opacity-40"
                      >
                        <svg className="h-7 w-7 text-slate-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <p className="text-[7px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                          NO PHOTO
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Text Fields */}
              <div className="text-center w-full max-w-[280px]">
                {/* Name */}
                <h3 className="font-display font-black text-lg sm:text-xl uppercase tracking-wider text-white drop-shadow-[0_2px_12px_rgba(255,0,122,0.85)] filter drop-shadow(0 2px 4px rgba(0,0,0,0.8)) truncate">
                  {name || 'HACKER'}
                </h3>

                {/* Role/Title Pill */}
                <div className="inline-block mt-1.5 px-3 py-0.5 rounded-full bg-[#00FF66] text-slate-950 text-[7px] sm:text-[8px] font-mono font-black tracking-wider uppercase shadow-[0_0_10px_rgba(0,255,102,0.4)]">
                  {role.toUpperCase()} BUILDER
                </div>
                
                {/* High-Tech Metadata Grid */}
                <div className="mt-3 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-emerald-400/30 text-left text-[8px] font-mono leading-relaxed space-y-1">
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="text-slate-500 uppercase font-black">STATUS</span>
                    <span className="text-[#00FF66] font-black flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#00FF66] animate-pulse" />
                      VERIFIED BUILDER
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="text-slate-500 uppercase font-black">PORT ENTRY</span>
                    <span className="text-white font-bold">FEB 2026</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="text-slate-500 uppercase font-black">GPS LOC</span>
                    <span className="text-white font-bold">15.4967° N, 73.8278° E</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-2">
                    <span className="text-slate-500 uppercase font-black">TRACK</span>
                    <span className="text-[#FFE600] font-black truncate">AI & DATA SCIENCE</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Ticket Notches */}
            <div className="absolute left-0 top-[78%] -translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border border-white/10 z-30" />
            <div className="absolute right-0 top-[78%] translate-x-1/2 w-4 h-4 rounded-full bg-slate-950 border border-white/10 z-30" />
            {/* Ticket Dash line */}
            <div className="absolute inset-x-0 top-[78%] border-t-2 border-dashed border-[#FF007A]/50 z-20 pointer-events-none shadow-[0_0_8px_rgba(255,0,122,0.35)]" />

            {/* Bottom Bar: QR, Barcode, Details */}
            <div className="relative z-10 flex justify-between items-center mt-auto w-full pt-4">
              {/* Holographic Security Seal (Bottom Left) */}
              <div className="flex items-center">
                <div 
                  style={{
                    background: 'linear-gradient(135deg, #FF007A 0%, #00F0FF 50%, #00F5A0 100%)',
                    boxShadow: '0 0 10px rgba(0, 240, 255, 0.4)'
                  }}
                  className="relative h-9 w-9 rounded-full flex items-center justify-center p-[1px] border border-white/20 select-none"
                >
                  <div className="h-full w-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center text-center p-0.5">
                    <span className="text-[3.5px] font-black tracking-wider text-[#00F5A0] font-mono leading-none">HH GOA</span>
                    <span className="text-[4px] font-black tracking-widest text-white font-mono leading-none mt-0.5">2026</span>
                    <span className="text-[3px] font-mono font-bold text-slate-400 mt-0.5 uppercase tracking-wider leading-none">VIP SEAL</span>
                  </div>
                </div>
              </div>

              {/* Badge Code & Coordinate Micro-typography (Right) */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col text-right">
                  <span className="text-[5px] font-mono font-bold tracking-widest text-[#00F5A0] flex items-center gap-0.5 justify-end">
                    <span className="h-1 w-1 rounded-full bg-[#00F5A0] animate-ping" />
                    TICKET VIP
                  </span>
                  <span className="text-[7px] font-mono text-slate-300 font-bold leading-none mt-0.5">#GOA-{cardId || '2026-BND'}</span>
                </div>
                {/* QR representation with glowing pink border */}
                <div className="relative p-[1px] rounded bg-gradient-to-tr from-[#FF007A] to-[#FFE600] shadow-[0_0_8px_rgba(255,0,122,0.25)]">
                  {cardId ? (
                    <img
                      src={qrImageUrl}
                      alt="QR Verification Link"
                      crossOrigin="anonymous"
                      className="h-8 w-8 object-contain rounded bg-slate-950"
                    />
                  ) : (
                    <QRCodeSVG className="h-8 w-8 text-white animate-pulse" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ===========================================================
          HIDDEN OFF-SCREEN 1080x1350 CANVAS FOR PNG EXPORT
          ==================================================== */}
      <div className="badge-canvas-container">
        <div
          ref={highResRef}
          style={{}}
          className="w-[1080px] h-[1728px] border-[16px] border-solid border-slate-900 text-white flex flex-col justify-between p-20 pt-28 font-sans relative overflow-hidden"
        >
          {/* Layer 0: Goa Beach Scene Backdrop */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#FF7E5F] to-[#FEB47B] z-0" />
          {/* Tropical Sun */}
          <div className="absolute top-[10%] left-[55%] w-[350px] h-[350px] rounded-full bg-gradient-to-t from-[#FFE600] to-[#FF007A] opacity-80 blur-[6px] shadow-[0_0_150px_rgba(255,230,0,0.4)] z-0" />
          {/* Arabian Sea Ocean */}
          <div className="absolute bottom-0 inset-x-0 h-[42%] bg-gradient-to-t from-[#0083B0] to-[#00B4DB] z-0 border-t-2 border-cyan-300/30" />
          {/* Ocean Waves Wavelet overlay */}
          <div className="absolute bottom-0 inset-x-0 h-[42%] opacity-15 bg-[radial-gradient(ellipse_at_50%_0%,_#ffffff_0%,_transparent_70%)] z-0" />

          {/* Glass backdrop overlay */}
          <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-md z-0" />

          {/* Texture blend overlay */}
          {cardTexture !== 'glass' && (
            <div
              style={getTextureStyle(cardTexture, true)}
              className="absolute inset-0 z-10 pointer-events-none opacity-30 mix-blend-overlay"
            />
          )}

          {/* VIP Header Ribbon */}
          <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-[#FF007A] via-[#FFE600] to-[#FF007A] text-[20px] font-mono font-black tracking-widest text-slate-950 text-center py-2 uppercase z-30 shadow-md">
            HH GOA 2026 • VIP BUILDER PASS
          </div>

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
          <div className="absolute -left-28 -bottom-10 w-96 h-96 text-[#00F5A0]/10 rotate-90 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>
          <div className="absolute -right-20 -top-20 w-80 h-80 text-[#FFE600]/10 -rotate-45 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>

          {/* Header */}
          <div className="relative z-10 flex justify-between items-center pb-4 border-b-2 border-white/5">
            <div className="text-sm font-mono font-black tracking-widest text-slate-300">
              OFFICIAL BUILDER PASS • FEB 2026
            </div>
            <div className="h-20 w-64 pointer-events-none drop-shadow-[0_0_24px_rgba(255,230,0,0.45)]">
              <img
                src="/hacker-house-goa-logo.png"
                alt="Hacker House"
                className="h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Central Body Content */}
          <div className="relative z-10 flex flex-col items-center gap-10 my-auto">
            {/* Developer photo frame */}
            <div className="relative p-[9px] rounded-full bg-gradient-to-tr from-[#FFE600] via-[#FF007A] to-[#FFE600] shadow-[0_0_60px_rgba(255,0,122,0.45)]">
              <div className="relative h-[380px] w-[380px] overflow-hidden rounded-full bg-slate-900 border-[3px] border-slate-950 flex items-center justify-center">
                {croppedImage ? (
                  <img
                    src={croppedImage}
                    alt="Cropped face high-res"
                    className="h-full w-full object-cover"
                    style={{
                      transform: `scale(${zoom}) translate(${panX * 3.375}px, ${panY * 3.375}px) rotate(${rotation}deg)`
                    }}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center opacity-40 select-none">
                    <svg className="h-24 w-24 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-wider mt-2">NO PHOTO</span>
                  </div>
                )}
              </div>
            </div>

            {/* Profile fields */}
            <div className="text-center w-full max-w-[700px] flex flex-col items-center">
              {/* Name */}
              <h3 className="font-display font-black text-6xl uppercase tracking-[0.05em] text-white drop-shadow-[0_4px_24px_rgba(255,0,122,0.85)] filter drop-shadow(0 4px 8px rgba(0,0,0,0.8)) truncate px-4">
                {name || 'HACKER'}
              </h3>
              
              {/* Role tag */}
              <div className="inline-block mt-4 px-6 py-1.5 rounded-full bg-[#00FF66] text-slate-950 text-base font-mono font-black tracking-wider uppercase shadow-[0_0_20px_rgba(0,255,102,0.4)]">
                {role.toUpperCase()} BUILDER
              </div>
              
              {/* High-Tech Metadata Grid */}
              <div className="mt-8 w-[520px] p-8 rounded-2xl bg-slate-900/80 backdrop-blur-md border-2 border-emerald-400/30 text-left text-sm font-mono leading-relaxed space-y-2.5">
                <div className="grid grid-cols-2 gap-x-4">
                  <span className="text-slate-500 uppercase font-black">STATUS</span>
                  <span className="text-[#00FF66] font-black flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#00FF66] animate-pulse" />
                    VERIFIED BUILDER
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span className="text-slate-500 uppercase font-black">PORT ENTRY</span>
                  <span className="text-white font-bold">FEB 2026</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span className="text-slate-500 uppercase font-black">GPS LOC</span>
                  <span className="text-white font-bold">15.4967° N, 73.8278° E</span>
                </div>
                <div className="grid grid-cols-2 gap-x-4">
                  <span className="text-slate-500 uppercase font-black">TRACK</span>
                  <span className="text-[#FFE600] font-black truncate">AI & DATA SCIENCE</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ticket Notches */}
          <div className="absolute left-0 top-[78%] -translate-x-1/2 w-12 h-12 rounded-full bg-slate-950 border border-white/10 z-30" />
          <div className="absolute right-0 top-[78%] translate-x-1/2 w-12 h-12 rounded-full bg-slate-950 border border-white/10 z-30" />
          {/* Ticket Dash line */}
          <div className="absolute inset-x-0 top-[78%] border-t-4 border-dashed border-[#FF007A]/50 z-20 pointer-events-none shadow-[0_0_24px_rgba(255,0,122,0.35)]" />

          {/* Footer of card */}
          <div className="relative z-10 flex justify-between items-center mt-auto w-full pt-8">
            {/* Holographic Security Seal (Bottom Left) */}
            <div className="flex items-center">
              <div 
                style={{
                  background: 'linear-gradient(135deg, #FF007A 0%, #00F0FF 50%, #00F5A0 100%)',
                  boxShadow: '0 0 30px rgba(0, 240, 255, 0.4)'
                }}
                className="relative h-28 w-28 rounded-full flex items-center justify-center p-[3px] border border-white/20 select-none animate-pulse"
              >
                <div className="h-full w-full rounded-full bg-slate-950/90 flex flex-col items-center justify-center text-center p-1.5">
                  <span className="text-[11px] font-black tracking-widest text-[#00F5A0] font-mono leading-none">HH GOA</span>
                  <span className="text-[12px] font-black tracking-widest text-white font-mono leading-none mt-1.5">2026</span>
                  <span className="text-[8px] font-mono font-bold text-slate-400 mt-1.5 uppercase tracking-widest leading-none">VIP SEAL</span>
                </div>
              </div>
            </div>

            {/* Badge Code & Coordinate Micro-typography (Right) */}
            <div className="flex items-center gap-5">
              <div className="flex flex-col text-right gap-1">
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#00F5A0] flex items-center gap-1.5 justify-end">
                  <span className="h-2 w-2 rounded-full bg-[#00F5A0]" />
                  TICKET VIP
                </span>
                <span className="text-lg font-mono text-white leading-none tracking-widest font-bold">#GOA-{cardId || '2026-BUILD'}</span>
              </div>
              {/* QR block with gradient border */}
              <div className="relative p-[3px] rounded-xl bg-gradient-to-tr from-[#FF007A] to-[#FFE600] shadow-[0_0_24px_rgba(255,0,122,0.25)]">
                {cardId ? (
                  <img
                    src={qrImageUrl}
                    alt="QR Verification Link"
                    crossOrigin="anonymous"
                    className="h-24 w-24 object-contain rounded-md bg-slate-950"
                  />
                ) : (
                  <QRCodeSVG className={`h-24 w-24 text-white`} />
                )}
              </div>
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
