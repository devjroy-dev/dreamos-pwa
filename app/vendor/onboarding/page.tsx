'use client';
// app/vendor/onboarding/page.tsx
// First-launch web onboarding for vendors who joined via invite code.
// Shown when onboarding_state = 'new' (vendor/page.tsx redirects here).
//
// Captures identical fields to the WhatsApp conversational onboarding:
//   name (personal first name) → users.name
//   instagram_handle           → vendors.instagram_handle (becomes routing_handle priority)
//   business_name              → vendors.business_name (optional)
//   category                   → vendors.category
//   city                       → vendors.city
//   open_to_travel             → vendors.open_to_travel
//   stated_rate                → vendor_state.pricing_policy
//
// IG handle is framed explicitly: "Your clients tap this to reach your PA."
// On submit → POST /api/v2/vendor/onboarding → routing_handle assigned
//           → session name updated → redirect to /vendor

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getVendorSession, setVendorSession } from '@/lib/vendor/session';
import { postJson } from '@/lib/vendor/api/_base';
import { useT } from '@/lib/vendor/ThemeContext';

const CATEGORIES = [
  'photography', 'videography', 'makeup', 'hair', 'mehendi',
  'decor', 'planning', 'venue', 'catering', 'music',
  'choreography', 'jewellery', 'couture', 'invitations', 'other',
];

const CAT_LABEL: Record<string, string> = {
  photography: 'Photography', videography: 'Videography', makeup: 'Makeup',
  hair: 'Hair', mehendi: 'Mehendi', decor: 'Decor', planning: 'Planning',
  venue: 'Venue', catering: 'Catering', music: 'Music',
  choreography: 'Choreography', jewellery: 'Jewellery', couture: 'Couture',
  invitations: 'Invitations', other: 'Other',
};

interface OnboardResp {
  ok: boolean;
  routing_handle?: string;
  tdw_link?: string;
  error?: string;
}

