import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Menu, Settings, UserRound } from 'lucide-react';
import { useState } from 'react';
import { auth } from '../services/auth';
import '../styles/Navbar.css';

const navigate = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); };

export default function Navbar({ title, eyebrow, onMenuClick, actions = true }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const logout = async () => {
    try { await auth.logout(); } catch { /* Redirect even when no prior server session exists. */ }
    window.dispatchEvent(new Event('auth:logout'));
    navigate('/login');
  };
  return <header className="page-navbar">
    <button className="mobile-menu-btn" onClick={onMenuClick} aria-label="Open navigation"><Menu size={22} /></button>
    <div className="page-heading"><p className="page-eyebrow">{eyebrow}</p><h1>{title}</h1></div>
    {actions && <div className="navbar-actions"><div className="profile-menu"><button className="profile-trigger" onClick={() => setProfileOpen((value) => !value)} aria-expanded={profileOpen} aria-haspopup="menu"><span className="profile-avatar"><UserRound size={18} /></span><ChevronDown size={15} className={profileOpen ? 'rotated' : ''} /></button><AnimatePresence>{profileOpen && <motion.div className="profile-dropdown" role="menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .16 }}><button role="menuitem" onClick={() => setProfileOpen(false)}>Profile</button><button role="menuitem" onClick={() => { navigate('/settings'); setProfileOpen(false); }}><Settings size={15} /> Settings</button><button role="menuitem" onClick={logout}>Logout</button></motion.div>}</AnimatePresence></div></div>}
  </header>;
}
