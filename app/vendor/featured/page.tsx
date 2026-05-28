'use client';
// /wedding/featured — Featured · Atelier rebuild
// Promo slot submissions. Gated on featured_eligible.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchMe, fetchFeaturedSubmissions, submitFeatured, fetchPortfolio } from '@/lib/vendor/api/vendor';
import type { FeaturedSubmission, PortfolioImage } from '@/lib/vendor/types/vendor';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: '#C9A84C', brassWarm: 'var(--atelier-label)', red: '#E07B5C',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const SLOT_KINDS = [
  { value: 'spotlight',            label: 'Spotlight',            fee: 'Rs 3,000 / week' },
  { value: 'discover_top',         label: 'Discover Top',         fee: 'Rs 5,000 / week' },
  { value: 'blind_swipe_priority', label: 'Blind Swipe Priority', fee: 'Rs 2,000 / week' },
  { value: 'newsletter',           label: 'Newsletter',           fee: 'Rs 1,500 / inclusion' },
];

export default function FeaturedPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <FeaturedScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function FeaturedScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [submissions, setSubmissions] = useState<FeaturedSubmission[]>([]);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [slotKind, setSlotKind] = useState('spotlight');
  const [heroImageId, setHeroImageId] = useState('');
  const [caption, setCaption] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMe().then(res => { if (res.ok) setEligible((res.vendor as unknown as { featured_eligible?: boolean }).featured_eligible ?? false); });
    fetchFeaturedSubmissions().then(res => { if (res.ok) setSubmissions(res.submissions); });
    fetchPortfolio(vendorId, 'approved').then(res => { if (res.ok) setImages(res.images); });
  }, [vendorId]);

  async function doSubmit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await submitFeatured({
        slot_kind: slotKind, hero_image_id: heroImageId || undefined,
        caption: caption.trim() || undefined,
        proposed_start_date: startDate || undefined, proposed_end_date: endDate || undefined,
      });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
      show('Application submitted', 'success');
      setFormOpen(false);
      fetchFeaturedSubmissions().then(r => { if (r.ok) setSubmissions(r.submissions); });
    } catch { show('Network error.', 'error'); }
    finally { setSubmitting(false); }
  }

  const stateColor = (s: string) => ['approved','live'].includes(s) ? A.brassWarm : s === 'rejected' || s === 'refunded' ? A.red : A.inkMute;

  if (eligible === false) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        <Header vendorName={vendorName} />
        <div className="atelier-card atelier-card-ornate" style={{ margin: '40px 22px', padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 12 }}>Featured · Locked</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 26, color: 'var(--atelier-ink)', marginBottom: 12, lineHeight: 1.15 }}>Discover first.</div>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkSoft, lineHeight: 1.55, marginBottom: 20 }}>
            Featured promos unlock once you&apos;re approved for Discover.
          </div>
          <button type="button" onClick={() => router.push('/vendor/discover')} className="atelier-fab" style={{
            padding: '12px 24px', borderRadius: 2, cursor: 'pointer', border: '0.5px solid #E0BC6E',
            fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
            letterSpacing: '0.42em', textTransform: 'uppercase',
          }}>Apply for Discover</button>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
    fontFamily: F.body, fontWeight: 300, fontSize: 14, color: A.ink, outline: 'none',
    colorScheme: 'dark', marginBottom: 14, caretColor: A.brass,
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Featured</span>
        {eligible && (
          <button type="button" onClick={() => setFormOpen(true)} className="atelier-fab" style={{
            padding: '8px 16px', borderRadius: 2, cursor: 'pointer', border: '0.5px solid #E0BC6E',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>Apply</button>
        )}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 22px 32px' }}>
        {submissions.length === 0 ? (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, textAlign: 'center', paddingTop: 32, lineHeight: 1.5 }}>
            No submissions yet.<br />
            <span style={{ color: A.brassWarm }}>Apply for your first slot above.</span>
          </div>
        ) : submissions.map(sub => (
          <div key={sub.id} className="atelier-card" style={{ padding: '14px 18px', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 17, color: A.ink, letterSpacing: '0.005em' }}>{SLOT_KINDS.find(k => k.value === sub.slot_kind)?.label ?? sub.slot_kind}</div>
              <span style={{
                fontFamily: F.label, fontWeight: 400, fontSize: 8, color: stateColor(sub.state),
                letterSpacing: '0.28em', textTransform: 'uppercase',
                border: `0.5px solid ${stateColor(sub.state)}`, borderRadius: 2, padding: '4px 9px',
              }}>{sub.state}</span>
            </div>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: A.inkMute }}>
              Rs {sub.fee_inr.toLocaleString('en-IN')}
            </div>
            {sub.rejection_reason && (
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.red, marginTop: 6 }}>{sub.rejection_reason}</div>
            )}
          </div>
        ))}
      </div>

      {formOpen && (
        <>
          <div onClick={() => setFormOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'var(--atelier-overlay)' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            maxHeight: '88dvh', display: 'flex', flexDirection: 'column',
          }}>
            <div style={{ padding: '14px 24px 12px', borderBottom: '0.5px solid var(--atelier-card-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
                <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
              </div>
              <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 4 }}>New Application</div>
              <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 22, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>Apply for Featured</div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '16px 24px' }}>
              <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Slot type</label>
              <select value={slotKind} onChange={e => setSlotKind(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                {SLOT_KINDS.map(k => <option key={k.value} value={k.value}>{k.label} — {k.fee}</option>)}
              </select>
              <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Hero image</label>
              <select value={heroImageId} onChange={e => setHeroImageId(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">None</option>
                {images.map(img => <option key={img.id} value={img.id}>{img.caption || img.id.slice(0, 8)}</option>)}
              </select>
              <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Caption</label>
              <input value={caption} onChange={e => setCaption(e.target.value)} placeholder="Award-winning wedding photographer" style={inputStyle} />
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Start date</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>End date</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>
            <div style={{ padding: '12px 24px calc(20px + env(safe-area-inset-bottom))', borderTop: '0.5px solid var(--atelier-card-border)' }}>
              <button type="button" onClick={doSubmit} disabled={submitting} className="atelier-fab" style={{
                width: '100%', padding: '14px 0', borderRadius: 2,
                border: '0.5px solid #E0BC6E', cursor: submitting ? 'default' : 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
                letterSpacing: '0.5em', textTransform: 'uppercase',
                opacity: submitting ? 0.5 : 1,
              }}>{submitting ? 'Submitting…' : 'Submit'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
