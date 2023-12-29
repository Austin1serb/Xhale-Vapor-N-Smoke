import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import { BrowserRouter as Router } from 'react-router-dom';


if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then(registration => {
    }, err => {
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
// You can also access the documentation theme object in the console


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router scrollRestoration="auto">
    <App />
  </Router>,
);

