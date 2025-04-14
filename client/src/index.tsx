import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Safe to use, no need for null check
  root.render(<App />);
} else {
  console.error("Root element not found.");
}
