// frontend/src/index.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Import fonts
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';
import '@fontsource/inter/800.css';

// Import icon library styles
import 'lucide-react';

// Create root element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Render application
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();

// Service worker registration for PWA
if ('serviceWorker' in navigator && import.meta.env.MODE  === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    })
    .catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

// Error boundary for production
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);

  // You can send errors to your error tracking service here
  // Example: Sentry.captureException(event.error);
});

// Unhandled promise rejection handler
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);

  // Prevent default error logging
  event.preventDefault();

  // You can send errors to your error tracking service here
  // Example: Sentry.captureException(event.reason);
});