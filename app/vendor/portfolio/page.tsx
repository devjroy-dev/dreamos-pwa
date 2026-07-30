'use client';
// app/vendor/portfolio/page.tsx — THE PORTFOLIO MANAGER (TDW_07 P3)
//
// FORK 3(b), CHAIR-RULED: the manager lives HERE, at the surface that already
// exists. Eleven inbound edges (six buttons, the /vendor/more row, the BottomNav
// tab, three active-path checks) keep pointing at the same address and not one of
// them moves. Discover Profile keeps its "Manage photos ›" link. The §C
// singularity principle asks for ONE photo editor, not one address — and this is
// the one. P4's VendorProfileView is untouched by everything below; nothing here
// renders a profile detail.
//
// WHAT SHIPS: the 20-slot grid · pointer drag reorder (Fork 1(a)'s `position`) ·
// the cover star (Fork 2(b) — the server writes position 0 and is_hero in one
// hand, so this screen never writes two things and hopes) · per-photo caption ·
// delete with confirm · honest upload failures with retry · the config-gated IG
// entry (CE §B).
//
// WHAT DOES NOT SHIP, BY RULING: `in_carousel`. F-07.13 — three writers, zero
// filter-readers, an admin toggle labelled "active" that no query consults.
// Surfacing it to vendors would be the same defect at a bigger audience.
//
// HOUSE LAWS: no localStorage anywhere · ONE filled gold (the Upload action) —
// every other control is bordered or ghost · every vendor-facing string below is
// FOUNDER-VETOED 2026-07-29 (copy card A1–H12, 「 1.ok 」) and carries its slot id.
// Numbers inside those strings interpolate the SERVER's cap so no second copy of
// "20" exists — the rendered bytes are identical to the vetoed draft, which is
// P2's own precedent for the photo floor.

import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import {
  fetchPortfolio, fetchUploadUrl, registerPortfolioImage, setHeroImage,
  deletePortfolioImage, updatePortfolioImage, reorderPortfolio, fetchDiscoverStatus,
  fetchIgStatus, fetchIgAuthorizeUrl, fetchIgMedia, importIgPhotos, disconnectIg,
} from '@/lib/vendor/api/vendor';
import type { IgStatus, IgMediaItem } from '@/lib/vendor/api/vendor';
import { imgUrl, lqipUrl } from '@/lib/vendor/img';
import { moveIndex, canMove } from '@/lib/vendor/reorder';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';

// Restored per CE §0.2 ruling (a). These tabs exist on the live surface and a
// rewrite does not get to delete a working control as a side effect of resolving
// an interaction conflict. See the interlock below for how the conflict is
// actually resolved.
const STATE_FILTERS = ['all', 'approved', 'pending', 'rejected'] as const;

const A = {
  ink:       'var(--atelier-ink)',
  inkSoft:   'var(--atelier-ink-soft)',
  inkMute:   'var(--atelier-ink-mute)',
  brass:     'var(--atelier-accent-text)',
  brassWarm: 'var(--atelier-label)',
  red:       '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script:  'var(--font-cormorant), Georgia, serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
  label:   'var(--font-jost), system-ui, sans-serif',
} as const;

// ── THE VETOED COPY, ONE HOME ────────────────────────────────────────────────
// Founder veto executed 2026-07-29 「 1.ok 」, with H3 replaced by his own redraft
// and H8 keeping the live-now clause 「 3. visible 」. Slot ids are load-bearing:
// the next sitting's veto card is written against these, not against the screen.
const COPY = {
  A1: (n: number, max: number) => `${n} of ${max} photos`,
  A2: (max: number) => `You've reached ${max} photos. Remove one to add another.`,
  B1: 'Uploading…',
  // F2-1/2/3 — the batch set. Founder-vetoed byte-exact 2026-07-29 (F-2's cure).
  // Single-file uploads keep B1/B2; these render only for a batch of two or more.
  F2_1: (i: number, n: number) => `Uploading ${i} of ${n}…`,
  F2_2: (n: number) => `${n} photos added — with our team for review.`,
  F2_3: (r: number) => `Room for ${r} more — adding the first ${r}.`,
  B2: 'Photo added — with our team for review',
  B3: "That upload didn't go through. Try again.",
  C1: 'Remove this photo?',
  C2: "It leaves your portfolio and Discover straight away. This can't be undone.",
  C3: 'Remove',
  C4: 'Keep',
  C5: 'Photo removed',
  D1: 'A line about this photo — optional.',
  D2: 'Caption saved',
  E1: 'COVER',
  E2: 'Make this the cover',
  E3: 'Cover photo set',
  E4: 'Your cover is the first photo couples see.',
  F1: 'Awaiting review',
  F3: 'Not approved',
  F4: 'Couples see your approved photos. The rest are with our team.',
  G1: 'Press and drag to reorder. The first photo is your cover.',
  // G3 — the filter/drag interlock line. Founder-vetoed byte-exact 2026-07-29.
  // Rendered ONLY while a non-`all` filter is active; never otherwise.
  G3: 'Switch to All to reorder — filters show only some of your photos.',
  // G4/G5 — Cure B's gestureless reorder. CHAIR-WORDED, FOUNDER VETO OUTSTANDING
  // (the ruling named the bytes; it did not route them through the founder's card).
  // These are the only two vendor-facing strings in this sitting not yet vetoed.
  G4: 'Move up',
  G5: 'Move down',
  G2: 'Order saved',
  // H1/H2/H3/H12 are FOUNDER-VETOED AND PARKED, not rendered this sitting (CE §B).
  // They are kept here so the action sitting inherits an executed veto instead of
  // re-running the founder's copy card. H4-H11 were never drafted into code.
  H1: 'Import from Instagram',
  H2: "Instagram only allows this for professional accounts — business or creator. If yours is personal, switching is free and takes a minute in Instagram's own settings.",
  // H3 — THE LOAD-BEARING ONE. The addendum's law is "MANUAL UPLOAD IS THE
  // PERMANENT FALLBACK, NEVER A WALL". These are the founder's own bytes,
  // chosen over the drafted alternative, and they sit ABOVE the connect action
  // on the screen — position in a paragraph is instruction (TDW_06 doctrine).
  H3: 'Instagram is just the quicker way. Uploading from your phone works exactly the same, always.',
  H4: 'Connect Instagram',
  H12: 'Photos are copied into your portfolio, so they stay put even if your Instagram changes.',

  // ── TDW_07 P4a · THE SECOND COPY CARD — FOUNDER-VETOED 2026-07-30 「 all ok 」
  //
  // HOW THESE SLOTS GOT HERE, recorded because the route matters:
  // The CE addendum stated H5-H11 already carried an executed veto and only the
  // CODE was absent. DERIVED AT THE REPO, THAT WAS NOT SO — the BYTES of H5, H6,
  // H7, H9 and H11 existed nowhere in either repository. Two fragments survived
  // in prose (H8's clause in FINDINGS_LOG:3183, H10 quoted verbatim inside P3's
  // own render-site comment at :540); the rest did not exist at all.
  //
  // They therefore shipped in ZIP 2b as EXECUTOR DRAFTS, marked as such, rather
  // than stamped with an authority they did not have — that would have been the
  // costume class applied to the copy ledger (F-07.21). The founder then ran the
  // card against the rendered strings and returned 「 all ok 」 on 2026-07-30.
  //
  // SO THE VETO IS REAL NOW AND ITS DATE IS 2026-07-30, NOT 2026-07-29. The two
  // cards are kept distinct on purpose: H1/H2/H3/H4/H12 carry the FIRST card
  // 「 1.ok 」, these carry the SECOND. A ledger that collapsed them would lose
  // the fact that these bytes were the executor's proposal before they were the
  // founder's word, and that is exactly the provenance a later sitting needs.
  H5:  'Choose your photos',                                    // VETOED 2026-07-30
  H6:  'Selected {n} of {r}',                                   // VETOED 2026-07-30
  H7:  'Add {n} to my portfolio',                               // VETOED 2026-07-30
  H8:  'Imported photos are live on Discover now.',             // VETOED 2026-07-30 (clause 「 3. visible 」)
  H9:  '{n} added. {f} could not be copied — you can upload those from your phone.', // VETOED 2026-07-30
  H10: "We couldn't reach Instagram just now.",                 // VETOED 2026-07-30
  H11: 'Your Instagram connection has expired. Connect again to import more photos.', // VETOED 2026-07-30
  H13: 'Disconnect Instagram',                                  // VETOED 2026-07-30
  H14: 'Instagram disconnected. Your photos stay where they are.', // VETOED 2026-07-30
  // ── THE THIRD COPY CARD — FOUNDER-VETOED 2026-07-30 「 ok 」 (P4b slice 1) ──
  // H15-H18 were minted AFTER the second card, so they could not inherit it and
  // shipped as marked executor drafts. The fifteenth chair routed them to the
  // founder at P4b's read-first ruling and he returned 「 ok 」 on all four. They
  // are byte-exact as drafted — no wording moved between draft and final, which
  // is stated so a later reader does not go looking for a diff that isn't there.
  //
  // H15/H16 — the media-type badges. The founder found reels and photos
  // indistinguishable in the picker; a vendor cannot choose well from a grid
  // they cannot read.
  H15: 'Reel',                                                  // VETOED 2026-07-30
  H16: 'Album',                                                 // VETOED 2026-07-30
  // H17 — the reel warning. A reel imports as its COVER FRAME, not as video;
  // saying so before the tap is the difference between a choice and a surprise.
  H17: 'Reels come in as their cover photo.',                   // VETOED 2026-07-30
  // H18 — the connected-account line.
  //
  // ┌─ PRESENCE IS MANDATORY. WORDING IS NOT. (CE-ruled, P4b) ────────────────┐
  // │ The App Review submission filed 2026-07-30 states in TWO places that the │
  // │ connected Instagram username is visible to the vendor in this section.   │
  // │ F-07.24 was filed because it was not, and this line is the correction    │
  // │ that made the claim true.                                               │
  // │                                                                         │
  // │ So these BYTES may be re-authored freely — but the LINE may not be       │
  // │ removed, hidden, or made conditional on anything beyond the handle       │
  // │ existing. Deleting it silently re-falsifies a filed claim, and a claim   │
  // │ read against the surface is exactly how F-07.24 was caught in the first  │
  // │ place. The lesson now protects us in the other direction.               │
  // └─────────────────────────────────────────────────────────────────────────┘
  H18: 'Connected as @{handle}',                                // VETOED 2026-07-30
} as const;

