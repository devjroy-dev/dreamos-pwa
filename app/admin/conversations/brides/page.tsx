'use client';
import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, Toast, BottomSheet } from '../../_components/AdminUI';
import { getBrideThreads, getMessages, type ConversationThread, type Message } from '../../../../lib/admin-api/index';

function timeAgo(d: string) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000); const h = Math.floor(diff / 3600000); const dd = Math.floor(diff / 86400000);
  if (m < 1) return 'just now'; if (m < 60) return `${m}m ago`; if (h < 24) return `${h}h ago`; return `${dd}d ago`;
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBride = msg.sent_by === 'couple' || msg.direction === 'inbound';
  if (msg.sent_by === 'system') return (
    <div style={{ textAlign: 'center', padding: '4px 0' }}>
      <span style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.1em' }}>{msg.body}</span>
    </div>
  );
  return (
    <div style={{ display: 'flex', justifyContent: isBride ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{ maxWidth: '80%', background: isBride ? 'rgba(245,240,232,0.12)' : 'rgba(201,168,76,0.08)', border: `0.5px solid ${isBride ? 'rgba(245,240,232,0.15)' : T.borderStrong}`, borderRadius: isBride ? '16px 4px 16px 16px' : '4px 16px 16px 16px', padding: '10px 14px' }}>
        <div style={{ fontFamily: T.ff.body, fontSize: 13, fontWeight: 300, color: T.ink, lineHeight: 1.5, whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.body}</div>
        <div style={{ fontFamily: T.ff.label, fontSize: 7, color: T.muted, marginTop: 4, letterSpacing: '0.1em', textAlign: 'right' as const }}>{msg.channel} · {timeAgo(msg.created_at)}</div>
      </div>
    </div>
  );
}

export default function BrideConversationsPage() {
  const [threads, setThreads]   = useState<ConversationThread[]>([]);
  const [loading, setLoading]   = useState(true);
  const [selected, setSelected] = useState<ConversationThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [toast, setToast]       = useState('');

  const load = useCallback(() => {
    setLoading(true);
    getBrideThreads().then(d => { setThreads(d.threads); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const openThread = async (thread: ConversationThread) => {
    setSelected(thread); setMessages([]); setLoadingMsgs(true);
    try { const d = await getMessages(thread.id); setMessages(d.messages); }
    catch { setToast('Failed to load messages.'); }
    finally { setLoadingMsgs(false); }
  };

  return (
    <div>
      <PageHeader title="Bride Chats" sub="Bride conversations with DreamAi" />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
          {[1,2,3,4].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 68 }} />)}
        </div>
      ) : threads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>No conversations yet</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
          {threads.map(t => (
            <div key={t.id} onClick={() => openThread(t)} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', minHeight: 68 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(245,240,232,0.06)', border: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 14, color: T.ink }}>{(t.bride_name || 'B')[0]}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.bride_name}</div>
                <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em' }}>{t.wedding_city || 'City TBD'}{t.wedding_date ? ` · ${new Date(t.wedding_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}` : ''}</div>
              </div>
              <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, flexShrink: 0 }}>{timeAgo(t.last_message_at)}</div>
            </div>
          ))}
        </div>
      )}

      <BottomSheet visible={!!selected} onClose={() => setSelected(null)} title={selected?.bride_name || 'Conversation'}>
        <div style={{ marginBottom: 20 }}>
          {loadingMsgs ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }} className="shimmer">
              <span style={{ fontFamily: T.ff.label, fontSize: 9, color: T.muted, letterSpacing: '0.15em' }}>Loading…</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column' as const, maxHeight: '55vh', overflowY: 'auto', paddingBottom: 8 }}>
              {messages.map(m => <MessageBubble key={m.id} msg={m} />)}
            </div>
          )}
        </div>
      </BottomSheet>

      {toast && <Toast msg={toast} onDone={() => setToast('')} error />}
    </div>
  );
}
