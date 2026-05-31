'use client';
// app/admin/demo/page.tsx
// Admin: create/manage demo vendor profiles and seed mock leads.

import { useEffect, useState, useCallback } from 'react';
import {
  PageHeader, T, GoldBtn, GhostBtn, Toast,
  FieldInput, FieldSelect,
} from '../_components/AdminUI';

const API_BASE  = process.env.NEXT_PUBLIC_API_BASE  || 'https://dream-os-production.up.railway.app';
const ADMIN_PWD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Liza@2551354';

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

type Tab = 'vendors' | 'leads' | 'claims';

interface DemoVendor {
  id: string; ig_handle: string; display_name: string; category: string;
  city: string; about: string | null; rate_display: string | null;
  whatsapp_phone: string | null;
  photos: Array<{ url: string; is_hero?: boolean; cloudinary_id?: string }>;
  active: boolean; created_at: string; discover_eligible?: boolean;
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
    headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD, ...(opts?.headers || {}) },
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

export default function DemoAdminPage() {
  const [tab,      setTab]      = useState<Tab>('vendors');
  const [vendors,  setVendors]  = useState<DemoVendor[]>([]);
  const [leads,    setLeads]    = useState<DemoLead[]>([]);
  const [claims,   setClaims]   = useState<ClaimRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [copied,   setCopied]   = useState('');

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

  // Seed leads
  const [seeding,    setSeeding]    = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, lRes, cRes] = await Promise.all([
        adminFetch('/api/v2/admin/demo/vendors'),
        adminFetch('/api/v2/admin/demo/leads'),
        fetch(`${API_BASE}/api/v2/admin/demo/claims`, { headers: { 'x-admin-password': ADMIN_PWD } }).then(r => r.json()).catch(() => ({ ok: false })),
      ]);
      if (vRes.ok) setVendors(vRes.vendors || []);
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
    if (photos.length < 3) { showToast('Minimum 3 photos required.', true); return; }
    setCreating(true);
    try {
      const d = await adminFetch('/api/v2/admin/demo/vendors', {
        method: 'POST',
        body: JSON.stringify({ ig_handle: igHandle.trim().toLowerCase(), display_name: dispName.trim(), category, city: city.trim(), whatsapp_phone: waPhone.trim() || null, about: about.trim() || null, rate_display: rateDisplay.trim() || null, photos }),
      });
      if (!d.ok) { showToast(d.error || 'Failed.', true); setCreating(false); return; }
      showToast('Created ✓  ' + d.demo_url);
      setShowCreate(false); resetCreateForm(); load();
    } catch { showToast('Failed to create.', true); }
    setCreating(false);
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

  function copyUrl(handle: string, id: string) {
    const url = `https://demo.thedreamwedding.in/vendor/${handle}`;
    if (navigator.clipboard) navigator.clipboard.writeText(url).catch(() => {});
    setCopied(id); setTimeout(() => setCopied(''), 2000);
  }

  async function handleSeedLeads(vendor: DemoVendor) {
    setSeeding(true); let count = 0;
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
    setSeeding(false); load();
  }

  return (
    <div style={{ padding: '0 0 60px' }}>
      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}

      <PageHeader
        title="Demo Profiles"
        sub="Vendor demo links for outreach. No auth — handle is identity."
        action={<GoldBtn label={showCreate ? 'Close' : '+ Create Demo'} onClick={() => { if (showCreate) { setShowCreate(false); resetCreateForm(); } else { setShowCreate(true); } }} />}
      />

      {/* Create Demo form — inline, no sheet */}
      {showCreate && (
        <div style={{ margin: '0 24px 24px', background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20 }}>
          <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 16 }}>Create Demo Profile</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FieldInput label="IG Handle (becomes URL)" value={igHandle} onChange={setIgHandle} placeholder="makeupbyswatiroy" />
            <FieldInput label="Display Name" value={dispName} onChange={setDispName} placeholder="Swati Tomar" />
            <FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES} />
            <FieldInput label="City" value={city} onChange={setCity} placeholder="Delhi" />
            <FieldInput label="WhatsApp Number" value={waPhone} onChange={setWaPhone} placeholder="+919888294440" />
            <FieldInput label="Rate Display" value={rateDisplay} onChange={setRateDisplay} placeholder="Rs 50K – Rs 2L" />
            <div>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: T.soft, marginBottom: 8 }}>About</div>
              <textarea value={about} onChange={e => setAbout(e.target.value)} placeholder="Short bio…" rows={3}
                style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '10px 14px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, resize: 'vertical' as const, outline: 'none' }} />
            </div>
            <div>
              <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase' as const, color: T.soft, marginBottom: 8 }}>
                Photos ({photos.length} · min 3 · tap to set hero)
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
              {photos.length < 10 && (
                <label style={{ display: 'inline-block', background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '8px 16px', fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: uploading ? T.muted : T.soft, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                  {uploading ? 'Uploading…' : '+ Add Photo'}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
                </label>
              )}
            </div>
            <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
              <GhostBtn label="Cancel" onClick={() => { setShowCreate(false); resetCreateForm(); }} />
              <GoldBtn label={creating ? 'Creating…' : 'Create Demo'} onClick={handleCreate} disabled={creating || uploading} />
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, padding: '0 24px 20px' }}>
        {(['vendors', 'leads', 'claims'] as Tab[]).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? T.gold : T.card, border: `0.5px solid ${tab === t ? T.gold : T.border}`, borderRadius: 10, padding: '7px 16px', fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase' as const, color: tab === t ? T.ink : T.soft, cursor: 'pointer' }}>
            {t === 'vendors' ? `Profiles (${vendors.length})` : t === 'leads' ? `Leads (${leads.length})` : `Claims (${claims.length})`}
          </button>
        ))}
      </div>

      {/* Vendors list */}
      {tab === 'vendors' && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {loading
            ? <div style={{ color: T.soft, fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: 20 }}>Loading…</div>
            : vendors.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No demo profiles yet. Create one above.</div>
            : vendors.map(v => (
              <div key={v.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: '16px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: T.ff.body, fontSize: 15, fontWeight: 600, color: T.ink }}>{v.display_name}</span>
                      <span style={{ fontFamily: T.ff.label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: v.active ? T.success : T.muted, background: v.active ? 'rgba(78,201,148,0.12)' : 'rgba(240,234,224,0.06)', borderRadius: 8, padding: '2px 7px' }}>
                        {v.active ? 'active' : 'inactive'}
                      </span>
                      {v.discover_eligible && (
                        <span style={{ fontFamily: T.ff.label, fontSize: 8, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' as const, color: T.gold, background: T.goldSoft, borderRadius: 8, padding: '2px 7px' }}>
                          in discover
                        </span>
                      )}
                    </div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.15em', color: T.gold, textTransform: 'uppercase' as const, marginBottom: 4 }}>
                      @{v.ig_handle} · {v.category} · {v.city}
                    </div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>
                      {v.photos.length} photos · {fmt(v.created_at)}{v.rate_display ? ` · ${v.rate_display}` : ''}
                    </div>
                    <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' as const }}>
                      <code style={{ fontFamily: 'monospace', fontSize: 11, color: T.gold, background: T.goldSoft, padding: '4px 10px', borderRadius: 6 }}>
                        demo.thedreamwedding.in/vendor/{v.ig_handle}
                      </code>
                      <button onClick={() => copyUrl(v.ig_handle, v.id)} style={{ background: copied === v.id ? 'rgba(78,201,148,0.15)' : T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '5px 12px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase' as const, color: copied === v.id ? T.success : T.soft, cursor: 'pointer' }}>
                        {copied === v.id ? 'Copied ✓' : 'Copy URL'}
                      </button>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' as const }}>
                      <GhostBtn label="Seed Leads" onClick={() => { if(window.confirm(`Seed 10 mock leads for ${v.display_name}?`)) handleSeedLeads(v); }} small />
                      {v.discover_eligible
                        ? <GhostBtn label="Remove from Discover" onClick={() => handleDiscoverToggle(v.id, false)} danger small />
                        : v.active && <GhostBtn label="Add to Discover" onClick={() => handleDiscoverToggle(v.id, true)} small />}
                      {v.active && <GhostBtn label="Deactivate" onClick={() => handleDeactivate(v.id)} danger small />}
                    </div>
                  </div>
                  {v.photos[0] && (
                    <div style={{ width: 60, height: 60, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                      <img src={(v.photos.find(p => p.is_hero) || v.photos[0]).url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  )}
                </div>
              </div>
            ))
          }
        </div>
      )}

      {/* Leads list */}
      {tab === 'leads' && (
        <div style={{ padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {loading
            ? <div style={{ color: T.soft, fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: 20 }}>Loading…</div>
            : leads.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No demo leads yet.</div>
            : leads.map(l => (
              <div key={l.id} style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 10, padding: '12px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 3 }}>{l.bride_name}</div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.12em', color: T.gold, textTransform: 'uppercase' as const, marginBottom: 3 }}>@{l.demo_vendor_handle}</div>
                    <div style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>{[l.bride_wedding_city, l.bride_wedding_date].filter(Boolean).join(' · ')}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4 }}>
                    <span style={{ fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: l.otp_verified ? T.success : T.muted }}>
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
            ? <div style={{ color: T.soft, fontFamily: T.ff.label, fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase' as const, padding: 20 }}>Loading…</div>
            : claims.length === 0
            ? <div style={{ color: T.soft, fontFamily: T.ff.body, fontSize: 14, padding: 20 }}>No claims yet.</div>
            : claims.map(cl => (
              <div key={cl.id} style={{ background: T.card, border: `0.5px solid ${cl.contacted ? T.border : T.gold}`, borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontFamily: T.ff.body, fontSize: 15, fontWeight: 600, color: T.ink }}>{cl.vendor_name || cl.ig_handle}</span>
                      {!cl.contacted && <span style={{ fontFamily: T.ff.label, fontSize: 7, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: T.gold, background: T.goldSoft, borderRadius: 6, padding: '2px 7px' }}>New</span>}
                    </div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 9, letterSpacing: '0.14em', color: T.gold, textTransform: 'uppercase' as const, marginBottom: 4 }}>@{cl.ig_handle}</div>
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
                            headers: { 'Content-Type': 'application/json', 'x-admin-password': ADMIN_PWD },
                            body: JSON.stringify({ contacted: !cl.contacted }),
                          });
                          setClaims(prev => prev.map(x => x.id === cl.id ? { ...x, contacted: !cl.contacted } : x));
                        } catch { showToast('Failed to update.', true); }
                      }}
                      style={{ background: cl.contacted ? 'rgba(78,201,148,0.1)' : T.card, border: `0.5px solid ${cl.contacted ? T.success : T.border}`, borderRadius: 8, padding: '6px 12px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: cl.contacted ? T.success : T.soft, cursor: 'pointer' }}
                    >
                      {cl.contacted ? 'Contacted ✓' : 'Mark Contacted'}
                    </button>
                    <a href={`https://wa.me/${cl.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer"
                      style={{ background: 'rgba(37,211,102,0.12)', border: '0.5px solid rgba(37,211,102,0.35)', borderRadius: 8, padding: '6px 12px', fontFamily: T.ff.label, fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: '#25d366', textDecoration: 'none', display: 'block', textAlign: 'center' as const }}>
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
