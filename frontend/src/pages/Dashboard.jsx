import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, ChevronRight, Loader, Mic, Sparkles, Zap } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import RecentSessions from '../components/RecentSessions';
import AISuggestions from '../components/AISuggestions';
import { api } from '../services/api';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [data, setData] = useState(null), [loading, setLoading] = useState(true), [error, setError] = useState(null), [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const fetchDashboardData = async () => { try { setLoading(true); setData(await api.getDashboardData()); setError(null); } catch { setError('Unable to load the dashboard.'); } finally { setLoading(false); } };
  useEffect(() => {
    if (import.meta.env.VITE_ENABLE_DASHBOARD_API !== 'true') {
      setLoading(false);
      return;
    }
    fetchDashboardData();
  }, []);
  if (loading) return <div className="loading-screen"><Loader className="loading-spinner" size={42} /><p>Preparing your workspace</p></div>;
  if (error) return <div className="error-screen"><AlertCircle size={42} /><h3>Connection unavailable</h3><p>{error}</p><button onClick={fetchDashboardData} className="retry-btn">Try again</button></div>;
  const goToViva = () => { window.history.pushState({}, '', '/viva'); window.dispatchEvent(new PopStateEvent('popstate')); };
  return <div className="dashboard-container"><Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /><main className="main-content"><Navbar title={data?.user ? `${data.user.greeting ?? ''}${data.user.name ? `, ${data.user.name}` : ''}` : 'Dashboard'} eyebrow={data?.user?.subtitle} onMenuClick={() => setIsMobileMenuOpen(true)} />
    <section className="stats-grid">{data?.stats?.map((stat, index) => <StatCard key={stat.id ?? index} stat={stat} index={index} />)}</section>
    <div className="content-grid">
      <motion.section className="chart-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}><div className="card-header"><div><h3 className="card-title">Performance Overview</h3><p className="card-subtitle">{data?.chart?.subtitle}</p></div><button className="view-btn">View all <ChevronRight size={16} /></button></div><PerformanceChart data={data?.chart?.data} /></motion.section>
      <motion.section className="recent-sessions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .08 }}><div className="card-header"><div><h3 className="card-title">Recent Sessions</h3><p className="card-subtitle">{data?.sessions?.subtitle}</p></div></div><RecentSessions sessions={data?.sessions?.list} /></motion.section>
      <motion.section className="areas-suggestions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .14 }}><div className="areas-grid"><div className="areas-section"><h4 className="areas-title strong">Strong Areas</h4>{data?.areas?.strong?.map((area, index) => <div className="area-tag strong" key={index}><CheckCircle size={16} />{area}</div>)}</div><div className="areas-section"><h4 className="areas-title weak">Needs Improvement</h4>{data?.areas?.weak?.map((area, index) => <div className="area-tag weak" key={index}><AlertCircle size={16} />{area}</div>)}</div></div></motion.section>
      <motion.section className="ai-suggestions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .2 }}><div className="card-header"><div className="ai-header"><Sparkles size={19} /><h3 className="card-title">AI Suggestions</h3></div><span className="ai-badge">Powered by AI</span></div><AISuggestions suggestions={data?.suggestions} /></motion.section>
    </div><div className="quick-start"><button className="start-viva-btn" onClick={goToViva}><Mic size={22} /><span>Start New Viva</span><Zap size={18} /></button></div>
  </main></div>;
}
