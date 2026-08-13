'use client';
// app/vendor/onboarding/page.tsx
// ARC OB · charter OB-P · THE VENDOR FORM — six boxes, keyed on the server's contract.
//
// ═══ SERVER-TRUTH DOCTRINE (OB-P §5) ════════════════════════════════════════
// This form holds NO copy of the predicate's rules, NO copy of the category
// taxonomy, and NO refusal sentences of its own. It renders the server's:
//   · which fields are outstanding  → `onboarding.missing[]` (GET /vendor/me)
//                                     and `missing[]` (400 INCOMPLETE)
//   · which categories are legal    → `allowed[]` (400 INCOMPLETE)
//   · why a submission was refused  → `error` (400), rendered verbatim
// That is the one arrangement in which taxonomy churn stays harmless: a token
// added in dream-os appears in this picker with NO edit here.
//
// WHAT STOOD HERE BEFORE, and why none of it survived:
//   · a FOURTH shadow taxonomy — CATEGORIES (15 tokens) + CAT_LABEL, carrying
//     'videography', 'hair', 'venue', 'catering', 'music', 'couture',
//     'invitations'; declared, never read, never sent. F-OB.8. It dies here
//     rather than being re-pointed: RETIRE-WITH-THE-READER, and there is no
//     reader to move because there never was one.
//   · `category` state with no control and no place in the POST body
//   · NO name input at all — `name` was seeded from session and never collected,
//     which is how vendors reached the estate nameless
//   · a live `open_to_travel` toggle writing a column migration 0122 stamped
//     STOP-WRITING, and which the cured endpoint no longer writes at all
//     (F-OB.12) — service_area supersedes it, because a boolean cannot express
//     worldwide (two values, three states)
//   · `if (!city.trim())` — a CLIENT deciding completeness, the exact thing the
//     server-truth doctrine forbids
//   · `stated_rate` prose in place of `rate_min`, so starting price never landed
//
// ═══ WHY THIS PAGE PROBES ON MOUNT ══════════════════════════════════════════
// The picker must build from `allowed[]`, which rides the 400 INCOMPLETE. A form
// cannot render options it can only obtain by submitting. So: the GET answers
// "am I complete, and what is outstanding"; if and ONLY IF it says incomplete,
// one empty POST asks the door "what may I choose from" — and that probe is safe
// BY THE ENDPOINT'S OWN RULING, not by hope: the refusal is ATOMIC, so an
// incomplete submission writes nothing at all. The probe is never fired for a
// complete vendor, because for her the same POST would be a 200 and a write.
//
// APPROVED-COPY-CARRIES-ITS-HASH. Every string below marked 「 」 in the veto
// sheet is founder-signed (2026-08-13, 「 approve as proposed 」) and frozen at
// the byte. An edited comma is a fresh veto and may not ride a refactor.

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getVendorSession, setVendorSession } from '@/lib/vendor/session';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { useT } from '@/lib/vendor/ThemeContext';

// ── DISPLAY LABELS · founder-signed 2026-08-13 ─────────────────────────────
// A LABEL MAP IS NOT A TAXONOMY. This object answers "what does a human read
// for this token", never "which tokens exist" — that question is answered
// exclusively by the server's `allowed[]`. The distinction is load-bearing: the
// picker iterates allowed[], not Object.keys(CAT_LABEL), so a token the server
// adds RENDERS (through the fallback below) instead of silently disappearing.
// That is the difference between this and the shadow taxonomy it replaces.
const CAT_LABEL: Record<string, string> = {
  planning:        'Event Planner',
  designer:        'Designer',
  photography:     'Photography & Videography',
  makeup:          'Make up Artist',
  hairstylist:     'Hairstylist',
  jewellery:       'Jewellery',
  decor:           'Decor',
  venue_catering:  'Venue & Catering',
  performer:       'Performer (Anchor, DJ, Choreography)',
  content_creator: 'Content Creator',
  other:           'Something else',
};

// An unlabelled token still renders, readably, rather than vanishing from the
// picker — the drift-proof half. Unvetoed by construction: it mints no words of
// its own, it only makes the server's token legible until copy catches up.
const labelFor = (token: string) =>
  CAT_LABEL[token] || token.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ── SERVICE AREA · SET A, frozen at migration 0122 ─────────────────────────
// Not vetoable here — these three were frozen server-side and this is their
// display half, in the ruled order.
const SERVICE_AREAS: { token: string; label: string }[] = [
  { token: 'pan_india',     label: 'Across India' },
  { token: 'worldwide',     label: 'Worldwide' },
  { token: 'select_cities', label: 'Select cities' },
];

