import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginView from '../presentation/views/LoginView';
import ChatView from '../presentation/views/ChatView';
import { AuthProvider } from '../core/auth/AuthContext'; // Importa el AuthProvider

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginView />} />
          <Route path="/chat" element={<ChatView />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;