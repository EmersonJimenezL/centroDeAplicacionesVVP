import type {
  UsersListResponse,
  UpdatePermissionsRequest,
  UpdatePermissionsResponse,
} from "../types/admin.types";

const API_BASE_URL = "http://192.168.200.80:3005/centrodeaplicaciones";

export const adminService = {
  async getAllUsers(token: string): Promise<UsersListResponse> {
    try {
      const response = await fetch(API_BASE_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al obtener usuarios");
      }

      return data as UsersListResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error de conexión al obtener usuarios");
    }
  },

  async updateUserPermissions(
    userId: string,
    permisos: string[],
    token: string
  ): Promise<UpdatePermissionsResponse> {
    const requestBody: UpdatePermissionsRequest = {
      permisos,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/${userId}/permisos`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al actualizar permisos");
      }

      return data as UpdatePermissionsResponse;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error de conexión al actualizar permisos");
    }
  },
};
