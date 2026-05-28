import React from 'react';
import ReactDOM from 'react-dom/client';
import DkdAnyelaBornApp from './App.jsx';
import './styles.css';

const dkd_root_element = document.getElementById('dkd-root');

ReactDOM.createRoot(dkd_root_element).render(
  <React.StrictMode>
    <DkdAnyelaBornApp />
  </React.StrictMode>,
);
