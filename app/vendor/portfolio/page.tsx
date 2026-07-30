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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import {
  fetchPortfolio, fetchUploadUrl, registerPortfolioImage, setHeroImage,
  deletePortfolioImage, updatePortfolioImage, reorderPortfolio, fetchDiscoverStatus,
} from '@/lib/vendor/api/vendor';
import { imgUrl, lqipUrl } from '@/lib/vendor/img';
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
} as const;

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
  const [maxImages, setMaxImages] = useState<number | null>(null);
  const [dragId, setDragId]   = useState<string | null>(null);
  const [filter, setFilter]   = useState<string>('all');
  const fileRef = useRef<HTMLInputElement>(null);
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const lastCommitted = useRef<string>('');

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
      // ig_import_enabled is NOT read here, by ruling (CE §B). See the note at the
      // IG render site: the block binds to the action, not to configuration.
    }).catch(() => { /* the manager works without the status; the server still enforces */ });
  }, []);

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

  async function handleUpload(file: File) {
    setUploading(true);
    try {
      const urlRes = await fetchUploadUrl(file.name);
      // The server refuses at the signing door when the portfolio is full (cap
      // site 3), so its sentence — not ours — is what the vendor reads.
      if (!urlRes.ok) { show((urlRes as { error?: string }).error ?? COPY.B3, 'error'); return; }
      const { upload_url, params } = urlRes;
      const form = new FormData();
      Object.entries(params).forEach(([k, v]) => form.append(k, String(v)));
      form.append('file', file);
      const cloudRes = await fetch(upload_url, { method: 'POST', body: form });
      if (!cloudRes.ok) { show(COPY.B3, 'error'); return; }
      const cloudData = await cloudRes.json();
      const regRes = await registerPortfolioImage({ image_url: cloudData.secure_url });
      if (!regRes.ok) { show((regRes as { error?: string }).error ?? COPY.B3, 'error'); return; }
      show(COPY.B2, 'success');
      load();
    } catch { show(COPY.B3, 'error'); }
    finally { setUploading(false); }
  }

  async function commitOrder(next: PortfolioImage[]) {
    const ids = next.map(i => i.id);
    if (ids.join(',') === lastCommitted.current) return;
    const res = await reorderPortfolio(ids);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); load(); return; }
    setImages(res.images);
    lastCommitted.current = res.images.map(i => i.id).join(',');
    show(COPY.G2, 'success');
  }

  // ── POINTER DRAG (spec §6: "pointer events portable to Gesture Handler") ────
  // No HTML5 drag-and-drop, no library: pointer down marks the tile, pointer move
  // asks which tile's box the finger is over and swaps, pointer up commits the
  // whole order. The commit sends the FULL id list because the server is
  // fail-closed on completeness — a move instruction could half-apply, a
  // permutation cannot. Optimistic locally, authoritative from the response.
  function onPointerDown(id: string) { if (!canReorder) return; setDragId(id); }
  function onPointerMove(e: React.PointerEvent) {
    if (!dragId || !canReorder) return;
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
    if (!dragId) return;
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
          {uploading ? COPY.B1 : '+ Upload'}
        </button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp,image/heic"
          style={{ display: 'none' }}
          onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); e.target.value = ''; }} />
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
                onPointerDown={() => onPointerDown(img.id)}
                onClick={() => { if (!dragId) { setSel(img); setCaption(img.caption ?? ''); setConfirming(false); } }}
                onKeyDown={e => { if (e.key === 'Enter') { setSel(img); setCaption(img.caption ?? ''); } }}
                style={{
                  position: 'relative', aspectRatio: '3/4', overflow: 'hidden',
                  border: '0.5px solid rgba(201,168,76,0.2)', borderRadius: 2,
                  cursor: 'pointer', background: 'none', padding: 0,
                  opacity: dragId === img.id ? 0.5 : 1,
                  transform: dragId === img.id ? 'scale(0.97)' : 'none',
                  transition: dragId ? 'none' : 'transform 140ms ease, opacity 140ms ease',
                }}>
                {/* LQIP under the real image: the blurred 24px wash paints first,
                    the card variant fades over it. No spinner on the floor. */}
                <img src={lqipUrl(img.image_url)} alt="" aria-hidden
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', filter: 'blur(8px)', transform: 'scale(1.06)' }} />
                <img src={imgUrl(img.image_url, 'card')} alt={img.caption ?? ''} loading="lazy"
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
            configured. Never on configuration alone. */}
      </div>

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
