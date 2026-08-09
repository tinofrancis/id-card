export interface Theme {
  id: 'sunset' | 'ocean' | 'purple' | 'green';
  name: string;
  gradient: string; // Tailwind class for gradients
  textGradient: string; // Tailwind class for text gradients
  from: string; // Hex color from
  to: string; // Hex color to
  glow: string; // Tailwind class for neon glow shadows
  borderClass: string; // Tailwind class for tinted borders
  accentText: string; // Tailwind class for text highlights
  bgHex: string; // Solid dark background for text cards
}

export const THEMES: Theme[] = [
  {
    id: 'sunset',
    name: 'HH Goa',
    gradient: 'from-sunset-start to-sunset-end',
    textGradient: 'bg-gradient-to-r from-sunset-start to-sunset-end bg-clip-text text-transparent',
    from: '#ff5e62',
    to: '#ff9966',
    glow: 'shadow-[0_0_30px_rgba(255,94,98,0.35)]',
    borderClass: 'border-[#ff5e62]/30 focus:border-[#ff5e62]',
    accentText: 'text-[#ff9966]',
    bgHex: '#1e1111',
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    gradient: 'from-ocean-start to-ocean-end',
    textGradient: 'bg-gradient-to-r from-ocean-start to-ocean-end bg-clip-text text-transparent',
    from: '#00c6ff',
    to: '#0072ff',
    glow: 'shadow-[0_0_30px_rgba(0,198,255,0.35)]',
    borderClass: 'border-[#00c6ff]/30 focus:border-[#00c6ff]',
    accentText: 'text-[#00c6ff]',
    bgHex: '#111a2e',
  },
  {
    id: 'purple',
    name: 'Neon Purple',
    gradient: 'from-purple-start to-purple-end',
    textGradient: 'bg-gradient-to-r from-purple-start to-purple-end bg-clip-text text-transparent',
    from: '#d946ef',
    to: '#8b5cf6',
    glow: 'shadow-[0_0_30px_rgba(217,70,239,0.35)]',
    borderClass: 'border-[#d946ef]/30 focus:border-[#d946ef]',
    accentText: 'text-[#d946ef]',
    bgHex: '#1b112e',
  },
  {
    id: 'green',
    name: 'Tropical Green',
    gradient: 'from-green-start to-green-end',
    textGradient: 'bg-gradient-to-r from-green-start to-green-end bg-clip-text text-transparent',
    from: '#11998e',
    to: '#38ef7d',
    glow: 'shadow-[0_0_30px_rgba(17,153,142,0.35)]',
    borderClass: 'border-[#11998e]/30 focus:border-[#11998e]',
    accentText: 'text-[#38ef7d]',
    bgHex: '#11221a',
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
