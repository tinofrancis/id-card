export interface Theme {
  id: 'tropic' | 'sunset' | 'matrix' | 'synthwave' | 'midnight' | 'holo' | 'antigravity';
  name: string;
  gradient: string;
  textGradient: string;
  from: string;
  to: string;
  glow: string;
  borderClass: string;
  accentText: string;
  bgHex: string;
}

export const THEMES: Theme[] = [
  {
    id: 'antigravity',
    name: 'Antigravity Space',
    gradient: 'from-[#00F2FE] via-[#7303c0] to-[#FF007A]',
    textGradient: 'bg-gradient-to-r from-[#00F2FE] to-[#FF007A] bg-clip-text text-transparent',
    from: '#00F2FE',
    to: '#FF007A',
    glow: 'shadow-[0_0_30px_rgba(0,242,254,0.45)]',
    borderClass: 'border-[#00F2FE]/30 focus:border-[#00F2FE]',
    accentText: 'text-[#00F2FE]',
    bgHex: '#03001e',
  },
  {
    id: 'tropic',
    name: 'Goa Tropic',
    gradient: 'from-[#0A6B48] to-[#00FF66]',
    textGradient: 'bg-gradient-to-r from-[#0A6B48] to-[#00FF66] bg-clip-text text-transparent',
    from: '#0A6B48',
    to: '#00FF66',
    glow: 'shadow-[0_0_30px_rgba(0,255,102,0.35)]',
    borderClass: 'border-[#00FF66]/30 focus:border-[#00FF66]',
    accentText: 'text-[#00FF66]',
    bgHex: '#091c12',
  },
  {
    id: 'sunset',
    name: 'Sunset Pop-Art',
    gradient: 'from-[#FF5E62] via-[#FFE600] to-[#FF5E62]',
    textGradient: 'bg-gradient-to-r from-[#FF5E62] via-[#FFE600] to-[#FF5E62] bg-clip-text text-transparent',
    from: '#FF5E62',
    to: '#FFE600',
    glow: 'shadow-[0_0_30px_rgba(255,94,98,0.35)]',
    borderClass: 'border-[#FFE600]/30 focus:border-[#FFE600]',
    accentText: 'text-[#FFE600]',
    bgHex: '#1e0e0e',
  },
  {
    id: 'matrix',
    name: 'Cyber Matrix',
    gradient: 'from-[#00FF66] to-[#070d10]',
    textGradient: 'bg-gradient-to-r from-[#00FF66] to-[#070d10] bg-clip-text text-transparent',
    from: '#00FF66',
    to: '#070d10',
    glow: 'shadow-[0_0_30px_rgba(0,255,102,0.35)]', // wait, let's keep original values
    borderClass: 'border-[#00FF66]/30 focus:border-[#00FF66]',
    accentText: 'text-[#00FF66]',
    bgHex: '#070b10',
  },
  {
    id: 'synthwave',
    name: 'Synthwave Neon',
    gradient: 'from-[#FF007A] via-[#8b5cf6] to-[#00D9F6]',
    textGradient: 'bg-gradient-to-r from-[#FF007A] via-[#8b5cf6] to-[#00D9F6] bg-clip-text text-transparent',
    from: '#FF007A',
    to: '#00D9F6',
    glow: 'shadow-[0_0_30px_rgba(255,0,122,0.35)]',
    borderClass: 'border-[#FF007A]/30 focus:border-[#FF007A]',
    accentText: 'text-[#FF007A]',
    bgHex: '#1a072b',
  },
  {
    id: 'midnight',
    name: 'Midnight Hacker',
    gradient: 'from-[#111827] to-[#00FF66]',
    textGradient: 'bg-gradient-to-r from-[#111827] to-[#00FF66] bg-clip-text text-transparent',
    from: '#111827',
    to: '#00FF66',
    glow: 'shadow-[0_0_30px_rgba(0,255,102,0.2)]',
    borderClass: 'border-white/10 focus:border-white/20',
    accentText: 'text-[#00FF66]',
    bgHex: '#0f172a',
  },
  {
    id: 'holo',
    name: 'Holographic Platinum 💎',
    gradient: 'from-[#cbd5e1] via-[#ffffff] to-[#94a3b8]',
    textGradient: 'bg-gradient-to-r from-[#cbd5e1] via-[#ffffff] to-[#94a3b8] bg-clip-text text-transparent',
    from: '#cbd5e1',
    to: '#ffffff',
    glow: 'shadow-[0_0_30px_rgba(255,255,255,0.25)]',
    borderClass: 'border-white/20 focus:border-white',
    accentText: 'text-white',
    bgHex: '#1e293b',
  },
];

export const ROLES = [
  'Frontend',
  'Backend',
  'AI Engineer',
  'ML Engineer',
  'Designer',
  'Founder',
  'Student',
  'Product Builder',
];

export const BUILDER_TITLES = [
  'Prompt Pirate',
  'Pixel Alchemist',
  'API Whisperer',
  'Bug Hunter',
  'Stack Overflow Survivor',
  'Code Ninja',
  'Late Night Hacker',
  'Ship-It Specialist',
  'AI Explorer',
  'Innovation Machine',
];
