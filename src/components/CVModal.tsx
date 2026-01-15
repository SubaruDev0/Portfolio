'use client';

import React from 'react';
import { X, Download, Mail, MessageCircle, Maximize2 } from 'lucide-react';

interface CVModalProps {
  isOpen: boolean;
  onClose: () => void;
  cvUrl?: string;
  description?: string;
  themeColor: string;
  isDarkMode?: boolean;
}

export default function CVModal({ isOpen, onClose, cvUrl, description, themeColor, isDarkMode = true }: CVModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className={`absolute inset-0 backdrop-blur-sm animate-fade-in transition-colors duration-700 ${isDarkMode ? 'bg-black/90' : 'bg-slate-100/80'}`}
        onClick={onClose}
      />
      
      {/* Container */}
      <div 
        className={`relative w-full max-w-4xl border rounded-3xl overflow-hidden shadow-2xl animate-zoom-in z-10 flex flex-col md:flex-row max-h-[90vh] transition-colors duration-700 ${
            isDarkMode ? 'bg-[#0a0a0a] border-white/10' : 'bg-white border-black/5'
        }`}
        style={{ boxShadow: `0 0 50px ${themeColor}${isDarkMode ? '20' : '10'}` }}
      >
        <button 
          onClick={onClose}
          className={`absolute top-4 right-4 z-50 p-2 rounded-full transition-all ${
              isDarkMode ? 'bg-black/50 hover:bg-white/10 text-white/50 hover:text-white' : 'bg-white/50 hover:bg-black/5 text-slate-400 hover:text-slate-900'
          }`}
        >
          <X size={20} />
        </button>

        {/* Preview (Left) */}
        <div className={`w-full md:w-1/2 flex flex-col h-[400px] md:h-auto overflow-hidden transition-colors duration-700 ${isDarkMode ? 'bg-black' : 'bg-slate-50'}`}>
          {cvUrl ? (
            <iframe 
              src={`${cvUrl}#toolbar=0&navpanes=0&scrollbar=0`} 
              className="w-full h-full border-none pointer-events-none"
              title="CV Preview"
              loading="lazy"
            />
          ) : (
            <div className={`flex-1 flex flex-col items-center justify-center p-12 text-center ${isDarkMode ? 'text-white/10' : 'text-black/10'}`}>
              <Download size={64} className="mb-4" />
              <p className="text-sm uppercase tracking-widest font-bold">Vista previa no disponible</p>
            </div>
          )}
        </div>

        {/* Details (Right) */}
        <div className={`w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between border-l transition-colors duration-700 ${
            isDarkMode ? 'bg-[#0a0a0a] border-white/5' : 'bg-white border-black/5'
        }`}>
          <div>
            <h2 className={`text-3xl font-black mb-6 tracking-tight uppercase transition-colors duration-700 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Mi <span style={{ color: themeColor }}>Curriculum</span></h2>
            <p className={`leading-relaxed mb-8 font-light italic transition-colors duration-700 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              {description || "Este es mi CV general. Si necesitas uno más específico para un rol particular, no dudes en contactarme."}
            </p>

            <div className="space-y-4 mb-10">
              <p className={`text-[10px] font-black uppercase tracking-widest mb-4 ${isDarkMode ? 'text-gray-500' : 'text-slate-400'}`}>Contacto Directo</p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="mailto:subaru0.dev@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all text-sm group ${
                      isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/5 hover:bg-black/10'
                  }`}
                >
                  <Mail size={16} className={`transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                  <span className={`transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>Gmail</span>
                </a>
                <a 
                  href="https://wa.me/56954971044"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 px-4 py-2 border rounded-xl transition-all text-sm group ${
                      isDarkMode ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-black/5 border-black/5 hover:bg-black/10'
                  }`}
                >
                  <MessageCircle size={16} className={`transition-colors ${isDarkMode ? 'text-gray-400 group-hover:text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
                  <span className={`transition-colors ${isDarkMode ? 'text-gray-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <a 
              href={cvUrl}
              download="CV_SubaruDev.pdf"
              className="w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl"
              style={{ backgroundColor: themeColor, color: '#000' }}
            >
              <Download size={20} />
              Descargar PDF
            </a>
            
            {cvUrl && (
              <button 
                onClick={() => {
                  const win = window.open();
                  if (win) {
                    win.document.write(`<iframe src="${cvUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`);
                    win.document.title = "CV SubaruDev - Previsualización";
                  }
                }}
                className={`w-full py-3 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all border ${
                  isDarkMode 
                    ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' 
                    : 'bg-black/5 border-black/10 text-slate-800 hover:bg-black/10'
                }`}
              >
                <Maximize2 size={18} />
                Vista Pantalla Completa
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
