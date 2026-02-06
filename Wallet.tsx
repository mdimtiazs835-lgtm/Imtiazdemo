
import React from 'react';
import { CreditCard, ArrowDownLeft, ArrowUpRight, DollarSign, Wallet as WalletIcon, CheckCircle2, Trophy, Zap } from 'lucide-react';

const Wallet: React.FC = () => {
  const transactions = [
    { id: '1', type: 'Credit', amount: '+$480.00', desc: 'Tournament Win: Diamond Elite', date: 'Dec 12, 2024' },
    { id: '2', type: 'Debit', amount: '-$50.00', desc: 'Tournament Entry Fee', date: 'Dec 10, 2024' },
    { id: '3', type: 'Credit', amount: '+$500.00', desc: 'Deposit (Bank Transfer)', date: 'Dec 08, 2024' },
    { id: '4', type: 'Withdraw', amount: '-$200.00', desc: 'Withdrawal to Account', date: 'Dec 05, 2024', status: 'Pending' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-800 uppercase italic tracking-tighter">Finance Hub</h2>
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mt-1">Manage your tournament earnings and funds</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95 flex items-center gap-2">
            <ArrowDownLeft size={18} /> Add Money
          </button>
          <button className="bg-white border border-slate-200 text-slate-800 px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-sm hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2">
            <ArrowUpRight size={18} /> Withdraw
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Card and Balance Information */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-slate-800 rounded-[45px] p-10 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 flex flex-col h-full justify-between min-h-[220px]">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-white/10 rounded-2xl"><WalletIcon size={28} /></div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Total Assets</p>
                  <p className="text-4xl font-black italic tracking-tighter leading-none">$2,450.00</p>
                </div>
              </div>
              <div className="mt-auto">
                <p className="text-xs font-mono tracking-[0.3em] opacity-40">**** **** **** 1290</p>
                <div className="flex justify-between items-end mt-4">
                  <p className="font-black text-sm uppercase italic tracking-wider">ALEX JOHNSON</p>
                  <div className="flex -space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 backdrop-blur-md"></div>
                    <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 backdrop-blur-md"></div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/10 rounded-full -ml-24 -mb-24 blur-3xl"></div>
          </div>

          <div className="glass rounded-[40px] p-8 space-y-6 border border-white/5">
             <h3 className="font-black text-slate-800 uppercase italic tracking-tight text-lg">Balance Allocation</h3>
             <div className="space-y-4">
                <div className="p-4 bg-green-500/5 rounded-3xl border border-green-500/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-500 text-white rounded-xl"><Trophy size={16} /></div>
                      <span className="text-[11px] font-black text-slate-500 uppercase">Win Wallet</span>
                   </div>
                   <span className="text-lg font-black text-green-600">$840.00</span>
                </div>
                <div className="p-4 bg-yellow-500/5 rounded-3xl border border-yellow-500/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-500 text-orange-950 rounded-xl"><Zap size={16} /></div>
                      <span className="text-[11px] font-black text-slate-500 uppercase">Bonus Credit</span>
                   </div>
                   <span className="text-lg font-black text-yellow-600">$150.00</span>
                </div>
                <div className="p-4 bg-blue-500/5 rounded-3xl border border-blue-500/10 flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500 text-white rounded-xl"><DollarSign size={16} /></div>
                      <span className="text-[11px] font-black text-slate-500 uppercase">Demo Balance</span>
                   </div>
                   <span className="text-lg font-black text-blue-600">$1,460.00</span>
                </div>
             </div>
          </div>
        </div>

        {/* Transaction History Section */}
        <div className="lg:col-span-8 space-y-6">
           <div className="flex justify-between items-center px-4">
              <h3 className="text-xl font-black text-slate-800 uppercase italic">Recent Transactions</h3>
              <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-blue-500 transition-colors">Export Statement</button>
           </div>
           <div className="glass rounded-[45px] overflow-hidden border border-white/5 shadow-sm">
             <div className="divide-y divide-white/5">
               {transactions.map((t) => (
                 <div key={t.id} className="p-7 flex items-center justify-between hover:bg-white/5 transition-all">
                    <div className="flex items-center gap-5">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                         t.type === 'Credit' ? 'bg-green-500/10 text-green-500' : 
                         t.type === 'Withdraw' ? 'bg-orange-500/10 text-orange-500' : 'bg-slate-100 text-slate-400'
                       }`}>
                          {t.type === 'Credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                       </div>
                       <div>
                          <p className="font-black text-slate-800 uppercase italic text-sm">{t.desc}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{t.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-xl font-black tracking-tight ${t.type === 'Credit' ? 'text-green-500' : 'text-slate-800'}`}>
                         {t.amount}
                       </p>
                       <div className="flex items-center justify-end gap-1.5 mt-1.5">
                          <div className={`w-2 h-2 rounded-full ${t.status === 'Pending' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
                          <span className={`text-[10px] font-black uppercase tracking-widest ${t.status === 'Pending' ? 'text-yellow-500' : 'text-green-600'}`}>
                            {t.status || 'Success'}
                          </span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
             <button className="w-full py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white/5 hover:bg-white/10 transition-all">
                Load Transaction History
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
