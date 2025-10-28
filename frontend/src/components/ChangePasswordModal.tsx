import { useState } from "react";
import "./ChangePasswordModal.css";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (password: string) => Promise<void>;
  username: string;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSubmit,
  username,
}: ChangePasswordModalProps) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 4) {
      setError("La contraseña debe tener al menos 4 caracteres");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(password);
      setPassword("");
      setConfirmPassword("");
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al cambiar contraseña"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setConfirmPassword("");
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content modal-content-small"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Cambiar Contraseña</h2>
          <button className="modal-close" onClick={handleClose}>
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

        <form onSubmit={handleSubmit} className="password-form">
          <p className="password-info">
            Cambiar contraseña para el usuario: <strong>{username}</strong>
          </p>

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

          <div className="form-group">
            <label htmlFor="password">Nueva Contraseña *</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="••••••"
              autoComplete="new-password"
            />
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleClose}
              className="btn-cancel"
              disabled={loading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? "Cambiando..." : "Cambiar Contraseña"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
