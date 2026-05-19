'use client';

// app/(vendor)/vendor/dreamai/page.tsx
// DREAMAI — full conversation UI for the dream-os vendor agent.
//
// ARCHITECTURE NOTES (verified from src/api/vendor/chat.js):
//   1. There is ONE agent. PWA and WhatsApp share the same runAgenticTurn().
//   2. There is ONE conversation row per vendor (kind='vendor_self'). The agent
//      remembers across surfaces. Vendor types on WhatsApp → asks follow-up
//      here → agent remembers.
//   3. The contract's `history` field is ACCEPTED but IGNORED by the backend.
//      Engine reads message history from DB directly. We pass history for
//      contract compliance and so the screen has its own session-local memory
//      for UX (avoids a network call on every render).
//   4. tool_calls return as string[] (names only). We surface these as pills
//      so the vendor sees what the agent did. The full audit (input/result)
//      stays internal.
//   5. Cross-channel suppression: backend passes channel='web' into the engine,
//      so record_payment etc. don't fire duplicate WhatsApp confirmations.
//
// Data:
//   GET  /api/v2/vendor/context/:vendorId  — snapshot for the header
//   POST /api/v2/vendor/chat               — send turn

import { useEffect, useState, useRef, useCallback } from 'react';
import { Sparkles, Send, RefreshCw } from 'lucide-react';
import { fetchVendorContext, vendorChat } from '../../../../lib/frost-api/vendor';
import type {
  VendorContextResponse, ChatHistoryTurn,
} from '../../../../lib/types/vendor';
import { ApiClientError } from '../../../../lib/types/common';
import {
  COLORS, FONTS, RADIUS, BORDER_THIN, EASE,
  fmtINRShort,
} from '../../../../components/frost-vendor/tokens';
import { Shimmer, useVendorIdGuard } from '../../../../components/frost-vendor/atoms';

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  tool_calls?: string[];
  pending?: boolean;
  error?: boolean;
}

const SUGGESTED_PROMPTS = [
  "What's on for today?",
  "Who's overdue?",
  "Any new leads?",
  "What's the hot date situation?",
  "How much have I spent this month?",
];

const TOOL_LABELS: Record<string, string> = {
  list_invoices:        'Read invoices',
  list_leads:           'Read leads',
  list_events:          'Read calendar',
  list_expenses:        'Read expenses',
  query_day:            'Look at today',
  hot_dates_context:    'Check hot dates',
  fetch_lead_context:   'Pull lead context',
  calc_overdue:         'Tally overdue',
  create_invoice:       'Draft invoice',
  update_lead_state:    'Update lead state',
  record_payment:       'Record payment',
  create_expense:       'Log expense',
  create_event:         'Add to calendar',
  add_note:             'Note saved',
};

function labelForTool(name: string): string {
  return TOOL_LABELS[name] || name.replace(/_/g, ' ');
}

