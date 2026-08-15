import { useRef, useState } from 'react';
import { ArrowRight, BrainCircuit, FileText, Mic, Sparkles } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { api } from '../services/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const allowedExtensions = ['.pdf', '.ppt', '.pptx'];

export default function Viva() {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [projectFile, setProjectFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInput = useRef(null);

  const update = ({ target: { name, value } }) => setForm((current) => ({ ...current, [name]: value }));
  const selectFile = ({ target }) => {
    const file = target.files?.[0];
    if (!file) return;
    const extension = `.${file.name.split('.').pop()?.toLowerCase()}`;
    if (!allowedExtensions.includes(extension)) {
      setProjectFile(null); setFileError('Choose a PDF, PPT, or PPTX file.'); target.value = ''; return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setProjectFile(null); setFileError('Project file must be 10 MB or smaller.'); target.value = ''; return;
    }
    setProjectFile(file);
    setFileError('');
  };
  const removeFile = () => { setProjectFile(null); setFileError(''); if (fileInput.current) fileInput.current.value = ''; };
  const begin = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const session = await api.startViva(form, projectFile);
      window.history.pushState({}, '', `/results?sessionId=${encodeURIComponent(session.id ?? session.sessionId)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (requestError) {
      setError(requestError.message || 'Unable to start this viva. Please try again.');
    } finally { setSubmitting(false); }
  };

  return <div className="dashboard-container"><Sidebar isOpen={open} onClose={() => setOpen(false)} /><main className="main-content workspace"><Navbar eyebrow="YOUR PRACTICE SPACE" title="Create a focused viva" onMenuClick={() => setOpen(true)} /><div className="viva-hero"><div><span className="hero-chip"><Sparkles size={14} /> Adaptive questioning</span><h2>Let your project <em>take the stage.</em></h2><p>Share the context your examiner needs. The session begins only when you are ready.</p></div><div className="hero-orb"><BrainCircuit size={62} /></div></div><form className="viva-form glass-card" onSubmit={begin}><div className="form-heading"><FileText size={20} /><div><h3>Viva context</h3><p>Everything is supplied by you—nothing is pre-filled.</p></div></div><label>Project title<input name="title" value={form.title ?? ''} onChange={update} required placeholder="Enter your project title" /></label><label>Subject or domain<input name="subject" value={form.subject ?? ''} onChange={update} required placeholder="Enter your subject" /></label><label>Project description<textarea name="description" value={form.description ?? ''} onChange={update} placeholder="Describe the problem, approach, and what you built" rows="5" /></label><label>Project file <small>(optional · PDF, PPT, or PPTX · 10 MB max)</small><input ref={fileInput} type="file" accept=".pdf,.ppt,.pptx" onChange={selectFile} /></label>{projectFile && <div className="viva-note"><FileText size={17} /><span>{projectFile.name}</span><button type="button" className="secondary-action" onClick={() => fileInput.current?.click()}>Change</button><button type="button" className="secondary-action" onClick={removeFile}>Remove</button></div>}{fileError && <p className="form-error" role="alert">{fileError}</p>}{error && <p className="form-error">{error}</p>}<button className="primary-action" disabled={submitting}>{submitting ? 'Starting...' : <>Begin viva <ArrowRight size={19} /></>}</button></form><div className="viva-note"><Mic size={17} />Your responses and evaluation remain tied to this session.</div></main></div>;
}
