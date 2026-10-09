'use client';
// ADM-1 · HOME ("Today"). What Dev reads every day: growth, who to call now, what is waiting.
// SIX REQUESTS, fired together (allSettled), every one a door the portal already calls:
//   1 GET bridge  2 GET vendors  3 GET couples  4 GET demo/claims  5 GET prospects
//   6 GET photos/queue?state=pending
// The open help count is the shell's own answer (one assistance call for the badge and Home),
// read through OpenHelpContext: eight requests became seven for the whole screen.
// A failure blanks only its own figure ("—"). Every number names what it counts.
//
// WHAT THIS PAGE CARRIES FORWARD. The Bridge (TDW_10 P2) retired the old four-tile
// "dashboard-HALF" (F-07.95) because a failed call became an empty list, the empty list a zero,
// and the zero a confident tile (F-07.90: "DISCOVER QUEUE · 0" was a 401 thrown away). This Home
// fans out again, by ruling (CE-47 ruling 5: few requests, in parallel), so the doctrine is kept
// at every figure: `0` is an ANSWER, `—` is the absence of one. Nothing here starts at 0 or []:
// each figure starts null and stays null if its door fails, and the call list says it could not
// load rather than "nobody waiting". The full Bridge, with its HONEST states for figures that
// cannot exist yet (revenue, F-10.1), is unchanged at /admin/numbers.
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { getBridge, type BridgeResponse } from '@/lib/admin-api/bridge';
import { getVendors, getCouples, getPhotoQueue, type AdminVendor, type AdminCouple } from '@/lib/admin-api/index';
import { adminGet } from '@/lib/admin-api/_base';
import { formatRs } from '@/lib/vendor/format';
import { C, F, PageHead, Stat, Group, NavRow, PersonRow, Empty, when, fullDate, cap, OpenHelpContext } from './_components/Kit';

type Claim = { id: string; vendor_name: string | null; ig_handle: string; phone: string; claimed_at: string; contacted: boolean };
type Prospect = { id: string; name: string | null; phone: string; category: string | null; city: string | null; state: string; session_opened_at: string | null; last_template_at: string | null };

