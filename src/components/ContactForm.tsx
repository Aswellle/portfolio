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
      setError('联系表单暂未配置，请直接通过 GitHub 联系我。');
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
    } catch {
      setStatus('error');
      setError('发送失败，请稍后重试或通过 GitHub 联系我。');
    }
  };

  const inputCls = `w-full px-4 py-3 rounded-xl text-sm text-zinc-800 placeholder-zinc-400
    bg-zinc-50 border border-zinc-200 outline-none
    focus:border-blue-400 focus:ring-2 focus:ring-blue-100
    transition-all duration-200`;

  if (status === 'success') {
    return (
      <div className="text-center py-12">
        <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200
                        flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <p className="text-zinc-800 font-semibold text-lg">消息已发送！</p>
        <p className="text-zinc-500 text-sm mt-1">我会尽快回复你。</p>
        <button onClick={() => setStatus('idle')}
          className="mt-6 text-sm text-blue-600 hover:text-blue-500 transition-colors">
          再发一条
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="block text-xs text-zinc-500 mb-1.5 font-medium">称呼</label>
          <input id="name" name="name" type="text" required value={form.name}
            onChange={handleChange} placeholder="你的名字或昵称"
            className={inputCls} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-xs text-zinc-500 mb-1.5 font-medium">邮箱</label>
          <input id="email" name="email" type="email" required value={form.email}
            onChange={handleChange} placeholder="your@email.com"
            className={inputCls} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="message" className="block text-xs text-zinc-500 mb-1.5 font-medium">消息内容</label>
        <textarea id="message" name="message" required rows={5} value={form.message}
          onChange={handleChange} placeholder="想聊什么都可以——项目合作、技术交流、或者只是打个招呼"
          className={`${inputCls} resize-none`} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button type="submit" disabled={status === 'loading'}
        className="w-full py-3 rounded-xl text-sm font-semibold text-white
                   bg-gradient-to-r from-blue-600 to-violet-600
                   hover:from-blue-500 hover:to-violet-500
                   disabled:opacity-50 disabled:cursor-not-allowed
                   shadow-lg shadow-blue-100 hover:shadow-blue-200
                   hover:-translate-y-0.5 transition-all duration-200">
        {status === 'loading' ? '发送中…' : '发送消息'}
      </button>
    </form>
  );
}
