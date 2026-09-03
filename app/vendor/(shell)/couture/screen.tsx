// R-37.84 (3): Cormorant italic dies in room prose. ZIP 7 moved the `script` ROLE to the
// body family; what survived was `fontStyle: italic` set beside it — italic sans, which
// still reads as the old voice. The mock's screen four killed the pairing, not just the
// family. Italic survives only where a surface sets it WITHOUT the script role.
'use client';
// app/vendor/couture/screen.tsx — COUTURE'S BODY, ONE DEFINITION, NO CHROME.
//
// ── §4-3 · COUTURE CROSSES · R-38.11 · R-38.12 ──────────────────────────────
// Two routes render this module and neither owns it: `app/w/couture/page.tsx` mounts it
// inside `WorklistShell`, and `app/vendor/couture/page.tsx` survives as the untouched
// fallback and supplies the old `<Header/>` itself. IMPORTED by both, copied by neither —
// two couture screens would be two homes for every slot, every appointment and every
// vetoed byte, drifting apart without either one erroring.
//
// ── THE `Header` IMPORT IS GONE FROM THIS FILE AND ITS ABSENCE IS ASSERTED ──
// S2 paid for this lesson once: `SliceShell` kept `import { Header }` and wrote
// `{chrome && <Header/>}`. It rendered correctly and STILL shipped the old masthead — its
// drawer, its /vendor rows, its banned bytes — into every crossed room's chunk. A
// conditional does not remove a module from a bundle; only not importing it does.
//
// ── COUTURE IS THE ONE ROOM IN THIS BATCH WHOSE MOUNT CENSUS ACTUALLY SHRINKS ─
// It carried TWO `<Header/>` mounts, not one, and they were in two RETURN ARMS of this one
// component: the ineligible gate at the top and the main screen below it. Storefront and
// Portfolio each had one, so their mount MOVES to the fallback route and the census holds
// (calendar's §4-2 precedent). Couture's two collapse into the fallback's one, so
// `INTERIM_VENDOR_MOUNTS` goes 2 → 1 for this file. That is a shrink that happened, not a
// number edited to match a sentence — R-38.11 as amended, working in the direction it is
// supposed to.
//
// ── `vendorName` LEFT WITH THE MOUNTS ───────────────────────────────────────
// It was read by exactly two things, both `<Header vendorName={…}/>`. Derived, not assumed:
// after the lift the only occurrence in this file was the signature. An unused prop is a
// named, typed hole the next reader fills — and then the body knows the vendor's name for
// no reason, on a surface that must not print it.
//
// ── THE DECLARED GAPS, NAMED HERE AND NOT ONLY IN A HANDOVER ────────────────
// This body did NOT cross typographically (R-38.12). It carries the rooms' older type
// register and its own colour literals (F-38.22's family), and its sheets are
// `position:fixed`, so inside the shell they sit over the dock and the nav exactly as
// calendar's have since §4-2. Captured, excluded from the render arm's tuple cell by name,
// and priced — not swept inside a structural crossing.

import { useEffect, useState } from 'react';
import { INK_DEEP } from '@/lib/vendor/theme';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { COPY } from '@/lib/worklist/copy';
import { roomHref } from '@/lib/worklist/rooms';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchMe, fetchCoutureSlots, addCoutureSlot, removeCoutureSlot, fetchCoutureAppointments } from '@/lib/vendor/api/vendor';
import type { CoutureSlot, CoutureAppointment } from '@/lib/vendor/types/vendor';

const A = {
  // R-37.74 arm (iii): the interactive half of the old `brass`. Buttons, chips, carets
  // and active states read this; the wordmark, section headers and hairlines keep `brass`.
  interactive:     'var(--atelier-accent-text)',
  interactiveWarm: 'var(--atelier-accent-text)',
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', brassLine: 'rgba(201,168,76,0.18)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-dm-sans), system-ui, sans-serif' /* R-37.76 (3)+(7): Cormorant is RETIRED FROM PROSE. The rooms were setting body copy in Cormorant italic while the shell set it in DM Sans, and that — not size — is why they read as two font worlds. One family, one job. Cormorant's feature use survives where a surface deliberately calls for it. */,
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

