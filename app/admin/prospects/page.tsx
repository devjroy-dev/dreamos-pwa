'use client';
// app/admin/prospects/page.tsx
// Admin: the prospect console — the marketing lane's intake, board and dial.
//
// TDW_08 P5, CE-ruled 2026-08-04. The API has existed and been mounted since
// Block 05 P3 (`/api/v2/admin/prospects`, eight routes) and has had NO screen at
// all: every prospect on this lane was loaded by SQL or by n8n, and the board
// existed only as rows in Supabase.
//
// ── WHY THIS SHIPS BEFORE THE ACCEPTANCE EVENINGS, NOT AFTER ────────────────
// The founder's walk card opens with two acts that were console steps in
// everything but name: load the evening's fixture number, and fire the opener at
// it. With this screen they are thumb steps, so testing night runs from the
// phone — and the screen takes its own live witness the same evening it ships.
//
// ── EVERY NUMBER ON THIS PAGE COMES FROM THE WIRE ───────────────────────────
// The state counts are the server's (`counts` on GET /), the cap is the server's
// (GET /cap), and the state vocabulary is rendered from the counts object rather
// than enumerated here. A hardcoded state list would make this screen a second
// opinion about a state machine that lives in the other repository — the demo
// console's own law, and the reason its board reads its columns off the wire.
//
// ── ERROR KEYS, NEVER ERROR PROSE ───────────────────────────────────────────
// `already_registered`, `missing_country_code`, `duplicate_phone` and the rest
// are matched on `code`. The server's sentence is rendered when there is no key
// worth a screen-side line, so the backend can reword a refusal without a
// deploy here.

import { useEffect, useState, useCallback } from 'react';
import { adminHeaders, API_BASE } from '@/lib/admin-api/_base';
import {
  PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput,
  FilterPills, Row, SectionDivider, BottomSheet, LoadingGrid, StatCard,
} from '../_components/AdminUI';

const BASE = `${API_BASE}/api/v2/admin/prospects`;

interface Prospect {
  id: string; phone: string; name: string | null; ig_handle: string | null;
  category: string | null; city: string | null; source: string | null;
  state: string; demo_vendor_ref: string | null;
  last_template_at: string | null; session_opened_at: string | null; created_at: string;
}
interface Msg {
  id: string; direction: string; channel: string | null;
  body: string; sent_by: string | null; created_at: string;
}

// The one place a refusal key becomes a sentence a person can act on. The
// interface's voice: what happened, and what to do about it.
const REFUSAL: Record<string, string> = {
  already_registered:      'Already a vendor with us — this lane is for people who have not joined yet.',
  missing_country_code:    'Add the country code: 91 and then the ten digits.',
  phone_required:          'A phone number is needed.',
  phone_not_numeric:       'That is not a phone number.',
  duplicate_phone:         'Already on the board.',
  registered_check_failed: 'Could not check that number against existing vendors. Nothing was added.',
  opted_out:               'They opted out. Nothing sent.',
};
const refusalLine = (code?: string, fallback?: string) =>
  (code && REFUSAL[code]) || fallback || 'That did not work.';

const when = (iso: string | null) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    + ' · ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
};

