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
import {
  fetchPaymentsByWedding, fetchPayableFunctions, fetchPaymentSuggestion,
  type ByWeddingResponse, type PayableFunction, type WeddingPayment,
} from '@/lib/vendor/api/payments';
import {
  settle, canSettle, suggestionLine, weddingLabel, fmt,
  FUNCTION_LABEL, NO_WEDDING_OPTION, BY_WEDDING_LABEL, SUBTOTAL_LABEL,
  NOTHING_OWED, NO_PAYOUTS, EDIT_BEFORE_SAVING, NO_RATE_ON_FILE, NO_AMOUNT_QUOTED,
} from '@/lib/vendor/settleWords';

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
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
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
  // ── P5 · the money loop ──────────────────────────────────────────────────
  // The view choice is REACT STATE and nothing else — no localStorage, no
  // sessionStorage (house law, and P2's band toggle set the precedent: the
  // toggle is allowed to forget, and its amnesia is witnessed rather than
  // worked around).
  const [view, setView]           = useState<'crew' | 'wedding'>('crew');
  const [board, setBoard]         = useState<ByWeddingResponse | null>(null);
  const [functions, setFunctions] = useState<PayableFunction[]>([]);
  const [eventId, setEventId]     = useState('');
  const [suggestion, setSuggestion] = useState<{ amount_inr: number; functions: number; rate_inr: number } | null>(null);
  const [suggestReason, setSuggestReason] = useState<string | null>(null);

  function reload() {
    return Promise.all([
      fetchPaymentBalance(),
      fetchTeam(),
      fetchTeamPayments({ state: 'owed' }),
      fetchTeamPayments({ state: 'paid' }),
      fetchPaymentsByWedding(),
      fetchPayableFunctions(),
    ]).then(([br, mr, pr, paidR, bw, fn]) => {
      if (br.ok) { setBalances((br as { balances: TeamPaymentBalance[]; total_owed_inr: number }).balances); setTotalOwed((br as { total_owed_inr: number }).total_owed_inr); }
      if (mr.ok) setMembers((mr as { members: TeamMember[] }).members);
      if (pr.ok) setOwedPayments((pr as { payments: TeamPayment[] }).payments);
      if (paidR.ok) setPaidPayments((paidR as { payments: TeamPayment[] }).payments);
      if (bw.ok) setBoard(bw as ByWeddingResponse);
      if (fn.ok) setFunctions((fn as { functions: PayableFunction[] }).functions);
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

  // The draft travels through lib/vendor/settleWords::settle — one home, driven
  // by the proof in plain node. SUGGEST-NEVER-COMMIT is structural here: the
  // number that travels is `amount`, the field the vendor could edit, never the
  // suggestion object.
  async function doLog() {
    if (saving) return;
    const draft = {
      teamMemberId:  memberId || null,
      amount,
      linkedEventId: eventId || null,
      description:   desc,
      notes:         null,
    };
    if (!canSettle(draft)) return;
    setSaving(true);
    await settle(draft, {
      log:      logPayment,
      onResult: (msg, kind) => show(msg, kind),
      onDone:   () => {
        setAddSheet(false); setMemberId(''); setAmount(''); setDesc('');
        setEventId(''); setSuggestion(null); setSuggestReason(null);
        reload();
      },
    });
    setSaving(false);
  }

  // ── THE AUTO-SUGGEST (F1 + the founder's per-function unit) ───────────────
  // Asked only when BOTH a member and a function are on the draft, because the
  // scope of the count is the function's wedding. Never written, never forced
  // into the field behind the vendor's back: it PREFILLS an empty amount and
  // leaves a typed one alone, so a number he has already touched is his.
  useEffect(() => {
    let live = true;
    if (!memberId || !eventId) { setSuggestion(null); setSuggestReason(null); return; }
    fetchPaymentSuggestion(memberId, eventId).then(r => {
      if (!live || !r.ok) return;
      setSuggestion(r.suggestion);
      setSuggestReason(r.reason);
      if (r.suggestion) setAmount(prev => (prev.trim() === '' ? String(r.suggestion!.amount_inr) : prev));
    }).catch(() => { /* a missing suggestion is silence, never a zero */ });
    return () => { live = false; };
  }, [memberId, eventId]);

  async function doMarkPaid() {
    if (!paySheet || saving) return;
    setSaving(true);
    const res = await markPaymentPaid(paySheet.id, { paid_via: paidVia || undefined, notes: paidNotes || undefined });
    if (!res.ok) { show((res as { error?: string }).error ?? 'Failed', 'error'); }
    else { show('Marked as paid', 'success'); setPaySheet(null); setPaidVia('upi'); setPaidNotes(''); reload(); }
    setSaving(false);
  }

  // The gate is the one home's, so the button and the writer cannot disagree
  // about what a loggable draft is. A MISSING FUNCTION IS NOT A BLOCKER — no
  // pick is lawful and lands in the loose lane (C2).
  // ── THE TRUTH GAP, CURED (founder-caught at the smoke) ───────────────────
  // The same payment row rendered `ANANYA · RECCE · 2026-07-25` on the By
  // wedding board and a bare "Payment" here. One row, two surfaces, and only
  // one of them could read what the money was for.
  //
  // NO SERVER CHANGE WAS NEEDED, and that is the point: the function link is
  // already in the by-wedding payload this page fetches on the same reload.
  // Widening `GET /` to join events would have put a SECOND resolution of the
  // same fact in the estate — F-04.104's class, and on a money surface. The
  // board's endpoint stays the one home; this view just asks it.
  const linkOf = new Map<string, { title: string | null; date: string | null }>();
  if (board) {
    for (const l of [...board.weddings.flatMap(w => w.payments), ...board.loose.payments]) {
      linkOf.set(l.id, { title: l.event_title, date: l.event_date });
    }
  }

  const canLog = canSettle({ teamMemberId: memberId || null, amount, linkedEventId: eventId || null, description: desc, notes: null });

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

          {/* ── P5 · the view control ──────────────────────────────────────
              ONE CHIP, NOT A PAIR. The obvious shape was a two-way toggle
              (`By crew · By wedding`, P2's `Month · Weddings` pattern) — but
              the second word was never put to the founder and the veto ledger
              for this sitting is CLOSED. Rather than mint a vendor-facing
              string on my own authority, the control is a filter that is on or
              off and speaks only the word that carries his YES.
              Brass-line, never gold: the total banner below owns this screen's
              one gold, and a second would break the house law. */}
          <div style={{ display: 'flex', padding: '14px 16px 0' }}>
            <button type="button" onClick={() => setView(view === 'wedding' ? 'crew' : 'wedding')} style={{
              padding: '7px 14px', borderRadius: 999, cursor: 'pointer',
              backgroundColor: 'transparent',
              border: `0.5px solid ${view === 'wedding' ? 'rgba(201,168,76,0.45)' : D.border}`,
              fontFamily: F.label, fontWeight: 300, fontSize: 9,
              color: view === 'wedding' ? D.cream : D.muted,
              letterSpacing: '0.2em', textTransform: 'uppercase',
            }}>{BY_WEDDING_LABEL}</button>
          </div>

          {/* Total owed banner */}
          <div style={{ margin: 16, padding: '18px 20px', backgroundColor: totalOwed > 0 ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)', border: `0.5px solid ${totalOwed > 0 ? 'rgba(201,168,76,0.3)' : D.border}`, borderRadius: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Total Owed</span>
            <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 26, color: totalOwed > 0 ? D.gold : D.muted }}>Rs {totalOwed.toLocaleString('en-IN')}</span>
          </div>

          {/* ── P5 · THE PER-WEDDING SETTLEMENT VIEW ───────────────────────
              Payment-spined and unwindowed. Subtotals are sums of the lines on
              screen — acceptance item 7's "reconciles by hand" means the vendor
              counts the rows and gets the number, so nothing invisible
              contributes a rupee. */}
          {view === 'wedding' ? (
            !board || (board.weddings.length === 0 && board.loose.payments.length === 0) ? (
              <div style={{ padding: '32px 24px', textAlign: 'center' }}>
                <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 14, color: D.muted }}>{NO_PAYOUTS}</p>
              </div>
            ) : (
              <>
                {board.weddings.map(w => (
                  <WeddingLane key={w.binder_id} title={weddingLabel(w.title)}
                    owed={w.owed_inr} paid={w.paid_inr} lines={w.payments} />
                ))}
                {/* THE LOOSE LANE (E1) — trailing, P2's learned vocabulary, and
                    NOT an error. Every collab-born settlement lands here unless
                    the vendor picked a function: the collab plane carries no
                    event of its own, and silence is the honest answer to
                    "which wedding?". */}
                {board.loose.payments.length > 0 && (
                  <WeddingLane title={NO_WEDDING_OPTION}
                    owed={board.loose.owed_inr} paid={board.loose.paid_inr}
                    lines={board.loose.payments} />
                )}
              </>
            )
          ) : (
          <>
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
                        {/* What the money is FOR when the row knows, when it was
                            logged when it doesn't. Each line tells only its own
                            truth — never a stand-in for the other. */}
                        <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
                          {linkOf.get(p.id)?.title
                            ? `${linkOf.get(p.id)!.title} · ${linkOf.get(p.id)!.date ?? ''}`
                            : p.created_at.slice(0,10)}
                        </div>
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
                        {linkOf.get(p.id)?.title ? `${linkOf.get(p.id)!.title} · ` : ''}Paid {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}{p.paid_via ? ` · ${p.paid_via.toUpperCase()}` : ''}
                      </div>
                    </div>
                    <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 14, color: D.muted, flexShrink: 0, marginLeft: 12 }}>Rs {p.amount_inr.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            ))
          )}
          </>
          )}
        </div>
      )}

      {/* FAB */}
      <button type="button" onClick={() => { setAddSheet(true); setMemberId(''); setAmount(''); setDesc(''); setEventId(''); setSuggestion(null); setSuggestReason(null); }} style={{
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
            {/* ── C1 · THE FUNCTION PICKER ─────────────────────────────────
                The vendor's hand supplies what the data cannot. Nothing on the
                collab plane carries an event, so rather than invent a linkage
                the sheet ASKS — and "no pick" is a lawful answer that sends the
                payout to the loose lane (C2), never a forced guess. */}
            <div>
              <div style={labelStyle}>{FUNCTION_LABEL}</div>
              <select value={eventId} onChange={e => setEventId(e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                <option value="">{NO_WEDDING_OPTION}</option>
                {functions.map(f => (
                  <option key={f.event_id} value={f.event_id}>
                    {f.title} · {f.event_date}{f.wedding_title ? ` · ${f.wedding_title}` : ''}
                  </option>
                ))}
              </select>
            </div>
            <div><div style={labelStyle}>Amount (Rs) *</div><input style={inputStyle} type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder={NO_AMOUNT_QUOTED} /></div>
            {/* ── F1 · THE SUGGESTION ──────────────────────────────────────
                Prefilled, editable, never auto-saved. Absence is NAMED, never
                zeroed: a member with no rate on file gets a sentence, not an
                Rs 0 that would read as a settled debt. */}
            {suggestion && (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, margin: 0, lineHeight: 1.6 }}>
                {suggestionLine(suggestion.amount_inr, suggestion.functions, suggestion.rate_inr)}
                <br />{EDIT_BEFORE_SAVING}
              </p>
            )}
            {!suggestion && suggestReason === 'no_rate' && (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, margin: 0 }}>{NO_RATE_ON_FILE}</p>
            )}
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

