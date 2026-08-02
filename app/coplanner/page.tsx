'use client';
import { useEffect, useState } from 'react';
import {
  API, CREAM, GOLD, MUTED, HAIRLINE, FROST_PANEL,
  FONT_DISPLAY, FONT_BODY, FONT_EYEBROW,
  useCircleSession, brideId, brideName, memberName, circleAuthHeaders, circleRefused } from './CircleSessionContext';
import { waNumberFor } from '../../lib/waNumbers';

interface FeedEvent {
  id: string;
  event_type: string;
  payload?: { member_name?: string; subject?: string; vendor_name?: string } | null;
  created_at: string;
}

interface CoupleProfile {
  wedding_date?: string | null;
  bride_name?: string | null;
  groom_name?: string | null;
}

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  if (Number.isNaN(target.getTime())) return null;
  target.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.max(0, Math.round((target.getTime() - today.getTime()) / 86_400_000));
}

function timeAgo(d: string): string {
  const t = new Date(d).getTime();
  if (Number.isNaN(t)) return '';
  const diff = Math.floor((Date.now() - t) / 1000);
  if (diff < 60)     return 'Just now';
  if (diff < 3600)   return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400)  return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── F-07.115 · THE TIP'S NUMBER IS DERIVED, NEVER TYPED ─────────────────────
//
// The co-planner's Dream AI tab and page are RETIRED in this delivery. Circle
// members reach Mira on WhatsApp — they always could, and the founder ruled that
// is the intended shape. This tip is the whole of what replaces the surface, so
// the one thing it must never do is print a number that does not answer.
//
// THE DERIVATION, three homes that agree, all checked by command before a byte
// was written here:
//   1. db/migrations/0099_circle_invite_link_fix.sql:108 — the invite link the
//      member herself receives and taps to claim her seat:
//        wa_me_link := 'https://wa.me/917011788380?text=' || v_token
//      This is the strongest witness because it IS her own path in. Applied
//      2026-07-23, verified from pg_get_functiondef.
//   2. dream-os src/lib/waNumbers.js — BRIDE_WA_NUMBER, the canonical home.
//   3. lib/waNumbers.ts — this repo's declared drift TWIN of that home.
//
// AND THE RUNTIME PATH, so the tip is a claim about behaviour and not about a
// constant: her text lands on the BRIDE lane's Meta number
// (brideIndex.js /webhook/meta on BRIDE_PHONE_NUMBER_ID) → processBrideInbound
// → the phone match at brideInbound.js:166-170 → handleCircleMemberMessage →
// runCircleAgenticTurn at brideIndex.js:677. That last call is direct: the
// WhatsApp lane never touched the /dreamai HTTP doors this arc retires, which is
// why deleting them cannot break her.
//
// SO WE IMPORT `waNumberFor('bride')` RATHER THAN WRITE THE DIGITS. It reads
// NEXT_PUBLIC_TDW_WA_NUMBER_BRIDE first and falls back to the ruled constant, and
// the proof asserts that the DIGITS THIS SCREEN RENDERS equal what that function
// returns — so a config change reddens a cell instead of shipping a wrong number
// to a member. The staleness risk is the drift pair's own and is already declared
// in all three homes: change one, change the others; nothing will catch you.
//
// ── F-07.123 · WHAT THIS TIP MAY PROMISE, DERIVED FROM THE HANDLER ──────────
//
// THE FIRST CUT OF THIS TIP SAID: "she knows the wedding and can answer anything
// about it." It was wrong, it shipped, and the founder's own walk caught it the
// same hour — Mira answered his test member honestly: 「 I don't have access to
// the wedding date — that's between you 」. A tip that is the ONLY thing replacing
// a deleted surface sets the member's whole expectation of Mira, and the first
// thing she did with it produced a refusal.
//
// WHAT THE CIRCLE LANE ACTUALLY DOES, derived by command from the handler's own
// contract at `src/brideIndex.js:303-320`:
//   · media, or a Pinterest/Instagram link → `saveToMuse` with
//     `saved_by_role='circle_member'` — it lands on THE BRIDE'S BOARD
//   · text-only → a `circle_activity` comment on the bride's feed
//   · cap: five image/link saves per IST day
//   · `circleEngine`'s header: NO tools, no agentic capability beyond auto-save;
//     the model turn is a warm acknowledgment and nothing more
// Mira on this lane is a CONDUIT TO THE BRIDE'S BOARD, not a wedding-facts
// oracle. She holds no wedding data here by construction, so her refusal was the
// honest behaviour working and the copy was the defect.
//
// THE BYTES BELOW ARE THE CURE AND THEY ARE THE FOUNDER'S, vetoed 「 approved
// option B 」 with his own amendment 「 dont write the number 」. They promise the
// save and nothing else. ANY FUTURE EDIT TO THIS COPY RE-DERIVES THE HANDLER
// FIRST: this paragraph exists because a capability claim was written from the
// shape of the feature instead of from the code that implements it.
//
// ADJACENT, NAMED, NOT TAKEN: Mira never TELLS a member she can take ideas. That
// lives in `circleSystemPrompt.js`, a W-1 surface this delivery does not open.
// Until it is chartered, this screen is the only place she is told.

