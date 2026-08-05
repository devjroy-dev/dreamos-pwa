'use client';
// /wedding/discover/submit — Multi-step Discover request · Atelier rebuild
// Step 1 rates · Step 2 aesthetic tags · Step 3 pitch · Step 4 sample images

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { submitDiscoverRequest, fetchPortfolio } from '@/lib/vendor/api/vendor';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import type { PortfolioImage } from '@/lib/vendor/types/vendor';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

const AESTHETIC_OPTIONS = ['moody', 'editorial', 'film', 'candid', 'traditional', 'destination', 'luxury', 'intimate', 'documentary', 'fine-art'];

const STEP_LABELS = ['Rates', 'Aesthetic', 'Pitch', 'Samples'];

export default function DiscoverSubmitPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <SubmitScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function SubmitScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [step, setStep] = useState(1);
  const [rateMin, setRateMin] = useState('');
  // TDW_07 P4b · F4 — `rateMax` state RETIRED with its field. Nothing collects it, nothing
  // sends it, nothing gates on it.
  const [tags, setTags] = useState<string[]>([]);
  const [pitch, setPitch] = useState('');
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [sampleIds, setSampleIds] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchPortfolio(vendorId, 'all').then(res => { if (res.ok) setImages(res.images); });
  }, [vendorId]);

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 10));
  }
  function toggleSample(id: string) {
    setSampleIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 5 ? [...prev, id] : prev);
  }

  async function submit() {
    if (submitting) return;
    if (sampleIds.length < 3) { show('Select at least 3 sample images.', 'error'); return; }
    setSubmitting(true);
    try {
      const res = await submitDiscoverRequest({
        // F4 — `rate_max` is no longer sent. The server's gate is min-only and its write
        // no longer stores the column; sending a value nothing reads is a lie about the
        // contract, and sending Number('') would have posted NaN.
        rate_min: Number(rateMin),
        aesthetic_tags: tags, pitch: pitch.trim() || undefined,
        sample_image_ids: sampleIds,
      });
      if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
      show('Application submitted!', 'success');
      setTimeout(() => router.push('/vendor/discover'), 1200);
    } catch { show('Network error.', 'error'); }
    finally { setSubmitting(false); }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', boxSizing: 'border-box',
    background: 'var(--atelier-input-bg)', border: '0.5px solid rgba(201,168,76,0.28)', borderRadius: 2,
    fontFamily: F.body, fontWeight: 300, fontSize: 14, color: A.ink, outline: 'none',
    caretColor: A.brass, colorScheme: 'dark',
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(201,168,76,0.12)' }}>
        <button type="button" onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 22, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Request Discover</span>
        <span style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 13, color: A.inkMute }}>{step} of 4</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 4, padding: '14px 22px 0' }}>
        {[1,2,3,4].map(n => (
          <div key={n} style={{
            flex: 1, height: 2,
            background: n <= step ? A.brassWarm : 'rgba(201,168,76,0.2)',
            boxShadow: n === step ? '0 0 6px rgba(224,188,110,0.4)' : 'none',
            transition: 'all 200ms ease',
          }} />
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '24px 22px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        <div>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 6 }}>Step {step}</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 28, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>{STEP_LABELS[step - 1]}</div>
        </div>

        {step === 1 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
              Brides on Discover see your range. Be honest — Swati matches by budget fit.
            </div>
            {/* TDW_07 P4b · F4 (WIDENED) — THE MAX FIELD IS REMOVED-BY-RULING.
                Control inventory (CE-115): the Max (Rs) input is the ONE control this
                sitting removes from a live surface, and it is removed by ruling rather than
                by tidying. Couples read a STARTING price; `rate_max` never reached a couple
                surface for a real vendor. It was a required field gating a vendor's entry to
                Discover on a number nobody would ever read.
                The Min field is untouched, and its label already carried the register. */}
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Min (Rs)</label>
                <input type="number" value={rateMin} onChange={e => setRateMin(e.target.value)} style={inputStyle} placeholder="100000" />
              </div>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
              Choose up to ten that describe your work. Brides filter by these.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
              {AESTHETIC_OPTIONS.map(tag => {
                const on = tags.includes(tag);
                return (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)} style={{
                    padding: '7px 14px', borderRadius: 2, cursor: 'pointer',
                    background: on ? 'rgba(201,168,76,0.18)' : 'transparent',
                    border: `0.5px solid ${on ? 'rgba(201,168,76,0.5)' : 'rgba(201,168,76,0.22)'}`,
                    fontFamily: F.label, fontWeight: 300, fontSize: 9,
                    color: on ? A.brassWarm : A.inkMute,
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                  }}>{tag}</button>
                );
              })}
            </div>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute }}>{tags.length} of 10 selected</div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
              Tell Swati why your work belongs. Experience, signature, notable weddings.
            </div>
            <textarea
              value={pitch}
              onChange={e => setPitch(e.target.value.slice(0, 500))}
              rows={6}
              placeholder="Twelve years of weddings, signature documentary style, recent feature in Vogue India…"
              style={{ ...inputStyle, resize: 'none', fontFamily: F.script, fontStyle: pitch ? 'normal' : 'italic', fontSize: 15, lineHeight: 1.5 }}
            />
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, textAlign: 'right' }}>{pitch.length} of 500</div>
          </>
        )}

        {step === 4 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 14, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
              Pick three to five that represent your best work.
            </div>
            {images.length === 0 ? (
              <div style={{
                fontFamily: F.script, fontStyle: 'italic', fontWeight: 300,
                fontSize: 15, color: A.inkMute, textAlign: 'center', padding: '40px 20px',
                lineHeight: 1.5,
              }}>
                No portfolio images yet.<br />
                <button type="button" onClick={() => router.push('/vendor/portfolio')} style={{
                  marginTop: 12, padding: '10px 22px', background: 'transparent',
                  border: '0.5px solid rgba(201,168,76,0.4)', borderRadius: 2, cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
                  letterSpacing: '0.36em', textTransform: 'uppercase',
                }}>Upload first</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                {images.map(img => {
                  const on = sampleIds.includes(img.id);
                  return (
                    <button key={img.id} type="button" onClick={() => toggleSample(img.id)} style={{
                      aspectRatio: '1', overflow: 'hidden', position: 'relative',
                      border: on ? `1px solid ${A.brassWarm}` : '0.5px solid rgba(201,168,76,0.22)',
                      cursor: 'pointer', background: 'none', padding: 0, borderRadius: 0,
                      boxShadow: on ? '0 0 0 1px rgba(224,188,110,0.4)' : 'none',
                      transition: 'all 150ms ease',
                    }}>
                      <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      {on && (
                        <div style={{
                          position: 'absolute', inset: 0,
                          background: 'rgba(26,18,14,0.5)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          <span style={{
                            width: 26, height: 26, borderRadius: '50%',
                            background: 'linear-gradient(180deg, var(--role-metal) 0%, var(--role-metal) 100%)',
                            border: '0.5px solid var(--atelier-label)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#1A120E', fontFamily: F.display, fontSize: 14, lineHeight: 1,
                          }}>✓</span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 12, color: A.inkMute, textAlign: 'center' }}>{sampleIds.length} selected · need 3 to 5</div>
          </>
        )}
      </div>

      <div style={{ padding: '12px 22px calc(20px + env(safe-area-inset-bottom))', borderTop: '0.5px solid rgba(201,168,76,0.18)' }}>
        {step < 4 ? (
          <button type="button" onClick={() => setStep(s => s + 1)}
            disabled={
              // F4 — min-only, mirroring the server's gate exactly. The min>max comparison
              // retires with the bound it compared against.
              (step === 1 && !rateMin) ||
              (step === 2 && tags.length === 0) ||
              (step === 3 && pitch.trim().length === 0)
            }
            className="atelier-fab"
            style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)', cursor: 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
              letterSpacing: '0.5em', textTransform: 'uppercase',
            }}>Continue</button>
        ) : (
          <button type="button" onClick={submit} disabled={submitting || sampleIds.length < 3}
            className="atelier-fab"
            style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)',
              cursor: (submitting || sampleIds.length < 3) ? 'default' : 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
              letterSpacing: '0.5em', textTransform: 'uppercase',
              opacity: (submitting || sampleIds.length < 3) ? 0.5 : 1,
            }}>{submitting ? 'Submitting…' : 'Submit Application'}</button>
        )}
      </div>
    </div>
  );
}
