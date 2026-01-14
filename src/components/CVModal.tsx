'use client';

import React from 'react';
import { X, Download, Mail, MessageCircle } from 'lucide-react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string;
  description?: string;
  themeColor: string;
}

export default function CVModal({ isOpen, onClose, cvUrl, description, themeColor }: CVModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      
      {/* Container */}
      <div 
        className="relative w-full max-w-4xl bg-[#0a0a0a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-zoom-in z-10 flex flex-col md:flex-row max-h-[90vh]"
        style={{ boxShadow: `0 0 50px ${themeColor}20` }}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-white/10 rounded-full text-white/50 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        {/* Preview (Left) */}
        <div className="w-full md:w-1/2 bg-black flex flex-col h-[400px] md:h-auto overflow-hidden">
          {cvUrl ? (
            <iframe 
              src={`${cvUrl}#toolbar=0`} 
              className="w-full h-full border-none"
              title="CV Preview"
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-white/10 p-12 text-center">
              <Download size={64} className="mb-4" />
              <p className="text-sm uppercase tracking-widest font-bold">Vista previa no disponible</p>
            </div>
          )}
        </div>

        {/* Details (Right) */}
        <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-[#0a0a0a] border-l border-white/5">
          <div>
            <h2 className="text-3xl font-black text-white mb-6 tracking-tight uppercase">Mi <span style={{ color: themeColor }}>Curriculum</span></h2>
            <p className="text-gray-400 leading-relaxed mb-8 font-light italic">
              {description || "Este es mi CV general. Si necesitas uno más específico para un rol particular, no dudes en contactarme."}
            </p>

            <div className="space-y-4 mb-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-4">Contacto Directo</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:subaru0.dev@gmail.com"
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm group"
                >
                  <Mail size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white">Gmail</span>
                </a>
                <a 
                  href="https://wa.me/56954971044"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm group"
                >
                  <MessageCircle size={16} className="text-gray-400 group-hover:text-white transition-colors" />
                  <span className="text-gray-300 group-hover:text-white">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <a 
            href={cvUrl}
            download="CV_SubaruDev.pdf"
            className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
            style={{ backgroundColor: themeColor, color: '#000' }}
          >
            <Download size={20} />
            Descargar PDF Real
          </a>
        </div>
      </div>
    </div>
  );
}
