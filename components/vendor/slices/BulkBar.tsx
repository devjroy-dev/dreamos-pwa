'use client';
// components/vendor/slices/BulkBar.tsx — TDW_03 P1 skeleton
// Bottom action bar in select mode. UNMOUNTED at P1 — P4 mounts this with
// long-press select, per-slice bulk actions (leads mark contacted/lose,
// invoices mark paid, expenses delete, events mark done), sequential API
// calls with per-row result, and the `n done · m failed (retry)` summary.
// Created at P1 so the spec's tree exists in one cut.

import type { ListSlice } from '@/hooks/vendor/useLastSlice';

export interface BulkAction { key: string; label: string; destructive?: boolean }

export interface BulkBarProps {
  slice: ListSlice;
  selectedCount: number;
  actions: BulkAction[];
  onAction: (key: string) => void;
  onCancel: () => void;
}

export function BulkBar(_props: BulkBarProps) {
  return null; // P4 builds the bar
}
