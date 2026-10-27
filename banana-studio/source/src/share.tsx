import React from 'react';
import { createRoot } from 'react-dom/client';
import { SharedFolder } from './components/SharedFolder';
import './styles/sharedFolder.css';

createRoot(document.getElementById('root')!).render(<React.StrictMode><SharedFolder /></React.StrictMode>);
