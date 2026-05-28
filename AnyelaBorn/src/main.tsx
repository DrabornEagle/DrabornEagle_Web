import React from 'react';
import ReactDOM from 'react-dom/client';
import { DkdAnyelaApp } from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('dkd-root') as HTMLElement).render(
  <React.StrictMode>
    <DkdAnyelaApp />
  </React.StrictMode>
);
