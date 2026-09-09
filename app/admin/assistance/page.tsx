'use client';
// app/admin/assistance/page.tsx — BLOCK 20 · CONCIERGE s1 · THE ADMIN QUEUE (A1-queue).
//
// Reads /api/v2/admin/assistance (dream-os 1feb1cc) through lib/admin-api/assistance.ts.
// Per category item: forward to a TDW vendor (search by trade + city, alphabetical,
// never ranked — roadmap §7) or to someone not on TDW (handle + WhatsApp number).
// The outsider arm is DARK on the server; the row shows `dark.reason` verbatim.
// Money via formatRs (the one money home, c-41.2). Palette: the cockpit's own `T`
// (every /admin page reads it; a second palette here would be a second home —
// the mock's Graphite was the frame's stand-in, named in the handover).
// No persona name in chrome. Admin strings as accepted at the A1 veto (§2).

import { useCallback, useEffect, useMemo, useState } from 'react';
import { formatRs } from '@/lib/vendor/format';
import {
  PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, FilterPills, SectionDivider, BottomSheet, LoadingGrid, StatCard,
} from '../_components/AdminUI';
import {
  listAssistance, getAssistance, searchAssistVendors, forwardToVendor, forwardToProspect, closeAssistance, createAssistanceTyped,
  type AssistRequestRow, type AssistDetail, type AssistStatus, type AssistVendorTarget,
} from '@/lib/admin-api/assistance';
import { ASSIST_ROWS } from '@/lib/frost-api/assistance';

const CATEGORY_WORD: Record<string, string> = Object.fromEntries(ASSIST_ROWS.map(r => [r.category, r.label]));
const word = (c: string) => CATEGORY_WORD[c] || c;
// formatRs already carries the `Rs ` prefix (lib/vendor/format.ts CURRENCY_PREFIX) — F-41.28.
const rs = (n: number | null | undefined) => (n === null || n === undefined ? 'Rs —' : formatRs(n));
const when = (iso: string) => { const d = new Date(iso); return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' · ' + d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' }); };
const dateWord = (iso: string | null) => { if (!iso) return 'date TBD'; const d = new Date(iso + 'T00:00:00'); return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); };

// F-41.27: the door's named refusals in the founder's words; anything else is the server's sentence.
const REFUSAL_WORDS: Record<string, string> = {
  peer_already_has:   'She already has this vendor\u2019s enquiry \u2014 pick another.',
  vendor_unavailable: 'That vendor cannot receive forwards right now (paused, hidden, or not active).',
  closed:             'This request is closed.',
  no_phone:           'A ten-digit WhatsApp number is needed.',
  ambiguous_prospect: 'Two prospects share those ten digits \u2014 resolve in Prospects first.',
  not_found:          'That item no longer exists.',
};
const refusalText = (e: any): string => (e && e.code && REFUSAL_WORDS[e.code]) || (e && e.message) || 'Forward refused';

// ── F-41.62 · A META CODE IS NOT A SENTENCE ────────────────────────────────────
// The outsider send's synchronous refusal comes back on the SUCCESS shape, not as
// a thrown error: the writer's catch returns `ok:true` with the code on the row,
// so the door answers 201 and `AdminApiError` never constructs. REFUSAL_WORDS
// above is keyed on the door's refusal codes and is never reached by these. This
// is their own home, keyed on what the row carries.
// S2-5, ratified by the chair 2026-09-09 under R-41.98: one sentence, the reason
// then the next step. The bare code never renders — it lives in the log and on
// the row, where it is for the founder to grep, not for him to decode on glass.
const FORWARD_CODE_WORDS: Record<string, string> = {
  '131049':     'Meta\u2019s marketing limit blocked this number. Forward someone else.',
  // F-41.81: written by the boot reconciler, never by Meta. A send whose process
  // died mid-flight. It must not read as a Meta refusal, because Meta never answered.
  interrupted:  'The send was interrupted before it left. Forward again.',
  no_vendor_phone: 'That vendor has no WhatsApp number on file.',
};
// A status word the founder should read as final, with no code to explain it.
// ── R-41.133 / R-41.135 · THE TICK'S BYTES, CHAIR-VETOED 2026-09-09 ──────────
// One home for all three. The LABEL is what the founder reads; the SENTENCE is what
// Meta would read. They must say the same thing, which is why the chair vetoed them
// together after the first draft's label promised only consent while the record
// claimed both limbs. Both name limb (a) — she GAVE the number — and limb (b) — she
// AGREED to be messaged.
//
// ⚠ THE SENTENCE IS TDW SPEAKING, IN THE THIRD PERSON, ON PURPOSE. It is never her
// words from a tick: that was the boolean 0156 refused, wearing her name. The source
// word `founder_attested` is what marks it as TDW's, and 0157 is what admits it.
const CONSENT_TICK_LABEL = 'I asked her for this number and she said yes.';
const CONSENT_ATTESTED_TEXT = 'Founder asked her for this number and she gave it and agreed to be messaged.';
const CONSENT_ATTESTED_SOURCE = 'founder_attested';
// R-41.135 — one word for any record at all. The founder does not need to know WHICH
// kind he has; he needs to know whether one exists. The distinction between her words
// and TDW's attestation is kept in the COLUMN, where Meta would read it, and is not
// spent on the queue. Nothing renders when there is none: no caution ink, no refusal.
const CONSENT_NOTED = 'Consent noted';

