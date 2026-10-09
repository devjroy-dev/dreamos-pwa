'use client';
// app/admin/approvals/photos/page.tsx · CE-47 · WEB-4 admin package · R-47.2: "PICTURES TO LOOK AT".
// There is no approval queue any more (the founder's rule of 8 October 2026). Two lists, oldest first:
//   · held by the safety check (portfolio and look pictures): the one act is Release;
//   · reported by Dreamers: the admin hides the picture from Discover, or closes the report with No change.
// No remove button here. A removal for a legal reason is made from the vendor's own pictures (Open her pictures),
// where it asks for the reason. Doors and words: lib/admin-api/pictures.ts, the one home.
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader, T, Toast, SectionDivider, ActionChip } from '../../_components/AdminUI';
import {
  getPhotoQueue, releasePicture, closeReport, scoresLine, WORDS,
  type HeldPicture, type PictureReport,
} from '../../../../lib/admin-api/pictures';

const errText = (e: unknown) => (e instanceof Error && e.message ? e.message : WORDS.tryAgain);

function Picture({ url }: { url: string }) {
  return (
    <div style={{ aspectRatio: '3/4', background: 'var(--atelier-section-bg)', overflow: 'hidden' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" referrerPolicy="no-referrer" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
    </div>
  );
}
function VendorLine({ v, kind }: { v: HeldPicture['vendor']; kind: string }) {
  return (
    <>
      <div style={{ fontFamily: T.ff.body, fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{v?.business_name || WORDS.unknownVendor}</div>
      <div style={{ fontFamily: T.ff.label, fontSize: 8, color: T.soft, letterSpacing: '0.1em', marginBottom: 8 }}>{kind}{v?.category ? ` · ${v.category}` : ''}</div>
    </>
  );
}
const herPictures = (vendorId: string) => `/admin/vendors/portfolio?vendor=${encodeURIComponent(vendorId)}`;

export default function PicturesToLookAtPage() {
  const [held, setHeld]         = useState<HeldPicture[]>([]);
  const [reports, setReports]   = useState<PictureReport[]>([]);
  const [loading, setLoading]   = useState(true);
  const [failed, setFailed]     = useState(false);
  const [busy, setBusy]         = useState<string | null>(null);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);
  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true); setFailed(false);
    getPhotoQueue()
      .then((d) => { setHeld(d.held); setReports(d.reports); })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => { load(); }, [load]);

  const release = async (p: HeldPicture) => {
    setBusy(p.id);
    try { await releasePicture(p.id, p.kind); setHeld((xs) => xs.filter((x) => x.id !== p.id)); showToast(WORDS.released); }
    catch (e) { showToast(errText(e), true); }
    finally { setBusy(null); }
  };
  const close = async (r: PictureReport, outcome: 'hidden_from_discover' | 'no_change') => {
    setBusy(r.id);
    try { await closeReport(r.id, outcome); setReports((xs) => xs.filter((x) => x.id !== r.id)); showToast(outcome === 'hidden_from_discover' ? WORDS.hidden : WORDS.closed); }
    catch (e) { showToast(errText(e), true); }
    finally { setBusy(null); }
  };

  const grid = { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12 } as const;
  const card = { background: T.card, border: `0.5px solid ${T.border}`, borderRadius: 12, overflow: 'hidden' } as const;
  const note = { fontFamily: T.ff.body, fontSize: 12, color: T.muted, margin: '0 0 12px' } as const;
  const small = { fontFamily: T.ff.body, fontSize: 11, color: T.muted, marginBottom: 8, overflowWrap: 'anywhere' } as const;
  const link = { display: 'inline-block', fontFamily: T.ff.body, fontSize: 11, color: 'var(--role-metal)', marginTop: 8, minHeight: 24 } as const;

  return (
    <div data-pictures-to-look-at="">
      <PageHeader title={WORDS.title} sub={WORDS.sub} />

      {loading ? (
        <div style={grid}>{[1, 2, 3, 4].map((i) => <div key={i} className="shimmer" style={{ background: T.card, borderRadius: 12, aspectRatio: '3/4' }} />)}</div>
      ) : failed ? (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={note}>{WORDS.tryAgain}</p>
          <ActionChip label={WORDS.retry} tone="neutral" onClick={load} />
        </div>
      ) : held.length === 0 && reports.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px 0', color: T.muted, fontFamily: T.ff.display, fontStyle: 'italic', fontSize: 18 }}>{WORDS.empty}</div>
      ) : (
        <>
          <section data-held="">
            <SectionDivider label={`${WORDS.heldHeading} · ${held.length}`} />
            <p style={note}>{WORDS.heldNote}</p>
            <div style={grid}>
              {held.map((p) => {
                const scores = scoresLine(p.safety_scores);
                return (
                  <div key={`${p.kind}-${p.id}`} style={card}>
                    <Picture url={p.image_url} />
                    <div style={{ padding: '10px 10px 12px' }}>
                      <VendorLine v={p.vendor} kind={p.kind === 'look' ? WORDS.look : WORDS.portfolio} />
                      {scores && <div style={small}>{scores}</div>}
                      <ActionChip label={busy === p.id ? `${WORDS.release}…` : WORDS.release} tone="ok" disabled={busy === p.id} onClick={() => release(p)} />
                      <div><Link href={herPictures(p.vendor_id)} style={link}>{WORDS.openHers}</Link></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section data-reports="" style={{ marginTop: 24 }}>
            <SectionDivider label={`${WORDS.reportsHeading} · ${reports.length}`} />
            <p style={note}>{WORDS.reportsNote}</p>
            <div style={grid}>
              {reports.map((r) => {
                const alreadyHidden = !!(r.picture && r.picture.discover_hidden_at);
                return (
                  <div key={r.id} style={card}>
                    {r.picture ? <Picture url={r.picture.image_url} /> : null}
                    <div style={{ padding: '10px 10px 12px' }}>
                      <VendorLine v={r.vendor} kind={WORDS.portfolio} />
                      {r.reason_line && <div style={{ ...small, color: T.ink }}>{r.reason_line}</div>}
                      {r.note && <div style={small}>{r.note}</div>}
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        <ActionChip label={WORDS.noChange} tone="neutral" disabled={busy === r.id} onClick={() => close(r, 'no_change')} />
                        {!alreadyHidden && <ActionChip label={WORDS.hide} tone="no" disabled={busy === r.id} onClick={() => close(r, 'hidden_from_discover')} />}
                      </div>
                      <div><Link href={herPictures(r.vendor_id)} style={link}>{WORDS.openHers}</Link></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}
