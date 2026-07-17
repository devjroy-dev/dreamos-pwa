'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchContext, fetchChatHistory, streamChat, startFreshThread, type StreamBeat } from '@/lib/vendor/api/vendor';
import { getVendorSession } from '@/lib/vendor/session';
import type { VendorContextResponse } from '@/lib/vendor/types/vendor';
import type { ClarifyPayload, ContactCard } from '@/lib/vendor/types/vendor';
import type { SuggestionsPayload } from '@/lib/vendor/api/vendor';

export type ChatMessageRole = 'user' | 'ai';

export interface ChatMessage {
  id:         string;
  role:       ChatMessageRole;
  text:       string;
  toolCalls?: string[];
  contact?:   ContactCard;
  clarify?:   ClarifyPayload;  // when set, render options as inline chips
  suggestions?: SuggestionsPayload;  // 3.0-C2: optional next-step cards under a completed action
  streaming?: boolean;         // true while SSE stream is in progress
  deliberation?: StreamBeat[]; // 5-B: the operator's work beneath Myra's reply
  divider?: boolean;           // TDW_06 D-7: a fresh-thread seam — rendered as a
                               // rule line, never a bubble. The scrollback above
                               // it STAYS ON SCREEN; that is the rider's visible
                               // truth, not a caption claim.
}

export interface BackendHistoryMessage { role: 'user' | 'assistant'; content: string; }

function nextId() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

interface UseChatArgs { vendorId: string; }
interface UseChatReturn {
  meta: { tier: string; turns_used: number; turns_cap: number; state: 'ok' | 'nearing' | 'capped'; upgrade?: { label: string; href: string } } | null; // TDW_02 P5
  messages:        ChatMessage[];
  loading:         boolean;
  context:         VendorContextResponse | null;
  send:            (text: string, displayText?: string) => void;
  injectAiMessage: (text: string) => void;
  lastToolCalls:   string[];
  // TDW_06 D-7: close the active thread cleanly (server abandons; never deletes)
  // and mark the seam in the on-screen scrollback. Resolves true when the
  // endpoint answered ok (including the idempotent nothing-active case).
  freshThread:     () => Promise<boolean>;
}

