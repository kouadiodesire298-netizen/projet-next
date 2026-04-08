'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowLeft, Eye, EyeOff, Briefcase, ChevronRight } from 'lucide-react';

export default function Inscription() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    service: '',
    password: ''
  });

  const isFormValid = () => {
    return (
      formData.username.trim().includes(' ') && 
      formData.email.includes('@') && 
      formData.service !== '' && 
      formData.password.length >= 8
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      router.push('/connexion');
    }
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center bg-slate-50 p-6 overflow-hidden">
      
      {/* DÉCORATION D'ARRIÈRE-PLAN */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/50 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-100/50 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-110 px-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 mb-6 transition-all group">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-xs uppercase tracking-tighter text-slate-500">Retour</span>
        </Link>

        <div className="bg-white/70 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
               <div className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Image src="/logo_cei.png" alt="Logo CEI" width={42} height={42} priority />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">Inscription</h1>
            <div className="h-1 w-12 bg-blue-600 mx-auto mt-2 rounded-full"></div>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">Nouveau compte agent</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <User size={12} className="text-blue-600" /> Identité Complète
              </label>
              <input 
                name="username" 
                type="text" 
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 font-semibold placeholder:text-slate-300"
                placeholder="Ex: Jean Kouassi"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <Mail size={12} className="text-blue-600" /> Email Professionnel
              </label>
              <input 
                name="email" 
                type="email" 
                onChange={handleChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 font-semibold placeholder:text-slate-300"
                placeholder="nom.prenom@cei.ci"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <Briefcase size={12} className="text-blue-600" /> Affectation / Service
              </label>
              <div className="relative">
                <select 
                  name="service" 
                  onChange={handleChange} 
                  defaultValue=""
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 px-5 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Sélectionner un service...</option>
                  <option value="Développement">Développement</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Réseaux">Réseaux</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                   <ChevronRight size={18} className="rotate-90" />
                </div>
              </div>
            </div>

            {/* Mot de passe : UN SEUL SYSTÈME D'OEIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] ml-1 flex items-center gap-2">
                <Lock size={12} className="text-blue-600" /> Mot de passe
              </label>
              <div className="relative">
                <input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  onChange={handleChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-xl py-3.5 px-5 pr-12 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-600 transition-all text-slate-900 font-semibold placeholder:text-slate-300"
                  placeholder="8 caractères minimum"
                  required
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors z-20"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit"
                disabled={!isFormValid()}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg ${
                  isFormValid() 
                  ? 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-[0.98]' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                Créer mon compte
                {isFormValid() && <ChevronRight size={18} />}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-slate-50">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              Déjà inscrit ?{' '}
              <Link href="/connexion" className="text-blue-600 hover:text-blue-700 ml-1">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}