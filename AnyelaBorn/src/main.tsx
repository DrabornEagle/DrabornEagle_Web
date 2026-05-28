import React from 'react';
import { createRoot } from 'react-dom/client';
import { DkdAnyelaHomePage } from './DkdAnyelaHomePage';
import './styles.css';

createRoot(document.getElementById('dkd_anyela_root') as HTMLElement).render(
  <React.StrictMode>
    <DkdAnyelaHomePage />
  </React.StrictMode>,
);
