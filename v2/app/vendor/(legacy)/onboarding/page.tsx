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
import { forgetVendorMe } from '@/hooks/vendor/useVendorHandle';
import { useT } from '@/lib/vendor/ThemeContext';
import { labelFor } from '@/lib/frost/categoryLabels';
import { scopeCss, typeCss } from '@/v2/lib/worklist/theme';
import { RECORD_CSS } from '@/v2/components/worklist/RecordPage';
import { CopyBox } from '@/v2/components/worklist/CopyBox';
// CE-47 L4 (FE-7): Onboarding's words, veto rows 54 to 59 as approved.
const OB = {
  brand: 'The Dream Wedding', title: 'Set up your studio', sub: 'Two minutes. Clients use this to reach you.',
  name: 'Your name', business: 'Studio or business name', craft: 'What you do', city: 'Based in', cityHint: 'Mumbai',
  price: 'Your starting price, in Rs', priceHint: '80,000', area: 'Where you work', cities: 'Which cities',
  citiesHint: 'Add a city', ig: 'Instagram handle', igHint: '@yourhandle', stillNeeded: 'Still needed',
  go: 'Get started', setting: 'Setting up\u2026',
  doneTitle: (first: string) => `You\u2019re all set, ${first}.`, doneLine: 'Share your TDW link. Clients message you there.',
  linkLabel: 'Your TDW link', copy: 'Copy', copied: 'Copied', open: 'Open your studio',
} as const;

// ── DISPLAY LABELS · founder-signed 2026-08-13 · MOVED, NOT EDITED ─────────
// `CAT_LABEL` and `labelFor` left this file at TDW_15 P2 (R-34.33) for
// `lib/frost/categoryLabels.ts`, byte-for-byte, because the bride's envelope
// picker needs the same eleven and a second copy is how a signed label set
// drifts. THE INVARIANT THIS PAGE STILL HOLDS is unchanged and is what the
// bench asserts: the labels are DECLARED at that home, IMPORTED here, and every
// option renders THROUGH `labelFor` — so a token the server adds still appears,
// through the fallback, instead of silently disappearing.
//
// A LABEL MAP IS NOT A TAXONOMY. The picker below iterates the server's
// `allowed[]`, never `Object.keys(CAT_LABEL)`. That distinction did not move.

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

// CE-47 L4 (FE-7): each box's label, keyed on its interface field; the Still-needed marker is drawn from the
// SERVER's missing[] and nothing else (no local emptiness rule), as the page did before the rework.
function Label({ text, field, missing }: { text: string; field: string; missing: string[] }) {
  return (
    <label className="ob-lbl">{text}
      {missing.includes(field) && <span className="ob-need">{OB.stillNeeded}</span>}
    </label>
  );
}

