import { ThemeType } from '@/types';

export const getThemeColors = (theme: ThemeType) => {
  switch (theme) {
    case 'frontend':
      return {
        primary: 'cyan-400',
        glow: 'glow-blue',
        hex: '#00e5ff',
        text: 'text-cyan-400',
        bgGradient: 'from-cyan-500/10'
      };
    case 'backend':
      return {
        primary: 'red-500',
        glow: 'glow-red',
        hex: '#ff1744',
        text: 'text-red-500',
        bgGradient: 'from-red-500/10'
      };
    case 'fullstack':
      return {
        primary: 'purple-500',
        glow: 'glow-purple',
        hex: '#d500f9',
        text: 'text-purple-500',
        bgGradient: 'from-purple-500/10'
      };
    case 'research':
      return {
        primary: 'emerald-400',
        glow: 'glow-green',
        hex: '#10b981',
        text: 'text-emerald-400',
        bgGradient: 'from-emerald-500/10'
      };
    case 'other':
      return {
        primary: 'slate-400',
        glow: 'glow-white',
        hex: '#94a3b8',
        text: 'text-slate-400',
        bgGradient: 'from-slate-500/10'
      };
    default:
      return {
        primary: 'amber-500',
        glow: 'glow-amber',
        hex: '#f59e0b',
        text: 'text-amber-500',
        bgGradient: 'from-amber-500/10'
      };
  }
};
