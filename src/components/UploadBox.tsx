'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { convertHeicToJpeg } from '@/utils/heic';
import { motion } from 'framer-motion';

interface UploadBoxProps {
  onImageSelected: (imageSrc: string) => void;
}

export default function UploadBox({ onImageSelected }: UploadBoxProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    setIsProcessing(true);
    setError(null);

    try {
      let imageBlob: Blob = file;

      // Check if file is HEIC / HEIF
      const isHeic = 
        file.name.toLowerCase().endsWith('.heic') || 
        file.name.toLowerCase().endsWith('.heif') || 
        file.type === 'image/heic' || 
        file.type === 'image/heif';

      if (isHeic) {
        imageBlob = await convertHeicToJpeg(file);
      }

      // Convert Blob to Data URL for cropping
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onImageSelected(reader.result);
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setError('Error reading file contents');
        setIsProcessing(false);
      };
      reader.readAsDataURL(imageBlob);
    } catch (err: any) {
      console.error('File processing error:', err);
      setError(err?.message || 'Failed to process image. Try a PNG or JPEG file.');
      setIsProcessing(false);
    }
  }, [onImageSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/heic': ['.heic'],
      'image/heif': ['.heif'],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="w-full">
      <div {...getRootProps()} className="outline-none cursor-pointer">
        <motion.div
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.985 }}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-300 min-h-[220px] ${
            isDragActive
              ? 'border-[#ff5e62] bg-[#ff5e62]/8 shadow-[0_0_25px_rgba(255,94,98,0.25)] scale-[1.02]'
              : 'border-slate-200 dark:border-white/10 bg-slate-50/50 dark:bg-slate-900/40 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-100/50 dark:hover:bg-slate-900/60'
          } ${isProcessing ? 'pointer-events-none opacity-80' : ''}`}
        >
          <input {...getInputProps()} />

          {isProcessing ? (
            <div className="flex flex-col items-center gap-3 animate-pulse">
              <Loader2 className="h-10 w-10 text-[#ff5e62] animate-spin" />
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">Converting Image format...</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">iOS HEIC conversion is happening locally</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform duration-300 text-xl">
                🌴
              </div>
              
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-white">
                  {isDragActive ? 'Drop your photo here' : 'Drag & drop your photo, or click to upload'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 max-w-[280px] leading-relaxed mx-auto">
                  Supports PNG, JPEG, WEBP, and iPhone HEIC photos
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {error && (
        <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-xs text-red-400 text-center animate-fade-in">
          {error}
        </div>
      )}
    </div>
  );
}