interface VendorMe {
  ok: boolean;
  vendor?: {
    name?: string | null;
    business_name?: string | null;
    category?: string | null;
    city?: string | null;
    rate_min?: number | null;
    service_area?: string | null;
    service_cities?: string[] | null;
    instagram_handle?: string | null;
    onboarding?: { complete: boolean; missing: string[] };
  };
}

interface OnboardResp {
  ok: boolean;
  error?: string;
  code?: string;
  missing?: string[];
  allowed?: string[];
  routing_handle?: string;
  tdw_link?: string;
}

export default function VendorOnboardingPage() {
  const router = useRouter();
  const T      = useT();

  const [loading,  setLoading]  = useState(true);
  const [allowed,  setAllowed]  = useState<string[]>([]);
  const [missing,  setMissing]  = useState<string[]>([]);
  const [refusal,  setRefusal]  = useState('');

  const [name,         setName]     = useState('');
  const [igHandle,     setIgHandle] = useState('');
  const [businessName, setBusiness] = useState('');
  const [category,     setCategory] = useState('');
  const [city,         setCity]     = useState('');
  const [rate,         setRate]     = useState('');
  const [area,         setArea]     = useState('');
  const [cities,       setCities]   = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [toast,      setToast]      = useState('');
  const [done,       setDone]       = useState(false);
  const [tdwLink,    setTdwLink]    = useState('');

  const showToast = (m: string) => { setToast(m); setTimeout(() => setToast(''), 3000); };

  // ── MOUNT: the verdict, the prefill, and the picker's options ────────────
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const me = await getJson<VendorMe>('/api/v2/vendor/me', true);
        if (!live) return;
        const v = me.vendor;
        if (!me.ok || !v) { setLoading(false); return; }

        // An ALREADY-COMPLETE vendor never sees this form and never triggers the
        // probe. She is here by a stale link or a back button, not by the guard.
        if (v.onboarding?.complete) { router.replace('/vendor'); return; }

        setName(v.name || getVendorSession()?.name || '');
        setBusiness(v.business_name || '');
        setCategory(v.category || '');
        setCity(v.city || '');
        setRate(v.rate_min ? String(v.rate_min) : '');
        setArea(v.service_area || '');
        setCities((v.service_cities || []).join(', '));
        setIgHandle(v.instagram_handle || '');
        setMissing(v.onboarding?.missing || []);

        // The probe. Guaranteed a 400 by the verdict above, and therefore
        // guaranteed to write nothing (the endpoint's atomic-refusal ruling).
        const probe = await postJson<OnboardResp>('/api/v2/vendor/onboarding', {});
        if (!live) return;
        if (probe.allowed) setAllowed(probe.allowed);
      } catch {
        if (live) showToast('Could not connect. Try again.');
      }
      if (live) setLoading(false);
    })();
    return () => { live = false; };
  }, [router]);

  const submit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    setRefusal('');
    try {
      // service_area and service_cities travel as a PAIR or not at all — the
      // endpoint's validator refuses one without the other, and 0122's pairing
      // CHECK is the floor under that. `null`, never [], when the area is not
      // select_cities: the CHECK reads `is null` and an empty array satisfies
      // neither arm.
      const cityList = cities.split(',').map((c) => c.trim()).filter(Boolean);
      const body: Record<string, unknown> = {
        name:             name.trim()         || undefined,
        business_name:    businessName.trim() || undefined,
        category:         category            || undefined,
        city:             city.trim()         || undefined,
        rate_min:         rate.trim()         || undefined,
        instagram_handle: igHandle.trim().replace(/^@/, '') || undefined,
      };
      if (area) {
        body.service_area   = area;
        body.service_cities = area === 'select_cities' ? cityList : null;
      }

      const res = await postJson<OnboardResp>('/api/v2/vendor/onboarding', body);

      if (!res.ok) {
        // THE SERVER'S SENTENCE, RENDERED — never re-worded, never replaced by a
        // friendlier local one. It is already founder-vetoed at the endpoint.
        setRefusal(res.error || '');
        setMissing(res.missing || []);
        if (res.allowed) setAllowed(res.allowed);
        setSubmitting(false);
        return;
      }

      const session = getVendorSession();
      if (session) setVendorSession({ ...session, name: name.trim() });
      if (res.tdw_link) setTdwLink(res.tdw_link);
      setDone(true);
    } catch { showToast('Could not connect. Try again.'); }
    setSubmitting(false);
  }, [name, igHandle, businessName, category, city, rate, area, cities, submitting]);

  // ── Tokens ──────────────────────────────────────────────────────────────
  const INK    = T.ink;
  const MUTE   = T.inkMute;
  const BRASS  = T.brass;
  // ── ARC OB · OB-P · THE ATTENTION TOKEN, WITNESSED NOT REMEMBERED ─────────
  // Founder caught 「 Still needed 」 and the refusal reading too faint on the
  // light theme. Derived from lib/vendor/theme.ts rather than adjusted by eye:
  //
  //   brass  '#C9A84C' on BOTH themes — measures 2.05:1 on Editorial Paper
  //   metal  '#826A27' on light (4.66:1), corrected FOR THAT EXACT REASON
  //   caution '#9B5E22' on light (4.68:1) / '#E0A870' on dark (8.47:1)
  //
  // I had reached for `brass`, which is the BRASS CONTROL colour and is held
  // identical across themes on purpose — the gold button below is its correct
  // use. As TEXT on a cream page it renders at 2:1, which is not dim, it is
  // nearly invisible, and F-09.3 already ruled the brass mark is NEVER body
  // text. The estate had the right token the whole time.
  //
  // CAUTION, not CRITICAL: theme.ts defines caution as 「 pending, attention, a
  // soft warning 」 and critical as 「 overdue, lost, destructive 」. A field the
  // vendor has not filled in yet is pending, not destroyed, and dressing an
  // unfinished form in the destructive colour would teach the palette to lie
  // the first time something genuinely IS destructive.
  const ATTN   = T.caution;
  // THE BRASS MARK, THEME-CORRECTED. `metal` is what theme.ts calls 「 the brass
  // mark — rules, badges, marks 」 and it is the SAME hue as brass, moved only in
  // lightness so it survives a cream page (#826A27, 4.66:1) instead of dissolving
  // into it (#C9A84C, 2.05:1). The eyebrow and the TDW link are MARKS, so they
  // keep the brass identity and gain the legibility. Found by the bench, not by
  // eye: cell 5b.2 caught three brass-as-text sites this patch had missed.
  const METAL  = T.metal;
  const BORDER = T.cardBorder;
  const BG     = T.cardBg;

  const inp: React.CSSProperties = {
    width: '100%', background: 'transparent',
    border: 'none', borderBottom: `1px solid ${BORDER}`,
    outline: 'none',
    fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)',
    fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: INK,
    padding: '8px 0', marginBottom: 20, boxSizing: 'border-box',
  };
  const lbl: React.CSSProperties = {
    fontFamily: 'var(--font-jost, system-ui, sans-serif)',
    fontWeight: 200, fontSize: 8, letterSpacing: '0.22em',
    textTransform: 'uppercase', color: MUTE,
    display: 'block', marginBottom: 6,
  };

  // THE MISSING MARKER — rendered from the server's missing[], never from a
  // local rule about which boxes are empty. A field the server has not asked
  // for does not wear this, even if it looks blank here.
  const Label = ({ text, field }: { text: string; field: string }) => (
    <label style={lbl}>
      {text}
      {missing.includes(field) && (
        <span style={{ color: ATTN, marginLeft: 8, letterSpacing: '0.14em' }}>Still needed</span>
      )}
    </label>
  );

  const Toast = toast ? (
    <div style={{ position: 'fixed', top: 24, left: '50%', transform: 'translateX(-50%)', background: 'rgba(201,168,76,0.12)', border: `0.5px solid ${BRASS}`, borderRadius: 100, padding: '10px 20px', fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontSize: 16, lineHeight: 1.5, color: ATTN, whiteSpace: 'nowrap', zIndex: 99 }}>
      {toast}
    </div>
  ) : null;

  if (loading) {
    return <div style={{ position: 'fixed', inset: 0, background: T.headerBg }} aria-busy="true" />;
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  if (done) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: T.headerBg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 32px' }}>
        {Toast}
        <p style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 31, lineHeight: 1.5, color: INK, margin: '0 0 8px', textAlign: 'center' }}>
          You&apos;re all set, {name.split(' ')[0]}.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontWeight: 300, fontSize: 16, color: MUTE, textAlign: 'center', lineHeight: 1.6, margin: '0 0 28px', maxWidth: 320 }}>
          Your PA is ready. Share your TDW link — that&apos;s where clients message you.
        </p>
        {tdwLink && (
          <div style={{ background: BG, border: `0.5px solid ${BORDER}`, borderRadius: 12, padding: '16px 20px', width: '100%', maxWidth: 360, marginBottom: 24 }}>
            <p style={{ ...lbl, marginBottom: 8 }}>Your TDW link</p>
            <p style={{ fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: METAL, letterSpacing: '0.04em', wordBreak: 'break-all', margin: 0 }}>
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

  // ── The six-box form ─────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, background: T.headerBg, overflowY: 'auto' }}>
      {Toast}
      <div style={{ maxWidth: 480, margin: '0 auto', padding: 'calc(env(safe-area-inset-top, 0px) + 40px) 28px calc(env(safe-area-inset-bottom, 0px) + 40px)' }}>

        <p style={{ fontFamily: 'var(--font-jost, system-ui, sans-serif)', fontWeight: 200, fontSize: 8, letterSpacing: '0.3em', textTransform: 'uppercase', color: METAL, margin: '0 0 12px' }}>
          The Dream Wedding
        </p>
        <p style={{ fontFamily: 'var(--font-cormorant, Georgia, serif)', fontStyle: 'italic', fontWeight: 300, fontSize: 25, color: INK, lineHeight: 1.15, margin: '0 0 6px' }}>
          Let&apos;s set up your studio.
        </p>
        <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontWeight: 300, fontSize: 16, color: MUTE, lineHeight: 1.6, margin: '0 0 36px' }}>
          Two minutes. Your clients will use this to reach you.
        </p>

        {/* THE SERVER'S REFUSAL — verbatim, above the boxes it is about */}
        {refusal && (
          <p style={{ fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: ATTN, background: T.cardBg, border: `0.5px solid ${ATTN}`, borderRadius: 8, padding: '12px 16px', margin: '0 0 28px' }}>
            {refusal}
          </p>
        )}

        <Label text="Your name" field="name" />
        <input value={name} onChange={(e) => setName(e.target.value)} style={inp} />

        <Label text="Studio or business name" field="business_name" />
        <input value={businessName} onChange={(e) => setBusiness(e.target.value)} style={inp} />

        {/* THE PICKER — built from allowed[], never from a list held here */}
        <Label text="What you do" field="category" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {allowed.map((token) => (
            <button
              key={token}
              onClick={() => setCategory(token)}
              style={{
                background: category === token ? BRASS : 'transparent',
                border: `0.5px solid ${category === token ? BRASS : BORDER}`,
                borderRadius: 100, padding: '8px 14px', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)',
                fontWeight: 300, fontSize: 16, lineHeight: 1.2,
                color: category === token ? '#0C0A09' : INK,
                transition: 'all 150ms ease',
              }}
            >
              {labelFor(token)}
            </button>
          ))}
        </div>

        <Label text="Based in" field="city" />
        <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Mumbai" style={inp} />

        <Label text="Your starting price" field="starting_price" />
        <input value={rate} onChange={(e) => setRate(e.target.value)} placeholder="e.g. 80,000" style={inp} />

        <Label text="Where you work" field="service_area" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {SERVICE_AREAS.map(({ token, label }) => (
            <button
              key={token}
              onClick={() => setArea(token)}
              style={{
                background: area === token ? BRASS : 'transparent',
                border: `0.5px solid ${area === token ? BRASS : BORDER}`,
                borderRadius: 100, padding: '8px 14px', cursor: 'pointer',
                fontFamily: 'var(--font-dm-sans, system-ui, sans-serif)',
                fontWeight: 300, fontSize: 16, lineHeight: 1.2,
                color: area === token ? '#0C0A09' : INK,
                transition: 'all 150ms ease',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {area === 'select_cities' && (
          <>
            <label style={lbl}>Which cities</label>
            <input value={cities} onChange={(e) => setCities(e.target.value)} placeholder="Add a city" style={inp} />
          </>
        )}

        {/* ── THE HELPER LINE IS CUT — founder ruling, 2026-08-13 ───────────
            It said 「 Your clients tap this to reach your PA. Becomes your TDW
            link. 」 and both halves were false. Nobody taps an Instagram handle:
            generateHandle strips the @, drops non-alphanumerics, caps at 30 and
            uses the result as the routing_handle SLUG — the client taps the TDW
            link, a different string. And 「 Becomes your TDW link 」 holds only on
            a FIRST run, because generateHandle returns any existing handle
            unchanged (src/api/vendor/onboarding.js:129), so a returning vendor
            can type anything here and her link will not move. Witnessed live on
            the walk: the founder left this blank and still holds DEV440.

            CUT, NOT REWRITTEN. Removing a false sentence is a subtraction from a
            vetoed byte; minting a replacement is the founder's pen. The label
            alone is unambiguous, and the TDW link already gets its own explained
            block on the done screen — which is where the explanation belongs,
            next to the thing it describes. */}
        <label style={lbl}>Instagram handle</label>
        <input
          value={igHandle}
          onChange={(e) => setIgHandle(e.target.value.replace(/\s/g, ''))}
          placeholder="@yourhandle"
          style={inp}
        />


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
