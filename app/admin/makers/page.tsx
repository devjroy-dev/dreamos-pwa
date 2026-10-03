'use client';
// ADM-1 · VENDORS, JOINED (route kept: /admin/makers). One page with Being reached
// (/admin/prospects), a tab each. Every action that was here is still here, on the vendor's
// card: plan, Discover, Send welcome (tap again to send), upload photos, delete.
// Delete is the card's last item, names what is lost (read from the schema's cascade, CE-47),
// asks again, and is not offered for a paid plan. WhatsApp and Call sit on every row.
import { useEffect, useState, useCallback } from 'react';
import { Toast } from '../_components/AdminUI';
import MintSheet from '../_components/MintSheet';
import { getVendors, getCouples, patchVendorTier, patchVendorDiscover, type AdminVendor, type AdminCouple } from '../../../lib/admin-api/index';
import { sendWelcome } from '../../../lib/admin-api/mint';
import { adminGet, adminHeaders, API_BASE } from '@/lib/admin-api/_base';
import { alsoMatch, alsoLine } from '../_components/alsoLine';
import { VENDOR_LOST, PAID_BLOCK } from '../_components/peopleWords';

// The Discover standing chip (TDW_10 P3), in the plain words of the approved design (CE-47 note 1,
// 2 Oct 2026, superseding the August bytes): three standings kept apart, a split legacy pair reads
// Hidden because that is what a Dreamer sees, never-applied is an honest blank.
function standingChip(v: AdminVendor): [string, string] | null {
  const st = v.discover_request_state;
  const chip: [string, string] | null =
    st === 'approved' && v.discover_eligible ? ['On Discover',   C.ok]
  : st === 'approved'                        ? ['Hidden',        C.warn]
  : st === 'revoked' || st === 'hidden'      ? ['Hidden',        C.warn]
  : st === 'requested' || st === 'under_review' ? ['Waiting',    C.accent]
  : st === 'denied'                          ? ['Not approved', C.bad]
  : null;   // not_requested — never applied is an honest blank
  return chip;
}
import { C, F, PageHead, Pill, RouteTabs, Chips, SearchField, CountLine, List, Empty, PersonRow, Sheet, SheetRow, SheetNote, DangerLast, cap, fullDate } from '../_components/Kit';

const TIERS = ['basic', 'essential', 'signature', 'prestige'];
const PLAN: Record<string, string> = { basic: 'Basic', essential: 'Essential', signature: 'Signature', prestige: 'Prestige' };

