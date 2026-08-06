// lib/admin-api/search.ts
// The command palette's data client — TDW_10 P1, CE ruling R-A5.
//
// Rides lib/admin-api/_base.ts's ONE header authority (bearer, lazily read).
// No second fetch idiom is invented here; F-07.85's twenty-six hand-assembled
// header objects are exactly the disease that authority exists to prevent.

import { API_BASE, adminHeaders } from './_base';

export type SearchGroupKey = 'vendors' | 'couples' | 'prospects' | 'demo' | 'leads';

export interface SearchHit {
  /** Row id, or for leads the lead id — used only as a React key. */
  id: string;
  /** What the operator reads. */
  label: string;
  /** The second line: category · city, phone, state — whatever identifies. */
  sub?: string;
  /** Where Enter goes. Always an existing admin route (P1 moves no path). */
  path: string;
}

export interface SearchGroup {
  key: SearchGroupKey;
  label: string;
  hits: SearchHit[];
}

export interface SearchResponse {
  ok: boolean;
  q: string;
  /** Total across groups, server-capped at 20. */
  count: number;
  groups: SearchGroup[];
  /** Named per-source failures. A partial answer is stated, never disguised as
   *  an empty one — the never-a-false-done law reaching the palette. */
  degraded?: string[];
}

/** Server-side search. Returns groups in a STABLE order (R-A5): vendors,
 *  couples, prospects, demo, leads — so the operator's muscle memory holds. */
export async function adminSearch(q: string, signal?: AbortSignal): Promise<SearchResponse> {
  const res = await fetch(`${API_BASE}/api/v2/admin/search?q=${encodeURIComponent(q)}`, {
    headers: adminHeaders(),
    signal,
  });
  if (!res.ok) throw new Error(`admin search failed: ${res.status}`);
  return res.json();
}

export interface RecentJump {
  label: string;
  path: string;
  at: number;
}

export async function getRecentJumps(): Promise<RecentJump[]> {
  try {
    const res = await fetch(`${API_BASE}/api/v2/admin/search/recents`, { headers: adminHeaders() });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.recents) ? data.recents : [];
  } catch {
    // Recents are a convenience. A palette that cannot open because its
    // bookkeeping is down is worse than a palette with no history.
    return [];
  }
}

/** FIRE-AND-FORGET by ruling (R-A7). The jump has already happened by the time
 *  this resolves; awaiting it would put a network round trip between the
 *  operator's Enter and the route change, which is the opposite of what a
 *  palette is for. Failures are swallowed deliberately — see the mechanism
 *  comment in src/api/admin/search.js. */
export function recordJump(label: string, path: string): void {
  try {
    void fetch(`${API_BASE}/api/v2/admin/search/recents`, {
      method: 'POST',
      headers: adminHeaders(),
      body: JSON.stringify({ label, path }),
      keepalive: true,
    }).catch(() => {});
  } catch { /* ignore */ }
}
