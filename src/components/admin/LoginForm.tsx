import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

export default function LoginForm({ supabase }: { supabase: SupabaseClient }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('邮箱或密码错误，请重试'); setLoading(false); }
  };

  const cls = `w-full px-4 py-3 rounded-xl text-sm border border-zinc-200 bg-white outline-none
    focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all duration-200`;

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600
                          flex items-center justify-center text-white text-2xl font-bold
                          mx-auto mb-4 shadow-lg shadow-blue-200">A</div>
          <h1 className="text-xl font-bold text-zinc-800">管理后台</h1>
          <p className="text-sm text-zinc-400 mt-1">Aswellle Portfolio Admin</p>
        </div>
        <form onSubmit={handleLogin}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">邮箱</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
              className={cls} placeholder="admin@example.com" autoComplete="email" />
          </div>
          <div>
            <label className="block text-xs text-zinc-500 mb-1.5 font-medium">密码</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
              className={cls} placeholder="••••••••" autoComplete="current-password" />
          </div>
          {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-sm font-semibold text-white
                       bg-gradient-to-r from-blue-600 to-violet-600
                       hover:from-blue-500 hover:to-violet-500
                       disabled:opacity-50 shadow-md transition-all duration-200">
            {loading ? '登录中…' : '登录'}
          </button>
        </form>
        <p className="text-center text-xs text-zinc-400 mt-4">仅限管理员访问</p>
      </div>
    </div>
  );
}
