export interface Usuario {
  _id: string;
  usuario: string;
  pnombre: string;
  snombre: string;
  papellido: string;
  sapellido: string;
  email: string;
  sucursal: string;
  area: string;
  rol: string[];
  activo: boolean;
  permisos: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface LoginRequest {
  usuario: string;
  password: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  token: string;
  data: Usuario;
}

export interface LoginError {
  error: string;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (usuario: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: () => boolean;
  loading: boolean;
}
