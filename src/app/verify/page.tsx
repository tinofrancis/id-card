'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ShieldCheck, Compass, Sparkles, UserCheck, ArrowRight, Loader2 } from 'lucide-react';
import { THEMES } from '@/utils/constants';
import PalmLeafSVG from '@/components/PalmLeafSVG';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const id = searchParams.get('id') || '';
  const urlName = searchParams.get('name') || 'BUILDER';
  const urlRole = searchParams.get('role') || 'Hacker';
  const urlTitle = searchParams.get('title') || 'Verified Builder';
  const urlTheme = searchParams.get('theme') || 'sunset';

  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<{
    name: string;
    role: string;
    title: string;
    theme: string;
    image: string | null;
    timestamp?: string;
  } | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`/api/verify?id=${id}`);
        const result = await res.json();
        if (result.success && result.data) {
          setProfileData(result.data);
        }
      } catch (err) {
        console.error('Failed to load profile from API:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  // Resolve theme styles dynamically
  const activeThemeId = profileData?.theme || urlTheme;
  const activeTheme = THEMES.find((t) => t.id === activeThemeId) || THEMES[0];

  const displayName = profileData?.name || urlName;
  const displayRole = profileData?.role || urlRole;
  const displayTitle = profileData?.title || urlTitle;
  const displayImage = profileData?.image;
  const displayTimestamp = profileData?.timestamp || 'FEB 2026';

  return (
    <div className="min-h-screen flex flex-col justify-between overflow-x-hidden bg-[#020617] text-slate-100 font-sans relative">
      
      {/* Background Neon Blobs adapting to card theme */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-15%] w-[65vw] h-[65vw] rounded-full opacity-[0.22] blur-[120px] animate-orbit-1" 
          style={{ background: `radial-gradient(circle, ${activeTheme.from} 0%, ${activeTheme.to} 100%)` }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-15%] w-[60vw] h-[60vw] rounded-full opacity-[0.18] blur-[120px] animate-orbit-2 [animation-delay:2.5s]" 
          style={{ background: `radial-gradient(circle, ${activeTheme.to} 0%, ${activeTheme.from} 100%)` }}
        />
        <div className="absolute inset-0 opacity-[0.06] digital-grid" />
        
        {/* Palm Leaves */}
        <div className="absolute top-48 -left-12 w-44 h-44 text-emerald-500/5 rotate-[25deg] animate-float-slow">
          <PalmLeafSVG className="w-full h-full" />
        </div>
        <div className="absolute bottom-40 -right-12 w-48 h-48 text-[#ff5e62]/5 -rotate-[35deg] animate-float-medium">
          <PalmLeafSVG className="w-full h-full" />
        </div>
      </div>

      {/* Header logo */}
      <header className="relative z-10 w-full border-b border-white/5 bg-slate-950/40 backdrop-blur-md py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <img src="/studio-logo.png" alt="Studio Logo" className="h-7 w-12 object-contain" />
          </div>
          <div className="flex items-center">
            <img src="/hacker-house-logo.png" alt="Hacker House Logo" className="h-6 w-24 object-contain" />
          </div>
        </div>
      </header>

      {/* Main Validation Frame */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        {loading ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="h-10 w-10 animate-spin text-[#ff7a50]" />
            <p className="text-sm font-mono tracking-widest uppercase">Verifying Digital Badge...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-950/70 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden"
          >
            {/* Holographic light accent reflections */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none z-10" />

            {/* Glowing System Check Indicator */}
            <div className="flex flex-col items-center mb-6">
              <div className={`h-16 w-16 rounded-full bg-gradient-to-tr ${activeTheme.gradient} p-0.5 shadow-lg ${activeTheme.glow} animate-pulse flex items-center justify-center mb-3`}>
                <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                  <ShieldCheck className={`h-8 w-8 text-white ${activeTheme.accentText}`} />
                </div>
              </div>
              <span className="text-[10px] font-mono tracking-[0.3em] text-slate-500 uppercase">Verification System</span>
              <h2 className="text-lg font-display font-black tracking-widest text-white uppercase mt-1">
                Verified Builder
              </h2>
            </div>

            {/* Profile Card Section */}
            <div className="border border-white/5 bg-slate-900/40 rounded-2xl p-5 mb-6 relative">
              <div className="absolute inset-0 opacity-[0.03] digital-grid pointer-events-none rounded-2xl" />
              
              {/* Picture Area */}
              <div className="flex justify-center mb-4">
                <div className={`p-[3px] rounded-full bg-gradient-to-tr ${activeTheme.gradient}`}>
                  <div className="h-28 w-28 rounded-full overflow-hidden bg-slate-950 flex items-center justify-center">
                    {displayImage ? (
                      <img src={displayImage} alt={displayName} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-slate-500">
                        <UserCheck className="h-8 w-8 text-slate-400" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Builder Info */}
              <div className="text-center">
                <h3 className="font-display font-black text-xl text-white tracking-wide uppercase truncate">
                  {displayName}
                </h3>
                
                <span className={`inline-block mt-1 text-[10px] font-bold uppercase tracking-widest px-3 py-0.5 rounded-full border ${activeTheme.borderClass} bg-slate-950/80 text-slate-300`}>
                  {displayRole}
                </span>

                <div className="mt-4 border-t border-white/5 pt-3 text-center">
                  <span className="text-[7px] text-slate-500 font-bold uppercase tracking-widest block mb-0.5">Title Claimed</span>
                  <span className={`font-display text-sm font-black uppercase tracking-wider ${activeTheme.accentText}`}>
                    {displayTitle}
                  </span>
                </div>
              </div>
            </div>

            {/* System Info Markers */}
            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-4 text-xs font-mono text-slate-400">
              <div className="flex flex-col gap-0.5">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest">Serial Number</span>
                <span className="text-[10px] text-white">#GOA-{id || 'VERIFIED'}</span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest">Entry Date</span>
                <span className="text-[10px] text-white">{displayTimestamp}</span>
              </div>
              <div className="flex flex-col gap-0.5 mt-1 col-span-2 text-center">
                <span className="text-[7px] text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
                  <Compass className="h-3 w-3 animate-spin [animation-duration:20s]" />
                  Coordinates
                </span>
                <span className="text-[10px] text-white tracking-widest">15.4967° N, 73.8278° E</span>
              </div>
            </div>

            {/* Viral CTA Button */}
            <div className="mt-8">
              <button
                onClick={() => router.push('/')}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sunset-start via-[#ff7a50] to-sunset-end py-3 px-6 text-xs font-bold text-white shadow-lg shadow-sunset-start/10 hover:shadow-sunset-start/25 transition-all duration-300 active:scale-[0.96] cursor-pointer"
              >
                <span>Generate Your Own Pass</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 border-t border-white/5 bg-black text-center text-xs text-slate-500">
        <p>© 2026 HH GOA Builder Studio • 2:47PM Studio</p>
      </footer>
    </div>
  );
}

function LoadingVerify() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] text-slate-400">
      <Loader2 className="h-10 w-10 animate-spin text-[#ff7a50]" />
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<LoadingVerify />}>
      <VerifyContent />
    </Suspense>
  );
}
