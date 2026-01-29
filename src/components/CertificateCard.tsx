'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Certificate } from '@/types';
import { Award, Maximize2 } from 'lucide-react';
import { removeMarkdown } from '@/utils/text';

interface CertificateCardProps {
  certificate: Certificate;
  themeColor: string;
  onSelect?: (certificate: Certificate) => void;
  isDarkMode?: boolean;
}

export default function CertificateCard({ certificate, themeColor, onSelect, isDarkMode = true }: CertificateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div 
        onClick={() => onSelect?.(certificate)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="certificate-card min-w-[300px] md:min-w-[380px] snap-start group cursor-pointer w-full flex"
      >
        <div className={`border rounded-3xl p-6 transition-all w-full flex flex-col min-h-[420px] ${
          isDarkMode 
            ? 'bg-white/[0.03] border-white/5 hover:border-white/20' 
            : 'bg-black/[0.02] border-black/5 hover:border-black/10'
        }`}>
          <div className={`aspect-video rounded-2xl overflow-hidden mb-6 border relative shrink-0 ${
            isDarkMode ? 'border-white/10 bg-black/50' : 'border-black/5 bg-slate-100'
          }`}>
            <img 
              src={certificate.imageUrl} 
              alt={certificate.title} 
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isDarkMode ? 'opacity-60 group-hover:opacity-100' : 'opacity-90 group-hover:opacity-100'
              }`}
            />
            <div className="absolute top-4 left-4">
              <div className={`backdrop-blur-md border px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                isDarkMode ? 'bg-black/60 border-white/10 text-white' : 'bg-white/80 border-black/5 text-slate-800'
              }`}>
                {certificate.academy}
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className={`backdrop-blur-md p-3 rounded-full animate-zoom-in ${
                isDarkMode ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
              }`}>
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
          
          <h3 
            className={`text-lg font-bold mb-2 transition-colors duration-500 uppercase tracking-tight ${isDarkMode ? '' : 'text-slate-900'}`}
            style={{ color: isHovered ? themeColor : (isDarkMode ? 'white' : undefined) }}
          >
            {certificate.title}
          </h3>
          
          <p className={`text-sm mb-6 flex-1 font-light line-clamp-3 leading-relaxed transition-colors duration-700 ${
            isDarkMode ? 'text-gray-500' : 'text-slate-600'
          }`}>
            {removeMarkdown(certificate.description || "")}
          </p>
          
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className={isDarkMode ? 'text-gray-600' : 'text-slate-400'}>{certificate.date}</span>
            <Award size={16} style={{ color: themeColor }} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
