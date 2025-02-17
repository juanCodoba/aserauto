import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa el Router
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router> {/* Envuelve la aplicación con el Router */}
      <App />
    </Router>
  </React.StrictMode>
);