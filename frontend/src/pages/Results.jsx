import { useEffect, useState } from 'react';
import { ArrowRight, Award, Loader, RotateCcw, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import '../styles/Workspace.css';

export default function Results() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const sessionId = new URLSearchParams(window.location.search).get('sessionId');
  useEffect(() => { if (!sessionId) { setLoading(false); return; } api.getResults(sessionId).then(setData).finally(() => setLoading(false)); }, [sessionId]);
  const restart = () => { window.history.pushState({}, '', '/viva'); window.dispatchEvent(new PopStateEvent('popstate')); };
  return <div className="dashboard-container"><Sidebar isOpen={open} onClose={() => setOpen(false)} /><main className="main-content workspace"><Navbar eyebrow="SESSION COMPLETE" title="Your viva results" onMenuClick={() => setOpen(true)} />
    {loading ? <div className="loading-screen"><Loader className="loading-spinner" /></div> : !data ? <div className="blank-panel"><Award size={38} /><h3>No session selected</h3><p>Complete a viva to see its evaluation here.</p><button className="primary-action" onClick={restart}>Start a viva <ArrowRight size={18} /></button></div> : <div className="results-layout"><section className="result-score glass-card"><div className="score-ring" style={{ '--score': data.score }}><span>{data.score}<small>%</small></span></div><div><span className="hero-chip"><Sparkles size={14} /> AI evaluation</span><h2>{data.title}</h2><p>{data.summary}</p></div></section><section className="feedback-grid">{data.feedback?.map((item, index) => <article className="feedback-card glass-card" key={item.id ?? index}><span>{item.label}</span><h3>{item.value}</h3><p>{item.feedback}</p></article>)}</section><section className="glass-card suggestions-result"><h3>What to focus on next</h3>{data.suggestions?.map((suggestion, index) => <p key={index}>{suggestion}</p>)}</section><button className="secondary-action" onClick={restart}><RotateCcw size={17} /> Start another viva</button></div>}
  </main></div>;
}
