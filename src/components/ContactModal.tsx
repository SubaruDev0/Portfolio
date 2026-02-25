'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeColor: string;
  isDarkMode?: boolean;
}

export default function ContactModal({ isOpen, onClose, themeColor, isDarkMode = true }: ContactModalProps) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      });
      if (res.ok) {
        setStatus('sent');
        setEmail('');
        setSubject('');
        setMessage('');
        setName('');
        setPhone('');
      } else {
        throw new Error('send failed');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl z-20 transition-colors duration-700 ${
              isDarkMode ? 'bg-[#0a0a0a] text-white' : 'bg-white text-black'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <h2 className={`text-2xl font-black mb-4 ${isDarkMode ? 'text-white' : 'text-black'}`}>
              Contáctame
            </h2>
            {status === 'sent' && (
              <div className="mb-4 text-green-400 font-bold">Mensaje enviado correctamente.</div>
            )}
            {status === 'error' && (
              <div className="mb-4 text-red-400 font-bold">Error al enviar, intenta de nuevo.</div>
            )}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tu Nombre <span className="text-red-500 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    placeholder="Ej: Juan Pérez"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-white/10 placeholder:text-gray-600' 
                        : 'bg-black/5 border-black/10 text-black focus:border-black/20 focus:ring-black/10 placeholder:text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Tu Correo <span className="text-red-500 font-black">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="juan@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-white/10 placeholder:text-gray-600' 
                        : 'bg-black/5 border-black/10 text-black focus:border-black/20 focus:ring-black/10 placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Teléfono <span className="text-gray-500 lowercase font-normal italic">(opcional)</span>
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    placeholder="+56 9 ..."
                    onChange={(e) => setPhone(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-white/10 placeholder:text-gray-600' 
                        : 'bg-black/5 border-black/10 text-black focus:border-black/20 focus:ring-black/10 placeholder:text-gray-400'
                    }`}
                  />
                </div>
                <div>
                  <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Asunto <span className="text-red-500 font-black">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Motivo del contacto"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 ${
                      isDarkMode 
                        ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-white/10 placeholder:text-gray-600' 
                        : 'bg-black/5 border-black/10 text-black focus:border-black/20 focus:ring-black/10 placeholder:text-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold mb-2 uppercase tracking-wider ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Mensaje <span className="text-red-500 font-black">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="¿En qué puedo ayudarte?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none focus:ring-2 resize-none ${
                    isDarkMode 
                      ? 'bg-white/5 border-white/10 text-white focus:border-white/20 focus:ring-white/10 placeholder:text-gray-600' 
                      : 'bg-black/5 border-black/10 text-black focus:border-black/20 focus:ring-black/10 placeholder:text-gray-400'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'sending'}
                style={{ backgroundColor: themeColor }}
                className={`w-full py-4 rounded-xl font-bold transition-all transform active:scale-[0.98] ${
                  status === 'sending' 
                  ? 'opacity-70 cursor-not-allowed' 
                  : 'hover:opacity-90 shadow-lg'
                } flex items-center justify-center gap-2 text-white`}
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Enviando...
                  </>
                ) : 'Enviar Mensaje'}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
