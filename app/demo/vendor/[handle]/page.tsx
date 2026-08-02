'use client';
export const dynamic = 'force-dynamic';

// app/demo/vendor/[handle]/page.tsx
// TDW_08 · P3 — THE SEEING SURFACE. Spec §P3, three movements: the mirror · the tease ·
// the claim CTA, with the demoted CRM rooms as tour chips below the fold (G-5, founder
// ruling Q1 「 Demote 」 — deletion refused).
//
// ── WHAT THIS REPLACED, AND WHAT WENT WITH IT (CE-115 CONTROL INVENTORY) ─────────────
// The surface before this was a ONE-SCREEN, NON-SCROLLABLE entry card: `position:fixed`
// + `overflow:hidden`, a collapsed bottom strip you tapped to expand. Both of those
// bytes had to go — three movements cannot live on a screen that cannot scroll.
//   (i)   the entry-strip tap-to-enter        REMOVED BY RULING — a scrolling page has
//                                             no collapsed strip to expand. It was NOT a
//                                             full-screen target: the photo layers carry
//                                             pointerEvents:'none' and the handler sat on
//                                             the bottom strip's inner div.
//   (ii)  Enter Your Studio (was the gold)    MOVED + DEMOTED to the heavier ghost
//                                             (FORK A(a)); /studio is the tour's ENTRY,
//                                             not a room, so it is NOT one of the chips
//   (iii) Explore Discover (ghost)            KEPT, the lighter ghost, target unchanged
//   (iv)  Claim Your Studio (faint link)      MOVED — it is now the page's ONE GOLD
//   (v)   DemoClaimSheet                      KEPT byte-untouched
//   (vi)  the `?claim=1` consumer             KEPT (CE-118 ruling C1 — a public URL is a
//                                             contract). See its own note below.
//   the open beacon                           KEPT, once per mount, ref-guarded
//   the carousel auto-advance (2.5s)          KEPT
//   the loading + not-found states            KEPT byte-identical
//
// TWO GHOSTS MUST NOT READ AS EQUAL WEIGHT. The hierarchy is carried by size and opacity,
// never by a second gold: claim = gold fill · Enter Your Studio = 44px, brighter border,
// brighter label · Explore Discover = 40px, its original dimmer border and label.
//
// ── ONE GOLD PER SCREEN ──────────────────────────────────────────────────────────────
// The claim CTA owns it (spec §P3.3). The chip strip and the tease introduce ZERO new
// gold. The landing's pre-existing gold ACCENTS (wordmark rule, carousel dot, the ◆
// hairline) are untouched and are a filed, pre-existing drift against the house law's
// max-3× — NOT P3's to cure, and deliberately not smuggled into this sitting.
//
// ── G-6, CONSTITUTIONALLY ────────────────────────────────────────────────────────────
// NO localStorage, NO sessionStorage, NO storage of any kind, anywhere on this path.
// The May-29 zero-localStorage demo resolution and G-6 both forbid it. A beacon and a
// tease are exactly the sort of things that tempt a "have we already…?" cache.

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useParams, useRouter } from 'next/navigation';
import { fetchDemoVendor, fetchDemoLeads, pingDemoOpened } from '@/lib/demo/api';
import type { DemoVendor, DemoPhoto, DemoLead } from '@/lib/demo/api';
import type { DiscoverVendor } from '@/lib/types/discover';
import { DemoClaimSheet } from '@/components/demo/DemoClaimSheet';
import VendorProfileView from '@/components/shared/VendorProfileView';
import { formatRs } from '@/lib/vendor/format';

const EASE = 'cubic-bezier(0.22,1,0.36,1)';
// F-07.60: API_BASE left with the claim POST when handleClaim moved into
// components/demo/DemoClaimSheet.tsx. This file makes no direct fetch — its vendor
// read goes through lib/demo/api, which carries its own copy of the constant.

// Exact font stack from real app
const F = {
  display: "'Italiana', 'GFS Didot', Georgia, serif",
  script:  "'Cormorant Garamond', Georgia, serif",
  body:    "'DM Sans', system-ui, sans-serif",
  label:   "'Jost', system-ui, sans-serif",
};

