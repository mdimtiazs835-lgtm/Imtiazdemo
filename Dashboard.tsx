
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trophy, History, TrendingUp, Users, Play, Cpu, Zap, 
  Wallet, Star, Shield, Bell, Settings, LogOut, 
  MapPin, User, ChevronRight, MessageSquare, AlertCircle,
  DollarSign, Smartphone, Globe, Activity, CheckCircle2,
  Volume2, VolumeX, MonitorPlay, PiggyBank, ArrowRight, X, Copy, Check
} from 'lucide-react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const userProfile = authService.getUser();
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!userProfile) return null;

  const handleCreateRoom = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setRoomCode(code);
    setIsJoining(false);
  };

  const handleJoinRoom = () => {
    if (roomCode.length !== 6) {
      alert("Please enter a valid 6-digit room code.");
      return;
    }
    navigate(`/game?mode=friends&room=${roomCode}`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-24 px-2 md:px-0">
      
      {/* 1. Profile Section */}
      <section className="premium-card p-4 md:p-8 rounded-[30px] md:rounded-[40px] relative overflow-hidden group">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
            <div className="relative">
              <div className="w-20 h-20 md:w-28 md:h-28 rounded-[25px] md:rounded-[35px] bg-slate-100 border-4 border-white shadow-xl overflow-hidden group-hover:scale-105 transition-transform">
                 <img className="w-full h-full object-cover" src={userProfile.avatar} alt="Avatar" />
              </div>
              <div className="absolute -bottom-1 -right-1 md:-bottom-2 md:-right-2 bg-blue-600 text-white px-2 md:px-3 py-1 rounded-full border-2 md:border-4 border-white text-[9px] md:text-[10px] font-black tracking-widest shadow-lg">LV. {userProfile.level}</div>
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3">
                <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tighter">{userProfile.username}</h2>
                <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-blue-100">{userProfile.rank} Rank</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 md:gap-4 mt-2 text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">
                <div className="flex items-center gap-1.5"><Globe size={14} className="text-slate-400" /> {userProfile.country}</div>
                <div className={`flex items-center gap-1.5 text-green-500`}>
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   Live
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="p-4 bg-slate-50 border border-slate-100 rounded-3xl text-slate-600 hover:bg-white hover:shadow-lg transition-all active:scale-95"><Settings size={22} /></button>
          </div>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
        
        {/* Left Column: Wallet */}
        <div className="lg:col-span-4 space-y-6">
          <section className="bg-slate-900 rounded-[30px] md:rounded-[45px] p-8 text-white shadow-2xl relative overflow-hidden group">
             <div className="relative z-10 flex flex-col gap-8">
               <div className="flex items-center justify-between">
                 <div className="p-4 bg-white/10 rounded-2xl"><Wallet size={24} className="text-blue-400" /></div>
                 <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-green-500/20">Verified</div>
               </div>
               <div>
                 <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">Total Balance</p>
                 <h3 className="text-5xl font-extrabold italic tracking-tighter">${userProfile.balance.toFixed(2)}</h3>
               </div>
               <div className="flex gap-3">
                 <button className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 active:scale-95">Add Cash</button>
               </div>
             </div>
             <Trophy size={180} className="absolute -right-16 -bottom-16 text-white/5 -rotate-12" />
          </section>

          <section className="premium-card rounded-[30px] p-6 space-y-4">
            <div className="flex items-center justify-between text-xs font-bold"><span className="text-slate-500">Win Rate</span><span className="text-blue-600 font-black">{userProfile.stats.winRate}%</span></div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-600" style={{ width: `${userProfile.stats.winRate}%` }}></div>
            </div>
          </section>
        </div>

        {/* Right Column: Play Options */}
        <div className="lg:col-span-8 space-y-8">
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Link to="/game?mode=tournament" className="group premium-card rounded-[35px] p-10 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden shadow-2xl hover:scale-[1.01] transition-all">
               <div className="relative z-10 flex flex-col gap-12">
                  <div className="p-5 bg-white/10 rounded-[28px] w-fit"><Trophy size={32} /></div>
                  <div>
                    <h3 className="text-3xl font-black uppercase italic tracking-tighter leading-none">Tournament</h3>
                    <p className="text-xs text-white/70 mt-3 font-semibold uppercase tracking-wider">Stake your skill, win big</p>
                  </div>
                  <div className="flex items-center gap-2 text-white font-black text-xs uppercase tracking-widest">Enter Arena <ChevronRight size={16} /></div>
               </div>
               <Users size={200} className="absolute -right-16 -bottom-16 text-white/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
            </Link>

            <div className="grid grid-rows-2 gap-4">
              <Link to="/game?mode=quick" className="premium-card rounded-3xl p-6 flex items-center justify-between group hover:bg-slate-50 transition-all">
                 <div className="flex items-center gap-5">
                   <div className="p-4 bg-orange-500/10 text-orange-600 rounded-3xl"><Zap size={22} /></div>
                   <div>
                     <h4 className="text-xl font-black text-slate-900 uppercase italic tracking-tight">Quick Match</h4>
                     <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Random 1v1</p>
                   </div>
                 </div>
                 <ChevronRight className="text-slate-300" />
              </Link>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setShowRoomModal(true)} className="premium-card rounded-3xl p-5 group hover:bg-slate-50 transition-all flex flex-col items-start">
                   <div className="p-3 bg-purple-500/10 text-purple-600 rounded-2xl w-fit mb-3"><Smartphone size={18} /></div>
                   <h4 className="text-sm font-black text-slate-900 uppercase">With Friend</h4>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Room Code</p>
                </button>
                <Link to="/game?mode=computer" className="premium-card rounded-3xl p-5 group hover:bg-slate-50 transition-all">
                   <div className="p-3 bg-green-500/10 text-green-600 rounded-2xl w-fit mb-3"><Cpu size={18} /></div>
                   <h4 className="text-sm font-black text-slate-900 uppercase">Practice</h4>
                   <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">Elite AI</p>
                </Link>
              </div>
            </div>
          </section>

          {/* Activity Section */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter px-2">Recent Battles</h3>
            <div className="space-y-3 px-2">
              {[
                { type: 'Tournament', res: 'Win', val: '+$480', date: 'Today, 14:02', opponent: 'Shadow_King' },
                { type: 'Quick Match', res: 'Lose', val: '-$20', date: 'Yesterday, 19:44', opponent: 'AlexX_Pro' },
              ].map((h, i) => (
                <div key={i} className="premium-card p-5 rounded-[30px] flex items-center justify-between">
                   <div className="flex items-center gap-5">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${h.res === 'Win' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                         {h.res === 'Win' ? <Trophy size={18} /> : <AlertCircle size={18} />}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-900 uppercase italic leading-none">{h.type}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1.5 uppercase tracking-widest">vs {h.opponent}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className={`text-lg font-black italic tracking-tighter ${h.res === 'Win' ? 'text-green-500' : 'text-slate-800'}`}>{h.val}</p>
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${h.res === 'Win' ? 'text-green-500' : 'text-red-500'}`}>{h.res}</span>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Room Code Modal */}
      {showRoomModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white rounded-[45px] w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-2xl font-black uppercase italic tracking-tighter leading-none">Friend Arena</h3>
                 <button onClick={() => {setShowRoomModal(false); setRoomCode('');}} className="p-2 hover:bg-white rounded-full transition-all text-slate-400"><X size={24} /></button>
              </div>
              <div className="p-8 space-y-8">
                 <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
                    <button onClick={() => {setIsJoining(false); handleCreateRoom();}} className={`flex-1 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${!isJoining ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Create</button>
                    <button onClick={() => {setIsJoining(true); setRoomCode('');}} className={`flex-1 py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${isJoining ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>Join</button>
                 </div>

                 {isJoining ? (
                   <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <h4 className="font-black text-slate-800 uppercase italic">Enter Room Code</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Get code from your friend</p>
                      </div>
                      <input 
                        type="text" 
                        maxLength={6}
                        placeholder="000000"
                        className="w-full py-6 text-center text-4xl font-black tracking-[0.4em] bg-slate-50 border-2 border-slate-100 rounded-[30px] focus:border-blue-500 outline-none transition-all placeholder:opacity-20 text-blue-600"
                        value={roomCode}
                        onChange={(e) => setRoomCode(e.target.value.replace(/\D/g, ''))}
                      />
                      <button onClick={handleJoinRoom} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">Enter Match</button>
                   </div>
                 ) : (
                   <div className="space-y-6">
                      <div className="text-center space-y-2">
                        <h4 className="font-black text-slate-800 uppercase italic">Share With Friend</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Battle for glory together</p>
                      </div>
                      
                      {roomCode ? (
                        <div className="space-y-6">
                          <div className="relative group">
                            <div className="w-full py-8 text-center text-5xl font-black tracking-[0.2em] bg-blue-50 text-blue-600 rounded-[35px] border-2 border-blue-100">
                              {roomCode}
                            </div>
                            <button onClick={copyToClipboard} className="absolute top-2 right-2 p-3 bg-white border border-blue-100 rounded-2xl text-blue-600 shadow-sm hover:bg-blue-600 hover:text-white transition-all active:scale-90">
                              {copied ? <Check size={20} /> : <Copy size={20} />}
                            </button>
                          </div>
                          <button onClick={() => navigate(`/game?mode=friends&room=${roomCode}&host=true`)} className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-slate-200 hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3">
                            <Play size={18} fill="currentColor" /> Deploy Lobby
                          </button>
                        </div>
                      ) : (
                        <button onClick={handleCreateRoom} className="w-full bg-blue-600 text-white py-8 rounded-[35px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex flex-col items-center gap-2">
                           <Zap size={24} /> Generate Code
                        </button>
                      )}
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
