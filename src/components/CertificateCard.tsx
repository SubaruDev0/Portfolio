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
}

export default function CertificateCard({ certificate, themeColor, onSelect }: CertificateCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <motion.div 
        onClick={() => onSelect?.(certificate)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.98 }}
        className="min-w-[300px] md:min-w-[380px] snap-start group cursor-pointer w-full flex"
      >
        <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 hover:border-white/20 transition-all w-full flex flex-col min-h-[420px]">
          <div className="aspect-video rounded-2xl overflow-hidden mb-6 border border-white/10 bg-black/50 relative shrink-0">
            <img 
              src={certificate.imageUrl} 
              alt={certificate.title} 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4">
              <div className="bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-widest">
                {certificate.academy}
              </div>
            </div>
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white animate-zoom-in">
                <Maximize2 size={24} />
              </div>
            </div>
          </div>
          
          <h3 
            className="text-lg font-bold mb-2 transition-colors duration-500 uppercase tracking-tight"
            style={{ color: isHovered ? themeColor : 'white' }}
          >
            {certificate.title}
          </h3>
          
          <p className="text-sm text-gray-500 mb-6 flex-1 font-light line-clamp-3 leading-relaxed">
            {removeMarkdown(certificate.description || "")}
          </p>
          
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em]">
            <span className="text-gray-600">{certificate.date}</span>
            <Award size={16} style={{ color: themeColor }} />
          </div>
        </div>
      </motion.div>
    </>
  );
}
