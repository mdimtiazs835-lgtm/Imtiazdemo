
import React, { useState } from 'react';
import { 
  Settings, Users, Trophy, ShieldAlert, BarChart3, 
  CreditCard, Wand2, Target, Plus, Search, Trash2, 
  Ban, DollarSign, Activity, Power, UserMinus, 
  CheckCircle, XCircle, Monitor, RefreshCw, Eye,
  AlertCircle, ChevronRight, Filter, Download, X
} from 'lucide-react';
import { tournamentService } from '../services/tournamentService';
import { Tournament } from '../types';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [luckValues, setLuckValues] = useState({ red: 50, green: 50, blue: 50, yellow: 50 });
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Form State
  const [newTournament, setNewTournament] = useState<Partial<Tournament>>({
    title: '',
    entryFee: '$10',
    prizePool: '$100',
    maxParticipants: 4,
    type: 'Classic',
  });

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    const tournament: Tournament = {
      id: 't-' + Math.random().toString(36).substr(2, 5),
      title: newTournament.title || 'Untitled Battle',
      entryFee: newTournament.entryFee || '$10',
      prizePool: newTournament.prizePool || '$100',
      participants: 0,
      maxParticipants: Number(newTournament.maxParticipants) || 4,
      status: 'UPCOMING',
      type: (newTournament.type as any) || 'Classic',
      startTime: Date.now() + 30 * 60000,
      isFull: false
    };
    
    tournamentService.addTournament(tournament);
    setShowCreateModal(false);
    setNewTournament({ title: '', entryFee: '$10', prizePool: '$100', maxParticipants: 4, type: 'Classic' });
    alert('Tournament Created Successfully!');
  };

  return (
    <div className="space-y-8 pb-24 max-w-7xl mx-auto animate-in fade-in duration-500 px-4 md:px-0">
      
      {/* 1. Admin Overview & Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter italic uppercase leading-none">System Core</h1>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Activity size={12} className="text-blue-500 animate-pulse" /> Platform Command Hub
          </p>
        </div>
        <div className="flex gap-3">
           <button onClick={() => setShowCreateModal(true)} className="bg-blue-600 text-white px-6 py-4 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">
             <Plus size={16} /> New Tournament
           </button>
        </div>
      </div>

      {/* Create Tournament Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-lg overflow-hidden shadow-2xl animate-in zoom-in duration-300">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-2xl font-black uppercase italic tracking-tighter">Create Event</h3>
               <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-white rounded-full transition-all"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateTournament} className="p-8 space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tournament Title</label>
                 <input 
                  type="text" 
                  required
                  placeholder="e.g. Master's League"
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                  value={newTournament.title}
                  onChange={e => setNewTournament({...newTournament, title: e.target.value})}
                 />
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Entry Fee</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                      value={newTournament.entryFee}
                      onChange={e => setNewTournament({...newTournament, entryFee: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prize Pool</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                      value={newTournament.prizePool}
                      onChange={e => setNewTournament({...newTournament, prizePool: e.target.value})}
                    />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Max Players</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold"
                      value={newTournament.maxParticipants}
                      onChange={e => setNewTournament({...newTournament, maxParticipants: Number(e.target.value)})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Match Mode</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold appearance-none"
                      value={newTournament.type}
                      onChange={e => setNewTournament({...newTournament, type: e.target.value as any})}
                    >
                      <option value="Classic">Classic</option>
                      <option value="Blitz">Blitz</option>
                      <option value="Pro">Pro</option>
                      <option value="Grand">Grand</option>
                    </select>
                  </div>
               </div>
               <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Deploy Tournament</button>
            </form>
          </div>
        </div>
      )}

      {/* Admin Navigation Bar */}
      <div className="flex gap-2 bg-white p-2 rounded-[30px] shadow-sm border border-slate-200 overflow-x-auto no-scrollbar mb-10">
         {[
           { id: 'overview', icon: <BarChart3 size={18} />, label: 'Analytics' },
           { id: 'matches', icon: <Monitor size={18} />, label: 'Live' },
           { id: 'users', icon: <Users size={18} />, label: 'Users' },
           { id: 'anti-cheat', icon: <ShieldAlert size={18} />, label: 'Security' },
         ].map(tab => (
           <button 
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 px-7 py-4 rounded-[22px] font-black uppercase italic tracking-tight text-[11px] transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-xl' : 'text-slate-400 hover:bg-slate-50'}`}
           >
             {tab.icon} {tab.label}
           </button>
         ))}
      </div>

      {/* Analytics Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { label: 'Total Players', val: '14,290', trend: '+420 Today', color: 'text-blue-600', bg: 'bg-blue-50' },
               { label: 'Active Matches', val: '342', trend: 'Live Now', color: 'text-green-600', bg: 'bg-green-50' },
               { label: 'Net Revenue', val: '$42,840', trend: '+15.2%', color: 'text-orange-600', bg: 'bg-orange-50' },
               { label: 'Online Admin', val: '04', trend: 'Global', color: 'text-purple-600', bg: 'bg-purple-50' },
             ].map((s, i) => (
               <div key={i} className="premium-card p-8 rounded-[40px] relative overflow-hidden">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">{s.label}</p>
                  <div className="flex items-end justify-between">
                     <h3 className="text-3xl font-extrabold text-slate-900 tracking-tighter italic">{s.val}</h3>
                     <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${s.bg} ${s.color}`}>{s.trend}</span>
                  </div>
               </div>
             ))}
          </div>
        </div>
      )}

      {/* Security/Anti-Cheat Tab */}
      {activeTab === 'anti-cheat' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="premium-card p-10 rounded-[50px] shadow-sm">
              <div className="flex items-center gap-6 mb-12">
                 <div className="p-5 bg-blue-50 text-blue-600 rounded-3xl"><Wand2 size={28} /></div>
                 <div>
                   <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">Luck Control</h3>
                   <p className="text-xs text-slate-400 font-bold uppercase mt-1">Global Dice Algorithm Bias</p>
                 </div>
              </div>
              <div className="space-y-8">
                 {(Object.entries(luckValues) as [string, number][]).map(([color, val]) => (
                    <div key={color} className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-slate-700 uppercase tracking-widest">{color} Luck</span>
                          <span className={`text-[11px] font-black px-3 py-1 rounded-lg ${val > 50 ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>{val}%</span>
                       </div>
                       <input type="range" className="w-full h-2.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600" min="0" max="100" value={val} onChange={(e) => setLuckValues(prev => ({ ...prev, [color]: parseInt(e.target.value) }))} />
                    </div>
                 ))}
                 <button className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-slate-800 active:scale-95 transition-all">Save Global Settings</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
