import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, KeyRound, LoaderCircle, Mic, ShieldCheck } from 'lucide-react';
import { auth } from '../services/auth';
import '../styles/Login.css';

export default function Login({ onAuthenticated }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault();
    if (!email.trim() || !password) { setError('Enter your email and password to continue.'); return; }
    setError(''); setLoading(true);
    try { const user = await auth.login({ email: email.trim(), password }); onAuthenticated(user); }
    catch (requestError) { setError(requestError.details?.[0]?.message ?? requestError.message); }
    finally { setLoading(false); }
  };
  return <main className="login-page"><section className="login-brand-panel"><div className="login-brand"><span><Mic size={20} /></span>Viva<em>AI</em></div><div className="login-intro"><p className="login-kicker">AI VIVA JUDGE</p><h1>Bring clarity to<br /><em>every answer.</em></h1><p>Practice, evaluate, and improve with a focused viva workspace built around your progress.</p></div><div className="login-assurance"><ShieldCheck size={18} /><span>Your session is protected with secure, cookie-based authentication.</span></div></section><section className="login-form-panel"><motion.div className="login-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}><div className="login-card-heading"><span className="login-icon"><KeyRound size={20} /></span><div><p>WELCOME BACK</p><h2>Sign in to VivaAI</h2></div></div><form onSubmit={submit} noValidate><label>Email<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" disabled={loading} /></label><label>Password<span className="password-field"><input type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" disabled={loading} /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span></label>{error && <p className="login-error" role="alert">{error}</p>}<button className="login-submit" disabled={loading}>{loading ? <><LoaderCircle className="login-loader" size={18} /> Signing in</> : <>Login <ArrowRight size={18} /></>}</button></form><p className="register-prompt">Don&apos;t have an account? <a href="/register">Register</a></p></motion.div></section></main>;
}
