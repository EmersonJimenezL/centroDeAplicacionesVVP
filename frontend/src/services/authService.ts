import type { LoginRequest, LoginResponse, LoginError } from '../types/auth.types';

const API_URL = 'http://192.168.200.80:3005/usuarios/login';

export const authService = {
  async login(nombreUsuario: string, password: string): Promise<LoginResponse> {
    const requestBody: LoginRequest = {
      nombreUsuario,
      password
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        // Si la respuesta no es ok, es un error
        const errorData = data as LoginError;
        throw new Error(errorData.error || 'Error al iniciar sesión');
      }

      return data as LoginResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Error de conexión. Por favor, intente nuevamente.');
    }
  }
};
