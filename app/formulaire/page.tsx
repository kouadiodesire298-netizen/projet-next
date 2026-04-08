'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { LogIn, LogOut, CheckCircle, Sparkles, Sun, Moon, Coffee } from 'lucide-react';

export default function PointagePage() {
  // 1. Initialisation optimisée du nom
  const [userName] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('userName') || 'Agent';
    }
    return 'Agent';
  });

  // 2. Initialisation optimisée du salut
  const [greeting] = useState<string>(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  });

  const [arrivalTime, setArrivalTime] = useState<string | null>(null);
  const [departureTime, setDepartureTime] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [confirmationData, setConfirmationData] = useState<{msg: string, time: string, type: 'arrival' | 'departure'} | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('fr-FR', { 
        hour: '2-digit', minute: '2-digit', second: '2-digit' 
      }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleArrival = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setArrivalTime(time);
    setConfirmationData({
      msg: `Ravi de vous voir, ${userName}. Votre journée commence !`,
      time: time,
      type: 'arrival'
    });
    setTimeout(() => setConfirmationData(null), 5000);
  };

  const handleDeparture = () => {
    const now = new Date();
    const time = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    setDepartureTime(time);
    setConfirmationData({
      msg: `Excellent travail, ${userName}. Reposez-vous bien !`,
      time: time,
      type: 'departure'
    });
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#f8fafc] p-4 overflow-hidden font-sans">
      
      {/* BACKGROUND DECOR */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-10%] w-175 h-175 bg-linear-to-br from-blue-400/20 to-transparent rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-175 h-175 bg-linear-to-tr from-orange-400/10 to-transparent rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      {/* MODAL DE CONFIRMATION */}
      {confirmationData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-xl p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white p-12 rounded-[4rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] border border-white text-center max-w-md w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-linear-to-r from-blue-500 via-green-500 to-orange-500"></div>
            
            <div className="flex justify-center mb-8">
              <div className="relative bg-slate-900 p-6 rounded-4xl text-blue-400 shadow-2xl">
                <CheckCircle size={48} strokeWidth={2.5} />
              </div>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter uppercase">Validé</h3>
            <p className="text-slate-600 font-medium mb-10 leading-relaxed text-lg italic">
              &quot;{confirmationData.msg}&quot;
            </p>

            <div className="bg-slate-50 rounded-4xl py-6 px-8 inline-flex items-center gap-6 mb-10 border border-slate-100 shadow-inner">
              <div className="text-left">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Enregistré à</p>
                <p className="text-3xl font-black text-blue-600 tabular-nums">{confirmationData.time}</p>
              </div>
              <Sparkles className="text-orange-400 animate-pulse" />
            </div>
            
            {confirmationData.type === 'departure' ? (
              <Link href="/" className="block">
                <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl active:scale-95">
                   Quitter la session
                </button>
              </Link>
            ) : (
              <div className="text-green-600 font-black text-xs uppercase tracking-widest animate-pulse">
                Bon service à la CEI
              </div>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      <div className="relative z-10 w-full max-w-120">
        
        <div className="mb-10 text-center space-y-2">
          <div className="flex justify-center mb-4">
             {new Date().getHours() < 18 ? <Sun className="text-orange-400 animate-spin-slow" /> : <Moon className="text-indigo-400" />}
          </div>
          <h2 className="text-slate-400 text-xs font-black uppercase tracking-[0.4em]">{greeting}</h2>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
            {userName.split(' ')[0]} <span className="text-blue-600">.</span>
          </h1>
        </div>

        <div className="bg-white/80 backdrop-blur-3xl p-10 rounded-[4rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-white/50 relative overflow-hidden">
          
          <div className="mb-14 relative group">
             <div className="relative bg-slate-900 py-10 rounded-[3rem] text-white shadow-2xl flex flex-col items-center border border-slate-800">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-2">Heure Locale</span>
                <div className="text-5xl font-black tracking-widest tabular-nums">
                   {currentTime || '--:--:--'}
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <button 
              onClick={handleArrival} 
              disabled={!!arrivalTime}
              className={`group flex flex-col items-center justify-center p-10 rounded-[3rem] border-2 transition-all relative ${
                arrivalTime 
                ? 'bg-green-50 border-green-100 text-green-600 opacity-60' 
                : 'bg-white border-slate-100 text-slate-400 hover:border-blue-500 hover:text-blue-600 active:scale-95 shadow-sm'
              }`}
            >
              <LogIn size={32} className="mb-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{arrivalTime || 'Arrivée'}</span>
            </button>

            <button 
              onClick={handleDeparture} 
              disabled={!arrivalTime || !!departureTime}
              className={`group flex flex-col items-center justify-center p-10 rounded-[3rem] border-2 transition-all relative ${
                departureTime 
                ? 'bg-red-50 border-red-100 text-red-600 opacity-60' 
                : arrivalTime 
                  ? 'bg-white border-slate-100 text-slate-400 hover:border-red-500 hover:text-red-600 active:scale-95 shadow-sm' 
                  : 'bg-slate-50/50 text-slate-200 border-transparent cursor-not-allowed'
              }`}
            >
              <LogOut size={32} className="mb-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{departureTime || 'Départ'}</span>
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center opacity-40">
          <div className="flex items-center gap-3 text-slate-500 mb-2">
            <Coffee size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Système de Gestion de Pointage</span>
          </div>
          <div className="h-px w-20 bg-linear-to-r from-transparent via-slate-300 to-transparent"></div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </main>
  );
}