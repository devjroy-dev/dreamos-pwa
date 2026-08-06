'use client';
// /wedding/discover/submit — Multi-step Discover request · Atelier rebuild
// Step 1 rates · Step 2 aesthetic tags · Step 3 pitch

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { submitDiscoverRequest } from '@/lib/vendor/api/vendor';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';

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

const STEP_LABELS = ['Rates', 'Aesthetic', 'Pitch'];   // 'Samples' retired — F-10.53

export default function DiscoverSubmitPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <SubmitScreen vendorName={session.name ?? null} />;
}

// `vendorId` retired from this screen's props with the fetch it existed for:
// the request is authorised by the SESSION at the server, never by an id the
// client passes, so nothing else here ever needed it.
function SubmitScreen({ vendorName }: { vendorName: string | null }) {
  const router = useRouter();
  const { toast, show } = useToast();
  // ── F-10.53 CURED · THE FOURTH STEP IS GONE, FOUNDER-RULED ────────────────
  // 「 3 to 5 photo is from the legacy era. it has no bearing whatso ever now 」
  //
  // WHAT IT WAS. Step 4 asked the vendor to pick three to five samples and
  // BLOCKED submission until she did. The server validated that they belonged to
  // her — and wrote them NOWHERE. Derived before the diagnosis was offered:
  // `grep -rn sample_image_ids src/ db/ docs/db/` in dream-os returned six lines,
  // all inside one validation block, and `sample` appears ZERO times in
  // PUBLIC_SCHEMA.md. No column could hold them; nothing read them; the deck
  // never saw them. A required gate on a field with no reader.
  //
  // WHY DELETED RATHER THAN WIRED. Both arms were brought — give the samples a
  // home (the deck's hero strip, which is what the step READS like it is for), or
  // delete the step. The founder ruled: legacy, no bearing. So the vendor gets a
  // screen back rather than the estate getting a feature nobody asked for.
  //
  // THE SERVER'S VALIDATION BLOCK DIES WITH IT, in the paired dream-os ZIP —
  // wire-or-delete-at-birth (Block 09). A validator for a field no caller sends
  // is the dead-code class, and leaving it would have made the next reader think
  // samples were still a contract.
  const [step, setStep] = useState(1);
  const [rateMin, setRateMin] = useState('');
  // TDW_07 P4b · F4 — `rateMax` state RETIRED with its field. Nothing collects it, nothing
  // sends it, nothing gates on it.
  const [tags, setTags] = useState<string[]>([]);
  const [pitch, setPitch] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // THE PORTFOLIO FETCH DIES WITH THE STEP IT FED. `images` had exactly one
  // consumer — the sample grid — so keeping the call would have been a network
  // round trip on every submit-flow open, for a list nothing renders.
  // Wire-or-delete-at-birth (Block 09), applied to a retirement.

  function toggleTag(tag: string) {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 10));
  }
  async function submit() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await submitDiscoverRequest({
        // F4 — `rate_max` is no longer sent. The server's gate is min-only and its write
        // no longer stores the column; sending a value nothing reads is a lie about the
        // contract, and sending Number('') would have posted NaN.
        rate_min: Number(rateMin),
        aesthetic_tags: tags, pitch: pitch.trim() || undefined,
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
    fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
    caretColor: A.brass, 
  };

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid rgba(201,168,76,0.12)' }}>
        <button type="button" onClick={() => step > 1 ? setStep(s => s - 1) : router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Request Discover</span>
        <span style={{ fontFamily: F.script, fontStyle: 'italic', fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{step} of 3</span>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 4, padding: '14px 22px 0' }}>
        {[1,2,3].map(n => (
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
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', lineHeight: 1.15 }}>{STEP_LABELS[step - 1]}</div>
        </div>

        {step === 1 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
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
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
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
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute }}>{tags.length} of 10 selected</div>
          </>
        )}

        {step === 3 && (
          <>
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, lineHeight: 1.55, marginTop: -8 }}>
              Tell Swati why your work belongs. Experience, signature, notable weddings.
            </div>
            <textarea
              value={pitch}
              onChange={e => setPitch(e.target.value.slice(0, 500))}
              rows={6}
              placeholder="Twelve years of weddings, signature documentary style, recent feature in Vogue India…"
              style={{ ...inputStyle, resize: 'none', fontFamily: F.script, fontStyle: pitch ? 'normal' : 'italic', fontSize: 16, lineHeight: 1.5 }}
            />
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, textAlign: 'right' }}>{pitch.length} of 500</div>
          </>
        )}

      </div>

      <div style={{ padding: '12px 22px calc(20px + env(safe-area-inset-bottom))', borderTop: '0.5px solid rgba(201,168,76,0.18)' }}>
        {step < 3 ? (
          <button type="button" onClick={() => setStep(s => s + 1)}
            disabled={
              // F4 — min-only, mirroring the server's gate exactly. The min>max comparison
              // retires with the bound it compared against.
              (step === 1 && !rateMin) ||
              (step === 2 && tags.length === 0)
            }
            className="atelier-fab"
            style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)', cursor: 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
              letterSpacing: '0.5em', textTransform: 'uppercase',
            }}>Continue</button>
        ) : (
          /* ── THE PITCH GATE, MOVED NOT DROPPED ──────────────────────────────
             Step 3 used to hand off to Continue, which required a non-empty pitch
             before letting the vendor reach step 4. With step 4 retired, step 3's
             button became SUBMIT — whose only guard was `submitting`. So deleting
             the samples step would have silently deleted the PITCH requirement
             with it, and an empty application would have reached the deck with no
             sentence on the card.
             A retirement that quietly removes a NEIGHBOURING gate is the regression
             class this estate calls worse than a missing feature. The gate moves
             here, where the last step now ends. */
          <button type="button" onClick={submit} disabled={submitting || pitch.trim().length === 0}
            className="atelier-fab"
            style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)',
              cursor: (submitting || pitch.trim().length === 0) ? 'default' : 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
              letterSpacing: '0.5em', textTransform: 'uppercase',
              opacity: (submitting || pitch.trim().length === 0) ? 0.5 : 1,
            }}>{submitting ? 'Submitting…' : 'Submit Application'}</button>
        )}
      </div>
    </div>
  );
}
