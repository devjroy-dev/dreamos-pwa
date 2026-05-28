'use client';
// hooks/demo/useDemoChat.ts
// DreamAi chat hook for demo mode.
// NO session. NO auth. Handle from URL is the only identity.

import { useCallback, useRef, useState } from 'react';
import { streamDemoChat } from '@/lib/demo/api';
import type { StreamDonePayload } from '@/lib/demo/api';

export interface DemoChatMessage {
  id:        string;
  role:      'user' | 'ai';
  text:      string;
  streaming?: boolean;
}

type BackendRole = 'user' | 'assistant';
interface BackendHistory { role: BackendRole; content: string; }

function uid() { return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

export function useDemoChat({ handle }: { handle: string }) {
  const [messages, setMessages] = useState<DemoChatMessage[]>([{
    id:   'welcome',
    role: 'ai',
    text: 'Welcome to your DreamAi studio. I have your leads and profile loaded. Ask me anything — about your leads, how to respond to brides, or what TDW can do for your business.',
  }]);
  const [loading,  setLoading]  = useState(false);
  const abortRef   = useRef<(() => void) | null>(null);
  const historyRef = useRef<BackendHistory[]>([]);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    if (abortRef.current) { abortRef.current(); abortRef.current = null; }

    setMessages(prev => [...prev, { id: uid(), role: 'user', text: trimmed }]);
    setLoading(true);

    const aiId = uid();
    setMessages(prev => [...prev, { id: aiId, role: 'ai', text: '', streaming: true }]);

    let accumulated = '';

    const abort = streamDemoChat(
      handle,
      trimmed,
      historyRef.current,
      (delta) => {
        accumulated += delta;
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: accumulated } : m));
      },
      (_result: StreamDonePayload) => {
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, streaming: false } : m));
        historyRef.current = [
          ...historyRef.current,
          { role: 'user' as const,      content: trimmed     },
          { role: 'assistant' as const, content: accumulated },
        ].slice(-20);
        setLoading(false);
        abortRef.current = null;
      },
      (errMsg) => {
        setMessages(prev => prev.map(m => m.id === aiId ? { ...m, text: errMsg, streaming: false } : m));
        setLoading(false);
        abortRef.current = null;
      },
    );

    abortRef.current = abort;
  }, [handle, loading]);

  return { messages, loading, send };
}
