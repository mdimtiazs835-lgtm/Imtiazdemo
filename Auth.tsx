// Added React import to resolve namespace errors
import React, { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ChevronRight, Loader2, ArrowLeft, ShieldCheck, Zap, AlertCircle, PlayCircle } from 'lucide-react';
import { authService } from '../services/authService';

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(searchParams.get('mode') === 'register');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegister) {
        await authService.register(username, email);
      } else {
        await authService.login(email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await authService.login('pro@ludo.com', 'password123');
      navigate('/');
    } catch (err) {
      setError('Demo login failed. Please register a new account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row font-sans">
      {/* Left side: Brand/Welcome */}
      <div className="hidden md:flex flex-1 bg-blue-600 text-white p-20 flex-col justify-between relative overflow-hidden">
         <Link to="/landing" className="flex items-center gap-2 relative z-10">
            <div className="w-10 h-10 bg-white text-blue-600 rounded-xl flex items-center justify-center font-black text-2xl shadow-xl rotate-3">L</div>
            <span className="font-black text-xl tracking-tighter">LUDO PRO</span>
         </Link>
         
         <div className="relative z-10 max-w-md">
            <h2 className="text-6xl font-black italic uppercase tracking-tighter leading-none mb-8">Enter the <br/> Arena.</h2>
            <p className="text-xl font-medium text-blue-100 leading-relaxed">
              Experience the world's first professional Ludo tournament engine with instant withdrawals.
            </p>
         </div>

         <div className="relative z-10 flex gap-10">
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Players</span>
               <span className="text-2xl font-black tracking-tighter italic">142K+</span>
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Paid Out</span>
               <span className="text-2xl font-black tracking-tighter italic">$2.4M</span>
            </div>
         </div>

         {/* Decorative Background */}
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/10 rounded-full blur-[120px]"></div>
         <Zap size={400} className="absolute -right-20 bottom-0 text-white/5 -rotate-12" />
      </div>

      {/* Right side: Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-20 relative">
        <Link to="/landing" className="absolute top-8 left-8 md:hidden text-slate-400 hover:text-slate-900 transition-colors">
           <ArrowLeft size={24} />
        </Link>

        <div className="w-full max-w-sm space-y-10 animate-in fade-in slide-in-from-right duration-700">
           <div className="text-center md:text-left">
              <h3 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                {isRegister ? 'New Account' : 'Player Login'}
              </h3>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">
                {isRegister ? 'Join the champion league' : 'Resume your tournament progress'}
              </p>
           </div>

           {error && (
             <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top duration-300">
                <AlertCircle size={20} />
                <p className="text-xs font-bold uppercase tracking-wide">{error}</p>
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-6">
              {isRegister && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
                  <div className="relative">
                     <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                     <input 
                      type="text" 
                      required
                      placeholder="e.g. ShadowPlayer"
                      className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all shadow-sm"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                     />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email Address</label>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input 
                    type="email" 
                    required
                    placeholder="pro@ludo.com"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all shadow-sm"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                   />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                  <button type="button" className="text-[9px] font-black text-blue-600 uppercase tracking-widest">Forgot?</button>
                </div>
                <div className="relative">
                   <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                   <input 
                    type="password" 
                    required
                    placeholder="••••••••"
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:ring-4 focus:ring-blue-100 focus:border-blue-600 outline-none transition-all shadow-sm"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                   />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-slate-900 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-blue-600 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (isRegister ? 'Register' : 'Login')}
                {!loading && <ChevronRight size={18} />}
              </button>

              {!isRegister && (
                 <button 
                  type="button" 
                  onClick={handleDemoLogin}
                  className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-blue-100 hover:bg-blue-100 transition-all flex items-center justify-center gap-2"
                 >
                   <PlayCircle size={16} /> Quick Demo Entry
                 </button>
              )}
           </form>

           <div className="text-center pt-6">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                {isRegister ? 'Already registered?' : 'Need an account?'}
                <button 
                  onClick={() => { setIsRegister(!isRegister); setError(null); }}
                  className="ml-2 text-blue-600 hover:underline"
                >
                  {isRegister ? 'Login Here' : 'Join Now'}
                </button>
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;