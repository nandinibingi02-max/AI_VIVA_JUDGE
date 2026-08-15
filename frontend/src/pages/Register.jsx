import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, LoaderCircle, Mic, ShieldCheck, UserPlus } from 'lucide-react';
import { auth } from '../services/auth';
import '../styles/Login.css';

export default function Register({ onAuthenticated }) {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const update = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.password || !form.confirmPassword) { setError('Complete all fields to create your account.'); return; }
    if (form.password !== form.confirmPassword) { setError('Passwords do not match.'); return; }
    setError(''); setLoading(true);
    try { const user = await auth.register({ name: form.name.trim(), email: form.email.trim(), password: form.password }); onAuthenticated(user); }
    catch (requestError) { setError(requestError.details?.[0]?.message ?? requestError.message); }
    finally { setLoading(false); }
  };
  return <main className="login-page"><section className="login-brand-panel"><div className="login-brand"><span><Mic size={20} /></span>Viva<em>AI</em></div><div className="login-intro"><p className="login-kicker">AI VIVA JUDGE</p><h1>Start practising<br /><em>with purpose.</em></h1><p>Create your account to keep your future viva sessions, feedback, and progress in one place.</p></div><div className="login-assurance"><ShieldCheck size={18} /><span>Your password is securely handled and never stored in plain text.</span></div></section><section className="login-form-panel"><motion.div className="login-card register-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><div className="login-card-heading"><span className="login-icon"><UserPlus size={20} /></span><div><p>CREATE ACCOUNT</p><h2>Join VivaAI</h2></div></div><form onSubmit={submit} noValidate><label>Full name<input name="name" autoComplete="name" value={form.name} onChange={update} placeholder="Your name" disabled={loading} /></label><label>Email<input name="email" type="email" autoComplete="email" value={form.email} onChange={update} placeholder="you@example.com" disabled={loading} /></label><label>Password<span className="password-field"><input name="password" type={visible ? 'text' : 'password'} autoComplete="new-password" value={form.password} onChange={update} placeholder="At least 8 characters" disabled={loading} /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Hide password' : 'Show password'}>{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label><label>Confirm password<input name="confirmPassword" type={visible ? 'text' : 'password'} autoComplete="new-password" value={form.confirmPassword} onChange={update} placeholder="Repeat your password" disabled={loading} /></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading ? <><LoaderCircle className="login-loader" size={18} /> Creating account</> : <>Create account <ArrowRight size={18} /></>}</button></form><p className="register-prompt">Already have an account? <a href="/login">Login</a></p></motion.div></section></main>;
}