export default function VendorDreamAiPage() {
  const vendorId = useVendorIdGuard();
  const [context, setContext] = useState<VendorContextResponse | null>(null);
  const [contextErr, setContextErr] = useState<string | null>(null);
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // ── Load context on mount ──
  const loadContext = useCallback(async () => {
    if (!vendorId) return;
    setContextErr(null);
    try {
      const res = await fetchVendorContext(vendorId);
      setContext(res);
    } catch (e) {
      setContextErr(e instanceof ApiClientError ? e.message : 'Could not load context.');
    }
  }, [vendorId]);

  useEffect(() => { loadContext(); }, [loadContext]);

  // ── Auto-scroll on new message ──
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // ── Auto-resize textarea ──
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, [input]);

  if (!vendorId) return null;

  // ── Send turn ──
  const send = async (text: string) => {
    const message = text.trim();
    if (!message || sending) return;

    const userMsg: UIMessage = {
      id: 'u-' + Date.now(),
      role: 'user',
      content: message,
    };
    const pendingMsg: UIMessage = {
      id: 'a-' + Date.now(),
      role: 'assistant',
      content: '',
      pending: true,
    };

    setMessages(prev => [...prev, userMsg, pendingMsg]);
    setInput('');
    setSending(true);

    // Build history array for contract compliance (backend ignores it; engine reads DB).
    // We send the screen's local history so a "from scratch" session has some
    // continuity for the agent's first turn before DB reflects the new message.
    const history: ChatHistoryTurn[] = messages
      .filter(m => !m.pending && !m.error)
      .map(m => ({ role: m.role, content: m.content }));

    try {
      const res = await vendorChat({
        vendor_id: vendorId,
        message,
        history,
      });
      setMessages(prev => prev.map(m =>
        m.id === pendingMsg.id
          ? { ...m, content: res.reply, tool_calls: res.tool_calls, pending: false }
          : m,
      ));
    } catch (e) {
      const errMsg = e instanceof ApiClientError ? e.message : 'The agent didn’t respond.';
      setMessages(prev => prev.map(m =>
        m.id === pendingMsg.id
          ? { ...m, content: errMsg, pending: false, error: true }
          : m,
      ));
    } finally {
      setSending(false);
    }
  };

  const reset = () => {
    setMessages([]);
    setInput('');
  };

  const hasMessages = messages.length > 0;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column',
      height: 'calc(100dvh - 56px)',
      background: COLORS.dark,
    }}>
      {/* ── Header strip ── */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '0.5px solid rgba(255,255,255,0.06)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Sparkles size={14} strokeWidth={1.5} color={COLORS.gold} />
          <span style={{
            fontFamily: FONTS.jost, fontSize: 10, fontWeight: 300,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: COLORS.gold,
          }}>✦ AI</span>
          <span style={{
            fontFamily: FONTS.jost, fontSize: 8, letterSpacing: '0.15em',
            color: 'rgba(248,247,245,0.4)', textTransform: 'uppercase',
          }}>· One mind, two surfaces</span>
        </div>
        {hasMessages && (
          <button onClick={reset} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'rgba(248,247,245,0.5)', display: 'flex', alignItems: 'center', gap: 4,
            fontFamily: FONTS.jost, fontSize: 9, letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            <RefreshCw size={11} strokeWidth={1.5} /> Reset view
          </button>
        )}
      </div>

      {/* ── Scrollable conversation area ── */}
      <div ref={scrollRef} style={{
        flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch',
        padding: '20px',
      }}>
        {!hasMessages ? (
          <EmptyChatState
            context={context}
            contextErr={contextErr}
            onPickPrompt={p => send(p)}
          />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {messages.map(m => <React.Fragment key={m.id}><ChatBubble message={m} /></React.Fragment>)}
          </div>
        )}
      </div>

      {/* ── Input bar ── */}
      <div style={{
        padding: '12px 16px calc(12px + env(safe-area-inset-bottom))',
        background: COLORS.dark,
        borderTop: '0.5px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.05)',
          border: '0.5px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: '8px 10px 8px 14px',
        }}>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask the agent…"
            disabled={sending}
            rows={1}
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: COLORS.bg, fontFamily: FONTS.dm300, fontSize: 14, fontWeight: 300,
              resize: 'none', maxHeight: 120, lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => send(input)}
            disabled={sending || !input.trim()}
            style={{
              background: input.trim() ? COLORS.gold : 'rgba(255,255,255,0.1)',
              color: input.trim() ? COLORS.ink : 'rgba(248,247,245,0.4)',
              border: 'none', borderRadius: '50%',
              width: 32, height: 32,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: input.trim() && !sending ? 'pointer' : 'default',
              transition: `background 180ms ${EASE}`,
            }}
            aria-label="Send"
          >
            <Send size={14} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Empty state ────────────────────────────────────────────────────────────
