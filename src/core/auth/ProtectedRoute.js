import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../core/auth/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/" />; // Redirige a la página de inicio de sesión
  }

  return children; // Permite el acceso a la ruta protegida
};

export default ProtectedRoute;