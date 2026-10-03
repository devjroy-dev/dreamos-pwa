'use client';
// ADM-1 · VENDORS, BEING REACHED (route kept: /admin/prospects). One page with Joined
// (/admin/makers). Every door and handler below is unchanged; the screen is redrawn: rows carry
// Send opener (tap again to send), See chat, Mark signed up, WhatsApp and Call; Delete, Remove
// from the list and Put back sit on the person's card, last, and ask again (CE-47 change 1).
// Adding numbers and the daily opener limit open as cards from the page head.
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
import { getVendors } from '@/lib/admin-api/index';
import { T, Toast, FieldInput, BottomSheet } from '../_components/AdminUI';
import { C, F, PageHead, Pill, RouteTabs, Stat, Chips, CountLine, List, Empty, PersonRow, ActionStrip, Sheet, SheetRow, SheetNote, DangerLast, when as whenWords, cap as capWord } from '../_components/Kit';

const BASE = `${API_BASE}/api/v2/admin/prospects`;

interface Prospect {
  id: string; phone: string; name: string | null; ig_handle: string | null;
  category: string | null; city: string | null; source: string | null;
  state: string; demo_vendor_ref: string | null;
  last_template_at: string | null; session_opened_at: string | null; created_at: string;
  // ── THE EXIT, RULED SERVER-SIDE (TDW_05 P3-D · R-30.13) ───────────────────
  // `exit_kind` is 'delete' | 'discard' | 'restore' | 'none' and it is STAMPED
  // BY THE ROUTER, never derived here. Two of the discriminator's four members
  // are columns on this row, but the third is a table this screen cannot see and
  // the fourth is a compliance rule about the opt-out register — so a screen-side
  // copy would be a second opinion about a state machine living in the other
  // repository, which is precisely what this page's header forbids. The button
  // offered and the answer the API would give cannot drift apart, because they
  // are the same computation.
  has_conversation?: boolean;
  exit_kind?: 'delete' | 'discard' | 'restore' | 'none';
}
interface Msg {
  id: string; direction: string; channel: string | null;
  body: string; sent_by: string | null; created_at: string;
}

// The one place a refusal key becomes a sentence a person can act on. The
// interface's voice: what happened, and what to do about it.
const REFUSAL: Record<string, string> = {
  already_registered:        'Already a vendor with us. This list is for people who have not joined yet.',
  missing_country_code:      'Add the country code: 91 and then the ten digits.',
  phone_required:            'A phone number is needed.',
  phone_not_numeric:         'That is not a phone number.',
  duplicate_phone:           'Already on the list.',
  registered_check_failed:   'Could not check that number against existing vendors. Nothing was added.',
  opted_out:                 'They opted out. Nothing sent.',
  already_contacted:         'Already messaged. Remove them from the list instead of deleting.',
  has_conversation:          'There is a chat with this number. Remove them from the list instead of deleting.',
  has_demo:                  'A demo was made for this number. Remove them from the list instead of deleting.',
  opted_out_locked:          'They opted out. This row stays as the record of that.',
  already_discarded:         'This number was removed. Put it back from the Removed list to add it again.',
  discarded:                 'This number was removed. Put it back on the list first to message them.',
  conversation_check_failed: 'Could not check whether there is a chat with this number. Nothing was deleted.',
  not_discarded:             'Only a removed number can be put back.',
};

