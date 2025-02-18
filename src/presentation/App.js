import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'; // Cambia BrowserRouter a HashRouter
import LoginView from '../presentation/views/LoginView';
import ChatView from '../presentation/views/ChatView';
import { AuthProvider } from '../core/auth/AuthContext';

function App() {
  return (
    <HashRouter> {/* Usa HashRouter en lugar de BrowserRouter */}
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
      </AuthProvider>
    </HashRouter>
  );
}

export default App;