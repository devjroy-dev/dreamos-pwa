'use client';
import React from 'react';
// app/admin/demo-profiles/page.tsx
// Demo system admin UI — three sections:
//   1. Demo Vendors — create, list, copy link, deactivate
//   2. Demo Leads Inbox — view enquiries, mark as relayed
//   3. Bride Muse Pool — upload/manage curated images

import { useEffect, useState, useCallback } from 'react';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, FieldInput, FieldSelect } from '../_components/AdminUI';

const BACKEND = 'https://dream-os-production.up.railway.app';
const DEMO_UUID = 'bbbbbbbb-1111-1111-1111-bbbbbbbbbbbb';

const CATEGORIES = [
  'photographer','videographer','makeup_artist','mehendi_artist',
  'bridal_wear','groom_wear','jewellery','venue','caterer',
  'decorator','choreographer','dj','band','pandit','invitation_designer','event_manager',
];
const CITIES = [
  'Delhi','Mumbai','Bangalore','Hyderabad','Chennai','Kolkata',
  'Pune','Jaipur','Ahmedabad','Chandigarh','Lucknow','Surat',
  'Kochi','Goa','Udaipur','Agra','Amritsar','Gurugram','Noida',
];

interface DemoVendor {
  id: string; ig_handle: string; display_name: string;
  category: string; city: string; whatsapp_phone: string | null;
  active: boolean; lead_count: number; photo_count: number;
  demo_url: string; created_at: string;
}
interface DemoLead {
  id: string; demo_vendor_handle: string;
  bride_name: string; bride_phone: string;
  bride_ig_handle: string | null; bride_email: string | null;
  bride_wedding_date: string | null; bride_wedding_city: string | null;
  otp_verified: boolean; notified_vendor: boolean; admin_notified: boolean;
  created_at: string;
}
interface MuseImage {
  id: string; image_url: string; tags: string[];
  caption: string | null; display_order: number; active: boolean;
}

function fmt(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' });
}
function catLabel(c: string) {
  return c.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

async function adminFetch(path: string, opts?: RequestInit) {
  const pw = 'Liza@2551354';
  return fetch(`${BACKEND}${path}`, {
    ...opts,
    headers: { 'Content-Type': 'application/json', 'x-admin-password': pw, ...(opts?.headers || {}) },
  }).then(r => r.json());
}

async function uploadToDemo(file: File): Promise<{ image_url: string; cloudinary_id: string }> {
  const pw = 'Liza@2551354';
  const sign = await fetch(`${BACKEND}/api/v2/admin/demo/cloudinary-sign`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', 'x-admin-password': pw },
    body: JSON.stringify({ filename: file.name }),
  }).then(r => r.json());
  const fd = new FormData();
  Object.entries(sign.params as Record<string, string>).forEach(([k, v]) => fd.append(k, v));
  fd.append('file', file);
  const up = await fetch(sign.upload_url, { method: 'POST', body: fd });
  if (!up.ok) throw new Error('Upload failed');
  const d = await up.json();
  return { image_url: d.secure_url, cloudinary_id: d.public_id };
}

