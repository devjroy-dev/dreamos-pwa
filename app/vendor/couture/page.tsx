'use client';
// /wedding/couture — Couture · Atelier rebuild
// Availability + appointments. Gated on couture_eligible.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchMe, fetchCoutureSlots, addCoutureSlot, removeCoutureSlot, fetchCoutureAppointments } from '@/lib/vendor/api/vendor';
import type { CoutureSlot, CoutureAppointment } from '@/lib/vendor/types/vendor';

const A = {
  ink: 'var(--atelier-ink)', inkSoft: 'var(--atelier-ink-soft)', inkMute: 'var(--atelier-ink-mute)',
  brass: 'var(--role-metal)', brassWarm: 'var(--atelier-label)', brassLine: 'rgba(201,168,76,0.18)', red: 'var(--role-critical)',
} as const;
const F = {
  display: 'var(--font-italiana), "GFS Didot", Georgia, serif',
  script: 'var(--font-cormorant), Georgia, serif',
  body: 'var(--font-dm-sans), system-ui, sans-serif',
  label: 'var(--font-jost), system-ui, sans-serif',
} as const;

export default function CouturePage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1 }} />;
  return <CoutureScreen vendorId={session.id} vendorName={session.name ?? null} />;
}

function CoutureScreen({ vendorId, vendorName }: { vendorId: string; vendorName: string | null }) {
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
        <Header vendorName={vendorName} />
        <div className="atelier-card atelier-card-ornate" style={{
          margin: '40px 22px', padding: '32px 24px', textAlign: 'center',
        }}>
          <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.5em', textTransform: 'uppercase', color: A.brass, marginBottom: 12 }}>Couture · Invite Only</div>
          <div style={{ fontFamily: F.display, fontWeight: 400, fontSize: 25, color: 'var(--atelier-ink)', marginBottom: 12, lineHeight: 1.15 }}>By appointment only.</div>
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkSoft, lineHeight: 1.55, marginBottom: 20 }}>
            Couture access is reserved for invited makers.<br />Contact Swati to be considered.
          </div>
          <button type="button" onClick={() => router.back()} style={{
            padding: '12px 24px', background: 'transparent',
            border: `0.5px solid rgba(201,168,76,0.32)`, borderRadius: 2, cursor: 'pointer',
            fontFamily: F.label, fontWeight: 300, fontSize: 9, color: A.brassWarm,
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>Back</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      <div style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', gap: 12, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
        <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: A.brassWarm, fontFamily: F.display, fontSize: 20, lineHeight: 1 }}>‹</button>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, letterSpacing: '0.42em', textTransform: 'uppercase', color: A.brass, flex: 1 }}>Couture</span>
        {tab === 'availability' && eligible && (
          <button type="button" onClick={() => setAddOpen(true)} className="atelier-fab" style={{
            padding: '8px 16px', borderRadius: 2, cursor: 'pointer', border: '0.5px solid var(--atelier-label)',
            fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#1A120E',
            letterSpacing: '0.32em', textTransform: 'uppercase',
          }}>+ Slot</button>
        )}
      </div>

      <div style={{ display: 'flex' }}>
        {(['availability', 'appointments'] as const).map(t => (
          <button key={t} type="button" onClick={() => setTab(t)} style={{
            flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: F.label, fontWeight: tab === t ? 400 : 300, fontSize: 9,
            color: tab === t ? A.brassWarm : A.inkMute,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            borderBottom: tab === t ? `0.5px solid ${A.brass}` : '0.5px solid rgba(201,168,76,0.08)',
          }}>{t}</button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '20px 22px 100px' }}>
        {loading ? (
          <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, textAlign: 'center', padding: 40 }}>Loading…</div>
        ) : tab === 'availability' ? (
          slots.length === 0 ? (
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, color: A.inkMute, textAlign: 'center', paddingTop: 32, lineHeight: 1.5 }}>No slots yet.<br /><span style={{ color: A.brassWarm }}>Add your first.</span></div>
          ) : slots.map(slot => (
            <div key={slot.id} style={{ display: 'flex', alignItems: 'center', padding: '14px 4px', gap: 14, borderBottom: '0.5px solid var(--atelier-card-border)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink, letterSpacing: '0.005em' }}>{fmtDate(slot.slot_at)}</div>
                <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 3 }}>
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
            <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, textAlign: 'center', paddingTop: 32 }}>No appointments yet.</div>
          ) : appointments.map(appt => (
            <div key={appt.id} className="atelier-card" style={{ padding: '14px 18px', marginBottom: 10 }}>
              <div style={{ fontFamily: F.script, fontWeight: 500, fontSize: 16, lineHeight: 1.5, color: A.ink }}>{fmtDate(appt.appointment_at)}</div>
              <div style={{ fontFamily: F.script, fontStyle: 'italic', fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.inkMute, marginTop: 3 }}>
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
               marginBottom: 14, caretColor: A.brass,
            }} />

            <label style={{ display: 'block', fontFamily: F.label, fontWeight: 300, fontSize: 8, color: A.inkMute, letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 6 }}>Fee (Rs)</label>
            <input type="number" value={feeInr} onChange={e => setFeeInr(e.target.value)} placeholder="3000" style={{
              width: '100%', padding: '12px 14px', boxSizing: 'border-box',
              background: 'var(--atelier-input-bg)', border: '0.5px solid var(--atelier-input-border)', borderRadius: 2,
              fontFamily: F.body, fontWeight: 300, fontSize: 16, lineHeight: 1.5, color: A.ink, outline: 'none',
              marginBottom: 16, caretColor: A.brass,
            }} />

            <button type="button" onClick={doAddSlot} disabled={saving || !slotAt || !feeInr} className="atelier-fab" style={{
              width: '100%', padding: '14px 0', borderRadius: 2,
              border: '0.5px solid var(--atelier-label)',
              cursor: (saving || !slotAt || !feeInr) ? 'default' : 'pointer',
              fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#1A120E',
              letterSpacing: '0.42em', textTransform: 'uppercase',
              opacity: (saving || !slotAt || !feeInr) ? 0.5 : 1,
            }}>{saving ? 'Saving…' : 'Add Slot'}</button>
          </div>
        </>
      )}
    </div>
  );
}
