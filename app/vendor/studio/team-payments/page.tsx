'use client';
// /wedding/studio/team-payments — Team payment balances. Prestige-gated.
// Total owed banner + per-member balance cards.
// Add payment sheet. Mark paid sheet. Save disabled with message if invalid.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { Toast } from '@/components/vendor/Toast';
import { useToast } from '@/hooks/vendor/useToast';
import { fetchPaymentBalance, fetchTeam, logPayment, fetchTeamPayments, markPaymentPaid } from '@/lib/vendor/api/vendor';
import type { TeamPaymentBalance, TeamMember, TeamPayment } from '@/lib/vendor/types/vendor';

const D = {
  card: 'rgba(255,255,255,0.035)',
  border: '0.5px solid var(--atelier-card-border)', muted: 'rgba(248,247,245,0.45)',
  cream: 'var(--atelier-ink)', gold: 'var(--atelier-accent-text)', red: '#E07070',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', backgroundColor: 'rgba(255,255,255,0.04)',
  border: `0.5px solid ${D.border}`, borderRadius: 8, color: D.cream,
  fontFamily: F.body, fontWeight: 300, fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
const labelStyle: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 9,
  color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,
};

export default function TeamPaymentsPage() {
  const router = useRouter();
  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/vendor/login'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: 'transparent' }} />;
  if (session.tier !== 'prestige') {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent' }}>
        <Header vendorName={session.name ?? null} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 40, textAlign: 'center', gap: 12 }}>
          <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 26, color: D.cream }}>Team Payments</p>
          <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted, lineHeight: 1.6 }}>Team Hub is available on the Prestige plan. Contact Swati to upgrade.</p>
          <button type="button" onClick={() => router.back()} style={{ marginTop: 16, padding: '11px 24px', backgroundColor: 'transparent', border: `0.5px solid ${D.border}`, borderRadius: 999, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Back</button>
        </div>
      </div>
    );
  }
  return <PaymentsScreen vendorName={session.name ?? null} />;
}

