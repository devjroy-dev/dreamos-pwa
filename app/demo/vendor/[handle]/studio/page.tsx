'use client';
// app/demo/vendor/[handle]/studio/page.tsx
// Demo vendor DreamAi studio. Real AI. Real streaming. NO auth. NO session.

export const dynamic = 'force-dynamic';

import { useParams } from 'next/navigation';
import { useRef, useState } from 'react';
import { DemoHeader } from '@/components/demo/DemoHeader';
import { DemoNav }    from '@/components/demo/DemoNav';
import { useDemoChat } from '@/hooks/demo/useDemoChat';
import { useDemoVendor } from '@/hooks/demo/useDemoData';

const T = {
  bg: '#0C0A09', ink: '#F0E6D2', soft: 'rgba(240,230,210,0.60)',
  mute: 'rgba(240,230,210,0.35)', gold: '#C9A84C', border: 'rgba(240,230,210,0.08)',
  userBg: 'rgba(201,168,76,0.10)', aiBg: 'rgba(240,230,210,0.05)',
  ff: { body: "'DM Sans', sans-serif", label: "'Jost', sans-serif", display: "'Cormorant Garamond', serif" },
};

const PROMPTS = [
  'Who are my new leads?',
  'How should I respond to a price negotiation?',
  'What can TDW do for my business?',
  'Which lead should I follow up with first?',
];

export default function DemoStudioPage() {
  const params  = useParams();
  const handle  = typeof params.handle === 'string' ? params.handle : '';
  const { vendor } = useDemoVendor(handle);
  const { messages, loading, send } = useDemoChat({ handle });
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  function handleSend() {
    const t = input.trim();
    if (!t || loading) return;
    setInput('');
    send(t);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  return (
    <div style={{ minHeight: '100dvh', background: T.bg, color: T.ink, display: 'flex', flexDirection: 'column' }}>
      <DemoHeader vendorName={vendor?.display_name || null} handle={handle} />

      {/* DreamAi label strip */}
      <div style={{ position: 'fixed', top: 56, left: 0, right: 0, zIndex: 40, padding: '10px 20px', background: T.bg, borderBottom: `0.5px solid ${T.border}`, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.22em', color: T.gold, textTransform: 'uppercase' }}>DreamAi</span>
        <span style={{ fontFamily: T.ff.label, fontSize: 9, color: T.mute }}>· your wedding business AI</span>
      </div>

      {/* Chat thread */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '124px 20px 148px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        {messages.map(m => (
          <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '82%', background: m.role === 'user' ? T.userBg : T.aiBg, border: `0.5px solid ${m.role === 'user' ? 'rgba(201,168,76,0.2)' : T.border}`, borderRadius: m.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '12px 16px' }}>
              <p style={{ fontFamily: T.ff.body, fontSize: 14, lineHeight: 1.6, color: m.role === 'user' ? T.gold : T.ink, margin: 0 }}>
                {m.text || (m.streaming ? '…' : '')}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Suggested prompts — only on first load */}
      {messages.length === 1 && (
        <div style={{ position: 'fixed', bottom: 132, left: 0, right: 0, padding: '0 16px', display: 'flex', gap: 8, overflowX: 'auto' }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => setInput(p)} style={{ flexShrink: 0, background: 'rgba(201,168,76,0.08)', border: '0.5px solid rgba(201,168,76,0.25)', borderRadius: 20, padding: '7px 14px', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.12em', color: T.gold, cursor: 'pointer', whiteSpace: 'nowrap', textTransform: 'uppercase' }}>
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input bar */}
      <div style={{ position: 'fixed', bottom: 64, left: 0, right: 0, padding: '12px 16px', background: T.bg, borderTop: `0.5px solid ${T.border}`, display: 'flex', gap: 10, alignItems: 'flex-end' }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          placeholder="Ask DreamAi anything…"
          rows={1}
          style={{ flex: 1, background: 'rgba(240,230,210,0.05)', border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '10px 14px', fontFamily: T.ff.body, fontSize: 14, color: T.ink, resize: 'none', outline: 'none', minHeight: 44 }}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{ width: 44, height: 44, borderRadius: 12, background: (!input.trim() || loading) ? 'rgba(201,168,76,0.15)' : T.gold, border: 'none', cursor: (!input.trim() || loading) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
        >
          <span style={{ fontSize: 16, color: (!input.trim() || loading) ? T.mute : '#0C0A09' }}>↑</span>
        </button>
      </div>

      <DemoNav handle={handle} />
    </div>
  );
}