const FORWARD_STATUS_WORDS: Record<string, string> = {
  dark:  'Recorded, not sent. The outsider join alert is off.',
  sent:  'Sent.',
  delivered: 'Delivered.',
  read:  'Read.',
  recorded: 'Lead created.',
};
// The one sentence a forward row shows. Code first (it is the specific fact),
// then the status word, then the status verbatim so an unmapped word still reads.
// ── F-41.124 · AN UNKNOWN CODE GETS ITS OWN SENTENCE, NEVER A BORROWED ONE ──
// The map is keyed on the EXACT code and always was — but the `failed` fallback
// below used to be absent, so a 131008 fell through to nothing and the row showed
// the 131049 sentence from the line above it on the glass. A borrowed sentence is
// worse than a blank one: it told the founder Meta's MARKETING LIMIT had blocked a
// send that Meta had actually refused for a MISSING BUTTON PARAMETER, which is a
// different problem with a different fix. The generic line is deliberately dull and
// carries no mechanism, because naming the wrong mechanism is the defect.
function forwardWords(f: { status: string; error_code: string | null }): string {
  if (f.error_code && FORWARD_CODE_WORDS[f.error_code]) return FORWARD_CODE_WORDS[f.error_code];
  if (f.error_code || f.status === 'failed') return 'Meta refused this send. Try again.';
  return FORWARD_STATUS_WORDS[f.status] || f.status;
}

const STATUS_PILLS = [{ value: 'open', label: 'Open' }, { value: 'forwarded', label: 'Forwarded' }, { value: 'closed', label: 'Closed' }];
const statusInk: Record<AssistStatus, string> = { open: T.warning, forwarded: T.gold, closed: T.success };

