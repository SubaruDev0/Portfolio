'use client';

import React from 'react';
import { ThemeType } from '@/types';
import { Layout, Server, Layers, Microscope, Boxes, Zap } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useI18n } from '@/i18n/context';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ThemeSwitchProps {
  currentTheme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode?: boolean;
}

const themes: { id: ThemeType; icon: any; color: string }[] = [
  { id: 'all',       icon: Zap,        color: 'text-amber-400'  },
  { id: 'frontend',  icon: Layout,     color: 'text-cyan-400'   },
  { id: 'backend',   icon: Server,     color: 'text-red-500'    },
  { id: 'fullstack', icon: Layers,     color: 'text-purple-500' },
  { id: 'research',  icon: Microscope, color: 'text-emerald-400'},
  { id: 'other',     icon: Boxes,      color: 'text-slate-400'  },
];

export default function ThemeSwitch({ currentTheme, setTheme, isDarkMode = true }: ThemeSwitchProps) {
  const { dictionary } = useI18n();

  return (
    <div className="flex justify-center mb-12 py-4">
      <div className={cn(
        "p-1 rounded-full border flex gap-1 backdrop-blur-sm shadow-2xl overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden max-w-[92vw]",
        isDarkMode ? "bg-white/5 border-white/10" : "bg-white/80 border-black/10"
      )}>
        {themes.map((theme) => {
          const label = dictionary.themeSwitch[theme.id];
          const active = currentTheme === theme.id;

          return (
            <button
              key={theme.id}
              onClick={() => setTheme(theme.id)}
              className={cn(
                // ← clave: w-auto en vez de w-40, con transición de max-width
                "relative flex items-center justify-center gap-2 rounded-full text-sm font-medium transition-all duration-300 shrink-0 group/btn",
                // padding horizontal consistente
                "px-3 py-2.5",
                // ancho: se expande suavemente al activarse
                active ? "max-w-[140px]" : "max-w-[44px] w-[44px]",
                active
                  ? (isDarkMode ? "text-white" : "text-slate-900")
                  : (isDarkMode ? "text-gray-500 hover:text-gray-300" : "text-slate-400 hover:text-slate-700")
              )}
            >
              {/* Fondo activo */}
              {active && (
                <div className={cn(
                  "absolute inset-0 rounded-full animate-zoom-in animate-duration-300",
                  theme.id === 'all'       && "bg-amber-500/20   border border-amber-500/50",
                  theme.id === 'frontend'  && "bg-cyan-500/20    border border-cyan-500/50",
                  theme.id === 'backend'   && "bg-red-500/20     border border-red-500/50",
                  theme.id === 'fullstack' && "bg-purple-500/20  border border-purple-500/50",
                  theme.id === 'research'  && "bg-emerald-500/20 border border-emerald-500/50",
                  theme.id === 'other'     && "bg-slate-500/20   border border-slate-500/50",
                )} />
              )}

              {/* Tooltip (solo inactivos) */}
              {!active && (
                <span className={cn(
                  "absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 backdrop-blur-xl border rounded-xl",
                  "text-[9px] font-bold uppercase tracking-[0.2em] whitespace-nowrap z-50 pointer-events-none",
                  "opacity-0 translate-y-2 group-hover/btn:opacity-100 group-hover/btn:translate-y-0",
                  "transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]",
                  isDarkMode ? "bg-black/95 border-white/20 text-white" : "bg-white border-black/10 text-slate-900"
                )}>
                  {label}
                  <div className={cn(
                    "absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-r border-b rotate-45",
                    isDarkMode ? "bg-[#0a0a0a] border-white/20" : "bg-white border-black/10"
                  )} />
                </span>
              )}

              {/* Ícono */}
              <theme.icon
                size={18}
                className={cn(
                  "relative z-10 shrink-0 transition-transform group-hover/btn:scale-110",
                  active ? theme.color : "opacity-50"
                )}
              />

              {/* Label (solo activo) */}
              {active && (
                <span className="relative z-10 text-xs font-bold tracking-wide truncate animate-fade-in animate-duration-500">
                  {label}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}