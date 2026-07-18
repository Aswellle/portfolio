import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LoginForm from './LoginForm';
import Dashboard from './Dashboard';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL ?? '',
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? '',
);

type AuthState = 'checking' | 'out' | 'in';

export default function AdminApp() {
  const [state, setState] = useState<AuthState>('checking');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(session ? 'in' : 'out');
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setState(session ? 'in' : 'out');
    });
    return () => subscription.unsubscribe();
  }, []);

  if (state === 'checking') {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return state === 'out'
    ? <LoginForm supabase={supabase} />
    : <Dashboard supabase={supabase} />;
}
