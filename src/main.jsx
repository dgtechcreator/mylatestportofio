import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/main.css';

// Enables the scroll-reveal styles (kept here, not inline, so a strict CSP can block inline scripts).
document.documentElement.classList.add('js');

// Light deterrent against dragging pictures out of the page (not real protection — see README).
document.addEventListener('dragstart', (e) => e.target instanceof HTMLImageElement && e.preventDefault());

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
