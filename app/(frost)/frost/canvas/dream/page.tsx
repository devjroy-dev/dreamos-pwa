'use client';

// app/(frost)/frost/canvas/dream/page.tsx
// Dream canvas — full DreamAi conversation thread wired to brideEngine via SSE.
// Full-bleed page. Dark gradient background. Frosted compose bar.
// B-6: replaces mockReply with real streamBrideChat.

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import { useFrostMode } from '../../../layout';
import { FROST_SURFACE, FF, SP, FR, FROST_COPY, EASE } from '../../../../../lib/frost/tokens';
import { streamBrideChat } from '../../../../../lib/frost-api/couple';

interface UIMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
}

function uid() { return Math.random().toString(36).slice(2); }

const PROMPTS = [
  'How many days until my wedding?',
  'What\'s on my calendar this week?',
  'Who\'s in my Circle?',
  'What have I saved to Muse?',
  'How much have I spent so far?',
];

export default function CanvasDream() {
  const router = useRouter();
  const { mode } = useFrostMode();
  const [messages, setMessages] = useState<UIMsg[]>([]);
  const [input, setInput]       = useState('');
  const [loading, setLoading]   = useState(false);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLTextAreaElement>(null);
  const cancelRef  = useRef<(() => void) | null>(null);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  // Cancel in-flight stream on unmount
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
      // onDelta — append each word chunk
      (delta) => {
        setMessages(prev => prev.map(m =>
          m.id === aiId
            ? { ...m, content: m.content + delta, pending: false }
            : m
        ));
      },
      // onDone
      () => {
        setMessages(prev => prev.map(m =>
          m.id === aiId ? { ...m, pending: false } : m
        ));
        setLoading(false);
        cancelRef.current = null;
      },
      // onError
      (err) => {
        console.error('[dream canvas] stream error:', err);
        setMessages(prev => prev.map(m =>
          m.id === aiId
            ? { ...m, content: 'I had trouble with that. Try again.', error: true, pending: false }
            : m
        ));
        setLoading(false);
        cancelRef.current = null;
      },
    );

    cancelRef.current = cancel;
  }, [loading]);

  const bg = `linear-gradient(to bottom, ${mode.dreamGradient[0]}, ${mode.dreamGradient[1]})`;

  return (
    <div style={{ position: 'fixed', inset: 0, background: bg, display: 'flex', flexDirection: 'column', userSelect: 'none' }}>

      {/* Top bar */}
      <div style={{
        ...FROST_SURFACE.composer,
        paddingTop: 'calc(env(safe-area-inset-top,0px) + 12px)',
        paddingBottom: 12, paddingLeft: 16, paddingRight: 16,
        display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0,
      }}>
        <button onClick={() => router.push('/frost/canvas/sanctuary')} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: FF.label, fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: mode.brassMuted, padding: 0 }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Dream
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontFamily: FF.label, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: mode.brass }}>✦ AI</div>
        <button onClick={() => { cancelRef.current?.(); setMessages([]); setLoading(false); }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: FF.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: mode.brassMuted, padding: 0 }}>Clear</button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="frost-scroll" style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: `${SP.xl}px ${SP.xl}px` }}>
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
                  <button key={p} onClick={() => send(p)}
                    style={{ textAlign: 'left', ...FROST_SURFACE.button, border: `0.5px solid ${mode.hairline}`, borderRadius: FR.md, padding: '12px 14px', fontFamily: FF.display, fontStyle: 'italic', fontSize: 14, color: mode.ink, cursor: 'pointer', background: FROST_SURFACE.button.background }}>
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
                  <div style={{ maxWidth: '85%', background: mode.brass, color: '#1B1612', padding: '10px 14px', borderRadius: '20px 20px 4px 20px', fontFamily: FF.body, fontSize: 14, lineHeight: 1.5 }}>
                    {m.content}
                  </div>
                ) : m.pending && m.content === '' ? (
                  <div style={{ ...FROST_SURFACE.button, padding: '10px 14px', borderRadius: '20px 20px 20px 4px', fontFamily: FF.body, fontSize: 13, color: mode.soft, background: FROST_SURFACE.button.background }}>
                    <span style={{ animation: 'fbPulse 1.4s infinite ease-in-out' }}>✦ thinking</span>
                    <style>{`@keyframes fbPulse{0%,80%,100%{opacity:.4}40%{opacity:1}}`}</style>
                  </div>
                ) : (
                  <div style={{ maxWidth: '90%', ...FROST_SURFACE.button, padding: '10px 14px', borderRadius: '20px 20px 20px 4px', fontFamily: FF.body, fontSize: 14, lineHeight: 1.6, color: m.error ? '#B8453E' : mode.ink, whiteSpace: 'pre-wrap', background: FROST_SURFACE.button.background }}>
                    {m.content}
                    {m.pending && <span style={{ opacity: 0.5 }}>▌</span>}
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
            disabled={loading}
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: mode.ink, fontFamily: FF.body, fontSize: 14, resize: 'none', maxHeight: 120, lineHeight: 1.5, userSelect: 'text' }}
          />
          <button
            onClick={() => send(input)}
            disabled={loading || !input.trim()}
            style={{ background: input.trim() && !loading ? mode.brass : 'rgba(255,255,255,0.1)', color: input.trim() && !loading ? '#1B1612' : mode.soft, border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !loading ? 'pointer' : 'default', transition: `background 180ms ${EASE}`, flexShrink: 0 }}
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
