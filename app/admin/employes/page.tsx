'use client';
import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  UserPlus, Trash2, RefreshCcw, Search, ArrowLeft,
  Edit, User, ArchiveX, X, Mail, FileDown,
  BarChart3, Users2, CalendarDays, Clock, Trophy, Target, PieChart, TrendingUp
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// --- TYPES & INTERFACES ---
interface jsPDFWithAutoTable extends jsPDF {
  lastAutoTable?: {
    finalY: number;
  };
}

type Gender = 'Homme' | 'Femme';
type Status = 'Présent' | 'Absent';
type FilterStatus = 'Tous' | Status;

interface Employee {
  id: number;
  name: string;
  email: string;
  service: string;
  gender: Gender;
  status: Status;
  arrivalTime: string;
  departureTime: string;
}

export default function AdminPage() {
  // --- ÉTAT DES DONNÉES ---
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 1, name: 'Jean Kouassi', email: 'j.kouassi@cei.ci', service: 'Développement', gender: 'Homme', status: 'Présent', arrivalTime: '07:45', departureTime: '17:30' },
    { id: 2, name: 'Marie Bakayoko', email: 'm.bakayoko@cei.ci', service: 'Sécurité', gender: 'Femme', status: 'Absent', arrivalTime: '--:--', departureTime: '--:--' },
    { id: 3, name: 'Ahmed Sylla', email: 'a.sylla@cei.ci', service: 'Réseaux', gender: 'Homme', status: 'Présent', arrivalTime: '08:02', departureTime: '18:15' },
    { id: 4, name: 'Yao Konan', email: 'y.konan@cei.ci', service: 'Réseaux', gender: 'Homme', status: 'Présent', arrivalTime: '07:30', departureTime: '16:45' },
    { id: 5, name: 'Awa Diabaté', email: 'a.diabate@cei.ci', service: 'Maintenance', gender: 'Femme', status: 'Présent', arrivalTime: '07:55', departureTime: '17:00' },
    { id: 6, name: 'Koffi Serge', email: 'k.serge@cei.ci', service: 'Sécurité', gender: 'Homme', status: 'Absent', arrivalTime: '--:--', departureTime: '--:--' },
    { id: 7, name: 'Adjoua Laure', email: 'a.laure@cei.ci', service: 'Maintenance', gender: 'Femme', status: 'Présent', arrivalTime: '08:10', departureTime: '17:45' },
    { id: 8, name: 'Bamba Moussa', email: 'b.moussa@cei.ci', service: 'Développement', gender: 'Homme', status: 'Présent', arrivalTime: '07:40', departureTime: '17:20' },
    { id: 9, name: 'Tanoh Alice', email: 't.alice@alice.ci', service: 'Sécurité', gender: 'Femme', status: 'Présent', arrivalTime: '07:50', departureTime: '16:55' },
    { id: 10, name: 'Guei Franck', email: 'g.franck@cei.ci', service: 'Maintenance', gender: 'Homme', status: 'Présent', arrivalTime: '08:05', departureTime: '18:00' },
  ]);

  const [deletedEmployees, setDeletedEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('Tous');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [activeTab, setActiveTab] = useState<'liste' | 'stats'>('liste');
  
  const [formData, setFormData] = useState<Omit<Employee, 'id' | 'status' | 'arrivalTime' | 'departureTime'>>({
    name: '', email: '', service: 'Développement', gender: 'Homme'
  });

  // --- LOGIQUE DES STATISTIQUES (useMemo pour la performance) ---
  const extraStats = useMemo(() => {
    const presents = employees.filter(e => e.status === 'Présent');
    const total = employees.length;

    // 1. Ponctualité (Seuil 08:00)
    const retards = presents.filter(e => {
      const [h, m] = e.arrivalTime.split(':').map(Number);
      return h > 8 || (h === 8 && m > 0);
    });

    const topPonctuels = [...presents]
      .sort((a, b) => a.arrivalTime.localeCompare(b.arrivalTime))
      .slice(0, 3);

    // 2. Parité
    const femmesCount = employees.filter(e => e.gender === 'Femme').length;
    const pariteF = total > 0 ? (femmesCount / total) * 100 : 0;

    // 3. Analyse par Service
    const services = ['Développement', 'Réseaux', 'Sécurité', 'Maintenance'];
    const serviceStats = services.map(srv => {
      const srvEmps = employees.filter(e => e.service === srv);
      const srvPresents = srvEmps.filter(e => e.status === 'Présent').length;
      return {
        name: srv,
        count: srvEmps.length,
        rate: srvEmps.length > 0 ? (srvPresents / srvEmps.length) * 100 : 0
      };
    });

    return { retards: retards.length, topPonctuels, pariteF, serviceStats };
  }, [employees]);

  const statsMars = { presents: 7, absents: 3 };
  const presentsActuels = employees.filter(e => e.status === 'Présent').length;
  const absentsActuels = employees.filter(e => e.status === 'Absent').length;

  // --- ACTIONS ---
  const generatePDF = () => {
    const doc = new jsPDF() as jsPDFWithAutoTable;
    const date = new Date().toLocaleDateString('fr-FR');
    
    doc.setFontSize(20);
    doc.setTextColor(30, 41, 59);
    doc.text('RAPPORT DE PERFORMANCE - CEI', 14, 20);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Généré le : ${date} | Période : Avril 2026`, 14, 28);

    doc.setFontSize(14);
    doc.setTextColor(37, 99, 235);
    doc.text('1. Comparatif Mensuel des Présences', 14, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Indicateur', 'Mois Passé (Mars)', 'Mois Actuel (Avril)', 'Écart']],
      body: [
        ['Nombre d\'agents Présents', statsMars.presents.toString(), presentsActuels.toString(), (presentsActuels - statsMars.presents >= 0 ? '+' : '') + (presentsActuels - statsMars.presents)],
        ['Nombre d\'agents Absents', statsMars.absents.toString(), absentsActuels.toString(), (absentsActuels - statsMars.absents >= 0 ? '+' : '') + (absentsActuels - statsMars.absents)],
        ['Taux de présence (%)', '82%', '88%', '+6%']
      ],
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59] },
    });

    const finalY = doc.lastAutoTable?.finalY || 80;
    doc.setTextColor(30, 41, 59);
    doc.text('2. Liste Complète des Agents', 14, finalY + 15);

    autoTable(doc, {
      startY: finalY + 20,
      head: [['Agent', 'Service', 'Statut', 'Arrivée']],
      body: employees.map(emp => [emp.name, emp.service, emp.status, emp.arrivalTime]),
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`Rapport_Complet_CEI_${date}.pdf`);
  };

  const openAddModal = () => {
    setEditingEmployee(null);
    setFormData({ name: '', email: '', service: 'Développement', gender: 'Homme' });
    setIsModalOpen(true);
  };

  const openEditModal = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({ name: emp.name, email: emp.email, service: emp.service, gender: emp.gender });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEmployee) {
      setEmployees(employees.map(emp => emp.id === editingEmployee.id ? { ...emp, ...formData } : emp));
    } else {
      setEmployees([{ 
        ...formData, 
        id: Date.now(), 
        status: 'Absent', 
        arrivalTime: '--:--', 
        departureTime: '--:--' 
      }, ...employees]);
    }
    setIsModalOpen(false);
  };

  const deleteEmployee = (id: number) => {
    const emp = employees.find(e => e.id === id);
    if (emp) {
      setDeletedEmployees([emp, ...deletedEmployees]);
      setEmployees(employees.filter(e => e.id !== id));
    }
  };

  const restoreEmployee = (id: number) => {
    const emp = deletedEmployees.find(e => e.id === id);
    if (emp) {
      setEmployees([...employees, emp]);
      setDeletedEmployees(deletedEmployees.filter(e => e.id !== id));
    }
  };

  const filteredEmployees = employees.filter(emp => {
    const nameMatch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const serviceMatch = emp.service.toLowerCase().includes(searchTerm.toLowerCase());
    const statusMatch = filterStatus === 'Tous' || emp.status === filterStatus;
    return (nameMatch || serviceMatch) && statusMatch;
  });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      
      {/* MODAL AJOUT/EDIT */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-white">
            <div className="bg-linear-to-r from-blue-600 to-indigo-700 p-8 text-white flex justify-between items-center">
              <h2 className="text-xl font-black tracking-tight uppercase">
                {editingEmployee ? "Éditer l'Agent" : "Nouvel Agent"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 transition-all">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required placeholder="Nom Complet" className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-2 ring-blue-500/20" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input required type="email" placeholder="Email Pro" className="w-full bg-slate-50 border border-slate-200 p-4 pl-12 rounded-2xl outline-none focus:ring-2 ring-blue-500/20" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none cursor-pointer" value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                  <option value="Développement">Développement</option>
                  <option value="Réseaux">Réseaux</option>
                  <option value="Sécurité">Sécurité</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
                <select className="bg-slate-50 border border-slate-200 p-4 rounded-2xl outline-none cursor-pointer" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value as Gender})}>
                  <option value="Homme">Homme</option>
                  <option value="Femme">Femme</option>
                </select>
              </div>
              <button type="submit" className="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-blue-600 transition-all uppercase text-xs tracking-[0.2em]">
                Valider l&apos;enregistrement
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white/80 backdrop-blur-xl border-b p-5 px-8 sticky top-0 z-40 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
            <Users2 className="text-white" size={24} />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase text-slate-900">Administration</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={generatePDF} className="flex items-center gap-2 p-3 px-5 bg-emerald-50 text-emerald-600 rounded-2xl font-bold text-xs hover:bg-emerald-100 transition-all border border-emerald-100">
            <FileDown size={18} /> RAPPORT COMPLET PDF
          </button>
          <Link href="/connexion" className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-red-500 transition-all">
            <ArrowLeft size={20} />
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        {/* CARDS STATS RAPIDES */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aujourd&apos;hui</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-3xl font-black text-slate-900">{presentsActuels}</h3>
              <span className="text-emerald-500 font-bold text-xs mb-1">Présents</span>
            </div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Absences</p>
            <div className="flex items-end gap-3 mt-2">
              <h3 className="text-3xl font-black text-slate-900">{absentsActuels}</h3>
              <span className="text-rose-500 font-bold text-xs mb-1">Absents</span>
            </div>
          </div>
          <div className="bg-slate-900 p-6 rounded-3xl text-white shadow-xl">
            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Taux Moyen</p>
            <h3 className="text-3xl font-black mt-2">88%</h3>
            <p className="text-slate-400 text-[10px] mt-1 font-medium italic">Performance globale</p>
          </div>
          <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl text-white shadow-xl">
            <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Effectif</p>
            <h3 className="text-3xl font-black mt-2">{employees.length}</h3>
            <p className="text-blue-100/60 text-[10px] mt-1 font-medium uppercase">Agents actifs</p>
          </div>
        </div>

        {/* TABS MENU */}
        <div className="flex gap-4 mb-8 bg-slate-200/50 p-1.5 rounded-3xl w-fit">
          <button onClick={() => setActiveTab('liste')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'liste' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
            <Users2 size={16}/> Liste
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>
            <BarChart3 size={16}/> Analyses
          </button>
        </div>

        {activeTab === 'liste' ? (
          <>
            {/* BARRE DE RECHERCHE & FILTRE */}
            <div className="flex flex-col lg:flex-row gap-6 mb-10 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input placeholder="Rechercher par nom ou service..." className="w-full p-5 pl-14 rounded-3xl border border-slate-200 bg-white shadow-sm outline-none focus:ring-4 ring-blue-500/5" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              </div>
              <div className="flex gap-4 w-full lg:w-auto">
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as FilterStatus)} className="p-5 px-8 rounded-3xl border border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest outline-none cursor-pointer">
                  <option value="Tous">Tous</option>
                  <option value="Présent">Présents</option>
                  <option value="Absent">Absents</option>
                </select>
                <button onClick={openAddModal} className="lg:flex-none bg-blue-600 text-white px-10 py-5 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl hover:bg-slate-900 transition-all">
                  <UserPlus size={18}/> Ajouter
                </button>
              </div>
            </div>

            {/* TABLEAU DES EMPLOYES */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden mb-12">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100">
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400">Agent</th>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 text-center">Status</th>
                      <th className="p-8 text-[10px] font-black uppercase text-slate-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredEmployees.map(emp => (
                      <tr key={emp.id} className="group hover:bg-blue-50/30 transition-all">
                        <td className="p-8 font-black text-sm text-slate-800">
                          {emp.name} 
                          <span className="block text-[9px] text-slate-400 uppercase tracking-tighter">{emp.service}</span>
                        </td>
                        <td className="p-8 text-center">
                          <span className={`px-4 py-2 rounded-full text-[9px] font-black uppercase border ${emp.status === 'Présent' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}`}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="p-8 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => openEditModal(emp)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600"><Edit size={18}/></button>
                          <button onClick={() => deleteEmployee(emp.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600"><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          /* SECTION STATISTIQUES DÉTAILLÉES */
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Comparaison Mensuelle */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><CalendarDays size={16}/> Comparaison Mensuelle</h4>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="p-5 bg-slate-50 rounded-2xl">
                      <p className="text-[9px] font-black text-slate-400 uppercase mb-2">Mois Passé (Mars)</p>
                      <div className="flex justify-between items-center">
                        <div><p className="text-xs font-bold">Présents</p><p className="text-xl font-black text-slate-900">{statsMars.presents}</p></div>
                        <div><p className="text-xs font-bold">Absents</p><p className="text-xl font-black text-rose-500">{statsMars.absents}</p></div>
                      </div>
                    </div>
                    <div className="p-5 bg-blue-50/50 rounded-2xl border border-blue-100">
                      <p className="text-[9px] font-black text-blue-600 uppercase mb-2">Mois Actuel (Avril)</p>
                      <div className="flex justify-between items-center">
                        <div><p className="text-xs font-bold">Présents</p><p className="text-xl font-black text-blue-700">{presentsActuels}</p></div>
                        <div><p className="text-xs font-bold">Absents</p><p className="text-xl font-black text-rose-600">{absentsActuels}</p></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-emerald-50 rounded-2xl flex justify-between items-center">
                    <span className="text-[10px] font-black text-emerald-700 uppercase">Évolution des présences</span>
                    <span className="font-black text-emerald-600">+{((presentsActuels - statsMars.presents) / statsMars.presents * 100).toFixed(0)}%</span>
                  </div>
                </div>

                {/* Top Ponctualité */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><Trophy size={16} className="text-amber-500"/> Top 3 Ponctualité</h4>
                  <div className="space-y-3">
                    {extraStats.topPonctuels.map((e, index) => (
                      <div key={e.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-4">
                          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-xs font-black shadow-sm">{index + 1}</span>
                          <p className="text-sm font-bold">{e.name}</p>
                        </div>
                        <span className="text-xs font-black text-blue-600 flex items-center gap-2"><Clock size={12}/> {e.arrivalTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Analyse Services & Parité */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl">
                    <h4 className="font-black text-xs uppercase tracking-widest text-blue-400 mb-6 flex items-center gap-2"><Target size={16}/> Taux de Présence par Service</h4>
                    <div className="space-y-6">
                      {extraStats.serviceStats.map(srv => (
                        <div key={srv.name}>
                          <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                            <span className="text-slate-400">{srv.name}</span>
                            <span>{srv.rate.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full transition-all duration-1000" style={{ width: `${srv.rate}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2"><PieChart size={16}/> Mixité & Parité</h4>
                      <div className="flex items-center justify-center py-4">
                        <div className="relative w-32 h-32">
                          <svg className="w-full h-full" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-100" strokeWidth="3"></circle>
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-indigo-600" strokeWidth="3" strokeDasharray={`${extraStats.pariteF}, 100`} transform="rotate(-90 18 18)"></circle>
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center flex-col">
                            <span className="text-xl font-black">{extraStats.pariteF.toFixed(0)}%</span>
                            <span className="text-[8px] font-black text-slate-400 uppercase">Femmes</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="p-4 bg-indigo-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-indigo-600 uppercase">Féminin</p>
                        <p className="text-lg font-black">{employees.filter(e => e.gender === 'Femme').length}</p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase">Masculin</p>
                        <p className="text-lg font-black">{employees.filter(e => e.gender === 'Homme').length}</p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Flux & Retards */}
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex justify-between items-center mb-8">
                   <h4 className="font-black text-xs uppercase tracking-widest text-slate-400 flex items-center gap-2"><TrendingUp size={16}/> Flux de Travail & Retards</h4>
                   <span className="bg-rose-50 text-rose-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase border border-rose-100 flex items-center gap-2">
                     <Clock size={12}/> {extraStats.retards} Retards détectés aujourd&apos;hui
                   </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="p-6 border border-slate-50 bg-slate-50/30 rounded-2xl">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Moyenne Arrivée</p>
                      <h5 className="text-2xl font-black">07h52</h5>
                   </div>
                   <div className="p-6 border border-slate-50 bg-slate-50/30 rounded-2xl text-center">
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Total Heures (Est.)</p>
                      <h5 className="text-2xl font-black">2 480h</h5>
                   </div>
                   <div className="p-6 border border-slate-50 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-100">
                      <p className="text-[10px] font-black text-blue-200 uppercase mb-1">Pic d&apos;Affluence</p>
                      <h5 className="text-2xl font-black">Mardi</h5>
                   </div>
                </div>
              </div>
          </div>
        )}

        {/* ARCHIVES (uniquement visible sur l'onglet Liste) */}
        {deletedEmployees.length > 0 && activeTab === 'liste' && (
          <div className="bg-slate-900 rounded-3xl p-10 text-white shadow-2xl mt-12">
            <h2 className="text-lg font-black uppercase flex items-center gap-3 mb-8"><ArchiveX className="text-rose-500"/> Archives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {deletedEmployees.map(emp => (
                <div key={emp.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex justify-between items-center">
                  <span className="text-sm font-black">{emp.name}</span>
                  <button onClick={() => restoreEmployee(emp.id)} className="p-3 bg-blue-600/20 text-blue-400 rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                    <RefreshCcw size={16}/>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}