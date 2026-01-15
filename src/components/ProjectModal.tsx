'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Project } from '@/types';
import { X, Github, ExternalLink, Code, Star, Briefcase, CheckCircle } from 'lucide-react';
import TechBadge from './TechBadge';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
  isDarkMode?: boolean;
}

export default function ProjectModal({ project, isOpen, onClose, themeColor, isDarkMode = true }: ProjectModalProps) {
  const [activeImage, setActiveImage] = React.useState(project.imageUrl);

  // Sincronizar activeImage cuando el proyecto cambia o se abre el modal
  React.useEffect(() => {
    if (isOpen) {
      setActiveImage(project.imageUrl);
    }
  }, [project.imageUrl, isOpen]);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      {/* Overlay con blur dinámico */}
      <div 
        className={`absolute inset-0 backdrop-blur-xl animate-fade-in transition-colors duration-700 ${isDarkMode ? 'bg-black/95' : 'bg-slate-100/90'}`}
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className={`relative w-full max-w-6xl border rounded-3xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col lg:flex-row h-full max-h-[90vh] z-10 transition-colors duration-700 ${
          isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5'
        }`}
        style={{ boxShadow: `0 0 50px ${themeColor}${isDarkMode ? '20' : '10'}` }}
      >
        <button 
          onClick={onClose}
          className={`absolute top-6 right-6 z-50 p-2 rounded-full transition-all active:scale-95 ${
            isDarkMode ? 'bg-black/50 hover:bg-white/10 text-white/50 hover:text-white' : 'bg-white/50 hover:bg-black/5 text-slate-400 hover:text-slate-900'
          }`}
        >
          <X size={24} />
        </button>

        {/* Lado Izquierdo: Visualizador de Galería */}
        <div className={`w-full lg:w-[63%] flex flex-col p-4 lg:p-8 overflow-hidden h-full transition-colors duration-700 ${
          isDarkMode ? 'bg-[#050505]' : 'bg-slate-50'
        }`}>
          <div className={`flex-1 relative rounded-2xl overflow-hidden flex items-center justify-center transition-colors duration-700 ${
            isDarkMode ? 'bg-[#111]' : 'bg-white shadow-inner'
          }`}>
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={project.title} 
                className="w-full h-full object-contain animate-blurred-fade-in"
              />
            ) : (
              <div className={`w-full h-full flex flex-col items-center justify-center space-y-4 ${isDarkMode ? 'text-white/5' : 'text-black/5'}`}>
                <Code size={100} strokeWidth={1} />
                <span className="text-xs uppercase tracking-[0.5em]">Sin Previsualización</span>
              </div>
            )}
          </div>

          {/* Miniaturas de la galería */}
          {(project.gallery && project.gallery.length > 0) && (
            <div className="flex gap-4 mt-6 overflow-x-auto pb-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden shrink-0">
              {[project.imageUrl, ...(project.gallery || [])].filter(Boolean).map((img, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveImage(img as string)}
                  className={`relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === img 
                      ? 'border-emerald-500 scale-105' 
                      : (isDarkMode ? 'border-white/10 hover:border-white/30' : 'border-black/5 hover:border-black/20')
                  }`}
                >
                  <img src={img as string} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Derecho: Contenido */}
        <div className={`w-full lg:w-[37%] p-8 lg:p-10 overflow-y-auto border-t lg:border-t-0 lg:border-l flex flex-col focus:outline-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden transition-colors duration-700 ${
          isDarkMode ? 'border-white/10 bg-[#0a0a0a]' : 'border-black/5 bg-white'
        }`}>
          <div className="mb-8 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span 
                className={`inline-flex items-center justify-center text-[10px] font-black uppercase tracking-[0.3em] px-3 py-1.5 rounded-xl border min-h-[26px] ${
                  isDarkMode ? 'bg-white/5 border-white/10' : 'bg-black/5 border-black/5'
                }`}
                style={{ color: themeColor }}
              >
                {project.category === 'other' ? 'OTROS' : 
                 project.category === 'research' ? 'INVESTIGACIÓN' : 
                 project.category === 'frontend' ? 'FRONT-END' :
                 project.category === 'backend' ? 'BACK-END' :
                 'FULL-STACK'}
              </span>
              
              {project.isRealWorld && (
                <div className="group/real relative">
                  <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border transition-all cursor-help shadow-lg backdrop-blur-md min-h-[26px] ${
                    isDarkMode 
                      ? 'bg-black/80 border-emerald-500/50 text-emerald-400 hover:border-emerald-400'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100 hover:border-emerald-300'
                  }`}>
                    <Briefcase size={10} fill="currentColor" /> Producción
                  </div>
                  
                  {/* Tooltip en el Modal */}
                  <div className={`absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 p-4 border rounded-2xl text-[11px] leading-relaxed opacity-0 group-hover/real:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-50 translate-y-2 group-hover/real:translate-y-0 ${
                    isDarkMode ? 'bg-[#0a0a0a]/95 border-white/20 text-gray-300' : 'bg-white border-black/10 text-slate-600'
                  }`}>
                    <p className="font-bold text-emerald-500 mb-2 flex items-center gap-1 uppercase tracking-tight">
                       <CheckCircle size={12} /> Calidad Industrial
                    </p>
                    Este sistema ha sido validado en un entorno de producción real, resolviendo necesidades operativas con altos estándares de fiabilidad y rendimiento.
                  </div>
                </div>
              )}
              
              {project.isStarred && (
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-500 flex items-center gap-1">
                  <Star size= {10} fill="currentColor" /> Destacado
                </span>
              )}
            </div>

            <h2 className={`text-4xl font-black mb-6 tracking-tighter leading-tight italic transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {project.title}
            </h2>
            <div className="w-20 h-1 rounded-full mb-8" style={{ backgroundColor: themeColor }} />

            {/* UX: Stack y Botones primero para acción rápida */}
            <div className="mb-10 space-y-8">
              <div>
                <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Stack Tecnológico</h4>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} isDarkMode={isDarkMode} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-white font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/20"
                    style={{ backgroundColor: themeColor }}
                  >
                    <ExternalLink size={20} /> Ver Demo en Vivo
                  </a>
                )}
                {project.githubUrl && (
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-3 w-full py-4 border rounded-xl font-bold transition-all active:scale-[0.98] ${
                      isDarkMode ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-slate-50 hover:bg-slate-100 border-black/5 text-slate-800'
                    }`}
                  >
                    <Github size={20} /> Ver Código Fuente
                  </a>
                )}
              </div>
            </div>
            
            {/* Descripción después de los elementos de acción */}
            <div className={`pt-10 border-t ${isDarkMode ? 'border-white/5' : 'border-black/5'}`}>
              <h4 className={`text-[10px] font-bold uppercase tracking-widest mb-6 ${isDarkMode ? 'text-white/30' : 'text-slate-400'}`}>Sobre el proyecto</h4>
              <div className={`prose-sm max-w-none font-light italic leading-relaxed transition-colors duration-700 ${
                isDarkMode 
                  ? 'prose prose-invert text-gray-400 prose-headings:text-white prose-strong:text-emerald-400 prose-a:text-cyan-400' 
                  : 'prose text-slate-600 prose-headings:text-slate-900 prose-strong:text-emerald-600 prose-a:text-cyan-600'
              }`}>
                <ReactMarkdown>
                  {project.description}
                </ReactMarkdown>
              </div>
            </div>

            {project.isRealWorld && (
              <div className={`mt-8 p-4 border rounded-2xl animate-fade-in ring-1 ${
                isDarkMode ? 'bg-emerald-500/5 border-emerald-500/10 ring-emerald-500/5' : 'bg-emerald-50 border-emerald-200 ring-emerald-100'
              }`}>
                <p className={`text-[10px] leading-relaxed font-bold uppercase tracking-wider ${isDarkMode ? 'text-emerald-400/80' : 'text-emerald-600'}`}>
                  <CheckCircle size={10} className="inline mr-2" />
                  Calidad Industrial Validada
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
