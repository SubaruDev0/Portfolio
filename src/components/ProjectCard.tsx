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
  isDarkMode?: boolean;
  priority?: boolean;
}

export default function ProjectCard({ project, themeColor, className = "", onSelect, isDarkMode = true, priority = false }: ProjectCardProps) {
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
        className={`project-card group relative border rounded-3xl overflow-hidden transition-all duration-500 cursor-pointer ${className} ${
          isDarkMode 
            ? 'bg-[#0a0a0a] border-white/10 hover:border-white/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]' 
            : 'bg-white border-black/5 hover:border-black/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]'
        }`}
      >
        {/* Badge de Categoría y Real World */}
        <div className="absolute top-4 left-4 z-40 flex flex-col gap-2">
          <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md border transition-all duration-500 shadow-2xl min-h-[26px] ${
            isDarkMode
              ? 'bg-black/40 border-white/20 text-white/70 group-hover:bg-black/90 group-hover:border-white/40 group-hover:text-white'
              : 'bg-white/40 border-black/10 text-slate-800 shadow-slate-200/50 group-hover:bg-white/90 group-hover:border-black/20'
          }`}>
            {categoryLabels[project.category] || project.category}
          </span>
          
          {project.isRealWorld && (
            <div className="group/real relative">
              <div className={`inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 shadow-2xl backdrop-blur-md min-h-[26px] ${
                isDarkMode
                  ? 'bg-black/80 border-emerald-500/50 text-emerald-400 group-hover:bg-black group-hover:border-emerald-400'
                  : 'bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-100 group-hover:border-emerald-300 shadow-emerald-100/50'
              }`}>
                <Briefcase size={10} fill="currentColor" /> Producción
              </div>
              
              {/* Tooltip Contextual - Elevado con z-50 */}
              <div className={`absolute left-0 top-full mt-2 w-48 p-3 backdrop-blur-xl border rounded-xl text-[10px] leading-relaxed opacity-0 group-hover/real:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] z-50 translate-y-2 group-hover/real:translate-y-0 ${
                isDarkMode ? 'bg-black/95 border-white/20 text-gray-300' : 'bg-white border-black/10 text-slate-600'
              }`}>
                <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1 uppercase tracking-tighter">
                   <CheckCircle size={10} /> Calidad Industrial
                </p>
                Este sistema ha sido validado en un entorno de producción real, resolviendo necesidades operativas con altos estándares de fiabilidad y rendimiento.
              </div>
            </div>
          )}
        </div>

        {project.isStarred && (
          <div className="absolute top-4 right-4 z-40">
            <div className={`backdrop-blur-md border p-1.5 rounded-full shadow-[0_0_15px_rgba(234,179,8,0.2)] transition-all duration-500 ${
              isDarkMode
                ? 'bg-yellow-500/20 border-yellow-500/40 text-yellow-500 group-hover:bg-yellow-500/40 group-hover:border-yellow-500'
                : 'bg-yellow-100 border-yellow-300 text-yellow-600 group-hover:bg-yellow-200'
            }`}>
              <Star size={14} fill="currentColor" />
            </div>
          </div>
        )}
        
        {/* Top accent line */}
        <div 
          className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity z-30" 
          style={{ background: `linear-gradient(to right, transparent, ${themeColor}, transparent)` }}
        />
        
        <div className={`aspect-video w-full relative overflow-hidden ${isDarkMode ? 'bg-[#0a0a0a]' : 'bg-slate-100'}`}>
          {project.imageUrl ? (
            <img 
              src={project.imageUrl} 
              alt={project.title} 
              loading={priority ? "eager" : "lazy"}
              decoding={priority ? "sync" : "async"}
              fetchPriority={priority ? "high" : "auto"}
              className="w-full h-full object-cover block scale-[1.01] transform-gpu group-hover:scale-110 group-hover:brightness-110 transition-all duration-700 ease-out" 
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${isDarkMode ? 'text-white/5' : 'text-black/5'}`}>
              <Code size={48} />
            </div>
          )}
          
          {/* Action indicator - clean and pronounced */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
            <div className={`backdrop-blur-md p-4 rounded-full scale-90 group-hover:scale-100 transition-all duration-500 border shadow-[0_0_30px_rgba(0,0,0,0.1)] ${
              isDarkMode ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black border-black/10'
            }`}>
              <Maximize2 size={24} strokeWidth={1.5} />
            </div>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between z-20">
            <div className="flex gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <div key={tech} className="transition-all duration-700 group-hover:scale-110 active:scale-95">
                  <TechBadge 
                    name={tech} 
                    showName={false} 
                    variant="small"
                    isDarkMode={isDarkMode}
                  />
                </div>
              ))}
              {project.technologies.length > 3 && (
                <div className={`flex items-center justify-center px-2 py-0.5 backdrop-blur-md border rounded-xl text-[9px] font-black transition-all duration-700 ${
                  isDarkMode 
                    ? 'bg-black/60 border-white/10 text-white group-hover:bg-black group-hover:border-white/30'
                    : 'bg-white/60 border-black/5 text-slate-800 group-hover:bg-white group-hover:border-black/20'
                }`}>
                  +{project.technologies.length - 3}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className={`text-xl font-bold mb-2 transition-colors duration-700 ${isDarkMode ? 'text-white group-hover:text-white' : 'text-slate-900 group-hover:text-black'}`} style={{ color: !isDarkMode && themeColor ? themeColor : undefined } as any}>{project.title}</h3>
          <p className={`text-sm mb-6 line-clamp-2 leading-relaxed transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
            {removeMarkdown(project.description)}
          </p>
          
          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`transition-colors hover:animate-shake ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                <Github size={20} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className={`transition-colors hover:animate-shake ${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}>
                <ExternalLink size={20} />
              </a>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}
