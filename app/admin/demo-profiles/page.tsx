'use client';
// app/admin/demo-profiles/page.tsx
import React from 'react';
// Demo profile management — create, track, extend, deactivate

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const BACKEND = 'https://dream-os-production.up.railway.app';

const CATEGORIES = [
  'photographer', 'videographer', 'makeup_artist', 'mehendi_artist',
  'bridal_wear', 'groom_wear', 'jewellery', 'venue', 'caterer',
  'decorator', 'choreographer', 'dj', 'band', 'pandit', 'invitation_designer', 'event_manager'
];

const CITIES = [
  'Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
  'Pune', 'Jaipur', 'Ahmedabad', 'Chandigarh', 'Lucknow', 'Surat',
  'Kochi', 'Goa', 'Udaipur', 'Agra', 'Amritsar', 'Gurugram', 'Noida'
];

interface DemoProfile {
  id: string;
  name: string;
  demo_handle: string;
  demo_instagram?: string;
  demo_active: boolean;
  demo_expires_at: string;
  demo_created_at: string;
  demo_notes?: string;
  category: string;
  city: string;
  vendor_portfolio: Array<{ image_url: string; is_hero: boolean; approval_state: string }>;
  views: Record<string, number>;
  last_viewed_at: string | null;
  status_label: 'not_opened' | 'opened_landing' | 'entered_studio' | 'used_dreamai';
  demo_link: string;
  dm_message: string;
}

function getStatusLabel(label: string): string {
  switch (label) {
    case 'not_opened':     return 'NOT OPENED';
    case 'opened_landing': return 'OPENED LANDING';
    case 'entered_studio': return 'ENTERED STUDIO';
    case 'used_dreamai':   return 'USED DREAMAI';
    default:               return 'NOT OPENED';
  }
}

function getStatusColor(label: string): string {
  switch (label) {
    case 'not_opened':     return '#888580';
    case 'opened_landing': return '#C9A84C';
    case 'entered_studio': return '#8BC4A8';
    case 'used_dreamai':   return '#4CAF7E';
    default:               return '#888580';
  }
}

function timeUntilExpiry(expiresAt: string): { label: string; color: string } {
  const ms = new Date(expiresAt).getTime() - Date.now();
  if (ms <= 0) return { label: 'Expired', color: '#888580' };
  const hrs = ms / (1000 * 60 * 60);
  if (hrs < 2)  return { label: `${Math.round(hrs * 60)}m left`, color: '#E07070' };
  if (hrs < 12) return { label: `${Math.round(hrs)}h left`, color: '#C9A84C' };
  return { label: `${Math.round(hrs)}h left`, color: '#8BC4A8' };
}

// ── Tokens ────────────────────────────────────────────────────────────────────
const BG   = '#0A0908';
const GOLD = '#C9A84C';
const INK  = '#F5F0E8';
const SOFT = 'rgba(245,240,232,0.45)';
const B    = 'rgba(201,168,76,0.15)';
const CARD_STYLE: React.CSSProperties = {
  background: 'rgba(255,255,255,0.03)',
  border: '0.5px solid rgba(201,168,76,0.15)',
  borderRadius: 12,
  padding: '20px',
};
const INPUT_STYLE: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255,255,255,0.05)',
  border: '0.5px solid rgba(201,168,76,0.2)',
  borderRadius: 8,
  padding: '10px 12px',
  color: INK,
  fontFamily: '"DM Sans", sans-serif',
  fontWeight: 300,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
};
const SELECT_STYLE: React.CSSProperties = {
  ...INPUT_STYLE,
  appearance: 'none',
};
const LABEL_STYLE: React.CSSProperties = {
  fontFamily: '"Jost", sans-serif',
  fontWeight: 200,
  fontSize: 9,
  letterSpacing: '0.14em',
  color: 'rgba(201,168,76,0.7)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: 6,
};
const BTN: React.CSSProperties = {
  padding: '9px 18px',
  borderRadius: 24,
  border: 'none',
  fontFamily: '"Jost", sans-serif',
  fontWeight: 300,
  fontSize: 10,
  letterSpacing: '0.14em',
  textTransform: 'uppercase',
  cursor: 'pointer',
};

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div style={{
      position: 'fixed', bottom: 32, left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(12,8,6,0.95)', border: `0.5px solid ${B}`,
      borderRadius: 32, padding: '10px 22px',
      fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 11,
      letterSpacing: '0.1em', color: INK, zIndex: 9999,
      backdropFilter: 'blur(12px)', pointerEvents: 'none'
    }}>
      {msg}
    </div>
  );
}