// F-07.122 — THE GAP, NAMED WHERE IT LIVES. Recognition keys on
// `circle_members.invitee_phone` (brideInbound.js:167) and that column is
// NULLABLE at the witness (docs/db/PUBLIC_SCHEMA.md:78). A member whose row
// carries no phone, or a phone not in E.164, will text this number and NOT be
// recognised. The tip ships UNCONDITIONAL by ruling because the fixture shows
// every active member carries one; F-07.122 is filed for the day one does not.
// If a gate is ever needed it is a DERIVED BOOLEAN on the session payload, never
// the phone value — CE-125's minimisation removed phone from that payload with
// zero readers, and re-adding it to power a convenience would reverse a privacy
// cure.

// ── THE NUMBER IS NO LONGER RENDERED, AND THAT MOVES THE RISK ───────────────
// Founder-ruled: the copy does not print the digits. `displayWaNumber`, which
// formatted them for the eye, is DELETED rather than left unused — a dead
// formatter is one screen change from being called again by somebody who assumes
// it was kept for a reason.
//
// THE CONSEQUENCE, NAMED. While the number was on screen a wrong one was
// VISIBLE: the founder's own thumb was the last guard. Now the number exists
// ONLY inside the `wa.me` href, where nothing human can see it — a member would
// tap, land in a chat with a stranger or a dead line, and never know why. So the
// cell that used to check the rendered digits (§14.10) is re-aimed at the HREF,
// and it is now the ONLY guard between a config change and a member texting the
// wrong number. That is a stricter obligation than before, not a looser one.

function eventLine(e: FeedEvent): string {
  const who   = e.payload?.member_name || 'Someone';
  const verb  = e.event_type.replace(/_/g, ' ');
  const what  = e.payload?.subject || e.payload?.vendor_name || '';
  return what ? `${who} ${verb} ${what}` : `${who} ${verb}`;
}

