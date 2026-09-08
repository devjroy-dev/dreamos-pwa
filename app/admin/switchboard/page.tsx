'use client';
// app/admin/switchboard/page.tsx — THE SWITCHBOARD. CE-41 seat C, R-41.8.
//
// Every gated feature in Business Solutions on one card, in plain words, readable
// and flippable from the founder's phone with no shell open. The register is
// dream-os `public.capabilities` (0149); the doors are
// `src/api/admin/capabilities.js` — read there first, never assumed (§6).
//
// WORDS ON THE GLASS: plain names (kickoff §5 C2 — "Review request", never
// `template.tdw_review_request`). The register key sits beneath in small type
// because it is what the log and the sweep say, and the founder reads logs.
// No persona name anywhere on this surface (copy law).
//
// STATE IS INK, NEVER GROUND (R-40.129's principle carried into the cockpit's own
// token set): a status is a coloured word with a hairline beneath it, not a filled
// pill. The cockpit's dark chrome is the sanctioned exception to the light law.
//
// THE FAST PATH IS LIVE: the founder subscribed `message_template_status_update`
// 2026-09-08 14:50 IST, so a template row can move without anyone tapping
// Check now. This page never caches — every load asks the doors fresh.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast } from '../_components/AdminUI';
import {
  getCapabilities, flipCapability, setCapabilityAutoOn, checkCapability, sweepCapabilities, getWabaTemplates,
  type CapabilityRow, type CapabilityStatus, type CapabilityKind, type WabaTemplate,
} from '../../../lib/admin-api/index';
import { gateName, gateSpec, gateMeta } from '../../../lib/admin-api/switchboardCopy';

// ── THE WORDS LIVE IN ONE HOME (C3, F-41.52/.53): lib/admin-api/switchboardCopy.ts.
// Every gate is TWO LINES (F-41.57): the short name, then the dotted spec. The
// palette reads the same file to match and jump here.
function nameFor(key: string) { return gateName(key); }

const KIND_LABEL: Record<CapabilityKind, string> = {
  flag: 'Features you switch on',
  template: 'Message templates on Meta',
  permission: 'Meta app permissions',
  scope: 'Google access',
};
const KIND_ORDER: CapabilityKind[] = ['flag', 'template', 'permission', 'scope'];

// The status as a word, in the ink that names its state. Three state roles:
// success (on / approved / armed), warning (pending / paused), danger (rejected);
// off is plain ink — a switch at rest is not an alarm.
function statusInk(s: CapabilityStatus) {
  if (s === 'on') return T.success;
  if (s === 'armed' || s === 'approved') return T.success;
  if (s === 'pending' || s === 'paused') return T.warning;
  if (s === 'rejected') return T.danger;
  return T.soft;
}
const STATUS_WORD: Record<CapabilityStatus, string> = {
  on: 'On', off: 'Off', armed: 'Ready to switch on', approved: 'Approved', pending: 'Waiting', paused: 'Paused by Meta', rejected: 'Rejected',
};

function when(iso: string | null) {
  if (!iso) return 'never checked';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' }) + ' IST';
}