export function CoutureScreen({ vendorId }: { vendorId: string }) {
  const router = useRouter();
  const { toast, show } = useToast();
  const [eligible, setEligible] = useState<boolean | null>(null);
  const [tab, setTab] = useState<'availability' | 'appointments'>('availability');
  const [slots, setSlots] = useState<CoutureSlot[]>([]);
  const [appointments, setAppointments] = useState<CoutureAppointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [slotAt, setSlotAt] = useState('');
  const [feeInr, setFeeInr] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMe().then(res => { if (res.ok) setEligible((res.vendor as unknown as { couture_eligible?: boolean }).couture_eligible ?? false); });
  }, []);

  useEffect(() => {
    if (eligible === null) return;
    setLoading(true);
    Promise.all([fetchCoutureSlots('all'), fetchCoutureAppointments('all')])
      .then(([sRes, aRes]) => {
        if (sRes.ok) setSlots(sRes.slots);
        if (aRes.ok) setAppointments(aRes.appointments);
      }).catch(() => {}).finally(() => setLoading(false));
  }, [eligible]);

  async function doAddSlot() {
    if (!slotAt || !feeInr || saving) return;
    setSaving(true);
    const res = await addCoutureSlot({ slot_at: slotAt, fee_inr: Number(feeInr) });
    if (!res.ok) show((res as { error?: string }).error ?? 'Failed.', 'error');
    else { show('Slot added', 'success'); setAddOpen(false); setSlotAt(''); setFeeInr(''); setSlots(prev => [res.slot, ...prev]); }
    setSaving(false);
  }
  async function doRemoveSlot(slotId: string) {
    const res = await removeCoutureSlot(slotId);
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed.', 'error'); return; }
    show('Slot removed', 'success');
    setSlots(prev => prev.filter(s => s.id !== slotId));
  }
  function fmtDate(iso: string) {
    try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
  }

  if (eligible === false) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
        {/* THE FIRST OF THE TWO MOUNTS THAT LEFT. The ineligible gate carried its own
            Header (named without its angle brackets on purpose — C26's census counts
            JSX mounts by that token, and a sentence saying a mount LEFT must not read
            as one that stayed) because on /vendor it is the whole surface a non-couture vendor ever
            sees, and a screen with no masthead there has no way out. It is mounted at the
            fallback ROUTE now, which covers both arms with one, and inside the shell the
            chrome is WorklistShell's. */}
        <div className="atelier-card atelier-card-ornate" style={{
          margin: '40px var(--slice-inset, 22px)', padding: '32px 24px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 12 }}>{COPY.coutureGateLabel}</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', marginBottom: 12, lineHeight: 1.15 }}>By appointment only.</div>
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.55, marginBottom: 20 }}>
            {/* R-39.6 · the vetoed byte is ONE string in lib/worklist/copy.ts; the link word
                is split out of it here so the sentence and its door share a home. */}
            {COPY.coutureGateSentence.split(COPY.coutureGateLinkWord)[0]}
            <Link href={roomHref('billing')} style={{ color: A.interactiveWarm, textDecoration: 'underline', textUnderlineOffset: 3 }}>{COPY.coutureGateLinkWord}</Link>
            {COPY.coutureGateSentence.split(COPY.coutureGateLinkWord)[1]}
          </div>
          <button type="button" onClick={() => router.back()} style={{
            padding: '12px 24px', background: 'transparent',
            border: `0.5px solid rgba(201,168,76,0.32)`, borderRadius: 2, cursor: 'pointer',
            fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.interactiveWarm,
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />

      {/* ── THE BACK/LABEL ROW IS THE OLD LAYOUT'S CHROME, AND ONLY THE ROW'S LEFT HALF ──
          Inside the shell the chevron and the word are the two-mastheads defect one level
          down from where R-38.1 removed it: WorklistShell already prints 「Couture」 in its
          header and already owns the way out, and there is no chevron in the shell by
          construction — the two nav seats are the way back. Same contract Billing and
          Settings crossed under at S1 and the list family at §4-1.
          THE ROW ITSELF SURVIVES BOTH WAYS, because its right half is 「+ Slot」, which is
          this screen's only way to add availability. Retiring the row to retire the word
          would have taken the action with it. The spacer replaces the label's `flex: 1` so
          the action stays where the thumb already knows to find it. */}
      <div style={{ padding: '12px var(--slice-inset, 22px)', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        
        {<div style={{ flex: 1 }} />}
        {tab === 'availability' && eligible && (
          <button type="button" onClick={() => setAddOpen(true)} className="atelier-fab" style={{
            padding: '8px 16px', borderRadius: 2, cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: INK_DEEP,
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>+ Slot</button>
        )}
      </div>

      <div style={{ display: 'flex' }}>
        {(['availability', 'appointments'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: tab === t ? 400 : 300, fontSize: 9,
            color: tab === t ? A.interactiveWarm : A.inkMute,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            borderBottom: tab === t ? `0.5px solid ${A.interactive}` : '0.5px solid rgba(201,168,76,0.08)',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px var(--slice-inset, 22px) 100px' }}>
        {loading ? (
          <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, textAlign: 'center', padding: 40 }}>Loading…</div>
        ) : tab === 'availability' ? (
          slots.length === 0 ? (
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, color: A.inkMute, textAlign: 'center', paddingTop: 32, lineHeight: 1.5 }}>No slots yet.<br /><span style={{ color: A.brassWarm }}>Add your first.</span></div>
          ) : slots.map(slot => (
            <div key={slot.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 4px', gap: 14, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' }}>{fmtDate(slot.slot_at)}</div>
                <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 3 }}>
                  Rs {slot.fee_inr.toLocaleString('en-IN')} · {slot.duration_minutes} min · <span style={{ color: slot.state === 'open' ? A.brassWarm : A.inkMute }}>{slot.state}</span>
                </div>
              </div>
              {slot.state === 'open' && (
                <button type="button" onClick={() => doRemoveSlot(slot.id)} style={{
                  background: 'none', border: '0.5px solid rgba(224,123,92,0.4)', borderRadius: 2,
                  padding: '5px 10px', cursor: 'pointer',
                  fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.red,
                  letterSpacing: '0.28em', textTransform: 'uppercase',
                }}>Remove</button>
              )}
            </div>
          ))
        ) : (
          appointments.length === 0 ? (
            <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, textAlign: 'center', paddingTop: 32 }}>No appointments yet.</div>
          ) : appointments.map(appt => (
            <div key={appt.id} className="atelier-card" style={{ padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink }}>{fmtDate(appt.appointment_at)}</div>
              <div style={{ fontFamily: F.script, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 3 }}>
                Rs {appt.fee_inr.toLocaleString('en-IN')} · {appt.state}
              </div>
            </div>
          ))
        )}
      </div>

      {addOpen && (
        <>
          <div onClick={() => setAddOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40, background: 'var(--atelier-overlay)' }} />
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            background: 'var(--atelier-sheet-bg)',
            backdropFilter: 'blur(40px) saturate(1.8)', WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
            borderTop: '0.5px solid var(--atelier-sheet-border)',
            padding: '16px 24px calc(24px + env(safe-area-inset-bottom))',
          }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
              <div style={{ width: 36, height: 3, borderRadius: 2, background: 'var(--atelier-label)' }} />
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, marginBottom: 10 }}>New Slot</div>

            <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Date & Time</label>
            <input type="datetime-local" value={slotAt} onChange={e => setSlotAt(e.target.value)} style={{
              width: '100%', padding: '12px 14px', boxSizing: 'border-box',
              background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
              fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
               marginBottom: 14, caretColor: A.interactive,
            }} />

            <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Fee (Rs)</label>
            <input type="number" value={feeInr} onChange={e => setFeeInr(e.target.value)} placeholder="3000" style={{
              width: '100%', padding: '12px 14px', boxSizing: 'border-box',
              background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
              fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
              marginBottom: 16, caretColor: A.interactive,
            }} />

            <button type="button" onClick={doAddSlot} disabled={saving || !slotAt || !feeInr} className="atelier-fab" style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)',
              cursor: (saving || !slotAt || !feeInr) ? 'default' : 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: INK_DEEP,
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (saving || !slotAt || !feeInr) ? 0.5 : 1,
            }}>{saving ? 'Saving…' : 'Add Slot'}</button>
          </div>
        </>
      )}
    </div>
  );
}
