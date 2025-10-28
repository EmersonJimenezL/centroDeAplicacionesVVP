import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { isAdminUser } from "../types/admin.types";
import type { ReactNode } from "react";

interface ProtectedAdminRouteProps {
  children: ReactNode;
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { usuario, isAuthenticated, loading } = useAuth();

  // Mientras carga, no mostrar nada
  if (loading) {
    return null;
  }

  // Si no está autenticado, redirigir al login
  if (!isAuthenticated() || !usuario) {
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado pero NO es admin, redirigir al dashboard
  if (!isAdminUser(usuario.usuario)) {
    return <Navigate to="/" replace />;
  }

  // Si es admin autorizado, mostrar el contenido
  return <>{children}</>;
}