/**
 * One wedding's lane: its name, its subtotal, and the lines behind the number.
 *
 * The lines are rendered so the subtotal can be CHECKED, not merely believed —
 * that is the whole point of acceptance item 7's "reconcile by hand". A vendor
 * who cannot count the rows has been handed a figure, not a ledger.
 */
function WeddingLane({ title, owed, paid, lines }: {
  title: string; owed: number; paid: number; lines: WeddingPayment[];
}) {
  return (
    <div style={{ margin: '0 16px 10px', padding: '16px 18px', background: D.card,
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      border: `0.5px solid ${D.border}`, borderRadius: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
        <span style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 19, color: D.cream }}>{title}</span>
        <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.2em', textTransform: 'uppercase', flexShrink: 0 }}>
          {SUBTOTAL_LABEL}
        </span>
      </div>

      {/* Each line tells only its own truth (F-04.114): owed and paid are two
          facts, so they are two lines. A single netted figure would be a third
          number that matches neither column. */}
      <div style={{ display: 'flex', gap: 14, marginTop: 6, alignItems: 'baseline' }}>
        {owed > 0
          ? <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, color: D.gold }}>Rs {fmt(owed)} owed</span>
          : <span style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted }}>{NOTHING_OWED}</span>}
        {paid > 0 && (
          <span style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            Paid: Rs {fmt(paid)}
          </span>
        )}
      </div>

      {lines.map(l => (
        <div key={l.id} style={{ marginTop: 10, padding: '10px 12px',
          backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: 8,
          border: `0.5px solid ${D.border}`, display: 'flex',
          justifyContent: 'space-between', alignItems: 'center',
          opacity: l.state === 'paid' ? 0.6 : 1 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.cream }}>
              {l.member_name ?? '—'}
            </div>
            <div style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted,
              letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 2 }}>
              {/* The function's own name where one exists; silence where it
                  does not. Never a stand-in. */}
              {l.event_title ?? l.description ?? ''}
              {l.event_date ? ` · ${l.event_date}` : ''}
            </div>
          </div>
          <span style={{ fontFamily: F.display, fontWeight: 300, fontSize: 16,
            color: l.state === 'paid' ? D.muted : D.gold, flexShrink: 0, marginLeft: 12 }}>
            Rs {fmt(l.amount_inr)}
          </span>
        </div>
      ))}
    </div>
  );
}