export default function VendorsJoinedPage() {
  const [vendors, setVendors] = useState<AdminVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [beingReached, setBeingReached] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [toast, setToast] = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [minting, setMinting] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [dreamers, setDreamers] = useState<AdminCouple[] | null>(null);
  const [confirmWelcome, setConfirmWelcome] = useState<string | null>(null);
  const [welcomeBusy, setWelcomeBusy] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    getVendors().then(d => { setVendors(d.vendors); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
    adminGet<{ prospects?: unknown[] }>('/api/v2/admin/prospects/?state=all&limit=200').then(d => setBeingReached(Array.isArray(d.prospects) ? d.prospects.length : null)).catch(() => {});
  }, [load]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };
  const open = vendors.find(v => v.id === openId) || null;
  const openCard = (id: string) => {
    setOpenId(id); setConfirmWelcome(null);
    // The "also a Dreamer" line reads the Dreamers list through its existing door, on open.
    if (dreamers === null) getCouples().then(d => setDreamers(d.couples)).catch(() => setDreamers([]));
  };

  const welcome = async (v: AdminVendor) => {
    setWelcomeBusy(true);
    try {
      const r = await sendWelcome(v.id);
      showToast(r.sent ? `Welcome sent to ${v.name} on WhatsApp.` : (r.message || 'Could not send the welcome message.'), !r.sent);
    } catch { showToast('Could not send the welcome message.', true); }
    finally { setWelcomeBusy(false); setConfirmWelcome(null); }
  };
  const setTier = async (id: string, tier: string) => {
    try { await patchVendorTier(id, tier); setVendors(v => v.map(x => x.id === id ? { ...x, tier } : x)); showToast('Plan changed.'); }
    catch { showToast('Could not change the plan.', true); }
  };
  const toggleDiscover = async (v: AdminVendor) => {
    try {
      await patchVendorDiscover(v.id);
      setVendors(vs => vs.map(x => x.id === v.id ? { ...x, discover_eligible: !v.discover_eligible, discover_request_state: v.discover_eligible ? 'revoked' : 'approved' } : x));
      showToast(v.discover_eligible ? 'Hidden from Discover.' : 'Added to Discover.');
    } catch { showToast('That did not work. Try again.', true); }
  };
  const deleteVendor = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/v2/admin/vendors/${id}`, { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ confirm: true }) });
    if (!res.ok) throw new Error('Could not delete. Nothing was removed.');
    setVendors(v => v.filter(x => x.id !== id));
    setOpenId(null);
    showToast('Vendor deleted.');
  };

  const q = search.trim().toLowerCase();
  const filtered = vendors.filter(v => {
    const matchSearch = !q || v.name?.toLowerCase().includes(q) || (v.phone || '').includes(search.trim()) || (v.city || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || (filter === 'paid' ? v.tier !== 'basic' : filter === 'discover' ? (v.discover_request_state === 'approved' && v.discover_eligible) : v.tier === filter);
    return matchSearch && matchFilter;
  });
  const paid = vendors.filter(v => v.tier !== 'basic').length;
  const also = open && dreamers ? alsoLine(alsoMatch(open, dreamers), 'Dreamer') : null;

  return (
    <div>
      <PageHead title="Vendors" sub={`${vendors.length} on TDW · ${paid} on a paid plan`} action={<Pill onClick={() => setMinting(true)}>+ New vendor</Pill>} />
      <MintSheet visible={minting} kind="vendor" onClose={() => setMinting(false)} onMinted={load} />
      <RouteTabs active="/admin/makers" items={[{ href: '/admin/makers', label: 'Joined', n: loading ? null : vendors.length }, { href: '/admin/prospects', label: 'Being reached', n: beingReached }]} />
      <SearchField value={search} onChange={setSearch} placeholder="Search by name, phone or city" />
      <Chips value={filter} onChange={setFilter} items={[{ key: 'all', label: 'All' }, { key: 'paid', label: 'Paid' }, ...TIERS.map(t => ({ key: t, label: PLAN[t] })), { key: 'discover', label: 'On Discover' }]} />
      {loading ? (
        <List>{[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 72, borderBottom: `0.5px solid ${C.line}` }} />)}</List>
      ) : (
        <>
          <CountLine n={filtered.length} one="vendor" many="vendors" />
          <List>
            {filtered.length === 0 ? <Empty>No vendors match.</Empty> : filtered.map((v, i) => {
              const chip = standingChip(v);
              return (
                <PersonRow key={v.id} last={i === filtered.length - 1} onOpen={() => openCard(v.id)} name={v.name}
                  tag={PLAN[v.tier] || cap(v.tier)} tagTone={v.tier === 'basic' ? C.mute : C.accent}
                  line={[cap(v.category), v.city, chip?.[0]].filter(Boolean).join(' · ')} phone={v.phone} />
              );
            })}
          </List>
        </>
      )}

      {open && (() => { const v = open; return (
        <Sheet title={open.name} sub={[cap(open.category), open.city, `joined ${fullDate(open.created_at)}`].filter(Boolean).join(' · ')} onClose={() => { setOpenId(null); setConfirmWelcome(null); }}>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
            <div style={{ font: F.t4, color: C.mute, marginBottom: 8 }}>Plan</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {TIERS.map(t => (
                <button key={t} type="button" aria-pressed={open.tier === t} onClick={() => setTier(open.id, t)} style={{ flex: '1 1 90px', minHeight: 44, borderRadius: 12, border: `1px solid ${open.tier === t ? C.primary : C.line}`, background: open.tier === t ? C.primary : 'transparent', color: open.tier === t ? C.onPrimary : C.soft, font: F.t5, fontWeight: 600 }}>{PLAN[t]}</button>
              ))}
            </div>
          </div>
          <SheetRow label={v.discover_eligible ? 'Hide from Discover' : 'Add to Discover'} sub={standingChip(v)?.[0] || 'Has not asked for Discover'} onClick={() => toggleDiscover(v)} />
          {confirmWelcome === v.id
            ? <SheetRow label={welcomeBusy ? 'Sending…' : 'Tap again to send on WhatsApp'} sub="The welcome message, from TDW" onClick={() => welcome(v)} />
            : <SheetRow label="Send welcome message" sub="On WhatsApp, from TDW" onClick={() => setConfirmWelcome(v.id)} />}
          <SheetRow label="Upload photos for this vendor" href={`/admin/vendors/portfolio?vendor=${open.id}`} />
          {open.founding_cohort && <SheetNote>Founding vendor</SheetNote>}
          <DangerLast label="Delete vendor" lost={VENDOR_LOST} extra={also} confirmWord="Yes, delete"
            blockedBy={open.tier !== 'basic' ? PAID_BLOCK : null}
            onConfirm={() => deleteVendor(open.id)} />
        </Sheet>
      ); })()}
      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
