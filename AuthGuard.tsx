
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    return authService.subscribe((user) => {
      setIsAuth(!!user);
    });
  }, []);

  if (isAuth === null) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuth) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
