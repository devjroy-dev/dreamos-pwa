'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { afterBreak, historyBubbles } from '@/lib/vendor/chatBreak';
import { fetchContext, fetchChatHistory, streamChat, startFreshThread, type StreamBeat } from '@/v2/lib/vendor/api/vendor';
import { getVendorSession } from '@/lib/vendor/session';
import type { VendorContextResponse } from '@/lib/vendor/types/vendor';
import type { ClarifyPayload, ContactCard } from '@/lib/vendor/types/vendor';
import type { SuggestionsPayload } from '@/v2/lib/vendor/api/vendor';

export type ChatMessageRole = 'user' | 'ai';

export interface ChatMessage {
  id:         string;
  role:       ChatMessageRole;
  text:       string;
  toolCalls?: string[];
  // R-41.142 — the room this message was ANSWERED in, from the engine. Only assistant
  // messages carry one; a user's turn has no room of its own, and the seam is drawn
  // from the assistant messages' fields alone.
  room?: 'advisor' | 'business' | null;
  contact?:   ContactCard;
  clarify?:   ClarifyPayload;  // when set, render options as inline chips
  suggestions?: SuggestionsPayload;  // 3.0-C2: optional next-step cards under a completed action
  streaming?: boolean;         // true while SSE stream is in progress
  deliberation?: StreamBeat[]; // 5-B: the operator's work beneath Myra's reply
  intercepted?: boolean;       // TDW_06 M-3: the wire guard replaced this reply with the
                               // founder's vetoed line. Carries the Report chip and nothing
                               // else — the flag is the ONLY new field, and it is OPTIONAL so
                               // the demo hook (which returns this same type deliberately)
                               // never sets it and the chip is dormant there by construction.
  divider?: boolean;           // TDW_06 D-7: a fresh-thread seam — rendered as a
                               // rule line, never a bubble. The scrollback above
                               // it STAYS ON SCREEN; that is the rider's visible
                               // truth, not a caption claim.
}

export interface BackendHistoryMessage { role: 'user' | 'assistant'; content: string; }

function nextId() { return `${Date.now()}-${Math.random().toString(36).slice(2,8)}`; }

// F-41.98: `room` is threaded, never inferred. The hook does not read the route
// and does not guess — the SURFACE THAT MOUNTS IT asserts, which is what makes
// "the shared sheet sends nothing, on any page including /vendor/advisor" and
// "the Advisor page sends the field" both true at once.
interface UseChatArgs { vendorId: string; room?: string; }
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
  // TDW_06 P7d (item 3): mark the fresh-thread seam in the scrollback WITHOUT a POST —
  // the chip's PATCH already abandoned the thread server-side (F-06.8 rides thread_reset),
  // so the chip flip renders the SAME visible seam the button renders, no second abandon.
  markFreshThread: () => void;
}

export function useChat({ vendorId, room }: UseChatArgs): UseChatReturn {
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
            // R-41.142: the room rides in from history too, or a reload loses every
            // seam. F-41.103 and F-41.104 were both a cure on a write path with no read;
            // this is the read.
            // THE SECOND BUBBLE: a stored two-part answer reloads as its two bubbles (lib/vendor/chatBreak.ts)
            history = h.messages.flatMap(m => historyBubbles(m)).map(m => ({ id: m.id, role: m.role, text: m.text, room: m.room ?? null }));
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
    // THE SECOND BUBBLE (ELZ-3): a turn may draw more than one bubble. `aiMsgId` is the bubble being written now; the
    // turn's bubbles are kept in order so the guard's replace-at-done can fold them back into one. With no break from
    // the server there is exactly one, as before.
    let aiMsgId = nextId();
    const turnIds: string[] = [aiMsgId];
    let broke = false;
    setMessages((prev: ChatMessage[]) => [...prev, { id: aiMsgId, role: 'ai', text: '', streaming: true, deliberation: [] }]);

    let accumulated = '';

    const abort = streamChat(
      vendorId,
      trimmed,
      aiPrimer || undefined,

      // onDelta — append each word to the streaming message
      (delta: string) => {
        if (broke) { delta = afterBreak(delta); broke = false; if (!delta) return; }
        accumulated += delta;
        const id = aiMsgId, text = accumulated;   // read now: the updater may run after a break has moved aiMsgId
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === id ? { ...m, text } : m
        ));
      },

      // onDone — finalise message, attach metadata, optionally refresh context
      (result) => {
        // replace-at-done: the guard replaced the TURN, so its words go into the turn's first bubble and the others go
        const folded = result.intercept?.replaced === true && turnIds.length > 1;
        const lastId = folded ? turnIds[0] : aiMsgId;   // read now, not in the updater (done is the last event: accumulated no longer moves)
        setMessages((prev: ChatMessage[]) => (folded ? prev.filter((m: ChatMessage) => !turnIds.slice(1).includes(m.id)) : prev).map((m: ChatMessage) =>
          m.id === lastId
            ? {
                ...m,
                // TDW_06 M-3: replace-at-done. This expression ALREADY rewrote the text
                // wholesale at `done`; the guard's replacement simply takes precedence over
                // the accumulated stream, which is what "replace at done" means mechanically.
                text:       result.intercept?.replaced
                              ? result.intercept.text
                              : (accumulated || (result.clarify ? result.clarify.question : 'Got it.')),
                intercepted: result.intercept?.replaced === true,
                streaming:  false,
                toolCalls:  result.tool_calls,
                contact:    result.contact,
                clarify:    result.clarify,
                suggestions: result.suggestions,
                // R-41.142: the room the ENGINE answered in, landing on the message it
                // answered. This is what the seam reads — never the request's assertion.
                room:       result.room ?? null,
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
        const id = aiMsgId;
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === id ? { ...m, text: errMsg, streaming: false } : m
        ));
        setLoading(false);
        abortRef.current = null;
      },

      // onBeat — collect the pair-at-work beats onto the streaming turn
      (beat: StreamBeat) => {
        const id = aiMsgId;
        setMessages((prev: ChatMessage[]) => prev.map((m: ChatMessage) =>
          m.id === id ? { ...m, deliberation: [...(m.deliberation ?? []), beat] } : m
        ));
      },
      // F-41.98 — undefined when the mounting surface asserts nothing.
      // THE SECOND BUBBLE: the part written so far is finished, and a new bubble takes the next deltas (the error arm and
      // the beats then write to it; an error after a break leaves the first part as it arrived).
      { room, onBreak: () => {
        const done = aiMsgId; const next = nextId();
        setMessages((prev: ChatMessage[]) => [...prev.map((m: ChatMessage) => (m.id === done ? { ...m, streaming: false } : m)),
          { id: next, role: 'ai', text: '', streaming: true, deliberation: [] }]);
        aiMsgId = next; turnIds.push(next); accumulated = ''; broke = true;
      } },
    );

    abortRef.current = abort;
  }, [vendorId, room, loading, refreshContext]);

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

  // TDW_06 P7d (item 3): the seam-only half of freshThread — same append, no endpoint call.
  const markFreshThread = useCallback(() => {
    setMessages((prev: ChatMessage[]) => {
      if (prev.length === 0) return prev;                      // nothing to seam
      if (prev[prev.length - 1].divider) return prev;          // already seamed
      return [...prev, { id: nextId(), role: 'ai', text: '', divider: true }];
    });
  }, []);

  return { messages, loading, context, send, injectAiMessage, meta, lastToolCalls, freshThread, markFreshThread };
}