export default function HomePage() {
  const [b, setB] = useState<BridgeResponse | null>(null);
  const [vendors, setVendors] = useState<AdminVendor[] | null>(null);
  const [dreamers, setDreamers] = useState<AdminCouple[] | null>(null);
  const [claims, setClaims] = useState<Claim[] | null>(null);
  const [pros, setPros] = useState<Prospect[] | null>(null);
  const [sent, setSent] = useState<number | null>(null);
  const help = useContext(OpenHelpContext);
  const [photos, setPhotos] = useState<number | null>(null);

  useEffect(() => {
    void Promise.allSettled([
      getBridge().then(setB),
      getVendors().then(d => setVendors(d.vendors)),
      getCouples().then(d => setDreamers(d.couples)),
      adminGet<{ claims: Claim[] }>('/api/v2/admin/demo/claims').then(d => setClaims(d.claims || [])),
      adminGet<{ prospects: Prospect[]; openers_sent_total?: number }>('/api/v2/admin/prospects/?state=all&limit=200')
        .then(d => { setPros(d.prospects || []); setSent(typeof d.openers_sent_total === 'number' ? d.openers_sent_total : null); }),
      getPhotoQueue().then(d => setPhotos(d.total_held + d.total_reports)),   // CE-47 WEB-4 (R-47.2): held pictures and open reports
    ]);
  }, []);

  const paid = vendors ? vendors.filter(v => v.tier !== 'basic').length : null;
  const replying = pros ? pros.filter(p => p.state === 'replied' || p.state === 'in_session').length : null;
  // Call or message now: unclaimed demo claims and prospects who replied, newest first.
  const toCall = [
    ...(claims || []).filter(c => !c.contacted).map(c => ({ key: 'c' + c.id, at: c.claimed_at, name: c.vendor_name || '@' + c.ig_handle, tag: 'Demo claim', tone: C.warn, line: `Claimed their demo ${when(c.claimed_at)}`, phone: c.phone })),
    ...(pros || []).filter(p => p.state === 'replied').map(p => {
      const at = p.session_opened_at || p.last_template_at || '';
      const where = [cap(p.category), p.city].filter(Boolean).join(', ');
      return { key: 'p' + p.id, at, name: p.name || 'No name yet', tag: 'Replied', tone: C.ok, line: `Replied to the opener ${when(at)}${where ? ' · ' + where : ''}`, phone: p.phone };
    }),
  ].sort((a, z) => z.at.localeCompare(a.at));
  const t = b?.today;
  const d = (n: number | null | undefined) => (typeof n === 'number' ? n : '—');
  const rs = (n: number | null | undefined) => (typeof n === 'number' ? formatRs(n) : '—');

  return (
    <div>
      <PageHead title="Today" sub={fullDate(new Date().toISOString())} />
      <div className="adm-stats" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 10, marginBottom: 18 }}>
        <Stat label="Vendors on TDW" value={d(vendors?.length)} sub={`${d(paid)} on a paid plan · ${d(t?.new_vendors)} joined today`} href="/admin/makers" />
        <Stat label="Demo profiles made" value={d(b?.funnels.demo.total)} sub={`${d(b?.funnels.demo.states?.claimed ?? (b ? 0 : null))} claimed · ${d(t?.demo_claims)} claimed today`} href="/admin/demo" />
        <Stat label="Openers sent, all time" value={d(sent)} sub={`${d(replying)} replying now`} href="/admin/prospects" />
        <Stat label="Dreamers on TDW" value={d(dreamers?.length)} sub={`${d(t?.enquiries)} enquiries to vendors today`} href="/admin/dreamers" />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 18, alignItems: 'start' }}>
        <Group title={`Call or message now · ${claims && pros ? toCall.length : '—'}`}>
          {!claims || !pros ? <Empty>{claims === null && pros === null ? 'Loading, or could not load.' : 'Part of this list could not load.'}</Empty> : null}
          {claims && pros && toCall.length === 0
            ? <Empty>Nobody waiting for a call.</Empty>
            : null}
          {toCall.length > 0 && toCall.map((r, i) => <PersonRow key={r.key} name={r.name} tag={r.tag} tagTone={r.tone} line={r.line} phone={r.phone} bare last={i === toCall.length - 1} />)}
        </Group>
        <div>
          <Group title="Waiting for you · 5 lists">
            <NavRow icon="star" label="Discover requests" sub="Vendors asking to be shown on Discover" n={b ? b.queue.approvals_pending.count : null} href="/admin/approvals/discover" />
            <NavRow icon="photo" label="Pictures to look at" sub="Held pictures and reports from Dreamers" n={photos} href="/admin/approvals/photos" />
            <NavRow icon="help" label="Asked for help" sub="Dreamers who asked TDW to find vendors" n={help} href="/admin/assistance" />
            <NavRow icon="alert" label="AI replies that failed" sub="Messages the assistant could not answer" n={b ? b.queue.failed_turns.count : null} href="/admin/numbers" />
            <NavRow icon="chat" label="Templates waiting for Meta" sub="WhatsApp messages Meta has not approved yet" n={b ? b.queue.templates_awaiting_verdict.count : null} href="/admin/switchboard" last />
          </Group>
          <Group title="Money from subscriptions">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, flexWrap: 'wrap', padding: '14px 14px 4px' }}>
              <span style={{ font: F.t0, color: C.ink, fontVariantNumeric: 'tabular-nums' }}>{rs(t?.revenue.subscriptions.today_inr)}</span>
              <span style={{ font: F.t4, color: C.mute }}>received today</span>
            </div>
            <div style={{ font: F.t4, color: C.mute, padding: '0 14px 14px' }}>
              {rs(t?.revenue.subscriptions.lifetime_inr)} received since launch · {d(t?.trials.active)} vendors on a free trial
            </div>
          </Group>
          <Link href="/admin/numbers" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 44, font: F.t4, color: C.accent }}>See all numbers</Link>
        </div>
      </div>
    </div>
  );
}
