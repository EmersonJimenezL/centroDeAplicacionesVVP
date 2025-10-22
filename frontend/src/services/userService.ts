const API_BASE_URL = 'http://192.168.200.80:3005/centrodeaplicaciones';

export interface CreateUserRequest {
  usuario: string;
  pnombre: string;
  snombre: string;
  papellido: string;
  sapellido: string;
  password: string;
  email: string;
  sucursal: string;
  area: string;
  rol: string[];
}

export interface UpdateUserRequest {
  usuario?: string;
  pnombre?: string;
  snombre?: string;
  papellido?: string;
  sapellido?: string;
  email?: string;
  sucursal?: string;
  area?: string;
  rol?: string[];
}

export interface ChangePasswordRequest {
  password: string;
}

export interface UpdateEstadoRequest {
  activo: boolean;
}

export interface ApiResponse<T> {
  status: string;
  message?: string;
  data?: T;
}

export const userService = {
  async createUser(userData: CreateUserRequest, token: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al crear usuario');
    }

    return response.json();
  },

  async updateUser(userId: string, userData: UpdateUserRequest, token: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al actualizar usuario');
    }

    return response.json();
  },

  async deleteUser(userId: string, token: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al eliminar usuario');
    }

    return response.json();
  },

  async changeUserStatus(userId: string, activo: boolean, token: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/${userId}/estado`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ activo }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al cambiar estado del usuario');
    }

    return response.json();
  },

  async changePassword(userId: string, password: string, token: string): Promise<ApiResponse<any>> {
    const response = await fetch(`${API_BASE_URL}/${userId}/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al cambiar contraseña');
    }

    return response.json();
  },
};
