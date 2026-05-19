'use client';

// app/(frost)/canvas/dream/page.tsx
// Dream canvas — full DreamAi conversation thread.
// Dark background (mode.dreamGradient). Frosted compose bar.
// brideEngine: { ok, reply } only — no tool_calls surface.
// Ported from tdw-2/app/(frost)/canvas/dream.tsx

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useFrostMode } from '../../../layout';
import { FROST_SURFACE, FF, SP, FR, FROST_COPY, EASE, getCoupleIdForFrost } from '../../../../../lib/frost/tokens';

interface UIMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
}

const PROMPTS = [
  'How many days until my wedding?',
  'What\'s on my calendar this week?',
  'Who\'s in my Circle?',
  'What have I saved to Muse?',
  'How much have I spent so far?',
];

// Mock reply for demo
function mockReply(msg: string): string {
  const m = msg.toLowerCase();
  if (/days|countdown|wedding/.test(m)) return '4 days to your wedding, Priya. The 19th of November at ITC Maurya. Pheras at 10 PM.';
  if (/calendar|events|schedule/.test(m)) return 'This week: lehenga fitting tomorrow at 2 PM, Mehndi on the 17th, Sangeet on the 18th, and the wedding on the 19th.';
  if (/circle|people/.test(m)) return 'Your Circle has 4 members: Ananya (sister), your mom, Riya (best friend), and Rohan\'s mom. Ananya was active this morning.';
  if (/muse|saved|inspiration/.test(m)) return 'You have 47 saves across all ceremonies. Most are for the reception (12 looks) and the wedding (9 looks).';
  if (/spent|money|budget|expenses/.test(m)) return 'Total committed: ₹28,00,000. Paid so far: ₹13,50,000. Largest pending: Shivam Caterers (₹4,50,000 balance).';
  return 'I have your full picture — timeline, vendors, Muse board, Circle. Ask me anything.';
}

export default function CanvasDream() {
  const router = useRouter();
  const { mode } = useFrostMode();
  const [messages, setMessages] = useState<UIMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  const send = async (text: string) => {
    const msg = text.trim();
    if (!msg || sending) return;
    const userMsg: UIMsg = { id: 'u-' + Date.now(), role: 'user', content: msg };
    const pending: UIMsg = { id: 'a-' + Date.now(), role: 'assistant', content: '', pending: true };
    setMessages(prev => [...prev, userMsg, pending]);
    setInput('');
    setSending(true);
    await new Promise(r => setTimeout(r, 900));
    setMessages(prev => prev.map(m => m.id === pending.id ? { ...m, content: mockReply(msg), pending: false } : m));
    setSending(false);
  };

  const bg = `linear-gradient(to bottom, ${mode.dreamGradient[0]}, ${mode.dreamGradient[1]})`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column' }}>
      {/* Top bar */}
      <div style={{
        ...FROST_SURFACE.composer,
        paddingTop: 'calc(env(safe-area-inset-top,0px) + 12px)',
        paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={() => router.push('/frost')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode.brassMuted, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dream
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: FF.label, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: mode.brass }}>✦ AI</div>
        <button onClick={() => setMessages([])} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: mode.brassMuted, padding: 0 }}>Clear</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: `${SP.xl}px ${SP.xl}px` }}>
        {messages.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: SP.xl }}>
            <div>
              <div style={{ fontFamily: FF.display, fontStyle: 'italic', fontSize: 26, color: mode.ink, lineHeight: 1.3 }}>What do you want to know?</div>
              <div style={{ fontFamily: FF.body, fontSize: 13, color: mode.soft, marginTop: 8, lineHeight: 1.6 }}>I know your timeline, vendors, Muse board, and Circle.</div>
            </div>
            <div>
              <div style={{ fontFamily: FF.label, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: mode.brassMuted, marginBottom: 10 }}>Try asking</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {PROMPTS.map(p => (
                  <button key={p} onClick={() => send(p)} style={{ textAlign: 'left', ...FROST_SURFACE.button, border: `0.5px solid ${mode.hairline}`, borderRadius: FR.md, padding: '12px 14px', fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.ink, cursor: 'pointer', background: FROST_SURFACE.button.background }}>
                    {`"${p}"`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(m => (
              <div key={m.id} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                {m.role === 'user' ? (
                  <div style={{ maxWidth: '85%', background: mode.brass, color: '#1B1612', padding: '10px 14px', borderRadius: '20px 20px 4px 20px', fontFamily: FF.body, fontSize: 14, lineHeight: 1.5 }}>{m.content}</div>
                ) : m.pending ? (
                  <div style={{ ...FROST_SURFACE.button, padding: '10px 14px', borderRadius: '20px 20px 20px 4px', fontFamily: FF.body, fontSize: 13, color: mode.soft }}>
                    <span style={{ animation: 'fbPulse 1.4s infinite ease-in-out' }}>✦ thinking</span>
                    <style>{`@keyframes fbPulse{0%,80%,100%{opacity:.4}40%{opacity:1}}`}</style>
                  </div>
                ) : (
                  <div style={{ maxWidth: '90%', ...FROST_SURFACE.button, padding: '10px 14px', borderRadius: '20px 20px 20px 4px', fontFamily: FF.body, fontSize: 14, lineHeight: 1.6, color: mode.ink, whiteSpace: 'pre-wrap', background: FROST_SURFACE.button.background }}>
                    {m.content}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Compose bar */}
      <div style={{ padding: `12px 16px calc(12px + env(safe-area-inset-bottom,0px))`, ...FROST_SURFACE.composer, borderTop: `0.5px solid ${mode.hairlineStrong}`, flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', ...FROST_SURFACE.button, borderRadius: 20, padding: '8px 10px 8px 14px', background: FROST_SURFACE.button.background }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={FROST_COPY.dreamCanvas.inputPlaceholder}
            disabled={sending}
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: mode.ink, fontFamily: FF.body, fontSize: 14, resize: 'none', maxHeight: 120, lineHeight: 1.5 }}
          />
          <button
            onClick={() => send(input)}
            disabled={sending || !input.trim()}
            style={{ background: input.trim() ? mode.brass : 'rgba(255,255,255,0.1)', color: input.trim() ? '#1B1612' : mode.soft, border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !sending ? 'pointer' : 'default', transition: `background 180ms ${EASE}` }}
          ><Send size={14} strokeWidth={1.5} /></button>
        </div>
      </div>
    </div>
  );
}
