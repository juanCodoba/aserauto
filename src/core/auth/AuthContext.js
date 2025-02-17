import React, { createContext, useState, useEffect } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: '4668327b-71a6-4a09-a468-6d2173ee2d23', // Reemplaza con tu Client ID
    authority: 'https://login.microsoftonline.com/dd505be5-ec69-47f5-92df-caa55febf5fa', // Reemplaza con tu Tenant ID
    redirectUri: 'http://localhost:3000/', // Asegúrate de que coincida con la configurada en Azure AD
  },
  cache: {
    cacheLocation: 'sessionStorage', // Almacena tokens en sessionStorage
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [jobTitle, setJobTitle] = useState(null);

  // Función para obtener el token de acceso
  const getToken = async () => {
    try {
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No hay cuentas activas');
      }
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read', 'Directory.Read.All'],
        account: accounts[0],
      });
      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      throw error;
    }
  };

  // Función para obtener roles de directorio
  const getDirectoryRoles = async (token) => {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me/memberOf', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data.value;
    } catch (error) {
      console.error('Error al obtener los roles de directorio:', error);
      throw error;
    }
  };

  // Función para obtener información del usuario
  const getUserInfo = async (token) => {
    try {
      const response = await fetch('https://graph.microsoft.com/v1.0/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener la información del usuario:', error);
      throw error;
    }
  };

  // Función para iniciar sesión
  const login = async () => {
    try {
      const loginResponse = await msalInstance.loginPopup({
        scopes: ['User.Read', 'Directory.Read.All'],
      });
      const token = await getToken();
      const userInfo = await getUserInfo(token);
      const roles = await getDirectoryRoles(token);

      setIsAuthenticated(true);
      setUser(loginResponse.account);
      setRoles(roles);
      setJobTitle(userInfo.jobTitle);

      // Guardar en localStorage
      localStorage.setItem('user', JSON.stringify(loginResponse.account));
      localStorage.setItem('roles', JSON.stringify(roles));
      localStorage.setItem('jobTitle', userInfo.jobTitle);

      console.log('Usuario autenticado:', loginResponse.account);
    } catch (error) {
      console.error('Error durante el login:', error);
      throw error; // Lanza el error para manejarlo en el componente
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    msalInstance.logout();
    setIsAuthenticated(false);
    setUser(null);
    setRoles([]);
    setJobTitle(null);
    localStorage.clear(); // Limpiar localStorage al cerrar sesión
  };

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await msalInstance.initialize();
        const accounts = msalInstance.getAllAccounts();
        if (accounts.length > 0) {
          const token = await getToken();
          const userInfo = await getUserInfo(token);
          const roles = await getDirectoryRoles(token);

          setIsAuthenticated(true);
          setUser(accounts[0]);
          setRoles(roles);
          setJobTitle(userInfo.jobTitle);
        } else {
          // Verificar localStorage si no hay cuentas activas
          const savedUser = JSON.parse(localStorage.getItem('user'));
          const savedRoles = JSON.parse(localStorage.getItem('roles'));
          const savedJobTitle = localStorage.getItem('jobTitle');
          if (savedUser && savedRoles && savedJobTitle) {
            setIsAuthenticated(true);
            setUser(savedUser);
            setRoles(savedRoles);
            setJobTitle(savedJobTitle);
          }
        }
      } catch (error) {
        console.error('Error al verificar la autenticación:', error);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, roles, jobTitle, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};