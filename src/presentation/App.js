import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Quita HashRouter
import LoginView from '../presentation/views/LoginView';
import ChatView from '../presentation/views/ChatView';
import { AuthProvider } from '../core/auth/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginView />} />
        <Route path="/chat" element={<ChatView />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
