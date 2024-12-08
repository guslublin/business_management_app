import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa la nueva API createRoot
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Crea la raíz de la aplicación usando React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Si quieres medir rendimiento
reportWebVitals();
