'use client';

import React from 'react';
import Link from 'next/link';
import { User, Code2, Briefcase, Mail, Download } from 'lucide-react';

interface NavbarProps {
  themeColor: string;
}

export default function Navbar({ themeColor }: NavbarProps) {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/50 backdrop-blur-md animate-slide-in-top">
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
            if (span) span.style.color = 'white';
            if (div) div.style.backgroundColor = 'white';
          }}
        >
          <div 
            className="w-8 h-8 flex items-center justify-center rounded-sm transition-all duration-500 bg-white text-black"
          >
            S
          </div>
          <span className="transition-all duration-500 text-white">SubaruDev</span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link 
            href="#sobre-mi" 
            className="transition-colors duration-300 hover:text-white"
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Sobre Mi
          </Link>
          <Link 
            href="#proyectos" 
            className="transition-colors duration-300 hover:text-white"
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Proyectos
          </Link>
          <Link 
            href="#contacto" 
            className="transition-colors duration-300 hover:text-white"
            onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
            onMouseLeave={(e) => e.currentTarget.style.color = ''}
          >
            Contacto
          </Link>
        </div>

        <button 
          className="px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-500 bg-white text-black"
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'white';
          }}
        >
          <Download size={16} />
          Descargar CV
        </button>
      </div>
    </nav>
  );
}
