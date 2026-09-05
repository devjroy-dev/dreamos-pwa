'use client';
// app/vendor/(shell)/google-reviews/page.tsx
// BLOCK 19 · G2 — THE GOOGLE REVIEWS ROOM (R-40.1's R2).
//
// ═══════════════════════════════════════════════════════════════════════════
// THIS ROOM HAS NO CONTROL, AND THAT IS THE DESIGN
// ═══════════════════════════════════════════════════════════════════════════
// No FAB, no button, no toggle, nothing tappable except the shell's own nav.
// Every other room in this estate gives the vendor something to do; this one
// tells her what has already happened.
//
// The reason is mechanical rather than aesthetic: an ask is not something she
// presses. It follows a published wedding page — `publishWedding` is
// `delivered_at`'s sole writer, and the nightly job reads from there. A button
// here would be a second door onto an act she does not drive, and it would have
// to be disabled most of the time, which is the lying-control class this estate
// has now filed twice (R-G11c.8's lineage, and the seal's absent line below).
//
// ── THE FRAME IT IS BUILT TO ──────────────────────────────────────────────
// `docs/mocks/google-reviews-mock.html` @ `af295a7`, frames `G1-room`,
// `G1-empty`, `G1-gbp`. Every string is transcribed in
// `lib/worklist/googleReviews.ts`; all seventeen were ratified as proposed
// (R-40.42). The `W2-room` Leads-card idiom is shared with the wedding-pages
// room — the same two lines, the same right-hand state, the same section header
// carrying a count.
//
// ── ONE READ, AND IT IS THE DOOR'S ────────────────────────────────────────
// `GET /api/v2/vendor/solutions/google-reviews` through `getJson`, addressed by
// `API.googleReviews()` and never by a hand-written path. `lib/vendor/api/`'s
// own header states that rule and the wedding-pages seat's e-8 records what
// ignoring it costs — a hand-written path that 404'd on the founder's walk.
//
// ── R-38.2 · THE FRAME RENDERS FIRST ──────────────────────────────────────
// The bands are drawn before the fetch resolves, and a failed read leaves the
// room standing with one sentence rather than an empty page. Billing paid for
// that lesson; this room inherits it.

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { WorklistShell } from '@/components/worklist/WorklistShell';
import { useVendorSession } from '@/hooks/vendor/useVendorSession';
import { getJson } from '@/lib/vendor/api/_base';
import { API } from '@/lib/solutions/routes';
import { GR, sealFacts } from '@/lib/worklist/googleReviews';
import type { GoogleReviewsRoom } from '@/lib/solutions/types';

export default function GoogleReviewsPage() {
  const router = useRouter();
  const { session, loading } = useVendorSession();
  useEffect(() => { if (!loading && !session) router.replace('/'); }, [loading, session, router]);
  if (loading || !session) return <div style={{ flex: 1 }} aria-busy="true" />;
  return <GoogleReviewsScreen />;
}

