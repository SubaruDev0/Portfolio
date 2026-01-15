'use client';

import React from 'react';
import Link from 'next/link';
import { User, Code2, Briefcase, Mail, Download } from 'lucide-react';

interface NavbarProps {
  themeColor: string;
  onOpenCV?: () => void;
  isDarkMode?: boolean;
}

export default function Navbar({ themeColor, onOpenCV, isDarkMode = true }: NavbarProps) {
  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md animate-slide-in-top transition-colors duration-700 ${
      isDarkMode 
        ? 'border-white/10 bg-black/50' 
        : 'border-black/5 bg-white/50'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link 
          href="/" 
          className="text-xl font-bold tracking-tighter flex items-center gap-2 group"
          onMouseEnter={(e) => {
            const span = e.currentTarget.querySelector('span');
            const div = e.currentTarget.querySelector('div');
            if (span) span.style.color = themeColor;
            if (div) div.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            const span = e.currentTarget.querySelector('span');
            const div = e.currentTarget.querySelector('div');
            if (span) span.style.color = isDarkMode ? 'white' : 'black';
            if (div) div.style.backgroundColor = isDarkMode ? 'white' : 'black';
          }}
        >
          <div 
            className={`w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-500 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            S
          </div>
          <span className={`transition-all duration-500 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SubaruDev</span>
        </Link>
        
        <div className={`hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-gray-400' : 'text-slate-900'}`}>
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`transition-colors duration-300 uppercase ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Inicio
          </button>
          <Link 
            href="#proyectos-anchor" 
            className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Proyectos
          </Link>
          <Link 
            href="#sobre-mi" 
            className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Sobre Mí
          </Link>
          <Link 
            href="#certificaciones-anchor" 
            className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Certificados
          </Link>
          <Link 
            href="#contacto" 
            className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Contacto
          </Link>
        </div>

        <button 
          onClick={onOpenCV}
          className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-500 hover:scale-105 active:scale-95 ${
            isDarkMode ? 'bg-white text-black' : 'bg-black text-white'
          }`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
            e.currentTarget.style.color = 'black';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? 'white' : 'black';
            e.currentTarget.style.color = isDarkMode ? 'black' : 'white';
          }}
        >
          <Download size={16} />
          Descargar CV
        </button>
      </div>
    </nav>
  );
}
