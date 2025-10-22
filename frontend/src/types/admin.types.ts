import type { Usuario } from './auth.types';

export interface UsersListResponse {
  status: string;
  results: number;
  data: Usuario[];
}

export interface UpdatePermissionsRequest {
  permisos: string[];
}

export interface UpdatePermissionsResponse {
  status: string;
  message: string;
  data: Usuario;
}

export const ADMIN_USERS = ['ejimenez', 'mcontreras', 'igonzalez'];

export function isAdminUser(username: string): boolean {
  return ADMIN_USERS.includes(username.toLowerCase());
}