// ── THE EXIT CONTROL'S THREE FACES — founder-vetoed 「 approve all 」 2026-08-11 ─
// One control per row, and WHICH one is the server's answer (`exit_kind`), so the
// founder is never offered a button that will refuse him. An opted-out row gets
// 'none' and renders NO control at all — a greyed button still says "this is a
// thing you might do to this row", and the ruling's whole point is that it is not.
const EXIT_LABEL: Record<string, string> = {
  delete:  'Delete',
  discard: 'Remove from the list',
  restore: 'Put back on the list',
};
const EXIT_CONFIRM: Record<string, string> = {
  delete:  'This number has never been messaged. The row is removed for good.',
  discard: 'They have already been messaged. The record stays, but the morning send never messages them again.',
  restore: 'They go back to waiting for the morning send, and it can message them again.',
};
const EXIT_TOAST: Record<string, string> = {
  delete:  'Deleted.',
  discard: 'Removed from the list.',
  restore: 'Put back on the list.',
};
// ── THE BOARD'S COPY BOOK — founder-vetoed 「 approve all 」 2026-08-12 ────────
// F-05.70's cure, arm (c). THE TILES WERE FIVE HARDCODED CARDS over eight states,
// and three states (replied · expired · discarded) had no tile at all — so a lane
// holding six prospects and four sent openers rendered FIVE ZEROS, witnessed by
// the founder against his own SQL in the same minute.
//
// THE MAP IS COPY; THE FALLBACK IS THE CLASS-CURE. Humanising the state key the
// way the pills do would render `templated` — jargon, a copy regression. So the
// curated labels are vetoed bytes and the fallback exists for the state nobody
// has named yet: a ninth state now RENDERS (with the server counting it, per
// R-30.23) instead of vanishing. The hardcoded list is retired, not extended.
// CE-47 note 1 (2 Oct 2026): the plain words of the approved design. ONE held back for the
// founder: `cold` reads "Waiting for the morning send", not "Not messaged yet", because a row put
// back after removal is cold AND was messaged (R-30.24); the drawn word would say the opposite.
const TILE_LABEL: Record<string, string> = {
  cold:       'Waiting for the morning send',
  templated:  'Opener sent',
  replied:    'Replied',
  in_session: 'Talking',
  converted:  'Signed up',
  opted_out:  'Opted out',
  expired:    'Window closed',
  discarded:  'Removed',
};
const TILE_SUB: Record<string, string> = {
  cold:       'the morning send messages them next',
  templated:  'no reply yet',
  in_session: 'Mira is talking to them',
  expired:    'the 24-hour reply window ran out',
  discarded:  'off the list, record kept',
};
// The unknown ninth: the pills' own humanising, so an unnamed state reads as
// something rather than as nothing.
const humanise = (s: string) => s.replace(/_/g, ' ');
const tileLabel = (state: string) => TILE_LABEL[state] ?? humanise(state);

const refusalLine = (code?: string, fallback?: string) =>
  (code && REFUSAL[code]) || fallback || 'That did not work.';


