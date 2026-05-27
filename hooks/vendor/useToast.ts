'use client';
// hooks/useToast.ts
// Lightweight toast state — one active toast at a time.

import { useCallback, useRef, useState } from 'react';

export type ToastKind = 'success' | 'error';
export interface ToastState { message: string; kind: ToastKind; id: number; }

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, kind, id: Date.now() });
    timer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  return { toast, show, dismiss };
}
