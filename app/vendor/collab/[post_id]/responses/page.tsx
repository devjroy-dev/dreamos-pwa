'use client';
// app/wedding/collab/[post_id]/responses/page.tsx
// Interested vendors for a post the current vendor owns.
// Identity revealed — poster owns the post.

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { Header } from '@/components/vendor/Header';
import { getJson, postJson } from '@/lib/vendor/api/_base';
import { fetchRoster, bridgeRosterEntry } from '@/lib/vendor/api/roster';
import { fetchPayableFunctions, fetchPaymentSuggestion, type PayableFunction } from '@/lib/vendor/api/payments';
import { logPayment } from '@/lib/vendor/api/vendor';
import {
  settle, canSettle, collabNote, suggestionLine, fmt,
  SETTLE_TITLE, AMOUNT_LABEL, FUNCTION_LABEL, NO_WEDDING_OPTION, LOG_ACTION,
  EDIT_BEFORE_SAVING, NO_RATE_ON_FILE, NO_AMOUNT_QUOTED,
} from '@/lib/vendor/settleWords';

const D = {
  bg:     '#0E0D0B',
  card:   'var(--role-sheet)',
  // TDW_09 F-09.34 — COLOUR ONLY, and renamed from `border` on purpose.
  // It used to hold the whole shorthand ('0.5px solid var(...)') while most
  // readers re-prefixed it, producing '0.5px solid 0.5px solid var(...)': a
  // declaration that parses, then becomes INVALID AT COMPUTED-VALUE TIME once
  // var() substitutes, so `border` computes to its initial value and NO EDGE
  // RENDERS AT ALL. 22 sites across 5 files. The rename is the guard: any
  // reader I failed to migrate is now a tsc error, not a silent missing border.
  borderCol: 'var(--atelier-card-border)',
  gold:   'var(--role-metal)',
  cream:  'rgba(245,240,232,0.85)',
  muted:  'rgba(245,240,232,0.40)',
};
const CARD: React.CSSProperties = {
  background:           D.card,
  backdropFilter:       'blur(32px) saturate(1.6)',
  WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
  boxShadow:            'inset 0 1px 0 rgba(255,255,255,0.05)',
};
const F = {
  display: 'var(--font-cormorant), Georgia, serif',
  label:   'var(--font-jost), system-ui, sans-serif',
  body:    'var(--font-dm-sans), system-ui, sans-serif',
};

interface VendorResponse {
  response_id:       string;
  state:             string;
  responded_at:      string;
  contact_shared_at: string | null;
  vendor: {
    id:             string;
    name:           string | null;
    category:       string;
    city:           string;
    open_to_travel: boolean;
    hero_photo:     string | null;
  };
}

export default function CollabResponsesPage() {
  const params  = useParams<{ post_id: string }>();
  const post_id = params?.post_id ?? '';
  const router  = useRouter();

  const { session, loading: sl } = useVendorSession();
  useEffect(() => { if (!sl && !session) router.replace('/'); }, [sl, session, router]);
  if (sl || !session) return <div style={{ flex: 1, background: D.bg }} aria-busy="true" />;

  return <ResponsesScreen post_id={post_id} vendorName={session.name} />;
}

