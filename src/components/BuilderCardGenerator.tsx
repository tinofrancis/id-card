'use client';

import React, { useState, useRef, useEffect } from 'react';
import QRCode from 'qrcode';
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
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [name, setName] = useState('TINO FRANCIS');
  const [role, setRole] = useState('Full Stack Developer');
  const [builderTitle, setBuilderTitle] = useState('THE SHIPPER');
  const [showCropModal, setShowCropModal] = useState(false);
  const [cardId, setCardId] = useState('');
  const [domain, setDomain] = useState('');
  const [cardTexture, setCardTexture] = useState<'glass' | 'brushed' | 'carbon' | 'grid' | 'holo'>('glass');
  const [cardLayout, setCardLayout] = useState<'classic' | 'beach'>('beach');
  const [holoStyle, setHoloStyle] = useState<React.CSSProperties>({});
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const generateQr = async () => {
      try {
        const url = `${domain || window.location.origin}/verify?id=${cardId}&name=${encodeURIComponent(name)}&role=${encodeURIComponent(role)}&title=${encodeURIComponent(builderTitle)}&theme=${activeThemeId}`;
        const dataUrl = await QRCode.toDataURL(url, {
          margin: 1,
          width: 250,
          color: {
            dark: '#000000',
            light: '#ffffff'
          }
        });
        if (active) {
          setQrCodeDataUrl(dataUrl);
        }
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    };
    generateQr();
    return () => {
      active = false;
    };
  }, [domain, cardId, name, role, builderTitle, activeThemeId]);

  const [tiltStyle, setTiltStyle] = useState<React.CSSProperties>({
    transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
  });
  const [glareStyle, setGlareStyle] = useState<React.CSSProperties>({
    background: 'transparent',
  });

  const highResRef = useRef<HTMLDivElement | null>(null);
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const getThemeConfig = (themeId: Theme['id']) => {
    switch (themeId) {
      case 'sunset':
        return {
          bgColor: '#7a1919',
          overlayClass: 'absolute inset-0 bg-gradient-to-t from-red-600/35 via-amber-500/25 to-yellow-400/20 mix-blend-color-burn pointer-events-none z-10',
          accentColor: '#FFE600',
          pinkColor: '#FF5E62',
          roleBg: 'bg-[#FF5E62]',
          roleText: 'text-[#FFE600]',
          nameBg: '#FFFEE0',
          nameText: '#7a1919',
          squadBg: '#5c0e0e',
          garlandBg: '#5c0e0e',
          flowerPetal: '#FFE600',
          flowerCore: '#FF5E62',
        };
      case 'matrix':
        return {
          bgColor: '#022c22',
          overlayClass: 'absolute inset-0 bg-emerald-500/25 mix-blend-color pointer-events-none z-10',
          accentColor: '#00FF66',
          pinkColor: '#ffffff',
          roleBg: 'bg-[#00FF66]',
          roleText: 'text-slate-950',
          nameBg: '#f0fdf4',
          nameText: '#022c22',
          squadBg: '#01251c',
          garlandBg: '#01251c',
          flowerPetal: '#00FF66',
          flowerCore: '#ffffff',
        };
      case 'synthwave':
        return {
          bgColor: '#3b0764',
          overlayClass: 'absolute inset-0 bg-gradient-to-tr from-fuchsia-600/30 to-cyan-500/20 mix-blend-color-dodge pointer-events-none z-10',
          accentColor: '#00D9F6',
          pinkColor: '#FF007A',
          roleBg: 'bg-[#FF007A]',
          roleText: 'text-[#00D9F6]',
          nameBg: '#fae8ff',
          nameText: '#3b0764',
          squadBg: '#22003c',
          garlandBg: '#22003c',
          flowerPetal: '#FF007A',
          flowerCore: '#00D9F6',
        };
      case 'midnight':
        return {
          bgColor: '#0f172a',
          overlayClass: 'absolute inset-0 bg-slate-950/50 mix-blend-multiply pointer-events-none z-10',
          accentColor: '#00FF66',
          pinkColor: '#94a3b8',
          roleBg: 'bg-[#1e293b]',
          roleText: 'text-[#00FF66]',
          nameBg: '#f8fafc',
          nameText: '#0f172a',
          squadBg: '#020617',
          garlandBg: '#020617',
          flowerPetal: '#94a3b8',
          flowerCore: '#00FF66',
        };
      case 'holo':
        return {
          bgColor: '#1e293b',
          overlayClass: 'absolute inset-0 bg-indigo-300/25 mix-blend-color-dodge pointer-events-none z-10',
          accentColor: '#cbd5e1',
          pinkColor: '#ffffff',
          roleBg: 'bg-[#cbd5e1]',
          roleText: 'text-slate-950',
          nameBg: '#ffffff',
          nameText: '#1e293b',
          squadBg: '#0f172a',
          garlandBg: '#0f172a',
          flowerPetal: '#ffffff',
          flowerCore: '#94a3b8',
        };
      case 'antigravity':
        return {
          bgColor: '#03001e',
          overlayClass: 'absolute inset-0 bg-gradient-to-b from-indigo-950/60 via-[#7303c0]/40 to-[#ec38bc]/20 mix-blend-color-dodge pointer-events-none z-10',
          accentColor: '#00F2FE',
          pinkColor: '#FF007A',
          roleBg: 'bg-[#FF007A]',
          roleText: 'text-[#00F2FE]',
          nameBg: '#fae8ff',
          nameText: '#03001e',
          squadBg: '#1c002c',
          garlandBg: '#1c002c',
          flowerPetal: '#00F2FE',
          flowerCore: '#FF007A',
        };
      case 'tropic':
      default:
        return {
          bgColor: '#036838',
          overlayClass: 'absolute inset-0 bg-emerald-950/10 mix-blend-multiply pointer-events-none z-10',
          accentColor: '#FFE600',
          pinkColor: '#FF007A',
          roleBg: 'bg-[#FF007A]',
          roleText: '#FFE600',
          nameBg: '#FFFEE0',
          nameText: '#0A3A22',
          squadBg: '#024d29',
          garlandBg: '#024d29',
          flowerPetal: '#FFE600',
          flowerCore: '#FF007A',
        };
    }
  };

  const tc = getThemeConfig(activeThemeId);

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
    // Pre-load /builder-bg.jpg for canvas resolution sync
    const img = new Image();
    img.src = '/builder-bg.jpg';
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
          layout: cardLayout,
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
    setZoom(1.0);
    setPanX(0);
    setPanY(0);
    setRotation(0);
    setName('TINO FRANCIS');
    setRole('Full Stack Developer');
    setBuilderTitle('THE SHIPPER');
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

            {/* Card Layout Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Badge Design Layout
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    audio.playClick();
                    setCardLayout('classic');
                  }}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer text-center ${
                    cardLayout === 'classic'
                      ? 'border-[#00F5A0] bg-emerald-500/10 text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.1)]'
                      : 'border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-950/60'
                  }`}
                >
                  Classic Lanyard Pass
                </button>
                <button
                  onClick={() => {
                    audio.playClick();
                    setCardLayout('beach');
                  }}
                  className={`py-2.5 px-3 text-xs font-bold uppercase tracking-wider rounded-xl border transition-all duration-200 cursor-pointer text-center ${
                    cardLayout === 'beach'
                      ? 'border-[#00F5A0] bg-emerald-500/10 text-[#00F5A0] shadow-[0_0_15px_rgba(0,245,160,0.1)]'
                      : 'border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-slate-950/40 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-100/60 dark:hover:bg-slate-950/60'
                  }`}
                >
                  Goa Beach Pop-Art
                </button>
              </div>
            </div>

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
          </span>          {/* Lanyard punch hole (White rounded pill shape centered at the top) */}
          {cardLayout === 'classic' && (
            <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-14 h-3.5 rounded-full bg-white border border-slate-300 shadow-inner z-20 pointer-events-none" />
          )}

          {/* White outer margin badge card container */}
          <div 
            style={tiltStyle}
            className="p-[10px] rounded-[32px] bg-white border border-slate-200/50 shadow-2xl transition-transform duration-200 ease-out will-change-transform z-10 w-full"
          >
            {cardLayout === 'beach' ? (
              /* Visible badge card (Goa Beach Style aspect-[732/1014]) */
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  backgroundImage: "url('/goa-beach-frame.jpg')",
                  backgroundSize: '100% 100%',
                  backgroundPosition: 'center',
                  aspectRatio: '732/1014'
                }}
                className="relative w-full overflow-hidden rounded-[24px] select-none cursor-crosshair z-0"
              >
                {/* 3D Reflection Glare Overlay */}
                <div
                  style={glareStyle}
                  className="absolute inset-0 z-40 pointer-events-none opacity-20 transition-opacity duration-300"
                />

                {/* Holographic Security Microprint Overlay */}
                <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] select-none overflow-hidden" aria-hidden="true">
                  <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 8.5px)`, color: tc.accentColor }} />
                </div>

                {/* Theme Color Overlay */}
                <div className={`${tc.overlayClass} opacity-20`} />

                {/* 1. HH GOA 2026 branding top-left */}
                <div className="absolute left-[7.5%] top-[7.5%] flex flex-col items-start leading-[1.1] z-10">
                  <span className="font-sans font-black text-white text-[10px] sm:text-xs tracking-tight drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">HH GOA</span>
                  <span className="font-sans font-black text-white text-xs sm:text-sm drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">2026</span>
                  <span className="mt-0.5 px-1 py-0.25 rounded bg-[#FF007A] text-white font-sans font-black text-[5px] sm:text-[6px] tracking-wider uppercase scale-90 origin-left">BUILDER ID</span>
                </div>

                {/* 2. Less noise quote top-right */}
                <div className="absolute right-[7.5%] top-[8.5%] flex flex-col items-end leading-tight z-10">
                  <span className="font-mono font-black text-white text-[6.5px] sm:text-[7.5px] tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">LESS NOISE.</span>
                  <span className="font-mono font-black text-[#FF007A] text-[6.5px] sm:text-[7.5px] tracking-tighter drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">MORE SIGNAL.</span>
                  <div className="w-8 h-[1px] bg-[#FF007A] mt-0.5" />
                </div>

                {/* 3. Photo Frame Overlay */}
                <div className="absolute left-[17.6%] top-[30.1%] w-[26.2%] h-[26.3%] overflow-hidden rounded-[4px] bg-slate-900 border border-slate-950 flex items-center justify-center z-10">
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
                        className="flex flex-col items-center justify-center p-2 text-center opacity-40"
                      >
                        <svg className="h-4 w-4 text-slate-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-[4px] font-mono font-bold uppercase tracking-wider text-slate-400 scale-75">NO PHOTO</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 4. Name Box */}
                <div className="absolute left-[53%] top-[46.5%] w-[40%] z-10 flex flex-col gap-0.5">
                  <div className="px-1.5 py-0.5 bg-[#FF007A] border border-black rounded-[4px] shadow-sm transform -rotate-[1deg] text-center">
                    <div className="font-sans font-black text-[9px] sm:text-[10px] text-white uppercase tracking-wider truncate">
                      {name || 'TINO FRANCIS'}
                    </div>
                  </div>
                  <div className="font-sans font-extrabold text-[6px] sm:text-[7px] text-white tracking-wider uppercase text-center mt-0.5 drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
                    {role.toUpperCase()}
                  </div>
                </div>

                {/* 5. Builder Class Yellow Brush */}
                <div className="absolute left-[52%] top-[63.5%] w-[42%] z-10 flex flex-col items-center">
                  <span className="font-mono font-black text-white text-[5px] sm:text-[5.5px] tracking-wider uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">BUILDER CLASS:</span>
                  <div className="relative mt-0.5 px-2 py-0.5 bg-[#FFE600] rounded-sm transform rotate-[1.5deg] shadow-[1px_1px_4px_rgba(0,0,0,0.15)] text-center">
                    <span className="font-serif italic font-black text-[#FF007A] text-[7.5px] sm:text-[8.5px] tracking-tight uppercase whitespace-nowrap">
                      {builderTitle || 'THE SHIPPER'}
                    </span>
                  </div>
                </div>

                {/* 6. Hashtag Pink Ribbon */}
                <div className="absolute right-[8%] bottom-[12.5%] z-10">
                  <div className="px-2 py-0.5 bg-[#FF007A] rounded-full shadow-md text-white font-mono font-black text-[5px] sm:text-[5.5px] tracking-widest uppercase">
                    #FrameInGoa
                  </div>
                </div>

                {/* QR Code Container (Visible Card) */}
                {qrCodeDataUrl && (
                  <div className="absolute right-[6%] bottom-[4.5%] z-10 flex flex-col items-center gap-[1px]">
                    <div className="p-0.5 bg-white border border-black rounded-[4px] shadow-[1px_1px_3px_rgba(0,0,0,0.25)]">
                      <img
                        src={qrCodeDataUrl}
                        alt="Verify Pass QR"
                        className="h-8 w-8 sm:h-9 sm:w-9 object-contain"
                      />
                    </div>
                    <span className="font-mono font-black text-white text-[3px] sm:text-[3.5px] tracking-wider uppercase drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]">
                      VERIFY PASS
                    </span>
                  </div>
                )}

                {/* 7. Bottom Date */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-[3.5%] z-10 font-sans font-black text-white text-[6.5px] sm:text-[7px] tracking-widest uppercase whitespace-nowrap drop-shadow-[0_1.5px_3px_rgba(0,0,0,0.85)]">
                  — 28 - 31 OCT 2026 —
                </div>
              </div>
            ) : (
              /* Visible badge card (Ticket Style aspect-[10/16]) */
              <div
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ 
                  backgroundImage: "url('/hero-bg.jpg')",
                  backgroundSize: 'cover',
                  backgroundPosition: 'center bottom'
                }}
                className="relative aspect-[10/16] w-full overflow-hidden rounded-[24px] flex flex-col justify-between p-4 pt-8 pb-4 select-none cursor-crosshair z-0"
              >
                {/* 3D Reflection Glare Overlay */}
                <div
                  style={glareStyle}
                  className="absolute inset-0 z-40 pointer-events-none opacity-20 transition-opacity duration-300"
                />

                {/* Holographic Security Microprint Overlay */}
                <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.04] select-none overflow-hidden" aria-hidden="true">
                  <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 8px, currentColor 8px, currentColor 8.5px)`, color: tc.accentColor }} />
                </div>

                {/* Theme Color Overlay */}
                <div className={tc.overlayClass} />

                {/* Club-suit ♧ decorative motif */}
                <div className="absolute top-3 right-3 z-20 pointer-events-none select-none opacity-15 text-[28px]" style={{ color: tc.accentColor }}>♧</div>
                <div className="absolute bottom-3 left-3 z-20 pointer-events-none select-none opacity-10 text-[22px] rotate-180" style={{ color: tc.accentColor }}>♧</div>

                {/* Top Header Metadata Row */}
                <div className="relative z-10 flex justify-between items-center pb-2" style={{ borderBottomColor: `${tc.accentColor}40`, borderBottomWidth: '1px' }}>
                  <div className="flex flex-col items-start text-left leading-none font-extrabold" style={{ color: tc.accentColor }}>
                    <span className="text-[10px] sm:text-[11px] font-mono tracking-tighter">2:47PM</span>
                    <span className="text-[5px] sm:text-[5.5px] tracking-widest font-sans mt-0.5 opacity-90">STUDIO</span>
                  </div>
                  <div className="flex flex-col items-end text-right leading-none font-extrabold" style={{ color: tc.accentColor }}>
                    <span className="text-[7.5px] sm:text-[8px] tracking-tight font-mono">28 - 31 OCT 2026</span>
                    <span className="text-[5px] sm:text-[5.5px] tracking-wider font-sans mt-0.5 opacity-90">GOA, INDIA</span>
                  </div>
                </div>

                {/* Official Brand Title Block */}
                <div className="relative z-10 flex flex-col items-center mt-2.5 text-center w-full">
                  {/* Base yellow logo text with Devanagari badge overlaid */}
                  <div className="relative h-7 w-52 sm:h-8 sm:w-60 flex items-center justify-center pointer-events-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.55)]">
                    <img
                      src="/hacker-house-text.png"
                      alt="Hacker House Logo"
                      className="h-full w-full object-contain"
                    />
                    {/* Hot-pink Devanagari emblem "गोवा" badge overlaid */}
                    <div className="absolute top-[38%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 text-white text-[9px] sm:text-[10px] font-sans font-black px-1.5 py-0.5 rounded border border-white/20 rotate-[-4deg] shadow-md select-none whitespace-nowrap uppercase tracking-wider" style={{ backgroundColor: tc.pinkColor }}>
                      गोवा
                    </div>
                  </div>
                  <p className="text-[5.5px] sm:text-[6px] font-sans font-black text-white/95 tracking-wider uppercase mt-1.5">
                    BUILD · BEACH · BELONG · HHG/26
                  </p>
                </div>

                {/* Arch Photo Frame & Overlay */}
                <div className="relative z-10 my-auto flex flex-col items-center">
                  {/* Rounded arch frame window */}
                  <div className="relative p-[2.5px] rounded-t-full" style={{ backgroundColor: tc.accentColor, boxShadow: `0 0 15px ${tc.accentColor}50` }}>
                    <div className="relative h-[105px] w-[85px] sm:h-[115px] sm:w-[95px] overflow-hidden rounded-t-full bg-slate-900 border border-slate-950 flex items-center justify-center">
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
                            className="flex flex-col items-center justify-center p-2 text-center opacity-40"
                          >
                            <svg className="h-6 w-6 text-slate-400 mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span className="text-[4px] font-mono font-bold uppercase tracking-wider text-slate-400">NO PHOTO</span>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Frame Badge tag attached at bottom center */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full shadow-md z-20 text-[5px] font-mono font-black text-white tracking-widest uppercase whitespace-nowrap" style={{ backgroundColor: tc.bgColor, borderColor: `${tc.accentColor}66`, borderWidth: '1px' }}>
                      #FrameInGoa
                    </div>
                  </div>
                </div>

                {/* Name Box & Role Badge */}
                <div className="relative z-10 flex flex-col items-center mt-2">
                  {/* Name Box */}
                  <div className="w-full max-w-[220px] px-3 py-1 border-[2px] rounded-xl text-center shadow-md" style={{ backgroundColor: tc.nameBg, borderColor: tc.accentColor }}>
                    <div className="font-serif font-black text-[10px] sm:text-xs uppercase tracking-wider truncate" style={{ color: tc.nameText }}>
                      {name || 'SMRUTISWARUPA PRIYADARSINI'}
                    </div>
                  </div>
                  {/* Role Tag decorated with marigold stars */}
                  <div className={`inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full ${tc.roleBg} text-[6px] sm:text-[6.5px] font-mono font-black tracking-widest uppercase shadow-md`} style={{ color: tc.accentColor }}>
                    <span>✹</span>
                    <span>{role.toUpperCase()}</span>
                    <span>✹</span>
                  </div>
                </div>

                {/* Pass Identifier */}
                <div className="relative z-10 mt-2 px-3 py-0.5 rounded-full text-center text-[5px] sm:text-[5.5px] font-mono font-black text-white/95 tracking-widest uppercase" style={{ backgroundColor: tc.squadBg, borderColor: `${tc.accentColor}4D`, borderWidth: '1px' }}>
                  ZENITH SQUAD  •  #GOA-2026-{cardId || '0199A'}
                </div>

                {/* Footer details & QR */}
                <div className="relative z-10 w-full mt-2 flex flex-col items-center gap-1.5">
                  {/* Centered QR with center emblem overlay */}
                  <div className="relative p-[1.5px] rounded shadow-md" style={{ backgroundColor: tc.accentColor }}>
                    {cardId ? (
                      <div className="relative">
                        <img
                          src={qrCodeDataUrl || qrImageUrl}
                          alt="QR Link"
                          crossOrigin="anonymous"
                          className="h-10 w-10 object-contain rounded bg-white"
                        />
                        {/* Center emblem overlay */}
                        <div className="absolute inset-0 m-auto h-3 w-3 rounded-sm bg-white p-[0.5px] shadow-sm flex items-center justify-center">
                          <img src="/hacker-house-goa-logo.png" className="h-full w-full object-contain" />
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <QRCodeSVG className="h-10 w-10 text-slate-900 bg-white p-0.5 animate-pulse" />
                        {/* Center emblem overlay */}
                        <div className="absolute inset-0 m-auto h-3 w-3 rounded-sm bg-white p-[0.5px] shadow-sm flex items-center justify-center">
                          <img src="/hacker-house-goa-logo.png" className="h-full w-full object-contain" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Marigold garland bottom strip */}
                  <div className="absolute -bottom-4 inset-x-0 h-2 flex justify-between px-1 overflow-hidden select-none" style={{ backgroundColor: tc.garlandBg, borderTopColor: `${tc.accentColor}4D`, borderTopWidth: '1px' }}>
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-center flex-shrink-0 w-2.5 h-full">
                        <div className="w-1.5 h-1.5 rounded-full relative flex items-center justify-center shadow-sm" style={{ backgroundColor: tc.flowerPetal }}>
                          <div className="absolute w-0.5 h-0.5 rounded-full" style={{ backgroundColor: tc.flowerCore }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===========================================================
          HIDDEN OFF-SCREEN 1080x1920 CANVAS FOR PNG EXPORT
          ==================================================== */}
      <div className="badge-canvas-container">
        <div
          ref={highResRef}
          style={{}}
          className={`${cardLayout === 'beach' ? 'w-[1080px] h-[1496px] p-0' : 'w-[1080px] h-[1920px] p-6'} bg-white text-white flex flex-col justify-between font-sans relative overflow-hidden select-none`}
        >
          {/* Lanyard punch hole (High-Res) */}
          {cardLayout === 'classic' && (
            <div className="absolute top-[28px] left-1/2 -translate-x-1/2 w-44 h-11 rounded-full bg-white border-2 border-slate-350 shadow-inner z-20 pointer-events-none" />
          )}

          {/* Deep jungle green badge body wrapper */}
          {cardLayout === 'beach' ? (
            <div 
              style={{ 
                backgroundImage: "url('/goa-beach-frame.jpg')",
                backgroundSize: '100% 100%',
                backgroundPosition: 'center'
              }}
              className="w-full h-full rounded-[48px] overflow-hidden relative z-10 select-none"
            >
              {/* Holographic Security Microprint Overlay (High-Res) */}
              <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.03] select-none overflow-hidden" aria-hidden="true">
                <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 24px, currentColor 24px, currentColor 25.5px)`, color: tc.accentColor }} />
              </div>

              {/* Theme Color Overlay (High-Res) */}
              <div className={`${tc.overlayClass} opacity-20`} />

              {/* 1. HH GOA 2026 branding top-left */}
              <div className="absolute left-[7.5%] top-[7.5%] flex flex-col items-start leading-[1.1] z-10">
                <span className="font-sans font-black text-white text-[48px] tracking-tight drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">HH GOA</span>
                <span className="font-sans font-black text-white text-[56px] drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">2026</span>
                <span className="mt-2 px-5 py-1.5 rounded-lg bg-[#FF007A] text-white font-sans font-black text-sm tracking-wider uppercase">BUILDER ID</span>
              </div>

              {/* 2. Less noise quote top-right */}
              <div className="absolute right-[7.5%] top-[8.5%] flex flex-col items-end leading-tight z-10">
                <span className="font-mono font-black text-white text-[24px] tracking-tighter drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">LESS NOISE.</span>
                <span className="font-mono font-black text-[#FF007A] text-[24px] tracking-tighter drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">MORE SIGNAL.</span>
                <div className="w-24 h-[3px] bg-[#FF007A] mt-1.5" />
              </div>

              {/* 3. Photo Frame Overlay */}
              <div className="absolute left-[17.6%] top-[30.1%] w-[26.2%] h-[26.3%] overflow-hidden rounded-[16px] bg-slate-900 border-2 border-slate-950 flex items-center justify-center z-10">
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
                    <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-xs font-mono font-bold text-slate-400 tracking-wider mt-2">NO PHOTO</span>
                  </div>
                )}
              </div>

              {/* 4. Name Box */}
              <div className="absolute left-[53%] top-[46.5%] w-[40%] z-10 flex flex-col gap-1.5 text-center">
                <div className="px-8 py-3.5 bg-[#FF007A] border-2 border-black rounded-[12px] shadow-md transform -rotate-[1deg]">
                  <div className="font-sans font-black text-[36px] text-white uppercase tracking-wider truncate">
                    {name || 'TINO FRANCIS'}
                  </div>
                </div>
                <div className="font-sans font-extrabold text-[22px] text-white tracking-wider uppercase mt-1.5 drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
                  {role.toUpperCase()}
                </div>
              </div>

              {/* 5. Builder Class Yellow Brush */}
              <div className="absolute left-[52%] top-[63.5%] w-[42%] z-10 flex flex-col items-center">
                <span className="font-mono font-black text-white text-xs tracking-wider uppercase drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">BUILDER CLASS:</span>
                <div className="relative mt-1.5 px-6 py-1.5 bg-[#FFE600] rounded-sm transform rotate-[1.5deg] shadow-[2px_2px_8px_rgba(0,0,0,0.15)] text-center">
                  <span className="font-serif italic font-black text-[#FF007A] text-[24px] tracking-tight uppercase whitespace-nowrap">
                    {builderTitle || 'THE SHIPPER'}
                  </span>
                </div>
              </div>

              {/* 6. Hashtag Pink Ribbon */}
              <div className="absolute right-[8%] bottom-[12.5%] z-10">
                <div className="px-8 py-2 bg-[#FF007A] rounded-full shadow-lg text-white font-mono font-black text-sm tracking-widest uppercase">
                  #FrameInGoa
                </div>
              </div>

              {/* QR Code Container (High-Res) */}
              {qrCodeDataUrl && (
                <div className="absolute right-[6%] bottom-[4.5%] z-10 flex flex-col items-center gap-[3px]">
                  <div className="p-1.5 bg-white border-2 border-black rounded-[12px] shadow-lg">
                    <img
                      src={qrCodeDataUrl}
                      alt="Verify Pass QR"
                      className="h-32 w-32 object-contain"
                    />
                  </div>
                  <span className="font-mono font-black text-white text-[12px] tracking-wider uppercase drop-shadow-[0_3px_6px_rgba(0,0,0,0.85)]">
                    VERIFY PASS
                  </span>
                </div>
              )}

              {/* 7. Bottom Date */}
              <div className="absolute left-1/2 -translate-x-1/2 bottom-[3.5%] z-10 font-sans font-black text-white text-[24px] tracking-widest uppercase whitespace-nowrap drop-shadow-[0_4px_8px_rgba(0,0,0,0.85)]">
                — 28 - 31 OCT 2026 —
              </div>
            </div>
          ) : (
            <div 
              style={{ 
                backgroundImage: "url('/hero-bg.jpg')",
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom'
              }}
              className="w-full h-full rounded-[48px] overflow-hidden flex flex-col justify-between p-12 pt-16 pb-12 relative z-10"
            >
              {/* Holographic Security Microprint Overlay (High-Res) */}
              <div className="absolute inset-0 z-30 pointer-events-none opacity-[0.04] select-none overflow-hidden" aria-hidden="true">
                <div className="w-full h-full" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 24px, currentColor 24px, currentColor 25.5px)`, color: tc.accentColor }} />
              </div>

              {/* Theme Color Overlay (High-Res) */}
              <div className={tc.overlayClass} />

              {/* Club-suit ♧ decorative motif (High-Res) */}
              <div className="absolute top-8 right-8 z-20 pointer-events-none select-none opacity-15 text-7xl" style={{ color: tc.accentColor }}>♧</div>
              <div className="absolute bottom-8 left-8 z-20 pointer-events-none select-none opacity-10 text-5xl rotate-180" style={{ color: tc.accentColor }}>♧</div>

              {/* Top Header Metadata Row */}
              <div className="relative z-10 flex justify-between items-center pb-4" style={{ borderBottomColor: `${tc.accentColor}40`, borderBottomWidth: '2px' }}>
                <div className="flex flex-col items-start text-left leading-none font-extrabold" style={{ color: tc.accentColor }}>
                  <span className="text-3xl font-mono tracking-tighter">2:47PM</span>
                  <span className="text-sm tracking-[0.2em] font-sans mt-1 opacity-90">STUDIO</span>
                </div>
                <div className="flex flex-col items-end text-right leading-none font-extrabold" style={{ color: tc.accentColor }}>
                  <span className="text-2xl tracking-tight font-mono">28 - 31 OCT 2026</span>
                  <span className="text-sm tracking-widest font-sans mt-1 opacity-90">GOA, INDIA</span>
                </div>
              </div>

              {/* Official Brand Title Block */}
              <div className="relative z-10 flex flex-col items-center mt-6 text-center w-full">
                <div className="relative h-20 w-[600px] flex items-center justify-center pointer-events-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">
                  <img
                    src="/hacker-house-text.png"
                    alt="Hacker House Logo"
                    className="h-full w-full object-contain"
                  />
                  {/* Hot-pink Devanagari emblem "गोवा" badge overlaid */}
                  <div className="absolute top-[38%] left-[49.5%] -translate-x-1/2 -translate-y-1/2 text-white text-2xl font-sans font-black px-4 py-1 rounded-xl border-2 border-white/20 rotate-[-4deg] shadow-lg select-none whitespace-nowrap uppercase tracking-wider" style={{ backgroundColor: tc.pinkColor }}>
                    गोवा
                  </div>
                </div>
                <p className="text-sm font-sans font-black text-white/95 tracking-[0.2em] uppercase mt-3">
                  BUILD · BEACH · BELONG · HHG/26
                </p>
              </div>

              {/* Arch Photo Frame & Overlay */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                {/* Rounded arch frame window */}
                <div className="relative p-[6px] rounded-t-full" style={{ backgroundColor: tc.accentColor, boxShadow: `0 0 40px ${tc.accentColor}50` }}>
                  <div className="relative h-[320px] w-[260px] overflow-hidden rounded-t-full bg-slate-900 border-2 border-slate-950 flex items-center justify-center">
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
                        <svg className="h-16 w-16 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-xs font-mono font-bold text-slate-400 tracking-wider mt-2">NO PHOTO</span>
                      </div>
                    )}
                  </div>

                  {/* Frame Badge tag attached at bottom center */}
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full shadow-lg z-20 text-xs font-mono font-black text-white tracking-widest uppercase whitespace-nowrap" style={{ backgroundColor: tc.bgColor, borderColor: `${tc.accentColor}66`, borderWidth: '1px' }}>
                    #FrameInGoa
                  </div>
                </div>
              </div>

              {/* Name Box & Role Badge */}
              <div className="relative z-10 flex flex-col items-center mt-6">
                {/* Name Box */}
                <div className="w-full max-w-[550px] px-8 py-3.5 border-4 rounded-3xl text-center shadow-lg" style={{ backgroundColor: tc.nameBg, borderColor: tc.accentColor }}>
                  <div className="font-serif font-black text-2xl uppercase tracking-wider truncate" style={{ color: tc.nameText }}>
                    {name || 'SMRUTISWARUPA PRIYADARSINI'}
                  </div>
                </div>
                {/* Role Tag decorated with marigold stars */}
                <div className={`inline-flex items-center gap-3 mt-4 px-8 py-2.5 rounded-full ${tc.roleBg} text-base font-mono font-black tracking-widest uppercase shadow-lg`} style={{ color: tc.accentColor }}>
                  <span>✹</span>
                  <span>{role.toUpperCase()}</span>
                  <span>✹</span>
                </div>
              </div>

              {/* Pass Identifier */}
              <div className="relative z-10 mt-6 px-8 py-2.5 rounded-full text-center text-xs font-mono font-black text-white/90 tracking-widest uppercase" style={{ backgroundColor: tc.squadBg, borderColor: `${tc.accentColor}4D`, borderWidth: '1px' }}>
                ZENITH SQUAD  •  #GOA-2026-{cardId || '0199A'}
              </div>

              {/* Footer details & QR */}
              <div className="relative z-10 w-full mt-6 flex flex-col items-center gap-4">
                {/* Centered QR with center emblem overlay */}
                <div className="relative p-[3px] rounded shadow-lg" style={{ backgroundColor: tc.accentColor }}>
                  {cardId ? (
                    <div className="relative">
                      <img
                        src={qrCodeDataUrl || qrImageUrl}
                        alt="QR Link"
                        crossOrigin="anonymous"
                        className="h-28 w-28 object-contain rounded bg-white"
                      />
                      {/* Center emblem overlay */}
                      <div className="absolute inset-0 m-auto h-8 w-8 rounded-sm bg-white p-[1px] shadow-sm flex items-center justify-center">
                        <img src="/hacker-house-goa-logo.png" className="h-full w-full object-contain" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <QRCodeSVG className="h-28 w-28 text-slate-900 bg-white p-2" />
                      {/* Center emblem overlay */}
                      <div className="absolute inset-0 m-auto h-8 w-8 rounded-sm bg-white p-[1px] shadow-sm flex items-center justify-center">
                        <img src="/hacker-house-goa-logo.png" className="h-full w-full object-contain" />
                      </div>
                    </div>
                  )}
                </div>

                {/* Marigold garland bottom strip */}
                <div className="absolute -bottom-12 inset-x-0 h-6 flex justify-between px-2 overflow-hidden select-none" style={{ backgroundColor: tc.garlandBg, borderTopColor: `${tc.accentColor}4D`, borderTopWidth: '1px' }}>
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-center flex-shrink-0 w-8 h-full">
                      <div className="w-5 h-5 rounded-full relative flex items-center justify-center shadow-sm" style={{ backgroundColor: tc.flowerPetal }}>
                        <div className="absolute w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tc.flowerCore }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
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
