'use client';
// /vendor/discover/profile — DISCOVER PROFILE · TDW_07 P2
//
// The spec calls this "Profile Studio". FOUNDER-RENAMED 2026-07-29, and the rename is a
// declared drift recorded in the handover: the vendor app already uses STUDIO for its
// top-level mode (Calendar · Business · More) AND for the prestige-gated Studio Suite at
// /vendor/studio. A third Studio would have been a name doing three jobs. "Discover
// Profile" was already shipped as the Header's own menu label — the name arrived before
// the screen did.
//
// SITED IN DISCOVER MODE, founder-ruled: /vendor/discover is the DISCOVER panel root
// (app/vendor/layout.tsx:83), so this sits one level under it beside discover/submit and
// discover/leads. No BottomNav change — Portfolio · Leads · Collab stand as they are.
//
// THE FIELD SPLIT (CE ruling §C — one editor per field, no field writable from two
// surfaces): a field Discover RENDERS or profileScore SCORES lives here; a field serving
// operations or the engine stays in /vendor/settings. business_name is the one dual case
// — the card's headline and the invoice letterhead — and rendering won, so it lives here
// with a helper line naming the second consequence.
//
// SERVER SIDE: everything writes through the existing PATCH /api/v2/vendor/me allowlist
// (three additive entries this sitting: about · rate_display · discover_paused). A
// dedicated route was proposed and refused — the handler already scopes every write with
// .eq('id', vendor.id), so a second route would owe a second copy of the locked-field
// checks for nothing.
//
// W-1 / HOUSE LAWS: no localStorage; ONE gold per screen — the meter arc owns it, and
// every Save button here is the same bordered brass the settings screen already uses;
// money renders through formatRs (Rs 1,50,000), never the ₹ glyph and never k/L/Cr.
// PORTFOLIO IS P3's SLOT: this screen links out to /vendor/portfolio rather than growing
// a second photo manager, exactly as the charter scopes it.

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { useSettings } from '@/hooks/vendor/useSettings';
import { useToast } from '@/hooks/vendor/useToast';
import { Toast } from '@/components/vendor/Toast';
import { Header } from '@/components/vendor/Header';
import { SCard, SField, SToggle, SaveBtn, A, F } from '@/components/vendor/AtelierForm';
import { updateMe, fetchDiscoverStatus, fetchPortfolio } from '@/lib/vendor/api/vendor';
import { photoFloor } from '@/lib/vendor/discoverFloor';
// TDW_09 PHASE B · F-5(a)/F-7 — the one vocabulary home (parity-arbitered
// against the dream-os mirror; see the module header).
import { vocabularyFor, normalizeTags, isVocabularyTag } from '@/lib/shared/tagVocabulary';
import { W, SECTION_ORDER, MIN_TAGS, buildGaps, scoreOf, type Term, type Gaps } from '@/lib/vendor/profileMeter';
import { Meter } from '@/components/vendor/ProfileMeter';
import { useVendorMe } from '@/hooks/vendor/useVendorMe'; // category (locked field) read-only
import { formatRs } from '@/lib/vendor/format';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';

// ── THE SCORE, MIRRORED FOR DISPLAY ONLY ──────────────────────────────────────────
// src/lib/vendor/profileScore.js is THE one home and it computes the number that ranks
// the feed. This screen cannot import it (cross-repo), so it renders a DISPLAY mirror
// whose weights and section order are copied from that file with this comment as their
// binding. It is deliberately not a second authority: nothing the vendor sees here is
// written anywhere, and the feed never reads it. If the server's weights move, this
// comment is the pointer to move with them.
//   src/lib/vendor/profileScore.js — TERM_WEIGHTS + SECTION_ORDER, TDW_07 P2.
// TDW_09 PHASE B — W / SECTION_ORDER / MIN_TAGS / buildGaps / scoreOf / Meter
// MOVED (not rewritten — the F11(c) studioShared precedent) to
// lib/vendor/profileMeter.ts + components/vendor/ProfileMeter.tsx, so the
// Storefront door's §1 (F-3(a)) renders THE SAME score from THE SAME model.
// This screen's rendered output is unchanged; it imports back what it authored.


// TDW_07 P2 micro 2 — the gap record carries two extra FACTS, not two extra terms:
//   `pending`  photos uploaded and awaiting an admin. The SCORE must keep ignoring them
//              (a couple sees approved rows only) but the COPY must not, or the screen
//              tells a vendor to upload what they just uploaded.
//   `partial`  a rate with a min and no max. The term is correctly unmet — requestDiscover
//              needs both bounds — but "Set your starting rate" to someone who set one
//              reads as a failed save.
// Neither changes a weight, a gap, or the score. They change only what the sentence knows.


