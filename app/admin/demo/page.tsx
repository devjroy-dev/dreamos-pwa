'use client';
// ADM-1 · DEMO PROFILES, redrawn. Every door and handler is unchanged. Tabs: Profiles, Claimed,
// Enquiries, Progress. Rows carry Send invite, Show or Hide on Discover, More, WhatsApp and Call;
// the card holds the link, sample enquiries and, last, Switch off (asks again, CE-47 change 1).
// app/admin/demo/page.tsx
// Admin: the demo factory — build, board, bulk, invite, funnel.
//
// TDW_08 P4. The surface this replaces held THREE photo numbers (a `< 3` gate, a
// `min 3` label, a `< 10` upload hide), none of which matched the real plane and
// none of which this file authors any more. It also rendered a flat list with no
// state on it at all, over a wire that has carried `state` and seven timestamps
// since 0106.
//
// ── ZERO NUMERIC LITERALS ABOUT PHOTOS LIVE IN THIS FILE ────────────────────
// The FLOOR comes from the server (`min_portfolio_images` on the vendors
// response), read through `photoFloor()` — the pwa's one home for that number,
// built at TDW_07 P2 for this exact disease. The CEILING is not sent, is not
// held here, and is not rendered: the server enforces it and announces it in the
// refusal, which is what app/vendor/portfolio/page.tsx already does ("this
// screen holds no opinion about the cap"). A ceiling this file cannot see is a
// ceiling this file cannot contradict.
//
// ── THE BOARD'S COLUMNS COME FROM THE WIRE ──────────────────────────────────
// `demoLifecycle.STATES` is the frozen authority and it lives in the other
// repository. The server sends the list; this component renders it and never
// enumerates it. A hardcoded column list here would make the board a second
// opinion about the state machine.

import { useEffect, useState, useCallback, useMemo } from 'react';
import { adminHeaders } from '@/lib/admin-api/_base';
import { photoFloor } from '@/lib/vendor/discoverFloor';
import { T, Toast, FieldInput, FieldSelect } from '../_components/AdminUI';
import { C, F, PageHead, Pill, Tabs, Chips, CountLine, List, Empty, Group, PersonRow, ActionStrip, Sheet, SheetRow, SheetNote, DangerLast, when, fullDate, cap } from '../_components/Kit';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';

const CATEGORIES = [
  { value: 'makeup',       label: 'Makeup Artist'  },
  { value: 'photography',  label: 'Photography'     },
  { value: 'videography',  label: 'Videography'     },
  { value: 'decor',        label: 'Decor'           },
  { value: 'venue',        label: 'Venue'           },
  { value: 'planning',     label: 'Wedding Planner' },
  { value: 'catering',     label: 'Catering'        },
  { value: 'mehendi',      label: 'Mehendi'         },
  { value: 'jewellery',    label: 'Jewellery'       },
  { value: 'attire',       label: 'Attire'          },
  { value: 'music_dj',     label: 'DJ / Music'      },
  { value: 'choreography', label: 'Choreography'    },
  { value: 'invitations',  label: 'Invitations'     },
  { value: 'transport',    label: 'Transport'       },
  { value: 'other',        label: 'Other'           },
];

type Tab = 'board' | 'funnel' | 'leads' | 'claims';

interface DemoVendor {
  id: string; ig_handle: string; display_name: string; category: string;
  city: string; about: string | null; rate_display: string | null;
  whatsapp_phone: string | null;
  photos: Array<{ url: string; is_hero?: boolean; cloudinary_id?: string }>;
  active: boolean; created_at: string; discover_eligible?: boolean;
  // ── The lifecycle, which has ridden this wire since 0106 and was never read.
  state?: string;
  invited_at?: string | null; opened_at?: string | null; engaged_at?: string | null;
  claimed_at?: string | null; removed_at?: string | null; expires_at?: string | null;
  sunset_at?: string | null;
  // ── TDW_08 P5 · Phase 1 · FORK C(i): the SPENT MARKER, raw from the server.
  // It is NOT a state and this surface derives no opinion about it beyond the
  // one predicate below — the fact rides, the route owns the refusal.
  invite_sent_at?: string | null;
  // ── FORK D(c): the two shared-handset facts, deliberately not merged.
  shared_handset?: boolean;
  linkage_held_by?: string | null;
  // ── F-08.40: the server's normalized handset key. This surface groups by it
  // and NEVER derives it — normalizing a phone here would be a second opinion
  // about phone identity, and F-07.47 exists to stop exactly that.
  handset_key?: string | null;
}

interface DemoLead {
  id: string; demo_vendor_handle: string; bride_name: string;
  bride_phone: string; bride_wedding_city: string | null;
  bride_wedding_date: string | null; otp_verified: boolean; created_at: string;
}

