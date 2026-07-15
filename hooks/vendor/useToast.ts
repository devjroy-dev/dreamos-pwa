'use client';
// hooks/useToast.ts
// Lightweight toast state — one active toast at a time.

import { useCallback, useRef, useState } from 'react';

export type ToastKind = 'success' | 'error';
// TDW_04 A2: an optional action (the UNDO button) + per-toast duration ride the
// same single-toast state — the undo toast is a toast, not a new surface.
export interface ToastAction { label: string; onAction: () => void; }
export interface ToastState { message: string; kind: ToastKind; id: number; action?: ToastAction; }

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((message: string, kind: ToastKind = 'success', opts?: { action?: ToastAction; durationMs?: number }) => {
    if (timer.current) clearTimeout(timer.current);
    setToast({ message, kind, id: Date.now(), action: opts?.action });
    timer.current = setTimeout(() => setToast(null), opts?.durationMs ?? 3000);
  }, []);

  const dismiss = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setToast(null);
  }, []);

  return { toast, show, dismiss };
}
