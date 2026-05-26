'use client';

// app/(frost)/frost/canvas/dream/page.tsx
// Dream Ai — Aubade-Nocturne skin. All streaming logic unchanged.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { AUBADE, FF, FROST_COPY } from '../../../../../lib/frost/tokens';
import { streamBrideChat } from '../../../../../lib/frost-api/couple';

interface UIMsg {
  id: string; role: 'user' | 'assistant'; content: string; pending?: boolean; error?: boolean;
}
function uid() { return Math.random().toString(36).slice(2); }

const PROMPTS = [
  'How many days until my wedding?',
  "What's on my calendar this week?",
  "Who's in my Circle?",
  "What have I saved to Muse?",
  'How much have I spent so far?',
];

export default function CanvasDream() {
  const router = useRouter();
  const [messages, setMessages] = useState<UIMsg[]>([]);
  const [input,    setInput]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLTextAreaElement>(null);
  const cancelRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  useEffect(() => () => { cancelRef.current?.(); }, []);

  const send = useCallback(async (text: string) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages(prev => [...prev, { id: uid(), role: 'user', content: msg }]);
    setLoading(true);
    const aiId = uid();
    setMessages(prev => [...prev, { id: aiId, role: 'assistant', content: '', pending: true }]);
    const cancel = streamBrideChat(
      msg,
      (delta) => setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: m.content + delta, pending: false } : m)),
      () => { setMessages(prev => prev.map(m => m.id === aiId ? { ...m, pending: false } : m)); setLoading(false); cancelRef.current = null; },
      (err) => { console.error('[dream]', err); setMessages(prev => prev.map(m => m.id === aiId ? { ...m, content: 'I had trouble with that. Try again.', error: true, pending: false } : m)); setLoading(false); cancelRef.current = null; },
    );
    cancelRef.current = cancel;
  }, [loading]);

  return (
    <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(216,152,84,0.06) 0%, transparent 60%), linear-gradient(180deg, ${AUBADE.paper} 0%, ${AUBADE.paper2} 60%, ${AUBADE.paperDeep} 100%)`, display: 'flex', flexDirection: 'column', userSelect: 'none', WebkitUserSelect: 'none' }}>
      <style>{`@keyframes dreamPulse{0%,80%,100%{opacity:.35}40%{opacity:1}} @keyframes msgIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}`}</style>

      {/* Top bar */}
      <div style={{ paddingTop: 'calc(env(safe-area-inset-top,0px) + 14px)', paddingBottom: 14, paddingLeft: 22, paddingRight: 22, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.60)' }}>
        <button onClick={() => router.push('/frost/canvas/sanctuary')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8, fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.22em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>
          <span style={{ color: AUBADE.aubade }}>←</span> Sanctuary
        </button>
        <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 19, color: AUBADE.ink, fontFeatureSettings: '"opsz" 9' }}>Dream Ai</div>
        <button onClick={() => { cancelRef.current?.(); setMessages([]); setLoading(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.inkMute, padding: 0, WebkitTapHighlightColor: 'transparent' }}>Clear</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="frost-scroll" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: '28px 22px 16px' }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            <div>
              <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: AUBADE.ink, lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: 10, fontFeatureSettings: '"opsz" 9' }}>What do you want to know?</div>
              <div style={{ fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.6, fontFeatureSettings: '"opsz" 9' }}>I know your timeline, vendors, Muse board, and Circle.</div>
            </div>
            <div>
              <div style={{ fontFamily: FF.mono, fontSize: 9, fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: AUBADE.inkMute, marginBottom: 14 }}>Try asking</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)} style={{ textAlign: 'left', background: 'rgba(239,233,221,0.04)', border: `1px solid ${AUBADE.line}`, borderRadius: 2, padding: '14px 16px', fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: AUBADE.inkSoft, lineHeight: 1.4, cursor: 'pointer', fontFeatureSettings: '"opsz" 9', WebkitTapHighlightColor: 'transparent' }}>
                    {`"${p}"`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'msgIn 220ms cubic-bezier(0.22,1,0.36,1) forwards' }}>
                {m.role === 'user' ? (
                  <div style={{ maxWidth: '82%', background: 'rgba(216,152,84,0.18)', border: '1px solid rgba(216,152,84,0.35)', borderRadius: '16px 16px 3px 16px', padding: '12px 16px', fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: AUBADE.ink, lineHeight: 1.55, fontFeatureSettings: '"opsz" 9' }}>{m.content}</div>
                ) : m.pending && m.content === '' ? (
                  <div style={{ background: 'rgba(239,233,221,0.05)', border: `1px solid ${AUBADE.line}`, borderRadius: '16px 16px 16px 3px', padding: '12px 16px', fontFamily: FF.mono, fontSize: 10, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase', color: AUBADE.aubade, animation: 'dreamPulse 1.4s infinite ease-in-out' }}>✦ thinking</div>
                ) : (
                  <div style={{ maxWidth: '90%', background: 'rgba(239,233,221,0.05)', border: `1px solid ${AUBADE.line}`, borderRadius: '16px 16px 16px 3px', padding: '14px 16px', fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.65, color: m.error ? '#C46863' : AUBADE.ink, whiteSpace: 'pre-wrap', fontFeatureSettings: '"opsz" 9' }}>
                    {m.content}{m.pending && <span style={{ color: AUBADE.aubade, opacity: 0.7 }}>▌</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose bar */}
      <div style={{ padding: `12px 22px calc(12px + env(safe-area-inset-bottom,0px))`, borderTop: `1px solid ${AUBADE.line}`, flexShrink: 0, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', background: 'rgba(10,9,11,0.70)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(239,233,221,0.05)', border: `1px solid ${AUBADE.line}`, borderRadius: 3, padding: '10px 10px 10px 16px' }}>
          <textarea ref={textRef} value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} placeholder={FROST_COPY.dreamCanvas.inputPlaceholder} disabled={loading} rows={1} style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: AUBADE.ink, fontFamily: FF.aubade, fontStyle: 'italic', fontWeight: 300, fontSize: 16, resize: 'none', maxHeight: 120, lineHeight: 1.5, userSelect: 'text', WebkitUserSelect: 'text', caretColor: AUBADE.aubade, fontFeatureSettings: '"opsz" 9' } as React.CSSProperties} />
          <button onClick={() => send(input)} disabled={loading || !input.trim()} style={{ background: input.trim() && !loading ? AUBADE.aubade : 'rgba(239,233,221,0.08)', color: input.trim() && !loading ? '#0A090B' : AUBADE.inkMute, border: 'none', borderRadius: 2, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'default', transition: 'background 180ms ease', flexShrink: 0, WebkitTapHighlightColor: 'transparent' }}>
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
