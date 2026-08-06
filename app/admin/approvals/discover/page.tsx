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
  getDiscoverQueue, grantDiscover, denyDiscover, revokeDiscover,
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
  const pending = requests.filter(r => ['requested', 'under_review'].includes(stateOf(r)));
  const settled = requests.filter(r => !['requested', 'under_review'].includes(stateOf(r)));
  const card    = pending[idx];

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

  const reject = useCallback(async (r: DiscoverRequest, reason: string) => {
    if (!r || busy) return;
    setBusy(true);
    try {
      await denyDiscover(r.vendor_id, reason);
      showToast('Rejected — the reason is on their screen.');
      load();
    } catch {
      showToast('Could not reject.', true);
    }
    setRejecting(false);
    setCustom('');
    setBusy(false);
  }, [busy, load]);

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
    const targets = pending.filter(r => checked.has(r.vendor_id));
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
        sub={`${pending.length} awaiting review`}
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
      ) : pending.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '56px 0',
          fontFamily: '"Cormorant Garamond", serif', fontStyle: 'italic',
          fontSize: 19, color: 'var(--admin-ink-mute)',
        }}>Nothing waiting.</div>
      ) : mode === 'bulk' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {pending.map(r => (
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
            }}>{idx + 1} of {pending.length} · {label(stateOf(card))}</div>

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

          {pending.length > 1 && (
            <div style={{ display: 'flex', gap: 10, marginTop: 18, justifyContent: 'center' }}>
              <GhostBtn label="Skip" onClick={() => setIdx(i => (i + 1) % pending.length)} small />
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
                <GhostBtn label="Revoke" danger small onClick={async () => {
                  try { await revokeDiscover(r.vendor_id); showToast('Revoked.'); load(); }
                  catch { showToast('Could not revoke.', true); }
                }} />
              ) : (
                <GhostBtn label="Approve" small onClick={() => approve(r)} />
              )}
            </div>
          ))}
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
