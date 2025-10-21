import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, Usuario } from '../types/auth.types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'vivipra_usuario';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario desde sessionStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem(STORAGE_KEY);
    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (nombreUsuario: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(nombreUsuario, password);
      const usuarioData = response.usuario;

      // Guardar en state y sessionStorage
      setUsuario(usuarioData);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(usuarioData));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  const isAuthenticated = (): boolean => {
    return usuario !== null;
  };

  const value: AuthContextType = {
    usuario,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
