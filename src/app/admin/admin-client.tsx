'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { ProjectCategory, Project, Certificate } from '@/types';
import { Plus, Github, Link as LinkIcon, Save, Image as ImageIcon, Lock, X, Search, FileUp, Star, Briefcase, Award, ChevronUp, ChevronDown, Eye, EyeOff, Pencil, Database } from 'lucide-react';
import { addProjectAction, deleteProjectAction, uploadImageAction, addCertificateAction, deleteCertificateAction, reorderAction, updateProjectAction, updateCertificateAction, runMigration, updateSettingsAction } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { Trash2, HelpCircle, Settings as SettingsIcon } from 'lucide-react';
import TechBadge from '@/components/TechBadge';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function AdminPage({
  initialProjects: allProjects,
  initialCertificates: allCertificates,
  initialSettings = {},
  adminPassword
}: {
  initialProjects: Project[],
  initialCertificates: Certificate[],
  initialSettings?: Record<string, string>,
  adminPassword: string
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [newTech, setNewTech] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [project, setProject] = useState({
    title: '',
    description: '',
    category: 'frontend' as ProjectCategory,
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

  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'settings'>('projects');

  const existingTechs = Array.from(new Set(allProjects.flatMap(p => p.technologies)));

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImageAction(formData);
    setIsUploading(false);

    if (result.success && result.url) {
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
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

  const addTech = (tech: string) => {
    if (tech && !project.technologies.includes(tech)) {
      setProject({ ...project, technologies: [...project.technologies, tech] });
      setNewTech('');
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
                      setProject({ title: '', description: '', category: 'frontend', technologies: [], githubUrl: '', liveUrl: '', imageUrl: '', gallery: [], isStarred: false, isRealWorld: false });
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
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Categoría</label>
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
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Miniatura Principal</label>
                    <label className="flex w-full bg-white/5 border border-white/10 p-3 rounded-xl hover:bg-white/10 cursor-pointer transition-colors items-center justify-center gap-2 text-xs text-gray-400 overflow-hidden">
                      <FileUp size={16} className={isUploading ? "animate-bounce" : ""} />
                      <span className="truncate">{project.imageUrl ? 'Imagen lista' : 'Subir archivo'}</span>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileUpload(e, false)} disabled={isUploading} />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2">Galería Adicional</label>
                  <div className="grid grid-cols-4 gap-2">
                    {project.gallery.map((img, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group bg-black/50">
                        <img src={img} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />
                        <button type="button" onClick={() => setProject({...project, gallery: project.gallery.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"><Trash2 size={16} /></button>
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
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map(t => (
                      <div key={t} className="flex items-center gap-2 bg-white/5 border border-white/10 pl-3 pr-1 py-1 rounded-lg text-[9px] uppercase tracking-tighter text-white">
                        {t} <button type="button" onClick={() => removeTech(t)} className="p-1 hover:bg-white/10 rounded text-gray-500 hover:text-white"><X size={10} /></button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" list="tech-list" className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:border-white transition-colors" placeholder="Añadir tech..." value={newTech} onChange={e => setNewTech(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech(newTech))} />
                    <button type="button" onClick={() => addTech(newTech)} className="bg-white/10 px-4 rounded-xl text-[10px] font-black uppercase text-white hover:bg-white/20">OK</button>
                    <datalist id="tech-list">{existingTechs.map(t => <option key={t} value={t} />)}</datalist>
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
                  <label className="flex w-full bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 cursor-pointer transition-colors items-center justify-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest overflow-hidden">
                    <FileUp size={18} className={isUploading ? "animate-bounce" : ""} />
                    <span className="truncate">{settings.cv_url ? "CV Cargado con éxito" : "Subir CV (PDF)"}</span>
                    <input type="file" className="hidden" accept="application/pdf" onChange={(e) => handleFileUpload(e)} disabled={isUploading} />
                  </label>
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
              allProjects.map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4 overflow-hidden">
                    <div className="w-12 h-12 rounded-xl border border-white/10 overflow-hidden flex-shrink-0">
                      <img src={p.imageUrl} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h3 className="text-xs font-bold text-white uppercase tracking-tight truncate">{p.title}</h3>
                      <p className="text-[9px] text-gray-600 uppercase font-mono mt-1">{p.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => startEditProject(p)} className="p-3 text-gray-700 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-xl transition-all" title="Editar"><Pencil size={16} /></button>
                    <div className="flex flex-col">
                      <button onClick={() => handleReorder('projects', p.id, 'up')} className="p-1 text-gray-700 hover:text-white transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => handleReorder('projects', p.id, 'down')} className="p-1 text-gray-700 hover:text-white transition-colors"><ChevronDown size={14} /></button>
                    </div>
                    <button onClick={() => handleDelete(p.id, p.title)} className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
            )}
            
            {activeTab === 'certificates' && (
              allCertificates.map(c => (
                <div key={c.id} className="flex items-center justify-between p-4 bg-black/30 border border-white/5 rounded-2xl hover:border-white/10 transition-all group">
                  <div className="flex items-center gap-4 overflow-hidden">
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
                    <div className="flex flex-col">
                      <button onClick={() => handleReorder('certificates', c.id, 'up')} className="p-1 text-gray-700 hover:text-white transition-colors"><ChevronUp size={14} /></button>
                      <button onClick={() => handleReorder('certificates', c.id, 'down')} className="p-1 text-gray-700 hover:text-white transition-colors"><ChevronDown size={14} /></button>
                    </div>
                    <button onClick={() => handleCertDelete(c.id, c.title)} className="p-3 text-gray-700 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))
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

