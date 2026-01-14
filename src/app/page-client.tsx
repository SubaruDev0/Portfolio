'use client';

import React, { useState, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import ThemeSwitch from '@/components/ThemeSwitch';
import ProjectCard from '@/components/ProjectCard';
import CertificateCard from '@/components/CertificateCard';
import TechBadge from '@/components/TechBadge';
import { ThemeType, Project, Certificate } from '@/types';
import { getThemeColors } from '@/utils/theme';
import { Code2, Cpu, Globe, Database, Award, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function HomeClient({ 
  initialProjects, 
  initialCertificates 
}: { 
  initialProjects: Project[], 
  initialCertificates: Certificate[] 
}) {
  const [theme, setTheme] = useState<ThemeType>('all');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const themeColors = getThemeColors(theme);

  const withTransition = (fn: () => void) => {
    // @ts-ignore
    if (document.startViewTransition) {
      // @ts-ignore
      document.startViewTransition(fn);
    } else {
      fn();
    }
  };

  const filteredProjects = useMemo(() => {
    return initialProjects
      .filter(p => {
        const matchesCategory = theme === 'all' ? true : p.category === theme;
        const matchesTech = selectedTechs.length === 0 || 
          selectedTechs.some(tech => p.technologies.includes(tech));
        return matchesCategory && matchesTech;
      })
      .sort((a, b) => {
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;
        return 0;
      });
  }, [theme, selectedTechs, initialProjects]);

  const allAvailableTechs = useMemo(() => {
    const techs = new Set<string>();
    initialProjects.forEach(p => p.technologies.forEach(t => techs.add(t)));
    return Array.from(techs);
  }, [initialProjects]);

  const toggleTech = (tech: string) => {
    withTransition(() => {
      setSelectedTechs(prev => 
        prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
      );
    });
  };

  return (
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{ 
          background: "radial-gradient(circle at 50% 50%, " + themeColors.hex + "40 0%, transparent 70%)" 
        }}
      />
      
      <Navbar themeColor={themeColors.hex} />

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in animate-delay-[100ms]">
          <span className="inline-block px-4 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 mb-6 uppercase tracking-[0.3em] animate-slide-in-top" style={{ color: themeColors.hex }}>
            {theme === 'research' ? 'Laboratorio Activo' : 'Disponible para nuevos proyectos'}
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight text-white animate-blurred-fade-in">
            SubaruDev
            <br />
            <span className="text-2xl md:text-3xl font-light tracking-[0.2em] transition-colors duration-1000 uppercase block mt-2" style={{ color: themeColors.hex }}>
              Ingeniero Civil Informático
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-light animate-fade-in animate-delay-[500ms]">
            {theme === 'all' && 'Explorando la arquitectura técnica y la innovación constante. Un registro de mi evolución y maduración como profesional.'}
            {theme === 'frontend' && 'Diseño de interfaces funcionales y sistemas escalables. Enfoque en accesibilidad, rendimiento y buenas prácticas visuales.'}
            {theme === 'backend' && 'Implementación de lógica de negocio, bases de datos y servicios robustos para entornos de alta exigencia.'}
            {theme === 'fullstack' && 'Sincronía entre el diseño de experiencia y la arquitectura de datos. Solución de problemas con un enfoque integral.'}
            {theme === 'research' && 'Computación aplicada al análisis de sistemas complejos. Participación activa en estudios de Graphlets y Bioinformática.'}
            {theme === 'other' && 'Proyectos técnicos y herramientas especializadas: utilidades de terminal, algoritmos, simulaciones y desafíos de ingeniería.'}
          </p>
          
          <div className="flex gap-4 justify-center animate-zoom-in animate-delay-[700ms]">
            <button 
                className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg duration-500"
                style={{ backgroundColor: themeColors.hex, color: '#000', boxShadow: `0 0 20px ${themeColors.hex}40` }}
            >
              Contáctame
            </button>
            <button className="px-8 py-3 rounded-full font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white">
              Saber más
            </button>
          </div>
        </div>

        {/* Metamorphosis Controller */}
        <div className="animate-fade-in animate-delay-[900ms]">
          <ThemeSwitch currentTheme={theme} setTheme={(t) => withTransition(() => setTheme(t))} />
        </div>

        {/* Technology Filters */}
        <div className="w-full mb-12 flex flex-wrap justify-center gap-3 animate-fade-in animate-delay-[1000ms]">
          {allAvailableTechs.map(tech => (
            <button
              key={tech}
              onClick={() => toggleTech(tech)}
              className="transition-all active:scale-95"
            >
              <TechBadge 
                name={tech} 
                className={selectedTechs.includes(tech) ? "!border-white/40 !bg-white/10" : "opacity-60 hover:opacity-100"}
                showName={true}
              />
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div id="proyectos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full min-h-[400px]">
          {filteredProjects.map((project, index) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              themeColor={themeColors.hex}
              className={`animate-delay-[${(index % 6) * 100}ms]`}
            />
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-mi" className="py-32 px-6 border-t border-white/5 bg-black/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="animate-swing-drop-in">
            <h2 className="text-4xl font-black mb-8 tracking-tight uppercase text-white">Sobre <span style={{ color: themeColors.hex }}>Mí</span></h2>
            <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-light">
              <p>
                Soy <span className="text-white font-bold">Javier Sebastián Morales Subaru</span>. 
              </p>
              <p>
                Ingeniero Civil Informático de la <span className="text-white">Universidad San Sebastián</span> (Sede Concepción, Chile). Me apasiona resolver problemas complejos mediante software bien estructurado, desde herramientas técnicas hasta arquitectura de sistemas.
              </p>
              <p>
                Durante mi formación he desarrollado habilidades en liderazgo y gestión, participando en instancias competitivas como Corfo y Santander X, además de ser coordinador general de mi carrera.
              </p>
              <div className="pt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StatItem value="Chile" label="Residencia" />
                <StatItem value="Ingeniero Civil Informático" label="Título Profesional" />
              </div>
            </div>
          </div>
          
          <div className="space-y-8 animate-zoom-in">
             <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl group">
               <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-white/30 transition-all">
                    <img src="/logos/Logo_Universidad_san_sebastian.png" alt="USS" className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div>
                   <h3 className="text-white font-bold">Universidad San Sebastián</h3>
                   <p className="text-xs text-gray-500 uppercase tracking-widest">Sede Concepción</p>
                 </div>
               </div>
               <p className="text-sm text-gray-400 font-light">
                 Formación en ingeniería de software avanzada, gestión de proyectos y ciencias de la computación.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <FeatureBox icon={Cpu} title="Trabajo en Equipo" color={themeColors.hex} />
               <FeatureBox icon={Globe} title="Inglés Técnico" color={themeColors.hex} />
               <FeatureBox icon={Code2} title="Liderazgo" color={themeColors.hex} />
               <FeatureBox icon={Database} title="Gestión Corfo / Santander X" color={themeColors.hex} />
             </div>
          </div>
        </div>

        {/* Certificates Carousel */}
        <div className="max-w-7xl mx-auto mt-32">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-2xl font-black uppercase tracking-widest text-white">Certificaciones <span className="text-gray-600">&</span> Logros</h2>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          
          <div className="flex gap-6 overflow-x-auto pb-8 snap-x no-scrollbar">
            {initialCertificates.map((cert) => (
              <CertificateCard 
                key={cert.id} 
                certificate={cert} 
                themeColor={themeColors.hex} 
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <div className="flex justify-center gap-8 mb-8 text-gray-500 font-bold text-xs uppercase tracking-widest animate-fade-in">
           <a href="https://linkedin.com/in/subarudev0" className="hover:text-white hover:animate-tada transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
           <a href="https://github.com/subarudev0" className="hover:text-white hover:animate-tada transition-colors" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em]">© 2026 SUBARUDEV // J.S.M. SUBARU</p>
      </footer>
    </main>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div>
      <div className="text-xl font-bold text-white tracking-tight">{value}</div>
      <div className="text-[10px] text-gray-600 uppercase font-black tracking-widest">{label}</div>
    </div>
  )
}

function FeatureBox({ icon: Icon, title, color }: { icon: any, title: string, color: string }) {
  return (
    <div className="p-8 bg-white/[0.02] border border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 hover:bg-white/[0.05] transition-all group overflow-hidden">
      <Icon className="transition-transform duration-500 group-hover:scale-110" size={32} style={{ color: color }} />
      <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 group-hover:text-gray-300">{title}</span>
    </div>
  )
}
