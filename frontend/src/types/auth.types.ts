export interface Usuario {
  nombreUsuario: string;
  rol: string;
  primerNombre: string;
  primerApellido: string;
}

export interface LoginRequest {
  nombreUsuario: string;
  password: string;
}

export interface LoginResponse {
  mensaje: string;
  usuario: Usuario;
}

export interface LoginError {
  error: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  login: (nombreUsuario: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}
