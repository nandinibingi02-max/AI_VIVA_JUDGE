import { useEffect, useState } from 'react';
import { ArrowRight, Award, Loader, RotateCcw, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { api } from '../services/api';
import '../styles/Workspace.css';

export default function Results() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const sessionId = new URLSearchParams(window.location.search).get('sessionId');
  useEffect(() => { if (!sessionId) { setLoading(false); return; } api.getResults(sessionId).then(setData).catch(() => setData(null)).finally(() => setLoading(false)); }, [sessionId]);
  const restart = () => { window.history.pushState({}, '', '/viva'); window.dispatchEvent(new PopStateEvent('popstate')); };
  const submitAnswer = async (event) => {
    event.preventDefault(); setError(''); setSubmitting(true);
    try { const result = await api.submitAnswer(sessionId, answer); setAnswer(''); setData((current) => ({ ...current, finalAssessment: result.finalAssessment, latestAssessment: result.latestAssessment, challenge: result.challenge ?? current.challenge, currentQuestion: result.currentQuestion, totalQuestions: result.totalQuestions, status: result.status })); }
    catch (requestError) { setError(requestError.message || 'Unable to submit your answer.'); }
    finally { setSubmitting(false); }
  };
  const assessment = data?.finalAssessment;
  return <div className="dashboard-container"><Sidebar isOpen={open} onClose={() => setOpen(false)} /><main className="main-content workspace"><Navbar eyebrow={data?.status === 'completed' ? 'SESSION COMPLETE' : 'VIVA CHALLENGE'} title={data?.status === 'completed' ? 'Your viva results' : 'Respond to the examiner'} onMenuClick={() => setOpen(true)} />
    {loading ? <div className="loading-screen"><Loader className="loading-spinner" /></div> : !data ? <div className="blank-panel"><Award size={38} /><h3>No session selected</h3><p>Complete a viva to see its evaluation here.</p><button className="primary-action" onClick={restart}>Start a viva <ArrowRight size={18} /></button></div> : data.status !== 'completed' ? <section className="viva-form glass-card"><div className="form-heading"><Sparkles size={20} /><div><h3>Question {data.currentQuestion} of {data.totalQuestions}</h3><p>{data.challenge?.whyThisMatters}</p></div></div><p>{data.challenge?.challengeQuestion}</p><form onSubmit={submitAnswer}><label>Your answer<textarea value={answer} onChange={(event) => setAnswer(event.target.value)} required rows="6" placeholder="Explain your implementation and technical decisions." /></label>{error && <p className="form-error">{error}</p>}<button className="primary-action" disabled={submitting}>{submitting ? 'Evaluating...' : data.currentQuestion === data.totalQuestions ? 'Submit final answer' : 'Submit and continue'}</button></form></section> : <div className="results-layout"><section className="result-score glass-card"><div className="score-ring" style={{ '--score': assessment.understandingScore }}><span>{assessment.understandingScore}<small>%</small></span></div><div><span className="hero-chip"><Sparkles size={14} /> Decision AI final evaluation</span><h2>{data.title}</h2><p>Confidence: {assessment.confidence}%</p></div></section><section className="feedback-grid"><article className="feedback-card glass-card"><span>Strengths</span>{assessment.strengths.map((item) => <p key={item}>{item}</p>)}</article><article className="feedback-card glass-card"><span>Weaknesses</span>{assessment.weaknesses.map((item) => <p key={item}>{item}</p>)}</article><article className="feedback-card glass-card"><span>Evidence</span>{assessment.reasoningEvidence.map((item) => <p key={item}>{item}</p>)}</article></section><section className="glass-card suggestions-result"><h3>What to focus on next</h3>{assessment.improvementSuggestions.map((item) => <p key={item}>{item}</p>)}</section><button className="secondary-action" onClick={restart}><RotateCcw size={17} /> Start another viva</button></div>}
  </main></div>;
}
