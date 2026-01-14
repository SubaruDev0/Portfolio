'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimationFrame, useSpring, useTransform, animate } from 'framer-motion';
import Navbar from '@/components/Navbar';
import ThemeSwitch from '@/components/ThemeSwitch';
import ProjectCard from '@/components/ProjectCard';
import CertificateCard from '@/components/CertificateCard';
import TechBadge from '@/components/TechBadge';
import CVModal from '@/components/CVModal';
import ProjectModal from '@/components/ProjectModal';
import CertificateModal from '@/components/CertificateModal';
import { ThemeType, Project, Certificate } from '@/types';
import { getThemeColors } from '@/utils/theme';
import { Code2, Cpu, Globe, Database, Award, ExternalLink, Mail, MessageCircle, Github, Linkedin, ArrowRight, ArrowLeft, Pause, Play } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function HomeClient({ 
  initialProjects, 
  initialCertificates,
  initialSettings = {}
}: { 
  initialProjects: Project[], 
  initialCertificates: Certificate[],
  initialSettings?: Record<string, string>
}) {
  const [theme, setTheme] = useState<ThemeType>('all');
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);

  const isAnyModalOpen = !!activeProject || !!activeCertificate || isCVModalOpen;
  const themeColors = getThemeColors(theme);

  // Carousel Logic (Infinite Drag + Momentum)
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const baseVelocity = -60; // Pixels per second
  const totalItems = initialCertificates.length;
  const [itemWidth, setItemWidth] = useState(420);

  useEffect(() => {
    const handleResize = () => {
      setItemWidth(window.innerWidth < 768 ? 340 : 420);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalWidth = totalItems * itemWidth;

  const carouselCertificates = useMemo(() => {
    if (totalItems === 0) return [];
    return [...initialCertificates, ...initialCertificates, ...initialCertificates, ...initialCertificates];
  }, [initialCertificates, totalItems]);

  useEffect(() => {
    x.set(-totalWidth);
  }, [totalWidth, x]);

  useAnimationFrame((t, delta) => {
    if (isPaused || isAnyModalOpen || isDragging || totalItems === 0) return;
    const move = baseVelocity * (delta / 1000);
    x.set(x.get() + move);
  });

  useEffect(() => {
    const unsub = x.on("change", (latest) => {
      if (latest <= -totalWidth * 2) {
        x.set(latest + totalWidth);
      } else if (latest >= -totalWidth / 2) {
        x.set(latest - totalWidth);
      }
    });
    return () => unsub();
  }, [totalWidth, x]);

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
    <main className="min-h-screen bg-[#050505] relative overflow-hidden font-sans scroll-smooth">
      {/* Background Effects */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{ 
          background: "radial-gradient(circle at 50% 50%, " + themeColors.hex + "40 0%, transparent 70%)" 
        }}
      />
      
      <Navbar themeColor={themeColors.hex} onOpenCV={() => setIsCVModalOpen(true)} />

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 mb-6 uppercase tracking-[0.3em] transition-colors" style={{ color: themeColors.hex }}>
            {theme === 'research' ? 'Laboratorio Activo' : 'Disponible para nuevos proyectos'}
          </span>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight text-white">
            SubaruDev
            <br />
            <span className="text-2xl md:text-3xl font-light tracking-[0.2em] transition-colors duration-1000 uppercase block mt-2" style={{ color: themeColors.hex }}>
              Ingeniero Civil Informático
            </span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-light">
            {theme === 'all' && 'Explorando la arquitectura técnica y la innovación constante. Un registro de mi evolución y maduración como profesional.'}
            {theme === 'frontend' && 'Diseño de interfaces funcionales y sistemas escalables. Enfoque en accesibilidad, rendimiento y buenas prácticas visuales.'}
            {theme === 'backend' && 'Implementación de lógica de negocio, bases de datos y servicios robustos para entornos de alta exigencia.'}
            {theme === 'fullstack' && 'Sincronía entre el diseño de experiencia y la arquitectura de datos. Solución de problemas con un enfoque integral.'}
            {theme === 'research' && 'Computación aplicada al análisis de sistemas complejos. Participación activa en estudios de Graphlets y Bioinformática.'}
            {theme === 'other' && 'Proyectos técnicos y herramientas especializadas: utilidades de terminal, algoritmos, simulaciones y desafíos de ingeniería.'}
          </p>
          
          <div className="flex gap-4 justify-center">
            <a 
                href="#proyectos-anchor"
                className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 shadow-lg duration-500 flex items-center gap-2"
                style={{ backgroundColor: themeColors.hex, color: '#000', boxShadow: `0 0 20px ${themeColors.hex}40` }}
            >
              Ver Proyectos
            </a>
            <button 
              onClick={() => setIsCVModalOpen(true)}
              className="px-8 py-3 rounded-full font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white flex items-center gap-2"
            >
              Descargar CV
            </button>
          </div>
        </motion.div>

        {/* Anchor point for correct scrolling - Land above the controller */}
        <div id="proyectos-anchor" className="h-52 -mt-52" />

        {/* Metamorphosis Controller */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <ThemeSwitch currentTheme={theme} setTheme={(t) => withTransition(() => setTheme(t))} />
        </motion.div>

        {/* Technology Filters */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="w-full mb-12 flex flex-wrap justify-center gap-3"
        >
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
        </motion.div>

        {/* Projects Grid */}
        <div id="proyectos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full min-h-[400px]">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 3) * 0.1 }}
            >
              <ProjectCard 
                project={project} 
                themeColor={themeColors.hex}
                onSelect={setActiveProject}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-mi" className="py-32 px-6 border-t border-white/5 bg-black/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
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
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
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
          </motion.div>
        </div>

        {/* Certificates Carousel */}
        <div className="max-w-7xl mx-auto mt-32">
          <div className="flex items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4 flex-1">
              <h2 className="text-2xl font-black uppercase tracking-widest text-white">Certificaciones <span className="text-gray-600">&</span> Logros</h2>
              <div className="h-px flex-1 bg-white/10" />
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={() => animate(x, x.get() + itemWidth, { type: "spring", stiffness: 300, damping: 30 })}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/50 hover:text-white"
               >
                 <ArrowLeft size={18} />
               </button>
               <button 
                onClick={() => setIsPaused(!isPaused)}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/50 hover:text-white"
               >
                 {isPaused ? <Play size={18} /> : <Pause size={18} />}
               </button>
               <button 
                onClick={() => animate(x, x.get() - itemWidth, { type: "spring", stiffness: 300, damping: 30 })}
                className="p-3 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-all text-white/50 hover:text-white"
               >
                 <ArrowRight size={18} />
               </button>
            </div>
          </div>
          
          <div className="relative overflow-hidden pt-4 pb-12 cursor-grab active:cursor-grabbing">
            <motion.div 
              className="flex gap-10"
              style={{ x }}
              drag="x"
              onDragStart={() => setIsDragging(true)}
              onDragEnd={() => {
                // Pequeño delay para evitar que el click se dispare justo al soltar el drag
                setTimeout(() => setIsDragging(false), 50);
              }}
              // No constraints needed because we wrap manually in useEffect
              dragConstraints={{ left: -totalWidth * 2.5, right: 0 }}
              dragTransition={{ power: 0.8, timeConstant: 200 }}
            >
              {carouselCertificates.map((cert, idx) => (
                <div key={`${cert.id}-${idx}`} className="shrink-0 w-[380px] flex select-none">
                  <CertificateCard 
                    certificate={cert} 
                    themeColor={themeColors.hex} 
                    onSelect={(c) => !isDragging && setActiveCertificate(c)}
                  />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/[0.02] border border-white/10 rounded-[3rem] p-8 md:p-16 relative overflow-hidden group"
            >
              {/* Luz de fondo sutil */}
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full opacity-20 transition-colors duration-1000"
                style={{ backgroundColor: themeColors.hex }}
              />

              <div className="flex flex-col lg:flex-row gap-12 items-center justify-between relative z-10">
                <div className="text-center lg:text-left max-w-xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 block">Conectemos</span>
                  <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight uppercase leading-none">
                    ¿Buscas <br />
                    <span style={{ color: themeColors.hex }}>Sumar Talento</span> <br />
                    a tu equipo?
                  </h2>
                  <p className="text-gray-400 text-lg font-light leading-relaxed">
Estoy disponible. Conversemos sobre cómo puedo integrarme a tu equipo y contribuir en los próximos desafíos.                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                   <motion.a 
                     href="mailto:subaru0.dev@gmail.com"
                     whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.08)" }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors group/link"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:scale-110 transition-transform">
                           <Mail size={20} style={{ color: themeColors.hex }} />
                        </div>
                        <div>
                           <h3 className="text-white font-bold text-sm">Gmail</h3>
                           <p className="text-gray-500 text-xs">subaru0.dev@gmail.com</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="text-gray-600 group-hover/link:translate-x-1 transition-transform" />
                   </motion.a>

                   <motion.a 
                     href="https://wa.me/56954971044"
                     target="_blank"
                     rel="noopener noreferrer"
                     whileHover={{ x: 8, backgroundColor: "rgba(255,255,255,0.08)" }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     className="p-5 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors group/link"
                   >
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover/link:scale-110 transition-transform">
                           <MessageCircle size={20} style={{ color: themeColors.hex }} />
                        </div>
                        <div>
                           <h3 className="text-white font-bold text-sm">WhatsApp</h3>
                           <p className="text-gray-500 text-xs">+56 9 5497 1044</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="text-gray-600 group-hover/link:translate-x-1 transition-transform" />
                   </motion.a>

                   <div className="grid grid-cols-2 gap-4">
                      <a href="https://linkedin.com/in/subarudev0" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 text-gray-400 hover:text-white">
                        <Linkedin size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">LinkedIn</span>
                      </a>
                      <a href="https://github.com/subarudev0" target="_blank" rel="noopener noreferrer" className="p-4 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 text-gray-400 hover:text-white">
                        <Github size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest">GitHub</span>
                      </a>
                   </div>
                </div>
              </div>
            </motion.div>
        </div>
      </section>

      <footer className="py-20 border-t border-white/5 text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-[0.5em]">© 2026 SUBARUDEV // J.S.M. SUBARU</p>
      </footer>

      {activeProject && (
        <ProjectModal 
          project={activeProject}
          isOpen={!!activeProject}
          onClose={() => setActiveProject(null)}
          themeColor={themeColors.hex}
        />
      )}

      {activeCertificate && (
        <CertificateModal 
          certificate={activeCertificate}
          isOpen={!!activeCertificate}
          onClose={() => setActiveCertificate(null)}
          themeColor={themeColors.hex}
        />
      )}

      <CVModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
        cvUrl={initialSettings.cv_url}
        description={initialSettings.cv_description}
        themeColor={themeColors.hex}
      />
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
