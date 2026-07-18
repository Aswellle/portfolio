import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseUrl || !supabaseAnonKey) {
      setStatus('error');
      setError('Contact form is not configured yet.');
      return;
    }
    setStatus('loading');
    setError('');
    try {
      const supabase = createClient(supabaseUrl, supabaseAnonKey);
      const { error: dbError } = await supabase.from('contacts').insert([{
        name: form.name.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      }]);
      if (dbError) throw dbError;
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus('error');
      setError('Something went wrong. Please try again or email me directly.');
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500
    bg-slate-900 border border-white/10 outline-none
    focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20
    transition-all duration-200`;

  if (status === 'success') {
    return (
      <div className="text-center py-10">
        <div className="text-4xl mb-4" aria-hidden="true">✓</div>
        <p className="text-slate-300 font-medium">Message sent!</p>
        <p className="text-slate-500 text-sm mt-1">I'll get back to you soon.</p>
        <button onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-indigo-400 hover:text-indigo-300 transition-colors">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-slate-400 mb-1.5 font-medium">Name</label>
          <input id="name" name="name" type="text" required value={form.name}
            onChange={handleChange} placeholder="Your name"
            className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-slate-400 mb-1.5 font-medium">Email</label>
          <input id="email" name="email" type="email" required value={form.email}
            onChange={handleChange} placeholder="you@example.com"
            className={inputCls} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-xs text-slate-400 mb-1.5 font-medium">Message</label>
        <textarea id="message" name="message" required rows={5} value={form.message}
          onChange={handleChange} placeholder="What's on your mind?"
          className={`${inputCls} resize-none`} />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-sm font-semibold
                   bg-indigo-500 text-white
                   hover:bg-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 hover:-translate-y-0.5
                   shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
        {status === 'loading' ? 'Sending…' : 'Send Message'}
      </button>
    </form>
  );
}
