'use client';
// app/admin/_components/CommandPalette.tsx
// THE COMMAND PALETTE — TDW_10 P1 item 3 (A-1), CE ruling R-A5.
//
// ⌘K / Ctrl-K on desktop; the pull-down from the mobile bar. Typeahead over
// GET /api/v2/admin/search?q= (server, five sources, grouped, capped 20) PLUS
// the static section names from adminNav.ts. Enter jumps. Recent jumps are
// server-held (R-A7) and shown when the query is empty.
//
// ── TOKENS ONLY ─────────────────────────────────────────────────────────────
// Every colour in this file is a var(--admin-*) from
// app/admin/_components/tokens.css. No hex literal appears below, and
// scripts/tdw10_p1_shell.proof.mjs §1 fails if one arrives.
//
// ── THE STATIC HITS ARE MATCHED LOCALLY AND THAT IS DELIBERATE ──────────────
// Section names never change between keystrokes, so sending them to a server to
// be filtered would buy latency for nothing. The server answers only what the
// server knows: rows. This also means the palette still navigates when the API
// is unreachable — a nav that dies with the backend is not a nav.

import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PALETTE_SECTIONS, type Section } from './adminNav';
import { adminSearch, getRecentJumps, recordJump, type SearchGroup, type RecentJump } from '@/lib/admin-api/search';

interface Row { key: string; label: string; sub?: string; path: string; group: string; }

