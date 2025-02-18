import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';
import { BrowserRouter } from 'react-router-dom'; // Cambiar a BrowserRouter
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* Cambiar a BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