export function useChat({ vendorId }: UseChatArgs): UseChatReturn {
  const [messages,      setMessages]      = useState<ChatMessage[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [context,       setContext]       = useState<VendorContextResponse | null>(null);
  const [lastToolCalls, setLastToolCalls] = useState<string[]>([]);
  const [meta, setMeta] = useState<any>(null); // TDW_02 P5: tier meter state

  const pendingPrimerRef = useRef<string>('');
  const abortRef         = useRef<(() => void) | null>(null);

  // ── Load context + recent history on mount ────────────────────────────
  // 3.0-B: fetch the last ~10 messages so the chat opens with recent
  // scrollback instead of a blank screen. History sits ABOVE the briefing.
  // This is display-only — the agent reads its own history server-side.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await fetchContext(vendorId);
        if (cancelled) return;
        setContext(ctx);

        // Seed the thread with recent transcript only (best-effort). No auto-
        // briefing — Myra speaks when the owner asks, nothing injected unprompted.
        let history: ChatMessage[] = [];
        try {
          const h = await fetchChatHistory(vendorId, 10);
          if (!cancelled && h.ok && Array.isArray(h.messages)) {
            history = h.messages.map(m => ({ id: m.id, role: m.role, text: m.text }));
          }
        } catch {}
        if (cancelled) return;

        setMessages((prev: ChatMessage[]) => {
          if (prev.length > 0) return prev;  // user already started typing
          return [...history];
        });
      } catch {}
    })();
    return () => { cancelled = true; };
  }, [vendorId]);

  // ── Refresh context helper ────────────────────────────────────────────
  const refreshContext = useCallback(async () => {
    try {
      const ctx = await fetchContext(vendorId);
      setContext(ctx);
    } catch {}
  }, [vendorId]);

  const injectAiMessage = useCallback((text: string) => {
    setMessages((prev: ChatMessage[]) => [...prev, { id: nextId(), role: 'ai', text }]);
    pendingPrimerRef.current = text;
  }, []);

  // ── Send — uses SSE streaming ─────────────────────────────────────────
  // displayText (optional): when a card is tapped, the chat bubble shows the
  // human label while `text` (the structured value, e.g. "invoice_id:abc")
  // goes to the agent. Keeps the transcript readable while killing ambiguity.
  const send = useCallback((text: string, displayText?: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Abort any in-progress stream
    if (abortRef.current) { abortRef.current(); abortRef.current = null; }

    const aiPrimer = pendingPrimerRef.current;
    pendingPrimerRef.current = '';

    // Add user message — show the friendly label if provided, else the raw text.
    const bubbleText = (displayText && displayText.trim()) ? displayText.trim() : trimmed;
    setMessages((prev: ChatMessage[]) => [...prev, { id: nextId(), role: 'user', text: bubbleText }]);
    setLoading(true);

    // Add empty AI message that will be filled by streaming deltas
    const aiMsgId = nextId();
    setMessages((prev: ChatMessage[]) => [...prev, { id: aiMsgId, role: 'ai', text: '', streaming: true, deliberation: [] }]);

    let accumulated = '';

    const abort = streamChat(
      vendorId,
      trimmed,
      aiPrimer || undefined,

      // onDelta — append each word to the streaming message
      (delta: string) => {
        accumulated += delta;
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === aiMsgId ? { ...m, text: accumulated } : m
        ));
      },

      // onDone — finalise message, attach metadata, optionally refresh context
      (result) => {
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === aiMsgId
            ? {
                ...m,
                text:       accumulated || (result.clarify ? result.clarify.question : 'Got it.'),
                streaming:  false,
                toolCalls:  result.tool_calls,
                contact:    result.contact,
                clarify:    result.clarify,
                suggestions: result.suggestions,
              }
            : m
        ));
        setLastToolCalls(result.tool_calls ?? []);
        if (result.meta) setMeta(result.meta); // TDW_02 P5
        setLoading(false);
        abortRef.current = null;

        // Refresh context snapshot when DB was mutated
        if (result.refresh) refreshContext();
      },

      // onError
      (errMsg: string) => {
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === aiMsgId ? { ...m, text: errMsg, streaming: false } : m
        ));
        setLoading(false);
        abortRef.current = null;
      },

      // onBeat — collect the pair-at-work beats onto the streaming turn
      (beat: StreamBeat) => {
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === aiMsgId ? { ...m, deliberation: [...(m.deliberation ?? []), beat] } : m
        ));
      },
    );

    abortRef.current = abort;
  }, [vendorId, loading, refreshContext]);

  // ── Fresh thread (TDW_06 D-7) ─────────────────────────────────────────
  // One endpoint call; on ok, a divider joins the on-screen thread so the
  // seam is VISIBLE and everything above it visibly persists (nothing is
  // cleared — D-4's law: the button must not say, or act like, "Clear chat").
  // Guarded against double-tap and against firing mid-stream.
  const freshPendingRef = useRef(false);
  const freshThread = useCallback(async (): Promise<boolean> => {
    if (loading || freshPendingRef.current) return false;
    freshPendingRef.current = true;
    try {
      const r = await startFreshThread();
      if (!r.ok) return false;
      setMessages((prev: ChatMessage[]) => {
        if (prev.length === 0) return prev;                      // nothing to seam
        if (prev[prev.length - 1].divider) return prev;          // already seamed
        return [...prev, { id: nextId(), role: 'ai', text: '', divider: true }];
      });
      return true;
    } catch {
      return false;
    } finally {
      freshPendingRef.current = false;
    }
  }, [loading]);

  return { messages, loading, context, send, injectAiMessage, meta, lastToolCalls, freshThread };
}