export default function CoplannerHome() {
  const session  = useCircleSession();
  const bride_id = brideId(session);
  const name     = memberName(session);

  const [profile, setProfile] = useState<CoupleProfile | null>(null);
  const [feed, setFeed]       = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [pr, fr] = await Promise.all([
          fetch(`${API}/api/v2/couple/profile/${bride_id}`).then(r => r.json()).catch(() => null),
          // FORK B — one home. `circleRefused` returns true on a 401 (and has
          // already cleared the credential and fired the event); this screen
          // then falls through to its own empty state rather than rendering a
          // refusal as "no activity yet".
          fetch(`${API}/api/v2/frost/circle/feed/${bride_id}?limit=10`, { headers: circleAuthHeaders() })
            .then(r => (circleRefused(r) ? null : r.json())).catch(() => null),
        ]);
        if (cancelled) return;
        if (pr?.success && pr.data) setProfile(pr.data as CoupleProfile);
        if (fr?.success) setFeed((fr.data || []) as FeedEvent[]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [bride_id]);

  const days = daysUntil(profile?.wedding_date);

  return (
    <>
      <p style={{
        fontFamily: FONT_EYEBROW, fontWeight: 200, fontSize: 9,
        letterSpacing: '0.32em', textTransform: 'uppercase',
        color: GOLD, margin: '0 0 12px',
      }}>WELCOME{name ? `, ${name.toUpperCase()}` : ''}</p>

      <h1 style={{
        fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
        fontSize: 36, lineHeight: 1.15, color: CREAM,
        margin: '0 0 6px',
      }}>{brideName(session)}&rsquo;s wedding</h1>

      <p style={{
        fontFamily: FONT_BODY, fontWeight: 300, fontSize: 14,
        color: MUTED, margin: '0 0 32px',
      }}>
        {loading
          ? 'Loading…'
          : days != null
            ? `${days} day${days === 1 ? '' : 's'} to go`
            : 'Date to be announced'}
      </p>

      {/* ── F-07.115 · THE MIRA TIP ─────────────────────────────────────────
          FOUNDER-VETOED BYTES, frozen 「 all, mira 」 + 「 introduce Mira as
          (bride's name) PA 」. Four strings; the number inside the third is
          derived, see displayWaNumber above.

          PLACEMENT — ABOVE the activity panel, deliberately. Activity renders up
          to ten rows, so a tip beneath it sits below the fold on any busy
          wedding, and this tip is the only thing standing where a tab used to
          be. It is also not a feed item: "Mira is X's PA" is a standing fact
          about the wedding, and it belongs with the countdown rather than in the
          stream. ONE HOME — the settings screen is the obvious second site and
          is deliberately NOT taken; two homes for one sentence is the disease
          this estate keeps curing.

          PERSISTENT, not dismissible: a member who dismissed it would have no
          path back to the only address Mira answers on.

          CONTROL INVENTORY: this anchor is the FIRST interactive control this
          screen has ever carried. Everything above and below it is still
          read-only. */}
      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <p style={{
          fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: GOLD, margin: '0 0 10px',
        }}>MIRA</p>

        <p style={{
          fontFamily: FONT_DISPLAY, fontStyle: 'italic', fontWeight: 300,
          fontSize: 22, color: CREAM, margin: '0 0 8px',
        }}>Mira is {brideName(session)}&rsquo;s PA.</p>

        <p style={{
          fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
          color: MUTED, margin: '0 0 16px', lineHeight: 1.7,
        }}>
          Share ideas with {brideName(session)} through her. Message her on WhatsApp
          and it lands on {brideName(session)}&rsquo;s board.
        </p>

        <a
          href={`https://wa.me/${waNumberFor('bride')}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: 44,
            background: 'transparent',
            border: `0.5px solid ${HAIRLINE}`,
            borderRadius: 100,
            textDecoration: 'none',
            fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 10,
            letterSpacing: '0.24em', textTransform: 'uppercase',
            color: CREAM,
          }}>Open WhatsApp</a>
      </section>

      <section style={{ ...FROST_PANEL, padding: 20, marginBottom: 20 }}>
        <p style={{
          fontFamily: FONT_EYEBROW, fontWeight: 300, fontSize: 9,
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: MUTED, margin: '0 0 14px',
        }}>ACTIVITY</p>

        {loading && (
          <p style={{ fontFamily: FONT_BODY, fontSize: 13, color: MUTED, margin: 0 }}>Loading…</p>
        )}

        {!loading && feed.length === 0 && (
          <p style={{
            fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
            color: MUTED, margin: 0, lineHeight: 1.6,
          }}>
            Quiet for now. When {brideName(session)} or someone in the Circle saves
            a vendor or posts a thought, it&rsquo;ll show up here.
          </p>
        )}

        {!loading && feed.length > 0 && (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {feed.map(e => (
              <li key={e.id} style={{
                display: 'flex', gap: 12, alignItems: 'flex-start',
                padding: '10px 0',
                borderBottom: `0.5px solid ${HAIRLINE}`,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: GOLD, flexShrink: 0, marginTop: 7,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 13,
                    color: CREAM, margin: 0, lineHeight: 1.5,
                    overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{eventLine(e)}</p>
                  <p style={{
                    fontFamily: FONT_BODY, fontWeight: 300, fontSize: 11,
                    color: MUTED, margin: '2px 0 0',
                  }}>{timeAgo(e.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
