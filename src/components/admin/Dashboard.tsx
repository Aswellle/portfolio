import { useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import MessagesPanel from './MessagesPanel';

type Tab = 'messages';

export default function Dashboard({ supabase }: { supabase: SupabaseClient }) {
  const [tab] = useState<Tab>('messages');

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="h-screen bg-zinc-50 flex flex-col overflow-hidden">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-zinc-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600
                          flex items-center justify-center text-white text-sm font-bold shadow-sm">A</div>
          <div>
            <span className="font-semibold text-zinc-800 text-sm">Aswellle 管理后台</span>
            <span className="ml-2 text-xs text-zinc-400">Portfolio Admin</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="/" target="_blank" rel="noopener noreferrer"
             className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            查看网站 ↗
          </a>
          <button onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-500
                       hover:bg-zinc-50 hover:text-zinc-700 transition-all duration-150">
            退出登录
          </button>
        </div>
      </header>

      {/* 侧边栏 + 内容区 */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:block w-48 bg-white border-r border-zinc-200 p-3 flex-shrink-0">
          <nav className="space-y-1">
            <button
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm
                         font-medium transition-all duration-150
                         ${tab === 'messages'
                           ? 'bg-blue-50 text-blue-700'
                           : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
              </svg>
              消息管理
            </button>
          </nav>
        </aside>

        <main className="flex flex-col flex-1 overflow-hidden">
          {tab === 'messages' && <MessagesPanel supabase={supabase} />}
        </main>
      </div>
    </div>
  );
}