export default function AssistancePage() {
  const [status, setStatus] = useState<AssistStatus>('open');
  const [rows, setRows] = useState<AssistRequestRow[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [fanout, setFanout] = useState(3);
  const [sel, setSel] = useState<AssistDetail | null>(null);
  const [toast, setToast] = useState<{ msg: string; error?: boolean } | null>(null);
  const [typed, setTyped] = useState(false);

  const load = useCallback(async () => {
    try {
      const d = await listAssistance(status);
      setRows(d.requests); setCounts(d.counts || {}); setFanout(d.fanout_default || 3);
    } catch (e: any) { setToast({ msg: e?.message || 'Could not load the queue', error: true }); setRows([]); }
  }, [status]);
  useEffect(() => { load(); }, [load]);

  const open = async (id: string) => {
    try { setSel(await getAssistance(id)); } catch (e: any) { setToast({ msg: e?.message || 'Could not open the request', error: true }); }
  };
  const refreshSel = async () => { if (sel) { try { setSel(await getAssistance(sel.request.id)); } catch { /* keep */ } } await load(); };

  return (
    <div style={{ padding: '0 0 80px' }}>
      <PageHeader title="Assistance requests" sub="Couples who asked The Dream Wedding to find and book their vendors." action={<GoldBtn label="+ Type a request" onClick={() => setTyped(true)} small />} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 8 }}>
        <StatCard label="Open" value={counts.open ?? 0} sub="not yet forwarded" accent />
        <StatCard label="Forwarded" value={counts.forwarded ?? 0} sub="at least one vendor asked" />
        <StatCard label="Closed" value={counts.closed ?? 0} sub="by hand" />
      </div>

      <SectionDivider label="The queue" />
      <FilterPills options={STATUS_PILLS} value={status} onChange={(v) => setStatus(v as AssistStatus)} />

      {rows === null ? <LoadingGrid /> : rows.length === 0 ? (
        <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.muted, padding: '18px 4px' }}>Nothing {status} right now.</div>
      ) : rows.map(r => (
        <div key={r.id} onClick={() => open(r.id)} style={{ padding: '14px 16px', marginTop: 10, borderRadius: 10, background: T.card, border: `0.5px solid ${T.border}`, cursor: 'pointer' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 500, color: T.ink }}>{r.name || (r.origin === 'admin' ? 'Typed by admin' : 'A couple')} · {r.phone}</div>
            <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: statusInk[r.status], alignSelf: 'center' }}>{r.status}</div>
          </div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginTop: 3 }}>{dateWord(r.wedding_date)} · {r.city || 'city not given'}{r.area ? ` · ${r.area}` : ''} · asked {when(r.created_at)}</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginTop: 3 }}>{r.items.map(i => `${word(i.category)} ${rs(i.budget_rs)}`).join(' · ')}</div>
        </div>
      ))}

      <BottomSheet visible={!!sel} onClose={() => setSel(null)} title={sel ? `${sel.request.name || 'A couple'} · ${sel.request.phone}` : ''}>
        {sel && <Detail detail={sel} fanout={fanout} onChanged={refreshSel} onToast={setToast} onClose={() => setSel(null)} />}
      </BottomSheet>

      <BottomSheet visible={typed} onClose={() => setTyped(false)} title="Type a request">
        {typed && <TypedIntake onDone={async () => { setTyped(false); await load(); }} onToast={setToast} />}
      </BottomSheet>

      {toast && <Toast msg={toast.msg} error={toast.error} onDone={() => setToast(null)} />}
    </div>
  );
}

function Detail({ detail, fanout, onChanged, onToast, onClose }: {
  detail: AssistDetail; fanout: number; onChanged: () => Promise<void>;
  onToast: (t: { msg: string; error?: boolean }) => void; onClose: () => void;
}) {
  const r = detail.request;
  return (
    <div>
      <div style={{ fontFamily: T.ff.body, fontSize: 12.5, color: T.soft, marginBottom: 12 }}>
        Wedding {dateWord(r.wedding_date)} · {r.city || 'city not given'}{r.area ? ` · ${r.area}` : ''} · asked {when(r.created_at)} · request <span style={{ color: T.muted }}>{r.id.slice(0, 8)}…</span>
      </div>
      {r.brief && (
        <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 6, padding: '12px 14px', marginBottom: 16 }}>
          <div style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: T.muted, marginBottom: 5 }}>The look</div>
          <div style={{ fontFamily: T.ff.body, fontSize: 13.5, color: T.soft, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{r.brief}</div>
        </div>
      )}
      {detail.items.map(item => (
        <ItemRow key={item.id} item={item} request={r} fanout={fanout} onChanged={onChanged} onToast={onToast} />
      ))}
      {r.status !== 'closed' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6, paddingBottom: ABOVE_ADMIN_BAR }}>
          <GhostBtn label="Close request" small onClick={async () => {
            try { await closeAssistance(r.id); onToast({ msg: 'Closed.' }); await onChanged(); onClose(); }
            catch (e: any) { onToast({ msg: e?.message || 'Could not close', error: true }); }
          }} />
          <span style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>Closing tells her nothing.</span>
        </div>
      )}
    </div>
  );
}

