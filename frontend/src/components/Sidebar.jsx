import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, History, LayoutDashboard, Mic, PanelLeftClose, PanelLeftOpen, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import '../styles/Sidebar.css';

const navigation = [{ label: 'Dashboard', path: '/', icon: LayoutDashboard }, { label: 'New Viva', path: '/viva', icon: Mic }, { label: 'Results', path: '/results', icon: BarChart3 }, { label: 'History', path: '/history', icon: History }];

export default function Sidebar({ isOpen = false, onClose, currentPath = window.location.pathname }) {
  const [collapsed, setCollapsed] = useState(false);
  useEffect(() => { const toggle = () => setCollapsed((value) => !value); window.addEventListener('sidebar:toggle', toggle); return () => window.removeEventListener('sidebar:toggle', toggle); }, []);
  useEffect(() => { document.documentElement.style.setProperty('--sidebar-width', collapsed ? '82px' : '254px'); }, [collapsed]);
  const navigate = (path) => { if (path !== window.location.pathname) { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); } onClose?.(); };
  const content = (mobile = false) => <aside className={`sidebar ${collapsed && !mobile ? 'collapsed' : ''}`}><div className="brand-row"><button className="brand" onClick={() => navigate('/')} aria-label="VivaAI dashboard"><span className="brand-mark"><Mic size={19} /></span><span className="brand-name">Viva<span>AI</span></span></button>{mobile ? <button className="sidebar-close" onClick={onClose} aria-label="Close menu"><X size={20} /></button> : <button className="sidebar-collapse" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">{collapsed ? <PanelLeftOpen size={19} /> : <PanelLeftClose size={19} />}</button>}</div><nav className="side-nav" aria-label="Primary navigation">{navigation.map(({ label, path, icon: Icon }) => <button key={path} className={`nav-link ${currentPath === path ? 'active' : ''}`} onClick={() => navigate(path)} title={collapsed ? label : undefined}><Icon size={19} /><span>{label}</span></button>)}</nav><div className="sidebar-footer"><p>Practice. Improve.<br />Perform with confidence.</p></div></aside>;
  return <><div className="sidebar-desktop">{content()}</div><AnimatePresence>{isOpen && <motion.div className="sidebar-mobile-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="sidebar-backdrop" onClick={onClose} aria-label="Close menu" /><motion.div initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }} transition={{ type: 'spring', damping: 26, stiffness: 260 }}>{content(true)}</motion.div></motion.div>}</AnimatePresence></>;
}
