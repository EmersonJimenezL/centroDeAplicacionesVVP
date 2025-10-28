import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { AuthContextType, Usuario } from "../types/auth.types";
import { authService } from "../services/authService";
import { InfoModal } from "../components/InfoModal";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY_USER = "vivipra_usuario";
const STORAGE_KEY_TOKEN = "vivipra_token";
const STORAGE_KEY_INFO_SHOWN = "vivipra_info_shown";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Cargar usuario y token desde sessionStorage al iniciar
  useEffect(() => {
    const usuarioGuardado = sessionStorage.getItem(STORAGE_KEY_USER);
    const tokenGuardado = sessionStorage.getItem(STORAGE_KEY_TOKEN);

    if (usuarioGuardado && tokenGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
        setToken(tokenGuardado);
      } catch (error) {
        console.error("Error al parsear datos guardados:", error);
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

      // Mostrar modal informativo después del login
      setShowInfoModal(true);
      sessionStorage.removeItem(STORAGE_KEY_INFO_SHOWN);
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
    setShowInfoModal(false);
  };

  const isAuthenticated = (): boolean => {
    return usuario !== null && token !== null;
  };

  const handleCloseInfoModal = () => {
    setShowInfoModal(false);
    sessionStorage.setItem(STORAGE_KEY_INFO_SHOWN, "true");
  };

  const value: AuthContextType = {
    usuario,
    token,
    login,
    logout,
    isAuthenticated,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <InfoModal isOpen={showInfoModal} onClose={handleCloseInfoModal} />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}
