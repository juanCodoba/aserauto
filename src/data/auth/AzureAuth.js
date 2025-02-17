import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
  auth: {
    clientId: '4668327b-71a6-4a09-a468-6d2173ee2d23', // Reemplaza con tu Client ID
    authority: 'https://login.microsoftonline.com/dd505be5-ec69-47f5-92df-caa55febf5fa', // Reemplaza con tu Tenant ID
    redirectUri: 'http://localhost:3000/chat', // URL de redirección
  },
  cache: {
    cacheLocation: 'sessionStorage', // Almacena tokens en sessionStorage
    storeAuthStateInCookie: false,
  },
};

const msalInstance = new PublicClientApplication(msalConfig);

// Inicializar MSAL
msalInstance.initialize().then(() => {
  console.log('MSAL inicializado correctamente');
}).catch((error) => {
  console.error('Error al inicializar MSAL:', error);
});

export const login = async () => {
  try {
    await msalInstance.initialize(); // Asegúrate de inicializar antes de usar
    const loginResponse = await msalInstance.loginPopup();
    return loginResponse.account;
  } catch (error) {
    console.error('Error durante el login:', error);
    throw error;
  }
};

export const logout = () => {
  msalInstance.logout();
};

export const getToken = async () => {
    try {
      await msalInstance.initialize(); // Asegúrate de inicializar antes de usar
      const accounts = msalInstance.getAllAccounts();
      if (accounts.length === 0) {
        throw new Error('No hay cuentas activas');
      }
      const tokenResponse = await msalInstance.acquireTokenSilent({
        scopes: ['User.Read'], // Permisos necesarios
        account: accounts[0], // Usa la primera cuenta activa
      });
      return tokenResponse.accessToken;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      throw error;
    }
  };

export default msalInstance;