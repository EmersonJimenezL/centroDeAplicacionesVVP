import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import { APPLICATIONS } from './Dashboard';
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

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Nombre Completo</th>
              <th>Área</th>
              {APPLICATIONS.map(app => (
                <th key={app.id} className="app-column">
                  <div className="app-header">
                    <span className="app-icon">{app.icon}</span>
                    <span className="app-name-short">{app.name}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(user => {
              const nombreCompleto = `${user.pnombre} ${user.snombre ? user.snombre + ' ' : ''}${user.papellido} ${user.sapellido}`.trim();
              const isSaving = saving === user._id;

              return (
                <tr key={user._id} className={isSaving ? 'saving' : ''}>
                  <td className="user-username">{user.usuario}</td>
                  <td className="user-fullname">{nombreCompleto}</td>
                  <td className="user-area">{user.area}</td>
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
    </div>
  );
}