export default function VendorOnboardingPage() {
  const router = useRouter();
  const T      = useT();

  const [name,         setName]        = useState('');
  const [igHandle,     setIgHandle]    = useState('');
  const [businessName, setBusiness]    = useState('');
  const [category,     setCategory]    = useState('');
  const [city,         setCity]        = useState('');
  const [travel,       setTravel]      = useState(false);
  const [rate,         setRate]        = useState('');
  const [submitting,   setSubmitting]  = useState(false);
  const [toast,        setToast]       = useState('');
  const [done,         setDone]        = useState(false);
  const [tdwLink,      setTdwLink]     = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  const submit = useCallback(async () => {
    if (!name.trim())    { showToast('Your first name is required.'); return; }
    if (!category)       { showToast('Select a category.'); return; }
    if (!city.trim())    { showToast('City is required.'); return; }
    if (submitting)      return;
    setSubmitting(true);
    try {
      const res = await postJson<OnboardResp>('/api/v2/vendor/onboarding', {
        name:             name.trim(),
        instagram_handle: igHandle.trim().replace(/^@/, '') || undefined,
        business_name:    businessName.trim() || undefined,
        category,
        city:             city.trim(),
        open_to_travel:   travel,
        stated_rate:      rate.trim() || undefined,
      });
      if (!res.ok) { showToast(res.error || 'Something went wrong.'); setSubmitting(false); return; }
      const session = getVendorSession();
      if (session) setVendorSession({ ...session, name: name.trim() });
      if (res.tdw_link) setTdwLink(res.tdw_link);
      setDone(true);
    } catch { showToast('Could not connect. Try again.'); }
    setSubmitting(false);
  }, [name, igHandle, businessName, category, city, travel, rate, submitting]);

  // ── Tokens ──────────────────────────────────────────────────────────────
  const INK    = T.ink;
  const MUTE   = T.inkMute;
  const BRASS  = T.brass;
  const BORDER = T.cardBorder;
  const BG     = T.cardBg;

  const inp: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${BORDER}`,
    outline: 'none',
    fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)',
    fontWeight: 300, fontSize: 15, color: INK,
    padding: '8px 0', marginBottom: 20, boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    fontFamily: 'var(--font-jost, system-ui, sans-serif)',
    fontWeight: 200, fontSize: 8, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: MUTE,
    display: 'block', marginBottom: 6,
  };

  const Toast = toast ? (
    <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${BRASS}`, borderRadius: 100, padding: '10px 20px', fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontSize: 12, color: BRASS, whiteSpace: 'nowrap', zIndex: 99 }}>
      {toast}
    </div>
  ) : null;

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: T.headerBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        {Toast}
        <p style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 32, color: INK, margin: '0 0 8px', textAlign: 'center' }}>
          You&apos;re all set, {name.split(' ')[0]}.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontWeight: 300, fontSize: 14, color: MUTE, textAlign: 'center', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 320 }}>
          Your PA is ready. Share your TDW link — that&apos;s where clients message you.
        </p>
        {tdwLink && (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', width: '100%', maxWidth: 360, marginBottom: 24 }}>
            <p style={{ ...lbl, marginBottom: 8 }}>Your TDW link</p>
            <p style={{ fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 300, fontSize: 13, color: BRASS, letterSpacing: '0.04em', wordBreak: 'break-all', margin: 0 }}>
              {tdwLink}
            </p>
            <button
              onClick={() => { navigator.clipboard.writeText(tdwLink); showToast('Copied!'); }}
              style={{ marginTop: 12, background: 'transparent', border: `0.5px solid ${BORDER}`, borderRadius: 6, padding: '6px 14px', fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 300, fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: MUTE, cursor: 'pointer' }}
            >
              Copy link
            </button>
          </div>
        )}
        <button
          onClick={() => router.replace('/vendor')}
          style={{ width: '100%', maxWidth: 360, height: 52, background: BRASS, border: 'none', borderRadius: 100, fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 400, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0C0A09', cursor: 'pointer' }}
        >
          Open your studio →
        </button>
      </div>
    );
  }

  // ── Onboarding form ──────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.headerBg, overflowY: 'auto' }}>
      {Toast}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 'calc(env(safe-area-inset-top, 0px) + 40px) 28px calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>

        <p style={{ fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 200, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: BRASS, margin: '0 0 12px' }}>
          The Dream Wedding
        </p>
        <p style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 28, color: INK, lineHeight: 1.15, margin: '0 0 6px' }}>
          Let&apos;s set up your studio.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontWeight: 300, fontSize: 13, color: MUTE, lineHeight: 1.6, margin: '0 0 36px' }}>
          Two minutes. Your clients will use this to reach you.
        </p>

        {/* Name */}
        <label style={lbl}>Your first name *</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Kavya" style={inp} />

        {/* Instagram */}
        <label style={lbl}>Instagram handle</label>
        <input
          value={igHandle}
          onChange={e => setIgHandle(e.target.value.replace(/\s/g, ''))}
          placeholder="@yourhandle"
          style={inp}
        />
        <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontSize: 11, fontWeight: 300, color: MUTE, margin: '-14px 0 20px', fontStyle: 'italic' }}>
          Your clients tap this to reach your PA. Becomes your TDW link.
        </p>

        {/* Business name */}
        <label style={lbl}>Studio or business name</label>
        <input value={businessName} onChange={e => setBusiness(e.target.value)} placeholder="optional" style={inp} />

        {/* Category */}
        <label style={lbl}>What do you do? *</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '7px 14px', borderRadius: 100, border: 'none', cursor: 'pointer',
                background: category === cat ? BRASS : `color-mix(in srgb, ${BORDER} 30%, transparent)`,
                color: category === cat ? '#0C0A09' : MUTE,
                fontFamily: 'var(--font-jost, system-ui, sans-serif)',
                fontWeight: 300, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase',
                transition: 'all 160ms ease',
              }}
            >
              {CAT_LABEL[cat]}
            </button>
          ))}
        </div>

        {/* City */}
        <label style={lbl}>Based in *</label>
        <input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Mumbai" style={inp} />

        {/* Travel toggle */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <p style={{ ...lbl, margin: 0 }}>Open to travel?</p>
            <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontSize: 12, fontWeight: 300, color: MUTE, margin: '4px 0 0' }}>
              Destination or outstation weddings
            </p>
          </div>
          <button
            onClick={() => setTravel(v => !v)}
            style={{ width: 48, height: 26, borderRadius: 13, border: 'none', cursor: 'pointer', background: travel ? BRASS : BORDER, position: 'relative', transition: 'background 200ms ease', flexShrink: 0 }}
          >
            <span style={{ position: 'absolute', top: 3, left: travel ? 25 : 3, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: 'left 200ms ease' }} />
          </button>
        </div>

        {/* Rate */}
        <label style={lbl}>Typical rate for a wedding day</label>
        <input value={rate} onChange={e => setRate(e.target.value)} placeholder="e.g. Rs 80,000 — ballpark, or leave blank" style={inp} />

        {/* Submit */}
        <button
          onClick={submit}
          disabled={submitting}
          style={{
            width: '100%', height: 52, borderRadius: 100, border: 'none',
            cursor: submitting ? 'default' : 'pointer',
            background: submitting ? `color-mix(in srgb, ${BRASS} 40%, transparent)` : BRASS,
            color: '#0C0A09',
            fontFamily: 'var(--font-jost, system-ui, sans-serif)',
            fontWeight: 400, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase',
            transition: 'all 200ms ease',
          }}
        >
          {submitting ? 'Setting up…' : 'Get started →'}
        </button>

      </div>
    </div>
  );
}
