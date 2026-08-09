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
    name: 'Sunset Palms',
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
    name: 'Ocean Breeze',
    gradient: 'from-ocean-start to-ocean-end',
    textGradient: 'bg-gradient-to-r from-ocean-start to-ocean-end bg-clip-text text-transparent',
    from: '#00D9F6',
    to: '#00F5A0',
    glow: 'shadow-[0_0_30px_rgba(0,217,246,0.35)]',
    borderClass: 'border-[#00D9F6]/30 focus:border-[#00D9F6]',
    accentText: 'text-[#00F5A0]',
    bgHex: '#0c1d24',
  },
  {
    id: 'purple',
    name: 'Cyber Neon',
    gradient: 'from-purple-start to-purple-end',
    textGradient: 'bg-gradient-to-r from-purple-start to-purple-end bg-clip-text text-transparent',
    from: '#00D9F6',
    to: '#8b5cf6',
    glow: 'shadow-[0_0_30px_rgba(0,217,246,0.35)]',
    borderClass: 'border-[#00D9F6]/30 focus:border-[#00D9F6]',
    accentText: 'text-[#8b5cf6]',
    bgHex: '#140c24',
  },
  {
    id: 'green',
    name: 'Tropical Goa',
    gradient: 'from-green-start to-green-end',
    textGradient: 'bg-gradient-to-r from-green-start to-green-end bg-clip-text text-transparent',
    from: '#00D26A',
    to: '#38ef7d',
    glow: 'shadow-[0_0_30px_rgba(0,210,106,0.35)]',
    borderClass: 'border-[#00D26A]/30 focus:border-[#00D26A]',
    accentText: 'text-[#38ef7d]',
    bgHex: '#0c2415',
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