function ResponsesScreen({ post_id, vendorName }: { post_id: string; vendorName: string | null }) {
  const router = useRouter();
  const [responses,   setResponses]   = useState<VendorResponse[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [connecting,  setConnecting]  = useState<string | null>(null);
  // ── P5 · A3 — THE SETTLE STUB ────────────────────────────────────────────
  // Offered at connect-accept, which is where the spec puts it. Getting there
  // needs one thing the connection alone does not provide: a team_members row.
  // `team_payments.team_member_id` is NOT NULL, and at accept-time the
  // counterparty is a vendor_roster EDGE, not crew. So the Settle row walks
  // P4's existing bridge door first — the same door the Roster tab's "Add to
  // crew" uses, minting the same idempotent row — and only then opens the stub.
  // Zero new identity machinery; P4.4's thesis reused whole.
  const [stub,       setStub]       = useState<{ memberId: string; name: string } | null>(null);
  const [preparing,  setPreparing]  = useState<string | null>(null);
  const [functions,  setFunctions]  = useState<PayableFunction[]>([]);
  const [eventId,    setEventId]    = useState('');
  const [amount,     setAmount]     = useState('');
  const [saving,     setSaving]     = useState(false);
  const [note,       setNote]       = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<{ amount_inr: number; functions: number; rate_inr: number } | null>(null);
  const [suggestReason, setSuggestReason] = useState<string | null>(null);

  useEffect(() => { fetchResponses(); }, [post_id]); // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchResponses() {
    try {
      const data = await getJson<{ ok: boolean; responses: VendorResponse[] }>(
        `/api/v2/vendor/collab/${post_id}/responses`
      );
      if (data.ok) setResponses(data.responses);
    } catch { /* silent */ }
    finally { setLoading(false); }
  }

  async function handleConnect(responseId: string) {
    setConnecting(responseId);
    try {
      // A3's enabling field rides this response now. It is READ but not RELIED
      // ON: `openStub` resolves the edge for itself, so a connection accepted
      // before this deploy settles exactly like one accepted after it.
      const data = await postJson<{ ok: boolean; roster_id?: string | null }>(
        `/api/v2/vendor/collab/${post_id}/connect/${responseId}`, {}
      );
      if (data.ok) fetchResponses();
    } catch { /* silent */ }
    finally { setConnecting(null); }
  }

  /**
   * Bridge, then settle.
   *
   * The roster edge is looked up by the counterparty's vendor id rather than
   * carried from the connect call, so this works for every accepted response on
   * the screen and not only the one just tapped. Nothing is optimistically
   * flipped: if the bridge door refuses, the stub does not open and the vendor
   * is told, because a payout with no counterparty is not a payout.
   */
  async function openStub(vendorId: string, name: string, responseId: string) {
    setPreparing(responseId);
    try {
      const roster = await fetchRoster();
      const edge = roster.ok ? roster.roster.find(e => e.member_vendor_id === vendorId) : undefined;
      if (!edge) { setPreparing(null); return; }
      const minted = await bridgeRosterEntry(edge.id);
      if (!minted.ok) { setPreparing(null); return; }
      const fns = await fetchPayableFunctions();
      setFunctions(fns.ok ? fns.functions : []);
      setNote(collabNote(String(post_id)));
      setEventId(''); setAmount(''); setSuggestion(null); setSuggestReason(null);
      setStub({ memberId: minted.member.id, name });
    } catch { /* the stub simply does not open */ }
    finally { setPreparing(null); }
  }

  // The suggestion — asked only once a function is picked, because the count's
  // scope IS the function's wedding. Prefills an empty field, never a typed one.
  useEffect(() => {
    let live = true;
    if (!stub || !eventId) { setSuggestion(null); setSuggestReason(null); return; }
    fetchPaymentSuggestion(stub.memberId, eventId).then(r => {
      if (!live || !r.ok) return;
      setSuggestion(r.suggestion);
      setSuggestReason(r.reason);
      if (r.suggestion) setAmount(prev => (prev.trim() === '' ? String(r.suggestion!.amount_inr) : prev));
    }).catch(() => { /* absence is silence, never a zero */ });
    return () => { live = false; };
  }, [stub, eventId]);

  async function doSettle() {
    if (!stub || saving) return;
    const draft = {
      teamMemberId: stub.memberId, amount,
      linkedEventId: eventId || null, description: '', notes: note,
    };
    if (!canSettle(draft)) return;
    setSaving(true);
    await settle(draft, {
      log:      logPayment,
      onResult: () => { /* the sheet closing IS the confirmation */ },
      onDone:   () => { setStub(null); setAmount(''); setEventId(''); },
    });
    setSaving(false);
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: D.bg }}>
      <Header vendorName={vendorName} />

      {/* Page header */}
      <div style={{ padding: '16px 20px 0', borderBottom: `0.5px solid ${D.borderCol}` }}>
        <button type="button" onClick={() => router.back()} style={{
          background: 'none', border: 'none', color: D.muted, fontSize: 20,
          cursor: 'pointer', padding: '0 0 12px', display: 'block',
        }}>←</button>
        <h1 style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 26, color: D.cream, marginBottom: 6 }}>
          Interested vendors
        </h1>
        <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, lineHeight: 1.6, paddingBottom: 16 }}>
          Their identity is revealed to you because you posted the requirement.
          Tap Connect to share contact details with both of you.
        </p>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <p style={{ fontFamily: F.display, fontStyle: 'italic', fontSize: 18, color: D.muted }}>Loading…</p>
          </div>
        ) : responses.length === 0 ? (
          <div style={{ padding: '60px 16px', textAlign: 'center' }}>
            <p style={{ fontFamily: F.display, fontWeight: 300, fontStyle: 'italic', fontSize: 20, color: D.muted, lineHeight: 1.6 }}>
              No responses yet.
            </p>
          </div>
        ) : responses.map(r => (
          <div key={r.response_id} style={{
            ...CARD, borderRadius: 12,
            border: r.state === 'accepted' ? '0.5px solid var(--atelier-sheet-border)' : `0.5px solid ${D.borderCol}`,
            padding: '18px',
          }}>
            {/* Vendor info */}
            <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
              {r.vendor.hero_photo && (
                <img src={r.vendor.hero_photo} alt={r.vendor.name ?? 'vendor'}
                  style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0,
                    border: '0.5px solid var(--atelier-card-border)' }} />
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontFamily: F.display, fontWeight: 300, fontSize: 20, color: D.cream, marginBottom: 3 }}>
                  {r.vendor.name || 'A vendor'}
                </p>
                <p style={{ fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.gold, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  {r.vendor.category} · {r.vendor.city}
                  {r.vendor.open_to_travel && ' · Travels'}
                </p>
              </div>
            </div>

            {/* Action */}
            {r.state === 'accepted' ? (
              <>
                <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.gold, fontStyle: 'italic' }}>
                  ✦ Connected — contact details shared with both of you.
                </p>
                {/* THE SETTLE ROW (A3). Brass-line, not gold: the connected
                    line above owns this card's gold. */}
                <button type="button"
                  onClick={() => void openStub(r.vendor.id, r.vendor.name || 'A vendor', r.response_id)}
                  disabled={preparing === r.response_id}
                  style={{
                    marginTop: 12, width: '100%', padding: '10px 0',
                    background: 'transparent', border: `0.5px solid ${D.borderCol}`,
                    borderRadius: 999, fontFamily: F.label, fontWeight: 300, fontSize: 10,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: D.cream, cursor: preparing === r.response_id ? 'default' : 'pointer',
                    opacity: preparing === r.response_id ? 0.6 : 1,
                  }}>
                  {SETTLE_TITLE}
                </button>
              </>
            ) : (
              <button type="button" onClick={() => handleConnect(r.response_id)}
                disabled={connecting === r.response_id} style={{
                  width: '100%', padding: '11px 0',
                  background: connecting === r.response_id ? 'rgba(201,168,76,0.4)' : D.gold,
                  border: 'none', borderRadius: 999,
                  fontFamily: F.label, fontWeight: 400, fontSize: 10,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: D.bg, cursor: connecting === r.response_id ? 'default' : 'pointer',
                }}>
                {connecting === r.response_id ? 'Connecting…' : 'Connect'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* ── THE SETTLEMENT STUB ────────────────────────────────────────────
          ONE SHAPE (CE ruling on R4+R6): a team_payments payout. The
          Expense/payment chooser is DEAD — at connect-accept the counterparty
          is definitionally a person (P4.4's thesis), and mark-paid already
          feeds the expense ledger, so a raw Expense choice here would have
          built two ledgers the vendor cannot see the shape of. One-shot costs
          that are not payouts keep the existing Expenses surface.

          THE AMOUNT OPENS EMPTY. There is no quote source to prefill from:
          collab_responses carries no amount column, and the POSTER's own
          budget_inr is not the responder's price. A computed guess in a money
          position is the convicted class. */}
      {stub && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 20, display: 'flex', alignItems: 'flex-end' }}
          onClick={() => setStub(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            ...CARD, width: '100%', borderRadius: '16px 16px 0 0',
            padding: '24px 24px 40px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: F.display, fontWeight: 300, fontSize: 22, color: D.cream }}>{SETTLE_TITLE}</div>
            <div style={{ fontFamily: F.body, fontWeight: 300, fontSize: 13, color: D.muted }}>{stub.name}</div>

            <div>
              <div style={LABEL}>{FUNCTION_LABEL}</div>
              <select value={eventId} onChange={e => setEventId(e.target.value)} style={{ ...INPUT, appearance: 'none' }}>
                <option value="">{NO_WEDDING_OPTION}</option>
                {functions.map(f => (
                  <option key={f.event_id} value={f.event_id}>
                    {f.title} · {f.event_date}{f.wedding_title ? ` · ${f.wedding_title}` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div style={LABEL}>{AMOUNT_LABEL}</div>
              <input style={INPUT} type="number" value={amount}
                onChange={e => setAmount(e.target.value)} placeholder={NO_AMOUNT_QUOTED} />
            </div>

            {suggestion && (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, margin: 0, lineHeight: 1.6 }}>
                {suggestionLine(suggestion.amount_inr, suggestion.functions, suggestion.rate_inr)}
                <br />{EDIT_BEFORE_SAVING}
              </p>
            )}
            {!suggestion && suggestReason === 'no_rate' && (
              <p style={{ fontFamily: F.body, fontWeight: 300, fontSize: 12, color: D.muted, margin: 0 }}>{NO_RATE_ON_FILE}</p>
            )}

            <button type="button" onClick={doSettle}
              disabled={!canSettle({ teamMemberId: stub.memberId, amount, linkedEventId: eventId || null, description: '', notes: note }) || saving}
              style={{
                padding: '13px 0', border: 'none', borderRadius: 8,
                backgroundColor: canSettle({ teamMemberId: stub.memberId, amount, linkedEventId: eventId || null, description: '', notes: note }) && !saving ? D.gold : 'rgba(201,168,76,0.3)',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontFamily: F.label, fontWeight: 400, fontSize: 10, color: D.bg,
                letterSpacing: '0.2em', textTransform: 'uppercase',
              }}>
              {LOG_ACTION}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const LABEL: React.CSSProperties = {
  fontFamily: F.label, fontWeight: 300, fontSize: 9, color: D.muted,
  letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6,
};
const INPUT: React.CSSProperties = {
  width: '100%', padding: '11px 14px', backgroundColor: 'var(--atelier-input-bg)',
  border: `0.5px solid var(--atelier-input-border)`, borderRadius: 8, color: D.cream,
  fontFamily: F.body, fontWeight: 300, fontSize: 14, outline: 'none', boxSizing: 'border-box',
};
