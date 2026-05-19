'use client';

// app/(bride)/couple/dreamai/page.tsx
// BRIDE DREAMAI — full conversation UI.
//
// Architecture (from src/agent/brideEngine.js, 2134 lines):
//   - Separate brideEngine, brideTools, brideSystemPrompt from vendor engine
//   - Same conversation-per-couple pattern (kind='couple_self')
//   - Response: { ok, reply } only — brideEngine does NOT expose tool_calls
//     The agent acts silently; the reply describes what it did in natural language
//   - history field accepted but backend reads from DB (same as vendor engine)
//
// Data: POST /api/v2/couple/chat

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import { coupleChat, fetchCoupleToday } from '../../../../lib/frost-api/couple';
import type { CoupleTodayResponse } from '../../../../lib/types/bride';
import { ApiClientError } from '../../../../lib/types/common';
import { COLORS, FONTS, RADIUS, EASE } from '../../../../components/frost-bride/tokens';
import { Shimmer, useCoupleIdGuard, getCoupleSession } from '../../../../components/frost-bride/atoms';

interface UIMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  pending?: boolean;
  error?: boolean;
}

const PROMPTS = [
  "How many days until my wedding?",
  "What's on my calendar this week?",
  "Who's in my Circle?",
  "How much have I spent so far?",
  "What have I saved to Muse?",
];

export default function BrideDreamAiPage() {
  const coupleId = useCoupleIdGuard();
  const [today, setToday] = useState<CoupleTodayResponse | null>(null);
  const [messages, setMessages] = useState<UIMsg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!coupleId) return;
    fetchCoupleToday(coupleId).then(setToday).catch(() => {});
  }, [coupleId]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!textRef.current) return;
    textRef.current.style.height = 'auto';
    textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
  }, [input]);

  if (!coupleId) return null;

  const send = async (text: string) => {
    const message = text.trim();
    if (!message || sending) return;

    const userMsg: UIMsg = { id: 'u-' + Date.now(), role: 'user', content: message };
    const pending: UIMsg = { id: 'a-' + Date.now(), role: 'assistant', content: '', pending: true };
    setMessages(prev => [...prev, userMsg, pending]);
    setInput('');
    setSending(true);

    const history = messages
      .filter(m => !m.pending && !m.error)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await coupleChat({ couple_id: coupleId, message, history });
      setMessages(prev => prev.map(m =>
        m.id === pending.id ? { ...m, content: res.reply, pending: false } : m,
      ));
    } catch (e) {
      const errMsg = e instanceof ApiClientError ? e.message : 'The agent didn\'t respond.';
      setMessages(prev => prev.map(m =>
        m.id === pending.id ? { ...m, content: errMsg, pending: false, error: true } : m,
      ));
    } finally { setSending(false); }
  };

  const session = getCoupleSession();
  const coupleName = session?.name || 'Dreamer';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100dvh - 56px)', background: COLORS.dark }}>

      {/* Header */}
      <div style={{ padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} strokeWidth={1.5} color={COLORS.gold} />
          <span style={{ fontFamily: FONTS.jost, fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: COLORS.gold }}>✦ AI</span>
          <span style={{ fontFamily: FONTS.jost, fontSize: 8, letterSpacing: '0.12em', color: 'rgba(248,247,245,0.35)', textTransform: 'uppercase' }}>· Your wedding companion</span>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(248,247,245,0.4)', display: 'flex', alignItems: 'center', gap: 4, fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            <RefreshCw size={11} strokeWidth={1.5} /> Reset
          </button>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch', padding: 20 }}>
        {messages.length === 0 ? (
          <EmptyState context={today} name={coupleName} onPrompt={send} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(m => <Bubble key={m.id} msg={m} />)}
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{ padding: '12px 16px calc(12px + env(safe-area-inset-bottom))', background: COLORS.dark, borderTop: '0.5px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: 20, padding: '8px 10px 8px 14px' }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Ask anything about your wedding…"
            disabled={sending}
            rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: COLORS.bg, fontFamily: FONTS.dm300, fontSize: 14, resize: 'none', maxHeight: 120, lineHeight: 1.5 }}
          />
          <button
            onClick={() => send(input)}
            disabled={sending || !input.trim()}
            style={{ background: input.trim() ? COLORS.gold : 'rgba(255,255,255,0.1)', color: input.trim() ? COLORS.ink : 'rgba(248,247,245,0.4)', border: 'none', borderRadius: '50%', width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() && !sending ? 'pointer' : 'default', transition: `background 180ms ${EASE}` }}
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState({ context, name, onPrompt }: { context: CoupleTodayResponse | null; name: string; onPrompt: (p: string) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{ fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.bg, lineHeight: 1.3, fontStyle: 'italic' }}>
          What do you want to know, {name}?
        </div>
        <div style={{ fontFamily: FONTS.dm300, fontSize: 13, color: 'rgba(248,247,245,0.5)', marginTop: 8, lineHeight: 1.6 }}>
          I know your timeline, your vendors, your Muse board, and your Circle.
        </div>
      </div>

      {context && (
        <div style={{ background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: RADIUS.md, padding: 16 }}>
          <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', marginBottom: 12 }}>Right now</div>
          {[
            { label: 'Days to wedding', value: context.couple.days_to_wedding ?? '—' },
            { label: 'Upcoming events',  value: context.upcoming_events.length },
            { label: 'Vendors booked',   value: context.bookings_count },
            { label: 'Muse saves',       value: context.muse_count },
          ].map(r => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: FONTS.dm300, fontSize: 13, color: 'rgba(248,247,245,0.7)', marginBottom: 6 }}>
              <span>{r.label}</span>
              <span style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.bg }}>{String(r.value)}</span>
            </div>
          ))}
        </div>
      )}
      {!context && <Shimmer height={120} />}

      <div>
        <div style={{ fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.35)', marginBottom: 12 }}>Try asking</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PROMPTS.map(p => (
            <button key={p} onClick={() => onPrompt(p)} style={{ textAlign: 'left', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', borderRadius: RADIUS.md, padding: '12px 14px', fontFamily: FONTS.cg300, fontSize: 15, fontStyle: 'italic', color: COLORS.bg, cursor: 'pointer' }}>
              {`"${p}"`}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function Bubble({ msg: m }: { msg: UIMsg }) {
  if (m.role === 'user') {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ maxWidth: '85%', background: COLORS.gold, color: COLORS.ink, padding: '10px 14px', borderRadius: '20px 20px 4px 20px', fontFamily: FONTS.dm300, fontSize: 14, lineHeight: 1.5 }}>{m.content}</div>
      </div>
    );
  }
  if (m.pending) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{ padding: '10px 14px', borderRadius: '20px 20px 20px 4px', background: 'rgba(255,255,255,0.05)', fontFamily: FONTS.dm300, fontSize: 13, color: 'rgba(248,247,245,0.6)' }}>
          <span style={{ animation: 'fbPulse 1.4s infinite ease-in-out' }}>✦ thinking</span>
          <style>{`@keyframes fbPulse{0%,80%,100%{opacity:.4}40%{opacity:1}}`}</style>
        </div>
      </div>
    );
  }
  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: '90%', background: m.error ? 'rgba(184,69,62,0.15)' : 'rgba(255,255,255,0.05)', color: m.error ? '#F4B3AF' : COLORS.bg, padding: '10px 14px', borderRadius: '20px 20px 20px 4px', fontFamily: FONTS.dm300, fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
        {m.content}
      </div>
    </div>
  );
}
