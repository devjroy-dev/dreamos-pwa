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
  type CapabilityRow, type CapabilityStatus, type WabaTemplate,
} from '../../../lib/admin-api/index';
import { gateName, gateSpec, gateMeta, gateMetaId, gateMatches, roomOf, STATUS_WORD as COPY_STATUS_WORD, GUARDED_TEMPLATES, templatesUnder, STANDING_KEY, ROOM_ORDER } from '../../../lib/admin-api/switchboardCopy';
// ── CE-41 F2 · ONE LABELLED CROSS-SEAT LINE (c-41.10's form, chair-authorised) ──
// Model routes is a GROUP INSIDE THIS PAGE in seat E's ratified IA (veto sheet §D,
// and the group order at row 16), not a room of its own — a route of its own would
// be an orphan the shell proof rightly refuses. Seat F owns everything the group
// renders; this file's whole reach into it is the import and the one element below.
// When seat E's re-shape (R-41.82) lands, the element moves to its place in the new
// group order and nothing else changes.
import ModelRoutesPanel from './ModelRoutesPanel';

// ── THE WORDS LIVE IN ONE HOME (C3, F-41.52/.53): lib/admin-api/switchboardCopy.ts.
// Every gate is TWO LINES (F-41.57): the short name, then the dotted spec. The
// palette reads the same file to match and jump here.
function nameFor(key: string) { return gateName(key); }

