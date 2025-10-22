import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { userService } from '../services/userService';
import { APPLICATIONS } from './Dashboard';
import { UserFormModal, type UserFormData } from './UserFormModal';
import { ChangePasswordModal } from './ChangePasswordModal';
import type { Usuario } from '../types/auth.types';
import './AdminPanel.css';

export function AdminPanel() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Modal states
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [changingPasswordUser, setChangingPasswordUser] = useState<Usuario | null>(null);

  const handleBack = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    if (!token) return;

    try {
      setLoading(true);
      setError('');
      const response = await adminService.getAllUsers(token);
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = async (userId: string, appId: string, currentPermisos: string[]) => {
    if (!token) return;

    const hasPermission = currentPermisos.includes(appId);
    const newPermisos = hasPermission
      ? currentPermisos.filter(p => p !== appId)
      : [...currentPermisos, appId];

    try {
      setSaving(userId);
      setError('');
      setSuccessMessage('');

      await adminService.updateUserPermissions(userId, newPermisos, token);

      // Actualizar la lista local
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId
            ? { ...user, permisos: newPermisos }
            : user
        )
      );

      setSuccessMessage('Permisos actualizados correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar permisos');
    } finally {
      setSaving(null);
    }
  };

  // CRUD Operations
  const handleCreateUser = async (userData: UserFormData) => {
    if (!token) return;

    try {
      setError('');
      await userService.createUser(userData, token);
      setSuccessMessage('Usuario creado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadUsers();
    } catch (err) {
      throw err;
    }
  };

  const handleEditUser = async (userData: UserFormData) => {
    if (!token || !editingUser) return;

    try {
      setError('');
      const { password, ...updateData } = userData;
      await userService.updateUser(editingUser._id, updateData, token);
      setSuccessMessage('Usuario actualizado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadUsers();
      setEditingUser(null);
    } catch (err) {
      throw err;
    }
  };

  const handleDeleteUser = async (user: Usuario) => {
    if (!token) return;

    const confirmDelete = window.confirm(
      `¿Estás seguro de eliminar al usuario "${user.usuario}"?\n\nEsta acción no se puede deshacer.`
    );

    if (!confirmDelete) return;

    try {
      setError('');
      setSaving(user._id);
      await userService.deleteUser(user._id, token);
      setSuccessMessage('Usuario eliminado correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
    } finally {
      setSaving(null);
    }
  };

  const handleToggleStatus = async (user: Usuario) => {
    if (!token) return;

    try {
      setError('');
      setSaving(user._id);
      await userService.changeUserStatus(user._id, !user.activo, token);
      setSuccessMessage(`Usuario ${!user.activo ? 'activado' : 'desactivado'} correctamente`);
      setTimeout(() => setSuccessMessage(''), 3000);

      // Actualizar estado local
      setUsers(prevUsers =>
        prevUsers.map(u =>
          u._id === user._id ? { ...u, activo: !u.activo } : u
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cambiar estado');
    } finally {
      setSaving(null);
    }
  };

  const handleChangePassword = async (password: string) => {
    if (!token || !changingPasswordUser) return;

    try {
      setError('');
      await userService.changePassword(changingPasswordUser._id, password, token);
      setSuccessMessage('Contraseña cambiada correctamente');
      setTimeout(() => setSuccessMessage(''), 3000);
      setChangingPasswordUser(null);
    } catch (err) {
      throw err;
    }
  };

  const openCreateModal = () => {
    setEditingUser(null);
    setIsUserModalOpen(true);
  };

  const openEditModal = (user: Usuario) => {
    setEditingUser(user);
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
    setEditingUser(null);
  };

  const openPasswordModal = (user: Usuario) => {
    setChangingPasswordUser(user);
    setIsPasswordModalOpen(true);
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setChangingPasswordUser(null);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-loading">
          <div className="spinner-large"></div>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-text">
            <h1 className="admin-title">Panel de Administración de Permisos</h1>
            <p className="admin-subtitle">Gestiona los permisos de acceso a las aplicaciones</p>
          </div>
          <div className="admin-header-actions">
            <button onClick={handleBack} className="admin-back-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Volver
            </button>
            <button onClick={handleLogout} className="admin-logout-button">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9M16 17L21 12M21 12L16 7M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="admin-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {error}
        </div>
      )}

      {successMessage && (
        <div className="admin-success">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {successMessage}
        </div>
      )}

      <div className="user-management-section">
        <button onClick={openCreateModal} className="btn-create-user">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Nuevo Usuario
        </button>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th className="status-column">Estado</th>
              {APPLICATIONS.map(app => (
                <th key={app.id} className="app-column">
                  <div className="app-header">
                    <span className="app-icon">{app.icon}</span>
                    <span className="app-name-short">{app.name}</span>
                  </div>
                </th>
              ))}
              <th className="actions-column">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const nombreCompleto = `${user.pnombre} ${user.snombre ? user.snombre + ' ' : ''}${user.papellido} ${user.sapellido}`.trim();
              const isSaving = saving === user._id;

              return (
                <tr key={user._id} className={`${isSaving ? 'saving' : ''} ${!user.activo ? 'inactive-user' : ''}`}>
                  <td className="user-username">{user.usuario}</td>
                  <td className="status-cell">
                    <span className={`status-badge ${user.activo ? 'status-active' : 'status-inactive'}`}>
                      {user.activo ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  {APPLICATIONS.map(app => {
                    const hasPermission = user.permisos.includes(app.id);
                    return (
                      <td key={app.id} className="checkbox-cell">
                        <label className="checkbox-container">
                          <input
                            type="checkbox"
                            checked={hasPermission}
                            onChange={() => handlePermissionToggle(user._id, app.id, user.permisos)}
                            disabled={isSaving}
                          />
                          <span className="checkmark"></span>
                        </label>
                      </td>
                    );
                  })}
                  <td className="actions-cell">
                    <div className="action-buttons">
                      <button
                        onClick={() => openEditModal(user)}
                        className="btn-action btn-edit"
                        title="Editar usuario"
                        disabled={isSaving}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13M18.5 2.5C18.8978 2.1022 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.1022 21.5 2.5C21.8978 2.8978 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.1022 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => openPasswordModal(user)}
                        className="btn-action btn-password"
                        title="Cambiar contraseña"
                        disabled={isSaving}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M19 12C19 12.3403 18.9508 12.6698 18.8593 12.9809C18.331 14.8486 16.3843 16 14 16H10C7.61575 16 5.66902 14.8486 5.14068 12.9809C5.04922 12.6698 5 12.3403 5 12C5 11.6597 5.04922 11.3302 5.14068 11.0191C5.66902 9.15142 7.61575 8 10 8H14C16.3843 8 18.331 9.15142 18.8593 11.0191C18.9508 11.3302 19 11.6597 19 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 5V8M12 16V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`btn-action ${user.activo ? 'btn-deactivate' : 'btn-activate'}`}
                        title={user.activo ? 'Desactivar usuario' : 'Activar usuario'}
                        disabled={isSaving}
                      >
                        {user.activo ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 8L6 20M6 8L18 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user)}
                        className="btn-action btn-delete"
                        title="Eliminar usuario"
                        disabled={isSaving}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 6H5H21M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="no-users">
          <p>No se encontraron usuarios</p>
        </div>
      )}

      <UserFormModal
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        onSubmit={editingUser ? handleEditUser : handleCreateUser}
        editUser={editingUser}
        title={editingUser ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
      />

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        onSubmit={handleChangePassword}
        username={changingPasswordUser?.usuario || ''}
      />
    </div>
  );
}
