import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { AuthContextType, Usuario } from '../types/auth.types';
import { authService } from '../services/authService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = 'vivipra_usuario';
const STORAGE_KEY_TOKEN = 'vivipra_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Cargar usuario y token desde sessionStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem(STORAGE_KEY_USER);
    const tokenGuardado = sessionStorage.getItem(STORAGE_KEY_TOKEN);

    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch (error) {
        console.error('Error al parsear datos guardados:', error);
        sessionStorage.removeItem(STORAGE_KEY_USER);
        sessionStorage.removeItem(STORAGE_KEY_TOKEN);
      }
    }
    setLoading(false);
  }, []);

  const login = async (usuario: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login(usuario, password);
      const usuarioData = response.data;
      const tokenData = response.token;

      // Guardar en state y sessionStorage
      setUsuario(usuarioData);
      setToken(tokenData);
      sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(usuarioData));
      sessionStorage.setItem(STORAGE_KEY_TOKEN, tokenData);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    sessionStorage.removeItem(STORAGE_KEY_USER);
    sessionStorage.removeItem(STORAGE_KEY_TOKEN);
  };

  const isAuthenticated = (): boolean => {
    return usuario !== null && token !== null;
  };

  const value: AuthContextType = {
    usuario,
    token,
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