const DEBOUNCE_MS = 180;

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [q, setQ]             = useState('');
  const [groups, setGroups]   = useState<SearchGroup[]>([]);
  const [recents, setRecents] = useState<RecentJump[]>([]);
  const [busy, setBusy]       = useState(false);
  const [degraded, setDegraded] = useState<string[]>([]);
  const [cursor, setCursor]   = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // ── Static matches: label + the hints the nav does not show ───────────────
  const staticRows: Row[] = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return [];
    const match = (s: Section) =>
      s.label.toLowerCase().includes(needle) ||
      (s.hints || []).some(h => h.toLowerCase().includes(needle));
    return PALETTE_SECTIONS.filter(match).map(s => ({
      key: `section:${s.path}`, label: s.label, sub: s.path, path: s.path, group: 'Sections',
    }));
  }, [q]);

  const serverRows: Row[] = useMemo(
    () => groups.flatMap(g => g.hits.map(h => ({
      key: `${g.key}:${h.id}`, label: h.label, sub: h.sub, path: h.path, group: g.label,
    }))),
    [groups],
  );

  const recentRows: Row[] = useMemo(() => {
    if (q.trim()) return [];
    return recents.map((r, i) => ({
      key: `recent:${i}:${r.path}`, label: r.label, sub: r.path, path: r.path, group: 'Recent',
    }));
  }, [q, recents]);

  const rows: Row[] = useMemo(
    () => [...recentRows, ...staticRows, ...serverRows],
    [recentRows, staticRows, serverRows],
  );

  // ── Open: focus, reset, load recents ──────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    setQ(''); setGroups([]); setCursor(0); setDegraded([]);
    getRecentJumps().then(setRecents).catch(() => setRecents([]));
    const t = setTimeout(() => inputRef.current?.focus(), 20);
    return () => clearTimeout(t);
  }, [open]);

  // ── Debounced server search ───────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;
    const needle = q.trim();
    abortRef.current?.abort();
    if (needle.length < 2) { setGroups([]); setBusy(false); setDegraded([]); return; }
    const ctl = new AbortController();
    abortRef.current = ctl;
    setBusy(true);
    const t = setTimeout(() => {
      adminSearch(needle, ctl.signal)
        .then(r => { setGroups(r.groups || []); setDegraded(r.degraded || []); })
        // A failed search leaves the STATIC rows standing. The operator can
        // still navigate; they simply get no rows back. Never a false done.
        .catch(() => { if (!ctl.signal.aborted) { setGroups([]); setDegraded(['search unavailable']); } })
        .finally(() => { if (!ctl.signal.aborted) setBusy(false); });
    }, DEBOUNCE_MS);
    return () => { clearTimeout(t); ctl.abort(); };
  }, [q, open]);

  useEffect(() => { setCursor(0); }, [rows.length]);

  const jump = useCallback((row: Row) => {
    recordJump(row.label, row.path);   // fire-and-forget, R-A7
    onClose();
    router.push(row.path);
  }, [onClose, router]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape')    { e.preventDefault(); onClose(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => Math.min(c + 1, rows.length - 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor(c => Math.max(c - 1, 0)); return; }
    if (e.key === 'Enter')     { e.preventDefault(); const r = rows[cursor]; if (r) jump(r); }
  };

  if (!open) return null;

  let lastGroup = '';

  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, background: 'var(--admin-scrim)', zIndex: 300, backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 301,
          margin: '0 auto', maxWidth: 620, padding: '0 12px',
          paddingTop: 'max(12px, env(safe-area-inset-top))',
        }}
      >
        <div style={{
          background: 'var(--admin-sheet)', border: '0.5px solid var(--admin-sheet-border)',
          borderRadius: 12, overflow: 'hidden', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.7)',
        }}>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Jump to anything — vendor, couple, prospect, section"
            aria-label="Search"
            style={{
              width: '100%', background: 'transparent', border: 'none', outline: 'none',
              padding: '18px 20px', fontFamily: '"DM Sans", sans-serif', fontSize: 16,
              color: 'var(--admin-ink)', borderBottom: '0.5px solid var(--admin-hairline)',
              minHeight: 48,
            }}
          />

          <div style={{ maxHeight: '60vh', overflowY: 'auto', padding: '6px 0 10px' }}>
            {busy && rows.length === 0 && (
              <div style={{ padding: '18px 20px', fontFamily: '"Jost", sans-serif', fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--admin-ink-dim)' }}>
                Searching
              </div>
            )}

            {!busy && rows.length === 0 && q.trim().length >= 2 && (
              <div style={{ padding: '18px 20px', fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: 'var(--admin-ink-mute)' }}>
                Nothing matches “{q.trim()}”.
              </div>
            )}

            {rows.map((r, i) => {
              const header = r.group !== lastGroup ? r.group : null;
              lastGroup = r.group;
              const active = i === cursor;
              return (
                <div key={r.key}>
                  {header && (
                    <div style={{
                      fontFamily: '"Jost", sans-serif', fontWeight: 600, fontSize: 10,
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: 'var(--admin-ink-dim)', padding: '14px 20px 6px',
                    }}>
                      {header}
                    </div>
                  )}
                  <button
                    onClick={() => jump(r)}
                    onMouseEnter={() => setCursor(i)}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left', border: 'none',
                      background: active ? 'var(--admin-row-hover)' : 'transparent',
                      padding: '10px 20px', minHeight: 48, cursor: 'pointer',
                      borderLeft: active ? '2px solid var(--admin-metal)' : '2px solid transparent',
                    }}
                  >
                    <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 15, color: 'var(--admin-ink)' }}>
                      {r.label}
                    </div>
                    {r.sub && (
                      <div style={{ fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'var(--admin-ink-mute)', marginTop: 2 }}>
                        {r.sub}
                      </div>
                    )}
                  </button>
                </div>
              );
            })}

            {degraded.length > 0 && (
              // NAMED PARTIAL, NOT A SILENT ONE. If a source failed, the
              // operator is told which. An empty group and a broken group must
              // never look the same.
              <div style={{ padding: '12px 20px 4px', fontFamily: '"DM Sans", sans-serif', fontSize: 12, color: 'var(--admin-caution)' }}>
                Some sources did not answer: {degraded.join(', ')}.
              </div>
            )}
          </div>

          <div style={{
            display: 'flex', gap: 16, padding: '10px 20px',
            borderTop: '0.5px solid var(--admin-hairline)',
            fontFamily: '"Jost", sans-serif', fontSize: 10, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--admin-ink-dim)',
          }}>
            <span>↑↓ move</span><span>↵ jump</span><span>esc close</span>
          </div>
        </div>
      </div>
    </>
  );
}