export default function SwitchboardPage() {
  const [rows, setRows] = useState<CapabilityRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [walkRef, setWalkRef] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState<{ count: number; pages: number; truncated: boolean; evidence: string; templates: WabaTemplate[] } | null>(null);
  const [metaLoading, setMetaLoading] = useState(false);
  const [metaError, setMetaError] = useState<string | null>(null);

  // ── THE PALETTE'S LANDING (F-41.53): /admin/switchboard#<key> scrolls to the
  // row and lights its hairline for a moment, on load and on every hash change.
  const [lit, setLit] = useState<string | null>(null);
  useEffect(() => {
    const land = () => {
      const key = decodeURIComponent((window.location.hash || '').replace(/^#/, ''));
      if (!key) return;
      const el = document.querySelector<HTMLElement>(`[data-gate="${CSS.escape(key)}"]`);
      if (!el) return;
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
      setLit(key);
      window.setTimeout(() => setLit(k => (k === key ? null : k)), 2400);
    };
    if (!loading) land();
    window.addEventListener('hashchange', land);
    return () => window.removeEventListener('hashchange', land);
  }, [loading]);

  const load = useCallback(async () => {
    setLoading(true);
    try { const d = await getCapabilities(); setRows(d.rows); }
    catch { setToast({ msg: 'Could not read the switchboard.', error: true }); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const patchRow = (row: CapabilityRow) => setRows(prev => prev.map(r => r.key === row.key ? row : r));

  const flip = async (row: CapabilityRow, to: 'on' | 'off') => {
    setBusy(row.key);
    try { const d = await flipCapability(row.key, to); patchRow(d.row); setToast({ msg: `${nameFor(row.key)}: ${to === 'on' ? 'on' : 'off'}.` }); }
    catch (e) { setToast({ msg: `Could not switch ${nameFor(row.key)} ${to}. ${(e as Error).message}`, error: true }); }
    finally { setBusy(null); }
  };
  const autoOn = async (row: CapabilityRow, on: boolean) => {
    const ref = (walkRef[row.key] ?? row.walk_ref ?? '').trim();
    if (on && !ref) { setToast({ msg: 'Enter the walk seal first — a plane is pre-authorised only after it was walked.', error: true }); return; }
    setBusy(row.key);
    try { const d = await setCapabilityAutoOn(row.key, on, ref || undefined); patchRow(d.row); setToast({ msg: on ? `${nameFor(row.key)} will switch on by itself once approved.` : `${nameFor(row.key)} waits for your tap.` }); }
    catch (e) { setToast({ msg: `Could not save. ${(e as Error).message}`, error: true }); }
    finally { setBusy(null); }
  };
  const check = async (row: CapabilityRow) => {
    setBusy(row.key);
    try { const d = await checkCapability(row.key); patchRow(d.row); setToast({ msg: `Checked ${nameFor(row.key)}.` }); }
    catch (e) { setToast({ msg: `Check failed. ${(e as Error).message}`, error: true }); }
    finally { setBusy(null); }
  };
  const sweepAll = async () => {
    setBusy('*');
    try { const d = await sweepCapabilities(); await load(); setToast({ msg: `Checked ${d.checked} gates; ${d.moved} moved.` }); }
    catch (e) { setToast({ msg: `Sweep failed. ${(e as Error).message}`, error: true }); }
    finally { setBusy(null); }
  };
  const loadMeta = async () => {
    setMetaLoading(true); setMetaError(null);
    try { setMeta(await getWabaTemplates()); }
    catch (e) { setMetaError((e as Error).message); }
    finally { setMetaLoading(false); }
  };
  const copyMeta = async () => {
    if (!meta) return;
    const json = JSON.stringify({ read_at: new Date().toISOString(), count: meta.count, pages: meta.pages, truncated: meta.truncated, templates: meta.templates }, null, 2);
    try { await navigator.clipboard.writeText(json); setToast({ msg: `Copied ${meta.count} templates as JSON.` }); }
    catch { setToast({ msg: 'Copy failed — your browser blocked the clipboard. Long-press the list to select it instead.', error: true }); }
  };

  const groups = useMemo(() => KIND_ORDER.map(k => ({ kind: k, rows: rows.filter(r => r.kind === k) })).filter(g => g.rows.length > 0), [rows]);

  return (
    <div>
      <PageHeader
        title="Switchboard"
        sub="Every gate in Business Solutions. Meta and Google are checked nightly at 03:50; a status change reaches here within seconds when Meta tells us."
        action={<GoldBtn small label={busy === '*' ? 'Checking…' : 'Check everything now'} onClick={sweepAll} disabled={busy !== null} />}
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, height: 140 }} />)}
        </div>
      ) : rows.length === 0 ? (
        <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 24, fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>
          The switchboard has no rows yet. Run migration 0149 in Supabase and reload.
        </div>
      ) : groups.map(g => (
        <section key={g.kind} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: '18px 20px 6px', marginBottom: 16 }}>
          <h2 style={{ fontFamily: T.ff.body, fontWeight: 600, fontSize: 14, color: T.ink, margin: '0 0 14px' }}>{KIND_LABEL[g.kind]}</h2>
          {g.rows.map(row => (
            <GateRow
              key={row.key} row={row} busy={busy === row.key || busy === '*'} lit={lit === row.key}
              walkRef={walkRef[row.key] ?? row.walk_ref ?? ''}
              onWalkRef={v => setWalkRef(p => ({ ...p, [row.key]: v }))}
              onFlip={to => flip(row, to)} onAutoOn={on => autoOn(row, on)} onCheck={() => check(row)}
            />
          ))}
        </section>
      ))}

      {/* ── TEMPLATES ON META (C1b, F-41.6's instrument) ─────────────────────
          A bare URL cannot carry the admin bearer, so the raw listing lives here
          with a Copy as JSON — that JSON is seat B's register of names and IDs. */}
      <section style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{ fontFamily: T.ff.body, fontWeight: 600, fontSize: 14, color: T.ink, margin: 0 }}>Templates on Meta</h2>
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, margin: '4px 0 0', lineHeight: 1.5 }}>
              Everything filed on the WhatsApp business account, read live from Meta with its status, category and ID.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <GhostBtn small label={metaLoading ? 'Reading…' : meta ? 'Read again' : 'Read from Meta'} onClick={loadMeta} disabled={metaLoading} />
            <GoldBtn small label="Copy as JSON" onClick={copyMeta} disabled={!meta || metaLoading} />
          </div>
        </div>
        {metaError && <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.danger, margin: '12px 0 0' }}>Meta did not answer: {metaError}</p>}
        {meta && (
          <div style={{ marginTop: 14 }}>
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft, margin: '0 0 10px' }}>
              {meta.count} templates across {meta.pages} page{meta.pages === 1 ? '' : 's'}{meta.truncated ? ' — the list was cut short; read again' : ''}.
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: T.ff.body, fontSize: 12 }}>
                <thead>
                  <tr style={{ color: T.muted, textAlign: 'left' }}>
                    <th style={th}>Name</th><th style={th}>Status</th><th style={th}>Category</th><th style={th}>Language</th><th style={th}>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {meta.templates.map(t => (
                    <tr key={`${t.name}-${t.language}-${t.id}`} style={{ borderTop: `0.5px solid ${T.border}` }}>
                      <td style={{ ...td, color: T.ink }}>{t.name}</td>
                      <td style={{ ...td, color: metaInk(t.status) }}>{t.status ?? '—'}</td>
                      <td style={td}>{t.category ?? '—'}</td>
                      <td style={td}>{t.language ?? '—'}</td>
                      <td style={{ ...td, fontVariantNumeric: 'tabular-nums' }}>{t.id ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </div>
  );
}

const th: React.CSSProperties = { fontWeight: 500, padding: '6px 10px 8px 0', fontSize: 11 };
const td: React.CSSProperties = { padding: '9px 10px 9px 0', color: T.soft, verticalAlign: 'top' };
function metaInk(s: string | null) {
  const w = String(s || '').toUpperCase();
  if (w === 'APPROVED') return T.success;
  if (w === 'REJECTED' || w === 'DISABLED') return T.danger;
  if (w === 'PENDING' || w === 'PAUSED' || w === 'IN_APPEAL') return T.warning;
  return T.soft;
}

// ── ONE GATE ──────────────────────────────────────────────────────────────────
function GateRow({ row, busy, lit, walkRef, onWalkRef, onFlip, onAutoOn, onCheck }: {
  row: CapabilityRow; busy: boolean; lit: boolean; walkRef: string;
  onWalkRef: (v: string) => void; onFlip: (to: 'on' | 'off') => void; onAutoOn: (on: boolean) => void; onCheck: () => void;
}) {
  const canTurnOn = row.status === 'armed' || row.status === 'approved' || row.status === 'off';
  const isOn = row.status === 'on';
  const probeable = row.kind === 'template' || row.kind === 'scope';
  const ink = statusInk(row.status);
  return (
    <div data-gate={row.key} style={{ padding: '12px 0 14px', borderBottom: `0.5px solid ${T.border}`, boxShadow: lit ? `inset 3px 0 0 ${T.gold}` : 'none', paddingLeft: lit ? 10 : 0, transition: 'box-shadow 300ms, padding-left 300ms' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.35, maxWidth: 560 }}>{nameFor(row.key)}</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, lineHeight: 1.45, marginTop: 2, maxWidth: 560 }}>{gateSpec(row.key)}</div>
          <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.muted, letterSpacing: '0.06em', marginTop: 3, wordBreak: 'break-all' }}>{row.key}{gateMeta(row.key) && !row.key.endsWith(gateMeta(row.key) as string) ? ` · ${gateMeta(row.key)}` : ''}</div>
          <div style={{ marginTop: 8, display: 'inline-block', fontFamily: T.ff.body, fontSize: 12, color: ink, borderBottom: `1px solid ${ink}`, paddingBottom: 1 }}>
            {STATUS_WORD[row.status]}
          </div>
          {row.evidence && (
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft, lineHeight: 1.5, margin: '8px 0 0', maxWidth: 560 }}>{row.evidence}</p>
          )}
          <p style={{ fontFamily: T.ff.body, fontSize: 10, color: T.muted, margin: '6px 0 0' }}>
            Checked {when(row.checked_at)}{row.flipped_at ? ` · switched ${when(row.flipped_at)}${row.flipped_by ? ` by ${row.flipped_by}` : ''}` : ''}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'stretch', minWidth: 190 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <GhostBtn small label="On" onClick={() => onFlip('on')} disabled={busy || isOn || !canTurnOn} />
            <GhostBtn small label="Off" onClick={() => onFlip('off')} disabled={busy || !isOn} danger />
            {probeable && <GhostBtn small label={busy ? '…' : 'Check now'} onClick={onCheck} disabled={busy} />}
          </div>
          {(row.kind === 'template' || row.kind === 'flag') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontFamily: T.ff.body, fontSize: 11, color: row.walk_ref || walkRef ? T.soft : T.dim, cursor: 'pointer' }}>
                <input
                  type="checkbox" checked={row.auto_on} disabled={busy || (!row.walk_ref && !walkRef.trim())}
                  onChange={e => onAutoOn(e.target.checked)}
                  aria-label={`Switch ${nameFor(row.key)} on automatically once approved`}
                />
                Switch on automatically once approved
              </label>
              <input
                value={walkRef} onChange={e => onWalkRef(e.target.value)} placeholder="Walk seal (commit hash)"
                aria-label={`Walk seal for ${nameFor(row.key)}`}
                style={{ background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '7px 10px', fontFamily: T.ff.body, fontSize: 11, color: T.ink, outline: 'none' }}
                onFocus={e => { e.currentTarget.style.borderColor = T.borderFocus; }}
                onBlur={e => { e.currentTarget.style.borderColor = T.border; }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