function ItemRow({ item, request, fanout, onChanged, onToast }: {
  item: AssistDetail['items'][number]; request: AssistDetail['request']; fanout: number;
  onChanged: () => Promise<void>; onToast: (t: { msg: string; error?: boolean }) => void;
}) {
  const [q, setQ] = useState('');
  const [hits, setHits] = useState<AssistVendorTarget[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [handle, setHandle] = useState('');
  const [phone, setPhone] = useState('');
  const [oname, setOname] = useState('');
  // R-41.135 — OPTIONAL. Unticked forwards still send (R-41.132: the record is
  // evidence, not a precondition) and simply carry no record.
  const [attested, setAttested] = useState(false);
  const [sheet, setSheet] = useState<null | 'vendor' | 'outsider'>(null);
  const closed = request.status === 'closed';
  const sentTo = useMemo(() => new Set(item.forwards.filter(f => f.vendor_id).map(f => f.vendor_id as string)), [item.forwards]);

  useEffect(() => {
    let live = true;
    searchAssistVendors({ category: item.category, city: request.city || undefined, q: q || undefined })
      .then(d => { if (live) setHits(d.vendors || []); })
      .catch(() => { if (live) setHits([]); });
    return () => { live = false; };
  }, [item.category, request.city, q]);

  const fwdVendor = async (v: AssistVendorTarget) => {
    setBusy(v.id);
    try {
      const out = await forwardToVendor(item.id, v.id);
      onToast({ msg: `Lead created for ${v.routing_handle || v.business_name}.` });
      setSheet(null);            // the row it wrote is behind this sheet
      await onChanged();
    } catch (e: any) { onToast({ msg: refusalText(e), error: true }); }
    setBusy(null);
  };
  const fwdOutsider = async () => {
    if (!phone.trim()) { onToast({ msg: 'A WhatsApp number is needed.', error: true }); return; }
    setBusy('outsider');
    try {
      const out = await forwardToProspect(item.id, {
        phone: phone.trim(), ig_handle: handle.trim() || undefined, name: oname.trim() || undefined,
        // Sent ONLY when he ticked it. An untouched box writes nothing at all —
        // never an empty string, which would read as a record that says nothing.
        ...(attested ? { consent_text: CONSENT_ATTESTED_TEXT, consent_source: CONSENT_ATTESTED_SOURCE } : {}),
      });
      // F-41.62: the same words on the toast as on the row, from the one map.
      // `dark.reason` is the switchboard's register grammar and is for the log.
      onToast({ msg: forwardWords(out.forward), error: out.forward.status === 'failed' });
      setHandle(''); setPhone(''); setOname('');
      setSheet(null);            // the row it wrote is behind this sheet
      await onChanged();
    } catch (e: any) { onToast({ msg: refusalText(e), error: true }); }
    setBusy(null);
  };

  const fwdWord = item.forwarded_count > 0 ? T.gold : T.muted;
  return (
    <div style={{ border: `0.5px solid ${T.border}`, borderRadius: 8, marginBottom: 12, background: T.card }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 14px', borderBottom: `0.5px solid ${T.border}` }}>
        <span style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 500, color: T.ink }}>{word(item.category)}</span>
        <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>{rs(item.budget_rs)}</span>
        <span style={{ marginLeft: 'auto', fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: fwdWord }}>{item.forwarded_count} of {fanout}</span>
      </div>

      {item.forwards.length > 0 && (
        <div style={{ padding: '8px 14px 0' }}>
          {item.forwards.map(f => (
            <div key={f.id} style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, padding: '4px 0' }}>
              {/* S2-4 ratified: the register key `source tdw_assist` is struck from the
                  glass (F-41.76, a second specimen of F-41.62's class). The three
                  state inks below are carried BYTE-UNCHANGED — colour is seat E's
                  under R-41.71 and this rider touches shape and words only. */}
              {f.target_kind === 'vendor'
                ? <><b style={{ color: T.ink, fontWeight: 500 }}>{f.vendor?.routing_handle || f.vendor?.business_name || f.vendor_id}</b> · Lead created. {when(f.created_at)}</>
                : <><b style={{ color: T.ink, fontWeight: 500 }}>{f.prospect?.ig_handle ? `@${f.prospect.ig_handle}` : f.prospect?.name || f.prospect?.phone || f.prospect_id}</b> · <span style={{ color: f.status === 'dark' ? T.warning : f.status === 'failed' ? T.danger : T.soft }}>{forwardWords(f)}</span>{f.consent && f.consent.state !== 'none' ? <> · {CONSENT_NOTED}</> : null} · {when(f.created_at)}</>}
            </div>
          ))}
        </div>
      )}

      {/* ── F-41.30 / F-41.58 · ONE COLUMN ─────────────────────────────────────
          The two-up grid put a search field, a name + @handle + city span and a
          button into ~180px at 374, and the founder's own glass showed it
          clipping: `Instagram handl`, `WhatsApp numl`, `Name, if you knc`
          (F-41.79, the walked specimen). The frame the chair vetoed is
          docs/mocks/TDW_20_CONCIERGE/concierge-s2-mock.html `F1-item-374` /
          `F5-item-430`: one column at both widths, each forward door a
          full-width control that opens its own sheet. The 430 arm does NOT
          bring the grid back — a desk is not the surface this queue is walked on.
          COLOUR: every T.* read below is carried byte-unchanged (R-41.101). */}
      {!closed && (
        <div style={{ display: 'grid', gap: 8, padding: '11px 13px' }}>
          <GhostBtn label={`Forward to a TDW vendor`} small disabled={!!busy} onClick={() => setSheet('vendor')} />
          <GhostBtn label="Forward to someone not on TDW" small disabled={!!busy} onClick={() => setSheet('outsider')} />
        </div>
      )}

      {/* The vendor wall, lifted out of the column (F2-wall-374). */}
      <BottomSheet visible={sheet === 'vendor'} onClose={() => setSheet(null)} title={`TDW vendors · ${word(item.category)}`}>
        <FieldInput label="" value={q} onChange={setQ} placeholder="Name or handle" />
        {hits.length === 0 && <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted }}>No matches.</div>}
        {hits.map(v => (
          <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '10px 2px', borderBottom: `0.5px solid ${T.border}` }}>
            <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink }}>{v.business_name}<span style={{ display: 'block', color: T.soft, fontSize: 11.5, marginTop: 2 }}>@{v.routing_handle} · {v.city || '—'}</span></span>
            {sentTo.has(v.id)
              ? <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted }}>Sent</span>
              : <GhostBtn label={busy === v.id ? '…' : 'Forward'} small disabled={!!busy} onClick={() => fwdVendor(v)} />}
          </div>
        ))}
        {/* S2-12 ratified: the partition made visible, and it is not a ranking. */}
        <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginTop: 10, paddingBottom: ABOVE_ADMIN_BAR }}>
          {request.city ? `${request.city} first, then everywhere else. A–Z within each.` : 'A–Z.'}
        </div>
      </BottomSheet>

      {/* The outsider fields, lifted out of the column (F3-outsider-374). */}
      <BottomSheet visible={sheet === 'outsider'} onClose={() => setSheet(null)} title="Someone not on TDW">
        <FieldInput label="Instagram handle" value={handle} onChange={setHandle} placeholder="@handle" />
        <FieldInput label="WhatsApp number" value={phone} onChange={setPhone} placeholder="10 digits" />
        <FieldInput label="Name" value={oname} onChange={setOname} placeholder="If you know it" />
        {/* ── R-41.133 / R-41.135 · ONE OPTIONAL TICK ────────────────────────
            Above Forward, because it is a thing he does BEFORE sending, not a
            setting. Optional: an unticked forward still sends and simply carries no
            record (R-41.132). The label and the stored sentence are one home apiece
            at the top of this file and say the same thing — both limbs of Meta's
            Messaging Policy §1, so the founder is never ticking something narrower
            than what gets written under his name. */}
        <button type="button" onClick={() => setAttested(v => !v)}
          style={{ display: 'flex', alignItems: 'flex-start', gap: 10, width: '100%', background: 'none',
                   border: 'none', padding: '4px 2px 10px', cursor: 'pointer', textAlign: 'left' }}>
          <span style={{ width: 16, height: 16, flexShrink: 0, marginTop: 1, borderRadius: 3,
                         border: `1px solid ${attested ? T.gold : T.muted}`,
                         background: attested ? T.gold : 'transparent' }} />
          <span style={{ fontFamily: T.ff.body, fontSize: 13, lineHeight: 1.45, color: attested ? T.ink : T.soft }}>
            {CONSENT_TICK_LABEL}
          </span>
        </button>
        <GoldBtn label={busy === 'outsider' ? '…' : 'Forward'} disabled={!!busy} onClick={fwdOutsider} />
        {/* S2-16, KEPT as drawn — the refusal, plain. */}
        {/* S2-16, KEPT as drawn — the refusal, plain. */}
        <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginTop: 10, lineHeight: 1.5, paddingBottom: ABOVE_ADMIN_BAR }}>
          They get one message to join. Her number stays with us until they do.
        </div>
      </BottomSheet>
    </div>
  );
}

