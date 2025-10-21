import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, loading } = useAuth();

  // Mientras carga, mostrar nada (o podrías mostrar un spinner)
  if (loading) {
    return null;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, mostrar el contenido protegido
  return <>{children}</>;
}
