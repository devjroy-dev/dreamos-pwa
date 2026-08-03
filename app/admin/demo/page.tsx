'use client';
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
import {
  PageHeader, T, GoldBtn, GhostBtn, Toast,
  FieldInput, FieldSelect,
} from '../_components/AdminUI';

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
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
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
    if (demos.length === 0) { showToast('Nothing to build — check the paste.', true); return; }
    setBulkBusy(true); setBulkResult([]);
    try {
      const d = await adminFetch('/api/v2/admin/demo/bulk', { method: 'POST', body: JSON.stringify({ demos }) });
      if (!d.ok) { showToast(d.error || 'Bulk failed.', true); setBulkBusy(false); return; }
      const lines: string[] = [`Built ${d.insertedCount} · already on file ${d.skippedCount} · refused ${d.failedCount}`];
      for (const f of (d.failed || [])) lines.push(`refused — ${f.ig_handle || 'row'}: ${f.error}${f.detail ? ` (${f.detail})` : ''}`);
      for (const s of (d.skipped || [])) lines.push(`already on file — ${s}`);
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
      showToast('Deactivated.');
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
        showToast(`${d.error}${d.detail ? ` — ${d.detail}` : ''}`, true);
      } else {
        showToast(`Invite sent to ${v.display_name}.${d.prospect_linked ? '' : ' Linkage did not land — check the log.'}`);
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
    showToast(`Seeded ${count} leads for ${vendor.display_name}.`);
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

  return (
    <div style={{ padding: '0 0 60px' }}>
      {/* FORK 2(D): mounted UNCONDITIONALLY. Visibility is the message prop
          now, so the component's own timer is keyed on message identity rather
          than on this arrow's identity. The conditional mount is what let an
          unrelated re-render tear the timer down and re-arm it. */}
      <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />

      <PageHeader
        title="Demo Profiles"
        sub="Vendor demo links for outreach. No auth — handle is identity."
        action={<GoldBtn label={showCreate ? 'Close' : '+ Create Demo'} onClick={() => { if (showCreate) { setShowCreate(false); resetCreateForm(); } else { setShowCreate(true); setShowBulk(false); } }} />}
      />

      {/* Create Demo form — inline, no sheet */}
      {showCreate && (
        <div style={{ margin: '0 24px 24px', background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Create Demo Profile</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* V1, founder-vetoed and frozen at the BYTE: `Required`. These are
                THE FOUR the pre-flight refuses on, and nothing in this form said
                so — the only signal was the failure itself, delivered by a toast
                the two F-08.42 limbs had broken. The mark and the message are
                the same rule stated twice, before and after the press.
                `FieldSelect` gained its hint slot for the third of them. */}
            <FieldInput label="IG Handle (becomes URL)" value={igHandle} onChange={setIgHandle} placeholder="makeupbyswatiroy" hint="Required" />
            <FieldInput label="Display Name" value={dispName} onChange={setDispName} placeholder="Swati Tomar" hint="Required" />
            <FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} hint="Required" />
            <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" hint="Required" />
            <FieldInput label="WhatsApp Number" value={waPhone} onChange={setWaPhone} placeholder="+919888294440" />
            {/* C5 — the register. "Rs", grouped Indian, never the glyph and never
                a k/L/Cr form (lib/vendor/format.ts, Rule V7). The old hint read
                "Rs 50K – Rs 2L" and it came from 0057_demo_system.sql's DDL
                comment, which also carries the ₹ glyph and cannot be edited now
                the migration has run — the code is the only place it can be fixed. */}
            <FieldInput label="Rate Display" value={rateDisplay} onChange={setRateDisplay} placeholder="Rs 50,000 – Rs 2,00,000" />
            <div>
              <div style={{ ...label, letterSpacing: '0.18em', color: T.soft, marginBottom: 8 }}>About</div>
              <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Short bio…" rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, resize: 'vertical' as const, outline: 'none' }} />
            </div>
            <div>
              {/* C3 — the floor is the server's number. */}
              <div style={{ ...label, letterSpacing: '0.18em', color: T.soft, marginBottom: 8 }}>
                Photos ({photos.length} · min {floor} · tap to set hero)
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 10 }}>
                {photos.map((p, i) => (
                  <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                    <img src={p.url} alt="" onClick={() => setHero(i)} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: p.is_hero ? `2px solid ${T.gold}` : `0.5px solid ${T.border}`, cursor: 'pointer' }} />
                    {p.is_hero && <div style={{ position: 'absolute', top: 3, left: 3, background: T.gold, borderRadius: 4, padding: '1px 5px', fontFamily: T.ff.label, fontSize: 7, color: T.ink }}>HERO</div>}
                    <button onClick={() => removePhoto(i)} style={{ position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, background: T.danger, border: 'none', color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                  </div>
                ))}
              </div>
              {/* The `photos.length < 10` hide is DELETED, not raised. The ceiling
                  is the server's and this screen holds no opinion about it. */}
              <label style={{ display: 'inline-block', background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '8px 16px', ...label, color: uploading ? T.muted : T.soft, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                {uploading ? 'Uploading…' : '+ Add Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <GhostBtn label="Cancel" onClick={() => { setShowCreate(false); resetCreateForm(); }} />
              <GoldBtn label={creating ? 'Creating…' : 'Create Demo'} onClick={handleCreate} disabled={creating || uploading} />
            </div>
          </div>
        </div>
      )}

      {/* Bulk build */}
      <div style={{ padding: '0 24px 16px' }}>
        <GhostBtn label={showBulk ? 'Close bulk build' : 'Bulk build from a sheet'} small onClick={() => { setShowBulk(!showBulk); setShowCreate(false); }} />
      </div>
      {showBulk && (
        <div style={{ margin: '0 24px 24px', background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 10 }}>Bulk Build</p>
          <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, marginBottom: 12, lineHeight: 1.6 }}>
            One demo per line, tab-separated:<br />
            <code style={{ fontFamily: 'monospace', fontSize: 11, color: T.gold }}>handle · name · category · city · phone · rate · about · photo URLs (space-separated)</code><br />
            Paste photo URLs yourself — there is no Instagram fetch. Rows already on file are skipped, so a corrected sheet can be re-uploaded whole.
          </p>
          <textarea value={bulkText} onChange={e => setBulkText(e.target.value)} rows={6}
            placeholder={'swatimakeup\tSwati Tomar\tmakeup\tDelhi\t+919888294440\tRs 50,000 – Rs 2,00,000\tBridal specialist\thttps://… https://…'}
            style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: 'monospace', fontSize: 12, color: T.ink, resize: 'vertical' as const, outline: 'none' }} />
          <div style={{ display: 'flex', gap: 10, paddingTop: 12, alignItems: 'center' }}>
            <GoldBtn label={bulkBusy ? 'Building…' : `Build ${parseBulk(bulkText).length} demos`} onClick={handleBulk} disabled={bulkBusy} />
          </div>
          {bulkResult.length > 0 && (
            <div style={{ marginTop: 14, display: 'flex', flexDirection: 'column', gap: 4 }}>
              {bulkResult.map((l, i) => (
                <div key={i} style={{ fontFamily: T.ff.body, fontSize: 12, color: i === 0 ? T.ink : T.soft }}>{l}</div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px', flexWrap: 'wrap' as const }}>
        {(['board', 'funnel', 'leads', 'claims'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? T.gold : T.card, border: `0.5px solid ${tab === t ? T.gold : T.border}`, borderRadius: 10, padding: '7px 16px', fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: tab === t ? T.ink : T.soft, cursor: 'pointer' }}>
            {t === 'board' ? `Board (${vendors.length})` : t === 'funnel' ? 'Funnel' : t === 'leads' ? `Leads (${leads.length})` : `Claims (${claims.length})`}
          </button>
        ))}
      </div>

      {/* THE LIFECYCLE BOARD */}
      {tab === 'board' && (
        <div style={{ padding: '0 24px' }}>
          {loading
            ? <div style={{ ...label, color: T.soft, fontSize: 10, padding: 20 }}>Loading…</div>
            : vendors.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No demo profiles yet. Create one above.</div>
            : (
            <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 12 }}>
              {columns.map(([state, rows]) => {
                // ── F-08.39, PRESENTATION LIMB (CE-ruled (c), both limbs) ──
                // `active` joins the filter. The route refuses an inactive demo
                // because its public landing does not render (the MECHANISM
                // limb, at _inviteOne); this filter is why the founder never
                // meets that refusal at a control that looked armed.
                // NEITHER LIMB STANDS ALONE — the same two-layer shape the photo
                // floor was ruled into this sitting: the server owns the rule,
                // the surface renders it and holds no opinion of its own.
                //
                // ── F-08.45 (CE-ruled 3-ii) ─ ONE PREDICATE, TWO CALL SITES ────
                // THIS FILTER AND THE PER-CARD BUTTON USED TO BE TWO HAND-WRITTEN
                // EXPRESSIONS AND THEY DRIFTED. `!linkage_held_by` was here and
                // absent there, so a row whose linkage is held elsewhere drew a
                // red border and a `linked to @X` badge beside an ARMED Send
                // invite that the route answers 409 `shared_handset`. The
                // archaeology: the concept entered this file at four sites in one
                // commit and did not reach the fifth; the later commit that
                // edited BOTH limbs added `active` to each and closed nothing.
                // `canSend` is now the only place either question is asked.
                //
                // THE STATE TERM IS THE SERVER'S (FORK 3(c)). `built`/`legacy`
                // was typed here twice; it is `demoLifecycle.INVITE_STATES`,
                // shipped on the list payload beside `states` and the photo
                // floor. This surface holds no opinion it could contradict.
                const canSend = (v: DemoVendor) =>
                  inviteStates.includes(v.state)
                  && !!v.whatsapp_phone
                  && !v.linkage_held_by
                  && v.active !== false;
                const invitableRows = rows.filter(canSend);
                const invitable = invitableRows.map(v => v.id);
                // ── F-08.40 — THE LABEL COUNTS HANDSETS, THE BATCH SENDS ROWS ─
                // Two rows on one phone send ONE template: the per-row guard
                // links the first and refuses the second. Sending both ids is
                // CORRECT and ruled — refusing the group would send zero where
                // this sends one. Only the promise on the button was wrong.
                // The key is the SERVER's; this file never normalizes a phone.
                const handsets = new Set(invitableRows.map(v => v.handset_key || v.id)).size;
                const canInvite = inviteStates.includes(state);
                return (
                  <div key={state} style={{ minWidth: 288, flex: '0 0 288px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, paddingBottom: 6, borderBottom: `0.5px solid ${T.border}` }}>
                      <span style={{ ...label, color: rows.length ? T.gold : T.dim, fontSize: 10, fontWeight: 600 }}>{state}</span>
                      <span style={{ fontFamily: T.ff.body, fontSize: 12, color: T.muted }}>{rows.length}</span>
                    </div>
                    {canInvite && invitable.length > 0 && (
                      <GhostBtn
                        label={busy === 'batch:' + state ? 'Sending…' : `Send ${handsets} invite${handsets === 1 ? '' : 's'}`}
                        small
                        disabled={busy !== ''}
                        onClick={() => handleInviteBatch(invitable, handsets, state)}
                      />
                    )}
                    {rows.length === 0 && (
                      <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.dim, padding: '10px 2px' }}>Empty.</div>
                    )}
                    {rows.map(v => {
                      const age = ageDays(v);
                      return (
                        <div key={v.id} style={{ background: T.card, border: `0.5px solid ${v.linkage_held_by ? T.danger : T.border}`, borderRadius: 12, padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 4 }}>{v.display_name}</div>
                              <div style={{ ...label, fontSize: 9, letterSpacing: '0.14em', color: T.gold, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                @{v.ig_handle} · {v.category} · {v.city}
                              </div>
                              <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>
                                {v.photos.length} photos · {age === null ? fmt(v.created_at) : `${age}d`}{v.rate_display ? ` · ${v.rate_display}` : ''}
                              </div>
                            </div>
                            {v.photos[0] && (
                              <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                                <img src={(v.photos.find(p => p.is_hero) || v.photos[0]).url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' as const, marginTop: 8 }}>
                            <span style={{ ...label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: v.active ? T.success : T.muted, background: v.active ? T.successSoft : 'rgba(240,234,224,0.06)', borderRadius: 8, padding: '2px 7px' }}>
                              {v.active ? 'active' : 'inactive'}
                            </span>
                            {v.discover_eligible && (
                              <span style={{ ...label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: T.gold, background: T.goldSoft, borderRadius: 8, padding: '2px 7px' }}>in discover</span>
                            )}
                            {v.shared_handset && (
                              <span style={{ ...label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: T.warning, background: 'rgba(212,160,23,0.15)', borderRadius: 8, padding: '2px 7px' }}>shared handset</span>
                            )}
                            {v.linkage_held_by && (
                              <span style={{ ...label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', color: T.danger, background: T.dangerSoft, borderRadius: 8, padding: '2px 7px' }}>
                                linked to @{v.linkage_held_by}
                              </span>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8, marginTop: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
                            <button onClick={() => copyUrl(v.ig_handle, v.id)} style={{ background: copied === v.id ? T.successSoft : T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '5px 12px', ...label, fontSize: 8, letterSpacing: '0.15em', color: copied === v.id ? T.success : T.soft, cursor: 'pointer' }}>
                              {copied === v.id ? 'Copied ✓' : 'Copy URL'}
                            </button>
                            <a href={`https://demo.thedreamwedding.in/vendor/${v.ig_handle}`} target="_blank" rel="noopener noreferrer"
                              style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '5px 12px', ...label, fontSize: 8, letterSpacing: '0.15em', color: T.soft, textDecoration: 'none' }}>
                              Open landing →
                            </a>
                          </div>

                          <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' as const }}>
                            {canSend(v) && (
                              <GhostBtn label={busy === v.id ? 'Sending…' : 'Send invite'} small disabled={busy !== ''} onClick={() => handleInvite(v)} />
                            )}
                            <GhostBtn label="Seed Leads" small disabled={busy !== ''} onClick={() => { if (window.confirm(`Seed 10 mock leads for ${v.display_name}?`)) handleSeedLeads(v); }} />
                            {v.discover_eligible
                              ? <GhostBtn label="Remove from Discover" onClick={() => handleDiscoverToggle(v.id, false)} danger small />
                              : v.active && <GhostBtn label="Add to Discover" onClick={() => handleDiscoverToggle(v.id, true)} small />}
                            {v.active && <GhostBtn label="Deactivate" onClick={() => handleDeactivate(v.id)} danger small />}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* THE FUNNEL */}
      {tab === 'funnel' && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ ...label, color: T.gold, fontWeight: 600, marginBottom: 14 }}>Conversion</div>
            {funnel.map((f, i) => {
              const prev = i === 0 ? null : funnel[i - 1].n;
              const pct = prev && prev > 0 ? Math.round((f.n / prev) * 100) : null;
              const top = funnel[0].n || 1;
              return (
                <div key={f.stage} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <span style={{ ...label, color: T.soft }}>{f.stage}</span>
                    <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink }}>
                      {f.n}{pct === null ? '' : <span style={{ color: T.muted }}> · {pct}% of {funnel[i - 1].stage}</span>}
                    </span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round((f.n / top) * 100)}%`, height: '100%', background: T.gold }} />
                  </div>
                </div>
              );
            })}
            <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted, marginTop: 10, lineHeight: 1.6 }}>
              Counted from the timestamps, not the current state — a claimed demo is counted at every stage it passed through.
              Rows that were never invited (legacy) sit outside this funnel and are on the board instead.
            </div>
          </div>

          <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px 20px' }}>
            <div style={{ ...label, color: T.gold, fontWeight: 600, marginBottom: 12 }}>By category and city</div>
            {byCategoryCity.length === 0
              ? <div style={{ fontFamily: T.ff.body, fontSize: 13, color: T.soft }}>Nothing built yet.</div>
              : byCategoryCity.map(([k, c]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '7px 0', borderBottom: `0.5px solid ${T.border}` }}>
                  <span style={{ fontFamily: T.ff.body, fontSize: 13, color: T.ink }}>{k}</span>
                  <span style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft, whiteSpace: 'nowrap' as const }}>
                    {c.built} built · {c.invited} invited · {c.claimed} claimed
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Leads list */}
      {tab === 'leads' && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading
            ? <div style={{ ...label, color: T.soft, fontSize: 10, padding: 20 }}>Loading…</div>
            : leads.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No demo leads yet.</div>
            : leads.map(l => (
              <div key={l.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3 }}>{l.bride_name}</div>
                    <div style={{ ...label, fontSize: 9, letterSpacing: '0.12em', color: T.gold, marginBottom: 3 }}>@{l.demo_vendor_handle}</div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>{[l.bride_wedding_city, l.bride_wedding_date].filter(Boolean).join(' · ')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ ...label, fontSize: 8, letterSpacing: '0.1em', color: l.otp_verified ? T.success : T.muted }}>
                      {l.otp_verified ? 'OTP ✓' : 'unverified'}
                    </span>
                    <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted }}>{fmt(l.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Claims list */}
      {tab === 'claims' && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading
            ? <div style={{ ...label, color: T.soft, fontSize: 10, padding: 20 }}>Loading…</div>
            : claims.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No claims yet.</div>
            : claims.map(cl => (
              <div key={cl.id} style={{ background: T.card, border: `0.5px solid ${cl.contacted ? T.border : T.gold}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: T.ff.body, fontSize: 15, fontWeight: 600, color: T.ink }}>{cl.vendor_name || cl.ig_handle}</span>
                      {!cl.contacted && <span style={{ ...label, fontSize: 7, fontWeight: 600, letterSpacing: '0.14em', color: T.gold, background: T.goldSoft, borderRadius: 6, padding: '2px 7px' }}>New</span>}
                    </div>
                    <div style={{ ...label, fontSize: 9, letterSpacing: '0.14em', color: T.gold, marginBottom: 4 }}>@{cl.ig_handle}</div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, color: T.ink, marginBottom: 6 }}>
                      <a href={`tel:${cl.phone}`} style={{ color: T.success, textDecoration: 'none' }}>{cl.phone}</a>
                    </div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft }}>{fmt(cl.claimed_at)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
                    <button
                      onClick={async () => {
                        try {
                          await fetch(`${API_BASE}/api/v2/admin/demo/claims/${cl.id}/contacted`, {
                            method: 'PATCH',
                            headers: adminHeaders(),
                            body: JSON.stringify({ contacted: !cl.contacted }),
                          });
                          setClaims(prev => prev.map(x => x.id === cl.id ? { ...x, contacted: !cl.contacted } : x));
                        } catch { showToast('Failed to update.', true); }
                      }}
                      style={{ background: cl.contacted ? 'rgba(78,201,148,0.1)' : T.card, border: `0.5px solid ${cl.contacted ? T.success : T.border}`, borderRadius: 8, padding: '6px 12px', ...label, fontSize: 8, letterSpacing: '0.14em', color: cl.contacted ? T.success : T.soft, cursor: 'pointer' }}
                    >
                      {cl.contacted ? 'Contacted ✓' : 'Mark Contacted'}
                    </button>
                    <a href={`https://wa.me/${cl.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ background: 'rgba(37,211,102,0.12)', border: '0.5px solid rgba(37,211,102,0.35)', borderRadius: 8, padding: '6px 12px', ...label, fontSize: 8, letterSpacing: '0.14em', color: '#25d366', textDecoration: 'none', display: 'block', textAlign: 'center' as const }}>
                      WhatsApp →
                    </a>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
      )}
    </div>
  );
}
