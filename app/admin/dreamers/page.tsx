'use client';
// ADM-1 · DREAMERS, ALL (route kept: /admin/dreamers). K4 (3 Oct 2026): Dreamers have no stored plan
// yet (no tier column; PATCH /couples/:id/tier stores nothing), so the card's Plan reads Coming
// soon, rows carry no plan tag or plan chips, and delete is offered unless a paid plan is stored.
// One page with Asked for help
// (/admin/assistance), a tab each. Every action that was here is still here, on the Dreamer's
// card: plan and delete. Delete is the card's last item, names what is lost (schema cascade,
// CE-47), asks again, and is not offered on a paid plan. WhatsApp and Call sit on every row.
// "couple" stays only in data keys, routes and server doors; no word Dev reads carries it.
import { useEffect, useState, useCallback } from 'react';
import { Toast } from '../_components/AdminUI';
import MintSheet from '../_components/MintSheet';
import { getCouples, getVendors, type AdminCouple, type AdminVendor } from '../../../lib/admin-api/index';
import { listAssistance } from '@/lib/admin-api/assistance';
import { adminHeaders, API_BASE } from '@/lib/admin-api/_base';
import { alsoMatch, alsoLine } from '../_components/alsoLine';
import { DREAMER_LOST, PAID_BLOCK, isPaidDreamer } from '../_components/peopleWords';
import { C, F, PageHead, Pill, RouteTabs, SearchField, CountLine, List, Empty, PersonRow, Sheet, SheetRow, SheetNote, DangerLast, fullDate, phoneText } from '../_components/Kit';

const wed = (d: string | null) => (d ? `Wedding ${fullDate(d)}` : 'Wedding date not set');

export default function DreamersPage() {
  const [people, setPeople] = useState<AdminCouple[]>([]);
  const [loading, setLoading] = useState(true);
  const [helpOpen, setHelpOpen] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [vendors, setVendors] = useState<AdminVendor[] | null>(null);
  const [toast, setToast] = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [minting, setMinting] = useState(false);
  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getCouples().then(d => { setPeople(d.couples); setLoading(false); }).catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    load();
    listAssistance('open').then(d => setHelpOpen(typeof d.counts?.open === 'number' ? d.counts.open : d.requests.length)).catch(() => {});
  }, [load]);

  const open = people.find(c => c.id === openId) || null;
  const openCard = (id: string) => {
    setOpenId(id);
    // The "also a vendor" line reads the vendors list through its existing door, on open.
    if (vendors === null) getVendors().then(d => setVendors(d.vendors)).catch(() => setVendors([]));
  };
  const deleteDreamer = async (id: string) => {
    const res = await fetch(`${API_BASE}/api/v2/admin/couples/${id}`, { method: 'DELETE', headers: adminHeaders(), body: JSON.stringify({ confirm: true }) });
    if (!res.ok) throw new Error('Could not delete. Nothing was removed.');
    setPeople(c => c.filter(x => x.id !== id));
    setOpenId(null);
    showToast('Dreamer deleted.');
  };

  const q = search.trim().toLowerCase();
  const filtered = people.filter(c => {
    const s = !q || c.name?.toLowerCase().includes(q) || (c.phone || '').includes(search.trim()) || (c.wedding_city || '').toLowerCase().includes(q);
    return s;
  });
  const also = open && vendors ? alsoLine(alsoMatch(open, vendors), 'vendor') : null;

  return (
    <div>
      <PageHead title="Dreamers" sub={`${people.length} on TDW${typeof helpOpen === 'number' ? ` · ${helpOpen} asking for help` : ''}`} action={<Pill onClick={() => setMinting(true)}>+ New Dreamer</Pill>} />
      <MintSheet visible={minting} kind="couple" onClose={() => setMinting(false)} onMinted={load} />
      <RouteTabs active="/admin/dreamers" items={[{ href: '/admin/dreamers', label: 'All', n: loading ? null : people.length }, { href: '/admin/assistance', label: 'Asked for help', n: helpOpen }]} />
      <SearchField value={search} onChange={setSearch} placeholder="Search by name, phone or city" />
      {loading ? (
        <List>{[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 72, borderBottom: `0.5px solid ${C.line}` }} />)}</List>
      ) : (
        <>
          <CountLine n={filtered.length} one="Dreamer" many="Dreamers" />
          <List>
            {filtered.length === 0 ? <Empty>No Dreamers match.</Empty> : filtered.map((c, i) => (
              <PersonRow key={c.id} last={i === filtered.length - 1} onOpen={() => openCard(c.id)} name={c.name}
                line={[wed(c.wedding_date), c.wedding_city, `${c.muse_saves} saves`, `${c.circle_members} in circle`].filter(Boolean).join(' · ')} phone={c.phone} />
            ))}
          </List>
        </>
      )}

      {open && (
        <Sheet title={open.name} sub={`${phoneText(open.phone) ?? 'No number'} · ${wed(open.wedding_date)} · joined ${fullDate(open.created_at)}`} onClose={() => setOpenId(null)}>
          <SheetRow label="Plan" right={<span style={{ font: F.t5, color: C.mute }}>Coming soon</span>} />
          <SheetNote>{open.muse_saves} saves · {open.circle_members} in their circle{open.wedding_city ? ` · ${open.wedding_city}` : ''}</SheetNote>
          <DangerLast label="Delete Dreamer" lost={DREAMER_LOST} extra={also} confirmWord="Yes, delete"
            blockedBy={isPaidDreamer(open) ? PAID_BLOCK : null} onConfirm={() => deleteDreamer(open.id)} />
        </Sheet>
      )}
      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
