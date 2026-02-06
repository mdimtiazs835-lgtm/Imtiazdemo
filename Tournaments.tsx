
import React, { useState, useEffect } from 'react';
import { Trophy, Users, Clock, Search, Filter, Calendar, Zap, CheckCircle2, AlertTriangle, PiggyBank, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { tournamentService } from '../services/tournamentService';
import { Tournament } from '../types';

const TournamentTimer: React.FC<{ targetTime: number }> = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now();
      const diff = targetTime - now;
      if (diff <= 0) {
        setTimeLeft('Starting Now');
        return;
      }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="flex items-center gap-1.5 text-blue-500 font-bold">
      <Clock size={14} />
      <span className="text-[10px] uppercase tracking-wider">{timeLeft}</span>
    </div>
  );
};

const Tournaments: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'RUNNING' | 'JOINED'>('UPCOMING');
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [joinedIds, setJoinedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const unsub = tournamentService.subscribe(setTournaments);
    const savedJoined = localStorage.getItem('joined_tournaments');
    if (savedJoined) setJoinedIds(new Set(JSON.parse(savedJoined)));
    return unsub;
  }, []);

  useEffect(() => {
    localStorage.setItem('joined_tournaments', JSON.stringify(Array.from(joinedIds)));
  }, [joinedIds]);

  const toggleJoin = (id: string) => {
    const newJoined = new Set(joinedIds);
    if (newJoined.has(id)) {
      newJoined.delete(id);
    } else {
      tournamentService.joinTournament(id);
      newJoined.add(id);
    }
    setJoinedIds(newJoined);
  };

  const filteredTournaments = tournaments.filter(t => {
    if (activeTab === 'JOINED') return joinedIds.has(t.id);
    return t.status === activeTab;
  });

  return (
    <div className="space-y-6 md:space-y-8 max-w-7xl mx-auto pb-20 px-4 md:px-0">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 uppercase italic tracking-tighter leading-none">Contests</h2>
          <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest mt-2 italic">Real-Time Matchmaking</p>
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm font-medium text-sm transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl w-full md:w-fit border border-slate-200 shadow-inner overflow-x-auto no-scrollbar">
        {[
          { id: 'UPCOMING', label: 'Upcoming', icon: <Calendar size={14} /> },
          { id: 'RUNNING', label: 'Running', icon: <Zap size={14} /> },
          { id: 'JOINED', label: 'Joined', icon: <CheckCircle2 size={14} /> }
        ].map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-5 md:px-6 py-2.5 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${
              activeTab === tab.id 
              ? 'bg-blue-600 text-white shadow-lg' 
              : 'text-slate-500 hover:bg-white/50'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {filteredTournaments.map((t) => (
          <div key={t.id} className="premium-card rounded-[35px] md:rounded-[45px] overflow-hidden flex flex-col group transition-all duration-300">
            <div className="p-6 md:p-8 pb-4 flex justify-between items-start">
               <div className="p-3 md:p-4 bg-blue-50 text-blue-600 rounded-2xl md:rounded-3xl">
                 <Trophy size={24} />
               </div>
               <div className="text-right">
                 <p className="text-2xl md:text-3xl font-black text-slate-800 italic tracking-tighter leading-none">{t.prizePool}</p>
                 <p className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase mt-1 tracking-widest">Grand Pool</p>
               </div>
            </div>

            <div className="p-6 md:p-8 space-y-4 md:space-y-6 flex-1">
              <div>
                <h3 className="text-lg md:text-xl font-black text-slate-800 italic uppercase tracking-tight leading-tight">{t.title}</h3>
                <div className="flex items-center gap-2 mt-3">
                   <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-100">{t.type} Mode</span>
                   <div className="flex items-center gap-1.5 text-orange-500 font-bold text-[9px] uppercase tracking-wider ml-auto">
                      <PiggyBank size={12} /> Gulla Enabled
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 md:gap-4">
                <div className="bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                     <Users size={12} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Joined</span>
                   </div>
                   <p className="font-black text-slate-700 text-xs md:text-sm">
                     {t.participants} / {t.maxParticipants}
                   </p>
                </div>
                <div className="bg-slate-50 p-3 md:p-4 rounded-2xl md:rounded-3xl border border-slate-100">
                   <div className="flex items-center gap-1.5 text-slate-400 mb-1">
                     <Clock size={12} />
                     <span className="text-[8px] font-black uppercase tracking-widest">Start</span>
                   </div>
                   {t.status === 'RUNNING' ? (
                      <span className="text-green-500 font-black text-[9px] uppercase animate-pulse">Live</span>
                   ) : (
                     <TournamentTimer targetTime={t.startTime} />
                   )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-slate-100 mt-2">
                <div className="flex flex-col">
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Fee</span>
                  <span className={`text-md md:text-lg font-black italic tracking-tighter ${t.entryFee === 'FREE' ? 'text-green-600' : 'text-slate-800'}`}>
                    {t.entryFee}
                  </span>
                </div>
                
                {joinedIds.has(t.id) ? (
                  <div className="flex gap-2">
                    <Link 
                      to={`/game?mode=tournament&id=${t.id}`} 
                      className={`bg-blue-600 text-white px-5 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest shadow-lg ${t.participants < t.maxParticipants ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
                      onClick={(e) => {
                        if (t.participants < t.maxParticipants) {
                          e.preventDefault();
                          alert(`Waiting for more players... (${t.participants}/${t.maxParticipants})`);
                        }
                      }}
                    >
                      {t.participants < t.maxParticipants ? (
                        <span className="flex items-center gap-2"><Loader2 size={12} className="animate-spin" /> Waiting</span>
                      ) : 'Enter Match'}
                    </Link>
                  </div>
                ) : (
                  <button onClick={() => toggleJoin(t.id)} disabled={t.participants >= t.maxParticipants} className={`px-6 md:px-10 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all ${t.participants >= t.maxParticipants ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-blue-600 shadow-xl'}`}>
                    {t.participants >= t.maxParticipants ? 'Full' : 'Join'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tournaments;
