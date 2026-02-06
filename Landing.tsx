
import React from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Zap, ShieldCheck, Smartphone, Users, ChevronRight, Play, Star, PiggyBank } from 'lucide-react';

const Landing: React.FC = () => {
  return (
    <div className="bg-white text-slate-900 overflow-x-hidden font-sans">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-slate-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg rotate-3">L</div>
          <span className="font-black text-lg tracking-tighter">LUDO PRO</span>
        </div>
        <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#tournaments" className="hover:text-blue-600 transition-colors">Tournaments</a>
          <a href="#security" className="hover:text-blue-600 transition-colors">Security</a>
        </div>
        <Link to="/auth" className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200">
          Play Now
        </Link>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-8 border border-blue-100 animate-in fade-in slide-in-from-bottom duration-700">
          <Zap size={14} /> The World's #1 Tournament Platform
        </div>
        <h1 className="text-5xl md:text-8xl font-black tracking-tighter italic uppercase leading-none mb-8 animate-in fade-in slide-in-from-bottom duration-1000">
          The Future of <br/> <span className="text-blue-600">Ludo Battle</span>
        </h1>
        <p className="max-w-2xl text-slate-500 text-lg md:text-xl font-medium leading-relaxed mb-12 animate-in fade-in slide-in-from-bottom duration-1000 delay-200">
          Join thousands of real players in professional tournaments. Stake your skill, dominate the board, and withdraw your winnings instantly.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
          <Link to="/auth?mode=register" className="bg-blue-600 text-white px-10 py-5 rounded-[22px] font-black uppercase text-xs tracking-widest hover:bg-blue-700 transition-all shadow-2xl shadow-blue-200 active:scale-95 flex items-center justify-center gap-2">
            Create Free Account <ChevronRight size={18} />
          </Link>
          <Link to="/auth" className="bg-white border-2 border-slate-100 text-slate-900 px-10 py-5 rounded-[22px] font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center gap-2">
            Log In <Play size={16} fill="currentColor" />
          </Link>
        </div>

        {/* Floating Board Preview (Abstract) */}
        <div className="mt-20 w-full max-w-4xl bg-slate-50 rounded-[50px] p-4 border border-slate-100 shadow-2xl relative group">
           <img src="https://images.unsplash.com/photo-1611996598533-4b1fba40a889?auto=format&fit=crop&q=80&w=1200" className="w-full h-[400px] object-cover rounded-[40px] opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700" alt="Ludo App Preview" />
           <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/80 backdrop-blur-md p-8 rounded-[40px] shadow-2xl border border-white flex flex-col items-center gap-4">
                 <div className="flex -space-x-3">
                   {[1,2,3,4].map(i => (
                     <img key={i} className="w-12 h-12 rounded-full border-4 border-white" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=P${i}`} />
                   ))}
                 </div>
                 <p className="font-black italic uppercase tracking-tighter text-slate-800">2,410 Players Online Now</p>
              </div>
           </div>
        </div>
      </header>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter mb-4">Why Pro Ludo?</h2>
            <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Trophy />, title: 'Real Cash Prizes', desc: 'Every tournament has a guaranteed pool. Winners are paid in seconds.' },
              { icon: <ShieldCheck />, title: 'Anti-Cheat Pro', desc: 'Our server-authoritative engine ensures 100% fair dice and moves.' },
              { icon: <PiggyBank />, title: 'Gulla Savings', desc: 'Auto-save a percentage of your wins to your Gulla bank for bigger bets.' },
              { icon: <Users />, title: 'Live Voice Chat', desc: 'Talk to your opponents in real-time. Strategize or just have fun.' },
              { icon: <Smartphone />, title: 'Mobile First', desc: 'Seamless gameplay on any device. Touch-optimized controls.' },
              { icon: <Star />, title: 'Pro Ranking', desc: 'Climb the global leaderboard and unlock exclusive high-stakes rooms.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-10 rounded-[40px] border border-slate-200 hover:shadow-2xl transition-all group">
                <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl w-fit mb-8 group-hover:bg-blue-600 group-hover:text-white transition-all">
                  {React.cloneElement(f.icon as React.ReactElement<any>, { size: 32 })}
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tight mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 border-y border-slate-100">
         <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-black text-2xl tracking-tighter">UNITY</span>
            <span className="font-black text-2xl tracking-tighter">GOOGLE PLAY</span>
            <span className="font-black text-2xl tracking-tighter">ESPORTS PRO</span>
            <span className="font-black text-2xl tracking-tighter">VERIFIED</span>
         </div>
      </section>

      {/* Footer CTA */}
      <section className="py-32 px-6 text-center">
         <div className="max-w-3xl mx-auto bg-slate-900 text-white rounded-[50px] p-12 md:p-20 relative overflow-hidden shadow-2xl">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-8 leading-none">Ready to <br/> be a Champion?</h2>
              <Link to="/auth?mode=register" className="inline-block bg-blue-600 text-white px-12 py-5 rounded-3xl font-black uppercase tracking-widest shadow-2xl hover:bg-blue-500 transition-all active:scale-95">
                 Start Playing For Free
              </Link>
            </div>
            <Trophy size={300} className="absolute -right-20 -bottom-20 text-white/5 -rotate-12" />
         </div>
      </section>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 font-bold text-[10px] uppercase tracking-widest">
         &copy; 2024 Ludo Pro Tournament Edition. All Rights Reserved.
      </footer>
    </div>
  );
};

export default Landing;