// ── Profile card ──────────────────────────────────────────────────────────────
function ProfileCard({
  profile, adminPw, onRefresh, onToast
}: {
  profile: DemoProfile;
  adminPw: string;
  onRefresh: () => void;
  onToast: (m: string) => void;
}) {
  const hero = profile.vendor_portfolio.find(p => p.is_hero) ?? profile.vendor_portfolio[0];
  const expiry = timeUntilExpiry(profile.demo_expires_at);
  const statusColor = getStatusColor(profile.status_label);
  const statusText  = getStatusLabel(profile.status_label);
  const isExpired   = !profile.demo_active || new Date(profile.demo_expires_at) <= new Date();
  const [busy, setBusy] = useState(false);

  async function copyDM() {
    await navigator.clipboard.writeText(profile.dm_message);
    onToast('DM copied ✦');
  }

  async function copyLinks() {
    const links = `Studio: ${profile.demo_link}\nBride demo: https://demo.thedreamwedding.in/bride`;
    await navigator.clipboard.writeText(links);
    onToast('Links copied ✦');
  }

  async function extend() {
    setBusy(true);
    await fetch(`${BACKEND}/api/v2/admin/demo/${profile.id}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPw },
      body: JSON.stringify({ hours: 48 })
    });
    setBusy(false);
    onRefresh();
    onToast('Extended 48hrs ✦');
  }

  async function deactivate() {
    if (!confirm(`Deactivate demo for ${profile.name}?`)) return;
    setBusy(true);
    await fetch(`${BACKEND}/api/v2/admin/demo/${profile.id}`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPw }
    });
    setBusy(false);
    onRefresh();
    onToast('Deactivated');
  }

  async function reactivate() {
    setBusy(true);
    await fetch(`${BACKEND}/api/v2/admin/demo/${profile.id}/extend`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPw },
      body: JSON.stringify({ hours: 48 })
    });
    setBusy(false);
    onRefresh();
    onToast('Reactivated — 48hrs added ✦');
  }

  async function hardDelete() {
    if (!confirm(`Permanently delete demo for ${profile.name}? This cannot be undone.`)) return;
    setBusy(true);
    await fetch(`${BACKEND}/api/v2/admin/demo/${profile.id}/delete`, {
      method: 'DELETE',
      headers: { 'x-admin-password': adminPw }
    });
    setBusy(false);
    onRefresh();
    onToast('Deleted permanently');
  }

  return (
    <div style={{
      ...CARD_STYLE,
      opacity: isExpired ? 0.55 : 1,
      display: 'flex', gap: 16, alignItems: 'flex-start'
    }}>
      {/* Hero thumbnail */}
      {hero && (
        <div style={{
          width: 72, height: 72, borderRadius: 8, flexShrink: 0,
          backgroundImage: `url(${hero.image_url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          border: '0.5px solid rgba(201,168,76,0.2)'
        }} />
      )}

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <span style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 17, color: INK }}>
            {profile.name}
          </span>
          <span style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8,
            letterSpacing: '0.16em', color: statusColor, textTransform: 'uppercase',
            border: `0.5px solid ${statusColor}30`, borderRadius: 12,
            padding: '2px 8px'
          }}>
            {statusText}
          </span>
        </div>

        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9, letterSpacing: '0.12em', color: SOFT, textTransform: 'uppercase', margin: '0 0 8px' }}>
          {profile.category} · {profile.city}
          {profile.demo_instagram && ` · @${profile.demo_instagram}`}
        </p>

        {/* View counts */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          {[
            { key: 'landing_viewed',  label: 'Opens' },
            { key: 'studio_entered',  label: 'Studio' },
            { key: 'chat_started',    label: 'Chats' },
            { key: 'cta_tapped',      label: 'CTA' },
          ].map(({ key, label }) => (
            <div key={key} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 18, color: (profile.views[key] || 0) > 0 ? GOLD : SOFT }}>
                {profile.views[key] || 0}
              </div>
              <div style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 8, letterSpacing: '0.12em', color: SOFT, textTransform: 'uppercase' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* Link + expiry */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <a href={profile.demo_link} target="_blank" rel="noreferrer" style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 300, fontSize: 10,
            color: GOLD, textDecoration: 'none', letterSpacing: '0.08em'
          }}>
            {profile.demo_link.replace('https://', '')} ↗
          </a>
          <span style={{
            fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9,
            color: expiry.color, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            {expiry.label}
          </span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button onClick={copyDM} style={{ ...BTN, background: 'rgba(201,168,76,0.12)', color: GOLD, border: `0.5px solid ${B}` }}>
            Copy DM
          </button>
          <button onClick={copyLinks} style={{ ...BTN, background: 'rgba(255,255,255,0.05)', color: SOFT, border: '0.5px solid rgba(255,255,255,0.1)' }}>
            Copy Links
          </button>
          {!isExpired ? (
            <>
              <button onClick={extend} disabled={busy} style={{ ...BTN, background: 'rgba(255,255,255,0.05)', color: SOFT, border: '0.5px solid rgba(255,255,255,0.1)' }}>
                Extend 48h
              </button>
              <button onClick={deactivate} disabled={busy} style={{ ...BTN, background: 'rgba(255,100,100,0.08)', color: '#E07070', border: '0.5px solid rgba(224,112,112,0.2)' }}>
                Deactivate
              </button>
              <button onClick={hardDelete} disabled={busy} style={{ ...BTN, background: 'rgba(200,50,50,0.1)', color: '#C84646', border: '0.5px solid rgba(200,50,50,0.25)' }}>
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={reactivate} disabled={busy} style={{ ...BTN, background: 'rgba(201,168,76,0.12)', color: GOLD, border: `0.5px solid ${B}` }}>
                Reactivate
              </button>
              <button onClick={hardDelete} disabled={busy} style={{ ...BTN, background: 'rgba(255,100,100,0.08)', color: '#E07070', border: '0.5px solid rgba(224,112,112,0.2)' }}>
                Delete
              </button>
            </>
          )}
        </div>

        {/* Admin notes */}
        {profile.demo_notes && (
          <p style={{ marginTop: 10, fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(245,240,232,0.3)', fontStyle: 'italic' }}>
            {profile.demo_notes}
          </p>
        )}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function DemoProfilesPage() {
  const router = useRouter();
  const [adminPw, setAdminPw] = useState('');
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState<DemoProfile[]>([]);
  const [expired, setExpired] = useState<DemoProfile[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [toast, setToast] = useState('');
  const [createdResult, setCreatedResult] = useState<null | { studio_link: string; bride_link: string; dm_message: string; expires_at: string }>(null);

  // Create form state
  const [form, setForm] = useState({
    name: '',
    demo_handle: '',
    instagram_handle: '',
    vendor_phone: '',
    category: '',
    city: '',
    about: '',
    expires_hours: 48,
    notes: '',
    photo_urls: ['', '', '', '', '', ''] as string[],
  });
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');

  // Auth check from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('admin_session');
    if (stored) {
      try {
        const { password } = JSON.parse(stored);
        if (password) { setAdminPw(password); setAuthed(true); }
      } catch (_e) {}
    }
  }, []);

  const loadProfiles = useCallback(async () => {
    if (!adminPw) return;
    setLoadingList(true);
    try {
      const res = await fetch(`${BACKEND}/api/v2/admin/demo`, {
        headers: { 'x-admin-password': adminPw }
      });
      const data = await res.json();
      if (data.ok) {
        setActive(data.active || []);
        setExpired(data.expired || []);
        setAuthed(true);
      }
    } catch (_e) {}
    setLoadingList(false);
  }, [adminPw]);

  useEffect(() => {
    if (authed) loadProfiles();
  }, [authed, loadProfiles]);

  function handleLogin(pw: string) {
    localStorage.setItem('admin_session', JSON.stringify({ password: pw }));
    setAdminPw(pw);
    setAuthed(true);
  }

  function setPhotoUrl(i: number, val: string) {
    const next = [...form.photo_urls];
    next[i] = val;
    setForm(f => ({ ...f, photo_urls: next }));
  }

  async function handleCreate() {
    setCreateError('');
    const photos = form.photo_urls.filter(u => u.trim());
    if (!form.name || !form.demo_handle || !form.category || !form.city) {
      setCreateError('Name, handle, category, and city are required.');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(form.demo_handle.toLowerCase())) {
      setCreateError('Handle must be lowercase letters, numbers, hyphens only.');
      return;
    }
    if (photos.length < 3) {
      setCreateError('Add at least 3 photo URLs.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch(`${BACKEND}/api/v2/admin/demo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-password': adminPw },
        body: JSON.stringify({
          name: form.name,
          demo_handle: form.demo_handle.toLowerCase(),
          instagram_handle: form.instagram_handle || undefined,
          vendor_phone: form.vendor_phone || undefined,
          category: form.category,
          city: form.city,
          about: form.about || undefined,
          photo_urls: photos,
          expires_hours: form.expires_hours,
          notes: form.notes || undefined,
        })
      });
      const data = await res.json();
      if (!data.ok) {
        setCreateError(data.error || 'Something went wrong.');
      } else {
        setCreatedResult({ studio_link: data.studio_link, bride_link: data.bride_link, dm_message: data.dm_message, expires_at: data.expires_at });
        setForm({ name: '', demo_handle: '', instagram_handle: '', vendor_phone: '', category: '', city: '', about: '', expires_hours: 48, notes: '', photo_urls: ['','','','','',''] });
        loadProfiles();
      }
    } catch (e: unknown) {
      setCreateError(e instanceof Error ? e.message : 'Network error.');
    }
    setCreating(false);
  }

  // ── Auth gate ─────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <div style={{ padding: 40, maxWidth: 360 }}>
        <p style={LABEL_STYLE}>Admin password</p>
        <input
          type="password"
          style={INPUT_STYLE}
          onKeyDown={e => { if (e.key === 'Enter') handleLogin((e.target as HTMLInputElement).value); }}
          placeholder="Enter password and press Enter"
          autoFocus
        />
      </div>
    );
  }

  return (
    <div style={{ padding: '32px 40px', maxWidth: 860, color: INK, fontFamily: '"DM Sans", sans-serif' }}>
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}

      {/* Page title */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 28, color: INK, margin: 0 }}>
          Demo Profiles
        </h1>
        <p style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 10, letterSpacing: '0.14em', color: SOFT, textTransform: 'uppercase', marginTop: 4 }}>
          Vendor acquisition outreach — demo.thedreamwedding.in
        </p>
      </div>

      {/* ── SECTION 1: Create form ─────────────────────────────────────────── */}
      <div style={{ ...CARD_STYLE, marginBottom: 40 }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 20, color: INK, margin: '0 0 24px' }}>
          Create Demo Profile
        </h2>

        {createdResult && (
          <div style={{
            background: 'rgba(139,196,168,0.08)', border: '0.5px solid rgba(139,196,168,0.3)',
            borderRadius: 10, padding: '16px', marginBottom: 24
          }}>
            <p style={{ ...LABEL_STYLE, color: '#8BC4A8', marginBottom: 10 }}>✦ Demo Ready</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 12, flexWrap: 'wrap' }}>
              <button onClick={() => { navigator.clipboard.writeText(createdResult.studio_link); setToast('Studio link copied'); }} style={{ ...BTN, background: 'rgba(139,196,168,0.15)', color: '#8BC4A8', border: '0.5px solid rgba(139,196,168,0.3)', fontSize: 9 }}>
                Copy Studio Link
              </button>
              <button onClick={() => { navigator.clipboard.writeText(createdResult.bride_link); setToast('Bride link copied'); }} style={{ ...BTN, background: 'rgba(139,196,168,0.15)', color: '#8BC4A8', border: '0.5px solid rgba(139,196,168,0.3)', fontSize: 9 }}>
                Copy Bride Link
              </button>
              <button onClick={() => { navigator.clipboard.writeText(createdResult.dm_message); setToast('DM message copied'); }} style={{ ...BTN, background: 'rgba(201,168,76,0.12)', color: GOLD, border: `0.5px solid ${B}`, fontSize: 9 }}>
                Copy DM Message
              </button>
            </div>
            <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 11, color: SOFT }}>
              Studio: <a href={createdResult.studio_link} target="_blank" rel="noreferrer" style={{ color: GOLD }}>{createdResult.studio_link}</a>
            </p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <label style={LABEL_STYLE}>Vendor Name *</label>
            <input style={INPUT_STYLE} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Rohan Mehta" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Demo Handle * (URL slug)</label>
            <input style={INPUT_STYLE} value={form.demo_handle} onChange={e => setForm(f => ({ ...f, demo_handle: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))} placeholder="e.g. rohan" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Instagram Handle</label>
            <input style={INPUT_STYLE} value={form.instagram_handle} onChange={e => setForm(f => ({ ...f, instagram_handle: e.target.value }))} placeholder="@handle" />
          </div>
          <div>
            <label style={LABEL_STYLE}>WhatsApp Number <span style={{ color: 'rgba(245,240,232,0.3)', fontWeight: 300 }}>(optional — for live notifications)</span></label>
            <input style={INPUT_STYLE} value={form.vendor_phone} onChange={e => setForm(f => ({ ...f, vendor_phone: e.target.value }))} placeholder="+91 98765 43210" type="tel" />
          </div>
          <div>
            <label style={LABEL_STYLE}>Category *</label>
            <select style={SELECT_STYLE} value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>City *</label>
            <select style={SELECT_STYLE} value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}>
              <option value="">Select city</option>
              {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label style={LABEL_STYLE}>Expires In</label>
            <select style={SELECT_STYLE} value={form.expires_hours} onChange={e => setForm(f => ({ ...f, expires_hours: Number(e.target.value) }))}>
              <option value={24}>24 hours</option>
              <option value={48}>48 hours</option>
              <option value={72}>72 hours</option>
              <option value={168}>1 week</option>
            </select>
          </div>
        </div>

        {/* Photos — hero upload + bulk URL paste */}
        <div style={{ marginTop: 20 }}>

          {/* Hero photo */}
          <label style={LABEL_STYLE}>Hero Photo * — shown full-screen on landing page</label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
            <input
              style={{ ...INPUT_STYLE, flex: 1 }}
              value={form.photo_urls[0]}
              onChange={e => setPhotoUrl(0, e.target.value)}
              placeholder="Paste hero photo URL or upload ↑"
            />
            <label style={{
              ...BTN, background: 'rgba(201,168,76,0.15)', color: GOLD,
              border: `0.5px solid rgba(201,168,76,0.3)`, padding: '9px 14px',
              cursor: 'pointer', flexShrink: 0, fontSize: 11
            }}>
              ↑ Upload
              <input type="file" accept="image/*" style={{ display: 'none' }}
                onChange={async e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try { const url = await uploadToCloudinary(file); setPhotoUrl(0, url); setToast('Hero uploaded ✦'); } catch (_e) { alert('Upload failed'); }
                }}
              />
            </label>
            {form.photo_urls[0] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photo_urls[0]} alt="" style={{ width: 52, height: 52, objectFit: 'cover', borderRadius: 8, border: `0.5px solid rgba(201,168,76,0.3)`, flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            )}
          </div>

          {/* Bulk other photos */}
          <label style={LABEL_STYLE}>Other Photos (2–5 more) * — paste one URL per line or upload</label>
          <p style={{ fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 10, color: 'rgba(245,240,232,0.25)', marginBottom: 8 }}>
            Paste multiple URLs — one per line. Instagram CDN links work for 24hrs.
          </p>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <textarea
              style={{ ...INPUT_STYLE, flex: 1, minHeight: 100, resize: 'vertical', lineHeight: 1.8 }}
              value={form.photo_urls.slice(1).filter(u => u).join('
')}
              onChange={e => {
                const lines = e.target.value.split('
').map(l => l.trim()).filter(Boolean).slice(0, 5);
                const next = [form.photo_urls[0], ...lines, '', '', '', '', ''].slice(0, 6);
                setForm(f => ({ ...f, photo_urls: next }));
              }}
              placeholder="Paste URLs — one per line (max 5)"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[1,2,3,4,5].map(i => (
                <label key={i} style={{
                  ...BTN, background: 'rgba(255,255,255,0.05)', color: SOFT,
                  border: '0.5px solid rgba(255,255,255,0.1)', padding: '7px 10px',
                  cursor: 'pointer', fontSize: 10, textAlign: 'center' as const,
                  opacity: form.photo_urls[i] ? 1 : 0.5
                }}>
                  {form.photo_urls[i] ? '✓' : '↑'}
                  <input type="file" accept="image/*" style={{ display: 'none' }}
                    onChange={async e => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try { const url = await uploadToCloudinary(file); setPhotoUrl(i, url); setToast(`Photo ${i+1} uploaded ✦`); } catch (_e) { alert('Upload failed'); }
                    }}
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Preview strip */}
          {form.photo_urls.filter(u => u).length > 0 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {form.photo_urls.filter(u => u).map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={i} src={url} alt="" style={{
                  width: 48, height: 48, objectFit: 'cover', borderRadius: 6,
                  border: i === 0 ? `1.5px solid ${GOLD}` : '0.5px solid rgba(201,168,76,0.2)'
                }} onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              ))}
              <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 9, color: SOFT, alignSelf: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {form.photo_urls.filter(u => u).length} photo{form.photo_urls.filter(u => u).length !== 1 ? 's' : ''} · gold border = hero
              </span>
            </div>
          )}
        </div>

        {/* Notes */}
        <div style={{ marginTop: 16 }}>
          <label style={LABEL_STYLE}>Admin Notes</label>
          <textarea style={{ ...INPUT_STYLE, minHeight: 64, resize: 'vertical' }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Referred by Swati, met at Delhi expo, etc." />
        </div>

        {createError && (
          <p style={{ marginTop: 12, fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 12, color: '#E07070' }}>
            {createError}
          </p>
        )}

        <div style={{ marginTop: 20 }}>
          <button
            onClick={handleCreate}
            disabled={creating}
            style={{ ...BTN, background: creating ? 'rgba(201,168,76,0.3)' : GOLD, color: '#0A0908', padding: '12px 28px', fontSize: 11 }}
          >
            {creating ? 'Creating…' : 'Create Demo Profile →'}
          </button>
        </div>
      </div>

      {/* ── SECTION 2: Active demos ───────────────────────────────────────────── */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 22, color: INK, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
          Active
          <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 10, color: SOFT, letterSpacing: '0.1em' }}>
            {active.length} profile{active.length !== 1 ? 's' : ''}
          </span>
        </h2>

        {loadingList ? (
          <p style={{ color: SOFT, fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13 }}>Loading…</p>
        ) : active.length === 0 ? (
          <p style={{ color: SOFT, fontFamily: '"DM Sans", sans-serif', fontWeight: 300, fontSize: 13, fontStyle: 'italic' }}>
            No active demos. Create one above.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {active.map(p => (
              <ProfileCard key={p.id} profile={p} adminPw={adminPw} onRefresh={loadProfiles} onToast={setToast} />
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 3: Expired demos ──────────────────────────────────────────── */}
      {expired.length > 0 && (
        <div>
          <h2 style={{ fontFamily: '"Cormorant Garamond", serif', fontWeight: 300, fontSize: 22, color: INK, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 12 }}>
            Expired
            <span style={{ fontFamily: '"Jost", sans-serif', fontWeight: 200, fontSize: 10, color: SOFT, letterSpacing: '0.1em' }}>
              {expired.length}
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {expired.map(p => (
              <ProfileCard key={p.id} profile={p} adminPw={adminPw} onRefresh={loadProfiles} onToast={setToast} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
