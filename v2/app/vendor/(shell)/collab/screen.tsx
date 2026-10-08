'use client';
// app/vendor/collab/screen.tsx — THE COLLAB BODY (the v2 tree's module).
//
// ── CE-47 · HUB-2 · COLLAB HUB: WORK | PEOPLE | MINE ─────────────────────────────────────────────────────────────
// The chair's ruling (7 Oct 2026, under the founder's delegation): the tabs are Work | People | Mine, the order of the
// approved pictures, and the room opens on Work. Mine carries a count when something waits for her answer (a request
// to confirm a shoot, someone interested in one of her open calls). F-38.62's "opens on my posts" is superseded by that
// ruling; what My posts held (her calls, View responses, Mark filled) lives in Mine.
// The Roster tab and its "+ Add someone" (name and phone) leave the room. Old roster rows stay in the table, not shown
// here, never deleted. My people (People tab) follows the ruling: a vendor adds another vendor directly; an
// organisation or a person joins only through a credit they answered yes to.
//
// RULE 1 (the chair's ruling (a), 7 Oct 2026): the new room shows only to a vendor the server calls open (GET /hub/me
// hub_open: on clb.testers, or everyone once admin_config clb.hub is on). Every other vendor, and any vendor whose answer
// cannot be read, gets today's room unchanged: CollabRoomBefore.tsx is a32fbf4e's screen.tsx moved byte for byte.
//
// What stays from before: the room head's pill "+ New post" (FE-6 L5) opens the one composer, CollabPostForm; the
// prefill arrives in the URL (?post=1&date=&city=&type=, F10(b)), never in storage; the one switch is sentence case at
// 44 px; the responses thread is this room's interior (HubMine pushes /vendor/collab/<id>/responses).
import { RoomHeadAdd } from '@/v2/components/worklist/PageHelp';   // FE-5's pill, in the room head (FE-8)
import { COL } from '@/v2/lib/worklist/collabRoom';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getJson } from '@/lib/vendor/api/_base';
import { matchCity } from '@/lib/vendor/cityMatch';
import { CollabPostForm } from '@/v2/components/vendor/CollabPostForm';
import { HubWork } from '@/v2/components/vendor/hub/HubWork';
import { HubPeople } from '@/v2/components/vendor/hub/HubPeople';
import { HubMine } from '@/v2/components/vendor/hub/HubMine';
import { HUB_API } from '@/v2/lib/vendor/hub';
import { CollabScreen as CollabRoomBefore } from '@/v2/components/vendor/hub/CollabRoomBefore';   // today's room, byte for byte

type Tab = 'work' | 'people' | 'mine';

// THE RULED ORDER, ONE HOME (CE-47, 7 Oct 2026: the approved pictures' order). A control that moves under the thumb
// cannot be learned (R-37.22), so this is a named constant, and the landing tab is derived from it. b40_v2 C40 asserts it.
const TAB_ORDER: readonly Tab[] = ['work', 'people', 'mine'] as const;
const TAB_DEFAULT: Tab = TAB_ORDER[0];

// F10(b)'s prefill arrives in the URL, not in storage; a hard refresh opens the composer prefilled.
interface Prefill { open: boolean; date: string; city: string; type: string; }
function readPrefill(sp: URLSearchParams | null): Prefill {
  return {
    open: sp?.get('post') === '1',
    date: sp?.get('date') || '',
    city: matchCity(sp?.get('city') || ''),
    type: sp?.get('type') || '',
  };
}

