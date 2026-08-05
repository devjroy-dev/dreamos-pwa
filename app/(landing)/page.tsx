'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '../../lib/api';
// F-05.9: signup + returning-no-PIN moved off the dead Supabase Phone-OTP (Twilio) onto
// the backend Meta OTP endpoints (send-otp / verify-otp / provision). No browser Supabase
// client is needed on this screen anymore.

// iOS Safari (normal browsing, installed PWA, or ITP-restricted contexts) can
// throw on localStorage.setItem even when the network is fine. The login flow
// previously did raw setItem inside the same try/catch as the fetch, so a
// storage throw surfaced as a misleading "Could not connect" toast and aborted
// sign-in. These helpers isolate storage writes and mirror the session to a
// first-party cookie, which works in contexts where localStorage throws — so
// login completes regardless of localStorage state.
// ── TDW_09 O-1 · R-O6 · THIS FILE'S NEAR-WHITE LITERALS ARE HELD, AND HERE IS WHY ──
// The theme-blind surface census (scripts/tdw09_surface_census.mjs) finds 50 sites on
// this page in its species — near-white ink and low-alpha white tint — and holds every
// one of them.
//   THE MECHANISM THAT GUARDS THEM: this route group has NO ThemeProvider anywhere.
//   `app/(landing)/layout.tsx` is a bare passthrough, so no light theme can reach this
//   surface; it stands on #0C0A09 and always has. The species is only a defect where a
//   light theme can arrive.
//   THE TRIGGER THAT REOPENS THIS: the day a ThemeProvider is introduced to this group,
//   or this page is rendered under one, every literal here becomes the defect the census
//   was built for. Re-read this then, not before.
// The census's HELD_OUT array is the mechanism; this comment is the decision, and it
// lives here so it cannot be deleted by a sweep that never read it.
const SESSION_COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days

function safeSetItem(key: string, value: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, value);
    }
  } catch { /* iOS storage blocked/quota — cookie fallback covers it */ }
}

function mirrorSessionToCookie(isVendor: boolean, session: unknown): void {
  if (typeof document === 'undefined') return;
  try {
    const name = isVendor ? 'tdw_vendor_session' : 'tdw_couple_session';
    const val  = encodeURIComponent(JSON.stringify(session));
    document.cookie = `${name}=${val}; max-age=${SESSION_COOKIE_MAX_AGE}; path=/; SameSite=Lax; Secure`;
  } catch { /* ignore */ }
}

const FALLBACK_SLIDES: string[] = [
  'https://res.cloudinary.com/dccso5ljv/image/upload/IMG_2544.PNG_cyeqlj',
  'https://res.cloudinary.com/dccso5ljv/image/upload/Facetune_14-05-2026-11-06-49_qs4dg6',
  'https://res.cloudinary.com/dccso5ljv/image/upload/Facetune_24-03-2026-22-59-53_f2tfsy',
];

// ─── Country list (NRI-focused, curated) ─────────────────────────────────────
const COUNTRIES = [
  { flag: '🇮🇳', name: 'India',        dialCode: '+91',  maxDigits: 10 },
  { flag: '🇦🇪', name: 'UAE',          dialCode: '+971', maxDigits: 9  },
  { flag: '🇺🇸', name: 'USA',          dialCode: '+1',   maxDigits: 10 },
  { flag: '🇬🇧', name: 'UK',           dialCode: '+44',  maxDigits: 10 },
  { flag: '🇨🇦', name: 'Canada',       dialCode: '+1',   maxDigits: 10 },
  { flag: '🇦🇺', name: 'Australia',    dialCode: '+61',  maxDigits: 9  },
  { flag: '🇲🇾', name: 'Malaysia',     dialCode: '+60',  maxDigits: 10 },
  { flag: '🇩🇪', name: 'Germany',      dialCode: '+49',  maxDigits: 10 },
  { flag: '🇫🇷', name: 'France',       dialCode: '+33',  maxDigits: 9  },
  { flag: '🇳🇿', name: 'New Zealand',  dialCode: '+64',  maxDigits: 9  },
  { flag: '🇿🇦', name: 'South Africa', dialCode: '+27',  maxDigits: 9  },
];
type Country = typeof COUNTRIES[number];

// ─── Country bottom sheet ─────────────────────────────────────────────────────
function CountrySheet({ visible, onSelect, onClose }: {
  visible: boolean;
  onSelect: (c: Country) => void;
  onClose: () => void;
}) {
  if (!visible) return null;
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(12,10,9,0.5)' }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 201,
        background: 'rgba(12,10,9,0.88)',
        backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
        borderTop: '0.5px solid rgba(255,255,255,0.12)',
        borderRadius: '20px 20px 0 0',
        padding: '16px 0 calc(env(safe-area-inset-bottom, 16px) + 16px)',
        maxHeight: '60vh', overflowY: 'auto',
      }}>
        <p style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 8, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.4)', margin: '0 0 12px 20px' }}>Select country</p>
        {COUNTRIES.map(c => (
          <button key={c.dialCode + c.name} onClick={() => { onSelect(c); onClose(); }} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', background: 'none', border: 'none', padding: '12px 20px', cursor: 'pointer', touchAction: 'manipulation' }}>
            <span style={{ fontSize: 22 }}>{c.flag}</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 15, color: '#F8F7F5', flex: 1, textAlign: 'left' }}>{c.name}</span>
            <span style={{ fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 13, color: 'rgba(248,247,245,0.4)', letterSpacing: '0.05em' }}>{c.dialCode}</span>
          </button>
        ))}
      </div>
    </>
  );
}

