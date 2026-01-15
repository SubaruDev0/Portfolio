'use client';

import React, { useState } from 'react';
import { Flame, Briefcase } from 'lucide-react';

interface TechBadgeProps {
  name: string;
  showName?: boolean;
  className?: string;
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
};

export default function TechBadge({ name, showName = true, className = "" }: TechBadgeProps) {
  const [error, setError] = useState(false);
  const normalizedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  const slug = techMap[name] || techMap[normalizedName] || name.toLowerCase().replace(/\s+/g, '');
  
  // Casos especiales para logos locales o externos específicos
  let iconUrl = `https://cdn.simpleicons.org/${slug}/white`;

  if (name.toLowerCase() === 'java') {
    iconUrl = "https://raw.githubusercontent.com/devicons/devicon/master/icons/java/java-original.svg";
  } else if (name.toLowerCase() === 'videojuego' || name.toLowerCase() === 'videojuegos') {
    iconUrl = "https://raw.githubusercontent.com/devicons/devicon/master/icons/unity/unity-original.svg";
  } else if (name.toLowerCase() === 'producción') {
    iconUrl = ""; // Usaremos Lucide en este caso especial si falla la imagen, o simplemente forzamos el error para que use Flame. 
    // Mejor aún, usemos un slug que no exista y manejemos Lucide internamente.
  } else if (slug === 'uss') {
    iconUrl = "/logos/Logo_Universidad_san_sebastian.png";
  }

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl group/tech hover:border-white/40 hover:!bg-black group-hover:bg-black/80 transition-all duration-700 cursor-default relative ${className}`}
    >
      <div className="w-5 h-5 flex items-center justify-center text-orange-500 opacity-100 group-hover/tech:scale-110 transition-all duration-700">
        {name.toLowerCase() === 'producción' ? (
          <Briefcase size={16} className="text-emerald-400" fill="currentColor" />
        ) : error ? (
          <Flame size={16} className="animate-pulse" />
        ) : (
          <img 
            src={iconUrl} 
            alt={name}
            className={`w-full h-full object-contain transition-all ${['java', 'videojuego', 'videojuegos'].includes(name.toLowerCase()) ? 'brightness-0 invert opacity-90 group-hover:opacity-100' : ''}`}
            onError={() => setError(true)}
          />
        )}
      </div>

      {showName ? (
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 group-hover/tech:text-white transition-colors duration-500">
          {name}
        </span>
      ) : (
        /* Tooltip para cuando no hay nombre visible (en las tarjetas) */
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/95 border border-white/20 rounded-lg text-[10px] uppercase tracking-[0.2em] text-white opacity-0 group-hover/tech:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
          {name}
        </span>
      )}
    </div>
  );
}
