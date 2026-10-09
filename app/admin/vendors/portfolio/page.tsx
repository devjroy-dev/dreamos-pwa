'use client';
// app/admin/vendors/portfolio/page.tsx · CE-47 · WEB-4 admin package · R-47.2: A VENDOR'S PICTURES, AS THE ADMIN SEES THEM.
// The founder's rule of 8 October 2026: her pictures belong to her. Each picture says where it shows (her pages,
// Discover), and its card offers only what the rule allows:
//   · Hide from Discover, and its one-tap undo (Show on Discover). It stays on her pages either way.
//   · Release, on a picture the safety check held.
//   · Remove for a legal reason: the reason is asked for, the server logs it first, and she is told on her portfolio.
// There is no delete and no other remove. The old Delete, Hero and Activate taps are gone: the server's admin DELETE
// door is gone (cut 30), and it never had a PATCH door, so the Hero and carousel taps reached nothing.
// Pictures the admin uploads here are passed at once (the server writes safety_state 'passed').
import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader, T, GoldBtn, GhostBtn, Toast, UploadZone, LoadingGrid, SectionDivider, FieldInput } from '../../_components/AdminUI';
import { Sheet, SheetRow, SheetNote, DangerLast } from '../../_components/Kit';
import { getVendors, type AdminVendor } from '../../../../lib/admin-api/index';
import { adminUploadFile, adminPost } from '../../../../lib/admin-api/_base';
import {
  getVendorPictures, hideFromDiscover, showOnDiscover, releasePicture, legalRemoval, legalReasonOk,
  pictureState, STATE_LINE, STATE_BADGE, WORDS, LEGAL_MAX, type VendorPicture,
} from '../../../../lib/admin-api/pictures';

const errText = (e: unknown) => (e instanceof Error && e.message ? e.message : WORDS.tryAgain);

