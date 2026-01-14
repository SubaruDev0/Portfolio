'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Project } from '@/types';
import { Github, ExternalLink, Code, Maximize2, Star, Briefcase, Info, CheckCircle } from 'lucide-react';
import ProjectModal from './ProjectModal';
import TechBadge from './TechBadge';

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
    research: 'Research',
    other: 'Other'
  };

  return (
    <>
      <motion.div
        style={{ viewTransitionName: `card-${project.id}` } as any}
        onClick={() => onSelect?.(project)}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        className={`group relative bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden hover:border-white/30 transition-all cursor-pointer ${className}`}
      >
        {/* Badge de Categoría y Real World */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest backdrop-blur-md border bg-white/5 border-white/10 text-gray-400">
            {categoryLabels[project.category] || project.category}
          </span>
          
          {project.isRealWorld && (
            <div className="group/real relative">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 backdrop-blur-md">
                <Briefcase size={10} fill="currentColor" /> Proyecto en Producción
              </div>
              
              {/* Tooltip Contextual */}
              <div className="absolute left-0 top-full mt-2 w-48 p-3 bg-black/95 backdrop-blur-xl border border-white/10 rounded-xl text-[10px] leading-relaxed text-gray-300 opacity-0 group-hover/real:opacity-100 transition-opacity pointer-events-none shadow-2xl z-50">
                <p className="font-bold text-emerald-400 mb-1 flex items-center gap-1">
                   <CheckCircle size={10} /> Calidad Industrial
                </p>
                Este sistema ha sido validado en un entorno de producción real, resolviendo necesidades operativas con altos estándares de fiabilidad y rendimiento.
              </div>
            </div>
          )}
        </div>

        {project.isStarred && (
          <div className="absolute top-4 right-4 z-20 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/50 p-1.5 rounded-full text-yellow-500 animate-pulse">
            <Star size={14} fill="currentColor" />
          </div>
        )}
        <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${themeColor} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
        
        <div className="aspect-video w-full bg-[#111] relative overflow-hidden">
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/10">
              <Code size={48} />
            </div>
          )}
          
          {/* Overlay suave al hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white animate-zoom-in">
              <Maximize2 size={24} />
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
            <div className="flex gap-2">
              {project.technologies.slice(0, 3).map((tech, i) => (
                <div key={tech} className={`animate-zoom-in animate-delay-[${i * 100}ms]`}>
                  <TechBadge name={tech} showName={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{project.title}</h3>
          <p className="text-gray-400 text-sm mb-6 line-clamp-2">{project.description}</p>
          
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