export default function ProspectsPage() {
  const [rows, setRows]         = useState<Prospect[]>([]);
  const [counts, setCounts]     = useState<Record<string, number>>({});
  const [openersSent, setOpenersSent] = useState<number | null>(null);
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
  const [confirmExit, setConfirmExit] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [capOpen, setCapOpen] = useState(false);
  const [joined, setJoined] = useState<number | null>(null);
  useEffect(() => { getVendors().then(d => setJoined(d.vendors.length)).catch(() => {}); }, []);

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
    if (board?.ok) {
      setRows(board.prospects || []); setCounts(board.counts || {});
      // `?? null` NEVER `?? 0`: a backend that has not shipped this field yet is
      // UNKNOWN, and rendering 0 over it would re-commit the exact false-zero this
      // cure exists to kill. The tile renders an em-dash for null.
      setOpenersSent(typeof board.openers_sent_total === 'number' ? board.openers_sent_total : null);
    }
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
    (r.inserted || []).forEach((x: { phone: string }) => lines.push(`Added: ${x.phone}`));
    (r.skipped  || []).forEach((p: string) => lines.push(`Already on the list: ${p}`));
    (r.refused  || []).forEach((x: { phone: string; error: string }) =>
      lines.push(`${refusalLine(x.error)} (${x.phone})`));
    (r.failed   || []).forEach((x: { phone: string | null; error: string }) =>
      lines.push(`${refusalLine(x.error)} (${x.phone || 'no number'})`));
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
  // ── THE EXIT, ONE HANDLER FOR THREE VERBS ─────────────────────────────────
  // The verb is the server's `exit_kind`; this function never decides it. A row
  // whose kind is 'none' or missing has no control rendered and cannot reach here
  // — the early return is belt-and-braces against a payload from an older backend
  // (the pwa deploys separately, so a screen ahead of its API is a real state).
  async function runExit(p: Prospect) {
    const kind = p.exit_kind;
    if (!kind || kind === 'none') return;
    setConfirmExit(null);
    const r = kind === 'delete'
      ? await call(`/${p.id}`, { method: 'DELETE' })
      : await call(`/${p.id}/${kind}`, { method: 'POST' });
    if (r?.ok) { setToast({ msg: EXIT_TOAST[kind] }); load(); }
    else setToast({ msg: refusalLine(r?.code, r?.error), error: true });
  }

  async function openThread(p: Prospect) {
    const r = await call(`/${p.id}/conversation`);
    if (r?.ok) setThread({ p, msgs: r.messages || [] });
    else setToast({ msg: r?.error || 'Could not open that conversation.', error: true });
  }

  const [openId, setOpenId] = useState<string | null>(null);
  const open = rows.find(r => r.id === openId) || null;
  const replying = (counts.replied || 0) + (counts.in_session || 0);
  const chips = [{ key: 'all', label: 'All' }].concat(Object.keys(counts).map(k => ({ key: k, label: tileLabel(k), n: counts[k] }) as { key: string; label: string }));
  const lineFor = (p: Prospect) => {
    const facts = [p.ig_handle, p.category, p.city].filter(Boolean).join(' · ');
    const last = p.session_opened_at || p.last_template_at || p.created_at;
    return (facts || 'No Instagram, trade or city yet. Mira has nothing of theirs to work with.') + ` · last activity ${whenWords(last)}`;
  };
  const tone = (st: string) => (st === 'replied' || st === 'in_session' ? C.ok : st === 'converted' ? C.accent : st === 'cold' ? C.warn : C.mute);

  return (
    <div>
      <PageHead title="Vendors" sub={`${openersSent ?? '—'} openers sent · ${replying} replying now`} action={<Pill onClick={() => setAdding(true)}>+ Add numbers</Pill>} />
      <RouteTabs active="/admin/prospects" items={[{ href: '/admin/makers', label: 'Joined', n: joined }, { href: '/admin/prospects', label: 'Being reached', n: Object.values(counts).reduce((a, b) => a + b, 0) }]} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 6px 6px 14px', borderRadius: 14, border: `0.5px solid ${C.line}`, marginBottom: 12, background: C.card }}>
        <span style={{ flex: 1, font: F.t4, color: C.soft }}>Openers go out each morning, up to <b style={{ color: C.ink }}>{cap === null ? '—' : cap}</b> a day</span>
        <button type="button" onClick={() => setCapOpen(true)} style={{ minHeight: 44, padding: '0 12px', background: 'none', border: 'none', color: C.accent, font: F.t4 }}>Change</button>
      </div>

      <div style={{ marginBottom: 12 }}><Stat label="Openers sent" value={openersSent ?? '—'} sub="every opener ever sent" /></div>
      <Chips value={state} onChange={setState} items={chips} />
      {state !== 'all' && TILE_SUB[state] && <div style={{ font: F.t4, color: C.mute, padding: '0 4px 10px' }}>{tileLabel(state)}: {TILE_SUB[state]}</div>}
      {loading ? (
        <List>{[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 96, borderBottom: `0.5px solid ${C.line}` }} />)}</List>
      ) : (
        <>
          <CountLine n={rows.length} one="person" many="people" />
          <List>
            {rows.length === 0 ? <Empty>No one here yet. Add numbers and they wait for the morning send.</Empty> : rows.map((p, i) => {
              const canSend = p.state !== 'opted_out' && p.state !== 'discarded';
              const canMark = p.state !== 'converted' && p.state !== 'opted_out' && p.state !== 'discarded';
              return (
                <PersonRow key={p.id} last={i === rows.length - 1} onOpen={() => { setConfirmSend(null); setOpenId(p.id); }}
                  name={p.name || p.phone} tag={tileLabel(p.state)} tagTone={tone(p.state)} line={lineFor(p)} phone={p.phone} bare>
                  <ActionStrip items={[
                    canSend && (confirmSend === p.id
                      ? { label: 'Tap again to send', primary: true, onClick: () => sendOpener(p) }
                      : { label: 'Send opener', primary: p.state === 'cold', onClick: () => { setConfirmExit(null); setConfirmSend(p.id); } }),
                    confirmSend === p.id && { label: 'Cancel', onClick: () => setConfirmSend(null) },
                    { label: 'See chat', onClick: () => openThread(p) },
                    canMark && { label: 'Mark signed up', onClick: () => markConverted(p) },
                  ]} />
                  {confirmSend === p.id && <div style={{ font: F.t4, color: C.warn, padding: '0 14px 12px' }}>This sends a real WhatsApp template to {p.phone}.</div>}
                </PersonRow>
              );
            })}
          </List>
        </>
      )}

      {open && (
        <Sheet title={open.name || open.phone} sub={[tileLabel(open.state), open.source || 'added by hand', `added ${whenWords(open.created_at)}`].join(' · ')} onClose={() => setOpenId(null)}>
          <SheetNote>{[open.phone, open.ig_handle ? '@' + open.ig_handle.replace(/^@/, '') : null, capWord(open.category), open.city].filter(Boolean).join(' · ') || open.phone}</SheetNote>
          <SheetRow label="See chat" onClick={() => openThread(open)} />
          {open.exit_kind === 'restore' && (
            <SheetRow label={confirmExit === open.id ? 'Tap again to put back' : EXIT_LABEL.restore} sub={EXIT_CONFIRM.restore}
              onClick={() => (confirmExit === open.id ? runExit(open).then(() => setOpenId(null)) : setConfirmExit(open.id))} />
          )}
          {(open.exit_kind === 'delete' || open.exit_kind === 'discard') && (
            <DangerLast label={EXIT_LABEL[open.exit_kind]} lost={EXIT_CONFIRM[open.exit_kind]} confirmWord={open.exit_kind === 'delete' ? 'Yes, delete' : 'Yes, remove'}
              onConfirm={async () => { await runExit(open); setOpenId(null); }} />
          )}
          {open.exit_kind === 'none' && <SheetNote>{REFUSAL.opted_out_locked}</SheetNote>}
        </Sheet>
      )}

      {adding && (
        <Sheet title="Add numbers" sub="They wait for the morning send" onClose={() => setAdding(false)}>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
            <FieldInput label="Phone" value={phone} onChange={setPhone} placeholder="91 98882 94440" hint="With the country code." />
            <FieldInput label="Name (optional)" value={name} onChange={setName} placeholder="Kanupriya" />
            <FieldInput label="Instagram (optional)" value={igHandle} onChange={setIgHandle} placeholder="kanupriyasethi.studio" hint="Gives Mira something of theirs to talk about." />
            <FieldInput label="Trade (optional)" value={category} onChange={setCategory} placeholder="photography" />
            <FieldInput label="City (optional)" value={city} onChange={setCity} placeholder="Chandigarh" />
            <Pill onClick={addOne} disabled={busy || !phone.trim()}>{busy ? 'Adding…' : 'Add this number'}</Pill>
          </div>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
            <div style={{ font: F.t4, color: C.mute, marginBottom: 8 }}>Or paste a list, one per line: phone, name, instagram, trade, city</div>
            <textarea value={paste} onChange={e => setPaste(e.target.value)} rows={5}
              placeholder={'919888294440\nKanupriya, 919000000123\n919000000456, Meher, meherstudio, photography, Jaipur'}
              style={{ width: '100%', background: C.input, border: `1px solid ${C.inputLine}`, borderRadius: 12, padding: '12px 14px', color: C.ink, font: F.t3, outline: 'none', resize: 'vertical', marginBottom: 10 }} />
            <Pill onClick={addMany} disabled={busy || !paste.trim()}>{busy ? 'Adding…' : 'Add all'}</Pill>
            {pasteResult && (
              <div style={{ marginTop: 12 }}>
                {pasteResult.map((l, i) => <div key={i} style={{ font: F.t4, padding: '3px 0', color: l.startsWith('Added') ? C.ok : C.soft }}>{l}</div>)}
                <button type="button" onClick={() => setPasteResult(null)} style={{ minHeight: 44, background: 'none', border: 'none', color: C.accent, font: F.t4 }}>Clear</button>
              </div>
            )}
          </div>
        </Sheet>
      )}

      {capOpen && (
        <Sheet title="Openers per day" sub={`Now ${cap === null ? '—' : cap} a day`} onClose={() => setCapOpen(false)}>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
            <p style={{ font: F.t4, color: C.soft, margin: '0 0 10px' }}>Currently {cap === null ? '—' : cap} a day</p>
            <FieldInput label="Openers per day" value={capDraft} onChange={setCapDraft} type="text" />
            <p style={{ font: F.t4, color: C.mute, margin: '0 0 12px' }}>How many people waiting for the morning send get an opener each day. Set it to 0 to send none: the morning job still runs and sends nothing.</p>
            <Pill onClick={async () => { await saveCap(); setCapOpen(false); }}>Save</Pill>
          </div>
        </Sheet>
      )}

      <BottomSheet visible={!!thread} onClose={() => setThread(null)} title={thread ? (thread.p.name || thread.p.phone) : ''}>
        {thread && thread.msgs.length === 0 && (
          <p style={{ fontFamily: T.ff.body, fontSize: 14, color: T.muted }}>Nothing yet. The chat starts when they reply to the opener.</p>
        )}
        {thread && thread.msgs.map(m => {
          const outbound = m.direction === 'outbound';
          return (
            <div key={m.id} style={{ marginBottom: 14, textAlign: outbound ? 'right' : 'left' }}>
              <div style={{ font: F.t5, color: outbound ? C.accent : C.soft, marginBottom: 4 }}>{outbound ? 'Mira' : 'Them'} · {whenWords(m.created_at)}</div>
              <div style={{ display: 'inline-block', textAlign: 'left', maxWidth: '86%', background: C.card, border: `0.5px solid ${C.line}`, borderRadius: 12, padding: '10px 14px', font: F.t3, color: C.ink, whiteSpace: 'pre-wrap' }}>{m.body}</div>
            </div>
          );
        })}
      </BottomSheet>
      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </div>
  );
}