// F-41.39 · `2026-12-22`, `22/12/2026`, `22-12-2026`, `22.12.2026` → `2026-12-22`; anything else → null.
// c-41.23 (R-41.86, seat C rider, seat A ratifies or reverts): NOT exported — a page.tsx may export only
// `default` and Next's reserved config fields; the named export failed Vercel's type check for three
// deploys (A9, the mock, C3). Nothing imported it. The proof reads the function by its declaration.
function normaliseDate(raw: string): string | null {
  const s = (raw || '').trim();
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (m) return s;
  m = s.match(/^(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{4})$/);
  if (!m) return null;
  const d = m[1].padStart(2, '0'), mo = m[2].padStart(2, '0'), y = m[3];
  const t = new Date(`${y}-${mo}-${d}T00:00:00`);
  if (isNaN(t.getTime()) || t.getDate() !== Number(d)) return null;
  return `${y}-${mo}-${d}`;
}

// F-41.40 · the sheet is `position:fixed` inside the admin content wrapper, which
// animates with a transform (`fade-up`), so its stacking context sits UNDER the
// bottom bar (zIndex 195) regardless of the sheet's own zIndex. The estate-wide
// fix is a portal in BottomSheet (named for the chair); here the form keeps its
// last control above the bar by its own bottom padding.
const ABOVE_ADMIN_BAR = 'calc(96px + env(safe-area-inset-bottom, 0px))';