function EmptyChatState({
  context, contextErr, onPickPrompt,
}: {
  context: VendorContextResponse | null;
  contextErr: string | null;
  onPickPrompt: (p: string) => void;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <div style={{
          fontFamily: FONTS.cg300, fontSize: 28, color: COLORS.bg,
          lineHeight: 1.3, fontStyle: 'italic',
        }}>
          What do you want to know?
        </div>
        <div style={{
          fontFamily: FONTS.dm300, fontSize: 13, color: 'rgba(248,247,245,0.5)',
          marginTop: 8, lineHeight: 1.6,
        }}>
          I have your full picture — leads, invoices, calendar, notes. I remember our WhatsApp conversations too.
        </div>
      </div>

      {/* Context snapshot */}
      {context && (
        <div style={{
          background: 'rgba(255,255,255,0.04)',
          border: '0.5px solid rgba(255,255,255,0.08)',
          borderRadius: RADIUS.md,
          padding: 16,
        }}>
          <div style={{
            fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
            letterSpacing: '0.25em', textTransform: 'uppercase',
            color: 'rgba(201,168,76,0.7)', marginBottom: 12,
          }}>Current snapshot</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <SnapRow label="Pending invoices" value={context.pending_invoices.length} />
            <SnapRow label="Upcoming events"  value={context.upcoming_events.length} />
            <SnapRow label="New leads"        value={context.new_leads.length} />
            <SnapRow label="Recent notes"     value={context.recent_notes.length} />
          </div>
        </div>
      )}
      {contextErr && (
        <div style={{
          fontFamily: FONTS.dm300, fontSize: 12,
          color: 'rgba(248,247,245,0.4)',
        }}>{contextErr}</div>
      )}
      {!context && !contextErr && <Shimmer height={120} />}

      {/* Suggested prompts */}
      <div>
        <div style={{
          fontFamily: FONTS.jost, fontSize: 9, fontWeight: 300,
          letterSpacing: '0.25em', textTransform: 'uppercase',
          color: 'rgba(248,247,245,0.4)', marginBottom: 12,
        }}>Try asking</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {SUGGESTED_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => onPickPrompt(p)}
              style={{
                textAlign: 'left',
                background: 'rgba(255,255,255,0.04)',
                border: '0.5px solid rgba(255,255,255,0.08)',
                borderRadius: RADIUS.md,
                padding: '12px 14px',
                fontFamily: FONTS.cg300, fontSize: 15, fontStyle: 'italic',
                color: COLORS.bg, cursor: 'pointer',
                transition: `background 180ms ${EASE}`,
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.07)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.04)'; }}
            >{`"${p}"`}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SnapRow({ label, value }: { label: string; value: number | string }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      fontFamily: FONTS.dm300, fontSize: 13, color: 'rgba(248,247,245,0.7)',
    }}>
      <span>{label}</span>
      <span style={{ fontFamily: FONTS.cg300, fontSize: 18, color: COLORS.bg }}>{value}</span>
    </div>
  );
}

// ─── Chat bubble ────────────────────────────────────────────────────────────
function ChatBubble({ message: m }: { message: UIMessage }) {
  const isUser = m.role === 'user';

  if (isUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{
          maxWidth: '85%',
          background: COLORS.gold, color: COLORS.ink,
          padding: '10px 14px', borderRadius: '20px 20px 4px 20px',
          fontFamily: FONTS.dm300, fontSize: 14, lineHeight: 1.5, fontWeight: 400,
        }}>{m.content}</div>
      </div>
    );
  }

  if (m.pending) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <div style={{
          padding: '10px 14px', borderRadius: '20px 20px 20px 4px',
          background: 'rgba(255,255,255,0.05)',
          fontFamily: FONTS.dm300, fontSize: 13,
          color: 'rgba(248,247,245,0.6)',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          <span className="fv-thinking">✦ thinking</span>
          <style>{`
            @keyframes fvPulse { 0%,80%,100%{opacity:0.4} 40%{opacity:1} }
            .fv-thinking { animation: fvPulse 1.4s infinite ease-in-out; }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
      <div style={{ maxWidth: '90%' }}>
        <div style={{
          background: m.error ? 'rgba(184,69,62,0.15)' : 'rgba(255,255,255,0.05)',
          color: m.error ? '#F4B3AF' : COLORS.bg,
          padding: '10px 14px', borderRadius: '20px 20px 20px 4px',
          fontFamily: FONTS.dm300, fontSize: 14, lineHeight: 1.6,
          whiteSpace: 'pre-wrap',
        }}>{m.content}</div>

        {m.tool_calls && m.tool_calls.length > 0 && (
          <div style={{
            marginTop: 8, display: 'flex', flexWrap: 'wrap', gap: 6,
            paddingLeft: 4,
          }}>
            {m.tool_calls.map((tc, i) => (
              <span key={tc + i} style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontFamily: FONTS.jost, fontSize: 8, fontWeight: 400,
                letterSpacing: '0.15em', textTransform: 'uppercase',
                color: 'rgba(201,168,76,0.8)',
                background: 'rgba(201,168,76,0.08)',
                border: '0.5px solid rgba(201,168,76,0.2)',
                padding: '3px 8px', borderRadius: RADIUS.pill,
              }}>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: COLORS.gold }} />
                {labelForTool(tc)}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