// ── THE EIGHT CHIPS (founder-vetoed labels, frozen bytes) ───────────────────────────
// `Back to Studio` was REMOVED BY RULING. The seven unlabelled routes get no chip:
// calendar · collab · discover/leads · list/[slice] · studio/tasks · studio/team ·
// studio/team-payments. DEMOTION CHANGES PROMINENCE, NOT REACHABILITY — every one of
// those is still reached from the rooms these chips open, and
// `scripts/tdw08_p3_landing.proof.mjs` asserts all eighteen sub-routes stay reachable so
// this strip cannot silently orphan anything (the ORPHAN-LIMB LAW, applied forward).
const CHIPS: Array<{ label: string; path: string }> = [
  { label: 'Discover Status', path: '/discover'  },
  { label: 'Portfolio',       path: '/portfolio' },
  { label: 'Couture',         path: '/couture'   },
  { label: 'Featured',        path: '/featured'  },
  { label: 'Team Hub',        path: '/business'  },
  { label: 'TDS',             path: '/tds'       },
  { label: 'Contracts',       path: '/contracts' },
  { label: 'Settings',        path: '/settings'  },
];

export default function DemoLandingPage() {
  const params = useParams();
  const handle = typeof params.handle === 'string' ? params.handle : '';
  const router = useRouter();

  const [vendor,   setVendor]   = useState<DemoVendor | null>(null);
  const [card,     setCard]     = useState<DiscoverVendor | null>(null);
  const [leads,    setLeads]    = useState<DemoLead[] | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [cur,      setCur]      = useState(0);
  const [reveal,   setReveal]   = useState(false);
  const [toast,    setToast]    = useState<string | null>(null);

  // Claim flow — F-07.60: the sheet, its phone/sending/error/done state and its
  // submit hand now live in components/demo/DemoClaimSheet.tsx, shared with the
  // header so that EVERY demo surface opens the same sheet in place. This page keeps
  // only the question it is entitled to answer: is the sheet open on THIS surface.
  const [claimOpen, setClaimOpen] = useState(false);

  const searchParams = useSearchParams();

  // ── F-07.60 · THIS CONSUMER IS PRESERVED BY RULING (CE fork C1) ─────────────
  // The line below still says "from header dropdown". As of the F-07.60 sitting that is
  // history, not description: the header no longer pushes `?claim=1` — it opens the
  // shared sheet in place — and an unrestricted grep of BOTH repos found the header to
  // have been the query string's ONLY producer anywhere. The WhatsApp alert's {{3}}
  // lands on the BARE landing (dream-os demoLeadAlert.js:55/:95).
  //
  // The block is kept by ruling: a public URL is a contract, bookmarks and pasted links
  // outlive the button that minted them.
  //
  // TDW_08 P3 — WHAT CHANGED AND WHY, so this is not read as a broken preservation.
  // The original block also called `setEntered(true)`, to expand the collapsed strip
  // before opening the sheet. THE COLLAPSED STRIP NO LONGER EXISTS: a scrolling page has
  // no expand state. The half that carried the CONTRACT — open the claim sheet on a
  // `?claim=1` arrival — is preserved exactly. Deleting a dead setState is not the same
  // as touching the contract, and saying so here is cheaper than a future reader finding
  // the diff and mistrusting the ruling.
  // Auto-open claim sheet if ?claim=1 (from header dropdown)
  useEffect(() => {
    if (searchParams?.get('claim') === '1') {
      setClaimOpen(true);
    }
  }, [searchParams]);

  // ── TDW_08 P1 · G-1 · THE OPEN BEACON ──────────────────────────────────────
  // Fires ONCE per mount. The ref guard is not decoration: React StrictMode runs
  // effects twice in development, and without it the dev tree would double-fire.
  // The server is idempotent on `opened_at` regardless, so a double fire is
  // harmless — this guard keeps the CLIENT honest rather than relying on that.
  //
  // NO localStorage, NO sessionStorage, NO storage of any kind. G-6 and the
  // May-29 zero-localStorage demo-path resolution both forbid it, and a beacon
  // is exactly the sort of thing that tempts a "have we already pinged?" cache.
  const beaconFired = useRef(false);
  useEffect(() => {
    if (!handle || beaconFired.current) return;
    beaconFired.current = true;
    void pingDemoOpened(handle);
  }, [handle]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const photosRef   = useRef<string[]>([]);

  useEffect(() => {
    if (!handle) return;
    fetchDemoVendor(handle)
      .then(res => {
        setVendor(res.vendor);
        setCard(res.card);
        const urls = (res.vendor.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];
        photosRef.current = urls;
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [handle]);

  // ── THE TEASE'S READ — SEPARATE, AND FAILING SILENT ─────────────────────────
  // The mirror must render even if the lead route is down. A landing that shows nothing
  // because a TEASE could not load is a worse failure than a landing with no tease, so a
  // failed read resolves to zero leads and the movement collapses — the same shape as
  // genuinely having none.
  //
  // ACCEPTANCE §5 IS SATISFIED AT THE SERVER, NOT HERE. `MASKED_SELECT` excludes
  // `bride_phone` / `bride_email` / `bride_ig_handle`, so the contact never leaves the
  // database. The shimmer below stands over data that is genuinely absent from this
  // payload — it is not CSS hiding a value that view-source would reveal.
  useEffect(() => {
    if (!handle) return;
    fetchDemoLeads(handle)
      .then(res => setLeads(res.leads || []))
      .catch(() => setLeads([]));
  }, [handle]);

  const startCarousel = useCallback(() => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(() => {
      setCur(c => (c + 1) % Math.max(photosRef.current.length, 1));
    }, 2500);
  }, []);

  useEffect(() => {
    if (!loading && vendor) {
      startCarousel();
      const t = setTimeout(() => setReveal(true), 80);
      return () => clearTimeout(t);
    }
  }, [loading, vendor, startCarousel]);

  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // The toast is CHROME and lives at the mount — the same seam law `onCircleTap`
  // established. The component decides WHAT to say (vetoed copy travels with the control
  // it explains); this page decides WHERE it appears. The dwell is long enough to READ:
  // F-07.70 ratified that a toast destroyed in its own paint tick means an approved byte
  // was never readable on screen.
  const raiseToast = useCallback((line: string) => {
    setToast(line);
    setTimeout(() => setToast(null), 2600);
  }, []);

  // F-07.60: `handleClaim` — the POST to /api/v2/demo/vendor/:handle/claim, with
  // F-07.37's res.ok check intact — moved WHOLE into DemoClaimSheet. The pipe, its
  // copy and its cure travelled together on purpose: an extraction that leaves a
  // cured finding behind on the old surface is how cures die quietly.

  const photos = (vendor?.photos ?? []).map((p: DemoPhoto) => p.url).filter(Boolean) as string[];
  const hasPhotos = photos.length > 0;

  if (loading) return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ fontFamily:F.script, fontStyle:'italic', fontSize:18, color:'rgba(240,230,210,0.35)' }}>One moment…</div>
    </div>
  );

  if (!vendor) return (
    <div style={{ position:'fixed', inset:0, background:'#0C0A09', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:12 }}>
      <div style={{ fontFamily:F.display, fontSize:28, color:'rgba(240,230,210,0.9)' }}>Profile not found.</div>
      <div style={{ fontFamily:F.script, fontStyle:'italic', fontSize:16, color:'rgba(240,230,210,0.4)' }}>This demo link may have expired.</div>
    </div>
  );

  const vendorDisplayName = vendor.display_name || handle;
  const waiting = leads?.length ?? 0;

  return (
    <div style={{ minHeight:'100dvh', background:'#0C0A09', paddingBottom:'calc(env(safe-area-inset-bottom, 16px) + 96px)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300&family=DM+Sans:wght@300;400&family=Italiana&family=Jost:wght@200;300;400&display=swap');
        @keyframes fadeUp { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes shimmer { 0%{background-position:-180px 0} 100%{background-position:180px 0} }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
        input::placeholder { color: rgba(240,230,210,0.3); }
      `}</style>

      {/* ═══ MOVEMENT ONE · THE MIRROR ═══════════════════════════════════════ */}
      <div style={{ position:'relative', height:'62vh', minHeight:340, overflow:'hidden' }}>
        {hasPhotos ? photos.map((url, i) => (
          <div key={i} style={{ position:'absolute', inset:0, backgroundImage:`url(${url})`, backgroundSize:'cover', backgroundPosition:'center top', opacity: reveal ? (i === cur ? 1 : 0) : 0, transition:`opacity ${i === cur ? '1.8s' : '1.2s'} ${EASE}`, willChange:'opacity', zIndex:1, pointerEvents:'none' }} />
        )) : (
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse at 30% 40%, rgba(201,168,76,0.08) 0%, transparent 70%)', zIndex:1, pointerEvents:'none' }} />
        )}

        {/* Radial vignette — exact match to real app */}
        <div style={{ position:'absolute', inset:0, zIndex:2, pointerEvents:'none', background:'radial-gradient(ellipse at 50% 60%, transparent 20%, rgba(0,0,0,0.55) 100%)' }} />

        {/* Bottom gradient */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:'52%', zIndex:3, pointerEvents:'none', background:'linear-gradient(to top, rgba(12,10,9,0.98) 0%, rgba(12,10,9,0.45) 55%, transparent 100%)' }} />

        {/* TDW wordmark — exact from real landing */}
        <div style={{ position:'absolute', top:'calc(env(safe-area-inset-top, 0px) + 22px)', left:22, zIndex:10, opacity: reveal ? 1 : 0, transition:`opacity 1.2s ${EASE} 0.3s` }}>
          <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:16, color:'rgba(248,247,245,0.72)', letterSpacing:'0.02em', lineHeight:1 }}>The Dream Wedding</div>
          <div style={{ fontFamily:F.label, fontWeight:200, fontSize:6, letterSpacing:'0.38em', textTransform:'uppercase', color:'#C9A84C', marginTop:5 }}>India&apos;s First Wedding OS</div>
        </div>

        {/* Slide dots */}
        {hasPhotos && photos.length > 1 && (
          <div style={{ position:'absolute', top:'calc(env(safe-area-inset-top, 0px) + 28px)', left:'50%', transform:'translateX(-50%)', display:'flex', gap:5, zIndex:10, opacity: reveal ? 1 : 0, transition:`opacity 1s ${EASE} 0.6s` }}>
            {photos.map((_, i) => (
              <div key={i} style={{ width: i === cur ? 18 : 4, height:4, borderRadius:2, background: i === cur ? '#C9A84C' : 'rgba(255,255,255,0.22)', transition:`width 400ms ${EASE}, background 400ms ${EASE}` }} />
            ))}
          </div>
        )}

        {/* His name, over his own work */}
        <div style={{ position:'absolute', bottom:20, left:24, right:24, zIndex:10, opacity: reveal ? 1 : 0, transition:`opacity 1.4s ${EASE} 0.5s` }}>
          <div style={{ fontFamily:F.display, fontWeight:400, fontSize:34, color:'rgba(248,247,245,0.96)', lineHeight:1.1, letterSpacing:'0.02em' }}>
            {vendorDisplayName}
          </div>
        </div>
      </div>

      {/* THE EYEBROW — founder-vetoed, byte-frozen. It is the sentence this whole
          movement is accountable to: what follows must BE the couple's own view, which
          is why the card below is rendered by the couple's own renderer over the couple's
          own shape, from the couple feed's own server function. */}
      <div style={{ padding:'22px 24px 0' }}>
        <p style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:16, color:'rgba(248,247,245,0.62)', margin:0, lineHeight:1.5, letterSpacing:'0.01em' }}>
          This is how couples see you. You&apos;re live in Discover now.
        </p>
        <div style={{ display:'flex', alignItems:'center', gap:12, margin:'16px 0 18px' }}>
          <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to right, rgba(201,168,76,0.6), rgba(201,168,76,0.12))' }} />
          <span style={{ fontFamily:F.display, fontSize:10, color:'#C9A84C', letterSpacing:'0.3em', lineHeight:1 }}>◆</span>
          <div style={{ flex:1, height:'0.5px', background:'linear-gradient(to left, rgba(201,168,76,0.6), rgba(201,168,76,0.12))' }} />
        </div>
      </div>

      {/* ── THE ONE RENDERER ────────────────────────────────────────────────────
          `mode='preview'` — NOT a third mode. `mode` has exactly two consumers in the
          component and BOTH are branch-only; it changes what the outward ACTIONS DO and
          nothing about what renders. A 'demo' value would buy two branches and nothing on
          screen, and would re-aim two sealed benches for no gain.

          `onPreviewToast` IS SUPPLIED, and that is the RULING rather than a courtesy:
          without it an Enquire or Circle tap dies silently, which is the dead-control
          class this block deleted the CommandBar for. Both lines are founder-approved and
          both are TRUE on a demo card — couples really do tap those to message him and to
          save him.

          `onEnquire`, `enquireLink` and `onCircleTap` are WITHHELD. And the server agrees
          BY CONSTRUCTION, not by this mount remembering: `shapeDemoRow` nulls
          `routing_handle` and `enquire_link` TOGETHER (F-07.54), so the shaper cannot hand
          this card a live enquire target even if this line were deleted.

          LOCK DATE is byte-untouched and still disabled — disabled is not absent, and the
          vendor's mirror must show the couple's true screen. CIRCLE renders live-looking
          and explains on tap; its handler is unreachable from here by construction. */}
      {card && (
        <VendorProfileView
          vendor={card}
          mode="preview"
          isBlind={false}
          onPreviewToast={raiseToast}
        />
      )}

      {/* ═══ MOVEMENT TWO · THE TEASE (G-4, as amended by its author) ═════════
          「 budget should be visible. contact blurred 」 — Dev, 2026-08-03.
          G-4's FUNCTIONS clause is STRUCK: `demo_leads` has no function/event-type column
          and none was asked for (F-08.31).

          THE THREE NULLS, ONE RULE: budget null ⇒ omit · month null ⇒ omit · city null ⇒
          omit. Never a blank slot, never a dash, never a shimmer over nothing. On the
          walked account EIGHT of NINE leads carry no wedding date, so the month rule is
          the MAJORITY case and not an edge.

          ZERO LEADS ⇒ THE MOVEMENT COLLAPSES ENTIRELY — founder-ruled 「 collapses 」. No
          gap, no announcement, and no impressions line: nothing tracks impressions on this
          lane, and the spec's own clause says omit rather than invent. THREE OF FIVE live
          demo cards are in exactly this state today, so the collapse is the modal
          experience and not the fallback. */}
      {waiting > 0 && (
        <div style={{ padding:'28px 24px 0' }}>
          <p style={{ fontFamily:F.label, fontWeight:300, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(248,247,245,0.5)', margin:'0 0 14px' }}>
            {waiting === 1 ? '1 couple is waiting' : `${waiting} couples are waiting`}
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
            {(leads ?? []).map((lead, i) => {
              // Built as a LIST so an absent fact is absent, never an empty segment between
              // two separators. The omission rule as a data structure rather than as a
              // string of conditionals.
              const facts: string[] = [];
              if (lead.wedding_when) facts.push(lead.wedding_when);
              if (lead.wedding_city) facts.push(lead.wedding_city);
              return (
                <div key={lead.id} style={{ background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.10)', borderRadius:12, padding:'14px 16px', animation:`fadeUp 500ms ${EASE} ${120 + i * 60}ms both` }}>
                  <div style={{ fontFamily:F.display, fontWeight:400, fontSize:19, color:'rgba(248,247,245,0.92)', lineHeight:1.15 }}>
                    {lead.bride_name}
                  </div>
                  {facts.length > 0 && (
                    <div style={{ fontFamily:F.script, fontStyle:'italic', fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.55)', marginTop:3 }}>
                      {facts.join(' · ')}
                    </div>
                  )}
                  {/* THE BUDGET — visible by the founder's amendment, rendered through
                      `formatRs`, the estate's ONE money donor: Rs X,XX,XXX, never the ₹
                      glyph and never a k/L/Cr form. The label is his byte: the wire carries
                      a band CEILING, so "Budget up to" is the honest word and a bare
                      "Budget" would over-promise a figure she never named. */}
                  {lead.budget_max != null && (
                    <div style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.72)', marginTop:8 }}>
                      Budget up to {formatRs(lead.budget_max)}
                    </div>
                  )}
                  {/* THE CONTACT — blurred, and the blur stands over something that is
                      genuinely NOT IN THIS PAYLOAD. `bride_phone` is excluded from
                      MASKED_SELECT on the server, so it never leaves the database and a
                      view-source finds nothing to reveal. That is acceptance §5 met at the
                      only layer that can meet it. */}
                  <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
                    <div aria-hidden style={{ height:11, width:112, borderRadius:3, background:'linear-gradient(90deg, rgba(201,168,76,0.10) 0%, rgba(201,168,76,0.26) 50%, rgba(201,168,76,0.10) 100%)', backgroundSize:'360px 100%', animation:'shimmer 2.6s linear infinite' }} />
                    <span style={{ fontFamily:F.label, fontWeight:300, fontSize:8, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.32)' }}>
                      Contact
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ BELOW THE FOLD · THE DEMOTED ROOMS AS TOUR CHIPS (G-5, Q1) ══════ */}
      <div style={{ padding:'32px 24px 0' }}>
        <p style={{ fontFamily:F.label, fontWeight:300, fontSize:9, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(248,247,245,0.5)', margin:'0 0 14px' }}>
          Explore your studio
        </p>

        {/* Enter Your Studio — DEMOTED to the heavier ghost. It is the tour's ENTRY, not a
            room, which is why it is not one of the eight chips (FORK A(a); A(b) declined —
            burying the entry behind a scroll would demote the tour itself, which is not
            what 「 Demote 」 ruled). */}
        <button
          onClick={() => router.push(`/demo/vendor/${handle}/studio`)}
          style={{ width:'100%', height:44, background:'transparent', border:'0.5px solid rgba(248,247,245,0.42)', borderRadius:100, cursor:'pointer', fontFamily:F.label, fontSize:9, fontWeight:400, letterSpacing:'0.22em', textTransform:'uppercase', color:'rgba(248,247,245,0.88)', WebkitTapHighlightColor:'transparent', marginBottom:10 }}
        >
          Enter Your Studio
        </button>

        {/* Explore Discover — ghost, routes to demodiscover subdomain. Target and copy
            unchanged; it keeps its original dimmer weight so the two ghosts read as a
            hierarchy rather than as a pair. */}
        <button
          onClick={() => { window.location.href = `https://demodiscover.thedreamwedding.in`; }}
          style={{ width:'100%', height:40, background:'transparent', border:'0.5px solid rgba(248,247,245,0.2)', borderRadius:100, cursor:'pointer', fontFamily:F.label, fontSize:8, fontWeight:300, letterSpacing:'0.18em', textTransform:'uppercase', color:'rgba(248,247,245,0.55)', WebkitTapHighlightColor:'transparent' }}
        >
          Explore Discover
        </button>

        <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginTop:16 }}>
          {CHIPS.map(chip => (
            <button
              key={chip.label}
              onClick={() => router.push(`/demo/vendor/${handle}${chip.path}`)}
              style={{ background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.12)', borderRadius:100, padding:'9px 14px', cursor:'pointer', fontFamily:F.label, fontWeight:300, fontSize:8, letterSpacing:'0.16em', textTransform:'uppercase', color:'rgba(248,247,245,0.62)', WebkitTapHighlightColor:'transparent' }}
            >
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ MOVEMENT THREE · THE CLAIM CTA — THE PAGE'S ONE GOLD ════════════ */}
      <div style={{ position:'fixed', bottom:0, left:0, right:0, zIndex:40, padding:'14px 24px calc(env(safe-area-inset-bottom, 12px) + 14px)', background:'linear-gradient(to top, rgba(12,10,9,0.97) 60%, rgba(12,10,9,0))', backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)' }}>
        <button
          onClick={e => { e.stopPropagation(); setClaimOpen(true); }}
          style={{ width:'100%', height:48, background:'#C9A84C', border:'none', borderRadius:100, cursor:'pointer', fontFamily:F.label, fontSize:9, fontWeight:400, letterSpacing:'0.22em', textTransform:'uppercase', color:'#0C0A09', WebkitTapHighlightColor:'transparent' }}
        >
          Claim your studio — 90 seconds
        </button>
      </div>

      {/* The mount's own toast chrome — WHERE the vetoed lines appear. WHAT they say lives
          with the controls they explain, inside VendorProfileView. */}
      {toast && (
        <div style={{ position:'fixed', left:24, right:24, bottom:'calc(env(safe-area-inset-bottom, 12px) + 84px)', zIndex:60, background:'rgba(12,10,9,0.94)', border:'0.5px solid rgba(255,255,255,0.14)', borderRadius:10, padding:'12px 16px', backdropFilter:'blur(20px)', WebkitBackdropFilter:'blur(20px)', animation:`fadeUp 240ms ${EASE} both` }}>
          <span style={{ fontFamily:F.body, fontWeight:300, fontSize:13, color:'rgba(248,247,245,0.86)' }}>{toast}</span>
        </div>
      )}

      {/* Claim sheet — F-07.60: ONE shared component, opened here and by the header. The
          markup that stood here moved to components/demo/DemoClaimSheet.tsx byte for byte,
          copy and geometry and POST alike. Both of this page's own entries into it
          survive: the ?claim=1 deep link above and the gold CTA above. */}
      <DemoClaimSheet
        open={claimOpen}
        onClose={() => setClaimOpen(false)}
        handle={handle}
        vendorName={vendor?.display_name ?? null}
      />
    </div>
  );
}
