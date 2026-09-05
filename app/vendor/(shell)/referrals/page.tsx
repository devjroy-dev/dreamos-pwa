'use client';
// app/vendor/(shell)/referrals/page.tsx
// BLOCK 19 · G5.1 — REFERRALS & PARTNERS (R-40.1's R7).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS ROOM HAS NO CONTROL EITHER, AND FOR A DIFFERENT REASON THAN G2's
// ═══════════════════════════════════════════════════════════════════════════
// The Google reviews room has none because the vendor does not drive the act.
// This room has none because the act belongs to A LEAD: forwarding starts on a
// lead record, where the enquiry she wants to hand over actually is. A control
// here would have to ask "which enquiry?" — a second door onto an act that
// already has one, and a picker of leads bolted to a room about peers.
//
// So this room only reports. That is also why its empty state carries no button:
// the way in is the lead record's own `Forward to a peer`, and a call to action
// pointing at a room the vendor is already standing in would be noise.
//
// ── THE FRAME IT IS BUILT TO ──────────────────────────────────────────────
// `docs/mocks/referrals-mock.html` @ `30828d7`, frames `R4-room` and
// `R4-empty`. Every string is transcribed in `lib/worklist/referrals.ts`;
// A1–F ratified as proposed (R-40.42), B8 ruled at relay 3.
//
// ── ONE READ, AND IT IS THE DOOR'S ────────────────────────────────────────
// `GET /api/v2/vendor/referrals` through `getJson`, addressed by
// `API.referrals()` and never by a hand-written path — the wedding-pages seat's
// e-8 records what a hand-written path costs (a 404 on the founder's walk).
//
// ── R-38.2 · THE FRAME RENDERS FIRST ──────────────────────────────────────
// A failed read leaves the room standing with one sentence rather than an empty
// page. Billing paid for that lesson; G2 inherited it; so does this.
//
// ⚠ NO MONEY ON THIS SURFACE, AND NO RANKING. Master §7 and R-G51.6. There is no
// figure rule in the stylesheet below and no ordering by volume — the peers come
// back ordered by recency from the door and are rendered in that order. See
// `peerFigure`'s own note for why the reciprocal peer is not coloured.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { ROOM_ROWS } from '@/lib/solutions/copy';
import { RF, peerFigure } from '@/lib/worklist/referrals';
import type { ReferralsRoom } from '@/lib/solutions/types';

export default function ReferralsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <ReferralsScreen />;
}

/**
 * THE ROOM'S TITLE READS THE HUB'S OWN ROW.
 *
 * `Referrals & partners` is already declared once, in `ROOM_ROWS` — the row that
 * points at this room. Re-declaring it in `lib/worklist/referrals.ts` would be a
 * second home for one string, and the two would drift the first time the founder
 * renamed the row and nobody thought to look in here. So the title is READ from
 * the hub, and if the row is ever renamed this room follows without an edit.
 */
const ROOM_TITLE = ROOM_ROWS.find((r) => r.key === 'referrals')?.label ?? 'Referrals & partners';

function ReferralsScreen() {
  const [room, setRoom]     = useState<ReferralsRoom | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await getJson<ReferralsRoom>(API.referrals());
      setRoom(data);
    } catch {
      setFailed(true);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const peers = room?.peers ?? [];
  const hasAny = (room?.sent_count ?? 0) > 0 || (room?.received_count ?? 0) > 0;

  return (
    <WorklistShell title={ROOM_TITLE}>
      {room === null && !failed ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {failed ? (
        <div className="rf-room"><p className="rf-note">{RF.unavailable}</p></div>
      ) : null}

      {room !== null ? (
        <div className="rf-room">

          {/* ── THE BALANCE ───────────────────────────────────────────────
              Rendered only when something has happened. A `Sent 0 · Received 0`
              header above an empty state is a room reporting on itself; the
              empty state IS the room, and G2's Asked band takes the same
              position for the same reason. */}
          {hasAny ? (
            <>
              <div className="rf-bal">
                <div className="rf-balfig">
                  <span className="rf-ballabel">{RF.balanceSent}</span>
                  <span className="rf-balval">{room.sent_count}</span>
                </div>
                <div className="rf-balfig">
                  <span className="rf-ballabel">{RF.balanceReceived}</span>
                  <span className="rf-balval">{room.received_count}</span>
                </div>
              </div>

              <div className="rf-sec">{RF.sectionPeers}<span>{peers.length}</span></div>
              {peers.map((p) => (
                <div className="rf-row" key={p.vendor_id}>
                  <div>
                    {/* HER NAME OR NOTHING. The door sends null where a peer's
                        business name is genuinely absent, and this renders an em
                        dash rather than inventing `a peer` — an invented name on
                        a vendor's screen is a fact she cannot check. G2's own
                        couple-name row is the precedent. */}
                    <span className="rf-rprimary">{p.name || '\u2014'}</span>
                    <span className="rf-rdetail">{p.category || '\u2014'}</span>
                  </div>
                  {/* ONE INK FOR EVERY PEER. See `peerFigure`. */}
                  <div className="rf-rstate">{peerFigure(p.sent, p.received)}</div>
                </div>
              ))}
            </>
          ) : (
            <div className="rf-empty">
              <span className="rf-eh">{RF.emptyHead}</span>
              <span className="rf-ep">{RF.emptyBody}</span>
            </div>
          )}
        </div>
      ) : null}

      <style>{`
/* THE LEADS-CARD IDIOM, SHARED WITH THE WEDDING-PAGES AND GOOGLE REVIEWS ROOMS.
   Every rule below is transcribed from those rooms' own blocks, property for
   property — the Block 19 rooms are the same room with different rows, and a
   second set of metrics is how they start to drift.

   NEW HERE: .rf-bal and its three children. The idiom had no HEAD FIGURE — G2's
   counts ride inside a section header, and this room's two totals are the point
   of opening it, so they sit above the rule at t2. They are counts, not takings:
   the Books register is the only surface in this estate that gets to look like
   money, and there is deliberately NO .rf-rfig rule in this file to inherit.

   ⚠ NO BACKTICKS IN THIS BLOCK. It is a template literal, and a backtick in a
   CSS comment closes the string — G2's first cut failed tsc with eleven errors
   none of which mentioned a backtick. */
.rf-room{padding-top:20px;padding-bottom:28px}
.rf-bal{display:flex;gap:28px;align-items:baseline;padding-bottom:16px;border-bottom:.5px solid var(--role-metal);margin-bottom:18px}
.rf-balfig{display:flex;flex-direction:column;gap:4px}
.rf-ballabel{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute)}
.rf-balval{font:var(--wl-t2);color:var(--atelier-ink);font-variant-numeric:lining-nums tabular-nums}
.rf-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.rf-sec span{font-variant-numeric:lining-nums tabular-nums}
.rf-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
        padding:13px 14px;margin-bottom:var(--wl-step)}
.rf-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.rf-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px;text-transform:uppercase;letter-spacing:.08em}
.rf-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:2px;font-variant-numeric:lining-nums tabular-nums}
.rf-note{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-transform:none;letter-spacing:0;margin:2px 0 0;max-width:40ch}
.rf-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:56px 0 30px}
.rf-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.rf-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
      `}</style>
    </WorklistShell>
  );
}
