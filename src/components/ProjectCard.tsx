'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { Github, ExternalLink, Code, Maximize2, Star, Briefcase, Info, CheckCircle } from 'lucide-react';
import TechBadge from './TechBadge';
import { removeMarkdown } from '@/utils/text';

interface ProjectCardProps {
  project: Project;
  themeColor: string;
  className?: string;
  onSelect?: (project: Project) => void;
}

export default function ProjectCard({ project, themeColor, className = "", onSelect }: ProjectCardProps) {
  const categoryLabels: Record<string, string> = {
    frontend: 'Front-end',
    backend: 'Back-end',
    fullstack: 'Full-stack',
    research: 'Investigación',
    other: 'Otros'
  };

  return (
    <>
      <motion.div
        style={{ viewTransitionName: `card-${project.id}` } as any}
        onClick={() => onSelect?.(project)}
        whileHover={{ y: -12, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-white/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-all duration-500 cursor-pointer ${className}`}
      >
        {/* Badge de Categoría y Real World */}
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
          <span className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border bg-black/40 border-white/20 text-white/70 group-hover:bg-black/90 group-hover:border-white/40 group-hover:text-white transition-all duration-500 shadow-2xl">
            {categoryLabels[project.category] || project.category}
          </span>
          
          {project.isRealWorld && (
            <div className="group/real relative">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-black/80 border border-emerald-500/50 text-emerald-400 group-hover:bg-black group-hover:border-emerald-400 transition-all duration-500 shadow-2xl backdrop-blur-md">
                <Briefcase size={10} fill="currentColor" /> Producción
              </div>
              
              {/* Tooltip Contextual - Elevado con z-50 */}
              <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl text-[10px] leading-relaxed text-gray-300 opacity-0 group-hover/real:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 translate-y-2 group-hover/real:translate-y-0">
                <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                   <CheckCircle size={10} /> Calidad Industrial
                </p>
                Este sistema ha sido validado en un entorno de producción real, resolviendo necesidades operativas con altos estándares de fiabilidad y rendimiento.
              </div>
            </div>
          )}
        </div>

        {project.isStarred && (
          <div className="absolute top-4 right-4 z-40 group/starred">
            <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-500/40 p-1.5 rounded-full text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)] group-hover:bg-yellow-500/40 group-hover:border-yellow-500 transition-all duration-500 cursor-help">
              <Star size={14} fill="currentColor" />
            </div>
            
            {/* Tooltip Destacado */}
            <div className="absolute right-0 top-full mt-2 px-2 py-1 bg-black/95 border border-white/20 rounded-lg text-[10px] uppercase tracking-widest text-white opacity-0 group-hover/starred:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap z-50">
              Destacado
            </div>
          </div>
        )}
        
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity z-30" 
          style={{ background: `linear-gradient(to right, transparent, ${themeColor}, transparent)` }}
        />
        
        <div className="aspect-video w-full bg-[#0a0a0a] relative overflow-hidden">
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              className="w-full h-full object-cover block scale-[1.01] transform-gpu group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/5">
              <Code size={48} />
            </div>
          )}
          
          {/* Action indicator - clean and pronounced */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-4 rounded-full text-white scale-90 group-hover:scale-100 transition-all duration-500 border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <Maximize2 size={24} strokeWidth={1.5} />
            </div>
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between z-20">
            <div className="flex gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <div key={tech} className="transition-all duration-700 group-hover:scale-110 active:scale-95">
                  <TechBadge 
                    name={tech} 
                    showName={false} 
                  />
                </div>
              ))}
              {project.technologies.length > 3 && (
                <div className="flex items-center justify-center px-2 py-1 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-[10px] font-black text-white group-hover:text-white transition-all duration-700 group-hover:bg-black group-hover:border-white/30">
                  +{project.technologies.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-6 line-clamp-2 leading-relaxed">
            {removeMarkdown(project.description)}
          </p>
          
          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:animate-shake transition-colors">
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white hover:animate-shake transition-colors">
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
