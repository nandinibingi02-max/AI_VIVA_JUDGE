import { Component } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class AppErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error) { console.error('Application render error:', error); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return <main className="app-error-boundary"><AlertTriangle size={36} /><h1>Unable to load VivaAI</h1><p>Please refresh the page. If the issue continues, restart the frontend development server.</p><button onClick={() => window.location.reload()}><RefreshCw size={17} /> Refresh page</button></main>;
  }
}
