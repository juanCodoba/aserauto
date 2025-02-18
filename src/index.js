import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';
import { HashRouter } from 'react-router-dom'; // Cambia BrowserRouter a HashRouter
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter> {/* Usa HashRouter en lugar de BrowserRouter */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
