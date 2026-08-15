import React from 'react';
import ReactDOM from 'react-dom/client';
import AppErrorBoundary from './components/AppErrorBoundary';
import './styles/global.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<main className="app-error-boundary"><p>Loading VivaAI…</p></main>);

import('./App')
  .then(({ default: App }) => root.render(<React.StrictMode><AppErrorBoundary><App /></AppErrorBoundary></React.StrictMode>))
  .catch((error) => {
    console.error('Application module error:', error);
    root.render(<main className="app-error-boundary"><h1>Unable to start VivaAI</h1><p>{error.message}</p><button onClick={() => window.location.reload()}>Refresh page</button></main>);
  });
