'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Certificate } from '@/types';
import { X, Award, ExternalLink, Download } from 'lucide-react';

interface CertificateModalProps {
  certificate: Certificate;
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
}

export default function CertificateModal({ certificate, isOpen, onClose, themeColor }: CertificateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fade-in"
        onClick={onClose}
      />
      
      <div 
        className="relative w-full max-w-5xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-zoom-in flex flex-col lg:flex-row max-h-[90vh] z-10"
        style={{ boxShadow: `0 0 50px ${themeColor}20` }}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all active:scale-95"
        >
          <X size={24} />
        </button>

        {/* Lado Izquierdo: Certificado */}
        <div className="w-full lg:w-[60%] bg-[#050505] flex items-center justify-center p-4 lg:p-8">
          <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#111] flex items-center justify-center border border-white/5 shadow-inner">
            {certificate.imageUrl ? (
              <img 
                src={certificate.imageUrl} 
                alt={certificate.title} 
                className="w-full h-full object-contain animate-blurred-fade-in"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-white/5 space-y-4">
                <Award size={100} strokeWidth={1} />
                <span className="text-xs uppercase tracking-[0.5em]">Sin Previsualización</span>
              </div>
            )}
          </div>
        </div>

        {/* Lado Derecho: Contenido */}
        <div className="w-full lg:w-[40%] p-8 lg:p-12 overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-[#0a0a0a] flex flex-col">
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block px-3 py-1 bg-white/5 rounded border border-white/10 text-gray-400">
                {certificate.academy}
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] block px-3 py-1 bg-white/5 rounded border border-white/10 text-gray-600">
                {certificate.date}
              </span>
            </div>

            <h2 className="text-3xl font-black text-white mb-6 tracking-tighter leading-tight italic uppercase">
              {certificate.title}
            </h2>
            <div className="w-16 h-1 rounded-full mb-10" style={{ backgroundColor: themeColor }} />
            
            <div className="prose prose-invert prose-sm max-w-none space-y-4 text-gray-400 font-light mb-10 prose-headings:text-white prose-strong:text-white">
              <ReactMarkdown>
                {certificate.description || "Este certificado valida las competencias adquiridas en el área técnica especificada."}
              </ReactMarkdown>
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-auto">
             <button 
                onClick={() => window.open(certificate.imageUrl, '_blank')}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl text-black font-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-black/50"
                style={{ backgroundColor: themeColor }}
              >
                <ExternalLink size={20} /> Ver Imagen Full HD
              </button>
              
              <a 
                href={certificate.imageUrl} 
                download={`${certificate.title.replace(/\s+/g, '_')}_SubaruDev`}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-widest transition-all"
              >
                <Download size={18} /> Descargar Archivo
              </a>
          </div>
        </div>
      </div>
    </div>
  );
}
