'use client';
// app/admin/approvals/discover/page.tsx — TDW_10 ADMIN P3 · THE APPROVAL DECK.
//
// ── WHAT THIS REPLACES, AND WHY IT COULD NOT SIMPLY BE POLISHED ─────────────
// The screen this rewrites was UNUSABLE, and F-10.45 records both halves:
//   (1) it bucketed actionable rows on `discover_request_state === 'under_review'`
//       while vendors' requests are inserted 'requested' and the server filtered
//       'requested' — so Approve/Deny never rendered for a real request;
//   (2) it read five fields the server never sent, and `st.replace('_',' ')` threw
//       on `undefined` for any non-empty queue.
// Neither had ever fired, because `public.vendor_discover_requests` is empty in
// production (founder-run SELECT, 2026-08-06). An empty queue renders "No
// requests", which is the only reason this survived to be found by reading.
//
// ── CONTROL INVENTORY (CE-115 clause 1) — the replaced page's controls ──────
//   Deny chip            MOVED  -> left swipe · reason chips · desktop R
//   Approve chip         MOVED  -> right swipe · desktop A
//   Revoke Access chip   KEPT   -> the settled list below the deck
//   Approve Anyway chip  KEPT   -> the settled list, now floor-gated server-side
//   Toast dismiss        KEPT
//   pending-first order  KEPT   -> becomes deck order (oldest first, server-sorted)
// Clause 2's verbs (getDiscoverQueue/grant/deny/revoke) all survive; `deny` now
// carries a reason, which it never did.
//
// ── THE GESTURE IS AN ENHANCEMENT, NEVER THE ONLY PATH (CE-115) ─────────────
// A bench proves wiring exists, never that a swipe is usable. So every verb has a
// deterministic equivalent cells CAN drive end-to-end: buttons on the card,
// keyboard A/R on desktop, and the bulk checkbox mode. The swipe is layered on
// top. The founder's card names which truths only his device can witness.
//
// ── COLOUR: TOKENS ONLY, ZERO HEX ──────────────────────────────────────────
// New surface, so `var(--admin-*)` throughout. AdminUI's `T` still holds the
// pre-P1 navy literals and falls to P6's sweep; its structural components are
// borrowed, its palette is not.

import { useEffect, useState, useCallback, useRef } from 'react';
import { PageHeader, Toast, GhostBtn } from '../../_components/AdminUI';
import {
  getDiscoverQueue, grantDiscover, denyDiscover, hideDiscover,
  type DiscoverRequest,
} from '../../../../lib/admin-api/index';

// ── THE REASON CHIPS — founder-vetoed, byte-exact ──────────────────────────
// The spec names four; the fifth is the escape hatch, because a queue with only
// four reasons teaches the founder to pick the nearest wrong one. The chosen chip
// is the string that lands in `vendor_discover_requests.reason` and walks, verbatim,
// onto that vendor's own /vendor/discover screen. These are read by a vendor about
// his own work: they name the fixable thing, never the person.
const REASON_CHIPS = [
  'Photos too similar',
  'Watermarks',
  'Category mismatch',
  'Quality',
];
const CUSTOM_CHIP = 'Other — write a reason';

type Mode = 'deck' | 'bulk';

