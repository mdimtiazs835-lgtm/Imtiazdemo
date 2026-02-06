
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import GameView from './pages/GameView';
import Tournaments from './pages/Tournaments';
import Admin from './pages/Admin';
import Wallet from './pages/Wallet';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import AuthGuard from './components/AuthGuard';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/landing" element={<Landing />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/" element={<AuthGuard><Layout><Dashboard /></Layout></AuthGuard>} />
      <Route path="/tournaments" element={<AuthGuard><Layout><Tournaments /></Layout></AuthGuard>} />
      <Route path="/wallet" element={<AuthGuard><Layout><Wallet /></Layout></AuthGuard>} />
      <Route path="/admin" element={<AuthGuard><Layout><Admin /></Layout></AuthGuard>} />
      <Route path="/game" element={<AuthGuard><div className="min-h-screen bg-slate-50 p-4 md:p-8"><GameView /></div></AuthGuard>} />

      {/* Catch-all: Send to Landing if not auth, otherwise dashboard handles it */}
      <Route path="*" element={<Navigate to="/landing" replace />} />
    </Routes>
  );
};

export default App;