/** The room the route mounts: the Hub for an open vendor, today's room for everyone else (Rule 1). Fails closed. */
export function CollabScreen(props: { vendorId: string; tier: string }) {
  const [gate, setGate] = useState<'reading' | 'open' | 'closed'>('reading');
  const [myCity, setMyCity] = useState<string | null>(null);
  useEffect(() => {
    let live = true;
    getJson<{ ok: boolean; hub_open?: boolean; page?: { city: string | null } }>(HUB_API.me())
      .then((d) => {
        if (!live) return;
        const open = !!d && d.ok === true && d.hub_open === true;   // anything else, or an unreadable answer, is closed
        if (open && d.page) setMyCity(d.page.city);
        setGate(open ? 'open' : 'closed');
      })
      .catch(() => { if (live) setGate('closed'); });
    return () => { live = false; };
  }, []);
  if (gate === 'reading') return <div data-collab-gate="reading" style={{ minHeight: 120 }} aria-busy="true" />;
  if (gate === 'closed') return <div data-collab-gate="closed" style={{ display: 'contents' }}><CollabRoomBefore vendorId={props.vendorId} tier={props.tier} /></div>;
  return <div data-collab-gate="open" style={{ display: 'contents' }}><HubRoom myCity={myCity} /></div>;
}

function HubRoom({ myCity }: { myCity: string | null }) {
  const searchParams = useSearchParams();
  const prefill = readPrefill(searchParams);

  const [tab, setTab] = useState<Tab>(TAB_DEFAULT);
  const [showForm, setShowForm] = useState(prefill.open);
  const [waiting, setWaiting] = useState(0);
  const [mineKey, setMineKey] = useState(0);
  const [countKey, setCountKey] = useState(0);

  // The count re-reads each time she changes tab or a post lands, so an answer given in Mine clears it.
  useEffect(() => {
    let live = true;
    getJson<{ ok: boolean; waiting_count?: number }>(HUB_API.mine())
      .then((d) => { if (live && d.ok && typeof d.waiting_count === 'number') setWaiting(d.waiting_count); })
      .catch(() => { /* the tab reads "Mine" without a count */ });
    return () => { live = false; };
  }, [tab, mineKey, countKey]);

  const label = (t: Tab) => (t === 'work' ? COL.work : t === 'people' ? COL.people : COL.mineWaiting(waiting));

  return (
    <div style={{ /* DESIGN-1 stage 3 · one page, one scroll: natural height, the shell's main scrolls */ flex: '0 0 auto', display: 'flex', flexDirection: 'column' }}>
      {/* FE-6 L5's pill, on every tab: "+ New post" opens the one composer. */}
      <RoomHeadAdd addKey="collab" label={COL.newPost} onAdd={() => setShowForm(true)} />
      <div className="col-seg" role="group" data-collab-tabs="">
        {TAB_ORDER.map((t) => (
          <button key={t} type="button" aria-pressed={tab === t} className={tab === t ? 'on' : ''} onClick={() => setTab(t)}
            data-collab-tab={t}>
            {label(t)}
          </button>
        ))}
      </div>
      <style>{COL_CSS}</style>

      {/* not a scroller: overflowX clip (never hidden, which makes y a scroller); the shell's main scrolls */}
      <div style={{ overflowX: 'clip', padding: '8px 24px 96px' }}>
        {tab === 'work' ? <HubWork />
          : tab === 'people' ? <HubPeople myCity={myCity} />
          : <HubMine reloadKey={mineKey} onChanged={() => setCountKey((k) => k + 1)} />}
      </div>

      {showForm && (
        <CollabPostForm
          kind="collab"
          prefill={{ date: prefill.date, city: prefill.city, type: prefill.type }}
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); setMineKey((k) => k + 1); setTab('mine'); }}
        />
      )}
    </div>
  );
}

// FE-6 L5's one switch (the list pattern's segmented control), kept: sentence case, 44 px.
// HUB-2d (the founder's walk, 8 Oct 2026): the chosen tab is FILLED with the primary, like every chosen chip (F-44.367,
// veto 54). It was a thin underline on the card colour. Today's room (CollabRoomBefore.tsx) keeps its own bytes.
const COL_CSS = `
.col-seg{display:flex;margin:8px 24px 8px;border:1px solid var(--atelier-card-border);border-radius:12px;overflow:hidden}
.col-seg button{flex:1;min-height:44px;border:0;background:transparent;color:var(--atelier-ink-mute);font:var(--wl-tb);cursor:pointer}
.col-seg button.on{background:var(--role-primary);color:var(--role-on-primary)}
`;
