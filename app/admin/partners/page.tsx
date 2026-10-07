'use client';
// app/admin/partners/page.tsx · CE-47 · PTN-A1 app · More > Partners: Unverified, Verified, Blocked, Reports (r4: the founder's
// words for the mark, 7 Oct 2026; the admin always sees the state, whatever the switch).
// One partner's sheet: links, people (WhatsApp and Call from the Kit), the connections line, and Mark as verified, Block
// (with a reason, asked first), Unblock, Exempt from the plan. Doors: dream-os /api/v2/admin/partners (PTN-A1 server).
import { useCallback, useEffect, useState } from 'react';
import { adminGet, adminPost } from '@/lib/admin-api/_base';
import { PageHead, Tabs, List, PersonRow, Pill, Sheet, SheetNote, ActionStrip, Empty, C, F } from '../_components/Kit';
import { PartnerLinks } from '../_components/PartnerLinks';

type Row = { id: string; name: string; kind_words: string; cities: string[]; instagram_handle: string; instagram_url: string | null; website_url: string | null;
  check_state: string; plan_state: string; hidden_by_reports: boolean; reports_open: number; connections_line: string; blocked_reason: string | null; created_at: string; calls_email: string | null };
type One = { partner: Row; people: { name: string | null; phone: string | null; role: string }[]; reports: { id: string; reason: string; note: string | null; handled_at: string | null }[] };
const TAB_WORDS: Record<string, string> = { unchecked: 'Unverified', checked: 'Verified', blocked: 'Blocked', reports: 'Reports' };
const REASON: Record<string, string> = { fake: 'Not who they say', asked_for_money: 'Asked for money', unsafe_or_rude: 'Unsafe or rude', other: 'Other' };
const tagOf = (r: Row) => r.check_state === 'blocked' ? 'Blocked' : r.hidden_by_reports ? 'Hidden after 3 reports' : r.check_state === 'checked' ? 'Verified' : 'Unverified';

export default function PartnersAdmin() {
  const [tab, setTab] = useState('unchecked');
  const [rows, setRows] = useState<Row[] | null>(null);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [open, setOpen] = useState<One | null>(null);
  const [reason, setReason] = useState('');
  const [err, setErr] = useState<string | null>(null);
  const load = useCallback(async () => {
    try { const d = await adminGet<{ partners: Row[]; counts: Record<string, number> }>(`/api/v2/admin/partners/?tab=${tab}`); setRows(Array.isArray(d && d.partners) ? d.partners : []); setCounts((d && d.counts) || {}); }
    catch (e) { setErr(e instanceof Error ? e.message : 'Could not read partners.'); setRows([]); }
  }, [tab]);
  useEffect(() => { void load(); }, [load]);
  const openOne = async (id: string) => { setErr(null); setReason(''); try { setOpen(await adminGet<One>(`/api/v2/admin/partners/${id}`)); } catch (e) { setErr(e instanceof Error ? e.message : 'Could not open.'); } };
  const act = async (path: string, body?: unknown) => {
    if (!open) return; setErr(null);
    try { await adminPost(`/api/v2/admin/partners/${open.partner.id}/${path}`, body); await openOne(open.partner.id); await load(); }
    catch (e) { setErr(e instanceof Error ? e.message : 'That did not work. Try again.'); }
  };
  const p = open && open.partner;
  return (
    <div>
      <PageHead title="Partners" sub="Organisations that get collab calls or post work for vendors" action={<Pill href="/admin/partners/forward">Forward a request</Pill>} />
      <Tabs items={(['unchecked', 'checked', 'blocked', 'reports'] as const).map((k) => ({ key: k, label: TAB_WORDS[k], n: k === 'reports' ? null : counts[k] ?? null }))} value={tab} onChange={setTab} />
      {err && !open ? <p style={{ font: F.t4, color: C.bad, padding: '8px 14px' }}>{err}</p> : null}
      {rows === null ? null : rows.length === 0 ? <Empty>No partners here.</Empty> : (
        <List>{rows.map((r, i) => (
          <PersonRow key={r.id} name={r.name} tag={tagOf(r)} tagTone={r.check_state === 'blocked' ? C.bad : r.hidden_by_reports ? C.warn : C.accent}
            line={`${r.kind_words}${(r.cities || []).length ? ` · ${(r.cities || []).join(', ')}` : ''}${r.reports_open ? ` · ${r.reports_open} report${r.reports_open === 1 ? '' : 's'}` : ''}`}
            onOpen={() => { void openOne(r.id); }} last={i === rows.length - 1}>
            <PartnerLinks handle={r.instagram_handle} instagramUrl={r.instagram_url} websiteUrl={r.website_url} />
          </PersonRow>))}</List>
      )}
      {open && p ? (
        <Sheet title={p.name} sub={`${p.kind_words} · ${tagOf(p)}`} onClose={() => setOpen(null)}>
          <PartnerLinks handle={p.instagram_handle} instagramUrl={p.instagram_url} websiteUrl={p.website_url} />
          <SheetNote>Proved by Instagram login: not yet (waiting for Meta). Blue tick: not read yet.</SheetNote>
          {(open.people || []).map((m, i) => <PersonRow key={i} name={`${m.name || 'No name yet'}${m.role === 'owner' ? ' (owner)' : ''}`} phone={m.phone} last={i === (open.people || []).length - 1} />)}
          {p.calls_email ? <SheetNote>Calls go to <a href={`mailto:${p.calls_email}`} style={{ color: C.accent }}>{p.calls_email}</a>.</SheetNote> : null}
          <SheetNote>{p.connections_line}</SheetNote>
          {(open.reports || []).filter((x) => !x.handled_at).map((x) => <SheetNote key={x.id} tone={C.warn}>Report: {REASON[x.reason] || x.reason}{x.note ? `. ${x.note}` : ''}</SheetNote>)}
          {p.blocked_reason ? <SheetNote tone={C.bad}>Blocked: {p.blocked_reason}</SheetNote> : null}
          {err ? <SheetNote tone={C.bad}>{err}</SheetNote> : null}
          <ActionStrip items={[
            p.check_state !== 'checked' && p.check_state !== 'blocked' && { label: 'Mark as verified', primary: true, onClick: () => { void act('check'); } },
            p.check_state === 'blocked' && { label: 'Unblock', onClick: () => { void act('unblock'); } },
            { label: p.plan_state === 'exempt' ? 'Remove the exemption' : 'Exempt from the plan', onClick: () => { void act('exempt', { on: p.plan_state !== 'exempt' }); } },
          ]} />
          {p.check_state !== 'blocked' ? (
            <div style={{ padding: '0 14px 12px' }}>
              <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Why it is blocked" aria-label="Why it is blocked"
                style={{ width: '100%', minHeight: 44, padding: '0 12px', borderRadius: 12, border: `0.5px solid ${C.inputLine}`, background: C.input, font: F.t3, marginBottom: 8 }} />
              <ActionStrip items={[{ label: 'Block', onClick: () => { if (!reason.trim()) { setErr('Write why this partner is blocked.'); return; } if (window.confirm(`Block ${p.name}? Its page and everything it posted disappear at once.`)) void act('block', { reason }); } }]} />
            </div>
          ) : null}
        </Sheet>
      ) : null}
    </div>
  );
}