function TypedIntake({ onDone, onToast }: { onDone: () => Promise<void>; onToast: (t: { msg: string; error?: boolean }) => void }) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const [date, setDate] = useState('');
  const [brief, setBrief] = useState('');
  const [budgets, setBudgets] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const items = Object.entries(budgets).filter(([, v]) => v.trim() !== '').map(([category, v]) => ({ category, budget_rs: parseInt(v.replace(/\D/g, ''), 10) || null }));

  return (
    <div style={{ paddingBottom: ABOVE_ADMIN_BAR }}>
      <FieldInput label="WhatsApp number" value={phone} onChange={setPhone} placeholder="10 digits" />
      <FieldInput label="Name" value={name} onChange={setName} placeholder="As she gave it" />
      <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" />
      <FieldInput label="Area" value={area} onChange={setArea} placeholder="optional" />
      {/* F-41.39: the date the request will carry is shown beside the label, and a hand-typed
          DD/MM/YYYY is accepted — the picker's typed digits do not always commit at 374. */}
      <FieldInput label="Wedding date" value={date} onChange={setDate} placeholder="YYYY-MM-DD or DD/MM/YYYY" hint={normaliseDate(date) ? `files as ${dateWord(normaliseDate(date))}` : (date ? 'not a date yet' : 'no date')} />
      <FieldInput label="The look" value={brief} onChange={setBrief} placeholder="Her words" />
      <SectionDivider label="Budget per category (whole rupees; blank = not asked)" />
      {ASSIST_ROWS.map(r => (
        <FieldInput key={r.category} label={r.label} value={budgets[r.category] || ''} onChange={v => setBudgets(b => ({ ...b, [r.category]: v }))} placeholder="Rs" />
      ))}
      <GoldBtn label={busy ? '…' : 'File the request'} disabled={busy || items.length === 0 || phone.replace(/\D/g, '').length < 10} onClick={async () => {
        setBusy(true);
        try {
          await createAssistanceTyped({ phone, name: name || undefined, city: city || undefined, area: area || undefined, wedding_date: normaliseDate(date) || undefined, brief: brief || undefined, items });
          onToast({ msg: 'Filed.' }); await onDone();
        } catch (e: any) { onToast({ msg: e?.message || 'Could not file', error: true }); }
        setBusy(false);
      }} />
    </div>
  );
}
