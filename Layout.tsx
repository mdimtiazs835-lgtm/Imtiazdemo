
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Trophy, Home, Wallet, Settings, LayoutDashboard, LogOut, Menu, X, Bell, User } from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(authService.getUser());

  useEffect(() => {
    return authService.subscribe(setUser);
  }, []);

  const handleLogout = () => {
    authService.logout();
    navigate('/landing');
  };

  if (!user) return null;

  const navItems = [
    { icon: <Home size={22} />, label: 'Lobby', path: '/' },
    { icon: <Trophy size={22} />, label: 'Tournaments', path: '/tournaments' },
    { icon: <Wallet size={22} />, label: 'Wallet', path: '/wallet' },
    { icon: <LayoutDashboard size={22} />, label: 'Admin Panel', path: '/admin' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Premium Header */}
      <header className="sticky top-0 z-[60] glass px-4 md:px-8 py-4 flex justify-between items-center border-b border-slate-200">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg text-slate-600"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-blue-200 rotate-3">
              L
            </div>
            <div className="hidden sm:block text-left">
              <h1 className="font-extrabold text-slate-900 tracking-tight text-lg leading-none">LUDO PRO</h1>
              <p className="text-[9px] text-blue-600 font-bold uppercase tracking-widest mt-0.5">Champions League</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-sm font-bold text-slate-800">{user.username}</span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-slate-500 font-semibold tracking-wide">${user.balance.toFixed(2)}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-10 h-10 rounded-full border-2 border-blue-100 p-0.5 bg-white shadow-sm overflow-hidden">
              <img className="w-full h-full rounded-full object-cover" src={user.avatar} alt="Avatar" />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[70] bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className="w-72 h-full bg-white shadow-2xl animate-in slide-in-from-left duration-300 flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6 flex justify-between items-center border-b border-slate-100">
              <h2 className="font-extrabold text-slate-900">MENU</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400">
                <X size={24} />
              </button>
            </div>
            <div className="p-4 space-y-2 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 font-semibold'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100">
              <button onClick={handleLogout} className="flex items-center gap-4 px-4 py-4 text-red-500 font-bold w-full">
                <LogOut size={22} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <nav className="hidden md:flex w-64 bg-white border-r border-slate-200 p-6 flex-col shrink-0 overflow-y-auto no-scrollbar">
          <div className="space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-100 font-bold -translate-x-1'
                    : 'text-slate-500 hover:bg-slate-50 font-semibold hover:text-slate-900 hover:translate-x-1'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="mt-auto pt-8 space-y-4">
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">Fair Play</p>
               <div className="flex items-center justify-between mb-2">
                 <span className="text-sm font-bold text-slate-700">{user.fairPlayScore}/100</span>
                 <span className="text-[10px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded font-bold uppercase">Safe</span>
               </div>
               <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500" style={{ width: `${user.fairPlayScore}%` }}></div>
               </div>
            </div>
            <button onClick={handleLogout} className="flex items-center gap-4 px-5 py-4 text-slate-400 hover:text-red-500 font-bold w-full transition-all group">
              <LogOut size={22} className="group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </button>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50 no-scrollbar">
          <div className="max-w-6xl mx-auto h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
