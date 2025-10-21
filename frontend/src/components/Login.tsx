import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import vivibraLogo from '../assets/vivipra.png';
import './Login.css';

export function Login() {
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!nombreUsuario || !password) {
      setError('Por favor, complete todos los campos');
      return;
    }

    setIsLoading(true);

    try {
      await login(nombreUsuario, password);
      navigate('/');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={vivibraLogo} alt="Vivipra Logo" className="login-logo" />
          <h1 className="login-title">Centro de Aplicaciones</h1>
          <p className="login-subtitle">Inicia sesión para continuar</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="nombreUsuario" className="form-label">
              Usuario
            </label>
            <input
              type="text"
              id="nombreUsuario"
              className="form-input"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Ingresa tu usuario"
              disabled={isLoading}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={isLoading}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Iniciando sesión...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>
      </div>

      <div className="login-background-glow"></div>
    </div>
  );
}