// Screen states — what the glass panel shows.
//
// TDW_09 O-1 · R-X10 arm (a) + R-O3/R-O4. Eleven screens became six. The four
// `request_*` screens and the dead `invite_code` screen are REMOVED BY RULING: the
// ceremony gated nothing (the acquisition path was already open phone-OTP self-mint,
// F-05.9), `invite_code` was reachable from nowhere, and its backend route no longer
// exists at all. Curation is real and lives at the Discover approval queue, which is
// the only surface a couple ever sees — a signup gate would duplicate a working one.
//
// R-O4: `invite_phone`/`invite_otp` are renamed `join_phone`/`join_otp` so the machine
// stops carrying the retired gate's vocabulary. Behaviour is unchanged; the names are
// internal and no rendered byte moves with them.
type Screen =
  | 'entry'          // The two-door entry panel (L-B), opened
  | 'exploring'      // The couple path's first screen — the feed, before any field
  | 'join_phone'     // Enter name + phone (was `invite_phone`)
  | 'join_otp'       // Enter OTP (was `invite_otp`)
  | 'signin_phone'   // Returning member phone
  | 'signin_otp';    // Returning member OTP

type Role = 'Dreamer' | 'Maker';

interface PreviewVendor {
  id: string;
  category: string;
  city: string;
  featured_photos: string[];
  portfolio_images: string[];
  starting_price: number | null;
  vibe_tags: string[] | null;
  about: string | null;
}

interface ExploringPhoto {
  id: string;
  image_url: string;
  display_order: number;
  caption: string | null;
}

// ─── Glass panel style ────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(255,255,255,0.13)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 24,
};

// ─── Shared input style ───────────────────────────────────────────────────────
const INPUT: React.CSSProperties = {
  width: '100%', border: 'none',
  borderBottom: '1px solid rgba(255,255,255,0.3)',
  background: 'transparent', outline: 'none',
  fontFamily: "'DM Sans', sans-serif", fontWeight: 300,
  fontSize: 15, color: '#F8F7F5', padding: '8px 0', marginBottom: 16,
};

// ─── TDW_09 O-1 · R-O5 · THE R-X24 ROW RULE, APPLIED INLINE ───────────────────
// R-X24's measured acceptance: same-line letters sat on different planes because rows
// aligned on `center`, so two line-boxes of different heights had their CENTRES matched
// and their BASELINES left ~1px apart. The rule, applied here rather than as the canon
// Row primitive (which is the canon sitting's mint, R-O5): rows align on `baseline`;
// every text node in a shared row takes the token line-height so the line-boxes agree;
// and a glyph that is not text — the country flag — sits in a FIXED SQUARE SLOT instead
// of participating in text alignment, because its box is the device's to draw and no
// alignment rule can reach it.
const ROW_LINE_HEIGHT = 1.5;

function FlagSlot({ flag }: { flag: string }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 20, height: 20, flexShrink: 0, fontSize: 16, lineHeight: 1,
      transform: 'translateY(2px)',
    }}>{flag}</span>
  );
}

// ─── Gold CTA button ──────────────────────────────────────────────────────────
function GoldBtn({ label, onClick, disabled }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: '100%', height: 52,
      background: disabled ? 'rgba(201,168,76,0.3)' : '#C9A84C',
      color: disabled ? 'rgba(12,10,9,0.4)' : '#0C0A09',
      border: 'none', borderRadius: 100, cursor: disabled ? 'default' : 'pointer',
      fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 400,
      letterSpacing: '0.2em', textTransform: 'uppercase',
      touchAction: 'manipulation', marginTop: 8,
      transition: 'all 200ms cubic-bezier(0.22,1,0.36,1)',
    }}>{label}</button>
  );
}

// ─── Ghost CTA button ─────────────────────────────────────────────────────────
function GhostBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: '100%', height: 44,
      background: 'transparent',
      color: 'rgba(248,247,245,0.6)',
      border: '0.5px solid rgba(248,247,245,0.2)', borderRadius: 100,
      cursor: 'pointer', fontFamily: "'Jost', sans-serif",
      fontSize: 9, fontWeight: 300, letterSpacing: '0.18em', textTransform: 'uppercase',
      touchAction: 'manipulation', marginTop: 6,
    }}>{label}</button>
  );
}

// ─── Back button ──────────────────────────────────────────────────────────────
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      background: 'none', border: 'none', cursor: 'pointer',
      fontFamily: "'Jost', sans-serif", fontSize: 18,
      color: 'rgba(248,247,245,0.5)', padding: '0 0 12px', display: 'block',
      touchAction: 'manipulation',
    }}>←</button>
  );
}

