'use client';
import Image from 'next/image';
import Link from 'next/link';
import { LogIn, UserPlus } from 'lucide-react';

export default function Home() {
  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 text-slate-900 font-sans">
      {/* Fond décoratif */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-linear-to-r from-blue-100 to-indigo-100 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-linear-to-l from-indigo-100 to-pink-100 rounded-full blur-3xl opacity-60 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-linear-to-br from-blue-200 to-transparent rounded-full blur-2xl opacity-30 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 w-full max-w-lg px-6">
        <div className="bg-white/95 backdrop-blur-xl p-10 md:p-16 rounded-[3.5rem] shadow-2xl shadow-slate-300/50 border border-slate-100 text-center transform transition-all hover:shadow-3xl hover:shadow-blue-300/40 hover:scale-[1.01]">
          
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-20 h-20 bg-white p-4 rounded-3xl shadow-lg shadow-blue-100/70 border border-slate-100 hover:shadow-xl hover:scale-105 transition-all">
              <Image
                src="/logo_cei.png"
                alt="Logo CEI"
                fill
                className="object-contain p-2"
                priority
              />
            </div>
          </div>

          {/* Titre & Sigle */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              <span className="bg-linear-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
                SGP-CEI
              </span>
            </h1>
            <div className="mt-4 space-y-1">
              <p className="text-slate-600 text-sm md:text-base font-bold uppercase tracking-widest">
                Système de Gestion des Présences
              </p>
              <div className="h-px w-12 bg-blue-200 mx-auto my-2"></div>
              <p className="text-slate-400 text-[10px] md:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed">
                Portail Officiel de Pointage <br /> 
                Commission Électorale Indépendante
              </p>
            </div>
          </div>

          {/* Boutons d’actions */}
          <div className="space-y-4">
            <Link href="/connexion" className="block">
              <button className="w-full bg-linear-to-r from-slate-900 to-slate-800 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-600 transition-all active:scale-[0.98] shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group">
                <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
                <span>Se connecter</span>
              </button>
            </Link>

            <Link href="/inscription" className="block">
              <button className="w-full bg-white border-2 border-slate-100 text-slate-600 py-5 rounded-2xl font-bold text-lg hover:border-blue-200 hover:text-blue-600 hover:shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 group">
                <UserPlus size={20} className="group-hover:scale-110 transition-transform" />
                <span>Créer un compte</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-[10px] text-slate-400 font-bold tracking-[0.3em] uppercase">
          © 2026 • Direction des Systèmes d&apos;Information
        </p>
      </div>
    </main>
  );
}