export default function ProspectsPage() {
  const [rows, setRows]         = useState<Prospect[]>([]);
  const [counts, setCounts]     = useState<Record<string, number>>({});
  const [state, setState]       = useState('all');
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState<{ msg: string; error?: boolean } | null>(null);

  const [phone, setPhone]       = useState('');
  const [name, setName]         = useState('');
  // F-08.83 limb 2 — the API has taken these three since Block 05 and the form
  // never rendered them. A prospect added with her handle and city arms the
  // specificity the soul was built around; without them the context tells Mira
  // "you know nothing about their work" and she asks instead of selling. The
  // founder's own first live evening was three questions on a bare row.
  const [igHandle, setIgHandle] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity]         = useState('');
  const [paste, setPaste]       = useState('');
  const [pasteResult, setPasteResult] = useState<string[] | null>(null);
  const [busy, setBusy]         = useState(false);

  const [cap, setCap]           = useState<number | null>(null);
  const [capDraft, setCapDraft] = useState('');

  const [thread, setThread]     = useState<{ p: Prospect; msgs: Msg[] } | null>(null);
  const [confirmSend, setConfirmSend] = useState<string | null>(null);

  const call = useCallback(async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${BASE}${path}`, { ...opts, headers: adminHeaders() });
    return res.json();
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    const [board, capRes] = await Promise.all([
      call(`/?state=${state}&limit=200`),
      call('/cap'),
    ]);
    if (board?.ok) { setRows(board.prospects || []); setCounts(board.counts || {}); }
    if (capRes?.ok) { setCap(capRes.cap); setCapDraft(String(capRes.cap)); }
    setLoading(false);
  }, [call, state]);

  useEffect(() => { load(); }, [load]);

  // ── Intake ────────────────────────────────────────────────────────────────
  async function addOne() {
    if (!phone.trim() || busy) return;
    setBusy(true);
    const r = await call('/', { method: 'POST', body: JSON.stringify({
      phone, name: name || null, ig_handle: igHandle || null,
      category: category || null, city: city || null,
    }) });
    setBusy(false);
    if (r?.ok) {
      setPhone(''); setName(''); setIgHandle(''); setCategory(''); setCity('');
      setToast({ msg: 'Added to the board' }); load();
    }
    else setToast({ msg: refusalLine(r?.code, r?.error), error: true });
  }

  // ONE NUMBER PER LINE, `name, phone` or a bare phone. Parsed here rather than
  // asking the founder to build JSON on a phone keyboard at eleven at night.
  // F-08.83 limb 2 — POSITIONAL: phone, name, handle, category, city. Trailing
  // fields are optional per line, so a bare phone still works and a full row
  // arms every specificity the soul has.
  //
  // THE TWO-FIELD SWAP SURVIVES, and it is a forgiving fallback rather than a
  // second format: `Kanupriya, 919000000123` is what a person actually types,
  // and the half with more digits is the phone. Beyond two fields the order is
  // the order — guessing across five columns would be a screen inventing data.
  function parsePaste(text: string) {
    const digits = (x: string) => (x.match(/\d/g) || []).length;
    return text.split('\n').map(l => l.trim()).filter(Boolean).map(line => {
      const p = line.split(',').map(x => x.trim());
      if (p.length === 2 && digits(p[1]) > digits(p[0])) return { phone: p[1], name: p[0] };
      return {
        phone: p[0],
        name:      p[1] || null,
        ig_handle: p[2] || null,
        category:  p[3] || null,
        city:      p[4] || null,
      };
    });
  }

  async function addMany() {
    const parsed = parsePaste(paste);
    if (!parsed.length || busy) return;
    setBusy(true);
    const r = await call('/bulk', { method: 'POST', body: JSON.stringify({ prospects: parsed }) });
    setBusy(false);
    if (!r?.ok) { setToast({ msg: r?.error || 'That list did not go through.', error: true }); return; }
    // PER-ROW RESULTS, because a bulk that reports only a count hides the row
    // that mattered — and on this door a refusal is the row that mattered.
    const lines: string[] = [];
    (r.inserted || []).forEach((x: { phone: string }) => lines.push(`Added — ${x.phone}`));
    (r.skipped  || []).forEach((p: string) => lines.push(`Already on the board — ${p}`));
    (r.refused  || []).forEach((x: { phone: string; error: string }) =>
      lines.push(`${refusalLine(x.error)} — ${x.phone}`));
    (r.failed   || []).forEach((x: { phone: string | null; error: string }) =>
      lines.push(`${refusalLine(x.error)} — ${x.phone || 'no number'}`));
    setPasteResult(lines);
    setPaste('');
    setToast({ msg: `${r.insertedCount} added` });
    load();
  }

  // ── The dial ──────────────────────────────────────────────────────────────
  async function saveCap() {
    const n = parseInt(capDraft, 10);
    if (!Number.isFinite(n) || n < 0) { setToast({ msg: 'The cap is a whole number, 0 or more.', error: true }); return; }
    const r = await call('/cap', { method: 'PATCH', body: JSON.stringify({ cap: n }) });
    if (r?.ok) { setCap(r.cap); setToast({ msg: `Cap set to ${r.cap}` }); }
    else setToast({ msg: r?.error || 'The cap did not save.', error: true });
  }

  // ── Per-row actions ───────────────────────────────────────────────────────
  async function sendOpener(p: Prospect) {
    setConfirmSend(null);
    const r = await call(`/${p.id}/send-opener`, { method: 'POST' });
    if (r?.ok) { setToast({ msg: `Opener sent to ${p.phone}` }); load(); }
    else setToast({ msg: refusalLine(r?.code, r?.error), error: true });
  }
  async function markConverted(p: Prospect) {
    const r = await call(`/${p.id}/mark-converted`, { method: 'POST' });
    if (r?.ok) { setToast({ msg: 'Marked converted' }); load(); }
    else setToast({ msg: refusalLine(r?.code, r?.error), error: true });
  }
  async function openThread(p: Prospect) {
    const r = await call(`/${p.id}/conversation`);
    if (r?.ok) setThread({ p, msgs: r.messages || [] });
    else setToast({ msg: r?.error || 'Could not open that conversation.', error: true });
  }

  const stateOptions = [{ value: 'all', label: `All ${rows.length ? '' : ''}` }]
    .concat(Object.keys(counts).map(s => ({ value: s, label: `${s.replace('_', ' ')} ${counts[s]}` })));

  return (
    <div style={{ padding: '0 0 80px' }}>
      <PageHeader
        title="Prospects"
        sub="The marketing lane — who Mira has met, and who she has not."
      />

      {/* ── THE BOARD AT A GLANCE ─────────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 8 }}>
        <StatCard label="Cold"        value={counts.cold ?? 0}       sub="no opener sent yet" />
        <StatCard label="Opener sent" value={counts.templated ?? 0} />
        <StatCard label="In session"  value={counts.in_session ?? 0} sub="Mira is talking to them" accent />
        <StatCard label="Converted"   value={counts.converted ?? 0} />
        <StatCard label="Opted out"   value={counts.opted_out ?? 0} />
      </div>

      {/* ── THE DIAL ──────────────────────────────────────────────────────── */}
      <SectionDivider label="Daily opener cap" />
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, flexWrap: 'wrap' }}>
        <div style={{ minWidth: 140 }}>
          <FieldInput label="Openers per day" value={capDraft} onChange={setCapDraft} type="text" />
        </div>
        <div style={{ paddingBottom: 18 }}><GoldBtn label="Save cap" onClick={saveCap} small /></div>
        <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, maxWidth: 460, paddingBottom: 20, margin: 0 }}>
          How many cold prospects the morning job may send an opener to. Set it to 0 to send none —
          the job still runs, and sends nothing. Currently {cap === null ? '—' : cap}.
        </p>
      </div>

      {/* ── INTAKE ────────────────────────────────────────────────────────── */}
      <SectionDivider label="Add prospects" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, alignItems: 'end' }}>
        <FieldInput label="Phone" value={phone} onChange={setPhone} placeholder="91 98882 94440" hint="With the country code." />
        <FieldInput label="Name (optional)" value={name} onChange={setName} placeholder="Kanupriya" />
        <FieldInput label="Instagram (optional)" value={igHandle} onChange={setIgHandle} placeholder="kanupriyasethi.studio" hint="Arms what Mira can say about their work." />
        <FieldInput label="Trade (optional)" value={category} onChange={setCategory} placeholder="photography" />
        <FieldInput label="City (optional)" value={city} onChange={setCity} placeholder="Chandigarh" />
        <div style={{ paddingBottom: 18 }}>
          <GoldBtn label={busy ? 'Adding…' : 'Add prospect'} onClick={addOne} disabled={busy || !phone.trim()} />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <div style={{ fontFamily: T.ff.label, fontSize: 10, fontWeight: 600, letterSpacing: '0.13em', textTransform: 'uppercase', color: T.soft, marginBottom: 10 }}>
          Or paste a list
        </div>
        <textarea
          value={paste}
          onChange={e => setPaste(e.target.value)}
          placeholder={'One per line — phone, name, instagram, trade, city\n919888294440\nKanupriya, 919000000123\n919000000456, Meher, meherstudio, photography, Jaipur'}
          rows={5}
          style={{
            width: '100%', background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12,
            padding: '14px 16px', color: T.ink, fontFamily: T.ff.body, fontSize: 14,
            outline: 'none', resize: 'vertical',
          }}
        />
        <div style={{ marginTop: 12 }}>
          <GoldBtn label={busy ? 'Adding…' : 'Add all'} onClick={addMany} disabled={busy || !paste.trim()} />
        </div>
        {pasteResult && (
          <div style={{ marginTop: 16, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '12px 16px' }}>
            {pasteResult.map((l, i) => (
              <div key={i} style={{
                fontFamily: T.ff.body, fontSize: 13, padding: '4px 0',
                color: l.startsWith('Added') ? T.success : T.soft,
              }}>{l}</div>
            ))}
            <div style={{ marginTop: 10 }}>
              <GhostBtn label="Clear" onClick={() => setPasteResult(null)} small />
            </div>
          </div>
        )}
      </div>

      {/* ── THE BOARD ─────────────────────────────────────────────────────── */}
      <SectionDivider label="The board" />
      <FilterPills options={stateOptions} value={state} onChange={setState} />

      {loading ? <LoadingGrid /> : rows.length === 0 ? (
        <p style={{ fontFamily: T.ff.body, fontSize: 14, color: T.muted }}>
          No one here yet. Add a number above and it lands on the board as cold.
        </p>
      ) : rows.map(p => (
        <Row key={p.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ minWidth: 200 }}>
              <div style={{ fontFamily: T.ff.body, fontSize: 15, color: T.ink }}>
                {p.name || p.phone}{p.name && <span style={{ color: T.muted }}> · {p.phone}</span>}
              </div>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.soft, marginTop: 6 }}>
                {p.state.replace('_', ' ')} · {p.source || 'manual'} · last activity {when(p.session_opened_at || p.last_template_at || p.created_at)}
              </div>
              {/* WHAT SHE HAS TO WORK WITH — rendered only when it exists, so a
                  bare row LOOKS bare and the founder can see the gap he is
                  handing her. Absence is the signal. */}
              {(p.ig_handle || p.category || p.city) ? (
                <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted, marginTop: 5 }}>
                  {[p.ig_handle, p.category, p.city].filter(Boolean).join(' · ')}
                </div>
              ) : (
                <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.dim, marginTop: 5 }}>
                  No handle, trade or city — Mira has nothing of theirs to work with.
                </div>
              )}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {confirmSend === p.id
                ? <GoldBtn label="Send it" onClick={() => sendOpener(p)} small />
                : <GhostBtn label="Send opener" onClick={() => setConfirmSend(p.id)} small disabled={p.state === 'opted_out'} />}
              {confirmSend === p.id && <GhostBtn label="Cancel" onClick={() => setConfirmSend(null)} small />}
              <GhostBtn label="Conversation" onClick={() => openThread(p)} small />
              <GhostBtn label="Converted" onClick={() => markConverted(p)} small disabled={p.state === 'converted' || p.state === 'opted_out'} />
            </div>
          </div>
          {confirmSend === p.id && (
            <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.warning, marginTop: 10 }}>
              This sends a real WhatsApp template to {p.phone}.
            </div>
          )}
        </Row>
      ))}

      {/* ── THE THREAD ────────────────────────────────────────────────────── */}
      <BottomSheet visible={!!thread} onClose={() => setThread(null)} title={thread ? (thread.p.name || thread.p.phone) : ''}>
        {thread && thread.msgs.length === 0 && (
          <p style={{ fontFamily: T.ff.body, fontSize: 14, color: T.muted }}>
            Nothing yet. The conversation starts when they reply to the opener.
          </p>
        )}
        {thread && thread.msgs.map(m => {
          const outbound = m.direction === 'outbound';
          return (
            <div key={m.id} style={{ marginBottom: 14, textAlign: outbound ? 'right' : 'left' }}>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: outbound ? T.gold : T.soft, marginBottom: 4 }}>
                {outbound ? 'Mira' : 'Them'} · {when(m.created_at)}
              </div>
              <div style={{
                display: 'inline-block', textAlign: 'left', maxWidth: '86%',
                background: outbound ? T.goldSoft : T.card,
                border: `0.5px solid ${outbound ? T.borderStrong : T.border}`,
                borderRadius: 12, padding: '10px 14px',
                fontFamily: T.ff.body, fontSize: 14, color: T.ink, whiteSpace: 'pre-wrap',
              }}>{m.body}</div>
            </div>
          );
        })}
      </BottomSheet>

      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </div>
  );
}
