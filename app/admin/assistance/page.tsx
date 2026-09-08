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
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 6 }}>
          <GhostBtn label="Close request" small onClick={async () => {
            try { await closeAssistance(r.id); onToast({ msg: 'Closed.' }); await onChanged(); onClose(); }
            catch (e: any) { onToast({ msg: e?.message || 'Could not close', error: true }); }
          }} />
          <span style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>Closing tells her nothing. She hears from us only when a vendor is found.</span>
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
      onToast({ msg: `Lead created for ${v.routing_handle || v.business_name} · source ${out.lead?.source || 'tdw_assist'}` });
      await onChanged();
    } catch (e: any) { onToast({ msg: refusalText(e), error: true }); }
    setBusy(null);
  };
  const fwdOutsider = async () => {
    if (!phone.trim()) { onToast({ msg: 'A WhatsApp number is needed.', error: true }); return; }
    setBusy('outsider');
    try {
      const out = await forwardToProspect(item.id, { phone: phone.trim(), ig_handle: handle.trim() || undefined, name: oname.trim() || undefined });
      onToast({ msg: out.dark ? `Recorded, not sent — ${out.dark.reason}` : `Recorded · ${out.forward.status}` });
      setHandle(''); setPhone(''); setOname('');
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
        <span style={{ marginLeft: 'auto', fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: fwdWord }}>Forwarded {item.forwarded_count} of {fanout}</span>
      </div>

      {item.forwards.length > 0 && (
        <div style={{ padding: '8px 14px 0' }}>
          {item.forwards.map(f => (
            <div key={f.id} style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, padding: '4px 0' }}>
              {f.target_kind === 'vendor'
                ? <>Lead created for <b style={{ color: T.ink, fontWeight: 500 }}>{f.vendor?.routing_handle || f.vendor?.business_name || f.vendor_id}</b> · source tdw_assist · {when(f.created_at)}</>
                : <>Not on TDW · <b style={{ color: T.ink, fontWeight: 500 }}>{f.prospect?.ig_handle ? `@${f.prospect.ig_handle}` : f.prospect?.name || f.prospect?.phone || f.prospect_id}</b> · <span style={{ color: f.status === 'dark' ? T.warning : f.status === 'failed' ? T.danger : T.soft }}>{f.status}</span>{f.error_code ? ` · ${f.error_code}` : ''} · {when(f.created_at)}</>}
            </div>
          ))}
        </div>
      )}

      {!closed && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ padding: '12px 14px' }}>
            <div style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>Forward to a TDW vendor · {word(item.category)}{request.city ? ` · ${request.city}` : ''}</div>
            <FieldInput label="" value={q} onChange={setQ} placeholder="name or handle" />
            {hits.length === 0 && <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted }}>No one on TDW matches yet.</div>}
            {hits.map(v => (
              <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 2px', borderBottom: `0.5px solid ${T.border}` }}>
                <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink }}>{v.business_name}<span style={{ color: T.soft, fontSize: 11.5, marginLeft: 6 }}>@{v.routing_handle} · {v.city || '—'}</span></span>
                {sentTo.has(v.id)
                  ? <span style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted }}>Sent</span>
                  : <GhostBtn label={busy === v.id ? '…' : 'Forward'} small disabled={!!busy} onClick={() => fwdVendor(v)} />}
              </div>
            ))}
          </div>
          <div style={{ padding: '12px 14px', borderLeft: `0.5px solid ${T.border}` }}>
            <div style={{ fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: T.muted, marginBottom: 8 }}>Forward to someone not on TDW</div>
            <FieldInput label="" value={handle} onChange={setHandle} placeholder="Instagram handle" />
            <FieldInput label="" value={phone} onChange={setPhone} placeholder="WhatsApp number" />
            <FieldInput label="" value={oname} onChange={setOname} placeholder="Name, if you know it" />
            <GhostBtn label={busy === 'outsider' ? '…' : 'Forward'} small disabled={!!busy} onClick={fwdOutsider} />
            <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginTop: 8, lineHeight: 1.5 }}>They get one message to join; her number stays with TDW until they do. While the join message is dark, the forward is recorded and nothing is sent — the row says so.</div>
          </div>
        </div>
      )}
    </div>
  );
}

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
    <div>
      <FieldInput label="WhatsApp number" value={phone} onChange={setPhone} placeholder="10 digits" />
      <FieldInput label="Name" value={name} onChange={setName} placeholder="As she gave it" />
      <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" />
      <FieldInput label="Area" value={area} onChange={setArea} placeholder="optional" />
      <FieldInput label="Wedding date" value={date} onChange={setDate} type="date" />
      <FieldInput label="The look" value={brief} onChange={setBrief} placeholder="Her words" />
      <SectionDivider label="Budget per category (whole rupees; blank = not asked)" />
      {ASSIST_ROWS.map(r => (
        <FieldInput key={r.category} label={r.label} value={budgets[r.category] || ''} onChange={v => setBudgets(b => ({ ...b, [r.category]: v }))} placeholder="Rs" />
      ))}
      <GoldBtn label={busy ? '…' : 'File the request'} disabled={busy || items.length === 0 || phone.replace(/\D/g, '').length < 10} onClick={async () => {
        setBusy(true);
        try {
          await createAssistanceTyped({ phone, name: name || undefined, city: city || undefined, area: area || undefined, wedding_date: date || undefined, brief: brief || undefined, items });
          onToast({ msg: 'Filed.' }); await onDone();
        } catch (e: any) { onToast({ msg: e?.message || 'Could not file', error: true }); }
        setBusy(false);
      }} />
    </div>
  );
}