function PaymentsScreen({ vendorName }: { vendorName: string | null }) {
  const { toast, show } = useToast();
  const [balances, setBalances]       = useState<TeamPaymentBalance[]>([]);
  const [totalOwed, setTotalOwed]     = useState(0);
  const [members, setMembers]         = useState<TeamMember[]>([]);
  const [owedPayments, setOwedPayments]   = useState<TeamPayment[]>([]);
  const [paidPayments, setPaidPayments]   = useState<TeamPayment[]>([]);
  const [loading, setLoading]         = useState(true);
  const [addSheet, setAddSheet]       = useState(false);
  const [paySheet, setPaySheet]       = useState<TeamPayment | null>(null);
  const [saving, setSaving]           = useState(false);
  // log form
  const [memberId, setMemberId]   = useState('');
  const [amount, setAmount]       = useState('');
  const [desc, setDesc]           = useState('');
  // mark paid form
  const [paidVia, setPaidVia]     = useState('upi');
  const [paidNotes, setPaidNotes] = useState('');

  function reload() {
    return Promise.all([
      fetchPaymentBalance(),
      fetchTeam(),
      fetchTeamPayments({ state: 'owed' }),
      fetchTeamPayments({ state: 'paid' }),
    ]).then(([br, mr, pr, paidR]) => {
      if (br.ok) { setBalances((br as { balances: TeamPaymentBalance[]; total_owed_inr: number }).balances); setTotalOwed((br as { total_owed_inr: number }).total_owed_inr); }
      if (mr.ok) setMembers((mr as { members: TeamMember[] }).members);
      if (pr.ok) setOwedPayments((pr as { payments: TeamPayment[] }).payments);
      if (paidR.ok) setPaidPayments((paidR as { payments: TeamPayment[] }).payments);
    }).finally(() => setLoading(false));
  }

  useEffect(() => { reload(); }, []);

  async function doCancelPayment(paymentId: string) {
    setSaving(true);
    try {
      const session = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('vendor_session') || '{}') : {};
      const res = await fetch('/api/v2/vendor/studio/team-payments/' + paymentId + '/cancel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (session.access_token || '') },
      });
      const data = await res.json();
      if (!data.ok) { show(data.error ?? 'Failed', 'error'); }
      else { show('Payment removed', 'success'); reload(); }
    } catch { show('Failed', 'error'); }
    setSaving(false);
  }

  async function doLog() {
    if (!memberId || !amount || Number(amount) <= 0 || saving) return;
    setSaving(true);
    const res = await logPayment({ team_member_id: memberId, amount_inr: Number(amount), description: desc || undefined });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Payment logged', 'success'); setAddSheet(false); setMemberId(''); setAmount(''); setDesc(''); reload(); }
    setSaving(false);
  }

  async function doMarkPaid() {
    if (!paySheet || saving) return;
    setSaving(true);
    const res = await markPaymentPaid(paySheet.id, { paid_via: paidVia || undefined, notes: paidNotes || undefined });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Marked as paid', 'success'); setPaySheet(null); setPaidVia('upi'); setPaidNotes(''); reload(); }
    setSaving(false);
  }

  const canLog = memberId.length > 0 && Number(amount) > 0;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'transparent', position: 'relative' }}>
      <Toast toast={toast} />
      <Header vendorName={vendorName} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontFamily: F.label, fontSize: 10, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Loading</span>
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto' }}>

          {/* Total owed banner */}
          <div style={{ margin: 16, padding: '18px 20px', backgroundColor: totalOwed > 0 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', border: `0.5px solid ${totalOwed > 0 ? 'rgba(201,168,76,0.3)' : D.border}`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Total Owed</span>
            <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 26, color: totalOwed > 0 ? D.gold : D.muted }}>Rs {totalOwed.toLocaleString('en-IN')}</span>
          </div>

          {/* Per-member balances */}
          {balances.length === 0 ? (
            <div style={{ padding: '32px 24px', textAlign: 'center' }}>
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted }}>No payment records yet</p>
            </div>
          ) : (
            balances.map(b => (
              <div key={b.team_member_id} style={{ margin: '0 16px 10px', padding: '16px 18px', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: `0.5px solid ${D.border}`, borderRadius: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontFamily: F.body, fontWeight: 400, fontSize: 15, color: D.cream }}>{b.name}</span>
                  {b.owed_inr > 0 && <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, color: D.gold }}>Rs {b.owed_inr.toLocaleString('en-IN')} owed</span>}
                  {b.owed_inr === 0 && <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Settled</span>}
                </div>
                <div style={{ display: 'flex', gap: 14 }}>
                  <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Paid: Rs {b.paid_inr.toLocaleString('en-IN')}</span>
                </div>
                {/* Owed line-items for this member */}
                {owedPayments.filter(p => p.team_member_id === b.team_member_id).map(p => (
                  <div key={p.id} style={{ marginTop: 10, padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `0.5px solid ${D.border}` }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.cream }}>{p.description || 'Payment'}</div>
                        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>{p.created_at.slice(0,10)}</div>
                      </div>
                      <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 16, color: D.gold, flexShrink: 0, marginLeft: 12 }}>Rs {p.amount_inr.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button type="button" onClick={() => { setPaySheet(p); setPaidVia('upi'); setPaidNotes(''); }} disabled={saving} style={{ flex: 2, padding: '8px 0', backgroundColor: 'var(--atelier-accent-text)', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 9, color: '#111', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Mark Paid</button>
                      <button type="button" onClick={() => doCancelPayment(p.id)} disabled={saving} style={{ flex: 1, padding: '8px 0', backgroundColor: 'transparent', border: `0.5px solid ${D.red}`, borderRadius: 6, cursor: 'pointer', fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.red, letterSpacing: '0.15em', textTransform: 'uppercase' }}>Delete</button>
                    </div>
                  </div>
                ))}
                {paidPayments.filter(p => p.team_member_id === b.team_member_id).map(p => (
                  <div key={p.id} style={{ marginTop: 8, padding: '10px 12px', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 8, border: `0.5px solid ${D.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.6 }}>
                    <div>
                      <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.cream }}>{p.description || 'Payment'}</div>
                      <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                        Paid {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}{p.paid_via ? ` · ${p.paid_via.toUpperCase()}` : ''}
                      </div>
                    </div>
                    <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 14, color: D.muted, flexShrink: 0, marginLeft: 12 }}>Rs {p.amount_inr.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={() => { setAddSheet(true); setMemberId(''); setAmount(''); setDesc(''); }} style={{
        position: 'fixed', bottom: 32, right: 24, width: 52, height: 52,
        borderRadius: '50%', backgroundColor: 'var(--atelier-accent-text)', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
        boxShadow: '0 4px 20px var(--atelier-overlay-bg)',
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
      </button>

      {/* Log payment sheet */}
      {addSheet && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setAddSheet(false)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>Log Payment</div>
            <div>
              <div style={labelStyle}>Team Member *</div>
              <select value={memberId} onChange={e => setMemberId(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">Select member</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
            <div><div style={labelStyle}>Amount (Rs) *</div><input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="12000" /></div>
            <div><div style={labelStyle}>Description</div><input style={inputStyle} value={desc} onChange={e => setDesc(e.target.value)} placeholder="2-day shoot for Priya wedding" /></div>
            {!canLog && <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.red, margin: 0 }}>Select a member and enter a valid amount to save.</p>}
            <button type="button" onClick={doLog} disabled={!canLog || saving} style={{ padding: '13px 0', backgroundColor: canLog && !saving ? D.gold : 'rgba(201,168,76,0.3)', border: 'none', borderRadius: 8, cursor: canLog && !saving ? 'pointer' : 'not-allowed', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {saving ? 'Saving…' : 'Log Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Mark paid sheet */}
      {paySheet && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }} onClick={() => setPaySheet(null)}>
          <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: D.card, backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderRadius: '16px 16px 0 0', padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>Mark as Paid</div>
            <div style={{ padding: '12px 14px', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8, border: `0.5px solid ${D.border}` }}>
              <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.cream }}>{paySheet.description || 'Payment'}</div>
              <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.gold, marginTop: 4 }}>Rs {paySheet.amount_inr.toLocaleString('en-IN')}</div>
            </div>
            <div>
              <div style={labelStyle}>Paid Via</div>
              <select value={paidVia} onChange={e => setPaidVia(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="upi">UPI</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div><div style={labelStyle}>Notes</div><input style={inputStyle} value={paidNotes} onChange={e => setPaidNotes(e.target.value)} placeholder="Optional" /></div>
            <button type="button" onClick={doMarkPaid} disabled={saving} style={{ padding: '13px 0', backgroundColor: saving ? 'rgba(201,168,76,0.3)' : D.gold, border: 'none', borderRadius: 8, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: F.label, fontWeight: 400, fontSize: 10, color: '#111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              {saving ? 'Saving…' : 'Confirm Payment'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
