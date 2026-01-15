'use client';

import React, { useState } from 'react';
import { Flame, Briefcase, Star } from 'lucide-react';

interface TechBadgeProps {
  name: string;
  showName?: boolean;
  className?: string;
  variant?: 'default' | 'small';
  isDarkMode?: boolean;
}

/**
 * Mapeo de nombres comunes a slugs de Simple Icons
 */
const techMap: Record<string, string> = {
  'React': 'react',
  'Next.js': 'nextdotjs',
  'Nextjs': 'nextdotjs',
  'Tailwind': 'tailwindcss',
  'TailwindCSS': 'tailwindcss',
  'Node.js': 'nodedotjs',
  'Nodejs': 'nodedotjs',
  'Typescript': 'typescript',
  'Javascript': 'javascript',
  'Python': 'python',
  'Django': 'django',
  'PostgreSQL': 'postgresql',
  'Postgres': 'postgresql',
  'C': 'c',
  'Bioinformatics': 'bioconda',
  'Docker': 'docker',
  'GitHub': 'github',
  'Vercel': 'vercel',
  'Recharts': 'recharts',
  'D3.js': 'd3dotjs',
  'HPC': 'nvidianvlink',
  'GDB': 'gnubash',
  'Valgrind': 'linux',
  'Biopython': 'python',
  'C++': 'cplusplus',
  'C#': 'csharp',
  'Java': 'oracle',
  'Spring': 'spring',
  'MySQL': 'mysql',
  'MongoDB': 'mongodb',
  'Redis': 'redis',
  'AWS': 'amazonaws',
  'Google Cloud': 'googlecloud',
  'Azure': 'microsoftazure',
  'Figma': 'figma',
  'Adobe UI': 'adobe',
  'Udemy': 'udemy',
  'Coursera': 'coursera',
  'LinkedIn': 'linkedin',
  'USS': 'uss',
  'USS Concepción': 'uss',
  'Universidad San Sebastián': 'uss',
  'Videojuego': 'gamepad',
  'Videojuegos': 'gamepad',
  'Game Dev': 'unity',
  'frontend': 'react',
  'backend': 'nodedotjs',
  'fullstack': 'nextdotjs',
  'research': 'googlescholar',
  'other': 'codeforces',
  'API': 'postman',
  'REST API': 'postman',
  'GraphQL': 'graphql',
  'Microservicios': 'kubernetes',
  'Producción': 'briefcase',
  'Claude': 'anthropic',
  'Godot Engine': 'godotengine',
  'Moodle': 'moodle',
  'OpenStreetMap': 'openstreetmap',
  'Pandas': 'pandas',
  'Streamlit': 'streamlit',
  'Análisis de Virus': 'cyberdefenders',
  'Ingeniería Inversa': 'rotaryinternational',
  'Algoritmos': 'codeforces',
  'Seguridad': 'fsecure',
  'Virus': 'bitdefender',
  'Reverse Engineering': 'metasploit',
};

export default function TechBadge({ 
  name: rawName, 
  showName = true, 
  className = "", 
  variant = 'default',
  isDarkMode = true
}: TechBadgeProps) {
  const [error, setError] = useState(false);
  
  let displayName = rawName;
  let customSlug = "";
  
  if (rawName.includes(':')) {
    // Si hay múltiples colones, el último es el slug, el resto es el nombre
    const lastColonIndex = rawName.lastIndexOf(':');
    displayName = rawName.substring(0, lastColonIndex).trim();
    customSlug = rawName.substring(lastColonIndex + 1).trim();
  }

  // Limpieza de caracteres especiales para slugs automáticos
  const cleanForSlug = (str: string) => {
    return str.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Quitar acentos
      .replace(/[^a-z0-9]/g, "");    // Quedarse solo con alfanuméricos
  };

  const normalizedName = displayName.charAt(0).toUpperCase() + displayName.slice(1).toLowerCase();
  
  // Búsqueda insensible a mayúsculas en el mapa
  const getSlugFromName = (name: string) => {
    const lowerName = name.toLowerCase();
    for (const [key, value] of Object.entries(techMap)) {
      if (key.toLowerCase() === lowerName) return value;
    }
    return null;
  };

  const slug = customSlug || getSlugFromName(displayName) || getSlugFromName(normalizedName) || cleanForSlug(displayName);
  
  // Casos especiales para logos locales o externos específicos
  let iconUrl = `https://cdn.simpleicons.org/${slug}/${isDarkMode ? 'white' : 'black'}`;

  if (displayName.toLowerCase() === 'java') {
    iconUrl = "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg";
  } else if (displayName.toLowerCase() === 'videojuego' || displayName.toLowerCase() === 'videojuegos') {
    iconUrl = "https://raw.githubusercontent.com/devicons/devicon/master/icons/unity/unity-original.svg";
  } else if (displayName.toLowerCase() === 'producción' || displayName.toLowerCase() === 'destacados') {
    iconUrl = ""; // Usaremos Lucide en este caso especial
  } else if (slug === 'uss') {
    iconUrl = "/logos/Logo_Universidad_san_sebastian.png";
  }

  const isSmall = variant === 'small';

  return (
    <div 
      className={`flex items-center gap-2 ${isSmall ? 'px-2 py-1' : 'px-3 py-2'} backdrop-blur-md border rounded-xl group/tech transition-all duration-700 cursor-default relative ${className} ${
        isDarkMode 
          ? 'bg-black/60 border-white/10 hover:border-white/40 hover:!bg-black group-hover:bg-black/80' 
          : 'bg-white/60 border-black/10 hover:border-black/20 hover:!bg-white group-hover:bg-white/80 shadow-sm'
      }`}
    >
      <div className={`${isSmall ? 'w-4 h-4' : 'w-5 h-5'} flex items-center justify-center opacity-100 group-hover/tech:scale-110 transition-all duration-700 uppercase`}>
        {displayName.toLowerCase() === 'producción' ? (
          <Briefcase size={isSmall ? 14 : 16} className={isDarkMode ? "text-emerald-400" : "text-emerald-600"} fill="currentColor" />
        ) : displayName.toLowerCase() === 'destacados' ? (
          <Star size={isSmall ? 14 : 16} className={isDarkMode ? "text-amber-400" : "text-amber-500"} fill="currentColor" />
        ) : error ? (
          <Flame size={isSmall ? 14 : 16} className={isDarkMode ? "text-orange-500 animate-pulse" : "text-orange-600 animate-pulse"} />
        ) : (
          <img 
            src={iconUrl} 
            alt={displayName}
            className={`w-full h-full object-contain transition-all ${
                ['java', 'videojuego', 'videojuegos'].includes(displayName.toLowerCase()) 
                  ? (isDarkMode ? 'brightness-0 invert opacity-90 group-hover:opacity-100' : 'opacity-90 group-hover:opacity-100') 
                  : ''
            }`}
            onError={() => setError(true)}
          />
        )}
      </div>

      {showName ? (
        <span className={`${isSmall ? 'text-[8px]' : 'text-[10px]'} font-black uppercase tracking-[0.2em] transition-colors duration-500 ${
            isDarkMode ? 'text-gray-400 group-hover/tech:text-white' : 'text-slate-900 group-hover/tech:text-black'
        }`}>
          {displayName}
        </span>
      ) : (
        /* Tooltip para cuando no hay nombre visible (en las tarjetas) */
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/95 border border-white/20 rounded-lg text-[10px] uppercase tracking-[0.2em] text-white opacity-0 group-hover/tech:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
          {displayName}
        </span>
      )}
    </div>
  );
}
