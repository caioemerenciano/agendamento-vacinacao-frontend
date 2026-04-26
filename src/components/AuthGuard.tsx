import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { servicoAutenticacao } from '../services/authService';

export const AuthGuard: React.FC = () => {
  const autenticado = servicoAutenticacao.estaAutenticado();

  if (!autenticado) {
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
};