interface ClaimRequest {
  id: string; ig_handle: string; vendor_name: string | null;
  phone: string; claimed_at: string; contacted: boolean; notes: string | null;
}

async function adminFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...opts,
    headers: adminHeaders((opts?.headers as Record<string,string>) || {}),
  });
  return res.json();
}

async function uploadToCloudinary(file: File): Promise<{ url: string; cloudinary_id: string }> {
  const sign = await adminFetch('/api/v2/admin/demo/cloudinary-sign', { method: 'POST', body: JSON.stringify({ filename: file.name }) });
  if (!sign.ok) throw new Error('Cloudinary sign failed');
  const fd = new FormData();
  Object.entries(sign.params as Record<string, string>).forEach(([k, v]) => fd.append(k, v));
  fd.append('file', file);
  const up = await fetch(sign.upload_url, { method: 'POST', body: fd });
  if (!up.ok) throw new Error('Upload failed');
  const d = await up.json();
  return { url: d.secure_url, cloudinary_id: d.public_id };
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
}

// AGE IN DAYS, from the stamp that belongs to the row's OWN state where one
// exists, falling back to created_at. A `built` row's age is how long it has sat
// unbuilt-upon; an `invited` row's age is how long the vendor has had the
// message. One number meaning two different things is what a per-state board is
// for.
const STATE_STAMP: Record<string, keyof DemoVendor> = {
  invited: 'invited_at', opened: 'opened_at', engaged: 'engaged_at',
  claimed: 'claimed_at', removed: 'removed_at',
};
function ageDays(v: DemoVendor): number | null {
  const key = STATE_STAMP[v.state || ''];
  const raw = (key ? (v[key] as string | null | undefined) : null) || v.created_at;
  if (!raw) return null;
  const ms = Date.now() - new Date(raw).getTime();
  if (!isFinite(ms)) return null;
  return Math.max(0, Math.floor(ms / 86400000));
}

const MOCK_LEADS = [
  { bride_name: 'Ananya Sharma',  bride_phone: '+919810000001', bride_wedding_city: 'Delhi',      bride_wedding_date: '2026-11-15', state: 'new',       raw_message: 'Loved your work on TDW! Looking for bridal services for Nov wedding.' },
  { bride_name: 'Priya & Rohit',  bride_phone: '+919810000002', bride_wedding_city: 'Gurgaon',    bride_wedding_date: '2027-01-10', state: 'new',       raw_message: 'Your portfolio is stunning. Can you share your packages?' },
  { bride_name: 'Meera Kapoor',   bride_phone: '+919810000003', bride_wedding_city: 'Mumbai',     bride_wedding_date: '2026-09-20', state: 'quoted',    raw_message: 'Divya recommended you highly. Need services for my September wedding.' },
  { bride_name: 'Kavya Nair',     bride_phone: '+919810000004', bride_wedding_city: 'Bangalore',  bride_wedding_date: '2026-08-05', state: 'contacted', raw_message: 'Hi! Saw your work. Available for August wedding in Bangalore?' },
  { bride_name: 'Simran Oberoi',  bride_phone: '+919810000005', bride_wedding_city: 'Chandigarh', bride_wedding_date: '2026-12-20', state: 'new',       raw_message: 'Planning early! Looking to book for next December.' },
  { bride_name: 'Riya & Dev',     bride_phone: '+919810000006', bride_wedding_city: 'Jaipur',     bride_wedding_date: '2026-10-30', state: 'booked',    raw_message: 'Palace wedding in Jaipur. Need full services.' },
  { bride_name: 'Tanya Malhotra', bride_phone: '+919810000007', bride_wedding_city: 'Delhi',      bride_wedding_date: '2026-08-22', state: 'contacted', raw_message: 'Your reels are beautiful. Can we schedule a call?' },
  { bride_name: 'Mansi Gupta',    bride_phone: '+919810000008', bride_wedding_city: 'Jaisalmer',  bride_wedding_date: '2026-10-18', state: 'booked',    raw_message: 'Desert wedding! Very excited to work with you.' },
  { bride_name: 'Aditi Khanna',   bride_phone: '+919810000009', bride_wedding_city: 'Noida',      bride_wedding_date: '2026-07-12', state: 'new',       raw_message: 'Quick wedding, 3 months away. Available?' },
  { bride_name: 'Radhika Chopra', bride_phone: '+919810000010', bride_wedding_city: 'Delhi',      bride_wedding_date: '2026-09-05', state: 'contacted', raw_message: 'Seen your work for 2 years. Finally getting married!' },
];