// ─── Section label ────────────────────────────────────────────────────────────
function Label({ text }: { text: string }) {
  return (
    <p style={{
      fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 200,
      letterSpacing: '0.25em', textTransform: 'uppercase',
      color: 'rgba(248,247,245,0.5)', margin: '0 0 6px',
    }}>{text}</p>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Home() {
  const router = useRouter();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const slidesRef   = useRef<string[]>(FALLBACK_SLIDES);
  const otpRefs     = useRef<(HTMLInputElement | null)[]>([]);

  const [slides, setSlides] = useState<string[]>(FALLBACK_SLIDES);
  const [cur, setCur] = useState(0);
  const [screen, setScreen] = useState<Screen>('entry');
  const [role, setRole] = useState<Role | null>(null);
  const [toast, setToast] = useState('');

  // Country picker
  const [country, setCountry]               = useState(COUNTRIES[0]);
  const [showCountrySheet, setShowCountrySheet] = useState(false);

  // Join / OTP fields (R-O4: the two survivors renamed off the gate's vocabulary;
  // `inviteCode`/`inviteError` died with the screen that was their only reader).
  const [joinName, setJoinName]         = useState('');
  const [joinCategory, setJoinCategory] = useState('');
  const [phone, setPhone]               = useState('');
  const [otp, setOtp]                   = useState(['', '', '', '', '', '']);

  // "Just Exploring" preview
  const [exploringPhotos, setExploringPhotos] = useState<ExploringPhoto[]>([]);
  const [exploringIdx, setExploringIdx] = useState(0);
  const [exploringDone, setExploringDone] = useState(false);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => { slidesRef.current = slides; }, [slides]);

  // Reset OTP digits whenever OTP screen appears
  useEffect(() => {
    if (screen === 'signin_otp' || screen === 'join_otp') {
      setOtp(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 150);
    }
  }, [screen]);

  // ── TDW_09 O-1 · R-O9 · THE ROLE-FROM-QUERY READ ─────────────────────────
  // The public Discover feed's signup nudge (app/(landing)/discover/DiscoverFeed.tsx)
  // used to navigate to `/auth/signup`, a route that has never existed — the feed's
  // only in-graph exit 404'd at the exact moment a visitor decided to convert
  // (F-09.17). R-X7 rules that CTA couple-first, so it now arrives HERE with the
  // couple door already chosen, and the visitor does not re-answer a question their
  // own behaviour just answered.
  //
  // DEGRADES TO THE PLAIN DOOR, BY RULING (R-O9). An unrecognised value — or no value
  // — leaves `screen` at 'entry' and `role` null. It never crashes and it never picks
  // a role silently: only the two named values move anything.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get('role');
    if (q === 'couple') { setRole('Dreamer'); setScreen('exploring'); }
    else if (q === 'vendor') { setRole('Maker'); setScreen('join_phone'); }
  }, []);

  // ── Vendor subdomain auto-routing ─────────────────────────────────────────
  // If on vendor.thedreamwedding.in, pre-select Maker and skip to sign-in.
  // Vendors sharing the link or refreshing mid-session land directly on the
  // phone entry screen with the correct role already locked — no tap required.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hostname = window.location.hostname;
    if (hostname === 'vendor.thedreamwedding.in' || hostname.startsWith('vendor.')) {
      setRole('Maker');
      setScreen('signin_phone');
    }
  }, []);

  const startCarousel = useCallback(() => {
    if (intervalRef.current) return; // already running — preserve slide position
    intervalRef.current = setInterval(() => setCur(c => (c + 1) % slidesRef.current.length), 4000);
  }, []);

  const pauseCarousel = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Pause carousel when exploring screen is active — prevents bleed-through
  useEffect(() => {
    if (screen === 'exploring') {
      pauseCarousel();
    } else {
      startCarousel();
    }
  }, [screen, pauseCarousel, startCarousel]);

  useEffect(() => {
    // Fetch cover photos
    fetch(`${API_BASE}/api/v2/landing-slides`)
      .then(r => r.json())
      .then(d => { if (d.slides?.length) setSlides(d.slides.map((p: any) => p.image_url)); })
      .catch(() => {});

    // F-09.43 · WARM THE FOLD AT MOUNT. Success only: a failed prefetch leaves the state
    // untouched so the door's own `loadPreview` still runs and can still fail honestly.
    // This deliberately does NOT set `loadingPreview` — nothing is on screen to load yet,
    // and flipping it here would arm the "Curating..." card for a screen nobody opened.
    fetch(`${API_BASE}/api/v2/exploring-photos`)
      .then(r => r.json())
      .then(d => { if (d.ok && d.photos?.length) setExploringPhotos(d.photos); })
      .catch(() => {});
    startCarousel();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startCarousel]);

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  // ── "Just Exploring" — load editorial photos, fall back to vendor photos ──
  const loadPreview = useCallback(async () => {
    setLoadingPreview(true);
    setExploringIdx(0);
    setExploringDone(false);
    try {
      const r = await fetch(`${API_BASE}/api/v2/exploring-photos`);
      const d = await r.json();
      if (d.ok && d.photos?.length) {
        setExploringPhotos(d.photos);
      } else {
        setExploringDone(true);
      }
    } catch { setExploringDone(true); }
    setLoadingPreview(false);
  }, []);

  // F-09.43 · FOUNDER'S WALK — 「 slow and glitchy transition 」.
  // Three mechanisms stacked to put a BLACK FRAME inside the couple door's first
  // impression: the carousel dropped to opacity 0 the instant `screen` flipped, this
  // function then DISCARDED any photos already held, and only then did the fetch begin.
  // Tap -> photo -> black -> "Curating your preview..." -> photo. That was tolerable
  // when the fold was a fourth quiet choice; under Fork 1(a) it IS the couple door, and
  // the S1 paper named this exact LCP exposure as the risk the founder's walk must
  // settle. It settled it. The discard is gone, the fetch is warmed at mount, and the
  // cover photo now holds the screen until a real exploring photo is ready to replace it.
  const startExploring = () => {
    setScreen('exploring');
    setExploringIdx(0);
    setExploringDone(false);
    if (exploringPhotos.length === 0) loadPreview();
  };

  const nextExploring = () => {
    if (exploringIdx >= exploringPhotos.length - 1) {
      setExploringDone(true);
    } else {
      setExploringIdx(i => i + 1);
    }
  };


  // ── THE REQUEST-INVITE SUBMIT IS GONE ────────────────────────────────────
  // `submitRequest` was the only caller of POST /api/v2/waitlist/signup anywhere in
  // this repo. It died with the four `request_*` screens under R-X10 arm (a). Its
  // death is what un-gates the dream-os T3-3 tail (`src/api/waitlist.js`): that route
  // had exactly one live caller and this file was it. dream-os is zero-byte this
  // sitting by charter, so the retirement is NAMED-HANDED and gated on this deploy.

  // ── OTP / PIN (preserved from original) ──────────────────────────────────
  const handleOtpInput = (i: number, val: string) => {
    // Handle paste of full 6-digit code (Android SMS autofill)
    const digits = val.replace(/\D/g, '');
    if (digits.length > 1) {
      const n = ['', '', '', '', '', ''];
      digits.split('').slice(0, 6).forEach((d, idx) => { n[idx] = d; });
      setOtp(n);
      otpRefs.current[Math.min(digits.length, 5)]?.focus();
      return;
    }
    const n = [...otp]; n[i] = digits.slice(-1); setOtp(n);
    if (digits && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  const sendOtp = async (phoneNum: string) => {
    const isVendor = role === 'Maker';
    const digits = phoneNum.replace(/\D/g, '');
    const e164 = country.dialCode + digits;

    // F-05.9: the backend delivers the OTP over Meta (WhatsApp) and self-mints
    // public.users + the role row — open signup, any number. The dead Supabase
    // Phone-OTP (Twilio) path is gone; the auth identity is created at verify time.
    const endpoint = isVendor
      ? `${API_BASE}/api/v2/vendor/auth/send-otp`
      : `${API_BASE}/api/v2/couple/auth/send-otp`;
    try {
      const r = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164 }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok || d.error) { showToast(d.error || 'Could not send code. Try again.'); return; }
      setScreen(screen === 'signin_phone' ? 'signin_otp' : 'join_otp');
    } catch { showToast('Could not send code. Try again.'); }
  };

  const verifyOtp = async () => {
    const isVendor = role === 'Maker';
    const digits = phone.replace(/\D/g, '');
    const e164 = country.dialCode + digits;
    try {
      // 1 — Backend verifies the Meta OTP, creates-or-heals the auth identity, and mints
      //     the session (F-05.9). Returns ids + tokens directly.
      const vRes = await fetch(`${API_BASE}/api/v2/${isVendor ? 'vendor' : 'couple'}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, otp: otp.join(''), purpose: 'login' }),
      });
      const v = await vRes.json().catch(() => ({}));
      if (!vRes.ok || !v.ok || !v.access_token) { showToast(v.error || 'Incorrect code.'); return; }
      const accessToken  = v.access_token;
      const refreshToken = v.refresh_token;

      // 2 — Provision the vendor|couple row for this Supabase identity (idempotent;
      //     phone-fallback re-binds a legacy account). Returns ids + pin_set, no tokens.
      const provEndpoint = isVendor
        ? `${API_BASE}/api/v2/vendor/auth/provision`
        : `${API_BASE}/api/v2/couple/auth/provision`;
      const pRes = await fetch(provEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ phone: e164, name: joinName.trim() || undefined, category: isVendor ? (joinCategory || undefined) : undefined }),
      });
      const d = await pRes.json();
      if (!d.ok) { showToast(d.error || 'Could not complete sign-in.'); return; }

      const roleId = isVendor ? d.vendor_id : d.couple_id;
      const userId = d.user_id;
      const pinSet = !!d.pin_set;

      // R-X10 arm (a): there is no ceremony to divert into. Provision self-mints
      // `public.users` and the role row at verify time, so a number this estate has
      // never seen is admitted like any other. If ids are still missing the write
      // genuinely failed, and it is reported as the failure it is — never dressed as
      // an exclusivity gate. The byte below already exists on this screen's other
      // failure path; no new copy is minted here.
      if (!userId || !roleId) { showToast('Could not complete sign-in.'); return; }

      if (accessToken)  safeSetItem('access_token', accessToken);
      if (refreshToken) safeSetItem('refresh_token', refreshToken);

      const sessionKey = isVendor ? 'vendor_web_session' : 'couple_web_session';
      const sessionData = {
        id: roleId, userId, vendorId: roleId,
        phone: e164,
        pin_set: pinSet,
        name: v.name || d.name || null,
        vendorName: v.name || d.name || null,
        category: v.category || d.category || null,
        tier: v.tier || d.tier || null,
        dreamer_type: d.dreamer_type || 'basic',
        access_token:  accessToken  || null,
        refresh_token: refreshToken || null,
        _v: 2,
      };
      safeSetItem(sessionKey, JSON.stringify(sessionData));
      safeSetItem(isVendor ? 'vendor_session' : 'couple_session', JSON.stringify(sessionData));
      mirrorSessionToCookie(isVendor, sessionData);

      const coupleNeedsOnboarding = !isVendor && !pinSet && !d.name;
      if (coupleNeedsOnboarding) {
        router.push('/couple/onboarding');
      } else if (isVendor) {
        router.push(pinSet ? '/vendor/pin-login' : '/vendor/pin');
      } else {
        router.push(pinSet ? '/couple/pin-login' : '/couple/pin');
      }
    } catch { showToast('Verification failed.'); }
  };

  // ── Sign in (returning member) ────────────────────────────────────────────
  const handleSignIn = async () => {
    const isVendor = role === 'Maker';
    const digits = phone.replace(/\D/g, '');
    const e164 = country.dialCode + digits;
    try {
      const r = await fetch(`${API_BASE}/api/v2/auth/pin-status`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: e164, role: isVendor ? 'vendor' : 'couple' }),
      });
      const d = await r.json();

      // R-X10 arm (a): an unrecognised number on the returning path simply proceeds.
      // The OTP send self-mints on verify, so a visitor who taps `Sign in` before they
      // have an account is not turned away — they are signed up. Zero copy bytes.
      if (!d.ok || !d.exists) { sendOtp(phone); return; }

      if (d.pin_set) {
        const sessionKey = isVendor ? 'vendor_web_session' : 'couple_web_session';
        const sd = {           id: d.role_id, userId: d.user_id, vendorId: d.role_id,           phone: e164, pin_set: true,         };
        safeSetItem(sessionKey, JSON.stringify(sd));
        safeSetItem(isVendor ? 'vendor_session' : 'couple_session', JSON.stringify(sd));
        mirrorSessionToCookie(isVendor, sd);
        router.push(isVendor ? '/vendor/pin-login' : '/couple/pin-login'); // pin screens → /vendor or /frost
        return;
      }

      sendOtp(phone);
    } catch {
      showToast('Could not connect. Try again.');
    }
  };

  const S: React.CSSProperties = { position: 'absolute', inset: 0 };
  const ease = 'cubic-bezier(0.22,1,0.36,1)';


  // The six fields that map to a preset/Codex (categoryPreset.js keys). Value sent
  // to provision is the exact key; label is what the vendor taps.
  // F-09.44 · FOUNDER'S WALK — 「 sign in again shows dreamer and maker 」.
  // The sign-in toggle rendered the internal `Role` union DIRECTLY as user-facing bytes,
  // so this surface spoke two vocabularies for one distinction: the doors said
  // "I'm getting married" while sign-in said "DREAMER". The executor's copy ledger ruled
  // the door labels to plain speech, retired the role sublabels, and renamed the machine
  // off the gate's vocabulary — and never opened the one screen that PRINTS the type.
  // The label is decoupled from the value here; the Role union is unchanged and internal.
  //
  // THE TOGGLE ITSELF STAYS, R-O3: `handleSignIn` derives `isVendor` from `role`, and
  // the chrome Sign in link reaches this screen with role null. Without this control a
  // returning VENDOR is signed in against the couple endpoints, silently.
  // THE REAL CURE IS NOT HERE: a returning member should not be asked at all. That needs
  // `/auth/pin-status` to answer for both roles in one call — a dream-os byte, and
  // dream-os is zero-byte this sitting. Chartered separately, not faked client-side.
  const SIGNIN_ROLES: { role: Role; label: string }[] = [
    { role: 'Dreamer', label: "I'm getting married" },
    { role: 'Maker',   label: "I'm a wedding vendor" },
  ];

  const VENDOR_FIELDS = [
    { label: 'Makeup',        value: 'makeup' },
    { label: 'Photography',   value: 'photography' },
    { label: 'Event Manager', value: 'planning' },
    { label: 'Designer',      value: 'designer' },
    { label: 'Venue & Décor', value: 'venue & decor' },
    { label: 'Jewellery',     value: 'jewellery' },
  ];

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', background: '#0C0A09' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Jost:wght@200;300;400&display=swap');
        * { box-sizing: border-box; }
        input::placeholder { color: rgba(248,247,245,0.3); }
        input[type=date]::-webkit-calendar-picker-indicator { filter: invert(1) opacity(0.4); }
        ::-webkit-scrollbar { display: none; }
        @keyframes breathe { 0%,100%{opacity:0.22} 50%{opacity:0.45} }
      `}</style>

      {/* ── Carousel ─────────────────────────────────────────────────────── */}
      {slides.map((url, i) => (
        <div key={i} style={{
          ...S,
          backgroundImage: `url(${url})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          // F-09.43: hold the cover until a real exploring photo exists to replace it.
          // Zeroing on the state flip alone is what produced the black frame.
          opacity: (screen === 'exploring' && exploringPhotos.length > 0) ? 0 : (i === cur ? 1 : 0),
          transition: `opacity 3s ${ease}`,
          willChange: 'opacity',
          filter: 'none',
          zIndex: 1,           // explicit z — Safari stacking context fix
          pointerEvents: 'none', // never capture clicks
        }} />
      ))}

      {/* ── Vignette ──────────────────────────────────────────────────────── */}
      <div style={{
        ...S, zIndex: 2, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.55) 100%)',
      }} />

      {/* ── Dark overlay for non-exploring screens ────────────────────────── */}
      {screen !== 'exploring' && (
        <div style={{ ...S, zIndex: 3, background: 'rgba(12,10,9,0.15)', pointerEvents: 'none' }} />
      )}

      {/* ── Toast ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div style={{
          position: 'absolute', top: 24, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)',
          border: '0.5px solid rgba(255,255,255,0.2)',
          padding: '10px 20px', zIndex: 100,
          fontFamily: "'DM Sans', sans-serif", fontWeight: 300, fontSize: 13,
          color: '#F8F7F5', whiteSpace: 'nowrap', borderRadius: 100,
        }}>{toast}</div>
      )}

      

      {/* ── TDW_09 O-1 · L-B · THE TWO DOORS (R-O3, Fork 1(a)) ─────────────────
          WHAT THIS REPLACED, AND WHAT WENT WITH IT (CE-115 control inventory):
            (i)   tap-to-expand the strip    REMOVED BY RULING — the panel opens
                                             expanded. Five decisions became two.
            (ii)  `I'm a vendor`             KEPT, re-copied, keeps the gold fill
            (iii) `Plan my wedding`          KEPT, re-copied as the couple door
            (iv)  `Sign in`                  MOVED to the top-right chrome link, where
                                             returning members look and where it stops
                                             competing with acquisition
            (v)   `Just exploring`           MOVED — it is no longer a fourth peer
                                             choice; the feed IS the couple door's
                                             first screen
          The couple door leads with the product because R-X7 rules the couple side
          sees work before it is asked for anything; the vendor door goes straight to
          the join screen because a vendor arriving here already knows what this is. */}
      {screen === 'entry' && (
        <>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20, overflow: 'hidden' }}>
            <div
              style={{
                background: 'rgba(12,10,9,0.35)',
                backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
                borderTop: '0.5px solid rgba(255,255,255,0.1)',
                padding: '20px 24px calc(env(safe-area-inset-bottom, 16px) + 28px)',
              }}
            >
              {/* Brand row */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                <div>
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    fontWeight: 300, fontSize: 20, color: '#F8F7F5',
                    margin: 0, lineHeight: 1.15, letterSpacing: '0.02em',
                  }}>The Dream Wedding</p>
                  {/* F-09.14 resolves to ONE line, founder-ruled (R-O11): `The Wedding OS`
                      replaces BOTH `THE CURATED WEDDING OS` and `India's First Wedding OS`
                      at all three homes — here, the exploring sites, and the document
                      description meta in app/layout.tsx. */}
                  <p style={{
                    fontFamily: "'Jost', sans-serif", fontWeight: 200, fontSize: 7,
                    letterSpacing: '0.32em', textTransform: 'uppercase',
                    color: '#C9A84C', margin: '4px 0 0',
                  }}>The Wedding OS</p>
                </div>
                {/* F-09.42 · FOUNDER'S WALK. This link first shipped as absolute chrome
                    at the top right, over the cover PHOTOGRAPH with no scrim — the only
                    near-white byte on this surface not standing on the panel's backdrop.
                    Its contrast was therefore whatever that second's photo happened to
                    be, which is not a contrast at all. It sits in the brand row now: the
                    same dark blurred backdrop every other byte here stands on, so
                    legibility is solved BY CONSTRUCTION rather than by stacking furniture
                    over the hero. It is still chrome and still not a door — it is above
                    the door stack, small, and right-aligned against the wordmark. */}
                <button
                  onClick={() => { setRole(null); setScreen('signin_phone'); }}
                  style={{
                    background: 'none', border: 'none', padding: '4px 0 4px 12px',
                    cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(248,247,245,0.55)',
                  }}
                >Sign in</button>
              </div>

              {/* The two doors */}
              <div style={{ paddingTop: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <button
                  onClick={() => { setRole('Dreamer'); startExploring(); }}
                  style={{
                    width: '100%', height: 48, background: 'transparent',
                    border: '0.5px solid rgba(248,247,245,0.25)', borderRadius: 100,
                    cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F8F7F5',
                  }}
                >I&apos;m getting married</button>

                <button
                  onClick={() => { setRole('Maker'); setScreen('join_phone'); }}
                  style={{
                    width: '100%', height: 48, background: '#C9A84C', border: 'none',
                    borderRadius: 100, cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 400,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09',
                  }}
                >I&apos;m a wedding vendor</button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ── Glass panel — all non-entry, non-exploring screens — BOTTOM ─────── */}
      {screen !== 'exploring' && screen !== 'entry' && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 20,
          maxHeight: '80vh', overflowY: 'auto',
        }}>
          <div style={{
            background: 'rgba(12,10,9,0.3)',
            backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
            borderTop: '0.5px solid rgba(255,255,255,0.1)',
            borderRadius: '20px 20px 0 0',
            padding: '16px 20px calc(env(safe-area-inset-bottom, 10px) + 16px)',
            boxSizing: 'border-box',
          }}>

            {/* ── THE FIVE REMOVED SCREENS ──────────────────────────────────────
                REMOVED BY RULING (R-X10 arm (a), founder-ratified): `request_who`,
                `request_dreamer`, `request_maker`, `request_done` with its 60-second
                edit window, and the dead `invite_code` screen. The ceremony they made
                gated nothing — the two acquisition doors already walked past it into
                open phone-OTP self-mint, and `invite_code` was reachable from no
                `setScreen` call in the machine. Its backend route is gone too.
                Curation is real and lives at the Discover approval queue, the only
                surface a couple ever sees. Nothing here was demoted; it was retired.
                The controls that MOVED rather than died are named in the handover's
                control inventory, each accounted KEPT / MOVED / REMOVED-BY-RULING. */}
            {/* ── JOIN: NAME + PHONE (was `invite_phone`) ───────────────────── */}
            {screen === 'join_phone' && (
              <>
                <BackBtn onClick={() => setScreen('entry')} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: '#F8F7F5', margin: '0 0 4px' }}>Welcome. Let’s begin.</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(248,247,245,0.5)', margin: '0 0 20px' }}>Enter your details. We’ll send a code to your WhatsApp.</p>
                <Label text="Your first name" />
                <input
                  value={joinName}
                  onChange={e => setJoinName(e.target.value)}
                  placeholder="First name"
                  style={{ ...INPUT }}
                />
                <Label text="Phone number" />
                {/* R-O5 · R-X24 ACCEPTANCE SHOT ① — baseline row, shared line-height,
                    the flag in a fixed square slot. Measured ~1px above before. */}
                <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: 12 }}>
                  <button onClick={() => setShowCountrySheet(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px 0 0', borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: 10, display: 'flex', alignItems: 'baseline', gap: 6, touchAction: 'manipulation', whiteSpace: 'nowrap' }}>
                    <FlagSlot flag={country.flag} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: ROW_LINE_HEIGHT, color: 'rgba(248,247,245,0.5)' }}>{country.dialCode}</span>
                  </button>
                  <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, country.maxDigits))} type="tel" maxLength={country.maxDigits} placeholder="00000 00000" style={{ ...INPUT, borderBottom: 'none', marginBottom: 0, flex: 1, lineHeight: ROW_LINE_HEIGHT }} />
                </div>
                {role === 'Maker' && (
                  <>
                    <Label text="Your craft" />
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                      {VENDOR_FIELDS.map(f => (
                        <button key={f.value} onClick={() => setJoinCategory(f.value)} style={{
                          padding: '6px 12px', borderRadius: 100, border: 'none',
                          background: joinCategory === f.value ? '#C9A84C' : 'rgba(255,255,255,0.08)',
                          color: joinCategory === f.value ? '#0C0A09' : 'rgba(248,247,245,0.7)',
                          fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                          letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
                        }}>{f.label}</button>
                      ))}
                    </div>
                  </>
                )}
                <GoldBtn label="Send code →" onClick={() => sendOtp(phone)} disabled={phone.length < country.maxDigits || (role === 'Maker' && !joinCategory)} />
              </>
            )}

            {/* ── OTP ENTRY ─────────────────────────────────────────────────── */}
            {(screen === 'join_otp' || screen === 'signin_otp') && (
              <>
                <BackBtn onClick={() => setScreen(screen === 'join_otp' ? 'join_phone' : 'signin_phone')} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: '#F8F7F5', margin: '0 0 4px' }}>Check your messages.</p>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: 'rgba(248,247,245,0.5)', margin: '0 0 16px' }}>Enter the 6-digit code we sent you.</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
                  {otp.map((v, i) => (
                    <input
                      key={i} ref={el => { otpRefs.current[i] = el; }}
                      value={v} onChange={e => handleOtpInput(i, e.target.value)}
                      onKeyDown={e => handleOtpKey(i, e)}
                      type="tel" inputMode="numeric" maxLength={1}
                      autoComplete="one-time-code"
                      style={{
                        width: 40, height: 48, border: 'none',
                        borderBottom: '1.5px solid rgba(255,255,255,0.4)',
                        background: 'transparent', outline: 'none',
                        fontFamily: "'DM Sans', sans-serif", fontWeight: 400,
                        fontSize: 20, color: '#F8F7F5', textAlign: 'center',
                      }}
                    />
                  ))}
                </div>
                <GoldBtn label="Verify →" onClick={verifyOtp} disabled={otp.join('').length < 6} />
                <button
                  onClick={() => { setOtp(['', '', '', '', '', '']); sendOtp(phone); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', touchAction: 'manipulation', fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 200, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(248,247,245,0.3)', marginTop: 12, display: 'block', width: '100%' }}
                >Resend code</button>
              </>
            )}

            {/* ── SIGN IN: PHONE ────────────────────────────────────────────── */}
            {screen === 'signin_phone' && (
              <>
                <BackBtn onClick={() => setScreen('entry')} />
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 20, color: '#F8F7F5', margin: '0 0 4px' }}>Welcome back.</p>
                {/* `Are you a:` is deleted — the labels carry the question now. The two
                    chips STACK rather than sit side by side: the plain-speech bytes are
                    ~2.5x the width of the words they replace, and a two-across row would
                    have them at the edge of overflow on a 360px handset. Stacked, they
                    also echo the door pair they now quote, which is the point. */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
                  {SIGNIN_ROLES.map(r => (
                    <button key={r.role} onClick={() => setRole(r.role)} style={{
                      width: '100%', height: 40, border: 'none', borderRadius: 100, cursor: 'pointer',
                      background: role === r.role ? '#C9A84C' : 'rgba(255,255,255,0.08)',
                      color: role === r.role ? '#0C0A09' : 'rgba(248,247,245,0.6)',
                      fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 300,
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                    }}>{r.label}</button>
                  ))}
                </div>
                <Label text="Phone number" />
                {/* R-O5 · R-X24 ACCEPTANCE SHOT ② — the same rule, second surface. */}
                <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid rgba(255,255,255,0.2)', marginBottom: 12 }}>
                  <button onClick={() => setShowCountrySheet(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 10px 0 0', borderRight: '1px solid rgba(255,255,255,0.2)', marginRight: 10, display: 'flex', alignItems: 'baseline', gap: 6, touchAction: 'manipulation', whiteSpace: 'nowrap' }}>
                    <FlagSlot flag={country.flag} />
                    <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: ROW_LINE_HEIGHT, color: 'rgba(248,247,245,0.5)' }}>{country.dialCode}</span>
                  </button>
                  <input value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, country.maxDigits))} type="tel" maxLength={country.maxDigits} placeholder="00000 00000" style={{ ...INPUT, borderBottom: 'none', marginBottom: 0, flex: 1, lineHeight: ROW_LINE_HEIGHT }} />
                </div>
                {/* R-O3, RULED WITH FORK 1: THE ROLE TOGGLE STAYS. `handleSignIn` computes
                    `isVendor = role === 'Maker'`, and the chrome `Sign in` link is reachable
                    with role null — without this control (or this guard) a returning VENDOR
                    would be signed in as a couple, silently, against the couple endpoints.
                    The `!role` guard below is asserted as a bench cell for exactly that
                    reason. Do not remove either half without replacing the other. */}
                <GoldBtn label="Continue →" onClick={handleSignIn} disabled={phone.length < country.maxDigits || !role} />
              </>
            )}

          </div>
        </div>
      )}

      {/* ── "JUST EXPLORING" — EDITORIAL BLIND SWIPE ────────────────────── */}
      {screen === 'exploring' && (
        <div style={{ ...S, zIndex: 20 }}>
          {loadingPreview && (
            <div style={{ ...S, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                fontSize: 20, color: 'rgba(248,247,245,0.6)',
              }}>Curating your preview...</p>
            </div>
          )}

          {!loadingPreview && !exploringDone && exploringPhotos[exploringIdx] && (
            <>
              {/* Full screen editorial photo */}
              <div style={{
                ...S,
                backgroundImage: `url(${exploringPhotos[exploringIdx].image_url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                transition: 'background-image 0.4s ease',
              }} />

              {/* Gradient overlay */}
              <div style={{
                ...S,
                background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
                pointerEvents: 'none',
              }} />

              {/* Back button */}
              <button onClick={() => setScreen('entry')} style={{
                position: 'absolute', top: 'calc(env(safe-area-inset-top, 0px) + 20px)',
                left: 20, zIndex: 30,
                background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(8px)',
                border: '0.5px solid rgba(255,255,255,0.15)', borderRadius: '50%',
                width: 40, height: 40, color: '#F8F7F5', fontSize: 18,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>←</button>

              {/* Progress dots */}
              <div style={{
                position: 'absolute',
                top: 'calc(env(safe-area-inset-top, 0px) + 28px)',
                left: '50%', transform: 'translateX(-50%)',
                display: 'flex', gap: 4, zIndex: 30,
              }}>
                {exploringPhotos.map((_, i) => (
                  <div key={i} style={{
                    width: i === exploringIdx ? 20 : 4, height: 4, borderRadius: 2,
                    background: i === exploringIdx ? '#C9A84C' : 'rgba(255,255,255,0.25)',
                    transition: 'width 300ms cubic-bezier(0.22,1,0.36,1)',
                  }} />
                ))}
              </div>

              {/* TDW branding — top right */}
              <div style={{
                position: 'absolute',
                top: 'calc(env(safe-area-inset-top, 0px) + 24px)',
                right: 20, zIndex: 30, textAlign: 'right',
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                  fontWeight: 300, fontSize: 13, color: 'rgba(248,247,245,0.7)',
                  margin: 0, letterSpacing: '0.02em',
                }}>The Dream Wedding</p>
                <p style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 200,
                  fontSize: 6, letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#C9A84C', margin: '2px 0 0',
                }}>The Wedding OS</p>
              </div>

              {/* Bottom CTA */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 30,
                padding: '0 20px calc(env(safe-area-inset-bottom, 16px) + 24px)',
              }}>
                {/* Caption if exists */}
                {exploringPhotos[exploringIdx].caption && (
                  <p style={{
                    fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                    fontSize: 14, color: 'rgba(248,247,245,0.6)',
                    margin: '0 0 12px', letterSpacing: '0.02em',
                  }}>{exploringPhotos[exploringIdx].caption}</p>
                )}

                {/* Counter */}
                <p style={{
                  fontFamily: "'Jost', sans-serif", fontWeight: 200,
                  fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: 'rgba(248,247,245,0.35)', margin: '0 0 10px',
                }}>{exploringIdx + 1} of {exploringPhotos.length}</p>

                {/* The `Request invite` companion button is REMOVED BY RULING — it
                    diverted a visitor mid-fold into a form that admitted nobody. The
                    advance control keeps the row to itself. */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <button onClick={nextExploring} style={{
                    flex: 1, height: 50, background: '#C9A84C', border: 'none',
                    borderRadius: 100, cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 9, fontWeight: 400,
                    letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0C0A09',
                  }}>
                    {exploringIdx >= exploringPhotos.length - 1 ? 'See the full catalogue →' : 'Next →'}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* After all photos — invite nudge screen */}
          {!loadingPreview && exploringDone && (
            <div style={{
              ...S,
              backgroundImage: `url(${exploringPhotos[exploringPhotos.length - 1]?.image_url || ''})`,
              backgroundSize: 'cover', backgroundPosition: 'center',
            }}>
              <div style={{ ...S, background: 'rgba(12,10,9,0.72)', backdropFilter: 'blur(4px)' }} />
              <div style={{
                position: 'absolute', inset: 0, display: 'flex',
                flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '40px 28px', zIndex: 10,
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
                  fontWeight: 300, fontSize: 11, letterSpacing: '0.3em',
                  textTransform: 'uppercase', color: '#C9A84C', margin: '0 0 16px',
                }}>The Wedding OS</p>

                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                  fontSize: 32, color: '#F8F7F5', margin: '0 0 8px',
                  lineHeight: 1.15, textAlign: 'center', letterSpacing: '0.01em',
                }}>
                  Not just happily married.
                </p>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                  fontSize: 32, color: '#F8F7F5', margin: '0 0 24px',
                  lineHeight: 1.15, textAlign: 'center',
                }}>
                  Getting married{' '}
                  <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>happily.</span>
                </p>

                <p style={{
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 300,
                  color: 'rgba(248,247,245,0.55)', margin: '0 0 36px',
                  lineHeight: 1.7, textAlign: 'center', maxWidth: 300,
                }}>
                  {/* FOUNDER'S OWN BYTE, R-O11 #4, shipped verbatim. The invite
                      question died with the ceremony; the curation claim survives
                      because it is TRUE — the Discover approval queue gates the feed,
                      which is the only surface a couple ever sees. */}
                  Every vendor on TDW is Curated
                </p>

                <div style={{ width: '100%', maxWidth: 340 }}>
                  {/* The closing moment keeps its full bleed; only its CTA changes.
                      It carries the couple door's own label and enters the couple
                      door's flow — the fold IS that door's first screen, so its end is
                      that door's continuation, not a request form. */}
                  <button onClick={() => { setRole('Dreamer'); setScreen('join_phone'); }} style={{
                    width: '100%', height: 54, background: '#C9A84C', border: 'none',
                    borderRadius: 100, cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 10, fontWeight: 400,
                    letterSpacing: '0.22em', textTransform: 'uppercase', color: '#0C0A09',
                    marginBottom: 12,
                  }}>I&apos;m getting married</button>

                  <button onClick={() => setScreen('entry')} style={{
                    width: '100%', height: 46, background: 'transparent',
                    border: '0.5px solid rgba(248,247,245,0.2)', borderRadius: 100,
                    cursor: 'pointer', touchAction: 'manipulation',
                    fontFamily: "'Jost', sans-serif", fontSize: 8, fontWeight: 200,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'rgba(248,247,245,0.4)',
                  }}>← Back to home</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Country picker bottom sheet ─────────────────────────────── */}
      <CountrySheet
        visible={showCountrySheet}
        onSelect={c => { setCountry(c); setPhone(''); }}
        onClose={() => setShowCountrySheet(false)}
      />
    </div>
  );
}
