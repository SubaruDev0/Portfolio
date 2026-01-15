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
}

export default function ProjectModal({ project, isOpen, onClose, themeColor }: ProjectModalProps) {
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
        className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div 
        className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col lg:flex-row h-full max-h-[90vh] z-10"
        style={{ boxShadow: `0 0 50px ${themeColor}20` }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all active:scale-95"
        >
          <X size={24} />
        </button>

        {/* Lado Izquierdo: Visualizador de Galería */}
        <div className="w-full lg:w-[63%] bg-[#050505] flex flex-col p-4 lg:p-8 overflow-hidden h-full">
          <div className="flex-1 relative rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center">
            {activeImage ? (
              <img 
                src={activeImage} 
                alt={project.title} 
                className="w-full h-full object-contain animate-blurred-fade-in"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/5 space-y-4">
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
                  className={`relative shrink-0 w-24 aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImage === img ? 'border-emerald-500 scale-105' : 'border-white/10 hover:border-white/30'}`}
                >
                  <img src={img as string} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Lado Derecho: Contenido */}
        <div className="w-full lg:w-[37%] p-8 lg:p-10 overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0a0a0a] flex flex-col focus:outline-none">
          <div className="mb-8 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span 
                className="text-[10px] font-black uppercase tracking-[0.3em] block px-3 py-1.5 bg-white/5 rounded-xl border border-white/10"
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
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] bg-black/80 border border-emerald-500/50 text-emerald-400 hover:bg-black hover:border-emerald-400 transition-all cursor-help shadow-lg backdrop-blur-md">
                    <Briefcase size={10} fill="currentColor" /> Producción
                  </div>
                  
                  {/* Tooltip en el Modal */}
                  <div className="absolute left-0 top-full mt-2 w-64 p-4 bg-[#0a0a0a]/95 backdrop-blur-xl border border-white/20 rounded-2xl text-[11px] leading-relaxed text-gray-300 opacity-0 group-hover/real:opacity-100 transition-all duration-300 pointer-events-none shadow-2xl z-50 translate-y-2 group-hover/real:translate-y-0">
                    <p className="font-bold text-emerald-400 mb-2 flex items-center gap-1 uppercase tracking-tight">
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

            <h2 className="text-4xl font-black text-white mb-6 tracking-tighter leading-tight italic">
              {project.title}
            </h2>
            <div className="w-20 h-1 rounded-full mb-8" style={{ backgroundColor: themeColor }} />

            {/* UX: Stack y Botones primero para acción rápida */}
            <div className="mb-10 space-y-8">
              <div>
                <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Stack Tecnológico</h4>
                <div className="flex flex-wrap gap-2.5">
                  {project.technologies.map((tech) => (
                    <TechBadge key={tech} name={tech} />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {project.liveUrl && (
                  <a 
                    href={project.liveUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-black font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/50"
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
                    className="flex items-center justify-center gap-3 w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all active:scale-[0.98]"
                  >
                    <Github size={20} /> Ver Código Fuente
                  </a>
                )}
              </div>
            </div>
            
            {/* Descripción después de los elementos de acción */}
            <div className="pt-10 border-t border-white/5">
              <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-6">Sobre el proyecto</h4>
              <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-light prose-headings:text-white prose-strong:text-emerald-400 prose-a:text-cyan-400 italic leading-relaxed">
                <ReactMarkdown>
                  {project.description}
                </ReactMarkdown>
              </div>
            </div>

            {project.isRealWorld && (
              <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl animate-fade-in ring-1 ring-emerald-500/5">
                <p className="text-[10px] text-emerald-400/80 leading-relaxed font-bold uppercase tracking-wider">
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
