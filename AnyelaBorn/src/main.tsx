import React from 'react';
import ReactDOM from 'react-dom/client';
import DkdAnyelaBornApp from './DkdAnyelaBornApp';
import './dkdAnyelaBorn.css';

const dkd_root_element = document.getElementById('root');

if (dkd_root_element) {
  ReactDOM.createRoot(dkd_root_element).render(
    <React.StrictMode>
      <DkdAnyelaBornApp />
    </React.StrictMode>
  );
}