// THE FUNNEL'S FIVE EDGES, spec §P4. `legacy`, `expired` and `removed` sit
// OUTSIDE it by construction — the board still shows them as columns, and the
// funnel deliberately does not, because a row that was never invited is not a
// conversion failure.
const FUNNEL = ['built', 'invited', 'opened', 'engaged', 'claimed'];
const FUNNEL_WORD: Record<string, string> = { built: 'Made', invited: 'Invited', opened: 'Opened the link', engaged: 'Talking', claimed: 'Claimed' };
const DEMO_STATE_WORD: Record<string, string> = { created: 'Not invited yet', invited: 'Invited', opened: 'Opened the link', engaged: 'Talking', claimed: 'Claimed', expired: 'Expired', legacy: 'Made before invites' };
const FUNNEL_STAMP: Record<string, keyof DemoVendor | null> = {
  built: null, invited: 'invited_at', opened: 'opened_at', engaged: 'engaged_at', claimed: 'claimed_at',
};

export default function DemoAdminPage() {
  const [tab,      setTab]      = useState<Tab>('board');
  const [vendors,  setVendors]  = useState<DemoVendor[]>([]);
  const [states,   setStates]   = useState<string[]>([]);
  // FORK 3(c) — the invite subset is the SERVER's, exactly as `states` is.
  // Empty until the payload arrives, and empty on a stale deploy that does not
  // send it: the same absent-on-arrival guard `states` has always carried. An
  // empty subset arms nothing, which is the safe direction to fail.
  const [inviteStates, setInviteStates] = useState<string[]>([]);
  const [srvFloor, setSrvFloor] = useState<number | null>(null);
  const [leads,    setLeads]    = useState<DemoLead[]>([]);
  const [claims,   setClaims]   = useState<ClaimRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [copied,   setCopied]   = useState('');
  const [busy,     setBusy]     = useState('');

  // Create form — starts closed
  const [showCreate,  setShowCreate]  = useState(false);
  const [igHandle,    setIgHandle]    = useState('');
  const [dispName,    setDispName]    = useState('');
  const [category,    setCategory]    = useState('makeup');
  const [city,        setCity]        = useState('');
  const [waPhone,     setWaPhone]     = useState('');
  const [about,       setAbout]       = useState('');
  const [rateDisplay, setRateDisplay] = useState('');
  const [photos,      setPhotos]      = useState<Array<{ url: string; is_hero: boolean; cloudinary_id: string }>>([]);
  const [uploading,   setUploading]   = useState(false);
  const [creating,    setCreating]    = useState(false);

  // Bulk build — starts closed
  const [showBulk, setShowBulk] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkResult, setBulkResult] = useState<string[]>([]);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  // THE FLOOR. Server first, `discoverFloor`'s stated fallback under it. This
  // file never writes the number.
  const floor = photoFloor(srvFloor);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, lRes, cRes] = await Promise.all([
        adminFetch('/api/v2/admin/demo/vendors'),
        adminFetch('/api/v2/admin/demo/leads'),
        fetch(`${API_BASE}/api/v2/admin/demo/claims`, { headers: adminHeaders() }).then(r => r.json()).catch(() => ({ ok: false })),
      ]);
      if (vRes.ok) {
        setVendors(vRes.vendors || []);
        if (Array.isArray(vRes.states)) setStates(vRes.states);
        if (Array.isArray(vRes.invite_states)) setInviteStates(vRes.invite_states);
        if (typeof vRes.min_portfolio_images === 'number') setSrvFloor(vRes.min_portfolio_images);
      }
      if (lRes.ok) setLeads(lRes.leads || []);
      if (cRes.ok) setClaims(cRes.claims || []);
    } catch { showToast('Failed to load.', true); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const { url, cloudinary_id } = await uploadToCloudinary(file);
      setPhotos(prev => [...prev, { url, cloudinary_id, is_hero: prev.length === 0 }]);
    } catch (err: unknown) { showToast('Upload failed: ' + (err instanceof Error ? err.message : 'unknown'), true); }
    setUploading(false); e.target.value = '';
  }

  function setHero(idx: number) { setPhotos(prev => prev.map((p, i) => ({ ...p, is_hero: i === idx }))); }

  function removePhoto(idx: number) {
    setPhotos(prev => {
      const next = prev.filter((_, i) => i !== idx);
      if (next.length > 0 && !next.some(p => p.is_hero)) next[0].is_hero = true;
      return next;
    });
  }

  function resetCreateForm() {
    setIgHandle(''); setDispName(''); setCategory('makeup'); setCity('');
    setWaPhone(''); setAbout(''); setRateDisplay(''); setPhotos([]);
  }

  async function handleCreate() {
    if (!igHandle.trim() || !dispName.trim() || !category || !city.trim()) {
      showToast('Handle, name, category and city required.', true); return;
    }
    // C1/C2, founder-frozen. The number is the server's, never typed here.
    if (photos.length < floor) {
      showToast(`Need at least ${floor} portfolio images. You have ${photos.length}.`, true); return;
    }
    setCreating(true);
    try {
      const d = await adminFetch('/api/v2/admin/demo/vendors', {
        method: 'POST',
        body: JSON.stringify({ ig_handle: igHandle.trim().toLowerCase(), display_name: dispName.trim(), category, city: city.trim(), whatsapp_phone: waPhone.trim() || null, about: about.trim() || null, rate_display: rateDisplay.trim() || null, photos }),
      });
      // `detail` FIRST. The register refusals (F-08.44) carry a machine key in
      // `error` and the founder-frozen sentence in `detail`; every older refusal
      // carries its sentence in `error` and no `detail` at all, so this ordering
      // adds the new bytes without moving a single old one.
      if (!d.ok) { showToast(d.detail || d.error || 'Failed.', true); setCreating(false); return; }
      showToast('Created ✓  ' + d.demo_url);
      setShowCreate(false); resetCreateForm(); load();
    } catch { showToast('Failed to create.', true); }
    setCreating(false);
  }

  // ── BULK BUILD ────────────────────────────────────────────────────────────
  // Tab- or comma-separated, one demo per line, photo URLs space-separated in
  // the last column. THE PASTE IS THE ONLY INGESTION PATH THIS SITTING HAS: the
  // spec's "IG handle in → pipeline fetch" names an n8n/RapidAPI contract that
  // does not exist anywhere in either repository, and CE ruling FORK A(c) minted
  // that absence rather than building an external contract or striking the
  // clause. The route's own header enumerates what a fetch would need first.
  function parseBulk(text: string) {
    const out: Array<Record<string, unknown>> = [];
    for (const line of text.split('\n')) {
      const t = line.trim();
      if (!t) continue;
      const c = t.split(/\t|,(?![^\s]*\/)/).map(s => s.trim());
      if (c.length < 4) continue;
      out.push({
        ig_handle: c[0], display_name: c[1], category: c[2], city: c[3],
        whatsapp_phone: c[4] || null, rate_display: c[5] || null, about: c[6] || null,
        photos: (c[7] || '').split(/\s+/).filter(Boolean),
      });
    }
    return out;
  }

  async function handleBulk() {
    const demos = parseBulk(bulkText);
    if (demos.length === 0) { showToast('Nothing to build. Check the paste.', true); return; }
    setBulkBusy(true); setBulkResult([]);
    try {
      const d = await adminFetch('/api/v2/admin/demo/bulk', { method: 'POST', body: JSON.stringify({ demos }) });
      if (!d.ok) { showToast(d.error || 'Bulk failed.', true); setBulkBusy(false); return; }
      const lines: string[] = [`Built ${d.insertedCount} · already on file ${d.skippedCount} · refused ${d.failedCount}`];
      for (const f of (d.failed || [])) lines.push(`Refused, ${f.ig_handle || 'row'}: ${f.error}${f.detail ? ` (${f.detail})` : ''}`);
      for (const s of (d.skipped || [])) lines.push(`Already on file: ${s}`);
      setBulkResult(lines);
      showToast(`Built ${d.insertedCount}.`);
      load();
    } catch { showToast('Bulk failed.', true); }
    setBulkBusy(false);
  }

  async function handleDeactivate(id: string) {
    try {
      const d = await adminFetch(`/api/v2/admin/demo/vendors/${id}`, { method: 'DELETE' });
      if (!d.ok) { showToast('Failed.', true); return; }
      setVendors(v => v.map(x => x.id === id ? { ...x, active: false } : x));
      showToast('Switched off.');
    } catch { showToast('Failed.', true); }
  }

  async function handleDiscoverToggle(id: string, makeEligible: boolean) {
    const endpoint = makeEligible ? 'discover-grant' : 'discover-revoke';
    try {
      const d = await adminFetch(`/api/v2/admin/demo/vendors/${id}/${endpoint}`, { method: 'POST' });
      if (!d.ok) { showToast('Failed.', true); return; }
      setVendors(v => v.map(x => x.id === id ? { ...x, discover_eligible: makeEligible } : x));
      showToast(makeEligible ? 'Added to Discover.' : 'Removed from Discover.');
    } catch { showToast('Failed.', true); }
  }

  // ── SEND INVITE — F-08.36's cure. The route has existed since Sitting A under
  // the founder's ruling that invites are fired from the admin console; until
  // this control there was nothing on the console that called it.
  async function handleInvite(v: DemoVendor) {
    if (!window.confirm(`Send the demo invite to ${v.display_name} on ${v.whatsapp_phone}?`)) return;
    setBusy(v.id);
    try {
      const d = await adminFetch(`/api/v2/admin/demo/vendors/${v.id}/invite`, { method: 'POST' });
      if (!d.ok) {
        // The route's own error names the cause; it is shown rather than
        // flattened, because "Failed." would hide a shared-handset refusal that
        // the founder can act on.
        showToast(`${d.error}${d.detail ? `: ${d.detail}` : ''}`, true);
      } else {
        showToast(`Invite sent to ${v.display_name}.${d.prospect_linked ? '' : ' The number did not link to a prospect; check the log.'}`);
        load();
      }
    } catch { showToast('Invite failed.', true); }
    setBusy('');
  }

  // ── BULK INVITE — one column's worth, bounded per run by the server.
  async function handleInviteBatch(ids: string[], count: number, columnLabel: string) {
    if (ids.length === 0) return;
    if (!window.confirm(`Send ${count} demo invite${count === 1 ? '' : 's'} from ${columnLabel}?`)) return;
    setBusy('batch:' + columnLabel);
    try {
      const d = await adminFetch('/api/v2/admin/demo/invite-batch', { method: 'POST', body: JSON.stringify({ ids }) });
      if (!d.ok) { showToast(d.detail || d.error || 'Batch failed.', true); setBusy(''); return; }
      showToast(`Sent ${d.sentCount}${d.refusedCount ? ` · refused ${d.refusedCount}` : ''}.`, d.refusedCount > 0);
      load();
    } catch { showToast('Batch failed.', true); }
    setBusy('');
  }

  function copyUrl(handle: string, id: string) {
    const url = `https://demo.thedreamwedding.in/vendor/${handle}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(''), 2000);
  }

  async function handleSeedLeads(vendor: DemoVendor) {
    setBusy(vendor.id);
    let count = 0;
    for (const lead of MOCK_LEADS) {
      try {
        await adminFetch('/api/v2/admin/demo/leads', {
          method: 'POST',
          body: JSON.stringify({ ...lead, demo_vendor_id: vendor.id, demo_vendor_handle: vendor.ig_handle, otp_verified: true }),
        });
        count++;
      } catch { /* skip individual failures */ }
    }
    showToast(`Added ${count} sample enquiries to ${vendor.display_name}.`);
    setBusy(''); load();
  }

  // ── THE BOARD'S GROUPING. Columns are the SERVER's list, in the server's
  // order. A row whose state the server does not know still appears — under its
  // own name at the end — because a demo that has fallen off the enumeration is
  // exactly the row an operator most needs to see.
  const columns = useMemo(() => {
    const known = states.length ? states : [];
    const groups = new Map<string, DemoVendor[]>();
    for (const s of known) groups.set(s, []);
    for (const v of vendors) {
      const s = v.state || 'legacy';
      if (!groups.has(s)) groups.set(s, []);
      (groups.get(s) as DemoVendor[]).push(v);
    }
    return Array.from(groups.entries());
  }, [vendors, states]);

  const funnel = useMemo(() => {
    // A row COUNTS at a stage if it has reached it, which the stamps say
    // directly — never inferred from the current state, because a `claimed` row
    // passed through `invited` and must be counted there too.
    return FUNNEL.map((stage) => {
      const key = FUNNEL_STAMP[stage];
      const n = key
        ? vendors.filter(v => !!v[key]).length
        : vendors.filter(v => (v.state || 'legacy') !== 'legacy').length;
      return { stage, n };
    });
  }, [vendors]);

  const byCategoryCity = useMemo(() => {
    const m = new Map<string, { built: number; invited: number; claimed: number }>();
    for (const v of vendors) {
      const k = `${v.category} · ${v.city}`;
      const cur = m.get(k) || { built: 0, invited: 0, claimed: 0 };
      cur.built++;
      if (v.invited_at) cur.invited++;
      if (v.claimed_at) cur.claimed++;
      m.set(k, cur);
    }
    return Array.from(m.entries()).sort((a, b) => b[1].built - a[1].built);
  }, [vendors]);

  const label = { fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const };
  const [filter, setFilter] = useState('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const open = vendors.find(v => v.id === openId) || null;
  // The one invite predicate (sealed by tdw08_console, tdw08_p4_factory, tdw08_p5_invite_spent):
  // its clauses keep their sealed indentation so the benches' mutation anchors still bite.
  const canSend = (v: DemoVendor) =>
                  inviteStates.includes(v.state)
                  && !!v.whatsapp_phone
                  && !v.linkage_held_by
                  && !v.invite_sent_at
                  && v.active !== false;
  const rows = vendors.filter(v => filter === 'all' || (v.state || 'legacy') === filter);
                const invitableRows = rows.filter(canSend);
  const invitable = invitableRows.map(v => v.id);
  const handsets = new Set(invitableRows.map(v => v.handset_key || v.id)).size;
  const state = filter === 'all' ? 'all profiles' : DEMO_STATE_WORD[filter] || filter;
  const notCalled = claims.filter(c => !c.contacted).length;
  const stateWord = (st: string) => DEMO_STATE_WORD[st] || cap(st);
  const markContacted = async (cl: ClaimRequest) => {
    try {
      await fetch(`${API_BASE}/api/v2/admin/demo/claims/${cl.id}/contacted`, { method: 'PATCH', headers: adminHeaders(), body: JSON.stringify({ contacted: !cl.contacted }) });
      setClaims(prev => prev.map(x => x.id === cl.id ? { ...x, contacted: !cl.contacted } : x));
    } catch { showToast('Could not update.', true); }
  };

  return (
    <div>
      <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />
      <PageHead title="Demo profiles" sub={`${vendors.length} profiles · ${notCalled} ${notCalled === 1 ? 'claim' : 'claims'} to call`} action={<Pill onClick={() => { setShowCreate(true); setShowBulk(false); }}>+ New demo</Pill>} />
      <Tabs value={tab} onChange={k => setTab(k as Tab)} items={[
        { key: 'board', label: 'Profiles', n: vendors.length },
        { key: 'claims', label: 'Claimed', n: claims.length },
        { key: 'leads', label: 'Enquiries', n: leads.length },
        { key: 'funnel', label: 'Progress' },
      ]} />

      {tab === 'board' && (
        <>
          <Chips value={filter} onChange={setFilter} items={[{ key: 'all', label: 'All', n: vendors.length }].concat(columns.map(([st, rows]) => ({ key: st, label: stateWord(st), n: rows.length })))} />
          {invitableRows.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', padding: '10px 14px', borderRadius: 14, border: `1px solid ${C.warn}`, marginBottom: 12 }}>
              <span style={{ flex: 1, minWidth: 160, font: F.t4, color: C.ink }}>{invitableRows.length} {invitableRows.length === 1 ? 'profile is' : 'profiles are'} ready and not invited yet</span>
              <Pill disabled={busy !== ''} onClick={() => handleInviteBatch(invitable, handsets, state)}>{busy.startsWith('batch:') ? 'Sending…' : `Send ${handsets} invite${handsets === 1 ? '' : 's'}`}</Pill>
            </div>
          )}
          {loading ? (
            <List>{[1, 2, 3].map(i => <div key={i} className="shimmer" style={{ height: 96, borderBottom: `0.5px solid ${C.line}` }} />)}</List>
          ) : (
            <>
              <CountLine n={rows.length} one="profile" many="profiles" />
              <List>
                {rows.length === 0 ? <Empty>No demo profiles here. Make one with + New demo.</Empty> : rows.map((v, i) => {
                  const age = ageDays(v);
                  const facts = [cap(v.category), v.city, `${v.photos.length} ${v.photos.length === 1 ? 'photo' : 'photos'}`, age === null ? null : age === 0 ? 'in this step since today' : `${age} ${age === 1 ? 'day' : 'days'} in this step`, v.active === false ? 'Switched off' : null].filter(Boolean).join(' · ');
                  return (
                    <PersonRow key={v.id} last={i === rows.length - 1} onOpen={() => setOpenId(v.id)} name={v.display_name}
                      tag={stateWord(v.state || 'legacy')} tagTone={v.linkage_held_by ? C.bad : v.state === 'claimed' ? C.ok : v.state === 'created' ? C.warn : v.state === 'expired' ? C.mute : C.accent}
                      line={facts} phone={v.whatsapp_phone} bare>
                      {v.shared_handset && <div style={{ font: F.t4, color: C.warn, padding: '0 14px 8px' }}>On a shared handset with another profile</div>}
                      {v.linkage_held_by && <div style={{ font: F.t4, color: C.bad, padding: '0 14px 8px' }}>Cannot invite: this number is linked to @{v.linkage_held_by}</div>}
                      <ActionStrip items={[
                        canSend(v) && { label: busy === v.id ? 'Sending' : 'Send invite', primary: true, busy: busy === v.id, onClick: () => handleInvite(v) },
                        v.discover_eligible ? { label: 'Hide from Discover', onClick: () => handleDiscoverToggle(v.id, false) }
                          : v.active !== false && { label: 'Show on Discover', onClick: () => handleDiscoverToggle(v.id, true) },
                        { label: 'More', onClick: () => setOpenId(v.id) },
                      ]} />
                    </PersonRow>
                  );
                })}
              </List>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" onClick={() => { setShowBulk(true); setShowCreate(false); }} style={{ minHeight: 44, margin: '10px 0', background: 'none', border: 'none', color: C.accent, font: F.t4 }}>Build many from a sheet</button>
              </div>
            </>
          )}
        </>
      )}

      {tab === 'claims' && (
        <>
          <CountLine n={claims.length} one="claim" many="claims" />
          <List>
            {loading ? <Empty>Loading…</Empty> : claims.length === 0 ? <Empty>No claims yet.</Empty> : claims.map((cl, i) => (
              <PersonRow key={cl.id} last={i === claims.length - 1} name={cl.vendor_name || '@' + cl.ig_handle}
                tag={cl.contacted ? 'Called' : 'Not called yet'} tagTone={cl.contacted ? C.mute : C.warn}
                line={`@${cl.ig_handle} · claimed their demo ${when(cl.claimed_at)}`} phone={cl.phone} bare>
                <ActionStrip items={[{ label: cl.contacted ? 'Mark as not called' : 'Mark as called', primary: !cl.contacted, onClick: () => markContacted(cl) }]} />
              </PersonRow>
            ))}
          </List>
        </>
      )}

      {tab === 'leads' && (
        <>
          <CountLine n={leads.length} one="enquiry" many="enquiries" />
          <List>
            {loading ? <Empty>Loading…</Empty> : leads.length === 0 ? <Empty>No enquiries on demo profiles yet.</Empty> : leads.map((l, i) => (
              <PersonRow key={l.id} last={i === leads.length - 1} name={l.bride_name}
                tag={l.otp_verified ? 'Number checked' : 'Number not checked'} tagTone={l.otp_verified ? C.ok : C.mute}
                line={[`Asked @${l.demo_vendor_handle}`, l.bride_wedding_city, l.bride_wedding_date ? `wedding ${fullDate(l.bride_wedding_date)}` : null, `on ${fullDate(l.created_at)}`].filter(Boolean).join(' · ')}
                phone={l.bride_phone} />
            ))}
          </List>
        </>
      )}

      {tab === 'funnel' && (
        <div style={{ display: 'grid', gap: 18 }}>
          <List>
            <div style={{ padding: '14px 16px' }}>
              <div style={{ font: F.t3, color: C.ink, marginBottom: 12 }}>How far demo profiles get</div>
              {funnel.map((f, i) => {
                const prev = i === 0 ? null : funnel[i - 1].n;
                const pct = prev && prev > 0 ? Math.round((f.n / prev) * 100) : null;
                const top = funnel[0].n || 1;
                return (
                  <div key={f.stage} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, marginBottom: 4 }}>
                      <span style={{ font: F.t4, color: C.soft }}>{FUNNEL_WORD[f.stage] || cap(f.stage)}</span>
                      <span style={{ font: F.t4, color: C.ink }}>{f.n}{pct === null ? '' : <span style={{ color: C.mute }}> · {pct}% of the step before</span>}</span>
                    </div>
                    <div style={{ height: 6, background: C.hover, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ width: `${Math.round((f.n / top) * 100)}%`, height: '100%', background: C.primary }} />
                    </div>
                  </div>
                );
              })}
              <div style={{ font: F.t5, color: C.mute, marginTop: 8 }}>Counted from when each step happened, so a claimed profile counts at every step it passed. Profiles that were never invited sit outside this count.</div>
            </div>
          </List>
          <Group title={`By trade and city · ${byCategoryCity.length}`}>
            {byCategoryCity.length === 0 ? <Empty>Nothing made yet.</Empty> : byCategoryCity.map(([k, c], i) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: '12px 14px', borderBottom: i === byCategoryCity.length - 1 ? 'none' : `0.5px solid ${C.line}` }}>
                <span style={{ font: F.t3, color: C.ink }}>{k}</span>
                <span style={{ font: F.t4, color: C.soft }}>{c.built} made · {c.invited} invited · {c.claimed} claimed</span>
              </div>
            ))}
          </Group>
        </div>
      )}

      {open && (() => { const v = open; return (
        <Sheet title={open.display_name} sub={[`@${open.ig_handle}`, cap(open.category), open.city, stateWord(open.state || 'legacy')].filter(Boolean).join(' · ')} onClose={() => setOpenId(null)}>
          {open.rate_display && <SheetNote>{open.rate_display}</SheetNote>}
          <SheetRow label={copied === open.id ? 'Link copied' : 'Copy the demo link'} sub={`demo.thedreamwedding.in/vendor/${open.ig_handle}`} onClick={() => copyUrl(open.ig_handle, open.id)} />
          <SheetRow label="Open the demo page" href={`https://demo.thedreamwedding.in/vendor/${open.ig_handle}`} />
          {canSend(v) && (
            <SheetRow label={busy === v.id ? 'Sending…' : 'Send invite'} sub="On WhatsApp, asks you first" onClick={() => handleInvite(v)} />
          )}
          <SheetRow label="Add 10 sample enquiries" sub="Fills the demo with practice enquiries, asks you first" busy={busy === open.id} onClick={() => { if (window.confirm(`Add 10 sample enquiries to ${open.display_name}?`)) handleSeedLeads(open); }} />
          {open.discover_eligible
            ? <SheetRow label="Hide from Discover" onClick={() => handleDiscoverToggle(open.id, false)} />
            : open.active !== false && <SheetRow label="Show on Discover" onClick={() => handleDiscoverToggle(open.id, true)} />}
          {open.active !== false
            ? <DangerLast label="Switch off this demo profile" lost="The demo page stops opening and it leaves Discover. Its enquiries and claims stay on file." confirmWord="Yes, switch off" onConfirm={async () => { await handleDeactivate(open.id); setOpenId(null); }} />
            : <SheetNote>Switched off</SheetNote>}
        </Sheet>
      ); })()}

      {showCreate && (
        <Sheet title="New demo profile" sub={`Needs a handle, a name, a trade, a city and at least ${floor} photos`} onClose={() => { setShowCreate(false); resetCreateForm(); }}>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <FieldInput label="Instagram handle (becomes the link)" value={igHandle} onChange={setIgHandle} placeholder="makeupbyswatiroy" hint="Required" />
            <FieldInput label="Name" value={dispName} onChange={setDispName} placeholder="Swati Tomar" hint="Required" />
            <FieldSelect label="Trade" value={category} onChange={setCategory} options={CATEGORIES} hint="Required" />
            <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" hint="Required" />
            <FieldInput label="WhatsApp number" value={waPhone} onChange={setWaPhone} placeholder="+919888294440" />
            <FieldInput label="Price shown" value={rateDisplay} onChange={setRateDisplay} placeholder="Rs 50,000 to Rs 2,00,000" />
            <div>
              <div style={{ font: F.t4, color: C.mute, marginBottom: 6 }}>About</div>
              <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Short bio" rows={3}
                style={{ width: '100%', background: C.input, border: `1px solid ${C.inputLine}`, borderRadius: 12, padding: '10px 14px', font: F.t3, color: C.ink, resize: 'vertical', outline: 'none' }} />
            </div>
            <div style={{ marginTop: 8 }}>
              <div style={{ font: F.t4, color: C.mute, marginBottom: 8 }}>Photos · {photos.length} · min {floor} · tap one to make it the cover</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                    <img src={p.url} alt="" onClick={() => setHero(i)} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: p.is_hero ? `2px solid ${C.accent}` : `0.5px solid ${C.line}`, cursor: 'pointer' }} />
                    {p.is_hero && <div style={{ position: 'absolute', bottom: 3, left: 3, background: C.primary, borderRadius: 4, padding: '1px 5px', font: F.t5, fontSize: 10, color: C.onPrimary }}>Cover</div>}
                    <button type="button" aria-label="Remove photo" onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -10, right: -10, width: 44, height: 44, background: 'transparent', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ width: 20, height: 20, borderRadius: 10, background: C.bad, color: C.onPrimary, fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</span>
                    </button>
                  </div>
                ))}
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', minHeight: 44, border: `1px solid ${C.line}`, borderRadius: 12, padding: '0 16px', font: F.t4, color: uploading ? C.mute : C.soft, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                {uploading ? 'Uploading…' : '+ Add photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
              {/* The photo floor is the server's (photoFloor(srvFloor)); this sheet only shows it. */}
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 12, flexWrap: 'wrap' }}>
              <Pill onClick={handleCreate} disabled={creating || uploading}>{creating ? 'Making…' : 'Make demo profile'}</Pill>
            </div>
          </div>
        </Sheet>
      )}

      {showBulk && (
        <Sheet title="Build many from a sheet" sub="One demo per line, separated by tabs" onClose={() => setShowBulk(false)}>
          <div style={{ borderTop: `0.5px solid ${C.line}`, padding: '12px 18px' }}>
            <p style={{ font: F.t4, color: C.soft, margin: '0 0 10px' }}>handle, name, trade, city, phone, price, about, photo links (space-separated). Paste photo links yourself: nothing is fetched from Instagram. Rows already on file are skipped, so a corrected sheet can be pasted again whole.</p>
            <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6}
              placeholder={'swatimakeup\tSwati Tomar\tmakeup\tDelhi\t+919888294440\tRs 50,000 to Rs 2,00,000\tBridal specialist\thttps://… https://…'}
              style={{ width: '100%', background: C.input, border: `1px solid ${C.inputLine}`, borderRadius: 12, padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: C.ink, resize: 'vertical', outline: 'none' }} />
            <div style={{ paddingTop: 12 }}><Pill onClick={handleBulk} disabled={bulkBusy}>{bulkBusy ? 'Building…' : `Build ${parseBulk(bulkText).length} demos`}</Pill></div>
            {bulkResult.length > 0 && (
              <div style={{ marginTop: 12, display: 'grid', gap: 4 }}>
                {bulkResult.map((l, i) => <div key={i} style={{ font: F.t4, color: i === 0 ? C.ink : C.soft }}>{l}</div>)}
              </div>
            )}
          </div>
        </Sheet>
      )}
    </div>
  );
}
