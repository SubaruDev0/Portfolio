'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import { ProjectCategory, Project, Certificate } from '@/types';
import { Plus, Github, Link as LinkIcon, Save, Image as ImageIcon, Lock, X, Search, FileUp, Star, Briefcase, Award, ChevronUp, ChevronDown, Eye, EyeOff, Pencil, Database, LogIn, MoveVertical, GripVertical, Trash2, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import { addProjectAction, deleteProjectAction, uploadFileAction, addCertificateAction, deleteCertificateAction, reorderAction, updateProjectAction, updateCertificateAction, runMigration, updateSettingsAction, verifyAdminAction, saveOrderAction, deleteImageAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import TechBadge from '@/components/TechBadge';
import { Reorder, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage({
  initialProjects: allProjects,
  initialCertificates: allCertificates,
  initialSettings = {}
}: {
  initialProjects: Project[],
  initialCertificates: Certificate[],
  initialSettings?: Record<string, string>
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [newTechIcon, setNewTechIcon] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: 'frontend' as ProjectCategory,
    secondaryCategory: null as ProjectCategory | null,
    technologies: [] as string[],
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    gallery: [] as string[],
    isStarred: false,
    isRealWorld: false,
  });

  const [certificate, setCertificate] = useState<Omit<Certificate, 'id'>>({
    title: '',
    description: '',
    date: '',
    academy: '',
    imageUrl: '',
  });

  const [settings, setSettings] = useState({
    cv_url: initialSettings.cv_url || '',
    cv_description: initialSettings.cv_description || '',
  });

  const [localProjects, setLocalProjects] = useState<Project[]>(allProjects);
  const [localCertificates, setLocalCertificates] = useState<Certificate[]>(allCertificates);

  useEffect(() => {
    setLocalProjects(allProjects);
  }, [allProjects]);

  useEffect(() => {
    setLocalCertificates(allCertificates);
  }, [allCertificates]);

  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'settings'>('projects');

  // Mapa de tecnologías existentes para autocompletar nombre y slug
  const techSuggestions = useMemo(() => {
    const suggestions: Record<string, string> = {};
    allProjects.forEach(p => p.technologies.forEach(t => {
      if (t.includes(':')) {
        const lastColon = t.lastIndexOf(':');
        const name = t.substring(0, lastColon).trim();
        const slug = t.substring(lastColon + 1).trim();
        suggestions[name] = slug;
      } else if (!suggestions[t]) {
        suggestions[t] = '';
      }
    }));
    return suggestions;
  }, [allProjects]);

  const uniqueTechNames = Object.keys(techSuggestions).sort();

  // Función para comprimir imágenes en el cliente antes de subir
  const compressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const maxWidth = 1200;
      const quality = 0.7;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              } else {
                reject(new Error('Error al comprimir imagen'));
              }
            },
            'image/jpeg',
            quality
          );
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    let file = e.target.files?.[0];
    if (!file) return;

    // Prevent too many gallery images
    const MAX_GALLERY = 12;
    if (isGallery && project.gallery.length >= MAX_GALLERY) {
      alert(`Has alcanzado el máximo de imágenes en la galería (${MAX_GALLERY}). Elimina alguna antes de añadir más.`);
      return;
    }

    setIsUploading(true);
    const prevMain = project.imageUrl;
    // Si es una imagen pesada, la comprimimos
    if (file.type.startsWith('image/') && file.size > 200 * 1024) {
      try {
        file = await compressImage(file);
      } catch (err) {
        console.error('Compression error:', err);
      }
    }

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadFileAction(formData);
    setIsUploading(false);

    if (result.success && result.url) {
      // Si hemos subido correctamente y existía una imagen previa en el proyecto, la eliminamos del blob (si aplica)
      if (!isGallery && prevMain && prevMain.includes('blob.vercel-storage.com') && prevMain !== result.url) {
        try { await deleteImageAction(prevMain); } catch (err) { console.error('Error borrando imagen previa:', err); }
      }

      if (activeTab === 'settings') {
        setSettings({ ...settings, cv_url: result.url });
      } else if (activeTab === 'certificates') {
        setCertificate({ ...certificate, imageUrl: result.url });
      } else if (isGallery) {
        setProject({ ...project, gallery: [...project.gallery, result.url] });
      } else {
        setProject({ ...project, imageUrl: result.url });
      }
    } else {
      alert('Error subiendo archivo: ' + result.error);
    }
  };

  const handleDeleteCV = async () => {
    if (!settings.cv_url) return;
    if (confirm('¿Estás seguro de que quieres borrar el CV actual?')) {
      if (settings.cv_url.includes('blob.vercel-storage.com')) {
        try {
          await deleteImageAction(settings.cv_url);
        } catch (err) {
          console.error('Error borrando archivo de storage:', err);
        }
      }
      setSettings({ ...settings, cv_url: '' });
      alert('CV eliminado de la configuración (recuerda Guardar)');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const result = await updateSettingsAction(settings);
    setIsSaving(false);
    if (result.success) {
      alert('Configuración guardada');
      router.refresh();
    } else {
      alert('Error: ' + result.error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError(false);
    
    const result = await verifyAdminAction(password);
    if (result.success) {
      setIsAuthenticated(true);
      // No ejecutamos la migración automáticamente para evitar sobrescribir datos reales
      // con los datos hardcodeados de los archivos .ts locales.
      // runMigration().catch(console.error);
    } else {
      setError(true);
      setPassword('');
      // Simple shake effect could be added here
    }
    setIsVerifying(false);
  };

  const handleCertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let result;
    if (editingId) {
      result = await updateCertificateAction({ ...certificate, id: editingId } as Certificate);
    } else {
      const newCert = { ...certificate, id: Date.now().toString() };
      result = await addCertificateAction(newCert);
    }

    setIsSaving(false);
    if (result.success) {
      alert(editingId ? 'Certificado actualizado' : 'Certificado guardado');
      router.refresh();
      setCertificate({ title: '', description: '', date: '', academy: '', imageUrl: '' });
      setEditingId(null);
    } else {
      alert('Error: ' + result.error);
    }
  };

  const startEditProject = (p: Project) => {
    setProject({
      title: p.title,
      description: p.description,
      category: p.category,
      secondaryCategory: p.secondaryCategory || null,
      technologies: p.technologies,
      githubUrl: p.githubUrl || '',
      liveUrl: p.liveUrl || '',
      imageUrl: p.imageUrl || '',
      gallery: p.gallery || [],
      isStarred: p.isStarred || false,
      isRealWorld: p.isRealWorld || false,
    });
    setEditingId(p.id);
    setActiveTab('projects');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startEditCert = (c: Certificate) => {
    setCertificate({
      title: c.title,
      description: c.description || '',
      date: c.date,
      academy: c.academy,
      imageUrl: c.imageUrl || '',
    });
    setEditingId(c.id);
    setActiveTab('certificates');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCertDelete = async (id: string, title: string) => {
    if (confirm(`¿Borrar certificado "${title}"?`)) {
      const result = await deleteCertificateAction(id);
      if (result.success) {
        alert('Certificado borrado');
        router.refresh();
      } else {
        alert('Error: ' + result.error);
      }
    }
  };

  const handleReorder = async (type: 'projects' | 'certificates', id: string, direction: 'up' | 'down') => {
    const result = await reorderAction(type, id, direction);
    if (result.success) {
      router.refresh();
    }
  };

  const handleDragReorder = async (type: 'projects' | 'certificates', newItems: any[]) => {
    if (type === 'projects') {
      setLocalProjects(newItems);
      const ids = newItems.map(i => i.id);
      await saveOrderAction('projects', ids);
    } else {
      setLocalCertificates(newItems);
      const ids = newItems.map(i => i.id);
      await saveOrderAction('certificates', ids);
    }
  };

  const addTech = (tech: string, iconSlug?: string) => {
    let finalTech = tech.trim();
    const slug = iconSlug?.trim();
    
    // Si el usuario pegó "Nombre:Slug" en el campo de nombre, lo manejamos
    if (finalTech.includes(':') && !slug) {
       // Ya viene con formato, no hacemos nada extra
    } else if (slug) {
      finalTech = `${finalTech}:${slug}`;
    }

    if (finalTech && !project.technologies.includes(finalTech)) {
      setProject({ ...project, technologies: [...project.technologies, finalTech] });
      setNewTech('');
      setNewTechIcon('');
    }
  };

  const removeTech = (tech: string) => {
    setProject({ ...project, technologies: project.technologies.filter(t => t !== tech) });
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`¿Estás seguro de que quieres borrar el proyecto "${title}"?`)) {
      const result = await deleteProjectAction(id);
      if (result.success) {
        alert('Proyecto borrado');
        router.refresh();
      } else {
        alert('Error al borrar: ' + result.error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    let result;
    if (editingId) {
      const updatedProject = {
        ...project,
        id: editingId,
        createdAt: allProjects.find(p => p.id === editingId)?.createdAt || new Date().toISOString()
      } as Project;
      result = await updateProjectAction(updatedProject);
    } else {
      const newProject = {
        ...project,
        id: Date.now().toString(),
        createdAt: new Date().toISOString()
      } as Project;
      result = await addProjectAction(newProject);
    }
    
    setIsSaving(false);
    
    if (result.success) {
      alert(editingId ? '¡Proyecto actualizado!' : '¡Proyecto guardado con éxito!');
      router.refresh();
      setEditingId(null);
      setProject({
        title: '',
        description: '',
        category: 'frontend',
        secondaryCategory: null,
        technologies: [],
        githubUrl: '',
        liveUrl: '',
        imageUrl: '',
        gallery: [],
        isStarred: false,
        isRealWorld: false,
      });
    } else {
      alert('Error al guardar: ' + result.error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center p-4 font-sans selection:bg-cyan-500/30">
        <div className="w-full max-w-md">
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-white/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 relative group">
              <div className="absolute inset-0 bg-cyan-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <Lock className="text-cyan-400 relative z-10" size={32} />
            </div>
            <h1 className="text-2xl font-black text-white uppercase tracking-[0.3em] mb-3">Panel de Acceso</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-medium leading-relaxed">
              Introduce la llave maestra para gestionar tu portafolio
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group/input">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Lock size={16} className={cn("transition-colors duration-300", error ? "text-red-500" : "text-gray-600 group-focus-within/input:text-cyan-400")} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="CONTRASENA_DE_ACCESO"
                className={cn(
                  "w-full bg-white/[0.03] border text-white text-xs font-mono py-5 pl-14 pr-14 rounded-2xl outline-none transition-all duration-300 placeholder:text-gray-700 uppercase tracking-widest",
                  error 
                    ? "border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]" 
                    : "border-white/5 focus:border-cyan-500/30 focus:bg-white/[0.05]"
                )}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-5 flex items-center text-gray-600 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <p className="text-[10px] text-red-500 font-bold uppercase tracking-widest text-center animate-pulse">
                Acceso Denegado - Clave Incorrecta
              </p>
            )}

            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full bg-white text-black py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-cyan-400 transition-all duration-500 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
            >
              {isVerifying ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  Verificar Identidad
                  <LogIn size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 text-center">
            <button 
              onClick={() => router.push('/')}
              className="text-[10px] text-gray-700 hover:text-gray-400 uppercase tracking-widest transition-colors inline-flex items-center gap-2"
            >
              <X size={12} /> VOLVER AL SITIO
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-32 pb-20 px-6 font-mono">
      <Navbar themeColor="#fff" />
      
      <div className="max-w-7xl mx-auto flex flex-wrap gap-4 mb-8">
        <div className="flex-1 flex gap-4">
          <button 
            onClick={() => { setActiveTab('projects'); setEditingId(null); }}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all border",
              activeTab === 'projects' ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
            )}
          >
            Proyectos
          </button>
          <button 
            onClick={() => { setActiveTab('certificates'); setEditingId(null); }}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all border",
              activeTab === 'certificates' ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
            )}
          >
            Certificados
          </button>
          <button 
            onClick={() => { setActiveTab('settings'); setEditingId(null); }}
            className={cn(
              "flex-1 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] md:text-xs transition-all border",
              activeTab === 'settings' ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "bg-white/5 text-gray-500 border-white/10 hover:bg-white/10"
            )}
          >
            Ajustes
          </button>
        </div>
        
        <button 
          onClick={async () => {
            if (confirm('¿Migrar datos locales a la base de datos? Esto creará las tablas si no existen.')) {
              const res = await runMigration();
              if (res.success) alert('¡Migración completada!');
              else alert('Error en migración');
              router.refresh();
            }
          }}
          className="px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center gap-2"
          title="Solo ejecutar una vez para inicializar DB"
        >
          <Database size={16} /> Inicializar DB
        </button>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* PANEL IZQUIERDO: FORMULARIOS */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl animate-blurred-fade-in shadow-2xl flex flex-col">
          {activeTab === 'projects' && (
            <>
              <h1 className="text-xl font-black mb-8 flex items-center justify-between text-white uppercase tracking-tighter">
                <div className="flex items-center gap-4">
                  {editingId ? <Pencil size={20} className="text-yellow-500" /> : <Plus size={20} className="text-cyan-500" />}
                  {editingId ? 'EDITAR PROYECTO' : 'NUEVO PROYECTO'}
                </div>
                {editingId && (
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setProject({ title: '', description: '', category: 'frontend', secondaryCategory: null, technologies: [], githubUrl: '', liveUrl: '', imageUrl: '', gallery: [], isStarred: false, isRealWorld: false });
                    }}
                    className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    CANCELAR
                  </button>
                )}
              </h1>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Título del Proyecto</label>
                  <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm" placeholder="Ej: Sistema de Gestión" value={project.title} onChange={e => setProject({...project, title: e.target.value})} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Categoría Principal</label>
                    <div className="relative">
                      <select className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-xs appearance-none cursor-pointer" value={project.category} onChange={e => setProject({...project, category: e.target.value as ProjectCategory})}>
                        <option value="frontend">Front-end</option>
                        <option value="backend">Back-end</option>
                        <option value="fullstack">Full-stack</option>
                        <option value="research">Research</option>
                        <option value="other">Other</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none scale-75">
                        <TechBadge name={project.category} showName={false} />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">2da Categoría <span className="text-gray-700">(opcional)</span></label>
                    <div className="relative">
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-xs appearance-none cursor-pointer" 
                        value={project.secondaryCategory || ''} 
                        onChange={e => setProject({...project, secondaryCategory: e.target.value ? e.target.value as ProjectCategory : null})}
                      >
                        <option value="">Sin 2da categoría</option>
                        <option value="frontend" disabled={project.category === 'frontend'}>Front-end</option>
                        <option value="backend" disabled={project.category === 'backend'}>Back-end</option>
                        <option value="fullstack" disabled={project.category === 'fullstack'}>Full-stack</option>
                        <option value="research" disabled={project.category === 'research'}>Research</option>
                        <option value="other" disabled={project.category === 'other'}>Other</option>
                      </select>
                      {project.secondaryCategory && (
                        <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none scale-75">
                          <TechBadge name={project.secondaryCategory} showName={false} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Miniatura Principal</label>
                    <label className="flex w-full bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors items-center justify-center gap-2 text-xs text-gray-400 overflow-hidden">
                      <FileUp size={16} className={isUploading ? "animate-bounce" : ""} />
                      <span className="truncate">{project.imageUrl ? 'Imagen lista' : 'Subir archivo'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} disabled={isUploading} />
                    </label>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Galería Adicional</label>
                  <div className="grid grid-cols-4 gap-2">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/50">
                        <img src={img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        <button
                          type="button"
                          onClick={async () => {
                            // Borrar blob en Vercel si aplica y actualizar estado local
                            try {
                              if (img && img.includes('blob.vercel-storage.com')) {
                                await deleteImageAction(img);
                              }
                            } catch (err) {
                              console.error('Error borrando imagen de galería:', err);
                            }
                            setProject({ ...project, gallery: project.gallery.filter((_, idx) => idx !== i) });
                          }}
                          className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <label className="aspect-square bg-white/5 border border-white/10 border-dashed rounded-lg hover:bg-white/10 cursor-pointer transition-colors flex flex-col items-center justify-center text-gray-500"><Plus size={20} /><input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, true)} disabled={isUploading} /></label>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => setProject({...project, isRealWorld: !project.isRealWorld})} className={cn("flex-1 px-4 py-3 rounded-xl border transition-all text-[10px] font-bold tracking-widest uppercase", project.isRealWorld ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-white/5 border-white/10 text-gray-500")}>
                    PRODUCCIÓN
                  </button>
                  <button type="button" onClick={() => setProject({...project, isStarred: !project.isStarred})} className={cn("flex-1 px-4 py-3 rounded-xl border transition-all text-[10px] font-bold tracking-widest uppercase", project.isStarred ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.1)]" : "bg-white/5 border-white/10 text-gray-500")}>
                    FAVORITO
                  </button>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Tecnologías</label>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map(t => {
                      const lastColon = t.lastIndexOf(':');
                      const name = lastColon !== -1 ? t.substring(0, lastColon) : t;
                      return (
                        <div key={t} className="flex items-center gap-2 bg-white/5 border border-white/10 pl-2 pr-1 py-1 rounded-xl text-[9px] uppercase tracking-tighter text-white group/tech relative">
                          <TechBadge name={t} showName={false} className="scale-75 -mx-1" />
                          <span className="flex items-center gap-1.5">
                            {name} 
                            {lastColon !== -1 && (
                              <span className="px-1.5 py-0.5 rounded-md bg-white/10 text-[8px] opacity-30 group-hover/tech:opacity-100 transition-opacity">
                                SLUG: {t.substring(lastColon + 1)}
                              </span>
                            )}
                          </span>
                          <button type="button" onClick={() => removeTech(t)} className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white transition-colors">
                            <X size={10} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2 items-end">
                    <div className="flex-1 flex gap-2">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          list="tech-list" 
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white transition-colors" 
                          placeholder="Nombre (ej: Python)" 
                          value={newTech} 
                          onChange={e => {
                            const val = e.target.value;
                            setNewTech(val);
                            // Autocompletar slug si existe en sugerencias
                            if (techSuggestions[val]) {
                              setNewTechIcon(techSuggestions[val]);
                            }
                          }} 
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech(newTech, newTechIcon))} 
                        />
                      </div>
                      <div className="w-1/3 relative">
                        <input 
                          type="text" 
                          className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white transition-colors" 
                          placeholder="Slug" 
                          value={newTechIcon} 
                          onChange={e => setNewTechIcon(e.target.value)} 
                          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech(newTech, newTechIcon))} 
                        />
                      </div>
                    </div>
                    {newTech && (
                      <div className="mb-1 p-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2 animate-in fade-in zoom-in duration-300">
                        <TechBadge name={newTechIcon ? `${newTech}:${newTechIcon}` : newTech} showName={false} />
                        <span className="text-[8px] text-gray-500 font-bold uppercase tracking-widest">PREVIEW</span>
                      </div>
                    )}
                    <button type="button" onClick={() => addTech(newTech, newTechIcon)} className="bg-white px-6 py-3 rounded-xl text-[10px] font-black uppercase text-black hover:bg-cyan-400 transition-all">AGREGAR</button>
                    <datalist id="tech-list">{uniqueTechNames.map(t => <option key={t} value={t} />)}</datalist>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Descripción (Markdown)</label>
                  <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-xs resize-none" placeholder="### Características\n- Item 1" value={project.description} onChange={e => setProject({...project, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input type="url" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-white" placeholder="GitHub" value={project.githubUrl} onChange={e => setProject({...project, githubUrl: e.target.value})} />
                  <input type="url" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-[10px] focus:outline-none focus:border-white" placeholder="Live" value={project.liveUrl} onChange={e => setProject({...project, liveUrl: e.target.value})} />
                </div>

                <button disabled={isSaving} type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 text-xs tracking-[0.3em] uppercase">
                  {isSaving ? "Guardando..." : (editingId ? "ACTUALIZAR PROYECTO" : "GUARDAR PROYECTO")}
                </button>
              </form>
            </>
          )}

          {activeTab === 'certificates' && (
            <>
              <h1 className="text-xl font-black mb-8 flex items-center justify-between text-white uppercase tracking-tighter">
                <div className="flex items-center gap-4">
                  {editingId ? <Pencil size={20} className="text-yellow-500" /> : <Award size={20} className="text-yellow-500" />}
                  {editingId ? 'EDITAR CERTIFICADO' : 'NUEVO CERTIFICADO'}
                </div>
                {editingId && (
                  <button 
                    onClick={() => {
                      setEditingId(null);
                      setCertificate({ title: '', description: '', date: '', academy: '', imageUrl: '' });
                    }}
                    className="text-[10px] font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    CANCELAR
                  </button>
                )}
              </h1>
              <form onSubmit={handleCertSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Título del Certificado</label>
                  <input type="text" required className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-sm" placeholder="Ej: AWS Solutions Architect" value={certificate.title} onChange={e => setCertificate({...certificate, title: e.target.value})} />
                </div>
                <div>
                   <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Logros / Descripción (Markdown)</label>
                   <textarea rows={3} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-xs resize-none" placeholder="Certificación enfocada en..." value={certificate.description} onChange={e => setCertificate({...certificate, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Institución</label>
                    <input type="text" required placeholder="Udemy, Coursera..." className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white" value={certificate.academy} onChange={e => setCertificate({...certificate, academy: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Año</label>
                    <input type="text" required placeholder="2024" className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white text-xs focus:outline-none focus:border-white" value={certificate.date} onChange={e => setCertificate({...certificate, date: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Certificado (JPG/PNG)</label>
                  <label className="flex w-full bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-colors items-center justify-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest whitespace-nowrap">
                    <FileUp size={18} className={isUploading ? "animate-bounce" : ""} />
                    <span className="truncate">{certificate.imageUrl ? 'Archivo cargado' : 'Subir certificado'}</span>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e)} disabled={isUploading} />
                  </label>
                </div>
                <button disabled={isSaving} type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 text-xs tracking-[0.3em] uppercase">
                  {isSaving ? "Guardando..." : (editingId ? "ACTUALIZAR CERTIFICADO" : "GUARDAR CERTIFICADO")}
                </button>
              </form>
            </>
          )}

          {activeTab === 'settings' && (
            <>
              <h1 className="text-xl font-black mb-8 flex items-center gap-4 text-white uppercase tracking-tighter">
                <SettingsIcon size={24} className="text-white/40" />
                AJUSTES DEL PORTAFOLIO
              </h1>
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Archivo CV (PDF)</label>
                  <div className="space-y-3">
                    <label className="flex w-full bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-colors items-center justify-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest overflow-hidden">
                      <FileUp size={18} className={isUploading ? "animate-bounce" : ""} />
                      <span className="truncate">{settings.cv_url ? "Cambiar CV" : "Subir CV (PDF)"}</span>
                      <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e)} disabled={isUploading} />
                    </label>
                    {settings.cv_url && (
                      <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl">
                        <span className="text-[9px] text-cyan-500 font-bold uppercase tracking-tighter truncate max-w-[200px]">CV ACTUAL: {settings.cv_url.split('/').pop()}</span>
                        <button type="button" onClick={handleDeleteCV} className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all" title="Eliminar CV Actual">
                           <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Descripción del CV (Modal)</label>
                  <textarea rows={4} className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white transition-colors text-xs resize-none" value={settings.cv_description} onChange={e => setSettings({...settings, cv_description: e.target.value})} placeholder="Describe brevemente este CV..." />
                </div>

                <button disabled={isSaving} type="submit" className="w-full bg-white text-black font-black py-4 rounded-xl hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-50 text-xs tracking-[0.3em] uppercase">
                  {isSaving ? "Guardando..." : "GUARDAR CONFIGURACIÓN"}
                </button>
              </form>
            </>
          )}
        </div>

        {/* PANEL DERECHO: LISTADO */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl h-[800px] flex flex-col shadow-2xl overflow-hidden">
          <h2 className="text-xs font-black mb-8 text-gray-500 flex items-center gap-3 uppercase tracking-[0.4em]">
            Listado de {activeTab === 'projects' ? 'Proyectos' : (activeTab === 'certificates' ? 'Certificados' : 'Información')}
          </h2>
          <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar">
            {activeTab === 'projects' && (
              <Reorder.Group axis="y" values={localProjects} onReorder={(items) => handleDragReorder('projects', items)} className="space-y-3">
                <AnimatePresence mode="popLayout">
                  {localProjects.map((p, index) => (
                    <Reorder.Item 
                      key={p.id} 
                      value={p}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileDrag={{ 
                        scale: 1.02, 
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
                        zIndex: 50,
                        cursor: "grabbing"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl hover:border-white/20 hover:bg-white/5 transition-all group cursor-grab active:cursor-grabbing select-none"
                    >
                      <div className="flex items-center gap-4 overflow-hidden">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-[9px] font-bold text-gray-600 tabular-nums">#{index + 1}</span>
                          <div className="text-gray-600 group-hover:text-cyan-400 transition-colors p-1 rounded hover:bg-white/10">
                            <GripVertical size={18} />
                          </div>
                        </div>
                        <div className="w-14 h-14 rounded-xl border border-white/10 overflow-hidden flex-shrink-0 bg-black/50">
                          {p.imageUrl && <img src={p.imageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div className="truncate">
                          <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate max-w-[200px]">{p.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-[9px] text-gray-600 uppercase font-mono">{p.category}</p>
                            {p.secondaryCategory && <p className="text-[9px] text-gray-700 uppercase font-mono">+ {p.secondaryCategory}</p>}
                            {p.isStarred && <Star size={10} className="text-yellow-500 fill-yellow-500" />}
                            {p.isRealWorld && <Briefcase size={10} className="text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 pointer-events-auto">
                        <button onClick={(e) => { e.stopPropagation(); startEditProject(p); }} className="p-3 text-gray-700 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-all" title="Editar"><Pencil size={16} /></button>
                        <button onClick={(e) => { e.stopPropagation(); handleDelete(p.id, p.title); }} className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
            
            {activeTab === 'certificates' && (
              <Reorder.Group axis="y" values={localCertificates} onReorder={(items) => handleDragReorder('certificates', items)} className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {localCertificates.map(c => (
                    <Reorder.Item 
                      key={c.id} 
                      value={c}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all group cursor-grab active:cursor-grabbing"
                    >
                      <div className="flex items-center gap-4 overflow-hidden pointer-events-none select-none">
                        <div className="text-gray-700 group-hover:text-white transition-colors">
                          <GripVertical size={18} />
                        </div>
                        <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                          <img src={c.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate">{c.title}</h3>
                          <p className="text-[9px] text-gray-600 uppercase font-mono mt-1">{c.academy} • {c.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startEditCert(c)} className="p-3 text-gray-700 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-all" title="Editar"><Pencil size={16} /></button>
                        <button onClick={() => handleCertDelete(c.id, c.title)} className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </Reorder.Item>
                  ))}
                </AnimatePresence>
              </Reorder.Group>
            )}
            
            {activeTab === 'settings' && (
              <div className="p-8 text-center text-gray-600 h-full flex flex-col justify-center items-center">
                <SettingsIcon size={64} className="mb-6 opacity-10 rotate-12" />
                <p className="text-xs uppercase tracking-[0.4em] font-bold text-white/40">Modo Configuración Global</p>
                <p className="text-[10px] mt-4 opacity-40 max-w-[200px] leading-relaxed">
                  Utiliza este panel para gestionar archivos que afectan a todo el portafolio, como tu CV y metadatos del sitio.
                </p>
                {settings.cv_url && (
                  <a href={settings.cv_url} target="_blank" rel="noopener noreferrer" className="mt-8 flex items-center gap-2 text-cyan-500 text-[10px] font-bold tracking-widest hover:underline">
                    VER CV ACTUAL <FileUp size={14} />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

