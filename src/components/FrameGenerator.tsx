'use client';

import React, { useState, useRef } from 'react';
import UploadBox from './UploadBox';
import CropModal from './CropModal';
import ThemeSelector from './ThemeSelector';
import DownloadButton from './DownloadButton';
import ShareButton from './ShareButton';
import PalmLeafSVG from './PalmLeafSVG';
import { THEMES, Theme } from '@/utils/constants';
import { Edit2, RefreshCw, AlertCircle, Compass } from 'lucide-react';

interface FrameGeneratorProps {
  activeThemeId: Theme['id'];
  setActiveThemeId: (themeId: Theme['id']) => void;
}

export default function FrameGenerator({ activeThemeId, setActiveThemeId }: FrameGeneratorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  const highResRef = useRef<HTMLDivElement | null>(null);
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const handleImageSelected = (src: string) => {
    setImageSrc(src);
    setShowCropModal(true);
  };

  const handleCropComplete = (croppedSrc: string) => {
    setCroppedImage(croppedSrc);
    setShowCropModal(false);
  };

  const handleReset = () => {
    setImageSrc(null);
    setCroppedImage(null);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full max-w-5xl mx-auto px-4">
      {/* Left panel: Controls */}
      <div className="w-full lg:w-1/2 flex flex-col gap-6 order-2 lg:order-1">
        <div className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 backdrop-blur-xl">
          <h2 className="text-xl font-bold font-display text-white mb-5 flex items-center gap-2">
            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.glow}`} />
            Profile Frame Customizer
          </h2>

          <div className="flex flex-col gap-6">
            {/* Upload Area */}
            {!croppedImage ? (
              <UploadBox onImageSelected={handleImageSelected} />
            ) : (
              <div className="flex flex-col gap-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Profile Photo
                </label>
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-slate-950/50 p-4">
                  <div className="flex items-center gap-3">
                    {/* Tiny thumbnail */}
                    <img
                      src={croppedImage}
                      alt="Cropped Preview"
                      className="h-12 w-12 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">Photo loaded</p>
                      <p className="text-xs text-slate-400">Successfully cropped & optimized</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowCropModal(true)}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                      title="Recrop photo"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
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

            {/* Actions */}
            {croppedImage && (
              <div className="flex flex-col gap-4 mt-2">
                <DownloadButton
                  elementRef={highResRef}
                  fileName={`hh-goa-profile-frame-${activeThemeId}.png`}
                  onDownloadCompleted={async () => {
                    try {
                      await fetch('/api/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          name: 'N/A (Profile Frame)',
                          role: 'N/A',
                          title: 'N/A',
                          theme: activeThemeId,
                        }),
                      });
                    } catch (err) {
                      console.error('Failed to log client data:', err);
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

          {/* Visible Interactive Preview (fluid sizing mirroring 1080x1350) */}
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#020617] shadow-2xl flex flex-col justify-between p-6 sm:p-8">
            
            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-15"
              style={{
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Background Glows */}
            <div className={`absolute -top-24 -left-24 w-48 h-48 rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-20 blur-[50px]`} />
            <div className={`absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-20 blur-[50px]`} />

            {/* Floating Tropical Leaves in background */}
            <div className="absolute -left-8 top-1/4 w-24 h-24 text-white/5 rotate-45 pointer-events-none">
              <PalmLeafSVG className="w-full h-full" />
            </div>
            <div className="absolute -right-8 bottom-1/4 w-24 h-24 text-white/5 -rotate-45 pointer-events-none">
              <PalmLeafSVG className="w-full h-full" />
            </div>

            {/* Top Bar Branding */}
            <div className="relative z-10 flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-400 border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5 font-black">
                <img
                  src="/studio-logo.png"
                  alt="2:47PM Studio"
                  className="h-3.5 w-6 object-contain"
                />
                <div className="h-2 w-[1px] bg-white/20" />
                <img
                  src="/hacker-house-logo.png"
                  alt="Hacker House"
                  className="h-3.5 w-16 object-contain"
                />
              </div>
              <span>•</span>
              <span>Official Profile</span>
              <span>•</span>
              <span className={activeTheme.accentText}>Goa, IN</span>
            </div>

            {/* Main Avatar Circular Frame */}
            <div className="relative z-10 flex flex-col items-center justify-center my-auto">
              
              {/* Outer decorative ring */}
              <div className={`absolute w-[254px] h-[254px] rounded-full border border-dashed border-white/15 animate-spin [animation-duration:80s]`} />
              
              {/* Corner crosshairs */}
              <div className="absolute w-[280px] h-[280px] flex justify-between items-between text-slate-600 font-mono text-[9px] pointer-events-none">
                <div className="absolute top-0 left-0 border-t border-l border-white/20 w-3 h-3" />
                <div className="absolute top-0 right-0 border-t border-r border-white/20 w-3 h-3" />
                <div className="absolute bottom-0 left-0 border-b border-l border-white/20 w-3 h-3" />
                <div className="absolute bottom-0 right-0 border-b border-r border-white/20 w-3 h-3" />
              </div>

              {/* Glowing ring wrapper */}
              <div className={`relative flex h-[230px] w-[230px] items-center justify-center rounded-full p-[5px] bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.glow}`}>
                {/* User Image or Empty State */}
                <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-900 border border-slate-950 flex items-center justify-center">
                  {croppedImage ? (
                    <img
                      src={croppedImage}
                      alt="Cropped face avatar"
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-4 text-center">
                      <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-2">
                        <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                        Upload Image
                      </p>
                      <p className="text-[8px] text-slate-500 max-w-[120px] mt-0.5">
                        Choose photo to preview frame
                      </p>
                    </div>
                  )}
                </div>

                {/* Overlaid Badges on circular frame */}
                <div className="absolute -bottom-2 bg-slate-950 border border-white/10 px-4 py-1 rounded-full font-black text-[10px] tracking-widest text-center uppercase shadow-xl text-white">
                  HH GOA 2026
                </div>
                <div className={`absolute -top-2 bg-slate-950 border border-white/10 px-3 py-0.5 rounded-full font-bold text-[8px] tracking-widest text-center uppercase shadow-xl ${activeTheme.accentText}`}>
                  BUILDER
                </div>
              </div>

              {/* Coordinates label */}
              <div className="mt-8 flex items-center gap-1 text-[9px] font-mono tracking-widest text-slate-400">
                <Compass className="h-3 w-3 animate-spin [animation-duration:15s]" />
                <span>15.4967° N, 73.8278° E</span>
              </div>
            </div>

            {/* Bottom Info Details */}
            <div className="relative z-10 flex justify-between items-end border-t border-white/5 pt-3">
              <div className="flex flex-col gap-0.5 text-left">
                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-500">BUILDER STATUS</span>
                <span className="text-[9px] font-black uppercase text-white tracking-widest">VERIFIED</span>
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-[12px] font-black uppercase tracking-wider bg-gradient-to-r ${activeTheme.gradient} bg-clip-text text-transparent`}>
                  #FrameInGoa
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-right font-mono">
                <span className="text-[7px] font-bold uppercase tracking-wider text-slate-500">PORT ENTRY</span>
                <span className="text-[9px] font-bold text-white uppercase tracking-widest">FEB 2026</span>
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
          {/* High-res Grid Pattern */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 2px, transparent 2px)',
              backgroundSize: '60px 60px',
            }}
          />

          {/* High-res Glow blobs */}
          <div className={`absolute -top-72 -left-72 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-25 blur-[120px]`} />
          <div className={`absolute -bottom-72 -right-72 w-[600px] h-[600px] rounded-full bg-gradient-to-br ${activeTheme.gradient} opacity-25 blur-[120px]`} />

          {/* High-res Floating Leaves */}
          <div className="absolute -left-20 top-[30%] w-80 h-80 text-white/5 rotate-45 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>
          <div className="absolute -right-20 bottom-[30%] w-80 h-80 text-white/5 -rotate-45 pointer-events-none">
            <PalmLeafSVG className="w-full h-full" />
          </div>

          {/* High-res Header */}
          <div className="relative z-10 flex justify-between items-center text-xl font-black uppercase tracking-[0.25em] text-slate-400 border-b-2 border-white/5 pb-6">
            <div className="flex items-center gap-4 font-black">
              <img
                src="/studio-logo.png"
                alt="2:47PM Studio"
                className="h-10 w-16 object-contain"
              />
              <div className="h-6 w-[2px] bg-white/20" />
              <img
                src="/hacker-house-logo.png"
                alt="Hacker House"
                className="h-10 w-44 object-contain"
              />
            </div>
            <span>•</span>
            <span>Official Profile</span>
            <span>•</span>
            <span className={activeTheme.accentText}>Goa, India</span>
          </div>

          {/* High-res Central Frame */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto">
            {/* Outer dotted accent circle */}
            <div className="absolute w-[740px] h-[740px] rounded-full border-2 border-dashed border-white/10" />

            {/* Corner brackets */}
            <div className="absolute w-[820px] h-[820px] flex justify-between items-between text-slate-700 pointer-events-none">
              <div className="absolute top-0 left-0 border-t-4 border-l-4 border-white/20 w-8 h-8" />
              <div className="absolute top-0 right-0 border-t-4 border-r-4 border-white/20 w-8 h-8" />
              <div className="absolute bottom-0 left-0 border-b-4 border-l-4 border-white/20 w-8 h-8" />
              <div className="absolute bottom-0 right-0 border-b-4 border-r-4 border-white/20 w-8 h-8" />
            </div>

            {/* Main Avatar Border */}
            <div className={`relative flex h-[660px] w-[660px] items-center justify-center rounded-full p-[14px] bg-gradient-to-r ${activeTheme.gradient} ${activeTheme.glow}`}>
              <div className="relative h-full w-full rounded-full overflow-hidden bg-slate-900 border-[3px] border-slate-950">
                {croppedImage ? (
                  <img
                    src={croppedImage}
                    alt="Cropped high-res face"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900" />
                )}
              </div>

              {/* Circular frame overlay text badges */}
              <div className="absolute -bottom-6 bg-slate-950 border-2 border-white/15 px-12 py-3 rounded-full font-black text-2xl tracking-[0.2em] text-center uppercase shadow-2xl text-white">
                HH GOA 2026
              </div>
              <div className={`absolute -top-6 bg-slate-950 border-2 border-white/15 px-8 py-2 rounded-full font-bold text-lg tracking-[0.25em] text-center uppercase shadow-2xl ${activeTheme.accentText}`}>
                BUILDER
              </div>
            </div>

            {/* Coordinates */}
            <div className="mt-20 text-[20px] font-mono tracking-[0.3em] text-slate-400">
              15.4967° N, 73.8278° E
            </div>
          </div>

          {/* High-res Footer */}
          <div className="relative z-10 flex justify-between items-end border-t-2 border-white/5 pt-8">
            <div className="flex flex-col gap-1.5 text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">BUILDER STATUS</span>
              <span className="text-xl font-black uppercase text-white tracking-[0.15em]">VERIFIED</span>
            </div>
            <div className="flex flex-col items-center">
              <span className={`text-[32px] font-black uppercase tracking-[0.1em] bg-gradient-to-r ${activeTheme.gradient} bg-clip-text text-transparent`}>
                #FrameInGoa
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-right font-mono">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500">PORT ENTRY</span>
              <span className="text-xl font-bold text-white uppercase tracking-[0.15em]">FEB 2026</span>
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