// R-41.82 — KIND_LABEL and KIND_ORDER are gone with the sections they named. The card
// groups by ROOM now; the register's four kinds still exist in the data and still decide
// which controls a row gets (a scope has no auto-on), but they are no longer a heading a
// founder reads.


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
// R-41.99 — THE STATE WORDS COME FROM THE COPY HOME NOW. This file held its own map,
// which made the page both a renderer and a copy home; the four words the E1 veto
// ratified (Granted, Not filed, Not requested, Not sending yet) went into
// switchboardCopy.ts and the two lived side by side until this rider. One home.
const STATUS_WORD: Record<string, string> = COPY_STATUS_WORD;


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

  // ── R-41.82 · GROUPED BY ROOM, AND ONE ROW PER SWITCHABLE THING ────────────
  // The card was four sections named after the register's own kinds — `Features you
  // switch on`, `Message templates on Meta`, `Meta app permissions`, `Google access`.
  // True of the data and useless to a founder deciding whether payment reminders are
  // sending: the template that carries them sat in a different section from the flag
  // that switches them, and he had to hold both in his head.
  //
  // Now: rooms in the chair's order, a guarded template folded into its flag's second
  // line (R-41.102), and the one gate that is the page's precondition standing above
  // the groups rather than filed inside one of them (fork B).
  const [q, setQ] = useState('');
  const byKey = useMemo(() => new Map(rows.map(r => [r.key, r] as const)), [rows]);

  const visible = useMemo(() => {
    const n = q.trim();
    if (!n) return rows;
    // A flag stays visible when one of ITS TEMPLATES matches: the founder searching a
    // Meta name must land on the row that switches it, not on nothing.
    return rows.filter(r => gateMatches(r.key, n) || templatesUnder(r.key).some(t => gateMatches(t, n)));
  }, [rows, q]);

  const standing = useMemo(() => visible.find(r => r.key === STANDING_KEY), [visible]);
  const groups = useMemo(() => ROOM_ORDER.map(room => ({
    room,
    rows: visible.filter(r => r.key !== STANDING_KEY
      && !GUARDED_TEMPLATES.includes(r.key)
      && roomOf(r.key) === room),
  })).filter(g => g.rows.length > 0), [visible]);

  const shown = groups.reduce((n, g) => n + g.rows.length, 0) + (standing ? 1 : 0);
  const total = rows.filter(r => !GUARDED_TEMPLATES.includes(r.key)).length;

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
      ) : (<>
        {/* R-41.82 — SEARCH BY ANY WORD: a room, a recipient, a Meta name, the register
            key. `gateMatches` is unchanged (seat C's, F-41.53) — the key still matches
            even though it is off the glass now, so the founder who knows it can still
            find its row. */}
        <div style={{ marginBottom: 16 }}>
          <input
            value={q} onChange={e => setQ(e.target.value)}
            placeholder="Search any word — a room, a recipient, a Meta name"
            aria-label="Search the switchboard"
            style={{ width: '100%', maxWidth: 420, background: 'var(--atelier-input-bg)', border: `0.5px solid ${q ? T.borderFocus : T.border}`,
                     borderRadius: 3, padding: '11px 12px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, minHeight: 44 }}
          />
          {q && <div style={{ fontFamily: T.ff.label, fontSize: 10, color: T.muted, letterSpacing: '0.08em', marginTop: 6 }}>{shown} of {total} rows</div>}
        </div>

        {/* FORK B, RULED — the standing row, above the groups. `perm.whatsapp_business_pair`
            gates every WhatsApp send on this card; inside any one room it would read as
            that room's local concern rather than the page's precondition. */}
        {standing && (
          <section style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 3, padding: '4px 20px 0', marginBottom: 16 }}>
            <GateRow
              key={standing.key} row={standing} byKey={byKey} busy={busy === standing.key || busy === '*'} lit={lit === standing.key}
              walkRef={walkRef[standing.key] ?? standing.walk_ref ?? ''}
              onWalkRef={v => setWalkRef(p => ({ ...p, [standing.key]: v }))}
              onFlip={to => flip(standing, to)} onAutoOn={on => autoOn(standing, on)} onCheck={() => check(standing)}
            />
          </section>
        )}

        {groups.length === 0 && q && (
          <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft, padding: '18px 0' }}>Nothing matches that word.</div>
        )}

        {groups.map(g => (
        <section key={g.room} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 3, padding: '18px 20px 6px', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, margin: '0 0 14px' }}>
            <h2 style={{ fontFamily: T.ff.body, fontWeight: 600, fontSize: 14, color: T.ink, margin: 0 }}>{g.room}</h2>
            <span style={{ fontFamily: T.ff.label, fontSize: 10, color: T.muted, letterSpacing: '0.08em' }}>
              {g.rows.length} {g.rows.length === 1 ? 'row' : 'rows'}
            </span>
          </div>
          {g.rows.map(row => (
            <GateRow
              key={row.key} row={row} byKey={byKey} busy={busy === row.key || busy === '*'} lit={lit === row.key}
              walkRef={walkRef[row.key] ?? row.walk_ref ?? ''}
              onWalkRef={v => setWalkRef(p => ({ ...p, [row.key]: v }))}
              onFlip={to => flip(row, to)} onAutoOn={on => autoOn(row, on)} onCheck={() => check(row)}
            />
          ))}
        </section>
        ))}
      </>)}

      {/* ── MODEL ROUTES (CE-41 seat F, R-41.85) ─────────────────────────────
          Who answers, per lane and per hand. Its own doors, its own copy home,
          its own bench; this page only gives it its place. */}
      <ModelRoutesPanel />

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
function GateRow({ row, byKey, busy, lit, walkRef, onWalkRef, onFlip, onAutoOn, onCheck }: {
  row: CapabilityRow; byKey?: Map<string, CapabilityRow>; busy: boolean; lit: boolean; walkRef: string;
  onWalkRef: (v: string) => void; onFlip: (to: 'on' | 'off') => void; onAutoOn: (on: boolean) => void; onCheck: () => void;
}) {
  const canTurnOn = row.status === 'armed' || row.status === 'approved' || row.status === 'off';
  const isOn = row.status === 'on';
  const probeable = row.kind === 'template' || row.kind === 'scope';
  const ink = statusInk(row.status);

  // R-41.98 — THE ROW IS A VERB AND A STATE, AND THE REST GOES ONE TAP DEEP.
  // It used to carry the register key, the walk-seal field and the auto-on checkbox on
  // the glass at all times: three pieces of machinery on a surface whose question is
  // `is this sending`. The key is admin language, the seal is a thing he types once a
  // quarter, and auto-on is a decision he makes when he files a template, not when he
  // scans the card. All three moved behind the disclosure.
  const [open, setOpen] = useState(false);
  const templates = templatesUnder(row.key);

  return (
    <div data-gate={row.key} style={{ padding: '12px 0 14px', borderBottom: `0.5px solid ${T.border}`, boxShadow: lit ? `inset 3px 0 0 ${T.gold}` : 'none', paddingLeft: lit ? 10 : 0, transition: 'box-shadow 400ms, padding-left 400ms' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 220px', minWidth: 0 }}>
          <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, lineHeight: 1.35, maxWidth: 560 }}>{gateName(row.key)}</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, lineHeight: 1.45, marginTop: 2, maxWidth: 560 }}>{gateSpec(row.key)}</div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', marginTop: 8 }}>
            <span style={{ fontFamily: T.ff.body, fontSize: 12, color: ink, borderBottom: `1px solid ${ink}`, paddingBottom: 1 }}>
              {STATUS_WORD[row.status]}
            </span>
            <span style={{ fontFamily: T.ff.body, fontSize: 10, color: T.muted }}>
              {row.flipped_at ? `since ${when(row.flipped_at)}${row.flipped_by ? ` · ${row.flipped_by}` : ''}` : `checked ${when(row.checked_at)}`}
            </span>
          </div>

          {/* R-41.102 — EVERY TEMPLATE THIS FLAG'S DOOR SENDS, AS A SECOND LINE. The
              contract flag carries two: the signing link and the signing code. They do
              not get rows of their own, so their state has to be visible here or it is
              nowhere. */}
          {templates.map(tk => {
            const t = byKey?.get(tk);
            const tInk = t ? statusInk(t.status) : T.muted;
            return (
              <div key={tk} style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap', marginTop: 6, paddingLeft: 10, borderLeft: `0.5px solid ${T.border}` }}>
                <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft }}>{gateName(tk)}</span>
                <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: tInk }}>
                  {t ? STATUS_WORD[t.status] : 'Not filed'}
                </span>
              </div>
            );
          })}

          {row.evidence && (
            <p style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft, lineHeight: 1.5, margin: '8px 0 0', maxWidth: 560 }}>{row.evidence}</p>
          )}

          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            style={{ background: 'none', border: 'none', padding: '6px 0 0', minHeight: 28, cursor: 'pointer',
                     fontFamily: T.ff.body, fontSize: 11, color: open ? T.muted : T.gold, textAlign: 'left' }}
          >
            {open ? 'Meta’s words, the key and the seal ‹' : 'Meta’s words, the key and the seal ›'}
          </button>

          {open && (
            <div style={{ background: 'var(--atelier-section-bg)', border: `0.5px solid ${T.border}`, borderRadius: 3, padding: '10px 12px', marginTop: 8, maxWidth: 560 }}>
              {gateMeta(row.key) && (
                <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.ink, marginBottom: 4 }}>
                  {gateMeta(row.key)}{gateMetaId(row.key) ? ` · ID ${gateMetaId(row.key)}` : ''}
                </div>
              )}
              <div style={{ fontFamily: T.ff.label, fontSize: 10, color: T.muted, letterSpacing: '0.06em', wordBreak: 'break-all' }}>Key {row.key}</div>
              {(row.kind === 'template' || row.kind === 'flag') && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                  <input
                    value={walkRef} onChange={e => onWalkRef(e.target.value)} placeholder="Walk seal (commit hash)"
                    aria-label={`Walk seal for ${gateName(row.key)}`}
                    style={{ background: 'var(--atelier-input-bg)', border: `0.5px solid ${T.border}`, borderRadius: 3, padding: '10px 12px', fontFamily: T.ff.body, fontSize: 12, color: T.ink, minHeight: 44 }}
                    onFocus={e => { e.currentTarget.style.borderColor = T.borderFocus; }}
                    onBlur={e => { e.currentTarget.style.borderColor = T.border; }}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, minHeight: 44, fontFamily: T.ff.body, fontSize: 11, color: row.walk_ref || walkRef ? T.soft : T.dim }}>
                    <input
                      type="checkbox" checked={row.auto_on} disabled={busy || (!row.walk_ref && !walkRef.trim())}
                      onChange={e => onAutoOn(e.target.checked)}
                      aria-label={`Switch ${gateName(row.key)} on automatically once approved`}
                    />
                    Switch on automatically once approved
                  </label>
                </div>
              )}
            </div>
          )}
        </div>

        {/* THE ROW'S CONTROLS ARE THE SWITCH, AND `Check now` WHERE A GATE IS PROBEABLE. */}
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <GhostBtn small label="On" onClick={() => onFlip('on')} disabled={busy || isOn || !canTurnOn} />
          <GhostBtn small label="Off" onClick={() => onFlip('off')} disabled={busy || !isOn} danger />
          {probeable && <GhostBtn small label={busy ? '…' : 'Check now'} onClick={onCheck} disabled={busy} />}
        </div>
      </div>
    </div>
  );
}
