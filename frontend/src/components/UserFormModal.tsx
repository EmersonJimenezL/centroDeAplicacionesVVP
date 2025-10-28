import { useState, useEffect } from "react";
import type { Usuario } from "../types/auth.types";
import "./UserFormModal.css";

const SUCURSAL_OPTIONS = Object.freeze([
  "Casa Matriz",
  "Sucursal Puerto Montt",
  "Sucursal Antofagasta",
  "Sucursal Talca",
  "Sucursal Centro Puerto",
  "Sucursal Cambio y Soluciones (Peru)",
  "Sucursal Valparaiso",
  "Sucursal Copiapó",
]);

const AREA_OPTIONS = Object.freeze([
  "GERENCIA COMERCIAL",
  "GERENCIA DE CAMIONES",
  "GERENCIA ADM. Y FINANZAS",
  "GERENCIA POST VENTA ",
  "GERENCIA REPUESTOS",
  "GERENCIA OPERACIONES",
]);

const ROL_OPTIONS = Object.freeze([
  "admin",
  "gerente",
  "jefe",
  "vendedor",
  "tecnico",
  "usuarioGeneral",
]);

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: UserFormData) => Promise<void>;
  editUser?: Usuario | null;
  title: string;
}

export interface UserFormData {
  usuario: string;
  pnombre: string;
  snombre: string;
  papellido: string;
  sapellido: string;
  password?: string;
  email: string;
  sucursal: string;
  area: string;
  rol: string[];
}

export function UserFormModal({
  isOpen,
  onClose,
  onSubmit,
  editUser,
  title,
}: UserFormModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    usuario: "",
    pnombre: "",
    snombre: "",
    papellido: "",
    sapellido: "",
    password: "",
    email: "",
    sucursal: "",
    area: "",
    rol: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editUser) {
      setFormData({
        usuario: editUser.usuario,
        pnombre: editUser.pnombre,
        snombre: editUser.snombre,
        papellido: editUser.papellido,
        sapellido: editUser.sapellido,
        email: editUser.email,
        sucursal: editUser.sucursal,
        area: editUser.area,
        rol: editUser.rol,
      });
    } else {
      setFormData({
        usuario: "",
        pnombre: "",
        snombre: "",
        papellido: "",
        sapellido: "",
        password: "",
        email: "",
        sucursal: "",
        area: "",
        rol: [],
      });
    }
    setError("");
  }, [editUser, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar usuario");
    } finally {
      setLoading(false);
    }
  };

  const handleRolChange = (rol: string) => {
    setFormData((prev) => ({
      ...prev,
      rol: prev.rol.includes(rol)
        ? prev.rol.filter((r) => r !== rol)
        : [...prev.rol, rol],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="user-form">
          {error && (
            <div className="form-error">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="usuario">Usuario *</label>
              <input
                type="text"
                id="usuario"
                value={formData.usuario}
                onChange={(e) =>
                  setFormData({ ...formData, usuario: e.target.value })
                }
                required
                disabled={!!editUser}
                placeholder="nombre.usuario"
              />
            </div>

            {!editUser && (
              <div className="form-group">
                <label htmlFor="password">Contraseña *</label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required={!editUser}
                  placeholder="••••••"
                />
              </div>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pnombre">Primer Nombre *</label>
              <input
                type="text"
                id="pnombre"
                value={formData.pnombre}
                onChange={(e) =>
                  setFormData({ ...formData, pnombre: e.target.value })
                }
                required
                placeholder="Juan"
              />
            </div>

            <div className="form-group">
              <label htmlFor="snombre">Segundo Nombre</label>
              <input
                type="text"
                id="snombre"
                value={formData.snombre}
                onChange={(e) =>
                  setFormData({ ...formData, snombre: e.target.value })
                }
                placeholder="Carlos"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="papellido">Primer Apellido *</label>
              <input
                type="text"
                id="papellido"
                value={formData.papellido}
                onChange={(e) =>
                  setFormData({ ...formData, papellido: e.target.value })
                }
                required
                placeholder="Pérez"
              />
            </div>

            <div className="form-group">
              <label htmlFor="sapellido">Segundo Apellido *</label>
              <input
                type="text"
                id="sapellido"
                value={formData.sapellido}
                onChange={(e) =>
                  setFormData({ ...formData, sapellido: e.target.value })
                }
                required
                placeholder="González"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              placeholder="usuario@vivipra.cl"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="sucursal">Sucursal *</label>
              <select
                id="sucursal"
                value={formData.sucursal}
                onChange={(e) =>
                  setFormData({ ...formData, sucursal: e.target.value })
                }
                required
                className="form-select"
              >
                <option value="">Seleccionar sucursal...</option>
                {SUCURSAL_OPTIONS.map((sucursal) => (
                  <option key={sucursal} value={sucursal}>
                    {sucursal}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="area">Área *</label>
              <select
                id="area"
                value={formData.area}
                onChange={(e) =>
                  setFormData({ ...formData, area: e.target.value })
                }
                required
                className="form-select"
              >
                <option value="">Seleccionar área...</option>
                {AREA_OPTIONS.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Roles *</label>
            <div className="roles-checkboxes">
              {ROL_OPTIONS.map((rol) => (
                <label key={rol} className="role-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.rol.includes(rol)}
                    onChange={() => handleRolChange(rol)}
                  />
                  <span>{rol.charAt(0).toUpperCase() + rol.slice(1)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={onClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading
                ? "Guardando..."
                : editUser
                ? "Actualizar"
                : "Crear Usuario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