export default function DiscoverApprovalsPage() {
  const [requests, setRequests] = useState<DiscoverRequest[]>([]);
  const [loading, setLoading]   = useState(true);
  const [toast, setToast]       = useState('');
  const [toastErr, setToastErr] = useState(false);
  const [mode, setMode]         = useState<Mode>('deck');
  const [idx, setIdx]           = useState(0);
  const [rejecting, setRejecting] = useState(false);
  const [custom, setCustom]     = useState('');
  const [checked, setChecked]   = useState<Set<string>>(new Set());
  const [busy, setBusy]         = useState(false);
  const [drag, setDrag]         = useState(0);
  const dragStart = useRef<number | null>(null);

  // ── F-10.58 · THE REJECT-UNDO (founder-ruled) ──────────────────────────────
  // One tap on a chip wrote a decision the vendor saw immediately: no confirm, no
  // undo, and the only recovery was finding her on the settled list and
  // approving — which leaves a denied row and a decision she already read.
  //
  // THE UNDO IS REAL, NOT A COMPENSATING WRITE. The obvious build is to deny at
  // once and offer an "undo" that grants afterwards. That is not an undo: the
  // vendor's screen flips to Not Approved in between, her pitch is already
  // destroyed by the deny (F-10.44), and the audit carries a decision that was
  // retracted. So NOTHING IS SENT during the window. The card leaves the deck
  // optimistically, a timer holds the intent, and only when the window closes
  // does `denyDiscover` fire. Undo cancels a timer — there is nothing to reverse
  // because nothing happened.
  //
  // THE WINDOW MUST NOT SWALLOW THE DECISION. A held intent that never fires is
  // worse than no undo at all — the founder would believe he had rejected her.
  // So it flushes on EVERY exit: the timer, another decision, leaving the page,
  // and the tab closing. `pendingRef` mirrors the state because the unmount and
  // `beforeunload` handlers run outside React's render and would otherwise read
  // a stale closure.
  const UNDO_MS = 5000;
  type Pending = { req: DiscoverRequest; reason: string };
  const [pending, setPending] = useState<Pending | null>(null);
  const pendingRef  = useRef<Pending | null>(null);
  const undoTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);
  pendingRef.current = pending;

  const showToast = (msg: string, err = false) => { setToast(msg); setToastErr(err); };

  const load = useCallback(() => {
    setLoading(true);
    getDiscoverQueue()
      .then(d => {
        const rows = (d as { requests?: DiscoverRequest[] }).requests || [];
        setRequests(rows);
        setIdx(0);
        setLoading(false);
      })
      .catch(() => { setRequests([]); setLoading(false); });
  }, []);
  useEffect(() => { load(); }, [load]);

  // The server sends both names for one fact during the transition; either is
  // correct and neither is invented here.
  const stateOf = (r: DiscoverRequest) => r.state || r.discover_request_state;
  // A held rejection is optimistically removed: the founder should never re-decide
  // a card he has already swiped, and if he undoes it, it returns from this same
  // filter with nothing having changed on the server.
  const held    = pending?.req.vendor_id;
  const open    = requests.filter(r => ['requested', 'under_review'].includes(stateOf(r)));
  const pendingList = open.filter(r => r.vendor_id !== held);
  const settled = requests.filter(r => !['requested', 'under_review'].includes(stateOf(r)));
  const card    = pendingList[idx];

  const approve = useCallback(async (r: DiscoverRequest) => {
    if (!r || busy) return;
    setBusy(true);
    try {
      await grantDiscover(r.vendor_id);
      showToast(`${r.vendor_name} is on Discover.`);
      load();
    } catch (e) {
      // THE SERVER'S REFUSAL IS SHOWN VERBATIM. F-10.43's floor check answers 422
      // with the sentence the founder should read; composing a second one here
      // would be a screen disagreeing with the rule that produced it.
      showToast(e instanceof Error ? e.message : 'Could not approve.', true);
      setBusy(false);
      return;
    }
    setBusy(false);
  }, [busy, load]);

  /** Fires the held rejection. Idempotent: clears the intent before awaiting, so
   *  a flush racing the timer cannot send twice. */
  const flushReject = useCallback(async (p?: Pending | null) => {
    const held = p ?? pendingRef.current;
    if (!held) return;
    if (undoTimer.current) { clearTimeout(undoTimer.current); undoTimer.current = null; }
    pendingRef.current = null;
    setPending(null);
    try {
      await denyDiscover(held.req.vendor_id, held.reason);
      showToast('Rejected — the reason is on their screen.');
    } catch {
      showToast('Could not reject.', true);
    }
    load();
  }, [load]);

  // The intent is held, not sent. The card is removed from the deck at once so
  // the founder keeps moving; `undo` puts it back untouched.
  const reject = useCallback((r: DiscoverRequest, reason: string) => {
    if (!r || busy) return;
    // Another decision while one is held FLUSHES the first — never drops it.
    if (pendingRef.current) flushReject(pendingRef.current);
    const held: Pending = { req: r, reason };
    pendingRef.current = held;
    setPending(held);
    setRejecting(false);
    setCustom('');
    setIdx(0);
    undoTimer.current = setTimeout(() => { flushReject(held); }, UNDO_MS);
  }, [busy, flushReject]);

  const undo = useCallback(() => {
    if (undoTimer.current) { clearTimeout(undoTimer.current); undoTimer.current = null; }
    pendingRef.current = null;
    setPending(null);
    showToast('Rejection undone. Nothing was sent.');
  }, []);

  // FLUSH ON EVERY EXIT. Leaving the page or closing the tab must not silently
  // discard a decision the founder believes he made.
  useEffect(() => {
    const onLeave = () => {
      const held = pendingRef.current;
      if (!held) return;
      pendingRef.current = null;
      denyDiscover(held.req.vendor_id, held.reason).catch(() => {});
    };
    window.addEventListener('beforeunload', onLeave);
    return () => { window.removeEventListener('beforeunload', onLeave); onLeave(); };
  }, []);

  // ── DESKTOP A / R (spec §P3.2) ────────────────────────────────────────────
  useEffect(() => {
    if (mode !== 'deck' || !card) return;
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      if (el && ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName)) return;
      if (rejecting) { if (e.key === 'Escape') setRejecting(false); return; }
      if (e.key === 'a' || e.key === 'A') { e.preventDefault(); approve(card); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); setRejecting(true); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, card, rejecting, approve]);

  async function bulkApprove() {
    const targets = pendingList.filter(r => checked.has(r.vendor_id));
    if (!targets.length || busy) return;
    setBusy(true);
    let done = 0;
    const refused: string[] = [];
    for (const r of targets) {
      try { await grantDiscover(r.vendor_id); done++; }
      catch { refused.push(r.vendor_name); }
    }
    // A partial batch reports BOTH numbers. "Approved 5" over a batch of seven is
    // the false-zero family wearing a success message.
    showToast(
      refused.length
        ? `Approved ${done}. Refused ${refused.length}: ${refused.join(', ')}.`
        : `Approved ${done}.`,
      refused.length > 0,
    );
    setChecked(new Set());
    setBusy(false);
    load();
  }

  const onTouchStart = (e: React.TouchEvent) => { dragStart.current = e.touches[0].clientX; };
  const onTouchMove  = (e: React.TouchEvent) => {
    if (dragStart.current === null) return;
    setDrag(e.touches[0].clientX - dragStart.current);
  };
  const onTouchEnd = () => {
    const dx = drag;
    dragStart.current = null;
    setDrag(0);
    if (!card) return;
    if (dx > 90)  approve(card);
    if (dx < -90) setRejecting(true);
  };

  const label = (s: string) => s.replace(/_/g, ' ');

  return (
    <div>
      <PageHeader
        title="Approvals"
        sub={`${pendingList.length} awaiting review`}
        action={
          <GhostBtn
            label={mode === 'deck' ? 'Bulk' : 'Deck'}
            onClick={() => { setMode(m => (m === 'deck' ? 'bulk' : 'deck')); setChecked(new Set()); }}
            small
          />
        }
      />

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[1, 2].map(i => (
            <div key={i} className="shimmer" style={{
              background: 'var(--admin-card-bg)', borderRadius: 12, height: 160,
            }} />
          ))}
        </div>
      ) : pendingList.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '56px 0',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontSize: 19, color: 'var(--admin-ink-mute)',
        }}>Nothing waiting.</div>
      ) : mode === 'bulk' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pendingList.map(r => (
            <label key={r.vendor_id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
              background: 'var(--admin-card-bg)',
              border: '0.5px solid var(--admin-card-border)',
              borderRadius: 10, cursor: r.meets_floor ? 'pointer' : 'not-allowed',
              opacity: r.meets_floor ? 1 : 0.55,
            }}>
              <input
                type="checkbox"
                disabled={!r.meets_floor}
                checked={checked.has(r.vendor_id)}
                onChange={() => setChecked(s => {
                  const n = new Set(s);
                  if (n.has(r.vendor_id)) n.delete(r.vendor_id); else n.add(r.vendor_id);
                  return n;
                })}
                style={{ width: 20, height: 20, accentColor: 'var(--admin-metal)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                  color: 'var(--admin-ink)',
                }}>{r.vendor_name}</div>
                <div style={{
                  fontFamily: '"Jost", sans-serif', fontSize: 10,
                  letterSpacing: '0.1em', color: 'var(--admin-ink-mute)', marginTop: 3,
                }}>
                  {r.photos_total} photos · {r.photos_approved} approved
                  {!r.meets_floor && ` · below the ${r.photo_floor}-photo floor`}
                </div>
              </div>
            </label>
          ))}
          <div style={{ marginTop: 10 }}>
            <GhostBtn
              label={busy ? 'Working…' : `Approve ${checked.size}`}
              onClick={bulkApprove}
              disabled={busy || checked.size === 0}
            />
          </div>
        </div>
      ) : card ? (
        <div>
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              background: 'var(--admin-card-bg)',
              border: '0.5px solid var(--admin-card-border)',
              borderRadius: 14, padding: 18,
              transform: `translateX(${drag}px) rotate(${drag / 40}deg)`,
              transition: dragStart.current === null ? 'transform 220ms ease' : 'none',
            }}
          >
            <div style={{
              fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.28em',
              textTransform: 'uppercase', color: 'var(--admin-ink-mute)', marginBottom: 8,
            }}>{idx + 1} of {pendingList.length} · {label(stateOf(card))}</div>

            <div style={{
              fontFamily: '"Cormorant Garamond", serif', fontSize: 26, fontWeight: 300,
              color: 'var(--admin-ink)', lineHeight: 1.15,
            }}>{card.vendor_name}</div>

            <div style={{
              fontFamily: '"Jost", sans-serif', fontSize: 11, letterSpacing: '0.1em',
              color: 'var(--admin-ink-soft)', marginTop: 6,
            }}>{[card.vendor_category, card.vendor_city].filter(Boolean).join(' · ')}</div>

            {/* ── FORK 5 · TWO LABELLED COUNTS, NEVER ONE BLENDED NUMBER ────────
                `photos` is what the FLOOR is enforced against, at the request gate
                and now at grant. `visible to couples` is the approved subset the
                feed actually renders. F-07.4 declared the divergence deliberately;
                collapsing them would make one of the two lie on this screen. */}
            <div style={{
              display: 'flex', gap: 22, marginTop: 16, paddingTop: 14,
              borderTop: '0.5px solid var(--admin-hairline)',
            }}>
              <Metric
                value={`${card.photos_total}`}
                label={`photos · floor ${card.photo_floor}`}
                warn={!card.meets_floor}
              />
              <Metric value={`${card.photos_approved}`} label="visible to couples" />
            </div>

            {!card.meets_floor && (
              <p style={{
                fontFamily: '"Jost", sans-serif', fontSize: 11, lineHeight: 1.6,
                color: 'var(--admin-caution)', margin: '12px 0 0',
              }}>Below the {card.photo_floor}-photo floor — cannot approve.</p>
            )}

            {card.pitch && (
              <p style={{
                fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
                fontSize: 15, lineHeight: 1.55, color: 'var(--admin-ink-soft)',
                margin: '14px 0 0',
              }}>{card.pitch}</p>
            )}

            {/* THE PREVIEW IS A LINK, NOT A RE-RENDER. `VendorProfileView` is the
                ONE profile renderer and its data comes from `getDiscoverPreview` —
                the feed's own shaper. The admin door for it ships in this phase's
                dream-os ZIP (GET /api/v2/admin/discover/preview/:vendorId). Mounting
                the component here against a hand-built object would be the second
                implementation the sanctuary's own comment forbids, so the deck sends
                the founder to the surface that already renders it correctly. */}
            <div style={{ marginTop: 16 }}>
              <a
                href={`/admin/vendors/portfolio?vendor=${card.vendor_id}`}
                style={{
                  fontFamily: '"Jost", sans-serif', fontSize: 10, letterSpacing: '0.22em',
                  textTransform: 'uppercase', color: 'var(--admin-metal)', textDecoration: 'none',
                }}
              >See the portfolio</a>
            </div>
          </div>

          {!rejecting ? (
            <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
              <DeckBtn label="Reject" tone="no" onClick={() => setRejecting(true)} disabled={busy} />
              <DeckBtn label="Approve" tone="ok" onClick={() => approve(card)} disabled={busy || !card.meets_floor} />
            </div>
          ) : (
            <div style={{ marginTop: 16 }}>
              <div style={{
                fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.28em',
                textTransform: 'uppercase', color: 'var(--admin-ink-mute)', marginBottom: 10,
              }}>Why?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {REASON_CHIPS.map(c => (
                  <button key={c} onClick={() => reject(card, c)} disabled={busy} style={chipStyle}>{c}</button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <input
                  value={custom}
                  onChange={e => setCustom(e.target.value)}
                  placeholder={CUSTOM_CHIP}
                  style={{
                    flex: 1, minWidth: 0, padding: '11px 13px',
                    background: 'var(--admin-input-bg)',
                    border: '0.5px solid var(--admin-input-border)',
                    borderRadius: 8, color: 'var(--admin-ink)',
                    fontFamily: '"DM Sans", sans-serif', fontSize: 14,
                  }}
                />
                <GhostBtn
                  label="Send"
                  onClick={() => custom.trim() && reject(card, custom.trim())}
                  disabled={busy || !custom.trim()}
                  small
                />
              </div>
              <div style={{ marginTop: 12 }}>
                <GhostBtn label="Cancel" onClick={() => { setRejecting(false); setCustom(''); }} small />
              </div>
            </div>
          )}

          {pendingList.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center' }}>
              <GhostBtn label="Skip" onClick={() => setIdx(i => (i + 1) % pendingList.length)} small />
            </div>
          )}
        </div>
      ) : null}

      {settled.length > 0 && (
        <div style={{ marginTop: 34 }}>
          <div style={{
            fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.28em',
            textTransform: 'uppercase', color: 'var(--admin-ink-mute)', marginBottom: 12,
          }}>Decided</div>
          {settled.map(r => (
            <div key={r.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '13px 16px',
              background: 'var(--admin-card-bg)',
              border: '0.5px solid var(--admin-card-border)',
              borderRadius: 10, marginBottom: 8,
            }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontFamily: '"DM Sans", sans-serif', fontSize: 14, color: 'var(--admin-ink)',
                }}>{r.vendor_name}</div>
                {r.decision_reason && (
                  <div style={{
                    fontFamily: '"Jost", sans-serif', fontSize: 11, lineHeight: 1.5,
                    color: 'var(--admin-ink-mute)', marginTop: 4,
                  }}>{r.decision_reason}</div>
                )}
              </div>
              <span style={{
                fontFamily: '"Jost", sans-serif', fontSize: 8, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: 'var(--admin-ink-soft)',
                border: '0.5px solid var(--admin-hairline-firm)',
                borderRadius: 20, padding: '4px 11px', flexShrink: 0,
              }}>{label(stateOf(r))}</span>
              {stateOf(r) === 'approved' ? (
                <GhostBtn label="Hide" danger small onClick={async () => {
                  try { await hideDiscover(r.vendor_id); showToast('Hidden from Discover.'); load(); }
                  catch { showToast('Could not hide.', true); }
                }} />
              ) : (
                <GhostBtn label="Approve" small onClick={() => approve(r)} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* THE UNDO WINDOW. Deliberately NOT a toast: `Toast` auto-dismisses after
          3s on its own clock, which would leave the founder watching a countdown
          he could not act on. This is a real control with a real target, and it
          disappears the moment the decision lands. */}
      {pending && (
        <div style={{
          position: 'fixed', left: 16, right: 16,
          bottom: 'calc(env(safe-area-inset-bottom, 0px) + 76px)',
          zIndex: 400, display: 'flex', alignItems: 'center', gap: 12,
          padding: '13px 16px', borderRadius: 12,
          background: 'var(--admin-sheet)',
          border: '0.5px solid var(--admin-caution)',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Jost", sans-serif', fontSize: 11, lineHeight: 1.5,
              color: 'var(--admin-ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>Rejecting {pending.req.vendor_name} — {pending.reason}</div>
            <div style={{
              fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: 'var(--admin-ink-mute)', marginTop: 4,
            }}>Nothing sent yet</div>
          </div>
          <button onClick={undo} style={{
            flexShrink: 0, minHeight: 40, padding: '10px 18px', borderRadius: 8,
            background: 'transparent', border: '0.5px solid var(--admin-metal)',
            fontFamily: '"Jost", sans-serif', fontSize: 10, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--admin-metal)', cursor: 'pointer',
          }}>Undo</button>
        </div>
      )}

      {toast && <Toast msg={toast} onDone={() => setToast('')} error={toastErr} />}
    </div>
  );
}

const chipStyle: React.CSSProperties = {
  background: 'transparent',
  border: '0.5px solid var(--admin-hairline-firm)',
  borderRadius: 20, padding: '10px 15px', minHeight: 40,
  fontFamily: '"Jost", sans-serif', fontSize: 11, letterSpacing: '0.08em',
  color: 'var(--admin-ink-soft)', cursor: 'pointer',
};

function Metric({ value, label, warn }: { value: string; label: string; warn?: boolean }) {
  return (
    <div>
      <div style={{
        fontFamily: '"Cormorant Garamond", serif', fontVariantNumeric: 'lining-nums',
        fontSize: 25, fontWeight: 300,
        color: warn ? 'var(--admin-caution)' : 'var(--admin-ink)', lineHeight: 1,
      }}>{value}</div>
      <div style={{
        fontFamily: '"Jost", sans-serif', fontSize: 9, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--admin-ink-mute)', marginTop: 6,
      }}>{label}</div>
    </div>
  );
}

function DeckBtn({ label, tone, onClick, disabled }: {
  label: string; tone: 'ok' | 'no'; onClick: () => void; disabled?: boolean;
}) {
  const col = tone === 'ok' ? 'var(--admin-positive)' : 'var(--admin-critical)';
  return (
    <button onClick={onClick} disabled={disabled} style={{
      flex: 1, padding: '15px 0', minHeight: 48,
      background: 'transparent', border: `0.5px solid ${col}`, borderRadius: 10,
      fontFamily: '"Jost", sans-serif', fontSize: 10, letterSpacing: '0.24em',
      textTransform: 'uppercase', color: col,
      opacity: disabled ? 0.4 : 1,
      cursor: disabled ? 'not-allowed' : 'pointer',
    }}>{label}</button>
  );
}
