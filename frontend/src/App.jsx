import { useEffect, useState } from 'react';
import Dashboard from './pages/Dashboard';
import Viva from './pages/Viva';
import Results from './pages/Results';
import History from './pages/History';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import { auth } from './services/auth';
import './styles/global.css';

export default function App() {
  const [path, setPath] = useState(window.location.pathname);
  const [currentUser, setCurrentUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.theme = localStorage.getItem('viva-theme') === 'light' ? 'light' : 'dark';
    const update = () => setPath(window.location.pathname);
    const clearSession = () => setCurrentUser(null);
    window.addEventListener('popstate', update);
    window.addEventListener('auth:logout', clearSession);
    auth.restoreSession().then(setCurrentUser).finally(() => setAuthReady(true));
    return () => { window.removeEventListener('popstate', update); window.removeEventListener('auth:logout', clearSession); };
  }, []);
  const completeLogin = (user) => { setCurrentUser(user); window.history.replaceState({}, '', '/'); setPath('/'); };
  if (!authReady) return <main className="loading-screen"><p>Restoring your session…</p></main>;
  if (path === '/login') return currentUser ? <Dashboard /> : <Login onAuthenticated={completeLogin} />;
  if (path === '/register') return currentUser ? <Dashboard /> : <Register onAuthenticated={completeLogin} />;
  if (!currentUser) return <Login onAuthenticated={completeLogin} />;
  if (path === '/viva') return <Viva />;
  if (path === '/results') return <Results />;
  if (path === '/history') return <History />;
  if (path === '/settings') return <Settings />;
  return <Dashboard />;
}
