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
import { Code2, Cpu, Globe, Database, Award, ExternalLink, Mail, MessageCircle, Github, Linkedin, ArrowRight, ArrowLeft, ArrowUp, Terminal, Pause, Play, Sun, Moon, RotateCcw, ChevronUp, Star, Filter, Bug } from 'lucide-react';
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [activeCertificate, setActiveCertificate] = useState<Certificate | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [visibleProjectsCount, setVisibleProjectsCount] = useState(6);
  const [showAllFilters, setShowAllFilters] = useState(false);
  const INITIAL_FILTERS_COUNT = 8; // Cuántos filtros mostrar inicialmente

  // Resetear paginación cuando cambian los filtros
  useEffect(() => {
    setVisibleProjectsCount(6);
  }, [theme, selectedTechs]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAnyModalOpen = !!activeProject || !!activeCertificate || isCVModalOpen;
  
  // Colores dinámicos basados en Tema y Modo (Oscuro/Claro)
  const themeColors = useMemo(() => {
    const base = getThemeColors(theme);
    if (isDarkMode) return base;
    
    // Ajustes para modo claro (colores un poco más saturados/oscuros para legibilidad)
    const lightAjustments: Record<ThemeType, string> = {
      all: '#d97706',      // Amber 600
      frontend: '#0891b2', // Cyan 600
      backend: '#dc2626',  // Red 600
      fullstack: '#9333ea',// Purple 600
      research: '#059669', // Emerald 600
      other: '#475569'     // Slate 600
    };

    return {
      ...base,
      hex: lightAjustments[theme] || base.hex
    };
  }, [theme, isDarkMode]);

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

  const handleShowLess = () => {
    setVisibleProjectsCount(prev => Math.max(6, prev - 6));
    // Pequeño delay para que la animación de salida empiece antes del scroll
    setTimeout(() => {
      window.scrollBy({ top: -800, behavior: 'smooth' });
    }, 100);
  };

  const filteredProjects = useMemo(() => {
    return initialProjects
      .filter(p => {
        // Un proyecto coincide si su categoría principal O secundaria coincide con el filtro
        const matchesCategory = theme === 'all' ? true : (p.category === theme || p.secondaryCategory === theme);
        const matchesTech = selectedTechs.length === 0 || 
          selectedTechs.some(tech => {
            if (tech === 'Producción') return p.isRealWorld;
            if (tech === 'Destacados') return p.isStarred;
            
            // Si el filtro tech tiene slug (Name:slug), extraemos solo el nombre para comparar
            const filterName = tech.includes(':') ? tech.split(':')[0].trim().toLowerCase() : tech.toLowerCase();
            
            return p.technologies.some(t => {
              const projectTechName = t.includes(':') ? t.split(':')[0].trim().toLowerCase() : t.toLowerCase();
              return projectTechName === filterName;
            });
          });
        return matchesCategory && matchesTech;
      })
      .sort((a, b) => {
        // Reglas de prioridad solicitadas por el usuario:
        
        // 1. Prioridad Máxima: Destacado Y Producción
        const aMax = a.isStarred && a.isRealWorld;
        const bMax = b.isStarred && b.isRealWorld;
        if (aMax && !bMax) return -1;
        if (!aMax && bMax) return 1;

        // 2. Prioridad 1: Destacado
        if (a.isStarred && !b.isStarred) return -1;
        if (!a.isStarred && b.isStarred) return 1;

        // 3. Prioridad 2: Producción
        if (a.isRealWorld && !b.isRealWorld) return -1;
        if (!a.isRealWorld && b.isRealWorld) return 1;

        // 4. Orden natural (establecido en Admin)
        const aOrder = a.sortOrder || 0;
        const bOrder = b.sortOrder || 0;
        if (aOrder !== bOrder) return aOrder - bOrder;

        // 5. Por fecha de creación si todo lo demás es igual
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [theme, selectedTechs, initialProjects]);

  const allAvailableTechs = useMemo(() => {
    const techsMap = new Map<string, { original: string; count: number }>(); // lowerCase -> {original, count}
    
    // Forzamos filtros maestros al inicio
    const hasProduction = initialProjects.some(p => p.isRealWorld);
    const hasStarred = initialProjects.some(p => p.isStarred);
    
    initialProjects.forEach(p => p.technologies.forEach(t => {
      // Guardamos el formato completo (Nombre:Slug) para que el Filtro tenga icono
      const namePart = t.includes(':') ? t.split(':')[0].trim() : t;
      const lowerName = namePart.toLowerCase();
      
      if (lowerName !== 'producción' && lowerName !== 'destacados') {
        if (!techsMap.has(lowerName)) {
          techsMap.set(lowerName, { original: t, count: 1 });
        } else {
          const existing = techsMap.get(lowerName)!;
          existing.count++;
          // Si la versión guardada no tiene slug y la nueva sí, preferimos la que tiene slug
          if (!existing.original.includes(':') && t.includes(':')) {
            existing.original = t;
          }
        }
      }
    }));

    // Ordenar por frecuencia (más usados primero), luego alfabéticamente
    const sortedTechs = Array.from(techsMap.values())
      .sort((a, b) => {
        // Primero por cantidad (descendente)
        if (b.count !== a.count) return b.count - a.count;
        // Luego alfabéticamente
        const nameA = a.original.includes(':') ? a.original.split(':')[0] : a.original;
        const nameB = b.original.includes(':') ? b.original.split(':')[0] : b.original;
        return nameA.localeCompare(nameB);
      })
      .map(item => item.original);
    
    const masterFilters = [];
    if (hasStarred) masterFilters.push('Destacados');
    if (hasProduction) masterFilters.push('Producción');
    
    return [...masterFilters, ...sortedTechs];
  }, [initialProjects]);

  const toggleTech = (tech: string) => {
    withTransition(() => {
      setSelectedTechs(prev => 
        prev.includes(tech) ? prev.filter(t => t !== tech) : [...prev, tech]
      );
    });
  };

  return (
    <main 
      className={`min-h-screen relative overflow-hidden font-sans scroll-smooth transition-colors duration-700 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#fcfcfc] text-slate-900'}`}
    >
      {/* Background Effects */}
      <div className={`fixed inset-0 pointer-events-none transition-colors duration-700 ${isDarkMode ? 'grid-bg' : 'grid-bg-light'}`} />
      <div 
        className="fixed inset-0 pointer-events-none transition-all duration-1000 opacity-20"
        style={{ 
          background: `radial-gradient(circle at 50% 50%, ${themeColors.hex}${isDarkMode ? '40' : '20'} 0%, transparent 70%)` 
        }}
      />
      
      <Navbar themeColor={themeColors.hex} onOpenCV={() => setIsCVModalOpen(true)} />

      {/* Selector de Modo (Sol/Luna) - Esquina Superior Derecha */}
      <div className="fixed top-24 right-6 z-[60] flex flex-col gap-2">
         <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-500 ${
              isDarkMode 
              ? 'bg-white/5 border-white/10 text-yellow-400' 
              : 'bg-black/5 border-black/10 text-indigo-600'
            }`}
         >
            {isDarkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
         </motion.button>
      </div>

      {/* Botón Volver Arriba */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl border backdrop-blur-xl transition-all group shadow-2xl ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`}
            style={{ color: themeColors.hex }}
          >
            <ArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
            <div 
              className="absolute inset-0 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: themeColors.hex }}
            />
          </motion.button>
        )}
      </AnimatePresence>

      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <span 
            className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-black mb-6 uppercase tracking-[0.3em] transition-all border ${
                isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
            }`} 
            style={{ color: themeColors.hex }}
          >
            {theme === 'all' && 'Quizás no todos sean lo que buscas, ¡Filtra!'}
            {theme === 'frontend' && 'No suelo hacer solo frontend, pero aquí hay unos...'}
            {theme === 'backend' && 'Relacionado al Backend y la infraestructura'}
            {theme === 'fullstack' && 'Le suelo meter backend a todo...'}
            {theme === 'research' && 'Laboratorio e Investigación Activa'}
            {theme === 'other' && '¡Variedad! (Proyectos misceláneos y experimentales)'}
          </span>
          <h1 className={`text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            SubaruDev
            <br />
            <span className="text-2xl md:text-3xl font-light tracking-[0.2em] transition-colors duration-1000 uppercase block mt-2" style={{ color: themeColors.hex }}>
              Ingeniero Civil Informático
            </span>
          </h1>
          <p className={`max-w-2xl mx-auto text-lg mb-10 leading-relaxed font-light transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-black/70'}`}>
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
                style={{ backgroundColor: themeColors.hex, color: isDarkMode ? '#000' : '#fff', boxShadow: `0 0 20px ${themeColors.hex}40` }}
            >
              Ver Proyectos
            </a>
            <button 
              onClick={() => setIsCVModalOpen(true)}
              className={`px-8 py-3 rounded-full font-bold border transition-all flex items-center gap-2 ${
                  isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-800'
              }`}
            >
              Descargar CV
            </button>
          </div>
        </motion.div>

        {/* Anchor point for correct scrolling - Land above the controller */}
        <div id="proyectos-anchor" className="h-24 -mt-24" />

        {/* Metamorphosis Controller */}
        <div className="w-full max-w-7xl mb-8 flex flex-col items-center">
            <ThemeSwitch currentTheme={theme} setTheme={(t) => withTransition(() => setTheme(t))} />
            
            {(theme !== 'all' || selectedTechs.length > 0) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => withTransition(() => {
                  setTheme('all');
                  setSelectedTechs([]);
                })}
                className={`mt-2 flex items-center gap-2 px-4 py-1.5 border rounded-full transition-all text-[9px] font-black uppercase tracking-widest group ${
                    isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white' : 'bg-black/5 border-black/10 text-slate-400 hover:text-slate-800'
                }`}
              >
                <RotateCcw size={10} className="group-hover:rotate-180 transition-transform duration-500" />
                Limpiar filtros
              </motion.button>
            )}

            <div className="mt-2 w-full flex flex-col items-center space-y-2">
              <span className={`text-[9px] font-black uppercase tracking-[0.4em] transition-colors duration-700 ${isDarkMode ? 'text-white/20' : 'text-slate-300'}`}>Filtros</span>
              
              <div className="flex flex-col items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={theme + selectedTechs.join(',')}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex items-center gap-3 px-6 py-2 rounded-full border bg-white/[0.02] transition-colors duration-700 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500">
                      Mostrando <span style={{ color: themeColors.hex }} className="text-sm font-black transition-colors duration-500">{filteredProjects.length}</span> {filteredProjects.length === 1 ? 'Proyecto' : 'Proyectos'}
                    </span>
                    <div className="h-4 w-px bg-white/10" />
                    <span className="text-[9px] uppercase font-black tracking-widest text-white/30">
                      {theme === 'all' ? 'Colección Total' : 
                       theme === 'research' ? 'Investigación' :
                       theme === 'other' ? 'Otros' : theme}
                    </span>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Technology Filters */}
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                className="w-full flex flex-col items-center gap-2 pt-1"
              >
                <div className="flex flex-wrap justify-center gap-2">
                  {(showAllFilters ? allAvailableTechs : allAvailableTechs.slice(0, INITIAL_FILTERS_COUNT)).map(tech => (
                    <button
                      key={tech}
                      onClick={() => toggleTech(tech)}
                      className="transition-all active:scale-95"
                    >
                      <TechBadge 
                        name={tech} 
                        className={selectedTechs.includes(tech) ? (isDarkMode ? "!border-white/40 !bg-white/10" : "!border-black/40 !bg-black/10") : "opacity-60 hover:opacity-100"}
                        showName={true}
                        isDarkMode={isDarkMode}
                      />
                    </button>
                  ))}
                </div>
                
                {/* Botón Ver más / Ver menos filtros */}
                {allAvailableTechs.length > INITIAL_FILTERS_COUNT && (
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => setShowAllFilters(!showAllFilters)}
                    className={`mt-2 flex items-center gap-2 px-4 py-1.5 border rounded-full transition-all text-[9px] font-black uppercase tracking-widest group ${
                        isDarkMode ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:border-white/20' : 'bg-black/5 border-black/10 text-slate-400 hover:text-slate-800 hover:border-black/20'
                    }`}
                  >
                    {showAllFilters ? (
                      <>
                        <ChevronUp size={12} className="group-hover:-translate-y-0.5 transition-transform" />
                        Ver menos filtros
                      </>
                    ) : (
                      <>
                        <Filter size={10} />
                        Ver {allAvailableTechs.length - INITIAL_FILTERS_COUNT} filtros más
                      </>
                    )}
                  </motion.button>
                )}
              </motion.div>
            </div>
        </div>

        {/* Projects Grid */}
        <div id="proyectos" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full min-h-[400px] relative">
          <AnimatePresence mode='popLayout'>
            {filteredProjects.length > 0 ? (
              filteredProjects.slice(0, visibleProjectsCount).map((project, index) => (
                <motion.div
                  key={project.id}
                  layout="position"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                  transition={{ 
                    type: "spring",
                    stiffness: 260,
                    damping: 20,
                    delay: index % 6 * 0.05 
                  }}
                >
                  <ProjectCard 
                    project={project} 
                    themeColor={themeColors.hex}
                    onSelect={setActiveProject}
                    isDarkMode={isDarkMode}
                  />
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6"
              >
                <motion.div 
                  animate={{ 
                    y: [0, -10, 0],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className={`w-24 h-24 rounded-full flex items-center justify-center border mb-4 ${
                      isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                  }`}
                >
                  <Bug size={40} className={`opacity-40 transition-colors duration-700 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`} />
                </motion.div>
                
                <div className="max-w-md">
                  <h3 className={`font-black uppercase tracking-widest text-lg mb-3 transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                    {theme === 'fullstack' ? '¿Buscabas un Full-stack?' : 'Sin resultados por aquí'}
                  </h3>
                  <p className={`font-light text-sm leading-relaxed transition-colors duration-700 ${isDarkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    {theme === 'fullstack' 
                      ? 'Como te habrás dado cuenta, me encanta meterle backend a todo lo que toco. Tengo varias ideas en el horno que subiré muy pronto, ¡Mantente atento!' 
                      : 'Parece que no hay proyectos con estas tecnologías específicas. Prueba ajustando los filtros.'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Paginación de proyectos */}
        <div className="w-full flex flex-col items-center gap-4 mt-16">
          <div className="flex flex-wrap justify-center gap-6">
            {/* Ver más button */}
            {filteredProjects.length > visibleProjectsCount && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={() => setVisibleProjectsCount(prev => prev + 6)}
                  className="group relative px-10 py-4 rounded-2xl overflow-hidden transition-all active:scale-95 border"
                  style={{ 
                    borderColor: `${themeColors.hex}40`,
                    backgroundColor: isDarkMode ? `${themeColors.hex}05` : `${themeColors.hex}08`
                  }}
                >
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: `${themeColors.hex}10` }}
                  />
                  <span 
                    className="relative z-10 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 transition-colors duration-300"
                    style={{ color: themeColors.hex }}
                  >
                    Ver Más Proyectos 
                    <motion.div
                      animate={{ y: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronUp size={14} className="rotate-180" />
                    </motion.div>
                  </span>
                </button>
              </motion.div>
            )}

            {/* Ver menos button */}
            {visibleProjectsCount > 6 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <button
                  onClick={handleShowLess}
                  className="group relative px-10 py-4 rounded-2xl overflow-hidden transition-all active:scale-95 border border-white/5 bg-white/5 hover:bg-white/10"
                >
                  <span className="relative z-10 font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-3 text-gray-500 group-hover:text-white transition-colors">
                    Ver Menos
                    <motion.div
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ChevronUp size={14} />
                    </motion.div>
                  </span>
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="sobre-mi" className={`py-32 px-6 border-t relative overflow-hidden transition-colors duration-700 ${isDarkMode ? 'border-white/5 bg-black/30' : 'border-black/5 bg-slate-50/50'}`}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className={`text-4xl font-black mb-8 tracking-tight uppercase transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Sobre <span style={{ color: themeColors.hex }}>Mí</span></h2>
            <div className={`space-y-6 text-lg leading-relaxed font-light transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-slate-700'}`}>
              <p>
                Soy <span className={`font-bold transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>Javier Sebastián Morales Subaru</span>. 
              </p>
              <p>
                Ingeniero Civil Informático apasionado por crear soluciones digitales que combinen una arquitectura sólida con experiencias de usuario excepcionales. Mi enfoque va más allá de escribir código; busco entender el producto de manera integral, desde la infraestructura hasta el último detalle visual.
              </p>
              <p>
                 He trabajado en diversos entornos, lo que me ha permitido cultivar una visión técnica versátil 
                 y una capacidad de adaptación constante frente a nuevos desafíos tecnológicos.
              </p>
              
              {/* Nota Técnica Simplificada */}
              <div className={`mt-8 p-6 rounded-2xl border backdrop-blur-sm transition-colors duration-700 ${isDarkMode ? 'border-white/5 bg-white/[0.02]' : 'border-black/5 bg-black/[0.02]'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg transition-colors duration-700 ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                    <Terminal size={20} style={{ color: themeColors.hex }} />
                  </div>
                  <div>
                    <h4 className={`font-bold mb-1 text-sm uppercase tracking-wider transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>
                      Nota Técnica
                    </h4>
                    <p className={`text-xs italic transition-colors duration-700 ${isDarkMode ? 'text-gray-500' : 'text-black/70'}`}>
                      Este portfolio presenta mis proyectos con distintos niveles de profundidad técnica, permitiendo una revisión general o un análisis más detallado según el interés del lector.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <StatItem value="Chile" label="Residencia" isDarkMode={isDarkMode} />
                <StatItem value="Ingeniero Civil Informático" label="Título Profesional" isDarkMode={isDarkMode} />
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
             <div className={`p-8 border rounded-3xl group transition-colors duration-700 ${isDarkMode ? 'bg-white/[0.02] border-white/5' : 'bg-black/[0.02] border-black/5'}`}>
               <div className="flex items-center gap-4 mb-4">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all ${isDarkMode ? 'bg-white/5 border-white/10 group-hover:border-white/30' : 'bg-black/5 border-black/10 group-hover:border-black/30'}`}>
                    <img src="/logos/Logo_Universidad_san_sebastian.png" alt="USS" className="w-8 h-8 object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                 </div>
                 <div>
                   <h3 className={`font-bold transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>Universidad San Sebastián</h3>
                   <p className="text-xs text-gray-500 uppercase tracking-widest">Sede Concepción</p>
                 </div>
               </div>
               <p className={`text-sm font-light transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-black/70'}`}>
                 Formación en ingeniería de software avanzada, gestión de proyectos y ciencias de la computación.
               </p>
             </div>

             <div className="grid grid-cols-2 gap-4">
               <FeatureBox icon={Cpu} title="Trabajo en Equipo" color={themeColors.hex} isDarkMode={isDarkMode} />
               <FeatureBox icon={Globe} title="Inglés Técnico" color={themeColors.hex} isDarkMode={isDarkMode} />
               <FeatureBox icon={Code2} title="Liderazgo" color={themeColors.hex} isDarkMode={isDarkMode} />
               <FeatureBox icon={Database} title="Gestión Corfo" color={themeColors.hex} isDarkMode={isDarkMode} />
             </div>
          </motion.div>
        </div>

        {/* Anchor point for certificates */}
        <div id="certificaciones-anchor" className="scroll-mt-18" />

        {/* Certificates Carousel */}
        <div id="certificaciones" className="max-w-7xl mx-auto mt-32">
          <div className="flex items-center justify-between gap-4 mb-12">
            <div className="flex items-center gap-4 flex-1">
              <h2 className={`text-2xl font-black uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Certificaciones <span className="text-gray-600">&</span> Logros</h2>
              <div className={`h-px flex-1 ${isDarkMode ? 'bg-white/10' : 'bg-black/10'}`} />
            </div>
            
            <div className="flex items-center gap-3">
               <button 
                onClick={() => animate(x, x.get() + itemWidth, { type: "spring", stiffness: 300, damping: 30 })}
                className={`p-3 border rounded-full transition-all text-white/50 hover:text-white ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-400 hover:text-slate-800'}`}
               >
                 <ArrowLeft size={18} />
               </button>
               <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`p-3 border rounded-full transition-all text-white/50 hover:text-white ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-400 hover:text-slate-800'}`}
               >
                 {isPaused ? <Play size={18} /> : <Pause size={18} />}
               </button>
               <button 
                onClick={() => animate(x, x.get() - itemWidth, { type: "spring", stiffness: 300, damping: 30 })}
                className={`p-3 border rounded-full transition-all text-white/50 hover:text-white ${isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/10 hover:bg-black/10 text-slate-400 hover:text-slate-800'}`}
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
                    isDarkMode={isDarkMode}
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
              className={`border rounded-[3rem] p-8 md:p-16 relative overflow-hidden group transition-colors duration-700 ${
                  isDarkMode ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
              }`}
            >
              {/* Luz de fondo sutil */}
              <div 
                className="absolute -top-24 -right-24 w-64 h-64 blur-[120px] rounded-full opacity-20 transition-colors duration-1000"
                style={{ backgroundColor: themeColors.hex }}
              />

              <div className="flex flex-col lg:flex-row gap-12 items-center justify-between relative z-10">
                <div className="text-center lg:text-left max-w-xl">
                  <span className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-500 mb-4 block">Conectemos</span>
                  <h2 className={`text-4xl md:text-6xl font-black mb-6 tracking-tight uppercase leading-none transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    ¿Buscas <br />
                    <span style={{ color: themeColors.hex }}>Sumar Talento</span> <br />
                    a tu equipo?
                  </h2>
                  <p className={`text-lg font-light leading-relaxed transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                    Estoy disponible. Conversemos sobre cómo puedo integrarme a tu equipo y contribuir en los próximos desafíos.
                  </p>
                </div>

                <div className="flex flex-col gap-4 w-full max-w-sm">
                   <motion.a 
                     href="mailto:subaru0.dev@gmail.com"
                     target="_blank"
                     rel="noopener noreferrer"
                     whileHover={{ x: 8, backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     className={`p-5 border rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors group/link ${
                         isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover/link:scale-110 transition-transform ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                           <Mail size={20} style={{ color: themeColors.hex }} />
                        </div>
                        <div>
                           <h3 className={`font-bold text-sm transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>Gmail</h3>
                           <p className="text-gray-500 text-xs">subaru0.dev@gmail.com</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="text-gray-600 group-hover/link:translate-x-1 transition-transform" />
                   </motion.a>

                   <motion.a 
                     href="https://wa.me/56954971044"
                     target="_blank"
                     rel="noopener noreferrer"
                     whileHover={{ x: 8, backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
                     whileTap={{ scale: 0.98 }}
                     transition={{ type: "spring", stiffness: 400, damping: 25 }}
                     className={`p-5 border rounded-2xl flex items-center justify-between hover:border-white/20 transition-colors group/link ${
                         isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/10'
                     }`}
                   >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center group-hover/link:scale-110 transition-transform ${isDarkMode ? 'bg-white/5' : 'bg-black/5'}`}>
                           <MessageCircle size={20} style={{ color: themeColors.hex }} />
                        </div>
                        <div>
                           <h3 className={`font-bold text-sm transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>WhatsApp</h3>
                           <p className="text-gray-500 text-xs">+56 9 5497 1044</p>
                        </div>
                     </div>
                     <ArrowRight size={16} className="text-gray-600 group-hover/link:translate-x-1 transition-transform" />
                   </motion.a>

                   <div className="grid grid-cols-2 gap-4">
                      <SocialIcon href="https://www.linkedin.com/in/subarudev0/" icon={Linkedin} color={themeColors.hex} title="LinkedIn" isDarkMode={isDarkMode} />
                      <SocialIcon href="https://github.com/SubaruDev0" icon={Github} color={themeColors.hex} title="GitHub" isDarkMode={isDarkMode} />
                   </div>
                </div>
              </div>
            </motion.div>
        </div>
      </section>

      <footer className={`py-20 border-t text-center transition-colors duration-700 ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
        <p className={`text-[10px] font-black uppercase tracking-[0.5em] transition-colors duration-700 ${isDarkMode ? 'text-white/20' : 'text-black/30'}`}>© 2026 SUBARUDEV // J.S.M. SUBARU</p>
      </footer>

      {activeProject && (
        <ProjectModal 
          project={activeProject}
          isOpen={!!activeProject}
          onClose={() => setActiveProject(null)}
          themeColor={themeColors.hex}
          isDarkMode={isDarkMode}
        />
      )}

      {activeCertificate && (
        <CertificateModal 
          certificate={activeCertificate}
          isOpen={!!activeCertificate}
          onClose={() => setActiveCertificate(null)}
          themeColor={themeColors.hex}
          isDarkMode={isDarkMode}
        />
      )}

      <CVModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
        cvUrl={initialSettings.cv_url}
        description={initialSettings.cv_description}
        themeColor={themeColors.hex}
        isDarkMode={isDarkMode}
      />
    </main>
  );
}

function StatItem({ value, label, isDarkMode }: { value: string, label: string, isDarkMode: boolean }) {
  return (
    <div>
      <div className={`text-xl font-bold tracking-tight transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-black'}`}>{value}</div>
      <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</div>
    </div>
  )
}

function FeatureBox({ icon: Icon, title, color, isDarkMode }: { icon: any, title: string, color: string, isDarkMode: boolean }) {
  return (
    <div className={`p-8 border rounded-3xl flex flex-col items-center justify-center gap-4 transition-all group overflow-hidden ${
      isDarkMode ? 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05]' : 'bg-black/[0.02] border-black/5 hover:bg-black/[0.05]'
    }`}>
      <Icon className="transition-transform duration-500 group-hover:scale-110" size={32} style={{ color: color }} />
      <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-700 ${isDarkMode ? 'text-gray-600 group-hover:text-gray-300' : 'text-black/60 group-hover:text-black'}`}>{title}</span>
    </div>
  )
}

function SocialIcon({ href, icon: Icon, color, title, isDarkMode }: { href: string, icon: any, color: string, title: string, isDarkMode: boolean }) {
  return (
    <motion.a 
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -4, backgroundColor: isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)" }}
      whileTap={{ scale: 0.95 }}
      className={`p-4 border rounded-2xl flex flex-col items-center gap-2 transition-colors group/social ${
        isDarkMode ? 'bg-white/5 border-white/10 hover:border-white/20' : 'bg-black/5 border-black/10 hover:border-black/20'
      }`}
    >
      <Icon size={20} style={{ color: color }} />
      <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors duration-700 ${isDarkMode ? 'text-gray-500 group-hover:text-white' : 'text-black/60 group-hover:text-black'}`}>{title}</span>
    </motion.a>
  )
}