/**
 * THE DATE, THROUGH ONE HOME.
 *
 * `3 Sep 2026` — the house format, the same short-month TABLE `src/lib/format.js`
 * renders on the invoice document and in the WhatsApp message about it. NOT
 * `Intl`: `Intl('en-IN')` renders September as `Sept`, four letters alone among
 * the twelve, and the S2 veto sheet carries that as a ruled byte.
 *
 * The month list is transcribed rather than imported because that home is in the
 * other repo. It is twelve tokens and a bench cell would be worth more than this
 * sentence — named as owed rather than claimed as covered.
 */
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
function houseDate(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function GoogleReviewsScreen() {
  const [room, setRoom] = useState<GoogleReviewsRoom | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await getJson<{ ok: boolean; googleReviews: GoogleReviewsRoom }>(API.googleReviews());
      setRoom(r.googleReviews);
    } catch {
      // The room still renders. R-38.2: the chrome is a fact about the product,
      // the numbers are a fact about the fetch, and only the second one failed.
      setFailed(true);
    }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const asked = room?.asked ?? [];
  const seal  = room?.seal ?? null;

  return (
    <WorklistShell title={GR.roomTitle}>
      {room === null && !failed ? <div style={{ flex: 1 }} aria-busy="true" /> : null}

      {failed ? (
        <div className="gr-room"><p className="gr-note">{GR.unavailable}</p></div>
      ) : null}

      {room !== null ? (
        <div className="gr-room">

          {/* ── ASKED ─────────────────────────────────────────────────────
              The empty state replaces this band ENTIRELY rather than showing
              `Asked 0` above two lines of explanation. A zero with a heading is
              a room reporting on itself; the empty state is the room. */}
          {asked.length > 0 ? (
            <>
              <div className="gr-sec">{GR.sectionAsked}<span>{room.askedCount}</span></div>
              {asked.map((a, i) => (
                <div className="gr-row" key={`${a.askedAt}-${i}`}>
                  <div>
                    {/* HER NAME OR NOTHING. The door sends null where a name is
                        genuinely absent and this renders an em dash rather than
                        inventing `a couple` — an invented name on a vendor's
                        screen is a fact she cannot check. */}
                    <span className="gr-rprimary">{a.coupleName || '\u2014'}</span>
                    <span className="gr-rdetail">{a.weddingTitle || '\u2014'}</span>
                  </div>
                  <div className="gr-rstate">{GR.askedState} {houseDate(a.askedAt)}</div>
                </div>
              ))}
            </>
          ) : null}

          {asked.length === 0 ? (
            <div className="gr-empty">
              <span className="gr-eh">{GR.emptyHead}</span>
              <span className="gr-ep">{GR.emptyBody}</span>
            </div>
          ) : null}

          {/* ── REVIEWS ───────────────────────────────────────────────────
              IT READS 0 AND IT WILL KEEP READING 0 UNTIL 27 Oct 2026, and the
              sentence beneath is what stops that being read as broken. The count
              is the door's field, not a literal here — when Google becomes
              readable the number moves and this markup does not.
              Rendered only once something has been asked: a Reviews band above
              an empty Asked band would be counting replies to nothing. */}
          {asked.length > 0 ? (
            <>
              <div className="gr-sec" style={{ marginTop: 22 }}>{GR.sectionReviews}<span>{room.landedCount}</span></div>
              <p className="gr-note">{GR.reviewsWaiting}</p>
            </>
          ) : null}

          {/* ── THE SEAL ──────────────────────────────────────────────────
              Present or ABSENT, and absent is a SENTENCE. No greyed card, no
              placeholder, no `coming soon`: a dimmed seal would be a control
              lying about being available, and the veto sheet's row 11 is the
              byte that replaces it. */}
          <div className="gr-sec" style={{ marginTop: 22 }}>{GR.sectionSeal}</div>
          {seal ? (
            <>
              <div className="gr-row">
                <div>
                  <span className="gr-rprimary">{GR.sealMark}</span>
                  <span className="gr-rdetail">{sealFacts(seal.weddings, seal.deliveryDays)}</span>
                </div>
                <div className="gr-rstate live">{GR.sealState}</div>
              </div>
              <p className="gr-note">{GR.sealNote}</p>
            </>
          ) : (
            <p className="gr-note">{GR.sealAbsent}</p>
          )}

          {/* ── THE LISTING, DRAWN ABSENT ─────────────────────────────────
              NEVER A DISABLED BUTTON. There is no control here, greyed or
              otherwise, because there is nothing she can do before the date.
              The date is the DOOR's `gbpAvailableFrom` rendered through the
              house format — not typed into copy, so the sentence cannot
              disagree with the field the backend sends. */}
          <div className="gr-sec" style={{ marginTop: 22 }}>{GR.sectionListing}</div>
          <p className="gr-note">{GR.listingFrom.replace('{date}', houseDate(room.gbpAvailableFrom))}</p>
          <p className="gr-note" style={{ marginTop: 10 }}>{GR.listingWhy}</p>
          <div className="gr-sec" style={{ marginTop: 26 }}>{GR.listingThenHead}</div>
          <p className="gr-note">{GR.listingThenBody}</p>
        </div>
      ) : null}

      <style>{`
/* THE LEADS-CARD IDIOM, SHARED WITH THE WEDDING-PAGES ROOM. Every rule below is
   transcribed from that room's own block, property for property — the two Block
   19 rooms are the same room with different rows, and a second set of metrics is
   how they start to drift. Only .gr-note is new: the idiom had no NON-CARD
   sentence inside a room (.wp-ep is the empty state's), and this room needs four
   of them. NO MONEY RULE APPEARS ANYWHERE IN THIS FILE — there is no figure on
   this room, so there is no wl-rfig to inherit.
   ⚠ NO BACKTICKS IN THIS BLOCK. It is a template literal, and a backtick in a
   CSS comment closes the string — which is exactly how the first cut of this
   file failed tsc with eleven errors none of which mentioned a backtick. */
.gr-room{padding-top:20px;padding-bottom:28px}
.gr-sec{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);margin:0 0 8px;display:flex;justify-content:space-between}
.gr-sec span{font-variant-numeric:lining-nums tabular-nums}
.gr-row{display:grid;grid-template-columns:1fr auto;align-items:start;column-gap:12px;width:100%;text-align:left;
        background:var(--atelier-card-bg);border:.5px solid var(--atelier-card-border);border-radius:3px;
        padding:13px 14px;margin-bottom:var(--wl-step)}
.gr-rprimary{font:var(--wl-t3);color:var(--atelier-ink);display:block}
.gr-rdetail{font:var(--wl-t5);color:var(--atelier-ink-mute);display:block;margin-top:3px;font-variant-numeric:lining-nums tabular-nums}
.gr-rstate{font:var(--wl-t5);letter-spacing:.08em;text-transform:uppercase;color:var(--atelier-ink-mute);white-space:nowrap;padding-top:2px}
.gr-rstate.live{color:var(--atelier-accent-text)}
.gr-note{font:var(--wl-t5);color:var(--atelier-ink-fade);line-height:1.5;text-transform:none;letter-spacing:0;margin:2px 0 0;max-width:40ch}
.gr-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:56px 0 30px}
.gr-eh{font:var(--wl-t2);color:var(--atelier-ink)}
.gr-ep{font:var(--wl-t3);color:var(--atelier-ink-mute);max-width:250px}
      `}</style>
    </WorklistShell>
  );
}
