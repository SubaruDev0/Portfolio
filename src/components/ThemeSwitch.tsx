'use client';

import React from 'react';
import { ThemeType } from '@/types';
import { Layout, Server, Layers, Microscope, Briefcase, Boxes, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ThemeSwitchProps {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode?: boolean;
}

const themes: { id: ThemeType; label: string; icon: any; color: string }[] = [
  { id: 'all', label: 'Todos', icon: Zap, color: 'text-amber-400' },
  { id: 'frontend', label: 'Front-end', icon: Layout, color: 'text-cyan-400' },
  { id: 'backend', label: 'Back-end', icon: Server, color: 'text-red-500' },
  { id: 'fullstack', label: 'Full-stack', icon: Layers, color: 'text-purple-500' },
  { id: 'research', label: 'Investigación', icon: Microscope, color: 'text-emerald-400' },
  { id: 'other', label: 'Otros', icon: Boxes, color: 'text-slate-400' },
];

export default function ThemeSwitch({ currentTheme, setTheme, isDarkMode = true }: ThemeSwitchProps) {
  return (
    <div className="flex justify-center mb-12 py-4">
      <div className={cn(
        "p-1 rounded-full border flex gap-2 backdrop-blur-sm self-center shadow-2xl overflow-x-auto md:overflow-visible max-w-[90vw] md:max-w-full [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
        isDarkMode ? "bg-white/5 border-white/10" : "bg-white/80 border-black/10"
      )}>
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme.id)}
            className={cn(
              "relative px-4 py-3 rounded-full text-sm font-medium transition-all flex items-center justify-center group/btn shrink-0",
              currentTheme === theme.id
                ? (isDarkMode ? "text-white w-40" : "text-slate-900 w-40")
                : (isDarkMode ? "text-gray-500 hover:text-gray-300 w-12" : "text-slate-400 hover:text-slate-700 w-12")
            )}
          >
            {currentTheme === theme.id && (
              <div
                className={cn(
                  "absolute inset-0 rounded-full animate-zoom-in animate-duration-300",
                  theme.id === 'all' && "bg-amber-500/20 border border-amber-500/50",
                  theme.id === 'frontend' && "bg-cyan-500/20 border border-cyan-500/50",
                  theme.id === 'backend' && "bg-red-500/20 border border-red-500/50",
                  theme.id === 'fullstack' && "bg-purple-500/20 border border-purple-500/50",
                  theme.id === 'research' && "bg-emerald-500/20 border border-emerald-500/50",
                  theme.id === 'other' && "bg-slate-500/20 border border-slate-500/50"
                )}
              />
            )}
            
            {/* Tooltip mejorado */}
            {currentTheme !== theme.id && (
              <span className={cn(
                "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 backdrop-blur-xl border rounded-xl text-[9px] font-bold uppercase tracking-[0.2em] opacity-0 group-hover/btn:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50 translate-y-2 group-hover/btn:translate-y-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center",
                isDarkMode ? "bg-black/95 border-white/20 text-white" : "bg-white border-black/10 text-slate-900"
              )}>
                {theme.label}
                <div className={cn(
                  "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b rotate-45",
                  isDarkMode ? "bg-[#0a0a0a] border-white/20" : "bg-white border-black/10"
                )} />
              </span>
            )}

            <theme.icon size={20} className={cn("relative z-10 transition-transform group-hover/btn:scale-110", currentTheme === theme.id ? theme.color : "opacity-50")} />
            
            {currentTheme === theme.id && (
              <span className="relative z-10 ml-2 animate-fade-in animate-duration-500 overflow-hidden whitespace-nowrap">
                {theme.label}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