// ── F-10.54 CURED · A LINK I AUTHORED INTO A PAGE THAT COULD NOT READ IT ─────
// TDW_10 P3's deck ships `See the portfolio → /admin/vendors/portfolio?vendor=<id>`
// and this page contained ZERO occurrences of `useSearchParams`. It never read a
// query string, so the tap landed on an empty vendor picker — the founder walked
// straight into it. "Pictures to look at" links here the same way (Open her pictures).
//
// The reader is a PRESELECT, not a lock: the picker still works, and changing it
// simply leaves the URL behind rather than fighting it. A deep link that could
// not be departed from would be a worse bug than the one being cured.
function VendorPortfolioInner() {
  const [vendors, setVendors]       = useState<AdminVendor[]>([]);
  const [vendorId, setVendorId]     = useState('');
  const [photos, setPhotos]         = useState<VendorPicture[]>([]);
  const [loading, setLoading]       = useState(false);
  const [uploading, setUploading]   = useState(false);
  const [toast, setToast]           = useState('');
  const [toastErr, setToastErr]     = useState(false);
  const [caption, setCaption]       = useState('');
  const [showCaption, setShowCaption] = useState(false);
  const [pendingUpload, setPendingUpload] = useState<{ type: 'file'; file: File } | { type: 'url'; url: string } | null>(null);
  const [openId, setOpenId]         = useState<string | null>(null);
  const [busy, setBusy]             = useState(false);
  const [reason, setReason]         = useState('');

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const searchParams = useSearchParams();
  const linkedVendor = searchParams.get('vendor');

  useEffect(() => {
    getVendors().then(d => setVendors(d.vendors)).catch(() => {});
  }, []);

  const selectedVendor = vendors.find(v => v.id === vendorId);

  const loadPhotos = useCallback(async (vid: string) => {
    if (!vid) return;
    setLoading(true);
    try { setPhotos(await getVendorPictures(vid)); }
    catch (e) { showToast(errText(e), true); }
    finally { setLoading(false); }
  }, []);

  // PRESELECT FROM THE DEEP LINK, ONCE. Guarded on `!vendorId` so it fires on
  // arrival and never again — without that guard, choosing a different vendor
  // would be undone on the next render and the picker would appear broken.
  // Guarded on the id being REAL: a stale or hand-typed link selects nothing and
  // leaves the picker usable, rather than loading a vendor that does not exist.
  useEffect(() => {
    if (!linkedVendor || vendorId || vendors.length === 0) return;
    if (!vendors.some(v => v.id === linkedVendor)) return;
    setVendorId(linkedVendor);
    loadPhotos(linkedVendor);
  }, [linkedVendor, vendorId, vendors, loadPhotos]);

  const handleVendorChange = (vid: string) => {
    setVendorId(vid);
    setPhotos([]); setOpenId(null);
    setShowCaption(false); setPendingUpload(null);
    if (vid) loadPhotos(vid);
  };

  const handleFile = async (file: File) => { setPendingUpload({ type: 'file', file }); setCaption(''); setShowCaption(true); };
  const handleUrl  = async (url: string)  => { setPendingUpload({ type: 'url', url });   setCaption(''); setShowCaption(true); };
  const cancelUpload = () => { setShowCaption(false); setPendingUpload(null); setCaption(''); };

  const submitUpload = async () => {
    if (!pendingUpload || !vendorId) return;
    setUploading(true);
    setShowCaption(false);
    try {
      let image_url = '';
      if (pendingUpload.type === 'file') {
        const r = await adminUploadFile(`/api/v2/admin/vendors/${vendorId}/portfolio/upload-url`, pendingUpload.file);
        image_url = r.image_url;
      } else {
        image_url = pendingUpload.url;
      }
      await adminPost(`/api/v2/admin/vendors/${vendorId}/portfolio`, { image_url, caption: caption.trim() || null });
      showToast('Photo added.');
      setPendingUpload(null);
      setCaption('');
      loadPhotos(vendorId);
    } catch (e) { showToast(errText(e), true); }
    finally { setUploading(false); }
  };

  const open = photos.find(p => p.id === openId) || null;
  const closeCard = () => { setOpenId(null); setReason(''); };

  // each act re-reads her pictures, so what the card shows is what the server holds
  const act = async (run: () => Promise<unknown>, done: string) => {
    setBusy(true);
    try { await run(); showToast(done); closeCard(); await loadPhotos(vendorId); }
    catch (e) { showToast(errText(e), true); }
    finally { setBusy(false); }
  };

  const badge = (p: VendorPicture) => {
    const st = pictureState(p);
    const tone = st === 'held' ? 'var(--role-critical)' : st === 'shown' ? T.gold : T.muted;
    return <span data-state={st} style={{ fontFamily: T.ff.label, fontSize: 7, fontWeight: 600, color: tone, border: `0.5px solid ${T.border}`, borderRadius: 20, padding: '2px 8px', letterSpacing: '0.1em' }}>{STATE_BADGE[st]}</span>;
  };

  return (
    <div data-vendor-pictures="">
      <PageHeader title={WORDS.vendorTitle} sub={WORDS.vendorSub} />

      {/* Vendor picker */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 9, color: T.soft, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 8 }}>{WORDS.pickVendor}</div>
        <select
          value={vendorId}
          onChange={e => handleVendorChange(e.target.value)}
          style={{ width: '100%', background: 'var(--atelier-input-bg)', border: `0.5px solid ${vendorId ? T.gold : T.border}`, borderRadius: 10, padding: '14px 16px', fontFamily: T.ff.body, fontSize: 14, color: vendorId ? T.ink : T.soft, outline: 'none', minHeight: 52, appearance: 'none' as const }}
        >
          <option value="">{WORDS.pickVendor}</option>
          {vendors.map(v => (
            <option key={v.id} value={v.id}>{v.name} {v.category ? `· ${v.category}` : ''} {v.city ? `· ${v.city}` : ''}</option>
          ))}
        </select>
      </div>

      {selectedVendor && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: T.goldSoft, border: `0.5px solid ${T.borderStrong}`, borderRadius: 12, padding: '12px 16px', marginBottom: 24 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: T.goldSoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 14, color: T.gold }}>{selectedVendor.name[0]}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: T.ff.body, fontSize: 14, fontWeight: 600, color: T.ink }}>{selectedVendor.name}</div>
            <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em' }}>{selectedVendor.category || ''} · {selectedVendor.city || ''} · {selectedVendor.tier}</div>
          </div>
          <div style={{ marginLeft: 'auto', fontFamily: T.ff.label, fontSize: 8, color: T.soft }}>
            {photos.length} picture{photos.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}

      {vendorId && (
        <>
          <UploadZone onFile={handleFile} onUrl={handleUrl} loading={uploading} />

          {showCaption && pendingUpload && (
            <div style={{ background: T.card, border: `0.5px solid ${T.borderStrong}`, borderRadius: 14, padding: 20, marginTop: 16, marginBottom: 8 }}>
              <p style={{ fontFamily: T.ff.label, fontWeight: 600, fontSize: 10, color: T.gold, letterSpacing: '0.16em', textTransform: 'uppercase' as const, marginBottom: 12 }}>Add Caption</p>
              {pendingUpload.type === 'file' && (
                <div style={{ fontFamily: T.ff.label, fontSize: 9, color: T.soft, marginBottom: 14 }}>{pendingUpload.file.name}</div>
              )}
              <FieldInput label="Caption (optional)" value={caption} onChange={setCaption} placeholder="Bridal lehenga shoot, Delhi 2025" />
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <GhostBtn label="Cancel" onClick={cancelUpload} />
                <GoldBtn label={uploading ? 'Uploading…' : 'Upload Photo'} onClick={submitUpload} disabled={uploading} />
              </div>
            </div>
          )}

          <SectionDivider label={`${photos.length} picture${photos.length !== 1 ? 's' : ''}`} />
          {loading ? <LoadingGrid /> : photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: T.ff.body, fontSize: 13, color: T.muted }}>{WORDS.noPictures}</div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 }}>
              {photos.map(p => (
                <button key={p.id} type="button" onClick={() => { setOpenId(p.id); setReason(''); }} data-picture={p.id}
                  style={{ textAlign: 'left', padding: 0, background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 13, overflow: 'hidden', cursor: 'pointer', color: 'inherit' }}>
                  <div style={{ aspectRatio: '3/4', overflow: 'hidden', background: 'var(--atelier-section-bg)', opacity: p.held ? 0.5 : 1 }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.image_url} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} loading="lazy" />
                  </div>
                  <div style={{ padding: '8px 10px 10px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <div>{badge(p)}</div>
                    {p.caption && <div style={{ fontFamily: T.ff.body, fontSize: 11, color: T.soft, overflowWrap: 'anywhere' }}>{p.caption}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {open && (() => {
        const st = pictureState(open);
        return (
          <Sheet title="Picture" sub={STATE_LINE[st]} onClose={closeCard}>
            {st === 'held' && <SheetRow label={WORDS.release} busy={busy} onClick={() => act(() => releasePicture(open.id, 'portfolio'), WORDS.released)} />}
            {st !== 'held' && !open.hidden_from_discover && <SheetRow label={WORDS.hide} sub="It stays on her pages." busy={busy} onClick={() => act(() => hideFromDiscover(open.id), WORDS.hidden)} />}
            {st !== 'held' && open.hidden_from_discover && <SheetRow label={WORDS.show} busy={busy} onClick={() => act(() => showOnDiscover(open.id), WORDS.shownAgain)} />}
            <SheetNote>
              <label style={{ display: 'block' }}>
                <span style={{ display: 'block', marginBottom: 6 }}>{WORDS.legalField}</span>
                <textarea value={reason} onChange={e => setReason(e.target.value.slice(0, LEGAL_MAX))} maxLength={LEGAL_MAX} rows={2} data-legal-reason=""
                  style={{ width: '100%', background: 'var(--atelier-input-bg)', border: `0.5px solid ${T.border}`, borderRadius: 8, padding: '9px 11px', fontFamily: T.ff.body, fontSize: 13, color: T.ink, outline: 'none', resize: 'vertical' }} />
                <span style={{ display: 'block', marginTop: 4 }}>{WORDS.legalHint}</span>
              </label>
            </SheetNote>
            <DangerLast label={WORDS.legalLabel} lost={WORDS.legalLost} confirmWord={WORDS.legalConfirm}
              onConfirm={async () => { if (!legalReasonOk(reason)) throw new Error(WORDS.legalHint); await legalRemoval(open.id, reason, 'portfolio'); showToast(WORDS.removed); closeCard(); await loadPhotos(vendorId); }} />
          </Sheet>
        );
      })()}

      {!vendorId && (
        <div style={{ textAlign: 'center', padding: '48px 0' }}>
          <div style={{ fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 22, color: T.muted }}>{WORDS.pickVendor}</div>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}

// `useSearchParams` requires a Suspense boundary in the app router, or the whole
// route opts into client-side rendering at build time. The fallback is the page's
// own empty state, so an arriving deep link never flashes a spinner.
export default function VendorPortfolioPage() {
  return (
    <Suspense fallback={null}>
      <VendorPortfolioInner />
    </Suspense>
  );
}
