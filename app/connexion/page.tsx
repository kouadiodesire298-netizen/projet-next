'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowLeft, ChevronRight, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getErrors = () => {
    const { username, email, password } = formData;
    return {
      username: username && (!username.trim().includes(' ') || username.trim().length < 5) 
        ? "Nom et Prénom requis" : "",
      email: email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) 
        ? "Format d'email @cei.ci requis" : "",
      password: password && (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
        ? "Sécurité : 8 caractères (lettre + chiffre)" : ""
    };
  };

  const errors = getErrors();

  const isFormValid = () => {
    const { username, email, password } = formData;
    return (
      username.trim().includes(' ') && 
      username.trim().length >= 5 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && 
      password.length >= 8 && 
      /[A-Za-z]/.test(password) && 
      /[0-9]/.test(password)
    );
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid()) return;
    setIsSubmitting(true);
    
    setTimeout(() => {
      const { username, email, password } = formData;
      localStorage.setItem('userName', username);
      if (email.toLowerCase() === "admin@cei.ci" && password === "CEI@2026") {
        router.push('/admin/employes');
      } else {
        router.push('/formulaire');
      }
    }, 1200);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-50 font-sans">
      
      {/* 🛡️ CORRECTIF POUR LES DEUX YEUX */}
      <style jsx global>{`
        /* Masquer l'icône de mot de passe par défaut sur Edge et Chrome */
        input::-ms-reveal,
        input::-ms-clear,
        input::-webkit-contacts-auto-fill-button,
        input::-webkit-credentials-auto-fill-button {
          display: none !important;
        }
      `}</style>

      {/* BACKGROUND DYNAMIQUE */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-5%] w-125 h-125 bg-orange-400/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-125 h-125 bg-green-400/10 rounded-full blur-[100px] animate-pulse transition-all duration-1000"></div>
      </div>

      <div className="relative z-10 w-full max-w-112.5 px-6">
        
        <Link href="/" className="group mb-6 inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-all">
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-bold text-[10px] uppercase tracking-widest">Retour</span>
        </Link>

        <div className="bg-white/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-white relative">
          
          <div className="text-center mb-8">
            <div className="flex justify-center mb-5">
               <div className="p-4 bg-white rounded-3xl shadow-sm border border-slate-50">
                <Image src="/logo_cei.png" alt="Logo CEI" width={45} height={45} priority />
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase italic">Connexion <span className="text-blue-600">SGP</span></h1>
            <div className="h-1 w-10 bg-blue-600 mx-auto mt-2 rounded-full"></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 flex justify-between">
                Nom de l&apos;agent
                {formData.username && !errors.username && <ShieldCheck size={14} className="text-green-500" />}
              </label>
              <div className="relative group">
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.username ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                <input 
                  name="username"
                  type="text" 
                  placeholder="Ex: Jean Kouassi" 
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full bg-slate-50/50 border ${errors.username ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300`}
                  required
                />
              </div>
              {errors.username && <p className="text-[9px] text-red-500 flex items-center gap-1 font-bold pl-1 uppercase"><AlertCircle size={10}/> {errors.username}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email Institutionnel</label>
              <div className="relative group">
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                <input 
                  name="email"
                  type="email" 
                  placeholder="agent@cei.ci" 
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full bg-slate-50/50 border ${errors.email ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} rounded-2xl py-3.5 pl-11 pr-4 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300`}
                  required
                />
              </div>
              {errors.email && <p className="text-[9px] text-red-500 flex items-center gap-1 font-bold pl-1 uppercase"><AlertCircle size={10}/> {errors.email}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Mot de passe</label>
              <div className="relative group">
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                <input 
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full bg-slate-50/50 border ${errors.password ? 'border-red-500 ring-2 ring-red-50' : 'border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10'} rounded-2xl py-3.5 pl-11 pr-12 outline-none transition-all text-slate-900 font-bold placeholder:text-slate-300`}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-[9px] text-red-500 flex items-center gap-1 font-bold pl-1 uppercase"><AlertCircle size={10}/> {errors.password}</p>}
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={!isFormValid() || isSubmitting}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                  isFormValid() && !isSubmitting
                    ? 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-blue-500/20 active:scale-[0.97]' 
                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                }`}
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>{isFormValid() ? "Ouvrir la session" : "Vérifier les champs"}</span>
                    {isFormValid() && <ChevronRight size={18} />}
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="text-center mt-8 pt-6 border-t border-slate-50">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-tight">
              Direction des Systèmes d&apos;Information — CEI
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}