// FOUNDER-VETOED 2026-07-29 (copy slot 4, 「 go 」). The spec's third hint — "your last
// enquiry sat {n}h" — is DROPPED and this is its reason: no carrier for enquiry-response
// latency exists. couple_enquiries is 9 columns with created_at alone; leads.updated_at
// rests on a trigger the witnessed schema reference deliberately omits, and its state is
// written by four hands including AI harvest, so a bump is not "the vendor replied". The
// substitute is the unmet terms by weight × gap, tie-broken by SECTION_ORDER so the same
// profile always yields the same three.
// TDW_07 P2 micro 2 · FOUNDER-VETOED 2026-07-30. Three defects, all found by the founder
// walking his own account rather than by any cell, and all of the same family: a sentence
// that was right in the abstract and wrong at a real number.
//   (a) THE SINGULAR. "Add 1 more photos" — the vetoed template was `Add {n} more photos`
//       and nobody, including the executor, walked it to n = 1. It reads broken at exactly
//       the moment a vendor is closest to done.
//   (b) PENDING. The gate line was fixed to carry BOTH counts (F-07.4's reconciliation)
//       and this hint was not — so a screen could read "you have 7 uploaded" three lines
//       above "add 1 more photo". The score is right to ignore pending rows; the copy is
//       not. Same finding, one element up, cured where it actually lands on the vendor.
//   (c) THE HALF-SET RATE. min without max is correctly unmet (requestDiscover requires
//       both bounds) but "Set your starting rate" to someone who set one reads as a lost
//       save. The term is unchanged; only the sentence learns to say which half.
const plural = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`;

const HINT_COPY: Record<Term, (g: Gaps[Term]) => string> = {
  photos: (g) => {
    const short = Math.max(0, (g.need ?? 0) - (g.have ?? 0));
    const pending = g.pending ?? 0;
    if (pending >= short) return `${plural(pending, 'photo', 'photos')} awaiting review`;
    if (pending > 0) return `Add ${plural(short - pending, 'more photo', 'more photos')} — ${pending} awaiting review`;
    return `Add ${plural(short, 'more photo', 'more photos')}`;
  },
  about:  () => 'Write your About',
  tags:   (g) => `Add ${plural(Math.max(0, (g.need ?? 0) - (g.have ?? 0)), 'more tag', 'more aesthetic tags')}`,
  hero:   () => 'Choose a hero image',
  ig:     () => 'Add your Instagram handle',
  travel: () => 'State your travel policy',
  // F4 — the "top of your rate range" hint retires with the bound. There is no partial
  // rate state any more: a starting price is set or it is not.
  rate:   () => 'Set your starting rate',
};

function topHints(g: Gaps, limit = 3) {
  return SECTION_ORDER
    .filter((k) => !g[k].met)
    .map((k) => ({ term: k, value: W[k] * g[k].gap }))
    .sort((a, b) => (b.value - a.value) || (SECTION_ORDER.indexOf(a.term) - SECTION_ORDER.indexOf(b.term)))
    .slice(0, limit);
}

export default function DiscoverProfilePage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <ProfileScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function ProfileScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const { current, loading, error, update, isDirty, markSaved } = useSettings();
  const me = useVendorMe(); // category only — a locked field, never edited here
  const { toast, show } = useToast();
  const [saving, setSaving] = useState<string | null>(null);
  const [approved, setApproved] = useState(0);
  const [total, setTotal] = useState(0);
  const [pending, setPending] = useState(0);
  const [hasHero, setHasHero] = useState(false);
  const [serverFloor, setServerFloor] = useState<number | undefined>(undefined);

  useEffect(() => {
    let active = true;
    fetchDiscoverStatus().then((res) => {
      if (!active || !res.ok) return;
      setTotal(res.portfolio_summary?.total ?? 0);
      setApproved(res.portfolio_summary?.approved ?? 0);
      setPending(res.portfolio_summary?.pending ?? 0);
      setServerFloor(res.min_portfolio_images);
    }).catch(() => { /* the meter degrades to zeros; it never blocks the editor */ });
    fetchPortfolio(vendorId, 'approved').then((res) => {
      if (!active || !res.ok) return;
      setHasHero((res.images as PortfolioImage[]).some((i) => i.is_hero));
    }).catch(() => { /* same */ });
    return () => { active = false; };
  }, [vendorId]);

  async function save(section: string, fields: (keyof typeof current)[], patch: Record<string, unknown>) {
    setSaving(section);
    try {
      const res = await updateMe(patch);
      // markSaved takes the VALUES that are now stored, not the field names — so a
      // second Save on an untouched section is correctly inert (isDirty compares
      // current against saved). Built from `current` because that is what was sent.
      if (res.ok) {
        const saved: Record<string, unknown> = {};
        for (const f of fields) saved[f as string] = current[f];
        markSaved(saved as Partial<typeof current>);
        show('Saved.', 'success');
      }
      else show('Could not save. Try again.', 'error');
    } catch { show('Network error.', 'error'); }
    setSaving(null);
  }

  if (loading) return <div style={{ flex: 1 }} aria-busy="true" />;
  if (error)   return <div style={{ flex: 1, padding: 24, fontFamily: F.body, color: A.inkMute }}>{error}</div>;

  const floor = photoFloor(serverFloor);
  const tags = current.aesthetic_tags.split(',').map((t) => t.trim()).filter(Boolean);
  const gaps = buildGaps({
    approved, pending, floor, hasHero, about: current.about, tags,
    travelNotes: current.travel_notes, rateMin: current.rate_min,
    ig: current.instagram_handle,
  });
  const score = scoreOf(gaps);
  const hints = topHints(gaps);
  const rateShown = current.rate_min !== '' ? formatRs(Number(current.rate_min)) : null;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Header vendorName={vendorName} />
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 120px' }}>

        <button type="button" onClick={() => router.push('/vendor/discover')} style={{
          background: 'none', border: 'none', padding: '14px 0', cursor: 'pointer',
          fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em',
          textTransform: 'uppercase', color: A.brassWarm,
        }}>‹ Discover</button>

        {/* ── THE METER — this screen's ONE gold ──────────────────────────── */}
        <Meter score={score} />
        {/* ── TDW_07 P4b · F5 — "SEE YOUR PROFILE AS COUPLES DO" ─────────────────
            Copy ①, founder-vetoed, byte-exact. Sited directly under the meter because
            the meter states a NUMBER and this states what the number is about — the
            vendor reads "72%" and the very next thing he can do is look at the thing
            being scored. Reachable at every state incl. pre-approval, deliberately:
            F5 calls the pre-approval preview "the strongest self-serve motivation to
            hit the 6-photo floor", and a button that hid until approval would withhold
            the motivation from exactly the vendors who need it.

            NOT this screen's gold — the meter owns that (house law: one gold per
            screen). A quiet bordered control, the same register as Save. */}
        <button type="button" onClick={() => router.push('/vendor/discover/preview')} style={{
          display: 'block', width: '100%', margin: '18px 0 0', padding: '13px 0',
          background: 'none', border: `0.5px solid ${A.brassWarm}`, borderRadius: 2,
          cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.32em', textTransform: 'uppercase', color: A.brassWarm,
        }}>
          See your profile as couples do
        </button>


        {hints.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '18px 0 26px' }}>
            {hints.map((h) => (
              <div key={h.term} style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 16, lineHeight: 1.5, color: A.inkSoft, letterSpacing: '0.01em',
              }}>· {HINT_COPY[h.term](gaps[h.term])}</div>
            ))}
          </div>
        )}

        {/* ── PHOTOS: P3's slot. This screen states the truth and links out. ── */}
        <SCard title="Portfolio">
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft }}>
            {/* FOUNDER-VETOED 2026-07-29 (copy slot 3, 「 go 」). BOTH numbers, one line —
                F-07.4's two readings can never contradict each other on a screen that
                shows them together. The gate counts uploaded; the feed shows approved. */}
            {floor} photos required for Discover — you have {total} uploaded, {approved} approved. Couples see the approved ones.
          </div>
          <button type="button" onClick={() => router.push('/vendor/portfolio')} style={{
            alignSelf: 'flex-start', background: 'none', padding: '6px 0', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.36em',
            textTransform: 'uppercase', color: A.brassWarm,
          }}>Manage photos ›</button>
        </SCard>

        <SCard title="About">
          <SField label="About" value={current.about} onChange={(v) => update({ about: v })} multiline
                  placeholder="What a couple should know about your work." />
          <SaveBtn dirty={isDirty(['about'])} loading={saving === 'about'}
                   onSave={() => save('about', ['about'], { about: current.about || undefined })} />
        </SCard>

        <SCard title="Business name">
          <SField label="Business name" value={current.business_name} onChange={(v) => update({ business_name: v })} />
          {/* FOUNDER-VETOED 2026-07-29 (copy slot 6, 「 go 」). business_name is the one
              field the ruling sent here despite a second consumer — the card headline AND
              the invoice letterhead. The vendor is told, rather than surprised. */}
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
            This is the name couples see and the name on your invoices.
          </div>
          <SField label="City" value={current.city} onChange={(v) => update({ city: v })} />
          <SaveBtn dirty={isDirty(['business_name', 'city'])} loading={saving === 'business'}
                   onSave={() => save('business', ['business_name', 'city'], {
                     business_name: current.business_name || undefined,
                     city: current.city || undefined,
                   })} />
        </SCard>

        {/* ── TDW_09 PHASE B · F-7 (ruled) — CHIPS + ONE CUSTOM INPUT ────────────
            The free-text comma field this card carried was the SECOND free-text
            tag editor (the wizard held the first) and the F-10.52 mismatch's
            other half: whatever a vendor typed here, in any case, was stored
            verbatim and matched nothing. Now: the category's FOUNDER-VETOED
            vocabulary renders as chips; ONE custom input adds her own words —
            stored, displayed, normalised, NOT filterable in v1 — under the
            vetoed honesty byte. `other` (and no-category) is honestly
            chips-free: custom entry is the whole editor there. */}
        <SCard title="Aesthetic tags">
          <TagEditor
            category={me?.category ?? null}
            value={current.aesthetic_tags}
            onChange={(v) => update({ aesthetic_tags: v })}
          />
          <SaveBtn dirty={isDirty(['aesthetic_tags'])} loading={saving === 'tags'}
                   onSave={() => save('tags', ['aesthetic_tags'], {
                     aesthetic_tags: normalizeTags(current.aesthetic_tags.split(',')),
                   })} />
        </SCard>

        <SCard title="Travel policy">
          <SToggle label="Open to travel" value={current.open_to_travel}
                   onChange={(v) => update({ open_to_travel: v })} />
          <SField label="Travel notes" value={current.travel_notes}
                  onChange={(v) => update({ travel_notes: v })} multiline
                  placeholder="Where you work, and how travel is billed." />
          <SaveBtn dirty={isDirty(['open_to_travel', 'travel_notes'])} loading={saving === 'travel'}
                   onSave={() => save('travel', ['open_to_travel', 'travel_notes'], {
                     open_to_travel: current.open_to_travel,
                     travel_notes: current.travel_notes || undefined,
                   })} />
        </SCard>

        <SCard title="Starting rate">
          {/* TDW_07 P4b · F4 (WIDENED) — THE MAX FIELD IS REMOVED-BY-RULING, AND LEAVING IT
              WOULD HAVE BEEN WORSE THAN REMOVING IT. `rate_max` is now dormant in the
              server's PATCH allowlist, so a Max input left standing here would accept the
              vendor's typing, show a dirty Save, report success, and silently discard the
              value. That is F-07.13's dead-control class with a write path attached — the
              most expensive shape of this defect, because the vendor believes he answered.
              Control inventory (CE-115): REMOVED-BY-RULING, the only control this surface
              loses. Min, the toggle, the couples-see line and Save are all KEPT. */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <SField label="Min (Rs)" value={current.rate_min} onChange={(v) => update({ rate_min: v })} inputMode="numeric" />
            </div>
          </div>
          <SToggle label="Show starting price on Discover"
                   value={current.rate_display} onChange={(v) => update({ rate_display: v })} />
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
            {/* The register law (tokens.ts:41): always "Rs", never the glyph, never k/L/Cr.
                formatRs is the on-register donor; lib/vendor/cabinet.ts's short form is not. */}
            {current.rate_display
              ? (rateShown ? `Couples see: from ${rateShown}` : 'Couples see your starting price once you set one.')
              : 'Your starting price is hidden from Discover.'}
          </div>
          <SaveBtn dirty={isDirty(['rate_min', 'rate_display'])} loading={saving === 'rates'}
                   onSave={() => save('rates', ['rate_min', 'rate_display'], {
                     rate_min: current.rate_min ? Number(current.rate_min) : undefined,
                     rate_display: current.rate_display,
                   })} />
        </SCard>

        <SCard title="Instagram">
          <SField label="Instagram handle" value={current.instagram_handle}
                  onChange={(v) => update({ instagram_handle: v })} placeholder="@yourhandle" />
          <SaveBtn dirty={isDirty(['instagram_handle'])} loading={saving === 'ig'}
                   onSave={() => save('ig', ['instagram_handle'], {
                     instagram_handle: current.instagram_handle || undefined,
                   })} />
        </SCard>

        <SCard title="Pause profile">
          <SToggle label="Pause my Discover profile" value={current.discover_paused}
                   onChange={(v) => update({ discover_paused: v })} />
          {/* FOUNDER-VETOED 2026-07-29 (copy slot 1, 「 go 」). Shown ALWAYS, not only while
              paused: consequences a vendor reads before acting are the point. This switch
              retires the founder-run UPDATE that P1's smoke card step ⑤ required. */}
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkSoft }}>
            Hidden from Discover. Your approval stays. Enquiries already in flight still reach you.
          </div>
          <SaveBtn dirty={isDirty(['discover_paused'])} loading={saving === 'pause'}
                   onSave={() => save('pause', ['discover_paused'], { discover_paused: current.discover_paused })} />
        </SCard>

      </div>
      <Toast toast={toast} />
    </div>
  );
}

// ── TDW_09 PHASE B · F-7 — the shared-shape tag editor (chips + one custom) ──
// Value stays the settings-state comma-joined STRING (the wire's own shape);
// this component derives the array view and writes the string back, so
// isDirty/markSaved keep working on the field they always compared.
function TagEditor({ category, value, onChange }: {
  category: string | null; value: string; onChange: (v: string) => void;
}) {
  const [custom, setCustom] = useState('');
  const vocab = vocabularyFor(category);
  const selected = value.split(',').map((t) => t.trim()).filter(Boolean);
  const has = (t: string) => selected.some((x) => x.toLowerCase() === t.toLowerCase());
  const write = (arr: string[]) => onChange(arr.join(', '));
  const toggle = (t: string) => write(has(t) ? selected.filter((x) => x.toLowerCase() !== t.toLowerCase()) : [...selected, t]);
  const addCustom = () => {
    const n = custom.trim();
    if (!n || has(n)) { setCustom(''); return; }
    write([...selected, n]); setCustom('');
  };
  const customs = selected.filter((t) => !isVocabularyTag(t, category));
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {vocab && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {vocab.map((tag) => {
            const on = has(tag);
            return (
              <button key={tag} type="button" onClick={() => toggle(tag)} style={{
                padding: '7px 14px', borderRadius: 2, cursor: 'pointer',
                background: on ? 'rgba(201,168,76,0.18)' : 'transparent',
                border: `0.5px solid ${on ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
                fontFamily: F.label, fontWeight: 300, fontSize: 9,
                color: on ? 'var(--atelier-label)' : A.inkMute,
                letterSpacing: '0.28em', textTransform: 'uppercase',
              }}>{tag}</button>
            );
          })}
        </div>
      )}
      {customs.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {customs.map((tag) => (
            <button key={tag} type="button" onClick={() => toggle(tag)} title="Remove"
              style={{
                padding: '7px 14px', borderRadius: 2, cursor: 'pointer',
                background: 'transparent',
                border: '0.5px dashed rgba(201,168,76,0.4)',
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1,
                color: A.ink,
              }}>{tag} ×</button>
          ))}
        </div>
      )}
      <div style={{ display: 'flex', gap: 8 }}>
        <input value={custom} onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom(); } }}
          placeholder="Add your own word"
          style={{ flex: 1, padding: '10px 12px', boxSizing: 'border-box',
            background: 'var(--atelier-input-bg)', border: '0.5px solid rgba(201,168,76,0.28)',
            borderRadius: 2, fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5,
            color: A.ink, outline: 'none', caretColor: 'var(--atelier-accent-text)' }} />
        <button type="button" onClick={addCustom} style={{
          padding: '10px 16px', borderRadius: 2, cursor: 'pointer',
          background: 'transparent', border: '0.5px solid var(--atelier-label)',
          fontFamily: F.label, fontWeight: 400, fontSize: 9, letterSpacing: '0.32em',
          textTransform: 'uppercase', color: 'var(--atelier-label)' }}>Add</button>
      </div>
      {/* FOUNDER-VETOED (relay #2 slate + RIDER4 §5): the custom-tag honesty byte. */}
      <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>
        Your own words are shown on your profile, but couples can&rsquo;t filter by them yet.
      </div>
    </div>
  );
}