// CE-47 L4 (FE-7): the chip row, at module level (react-hooks/static-components).
function Chips({ items, on, pick }: { items: { token: string; label: string }[]; on: string; pick: (t: string) => void }) {
  return (
    <div className="ob-chips">{items.map(({ token, label }) => (
      <button key={token} type="button" className={'ob-chip' + (on === token ? ' on' : '')} aria-pressed={on === token} onClick={() => pick(token)}>{label}</button>))}</div>
  );
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
        // F-44.246 (CE-46 FE-4, 29 Sept 2026, launch-blocking): the shell's gate (WorklistBoot.tsx) reads
        // vendorMe(), which remembers /me for the whole document (F-38.26). A vendor who reaches this page with
        // the shell's remembered answer still saying complete:false would be sent back here the moment she lands
        // on /vendor, and this read (fresh) would send her to /vendor again: a blank loop until a full reload.
        // So the remembered answer is dropped BEFORE she is sent to the shell, and the shell asks again.
        if (v.onboarding?.complete) { forgetVendorMe(); router.replace('/vendor'); return; }

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
      // F-44.246: the submit just flipped onboarding.complete to true on the server. The shell's remembered /me
      // (vendorMe, F-38.26) still says false from before, so "Open your studio" below would bounce her straight
      // back here. Drop it now, in the success arm, before any replace to /vendor can read it.
      forgetVendorMe();
      setDone(true);
    } catch { showToast('Could not connect. Try again.'); }
    setSubmitting(false);
  }, [name, igHandle, businessName, category, city, rate, area, cities, submitting]);

  // CE-47 L4 (FE-7), veto 54: the old hand-set colours (and the Label and toast that used them) are gone; the toast
  // draws from the theme's tokens on this page's scope (.ob-toast below).
  const Toast = toast ? <div className="ob-toast" role="status">{toast}</div> : null;

  if (loading) {
    return <div style={{ position: 'fixed', inset: 0, background: T.headerBg }} aria-busy="true" />;
  }

  // ── Done screen ──────────────────────────────────────────────────────────
  // CE-47 L4 (FE-7), veto 54: the app's own type and tokens (scopeCss + typeCss onto this page's scope); no hand-set
  // faces, no literal colour (R-42.6).
  const mode = T.isLight ? 'light' : 'dark';
  const css = scopeCss('.ob2') + typeCss('.ob2') + RECORD_CSS + `
.ob2{min-height:100dvh;background:var(--atelier-page-bg);color:var(--atelier-ink);padding:32px 16px 48px;box-sizing:border-box}
.ob-in{max-width:420px;margin:0 auto;display:flex;flex-direction:column}
.ob-brand{margin:0 0 24px;font:500 1.25rem/1.2 var(--font-brand),Georgia,serif;color:var(--atelier-ink)}
.ob-h{margin:0 0 4px;font:var(--wl-t1);color:var(--atelier-ink)}
.ob-sub{margin:0 0 24px;font:var(--wl-t4);color:var(--atelier-ink-mute)}
.ob-lbl{display:flex;justify-content:space-between;margin:16px 0 8px;font:var(--wl-t5);color:var(--atelier-ink-mute)}
.ob-need{color:var(--role-caution)}
.ob-f{box-sizing:border-box;width:100%;min-height:48px;padding:12px 16px;border:1px solid var(--atelier-input-border);border-radius:12px;background:var(--atelier-input-bg);color:var(--atelier-ink);font:var(--wl-tn)}
.ob-chips{display:flex;flex-wrap:wrap;gap:8px}
.ob-chip{min-height:44px;padding:0 16px;border-radius:999px;border:1px solid var(--atelier-card-border);background:transparent;color:var(--atelier-ink);font:var(--wl-t4)}
.ob-chip.on{background:var(--role-primary);border-color:var(--role-primary);color:var(--role-on-primary)}
.ob-refusal{margin:0 0 16px;padding:12px 16px;border:1px solid var(--role-caution);border-radius:12px;font:var(--wl-t4);color:var(--role-caution)}
.ob-go{margin-top:32px}
.ob-toast{position:fixed;top:24px;left:50%;transform:translateX(-50%);z-index:99;padding:10px 20px;border:1px solid var(--role-caution);border-radius:999px;background:var(--atelier-card-bg);color:var(--role-caution);font:var(--wl-t4);white-space:nowrap}
`;
  if (done) {
    return (
      <div className="ob2" data-wl-mode={mode}><style>{css}</style>
        <div className="ob-in">
          <p className="ob-brand">{OB.brand}</p>
          <h1 className="ob-h">{OB.doneTitle(name.split(' ')[0])}</h1>
          <p className="ob-sub">{OB.doneLine}</p>
          {tdwLink ? (<><p className="ob-lbl">{OB.linkLabel}</p><CopyBox text={tdwLink.replace(/^https?:\/\//, '')} copyValue={tdwLink} label={OB.copy} copied={OB.copied} /></>) : null}
          <button type="button" className="rp-next ob-go" onClick={() => router.replace('/vendor')}>{OB.open}</button>
        </div>
      </div>
    );
  }
  return (
    <div className="ob2" data-wl-mode={mode}><style>{css}</style>
      {Toast}
      <div className="ob-in">
        <p className="ob-brand">{OB.brand}</p>
        <h1 className="ob-h">{OB.title}</h1>
        <p className="ob-sub">{OB.sub}</p>
        {refusal ? <p className="ob-refusal">{refusal}</p> : null}
        <Label text={OB.name} field="name" missing={missing} />
        <input className="ob-f" value={name} onChange={(e) => setName(e.target.value)} />
        <Label text={OB.business} field="business_name" missing={missing} />
        <input className="ob-f" value={businessName} onChange={(e) => setBusiness(e.target.value)} />
        <Label text={OB.craft} field="category" missing={missing} />
        <div className="ob-chips">{allowed.map((token) => (
          <button key={token} type="button" className={'ob-chip' + (category === token ? ' on' : '')} aria-pressed={category === token} onClick={() => setCategory(token)}>
            {labelFor(token)}
          </button>))}</div>
        <Label text={OB.city} field="city" missing={missing} />
        <input className="ob-f" value={city} onChange={(e) => setCity(e.target.value)} placeholder={OB.cityHint} />
        <Label text={OB.price} field="starting_price" missing={missing} />
        <input className="ob-f" value={rate} onChange={(e) => setRate(e.target.value)} placeholder={OB.priceHint} inputMode="numeric" />
        <Label text={OB.area} field="service_area" missing={missing} />
        <Chips items={SERVICE_AREAS} on={area} pick={setArea} />
        {area === 'select_cities' ? (<><label className="ob-lbl">{OB.cities}</label>
          <input className="ob-f" value={cities} onChange={(e) => setCities(e.target.value)} placeholder={OB.citiesHint} /></>) : null}
        <label className="ob-lbl">{OB.ig}</label>
        <input className="ob-f" value={igHandle} onChange={(e) => setIgHandle(e.target.value)} placeholder={OB.igHint} />
        <button type="button" className="rp-next ob-go" disabled={submitting} onClick={() => void submit()}>{submitting ? OB.setting : OB.go}</button>
      </div>
    </div>
  );
}
