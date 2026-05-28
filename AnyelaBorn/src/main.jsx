import React from 'react';
import { createRoot } from 'react-dom/client';
import DkdAnyelaBornMobileApp from './dkd_AnyelaBornMobile.jsx';
import './dkd_anyela_born_mobile.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DkdAnyelaBornMobileApp />
  </React.StrictMode>,
);
