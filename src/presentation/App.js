import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginView from '../presentation/views/LoginView';
import ChatView from '../presentation/views/ChatView';
import { AuthProvider } from '../core/auth/AuthContext'; // Importa el AuthProvider

function App() {
  return (
    <AuthProvider> {/* Envuelve las rutas con AuthProvider */}
      <Routes>
        <Route path="/" element={<LoginView />} />
        <Route path="/chat" element={<ChatView />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;