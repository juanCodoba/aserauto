import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './presentation/App';
import { HashRouter } from 'react-router-dom'; // Solo aquí
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HashRouter> {/* Solo aquí */}
      <App />
    </HashRouter>
  </React.StrictMode>
);
