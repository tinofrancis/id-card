export interface Theme {
  id: 'green' | 'sunset' | 'hacker' | 'purple';
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
    id: 'green',
    name: 'Goa Shack Pop-Art 🌴',
    gradient: 'from-[#0A6B48] via-[#FFE600] to-[#FF007A]',
    textGradient: 'bg-gradient-to-r from-[#0A6B48] via-[#FFE600] to-[#FF007A] bg-clip-text text-transparent',
    from: '#0A6B48',
    to: '#FF007A',
    glow: 'shadow-[0_0_30px_rgba(255,0,122,0.35)]',
    borderClass: 'border-[#FFE600]/30 focus:border-[#FFE600]',
    accentText: 'text-[#FFE600]',
    bgHex: '#0a2215',
  },
  {
    id: 'sunset',
    name: 'Sunset Palms 🌅',
    gradient: 'from-[#FF5E62] via-[#FFE600] to-[#0f172a]',
    textGradient: 'bg-gradient-to-r from-[#FF5E62] via-[#FFE600] to-[#0f172a] bg-clip-text text-transparent',
    from: '#FF5E62',
    to: '#FFE600',
    glow: 'shadow-[0_0_30px_rgba(255,94,98,0.35)]',
    borderClass: 'border-[#FFE600]/30 focus:border-[#FFE600]',
    accentText: 'text-[#FFE600]',
    bgHex: '#1e1111',
  },
  {
    id: 'hacker',
    name: 'Cyber Matrix ⚡',
    gradient: 'from-[#00FF66] to-[#070d10]',
    textGradient: 'bg-gradient-to-r from-[#00FF66] to-[#070d10] bg-clip-text text-transparent',
    from: '#00FF66',
    to: '#070d10',
    glow: 'shadow-[0_0_30px_rgba(0,255,102,0.3)]',
    borderClass: 'border-[#00FF66]/30 focus:border-[#00FF66]',
    accentText: 'text-[#00FF66]',
    bgHex: '#070b10',
  },
  {
    id: 'purple',
    name: 'Pink Devanagari 🪩',
    gradient: 'from-[#FF007A] to-[#cbd5e1]',
    textGradient: 'bg-gradient-to-r from-[#FF007A] to-[#cbd5e1] bg-clip-text text-transparent',
    from: '#FF007A',
    to: '#cbd5e1',
    glow: 'shadow-[0_0_30px_rgba(255,0,122,0.35)]',
    borderClass: 'border-[#FF007A]/30 focus:border-[#FF007A]',
    accentText: 'text-[#FF007A]',
    bgHex: '#140c24',
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
