'use client';
// components/vendor/slices/FilterRail.tsx — TDW_03 P1 skeleton
// Sticky filter chips under search. UNMOUNTED at P1 — P4 mounts this with
// the per-slice chip sets (leads state segments w/ counts, invoice states,
// expense month chips, event windows, client manifest columns). Single-select,
// tap again to clear. Created at P1 so the spec's tree exists in one cut.

import type { ListSlice } from '@/hooks/vendor/useLastSlice';

export interface FilterChip { key: string; label: string; count?: number }

export interface FilterRailProps {
  slice: ListSlice;
  chips: FilterChip[];
  active: string | null;
  onSelect: (key: string | null) => void;
}

export function FilterRail(_props: FilterRailProps) {
  return null; // P4 builds the rail
}
