import { useState, useEffect, useCallback } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Contact {
  id: string; name: string; email: string; message: string;
  created_at: string; read_at: string | null; is_starred: boolean;
}
type Filter = 'all' | 'unread' | 'starred';
type MobileView = 'list' | 'detail';

function fmt(iso: string) {
  return new Date(iso).toLocaleString('zh-CN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function MessagesPanel({ supabase }: { supabase: SupabaseClient }) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [loading, setLoading] = useState(true);
  const [mobileView, setMobileView] = useState<MobileView>('list');

  const fetch = useCallback(async () => {
    const { data } = await supabase.from('contacts').select('*').order('created_at', { ascending: false });
    if (data) setContacts(data as Contact[]);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetch();
    const ch = supabase.channel('admin-contacts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contacts' }, fetch)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [fetch, supabase]);

  const markRead = async (c: Contact) => {
    if (c.read_at) return;
    const ts = new Date().toISOString();
    await supabase.from('contacts').update({ read_at: ts }).eq('id', c.id);
    setContacts(p => p.map(x => x.id === c.id ? { ...x, read_at: ts } : x));
    setSelected(p => p?.id === c.id ? { ...p, read_at: ts } : p);
  };

  const toggleStar = async (c: Contact) => {
    const next = !c.is_starred;
    await supabase.from('contacts').update({ is_starred: next }).eq('id', c.id);
    setContacts(p => p.map(x => x.id === c.id ? { ...x, is_starred: next } : x));
    setSelected(p => p?.id === c.id ? { ...p, is_starred: next } : p);
  };

  const del = async (id: string) => {
    if (!confirm('确认删除这条消息？')) return;
    await supabase.from('contacts').delete().eq('id', id);
    setContacts(p => p.filter(x => x.id !== id));
    if (selected?.id === id) { setSelected(null); setMobileView('list'); }
  };

  const handleSelect = (c: Contact) => {
    setSelected(c); markRead(c); setMobileView('detail');
  };

  const applyFilter = (f: Filter) => {
    setFilter(f);
    const list = contacts.filter(c =>
      f === 'unread' ? !c.read_at : f === 'starred' ? c.is_starred : true
    );
    const first = list[0] ?? null;
    setSelected(first);
    if (first && !first.read_at) markRead(first);
  };

  const filtered = contacts.filter(c =>
    filter === 'unread' ? !c.read_at : filter === 'starred' ? c.is_starred : true
  );
  const unreadCount = contacts.filter(c => !c.read_at).length;

  const tabCls = (a: boolean) =>
    `px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 min-h-[36px] ${
      a ? 'bg-blue-600 text-white shadow-sm' : 'text-zinc-500 hover:bg-zinc-100'}`;

  /* ── Shared: detail pane content ─────────────── */
  const DetailPane = () => !selected ? (
    <div className="flex flex-col items-center justify-center flex-1 text-zinc-400 gap-2">
      <svg className="w-10 h-10 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
      </svg>
      <p className="text-sm">选择一条消息查看详情</p>
    </div>
  ) : (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* 固定头部：发件人信息 + 操作按钮 */}
      <div className="flex items-start justify-between px-4 sm:px-6 py-4 border-b border-zinc-100 flex-shrink-0 flex-wrap gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-zinc-800">{selected.name}</h3>
          <a href={`mailto:${selected.email}`} className="text-sm text-blue-600 hover:underline break-all">{selected.email}</a>
          <p className="text-xs text-zinc-400 mt-1">{fmt(selected.created_at)}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={() => toggleStar(selected)}
            className={`px-3 py-2 rounded-xl text-xs font-medium border min-h-[44px] transition-all duration-150 ${
              selected.is_starred ? 'bg-amber-50 text-amber-600 border-amber-200' : 'bg-white text-zinc-500 border-zinc-200'}`}>
            {selected.is_starred ? '★ 已加星' : '☆ 加星'}
          </button>
          <button onClick={() => del(selected.id)}
            className="px-3 py-2 rounded-xl text-xs font-medium border border-red-200 bg-red-50 text-red-600 min-h-[44px] transition-all duration-150">
            删除
          </button>
        </div>
      </div>
      {/* 可滚动正文区 */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
        <div className="bg-white rounded-2xl border border-zinc-200 p-5 shadow-sm">
          <p className="text-sm text-zinc-700 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
        </div>
        {selected.read_at && (
          <p className="text-xs text-zinc-400 mt-3 flex items-center gap-1.5">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
            </svg>
            已读 · {fmt(selected.read_at)}
          </p>
        )}
      </div>
    </div>
  );

  /* ── Shared: message list ─────────────────────── */
  const MessageList = () => (
    <div className="flex-1 overflow-y-auto bg-white">
      {loading ? (
        <div className="flex items-center justify-center py-16 text-zinc-400 text-sm">加载中…</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-zinc-400 gap-2">
          <svg className="w-8 h-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
          </svg>
          <span className="text-xs">暂无消息</span>
        </div>
      ) : filtered.map(c => (
        <button key={c.id} onClick={() => handleSelect(c)}
          className={`w-full text-left px-4 py-4 border-b border-zinc-100 transition-all duration-150
                     active:bg-zinc-100 min-h-[72px]
                     ${selected?.id === c.id ? 'bg-blue-50 border-l-2 border-l-blue-500' : 'hover:bg-zinc-50'}
                     ${!c.read_at ? 'bg-blue-50/40' : ''}`}>
          <div className="flex items-center justify-between mb-1">
            <span className={`text-sm font-medium truncate ${!c.read_at ? 'text-zinc-900' : 'text-zinc-600'}`}>{c.name}</span>
            <span className="text-xs text-zinc-400 flex-shrink-0 ml-2">{fmt(c.created_at)}</span>
          </div>
          <p className="text-xs text-zinc-400 truncate mb-1">{c.message}</p>
          <div className="flex items-center gap-2">
            {!c.read_at && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
            {c.is_starred && <span className="text-amber-400 text-xs">★</span>}
            <span className="text-xs text-zinc-400 truncate">{c.email}</span>
          </div>
        </button>
      ))}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      {/* 统计 + 筛选栏 */}
      <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 bg-white flex items-center justify-between gap-3 flex-wrap flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* 移动端返回按钮 */}
          {mobileView === 'detail' && (
            <button onClick={() => setMobileView('list')}
              className="md:hidden flex items-center gap-1 text-sm text-blue-600 min-h-[44px] pr-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
              </svg>
              返回
            </button>
          )}
          <h2 className="font-semibold text-zinc-800 text-sm">消息收件箱</h2>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {unreadCount} 未读
            </span>
          )}
        </div>
        <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl">
          <button onClick={() => applyFilter('all')} className={tabCls(filter === 'all')}>全部 {contacts.length}</button>
          <button onClick={() => applyFilter('unread')} className={tabCls(filter === 'unread')}>未读 {unreadCount}</button>
          <button onClick={() => applyFilter('starred')} className={tabCls(filter === 'starred')}>
            ★ {contacts.filter(c => c.is_starred).length}
          </button>
        </div>
      </div>

      {/* 桌面：双栏 | 移动：单栏切换 */}
      <div className="flex flex-1 overflow-hidden">
        {/* 消息列表 — 桌面始终显示，移动端仅 list 视图 */}
        <div className={`
          ${mobileView === 'list' ? 'flex' : 'hidden'} md:flex
          flex-col w-full md:w-80 border-r border-zinc-200 flex-shrink-0
        `}>
          <MessageList />
        </div>

        {/* 消息详情 — 桌面始终显示，移动端仅 detail 视图 */}
        <div className={`
          ${mobileView === 'detail' ? 'flex' : 'hidden'} md:flex
          flex-1 overflow-auto
        `}>
          <DetailPane />
        </div>
      </div>
    </div>
  );
}