export default function DemoProfilesPage() {
  const [tab, setTab] = useState<'vendors' | 'leads' | 'muse'>('vendors');
  const [vendors,  setVendors]  = useState<DemoVendor[]>([]);
  const [leads,    setLeads]    = useState<DemoLead[]>([]);
  const [muse,     setMuse]     = useState<MuseImage[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [toast,    setToast]    = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [copied,   setCopied]   = useState('');

  // Create form
  const [showCreate,  setShowCreate]  = useState(false);
  const [igHandle,    setIgHandle]    = useState('');
  const [dispName,    setDispName]    = useState('');
  const [category,    setCategory]    = useState('');
  const [city,        setCity]        = useState('');
  const [waPhone,     setWaPhone]     = useState('');
  const [about,       setAbout]       = useState('');
  const [rateDisplay, setRateDisplay] = useState('');
  const [photos,      setPhotos]      = useState<Array<{ url: string; cloudinary_id: string; is_hero: boolean }>>([]);
  const [uploading,   setUploading]   = useState(false);
  const [creating,    setCreating]    = useState(false);

  // Muse form
  const [museTags,      setMuseTags]      = useState('');
  const [museCaption,   setMuseCaption]   = useState('');
  const [museUploading, setMuseUploading] = useState(false);

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [v, l, m] = await Promise.all([
        adminFetch('/api/v2/admin/demo/vendors'),
        adminFetch('/api/v2/admin/demo/leads'),
        adminFetch('/api/v2/admin/demo/muse-pool'),
      ]);
      if (v.ok) setVendors(v.vendors || []);
      if (l.ok) setLeads(l.leads || []);
      if (m.ok) setMuse(m.images || []);
    } catch { showToast('Failed to load.', true); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const copy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(''), 2000); });
  };

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const r = await uploadToDemo(file);
      setPhotos(prev => [...prev, { url: r.image_url, cloudinary_id: r.cloudinary_id, is_hero: prev.length === 0 }]);
      showToast(`Photo ${photos.length + 1} uploaded ✓`);
    } catch (err: any) { showToast('Upload failed: ' + err.message, true); }
    setUploading(false);
  }

  async function handleCreate() {
    if (!igHandle || !dispName || !category || !city) { showToast('Handle, name, category and city required.', true); return; }
    if (photos.length < 3) { showToast('Minimum 3 photos required.', true); return; }
    setCreating(true);
    try {
      const d = await adminFetch('/api/v2/admin/demo/vendors', {
        method: 'POST',
        body: JSON.stringify({ ig_handle: igHandle, display_name: dispName, category, city, whatsapp_phone: waPhone || null, about: about || null, rate_display: rateDisplay || null, photos }),
      });
      if (!d.ok) { showToast(d.error || 'Failed.', true); setCreating(false); return; }
      showToast('Demo created: ' + d.demo_url);
      setShowCreate(false); setIgHandle(''); setDispName(''); setCategory(''); setCity('');
      setWaPhone(''); setAbout(''); setRateDisplay(''); setPhotos([]);
      load();
    } catch { showToast('Failed to create.', true); }
    setCreating(false);
  }

  async function handleDeactivate(id: string) {
    await adminFetch(`/api/v2/admin/demo/vendors/${id}`, { method: 'DELETE' });
    showToast('Deactivated.'); load();
  }

  async function handleRelay(id: string) {
    await adminFetch(`/api/v2/admin/demo/leads/${id}/relay`, { method: 'POST' });
    showToast('Marked as relayed.'); load();
  }

  async function handleMuseUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setMuseUploading(true);
    try {
      const r = await uploadToDemo(file);
      const tags = museTags.split(',').map(t => t.trim()).filter(Boolean);
      await adminFetch('/api/v2/admin/demo/muse-pool', {
        method: 'POST',
        body: JSON.stringify({ image_url: r.image_url, cloudinary_id: r.cloudinary_id, tags, caption: museCaption || null }),
      });
      showToast('Image added ✓'); setMuseTags(''); setMuseCaption(''); load();
    } catch (err: any) { showToast('Upload failed: ' + err.message, true); }
    setMuseUploading(false);
  }

  async function handleMuseDelete(id: string) {
    await adminFetch(`/api/v2/admin/demo/muse-pool/${id}`, { method: 'DELETE' });
    showToast('Removed.'); load();
  }

  const unnotified = leads.filter(l => !l.notified_vendor && !l.admin_notified);

  return (
    <div style={{ minHeight: '100vh', background: T.bg, padding: '24px 20px 80px' }}>
      {toast && <Toast msg={toast} error={toastErr} onDone={() => setToast('')} />}
      <PageHeader
        title="Demo Profiles"
        sub={vendors.filter(v => v.active).length + ' active · ' + unnotified.length + ' unrelayed leads'}
      />

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['vendors', 'leads', 'muse'] as const).map(tb => (
          <button key={tb} onClick={() => setTab(tb)} style={{ background: tab === tb ? T.gold : T.card, border: `0.5px solid ${tab === tb ? T.gold : T.border}`, borderRadius: 10, padding: '8px 16px', fontFamily: T.ff.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: tab === tb ? '#0A0908' : T.soft, cursor: 'pointer' }}>
            {tb === 'leads' && unnotified.length > 0 ? `Leads (${unnotified.length})` : tb.charAt(0).toUpperCase() + tb.slice(1)}
          </button>
        ))}
      </div>

      {/* VENDORS */}
      {tab === 'vendors' && (
        <div>
          <GoldBtn label="+ Create Demo" onClick={() => setShowCreate(!showCreate)} />

          {showCreate && (
            <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 14, padding: 20, marginTop: 16, marginBottom: 24 }}>
              <p style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: T.ink, marginBottom: 16 }}>New Demo Profile</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                <FieldInput label="IG Handle (no @)" value={igHandle} onChange={setIgHandle} placeholder="makeupbyswatiroy" />
                <FieldInput label="Display Name" value={dispName} onChange={setDispName} placeholder="Swati Roy" />
                <FieldSelect label="Category" value={category} onChange={setCategory} options={CATEGORIES.map(c => ({ value: c, label: catLabel(c) }))} />
                <FieldSelect label="City" value={city} onChange={setCity} options={CITIES.map(c => ({ value: c, label: c }))} />
                <FieldInput label="WhatsApp (optional)" value={waPhone} onChange={setWaPhone} placeholder="+918757788550" />
                <FieldInput label="Rate Display (optional)" value={rateDisplay} onChange={setRateDisplay} placeholder="₹50K – ₹2L" />
              </div>
              <FieldInput label="About (optional)" value={about} onChange={setAbout} placeholder="Celebrity MUA based in Delhi..." />
              <div style={{ marginTop: 16, marginBottom: 12 }}>
                <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.soft, marginBottom: 8 }}>Photos ({photos.length}/20, min 3) — first is hero</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                  {photos.map((p, i) => (
                    <div key={i} style={{ position: 'relative' }}>
                      <img src={p.url} style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: i === 0 ? `2px solid ${T.gold}` : `0.5px solid ${T.border}` }} />
                      {i === 0 && <div style={{ position: 'absolute', top: 2, left: 2, background: T.gold, borderRadius: 4, padding: '1px 4px', fontFamily: T.ff.label, fontSize: 6, color: '#0A0908' }}>HERO</div>}
                      <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} style={{ position: 'absolute', top: -4, right: -4, background: T.danger, border: 'none', borderRadius: 50, width: 18, height: 18, color: '#fff', fontSize: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                    </div>
                  ))}
                </div>
                <label style={{ display: 'inline-block', background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '8px 14px', fontFamily: T.ff.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.soft, cursor: uploading ? 'not-allowed' : 'pointer' }}>
                  {uploading ? 'Uploading…' : '+ Add Photo'}
                  <input type="file" accept="image/*" onChange={handlePhotoUpload} disabled={uploading} style={{ display: 'none' }} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <GoldBtn label={creating ? 'Creating…' : 'Create Demo'} onClick={handleCreate} disabled={creating} />
                <GhostBtn label="Cancel" onClick={() => setShowCreate(false)} />
              </div>
            </div>
          )}

          {loading ? (
            <p style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 13, color: T.muted, marginTop: 16 }}>Loading…</p>
          ) : vendors.length === 0 ? (
            <p style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 13, color: T.muted, marginTop: 24 }}>No demo profiles yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {vendors.map(v => (
                <div key={v.id} style={{ background: T.card, border: `0.5px solid ${v.active ? T.border : 'rgba(255,255,255,0.05)'}`, borderRadius: 12, padding: '16px 18px', opacity: v.active ? 1 : 0.5 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: T.ink, marginBottom: 2 }}>{v.display_name}</p>
                      <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.gold }}>@{v.ig_handle} · {catLabel(v.category)} · {v.city}</p>
                    </div>
                    <div style={{ background: v.active ? 'rgba(92,224,160,0.1)' : T.card, border: `0.5px solid ${v.active ? T.success : T.border}`, borderRadius: 6, padding: '3px 8px', fontFamily: T.ff.label, fontSize: 7, color: v.active ? T.success : T.muted, letterSpacing: '0.1em' }}>{v.active ? 'ACTIVE' : 'INACTIVE'}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
                    <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted }}>{v.photo_count} photos</span>
                    <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted }}>{v.lead_count} leads</span>
                    {v.whatsapp_phone && <span style={{ fontFamily: T.ff.body, fontSize: 11, color: T.muted }}>WA: {v.whatsapp_phone}</span>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button onClick={() => copy(v.demo_url, v.id)} style={{ background: copied === v.id ? T.success : T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '7px 12px', fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: copied === v.id ? '#0A0908' : T.soft, cursor: 'pointer' }}>
                      {copied === v.id ? '✓ Copied' : 'Copy Link'}
                    </button>
                    <a href={v.demo_url} target="_blank" rel="noreferrer" style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '7px 12px', fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.soft, textDecoration: 'none', display: 'inline-block' }}>Preview</a>
                    {v.active && <button onClick={() => handleDeactivate(v.id)} style={{ background: 'transparent', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '7px 12px', fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.danger, cursor: 'pointer' }}>Deactivate</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LEADS */}
      {tab === 'leads' && (
        <div>
          {loading ? (
            <p style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 13, color: T.muted }}>Loading…</p>
          ) : leads.length === 0 ? (
            <p style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 13, color: T.muted }}>No demo leads yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {leads.map(l => (
                <div key={l.id} style={{ background: (!l.notified_vendor && !l.admin_notified) ? 'rgba(201,168,76,0.05)' : T.card, border: `0.5px solid ${(!l.notified_vendor && !l.admin_notified) ? T.borderStrong : T.border}`, borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                    <div>
                      <p style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: T.ink, marginBottom: 2 }}>{l.bride_name}</p>
                      <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: T.gold }}>for @{l.demo_vendor_handle}</p>
                    </div>
                    <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted }}>{fmt(l.created_at)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12 }}>
                    <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>📱 {l.bride_phone}</p>
                    {l.bride_ig_handle && <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>📸 @{l.bride_ig_handle}</p>}
                    {l.bride_email && <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>✉️ {l.bride_email}</p>}
                    {l.bride_wedding_city && <p style={{ fontFamily: T.ff.body, fontSize: 12, color: T.soft }}>📍 {l.bride_wedding_city}{l.bride_wedding_date ? ` · ${new Date(l.bride_wedding_date).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}` : ''}</p>}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {l.notified_vendor ? (
                      <span style={{ fontFamily: T.ff.label, fontSize: 8, color: T.success, letterSpacing: '0.1em' }}>✓ VENDOR NOTIFIED</span>
                    ) : l.admin_notified ? (
                      <span style={{ fontFamily: T.ff.label, fontSize: 8, color: T.muted, letterSpacing: '0.1em' }}>✓ ADMIN NOTIFIED</span>
                    ) : (
                      <span style={{ fontFamily: T.ff.label, fontSize: 8, color: T.gold, letterSpacing: '0.1em' }}>⚠ NEEDS RELAY</span>
                    )}
                    {!l.notified_vendor && (
                      <button onClick={() => handleRelay(l.id)} style={{ background: T.gold, border: 'none', borderRadius: 8, padding: '6px 12px', fontFamily: T.ff.label, fontWeight: 300, fontSize: 8, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#0A0908', cursor: 'pointer' }}>Mark Relayed</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MUSE POOL */}
      {tab === 'muse' && (
        <div>
          <div style={{ background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, padding: 16, marginBottom: 20 }}>
            <p style={{ fontFamily: T.ff.label, fontWeight: 200, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: T.soft, marginBottom: 12 }}>Add to Muse Pool</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <FieldInput label="Tags (comma separated)" value={museTags} onChange={setMuseTags} placeholder="lehenga, red, bridal" />
              <FieldInput label="Caption (optional)" value={museCaption} onChange={setMuseCaption} placeholder="Crimson silk lehenga" />
            </div>
            <label style={{ display: 'inline-block', background: museUploading ? T.card : T.gold, border: 'none', borderRadius: 10, padding: '10px 18px', fontFamily: T.ff.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: museUploading ? T.muted : '#0A0908', cursor: museUploading ? 'not-allowed' : 'pointer' }}>
              {museUploading ? 'Uploading…' : '+ Upload Image'}
              <input type="file" accept="image/*" onChange={handleMuseUpload} disabled={museUploading} style={{ display: 'none' }} />
            </label>
          </div>
          {muse.length === 0 ? (
            <p style={{ fontFamily: T.ff.body, fontWeight: 300, fontSize: 13, color: T.muted }}>No muse images yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10 }}>
              {muse.map(img => (
                <div key={img.id} style={{ position: 'relative', borderRadius: 10, overflow: 'hidden', aspectRatio: '3/4' }}>
                  <img src={img.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.6)', padding: '6px 8px' }}>
                    {img.tags.length > 0 && <p style={{ fontFamily: T.ff.label, fontSize: 7, color: '#C9A84C', margin: 0 }}>{img.tags.join(', ')}</p>}
                    {img.caption && <p style={{ fontFamily: T.ff.body, fontSize: 9, color: 'rgba(255,255,255,0.7)', margin: 0 }}>{img.caption}</p>}
                  </div>
                  <button onClick={() => handleMuseDelete(img.id)} style={{ position: 'absolute', top: 6, right: 6, background: 'rgba(224,92,92,0.8)', border: 'none', borderRadius: 50, width: 22, height: 22, color: '#fff', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
