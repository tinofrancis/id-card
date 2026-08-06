'use client';

import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '@/utils/cropImage';
import { ZoomIn, ZoomOut, X, Crop } from 'lucide-react';

interface CropModalProps {
  imageSrc: string;
  onCropComplete: (croppedImageSrc: string) => void;
  onCancel: () => void;
}

export default function CropModal({ imageSrc, onCropComplete, onCancel }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);

  const onCropChange = (crop: { x: number; y: number }) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom: number) => {
    setZoom(zoom);
  };

  const onCropAreaComplete = (_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;
    setIsCropping(true);
    try {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    } catch (e) {
      console.error(e);
    } finally {
      setIsCropping(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex w-full max-w-lg flex-col rounded-2xl border border-white/10 bg-slate-900 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <h3 className="font-display text-base font-semibold text-white">Adjust Photo</h3>
          <button
            onClick={onCancel}
            className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cropper viewport */}
        <div className="relative h-[340px] w-full bg-slate-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropAreaComplete}
          />
        </div>

        {/* Controls */}
        <div className="flex flex-col gap-5 border-t border-white/5 px-6 py-5 bg-slate-900/50">
          {/* Zoom Slider */}
          <div className="flex items-center gap-4">
            <ZoomOut className="h-4 w-4 text-slate-400" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/10 accent-[#ff5e62]"
            />
            <ZoomIn className="h-4 w-4 text-slate-400" />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 hover:text-white transition-all duration-200"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveCrop}
              disabled={isCropping}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sunset-start to-sunset-end px-5 py-2.5 text-xs font-semibold text-white hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-55"
            >
              {isCropping ? 'Cropping...' : (
                <>
                  <Crop className="h-3.5 w-3.5" />
                  <span>Apply Crop</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
