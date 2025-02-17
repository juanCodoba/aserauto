import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'; // Añade Navigate
import LoginView from '../presentation/views/LoginView';
import ChatView from '../presentation/views/ChatView';
import { AuthProvider } from '../core/auth/AuthContext';

function App() {
  return (
    <BrowserRouter basename="/aserauto">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirige a /login */}
          <Route path="/login" element={<LoginView />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;