// ── TDW_07 P4a · THE PICKER TILE, MEMOISED ──────────────────────────────────
// WHY THIS IS ITS OWN COMPONENT AND NOT AN INLINE MAP BODY:
// The first build rendered 25 tiles inline. Every tap called setIgPicked, which
// produced a new array, which re-rendered the WHOLE grid — twenty-five full
// resolution Instagram CDN images re-evaluated per tap. On a phone that reads as
// "the taps aren't registering", which is exactly what the founder saw. The
// selection was landing; the frame to show it was hundreds of milliseconds late.
//
// React.memo + a STABLE onToggle means one tap re-renders ONE tile. `loading` and
// `decoding` keep the off-screen images off the main thread entirely.
const IgTile = memo(function IgTile({ item, on, dead, onToggle }: {
  item: IgMediaItem; on: boolean; dead: boolean; onToggle: (u: string) => void;
}) {
  // media_type was ALREADY in the payload and ALREADY used to choose a still for
  // videos — it was simply never rendered, so a reel looked identical to a photo.
  // A vendor cannot make a good choice about a portfolio they cannot read.
  const isVideo = item.media_type === 'VIDEO';
  const isAlbum = item.media_type === 'CAROUSEL_ALBUM';
  return (
    <button type="button" disabled={dead} onClick={() => onToggle(item.source_url)}
      style={{
        position: 'relative', aspectRatio: '1', padding: 0, border: 'none',
        borderRadius: 2, overflow: 'hidden', cursor: dead ? 'default' : 'pointer',
        opacity: dead ? 0.3 : 1, background: 'rgba(0,0,0,0.06)',
        // The tap must feel instant even before React repaints the border.
        WebkitTapHighlightColor: 'transparent', transform: on ? 'scale(0.96)' : 'none',
        transition: 'transform 120ms ease',
      }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.source_url} alt="" draggable={false} loading="lazy" decoding="async"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
      {(isVideo || isAlbum) && (
        <span style={{
          position: 'absolute', top: 5, right: 5, padding: '2px 5px', borderRadius: 2,
          background: 'rgba(12,10,9,0.72)', color: '#F8F7F5',
          fontFamily: F.label, fontWeight: 300, fontSize: 7.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', pointerEvents: 'none',
        }}>{isVideo ? COPY.H15 : COPY.H16}</span>
      )}
      {/* THE SELECTED STATE WAS TOO QUIET — a 2px border on a busy photograph is
          invisible, and a vendor who cannot see what they picked cannot trust
          the count. Three signals now, deliberately redundant: a scrim that
          darkens the image, a thick accent frame, and a filled tick. Any one of
          them reads on any photograph. */}
      {on && (
        <>
          <span style={{
            position: 'absolute', inset: 0, background: 'rgba(12,10,9,0.42)',
            pointerEvents: 'none',
          }} />
          <span style={{
            position: 'absolute', inset: 0, border: '3px solid var(--atelier-accent-text)',
            borderRadius: 2, pointerEvents: 'none',
          }} />
          <span style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%,-50%)',
            width: 26, height: 26, borderRadius: '50%',
            background: 'var(--atelier-accent-text)', color: '#F8F7F5',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, lineHeight: 1, pointerEvents: 'none',
          }}>✓</span>
        </>
      )}
    </button>
  );
});

