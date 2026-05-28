'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchContext, streamChat } from '@/lib/vendor/api/vendor';
import { getVendorSession } from '@/lib/vendor/session';
import { buildBriefing } from '@/lib/vendor/briefing';
import type { VendorContextResponse } from '@/lib/vendor/types/vendor';
import type { ClarifyPayload, ContactCard } from '@/lib/vendor/types/vendor';

export type ChatMessageRole = 'user' | 'ai';

export interface ChatMessage {
  id:         string;
  role:       ChatMessageRole;
  text:       string;
  toolCalls?: string[];
  contact?:   ContactCard;
  clarify?:   ClarifyPayload;  // when set, render options as inline chips
  streaming?: boolean;         // true while SSE stream is in progress
}

export interface BackendHistoryMessage { role: 'user' | 'assistant'; content: string; }

function nextId() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

interface UseChatArgs { vendorId: string; }
interface UseChatReturn {
  messages:        ChatMessage[];
  loading:         boolean;
  context:         VendorContextResponse | null;
  send:            (text: string) => void;
  injectAiMessage: (text: string) => void;
  lastToolCalls:   string[];
}

export function useChat({ vendorId }: UseChatArgs): UseChatReturn {
  const [messages,      setMessages]      = useState<ChatMessage[]>([]);
  const [loading,       setLoading]       = useState(false);
  const [context,       setContext]       = useState<VendorContextResponse | null>(null);
  const [lastToolCalls, setLastToolCalls] = useState<string[]>([]);

  const pendingPrimerRef = useRef<string>('');
  const abortRef         = useRef<(() => void) | null>(null);

  // ── Load context on mount ─────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const ctx = await fetchContext(vendorId);
        if (cancelled) return;
        setContext(ctx);
        const briefing = buildBriefing(ctx);
        if (briefing) setMessages((prev: ChatMessage[]) => prev.length === 0
          ? [{ id: 'briefing', role: 'ai', text: briefing }]
          : prev
        );
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
  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Abort any in-progress stream
    if (abortRef.current) { abortRef.current(); abortRef.current = null; }

    const aiPrimer = pendingPrimerRef.current;
    pendingPrimerRef.current = '';

    // Add user message
    setMessages((prev: ChatMessage[]) => [...prev, { id: nextId(), role: 'user', text: trimmed }]);
    setLoading(true);

    // Add empty AI message that will be filled by streaming deltas
    const aiMsgId = nextId();
    setMessages((prev: ChatMessage[]) => [...prev, { id: aiMsgId, role: 'ai', text: '', streaming: true }]);

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
              }
            : m
        ));
        setLastToolCalls(result.tool_calls ?? []);
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
    );

    abortRef.current = abort;
  }, [vendorId, loading, refreshContext]);

  return { messages, loading, context, send, injectAiMessage, lastToolCalls };
}
