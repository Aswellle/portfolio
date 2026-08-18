import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

type Mode = 'login' | 'reset' | 'sent';

export default function LoginForm({ supabase }: { supabase: SupabaseClient }) {
  const [mode, setMode] = useState<Mode>('login');
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

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/admin`,
    });
    if (error) { setError('发送失败，请检查邮箱地址后重试'); setLoading(false); }
    else { setMode('sent'); setLoading(false); }
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
          <h1 className="text-xl font-bold text-zinc-800">
            {mode === 'sent' ? '请查收邮件' : '管理后台'}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {mode === 'reset' ? '重置密码' : 'Aswellle Portfolio Admin'}
          </p>
        </div>

        {/* 发送成功提示 */}
        {mode === 'sent' ? (
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-zinc-600 text-center">
             重置链接已发送至 <span className="font-medium">{email}</span>，
             请查收邮件并点击链接设置新密码。
            </p>
            <button onClick={() => { setMode('login'); setEmail(''); }}
              className="w-full py-2.5 rounded-xl text-sm font-medium text-zinc-600
                         border border-zinc-200 hover:bg-zinc-50 transition-all duration-200">
              返回登录
            </button>
          </div>
        ) : (
          <form onSubmit={mode === 'reset' ? handleResetPassword : handleLogin}
                className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-4">
            <div>
              <label className="block text-xs text-zinc-500 mb-1.5 font-medium">邮箱</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                className={cls} placeholder="admin@example.com" autoComplete="email" />
            </div>
            {mode === 'login' && (
              <div>
                <label className="block text-xs text-zinc-500 mb-1.5 font-medium">密码</label>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)}
                  className={cls} placeholder="••••••••" autoComplete="current-password" />
              </div>
            )}
            {error && <p className="text-xs text-red-500 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white
                         bg-gradient-to-r from-blue-600 to-violet-600
                         hover:from-blue-500 hover:to-violet-500
                         disabled:opacity-50 shadow-md transition-all duration-200">
              {loading
                ? (mode === 'reset' ? '发送中…' : '登录中…')
                : (mode === 'reset' ? '发送重置链接' : '登录')}
            </button>
          </form>
        )}

        {/* 切换登录/重置模式 */}
        {mode !== 'sent' && (
          <div className="mt-4 text-center">
            {mode === 'login' ? (
              <button onClick={() => { setMode('reset'); setError(''); setPassword(''); }}
                className="text-xs text-zinc-400 hover:text-blue-600 transition-colors">
                忘记密码？
              </button>
            ) : (
              <button onClick={() => { setMode('login'); setError(''); }}
                className="text-xs text-zinc-400 hover:text-blue-600 transition-colors">
                ← 返回登录
              </button>
            )}
          </div>
        )}

        <p className="text-center text-xs text-zinc-400 mt-4">仅限管理员访问</p>
      </div>
    </div>
  );
}
