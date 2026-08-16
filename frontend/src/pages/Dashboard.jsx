import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, BarChart3, CheckCircle, ChevronRight, ClipboardCheck, Loader, Mic, Sparkles, Target, Zap } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import PerformanceChart from '../components/PerformanceChart';
import RecentSessions from '../components/RecentSessions';
import AISuggestions from '../components/AISuggestions';
import { api } from '../services/api';
import '../styles/Dashboard.css';

const scoreOf = (session) => session.final_assessment?.understandingScore;
const formatDate = (value) => value ? new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(new Date(value)) : 'Recently';

function dashboardFromSessions(sessions) {
  const completed = sessions.filter((session) => session.status === 'completed');
  const active = sessions.filter((session) => session.status === 'awaiting_answer');
  const scores = completed.map(scoreOf).filter(Number.isFinite);
  const average = scores.length ? Math.round(scores.reduce((total, score) => total + score, 0) / scores.length) : null;
  const latest = completed[0]?.final_assessment;

  return {
    stats: [
      { id: 'completed', icon: <ClipboardCheck size={21} />, color: '#8b5cf6', value: completed.length, label: 'Completed vivas', trend: active.length ? `${active.length} currently in progress` : 'Ready for your next viva' },
      { id: 'score', icon: <Target size={21} />, color: '#06b6d4', value: average === null ? '—' : `${average}%`, label: 'Average understanding', trend: scores.length ? `Based on ${scores.length} completed viva${scores.length === 1 ? '' : 's'}` : 'Complete a viva to calculate it' },
      { id: 'practice', icon: <BarChart3 size={21} />, color: '#f59e0b', value: sessions.length, label: 'Practice sessions', trend: completed.length ? 'Your evaluated project history' : 'Start your first project viva' },
    ],
    chart: [...completed].reverse().slice(-6).map((session, index) => ({ name: `Viva ${index + 1}`, score: scoreOf(session), understanding: session.final_assessment?.confidence })),
    recent: sessions.slice(0, 5).map((session) => ({ ...session, date: formatDate(session.created_at), score: scoreOf(session) })),
    strong: latest?.strengths ?? [],
    weak: latest?.weaknesses ?? [],
    suggestions: (latest?.improvementSuggestions ?? []).slice(0, 3).map((text, index) => ({ text, type: index === 0 ? 'focus' : 'practice', icon: index === 0 ? 'lightbulb' : 'book' })),
  };
}

export default function Dashboard() {
  const [sessions, setSessions] = useState(null);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const loadDashboard = async () => {
    try { setError(null); setSessions((await api.getHistory()).sessions ?? []); }
    catch { setError('Unable to load your viva progress.'); }
  };
  useEffect(() => { loadDashboard(); }, []);
  const navigate = (path) => { window.history.pushState({}, '', path); window.dispatchEvent(new PopStateEvent('popstate')); };

  if (sessions === null && !error) return <div className="loading-screen"><Loader className="loading-spinner" size={42} /><p>Preparing your workspace</p></div>;
  if (error) return <div className="error-screen"><AlertCircle size={42} /><h3>Connection unavailable</h3><p>{error}</p><button onClick={loadDashboard} className="retry-btn">Try again</button></div>;
  const data = dashboardFromSessions(sessions);

  return <div className="dashboard-container"><Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} /><main className="main-content"><Navbar title="Your Viva Dashboard" eyebrow="PRACTISE • TRACK • IMPROVE" onMenuClick={() => setIsMobileMenuOpen(true)} />
    <section className="stats-grid">{data.stats.map((stat, index) => <StatCard key={stat.id} stat={stat} index={index} />)}</section>
    <div className="content-grid">
      <motion.section className="chart-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }}><div className="card-header"><div><h3 className="card-title">Performance Overview</h3><p className="card-subtitle">Understanding and confidence from completed vivas</p></div><button className="view-btn" onClick={() => navigate('/history')}>View all <ChevronRight size={16} /></button></div><PerformanceChart data={data.chart} /></motion.section>
      <motion.section className="recent-sessions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .08 }}><div className="card-header"><div><h3 className="card-title">Recent Sessions</h3><p className="card-subtitle">Your newest viva activity</p></div></div><RecentSessions sessions={data.recent} onOpen={(id) => navigate(`/results?sessionId=${encodeURIComponent(id)}`)} /></motion.section>
      <motion.section className="areas-suggestions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .14 }}><div className="areas-grid"><div className="areas-section"><h4 className="areas-title strong">Strong Areas</h4>{data.strong.length ? data.strong.map((area, index) => <div className="area-tag strong" key={index}><CheckCircle size={16} />{area}</div>) : <p className="card-subtitle">Complete a viva to see your strengths.</p>}</div><div className="areas-section"><h4 className="areas-title weak">Needs Improvement</h4>{data.weak.length ? data.weak.map((area, index) => <div className="area-tag weak" key={index}><AlertCircle size={16} />{area}</div>) : <p className="card-subtitle">Your AI feedback will appear here.</p>}</div></div></motion.section>
      <motion.section className="ai-suggestions-card glass-card" initial={{ opacity: 0, scale: .97 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: .2 }}><div className="card-header"><div className="ai-header"><Sparkles size={19} /><h3 className="card-title">AI Suggestions</h3></div><span className="ai-badge">From your latest viva</span></div><AISuggestions suggestions={data.suggestions} /></motion.section>
    </div><div className="quick-start"><button className="start-viva-btn" onClick={() => navigate('/viva')}><Mic size={22} /><span>Start New Viva</span><Zap size={18} /></button></div>
  </main></div>;
}