export default function PortfolioPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <ManagerScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function ManagerScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const { toast, show } = useToast();

  const [images, setImages]   = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [sel, setSel]         = useState<PortfolioImage | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress]   = useState<string>(COPY.B1);
  const [maxImages, setMaxImages] = useState<number | null>(null);
  const [dragId, setDragId]   = useState<string | null>(null);
  const [filter, setFilter]   = useState<string>('all');
  // TDW_07 P4a — the IG action's state. `ig` is null until the server answers,
  // and the block renders on nothing until then: an entry that appears and then
  // corrects itself is a flicker the vendor reads as a bug.
  const [ig, setIg]           = useState<IgStatus | null>(null);
  const [igPicker, setIgPicker] = useState(false);
  const [igItems, setIgItems] = useState<IgMediaItem[]>([]);
  const [igPicked, setIgPicked] = useState<string[]>([]);
  const [igBusy, setIgBusy]   = useState<string | null>(null);
  // ── TDW_07 P4b SLICE 1 · F-07.22, CURE (b) — THE PRE-MINTED AUTHORIZE URL ──
  // The connect action is an ANCHOR, so its destination must exist BEFORE the
  // tap. That is the whole cure: see the block comment at igConnectRetry below.
  // `igAuthMintedAt` is the mint's own clock, kept because the server's state
  // carries a 10-minute TTL and a tab left open outlives it.
  const [igAuthUrl, setIgAuthUrl]         = useState<string | null>(null);
  const [igAuthMintedAt, setIgAuthMintedAt] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastCommitted = useRef<string>('');
  // ── F-1's PRESS TIMER (CE-ruled) ──────────────────────────────────────────
  // The drag must NOT arm on contact. Arming immediately meant the browser was
  // still free to treat the press as a long-press on an image, and Chrome's
  // native image menu won the gesture before any handler ran — the reorder was
  // shipped unusable on the only device it was built for. Now: a press must
  // survive ~350ms WITHOUT moving. Move first and the timer is cancelled and the
  // page scrolls exactly as it always did; hold still and the drag arms.
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressAt    = useRef<{ x: number; y: number } | null>(null);
  // A completed drag must not also open the sheet. dragId is already null by the
  // time click fires, so the click needs its own suppression flag.
  const didDrag    = useRef(false);
  // CURE A's mirror: a native listener registered once cannot read React state,
  // so the armed flag lives in a ref the listener can consult on every touchmove.
  const dragIdRef  = useRef<string | null>(null);
  const scrollRef  = useRef<HTMLDivElement | null>(null);
  // ── CURE A (CE-ruled, third and final shape) ──────────────────────────────
  // `touch-action` is read when the BROWSER CLASSIFIES the gesture — at finger-
  // down. Any placement of that property conditioned on `dragId` is therefore
  // late by construction: container, tile, anywhere. I made that error twice.
  // This listener does not depend on the property at all. Registered once with
  // { passive: false } — the default for touchmove is passive, and a passive
  // listener's preventDefault() is IGNORED, which is the whole reason this must
  // be a native registration rather than a React onTouchMove prop. While a drag
  // is armed it cancels the scroll outright, so the browser never steals the
  // gesture and `pointercancel` never fires mid-drag.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const block = (e: TouchEvent) => { if (dragIdRef.current) e.preventDefault(); };
    el.addEventListener('touchmove', block, { passive: false });
    return () => el.removeEventListener('touchmove', block);
  }, []);

  const clearPress = () => { if (pressTimer.current) { clearTimeout(pressTimer.current); pressTimer.current = null; } pressAt.current = null; };
  useEffect(() => () => clearPress(), []);

  const load = useCallback(() => {
    setLoading(true);
    fetchPortfolio(vendorId, filter).then(res => {
      if (res.ok) {
        setImages(res.images);
        lastCommitted.current = res.images.map(i => i.id).join(',');
      } else show((res as { error?: string }).error ?? 'Failed to load portfolio.', 'error');
    }).catch((e: unknown) => show(String(e), 'error')).finally(() => setLoading(false));
  }, [vendorId, filter, show]);

  useEffect(() => { load(); }, [load]);

  // CAP SITE 4's client half + CE §B's gate. Both numbers come from the SERVER —
  // this screen holds no opinion about the cap or about whether IG is wired.
  useEffect(() => {
    fetchDiscoverStatus().then(res => {
      if (!res || !(res as { ok?: boolean }).ok) return;
      const s = res as { max_portfolio_images?: number };
      if (typeof s.max_portfolio_images === 'number') setMaxImages(s.max_portfolio_images);
      // ig_import_enabled travels on this status too, but the IG block does NOT
      // read it from here — it reads /ig/status, which answers the two questions
      // together (is the seam wired AND is THIS vendor connected). One door, one
      // answer; two sources would let the screen render a half-truth.
    }).catch(() => { /* the manager works without the status; the server still enforces */ });
  }, []);

  // ── TDW_07 P4a · THE IG STATUS ────────────────────────────────────────────
  // P3's binding rule, now satisfiable: render the block when THE ACTION EXISTS
  // (it does, from this sitting) AND the server reports the seam configured.
  // Never on configuration alone — that was F-07.13's dead control.
  const loadIg = useCallback(() => {
    fetchIgStatus().then(res => {
      if (!res || !(res as { ok?: boolean }).ok) return;
      setIg(res as IgStatus);
    }).catch(() => { /* absence is the safe state: the block simply does not render */ });
  }, []);
  useEffect(() => { loadIg(); }, [loadIg]);

  // ── THE RETURN FROM INSTAGRAM ─────────────────────────────────────────────
  // /ig/callback hands the browser back here with ?ig=… . Every outcome gets a
  // WORD, including cancellation — a vendor who taps Cancel on Instagram's own
  // consent screen made a choice, and a screen that says nothing leaves them
  // wondering whether it broke. The query is stripped afterwards so a refresh
  // does not replay a stale toast.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search);
    const outcome = q.get('ig');
    if (!outcome) return;
    if (outcome === 'connected')      { show(COPY.H8); loadIg(); }
    else if (outcome === 'cancelled') { show(COPY.H3); }
    else                              { show(COPY.H10); }
    // THE EXPLICIT RESET — the second half of the stuck-button cure. A flow that
    // came back has ended, whatever it ended as, so the connect control re-arms
    // here by statement rather than by hoping the document was rebuilt. Scoped
    // to 'connect' for the reason given at the pageshow handler below.
    setIgBusy(b => (b === 'connect' ? null : b));
    window.history.replaceState({}, '', window.location.pathname);
  }, [loadIg, show]);

  // ══ TDW_07 P4b SLICE 1 · F-07.22 — THE CONNECT NAVIGATION, CURE (b) ═══════
  //
  // THE DISEASE, AS THE EVIDENCE LEFT IT. On the founder's iPhone the connect
  // tap reached Instagram and the Instagram APP claimed the navigation, landing
  // him on a blank error instead of the consent screen. Two on-device
  // experiments killed the two obvious theories: the Safari-session theory
  // NEGATIVE, the native-consent theory NEGATIVE. What was left isolated was the
  // NAVIGATION FORM itself.
  //
  // WHAT THE OLD CODE DID, AND WHY IT WAS THE AMBIGUOUS THIRD THING. It was an
  // async handler that AWAITED /ig/authorize and THEN assigned
  // `window.location.href`. The await spends the tap's transient activation
  // before the navigation happens — so what reached iOS was neither a clean
  // user-initiated navigation nor a server redirect, but a script-initiated one
  // arriving after the user's gesture had lapsed. iOS suppresses Universal Links
  // on navigation made WITHIN a user activation and claims them otherwise, so
  // the old shape sat on exactly the wrong side of that line.
  //
  // F-07.7 IS THE SAME PHYSICS, ALREADY FILED, ON A DIFFERENT SITE: the IG chip's
  // web fallback fires inside a 300ms timer, outside the tap's transient
  // activation, and gets a popup prompt for it. This estate had already paid for
  // this lesson once and did not recognise it here.
  //
  // THE CURE (CE-ruled (b), with (c)'s insight absorbed): the destination is
  // minted BEFORE render, and the control is a real <a href>. A link tap is the
  // most user-initiated navigation iOS recognises — the one form every piece of
  // evidence says gets suppressed rather than claimed. There is no `await`
  // anywhere between the vendor's finger and the navigation, because there is no
  // handler at all.
  //
  // (a) — a server 302 from a start route — WAS REFUSED, and the reason is
  // recorded because it is the trap: that is the exact hop F-07.23's cure
  // DELETED. Rebuilding it would have re-armed the interception point on
  // purpose. See src/lib/vendor/igOAuth.js's header in dream-os.
  //
  // STATED AS A HYPOTHESIS, NOT A CURE. If the founder's one-tap retest still
  // fails, navigation form is cleanly eliminated as a variable and that is a
  // FINDING, not a failure — the next discriminant gets ruled then. This comment
  // is amended in that case rather than left standing.
  //
  // MANUAL UPLOAD REMAINS THE PERMANENT FALLBACK (the addendum's law, and H3
  // says so above this control on screen). Nothing here assumes a Safari session
  // or a completed flow.
  //
  // THE ONE HAZARD, NAMED RATHER THAN DISCOVERED: /ig/authorize ARMS a nonce
  // server-side, and each mint overwrites the last. So exactly one state is live
  // per vendor at a time, and re-minting while a flow is in flight would make
  // the returning callback look like a replay. The re-mint below therefore fires
  // only when the tab is VISIBLE — a vendor sitting on Instagram's consent
  // screen has this tab hidden, so their armed state is never pulled out from
  // under them.
  const MINT_REFRESH_MS = 8 * 60 * 1000; // server TTL is 10 min; 2 min of headroom.

  const mintIgAuthUrl = useCallback(async () => {
    try {
      const res = await fetchIgAuthorizeUrl();
      const url = (res as { authorize_url?: string })?.authorize_url;
      if (!url) { setIgAuthUrl(null); return false; }
      setIgAuthUrl(url);
      setIgAuthMintedAt(Date.now());
      return true;
    } catch { setIgAuthUrl(null); return false; }
  }, []);

  // Mint as soon as the server says the seam is wired and THIS vendor still has
  // to connect. Not before: minting for a connected vendor arms a nonce nobody
  // will spend.
  const igNeedsConnect = Boolean(ig && ig.ig_import_enabled && (!ig.connected || ig.connection_state === 'expired'));
  useEffect(() => {
    if (!igNeedsConnect) { setIgAuthUrl(null); setIgAuthMintedAt(null); return; }
    if (igAuthUrl) return;
    void mintIgAuthUrl();
  }, [igNeedsConnect, igAuthUrl, mintIgAuthUrl]);

  // THE RETRY PATH, and it is a BUTTON on purpose. It re-mints and does NOT
  // navigate, so the activation window is irrelevant to it — the anchor above is
  // still the only thing that ever navigates. Rendering a dead <a> with no href
  // instead would be F-07.13's dead control wearing a link's clothes.
  async function igConnectRetry() {
    setIgBusy('connect');
    const got = await mintIgAuthUrl();
    if (!got) show(COPY.H10);
    setIgBusy(null);
  }

  // ══ THE STUCK-MUTED CONNECT BUTTON — FOUNDER-FOUND, CURED HERE ════════════
  //
  // THE DISEASE. The connect control sets `igBusy` and never clears it, which is
  // correct while the document is unloading and wrong the moment it is not. iOS
  // restores this page from the back-forward cache with React state INTACT — so
  // a vendor who opens Instagram and swipes back comes home to a control muted
  // at 0.4 opacity with no way to re-arm it but a hard reload. The flow was
  // abandoned; the button believed it was still in flight.
  //
  // WHY THE RESET IS SCOPED TO 'connect' AND NOT A BLANKET setIgBusy(null).
  // `igBusy` also guards the picker, the import and the disconnect — and those
  // are IN-PAGE async operations that clear themselves. Blanket-clearing on a
  // visibility change would re-arm the import button while an import was still
  // in flight, which buys a stuck button by trading it for a double import.
  // 'connect' is the only value that survives a navigation by design, so it is
  // the only value with any business being reset here.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const rearm = () => setIgBusy(b => (b === 'connect' ? null : b));
    const onShow = () => {
      rearm();
      // A restored page's minted state may have aged past the server's 10-minute
      // TTL while the vendor was elsewhere. Re-mint rather than let the anchor
      // point at a link that will come back "expired" — the failure the vendor
      // would read as the connect being broken a second time.
      if (igNeedsConnect && igAuthMintedAt !== null && Date.now() - igAuthMintedAt > MINT_REFRESH_MS) {
        void mintIgAuthUrl();
      }
    };
    const onVis = () => { if (document.visibilityState === 'visible') onShow(); };
    window.addEventListener('pageshow', onShow);
    document.addEventListener('visibilitychange', onVis);
    return () => {
      window.removeEventListener('pageshow', onShow);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [igNeedsConnect, igAuthMintedAt, mintIgAuthUrl, MINT_REFRESH_MS]);

  // STABLE across renders — without this every tile's props change on every tap
  // and memo() buys nothing. The functional updater is what makes it stable: no
  // dependency on igPicked, so the identity never churns.
  const igToggle = useCallback((url: string) => {
    setIgPicked(prev => prev.includes(url) ? prev.filter(u => u !== url) : [...prev, url]);
  }, []);

  async function igOpenPicker() {
    setIgBusy('media');
    try {
      const res = await fetchIgMedia();
      if (!res || !(res as { ok?: boolean }).ok) { show(COPY.H10); setIgBusy(null); return; }
      setIgItems((res as { items: IgMediaItem[] }).items || []);
      setIgPicked([]);
      setIgPicker(true);
    } catch { show(COPY.H10); }
    setIgBusy(null);
  }

  async function igImport() {
    if (igPicked.length === 0) return;
    setIgBusy('import');
    try {
      const res = await importIgPhotos(igPicked);
      const r = res as { ok?: boolean; imported_count?: number; failed_count?: number };
      if (!r || !r.ok) { show(COPY.H10); setIgBusy(null); return; }
      const added  = r.imported_count ?? 0;
      const failed = r.failed_count ?? 0;
      // PARTIAL SUCCESS IS A FIRST-CLASS OUTCOME (igImport.js's own law): nine of
      // twelve landing is nine photos the vendor did not re-upload, and H9 tells
      // them the truth about the other three rather than reporting a flat success.
      show(failed > 0
        ? COPY.H9.replace('{n}', String(added)).replace('{f}', String(failed))
        : COPY.H8);
      setIgPicker(false);
      await load();
    } catch { show(COPY.H10); }
    setIgBusy(null);
  }

  async function igDisconnect() {
    setIgBusy('disconnect');
    try {
      await disconnectIg();
      show(COPY.H14);
      loadIg();
    } catch { show(COPY.H10); }
    setIgBusy(null);
  }

  // ── THE FILTER/DRAG INTERLOCK (CE §0.2 ruling (a)) ─────────────────────────
  // Reorder is INERT under any non-`all` filter, and the reason is mechanical, not
  // aesthetic: a filtered grid holds a SUBSET, so a drag would post an incomplete
  // id list, which the server fail-closes on by design (`ordered_ids must list
  // every photo in this portfolio exactly once`). Letting the gesture start and
  // then refuse would be a lying surface; letting it silently reorder a subset
  // while invisible tiles shift beneath would be worse. So the gesture does not
  // arm, and copy G3 says why — the vendor is never left guessing at a dead drag.
  const canReorder = filter === 'all';
  const cap  = maxImages ?? 0;
  const full = cap > 0 && images.length >= cap;
  // TDW_07 P4a — the free-slot count, derived ONCE per render rather than
  // recomputed inside all twenty-five picker tiles.
  const igRoom = Math.max(0, cap - images.length);

  async function uploadOne(file: File): Promise<boolean> {
    const urlRes = await fetchUploadUrl(file.name);
    // The server refuses at the signing door when the portfolio is full (cap
    // site 3), so its sentence — not ours — is what the vendor reads.
    if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? COPY.B3, 'error'); return false; }
    const { upload_url, params } = urlRes;
    const form = new FormData();
    Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
    form.append('file', file);
    const cloudRes = await fetch(upload_url, { method: 'POST', body: form });
    if (!cloudRes.ok) { show(COPY.B3, 'error'); return false; }
    const cloudData = await cloudRes.json();
    const regRes = await registerPortfolioImage({ image_url: cloudData.secure_url });
    if (!regRes.ok) { show((regRes as { error?: string }).error ?? COPY.B3, 'error'); return false; }
    return true;
  }

  // ── F-2: BATCH UPLOAD, TRUNCATED AT `remaining` ───────────────────────────
  // Twenty uploads at one tap each was the wrong answer for a twenty-slot cap.
  // Sequential rather than parallel on purpose: each register call reads the
  // count to assign the next position, so concurrent registers would race for
  // the same index and the grid's order would be luck. Slower, correct.
  // A batch larger than the free slots takes what fits and SAYS SO (F2-3) rather
  // than uploading bytes the server will refuse — the same reasoning as cap site 3.
  async function handleUpload(files: File[]) {
    if (files.length === 0) return;
    const room  = cap > 0 ? Math.max(0, cap - images.length) : files.length;
    const batch = files.slice(0, room);
    if (batch.length === 0) { show(COPY.A2(cap), 'error'); return; }
    if (batch.length < files.length) show(COPY.F2_3(room), 'error');

    setUploading(true);
    let done = 0;
    try {
      for (let i = 0; i < batch.length; i++) {
        setProgress(batch.length > 1 ? COPY.F2_1(i + 1, batch.length) : COPY.B1);
        if (await uploadOne(batch[i])) done++;
      }
      if (done === 1 && batch.length === 1) show(COPY.B2, 'success');
      else if (done > 0) show(COPY.F2_2(done), 'success');
      if (done > 0) load();
    } catch { show(COPY.B3, 'error'); }
    finally { setUploading(false); setProgress(COPY.B1); }
  }

  async function commitOrder(next: PortfolioImage[]): Promise<PortfolioImage[] | null> {
    const ids = next.map(i => i.id);
    if (ids.join(',') === lastCommitted.current) return null;
    const res = await reorderPortfolio(ids);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); load(); return null; }
    setImages(res.images);
    lastCommitted.current = res.images.map(i => i.id).join(',');
    show(COPY.G2, 'success');
    return res.images;
  }

  // ── CURE B (CE-ruled): REORDER WITHOUT A GESTURE ──────────────────────────
  // The doctrine this sitting minted: when an interaction cannot be witnessed
  // from the build container, the surface ships a deterministic equivalent that
  // CAN be proven by cells, and the gesture is the enhancement on top — never
  // the only path. These two buttons are that equivalent. They are keyboard- and
  // screen-reader-reachable by construction, which is worth having on its own
  // merits. Move-to-front is NOT a third control: under the one-hand law
  // position 0 ⟺ cover, so "make it first" IS E2's existing cover action, and a
  // second set of words for one act would be two authorities in copy form.
  // Gated on canReorder for the same mechanical reason the drag is: a filtered
  // view holds a subset, and the server fail-closes on an incomplete id list.
  async function moveBy(imageId: string, delta: -1 | 1) {
    const from = images.findIndex(i => i.id === imageId);
    if (!canMove(images.length, from, delta)) return;
    const fresh = await commitOrder(moveIndex(images, from, delta));
    if (fresh) setSel(fresh.find(i => i.id === imageId) ?? null);
  }

  // ── POINTER DRAG (spec §6: "pointer events portable to Gesture Handler") ────
  // No HTML5 drag-and-drop, no library: pointer down marks the tile, pointer move
  // asks which tile's box the finger is over and swaps, pointer up commits the
  // whole order. The commit sends the FULL id list because the server is
  // fail-closed on completeness — a move instruction could half-apply, a
  // permutation cannot. Optimistic locally, authoritative from the response.
  function onPointerDown(id: string, e: React.PointerEvent) {
    if (!canReorder) return;
    didDrag.current = false;
    pressAt.current = { x: e.clientX, y: e.clientY };
    const el = e.currentTarget as HTMLElement;
    const pid = e.pointerId;
    pressTimer.current = setTimeout(() => {
      pressTimer.current = null;
      // didDrag is NOT set here. A long-press that goes nowhere must still open
      // the sheet on release rather than dying silently; only real movement
      // makes this a drag. Set on first move, below.
      // Capture the pointer at the moment of arming so the rest of the gesture
      // belongs to this tile even if the finger leaves its box.
      try { el.setPointerCapture(pid); } catch { /* not fatal */ }
      dragIdRef.current = id;
      setDragId(id);
    }, 350);
  }
  function onPointerMove(e: React.PointerEvent) {
    // MOVE FIRST CANCELS TO SCROLL. While the timer is pending, any real travel
    // means the vendor is scrolling the grid, not lifting a tile — so the timer
    // dies and the browser keeps the gesture. 8px of slop for a resting thumb.
    if (pressTimer.current && pressAt.current) {
      const dx = Math.abs(e.clientX - pressAt.current.x);
      const dy = Math.abs(e.clientY - pressAt.current.y);
      if (dx > 8 || dy > 8) clearPress();
    }
    if (!dragId || !canReorder) return;
    didDrag.current = true;   // real movement while armed — this is a drag
    const over = images.find(img => {
      const el = tileRefs.current[img.id];
      if (!el) return false;
      const r = el.getBoundingClientRect();
      return e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    });
    if (!over || over.id === dragId) return;
    setImages(prev => {
      const from = prev.findIndex(p => p.id === dragId);
      const to   = prev.findIndex(p => p.id === over.id);
      if (from < 0 || to < 0) return prev;
      const next = prev.slice();
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  }
  function onPointerUp() {
    clearPress();
    if (!dragId) return;
    dragIdRef.current = null;
    setDragId(null);
    commitOrder(images);
  }

  async function doSetCover(imageId: string) {
    const res = await setHeroImage(imageId);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show(COPY.E3, 'success');
    setSel(null); load();
  }

  async function doSaveCaption(imageId: string) {
    const res = await updatePortfolioImage(imageId, { caption });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show(COPY.D2, 'success');
    setSel(null); load();
  }

  async function doDelete(imageId: string) {
    const res = await deletePortfolioImage(imageId);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show(COPY.C5, 'success');
    setConfirming(false); setSel(null); load();
  }

  const stateLabel = (s: string) => s === 'pending' ? COPY.F1 : s === 'rejected' ? COPY.F3 : '';
  const stateColor = (s: string) => s === 'approved' ? A.brassWarm : s === 'rejected' ? A.red : A.inkMute;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{
        padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12,
        borderBottom: '0.5px solid var(--atelier-card-border)',
      }}>
        <button type="button" onClick={() => router.back()} style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1,
        }}>‹</button>
        <span style={{
          fontFamily: F.label, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1,
        }}>Portfolio</span>
        {/* THE SCREEN'S ONE FILLED GOLD. Disabled at the cap; the sentence below
            says why, so the control is never mysteriously dead. */}
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading || full}
          className="atelier-fab"
          style={{
            padding: '8px 16px', borderRadius: 2,
            cursor: (uploading || full) ? 'default' : 'pointer',
            border: '0.5px solid #E0BC6E',
            fontFamily: F.label, fontWeight: 400, fontSize: 9,
            color: '#1A120E', letterSpacing: '0.32em', textTransform: 'uppercase',
            opacity: (uploading || full) ? 0.5 : 1,
          }}>
          {uploading ? progress : '+ Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          style={{ display: 'none' }}
          onChange={e => { const fs = Array.from(e.target.files ?? []); if (fs.length) handleUpload(fs); e.target.value = ''; }} />
      </div>

      {/* Filter pills — restored (CE §0.2 (a)). Ghost/bordered only: the screen's
          one filled gold stays the Upload action. */}
      <div style={{ display: 'flex', gap: 8, padding: '12px 22px 0', flexWrap: 'wrap' }}>
        {STATE_FILTERS.map(sf => (
          <button key={sf} type="button" onClick={() => setFilter(sf)} style={{
            padding: '6px 14px', borderRadius: 2, cursor: 'pointer', flexShrink: 0,
            background: filter === sf ? 'rgba(201,168,76,0.18)' : 'transparent',
            border: `0.5px solid ${filter === sf ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            color: filter === sf ? A.brassWarm : A.inkMute,
            letterSpacing: '0.28em', textTransform: 'uppercase',
          }}>{sf}</button>
        ))}
      </div>

      <div style={{ padding: '12px 22px 0', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {cap > 0 && (
          <div style={{
            fontFamily: F.label, fontWeight: 300, fontSize: 9,
            letterSpacing: '0.28em', textTransform: 'uppercase', color: A.brassWarm,
          }}>{COPY.A1(images.length, cap)}</div>
        )}
        {full && (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkSoft }}>
            {COPY.A2(cap)}
          </div>
        )}
        {images.length > 1 && canReorder && (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>
            {COPY.G1}
          </div>
        )}
        {images.length > 1 && !canReorder && (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>
            {COPY.G3}
          </div>
        )}
        {images.length > 0 && (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>
            {COPY.F4}
          </div>
        )}
      </div>

      <div
        ref={scrollRef}
        style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '12px 16px 32px', touchAction: dragId ? 'none' : 'auto' }}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {loading ? (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 15, color: A.inkMute, textAlign: 'center', padding: 40 }}>
            Loading…
          </div>
        ) : images.length === 0 ? (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 17, color: A.inkMute, textAlign: 'center', padding: '60px 20px', lineHeight: 1.5 }}>
            No images yet. <br />
            <span style={{ color: A.brassWarm }}>Tap upload to add your first.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {images.map((img, idx) => (
              <div
                key={img.id}
                ref={el => { tileRefs.current[img.id] = el; }}
                role="button" tabIndex={0}
                onPointerDown={e => onPointerDown(img.id, e)}
                onContextMenu={e => e.preventDefault()}
                onClick={() => {
                  // A completed drag must not also open the sheet.
                  if (didDrag.current) { didDrag.current = false; return; }
                  setSel(img); setCaption(img.caption ?? ''); setConfirming(false);
                }}
                onKeyDown={e => { if (e.key === 'Enter') { setSel(img); setCaption(img.caption ?? ''); } }}
                style={{
                  position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
                  border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: 2,
                  cursor: 'pointer', background: 'none', padding: 0,
                  // ── F-1's DEFENSES ────────────────────────────────────────
                  // Chrome's long-press image menu took the gesture before any
                  // handler ran. These four lines are why it no longer can. The
                  // touch-action flips to 'none' only on the ARMED tile, so
                  // vertical scrolling over the grid is untouched — a blanket
                  // 'none' would have cured the drag by breaking the scroll.
                  WebkitTouchCallout: 'none',
                  WebkitUserSelect: 'none',
                  userSelect: 'none',
                  touchAction: dragId === img.id ? 'none' : 'auto',
                  opacity: dragId === img.id ? 0.5 : 1,
                  transform: dragId === img.id ? 'scale(0.97)' : 'none',
                  transition: dragId ? 'none' : 'transform 140ms ease, opacity 140ms ease',
                }}>
                {/* LQIP under the real image: the blurred 24px wash paints first,
                    the card variant fades over it. No spinner on the floor. */}
                <img src={lqipUrl(img.image_url)} alt="" aria-hidden draggable={false}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'blur(8px)', transform: 'scale(1.06)' }} />
                <img src={imgUrl(img.image_url, 'card')} alt={img.caption ?? ''} loading="lazy" draggable={false}
                  style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
                {/* Under a filter, render index 0 is NOT the cover. The badge
                    keys on the ROW's own position, which is the server's word;
                    idx is only trustworthy in the unfiltered view. */}
                {(canReorder ? idx === 0 : img.position === 0) && (
                  <div style={{
                    position: 'absolute', top: 6, left: 6, padding: '3px 8px',
                    background: 'linear-gradient(180deg, #D4B86A 0%, #B59548 100%)',
                    border: '0.5px solid #E0BC6E',
                    fontFamily: F.label, fontWeight: 400, fontSize: 7,
                    color: '#1A120E', letterSpacing: '0.28em',
                  }}>{COPY.E1}</div>
                )}
                {stateLabel(img.approval_state) && (
                  <div style={{
                    position: 'absolute', bottom: 0, left: 0, right: 0, padding: '4px 8px',
                    background: 'rgba(12,10,9,0.55)',
                    fontFamily: F.label, fontWeight: 300, fontSize: 7,
                    letterSpacing: '0.24em', textTransform: 'uppercase',
                    color: stateColor(img.approval_state),
                  }}>{stateLabel(img.approval_state)}</div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── THE IG ENTRY DOES NOT RENDER THIS SITTING — CE §B, TIGHTENED ──
            NOT ONE BYTE OF IT: not H1, not the explainers, not a connect. The
            rendering of this block binds to THE ACTION'S EXISTENCE, never to
            configuration. `ig_import_enabled` arrives on the status and the pwa
            deliberately IGNORES it, because a founder who sets the env vars early
            must not thereby surface an entry whose action does not exist — that is
            F-07.13's dead control, and an entry that instead reported H10 ("We
            couldn't reach Instagram just now") when nothing ever tried is the
            costume class Block 06 was built to kill. Either failure is worse than
            absence.

            WHAT IS BUILT AND BENCHED BEHIND THIS ABSENCE: the whole mirror
            pipeline (server-side fetch -> signed estate upload -> estate URLs,
            never-hotlink asserted at the write path), the cap's governance of an
            import, Fork 4(b)'s approved-on-arrival, and the config gate itself.
            WHAT IS MISSING IS ONE THING: the connect action, whose five values
            (U-1..U-5 in src/lib/vendor/igImport.js) the chair settled AFTER this
            build. The founder-vetoed strings stay in COPY above, unrendered, so
            the action sitting inherits an executed veto rather than re-running it.

            THE BINDING RULE, FOR THE SITTING THAT ADDS THE ACTION: render this
            block when the action exists AND the server reports the seam
            configured. Never on configuration alone.

            ── TDW_07 P4a: THE ACTION NOW EXISTS, SO THE BLOCK RENDERS. ──
            The rule is satisfied, not relaxed: `ig` is null until /ig/status
            answers, and `ig_import_enabled` is the server's word on whether the
            seam is wired — which now ALSO asserts the redirect URI ends at our
            canonical callback path, so a config that could only ever fail keeps
            the entry dark and logs why. Absence remains the safe state. */}

        {ig && ig.ig_import_enabled && (
          <div style={{ marginTop: 34, paddingTop: 26, borderTop: '0.5px solid rgba(201,168,76,0.18)' }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: A.brassWarm, marginBottom: 12,
            }}>{COPY.H1}</div>

            {/* H3 SITS ABOVE THE ACTION AND THAT IS INSTRUCTION, NOT LAYOUT.
                The addendum's law is MANUAL UPLOAD IS THE PERMANENT FALLBACK,
                NEVER A WALL — and TDW_06's doctrine is that position in a
                paragraph is instruction. A vendor who reads the connect button
                first and the reassurance second has been sold to; the other way
                round, they have been told the truth first. */}
            <p style={{
              fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14,
              color: A.inkSoft, margin: '0 0 14px', lineHeight: 1.55,
            }}>{COPY.H3}</p>

            {ig.connection_state === 'expired' ? (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: A.red, margin: '0 0 14px' }}>
                {COPY.H11}
              </p>
            ) : null}

            {!ig.connected || ig.connection_state === 'expired' ? (
              <>
                <p style={{
                  fontFamily: F.body, fontWeight: 300, fontSize: 12, color: A.inkMute,
                  margin: '0 0 16px', lineHeight: 1.6,
                }}>{COPY.H2}</p>
                {/* F-07.22 CURE (b) — A REAL LINK, OVER A DESTINATION THAT
                    ALREADY EXISTS. No onClick, no await, nothing between the
                    finger and the navigation. The full reasoning lives at
                    mintIgAuthUrl above; the short version is that iOS suppresses
                    Universal Links on navigation made inside a user activation
                    and claims them outside it, and a link tap is the inside case.
                    When the mint has not landed the control is a BUTTON that
                    re-mints and does not navigate — an honest second state
                    rather than a hrefless <a>, which would be a dead control. */}
                {igAuthUrl ? (
                  <a href={igAuthUrl}
                    style={{
                      display: 'block', width: '100%', padding: '13px 0', boxSizing: 'border-box',
                      background: 'transparent', textAlign: 'center', textDecoration: 'none',
                      border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2,
                      cursor: 'pointer',
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      color: A.brassWarm, letterSpacing: '0.28em', textTransform: 'uppercase',
                    }}>{COPY.H4}</a>
                ) : (
                  <button type="button" disabled={igBusy !== null} onClick={igConnectRetry}
                    style={{
                      width: '100%', padding: '13px 0', background: 'transparent',
                      border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2,
                      cursor: igBusy ? 'default' : 'pointer', opacity: igBusy ? 0.4 : 1,
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      color: A.brassWarm, letterSpacing: '0.28em', textTransform: 'uppercase',
                    }}>{COPY.H4}</button>
                )}
              </>
            ) : (
              <>
                {/* F-07.24 — WHICH ACCOUNT IS LINKED. A vendor about to copy
                    photographs into their public storefront should be able to
                    read the handle without leaving the page. Rendered only when
                    the server has one: a failed profile read omits the line
                    rather than printing an empty @. */}
                {ig.ig_username && (
                  <p style={{
                    fontFamily: F.label, fontWeight: 300, fontSize: 9,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: A.brassWarm, margin: '0 0 10px',
                  }}>{COPY.H18.replace('{handle}', ig.ig_username)}</p>
                )}
                <p style={{
                  fontFamily: F.body, fontWeight: 300, fontSize: 12, color: A.inkMute,
                  margin: '0 0 16px', lineHeight: 1.6,
                }}>{COPY.H12}</p>
                <button type="button" disabled={igBusy !== null || full} onClick={igOpenPicker}
                  style={{
                    width: '100%', padding: '13px 0', background: 'transparent',
                    border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2,
                    cursor: (igBusy || full) ? 'default' : 'pointer', opacity: (igBusy || full) ? 0.4 : 1,
                    fontFamily: F.label, fontWeight: 300, fontSize: 9,
                    color: A.brassWarm, letterSpacing: '0.28em', textTransform: 'uppercase',
                  }}>{COPY.H1}</button>
                <button type="button" disabled={igBusy !== null} onClick={igDisconnect}
                  style={{
                    width: '100%', padding: '10px 0', marginTop: 8, background: 'transparent',
                    border: 'none', cursor: igBusy ? 'default' : 'pointer',
                    fontFamily: F.body, fontWeight: 300, fontSize: 11, color: A.inkMute,
                  }}>{COPY.H13}</button>
              </>
            )}
          </div>
        )}
      </div>

      {/* ── TDW_07 P4a · THE PICKER ────────────────────────────────────────
          The cap governs the pick, not just the import: the vendor cannot select
          more than the free slots, so the refusal happens at the tap rather than
          after the upload. That is cap site 3's reasoning applied to a hand —
          the same law the batch upload learned at P3 (F2-3). */}
      {igPicker && (
        <div
          onClick={() => { if (!igBusy) setIgPicker(false); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 60, background: 'rgba(12,10,9,0.55)',
            display: 'flex', alignItems: 'flex-end',
          }}>
          <div
            onClick={(e) => e.stopPropagation()}
            // THE IMPORT ACTION MUST NOT LIVE AT THE BOTTOM OF THE SCROLL.
            // The first build put it after the grid — fine with twelve photos,
            // useless with Swati's hundred: she picked four and then had to
            // scroll past every reel she owns to find the button. A control the
            // vendor has to hunt for is a control that does not exist.
            // So: a flex COLUMN. Header fixed, grid scrolls, action pinned.
            style={{
              width: '100%', maxHeight: '86vh',
              display: 'flex', flexDirection: 'column',
              background: 'var(--atelier-paper, #F8F7F5)', borderRadius: '14px 14px 0 0',
            }}>
            <div style={{ padding: '22px 18px 12px', flexShrink: 0 }}>
            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: A.brassWarm, marginBottom: 4,
            }}>{COPY.H5}</div>
            <div style={{
              fontFamily: F.body, fontWeight: 300, fontSize: 12, color: A.inkMute, marginBottom: 4,
            }}>
              {COPY.H6.replace('{n}', String(igPicked.length)).replace('{r}', String(igRoom))}
            </div>
            {/* Said BEFORE the tap, not after the import. A reel arrives as a
                still frame; a vendor who learns that afterwards has been
                surprised by their own storefront. */}
            {igItems.some(i => i.media_type === 'VIDEO') && (
              <div style={{
                fontFamily: F.body, fontWeight: 300, fontSize: 11, color: A.inkMute, marginBottom: 14,
              }}>{COPY.H17}</div>
            )}

            </div>

            {/* THE ONLY SCROLLING REGION. */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 16px' }}>
            {igItems.length === 0 ? (
              <p style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute }}>
                {COPY.H10}
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 6 }}>
                {igItems.map(item => (
                  <IgTile key={item.id} item={item}
                    on={igPicked.includes(item.source_url)}
                    dead={!igPicked.includes(item.source_url) && igPicked.length >= igRoom}
                    onToggle={igToggle} />
                ))}
              </div>
            )}

            </div>

            {/* THE PINNED ACTION. Outside the scroller, so it is on screen from
                the first tap to the last regardless of how much media the vendor
                has. The hairline separates it from the grid scrolling beneath. */}
            <div style={{
              flexShrink: 0, padding: '12px 18px calc(env(safe-area-inset-bottom,0px) + 16px)',
              borderTop: '0.5px solid rgba(201,168,76,0.18)',
              background: 'var(--atelier-paper, #F8F7F5)',
            }}>
              <button type="button" disabled={igPicked.length === 0 || igBusy !== null}
                onClick={igImport}
                style={{
                  width: '100%', padding: '14px 0',
                  background: igPicked.length ? 'var(--atelier-accent-text)' : 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2,
                  cursor: igPicked.length ? 'pointer' : 'default',
                  opacity: (igPicked.length === 0 || igBusy) ? 0.4 : 1,
                  fontFamily: F.label, fontWeight: 300, fontSize: 9,
                  color: igPicked.length ? '#F8F7F5' : A.brassWarm,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                }}>{COPY.H7.replace('{n}', String(igPicked.length))}</button>
            </div>
          </div>
        </div>
      )}

      {sel && (
        <>
          <div onClick={() => { setSel(null); setConfirming(false); }}
            style={{ position: 'fixed', inset: 0, zIndex: 40, backgroundColor: 'var(--atelier-overlay)' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '16px 24px calc(24px + env(safe-area-inset-bottom))',
            maxHeight: '86vh', overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <img src={imgUrl(sel.image_url, 'full')} alt="" style={{
              width: '100%', aspectRatio: '3/4', objectFit: 'cover', objectPosition: 'center top',
              borderRadius: 2, marginBottom: 14, border: '0.5px solid rgba(201,168,76,0.2)',
            }} />

            <div style={{
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              letterSpacing: '0.32em', textTransform: 'uppercase',
              color: stateColor(sel.approval_state), marginBottom: 6,
            }}>{sel.approval_state}</div>

            {sel.rejection_reason && (
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.red, marginBottom: 12, lineHeight: 1.4 }}>
                {sel.rejection_reason}
              </div>
            )}

            {sel.position === 0 && (
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute, marginBottom: 12 }}>
                {COPY.E4}
              </div>
            )}

            <textarea value={caption} onChange={e => setCaption(e.target.value)}
              placeholder={COPY.D1} rows={2}
              style={{
                width: '100%', boxSizing: 'border-box', marginBottom: 10, padding: '10px 12px',
                background: 'transparent', border: '0.5px solid rgba(201,168,76,0.22)', borderRadius: 2,
                color: A.ink, fontFamily: F.body, fontWeight: 300, fontSize: 13, resize: 'vertical',
              }} />
            <button type="button" onClick={() => doSaveCaption(sel.id)}
              style={{
                width: '100%', padding: '11px 0', marginBottom: 10,
                background: 'transparent', border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: 2,
                cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9,
                color: A.brassWarm, letterSpacing: '0.32em', textTransform: 'uppercase',
              }}>Save caption</button>

            {/* CURE B — the deterministic path. Disabled at the ends rather than
                hidden, so the control's shape never shifts under the thumb. */}
            {canReorder && images.length > 1 && !confirming && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                {([['up', -1], ['down', 1]] as const).map(([dir, delta]) => {
                  const idx  = images.findIndex(i => i.id === sel.id);
                  const dead = !canMove(images.length, idx, delta);
                  return (
                    <button key={dir} type="button" disabled={dead}
                      onClick={() => moveBy(sel.id, delta)}
                      style={{
                        flex: 1, padding: '11px 0', background: 'transparent',
                        border: '0.5px solid rgba(201,168,76,0.35)', borderRadius: 2,
                        cursor: dead ? 'default' : 'pointer', opacity: dead ? 0.35 : 1,
                        fontFamily: F.label, fontWeight: 300, fontSize: 9,
                        color: A.brassWarm, letterSpacing: '0.28em', textTransform: 'uppercase',
                      }}>{delta === -1 ? COPY.G4 : COPY.G5}</button>
                  );
                })}
              </div>
            )}

            {!confirming ? (
              <div style={{ display: 'flex', gap: 8 }}>
                {sel.position !== 0 && (
                  <button type="button" onClick={() => doSetCover(sel.id)}
                    style={{
                      flex: 1, padding: '13px 0', background: 'transparent',
                      border: '0.5px solid rgba(201,168,76,0.5)', borderRadius: 2, cursor: 'pointer',
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      color: A.brassWarm, letterSpacing: '0.28em', textTransform: 'uppercase',
                    }}>{COPY.E2}</button>
                )}
                <button type="button" onClick={() => setConfirming(true)}
                  style={{
                    flex: 1, padding: '13px 0', background: 'transparent',
                    border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2, cursor: 'pointer',
                    fontFamily: F.label, fontWeight: 300, fontSize: 9,
                    color: A.red, letterSpacing: '0.32em', textTransform: 'uppercase',
                  }}>{COPY.C3}</button>
              </div>
            ) : (
              /* THE CONFIRM. Delete used to fire on one tap with no question —
                 an irreversible act behind a single touch. Inline rather than a
                 second sheet so the photo stays on screen while they decide. */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.ink }}>
                  {COPY.C1}
                </div>
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkSoft, lineHeight: 1.45 }}>
                  {COPY.C2}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                  <button type="button" onClick={() => setConfirming(false)}
                    style={{
                      flex: 1, padding: '13px 0', background: 'transparent',
                      border: '0.5px solid rgba(201,168,76,0.3)', borderRadius: 2, cursor: 'pointer',
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      color: A.brassWarm, letterSpacing: '0.32em', textTransform: 'uppercase',
                    }}>{COPY.C4}</button>
                  <button type="button" onClick={() => doDelete(sel.id)}
                    style={{
                      flex: 1, padding: '13px 0', background: 'transparent',
                      border: '0.5px solid rgba(224,123,92,0.55)', borderRadius: 2, cursor: 'pointer',
                      fontFamily: F.label, fontWeight: 300, fontSize: 9,
                      color: A.red, letterSpacing: '0.32em', textTransform: 'uppercase',
                    }}>{COPY.C3}</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
