import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../core/auth/AuthContext';

const LoginView = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(); // Llama a la función de login del contexto
      navigate('/chat'); // Redirige al chat después del login
    } catch (error) {
      setError('Error durante el login. Inténtalo de nuevo.');
      console.error('Error durante el login:', error);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="card-body text-center">
          <h2 className="card-title mb-4">
            <i className="bi bi-person-circle me-2"></i>Iniciar Sesión
          </h2>
          <p className="text-muted mb-4">
            Inicia sesión con tu cuenta de Office 365 para acceder al chat.
          </p>
          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}
          <button
            className="btn btn-primary w-100 py-2"
            onClick={handleLogin}
          >
            <i className="bi bi-microsoft me-2"></i>Iniciar Sesión con Office 365
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginView;