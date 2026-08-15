import { useEffect, useState } from 'react';
import { KeyRound, Moon, Sun } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import '../styles/Settings.css';

export default function Settings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLight, setIsLight] = useState(() => localStorage.getItem('viva-theme') === 'light');
  useEffect(() => { document.documentElement.dataset.theme = isLight ? 'light' : 'dark'; localStorage.setItem('viva-theme', isLight ? 'light' : 'dark'); }, [isLight]);
  return <div className="dashboard-container"><Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} /><main className="main-content workspace"><Navbar eyebrow="PREFERENCES" title="Settings" onMenuClick={() => setMenuOpen(true)} /><div className="settings-stack"><section className="settings-card glass-card"><div className="settings-copy"><span className="settings-icon">{isLight ? <Sun size={19} /> : <Moon size={19} />}</span><div><h2>Appearance</h2><p>Choose the interface theme that is most comfortable for you.</p></div></div><button className={`theme-toggle ${isLight ? 'enabled' : ''}`} onClick={() => setIsLight((value) => !value)} role="switch" aria-checked={isLight}><span /><b>{isLight ? 'Light mode' : 'Dark mode'}</b></button></section><section className="settings-card glass-card"><div className="settings-copy"><span className="settings-icon"><KeyRound size={19} /></span><div><h2>Change password</h2><p>Password management will be available once authentication is connected.</p></div></div><button className="secondary-action" disabled>Change password</button></section></div></main></div>;
}
