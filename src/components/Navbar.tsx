'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Code2, Briefcase, Mail, Download } from 'lucide-react';

interface NavbarProps {
  themeColor: string;
  onOpenCV?: () => void;
  onContact?: () => void;
  isDarkMode?: boolean;
}

export default function Navbar({ themeColor, onOpenCV, onContact, isDarkMode = true }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 border-b backdrop-blur-md animate-slide-in-top transition-all duration-500 ${
      isScrolled 
        ? (isDarkMode ? 'border-white/10 bg-black/70 py-2 shadow-2xl' : 'border-black/5 bg-white/70 py-2 shadow-lg')
        : (isDarkMode ? 'border-white/5 bg-black py-5' : 'border-black/5 bg-white py-5')
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center transition-all duration-500">
        <Link
          href="/"
          className="text-sm md:text-xl font-bold tracking-tighter flex items-center gap-3 group"
          style={{ color: isDarkMode ? 'white' : 'black' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = themeColor)}
          onMouseLeave={(e) => (e.currentTarget.style.color = isDarkMode ? 'white' : 'black')}
        >
          <div
            className={`relative flex items-center justify-center transition-all duration-500 ${
              isScrolled ? 'w-8 h-8 md:w-12 md:h-12' : 'w-10 h-10 md:w-16 md:h-16'
            }`}
          >
            {/* Contenedor absoluto para que el SVG pueda crecer sin empujar el layout */}
            <div
              className="absolute inset-0 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 2048 959"
                className={`object-contain transform transition-all duration-500 ${
                  isScrolled ? 'w-6 h-6 md:w-9 md:h-9' : 'w-8 h-8 md:w-12 md:h-12'
                }`}
                // Forzar fill vía style para que el logo herede `currentColor` y
                // activar pointer-events sólo donde el SVG está pintado
                style={{ fill: 'currentColor', pointerEvents: 'visiblePainted' }}
                // Mover los listeners al SVG para que el hover se active solo cuando
                // el cursor esté sobre las áreas pintadas (visiblePainted)
                onMouseEnter={(e) => {
                  const link = (e.currentTarget as unknown as Element).closest('a');
                  if (link) (link as HTMLElement).style.color = themeColor;
                }}
                onMouseLeave={(e) => {
                  const link = (e.currentTarget as unknown as Element).closest('a');
                  if (link) (link as HTMLElement).style.color = isDarkMode ? 'white' : 'black';
                }}
                dangerouslySetInnerHTML={{ __html: `
<g>
  <path fill="currentColor" stroke="none" d="M 446 70 L 123 400 Q 112 412 106 429 L 102 442 L 101 453 L 100 454 L 100 481 L 103 497 Q 109 517 121 532 L 444 854 L 688 854 L 688 853 L 301 467 L 688 71 L 446 70 Z M 923 70 L 920 76 L 920 81 L 917 92 L 914 112 L 908 132 Q 899 156 883 175 Q 872 188 857 196 L 825 208 Q 822 209 823 214 L 830 217 L 851 224 L 873 238 Q 894 257 906 287 L 914 312 L 921 352 L 925 353 L 927 348 L 927 343 L 933 312 L 939 292 Q 948 267 964 249 Q 974 236 989 228 Q 1004 220 1023 215 Q 1025 214 1024 210 L 991 196 L 974 184 Q 953 165 941 137 L 933 112 L 926 72 L 923 70 Z M 1361 70 L 1379 91 L 1747 466 L 1360 854 L 1605 854 L 1927 532 Q 1937 519 1943 503 L 1947 489 L 1948 473 L 1949 472 L 1948 451 L 1945 437 Q 1939 416 1927 402 L 1608 76 L 1603 70 L 1361 70 Z M 1225 185 L 1222 189 L 1208 267 L 1197 305 Q 1179 356 1147 394 Q 1125 420 1094 438 L 1075 447 L 1027 464 Q 1022 466 1024 474 L 1027 476 L 1080 495 Q 1104 506 1124 523 Q 1164 558 1187 611 L 1197 636 L 1205 662 L 1223 754 Q 1224 756 1229 755 L 1231 752 L 1237 715 L 1240 704 L 1240 699 L 1248 662 L 1263 618 Q 1273 594 1286 574 L 1301 553 L 1317 536 L 1317 534 L 1319 534 L 1336 518 L 1358 503 L 1384 491 L 1427 476 Q 1431 474 1429 467 L 1422 462 L 1372 444 Q 1348 433 1330 417 Q 1289 382 1266 330 L 1256 305 L 1248 279 L 1230 187 Q 1229 184 1225 185 Z M 752 334 L 747 365 L 743 379 Q 736 398 724 413 Q 716 422 705 429 L 680 439 L 678 439 L 678 444 L 699 451 L 715 461 Q 730 474 739 495 L 746 515 L 752 545 Q 750 551 756 549 L 761 519 L 765 505 Q 772 485 784 471 Q 792 461 804 454 L 829 444 L 830 444 L 830 439 L 810 432 L 794 422 Q 778 409 769 389 L 763 373 L 756 339 Q 758 332 752 334 Z M 774 613 L 783 625 L 888 735 L 773 854 L 774 855 L 847 855 L 943 756 L 949 743 L 949 728 L 943 715 L 849 616 L 847 613 L 774 613 Z M 987 801 L 987 855 L 988 855 L 1249 855 L 1249 802 L 1249 801 L 987 801 Z" />
  <path fill="currentColor" stroke="none" d="M 687.5 70 L 667.5 91 L 687.5 70 Z" opacity="0.7843" />
  <path fill="currentColor" stroke="none" d="M 1601.5 70 L 1613.5 83 L 1601.5 70 Z" opacity="0.7843" />
  <path fill="currentColor" stroke="none" d="M 444.5 72 L 421.5 96 L 444.5 72 Z" opacity="0.7843" />
  <path fill="currentColor" stroke="none" d="M 1374.5 84 L 1397.5 108 L 1374.5 84 Z" opacity="0.7843" />
</g>
` }}
                />
            </div>
          </div>
          <span className={`transition-all duration-500 logo-text text-current font-black ${
            isScrolled ? 'text-xs md:text-lg' : 'text-sm md:text-xl'
          } truncate`}>SubaruDev</span>
        </Link>
        
        <div className={`hidden md:flex items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
          isDarkMode ? 'text-white' : 'text-black'
        }`}>
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
          {onContact ? (
            <button
              onClick={onContact}
              className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
            >
              Contacto
            </button>
          ) : (
            <Link 
              href="#contacto" 
              className={`transition-colors duration-300 ${isDarkMode ? 'hover:text-white' : 'hover:text-black'}`}
              onMouseEnter={(e) => e.currentTarget.style.color = themeColor}
              onMouseLeave={(e) => e.currentTarget.style.color = ''}
            >
              Contacto
            </Link>
          )}
        </div>

        <button 
          onClick={onOpenCV}
          className={`rounded-full text-xs md:text-sm font-black flex items-center gap-2 transition-all duration-500 hover:scale-105 active:scale-95 ${
            isScrolled ? 'px-4 py-2' : 'px-6 py-3'
          } ${
            isDarkMode ? 'bg-white text-black shadow-lg shadow-white/5' : 'bg-black text-white shadow-lg shadow-black/5'
          }`}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = themeColor;
            e.currentTarget.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isDarkMode ? 'white' : 'black';
            e.currentTarget.style.color = isDarkMode ? 'black' : 'white';
          }}
        >
          <Download size={isScrolled ? 14 : 18} />
          <span className="hidden sm:inline">Descargar CV</span>
          <span className="sm:hidden">CV</span>
        </button>
      </div>
    </nav>
  );
}
